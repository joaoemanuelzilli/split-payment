// Fórmulas próprias dos nichos da categoria C07 (campo `derivacao` da base).
// Cada função roda depois das atribuições diretas e antes da normalização. Ver src/lib/derive/core.ts.
import type { Ctx, Deriver } from '../core';
import type { LinhaReceita } from '../../types';

const ANOS = ['2027', '2028', '2029', '2030', '2031', '2032', '2033'];
const curvaFixa = (taxa: number): Record<string, number> => Object.fromEntries(ANOS.map(a => [a, taxa]));
const fmt = (x: number, casas = 0) => x.toLocaleString('pt-BR', { minimumFractionDigits: casas, maximumFractionDigits: casas });

const CREDITO_SIMPLES = 7; // % da cheia que o cliente toma de fornecedor do Simples

/** Crédito que o cliente toma por R$ 100 mil faturados, para uma fração da alíquota cheia. */
const credito100mil = (pctCheia: number, taxa: number) => 100000 * (taxa / 100) * (pctCheia / 100);

/** Frase de comparação do crédito do cliente: regime regular contra Simples puro. */
function textoCredito(c: Ctx, pctRegular: number, rotulo = 'faturados'): string {
  const TAXA_2027 = c.aliquota(2027), TAXA_2033 = c.aliquota(2033);
  return `A cada R$ 100 mil ${rotulo}, o cliente do regime regular toma R$ ${fmt(credito100mil(pctRegular, c.aliquota(2027)))} de crédito em 2027 e R$ ${fmt(credito100mil(pctRegular, c.aliquota(2033)))} em 2033 (${fmt(pctRegular)}% da cheia). `
    + `Com você no Simples puro, o crédito dele cai para R$ ${fmt(credito100mil(CREDITO_SIMPLES, c.aliquota(2027)))} e R$ ${fmt(credito100mil(CREDITO_SIMPLES, c.aliquota(2033)))} (${CREDITO_SIMPLES}% da cheia).`;
}

/** Aplica taxa específica fixa em todas as linhas de receita e zera o crédito das compras (RET, opção de 3,65%). */
function aplicarTaxaFixa(c: Ctx, taxa: number) {
  for (const l of c.linhasR()) c.r(l.id, 'aliquota_especifica_por_ano', curvaFixa(taxa));
  for (const l of c.linhasC()) { c.c(l.id, 'credito_pct_cheia', 0); c.c(l.id, 'credito_fixo_pct_valor_por_ano', null); }
}

/**
 * Regime especial de taxa fixa contra regime regular.
 * Ativo: o resultado principal usa a taxa fixa e um cenário extra mostra o regime regular.
 * Inativo: o resultado principal é o regime regular e um cenário extra mostra a taxa fixa.
 */
function compararTaxaFixa(c: Ctx, ativo: boolean, taxa: number, nomeOpcao: string) {
  const creditos = c.linhasC().map(l => ({ id: l.id, pct: l.credito_pct_cheia, fixo: l.credito_fixo_pct_valor_por_ano }));
  if (ativo) {
    aplicarTaxaFixa(c, taxa);
    c.extra('Comparação: regime regular com redutores', cc => {
      for (const l of cc.linhasR()) cc.r(l.id, 'aliquota_especifica_por_ano', null);
      for (const k of creditos) { cc.c(k.id, 'credito_pct_cheia', k.pct); cc.c(k.id, 'credito_fixo_pct_valor_por_ano', k.fixo ?? null); }
    }, `Mesmas vendas e compras no regime regular, para comparar a carga com ${nomeOpcao}.`);
  } else {
    c.extra(`Comparação: ${nomeOpcao}`, cc => aplicarTaxaFixa(cc, taxa),
      `Mesmas vendas e compras com taxa de ${fmt(taxa, 2)}% e sem crédito nas compras, para comparar a carga com o regime regular.`);
  }
}

/** Mensagem de adiantamento recebido antes da execução (C07-01). */
function avisoAdiantamento(c: Ctx) {
  c.msg('O adiantamento foi tratado como recebimento à vista. Se a execução da obra ocorrer meses depois, o efeito real pode ser maior.', 'alerta', 'pct_adiantamento');
}

// Construtora de empreitada global
function construtoraGlobal(c: Ctx) {
  const priv = c.num('pct_privado'), pub = c.num('pct_publico');
  const adi = c.num('pct_adiantamento') / 100, cau = c.num('pct_caucao') / 100;
  c.r('medicao_privada', 'participacao_pct', priv * (1 - adi - cau));
  c.r('adiantamento', 'participacao_pct', priv * adi);
  c.r('caucao', 'participacao_pct', priv * cau);
  c.r('obra_publica', 'participacao_pct', pub);
  c.r('pf_condominio', 'participacao_pct', 100 - priv - pub);
  c.r('caucao', 'prazo_dias', c.num('meses_caucao') * 30);
  const sub = c.num('pct_sub'), reg = c.num('pct_sub_regular') / 100;
  c.c('sub_regular', 'pct_receita', sub * reg);
  c.c('sub_simples', 'pct_receita', sub * (1 - reg));
  if (adi > 0 && priv > 0) avisoAdiantamento(c);
}

// Empreiteira de mão de obra e subempreitada
function empreiteiraMaoDeObra(c: Ctx) {
  const reg = c.num('pct_construtoras_regular'), simples = c.num('pct_construtoras_simples');
  const cau = c.num('pct_caucao') / 100;
  c.r('medicao', 'participacao_pct', reg * (1 - cau));
  c.r('caucao', 'participacao_pct', reg * cau);
  c.r('construtoras_simples', 'participacao_pct', simples);
  c.r('pf_condominios', 'participacao_pct', 100 - reg - simples);
  c.r('caucao', 'prazo_dias', c.num('meses_caucao') * 30);
  if (c.str('regime_empresa') === 'simples') {
    c.modo('simples_puro', 'Simples puro: o IBS/CBS fica no DAS, sem destaque por fora e sem split relevante. '
      + textoCredito(c, c.num('aliquota_servico'), 'de medição')
      + ' Compare essa perda de crédito do cliente, que pesa no preço, com a economia de carga do Simples antes de decidir.');
  }
}

// Instalações elétricas, hidráulicas e ar-condicionado
function instalacoes(c: Ctx) {
  const obras = c.num('pct_obras'), manut = c.num('pct_manutencao'), equip = c.num('pct_equipamentos'), simples = c.num('pct_clientes_simples');
  c.r('obra_construtoras', 'participacao_pct', obras);
  c.r('manutencao', 'participacao_pct', manut);
  c.r('equipamentos', 'participacao_pct', equip);
  c.r('clientes_simples', 'participacao_pct', simples);
  c.r('pf_condominios', 'participacao_pct', 100 - obras - manut - equip - simples);
  if (c.num('aliquota_obra') === 100) {
    c.msg('Com alíquota cheia na obra, a mesma instalação pode ter alíquota diferente conforme a NBS escolhida na nota. Confirme o código antes de emitir.', 'alerta', 'aliquota_obra');
  }
  if (c.str('regime_empresa') === 'simples') {
    c.modo('simples_puro', 'Simples puro: o split quase não afeta a empresa. O efeito está no crédito do cliente. '
      + textoCredito(c, c.num('aliquota_obra'), 'de obra') + ' ' + textoCredito(c, c.num('aliquota_manutencao'), 'de manutenção')
      + ' Construtoras e contratos de manutenção vão comparar o preço líquido de crédito.');
  }
}

// Incorporadora
function incorporadora(c: Ctx) {
  const rep = c.num('pct_repasse'), pos = c.num('pct_pos_chaves'), pj = c.num('pct_vendas_pj');
  c.r('repasse', 'participacao_pct', rep);
  c.r('pos_chaves', 'participacao_pct', pos);
  c.r('vendas_pj', 'participacao_pct', pj);
  c.r('sinal_parcelas', 'participacao_pct', 100 - rep - pos - pj);
  // Alíquota residencial: 50% da cheia, menos o redutor de ajuste e menos o redutor social (R$ 100 mil por unidade).
  const preco = c.num('preco_medio'), red = c.num('pct_redutor_ajuste') / 100;
  const social = preco > 0 ? Math.min(1, 100000 / preco) : 1;
  const residencial = Math.max(0, Math.round(50 * (1 - red - social)));
  for (const id of ['sinal_parcelas', 'repasse', 'pos_chaves']) c.r(id, 'aliquota_pct_cheia', residencial);
  c.r('vendas_pj', 'aliquota_pct_cheia', Math.max(0, Math.round(50 * (1 - red))));
  const emp = c.num('pct_empreiteiras'), empReg = c.num('pct_empreiteiras_regular') / 100;
  c.c('empreiteiras_regular', 'pct_receita', emp * empReg);
  c.c('empreiteiras_simples', 'pct_receita', emp * (1 - empReg));

  const regime = c.str('regime_incorporacao');
  if (regime === 'ret' || regime === 'ret_social') {
    const taxa = regime === 'ret' ? 2.08 : 0.53;
    compararTaxaFixa(c, true, taxa, `RET de ${fmt(taxa, 2)}%`);
    c.msg(`No RET de ${fmt(taxa, 2)}%, o efeito de caixa do split é quase nulo e as compras ficam sem crédito. O que vale analisar é a carga do RET contra o regime regular, mostrada à parte.`, 'info', 'regime_incorporacao');
  } else {
    compararTaxaFixa(c, false, 2.08, 'RET de 2,08%');
    // HIPÓTESE: a nota do art. 488 vale só no regime regular, porque o RET tem taxa própria.
    c.msg('A dedução do art. 488 (2029 a 2032) não está no cálculo. Ela reduz o débito do IBS e aumenta o saldo credor nesse período.', 'info');
  }
  if (!c.bool('patrimonio_afetacao')) {
    // O prazo de ressarcimento é parâmetro global do motor e não entra no modelo da nota: só alertamos.
    c.msg('Sem patrimônio de afetação, o saldo credor fica retido até a conclusão da obra (art. 262, §3º, II). O prazo de ressarcimento passa a ser os meses restantes de obra vezes 30 dias, bem maior que o padrão. O caixa real pode ficar pior do que o cálculo mostra.', 'alerta', 'patrimonio_afetacao');
  }
}

// Loteadora
function loteadora(c: Ctx) {
  const entradas = c.num('pct_entradas'), pj = c.num('pct_lotes_pj');
  c.r('entradas', 'participacao_pct', entradas);
  c.r('lotes_pj', 'participacao_pct', pj);
  c.r('parcelas', 'participacao_pct', 100 - entradas - pj);
  // Alíquota residencial: 50% da cheia menos doação, gleba e redutor social (R$ 30 mil por lote), mais 2,5 de ajuste pelos juros.
  const doa = c.num('pct_doacao') / 100, gleba = c.num('pct_gleba') / 100, lote = c.num('preco_lote');
  const social = lote > 0 ? 30000 / lote : 1;
  const residencial = Math.max(0, Math.round(50 * (1 - doa - gleba - social) + 2.5));
  c.r('parcelas', 'aliquota_pct_cheia', residencial);
  c.r('entradas', 'aliquota_pct_cheia', residencial);
  c.r('lotes_pj', 'aliquota_pct_cheia', Math.max(0, Math.round(50 * (1 - doa - gleba) + 0.5)));
  const infra = c.num('pct_infraestrutura');
  c.c('infraestrutura', 'pct_receita', infra * 15 / 19);
  c.c('infra_simples', 'pct_receita', infra * 4 / 19);

  const opcao = c.str('regime_loteamento') === 'opcao_365';
  if (opcao) {
    compararTaxaFixa(c, true, 3.65, 'opção de 3,65%');
    c.msg('Na opção de 3,65% da receita recebida, as compras ficam sem crédito. A carga contra o regime regular aparece à parte.', 'info', 'regime_loteamento');
  } else {
    compararTaxaFixa(c, false, 3.65, 'opção de 3,65%');
  }
  // HIPÓTESE: o cenário de split B2C liga o split só na linha de parcelas, como diz a regra do nicho.
  c.extra('Cenário futuro: split B2C ativado nas parcelas', cc => cc.r('parcelas', 'parcela_sujeita_split_pct', 100),
    'Se o split B2C for ativado no futuro, a linha de parcelas passa a ter split. Não faz parte do cálculo padrão.');
  c.msg('Se o split B2C for ativado no futuro, as parcelas dos compradores passam a ter split. O cenário aparece à parte e não entra no cálculo padrão.', 'info');
  c.msg('Em loteamento novo, a infraestrutura vem antes das vendas. Nos primeiros 24 meses pode haver saldo credor que o cálculo em regime permanente não capta.', 'alerta');
}

// Locação de imóveis próprios (PJ patrimonial)
function locacaoImoveis(c: Ctx) {
  const aluguel = c.num('aluguel_medio_residencial');
  c.r('aluguel_residencial', 'aliquota_pct_cheia', Math.round(30 * (aluguel > 0 ? Math.max(0, 1 - 600 / aluguel) : 0)));
  const p487 = c.num('pct_contratos_487');
  if (p487 > 0) {
    // HIPÓTESE: pct_contratos_487 é % da receita total e sai de aluguel_pj em pontos percentuais.
    c.r('aluguel_pj', 'participacao_pct', c.num('pct_inquilinos_pj') - p487);
    c.linhasR().push({
      id: 'contratos_487', nome: 'Contratos no regime opcional de 3,65%', participacao_pct: p487, cliente: 'regime_regular', meio: 'boleto',
      prazo_dias: 0, antecipado_pct: 0, aliquota_pct_cheia: 30, aliquota_especifica_por_ano: curvaFixa(3.65), parcela_sujeita_split_pct: 0,
    } as LinhaReceita);
    c.msg(`${fmt(p487, 1)}% da receita foi para contratos do regime opcional de 3,65%, retirados dos aluguéis para empresas. Essa linha ficou fora do split até a Receita confirmar se o regime opcional passa por ele.`, 'info', 'pct_contratos_487');
  }
}

// Locação de andaimes e equipamentos de obra
function locacaoAndaimes(c: Ctx) {
  const reg = c.num('pct_construtoras_regular'), mont = c.num('pct_montagem') / 100, simples = c.num('pct_simples');
  c.r('locacao_construtoras', 'participacao_pct', reg * (1 - mont));
  c.r('montagem_frete', 'participacao_pct', reg * mont);
  c.r('locacao_simples', 'participacao_pct', simples);
  c.r('pf_reformas', 'participacao_pct', 100 - reg - simples);
  const fat = c.num('faturamento_mensal');
  c.c('equipamentos', 'pct_receita', fat > 0 ? 100 * c.num('compra_equipamentos_ano') / 12 / fat : 0);
  const fretes = c.num('pct_fretes');
  c.c('fretes', 'pct_receita', fretes * 4 / 7);
  c.c('fretes_simples', 'pct_receita', fretes * 3 / 7);
  if (c.num('compra_equipamentos_ano') > 0) {
    c.msg('O cálculo usa a média mensal da compra de equipamentos. Se a compra for financiada (Finame, leasing), o crédito acompanha o pagamento de cada parcela. Em ano de compra grande de frota, o saldo credor pontual é maior do que o cálculo mostra.', 'info', 'compra_equipamentos_ano');
  }
  if (c.str('regime_empresa') === 'simples') {
    c.modo('simples_puro', 'Simples puro: a construtora cliente perde cerca de 93% do crédito, porque toma só 7% da cheia em vez de 100%. '
      + textoCredito(c, 100, 'de locação') + ' O efeito aparece no preço líquido que o cliente enxerga. Clientes maiores tendem a exigir o regime regular.');
  }
}

// Imobiliária e corretagem
function imobiliaria(c: Ctx) {
  const adm = c.num('pct_administracao'), pj = c.num('pct_proprietarios_pj') / 100;
  const lanc = c.num('pct_lancamentos'), emp = c.num('pct_empresas');
  c.r('adm_pf', 'participacao_pct', adm * (1 - pj));
  c.r('adm_pj', 'participacao_pct', adm * pj);
  c.r('comissao_lancamento', 'participacao_pct', lanc);
  c.r('comissao_empresas', 'participacao_pct', emp);
  c.r('comissao_pf', 'participacao_pct', 100 - adm - lanc - emp);
  // O imposto da intermediação e da administração nasce em cada pagamento (art. 254, §2º): prazo zero nas comissões de incorporadora e empresas.
  c.r('comissao_lancamento', 'prazo_dias', 0);
  c.r('comissao_empresas', 'prazo_dias', 0);
  const prazo = c.num('prazo_incorporadora');
  if (prazo > 0) {
    c.msg(`A incorporadora leva ${fmt(prazo)} dias para pagar a comissão. O imposto nasce no pagamento (art. 254, §2º), por isso essas comissões entram no cálculo com prazo zero.`, 'info', 'prazo_incorporadora');
  }
  if (c.str('regime_empresa') === 'simples') {
    c.modo('simples_puro', `Simples puro: o IBS/CBS fica no DAS. O regime regular destacaria 50% da cheia sobre a comissão, cerca de ${fmt(c.aliquota(2027) / 2, 1)}% em 2027 e ${fmt(c.aliquota(2033) / 2, 1)}% em 2033. `
      + 'Como a maior parte dos clientes é pessoa física e não toma crédito, o Simples tende a ser melhor. Só imobiliárias de lançamento, que vendem para incorporadoras do regime regular, ganham com o regime regular. Compare com a carga do seu DAS.');
  }
}

// Administradora de condomínios
function administradoraCondominios(c: Ctx) {
  const optantes = c.num('pct_optantes'), locacao = c.num('pct_locacao'), avulsos = c.num('pct_avulsos');
  const honorario = 100 - optantes - locacao - avulsos, conta = c.num('pct_debito_conta') / 100;
  c.r('honorario_conta', 'participacao_pct', honorario * conta);
  c.r('honorario_boleto', 'participacao_pct', honorario * (1 - conta));
  c.r('condominios_optantes', 'participacao_pct', optantes);
  c.r('adm_locacao', 'participacao_pct', locacao);
  c.r('avulsos', 'participacao_pct', avulsos);
  c.msg('O maior impacto está no orçamento do condomínio, que não credita IBS/CBS dos fornecedores. A conversa com o síndico é sobre o preço do honorário.', 'info');
  if (c.str('regime_empresa') === 'simples') {
    const aliq = c.num('aliquota_honorario');
    c.modo('simples_puro', `Simples puro: o IBS/CBS fica no DAS, sem destaque a alíquota cheia. No regime regular, o honorário teria ${fmt(aliq)}% da cheia, cerca de ${fmt(c.aliquota(2027) * aliq / 100, 1)}% do valor em 2027 e ${fmt(c.aliquota(2033) * aliq / 100, 1)}% em 2033. `
      + 'Como o condomínio não toma crédito, o Simples é quase sempre melhor. Compare com a carga do seu DAS e veja o efeito no orçamento do condomínio.');
  }
}

export const derivers: Record<string, Deriver> = {
  'C07-01': construtoraGlobal,
  'C07-02': empreiteiraMaoDeObra,
  'C07-03': instalacoes,
  'C07-04': incorporadora,
  'C07-05': loteadora,
  'C07-06': locacaoImoveis,
  'C07-07': locacaoAndaimes,
  'C07-08': imobiliaria,
  'C07-09': administradoraCondominios,
};

/** Campos que, por desenho, não mudam nenhum alvo quando variam sozinhos a partir do padrão (motivo). */
export const excecoes: Record<string, Record<string, string>> = {};
