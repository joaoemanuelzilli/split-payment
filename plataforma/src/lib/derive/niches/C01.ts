// Fórmulas próprias dos nichos da categoria C01 (campo `derivacao` da base).
// Cada função roda depois das atribuições diretas e antes da normalização. Ver src/lib/derive/core.ts.
import type { Ctx, Deriver } from '../core';

const brl = (x: number) => 'R$ ' + Math.round(x).toLocaleString('pt-BR');

/** Divide uma compra total entre fornecedor regular e fornecedor do Simples: total × (1 − s) e total × s. */
function dividirCompra(c: Ctx, total: number, pctSimples: number, regular: string, simples: string) {
  c.c(regular, 'pct_receita', total * (1 - pctSimples / 100));
  c.c(simples, 'pct_receita', total * (pctSimples / 100));
}

export const derivers: Record<string, Deriver> = {
  // Atacado e distribuição de alimentos e bebidas
  'C01-01': c => {
    const cesta = c.num('pct_cesta'), red = c.num('pct_reduzida'), simp = c.num('pct_clientes_simples') / 100;
    const cmv = c.num('pct_cmv');
    const cheia = 100 - cesta - red; // negativo é zerado pela normalização genérica
    if (cesta + red > 100) c.msg('A soma de itens da cesta e itens com redução passa de 100%. Reduza um dos dois campos.', 'alerta', 'pct_cesta');
    c.r('cesta', 'participacao_pct', cesta);
    c.r('reduzida_regular', 'participacao_pct', red * (1 - simp));
    c.r('reduzida_simples', 'participacao_pct', red * simp);
    c.r('cheia_regular', 'participacao_pct', cheia * (1 - simp));
    c.r('cheia_simples', 'participacao_pct', cheia * simp);
    c.r('cesta', 'parcela_sujeita_split_pct', 100 - c.num('pct_clientes_simples'));
    c.c('compras_reduzida', 'pct_receita', (cmv * red) / 100);
    c.c('compras_cheia', 'pct_receita', (cmv * Math.max(cheia, 0)) / 100);
  },

  // Atacado de materiais de construção
  'C01-02': c => {
    dividirCompra(c, c.num('pct_cmv'), c.num('pct_fornecedor_simples'), 'mercadorias_regular', 'mercadorias_simples');
  },

  // Atacado de embalagens (todos os campos são de atribuição direta)
  'C01-03': () => {},

  // Distribuidor de material elétrico e hidráulico (todos os campos são de atribuição direta)
  'C01-04': () => {},

  // Distribuidor de informática e eletrônicos
  'C01-05': c => {
    const cmv = c.num('pct_cmv'), imp = c.num('pct_importado') / 100;
    c.c('compras_nacionais', 'pct_receita', cmv * (1 - imp));
    c.c('importacao', 'pct_receita', cmv * imp);
  },

  // Metalurgia e usinagem sob encomenda
  'C01-06': c => {
    dividirCompra(c, c.num('pct_terceirizados'), c.num('pct_terceirizados_simples'), 'terceirizados_regular', 'terceirizados_simples');
    if (c.num('pct_adiantamento') > 0) {
      c.msg('Sinal e ferramental são tratados como recebimento à vista. O imposto do sinal já é devido no mês do pagamento (art. 10, §4º), com ou sem split.', 'info', 'pct_adiantamento');
    }
  },

  // Indústria de plásticos e embalagens (todos os campos são de atribuição direta)
  'C01-07': () => {},

  // Confecção e indústria têxtil
  'C01-08': c => {
    dividirCompra(c, c.num('pct_faccao'), c.num('pct_faccao_simples'), 'faccao_regular', 'faccao_simples');
  },

  // Química, tintas e limpeza industrial (todos os campos são de atribuição direta)
  'C01-09': () => {},

  // Cerâmica, vidro e materiais de construção
  'C01-10': c => {
    // false: regime de combustíveis (crédito sem esperar o pagamento); true: regime comum (crédito só após o pagamento)
    c.c('gas', 'condicionado', c.bool('gas_condicionado'));
  },

  // Máquinas e equipamentos sob encomenda
  'C01-11': c => {
    c.msg('O cálculo supõe compras no mesmo mês da venda. Em contratos longos as compras vêm antes da entrega, e o crédito pode nascer meses antes do débito final.', 'alerta');
  },

  // Fornecedor de autopeças para montadoras (todos os campos são de atribuição direta)
  'C01-12': () => {},

  // Indústria de alimentos não essenciais (biscoitos, doces, snacks)
  'C01-13': c => {
    const pct = c.num('pct_insumos_cesta');
    // Insumos da cesta não geram linha de compra: chegam com alíquota zero e não dão crédito.
    c.msg(`${brl((c.num('faturamento_mensal') * pct) / 100)} por mês de compras sem crédito de IBS/CBS (insumos da cesta, ${String(pct).replace('.', ',')}% do faturamento).`, 'info', 'pct_insumos_cesta');
  },

  // Distribuidor de autopeças (todos os campos são de atribuição direta)
  'C01-14': () => {},

  // Indústria de móveis (todos os campos são de atribuição direta)
  'C01-15': () => {},

  // Gráfica e embalagem impressa
  'C01-16': c => {
    dividirCompra(c, c.num('pct_acabamento'), c.num('pct_acabamento_simples'), 'acabamento_regular', 'acabamento_simples');
  },

  // Indústria de calçados
  'C01-17': c => {
    dividirCompra(c, c.num('pct_atelies'), c.num('pct_atelies_simples'), 'atelies_regular', 'atelies_simples');
  },

  // Indústria de cosméticos e perfumaria (todos os campos são de atribuição direta)
  'C01-18': () => {},
};

/** Campos que, por desenho, não mudam nenhum alvo quando variam sozinhos a partir do padrão (motivo). */
export const excecoes: Record<string, Record<string, string>> = {};
