import 'server-only';
import { headers } from 'next/headers';

// Limites de uso por janela de tempo, na memória do processo.
// Regras de desenho:
// - reservar antes de checar: a vaga é registrada na mesma etapa síncrona da verificação, então pedidos em paralelo se enxergam;
//   quem termina bem pode devolver a vaga (ex.: login certo não conta como falha);
// - um mapa por tipo de contador, com tamanho máximo; quando enche, as chaves novas caem num balde compartilhado de excedente
//   (com limite próprio), sem despejar contadores ativos e sem recusar todo mundo;
// - valem para uma instância do servidor. Com várias instâncias, troque por um armazenamento compartilhado (ex.: Redis).

const JANELA_MS = 10 * 60 * 1000;

export class Limite {
  private mapa = new Map<string, number[]>();
  static readonly EXCEDENTE = '__excedente__';
  constructor(private readonly max: number, private readonly maxChaves: number, private readonly maxExcedente = max * 20) {
    const t = setInterval(() => this.varrer(), 60_000);
    t.unref?.();
  }
  private vivas(chave: string, agora: number) {
    return (this.mapa.get(chave) ?? []).filter(t => agora - t < JANELA_MS);
  }
  /** Chave efetiva: a própria, ou o balde de excedente quando o mapa está cheio e a chave é nova. */
  chave(chave: string): string {
    return this.mapa.has(chave) || this.mapa.size < this.maxChaves ? chave : Limite.EXCEDENTE;
  }
  /** Quantas vagas a chave já usou na janela. */
  usadas(chave: string): number { return this.vivas(this.chave(chave), Date.now()).length; }
  /** Reserva uma vaga e devolve a chave efetiva usada, ou null se passou do limite. */
  reservar(chave: string): string | null {
    const efetiva = this.chave(chave);
    const limite = efetiva === Limite.EXCEDENTE ? this.maxExcedente : this.max;
    const agora = Date.now();
    const lista = this.vivas(efetiva, agora);
    if (lista.length >= limite) return null;
    lista.push(agora);
    this.mapa.set(efetiva, lista);
    return efetiva;
  }
  /** Reserva sem teto (para contar tentativas que só aumentam a espera). Devolve a chave efetiva e quantas havia antes. */
  registrar(chave: string): { chave: string; antes: number } {
    const efetiva = this.chave(chave);
    const agora = Date.now();
    const lista = this.vivas(efetiva, agora);
    const antes = lista.length;
    lista.push(agora);
    this.mapa.set(efetiva, lista.slice(-200));
    return { chave: efetiva, antes };
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
  // chave = hash do e-mail digitado, exista a conta ou não (mesmo comportamento nos dois casos); só alimenta a espera crescente
  loginPorConta: new Limite(Number.MAX_SAFE_INTEGER, 50_000),
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
