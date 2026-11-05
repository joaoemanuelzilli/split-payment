// Fórmulas próprias dos nichos da categoria C13 (campo `derivacao` da base).
// Cada função roda depois das atribuições diretas e antes da normalização. Ver src/lib/derive/core.ts.
// Simples puro (regime_empresa = simples_puro) é tratado pela camada genérica (modo simples_puro).
import type { Deriver } from '../core';

const brl = (x: number) => 'R$ ' + Math.round(x).toLocaleString('pt-BR');
const ALERTA_177 = 'Na compra direta do produtor ou importador, o adquirente responde solidariamente pelo imposto não pago (art. 177). Pagar pelo split afasta o risco (art. 177, §1º, I).';

// C13-01 Provedor regional de internet
const c1301: Deriver = c => {
  const reg = c.num('pct_empresas_regular');
  const simp = c.num('pct_empresas_simples');
  const pub = c.num('pct_publico');
  const cartao = c.num('pct_cartao');
  c.r('empresa_regular', 'participacao_pct', reg);
  c.r('empresa_simples', 'participacao_pct', simp);
  c.r('publico', 'participacao_pct', pub);
  c.r('pf_cartao', 'participacao_pct', cartao);
  c.r('pf_boleto_pix', 'participacao_pct', 100 - reg - simp - pub - cartao);
  // Cenário de alerta: o split chegando ao consumidor (não soma ao resultado principal).
  c.extra('Se o split chegar ao consumidor', cc => cc.r('pf_boleto_pix', 'parcela_sujeita_split_pct', 100),
    'Recalcula com 100% da linha de assinantes residenciais (boleto e Pix) sujeita a split.');
  // Cashback do CadÚnico: valor mensal do desconto na fatura.
  // CBS de referência em uso; de 2029 em diante soma 20% do IBS do ano, que vai só no texto.
  const baixa = c.num('pct_baixa_renda');
  if (baixa > 0) {
    const pf = c.getR('pf_boleto_pix', 'participacao_pct') + c.getR('pf_cartao', 'participacao_pct');
    const desconto = (c.v['faturamento'] as number) * (pf / 100) * (baixa / 100) * (c.p.cbs_referencia_pct / 100);
    c.msg(`Cashback do CadÚnico: o desconto dado aos clientes de baixa renda é de cerca de ${brl(desconto)} por mês em 2027 e 2028. A partir de 2029 soma 20% do IBS do ano. Se o regulamento não deixar abater esse valor na mesma apuração, ele vira caixa adiantado ao cliente.`, 'info', 'pct_baixa_renda');
  }
};

// C13-02 Integrador de energia solar
const c1302: Deriver = c => {
  const inst = c.num('pct_instalacao');
  const aliq = (100 - inst) + (inst * c.num('aliquota_instalacao')) / 100;
  for (const l of c.linhasR()) c.r(l.id, 'aliquota_pct_cheia', aliq);
  const emp = c.num('pct_empresas');
  const sinal = c.num('pct_sinal') / 100;
  const agro = c.num('pct_agro');
  const simp = c.num('pct_simples');
  const avista = c.num('pct_pf_avista');
  c.r('empresa_sinal', 'participacao_pct', emp * sinal);
  c.r('empresa_saldo', 'participacao_pct', emp * (1 - sinal));
  c.r('agro_pf', 'participacao_pct', agro);
  c.r('simples', 'participacao_pct', simp);
  c.r('pf_avista', 'participacao_pct', avista);
  c.r('pf_financiado', 'participacao_pct', 100 - emp - avista - agro - simp);
  c.msg('O sinal é tratado como recebimento à vista. Se o kit for entregue meses depois, o efeito real pode ser maior.', 'info');
  if (c.num('pct_kit') > 75) c.msg('O kit passa de 75% da receita. Pode haver saldo credor nos meses de compra de estoque.', 'alerta', 'pct_kit');
  if (c.num('faturamento_direto') > 0) {
    // HIPÓTESE: só aviso; a base não dá fórmula numérica para a parcela faturada direto pelo fornecedor.
    c.msg('Com faturamento direto do kit ao cliente, a receita informada deve ser só a do integrador e o custo do kit sai das compras. A linha de vendas passa a ter só a alíquota da instalação.', 'alerta', 'faturamento_direto');
  }
};

// C13-03 Posto de combustível
const c1303: Deriver = c => {
  const frota = c.num('pct_frota');
  const loja = c.num('pct_loja');
  const lub = c.num('pct_lubrificantes');
  c.r('comb_frota', 'participacao_pct', frota);
  c.r('loja', 'participacao_pct', loja);
  c.r('lubrificantes_servicos', 'participacao_pct', lub);
  c.r('comb_consumidor', 'participacao_pct', 100 - frota - loja - lub);
  c.c('mercadorias_loja', 'pct_receita', loja * 0.7);
  c.c('lubrificantes', 'pct_receita', lub * 0.7);
  if (c.bool('compra_direta_importador')) c.msg(ALERTA_177, 'alerta', 'compra_direta_importador');
  c.msg('A frota cliente credita o combustível pela nota. Emitir NF-e com o CNPJ do cliente é argumento de venda.', 'info');
};

// C13-04 Distribuidora de gás GLP
const c1304: Deriver = c => {
  const reg = c.num('pct_revendas_regular');
  const simp = c.num('pct_revendas_simples');
  const granel = c.num('pct_granel');
  const serv = c.num('pct_servicos');
  c.r('revendas_regular', 'participacao_pct', reg);
  c.r('revendas_simples', 'participacao_pct', simp);
  c.r('granel_empresas', 'participacao_pct', granel);
  c.r('servicos', 'participacao_pct', serv);
  c.r('familias', 'participacao_pct', 100 - reg - simp - granel - serv);
  if (c.bool('compra_direta_produtor')) c.msg(ALERTA_177 + ' Recomendo aderir ao split na compra.', 'alerta', 'compra_direta_produtor');
};

// C13-05 TRR (revenda de diesel a frotas e agro)
const c1305: Deriver = c => {
  const frotas = c.num('pct_frotas');
  const agro = c.num('pct_agro');
  const arla = c.num('pct_arla');
  c.r('frotas_regular', 'participacao_pct', frotas);
  c.r('agro_pf', 'participacao_pct', agro);
  c.r('arla_lub', 'participacao_pct', arla);
  c.c('arla_lub_compra', 'pct_receita', arla * 0.76);
  c.r('simples', 'participacao_pct', 100 - frotas - agro - arla);
  if (c.bool('compra_direta_importador')) c.msg(ALERTA_177 + ' Recomendo pagar pelo split.', 'alerta', 'compra_direta_importador');
  c.msg('A NF-e com o valor ad rem é o que garante o crédito da frota cliente. É um argumento comercial contra a venda informal.', 'info');
};

// C13-06 Comercializadora e gestão de energia
const c1306: Deriver = c => {
  const livre = c.num('pct_consumidor_livre');
  const fora = c.num('pct_fora_regular');
  const gestao = c.num('pct_gestao');
  c.r('consumidor_livre', 'participacao_pct', livre);
  c.r('fora_regular', 'participacao_pct', fora);
  c.r('gestao', 'participacao_pct', gestao);
  c.r('revenda_agentes', 'participacao_pct', 100 - livre - fora - gestao);
  // HIPÓTESE: o motor não é acessível aqui; mostro a margem bruta mensal em reais para o usuário dividir pela necessidade extra de caixa do resultado.
  const margem = c.num('vendas_energia') * (c.num('margem_bruta') / 100);
  c.msg(`Margem bruta mensal estimada: ${brl(margem)}. Divida a necessidade extra de caixa do resultado por esse valor para ver quantos meses de margem ficam presos no split.`, 'info', 'margem_bruta');
  if (gestao >= 100) c.msg('Com 100% de gestão, o efeito é o de um prestador de serviço com alíquota cheia.', 'info', 'pct_gestao');
};

export const derivers: Record<string, Deriver> = {
  'C13-01': c1301, 'C13-02': c1302, 'C13-03': c1303, 'C13-04': c1304, 'C13-05': c1305, 'C13-06': c1306,
};

/** Campos que, por desenho, não mudam nenhum alvo quando variam sozinhos a partir do padrão (motivo). */
export const excecoes: Record<string, Record<string, string>> = {};
