// Fórmulas próprias dos nichos da categoria C12 (campo `derivacao` da base).
// Cada função roda depois das atribuições diretas e antes da normalização. Ver src/lib/derive/core.ts.
// Simples puro (regime_empresa = simples_puro) é tratado pela camada genérica (modo simples_puro).
import type { Deriver } from '../core';

// C12-01 Transportadora rodoviária de cargas
const c1201: Deriver = c => {
  const reg = c.num('pct_embarcador_regular');
  const avista = c.num('pct_avista') / 100;
  const exp = c.num('pct_exportacao');
  const sub = c.num('pct_subcontratadas');
  const subSimples = c.num('pct_sub_simples') / 100;
  c.r('fatura_embarcador', 'participacao_pct', reg * (1 - avista));
  c.r('frete_avista', 'participacao_pct', reg * avista);
  c.r('exportacao', 'participacao_pct', exp);
  c.r('cliente_simples', 'participacao_pct', 100 - reg - exp);
  c.c('sub_regular', 'pct_receita', sub * (1 - subSimples));
  c.c('sub_simples', 'pct_receita', sub * subSimples);
  c.msg('O crédito de diesel e de autônomos é fixo por ano. Mudar a CBS de referência ou o IBS cheio no formulário não altera esses créditos.', 'info');
  if (exp > 0) c.msg('O frete só sai sem imposto se a carga for exportada no prazo do regulamento. Se não for, a transportadora responde com juros e multa (art. 80, §4º).', 'alerta', 'pct_exportacao');
};

// C12-02 Operador logístico e armazém geral
const c1202: Deriver = c => {
  const reg = c.num('pct_cliente_regular');
  const fixa = c.num('pct_fixa') / 100;
  const exp = c.num('pct_exportacao');
  const fretes = c.num('pct_fretes');
  const tac = c.num('pct_tac') / 100;
  // HIPÓTESE: os padrões 35,9 e 33,3 são arredondados (28/78 e 1/3); arredondar a 2 casas reproduz exatamente as linhas da base (28, 50, 8 e 4).
  const d2 = (x: number) => Math.round(x * 100) / 100;
  c.r('parcela_fixa', 'participacao_pct', d2(reg * fixa));
  c.r('operacao_variavel', 'participacao_pct', d2(reg * (1 - fixa)));
  c.r('exportacao', 'participacao_pct', exp);
  c.r('cliente_simples', 'participacao_pct', 100 - reg - exp);
  c.c('fretes_pj', 'pct_receita', d2(fretes * (1 - tac)));
  c.c('autonomos_tac', 'pct_receita', d2(fretes * tac));
  if (c.num('investimento_mes') > 15) c.msg('O investimento do mês passa de 15% do faturamento. O saldo credor tende a crescer. Confira o prazo de ressarcimento.', 'alerta', 'investimento_mes');
};

// C12-03 Fretamento contínuo para empresas
const c1203: Deriver = c => {
  c.r('contrato_empresa', 'participacao_pct', c.num('pct_contratos'));
  c.r('publico', 'participacao_pct', c.num('pct_publico'));
  c.r('eventual_turismo', 'participacao_pct', 100 - c.num('pct_contratos') - c.num('pct_publico'));
  if (c.num('aliquota_fretamento') === 60) c.msg('A leitura padrão é alíquota cheia. A redução de 40% precisa de parecer sobre o enquadramento.', 'alerta', 'aliquota_fretamento');
  if (c.num('compra_onibus') > 30) c.msg('A compra de ônibus passa de 30% da receita. O saldo credor no mês da compra tende a ser alto.', 'alerta', 'compra_onibus');
};

// C12-04 Transporte intermunicipal de passageiros
const c1204: Deriver = c => {
  c.r('passagens_cartao', 'participacao_pct', c.num('pct_cartao'));
  c.r('encomendas', 'participacao_pct', c.num('pct_encomendas'));
  c.r('corporativo', 'participacao_pct', c.num('pct_corporativo'));
  c.r('passagens_pix', 'participacao_pct', 100 - c.num('pct_cartao') - c.num('pct_encomendas') - c.num('pct_corporativo'));
};

// C12-05 Entregas urbanas e last mile
const c1205: Deriver = c => {
  c.r('ecommerce', 'participacao_pct', c.num('pct_ecommerce'));
  c.r('varejo_regular', 'participacao_pct', c.num('pct_varejo'));
  c.r('pf', 'participacao_pct', c.num('pct_pf'));
  c.r('simples', 'participacao_pct', 100 - c.num('pct_ecommerce') - c.num('pct_varejo') - c.num('pct_pf'));
  if (c.str('credito_presumido') === 'nao') {
    const curva = c.getC('entregadores', 'credito_fixo_pct_valor_por_ano') as Record<string, number>;
    c.c('entregadores', 'credito_fixo_pct_valor_por_ano', Object.fromEntries(Object.keys(curva).map(a => [a, 0])));
  }
};

// C12-06 Despachante aduaneiro e agente de carga
const c1206: Deriver = c => {
  const imp = c.num('pct_importacao');
  const exp = c.num('pct_exportacao');
  const ext = c.num('pct_exterior');
  c.r('importacao_regular', 'participacao_pct', imp);
  c.r('exportacao', 'participacao_pct', exp);
  c.r('agente_exterior', 'participacao_pct', ext);
  c.r('importador_simples', 'participacao_pct', 100 - imp - exp - ext);
  if (c.num('reembolso_na_nota') > 0) c.msg('O reembolso só sai da base de cálculo se o documento estiver em nome do cliente (art. 12, §2º, IV). Some esse valor à linha de importação para ver o efeito.', 'alerta', 'reembolso_na_nota');
  if (exp > 60) c.msg('Com mais de 60% da receita em exportação, pode haver saldo credor. Confira o prazo de ressarcimento.', 'alerta', 'pct_exportacao');
};

export const derivers: Record<string, Deriver> = {
  'C12-01': c1201, 'C12-02': c1202, 'C12-03': c1203, 'C12-04': c1204, 'C12-05': c1205, 'C12-06': c1206,
};

/** Campos que, por desenho, não mudam nenhum alvo quando variam sozinhos a partir do padrão (motivo). */
export const excecoes: Record<string, Record<string, string>> = {};
