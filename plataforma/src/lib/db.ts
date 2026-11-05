import 'server-only';
import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';

const arquivo = process.env.DATABASE_PATH || path.join(process.cwd(), 'data', 'app.db');
type G = typeof globalThis & { __db?: Database.Database };
const g = globalThis as G;

const ESQUEMA = `
CREATE TABLE IF NOT EXISTS settings (
  chave TEXT PRIMARY KEY, valor TEXT NOT NULL, atualizado_em TEXT NOT NULL DEFAULT (datetime('now')));
CREATE TABLE IF NOT EXISTS parceiros (
  id INTEGER PRIMARY KEY, slug TEXT UNIQUE NOT NULL, nome TEXT NOT NULL, cor TEXT, logo_url TEXT,
  contato_nome TEXT, email TEXT, telefone TEXT, cidade TEXT, repasse_pct REAL NOT NULL DEFAULT 20,
  ativo INTEGER NOT NULL DEFAULT 1, criado_em TEXT NOT NULL DEFAULT (datetime('now')));
CREATE TABLE IF NOT EXISTS usuarios (
  id INTEGER PRIMARY KEY, email TEXT UNIQUE NOT NULL, nome TEXT NOT NULL, senha_hash TEXT NOT NULL,
  papel TEXT NOT NULL CHECK (papel IN ('admin','consultor','parceiro')), parceiro_id INTEGER REFERENCES parceiros(id),
  ativo INTEGER NOT NULL DEFAULT 1, criado_em TEXT NOT NULL DEFAULT (datetime('now')));
CREATE TABLE IF NOT EXISTS sessoes (
  token TEXT PRIMARY KEY, usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE, expira_em TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS empresas (
  id INTEGER PRIMARY KEY, nome TEXT NOT NULL, cnpj TEXT, nicho_id TEXT, cidade TEXT, uf TEXT,
  contato_nome TEXT, cargo TEXT, email TEXT, telefone TEXT, faturamento_mensal REAL,
  etapa TEXT NOT NULL DEFAULT 'lead', origem TEXT NOT NULL DEFAULT 'manual',
  responsavel_id INTEGER REFERENCES usuarios(id), parceiro_id INTEGER REFERENCES parceiros(id),
  observacoes TEXT, consentimento INTEGER NOT NULL DEFAULT 0,
  criado_em TEXT NOT NULL DEFAULT (datetime('now')), atualizado_em TEXT NOT NULL DEFAULT (datetime('now')));
CREATE INDEX IF NOT EXISTS empresas_etapa ON empresas(etapa);
CREATE INDEX IF NOT EXISTS empresas_parceiro ON empresas(parceiro_id);
CREATE TABLE IF NOT EXISTS simulacoes (
  id INTEGER PRIMARY KEY, empresa_id INTEGER REFERENCES empresas(id) ON DELETE CASCADE, nicho_id TEXT NOT NULL,
  nome TEXT NOT NULL, valores TEXT NOT NULL, parametros TEXT NOT NULL, caixa TEXT NOT NULL, resumo TEXT NOT NULL,
  versao_base TEXT NOT NULL, token TEXT UNIQUE NOT NULL, criado_por INTEGER REFERENCES usuarios(id),
  criado_em TEXT NOT NULL DEFAULT (datetime('now')), atualizado_em TEXT NOT NULL DEFAULT (datetime('now')));
CREATE INDEX IF NOT EXISTS simulacoes_empresa ON simulacoes(empresa_id);
CREATE TABLE IF NOT EXISTS checklist (
  id INTEGER PRIMARY KEY, empresa_id INTEGER NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL CHECK (tipo IN ('pergunta','documento','tarefa')), texto TEXT NOT NULL,
  feito INTEGER NOT NULL DEFAULT 0, resposta TEXT, ordem INTEGER NOT NULL DEFAULT 0);
CREATE TABLE IF NOT EXISTS notas (
  id INTEGER PRIMARY KEY, empresa_id INTEGER NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  usuario_id INTEGER REFERENCES usuarios(id), texto TEXT NOT NULL, criado_em TEXT NOT NULL DEFAULT (datetime('now')));
CREATE TABLE IF NOT EXISTS parametros_historico (
  id INTEGER PRIMARY KEY, valores TEXT NOT NULL, motivo TEXT, usuario_id INTEGER REFERENCES usuarios(id),
  criado_em TEXT NOT NULL DEFAULT (datetime('now')));
`;

function abrir() {
  fs.mkdirSync(path.dirname(arquivo), { recursive: true });
  const conn = new Database(arquivo);
  conn.pragma('journal_mode = WAL');
  conn.pragma('foreign_keys = ON');
  conn.exec(ESQUEMA);
  return conn;
}

export function db(): Database.Database {
  if (!g.__db) g.__db = abrir();
  return g.__db;
}

export function getSetting<T extends object>(chave: string, padrao: T): T {
  const row = db().prepare('SELECT valor FROM settings WHERE chave = ?').get(chave) as { valor: string } | undefined;
  if (!row) return padrao;
  try {
    const v = JSON.parse(row.valor);
    return Array.isArray(padrao) ? (v as T) : ({ ...padrao, ...v } as T);
  } catch {
    return padrao;
  }
}

export function setSetting(chave: string, valor: unknown) {
  db()
    .prepare(
      `INSERT INTO settings (chave, valor, atualizado_em) VALUES (?, ?, datetime('now'))
       ON CONFLICT(chave) DO UPDATE SET valor = excluded.valor, atualizado_em = excluded.atualizado_em`,
    )
    .run(chave, JSON.stringify(valor));
}
