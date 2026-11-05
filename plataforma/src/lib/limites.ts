import 'server-only';
import { headers } from 'next/headers';

// Limites de uso por janela de tempo, na memória do processo.
// Regras de desenho:
// - reservar antes de checar: a vaga é registrada na mesma etapa síncrona da verificação, então pedidos em paralelo se enxergam;
//   quem termina bem pode devolver a vaga (ex.: login certo não conta como falha);
// - um mapa por tipo de contador, com tamanho máximo; quando enche, recusa chaves novas (falha fechada) em vez de despejar
//   contadores ativos, para que um atacante não apague a contagem de outra chave criando chaves novas;
// - valem para uma instância do servidor. Com várias instâncias, troque por um armazenamento compartilhado (ex.: Redis).

const JANELA_MS = 10 * 60 * 1000;

export class Limite {
  private mapa = new Map<string, number[]>();
  constructor(private readonly max: number, private readonly maxChaves: number) {
    const t = setInterval(() => this.varrer(), 60_000);
    t.unref?.();
  }
  private vivas(chave: string, agora: number) {
    return (this.mapa.get(chave) ?? []).filter(t => agora - t < JANELA_MS);
  }
  /** Reserva uma vaga. Devolve false se a chave passou do limite ou se o mapa está cheio e a chave é nova. */
  reservar(chave: string): boolean {
    const agora = Date.now();
    const lista = this.vivas(chave, agora);
    if (lista.length >= this.max) return false;
    if (!this.mapa.has(chave) && this.mapa.size >= this.maxChaves) return false;
    lista.push(agora);
    this.mapa.set(chave, lista);
    return true;
  }
  /** Devolve a última vaga reservada (quando a operação não deve contar). */
  devolver(chave: string) {
    const lista = this.mapa.get(chave);
    if (!lista) return;
    lista.pop();
    if (!lista.length) this.mapa.delete(chave);
  }
  zerar(chave: string) { this.mapa.delete(chave); }
  private varrer() {
    const agora = Date.now();
    for (const [k] of this.mapa) { const v = this.vivas(k, agora); if (v.length) this.mapa.set(k, v); else this.mapa.delete(k); }
  }
}

type G = typeof globalThis & { __limites?: Record<string, Limite> };
const g = globalThis as G;
export const LIMITES = (g.__limites ??= {
  leadPorIp: new Limite(8, 50_000),
  leadTotal: new Limite(300, 1),
  loginPorIp: new Limite(30, 50_000),
  loginPorConta: new Limite(10, 10_000), // chave = id do usuário (só contas existentes) ou "desconhecido"
  loginTotal: new Limite(200, 1),
});

/** Número de proxies confiáveis na frente da aplicação. Obrigatório em produção; valor inválido é erro de configuração. */
function hops(): number {
  const bruto = process.env.TRUSTED_PROXY_HOPS;
  if (bruto === undefined || bruto === '') {
    if (process.env.NODE_ENV === 'production') throw new Error('Defina TRUSTED_PROXY_HOPS (número de proxies na frente da aplicação, de 1 a 5). Sem ele não há como limitar por endereço de quem acessa.');
    return 0;
  }
  const n = Number(bruto);
  if (!Number.isInteger(n) || n < 1 || n > 5) throw new Error(`TRUSTED_PROXY_HOPS inválido: "${bruto}". Use um inteiro de 1 a 5.`);
  return n;
}

/** IP de quem acessa, como o seu proxy registrou (entrada acrescentada por ele ao X-Forwarded-For, contada do fim).
 *  Em desenvolvimento, sem proxy, devolve "local". Em produção, sem a entrada do proxy, devolve "sem-proxy",
 *  que vira um único balde: o limite continua valendo, apertado, em vez de sumir. */
export async function ipCliente(): Promise<string> {
  const n = hops();
  if (n === 0) return 'local';
  const partes = ((await headers()).get('x-forwarded-for') ?? '').split(',').map(x => x.trim()).filter(Boolean);
  return partes.length >= n ? partes[partes.length - n] : 'sem-proxy';
}
