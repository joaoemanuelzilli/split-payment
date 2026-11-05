import 'server-only';
import crypto from 'node:crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { executar, um } from './db';

export type Papel = 'admin' | 'consultor' | 'parceiro';
export interface Usuario { id: number; email: string; nome: string; papel: Papel; parceiro_id: number | null }

const COOKIE = 'sid';
const DIAS = 14;

export function hashSenha(senha: string) {
  const sal = crypto.randomBytes(16);
  const h = crypto.scryptSync(senha, sal, 64);
  return ['scrypt', sal.toString('hex'), h.toString('hex')].join(':');
}

export function conferirSenha(senha: string, hash: string) {
  const [alg, salHex, hHex] = hash.split(':');
  if (alg !== 'scrypt' || !salHex || !hHex) return false;
  const h = crypto.scryptSync(senha, Buffer.from(salHex, 'hex'), 64);
  const esperado = Buffer.from(hHex, 'hex');
  return esperado.length === h.length && crypto.timingSafeEqual(h, esperado);
}

export const tokenAleatorio = (bytes = 24) => crypto.randomBytes(bytes).toString('base64url');

export async function criarSessao(usuarioId: number) {
  const token = tokenAleatorio(32);
  const expira = new Date(Date.now() + DIAS * 864e5);
  await executar('INSERT INTO sessoes (token, usuario_id, expira_em) VALUES (?, ?, ?)', [token, usuarioId, expira.toISOString()]);
  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production' && process.env.COOKIE_INSECURE !== '1',
    path: '/',
    expires: expira,
  });
}

export async function encerrarSessao() {
  const jar = await cookies();
  const t = jar.get(COOKIE)?.value;
  if (t) await executar('DELETE FROM sessoes WHERE token = ?', [t]);
  jar.delete(COOKIE);
}

export async function usuarioAtual(): Promise<Usuario | null> {
  const t = (await cookies()).get(COOKIE)?.value;
  if (!t) return null;
  const u = await um<Usuario>(
    `SELECT u.id, u.email, u.nome, u.papel, u.parceiro_id FROM sessoes s JOIN usuarios u ON u.id = s.usuario_id
     WHERE s.token = ? AND s.expira_em > ? AND u.ativo = 1`,
    [t, new Date().toISOString()],
  );
  return u ?? null;
}

export async function exigirUsuario(papeis?: Papel[]): Promise<Usuario> {
  const u = await usuarioAtual();
  if (!u) redirect('/entrar');
  if (papeis && !papeis.includes(u.papel)) redirect('/app');
  return u;
}

/** Filtro SQL de escopo: o parceiro só vê as empresas dele. */
export function escopoEmpresas(u: Usuario, alias = 'e'): { sql: string; args: unknown[] } {
  if (u.papel === 'parceiro') return { sql: `${alias}.parceiro_id = ?`, args: [u.parceiro_id] };
  return { sql: '1 = 1', args: [] };
}
