import type { Nicho, ParametrosGlobais } from '../types';
import { derivarCom, type Deriver, type Valores } from './core';
import * as C01 from './niches/C01'; import * as C02 from './niches/C02'; import * as C03 from './niches/C03';
import * as C04 from './niches/C04'; import * as C05 from './niches/C05'; import * as C06 from './niches/C06';
import * as C07 from './niches/C07'; import * as C08 from './niches/C08'; import * as C09 from './niches/C09';
import * as C10 from './niches/C10'; import * as C11 from './niches/C11'; import * as C12 from './niches/C12';
import * as C13 from './niches/C13'; import * as C14 from './niches/C14'; import * as C15 from './niches/C15';

const mods = [C01, C02, C03, C04, C05, C06, C07, C08, C09, C10, C11, C12, C13, C14, C15];
export const REGISTRO: Record<string, Deriver> = Object.assign({}, ...mods.map(m => m.derivers));
export const EXCECOES: Record<string, Record<string, string>> = Object.assign({}, ...mods.map(m => m.excecoes));

export function derivar(n: Nicho, valores: Valores, p?: ParametrosGlobais) {
  return derivarCom(n, valores, REGISTRO[n.id], p);
}
export * from './core';
