# Briefing: fórmulas do formulário por nicho

Projeto: plataforma web de diagnóstico de caixa do split payment de IBS/CBS (Next.js + TypeScript), em `/home/joaoemanuel/git/split/plataforma`.

## O problema
Cada nicho da base (`data/base-nichos-split.json`) tem `campos_especificos`: os campos do formulário que o usuário preenche. Cada campo diz em `alvos` o que altera (atributos de `linhas_receita`/`linhas_compra`, `receita_mensal`, `prazo_pagamento_fornecedor_dias`, `mensagem`, `regra_especial`) e em `derivacao` a fórmula, em texto livre. O motor de cálculo (`src/lib/engine/engine_v2.js`, NÃO MEXA nele) recebe as linhas.

A camada genérica (`src/lib/derive/core.ts`, leia inteira antes de começar; NÃO MEXA nela) já faz:
1. parte das linhas padrão do nicho (cópia);
2. aplica os campos de atribuição direta: campo numérico, não booleano, cujo padrão é igual ao valor de TODOS os alvos na base → cada alvo recebe o valor do campo (função `ehDireto`);
3. modo genérico para campos `regime_empresa`, `regime_ibs_cbs`, `tipo_representante`, `condicao_produtor` com valor `simples_puro`, `simples`, `pj_simples_puro` → modo `simples_puro`; `nao_contribuinte` → modo `nao_contribuinte`;
4. roda a SUA função do nicho;
5. zera negativos, limita percentuais a 0–100 e normaliza a soma das `participacao_pct` para 100 com aviso.

## Sua tarefa
Escrever, para cada nicho do seu lote, a função `Deriver` que implementa as fórmulas de `derivacao` que a camada genérica não cobre, no arquivo `src/lib/derive/niches/Cxx.ts` de cada categoria (os arquivos já existem como esqueleto; substitua o conteúdo mantendo os dois exports `derivers` e `excecoes`). O extrato compacto do seu lote está em `scripts/extratos/lote_X.json` (linhas, campos com `alvos` e `derivacao`, `regras_especiais_calculo`, `simples_nacional`). Leia a `derivacao` de TODOS os campos de cada nicho, inclusive os que parecem diretos.

API do contexto `c` (ver `Ctx` em core.ts):
- `c.num('campo')`, `c.bool('campo')`, `c.str('campo')`: valores do formulário (percentuais em 0–100, não em fração).
- `c.r(linha, atributo, valor)` / `c.c(linha, atributo, valor)`: define atributo de linha de receita / compra. Valor `null` remove o atributo (ex.: "remover aliquota_especifica_por_ano").
- `c.getR`, `c.getC`, `c.linhasR()`, `c.linhasC()`: leitura (para "todas as linhas", filtros por `cliente`, etc.).
- `c.receita(x)`, `c.prazoFornecedor(x)`.
- `c.msg(texto, 'info' | 'alerta', campoId)`: avisos ao usuário. Use quando a `derivacao` ou as `regras_especiais_calculo` mandam mostrar mensagem/alerta numa condição. Texto em português claro, frases curtas, sem travessões.
- `c.modo('simples_puro' | 'nao_contribuinte' | 'fora_escopo', texto)`: quando o motor não deve rodar (ex.: produtor não contribuinte, regime fora do escopo). O texto explica ao usuário o que muda e o que analisar.
- `c.extra(rotulo, cc => { ... }, descricao)`: cálculo adicional só para exibição (ex.: `simular_cartao_futuro`, `simular_financiamento`, `simular_b2c`): recebe uma cópia do modelo; o resultado principal não muda.

Convenções:
- Fórmulas com "×" sobre percentuais: `pct_cmv × (1 − pct_simples)` com os dois em 0–100 vira `num('pct_cmv') * (1 - num('pct_simples')/100)`. Confira contra os valores padrão das linhas: com os padrões, sua função TEM de reproduzir exatamente as linhas da base.
- "resto" / "100 − a − b": calcule; se ficar negativo, a normalização genérica zera e avisa. Não trave campo.
- Campos com alvo `regra_especial`/`mensagem` sem fórmula numérica: implemente a regra (modo, mensagem ou extra) conforme o texto.
- Campos de seleção com valor texto que escolhem tabelas por ano (ex.: `aliquota_especifica_por_ano` com curvas descritas no texto): implemente as tabelas descritas. Se o texto não der todos os números, use os da linha padrão da base para a opção padrão e documente a hipótese num comentário.
- Booleanos: `c.bool(id)`.
- Não invente regra tributária que não está na `derivacao` ou nas `regras_especiais_calculo`. Se uma fórmula for ambígua, escolha a leitura que reproduz os padrões e deixe um comentário `// HIPÓTESE: ...`.
- `excecoes`: só para campos que, por desenho, não mudam nenhum alvo quando variam sozinhos a partir do padrão (ex.: campo que só importa quando outro campo é diferente de zero). Formato `{ 'C02-05': { pct_sub_regular: 'motivo' } }`. Use com parcimônia e explique o motivo.
- Código TypeScript limpo, uma função por nicho, comentário de uma linha com o nome do nicho. Sem dependências novas.

## Como testar (obrigatório)
```
cd /home/joaoemanuel/git/split/plataforma
npx tsx scripts/test-derive.ts C02,C14      # filtro pelos prefixos do seu lote
VERBOSE=1 npx tsx scripts/test-derive.ts C02 # mostra também mudanças fora dos alvos declarados
npx tsc --noEmit -p .                        # checagem de tipos (pode acusar erros de outros lotes em andamento; olhe só os seus arquivos)
```
Critérios: [A] 100% dos seus nichos ok (padrão reproduz a base e o resultado de exemplo) e [B] zero falhas no seu lote. Avisos [C] são aceitáveis quando a fórmula mexe legitimamente em linha "resto" ou em linha não listada em `alvos`; revise-os com VERBOSE=1 e corrija os que forem erro seu.

Outros agentes estão editando os outros arquivos `niches/*.ts` ao mesmo tempo: edite SOMENTE os arquivos das suas categorias. Não edite core.ts, index.ts, o motor, a base nem os scripts.

## Entrega
Responda em até 15 linhas: nichos cobertos, resultado final dos testes do seu lote (copie as três linhas de resumo), exceções declaradas e hipóteses que você assumiu em fórmulas ambíguas.
