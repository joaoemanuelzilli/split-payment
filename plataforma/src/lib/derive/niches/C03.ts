// Fórmulas próprias dos nichos da categoria C03 (campo `derivacao` da base).
// Cada função roda depois das atribuições diretas e antes da normalização. Ver src/lib/derive/core.ts.
import type { Ctx, Deriver } from '../core';

/** Mensagem do nicho para o regime "Simples puro" (regras_especiais_calculo). */
const SIMPLES_PURO: Record<string, string> = {
  'C03-01': "No Simples puro, o supermercado paga IBS/CBS dentro do DAS, não destaca imposto e não toma crédito: o split e o crédito condicionado quase não mudam seu caixa. Vale comparar o DAS com o regime regular, em que a cesta básica tem alíquota zero e o crédito das compras abate o imposto, e ver quantos clientes empresa vão pedir nota com crédito cheio.",
  'C03-02': "No Simples puro, a loja não destaca IBS/CBS e não toma crédito; o split quase não muda seu caixa. O risco é outro: a construtora do regime regular toma só cerca de 7% do imposto como crédito comprando de você, contra 100% comprando de um concorrente do regime regular. Compare o DAS com o regime regular olhando a fatia de vendas a construtoras.",
  'C03-03': "No Simples puro, você não destaca IBS/CBS nem toma crédito da comissão, do frete e da mercadoria; o split quase não muda seu caixa. Atenção: se a plataforma passar a reter o imposto no repasse, o optante pode quitar IBS/CBS por split, DAS ou RAD. Compare o DAS com o regime regular, em que comissão, frete e anúncios geram crédito.",
  'C03-04': "No Simples puro, a revenda paga IBS/CBS dentro do DAS sobre o preço cheio de venda e não tem o crédito presumido dos usados comprados de pessoa física (art. 171), que só existe no regime regular. Para seminovos, o regime regular tributa na prática a margem. Faça essa comparação antes de olhar o caixa.",
  'C03-05': "No Simples puro, sua loja paga IBS/CBS dentro do DAS, não destaca imposto e não toma crédito: o split e o crédito condicionado quase não mexem no seu caixa até o cartão entrar no split, ainda sem data. A conversa certa é o regime: compare o DAS com o regime regular, olhando quanto você compra de confecções do regime regular e se paga aluguel a empresa.",
  'C03-06': "No Simples puro, a loja de calçados paga IBS/CBS dentro do DAS e não toma crédito: o split quase não muda seu caixa até o cartão entrar, sem data. Como você compra muito de indústrias do regime regular, compare o DAS com o regime regular, em que esse crédito abate o imposto da venda.",
  'C03-07': "No Simples puro, a loja paga IBS/CBS dentro do DAS e não toma crédito; o split quase não muda seu caixa até o B2C entrar, sem data. Compare o DAS com o regime regular olhando o peso das compras da indústria e das vendas a empresas e hotéis.",
  'C03-08': "No Simples puro, você paga IBS/CBS dentro do DAS e não toma crédito; o split quase não muda seu caixa. O risco está nas frotas: a empresa do regime regular toma só cerca de 7% de crédito comprando de você. Compare o DAS com o regime regular pela fatia de frotas e seguradoras.",
  'C03-09': "No Simples puro, o pet shop paga IBS/CBS dentro do DAS e não toma crédito; o split quase não muda seu caixa. Se a ração pesa muito nas vendas, compare com o regime regular: a ração vem com imposto cheio dos distribuidores e esse crédito abateria o imposto da venda.",
  'C03-10': "No Simples puro ou no MEI, o salão paga IBS/CBS dentro da guia e não toma crédito; o split não muda seu caixa. Como quase todo o custo é mão de obra, o regime regular raramente compensa. Esse nicho não precisa de diagnóstico de caixa; vale revisar o contrato de salão-parceiro.",
  'C03-11': "No Simples puro, a academia paga IBS/CBS dentro do DAS e não toma crédito; o split quase não muda seu caixa. Antes de olhar o caixa, confirme o enquadramento: musculação e ginástica têm redução de 30% se a academia for registrada no CREF, e aulas de modalidades esportivas podem ter redução de 60%. Compare o DAS com o regime regular considerando o crédito do aluguel e da energia.",
  'C03-12': "No Simples puro, a ótica paga IBS/CBS dentro do DAS e não toma crédito; o split quase não muda seu caixa até o cartão entrar, sem data. Lentes, armações e óculos de grau não têm redução nas listas da LC 214; confira os NCMs do seu cadastro e compare o DAS com o regime regular.",
  'C03-13': "No Simples puro, a livraria e papelaria paga pelo DAS e não toma crédito; o split quase não muda seu caixa. No regime regular, os livros imunes não pagam IBS/CBS e você mantém o crédito de aluguel, energia e serviços; compare os dois pela fatia de livros e de vendas a escolas.",
  'C03-14': "No Simples puro, a conveniência paga IBS/CBS dentro do DAS e não toma crédito; o split quase não muda seu caixa. O Imposto Seletivo é cobrado na fábrica e só aparece no preço de compra. Compare o DAS com o regime regular: bebidas e cigarros têm margem baixa e vêm com IBS/CBS cheio, que viraria crédito.",
  'C03-15': "No Simples puro, a lavanderia paga IBS/CBS dentro da guia e não toma crédito; o split não muda seu caixa. Se você atende hotéis e clínicas do regime regular, saiba que eles tomam só cerca de 7% de crédito comprando de você; compare o DAS com o regime regular pela fatia desses clientes.",
};

const lim = (x: number, lo = 0, hi = 100) => Math.min(hi, Math.max(lo, x));

/** Simples puro: o motor não roda e o usuário vê a mensagem própria do nicho. */
function regime(c: Ctx, id: string) {
  if (c.str('regime_ibs_cbs') === 'simples_puro') c.modo('simples_puro', SIMPLES_PURO[id]);
}

/** Atraso do crédito limitado ao vencimento do fornecedor: aviso quando o prazo passa de cerca de 30 dias. */
function avisoPrazo(c: Ctx) {
  if (c.num('prazo_fornecedor') > 30) {
    c.msg('O atraso do crédito é limitado ao vencimento do fornecedor, no último dia útil do mês seguinte. Prazo acima de cerca de 30 dias não aumenta o atraso no cálculo. Pagar à vista ou em menos de 30 dias traz o crédito para o mesmo mês.', 'info', 'prazo_fornecedor');
  }
}

/** Cenário futuro: linhas de consumidor entram no split (só exibição; o resultado principal não muda). */
function cartaoFuturo(c: Ctx, linhas: string[]) {
  if (!c.bool('simular_cartao_futuro')) return;
  c.extra('Cenário futuro: consumidor no cartão e no Pix entra no split', cc => { for (const l of linhas) cc.r(l, 'parcela_sujeita_split_pct', 100); },
    'Não há data nem norma para essa fase. O resultado principal continua com as regras da etapa 1.');
  c.msg('A simulação do cartão no split é um cenário futuro: não há data nem norma para essa fase. O resultado principal não muda.', 'alerta', 'simular_cartao_futuro');
}

export const derivers: Record<string, Deriver> = {
  // Supermercado e mercado de bairro
  'C03-01': c => {
    regime(c, 'C03-01');
    const cesta = c.num('pct_cesta'), a7 = c.num('pct_anexo7'), hig = c.num('pct_higiene'), sel = c.num('pct_seletivo');
    const emp = c.num('pct_empresas'), f = 1 - emp / 100;
    const cmv = c.num('pct_cmv') / 100, fs = c.num('pct_fornecedor_simples') / 100;
    const semCesta = 100 - cesta - a7 - hig; // inclui o seletivo, que entra com alíquota cheia
    c.r('empresas', 'participacao_pct', emp);
    c.r('cesta_zero', 'participacao_pct', cesta * f);
    c.r('alimentos_reduzidos', 'participacao_pct', a7 * f);
    c.r('higiene_limpeza', 'participacao_pct', hig * f);
    c.r('seletivo', 'participacao_pct', sel * f);
    c.r('cheia', 'participacao_pct', (semCesta - sel) * f);
    c.r('empresas', 'aliquota_pct_cheia', lim((40 * (a7 + hig) + 100 * semCesta) / 100));
    c.c('compra_cheia', 'pct_receita', cmv * semCesta * (1 - fs)); // compras da cesta não geram crédito
    c.c('compra_reduzida', 'pct_receita', cmv * (a7 + hig) * (1 - fs));
    c.c('compra_simples', 'pct_receita', cmv * (100 - cesta) * fs);
    if (cesta + a7 + hig + sel > 100) c.msg('A soma de cesta, outros alimentos, higiene e bebidas e cigarros passa de 100%. Corrija os percentuais.', 'alerta', 'pct_cesta');
    avisoPrazo(c);
  },
  // Loja de materiais de construção
  'C03-02': c => {
    regime(c, 'C03-02');
    avisoPrazo(c);
  },
  // E-commerce e vendedor de marketplace
  'C03-03': c => {
    regime(c, 'C03-03');
    c.r('marketplace', 'parcela_sujeita_split_pct', c.bool('plataforma_retem') ? 100 : 0);
    avisoPrazo(c);
  },
  // Revenda de veículos seminovos e concessionária
  'C03-04': c => {
    regime(c, 'C03-04');
    const fin = c.num('pct_financiado'), fro = c.num('pct_frotistas'), com = c.num('pct_comissao');
    const pvPf = c.num('pct_pos_venda_pf'), pvEmp = c.num('pct_pos_venda_empresas');
    c.r('pf_financiado', 'participacao_pct', fin);
    c.r('frotistas', 'participacao_pct', fro);
    c.r('comissao_montadora', 'participacao_pct', com);
    c.r('pos_venda_pf', 'participacao_pct', pvPf);
    c.r('pos_venda_empresas', 'participacao_pct', pvEmp);
    c.r('pf_avista', 'participacao_pct', 100 - fin - fro - com - pvPf - pvEmp);
    if (c.bool('simular_financiamento')) {
      c.extra('Cenário futuro: banco financiador retém o imposto no TED', cc => cc.r('pf_financiado', 'parcela_sujeita_split_pct', 100),
        'Segundo cálculo só para exibição, fora da etapa 1: o banco retém o imposto no TED do financiamento.');
      c.msg('A retenção pelo banco financiador é um cenário futuro, fora da etapa 1. O resultado principal não muda.', 'alerta', 'simular_financiamento');
    }
    if (c.num('pct_usados_pf') > 0) c.msg('O crédito presumido dos usados comprados de pessoa física só abate a revenda do próprio veículo e não gera ressarcimento. Se o resultado mostrar saldo credor e o estoque de usados for grande, confira esse ponto.', 'info', 'pct_usados_pf');
    avisoPrazo(c);
  },
  // Loja de roupas e acessórios
  'C03-05': c => {
    regime(c, 'C03-05');
    cartaoFuturo(c, ['cartao_parcelado', 'cartao_vista', 'pix_dinheiro', 'crediario']);
    avisoPrazo(c);
  },
  // Loja de calçados
  'C03-06': c => {
    regime(c, 'C03-06');
    cartaoFuturo(c, ['cartao_parcelado', 'cartao_vista', 'pix_dinheiro']);
    avisoPrazo(c);
  },
  // Loja de móveis e eletrodomésticos
  'C03-07': c => {
    regime(c, 'C03-07');
    cartaoFuturo(c, ['cartao_parcelado', 'crediario', 'pix_dinheiro', 'debito']);
    if (c.bool('simular_cartao_futuro')) c.msg('No crediário, a loja já adianta hoje o imposto de todas as parcelas. O cenário futuro mede só a perda adicional.', 'info', 'simular_cartao_futuro');
    avisoPrazo(c);
  },
  // Autopeças varejo e oficina mecânica
  'C03-08': c => {
    regime(c, 'C03-08');
    c.msg('As seguradoras foram tratadas como regime regular, com pagamento por TED. O enquadramento no sinistro ainda está pendente.', 'info', 'pct_seguradoras');
    avisoPrazo(c);
  },
  // Pet shop e banho e tosa
  'C03-09': c => {
    regime(c, 'C03-09');
    avisoPrazo(c);
  },
  // Salão de beleza, barbearia e estética
  'C03-10': c => {
    regime(c, 'C03-10');
    c.msg('O faturamento deve ser informado sem a cota-parte dos profissionais parceiros. O tratamento dessa cota no IBS/CBS ainda está pendente.', 'info', 'faturamento_mensal');
    avisoPrazo(c);
  },
  // Academia e estúdio de atividade física
  'C03-11': c => {
    regime(c, 'C03-11');
    // recorrente perde a fatia que o usuário declara como aulas de modalidades esportivas (redução de 60%, já na linha)
    c.r('aulas_esportivas', 'participacao_pct', c.num('pct_aulas'));
    c.r('recorrente', 'participacao_pct', Math.max(0, c.num('pct_recorrente') - c.num('pct_aulas')));
    c.msg('Os agregadores corporativos foram tratados como regime regular, com pagamento por TED. Isso depende de quem é o adquirente no contrato.', 'info', 'pct_agregadores');
    avisoPrazo(c);
  },
  // Ótica
  'C03-12': c => {
    regime(c, 'C03-12');
    cartaoFuturo(c, ['cartao_parcelado', 'cartao_vista', 'pix_dinheiro']);
    avisoPrazo(c);
  },
  // Papelaria e livraria
  'C03-13': c => {
    regime(c, 'C03-13');
    const livros = c.num('pct_livros'), custo = c.num('pct_custo_papelaria') / 100;
    c.r('livros', 'participacao_pct', livros);
    c.c('livros_compra', 'pct_receita', (livros * 65) / 100); // custo médio do livro: 65% da venda
    c.c('papelaria_regular', 'pct_receita', custo * (100 - livros) * 0.9);
    c.c('papelaria_simples', 'pct_receita', custo * (100 - livros) * 0.1);
    if (livros > 60) c.msg('Com mais de 60% de livros, o crédito das compras pode passar do imposto das vendas. A sobra vai para ressarcimento, que demora.', 'alerta', 'pct_livros');
    c.msg('Na volta às aulas, as compras e as vendas a escolas concentram o efeito em janeiro e fevereiro. O cálculo usa a média mensal.', 'alerta');
    avisoPrazo(c);
  },
  // Loja de conveniência
  'C03-14': c => {
    regime(c, 'C03-14');
    const alc = c.num('pct_alcoolicas'), cig = c.num('pct_cigarros'), ac = c.num('pct_acucaradas');
    const lan = c.num('pct_lanches'), div = c.num('pct_diversos');
    const cesta = 100 - alc - cig - ac - lan - div; // a cesta é o que sobra
    const bebBruta = (c.num('pct_custo_bebidas') / 100) * (alc + cig + ac);
    const divBruta = 0.65 * div; // custo médio dos itens diversos: 65% da venda
    c.r('alcoolicas', 'participacao_pct', alc);
    c.r('cigarros', 'participacao_pct', cig);
    c.r('acucaradas', 'participacao_pct', ac);
    c.r('lanches_preparados', 'participacao_pct', lan);
    c.r('diversos', 'participacao_pct', div);
    c.r('cesta', 'participacao_pct', cesta);
    c.c('bebidas_cigarros', 'pct_receita', bebBruta * 0.94);
    c.c('outros_produtos', 'pct_receita', divBruta * 0.94);
    c.c('fornecedor_simples', 'pct_receita', 0.06 * (bebBruta + divBruta)); // 6% das compras de mercadoria
    c.c('insumos_lanches', 'pct_receita', 0.4 * lan);
    if (Math.abs(c.num('pct_cesta') - cesta) > 0.05) c.msg(`A cesta básica é o que sobra dos outros grupos: ${Math.max(0, cesta).toFixed(1).replace('.', ',')}% das vendas. O valor digitado não é usado.`, 'info', 'pct_cesta');
    if (cesta < 0) c.msg('A soma dos grupos passa de 100%. Corrija os percentuais.', 'alerta', 'pct_cesta');
    avisoPrazo(c);
  },
  // Lavanderia e serviços domésticos
  'C03-15': c => {
    regime(c, 'C03-15');
    avisoPrazo(c);
  },
};

/** Campos que, por desenho, não mudam nenhum alvo quando variam sozinhos a partir do padrão (motivo). */
const HIBRIDO = 'Simples com IBS/CBS por fora roda o motor com as mesmas linhas do regime regular; só o Simples puro muda o resultado.';

export const excecoes: Record<string, Record<string, string>> = {
  'C03-01': { regime_ibs_cbs: HIBRIDO },
  'C03-02': { regime_ibs_cbs: HIBRIDO },
  'C03-03': { regime_ibs_cbs: HIBRIDO },
  'C03-04': { regime_ibs_cbs: HIBRIDO },
  'C03-05': { regime_ibs_cbs: HIBRIDO },
  'C03-06': { regime_ibs_cbs: HIBRIDO },
  'C03-07': { regime_ibs_cbs: HIBRIDO },
  'C03-08': { regime_ibs_cbs: HIBRIDO },
  'C03-09': { regime_ibs_cbs: HIBRIDO },
  'C03-10': { regime_ibs_cbs: HIBRIDO },
  'C03-11': { regime_ibs_cbs: HIBRIDO },
  'C03-12': { regime_ibs_cbs: HIBRIDO },
  'C03-13': { regime_ibs_cbs: HIBRIDO },
  'C03-14': { regime_ibs_cbs: HIBRIDO, pct_cesta: 'A cesta básica é o que sobra dos outros grupos (derivacao: 100 menos a soma); o valor digitado só gera um aviso.' },
  'C03-15': { regime_ibs_cbs: HIBRIDO },
};
