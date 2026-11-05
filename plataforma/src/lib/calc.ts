// Cálculo completo de uma simulação: formulário → linhas (derive) → motor v2 → teste de caixa.
// Roda no navegador (recalcula a cada mudança) e no servidor (relatórios e listas).
import E from './engine/engine_v2.js';
import type { CashResult, EngineRow } from './engine/engine_v2';
import type { Nicho, ParametrosGlobais } from './types';
import { derivar, type Derivacao, type Valores } from './derive';

export interface Caixa { caixa: number; caixa_minimo: number; limites: number; custo_credito_pct_am: number; geracao_caixa_mes: number }
export interface Entrada { valores: Valores; parametros: ParametrosGlobais; caixa: Caixa }
export interface Ano {
  ano: number; aliquota: number; debito: number; credito: number; favoravel: number; prudente: number; novo: number;
  debitoAntecipado: number; creditoCondicionado: number; saldoCredor: number; saldoCredorSemSplit: number; adesao: number;
}
export interface TesteCaixa extends CashResult { ano: number }
export interface Resultado {
  derivacao: Derivacao;
  receitaMensal: number;
  anos: Ano[];
  pctMes: (ano: number, cenario: 'favoravel' | 'prudente') => number;
  teste: TesteCaixa;
  testesPorAno: TesteCaixa[];
  extras: { rotulo: string; descricao?: string; anos: Ano[] }[];
  simples?: ComparacaoSimples;
}
export interface ComparacaoSimples {
  anos: { ano: number; aliquota: number; creditoRegular: number; creditoSimples: number; diferencaPorMil: number }[];
  /** Resultado do split se a empresa passar ao regime regular (IBS/CBS por fora). */
  seRegular: Ano[];
}

const ANOS = [2027, 2028, 2029, 2030, 2031, 2032, 2033];

function mapear(rows: EngineRow[]): Ano[] {
  return rows.map(r => ({
    ano: r.year, aliquota: r.rate, debito: r.D, credito: r.Cr, favoravel: r.fav, prudente: r.prud, novo: r.novo_no_ano,
    debitoAntecipado: r.dVendas, creditoCondicionado: r.credPrud, saldoCredor: r.trapPrud, saldoCredorSemSplit: r.trapBase, adesao: r.adoption,
  }));
}
function rodar(modelo: Derivacao['modelo'], p: ParametrosGlobais): Ano[] {
  return mapear(E.run(modelo, modelo.receita_mensal, p));
}

export function calcular(n: Nicho, e: Entrada): Resultado {
  const d = derivar(n, e.valores, e.parametros);
  const p = e.parametros;
  const anos = rodar(d.modelo, p);
  const receita = d.modelo.receita_mensal;
  const cx = { ...e.caixa, cdi_pct_aa: p.cdi_pct_aa };
  const motorRoda = d.modo === 'motor';
  const zero = (a: Ano): Ano => ({ ...a, favoravel: 0, prudente: 0, novo: 0, debitoAntecipado: 0, creditoCondicionado: 0, saldoCredor: 0 });
  const anosEf = motorRoda ? anos : anos.map(zero);
  const testesPorAno = anosEf.map(a => ({ ...E.cashTest(a.prudente, cx), ano: a.ano }));
  const teste = testesPorAno.find(t => t.ano === p.ano_teste) ?? testesPorAno[1];
  const r: Resultado = {
    derivacao: d, receitaMensal: receita, anos: anosEf, teste, testesPorAno,
    pctMes: (ano, c) => { const a = anosEf.find(x => x.ano === ano); return a && receita > 0 ? (100 * a[c]) / receita : 0; },
    extras: d.extras.map(x => ({ rotulo: x.rotulo, descricao: x.descricao, anos: rodar(x.modelo, p) })),
  };
  if (!motorRoda) {
    const fs = (p.credito_fornecedor_simples_pct_cheia ?? 7) / 100;
    r.simples = {
      anos: ANOS.map(ano => {
        const aliq = E.rateFor(ano, p);
        return { ano, aliquota: aliq, creditoRegular: 1000 * aliq, creditoSimples: 1000 * aliq * fs, diferencaPorMil: 1000 * aliq * (1 - fs) };
      }),
      seRegular: anos,
    };
  }
  return r;
}

export function caixaPadrao(n: Nicho): Caixa { return { ...n.caixa_exemplo }; }

/** Custo de carregar a necessidade prudente de cada ano, somado de 2027 a 2033 (juros e CDI do teste de caixa). */
export function custoAcumulado(r: Resultado): number {
  return r.testesPorAno.reduce((s, t) => s + t.costYear, 0);
}

/** Faixa de preço sugerida para o diagnóstico, por faturamento mensal (hipótese editável nas configurações). */
export interface FaixaPreco { ate: number | null; diagnostico: number; acompanhamento: number }
export const FAIXAS_PADRAO: FaixaPreco[] = [
  { ate: 1_000_000, diagnostico: 4_900, acompanhamento: 1_500 },
  { ate: 5_000_000, diagnostico: 9_800, acompanhamento: 2_500 },
  { ate: 20_000_000, diagnostico: 18_000, acompanhamento: 3_700 },
  { ate: null, diagnostico: 35_000, acompanhamento: 6_500 },
];
export function precoSugerido(receitaMensal: number, faixas: FaixaPreco[] = FAIXAS_PADRAO) {
  return faixas.find(f => f.ate === null || receitaMensal <= f.ate) ?? faixas[faixas.length - 1];
}
