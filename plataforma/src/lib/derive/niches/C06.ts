// Fórmulas próprias dos nichos da categoria C06 (campo `derivacao` da base).
// Cada função roda depois das atribuições diretas e antes da normalização. Ver src/lib/derive/core.ts.
import type { Deriver } from '../core';

// C06-01 Refeições coletivas e alimentação para empresas
const c0601: Deriver = c => {
  const pub = c.num('pct_publico'), sem = c.num('pct_sem_credito');
  c.r('publico', 'participacao_pct', pub);
  c.r('sem_credito', 'participacao_pct', sem);
  c.r('contratos_privados', 'participacao_pct', 100 - pub - sem);
  const g = c.num('pct_generos'), zero = c.num('pct_generos_zero') / 100, simp = c.num('pct_generos_simples') / 100;
  const tributados = g * (1 - zero - simp);
  c.c('alim_reduzidos', 'pct_receita', tributados * 0.6);
  c.c('alim_cheios', 'pct_receita', tributados * 0.4);
  c.c('forn_simples', 'pct_receita', g * simp);
  c.msg('Contrato público: o imposto nasce no pagamento e vai direto para o ente público, sem efeito de split.', 'info');
  if (c.num('aliquota_contratos') === 60) {
    c.msg('Com redução de 40% o cliente perde o crédito (art. 276 da LC 214). O contrato precisa ser repactuado.', 'alerta', 'aliquota_contratos');
  }
};

// C06-02 Restaurante e self-service
const c0602: Deriver = c => {
  const aliq = 60 + 0.4 * c.num('pct_bebidas_vendas');
  for (const l of c.linhasR()) c.r(l.id, 'aliquota_pct_cheia', aliq);
  const cartao = c.num('pct_cartao'), voucher = c.num('pct_voucher'), delivery = c.num('pct_delivery'), empresas = c.num('pct_empresas');
  c.r('cartao', 'participacao_pct', cartao);
  c.r('voucher', 'participacao_pct', voucher);
  c.r('delivery', 'participacao_pct', delivery);
  c.r('empresas', 'participacao_pct', empresas);
  // Se a soma passar de 100, o resto fica negativo e a camada genérica zera o Pix e normaliza as demais.
  c.r('pix', 'participacao_pct', 100 - cartao - voucher - delivery - empresas);
  const al = c.num('pct_alimentos'), zero = c.num('pct_alimentos_zero') / 100, simp = c.num('pct_alimentos_simples') / 100;
  c.c('alim_reduzidos', 'pct_receita', al * (1 - zero - simp));
  c.c('forn_simples', 'pct_receita', al * simp);
  c.msg('Gorjeta e taxa da plataforma só saem da base se estiverem separadas na nota fiscal.', 'info');
  c.msg('Quando cartão, voucher e consumidor final entrarem no split (ainda sem data), a perda do imposto que fica no caixa passa a valer para quase toda a receita.', 'info');
};

// C06-03 Agência de turismo e operadora
const c0603: Deriver = c => {
  // A receita do motor é a base líquida: vendas brutas × margem da agência.
  c.receita((c.num('vendas_brutas') * c.num('pct_margem')) / 100);
  const corp = c.num('pct_corporativo'), corpCartao = c.num('pct_corp_cartao') / 100;
  c.r('corp_faturado', 'participacao_pct', corp * (1 - corpCartao));
  c.r('corp_cartao', 'participacao_pct', corp * corpCartao);
  const lazer = c.num('pct_lazer'), lazerCartao = c.num('pct_lazer_cartao') / 100;
  c.r('lazer_cartao', 'participacao_pct', lazer * lazerCartao);
  c.r('lazer_pix', 'participacao_pct', lazer * (1 - lazerCartao));
  const pub = c.num('pct_publico');
  c.r('publico', 'participacao_pct', pub);
  // Se corporativo, lazer e público passarem de 100, o resto fica negativo: a camada genérica zera o Simples e normaliza.
  c.r('simples', 'participacao_pct', 100 - corp - lazer - pub);
  c.msg('Sem documento que comprove o repasse ao fornecedor, a base volta a ser o valor total da venda e o imposto pode ser de 7 a 8 vezes maior.', 'alerta');
};

// C06-04 Bar e casa noturna
const c0604: Deriver = c => {
  const aliq = 60 + 0.4 * c.num('pct_bebida_alcoolica');
  for (const l of ['cartao', 'pix', 'dinheiro']) c.r(l, 'aliquota_pct_cheia', aliq);
  const cartao = c.num('pct_cartao'), din = c.num('pct_dinheiro'), ing = c.num('pct_ingressos'), ev = c.num('pct_eventos');
  c.r('cartao', 'participacao_pct', cartao);
  c.r('dinheiro', 'participacao_pct', din);
  c.r('ingressos', 'participacao_pct', ing);
  c.r('eventos_empresas', 'participacao_pct', ev);
  c.r('pix', 'participacao_pct', 100 - cartao - din - ing - ev);
  c.msg('O Imposto Seletivo da bebida não entra no cálculo. Ele vem embutido no custo e não gera crédito.', 'info');
};

// C06-05 Lanchonete, cafeteria e fast food
const c0605: Deriver = c => {
  const aliq = 60 + 0.4 * c.num('pct_industrializados');
  for (const l of c.linhasR()) c.r(l.id, 'aliquota_pct_cheia', aliq);
  const cartao = c.num('pct_cartao'), voucher = c.num('pct_voucher'), delivery = c.num('pct_delivery');
  c.r('cartao', 'participacao_pct', cartao);
  c.r('voucher', 'participacao_pct', voucher);
  c.r('delivery', 'participacao_pct', delivery);
  c.r('pix', 'participacao_pct', 100 - cartao - voucher - delivery);
  const ins = c.num('pct_insumos');
  c.c('alim_reduzidos', 'pct_receita', (ins * 6) / 13);
  c.c('alim_cheios', 'pct_receita', (ins * 7) / 13);
  c.msg('O efeito atual é só o atraso do crédito das compras. Quando cartão e voucher entrarem no split (ainda sem data), o imposto que hoje fica no caixa até o vencimento deixa de ficar.', 'info');
};

// C06-06 Buffet e eventos sociais
const c0606: Deriver = c => {
  const corp = c.num('pct_corporativo'), sinal = c.num('pct_sinal_corp') / 100, pfCartao = c.num('pct_pf_cartao');
  c.r('corp_sinal', 'participacao_pct', corp * sinal);
  c.r('corp_saldo', 'participacao_pct', corp * (1 - sinal));
  c.r('pf_cartao', 'participacao_pct', pfCartao);
  c.r('pf_pix', 'participacao_pct', 100 - corp - pfCartao);
  // aliquota pf = base + (100 − base) × pct_fora_regime; com base 60: 60 + 0,4 × pct_fora_regime.
  const base = c.num('aliquota_pf_comida');
  const aliq = base + ((100 - base) * c.num('pct_fora_regime')) / 100;
  c.r('pf_pix', 'aliquota_pct_cheia', aliq);
  c.r('pf_cartao', 'aliquota_pct_cheia', aliq);
  c.msg('O sinal corporativo é tratado como recebimento à vista. O imposto sai antes do evento, e o efeito real pode ser maior se o evento for meses depois.', 'info');
  c.msg('Nas festas de pessoa física, o imposto antecipado sobre o sinal sai do caixa por guia, sem relação com o split. A calculadora não mede essa mudança de regime.', 'info');
  const meses = c.num('meses_antecedencia');
  if (meses > 1) {
    c.msg(`Com ${String(meses).replace('.', ',')} meses de antecedência entre o sinal e o evento, o IBS/CBS pode ser antecipado no recebimento do sinal (art. 10, §4º da LC 214).`, 'alerta', 'meses_antecedencia');
  }
};

// C06-07 Hotel e pousada
const c0607: Deriver = c => {
  const ota = c.num('pct_ota'), corp = c.num('pct_corporativo'), ag = c.num('pct_agencias'), ev = c.num('pct_eventos'), pub = c.num('pct_publico');
  c.r('ota', 'participacao_pct', ota);
  c.r('corporativo', 'participacao_pct', corp);
  c.r('agencias', 'participacao_pct', ag);
  c.r('eventos', 'participacao_pct', ev);
  c.r('publico', 'participacao_pct', pub);
  c.r('balcao', 'participacao_pct', 100 - ota - corp - ag - ev - pub);
  const e = c.num('pct_energia');
  c.c('energia', 'pct_receita', (e * 5) / 7);
  c.c('agua', 'pct_receita', (e * 2) / 7);
  c.msg('Em 2027 a adesão voluntária nas faturas de hospedagem tende a ser menor que a média, porque o hóspede não toma crédito.', 'info');
  c.msg('Use a receita média de 12 meses. Na alta temporada o efeito do mês é maior.', 'info');
};

// C06-08 Parque de diversão e entretenimento
const c0608: Deriver = c => {
  const alim = c.num('pct_alimentos_lojas'), pix = c.num('pct_ingresso_pix'), grupos = c.num('pct_grupos'), ag = c.num('pct_agencias'), pub = c.num('pct_publico');
  c.r('alimentos_lojas', 'participacao_pct', alim);
  c.r('ingresso_pix', 'participacao_pct', pix);
  c.r('grupos_empresas', 'participacao_pct', grupos);
  c.r('agencias', 'participacao_pct', ag);
  c.r('publico', 'participacao_pct', pub);
  c.r('ingresso_cartao', 'participacao_pct', 100 - alim - pix - grupos - ag - pub);
  c.r('alimentos_lojas', 'aliquota_pct_cheia', 60 + 0.4 * c.num('pct_cheia_interno'));
  c.msg('No ano da compra de uma atração nova, o crédito pode passar do débito e ir para ressarcimento. Simule esse mês à parte.', 'info');
};

export const derivers: Record<string, Deriver> = {
  'C06-01': c0601, 'C06-02': c0602, 'C06-03': c0603, 'C06-04': c0604,
  'C06-05': c0605, 'C06-06': c0606, 'C06-07': c0607, 'C06-08': c0608,
};

/** Campos que, por desenho, não mudam nenhum alvo quando variam sozinhos a partir do padrão (motivo). */
export const excecoes: Record<string, Record<string, string>> = {};
