// Teste de aceite 1 (roteiro do site, item 7): com as linhas padrão de cada nicho e os parâmetros globais,
// o motor tem de reproduzir o resultado_exemplo da base, inclusive o teste de caixa de 2028.
import fs from 'node:fs';
import path from 'node:path';
import E from '../src/lib/engine/engine_v2.js';
import type { Base } from '../src/lib/types';

const base: Base = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/base-nichos-split.json'), 'utf8'));
const G = base.contexto_global.parametros_globais_padrao;
let fails = 0;
for (const n of base.nichos) {
  const rows = E.run(n, n.receita_mensal_padrao, G);
  const ex = n.resultado_exemplo;
  const errs: string[] = [];
  rows.forEach((r, i) => {
    const e = ex.por_ano[i];
    const pairs: [string, number, number][] = [['prud', r.prud, e.prudente], ['fav', r.fav, e.favoravel], ['D', r.D, e.debito_mes], ['Cr', r.Cr, e.credito_mes], ['base', r.trapBase, e.saldo_credor_sem_split]];
    for (const [k, a, b] of pairs) if (Math.abs(Math.round(a) - b) > 1) errs.push(`${e.ano} ${k} ${Math.round(a)} != ${b}`);
  });
  const t = rows.find(r => r.year === G.ano_teste)!;
  const ct = E.cashTest(t.prud, { ...n.caixa_exemplo, cdi_pct_aa: G.cdi_pct_aa });
  if (ct.verdict !== ex.teste_caixa_2028.semaforo) errs.push(`semaforo ${ct.verdict} != ${ex.teste_caixa_2028.semaforo}`);
  if (Math.abs(Math.round(ct.costYear) - ex.teste_caixa_2028.custo_anual) > 1) errs.push(`custo ${ct.costYear}`);
  if (errs.length) { fails++; console.log(n.id, errs.slice(0, 3).join('; ')); }
}
console.log(`motor: ${base.nichos.length - fails}/${base.nichos.length} nichos reproduzem o resultado_exemplo`);
if (fails) process.exit(1);
