// Fórmulas próprias dos nichos da categoria C04 (campo `derivacao` da base).
// Cada função roda depois das atribuições diretas e antes da normalização. Ver src/lib/derive/core.ts.
import type { Ctx, Deriver } from '../core';

/** Curva do crédito presumido de produtor não contribuinte (% do valor pago) para o padrão de 1,1% em 2027. */
const CURVA_PRESUMIDO: Record<string, number> = { '2027': 1.1, '2028': 1.1, '2029': 1.3, '2030': 1.5, '2031': 1.7, '2032': 1.9, '2033': 3 };
const PRESUMIDO_PADRAO = 1.1;

/**
 * credito_fixo[ano] = credito_presumido_pct × (alíquota cheia do ano ÷ CBS de referência), arredondado a 0,1.
 * HIPÓTESE: a alíquota do ano depende de parâmetros globais que a camada não enxerga; a razão de cada ano para
 * 2027 vem da curva padrão da base (1,1 / 1,1 / 1,3 / 1,5 / 1,7 / 1,9 / 3,0), o que reproduz o padrão exatamente.
 */
function creditoPresumido(pct: number): Record<string, number> {
  const out: Record<string, number> = {};
  for (const [ano, v] of Object.entries(CURVA_PRESUMIDO)) out[ano] = Math.round(pct * (v / PRESUMIDO_PADRAO) * 10) / 10;
  return out;
}

/** Aplica o crédito presumido do campo `credito_presumido_pct` na linha de compra de produtor não contribuinte. */
function presumido(c: Ctx, linha: string) {
  c.c(linha, 'credito_fixo_pct_valor_por_ano', creditoPresumido(c.num('credito_presumido_pct')));
}

// C04-01 Frigorífico e abatedouro
const c0401: Deriver = c => {
  const exp = c.num('pct_exportacao'), simp = c.num('pct_simples'), couro = c.num('pct_couro_sebo'), ind = c.num('pct_industrializados');
  c.r('exportacao', 'participacao_pct', exp);
  c.r('carne_simples', 'participacao_pct', simp);
  c.r('couro_sebo', 'participacao_pct', couro);
  c.r('industrializados', 'participacao_pct', ind);
  c.r('carne_regular', 'participacao_pct', 100 - exp - simp - couro - ind - c.getR('farinhas', 'participacao_pct'));
  const gado = c.num('pct_gado'), pf = c.num('pct_gado_pf') / 100;
  c.c('gado_nao_contribuinte', 'pct_receita', gado * pf);
  c.c('gado_contribuinte', 'pct_receita', gado * (1 - pf));
  presumido(c, 'gado_nao_contribuinte');
  const o = c.num('pct_outras_compras');
  c.c('embalagens_insumos', 'pct_receita', (o * 5) / 12);
  c.c('energia', 'pct_receita', (o * 2) / 12);
  c.c('frete_servicos', 'pct_receita', (o * 5) / 12);
};

// C04-02 Laticínio
const c0402: Deriver = c => {
  const ferm = c.num('pct_fermentados'), cheia = c.num('pct_cheia'), simp = c.num('pct_simples');
  c.r('fermentados', 'participacao_pct', ferm);
  c.r('outros_cheia', 'participacao_pct', cheia);
  c.r('basicos_simples', 'participacao_pct', simp);
  c.r('basicos_regular', 'participacao_pct', 100 - simp - ferm - cheia);
  // HIPÓTESE: a base arredonda ao inteiro (62 × 0,76 = 47,12 vira 47); o resto vai para o leite de contribuinte.
  const leite = c.num('pct_leite');
  const nao = Math.round((leite * c.num('pct_leite_pequeno')) / 100);
  c.c('leite_nao_contribuinte', 'pct_receita', nao);
  c.c('leite_contribuinte', 'pct_receita', leite - nao);
  presumido(c, 'leite_nao_contribuinte');
};

// C04-03 Beneficiadora de arroz, feijão e cereais
const c0403: Deriver = c => {
  const simp = c.num('pct_simples'), sub = c.num('pct_subprodutos'), outros = c.num('pct_outros_graos');
  const farelo = (sub * 5) / 7, casca = (sub * 2) / 7;
  c.r('graos_simples', 'participacao_pct', simp);
  c.r('farelo', 'participacao_pct', farelo);
  c.r('casca', 'participacao_pct', casca);
  c.r('outros_graos', 'participacao_pct', outros);
  c.r('graos_regular', 'participacao_pct', 100 - simp - farelo - outros - casca);
  // HIPÓTESE: arredondado ao inteiro como na base (70 × 0,43 = 30,1 vira 30).
  const mp = c.num('pct_materia_prima');
  const nao = Math.round((mp * c.num('pct_pequenos')) / 100);
  c.c('grao_nao_contribuinte', 'pct_receita', nao);
  c.c('grao_contribuinte', 'pct_receita', mp - nao);
  presumido(c, 'grao_nao_contribuinte');
  c.msg('Compras concentradas na safra: o cálculo usa a média mensal. O saldo credor de março a junho pode ser o dobro da média.', 'alerta');
};

// C04-04 Moinho, farinhas e massas
const c0404: Deriver = c => {
  const simp = c.num('pct_padarias_simples'), secas = c.num('pct_massas_secas'), trib = c.num('pct_tributados'), farelo = c.num('pct_farelo');
  c.r('farinha_simples', 'participacao_pct', simp);
  c.r('massas_secas', 'participacao_pct', secas);
  c.r('massas_instantaneas', 'participacao_pct', trib / 2);
  c.r('misturas', 'participacao_pct', trib / 2);
  c.r('farelo', 'participacao_pct', farelo);
  c.r('farinha_regular', 'participacao_pct', 100 - simp - secas - trib - farelo);
  // HIPÓTESE: trigo importado arredondado ao inteiro (62 × 0,48 = 29,76 vira 30); o restante divide 22/32 e 10/32.
  const trigo = c.num('pct_trigo');
  const imp = Math.round((trigo * c.num('pct_importado')) / 100);
  const resto = trigo - imp;
  c.c('trigo_importado', 'pct_receita', imp);
  c.c('trigo_nacional', 'pct_receita', (resto * 22) / 32);
  c.c('trigo_nao_contribuinte', 'pct_receita', (resto * 10) / 32);
  presumido(c, 'trigo_nao_contribuinte');
};

// C04-05 Padaria e confeitaria
const c0405: Deriver = c => {
  const frances = c.num('pct_pao_frances'), local = c.num('pct_consumo_local'), cesta = c.num('pct_revenda_cesta');
  const trib = c.num('pct_revenda_tributada'), rest = c.num('pct_restaurantes');
  c.r('pao_frances', 'participacao_pct', frances);
  c.r('consumo_local', 'participacao_pct', local);
  c.r('revenda_zero', 'participacao_pct', cesta);
  c.r('revenda_cheia', 'participacao_pct', trib);
  c.r('pao_restaurantes', 'participacao_pct', rest);
  c.r('producao_cheia', 'participacao_pct', 100 - frances - local - cesta - trib - rest);
  c.c('mercadoria_revenda', 'pct_receita', trib * 0.75);
  const e = c.num('pct_energia_embalagem');
  c.c('energia_gas', 'pct_receita', (e * 5) / 8);
  c.c('embalagens', 'pct_receita', (e * 3) / 8);
};

// C04-06 Torrefação de café
const c0406: Deriver = c => {
  presumido(c, 'cafe_produtor');
};

// C04-07 Granja de ovos e avicultura
const c0407: Deriver = c => {
  const redes = c.num('pct_redes'), sub = c.num('pct_subprodutos');
  c.r('ovos_redes', 'participacao_pct', redes);
  c.r('descarte', 'participacao_pct', sub / 2);
  c.r('esterco', 'participacao_pct', sub / 2);
  c.r('ovos_simples', 'participacao_pct', 100 - redes - sub);
  presumido(c, 'milho_produtor');
  const e = c.num('pct_energia_servicos');
  c.c('energia', 'pct_receita', (e * 3) / 7);
  c.c('frete_servicos', 'pct_receita', (e * 4) / 7);
  if (c.str('condicao_produtor') === 'nao_contribuinte') {
    c.modo('nao_contribuinte', 'Granja não contribuinte (abaixo de R$ 3,6 milhões por ano, sem opção): não destaca IBS/CBS, não toma crédito e não sente o split. O motor não roda. A decisão a analisar é ficar fora ou optar pelo regime regular, que dá direito a crédito nas compras.');
  }
};

// C04-08 Açougue e casa de carnes
const c0408: Deriver = c => {
  const rest = c.num('pct_restaurantes'), pix = c.num('pct_pix'), lingu = c.num('pct_linguica'), rev = c.num('pct_revenda');
  c.r('carne_simples', 'participacao_pct', (rest * 2) / 3);
  c.r('carne_regular', 'participacao_pct', rest / 3);
  c.r('carne_pix', 'participacao_pct', pix);
  c.r('linguica', 'participacao_pct', lingu);
  c.r('revenda', 'participacao_pct', rev);
  c.r('carne_cartao', 'participacao_pct', 100 - rest - pix - lingu - rev);
  c.c('insumos_linguica', 'pct_receita', lingu * 0.4);
  c.c('mercadoria_revenda', 'pct_receita', rev * 0.7);
};

// C04-09 Hortifrúti e sacolão
const c0409: Deriver = c => {
  const pix = c.num('pct_pix'), a7 = c.num('pct_anexo7'), merc = c.num('pct_mercearia');
  c.r('hortifruti_pix', 'participacao_pct', pix);
  c.r('anexo7', 'participacao_pct', a7);
  c.r('mercearia', 'participacao_pct', merc);
  c.r('hortifruti_cartao', 'participacao_pct', 100 - pix - a7 - merc);
  c.c('revenda_anexo7', 'pct_receita', a7 * 0.7);
  // HIPÓTESE: 0,67 da base é 2/3 arredondado; com 2/3 o padrão (15 → 10) bate exatamente.
  c.c('revenda_cheia', 'pct_receita', (merc * 2) / 3);
  c.msg('Este nicho está fora do foco do diagnóstico de caixa. A conversa útil é sobre regime e preço.', 'info');
};

// C04-10 Distribuidora de hortifrúti (Ceasa)
const c0410: Deriver = c => {
  const redes = c.num('pct_redes'), feir = c.num('pct_feirantes');
  c.r('redes', 'participacao_pct', redes);
  c.r('feirantes', 'participacao_pct', feir);
  c.r('simples_pix', 'participacao_pct', 100 - redes - feir - c.getR('anexo7', 'participacao_pct'));
  presumido(c, 'produtor');
  const f = c.num('pct_frete_caixas');
  c.c('embalagens', 'pct_receita', f / 3);
  c.c('frete_manutencao', 'pct_receita', (f * 2) / 3);
};

// C04-11 Peixaria e indústria de pescados
const c0411: Deriver = c => {
  const mar = c.num('pct_frutos_mar'), nob = c.num('pct_nobres'), simp = c.num('pct_simples'), balcao = c.num('pct_balcao');
  c.r('frutos_mar', 'participacao_pct', mar);
  c.r('nobres', 'participacao_pct', nob);
  c.r('peixe_simples', 'participacao_pct', simp);
  c.r('balcao', 'participacao_pct', balcao);
  c.r('peixe_regular', 'participacao_pct', 100 - mar - nob - simp - balcao);
  c.c('frutos_mar_compra', 'pct_receita', mar * 0.65);
  // HIPÓTESE: 0,67 da base é 2/3 arredondado; com 2/3 o padrão (15 → 10) bate exatamente.
  c.c('nobres_compra', 'pct_receita', (nob * 2) / 3);
  presumido(c, 'pescado_produtor');
  c.msg('O resultado depende do mix por espécie: com mais salmão e camarão, o saldo credor pode virar débito antecipado. Ajuste as fatias de frutos do mar e de pescados nobres.', 'info');
};

export const derivers: Record<string, Deriver> = {
  'C04-01': c0401, 'C04-02': c0402, 'C04-03': c0403, 'C04-04': c0404, 'C04-05': c0405, 'C04-06': c0406,
  'C04-07': c0407, 'C04-08': c0408, 'C04-09': c0409, 'C04-10': c0410, 'C04-11': c0411,
};

/** Campos que, por desenho, não mudam nenhum alvo quando variam sozinhos a partir do padrão (motivo). */
export const excecoes: Record<string, Record<string, string>> = {};
