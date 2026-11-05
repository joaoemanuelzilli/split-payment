// Fórmulas próprias dos nichos da categoria C11 (campo `derivacao` da base).
// Cada função roda depois das atribuições diretas e antes da normalização. Ver src/lib/derive/core.ts.
import type { Ctx, Deriver } from '../core';

const PICO_COLHEITA = 'A receita da safra é concentrada. O cálculo usa a média mensal. Nos meses de pico a retenção pode chegar a 3 ou 4 vezes a média. Rode também com a receita do mês de pico.';

// C11-01 Revenda de insumos agropecuários
const c1101: Deriver = c => {
  const anexo = c.num('pct_anexo_ix');
  const sem = c.num('pct_sem_diferimento') / 100;
  const barter = c.num('pct_barter');
  const reg = c.num('pct_outros_regular') / 100;
  const gc = c.num('pct_graos_contribuinte') / 100;
  const outros = 100 - anexo - barter;
  c.r('ins_diferido', 'participacao_pct', anexo * (1 - sem));
  c.r('ins_tributado', 'participacao_pct', anexo * sem);
  c.r('outros_regular', 'participacao_pct', outros * reg);
  c.r('outros_nc', 'participacao_pct', outros * (1 - reg));
  c.r('graos_barter', 'participacao_pct', barter);
  c.c('merc_fora_anexo', 'pct_receita', outros * 0.8);
  c.c('graos_contrib', 'pct_receita', barter * 0.96 * gc);
  c.c('graos_nc', 'pct_receita', barter * 0.96 * (1 - gc));
  if (c.num('pct_sem_diferimento') > 30) {
    c.msg('Mais de 30% das vendas de insumos estão sem diferimento. Confirme com os clientes a declaração de destino da produção, porque sem ela não há diferimento.', 'alerta', 'pct_sem_diferimento');
  }
  if (c.str('regime_empresa') === 'simples') {
    for (const l of c.linhasR()) c.r(l.id, 'parcela_sujeita_split_pct', 0);
    c.r('ins_diferido', 'aliquota_pct_cheia', 40);
    for (const l of c.linhasC()) { c.c(l.id, 'credito_pct_cheia', 0); c.c(l.id, 'credito_fixo_pct_valor_por_ano', null); }
    c.msg('No Simples puro o split quase não afeta seu caixa, mas você perde o diferimento e fica mais cara que a revenda do regime regular. Simule a opção pelo regime regular de IBS/CBS.', 'alerta', 'regime_empresa');
  }
};

// C11-02 Cerealista, armazém e trading de grãos
const c1102: Deriver = c => {
  const trading = c.num('pct_trading');
  const exp = c.num('pct_exportacao');
  const serv = c.num('pct_servicos');
  const grao = c.num('pct_compra_graos');
  const contrib = c.num('pct_produtor_contribuinte') / 100;
  const frete = c.num('pct_frete');
  c.r('venda_suspensao', 'participacao_pct', trading);
  c.r('exportacao', 'participacao_pct', exp);
  c.r('servicos_regular', 'participacao_pct', (serv * 3) / 7);
  c.r('servicos_nc', 'participacao_pct', (serv * 4) / 7);
  c.r('mercado_interno', 'participacao_pct', 100 - trading - exp - serv);
  c.c('graos_nc', 'pct_receita', grao * (1 - contrib));
  if (c.bool('habilitada_oea')) {
    c.c('graos_contrib', 'pct_receita', grao * contrib * (1 - exp / 100));
    c.msg('Com a habilitação, a compra para exportação vem suspensa. O saldo credor cai, mas a empresa responde pelo tributo se não exportar em 180 dias.', 'info', 'habilitada_oea');
  } else {
    c.c('graos_contrib', 'pct_receita', grao * contrib);
  }
  c.c('frete_pj', 'pct_receita', frete * 0.6);
  c.c('frete_autonomo', 'pct_receita', frete * 0.4);
};

// Créditos transferidos pelo associado contribuinte (valores da linha padrão da base).
const FIXO_ASSOC = { '2027': 2, '2028': 2, '2029': 2.3, '2030': 2.6, '2031': 3, '2032': 3.3, '2033': 5.3 };

// C11-03 Cooperativa agropecuária
const c1103: Deriver = c => {
  const lojas = c.num('pct_lojas');
  const rec = c.num('pct_recebimento');
  const ac = c.num('pct_assoc_contribuinte') / 100;
  c.r('lojas', 'participacao_pct', lojas);
  c.c('mercadorias_lojas', 'pct_receita', lojas * 0.8);
  c.r('servicos_nc', 'participacao_pct', 100 - c.num('pct_industria') - c.num('pct_exportacao') - c.num('pct_insumos') - lojas);
  c.c('producao_assoc_contrib', 'pct_receita', rec * ac);
  c.c('producao_assoc_nc', 'pct_receita', rec * (1 - ac));
  // sim: créditos transferidos (credito_fixo da base); nao: crédito de 40% da cheia, sem credito_fixo.
  const regular = (x: Ctx) => {
    x.c('producao_assoc_contrib', 'credito_pct_cheia', 40);
    x.c('producao_assoc_contrib', 'condicionado', true);
    x.c('producao_assoc_contrib', 'credito_fixo_pct_valor_por_ano', null);
  };
  if (c.str('opcao_271') === 'nao') {
    regular(c);
    c.extra('Com a opção do art. 271 (créditos transferidos pelo associado)', cc => {
      cc.c('producao_assoc_contrib', 'credito_pct_cheia', null);
      cc.c('producao_assoc_contrib', 'credito_fixo_pct_valor_por_ano', FIXO_ASSOC);
    }, 'Comparação lado a lado com a opção de créditos transferidos.');
  } else {
    c.extra('Sem a opção do art. 271 (regime regular, crédito de 40% da cheia)', regular, 'Comparação lado a lado com a permanência no regime regular.');
  }
};

// C11-04 Produtor rural PJ (grãos e pecuária)
const c1104: Deriver = c => {
  const anual = c.num('receita_anual');
  const mensal = anual / 12;
  c.receita(mensal);
  c.r('boi_frigorifico', 'participacao_pct', c.num('pct_boi'));
  c.r('outras_vendas', 'participacao_pct', 100 - c.num('pct_graos') - c.num('pct_trading') - c.num('pct_boi'));
  c.c('maquinas', 'pct_receita', mensal > 0 ? (c.num('invest_maquinas') / 12 / mensal) * 100 : 0);
  c.c('pecas_servicos', 'pct_receita', c.num('pct_pecas_servicos') - 1.5);
  c.c('energia', 'pct_receita', 1.5);
  const contrib = c.str('contribuinte_ibs_cbs');
  if (contrib === 'nao' || contrib === 'integrado') {
    c.modo('nao_contribuinte', 'Como não contribuinte, o split não afeta seu caixa. O custo está no preço: o comprador só toma crédito presumido e tende a pagar menos. Compare com a opção de ser contribuinte.');
    c.msg('Como não contribuinte, o split não afeta seu caixa. O custo está no preço: o comprador só toma crédito presumido e tende a pagar menos. Compare com a opção de ser contribuinte.', 'info', 'contribuinte_ibs_cbs');
  }
  if (contrib === 'nao' && anual >= 3600000) {
    c.msg('Pela receita informada, a fazenda é contribuinte obrigatória. O excesso acima de R$ 3,6 milhões por ano (até 20%) obriga o registro a partir do ano seguinte.', 'alerta', 'receita_anual');
  }
  c.msg(PICO_COLHEITA, 'alerta');
};

// C11-05 Concessionária de máquinas agrícolas
const c1105: Deriver = c => {
  const maq = c.num('pct_maquinas');
  const nc = c.num('pct_nao_contribuinte') / 100;
  const fin = c.num('pct_financiado') / 100;
  const pecas = 100 - maq;
  c.r('maq_nao_contribuinte', 'participacao_pct', maq * nc);
  c.r('maq_financiada', 'participacao_pct', maq * (1 - nc) * fin);
  c.r('maq_propria', 'participacao_pct', maq * (1 - nc) * (1 - fin));
  c.r('pecas_contribuinte', 'participacao_pct', pecas * (1 - nc));
  c.r('pecas_nao_contribuinte', 'participacao_pct', pecas * nc);
  c.c('maquinas_fabrica', 'pct_receita', maq * (1 - c.num('margem_maquinas') / 100));
  c.c('pecas', 'pct_receita', pecas * 0.65);
  if (c.num('split_no_repasse') === 0) c.msg('Se o banco repassar o valor cheio, o imposto fica no seu caixa até o vencimento, como hoje.', 'info', 'split_no_repasse');
  if (c.num('pct_nao_contribuinte') > 50) c.msg('Mais da metade das vendas é para não contribuinte, então o saldo credor tende a ser alto. Rode também com o prazo de ressarcimento de 165 dias.', 'alerta', 'pct_nao_contribuinte');
  c.msg('Feiras e colheita criam picos de venda. O cálculo usa a média mensal. No mês de pico o saldo credor e a retenção são maiores.', 'info');
};

export const derivers: Record<string, Deriver> = {
  'C11-01': c1101, 'C11-02': c1102, 'C11-03': c1103, 'C11-04': c1104, 'C11-05': c1105,
};

/** Campos que, por desenho, não mudam nenhum alvo quando variam sozinhos a partir do padrão (motivo). */
export const excecoes: Record<string, Record<string, string>> = {
  'C11-04': { contribuinte_ibs_cbs: 'sim_opcao tem o mesmo cálculo de sim_obrigatorio (linhas padrão); só os valores nao e integrado mudam o resultado.' },
};
