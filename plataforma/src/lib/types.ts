// Tipos da base de nichos (versão 1.1). Ver data/base-nichos-split.json e o dicionário em docs/.
export type Cliente = 'regime_regular' | 'simples' | 'consumidor_final' | 'publico' | 'exportacao' | 'misto' | 'produtor_nao_contribuinte' | 'plataforma';
export type Meio = 'pix_ted' | 'boleto' | 'tef' | 'medicao' | 'adiantamento' | 'cartao' | 'voucher' | 'repasse_financiamento' | 'dinheiro' | 'outro';

export interface LinhaReceita {
  id: string; nome: string; participacao_pct: number; cliente: Cliente; meio: Meio; prazo_dias: number; antecipado_pct: number;
  aliquota_pct_cheia: number; aliquota_especifica_por_ano?: Record<string, number> | null; parcela_sujeita_split_pct: number; observacao?: string;
}
export interface LinhaCompra {
  id: string; nome: string; pct_receita: number; credito_pct_cheia?: number; credito_fixo_pct_valor_por_ano?: Record<string, number> | null;
  condicionado: boolean; observacao?: string;
}
export type TipoCampo = 'moeda' | 'percentual' | 'dias' | 'meses' | 'numero' | 'selecao' | 'booleano';
export type ValorCampo = number | string | boolean;
export interface Opcao { valor: ValorCampo; rotulo: string }
export interface CampoEspecifico {
  id: string; rotulo: string; ajuda: string; tipo: TipoCampo; unidade?: string; min?: number; max?: number;
  opcoes?: (Opcao | ValorCampo)[]; padrao: ValorCampo; alvos: string[]; derivacao: string;
}
export interface Premissa { premissa: string; valor: unknown; tipo: 'F' | 'E' | 'H'; racional: string; fonte?: string }
export interface Fonte { titulo: string; url: string; acesso?: string }
export interface VendaTrib { item: string; aliquota_pct_cheia: number; base_legal: string; status: string; confianca: string; observacao?: string }
export interface CaixaExemplo { caixa: number; caixa_minimo: number; limites: number; custo_credito_pct_am: number; geracao_caixa_mes: number }
export interface ResultadoAno {
  ano: number; aliquota_cheia_pct: number; debito_mes: number; credito_mes: number; favoravel: number; prudente: number; novo_no_ano_prudente: number;
  decomposicao_prudente: { debito_antecipado: number; credito_condicionado: number; saldo_credor: number }; saldo_credor_sem_split: number;
}
export interface ResultadoExemplo {
  por_ano: ResultadoAno[];
  pct_um_mes_receita_2028: { favoravel: number; prudente: number };
  pct_um_mes_receita_2033: { favoravel: number; prudente: number };
  teste_caixa_2028: { necessidade: number; caixa_livre_usado: number; limites_usados: number; falta: number; custo_anual: number; custo_pct_geracao_caixa: number | null; semaforo: string };
}
export interface Nicho {
  id: string; categoria_codigo: string; categoria: string; nicho: string; rotulo_menu: string;
  cnae: { divisao?: string; classes_exemplo?: string[] } & Record<string, unknown>;
  descricao_negocio: string; porte_alvo: string; regimes_tipicos: string[];
  tratamento_tributario: { resumo: string; vendas: VendaTrib[]; credito_ao_cliente: string; regras_relevantes: string[]; simples_nacional: { relevancia: string; tratamento: string } };
  split: { exposicao: 'alta' | 'media' | 'baixa'; quando: string; meios_fase1: string[]; observacoes: string[] };
  receita_mensal_padrao: number; linhas_receita: LinhaReceita[]; linhas_compra: LinhaCompra[]; prazo_pagamento_fornecedor_dias: number;
  caixa_exemplo: CaixaExemplo; campos_especificos: CampoEspecifico[]; regras_especiais_calculo: string[];
  perguntas_diagnostico: string[]; dados_para_coletar: string[]; analise_critica: string; tese_consultoria: string;
  premissas_operacionais: Premissa[]; riscos_pontos_abertos: string[]; prioridade: 1 | 2 | 3; confianca_geral: 'alta' | 'media' | 'baixa';
  pendencias_verificar: string[]; fontes: Fonte[]; resultado_exemplo: ResultadoExemplo;
}
export interface ParametrosGlobais {
  cbs_referencia_pct: number; ibs_cheio_pct: number; adesao_2027_pct: number; adesao_2028_em_diante_pct: number;
  ressarcimento_dias_extra: number; dias_antecipacao: number; cdi_pct_aa: number; ano_teste: number; credito_fornecedor_simples_pct_cheia: number;
}
export interface Base {
  versao: string; data_referencia: string; descricao: string;
  contexto_global: { data_referencia: string; aviso: unknown; aliquotas: unknown; reducoes_e_regimes: unknown; split_payment: unknown; parametros_globais_padrao: ParametrosGlobais; campos_comuns_formulario: { id: string; rotulo: string; tipo: TipoCampo; unidade?: string; opcoes?: ValorCampo[]; ajuda?: string; padrao?: ValorCampo }[] } & Record<string, unknown>;
  motor: { arquivo: string; resumo: string[] };
  nichos: Nicho[];
}
