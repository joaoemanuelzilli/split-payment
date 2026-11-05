# Plataforma de diagnóstico de caixa do split payment

Aplicação web que transforma a base de 123 nichos (`data/base-nichos-split.json`) e o motor de cálculo v2 (`src/lib/engine/engine_v2.js`, copiado sem alteração) em três produtos numa só plataforma:

1. **Calculadora pública por setor**, que capta contatos qualificados. A pessoa escolhe o setor, preenche o formulário do setor e vê a faixa de capital de giro extra e o semáforo do caixa. O detalhe e o relatório em PDF saem depois do cadastro (configurável). Cada contato vira um cliente no painel, já com a simulação, o roteiro de reunião e a lista de documentos do setor.
2. **Área do consultor**, para usar nas consultorias: clientes e funil, simulações salvas por cliente, relatório e proposta em PDF, base de conhecimento dos setores (enquadramento, premissas F/E/H, fontes, perguntas, tese) e preço sugerido por faixa de faturamento.
3. **Portal de escritórios parceiros** em marca branca: cada escritório contábil tem uma página `/p/<endereço>` com a própria marca; os contatos chegam marcados com o parceiro, e o parceiro vê só os clientes dele.

## Rodar no computador

Precisa de Node.js 22. Sem configurar nada, a plataforma usa um Postgres embutido, gravado em `data/pg`.

```bash
npm install
ADMIN_EMAIL=voce@empresa.com.br ADMIN_SENHA='uma-senha-forte' npm run seed   # cria o administrador
npm run dev                                                                   # http://localhost:3000
```

`npm run seed -- --demo` também cria um parceiro e dois clientes de exemplo. Para usar um Postgres de verdade, ponha `DATABASE_URL=postgresql://...` em `.env.local`.

## Testes de aceite

```bash
npm test
```

- **Motor:** com as linhas padrão de cada nicho, o motor reproduz o `resultado_exemplo` da base nos 123 nichos.
- **Formulário:** com os valores padrão, o formulário reconstrói exatamente as linhas da base nos 123 nichos, e cada um dos 1.405 campos, mudado sozinho, mexe no que diz mexer (ou no modo, nos avisos e nos cenários extras). Rode antes de publicar qualquer mudança em `src/lib/derive/`.

## Publicar

### Vercel + Supabase (caminho principal)

O site roda na Vercel, na região de São Paulo (`vercel.json`), e o banco é o Postgres do Supabase. As tabelas ficam fechadas para a API pública do Supabase: só o servidor da plataforma lê e grava, e as tabelas são criadas sozinhas na primeira conexão.

1. **Supabase:** crie um projeto, de preferência na região São Paulo. Em **Connect > Transaction pooler**, copie o endereço `postgresql://...:6543/postgres` e troque `[YOUR-PASSWORD]` pela senha do banco.
2. **Administrador:** com esse endereço em `.env.local` (`DATABASE_URL=...`), rode `ADMIN_EMAIL=voce@empresa.com.br ADMIN_SENHA='senha-forte' npm run seed`.
3. **Vercel:** `npx vercel login`, depois, dentro de `plataforma`, `npx vercel link` e as variáveis de produção:
   ```bash
   npx vercel env add DATABASE_URL production        # o endereço do pooler do Supabase
   npx vercel env add TRUSTED_PROXY_HOPS production  # 1
   npx vercel --prod
   ```

Backup: o Supabase faz cópias diárias nos planos pagos. No plano grátis, exporte de vez em quando com `pg_dump` usando o endereço de conexão direta.

### Servidor próprio (VPS com Docker)

`docker-compose.yml` sobe a aplicação, um Postgres, o Caddy (HTTPS automático) e um backup diário com `pg_dump`, que guarda as 14 cópias mais recentes.

1. No registro.br, aponte o domínio (registro **A**) para o IP do servidor.
2. No servidor, instale o Docker e libere só as portas 22, 80 e 443.
3. Na pasta `plataforma`: `cp .env.example .env`, preencha `DOMINIO` e `DB_SENHA`, e rode `docker compose up -d --build`.
4. Crie o administrador: `docker compose exec -e ADMIN_EMAIL=voce@empresa.com.br -e ADMIN_SENHA='senha-forte' app npm run seed`.

**Atualizar:** `git pull && docker compose up -d --build`. **Restaurar um backup:** `docker compose exec backup pg_restore -h db -U postgres -d postgres --clean /backups/<arquivo>.dump`.

Em produção o cookie de sessão é `secure`: publique atrás de HTTPS. Defina também `TRUSTED_PROXY_HOPS` com o número de proxies seus na frente da aplicação (1 com um Nginx ou Caddy; de 1 a 5). Em produção ele é obrigatório: o servidor recusa as ações sem ele, porque é por ele que a plataforma sabe o endereço de quem acessa. Deixe a porta da aplicação acessível só pelo proxy: quem chegar direto nela pode forjar o endereço. Limites, a cada 10 minutos: 8 envios da calculadora por endereço e 300 no total; no login, 30 senhas erradas por endereço; por e-mail, uma tentativa por vez e espera crescente a partir da 5ª errada (até 15 segundos), sem bloquear a conta: a senha certa sempre entra; acima de 300 senhas erradas no total, todo login ganha 2 segundos de espera. Não há bloqueio rígido de conta, trava de conta por tentativa em andamento nem teto global de login, de propósito: os três deixariam qualquer pessoa impedir o acesso de outra. A fila de uma tentativa por vez é por endereço + e-mail. Se quiser trocar essa disponibilidade por um bloqueio mais rígido, a decisão é sua. Os contadores ficam na memória de cada instância. Na Vercel, que sobe várias instâncias conforme o acesso, os limites valem por instância e ficam mais frouxos; se aparecer abuso, leve os contadores para o banco e acrescente um CAPTCHA na calculadora pública. Para testar em produção sem HTTPS, use `COOKIE_INSECURE=1`.

## Quando sair uma norma nova

| Norma | O que fazer |
| --- | --- |
| Senado fixa a CBS de 2027 (até 15/12/2026) | Configurações > Premissas da reforma: trocar a CBS de referência, escrever o motivo e salvar com "recalcular" marcado. A calculadora pública e todas as simulações salvas passam a usar o novo valor. |
| Regra de compensação do crédito (48 horas ou apuração) | Nada no código: os dois cenários já aparecem. Atualizar os textos de aviso se um deles deixar de valer. |
| Split facultativo começa | Ajustar a adesão de 2027. |
| Crédito presumido, Imposto Seletivo ou um nicho mudar | Atualizar a base no pacote de manutenção (pasta `06-manutencao-da-base` do zip: editar o lote, `node validate.js`, `node merge.js`), copiar a nova `base-nichos-split.json` para `data/` e rodar `npm test`. Se um campo do formulário mudar de fórmula, ajustar a função do nicho em `src/lib/derive/niches/`. |

## Estrutura

| Caminho | O que é |
| --- | --- |
| `data/base-nichos-split.json` | A base de nichos, versão 1.1. Fonte de todos os dados. |
| `src/lib/engine/engine_v2.js` | O motor da base, sem alteração. |
| `src/lib/derive/core.ts` | Formulário para linhas do motor: atribuições diretas, normalização das fatias, modos (Simples puro, não contribuinte) e cenários extras. |
| `src/lib/derive/niches/Cxx.ts` | As fórmulas próprias de cada nicho, uma função por nicho, tiradas do campo `derivacao`. |
| `src/lib/calc.ts` | Cálculo completo: motor, teste de caixa, comparação do Simples e preço sugerido. |
| `src/lib/dados.ts`, `db.ts`, `auth.ts` | Banco (Postgres, ou embutido sem `DATABASE_URL`), regras de acesso e sessão. |
| `src/components/Simulador.tsx` | O simulador (público e do consultor). |
| `src/components/Resultado.tsx`, `Relatorio.tsx` | Tela de resultado e relatório em PDF (impressão do navegador). |
| `src/app/(site)`, `src/app/p`, `src/app/relatorio` | Site público, páginas de parceiros e relatório público por link. |
| `src/app/app` | Área de trabalho: painel, clientes, simulador, setores, parceiros, configurações. |
| `scripts/` | Testes de aceite, criação do administrador e o briefing usado para escrever as fórmulas. |
| `vercel.json` | Região da Vercel (São Paulo). |
| `docker-compose.yml`, `Caddyfile`, `.env.example` | Publicação num VPS: aplicação, Postgres, HTTPS e backup diário. |

## Hipóteses assumidas nas fórmulas

Algumas fórmulas da base eram ambíguas. A leitura escolhida é a que reproduz os padrões, e está comentada no código com `// HIPÓTESE`. Para listar todas:

```bash
grep -rn "HIPÓTESE" src/lib/derive/niches
```

## O que a plataforma não promete

É diagnóstico financeiro, não parecer jurídico ou contábil. As datas do split são previsão da Receita Federal, sem ato normativo. Os dois cenários aparecem sempre; o prudente não é o pior caso. O enquadramento e o prazo de ressarcimento dependem de conferência caso a caso. Esses avisos aparecem em toda tela de resultado e em todo relatório.
