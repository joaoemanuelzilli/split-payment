export interface EngineGlobals {
  cbs_referencia_pct: number; ibs_cheio_pct: number; adesao_2027_pct: number; adesao_2028_em_diante_pct: number;
  ressarcimento_dias_extra: number; dias_antecipacao: number; cdi_pct_aa?: number; ano_teste?: number;
  credito_fornecedor_simples_pct_cheia?: number;
}
export interface EngineRow {
  year: number; adoption: number; rate: number; D: number; Cr: number; phi: number; dVendas: number;
  credPrud: number; credFav: number; trapPrud: number; trapFav: number; trapBase: number; prud: number; fav: number; novo_no_ano: number;
}
export interface CashInput { caixa: number; caixa_minimo: number; limites: number; custo_credito_pct_am: number; geracao_caixa_mes: number; cdi_pct_aa: number; }
export interface CashResult { need: number; free: number; fromCash: number; fromCredit: number; gap: number; costYear: number; pctFco: number; verdict: 'verde' | 'amarelo' | 'vermelho'; }
declare const api: {
  YEARS: number[]; IBS_SHARE: Record<number, number>;
  rateFor(year: number, g: EngineGlobals): number;
  run(rec: unknown, receita: number, g: EngineGlobals): EngineRow[];
  cashTest(need: number, c: CashInput): CashResult;
};
export default api;
