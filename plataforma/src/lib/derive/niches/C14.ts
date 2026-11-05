// Fórmulas próprias dos nichos da categoria C14 (campo `derivacao` da base).
// Cada função roda depois das atribuições diretas e antes da normalização. Ver src/lib/derive/core.ts.
import type { Ctx, Deriver } from '../core';

const ANOS = ['2027', '2028', '2029', '2030', '2031', '2032', '2033'];
/** Alíquota somada do regime financeiro (art. 233) sem redutor do ISS, em %. */
const TABELA_SEM_ISS = [10.85, 10.85, 11.0, 11.15, 11.3, 11.5, 12.5];
/** Com redutor do ISS (art. 233), em %. */
const TABELA_COM_ISS = [8.85, 8.85, 9.2, 9.55, 9.9, 10.3, 12.5];

const brl = (x: number) => 'R$ ' + Math.round(x).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
const pc = (x: number) => x.toFixed(1).replace('.', ',') + '%';
const curva = (tabela: number[], fator = 1): Record<string, number> =>
  Object.fromEntries(ANOS.map((a, i) => [a, Math.round(tabela[i] * fator * 1e6) / 1e6]));

/** Cenário da comissão do correspondente: regra geral (alíquota cheia) ou regime financeiro. */
function leituraComissao(c: Ctx, financeiro: boolean) {
  for (const l of ['comissao_vista', 'comissao_diferida']) {
    if (financeiro) c.r(l, 'aliquota_especifica_por_ano', curva(TABELA_SEM_ISS));
    else { c.r(l, 'aliquota_especifica_por_ano', null); c.r(l, 'aliquota_pct_cheia', 100); }
  }
}

export const derivers: Record<string, Deriver> = {
  // Factoring, securitizadora e FIDC
  'C14-01': c => {
    const simples = c.num('pct_cedentes_simples');
    c.r('cedentes_simples', 'participacao_pct', simples);
    c.r('cedentes_regular', 'participacao_pct', 100 - simples);
    // Alíquota específica = tabela do art. 233 × base_pct / 100. O aliquota_pct_cheia da base é só o equivalente de 2028 e não é recalculado.
    const tabela = c.str('tabela_aliquota') === 'com_iss' ? TABELA_COM_ISS : TABELA_SEM_ISS;
    for (const l of ['cedentes_regular', 'cedentes_simples']) c.r(l, 'aliquota_especifica_por_ano', curva(tabela, c.num('base_pct') / 100));
    // Redução da base antecipável = carteira × pct_titulos_split × t / (1 + t), com t = alíquota cheia do ano × alíquota média dos cedentes.
    const carteira = c.num('carteira_mensal'), split = c.num('pct_titulos_split') / 100, med = c.num('aliquota_media_cedentes') / 100;
    const reducao = (cheia: number) => { const t = cheia / 100 * med; return carteira * split * t / (1 + t); };
    const r28 = reducao(c.aliquota(2028)), r33 = reducao(c.aliquota(2033));
    const parte = (x: number) => (carteira > 0 ? pc(x / carteira * 100) : '0,0%');
    c.msg(`Base antecipável: com ${pc(split * 100)} dos títulos no split, a carteira de ${brl(carteira)} por mês perde cerca de ${brl(r28)} em 2028 (${parte(r28)} da carteira) e ${brl(r33)} em 2033 (${parte(r33)}), com alíquota média dos cedentes de ${pc(med * 100)}.`, 'info', 'carteira_mensal');
    c.msg('O caixa próprio da factoring muda pouco, porque o deságio é retido e fica fora do split. O efeito está no produto e nos contratos de cessão.', 'info');
  },

  // Corretora de seguros
  'C14-02': c => {
    const saude = c.num('pct_planos_saude'), hon = c.num('pct_honorarios');
    c.r('comissao_saude', 'participacao_pct', saude);
    c.r('honorarios', 'participacao_pct', hon);
    c.r('comissao_seguros', 'participacao_pct', 100 - saude - hon);
    // HIPÓTESE: "sem redutor do ISS" usa a mesma curva do art. 233 sem redutor (10,85 a 12,5) das demais categorias financeiras.
    c.r('comissao_seguros', 'aliquota_especifica_por_ano', curva(c.str('tabela_corretagem') === 'sem_iss' ? TABELA_SEM_ISS : TABELA_COM_ISS));
  },

  // Correspondente bancário e promotora de crédito
  'C14-03': c => {
    const dif = c.num('pct_diferida'), seg = c.num('pct_seguros');
    c.r('comissao_diferida', 'participacao_pct', dif);
    c.r('comissao_seguros', 'participacao_pct', seg);
    c.r('comissao_vista', 'participacao_pct', 100 - dif - seg);
    const financeiro = c.str('regime_comissao') === 'financeiro';
    leituraComissao(c, financeiro);
    // Resultado de 2033 nas duas leituras: a leitura não escolhida aparece como cenário extra.
    c.extra(financeiro ? 'Leitura pela regra geral (alíquota cheia)' : 'Leitura pelo regime financeiro (10,85% a 12,5%)', cc => leituraComissao(cc, !financeiro),
      'A diferença entre as duas leituras passa de 17 p.p. de alíquota em 2033.');
  },
};

/** Campos que, por desenho, não mudam nenhum alvo quando variam sozinhos a partir do padrão (motivo). */
export const excecoes: Record<string, Record<string, string>> = {};
