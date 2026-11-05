import 'server-only';
import fs from 'node:fs';
import path from 'node:path';
import type { Base, Nicho, ParametrosGlobais } from './types';
import { slugify } from './format';

let cache: Base | null = null;
export function getBase(): Base {
  if (!cache) cache = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data/base-nichos-split.json'), 'utf8')) as Base;
  return cache;
}
export const nichoSlug = (n: Pick<Nicho, 'id' | 'nicho'>) => `${n.id.toLowerCase()}-${slugify(n.nicho)}`;
export function getNicho(idOuSlug: string): Nicho | undefined {
  const id = idOuSlug.slice(0, 6).toUpperCase();
  return getBase().nichos.find(n => n.id === id);
}
export function parametrosBase(): ParametrosGlobais {
  return { ...getBase().contexto_global.parametros_globais_padrao };
}

export interface Categoria { codigo: string; nome: string; nichos: Nicho[] }
export function categorias(filtro?: (n: Nicho) => boolean): Categoria[] {
  const m = new Map<string, Categoria>();
  for (const n of getBase().nichos) {
    if (filtro && !filtro(n)) continue;
    if (!m.has(n.categoria_codigo)) m.set(n.categoria_codigo, { codigo: n.categoria_codigo, nome: n.categoria, nichos: [] });
    m.get(n.categoria_codigo)!.nichos.push(n);
  }
  return [...m.values()].sort((a, b) => a.codigo.localeCompare(b.codigo));
}

const mediana = (xs: number[]) => {
  const s = [...xs].sort((a, b) => a - b);
  const k = s.length >> 1;
  return s.length ? (s.length % 2 ? s[k] : (s[k - 1] + s[k]) / 2) : 0;
};

export function estatisticas() {
  const ns = getBase().nichos;
  return {
    total: ns.length,
    prioridade1: ns.filter(n => n.prioridade === 1).length,
    mediana2028: mediana(ns.map(n => n.resultado_exemplo.pct_um_mes_receita_2028.prudente)),
    mediana2033: mediana(ns.map(n => n.resultado_exemplo.pct_um_mes_receita_2033.prudente)),
    maisExpostos: [...ns]
      .sort((a, b) => b.resultado_exemplo.pct_um_mes_receita_2028.prudente - a.resultado_exemplo.pct_um_mes_receita_2028.prudente)
      .slice(0, 6),
    fontes: new Set(ns.flatMap(n => n.fontes.map(f => f.url))).size,
  };
}

export function medianaCategoria(codigo: string) {
  return mediana(getBase().nichos.filter(n => n.categoria_codigo === codigo).map(n => n.resultado_exemplo.pct_um_mes_receita_2028.prudente));
}
