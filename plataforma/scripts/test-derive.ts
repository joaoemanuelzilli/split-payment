// Teste de aceite 2: o formulário reproduz a base e cada campo mexe no que diz mexer.
//  a) com os valores padrão, as linhas derivadas são iguais às linhas da base e o motor dá o resultado_exemplo;
//  b) mudar cada campo sozinho altera pelo menos um dos seus alvos (ou o modo, as mensagens ou os cenários extras);
//  c) mudanças fora dos alvos declarados são listadas como aviso.
// Uso: npx tsx scripts/test-derive.ts [C01,C02-03,...]   (filtro opcional por prefixo de id)
import fs from 'node:fs';
import path from 'node:path';
import E from '../src/lib/engine/engine_v2.js';
import type { Base, CampoEspecifico, Nicho, ValorCampo } from '../src/lib/types';
import { derivar, EXCECOES, REGISTRO, ehDireto, opcoesDe, valoresPadrao, PARAMETROS_PADRAO, type Derivacao } from '../src/lib/derive';

const base: Base = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/base-nichos-split.json'), 'utf8'));
const G = base.contexto_global.parametros_globais_padrao;
if (JSON.stringify(PARAMETROS_PADRAO) !== JSON.stringify(G)) { console.log('PARAMETROS_PADRAO do core difere da base:', G); process.exit(1); }
const filtro = (process.argv[2] || '').split(',').filter(Boolean);
const nichos = base.nichos.filter(n => !filtro.length || filtro.some(f => n.id.startsWith(f)));
const ATR_R = ['participacao_pct', 'prazo_dias', 'antecipado_pct', 'aliquota_pct_cheia', 'parcela_sujeita_split_pct', 'aliquota_especifica_por_ano', 'cliente', 'meio'];
const ATR_C = ['pct_receita', 'credito_pct_cheia', 'credito_fixo_pct_valor_por_ano', 'condicionado'];
const igual = (a: unknown, b: unknown) => typeof a === 'number' && typeof b === 'number' ? Math.abs(a - b) <= 0.051 : JSON.stringify(a ?? null) === JSON.stringify(b ?? null);

function snapshot(d: Derivacao): Record<string, unknown> {
  const s: Record<string, unknown> = { receita_mensal: d.modelo.receita_mensal, prazo_pagamento_fornecedor_dias: d.modelo.prazo_pagamento_fornecedor_dias };
  for (const l of d.modelo.linhas_receita) for (const a of ATR_R) s[`linhas_receita.${l.id}.${a}`] = (l as any)[a];
  for (const l of d.modelo.linhas_compra) for (const a of ATR_C) s[`linhas_compra.${l.id}.${a}`] = (l as any)[a];
  return s;
}
function baseSnapshot(n: Nicho) {
  return snapshot({ modelo: { receita_mensal: n.receita_mensal_padrao, prazo_pagamento_fornecedor_dias: n.prazo_pagamento_fornecedor_dias, linhas_receita: n.linhas_receita, linhas_compra: n.linhas_compra }, modo: 'motor', mensagens: [], extras: [] });
}
function perturbar(f: CampoEspecifico): ValorCampo[] {
  if (f.tipo === 'booleano') return [!(f.padrao === true)];
  if (f.tipo === 'selecao') return opcoesDe(f).map(o => o.valor).filter(x => x !== f.padrao);
  const p = Number(f.padrao), lo = f.min ?? (f.tipo === 'percentual' ? 0 : 0), hi = f.max ?? (f.tipo === 'percentual' ? 100 : Infinity);
  const delta = f.tipo === 'moeda' ? Math.max(1000, Math.abs(p) * 0.2) : f.tipo === 'dias' ? 10 : Math.max(1, Math.abs(p) * 0.2, Number.isFinite(hi) ? (hi - lo) * 0.1 : 0);
  const up = p + delta, dn = p - delta;
  return [up <= hi ? up : Math.max(lo, dn)];
}

let falhasA = 0, falhasB = 0, avisosC = 0, semFuncao = 0;
const relatorio: string[] = [];
for (const n of nichos) {
  const naoDiretos = n.campos_especificos.filter(f => !ehDireto(n, f));
  if (naoDiretos.length && !REGISTRO[n.id]) semFuncao++;
  const d0 = derivar(n, valoresPadrao(n));
  const s0 = snapshot(d0), sb = baseSnapshot(n);
  const difs = Object.keys(sb).filter(k => !igual(s0[k], sb[k]));
  const errsA: string[] = difs.map(k => `${k}: ${JSON.stringify(s0[k])} ≠ base ${JSON.stringify(sb[k])}`);
  if (d0.modo !== 'motor') errsA.push(`modo padrão ${d0.modo}`);
  if (d0.mensagens.some(m => m.texto.startsWith('As fatias'))) errsA.push('padrão dispara normalização');
  const rows = E.run({ ...d0.modelo }, d0.modelo.receita_mensal, G);
  const r28 = rows[1], e28 = n.resultado_exemplo.por_ano[1];
  if (Math.abs(Math.round(r28.prud) - e28.prudente) > 1 || Math.abs(Math.round(r28.fav) - e28.favoravel) > 1) errsA.push(`2028 prud ${Math.round(r28.prud)} vs ${e28.prudente}`);
  if (errsA.length) { falhasA++; relatorio.push(`[A] ${n.id} ${errsA.slice(0, 6).join(' | ')}`); }

  for (const f of n.campos_especificos) {
    for (const val of perturbar(f)) {
      const d1 = derivar(n, { ...valoresPadrao(n), [f.id]: val });
      const s1 = snapshot(d1);
      const mudou = Object.keys(s1).filter(k => !igual(s1[k], s0[k]));
      const reais = f.alvos.filter(a => a !== 'mensagem' && a !== 'regra_especial');
      const temEspecial = f.alvos.length !== reais.length;
      const declarado = mudou.filter(k => reais.some(a => k === a || k.startsWith(a + '.') ));
      const especialMudou = d1.modo !== d0.modo || JSON.stringify(d1.mensagens) !== JSON.stringify(d0.mensagens) || d1.extras.length !== d0.extras.length;
      const ok = declarado.length > 0 || (temEspecial && especialMudou) || (reais.length === 0 && especialMudou);
      if (!ok && !(EXCECOES[n.id] && EXCECOES[n.id][f.id])) { falhasB++; relatorio.push(`[B] ${n.id}.${f.id}=${JSON.stringify(val)} não mudou alvos ${JSON.stringify(f.alvos)}`); }
      const fora = mudou.filter(k => !reais.some(a => k === a || k.startsWith(a + '.')) && !k.endsWith('.participacao_pct'));
      if (fora.length) { avisosC++; if (process.env.VERBOSE) relatorio.push(`[C] ${n.id}.${f.id} mudou fora dos alvos: ${fora.slice(0, 4).join(', ')}`); }
    }
  }
}
for (const l of relatorio) console.log(l);
console.log(`\nnichos: ${nichos.length} | sem função própria e com campos não diretos: ${semFuncao}`);
console.log(`A (padrão reproduz a base): ${nichos.length - falhasA}/${nichos.length} ok`);
console.log(`B (campo mexe no alvo): ${falhasB} falhas`);
console.log(`C (mudanças fora dos alvos, aviso): ${avisosC}`);
if (falhasA || falhasB) process.exit(1);
