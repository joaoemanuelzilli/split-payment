// Cria o primeiro administrador (e, com --demo, um parceiro e clientes de exemplo).
// Uso: ADMIN_EMAIL=voce@empresa.com ADMIN_SENHA='senha-forte' npm run seed [-- --demo]
import Database from 'better-sqlite3';
import crypto from 'node:crypto';
import path from 'node:path';
import fs from 'node:fs';

const arquivo = process.env.DATABASE_PATH || path.join(__dirname, '..', 'data', 'app.db');
fs.mkdirSync(path.dirname(arquivo), { recursive: true });
const email = (process.env.ADMIN_EMAIL || 'admin@exemplo.com.br').toLowerCase();
const senha = process.env.ADMIN_SENHA || crypto.randomBytes(9).toString('base64url');
const hash = (s: string) => { const sal = crypto.randomBytes(16); return ['scrypt', sal.toString('hex'), crypto.scryptSync(s, sal, 64).toString('hex')].join(':'); };

// garante o esquema importando a app uma vez seria pesado; repetimos o mínimo necessário via a própria lib
process.env.DATABASE_PATH = arquivo;
async function main() {
  const { db } = await import('../src/lib/db');
  const d: Database.Database = db();
  const existe = d.prepare('SELECT id FROM usuarios WHERE email = ?').get(email);
  if (existe) console.log(`Usuário ${email} já existe; nada mudou.`);
  else {
    d.prepare("INSERT INTO usuarios (email, nome, senha_hash, papel) VALUES (?, 'Administrador', ?, 'admin')").run(email, hash(senha));
    console.log(`Administrador criado: ${email}  senha: ${senha}`);
  }
  if (process.argv.includes('--demo')) {
    d.prepare("INSERT OR IGNORE INTO parceiros (slug, nome, cor, contato_nome, cidade, repasse_pct) VALUES ('contabil-exemplo', 'Contábil Exemplo', '#1F4E79', 'Sócia do escritório', 'Uberlândia, MG', 20)").run();
    const par = d.prepare("SELECT id FROM parceiros WHERE slug = 'contabil-exemplo'").get() as { id: number };
    const ins = d.prepare(`INSERT INTO empresas (nome, nicho_id, cidade, uf, contato_nome, faturamento_mensal, etapa, origem, parceiro_id) VALUES (?, ?, 'Uberlândia', 'MG', ?, ?, ?, ?, ?)`);
    const n = (d.prepare('SELECT COUNT(*) n FROM empresas').get() as { n: number }).n;
    if (!n) {
      ins.run('Distribuidora Exemplo Ltda', 'C01-01', 'Diretor financeiro', 8000000, 'qualificado', 'manual', null);
      ins.run('Transportes Exemplo', 'C12-02', 'Sócio', 2500000, 'lead', 'parceiro', par.id);
      console.log('Dados de exemplo criados: 1 parceiro e 2 clientes (sem simulação; crie pelo simulador).');
    }
  }
}
main();
