// Teste dos limites de uso (src/lib/limites.ts).
import assert from 'node:assert/strict';
import { Limite } from '../src/lib/limites';

const l = new Limite(3, 2);
assert.equal(l.reservar('a'), true); assert.equal(l.reservar('a'), true); assert.equal(l.reservar('a'), true);
assert.equal(l.reservar('a'), false, 'passa do limite');
l.devolver('a'); assert.equal(l.reservar('a'), true, 'vaga devolvida volta a valer');
assert.equal(l.reservar('b'), true);
assert.equal(l.reservar('c'), false, 'mapa cheio recusa chave nova (falha fechada)');
assert.equal(l.reservar('a'), false, 'mapa cheio não apaga o contador ativo de "a"');
l.zerar('b'); assert.equal(l.reservar('c'), true, 'com espaço, chave nova entra');
console.log('limites: ok');
process.exit(0);
