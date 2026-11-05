// Cópia consistente do banco SQLite (funciona com o servidor no ar) em <pasta do banco>/backups,
// mantendo as BACKUP_MANTER mais recentes (padrão 14). Uso: node scripts/backup.mjs
import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';

const origem = process.env.DATABASE_PATH || path.join(process.cwd(), 'data', 'app.db');
const pasta = process.env.BACKUP_DIR || path.join(path.dirname(origem), 'backups');
const manter = Math.max(1, Number(process.env.BACKUP_MANTER) || 14);

if (!fs.existsSync(origem)) { console.log(`backup: banco ainda não existe em ${origem}`); process.exit(0); }
fs.mkdirSync(pasta, { recursive: true });
const carimbo = new Date().toISOString().slice(0, 19).replace(/[-:]/g, '').replace('T', '-');
const destino = path.join(pasta, `app-${carimbo}.db`);
const db = new Database(origem, { readonly: true, fileMustExist: true });
await db.backup(destino);
db.close();
const antigos = fs.readdirSync(pasta).filter(f => /^app-\d{8}-\d{6}\.db$/.test(f)).sort().slice(0, -manter);
for (const f of antigos) fs.unlinkSync(path.join(pasta, f));
console.log(`backup: ${destino} (${(fs.statSync(destino).size / 1024).toFixed(0)} KB); removidos ${antigos.length} antigos`);
