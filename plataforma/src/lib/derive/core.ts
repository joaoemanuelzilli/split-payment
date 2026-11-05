// Camada formulário → linhas do motor.
// 1) parte das linhas padrão do nicho; 2) aplica os campos de atribuição direta (campo = atributo);
// 3) roda a função própria do nicho (fórmulas do campo `derivacao`); 4) corrige negativos e normaliza as fatias.
import type { CampoEspecifico, LinhaCompra, LinhaReceita, Nicho, ParametrosGlobais, ValorCampo } from '../types';
import E from '../engine/engine_v2.js';

/** Parâmetros globais padrão da base 1.1 (contexto_global.parametros_globais_padrao). O teste confere que batem com a base. */
export const PARAMETROS_PADRAO: ParametrosGlobais = { cbs_referencia_pct: 11.35, ibs_cheio_pct: 18.7, adesao_2027_pct: 30, adesao_2028_em_diante_pct: 100, ressarcimento_dias_extra: 75, dias_antecipacao: 2, cdi_pct_aa: 13.65, ano_teste: 2028, credito_fornecedor_simples_pct_cheia: 7 };

export type Valores = Record<string, ValorCampo>;
export interface Modelo {
  receita_mensal: number;
  prazo_pagamento_fornecedor_dias: number;
  linhas_receita: LinhaReceita[];
  linhas_compra: LinhaCompra[];
}
export type Modo = 'motor' | 'simples_puro' | 'nao_contribuinte' | 'fora_escopo';
export interface Mensagem { nivel: 'info' | 'alerta'; texto: string; campo?: string }
export interface Extra { rotulo: string; descricao?: string; modelo: Modelo }
export interface Derivacao {
  modelo: Modelo;
  modo: Modo;
  textoModo?: string;
  mensagens: Mensagem[];
  extras: Extra[];
}

export interface Ctx {
  /** Valores do formulário (já com os padrões preenchidos). */
  v: Valores;
  /** Parâmetros globais em uso (CBS de referência, IBS cheio, adesão...). */
  p: ParametrosGlobais;
  /** Alíquota cheia total do ano, em % (CBS em 2027-2028; soma o IBS na rampa de 2029 a 2033). */
  aliquota(ano: number): number;
  /** Valor numérico do campo (percentuais continuam em 0-100). */
  num(id: string): number;
  /** Valor booleano do campo. */
  bool(id: string): boolean;
  /** Texto do valor do campo (para seleções com valor texto). */
  str(id: string): string;
  /** Define atributo de linha de receita / compra. */
  r(linha: string, atributo: keyof LinhaReceita | string, valor: unknown): void;
  c(linha: string, atributo: keyof LinhaCompra | string, valor: unknown): void;
  getR(linha: string, atributo: string): any;
  getC(linha: string, atributo: string): any;
  /** Lista de ids das linhas, para "todas as linhas" e filtros. */
  linhasR(): LinhaReceita[];
  linhasC(): LinhaCompra[];
  receita(valor: number): void;
  prazoFornecedor(dias: number): void;
  msg(texto: string, nivel?: 'info' | 'alerta', campo?: string): void;
  /** Troca o modo (não roda o motor) e explica por quê. */
  modo(m: Modo, texto?: string): void;
  /** Cálculo adicional só para exibição; o resultado principal não muda. */
  extra(rotulo: string, mutar: (c: Ctx) => void, descricao?: string): void;
}
export type Deriver = (c: Ctx) => void;

const clone = <T,>(x: T): T => JSON.parse(JSON.stringify(x));
const REAL = /^(linhas_receita|linhas_compra)\.([^.]+)\.([a-z_]+)$/;

export function opcoesDe(campo: CampoEspecifico): { valor: ValorCampo; rotulo: string }[] {
  return (campo.opcoes ?? []).map(o => (typeof o === 'object' && o !== null && 'valor' in o ? (o as { valor: ValorCampo; rotulo: string }) : { valor: o as ValorCampo, rotulo: String(o) }));
}

export function valoresPadrao(n: Nicho): Valores {
  const v: Valores = {};
  for (const f of n.campos_especificos) v[f.id] = f.padrao;
  return v;
}

function valorBase(n: Nicho, alvo: string): unknown {
  if (alvo === 'receita_mensal') return n.receita_mensal_padrao;
  if (alvo === 'prazo_pagamento_fornecedor_dias') return n.prazo_pagamento_fornecedor_dias;
  const m = alvo.match(REAL);
  if (!m) return undefined;
  const lista = (m[1] === 'linhas_receita' ? n.linhas_receita : n.linhas_compra) as unknown as Record<string, unknown>[];
  const l = lista.find(x => x.id === m[2]);
  return l ? l[m[3]] : undefined;
}

/** Campo de atribuição direta: numérico, não booleano, e o padrão é exatamente o valor de todos os alvos na base. */
export function ehDireto(n: Nicho, f: CampoEspecifico): boolean {
  if (f.tipo === 'booleano' || typeof f.padrao !== 'number') return false;
  const reais = f.alvos.filter(a => a !== 'mensagem' && a !== 'regra_especial');
  if (!reais.length) return false;
  return reais.every(a => valorBase(n, a) === f.padrao);
}

const MODO_POR_VALOR: Record<string, Modo> = { simples_puro: 'simples_puro', simples: 'simples_puro', pj_simples_puro: 'simples_puro', nao_contribuinte: 'nao_contribuinte' };
const CAMPOS_REGIME = new Set(['regime_empresa', 'regime_ibs_cbs', 'tipo_representante', 'condicao_produtor']);

function criarCtx(n: Nicho, v: Valores, alvo: Derivacao, p: ParametrosGlobais): Ctx {
  const m = alvo.modelo;
  const linha = (lista: { id: string }[], id: string, tipo: string) => {
    const l = lista.find(x => x.id === id);
    if (!l) throw new Error(`${n.id}: linha de ${tipo} inexistente: ${id}`);
    return l as unknown as Record<string, unknown>;
  };
  const ctx: Ctx = {
    v,
    p,
    aliquota: ano => 100 * E.rateFor(ano, p),
    num: id => { const x = v[id]; if (typeof x === 'boolean') return x ? 1 : 0; const y = Number(x); return Number.isFinite(y) ? y : 0; },
    bool: id => { const x = v[id]; return x === true || x === 'true' || x === 1 || x === 'sim'; },
    str: id => String(v[id]),
    r: (id, a, val) => { const l = linha(m.linhas_receita, id, 'receita'); if (val === null || val === undefined) delete l[a as string]; else l[a as string] = val; },
    c: (id, a, val) => { const l = linha(m.linhas_compra, id, 'compra'); if (val === null || val === undefined) delete l[a as string]; else l[a as string] = val; },
    getR: (id, a) => linha(m.linhas_receita, id, 'receita')[a],
    getC: (id, a) => linha(m.linhas_compra, id, 'compra')[a],
    linhasR: () => m.linhas_receita,
    linhasC: () => m.linhas_compra,
    receita: x => { m.receita_mensal = x; },
    prazoFornecedor: x => { m.prazo_pagamento_fornecedor_dias = x; },
    msg: (texto, nivel = 'info', campo) => { if (!alvo.mensagens.some(x => x.texto === texto)) alvo.mensagens.push({ texto, nivel, campo }); },
    modo: (mm, texto) => { alvo.modo = mm; if (texto) alvo.textoModo = texto; },
    extra: (rotulo, mutar, descricao) => {
      const sub: Derivacao = { modelo: clone(m), modo: 'motor', mensagens: [], extras: [] };
      mutar(criarCtx(n, v, sub, p));
      alvo.extras.push({ rotulo, descricao, modelo: sub.modelo });
    },
  };
  return ctx;
}

/** Corrige fatias negativas e normaliza a soma das participações para 100, avisando. */
export function normalizar(d: Derivacao) {
  const lr = d.modelo.linhas_receita;
  let corrigiu = false;
  for (const l of lr) if (l.participacao_pct < 0) { l.participacao_pct = 0; corrigiu = true; }
  for (const c of d.modelo.linhas_compra) if (c.pct_receita < 0) { c.pct_receita = 0; corrigiu = true; }
  for (const l of lr) for (const k of ['prazo_dias', 'antecipado_pct', 'parcela_sujeita_split_pct'] as const) if (l[k] < 0) { l[k] = 0; corrigiu = true; }
  for (const l of lr) for (const k of ['antecipado_pct', 'parcela_sujeita_split_pct'] as const) if (l[k] > 100) { l[k] = 100; corrigiu = true; }
  if (corrigiu) d.mensagens.push({ nivel: 'alerta', texto: 'Algumas fatias informadas passaram do total e ficaram negativas; foram zeradas. Confira se os percentuais somam no máximo 100.' });
  const soma = lr.reduce((s, l) => s + l.participacao_pct, 0);
  if (soma > 0 && Math.abs(soma - 100) > 0.05) {
    for (const l of lr) l.participacao_pct = (l.participacao_pct * 100) / soma;
    d.mensagens.push({ nivel: 'alerta', texto: `As fatias de receita somavam ${soma.toFixed(1).replace('.', ',')}%. Ajustei proporcionalmente para 100%.` });
  }
}

export function derivarCom(n: Nicho, valores: Valores, proprio?: Deriver, p: ParametrosGlobais = PARAMETROS_PADRAO): Derivacao {
  const v: Valores = { ...valoresPadrao(n), ...valores };
  const d: Derivacao = {
    modelo: { receita_mensal: n.receita_mensal_padrao, prazo_pagamento_fornecedor_dias: n.prazo_pagamento_fornecedor_dias, linhas_receita: clone(n.linhas_receita), linhas_compra: clone(n.linhas_compra) },
    modo: 'motor', mensagens: [], extras: [],
  };
  const ctx = criarCtx(n, v, d, p);
  // 2) atribuições diretas
  for (const f of n.campos_especificos) {
    if (!ehDireto(n, f)) continue;
    const val = ctx.num(f.id);
    for (const a of f.alvos) {
      if (a === 'receita_mensal') ctx.receita(val);
      else if (a === 'prazo_pagamento_fornecedor_dias') ctx.prazoFornecedor(val);
      else { const mm = a.match(REAL); if (mm) (mm[1] === 'linhas_receita' ? ctx.r : ctx.c)(mm[2], mm[3], val); }
    }
  }
  // modos genéricos de regime (Simples puro e produtor não contribuinte)
  for (const f of n.campos_especificos) {
    if (!CAMPOS_REGIME.has(f.id)) continue;
    const modo = MODO_POR_VALOR[String(v[f.id])];
    if (modo) ctx.modo(modo, n.tratamento_tributario.simples_nacional?.tratamento);
  }
  // 3) fórmulas próprias do nicho
  if (proprio) proprio(ctx);
  // 4) correções
  normalizar(d);
  for (const e of d.extras) normalizar({ modelo: e.modelo, modo: 'motor', mensagens: [], extras: [] });
  return d;
}
