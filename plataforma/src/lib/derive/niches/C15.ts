// Fórmulas próprias dos nichos da categoria C15 (campo `derivacao` da base).
// Cada função roda depois das atribuições diretas e antes da normalização. Ver src/lib/derive/core.ts.
// Simples puro (regime_empresa = simples) é tratado pela camada genérica (modo simples_puro).
import type { Deriver } from '../core';

const brl = (x: number) => 'R$ ' + Math.round(x).toLocaleString('pt-BR');

// C15-01 Fabricante regional de refrigerantes e bebidas açucaradas
const c1501: Deriver = c => {
  const fat = c.num('faturamento_mensal');
  const is = c.num('pct_is');
  // O IS não é débito do motor: entra só como aumento da base do IBS/CBS.
  c.receita(fat * (1 + is / 100));
  c.r('varejo_simples', 'participacao_pct', c.num('pct_simples'));
  c.r('eventos_consumidor', 'participacao_pct', 100 - c.num('pct_supermercados') - c.num('pct_atacado') - c.num('pct_simples'));
  c.msg(`Imposto Seletivo a pagar por guia: cerca de ${brl((fat * is) / 100)} por mês. Ele é pago fora do split e não entra como débito no cálculo.`, 'info', 'pct_is');
  c.msg('De 2029 a 2033 o IS das bebidas açucaradas sobe para absorver a diferença de ICMS (art. 422, §5º). O cálculo mantém o percentual de IS informado.', 'info', 'pct_is');
  const acucar = c.num('pct_acucar');
  if (acucar > 0) c.msg(`Custo mensal com açúcar sem crédito de IBS/CBS: cerca de ${brl((fat * acucar) / 100)}.`, 'info', 'pct_acucar');
};

// C15-02 Cervejaria artesanal e destilaria
const c1502: Deriver = c => {
  const fat = c.num('faturamento_mensal');
  const is = c.num('pct_is');
  c.receita(fat * (1 + is / 100));
  c.r('supermercados', 'participacao_pct', c.num('pct_supermercados'));
  c.r('consumidor', 'participacao_pct', 100 - c.num('pct_distribuidores') - c.num('pct_bares_regular') - c.num('pct_simples') - c.num('pct_supermercados'));
  c.msg(`Imposto Seletivo a pagar por guia: cerca de ${brl((fat * is) / 100)} por mês. Ele é pago fora do split e, no Simples, fora do DAS.`, 'info', 'pct_is');
  if (c.str('regime_empresa') === 'simples') {
    c.msg('No Simples puro o split não pesa no seu caixa, mas distribuidores e supermercados só aproveitam cerca de 7% da alíquota cheia de crédito. Compare o preço líquido para eles com a opção de IBS/CBS no regime regular.', 'alerta', 'regime_empresa');
  }
};

// C15-03 Distribuidor de bebidas e tabaco
const c1503: Deriver = c => {
  const simp = c.num('pct_simples');
  const din = c.num('pct_dinheiro');
  c.r('simples_boleto', 'participacao_pct', simp - din);
  c.r('dinheiro_cartao', 'participacao_pct', din);
  c.c('industria', 'pct_receita', 100 - c.num('margem_bruta'));
  c.msg('O distribuidor não recolhe IS. Ele está no custo da compra e na base do IBS/CBS, sem guia própria.', 'info');
  c.msg('Hoje, no PIS/Cofins monofásico, a revenda paga quase nada. A partir de 2027 a CBS sobre a margem passa a sair do caixa todo mês.', 'info');
  if (c.num('margem_bruta') < 12) c.msg('Com margem bruta abaixo de 12%, o crédito quase iguala o débito. O saldo credor no cenário prudente pesa mais que o débito antecipado.', 'alerta', 'margem_bruta');
};

// C15-04 Pedreira, areia e mineração de agregados
const c1504: Deriver = c => {
  c.r('balcao', 'participacao_pct', 100 - c.num('pct_construtoras') - c.num('pct_concreteiras') - c.num('pct_simples') - c.num('pct_publico'));
  const ps = c.num('pct_pecas_servicos');
  c.c('explosivos_pecas', 'pct_receita', (ps * 10) / 17);
  c.c('servicos_pj', 'pct_receita', (ps * 7) / 17);
};

export const derivers: Record<string, Deriver> = {
  'C15-01': c1501, 'C15-02': c1502, 'C15-03': c1503, 'C15-04': c1504,
};

/** Campos que, por desenho, não mudam nenhum alvo quando variam sozinhos a partir do padrão (motivo). */
export const excecoes: Record<string, Record<string, string>> = {
  'C15-02': { regime_empresa: 'simples_hibrido usa as linhas padrão, igual a regular; só o Simples puro muda o resultado.' },
};
