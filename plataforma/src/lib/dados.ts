import 'server-only';
import { db, getSetting, setSetting } from './db';
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
export function getParametros(): ParametrosGlobais {
  return getSetting<ParametrosGlobais>('parametros', parametrosBase());
}
export function salvarParametros(p: ParametrosGlobais, motivo: string, u: Usuario) {
  setSetting('parametros', p);
  db().prepare('INSERT INTO parametros_historico (valores, motivo, usuario_id) VALUES (?, ?, ?)').run(JSON.stringify(p), motivo, u.id);
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

export function listarEmpresas(u: Usuario, filtro: { etapa?: string; q?: string; parceiro?: number } = {}): Empresa[] {
  const w: string[] = [];
  const a: unknown[] = [];
  if (u.papel === 'parceiro') { w.push('e.parceiro_id = ?'); a.push(u.parceiro_id); }
  if (filtro.etapa) { w.push('e.etapa = ?'); a.push(filtro.etapa); }
  if (filtro.parceiro) { w.push('e.parceiro_id = ?'); a.push(filtro.parceiro); }
  if (filtro.q) { w.push('(e.nome LIKE ? OR e.cnpj LIKE ? OR e.contato_nome LIKE ? OR e.email LIKE ?)'); const q = `%${filtro.q}%`; a.push(q, q, q, q); }
  const sql = `SELECT e.*, p.nome AS parceiro_nome, u.nome AS responsavel_nome,
      (SELECT json_extract(s.resumo, '$.necessidadeTeste') FROM simulacoes s WHERE s.empresa_id = e.id ORDER BY s.atualizado_em DESC LIMIT 1) AS ultima_necessidade,
      (SELECT json_extract(s.resumo, '$.semaforo') FROM simulacoes s WHERE s.empresa_id = e.id ORDER BY s.atualizado_em DESC LIMIT 1) AS semaforo
    FROM empresas e LEFT JOIN parceiros p ON p.id = e.parceiro_id LEFT JOIN usuarios u ON u.id = e.responsavel_id
    ${w.length ? 'WHERE ' + w.join(' AND ') : ''} ORDER BY e.atualizado_em DESC LIMIT 500`;
  return db().prepare(sql).all(...a) as Empresa[];
}

export function getEmpresa(id: number): Empresa | undefined {
  return db().prepare(`SELECT e.*, p.nome AS parceiro_nome, u.nome AS responsavel_nome FROM empresas e
    LEFT JOIN parceiros p ON p.id = e.parceiro_id LEFT JOIN usuarios u ON u.id = e.responsavel_id WHERE e.id = ?`).get(id) as Empresa | undefined;
}

export type NovaEmpresa = Partial<Omit<Empresa, 'id' | 'criado_em' | 'atualizado_em'>> & { nome: string };
export function criarEmpresa(d: NovaEmpresa): number {
  const r = db().prepare(`INSERT INTO empresas (nome, cnpj, nicho_id, cidade, uf, contato_nome, cargo, email, telefone, faturamento_mensal,
      etapa, origem, responsavel_id, parceiro_id, observacoes, consentimento)
    VALUES (@nome, @cnpj, @nicho_id, @cidade, @uf, @contato_nome, @cargo, @email, @telefone, @faturamento_mensal,
      @etapa, @origem, @responsavel_id, @parceiro_id, @observacoes, @consentimento)`).run({
    cnpj: null, nicho_id: null, cidade: null, uf: null, contato_nome: null, cargo: null, email: null, telefone: null,
    faturamento_mensal: null, etapa: 'lead', origem: 'manual', responsavel_id: null, parceiro_id: null, observacoes: null, consentimento: 0, ...d,
  });
  const id = Number(r.lastInsertRowid);
  if (d.nicho_id) popularChecklist(id, d.nicho_id);
  return id;
}

export function atualizarEmpresa(id: number, d: Partial<Empresa>) {
  const campos = ['nome', 'cnpj', 'nicho_id', 'cidade', 'uf', 'contato_nome', 'cargo', 'email', 'telefone', 'faturamento_mensal', 'etapa', 'responsavel_id', 'parceiro_id', 'observacoes'] as const;
  const sets = campos.filter(c => c in d);
  if (!sets.length) return;
  const vals: Record<string, unknown> = { id };
  for (const c of sets) vals[c] = (d as Record<string, unknown>)[c];
  db().prepare(`UPDATE empresas SET ${sets.map(c => `${c} = @${c}`).join(', ')}, atualizado_em = datetime('now') WHERE id = @id`).run(vals);
  if (d.nicho_id) {
    const tem = db().prepare('SELECT COUNT(*) n FROM checklist WHERE empresa_id = ?').get(id) as { n: number };
    if (!tem.n) popularChecklist(id, d.nicho_id);
  }
}

export function excluirEmpresa(id: number) {
  db().prepare('DELETE FROM empresas WHERE id = ?').run(id);
}

export function popularChecklist(empresaId: number, nichoId: string) {
  const n = getNicho(nichoId);
  if (!n) return;
  const ins = db().prepare('INSERT INTO checklist (empresa_id, tipo, texto, ordem) VALUES (?, ?, ?, ?)');
  const tx = db().transaction(() => {
    n.perguntas_diagnostico.forEach((t, i) => ins.run(empresaId, 'pergunta', t, i));
    n.dados_para_coletar.forEach((t, i) => ins.run(empresaId, 'documento', t, 100 + i));
  });
  tx();
}

export interface ItemChecklist { id: number; tipo: 'pergunta' | 'documento' | 'tarefa'; texto: string; feito: number; resposta: string | null; ordem: number }
export const listarChecklist = (empresaId: number) =>
  db().prepare('SELECT * FROM checklist WHERE empresa_id = ? ORDER BY ordem, id').all(empresaId) as ItemChecklist[];

export interface Nota { id: number; texto: string; criado_em: string; usuario_nome: string | null }
export const listarNotas = (empresaId: number) =>
  db().prepare('SELECT n.*, u.nome AS usuario_nome FROM notas n LEFT JOIN usuarios u ON u.id = n.usuario_id WHERE empresa_id = ? ORDER BY n.criado_em DESC').all(empresaId) as Nota[];
export function adicionarNota(empresaId: number, usuarioId: number | null, texto: string) {
  db().prepare('INSERT INTO notas (empresa_id, usuario_id, texto) VALUES (?, ?, ?)').run(empresaId, usuarioId, texto);
  db().prepare("UPDATE empresas SET atualizado_em = datetime('now') WHERE id = ?").run(empresaId);
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

export function salvarSimulacao(d: { id?: number; empresa_id: number | null; nicho_id: string; nome: string; valores: Valores; parametros: ParametrosGlobais; caixa: Caixa; criado_por: number | null }): Simulacao {
  const resumo = resumir(d.nicho_id, d.valores, d.parametros, d.caixa);
  const versao = getBase().versao;
  if (d.id) {
    db().prepare(`UPDATE simulacoes SET empresa_id = ?, nome = ?, valores = ?, parametros = ?, caixa = ?, resumo = ?, versao_base = ?, atualizado_em = datetime('now') WHERE id = ?`)
      .run(d.empresa_id, d.nome, JSON.stringify(d.valores), JSON.stringify(d.parametros), JSON.stringify(d.caixa), JSON.stringify(resumo), versao, d.id);
    if (d.empresa_id) db().prepare("UPDATE empresas SET atualizado_em = datetime('now') WHERE id = ?").run(d.empresa_id);
    return getSimulacao(d.id)!;
  }
  const r = db().prepare(`INSERT INTO simulacoes (empresa_id, nicho_id, nome, valores, parametros, caixa, resumo, versao_base, token, criado_por)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(d.empresa_id, d.nicho_id, d.nome, JSON.stringify(d.valores), JSON.stringify(d.parametros),
    JSON.stringify(d.caixa), JSON.stringify(resumo), versao, tokenAleatorio(18), d.criado_por);
  if (d.empresa_id) db().prepare("UPDATE empresas SET atualizado_em = datetime('now') WHERE id = ?").run(d.empresa_id);
  return getSimulacao(Number(r.lastInsertRowid))!;
}

export function getSimulacao(id: number): Simulacao | undefined {
  const r = db().prepare('SELECT s.*, e.nome AS empresa_nome FROM simulacoes s LEFT JOIN empresas e ON e.id = s.empresa_id WHERE s.id = ?').get(id) as LinhaSim | undefined;
  return r ? parseSim(r) : undefined;
}
export function getSimulacaoPorToken(token: string): Simulacao | undefined {
  const r = db().prepare('SELECT s.*, e.nome AS empresa_nome FROM simulacoes s LEFT JOIN empresas e ON e.id = s.empresa_id WHERE s.token = ?').get(token) as LinhaSim | undefined;
  return r ? parseSim(r) : undefined;
}
export function listarSimulacoes(u: Usuario, empresaId?: number): Simulacao[] {
  const w: string[] = [];
  const a: unknown[] = [];
  if (empresaId) { w.push('s.empresa_id = ?'); a.push(empresaId); }
  if (u.papel === 'parceiro') { w.push('(e.parceiro_id = ? OR s.criado_por = ?)'); a.push(u.parceiro_id, u.id); }
  const rows = db().prepare(`SELECT s.*, e.nome AS empresa_nome FROM simulacoes s LEFT JOIN empresas e ON e.id = s.empresa_id
    ${w.length ? 'WHERE ' + w.join(' AND ') : ''} ORDER BY s.atualizado_em DESC LIMIT 300`).all(...a) as LinhaSim[];
  return rows.map(parseSim);
}
export function excluirSimulacao(id: number) { db().prepare('DELETE FROM simulacoes WHERE id = ?').run(id); }

/** Simulações calculadas com parâmetros diferentes dos atuais (ex.: depois que o Senado fixar a CBS). */
export function simulacaoDesatualizada(s: Simulacao, atuais = getParametros()) {
  return JSON.stringify(s.parametros) !== JSON.stringify(atuais);
}
export function recalcularTodas(): number {
  const p = getParametros();
  const rows = db().prepare('SELECT * FROM simulacoes').all() as LinhaSim[];
  const up = db().prepare(`UPDATE simulacoes SET parametros = ?, resumo = ?, atualizado_em = datetime('now') WHERE id = ?`);
  const tx = db().transaction(() => {
    for (const r of rows) {
      const s = parseSim(r);
      up.run(JSON.stringify(p), JSON.stringify(resumir(s.nicho_id, s.valores, p, s.caixa)), s.id);
    }
  });
  tx();
  return rows.length;
}

export function simulacaoInicial(nichoId: string) {
  const n = getNicho(nichoId)!;
  return { valores: valoresPadrao(n), caixa: caixaPadrao(n), parametros: getParametros() };
}

// ---------- parceiros ----------
export interface Parceiro {
  id: number; slug: string; nome: string; cor: string | null; logo_url: string | null; contato_nome: string | null; email: string | null;
  telefone: string | null; cidade: string | null; repasse_pct: number; ativo: number; criado_em: string; total_empresas?: number; em_acompanhamento?: number;
}
export const listarParceiros = () => db().prepare(`SELECT p.*, (SELECT COUNT(*) FROM empresas e WHERE e.parceiro_id = p.id) AS total_empresas,
  (SELECT COUNT(*) FROM empresas e WHERE e.parceiro_id = p.id AND e.etapa IN ('diagnostico','execucao','acompanhamento')) AS em_acompanhamento
  FROM parceiros p ORDER BY p.nome`).all() as Parceiro[];
export const getParceiro = (id: number) => db().prepare('SELECT * FROM parceiros WHERE id = ?').get(id) as Parceiro | undefined;
export const getParceiroPorSlug = (slug: string) => db().prepare('SELECT * FROM parceiros WHERE slug = ? AND ativo = 1').get(slug) as Parceiro | undefined;

// ---------- painel ----------
export function painel(u: Usuario) {
  const esc = u.papel === 'parceiro' ? 'WHERE parceiro_id = ' + Number(u.parceiro_id) : '';
  const porEtapa = db().prepare(`SELECT etapa, COUNT(*) n FROM empresas ${esc} GROUP BY etapa`).all() as { etapa: string; n: number }[];
  const novos30 = db().prepare(`SELECT COUNT(*) n FROM empresas ${esc ? esc + ' AND' : 'WHERE'} criado_em >= datetime('now', '-30 days')`).get() as { n: number };
  const doSite = db().prepare(`SELECT COUNT(*) n FROM empresas ${esc ? esc + ' AND' : 'WHERE'} origem IN ('site','parceiro') AND criado_em >= datetime('now', '-30 days')`).get() as { n: number };
  return { porEtapa, novos30: novos30.n, doSite: doSite.n };
}
