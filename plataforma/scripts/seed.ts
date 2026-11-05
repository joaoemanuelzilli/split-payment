// Cria o primeiro administrador (e, com --demo, um parceiro e clientes de exemplo).
// Uso: ADMIN_EMAIL=voce@empresa.com ADMIN_SENHA='senha-forte' npm run seed [-- --demo]
// Usa o DATABASE_URL do ambiente ou do arquivo .env.local; sem ele, o banco embutido em data/pg.
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const envLocal = path.join(__dirname, '..', '.env.local');
if (!process.env.DATABASE_URL && fs.existsSync(envLocal)) {
  for (const linha of fs.readFileSync(envLocal, 'utf8').split('\n')) {
    const m = linha.match(/^\s*DATABASE_URL\s*=\s*"?([^"\n]+)"?\s*$/);
    if (m) process.env.DATABASE_URL = m[1].trim();
  }
}
const email = (process.env.ADMIN_EMAIL || 'admin@exemplo.com.br').toLowerCase();
const senha = process.env.ADMIN_SENHA || crypto.randomBytes(9).toString('base64url');
const hash = (s: string) => { const sal = crypto.randomBytes(16); return ['scrypt', sal.toString('hex'), crypto.scryptSync(s, sal, 64).toString('hex')].join(':'); };

async function main() {
  const { executar, um } = await import('../src/lib/db');
  const existe = await um('SELECT id FROM usuarios WHERE email = ?', [email]);
  if (existe) console.log(`Usuário ${email} já existe; nada mudou.`);
  else {
    await executar("INSERT INTO usuarios (email, nome, senha_hash, papel) VALUES (?, 'Administrador', ?, 'admin')", [email, hash(senha)]);
    console.log(`Administrador criado: ${email}  senha: ${senha}`);
  }
  if (process.argv.includes('--demo')) {
    await executar("INSERT INTO parceiros (slug, nome, cor, contato_nome, cidade, repasse_pct) VALUES ('contabil-exemplo', 'Contábil Exemplo', '#1F4E79', 'Sócia do escritório', 'Uberlândia, MG', 20) ON CONFLICT (slug) DO NOTHING");
    const par = (await um<{ id: number }>("SELECT id FROM parceiros WHERE slug = 'contabil-exemplo'"))!;
    const n = (await um<{ n: number }>('SELECT COUNT(*)::int n FROM empresas'))!.n;
    if (!n) {
      const ins = "INSERT INTO empresas (nome, nicho_id, cidade, uf, contato_nome, faturamento_mensal, etapa, origem, parceiro_id) VALUES (?, ?, 'Uberlândia', 'MG', ?, ?, ?, ?, ?)";
      await executar(ins, ['Distribuidora Exemplo Ltda', 'C01-01', 'Diretor financeiro', 8000000, 'qualificado', 'manual', null]);
      await executar(ins, ['Transportes Exemplo', 'C12-02', 'Sócio', 2500000, 'lead', 'parceiro', par.id]);
      console.log('Dados de exemplo criados: 1 parceiro e 2 clientes (sem simulação; crie pelo simulador).');
    }
  }
  process.exit(0);
}
main().catch(e => { console.error(e); process.exit(1); });
