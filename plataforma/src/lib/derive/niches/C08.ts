// Fórmulas próprias dos nichos da categoria C08 (campo `derivacao` da base).
// Cada função roda depois das atribuições diretas e antes da normalização. Ver src/lib/derive/core.ts.
import type { Ctx, Deriver } from '../core';

const fmt = (x: number, casas = 0) => x.toLocaleString('pt-BR', { minimumFractionDigits: casas, maximumFractionDigits: casas });

/** Receita por mês e equipamentos como investimento anual diluído em 12 meses, sobre o faturamento. */
function equipamentosPorInvestimento(c: Ctx, campoInvestimento: string) {
  const fat = c.num('faturamento_mensal');
  c.receita(fat);
  c.c('equipamentos', 'pct_receita', fat > 0 ? c.num(campoInvestimento) / 12 / fat * 100 : 0);
}

// Distribuidora de medicamentos e materiais hospitalares
function distribuidoraMedicamentos(c: Ctx) {
  const zero = c.num('pct_lista_zero');
  c.r('lista_zero', 'participacao_pct', zero);
  // A parte do CMV ligada à lista zero entra sem crédito: não há linha de compra para ela.
  c.c('mercadorias_reduzidas', 'pct_receita', c.num('cmv_pct') * (100 - zero) / 100);
  const debito = c.linhasR().reduce((s, l) => s + l.participacao_pct * l.aliquota_pct_cheia, 0);
  const credito = c.linhasC().reduce((s, l) => s + l.pct_receita * (l.credito_pct_cheia ?? 0), 0);
  if (credito > debito) {
    c.msg('O crédito das compras supera o débito das vendas mesmo sem o split. Isso gera saldo credor estrutural. Vale destacar o programa de conformidade, com ressarcimento em 30 dias.', 'alerta');
  }
}

// Clínica médica e de especialidades
function clinicaMedica(c: Ctx) {
  const conv = c.num('pct_convenio'), emp = c.num('pct_empresas'), cartao = c.num('pct_cartao'), pub = c.num('pct_publico');
  c.r('publico', 'participacao_pct', pub);
  c.r('particular_pix', 'participacao_pct', 100 - conv - emp - cartao - pub);
  const med = c.num('pct_medicos_pj'), reg = c.num('pct_medicos_regular') / 100;
  c.c('medicos_pj_regular', 'pct_receita', med * reg);
  c.c('medicos_pj_simples', 'pct_receita', med * (1 - reg));
}

// Laboratório de análises clínicas e imagem
function laboratorio(c: Ctx) {
  equipamentosPorInvestimento(c, 'investimento_equipamentos_ano');
  const conv = c.num('pct_convenio'), hosp = c.num('pct_hospitais'), pub = c.num('pct_publico');
  const particulares = 100 - conv - hosp - pub;
  c.r('publico', 'participacao_pct', pub);
  c.r('particular_cartao', 'participacao_pct', particulares * 0.75);
  c.r('particular_pix', 'participacao_pct', particulares * 0.25);
}

// Hospital e day hospital
function hospital(c: Ctx) {
  equipamentosPorInvestimento(c, 'investimento_ano');
  const conv = c.num('pct_convenio'), sus = c.num('pct_sus'), cartao = c.num('pct_particular_cartao'), emp = c.num('pct_empresas');
  c.r('sus', 'participacao_pct', sus);
  c.r('particular_pix', 'participacao_pct', 100 - conv - sus - cartao - emp);
  c.c('mat_med', 'pct_receita', c.num('pct_mat_med') * (1 - c.num('pct_mat_med_zero') / 100));
  const med = c.num('pct_medicos_pj');
  c.c('medicos_pj_regular', 'pct_receita', med * 0.75);
  c.c('medicos_pj_simples', 'pct_receita', med * 0.25);
  const glosa = c.num('glosa_pct');
  if (glosa > 0) {
    c.msg(`Glosa de ${fmt(glosa, 1)}%: o imposto da parte glosada pode ser pago antes da glosa e recuperado por nota de ajuste. A receita do cálculo é o valor efetivamente pago.`, 'info', 'glosa_pct');
  }
  const prazo = c.num('prazo_convenio');
  if (prazo > 60) {
    c.msg(`Com prazo de ${fmt(prazo)} dias no convênio, o hospital já paga o imposto antes de receber. O split não piora isso, salvo atraso no recolhimento do imposto.`, 'info', 'prazo_convenio');
  }
}

// Farmácia e drogaria
function farmacia(c: Ctx) {
  const cmv = c.num('cmv_pct');
  const med = c.num('pct_medicamentos'), perf = c.num('pct_perfumaria'), hig = c.num('pct_higiene');
  c.r('medicamentos', 'participacao_pct', med);
  c.r('perfumaria', 'participacao_pct', perf);
  c.r('higiene', 'participacao_pct', hig);
  // Compras das linhas de alíquota zero (lista zero e Farmácia Popular) entram sem crédito: não há linha de compra para elas.
  c.c('compra_medicamentos', 'pct_receita', cmv * med / 100);
  c.c('compra_perfumaria', 'pct_receita', cmv * perf / 100);
  c.c('compra_higiene', 'pct_receita', cmv * hig / 100);
  if (c.str('regime_ibs_cbs') === 'simples') {
    const base = 'Simples puro: não há destaque nem crédito, e o split das vendas não existe. O split não afeta a empresa. ';
    c.modo('simples_puro', perf > 30
      ? base + 'Como a perfumaria passa de 30% das vendas, há muito crédito de compra com alíquota cheia. Compare a carga do DAS com a do regime regular.'
      : base + 'Como o cliente é consumidor, quase não há razão para sair do Simples.');
  }
}

// Clínica odontológica
function clinicaOdontologica(c: Ctx) {
  const conv = c.num('pct_convenio'), cartao = c.num('pct_cartao');
  c.r('convenio', 'participacao_pct', conv);
  c.r('particular_pix', 'participacao_pct', 100 - conv - cartao);
  const metade = c.num('pct_aluguel_servicos') / 2;
  c.c('aluguel', 'pct_receita', metade);
  c.c('servicos_energia', 'pct_receita', metade);
}

// Fisioterapia, psicologia e terapias
function fisioterapia(c: Ctx) {
  const conv = c.num('pct_convenio'), cartao = c.num('pct_cartao'), fora = c.num('pct_fora_anexo');
  c.r('convenio', 'participacao_pct', conv);
  c.r('particular_pix', 'participacao_pct', 100 - conv - cartao - fora);
}

// Clínica veterinária
function clinicaVeterinaria(c: Ctx) {
  const serv = c.num('pct_servicos_vet'), plano = c.num('pct_plano_pet');
  c.r('plano_pet', 'participacao_pct', plano);
  c.r('servicos_cartao', 'participacao_pct', serv * 0.75 - plano);
  c.r('servicos_pix', 'participacao_pct', serv * 0.25);
  const prod = c.num('pct_produtos');
  c.r('produtos', 'participacao_pct', prod);
  c.c('revenda', 'pct_receita', prod * 0.65);
  const metade = c.num('pct_aluguel_servicos') / 2;
  c.c('aluguel', 'pct_receita', metade);
  c.c('servicos_energia', 'pct_receita', metade);
  if (c.num('aliquota_servicos_vet') === 70 && (prod > 0 || c.num('pct_banho_tosa') > 0)) {
    c.msg('A redução de 30% exige só atividade veterinária. Com venda de produtos ou banho e tosa, os requisitos do art. 127 podem não ser cumpridos. Confirme com seu contador.', 'alerta', 'aliquota_servicos_vet');
  }
}

// Home care e serviços de enfermagem
function homeCare(c: Ctx) {
  const conv = c.num('pct_convenio'), pub = c.num('pct_publico');
  c.r('convenio', 'participacao_pct', conv);
  c.r('particular', 'participacao_pct', 100 - conv - pub);
  const log = c.num('pct_logistica');
  c.c('combustivel', 'pct_receita', log * 0.25);
  c.c('servicos', 'pct_receita', log * 0.5);
  c.c('aluguel', 'pct_receita', log * 0.25);
  const glosa = c.num('glosa_pct');
  if (glosa > 0) {
    c.msg(`Glosa de ${fmt(glosa, 1)}% depois da nota: o imposto sobre o valor glosado precisa de nota de ajuste. A receita do cálculo é o valor efetivamente pago.`, 'info', 'glosa_pct');
  }
}

export const derivers: Record<string, Deriver> = {
  'C08-01': distribuidoraMedicamentos,
  'C08-02': clinicaMedica,
  'C08-03': laboratorio,
  'C08-04': hospital,
  'C08-05': farmacia,
  'C08-06': clinicaOdontologica,
  'C08-07': fisioterapia,
  'C08-08': clinicaVeterinaria,
  'C08-09': homeCare,
};

/** Campos que, por desenho, não mudam nenhum alvo quando variam sozinhos a partir do padrão (motivo). */
export const excecoes: Record<string, Record<string, string>> = {};
