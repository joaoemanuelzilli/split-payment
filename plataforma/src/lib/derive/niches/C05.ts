// Fórmulas próprias dos nichos da categoria C05 (campo `derivacao` da base).
// Cada função roda depois das atribuições diretas e antes da normalização. Ver src/lib/derive/core.ts.
import type { Deriver } from '../core';

/** Curva-base do crédito presumido do produtor (% do valor pago), calibrada em credito_presumido_pct = 1,1. */
const CURVA_PRODUTOR: Record<string, number> = { '2027': 1.1, '2028': 1.1, '2029': 1.3, '2030': 1.5, '2031': 1.7, '2032': 1.9, '2033': 3 };

export const derivers: Record<string, Deriver> = {
  // Indústria de higiene pessoal e limpeza popular
  'C05-01': c => {
    // HIPÓTESE: pct_anexo8 é a fatia do Anexo VIII nas vendas totais (50 no padrão, 35 + 15 na base) e as demais
    // linhas regulares ficam com o que sobra depois do Simples. A base tem 35/15 no Anexo VIII e 30/12 nas cheias,
    // isto é, redes ficam com 70% do Anexo VIII e 30/42 do restante quando pct_redes = 71; escalo as duas
    // proporções com pct_redes / 71 para reproduzir o padrão exatamente.
    const regular = 100 - c.num('pct_simples');
    const anexo8 = c.num('pct_anexo8');
    const cheia = Math.max(0, regular - anexo8);
    const k = c.num('pct_redes') / 71;
    const fa = Math.min(1, 0.7 * k), fc = Math.min(1, (30 / 42) * k);
    c.r('anexo8_redes', 'participacao_pct', anexo8 * fa);
    c.r('anexo8_distribuidores', 'participacao_pct', anexo8 * (1 - fa));
    c.r('cheia_redes', 'participacao_pct', cheia * fc);
    c.r('cheia_distribuidores', 'participacao_pct', cheia * (1 - fc));
    const mp = c.num('pct_materia_prima');
    c.c('quimicos', 'pct_receita', (mp * 30) / 44);
    c.c('embalagens', 'pct_receita', (mp * 14) / 44);
    if (anexo8 > 85) c.msg('Com mais de 85% das vendas em itens do Anexo VIII, o crédito das compras pode passar do imposto das vendas. Há risco de saldo credor.', 'alerta', 'pct_anexo8');
  },
  // Indústria de alimentos do Anexo VII (polpas, sucos naturais, mel, pão de forma etc.)
  'C05-02': c => {
    // anexo7_redes é o resto das demais linhas (anexo7_food fica como na base)
    c.r('cheia', 'participacao_pct', c.num('pct_cheia'));
    c.r('anexo7_simples', 'participacao_pct', c.num('pct_simples'));
    c.r('exportacao', 'participacao_pct', c.num('pct_exportacao'));
    const food = c.getR('anexo7_food', 'participacao_pct') as number;
    c.r('anexo7_redes', 'participacao_pct', 100 - c.num('pct_cheia') - c.num('pct_simples') - c.num('pct_exportacao') - food);
    // crédito presumido do produtor: a curva por ano acompanha a alíquota de referência de cada ano.
    // HIPÓTESE: a razão entre os anos é a da curva da base (1,1 / 1,1 / 1,3 / ... / 3,0); arredondo a 0,1.
    const cp = c.num('credito_presumido_pct');
    const curva: Record<string, number> = {};
    for (const [ano, v] of Object.entries(CURVA_PRODUTOR)) curva[ano] = Math.round(((cp * v) / 1.1) * 10) / 10;
    c.c('materia_produtor', 'credito_fixo_pct_valor_por_ano', curva);
    if (c.num('pct_insumo_reduzido') > 50) c.msg('Com insumos do Anexo VII acima de 50% do faturamento (refinadora de óleo, por exemplo), o crédito pode passar do imposto das vendas. Há risco de saldo credor.', 'alerta', 'pct_insumo_reduzido');
  },
  // Distribuidor de limpeza, higiene e descartáveis
  'C05-03': c => {
    // Alíquota média ponderada pelo mix do Anexo VIII, arredondada ao ponto inteiro (77,8 vira 78 no padrão).
    // HIPÓTESE: Simples (70) e público (85) mantêm as alíquotas da base, que a derivacao cita como valores fixos.
    const a = c.num('pct_anexo8') / 100, custo = c.num('custo_mercadoria');
    const media = Math.min(100, Math.max(0, Math.round(40 * a + 100 * (1 - a))));
    c.r('empresas_regular', 'aliquota_pct_cheia', media);
    c.r('condominios', 'aliquota_pct_cheia', media);
    c.r('mercados_simples', 'aliquota_pct_cheia', 70);
    // HIPÓTESE: as compras também são arredondadas ao ponto inteiro (70 × 37% = 25,9 vira 26, como na base).
    const anexo8 = Math.round(custo * a);
    c.c('anexo8_compra', 'pct_receita', anexo8);
    c.c('fornecedor_simples', 'pct_receita', 4);
    c.c('cheia_compra', 'pct_receita', custo - anexo8 - 4);
  },
};

/** Campos que, por desenho, não mudam nenhum alvo quando variam sozinhos a partir do padrão (motivo). */
export const excecoes: Record<string, Record<string, string>> = {};
