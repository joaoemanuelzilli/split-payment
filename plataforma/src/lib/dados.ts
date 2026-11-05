import 'server-only';
import { AGORA, HA_30_DIAS, executar, getSetting, setSetting, todos, um } from './db';
import { getBase, getNicho, parametrosBase } from './base';
import { calcular, caixaPadrao, FAIXAS_PADRAO, type Caixa, type FaixaPreco } from './calc';
import { valoresPadrao, type Valores } from './derive';
import type { ParametrosGlobais } from './types';
import { tokenAleatorio, type Usuario } from './auth';

// ---------- configurações ----------
export interface Marca {
  nome: string; slogan: string; cor: string; email: string; telefone: string; site: string; cidade: string; logoUrl: string;
}
export const MARCA_PADRAO: Marca = {
  nome: 'Caixa no Split', slogan: 'Diagnóstico de caixa do split payment de IBS e CBS', cor: '#0F5C5A',
  email: 'contato@exemplo.com.br', telefone: '(34) 0000-0000', site: '', cidade: 'Uberlândia, MG', logoUrl: '',
};
export interface ConfigPublica { exigirCadastro: boolean; somentePrioridade1: boolean; }
export const CONFIG_PUBLICA_PADRAO: ConfigPublica = { exigirCadastro: true, somentePrioridade1: false };

export const getMarca = () => getSetting<Marca>('marca', MARCA_PADRAO);
export const getConfigPublica = () => getSetting<ConfigPublica>('publico', CONFIG_PUBLICA_PADRAO);
export const getFaixas = () => getSetting<FaixaPreco[]>('faixas_preco', FAIXAS_PADRAO);
export function getParametros(): Promise<ParametrosGlobais> {
  return getSetting<ParametrosGlobais>('parametros', parametrosBase());
}
export async function salvarParametros(p: ParametrosGlobais, motivo: string, u: Usuario) {
  await setSetting('parametros', p);
  await executar('INSERT INTO parametros_historico (valores, motivo, usuario_id) VALUES (?, ?, ?)', [JSON.stringify(p), motivo, u.id]);
}
export { setSetting };

// ---------- etapas do funil ----------
export const ETAPAS = [
  { id: 'lead', nome: 'Contato novo' },
  { id: 'qualificado', nome: 'Reunião marcada' },
  { id: 'proposta', nome: 'Proposta enviada' },
  { id: 'diagnostico', nome: 'Diagnóstico em andamento' },
  { id: 'execucao', nome: 'Projeto de execução' },
  { id: 'acompanhamento', nome: 'Acompanhamento mensal' },
  { id: 'perdido', nome: 'Não seguiu' },
] as const;
export type Etapa = (typeof ETAPAS)[number]['id'];
export const nomeEtapa = (id: string) => ETAPAS.find(e => e.id === id)?.nome ?? id;

// ---------- empresas ----------
export interface Empresa {
  id: number; nome: string; cnpj: string | null; nicho_id: string | null; cidade: string | null; uf: string | null;
  contato_nome: string | null; cargo: string | null; email: string | null; telefone: string | null; faturamento_mensal: number | null;
  etapa: Etapa; origem: string; responsavel_id: number | null; parceiro_id: number | null; observacoes: string | null;
  consentimento: number; criado_em: string; atualizado_em: string;
  parceiro_nome?: string | null; responsavel_nome?: string | null; ultima_necessidade?: number | null; semaforo?: string | null;
}

export function podeVer(u: Usuario, e: Pick<Empresa, 'parceiro_id'>) {
  return u.papel !== 'parceiro' || e.parceiro_id === u.parceiro_id;
}

export async function listarEmpresas(u: Usuario, filtro: { etapa?: string; q?: string; parceiro?: number } = {}): Promise<Empresa[]> {
  const w: string[] = [];
  const a: unknown[] = [];
  if (u.papel === 'parceiro') { w.push('e.parceiro_id = ?'); a.push(u.parceiro_id); }
  if (filtro.etapa) { w.push('e.etapa = ?'); a.push(filtro.etapa); }
  if (filtro.parceiro) { w.push('e.parceiro_id = ?'); a.push(filtro.parceiro); }
  if (filtro.q) { w.push('(e.nome ILIKE ? OR e.cnpj ILIKE ? OR e.contato_nome ILIKE ? OR e.email ILIKE ?)'); const q = `%${filtro.q}%`; a.push(q, q, q, q); }
  const sql = `SELECT e.*, p.nome AS parceiro_nome, u.nome AS responsavel_nome,
      (SELECT (s.resumo::jsonb->>'necessidadeTeste')::float8 FROM simulacoes s WHERE s.empresa_id = e.id ORDER BY s.atualizado_em DESC LIMIT 1) AS ultima_necessidade,
      (SELECT s.resumo::jsonb->>'semaforo' FROM simulacoes s WHERE s.empresa_id = e.id ORDER BY s.atualizado_em DESC LIMIT 1) AS semaforo
    FROM empresas e LEFT JOIN parceiros p ON p.id = e.parceiro_id LEFT JOIN usuarios u ON u.id = e.responsavel_id
    ${w.length ? 'WHERE ' + w.join(' AND ') : ''} ORDER BY e.atualizado_em DESC LIMIT 500`;
  return todos<Empresa>(sql, a);
}

export function getEmpresa(id: number): Promise<Empresa | undefined> {
  return um<Empresa>(`SELECT e.*, p.nome AS parceiro_nome, u.nome AS responsavel_nome FROM empresas e
    LEFT JOIN parceiros p ON p.id = e.parceiro_id LEFT JOIN usuarios u ON u.id = e.responsavel_id WHERE e.id = ?`, [id]);
}

export type NovaEmpresa = Partial<Omit<Empresa, 'id' | 'criado_em' | 'atualizado_em'>> & { nome: string };
const CAMPOS_NOVA = ['nome', 'cnpj', 'nicho_id', 'cidade', 'uf', 'contato_nome', 'cargo', 'email', 'telefone', 'faturamento_mensal',
  'etapa', 'origem', 'responsavel_id', 'parceiro_id', 'observacoes', 'consentimento'] as const;
export async function criarEmpresa(d: NovaEmpresa): Promise<number> {
  const v: Record<string, unknown> = {
    cnpj: null, nicho_id: null, cidade: null, uf: null, contato_nome: null, cargo: null, email: null, telefone: null,
    faturamento_mensal: null, etapa: 'lead', origem: 'manual', responsavel_id: null, parceiro_id: null, observacoes: null, consentimento: 0, ...d,
  };
  const r = await um<{ id: number }>(`INSERT INTO empresas (${CAMPOS_NOVA.join(', ')}) VALUES (${CAMPOS_NOVA.map(() => '?').join(', ')}) RETURNING id`,
    CAMPOS_NOVA.map(c => v[c] ?? null));
  const id = r!.id;
  if (d.nicho_id) await popularChecklist(id, d.nicho_id);
  return id;
}

export async function atualizarEmpresa(id: number, d: Partial<Empresa>) {
  const campos = ['nome', 'cnpj', 'nicho_id', 'cidade', 'uf', 'contato_nome', 'cargo', 'email', 'telefone', 'faturamento_mensal', 'etapa', 'responsavel_id', 'parceiro_id', 'observacoes'] as const;
  const sets = campos.filter(c => c in d);
  if (!sets.length) return;
  await executar(`UPDATE empresas SET ${sets.map(c => `${c} = ?`).join(', ')}, atualizado_em = ${AGORA} WHERE id = ?`,
    [...sets.map(c => (d as Record<string, unknown>)[c] ?? null), id]);
  if (d.nicho_id) {
    const tem = await um<{ n: number }>('SELECT COUNT(*)::int n FROM checklist WHERE empresa_id = ?', [id]);
    if (!tem?.n) await popularChecklist(id, d.nicho_id);
  }
}

export async function excluirEmpresa(id: number) {
  await executar('DELETE FROM empresas WHERE id = ?', [id]);
}

export async function popularChecklist(empresaId: number, nichoId: string) {
  const n = getNicho(nichoId);
  if (!n) return;
  const itens: [string, string, number][] = [
    ...n.perguntas_diagnostico.map((t, i) => ['pergunta', t, i] as [string, string, number]),
    ...n.dados_para_coletar.map((t, i) => ['documento', t, 100 + i] as [string, string, number]),
  ];
  if (!itens.length) return;
  await executar(`INSERT INTO checklist (empresa_id, tipo, texto, ordem) VALUES ${itens.map(() => '(?, ?, ?, ?)').join(', ')}`,
    itens.flatMap(([tipo, texto, ordem]) => [empresaId, tipo, texto, ordem]));
}

export interface ItemChecklist { id: number; tipo: 'pergunta' | 'documento' | 'tarefa'; texto: string; feito: number; resposta: string | null; ordem: number }
export const listarChecklist = (empresaId: number) =>
  todos<ItemChecklist>('SELECT * FROM checklist WHERE empresa_id = ? ORDER BY ordem, id', [empresaId]);

export interface Nota { id: number; texto: string; criado_em: string; usuario_nome: string | null }
export const listarNotas = (empresaId: number) =>
  todos<Nota>('SELECT n.*, u.nome AS usuario_nome FROM notas n LEFT JOIN usuarios u ON u.id = n.usuario_id WHERE n.empresa_id = ? ORDER BY n.criado_em DESC, n.id DESC', [empresaId]);
export async function adicionarNota(empresaId: number, usuarioId: number | null, texto: string) {
  await executar('INSERT INTO notas (empresa_id, usuario_id, texto) VALUES (?, ?, ?)', [empresaId, usuarioId, texto]);
  await executar(`UPDATE empresas SET atualizado_em = ${AGORA} WHERE id = ?`, [empresaId]);
}

// ---------- simulações ----------
export interface Resumo {
  receitaMensal: number; anoTeste: number; necessidadeTeste: number; favoravelTeste: number; semaforo: string; custoAnoTeste: number;
  pct2028: { favoravel: number; prudente: number }; pct2033: { favoravel: number; prudente: number }; prudente2033: number; modo: string;
}
export interface Simulacao {
  id: number; empresa_id: number | null; nicho_id: string; nome: string; valores: Valores; parametros: ParametrosGlobais; caixa: Caixa;
  resumo: Resumo; versao_base: string; token: string; criado_por: number | null; criado_em: string; atualizado_em: string;
  empresa_nome?: string | null;
}
type LinhaSim = Omit<Simulacao, 'valores' | 'parametros' | 'caixa' | 'resumo'> & { valores: string; parametros: string; caixa: string; resumo: string };
const parseSim = (r: LinhaSim): Simulacao => ({ ...r, valores: JSON.parse(r.valores), parametros: JSON.parse(r.parametros), caixa: JSON.parse(r.caixa), resumo: JSON.parse(r.resumo) });

export function resumir(nichoId: string, valores: Valores, parametros: ParametrosGlobais, caixa: Caixa): Resumo {
  const n = getNicho(nichoId)!;
  const r = calcular(n, { valores, parametros, caixa });
  const a28 = r.anos.find(a => a.ano === 2028)!;
  const a33 = r.anos.find(a => a.ano === 2033)!;
  const t = r.teste;
  const fav = r.anos.find(a => a.ano === t.ano)?.favoravel ?? 0;
  return {
    receitaMensal: r.receitaMensal, anoTeste: t.ano, necessidadeTeste: t.need, favoravelTeste: fav, semaforo: r.derivacao.modo === 'motor' ? t.verdict : 'n/a',
    custoAnoTeste: t.costYear, modo: r.derivacao.modo,
    pct2028: { favoravel: r.pctMes(2028, 'favoravel'), prudente: r.pctMes(2028, 'prudente') },
    pct2033: { favoravel: r.pctMes(2033, 'favoravel'), prudente: r.pctMes(2033, 'prudente') },
    prudente2033: a33.prudente, ...(a28 ? {} : {}),
  };
}

export async function salvarSimulacao(d: { id?: number; empresa_id: number | null; nicho_id: string; nome: string; valores: Valores; parametros: ParametrosGlobais; caixa: Caixa; criado_por: number | null }): Promise<Simulacao> {
  const resumo = resumir(d.nicho_id, d.valores, d.parametros, d.caixa);
  const versao = getBase().versao;
  let id = d.id;
  if (id) {
    await executar(`UPDATE simulacoes SET empresa_id = ?, nome = ?, valores = ?, parametros = ?, caixa = ?, resumo = ?, versao_base = ?, atualizado_em = ${AGORA} WHERE id = ?`,
      [d.empresa_id, d.nome, JSON.stringify(d.valores), JSON.stringify(d.parametros), JSON.stringify(d.caixa), JSON.stringify(resumo), versao, id]);
  } else {
    const r = await um<{ id: number }>(`INSERT INTO simulacoes (empresa_id, nicho_id, nome, valores, parametros, caixa, resumo, versao_base, token, criado_por)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING id`, [d.empresa_id, d.nicho_id, d.nome, JSON.stringify(d.valores), JSON.stringify(d.parametros),
      JSON.stringify(d.caixa), JSON.stringify(resumo), versao, tokenAleatorio(18), d.criado_por]);
    id = r!.id;
  }
  if (d.empresa_id) await executar(`UPDATE empresas SET atualizado_em = ${AGORA} WHERE id = ?`, [d.empresa_id]);
  return (await getSimulacao(id))!;
}

const SELECT_SIM = 'SELECT s.*, e.nome AS empresa_nome FROM simulacoes s LEFT JOIN empresas e ON e.id = s.empresa_id';
export async function getSimulacao(id: number): Promise<Simulacao | undefined> {
  const r = await um<LinhaSim>(`${SELECT_SIM} WHERE s.id = ?`, [id]);
  return r ? parseSim(r) : undefined;
}
export async function getSimulacaoPorToken(token: string): Promise<Simulacao | undefined> {
  const r = await um<LinhaSim>(`${SELECT_SIM} WHERE s.token = ?`, [token]);
  return r ? parseSim(r) : undefined;
}
export async function listarSimulacoes(u: Usuario, empresaId?: number): Promise<Simulacao[]> {
  const w: string[] = [];
  const a: unknown[] = [];
  if (empresaId) { w.push('s.empresa_id = ?'); a.push(empresaId); }
  if (u.papel === 'parceiro') { w.push('(e.parceiro_id = ? OR s.criado_por = ?)'); a.push(u.parceiro_id, u.id); }
  const rows = await todos<LinhaSim>(`${SELECT_SIM} ${w.length ? 'WHERE ' + w.join(' AND ') : ''} ORDER BY s.atualizado_em DESC, s.id DESC LIMIT 300`, a);
  return rows.map(parseSim);
}
export async function excluirSimulacao(id: number) { await executar('DELETE FROM simulacoes WHERE id = ?', [id]); }

/** Simulações calculadas com parâmetros diferentes dos atuais (ex.: depois que o Senado fixar a CBS). */
export function simulacaoDesatualizada(s: Simulacao, atuais: ParametrosGlobais) {
  return JSON.stringify(s.parametros) !== JSON.stringify(atuais);
}
export async function recalcularTodas(): Promise<number> {
  const p = await getParametros();
  const rows = await todos<LinhaSim>('SELECT * FROM simulacoes');
  for (const r of rows) {
    const s = parseSim(r);
    await executar(`UPDATE simulacoes SET parametros = ?, resumo = ?, atualizado_em = ${AGORA} WHERE id = ?`,
      [JSON.stringify(p), JSON.stringify(resumir(s.nicho_id, s.valores, p, s.caixa)), s.id]);
  }
  return rows.length;
}

export async function simulacaoInicial(nichoId: string) {
  const n = getNicho(nichoId)!;
  return { valores: valoresPadrao(n), caixa: caixaPadrao(n), parametros: await getParametros() };
}

// ---------- parceiros ----------
export interface Parceiro {
  id: number; slug: string; nome: string; cor: string | null; logo_url: string | null; contato_nome: string | null; email: string | null;
  telefone: string | null; cidade: string | null; repasse_pct: number; ativo: number; criado_em: string; total_empresas?: number; em_acompanhamento?: number;
}
export const listarParceiros = () => todos<Parceiro>(`SELECT p.*, (SELECT COUNT(*)::int FROM empresas e WHERE e.parceiro_id = p.id) AS total_empresas,
  (SELECT COUNT(*)::int FROM empresas e WHERE e.parceiro_id = p.id AND e.etapa IN ('diagnostico','execucao','acompanhamento')) AS em_acompanhamento
  FROM parceiros p ORDER BY p.nome`);
export const getParceiro = (id: number) => um<Parceiro>('SELECT * FROM parceiros WHERE id = ?', [id]);
export const getParceiroPorSlug = (slug: string) => um<Parceiro>('SELECT * FROM parceiros WHERE slug = ? AND ativo = 1', [slug]);

// ---------- painel ----------
export async function painel(u: Usuario) {
  const esc = u.papel === 'parceiro' ? 'WHERE parceiro_id = ' + Number(u.parceiro_id) : '';
  const e = esc ? esc + ' AND' : 'WHERE';
  const [porEtapa, novos30, doSite] = await Promise.all([
    todos<{ etapa: string; n: number }>(`SELECT etapa, COUNT(*)::int n FROM empresas ${esc} GROUP BY etapa`),
    um<{ n: number }>(`SELECT COUNT(*)::int n FROM empresas ${e} criado_em >= ${HA_30_DIAS}`),
    um<{ n: number }>(`SELECT COUNT(*)::int n FROM empresas ${e} origem IN ('site','parceiro') AND criado_em >= ${HA_30_DIAS}`),
  ]);
  return { porEtapa, novos30: novos30?.n ?? 0, doSite: doSite?.n ?? 0 };
}
