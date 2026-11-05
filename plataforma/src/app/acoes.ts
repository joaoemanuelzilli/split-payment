'use server';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { getNicho } from '@/lib/base';
import { conferirSenha, criarSessao, encerrarSessao, exigirUsuario, hashSenha } from '@/lib/auth';
import {
  adicionarNota, atualizarEmpresa, criarEmpresa, excluirEmpresa, excluirSimulacao, getEmpresa, getParceiroPorSlug, getParametros,
  getSimulacao, podeVer, recalcularTodas, salvarParametros, salvarSimulacao, setSetting, ETAPAS, MARCA_PADRAO, type Etapa,
} from '@/lib/dados';
import type { Caixa, FaixaPreco } from '@/lib/calc';
import type { Valores } from '@/lib/derive/core';
import type { Nicho, ParametrosGlobais } from '@/lib/types';
import { slugify } from '@/lib/format';

// ---------- validação ----------
const finito = (x: unknown, min = -1e12, max = 1e12) => typeof x === 'number' && Number.isFinite(x) && x >= min && x <= max;
function limparValores(n: Nicho, v: unknown): Valores {
  const out: Valores = {};
  const src = (v && typeof v === 'object' ? v : {}) as Record<string, unknown>;
  for (const f of n.campos_especificos) {
    const x = src[f.id];
    if (f.tipo === 'booleano') out[f.id] = x === true;
    else if (f.tipo === 'selecao') {
      const ops = (f.opcoes ?? []).map(o => (typeof o === 'object' && o !== null && 'valor' in o ? o.valor : o));
      out[f.id] = ops.some(o => o === x) ? (x as string | number | boolean) : f.padrao;
    } else out[f.id] = finito(x, -1e12, 1e13) ? (x as number) : f.padrao;
  }
  return out;
}
function limparCaixa(c: unknown, n: Nicho): Caixa {
  const src = (c && typeof c === 'object' ? c : {}) as Record<string, unknown>;
  const out = { ...n.caixa_exemplo };
  for (const k of Object.keys(out) as (keyof Caixa)[]) if (finito(src[k], 0, 1e13)) out[k] = src[k] as number;
  return out;
}
function limparParametros(p: unknown): ParametrosGlobais {
  const base = getParametros();
  const src = (p && typeof p === 'object' ? p : {}) as Record<string, unknown>;
  const lim: Record<keyof ParametrosGlobais, [number, number]> = {
    cbs_referencia_pct: [0, 30], ibs_cheio_pct: [0, 40], adesao_2027_pct: [0, 100], adesao_2028_em_diante_pct: [0, 100],
    ressarcimento_dias_extra: [0, 400], dias_antecipacao: [0, 30], cdi_pct_aa: [0, 60], ano_teste: [2027, 2033], credito_fornecedor_simples_pct_cheia: [0, 100],
  };
  const out = { ...base };
  for (const k of Object.keys(lim) as (keyof ParametrosGlobais)[]) if (finito(src[k], lim[k][0], lim[k][1])) out[k] = src[k] as number;
  return out;
}
const texto = (x: unknown, max = 200) => (typeof x === 'string' ? x.trim().slice(0, max) : '');

// ---------- limites de uso (memória do processo) ----------
// Contadores por janela de tempo, na memória do servidor (valem para uma instância; para várias, use um armazenamento compartilhado).
// O mapa tem tamanho máximo: quando enche, descarta as chaves mais antigas. A limpeza das janelas vencidas roda num temporizador.
const JANELA = 10 * 60 * 1000;
const MAX_CHAVES = 20000;
type GL = typeof globalThis & { __contadores?: Map<string, number[]>; __varredura?: ReturnType<typeof setInterval> };
const gl = globalThis as GL;
const contadores = (gl.__contadores ??= new Map<string, number[]>());
if (!gl.__varredura) {
  gl.__varredura = setInterval(() => {
    const limite = Date.now() - JANELA;
    for (const [k, v] of contadores) { const r = v.filter(t => t > limite); if (r.length) contadores.set(k, r); else contadores.delete(k); }
  }, 60_000);
  gl.__varredura.unref?.();
}
function contar(chave: string) {
  const limite = Date.now() - JANELA;
  return (contadores.get(chave) ?? []).filter(t => t > limite).length;
}
function registrar(chave: string) {
  const limite = Date.now() - JANELA;
  const lista = (contadores.get(chave) ?? []).filter(t => t > limite);
  lista.push(Date.now());
  contadores.delete(chave); // reinsere no fim: o mapa fica em ordem de uso
  contadores.set(chave, lista.slice(-100));
  while (contadores.size > MAX_CHAVES) contadores.delete(contadores.keys().next().value as string);
}
const limpar = (chave: string) => contadores.delete(chave);
const esperar = (ms: number) => new Promise(r => setTimeout(r, ms));

/** Número de proxies confiáveis na frente da aplicação (TRUSTED_PROXY_HOPS). Sem configuração, 0: os cabeçalhos de proxy são ignorados. */
const HOPS = (() => {
  const bruto = process.env.TRUSTED_PROXY_HOPS;
  if (bruto === undefined || bruto === '') return 0;
  const n = Number(bruto);
  if (!Number.isInteger(n) || n < 0 || n > 5) throw new Error(`TRUSTED_PROXY_HOPS inválido: "${bruto}". Use um inteiro de 0 a 5.`);
  return n;
})();

/** IP do cliente como o seu proxy registrou (entrada acrescentada por ele no X-Forwarded-For, contada do fim).
 *  Devolve null quando não há proxy configurado: aí o limite por IP fica desligado, em vez de virar um limite único para todos. */
async function ipCliente(): Promise<string | null> {
  if (HOPS === 0) return null;
  const partes = ((await headers()).get('x-forwarded-for') ?? '').split(',').map(x => x.trim()).filter(Boolean);
  return partes.length >= HOPS ? partes[partes.length - HOPS] : null;
}

// ---------- público: captura de contato ----------
export async function capturarLead(d: { nicho_id: string; valores: Valores; caixa: Caixa; parametros: ParametrosGlobais; contato: Record<string, string>; parceiro?: string }) {
  const ip = await ipCliente();
  if (ip && contar('lead:' + ip) >= 8) return { ok: false, erro: 'Muitos envios em sequência. Tente de novo em alguns minutos.' };
  if (contar('lead:total') >= 300) return { ok: false, erro: 'Muitos envios em sequência. Tente de novo em alguns minutos.' };
  const n = getNicho(String(d.nicho_id));
  if (!n) return { ok: false, erro: 'Setor não encontrado.' };
  const c = d.contato ?? {};
  const nome = texto(c.nome, 120), empresa = texto(c.empresa, 160), email = texto(c.email, 160), telefone = texto(c.telefone, 40);
  if (!nome || !empresa || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || telefone.replace(/\D/g, '').length < 10) return { ok: false, erro: 'Preencha nome, empresa, e-mail válido e WhatsApp com DDD.' };
  if (!c.consentimento) return { ok: false, erro: 'É preciso autorizar o uso dos dados.' };
  const parceiro = d.parceiro ? getParceiroPorSlug(String(d.parceiro)) : undefined;
  const valores = limparValores(n, d.valores);
  const caixa = limparCaixa(d.caixa, n);
  const parametros = limparParametros(d.parametros);
  const [cidade, uf] = texto(c.cidade, 80).split(/[,/-]/).map(s => s.trim());
  const sim = db().transaction(() => {
    const empresaId = criarEmpresa({
      nome: empresa, contato_nome: nome, email, telefone, cnpj: texto(c.cnpj, 20) || null, cidade: cidade || null, uf: (uf || '').slice(0, 2).toUpperCase() || null,
      nicho_id: n.id, etapa: 'lead', origem: parceiro ? 'parceiro' : 'site', parceiro_id: parceiro?.id ?? null, consentimento: 1,
      faturamento_mensal: null,
    });
    const s = salvarSimulacao({ empresa_id: empresaId, nicho_id: n.id, nome: `Calculadora do site: ${n.nicho}`, valores, caixa, parametros, criado_por: null });
    atualizarEmpresa(empresaId, { faturamento_mensal: s.resumo.receitaMensal });
    adicionarNota(empresaId, null, `Contato pela calculadora ${parceiro ? `do parceiro ${parceiro.nome}` : 'do site'}. Necessidade prudente em ${s.resumo.anoTeste}: R$ ${Math.round(s.resumo.necessidadeTeste).toLocaleString('pt-BR')} (semáforo ${s.resumo.semaforo}).`);
    return s;
  })();
  // Conta só envios válidos: lixo não esgota a cota global.
  if (ip) registrar('lead:' + ip);
  registrar('lead:total');
  return { ok: true, token: sim.token };
}

// ---------- sessão ----------
export async function entrar(_: unknown, fd: FormData) {
  const email = texto(fd.get('email'), 160).toLowerCase();
  const senha = String(fd.get('senha') ?? '');
  const ip = await ipCliente();
  // Só falhas contam. Por conta: espera crescente (nunca bloqueia a conta). Por IP (com proxy configurado): limite rígido.
  if (ip && contar('login-ip:' + ip) >= 30) return { erro: 'Muitas tentativas erradas deste endereço. Aguarde alguns minutos.' };
  const falhasConta = contar('login-conta:' + email);
  if (falhasConta >= 5) await esperar(Math.min(10_000, 500 * 2 ** (falhasConta - 5)));
  const u = db().prepare('SELECT id, senha_hash FROM usuarios WHERE email = ? AND ativo = 1').get(email) as { id: number; senha_hash: string } | undefined;
  if (!u || !conferirSenha(senha, u.senha_hash)) {
    if (ip) registrar('login-ip:' + ip);
    registrar('login-conta:' + email);
    return { erro: 'E-mail ou senha não conferem.' };
  }
  limpar('login-conta:' + email);
  await criarSessao(u.id);
  redirect('/app');
}
export async function sair() {
  await encerrarSessao();
  redirect('/entrar');
}

// ---------- simulações ----------
export async function salvarSimulacaoAcao(d: { id?: number; nicho_id: string; nome: string; empresa_id: number | null; valores: Valores; caixa: Caixa; parametros: ParametrosGlobais }) {
  const u = await exigirUsuario();
  const n = getNicho(String(d.nicho_id));
  if (!n) return { ok: false, erro: 'Setor não encontrado.' };
  if (d.empresa_id) { const e = getEmpresa(Number(d.empresa_id)); if (!e || !podeVer(u, e)) return { ok: false, erro: 'Cliente não encontrado.' }; }
  if (d.id) {
    const s = getSimulacao(Number(d.id));
    if (!s) return { ok: false, erro: 'Simulação não encontrada.' };
    if (s.empresa_id) {
      const e = getEmpresa(s.empresa_id);
      if (!e || !podeVer(u, e)) return { ok: false, erro: 'Sem acesso.' };
    } else if (u.papel === 'parceiro' && s.criado_por !== u.id) {
      return { ok: false, erro: 'Sem acesso.' };
    }
  }
  let empresaId = d.empresa_id ? Number(d.empresa_id) : null;
  if (!empresaId && u.papel === 'parceiro') empresaId = null;
  const s = salvarSimulacao({
    id: d.id ? Number(d.id) : undefined, empresa_id: empresaId, nicho_id: n.id, nome: texto(d.nome, 160) || `Diagnóstico ${n.nicho}`,
    valores: limparValores(n, d.valores), caixa: limparCaixa(d.caixa, n), parametros: limparParametros(d.parametros), criado_por: u.id,
  });
  if (empresaId) {
    const e = getEmpresa(empresaId)!;
    if (!e.nicho_id || !e.faturamento_mensal) atualizarEmpresa(empresaId, { nicho_id: e.nicho_id || n.id, faturamento_mensal: e.faturamento_mensal || s.resumo.receitaMensal });
    revalidatePath(`/app/empresas/${empresaId}`);
  }
  revalidatePath('/app/simulacoes');
  return { ok: true, id: s.id };
}
export async function excluirSimulacaoAcao(fd: FormData) {
  const u = await exigirUsuario();
  const s = getSimulacao(Number(fd.get('id')));
  if (!s) return;
  if (s.empresa_id) { const e = getEmpresa(s.empresa_id); if (e && !podeVer(u, e)) return; }
  else if (u.papel === 'parceiro' && s.criado_por !== u.id) return;
  excluirSimulacao(s.id);
  redirect(s.empresa_id ? `/app/empresas/${s.empresa_id}` : '/app/simulacoes');
}

// ---------- empresas ----------
function lerEmpresa(fd: FormData) {
  const fat = Number(String(fd.get('faturamento_mensal') ?? '').replace(/\D/g, ''));
  return {
    nome: texto(fd.get('nome'), 160), cnpj: texto(fd.get('cnpj'), 20) || null, nicho_id: texto(fd.get('nicho_id'), 6) || null,
    cidade: texto(fd.get('cidade'), 80) || null, uf: texto(fd.get('uf'), 2).toUpperCase() || null, contato_nome: texto(fd.get('contato_nome'), 120) || null,
    cargo: texto(fd.get('cargo'), 80) || null, email: texto(fd.get('email'), 160) || null, telefone: texto(fd.get('telefone'), 40) || null,
    faturamento_mensal: fat > 0 ? fat : null, observacoes: texto(fd.get('observacoes'), 4000) || null,
  };
}
export async function criarEmpresaAcao(fd: FormData) {
  const u = await exigirUsuario();
  const d = lerEmpresa(fd);
  if (!d.nome) redirect('/app/empresas/nova?erro=nome');
  if (d.nicho_id && !getNicho(d.nicho_id)) d.nicho_id = null;
  const parceiroId = u.papel === 'parceiro' ? u.parceiro_id : Number(fd.get('parceiro_id')) || null;
  const id = criarEmpresa({ ...d, origem: u.papel === 'parceiro' ? 'parceiro' : 'manual', responsavel_id: u.papel === 'parceiro' ? null : u.id, parceiro_id: parceiroId, etapa: 'lead' });
  redirect(`/app/empresas/${id}`);
}
async function empresaPermitida(id: number) {
  const u = await exigirUsuario();
  const e = getEmpresa(id);
  if (!e || !podeVer(u, e)) redirect('/app/empresas');
  return { u, e };
}
export async function atualizarEmpresaAcao(fd: FormData) {
  const id = Number(fd.get('id'));
  const { u } = await empresaPermitida(id);
  const d = lerEmpresa(fd);
  if (!d.nome) return;
  if (d.nicho_id && !getNicho(d.nicho_id)) d.nicho_id = null;
  const extra: Record<string, unknown> = {};
  if (u.papel !== 'parceiro') {
    if (fd.has('parceiro_id')) extra.parceiro_id = Number(fd.get('parceiro_id')) || null;
    if (fd.has('responsavel_id')) extra.responsavel_id = Number(fd.get('responsavel_id')) || null;
  }
  atualizarEmpresa(id, { ...d, ...extra });
  revalidatePath(`/app/empresas/${id}`);
}
export async function mudarEtapaAcao(fd: FormData) {
  const id = Number(fd.get('id'));
  const { u } = await empresaPermitida(id);
  const etapa = String(fd.get('etapa')) as Etapa;
  if (!ETAPAS.some(e => e.id === etapa)) return;
  atualizarEmpresa(id, { etapa });
  adicionarNota(id, u.id, `Etapa alterada para: ${ETAPAS.find(e => e.id === etapa)!.nome}.`);
  revalidatePath(`/app/empresas/${id}`);
  revalidatePath('/app');
}
export async function excluirEmpresaAcao(fd: FormData) {
  const id = Number(fd.get('id'));
  const { u } = await empresaPermitida(id);
  if (u.papel === 'parceiro') return;
  excluirEmpresa(id);
  redirect('/app/empresas');
}
export async function adicionarNotaAcao(fd: FormData) {
  const id = Number(fd.get('id'));
  const { u } = await empresaPermitida(id);
  const t = texto(fd.get('texto'), 4000);
  if (t) adicionarNota(id, u.id, t);
  revalidatePath(`/app/empresas/${id}`);
}
export async function checklistAcao(fd: FormData) {
  const empresaId = Number(fd.get('empresa_id'));
  await empresaPermitida(empresaId);
  const item = Number(fd.get('item'));
  if (fd.get('acao') === 'alternar') db().prepare('UPDATE checklist SET feito = 1 - feito WHERE id = ? AND empresa_id = ?').run(item, empresaId);
  if (fd.get('acao') === 'responder') db().prepare('UPDATE checklist SET resposta = ? WHERE id = ? AND empresa_id = ?').run(texto(fd.get('resposta'), 2000) || null, item, empresaId);
  if (fd.get('acao') === 'nova') { const t = texto(fd.get('texto'), 500); if (t) db().prepare("INSERT INTO checklist (empresa_id, tipo, texto, ordem) VALUES (?, 'tarefa', ?, 500)").run(empresaId, t); }
  revalidatePath(`/app/empresas/${empresaId}`);
}

// ---------- administração ----------
export async function salvarParametrosAcao(fd: FormData) {
  const u = await exigirUsuario(['admin']);
  const src: Record<string, number> = {};
  for (const [k, v] of fd.entries()) if (k !== 'motivo' && k !== 'recalcular') src[k] = Number(String(v).replace(',', '.'));
  salvarParametros(limparParametros(src), texto(fd.get('motivo'), 300) || 'Atualização manual', u);
  if (fd.get('recalcular')) recalcularTodas();
  revalidatePath('/app', 'layout');
  redirect('/app/configuracoes?ok=parametros');
}
export async function recalcularAcao() {
  await exigirUsuario(['admin']);
  const n = recalcularTodas();
  revalidatePath('/app', 'layout');
  redirect(`/app/configuracoes?ok=recalculo&n=${n}`);
}
export async function salvarMarcaAcao(fd: FormData) {
  await exigirUsuario(['admin']);
  const cor = texto(fd.get('cor'), 7);
  setSetting('marca', {
    nome: texto(fd.get('nome'), 80) || MARCA_PADRAO.nome, slogan: texto(fd.get('slogan'), 160) || MARCA_PADRAO.slogan,
    cor: /^#[0-9a-fA-F]{6}$/.test(cor) ? cor : MARCA_PADRAO.cor, email: texto(fd.get('email'), 160), telefone: texto(fd.get('telefone'), 40),
    site: texto(fd.get('site'), 160), cidade: texto(fd.get('cidade'), 80), logoUrl: texto(fd.get('logoUrl'), 400),
  });
  setSetting('publico', { exigirCadastro: fd.get('exigirCadastro') === 'on', somentePrioridade1: fd.get('somentePrioridade1') === 'on' });
  revalidatePath('/', 'layout');
  redirect('/app/configuracoes?ok=marca');
}
export async function salvarPrecosAcao(fd: FormData) {
  await exigirUsuario(['admin']);
  const faixas: FaixaPreco[] = [0, 1, 2, 3].map(i => ({
    ate: i === 3 ? null : Number(fd.get(`ate_${i}`)) || null,
    diagnostico: Number(fd.get(`diag_${i}`)) || 0,
    acompanhamento: Number(fd.get(`acomp_${i}`)) || 0,
  }));
  setSetting('faixas_preco', faixas);
  redirect('/app/configuracoes?ok=precos');
}
export async function salvarParceiroAcao(fd: FormData) {
  await exigirUsuario(['admin']);
  const id = Number(fd.get('id')) || null;
  const nome = texto(fd.get('nome'), 120);
  if (!nome) redirect('/app/parceiros?erro=nome');
  const cor = texto(fd.get('cor'), 7);
  const d = {
    nome, slug: slugify(texto(fd.get('slug'), 60) || nome), cor: /^#[0-9a-fA-F]{6}$/.test(cor) ? cor : null, logo_url: texto(fd.get('logo_url'), 400) || null,
    contato_nome: texto(fd.get('contato_nome'), 120) || null, email: texto(fd.get('email'), 160) || null, telefone: texto(fd.get('telefone'), 40) || null,
    cidade: texto(fd.get('cidade'), 80) || null, repasse_pct: Math.min(100, Math.max(0, Number(fd.get('repasse_pct')) || 0)), ativo: fd.get('ativo') === 'off' ? 0 : 1,
  };
  try {
    if (id) db().prepare(`UPDATE parceiros SET nome=@nome, slug=@slug, cor=@cor, logo_url=@logo_url, contato_nome=@contato_nome, email=@email, telefone=@telefone, cidade=@cidade, repasse_pct=@repasse_pct, ativo=@ativo WHERE id=@id`).run({ ...d, id });
    else db().prepare(`INSERT INTO parceiros (nome, slug, cor, logo_url, contato_nome, email, telefone, cidade, repasse_pct, ativo) VALUES (@nome, @slug, @cor, @logo_url, @contato_nome, @email, @telefone, @cidade, @repasse_pct, @ativo)`).run(d);
  } catch {
    redirect('/app/parceiros?erro=slug');
  }
  revalidatePath('/app/parceiros');
  redirect('/app/parceiros?ok=1');
}
export async function salvarUsuarioAcao(fd: FormData) {
  await exigirUsuario(['admin']);
  const id = Number(fd.get('id')) || null;
  const email = texto(fd.get('email'), 160).toLowerCase();
  const nome = texto(fd.get('nome'), 120);
  const papel = String(fd.get('papel'));
  const senha = String(fd.get('senha') ?? '');
  const parceiroId = papel === 'parceiro' ? Number(fd.get('parceiro_id')) || null : null;
  if (!email || !nome || !['admin', 'consultor', 'parceiro'].includes(papel) || (papel === 'parceiro' && !parceiroId)) redirect('/app/configuracoes?erro=usuario#usuarios');
  try {
    if (id) {
      db().prepare('UPDATE usuarios SET email=?, nome=?, papel=?, parceiro_id=?, ativo=? WHERE id=?').run(email, nome, papel, parceiroId, fd.get('ativo') === 'off' ? 0 : 1, id);
      if (senha.length >= 8) db().prepare('UPDATE usuarios SET senha_hash=? WHERE id=?').run(hashSenha(senha), id);
    } else {
      if (senha.length < 8) redirect('/app/configuracoes?erro=senha#usuarios');
      db().prepare('INSERT INTO usuarios (email, nome, senha_hash, papel, parceiro_id) VALUES (?, ?, ?, ?, ?)').run(email, nome, hashSenha(senha), papel, parceiroId);
    }
  } catch (e) {
    if ((e as { digest?: string }).digest?.startsWith('NEXT_REDIRECT')) throw e;
    redirect('/app/configuracoes?erro=email#usuarios');
  }
  redirect('/app/configuracoes?ok=usuario#usuarios');
}
export async function trocarSenhaAcao(fd: FormData) {
  const u = await exigirUsuario();
  const atual = String(fd.get('atual') ?? ''), nova = String(fd.get('nova') ?? '');
  const row = db().prepare('SELECT senha_hash FROM usuarios WHERE id = ?').get(u.id) as { senha_hash: string };
  if (!conferirSenha(atual, row.senha_hash) || nova.length < 8) redirect('/app/conta?erro=1');
  db().prepare('UPDATE usuarios SET senha_hash = ? WHERE id = ?').run(hashSenha(nova), u.id);
  redirect('/app/conta?ok=1');
}
