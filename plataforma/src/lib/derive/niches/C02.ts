// Fórmulas próprias dos nichos da categoria C02 (campo `derivacao` da base).
// Cada função roda depois das atribuições diretas e antes da normalização. Ver src/lib/derive/core.ts.
import type { Ctx, Deriver } from '../core';

/** CBS de referência de 2028 (cbs_referencia_pct dos parâmetros globais), alíquota cheia total do ano de teste. */
/** 50% do limite anual do MEI (R$ 81.000, LC 123), usado no corte do nanoempreendedor (LC 214, art. 26, IV). */
const MEIO_LIMITE_MEI = 40500;

const brl = (x: number) => 'R$ ' + Math.round(x).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
const pc = (x: number) => x.toFixed(1).replace('.', ',') + '%';

/** Distribui as fatias informadas e deixa o "resto" (100 menos as demais) na linha base. */
function fatias(c: Ctx, base: string, outras: Record<string, string>) {
  let soma = 0;
  for (const [linha, campo] of Object.entries(outras)) {
    const x = c.num(campo);
    c.r(linha, 'participacao_pct', x);
    soma += x;
  }
  c.r(base, 'participacao_pct', 100 - soma);
}

/** Regime da empresa: Simples puro é tratado pela camada genérica; o híbrido usa as linhas como estão. */
function regime(c: Ctx) {
  if (c.str('regime_empresa') === 'simples_hibrido')
    c.msg('Com o IBS/CBS por fora do DAS, a empresa é calculada como regime regular, com as linhas como estão.', 'info', 'regime_empresa');
}

const msgInss = (c: Ctx, texto: string) => c.msg(texto, 'info');

const REQUISITOS_127 = 'Redução de 30% (art. 127): todos os sócios com registro no conselho ligado ao objeto, só pessoas físicas, sem participação em outra empresa, sem outra atividade e com o serviço prestado pelos sócios. Um sócio sem registro ou uma holding no quadro derruba o benefício.';

export const derivers: Record<string, Deriver> = {
  // Software e SaaS B2B
  'C02-01': c => {
    fatias(c, 'mensal_regular', { cartao: 'pct_cartao', pix_auto: 'pct_pix_auto', anual_adiantado: 'pct_anual', simples_mei: 'pct_simples', exportacao: 'pct_exterior' });
    regime(c);
    if (c.num('pct_exterior') > 50) c.msg('Exportação acima de 50% da receita: o saldo credor e o prazo de ressarcimento passam a ser o número principal.', 'alerta', 'pct_exterior');
    c.msg('Quando o cartão entrar no split (sem data definida), a linha de cartão passa a ter efeito igual ao das demais.', 'alerta');
    c.msg('Planos anuais são tratados como recebimento à vista, com débito no pagamento. O motor não reparte o débito pelos 12 meses.', 'info', 'pct_anual');
  },

  // Desenvolvimento de software e consultoria em TI
  'C02-02': c => {
    fatias(c, 'alocacao', { projetos: 'pct_projetos', publico: 'pct_publico', simples: 'pct_simples', exportacao: 'pct_exterior' });
    regime(c);
    if (c.num('pct_exterior') > 50) c.msg('Exportação acima de 50% da receita: destaque o saldo credor e o ressarcimento.', 'alerta', 'pct_exterior');
    if (c.num('pct_pj') > 0) c.msg('Prestador PJ que optar pelo IBS/CBS por fora passa a gerar crédito cheio. Veja a simulação com a troca do custo de PJ do Simples por parceiros.', 'info', 'pct_pj');
    c.extra('Troca de PJ do Simples por parceiros do regime regular', cc => {
      cc.c('parceiros', 'pct_receita', c.num('pct_parceiros') + c.num('pct_pj'));
      cc.c('pj_simples', 'pct_receita', 0);
    }, 'Todo o custo de PJ do Simples passa para parceiros com crédito cheio.');
  },

  // Terceirização de limpeza e conservação
  'C02-03': c => {
    fatias(c, 'privados', { publico: 'pct_publico', condominios: 'pct_condominios', simples: 'pct_simples' });
    c.r('publico', 'prazo_dias', 15 + c.num('dia_pagamento_publico'));
    const m = c.num('pct_materiais');
    c.c('materiais', 'pct_receita', m * 3 / 5.5);
    c.c('higiene_reduzida', 'pct_receita', m * 1 / 5.5);
    c.c('uniformes_epi', 'pct_receita', m * 1.5 / 5.5);
    regime(c);
    msgInss(c, 'O valor que chega ao caixa nos contratos privados é a fatura menos o INSS retido (11%), menos o IBS/CBS retido no split e menos outras retenções.');
    c.msg('Contratos públicos: o débito só acontece no pagamento e fica fora do split, sem efeito de caixa nas vendas.', 'info');
  },

  // Vigilância e segurança privada
  'C02-04': c => {
    fatias(c, 'privados', { publico: 'pct_publico', condominios: 'pct_condominios', simples: 'pct_simples' });
    const e = c.num('pct_equipamentos') / 2;
    c.c('uniformes_armas', 'pct_receita', e);
    c.c('equipamentos', 'pct_receita', e);
    regime(c);
    msgInss(c, 'Nos contratos privados, a retenção de 11% de INSS soma com a retenção do split no valor líquido da fatura.');
    c.msg('Contratos públicos: o débito só acontece no pagamento e fica fora do split.', 'info');
  },

  // Manutenção industrial e montagem
  'C02-05': c => {
    fatias(c, 'manutencao_contrato', { paradas_montagem: 'pct_paradas', pecas: 'pct_pecas', simples: 'pct_simples', publico: 'pct_publico' });
    const sub = c.num('pct_sub'), reg = c.num('pct_sub_regular') / 100;
    c.c('sub_regular', 'pct_receita', sub * reg);
    c.c('sub_simples', 'pct_receita', sub * (1 - reg));
    regime(c);
    if (c.num('aliquota_montagem') === 50) c.msg('Redução de 50% para montagem é enquadramento de construção civil ainda não confirmado. Valide antes de usar o resultado.', 'alerta', 'aliquota_montagem');
    msgInss(c, 'A retenção de INSS na cessão de mão de obra soma com o split no valor líquido da medição.');
  },

  // Locação de máquinas e equipamentos
  'C02-06': c => {
    fatias(c, 'locacao_construtoras', { locacao_agro: 'pct_agro', locacao_simples: 'pct_simples', publico: 'pct_publico', venda_usados: 'pct_usados' });
    const fat = c.num('faturamento');
    c.c('aquisicao_maquinas', 'pct_receita', fat > 0 ? c.num('compra_maquinas_ano') / 12 / fat * 100 : 0);
    regime(c);
    c.msg('Crédito de máquinas é ativo imobilizado, com ressarcimento acelerado (art. 40, I). Considere 75 dias extras como padrão e 45 dias se a empresa estiver no programa de conformidade.', 'info', 'compra_maquinas_ano');
    if (c.num('compra_maquinas_ano') === 0) c.msg('Sem compra de máquinas, o saldo credor desaparece e o efeito vira débito antecipado.', 'alerta', 'compra_maquinas_ano');
    if (c.num('origem_usados') === 0) c.msg('Venda de usados com origem até 2026 é tratada como alíquota zero. Se o preço passar do valor líquido de aquisição, o excedente é tributado.', 'alerta', 'origem_usados');
  },

  // Locação de veículos e gestão de frotas
  'C02-07': c => {
    const loc = c.num('faturamento_locacao'), sem = c.num('venda_seminovos'), rec = loc + sem;
    c.receita(rec);
    const fl = rec > 0 ? loc / rec : 0, fs = rec > 0 ? sem / rec : 0;
    const pub = c.num('pct_publico'), car = c.num('pct_cartao'), loj = c.num('pct_lojistas');
    c.r('gtf_regular', 'participacao_pct', fl * (100 - pub - car));
    c.r('gtf_publico', 'participacao_pct', fl * pub);
    c.r('rac_cartao', 'participacao_pct', fl * car);
    c.r('seminovos_lojistas', 'participacao_pct', fs * loj);
    c.r('seminovos_varejo', 'participacao_pct', fs * (100 - loj));
    c.c('compra_veiculos', 'pct_receita', rec > 0 ? c.num('compra_frota_mes') / rec * 100 : 0);
    // Curva estimada dos seminovos (pontos percentuais): frota antiga primeiro; 17 em 2033.
    const transicao = { '2027': 0, '2028': 5.7, '2029': 11.35, '2030': 11.35, '2031': 11.35, '2032': 11.35, '2033': 17 };
    for (const l of ['seminovos_varejo', 'seminovos_lojistas']) {
      if (c.str('tributacao_seminovos') === 'cheia') { c.r(l, 'aliquota_especifica_por_ano', null); c.r(l, 'aliquota_pct_cheia', 100); }
      else c.r(l, 'aliquota_especifica_por_ano', { ...transicao });
    }
    regime(c);
    if (c.str('tributacao_seminovos') !== 'cheia') c.msg('Seminovos usam uma curva estimada em pontos percentuais, que não acompanha mudanças da CBS de referência. Trate como estimativa.', 'alerta', 'tributacao_seminovos');
    c.msg('O crédito da frota é ativo imobilizado. Considere 75 dias extras de ressarcimento (art. 40, I) e 45 dias com programa de conformidade.', 'info', 'compra_frota_mes');
    if (c.num('compra_frota_mes') === 0) c.msg('Sem compra de frota, o saldo credor desaparece.', 'alerta', 'compra_frota_mes');
    c.msg('O Imposto Seletivo sobre veículos, se houver, não gera crédito e não entra nesta conta.', 'info');
  },

  // Agência de marketing e publicidade
  'C02-08': c => {
    fatias(c, 'fee_regular', { comissao_midia: 'pct_comissao', producao: 'pct_producao', publico_institucional: 'pct_publico', simples: 'pct_simples' });
    c.r('comissao_midia', 'parcela_sujeita_split_pct', c.bool('comissao_por_ted') ? 100 : 0);
    regime(c);
    const midia = c.num('midia_gerida');
    if (midia > 0) {
      c.msg(`Mídia gerida de ${brl(midia)} por mês fica fora da receita do motor. Se o veículo faturar contra a agência, a mídia passa a compor a base e a agência toma crédito da nota do veículo.`, 'alerta', 'midia_gerida');
      c.msg('O pagamento do anunciante pode chegar com retenção do imposto da nota do veículo. Concilie antes de repassar.', 'alerta', 'midia_gerida');
    }
    if (c.num('aliquota_publico') === 40) c.msg('Redução de 60% para comunicação institucional: confirme o enquadramento dos contratos públicos.', 'info', 'aliquota_publico');
  },

  // Facilities e manutenção predial
  'C02-09': c => {
    fatias(c, 'corporativo', { chamados: 'pct_chamados', condominios: 'pct_condominios', publico: 'pct_publico', simples: 'pct_simples' });
    const sub = c.num('pct_sub');
    c.c('sub_regular', 'pct_receita', sub * 4 / 9);
    c.c('sub_simples', 'pct_receita', sub * 5 / 9);
    regime(c);
    if (c.num('pct_condominios') > 0) c.msg(`Condomínios (${pc(c.num('pct_condominios'))} da receita) têm débito sem split e sem crédito ao cliente. Quanto maior essa carteira, menor o efeito de caixa.`, 'info', 'pct_condominios');
    if (c.num('aliquota_obras') === 50) c.msg('Redução de 50% para obras é enquadramento de construção civil ainda não confirmado. Valide antes de usar o resultado.', 'alerta', 'aliquota_obras');
  },

  // Call center, BPO e cobrança
  'C02-10': c => {
    fatias(c, 'atendimento', { cobranca_retida: 'pct_cobranca_retida', cobranca_faturada: 'pct_cobranca_faturada', simples: 'pct_simples' });
    const t = c.num('pct_telecom');
    c.c('telecom', 'pct_receita', t * 5 / 9);
    c.c('tecnologia', 'pct_receita', t * 4 / 9);
    regime(c);
    c.msg('Comissão de cobrança retida tem débito sem split. O valor recuperado e repassado ao credor não entra na receita.', 'info', 'pct_cobranca_retida');
    if (c.num('pct_antecipado') > 50) c.msg('Com mais de 50% da receita antecipada, o efeito dominante é a perda do imposto que hoje vem adiantado com o recebível.', 'alerta', 'pct_antecipado');
  },

  // Recrutamento, RH e trabalho temporário
  'C02-11': c => {
    fatias(c, 'temporario', { recrutamento: 'pct_recrutamento', bpo_rh: 'pct_bpo', simples_publico: 'pct_simples_publico' });
    regime(c);
    msgInss(c, 'O valor líquido da fatura é a fatura menos o INSS retido (11%) e menos o IBS/CBS retido no split.');
    // Retido por mês em 2028 (adoção de 100%) contra a margem bruta (taxa de administração).
    const fat = c.num('faturamento'), m = c.num('margem_bruta');
    const retido = c.linhasR().reduce((s, l) => s + fat * l.participacao_pct / 100 * c.aliquota(2028) / 100 * l.aliquota_pct_cheia / 100 * l.parcela_sujeita_split_pct / 100, 0);
    const margem = fat * m / (100 + m);
    if (margem > 0) c.msg(`Em 2028, o split retém cerca de ${brl(retido)} por mês, ou ${pc(retido / margem * 100)} da margem bruta da taxa de administração (${brl(margem)} por mês).`, 'info', 'margem_bruta');
    else c.msg(`Em 2028, o split retém cerca de ${brl(retido)} por mês. Sem margem bruta informada, não há comparação possível.`, 'info', 'margem_bruta');
  },

  // Consultoria empresarial e de gestão
  'C02-12': c => {
    fatias(c, 'projetos', { retainer: 'pct_retainer', sinal: 'pct_sinal', simples: 'pct_simples', exportacao: 'pct_exterior' });
    const a = c.num('pct_associados');
    c.c('consultores_simples', 'pct_receita', a * 0.8);
    c.c('consultores_regular', 'pct_receita', a * 0.2);
    regime(c);
    if (c.num('requisitos_30') === 70) c.msg(REQUISITOS_127, 'alerta', 'requisitos_30');
    c.msg('O sinal é tratado como recebimento à vista, com débito no pagamento (art. 10, §4º).', 'info', 'pct_sinal');
  },

  // Organização e produção de eventos corporativos
  'C02-13': c => {
    const corp = 100 - c.num('pct_feiras') - c.num('pct_cartao') - c.num('pct_publico') - c.num('pct_simples');
    const sinal = c.num('pct_sinal') / 100;
    c.r('sinal_corporativo', 'participacao_pct', corp * sinal);
    c.r('saldo_corporativo', 'participacao_pct', corp * (1 - sinal));
    regime(c);
    c.msg('O sinal é tratado como recebimento à vista, com débito no pagamento (art. 10, §4º). Se o evento ocorrer meses depois, o efeito real pode ser maior.', 'alerta', 'pct_sinal');
    c.msg('Bufê e hospedagem podem não gerar crédito. Não some esses custos nas linhas de compra.', 'alerta');
    if (c.num('aliquota_feiras') === 40) c.msg('A redução de 60% vale só para congressos e feiras. Evento corporativo interno com alíquota reduzida é risco de autuação.', 'alerta', 'aliquota_feiras');
  },

  // Representação comercial
  'C02-14': c => {
    fatias(c, 'comissao_industria', { comissao_simples: 'pct_simples', comissao_exterior: 'pct_exterior' });
    const carro = c.num('pct_carro') / 2;
    c.c('combustivel', 'pct_receita', carro);
    c.c('veiculo', 'pct_receita', carro);
    regime(c);
    if (c.str('tipo_representante') === 'pf_autonomo') {
      const anual = c.num('comissao_mensal') * 12;
      c.msg(anual > MEIO_LIMITE_MEI
        ? `Pessoa física com comissão anual de ${brl(anual)}, acima de 50% do limite do MEI, tende a ser contribuinte do IBS/CBS. Avalie a inscrição. A conta usa as linhas como regime regular.`
        : 'Pessoa física abaixo de 50% do limite do MEI pode ser nanoempreendedora e não contribuinte. A conta usa as linhas como regime regular.', 'alerta', 'tipo_representante');
    }
  },

  // Laboratório de ensaios e análises técnicas
  'C02-15': c => {
    fatias(c, 'industrias', { avulsos_adiantados: 'pct_avulsos', publico: 'pct_publico', simples: 'pct_simples' });
    const fat = c.num('faturamento');
    c.c('equipamentos', 'pct_receita', fat > 0 ? c.num('investimento_ano') / 12 / fat * 100 : 0);
    regime(c);
    if (c.num('requisitos_30') === 70) c.msg(REQUISITOS_127 + ' Equipe técnica não sócia executando os ensaios também pode derrubar o benefício.', 'alerta', 'requisitos_30');
    c.msg('Equipamentos são ativo imobilizado. Se houver saldo credor, considere 75 dias extras de ressarcimento (art. 40, I).', 'info', 'investimento_ano');
  },
};

/** Campos que, por desenho, não mudam nenhum alvo quando variam sozinhos a partir do padrão (motivo). */
export const excecoes: Record<string, Record<string, string>> = {};
