// Teste dos limites de uso (src/lib/limites.ts).
import assert from 'node:assert/strict';
import { Limite } from '../src/lib/limites';

const l = new Limite(3, 2, 4);
const a1 = l.reservar('a'); assert.equal(a1, 'a'); l.reservar('a'); l.reservar('a');
assert.equal(l.reservar('a'), null, 'passa do limite');
l.devolver('a'); assert.equal(l.reservar('a'), 'a', 'vaga devolvida volta a valer');
assert.equal(l.reservar('b'), 'b');
assert.equal(l.reservar('c'), Limite.EXCEDENTE, 'mapa cheio: chave nova cai no balde de excedente');
assert.equal(l.reservar('a'), null, 'o contador ativo de "a" continua lá');
for (let i = 0; i < 3; i++) l.reservar('d' + i);
assert.equal(l.reservar('e'), null, 'o excedente tem limite próprio');
const r = new Limite(Number.MAX_SAFE_INTEGER, 10);
assert.equal(r.registrar('x').antes, 0); assert.equal(r.registrar('x').antes, 1);
console.log('limites: ok');
process.exit(0);
