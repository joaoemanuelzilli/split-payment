// Motor v2 do diagnóstico de caixa do split payment.
// Entrada: um registro de nicho (linhas_receita, linhas_compra, prazo_pagamento_fornecedor_dias) + receita mensal + globais.
// Saída: necessidade extra de capital de giro por ano (2027 a 2033), cenários favorável e prudente, e decomposição.
// Linha de base: mesmo ano, mesma carga, sem split e com crédito pelo destaque (art. 48 da LC 214).
// Vencimento do saldo: último dia útil do mês seguinte (dia 60 contado do início do mês da operação). Meses de 30 dias.
(function (root) {
  const YEARS = [2027, 2028, 2029, 2030, 2031, 2032, 2033];
  const IBS_SHARE = { 2027: 0, 2028: 0, 2029: 0.1, 2030: 0.2, 2031: 0.3, 2032: 0.4, 2033: 1.0 };
  const DUE = 60, STEPS = 600;
  const avg = fn => { let s = 0; for (let i = 0; i < STEPS; i++) s += fn((i + 0.5) * 30 / STEPS); return s / STEPS; };

  // Alíquota cheia total (CBS + IBS) no ano, em fração. 2027-2028: CBS ref − 0,1 p.p. + IBS 0,1% = CBS ref.
  function rateFor(year, g) {
    if (year <= 2028) return g.cbs_referencia_pct / 100;
    return g.cbs_referencia_pct / 100 + (g.ibs_cheio_pct / 100) * IBS_SHARE[year];
  }
  function salesDays(prazo, antecip, e) {
    const notAnt = avg(d => Math.max(0, (DUE - d) - prazo));
    const ant = avg(d => Math.max(DUE - d, prazo) - e);
    return (1 - antecip) * notAnt + antecip * ant;
  }
  const shareBeforeDue = prazo => avg(d => (prazo < DUE - d ? 1 : 0));

  function lineRate(line, year, g) {
    if (line.aliquota_especifica_por_ano && line.aliquota_especifica_por_ano[String(year)] != null)
      return line.aliquota_especifica_por_ano[String(year)] / 100;
    return rateFor(year, g) * (line.aliquota_pct_cheia / 100);
  }
  function purchaseCreditRate(line, year, g) {
    if (line.credito_fixo_pct_valor_por_ano && line.credito_fixo_pct_valor_por_ano[String(year)] != null)
      return line.credito_fixo_pct_valor_por_ano[String(year)] / 100;
    return rateFor(year, g) * (line.credito_pct_cheia / 100);
  }

  function compute(rec, receita, year, adoption, g) {
    const pmp = rec.prazo_pagamento_fornecedor_dias;
    const ext = d => Math.min(d + pmp, DUE - 0.01);
    const consDelay = avg(d => 30 * Math.floor(ext(d) / 30));
    const rtDelay = avg(d => ext(d) - DUE);
    let D = 0, dVendas = 0, phiNum = 0;
    for (const l of rec.linhas_receita) {
      const Di = receita * (l.participacao_pct / 100) * lineRate(l, year, g);
      const s = (l.parcela_sujeita_split_pct / 100) * adoption;
      D += Di;
      dVendas += Di * s * salesDays(l.prazo_dias, l.antecipado_pct / 100, g.dias_antecipacao) / 30;
      phiNum += Di * s * shareBeforeDue(l.prazo_dias);
    }
    const phi = D > 0 ? phiNum / D : 0;
    let CrCond = 0, CrFree = 0;
    for (const c of rec.linhas_compra) {
      const v = receita * (c.pct_receita / 100) * purchaseCreditRate(c, year, g);
      if (c.condicionado === false) CrFree += v; else CrCond += v;
    }
    const Cr = CrCond + CrFree;
    const dOpen = D * (1 - phi);
    const credPrud = CrCond * consDelay / 30;
    // Favorável: só abate em tempo real o crédito que encontra retenção do split para abater (no máximo D × phi).
    const w = CrCond > 0 ? phi * Math.min(1, D / CrCond) : 0;
    const credFav = CrCond * (w * rtDelay + (1 - w) * consDelay) / 30;
    const xPrud = Cr > 0 ? Math.min(1, dOpen / Cr) : 1;
    const xFav = Cr > 0 ? Math.min(1, D / Cr) : 1;
    // Saldo credor que já existe sem split (crédito acima do débito total, comum com alíquota zero):
    // não é efeito do split. Conta só o que o split acrescenta.
    const trapBase = Math.max(0, Cr - D) * g.ressarcimento_dias_extra / 30;
    const trapPrud = Math.max(0, (1 - xPrud) * Cr * g.ressarcimento_dias_extra / 30 - trapBase);
    const trapFav = Math.max(0, (1 - xFav) * Cr * g.ressarcimento_dias_extra / 30 - trapBase);
    return { year, adoption, rate: rateFor(year, g), D, Cr, phi, dVendas, credPrud, credFav, trapPrud, trapFav, trapBase,
      // O split nunca libera caixa em relação à linha de base: o crédito abatido na retenção não sai antes do débito que abate.
      prud: dVendas + credPrud + trapPrud, fav: Math.max(0, dVendas + credFav + trapFav) };
  }

  function run(rec, receita, g) {
    const rows = YEARS.map(y => compute(rec, receita, y, (y === 2027 ? g.adesao_2027_pct : g.adesao_2028_em_diante_pct) / 100, g));
    let prev = 0; for (const r of rows) { r.novo_no_ano = r.prud - prev; prev = r.prud; }
    return rows;
  }
  // Teste de caixa para um ano: quem cobre a necessidade prudente.
  function cashTest(need, c) {
    need = Math.max(0, need);
    const free = Math.max(0, c.caixa - c.caixa_minimo);
    const fromCash = Math.min(need, free), fromCredit = Math.min(need - fromCash, c.limites);
    const gap = Math.max(0, need - fromCash - fromCredit);
    const tm = c.custo_credito_pct_am / 100, cdiM = Math.pow(1 + c.cdi_pct_aa / 100, 1 / 12) - 1;
    const costYear = (fromCredit * tm + gap * tm + fromCash * cdiM) * 12;
    const fcoYear = c.geracao_caixa_mes * 12, pctFco = fcoYear > 0 ? costYear / fcoYear : Infinity;
    const verdict = need <= free && pctFco < 0.05 ? 'verde' : gap === 0 && pctFco < 0.15 ? 'amarelo' : 'vermelho';
    return { need, free, fromCash, fromCredit, gap, costYear, pctFco, verdict };
  }
  const api = { YEARS, IBS_SHARE, rateFor, run, cashTest, salesDays };
  if (typeof module !== 'undefined') module.exports = api; else root.SplitEngineV2 = api;
})(this);
