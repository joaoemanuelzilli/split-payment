# 11 — Revisão independente do estudo "Reforma tributária split payment viabilidade"

Revisor: agente que não escreveu o estudo. Data: 01/11/2026. Cota de busca na web esgotada; nenhuma fonte primária foi reaberta nesta sessão. Tudo o que está marcado "não verificável" ficou assim por isso.

Arquivos produzidos ou alterados:
- `revisao_recalculo.py` e `revisao_recalculo_saida.txt` (recálculo do zero, só numpy e stdlib);
- `modelo_financeiro_v1.py` (cópia intacta do modelo original) e `modelo_financeiro.py` (versão 2, com as correções marcadas "[v2, revisão]");
- CSVs `modelo_*.csv` regenerados pela v2;
- `reports/Reforma tributária split payment viabilidade.md` corrigido e com a seção 12 preenchida;
- esta nota.

---

## 1. O que foi feito, na ordem

1. Leitura integral do prompt, do relatório (979 linhas), das notas 03, 05 e 06 (fontes do recálculo) e do `modelo_financeiro.py` (997 linhas); grep nas notas 01, 02, 04, 07, 08, 09 e 10 para cada número conferido.
2. Reprodutibilidade: `python3 modelo_financeiro.py` (v1) regenerou os 14 CSVs byte a byte iguais aos que estavam na pasta. Conferência célula a célula das tabelas coladas no relatório (6.3, 6.4, 7.1, 7.2, 7.4, 7.5, 8.1 a 8.5, 4.4, 4.5, gates da 8.7) contra os CSVs: todas batiam.
3. Recálculo do zero (`revisao_recalculo.py`, blocos A a F):
   - A) TAM/SAM/SOM com os insumos das notas 03 e 09;
   - B) unit economics por produto com alíquota efetiva do Anexo III por faixa (fórmula do art. 18, §1º-A da LC 123), encargos da nota 05 (27,44% + R$ 1.400) e comissão de canal explícita (20 e 30%) além da revenda com desconto;
   - C) ponto de equilíbrio em clientes (três estruturas de custo fixo) e em meses (rampa de 1 e 2 retainers/mês);
   - D) modelo mensal independente de 122 meses com regras de operação próprias (contrata no primeiro mês de estouro, demite após 3 meses de folga, Fator R pela janela legal dos 12 meses anteriores, sem a regra de "pró-labore só sobe com margem ≥ 5%"), cenários com os mesmos multiplicadores do relatório, VPL/TIR/payback/fundo do vale/valor esperado, variantes do IRRF;
   - E) re-desconto dos fluxos do modelo original (importado da v1) com funções próprias de fator de desconto, VPL, TIR por bissecção e payback;
   - F) diagnósticos sobre o modelo original: carga de horas do fundador, Fator R legal × janela do modelo, IRRF sobre dividendos, break-even econômico, raízes da TIR do pessimista, ARR do múltiplo de saída, meses com demanda acima da capacidade.
4. Auditoria da lógica do script (seção 3 abaixo).
5. Conferência de 20 números contra as notas (seção 4).
6. Amostra de 25 links e checagem de todos os links (seção 5).
7. Dez afirmações mais frágeis (seção 6) e checagens de coerência (seção 7).
8. Correções no documento e no modelo (seção 8) e seção 12 do relatório.

---

## 2. Resultado do recálculo

### 2.1 Aritmética financeira do modelo original: correta

Re-desconto dos fluxos da v1 com funções próprias (fator de meio de período por mês, taxa anual convertida em mensal, valor terminal no fim de dez/2036):

| Cenário | VPL empresa (próprio × modelo) | VPL fundador | TIR empresa | TIR fundador |
|---|---|---|---|---|
| base | 1.241.844 × 1.241.844 | 652.026 × 652.026 | 103,0% × 103,0% | 56,4% × 56,4% |
| pessimista | 53.616 × 53.616 | −94.687 × −94.687 | −23,7% (2 mudanças de sinal) × −23,7% | 11,6% × 11,6% |
| otimista | 6.283.384 × idem | 3.952.816 × idem | 174,2% × idem | 104,1% × idem |
| fracasso | −144.450 × idem | −127.821 × idem | −99,9% | −87,8% |

Fator de desconto de fim de 2036: 0,1126 (relatório 0,1126). VP do valor terminal: 302.486 (relatório 302.486). Payback do fundador recomputado: 50 simples, 74 descontado. Conclusão: VPL, TIR, payback e convenção de meio de período estão implementados corretamente.

### 2.2 Modelo independente (regras próprias) × relatório

| Grandeza | Relatório v1 | Modelo independente | Comentário |
|---|---|---|---|
| VPL empresa base | 1.241.844 | 1.214.138 | diferença de 2%: contrato o analista no 1º mês de estouro (jan a mar/2027 e ago/2027) |
| VPL fundador base | 652.026 | 644.323 | 1% |
| TIR empresa / fundador | 103% / 56,4% | 93,6% / 56,1% | |
| Payback fundador | 50 / 74 | 50 / 74 | igual |
| Break-even EBITDA (3 meses seguidos) | mês 4 | mês 16 | regra de contratação |
| Caixa mínimo base | 77.074 (dez/26) | 38.336 (fev/28) | consome R$ 62 mil em vez de R$ 23 mil |
| Pessimista VPL emp / fund | 53.616 / −94.687 | 12.328 / −100.127 | caixa mínimo −8.909 (fev/28): precisaria de aporte pequeno |
| Otimista VPL emp / fund | 6.283.384 / 3.952.816 | 6.547.628 / 4.143.208 | meu ARR já usa o preço de 2036 |
| Valor esperado emp / fund | 904.327 / 485.145 | 911.438 / 500.626 | |
| TV perpetuidade / múltiplo | 2.685.679 / 5.441.214 | 2.686.316 / 6.224.745 | múltiplo com ARR correto |

Sem a regra de demissão (primeira versão do meu script) o resultado era bem pior (VPL fundador 341.678; TV 607.131), porque o headcount ficava em 10 enquanto a receita caía 15% de 2033 a 2036. Isso mostra que o valor terminal do modelo depende de o operador cortar equipe com a queda da receita; o relatório diz isso em 6.4 ("um operador real cortaria antes").

### 2.3 TAM/SAM/SOM, unit economics, equilíbrio

- TAM pontual: 5,756 + 9,089 + 7,715 = 22,56 bi; 5,64 bi/ano. Recorrente teórico 12,83 bi/ano. Top-down 90,8 bi; 9,1 bi/ano; 6,27 bi/ano. SAM 0,40 a 0,67 bi/ano. Tudo bate.
- Local: 32.628 ME/EPP; LP 6.727; LR 1.022; não-MEI 40.377; alvo 30.589; escritórios 350 a 434. SAM local ≈ R$ 2,4 mi/ano (1,72 consultoria + 0,73 recorrente); Triângulo (9 cidades) ≈ R$ 5,4 mi/ano. **Achado:** a receita do modelo-base em 2033 (R$ 4,0 mi) é 75% do SAM regional e supera o SAM de Uberlândia; só é coerente com venda remota via escritórios fora do Triângulo. O texto do SOM ("R$ 1 a 3 mi/ano com venda remota") só cobre os anos 1 a 3. Ressalva inserida em 2.7 e na checagem 1.
- Unit economics a RBT12 R$ 300 mil (8,08%): retainer 791 (53%), diagnóstico 1.304 (33%), projeto 15.777 (63%), software 119 (85%). Batem. Com comissão explícita de 20% e 30% sobre a lista de R$ 199, a contribuição é R$ 133 e R$ 113 (R$ 98 com API de R$ 15), equivalente à revenda a R$ 140. Em RBT12 de R$ 1,8 mi (14,02%) o retainer cai a 47% e o software a 79%.
- LTV/CAC a 1,5%: 29,3× (retainer) e 26,5× (software). Batem.
- Equilíbrio: com pró-labore de R$ 12 mil e sem CLT, 11 a 15 retainers de R$ 2 mil ou 14 a 24 de R$ 1.500; em meses, a 2 retainers/mês de R$ 1.500, mês 4 sem pró-labore e mês 10 com pró-labore; a 1 retainer/mês, mês 6 e mês 18. Compatível com a nota 05 (mês 6 sem, mês 10 com).

### 2.4 Números finais da versão 2 do modelo (cenário-base e cenários)

| | Fracasso (35%) | Pessimista (30%) | Base (25%) | Otimista (10%) | Valor esperado |
|---|---|---|---|---|---|
| VPL empresa | −144.450 | +53.616 | +1.241.844 | +6.598.589 | **+935.847** |
| TIR empresa | perda total | n/d (2 raízes) | 103% | 184% | |
| VPL fundador | −127.821 | −95.489 | +645.188 | +4.138.321 | **+501.745** |
| TIR fundador | −88% | 11,5% | 55,8% | 103% | |
| Payback fundador simples / descontado | nunca | 86 / nunca | 59 / 74 | 38 / 50 | |
| Caixa mínimo com R$ 100 mil | 42.169 (ago/27) | 39.475 (fev/28) | 77.074 (dez/26) | 77.219 (dez/26) | |
| Break-even EBITDA | não | mês 5 | mês 4 | mês 4 | |

Variantes do IRRF no base (CSV `modelo_cenarios.csv`): sem retenção VPL fundador 652.026 e payback 50; retenção como custo definitivo 595.115 e payback 62. Ponto de empate: 62,2% do plano (33,3 retainers e 79,3 CNPJs em 2029; receita R$ 903 mil em 2029 e R$ 2,10 mi em 2033).

---

## 3. Auditoria da lógica do modelo original

| Item | Achado | Decisão |
|---|---|---|
| Fórmulas de VPL e TIR | corretas (seção 2.1). A TIR por bissecção devolvia a primeira raiz mesmo com várias; no pessimista o VPL muda de sinal 2 vezes | v2: devolve n/d quando há mais de uma raiz; relatório já dizia "indefinida" |
| Fator R | o modelo usa janela de 12 meses inclusive o mês corrente; a Res. CGSN 140 usa os 12 meses anteriores (com regra própria no início de atividade). Recalculado com a janela legal: o Anexo não muda em nenhum mês; Fator R mínimo de jan/2027 em diante é 0,30 | sem efeito material; não alterado |
| Encargos | analista R$ 6.000 × 1,2744 + 1.400 = 9.046,4; folha para o Fator R = pró-labore + 90% do custo CLT (aproximação razoável: salário + 13º + férias + FGTS ≈ 84% do custo total; benefícios não entram) | ok |
| Degraus de contratação × horas | contrata o analista só após 2 meses seguidos de estouro e demite após 3 de folga. Em jan/2027 a demanda era 78 h contra 50 h de capacidade (sócio CRC só entrava em fev/2027, contradizendo a condição 1 do veredito); em ago/2027, 120 h contra 110 h. A carga total do fundador (vendas + 50 h de entrega + excesso) fica em 110 a 150 h/mês de 2027 a 2029, sem hora reservada ao software que ele vende desde set/2027 e para o qual só há dev em out/2028 | v2: sócio CRC com capacidade desde dez/2026 (pró-labore só em fev/2027). Horas do fundador: registrado como fragilidade e adicionado ao tornado (30 h / 70 h: Δ VPL empresa R$ 204 mil; fundador R$ 130 mil). Não alterei a base |
| Churn | aplicado ao saldo inicial do mês, receita sobre o saldo médio; por produto e por ano | ok |
| Prazos de recebimento | retainer via Pix no mês (DSO 0, otimista mas declarado); diagnóstico 50/50 em t e t+1; projeto 50/50 em t e t+2; software t+1; provisão de 3% abatida no EBITDA | ok; a nota 05 lembra que DSO de 45 dias nos retainers exigiria R$ 45 mil de giro |
| Break-even de EBITDA no mês 4 | só existe porque o pró-labore do fundador é 30% da receita (R$ 2.400, 4.850, 1.250, 2.227 e 1.460 nos meses 2 a 6) e não há CLT. Com o custo de oportunidade (R$ 10 mil menos o pró-labore) como custo, o break-even é o mês 17 (mar/2028). Notas 05 (mês 10 a 18 com pró-labore), 07 (runway 12 a 16 meses) e 08 (Luiza Trajano: cinco anos; Taxcel lucrativa só com 370 clientes) apontam para 12 a 18 meses | texto corrigido em 4.6, quadro de cenários e seção 12 |
| IRRF 10% sobre dividendos > R$ 50 mil/mês (Lei 15.270/2025) | o relatório dizia que os dividendos do fundador "só passam de R$ 600 mil em 2032 e 2033": errado nos dois sentidos (o teste é mensal; o máximo anual é R$ 588 mil em 2034). Como o modelo distribui tudo em dezembro, a parcela do fundador supera R$ 50 mil em todos os dezembros de 2030 a 2036 (R$ 293 mil nominais retidos). Custo definitivo a VP: R$ 56.911 (8,7% do VPL do fundador). Como a renda anual do fundador fica abaixo de R$ 1,2 mi, o IRPFM é menor que o retido e a diferença é restituível (mecânica não verificada no texto da lei nesta sessão): custo de prazo ≈ R$ 6,8 mil a VP | v2: retenção em dezembro e restituição 9 meses depois no fluxo do fundador (VPL 645.188; payback 59 porque o empate de dez/2030 era de só R$ 11 mil); variantes "custo" e "nenhum" gravadas; parágrafo 5.4 reescrito |
| Valor terminal | perpetuidade correta; o ARR do múltiplo de saída usava o preço de 2027 (R$ 140) em vez do de 2036 (R$ 165 em R$ de 2027): ARR R$ 1,76 mi → R$ 2,07 mi; múltiplo R$ 5,44 mi → R$ 6,22 mi. No base não muda (perpetuidade é o menor); no otimista o múltiplo é o que vale: VPL empresa +R$ 305 mil, valor esperado +R$ 30 mil | v2 corrigida |
| Outros | o FCF tem uma expressão inócua (`+ provisao - provisao`); o ROIC anual do CSV usa PP&E fixo de R$ 20 mil (aproximação declarada); os workshops não consomem horas; pró-labore e renda perdida comparados em termos brutos (consistente) | não alterados |

---

## 4. Vinte números conferidos

Ver a tabela da seção 12 do relatório. Resumo: 18 batem, 1 não batia (preços de Conta Azul e Contabilizei; corrigido) e 1 batia com dois erros derivados no relatório (Anexo V 18,26% e a frase do IRRF; corrigidos). Não verificáveis contra a fonte primária nesta sessão (cota de busca esgotada): o PDF da Res. CGIBS 14/2026, o levantamento por regime (AmdJus, secundário), o relatório Sebrae de 03/2026 (reproduzido por terceiro). Nada foi aberto na web pelo revisor.

---

## 5. Links

Seção Fontes: 335 links únicos. Amostra aleatória de 25 (semente 20261101): 25 presentes em alguma nota (01 a 10). Checagem completa: 335 de 335 presentes; os 294 links do corpo também. Nenhuma fonte inventada. Limitação: a presença do link na nota não prova que a página diga o que a nota afirma.

---

## 6. Dez afirmações mais frágeis

Ver a tabela da seção 12 do relatório. Em uma linha cada: (1) PMEs pagam além do contador, relato único de evento; (2) conversão de 40% diagnóstico → retainer, sem fonte; (3) R$ 140 líquidos por CNPJ via escritório contra benchmark de R$ 10 a 60 e receita 2030+ acima do SAM local; (4) churn de 1,5% com benchmarks globais; (5) fundador com 110 a 150 h/mês sem hora de produto; (6) fundo do vale de R$ 23 mil dependente de quatro premissas favoráveis; (7) sócio CRC a R$ 4 mil com 30% e vesting; (8) sondagem Omie n = 149 e contagem de escritórios por proporção; (9) probabilidades regulatórias subjetivas; (10) 65% de sobrevivência implícita e múltiplos com desconto arbitrário.

---

## 7. Checagens de coerência

| Checagem | Resultado | Ação |
|---|---|---|
| SOM ⊂ SAM ⊂ TAM | sim até 2029; de 2030 em diante a receita exige venda fora do Triângulo | ressalva em 2.7 e checagem 1 |
| Equipe sustenta as vendas | parcial: 110 a 150 h/mês do fundador sem produto; jan/2027 e ago/2027 acima da capacidade na v1 | sócio desde dez/2026 na v2; ressalva em 6.3 e checagem 2; linha nova no tornado |
| Caixa nunca negativo sem aporte | sim nos 4 cenários da v2; modelo independente dá −R$ 9 mil no pessimista | ressalva na checagem 3 |
| Datas do plano × cronograma legal | batem (jan/2027, mar/2027, 2º sem/2027, 2028, 2029, 2033) | nenhuma |
| Preço × disposição a pagar | parcial: a checagem 5 dizia que R$ 199/mês fica "abaixo de R$ 689/cliente/ano"; é 3,5 vezes acima | checagem 5 reescrita; fragilidade 3 |
| Veredito × números | bate ("vale só se", confiança média; payback fora do critério; valor esperado positivo) | números atualizados |
| Hipóteses da seção 0 com desfecho | sim | nenhuma |
| Contradições entre seções | status do split, alíquota e nº de escritórios consistentes; sócio CRC antes do 1º contrato × fev/2027 no modelo (resolvida na v2); preço da Conta Azul (corrigido) | feitas |

---

## 8. Lista de correções

Documento (todas cirúrgicas, estilo preservado): cabeçalho; resumo executivo (parágrafo de abertura, quadro de cenários, frase do payback, comparação com renda fixa); 1.2 (resolução CGSN); 2.3, 3.1, 3.3 (preços); 2.7 (SOM × SAM); 4.6 (break-even); 5.4 (18,36%; IRRF); 6.1; 6.2; 6.3 (duas células e leitura); 6.4 (utilização); 6.5 (otimista); 7.1; 7.2; 7.3; 7.4; 7.5; 7.6; 8.1; 8.2; 8.3; 8.4; 8.5; conclusão; checagens 1, 2, 3, 5, 6; seção 12.

Modelo (`modelo_financeiro.py` v2; v1 preservada): (1) ARR do múltiplo ao preço de 2036; (2) `socio_crc_mes_inicio_capacidade = 1`; (3) IRRF sobre dividendos no fluxo do fundador (`irrf_dividendos_modo = "timing"`, com "custo" e "nenhum"); (4) TIR n/d com mais de uma raiz; (5) duas linhas no tornado; (6) coluna `irrf_retido_fundador_nominal` e duas linhas de variante no CSV de cenários.

CSVs alterados pela v2: anual (utilização de 2026 e 2027), cenários, fluxo do sócio, gates (caixa do otimista em jul/2027), mensal (capacidade em dez e jan), ponto de empate (62,18%), ranking, sensibilidades (coluna do fundador e células de volume alto).

---

## 9. Parecer

O veredito "vale só se" se sustenta: a aritmética está certa, as fontes existem, e as correções mudaram pouco o cenário-base (VPL do fundador de R$ 652 mil para R$ 645 mil; valor esperado de R$ 485 mil para R$ 502 mil; payback de 50 para 59 meses). O que a revisão muda é a leitura: o "default alive no 4º mês" é o fundador aceitando R$ 1,3 a 4,9 mil por mês até abril de 2027, o equilíbrio econômico é no 17º mês, o fundo do vale pode ser R$ 62 mil em vez de R$ 23 mil com uma contratação um mês mais cedo, e o preço de software por CNPJ (premissa nº 1 do tornado) só fecha se a PME final pagar a lista pelo canal, não o escritório. Eu acrescentaria ao veredito as condições (6) e (7) descritas na seção 12 do relatório.
