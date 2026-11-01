# Operação, custos, modelos de negócio e unit economics — empresa nova de assessoria (e depois software) para a Reforma Tributária do consumo (IBS/CBS, split payment), PMEs e contadores

Data de referência: 1 de novembro de 2026. Todos os links foram acessados em 01/11/2026, salvo indicação. Legenda: **[F]** fato com fonte; **[E]** estimativa (conta mostrada); **[H]** hipótese de trabalho (sem fonte; a validar). Premissas do estudo: fundador com perfil de tecnologia, sem CRC/OAB; capital inicial hipotético R$ 100 mil; empresa recém-aberta no Simples Nacional.

Nota metodológica sobre as fontes salariais: o Portal Salário (salario.com.br) usa o Novo CAGED (admissões e desligamentos CLT dos últimos 12 meses, 09/2025–08/2026, apenas salário-base, sem benefícios) e por isso tende a ficar **abaixo** do mercado de quem já está empregado em capitais; a Robert Half publica "salários iniciais" de profissionais que ela própria colocou, em percentis 25/50/75, com viés para São Paulo e empresas estruturadas, e a edição corrente já se chama "Guia Salarial 2027" (publicada em 2026). JobRise e Indeed são agregadores sem metodologia transparente. Quando as fontes divergem, apresento todas.

---

## 1. Salários de mercado em 2026, por cargo e senioridade

### Takeaway
Para montar a célula mínima (analista fiscal pleno, eventualmente um dev pleno e um SDR/CS), o salário-base CLT que o mercado paga em 2026 fica em torno de **R$ 4,3–7,8 mil (analista fiscal/tributário pleno)**, **R$ 6,5–9,4 mil (analista sênior; mais em SP)**, **R$ 9,7–16 mil (dev full stack pleno, SP)**, **R$ 4–6,5 mil fixo + variável (SDR pleno)**, **R$ 3,3–4 mil (customer success coordinator)** e **R$ 2,0–2,4 mil (assistente administrativo)**. Advogado tributarista consultivo em escritório pequeno: **R$ 8,1 mil (jr) a R$ 16,5 mil (sr)** na mediana Robert Half; mediana CAGED para a profissão como um todo é bem menor (R$ 6,5 mil).

### Cited Findings

**Analista fiscal / tributário**
- [F] Analista Fiscal (economista), CBO 2512-25, Brasil, CAGED 09/2025–08/2026 (atualizado 08/10/2026): média **R$ 4.922,89**, mediana **R$ 4.312**, P25 R$ 3.500, P75 R$ 5.600, piso R$ 3.784,20, teto R$ 7.787,60; n = 6.397; +5,5% vs 2025 — [salario.com.br](https://www.salario.com.br/profissao/analista-fiscal-economista-cbo-251225)
- [F] Robert Half, Analista Contábil/Fiscal, percentis 25/50/75 (valores capturados dos trechos indexados das páginas; a renderização direta das páginas devolveu a home, então trate como "a confirmar na Calculadora Salarial"): **Júnior (P/M) R$ 4.000 / 5.000 / 5.700**; **Pleno (G) R$ 6.500 / 7.800 / 9.200**; **Sênior (P/M) R$ 6.850 / 8.450 / 9.800** — [Robert Half jr P/M](https://www.roberthalf.com/br/pt/vagas-detalhes/analista-contabilfiscal-junior-pm); [Robert Half pleno G](https://www.roberthalf.com/br/pt/vagas-detalhes/analista-contabilfiscal-pleno-g); [Robert Half sr P/M](https://www.roberthalf.com/br/pt/vagas-detalhes/analista-contabilfiscal-senior-pm). "P/M" = pequenas e médias empresas; "G" = grandes. Edição: Guia Salarial 2027 (salários iniciais) — [metodologia do guia](https://www.roberthalf.com/br/pt/insights/guia-salarial)
- [F] Vaga de Analista Fiscal em São Paulo estimada em R$ 7.218,52 (Empregando Brasil, com base em admissões do Ministério do Trabalho) — citada nos resultados de busca; ilustra o prêmio de SP sobre a média nacional — [empregandobrasil.com.br](https://empregandobrasil.com.br/vagas/analista-fiscal-sao-paulo-sp-40c1f6/)

**Contador (CRC) / analista contábil**
- [F] Contador / Analista Contábil, CBO 2522-10, CAGED 09/2025–08/2026 (atualizado 08/10/2026): média **R$ 5.565,56**, mediana **R$ 4.489**, P25 R$ 3.400, P75 R$ 6.182, piso R$ 3.781, teto R$ 9.405; n = 82.646 — [salario.com.br (contador)](https://www.salario.com.br/profissao/contador-cbo-252210); mesmos números em [salario.com.br (analista contábil)](https://www.salario.com.br/profissao/analista-contabil-cbo-252210)

**Consultor tributário / advogado tributarista**
- [F] Advogado Tributarista, CBO 2410-20, CAGED 09/2025–08/2026 (atualizado 08/10/2026): média **R$ 7.393,44**, mediana **R$ 6.474**, P25 R$ 4.134, P75 R$ 9.435, piso R$ 4.953, teto R$ 13.000; n = 251 (amostra pequena) — [salario.com.br](https://www.salario.com.br/profissao/advogado-tributarista-cbo-241020)
- [F] Robert Half, Guia Salarial 2027, advogados em **escritórios de pequeno porte**, percentis 25/50/75: **Consultivo Tributário Jr R$ 6.600 / 8.100 / 9.650; Pl R$ 9.650 / 11.800 / 14.200; Sr R$ 13.600 / 16.550 / 19.950**; Contencioso Tributário Jr 6.250 / 7.700 / 9.300; Pl 9.050 / 11.050 / 13.300; Sr 12.650 / 15.500 / 18.650 — [Robert Half](https://www.roberthalf.com/br/pt/vagas-detalhes/advogadoa-contencioso-tributario-pl-escritorios-de-pequeno-porte)
- [F] Estimativa de salário inicial de advogado tributário: R$ 4.000–7.000 — [Galícia Educação](https://www.galiciaeducacao.com.br/blog/quanto-ganha-um-direito-tributario)

**Desenvolvedor full stack pleno**
- [F] Robert Half, Guia 2027, São Paulo, percentis 25/50/75: **Full Stack Jr R$ 6.700 / 7.550 / 9.700; Pleno R$ 9.650 / 12.500 / 16.100; Sênior R$ 13.200 / 15.600 / 20.100**; Back-End Pleno 9.600 / 12.500 / 16.100; Product Owner 8.050 / 11.450 / 14.750 — [Robert Half](https://www.roberthalf.com/br/pt/vagas-detalhes/desenvolvedora-full-stack-pleno/sao-paulo)
- [F] Indeed: média nacional de desenvolvedor pleno **R$ 6.212/mês** (~1.000 salários); São Paulo **R$ 7.377** (180 salários) — [Indeed SP](https://br.indeed.com/career/full-stack-developer/salaries/São%20Paulo--SP) (via resultados de busca)
- [F] JobRise (2026, sem metodologia): dev pleno CLT R$ 7.500–14.000; **PJ pleno R$ 10.000–20.000** — [JobRise](https://jobrise.io/pt/blog/quanto-ganha-um-full-stack-developer-2026/)

**SDR / vendedor B2B**
- [F] JobRise (20/05/2026; "faixas realistas", sem fonte): **SDR júnior fixo R$ 2,5–4,5 mil + variável R$ 0,5–2 mil; SDR pleno fixo R$ 4–6,5 mil + variável R$ 1,5–4 mil; SDR sênior fixo R$ 6–9 mil + variável R$ 3–6 mil; AE SMB fixo R$ 5–8 mil + variável R$ 4–8 mil** — [JobRise](https://jobrise.io/pt/blog/tech-sales-brasil-sdr-ae-vagas/)
- [F] Jooble (agregador de vagas, público amplo): SDR média ~R$ 3.004/mês — [Jooble](https://br.jooble.org/salary/sdr)
- [F] Assistente de Vendas, CBO 3541-25, CAGED (atualizado 08/10/2026): média R$ 2.226,69, mediana R$ 2.013, P25 R$ 1.758, P75 R$ 2.314; n = 279.986 (perfil mais varejo/interno, piso útil para pré-vendas júnior) — [salario.com.br](https://www.salario.com.br/profissao/assistente-de-vendas-cbo-354125)

**Customer success**
- [F] Indeed, Customer Success Coordinator, Brasil (atualizado 27/10/2026, 756 salários): média **R$ 39.903/ano ≈ R$ 3.325/mês**; faixa R$ 21.502–74.051/ano (≈ R$ 1.792–6.171/mês); São Paulo R$ 47.938/ano (≈ R$ 3.995/mês, 138 salários); Florianópolis R$ 48.853/ano — [Indeed](https://br.indeed.com/career/customer-success-manager/salaries)

**Assistente administrativo**
- [F] Assistente Administrativo, CBO 4110-10, CAGED 06/2025–05/2026: média **R$ 2.432,11**, faixa R$ 2.060–3.412; n = 1.182.592; +4,9% vs 2025 — [salario.com.br](https://www.salario.com.br/profissao/assistente-administrativo-cbo-411010)
- [F] Numerando (Novo CAGED, admissões, mar/2026): mediana nacional **R$ 1.712**, média R$ 1.804, P90 R$ 2.475; SP R$ 1.894 — [Numerando](https://numerando.com.br/salarios/assistente-administrativo)

**Referências gerais**
- [F] Salário mínimo 2026: **R$ 1.621,00** (+6,79%); teto INSS **R$ 8.475,55**; Portaria Interministerial MPS/MF nº 13/2026 — [valorfinal.com.br (30/10/2026)](https://valorfinal.com.br/tabela-inss-2026); [InfinitePay](https://www.infinitepay.io/blog/salario-minimo)

### Inferences
- [E] Faixa de salário-base a orçar para a célula inicial, usando mediana CAGED como piso e P50 Robert Half como teto: analista fiscal pleno **R$ 4.300–7.800**; analista sênior **R$ 5.600–8.500** (até R$ 9.800 em P75); dev full stack pleno **R$ 6.200–12.500** (SP: R$ 9.650–16.100); SDR pleno **R$ 4.000–6.500 fixo** (+ variável de 40–60% do fixo); CS coordinator **R$ 3.300–4.000**; assistente administrativo **R$ 1.700–2.400**.
- [E] O "prêmio PJ" para dev pleno (JobRise: PJ R$ 10–20 mil vs CLT R$ 7,5–14 mil) é de ~30–40%, o que empata grosso modo com o multiplicador de encargos CLT fora do Simples (1,6–1,7x) e fica **acima** do multiplicador no Simples (1,4–1,5x) — ver seção 2. Para uma empresa do Simples, CLT tende a ser mais barato do que PJ ao mesmo valor líquido, além de não carregar o risco de pejotização.
- [H] Para um sócio tributarista (CRC ou OAB) que entre com equity, o custo de oportunidade a compensar é a mediana Robert Half de consultivo tributário pleno/sênior (R$ 11,8–16,5 mil); pró-labore abaixo disso só é sustentável com participação societária relevante.

### Gaps
- Não consegui renderizar as páginas da Robert Half de analista contábil/fiscal (devolveram a home); os percentis acima vêm dos trechos indexados. Como obter: acessar a Calculadora Salarial da Robert Half (login) ou baixar o PDF do Guia Salarial 2027.
- Glassdoor bloqueou acesso automatizado (HTTP 403) para SDR e Customer Success; Indeed não tem página para "SDR" (404). Dados de SDR dependem do JobRise/Jooble (fracos). Como obter: consultar Glassdoor manualmente, pesquisa de remuneração da Meetime/Reev para pré-vendas, ou RepVue.
- Não há série do CAGED para "consultor tributário" como ocupação própria; usei advogado tributarista e analista fiscal como proxies. Os detalhes por porte de empresa e por nível no salario.com.br estão atrás de paywall.
- Michael Page, Catho, Vagas.com e LinkedIn Salary não foram alcançados (cota de busca da sessão esgotou após ~40 consultas); as faixas da Catho/Michael Page costumam ficar entre CAGED e Robert Half.

---

## 2. Custo total do empregador: CLT (Simples vs. fora do Simples) versus PJ, com pejotização em 2026

### Takeaway
Em 2026, um CLT custa à empresa do **Simples Nacional ~1,44–1,54x o salário** (FGTS 8% + provisões de 13º/férias/terço 19,44% + benefícios) e **~1,68–1,88x fora do Simples** (soma INSS patronal 20% + RAT 1–3% + terceiros 5,8%). Contratar PJ elimina esses 27–37 pontos de encargo, mas o STF ainda não julgou o mérito do Tema 1389 (pejotização): a suspensão nacional caiu em 18/06/2026, o relator prometeu votar "ainda em 2026", e o passivo típico se reconhecido o vínculo inclui INSS retroativo, FGTS + multa, férias + 1/3, 13º e rescisórias.

### Cited Findings

**Componentes dos encargos (2026)**
- [F] FGTS 8%; provisão de 13º 8,33% (1/12); provisão de férias 8,33%; terço constitucional 2,78% (1/36) → **base fixa 27,44%** em qualquer regime. INSS patronal 20% (Lei 8.212/91, art. 22) **só fora do Simples**; RAT 1–3% (ajustado pelo FAP); terceiros/Sistema S ~5,8% → **patronal fora do Simples 26,8–28,8%**. No Simples a CPP está embutida no DAS (0% por fora), exceto Anexo IV — [valorfinal.com.br, atualizado 31/10/2026](https://valorfinal.com.br/guia/custo-funcionario)
- [F] Exemplo da mesma fonte, salário R$ 3.000 + R$ 500 de benefícios: Simples **R$ 4.323,33 (1,44x)**; fora do Simples **R$ 5.127,33 (1,71x)**. Multiplicadores fora do Simples com R$ 400 de benefícios: R$ 1.500 → 1,81x; R$ 3.000 → 1,68x; R$ 5.000 → 1,62x; R$ 8.000 → 1,59x (o multiplicador cai porque benefícios são fixos) — [valorfinal.com.br](https://valorfinal.com.br/guia/custo-funcionario)
- [F] Contabilidade Zen (30/06/2026) chega a números mais altos porque inclui encargos sobre as provisões (~6,96%): patronal fora do Simples **34,8–36,8%**; Simples economiza 25,8–27,8 p.p.; benefícios típicos: **VT ~R$ 440/mês** (desconto de até 6% do salário), **VA/VR R$ 400–900**, **plano de saúde R$ 300–800/empregado**, seguro de vida R$ 15–50. Exemplo R$ 3.000: fora do Simples **R$ 5.626 (+87,5%)**; Simples **R$ 4.630 (+54,3%)**. Tabela: R$ 5.000 → R$ 8.750 (+75%); R$ 8.000 → R$ 13.476 (+68%); R$ 12.000 → R$ 19.964 (+66%) — [Contabilidade Zen](https://www.contabilidadezen.com.br/blog/quanto-custa-funcionario-encargos-2026/)
- [F] Tabela INSS 2026 do empregado (progressiva): 7,5% até R$ 1.621,00; 9% de 1.621,01 a 2.902,84; 12% de 2.902,85 a 4.354,27; 14% de 4.354,28 a 8.475,55; contribuição máxima R$ 988,10 — [valorfinal.com.br](https://valorfinal.com.br/tabela-inss-2026)
- [F] Pró-labore: INSS do sócio 11% (retido, limitado ao teto) e **INSS patronal 20% apenas fora do Simples**; no Simples a CPP sobre pró-labore está no DAS — [Contabilidade Zen, Lucro Presumido prestador 2026](https://www.contabilidadezen.com.br/blog/lucro-presumido-prestador-servico-2026/)

**Pejotização (Tema 1389 / ARE 1.532.603)**
- [F] Portal do STF: Tema 1389 — "competência e ônus da prova em processos sobre fraude em contratos civis/comerciais de prestação de serviços, e licitude da contratação de pessoa jurídica ou trabalhador autônomo"; leading case ARE 1532603; relator Min. Gilmar Mendes; repercussão geral reconhecida em 12/04/2025 (acórdão publicado 24/04/2025); **sem tese fixada** na página em 01/11/2026 — [STF](https://portal.stf.jus.br/jurisprudenciaRepercussao/tema.asp?num=1389)
- [F] Em abril/2025 o relator suspendeu nacionalmente os processos; em **18/06/2026 retirou a suspensão** (casos voltam a tramitar até o 2º grau; no TST seguem parados) e declarou que pretende levar o mérito a votação "ainda em 2026", sem data — [Poder360, 18/06/2026](https://www.poder360.com.br/poder-justica/gilmar-mendes-retira-suspensao-dos-processos-sobre-pejotizacao/)
- [F] PGR (fev/2026) opinou pela constitucionalidade dos contratos alternativos à CLT e pela competência da Justiça comum; CNT estimava **mais de 50 mil ações suspensas** — [CNT/Contadores, 11/02/2026](https://contadores.cnt.br/projetos/43/noticias/tecnicas/2026/02/11/pejotizacao-mpf-defende-constitucionalidade-no-stf.html)
- [F] Fonte de divulgação jurídica relata que até jun/2026 havia pedido de vista da Min. Cármen Lúcia, sem data de retomada (não confirmado no portal do STF) — [Marra CLT](https://www.marraclt.com.br/salario/pejotizacao-stf-tema-1389-o-que-muda)
- [F] Critérios de vínculo: subordinação, pessoalidade, habitualidade (não eventualidade) e onerosidade; passivo em caso de reconhecimento: INSS retroativo, FGTS com multa, férias + 1/3, 13º, verbas rescisórias, multas — [contabilidade.com, 24/03/2026](https://contabilidade.com/blog/pejotizacao-no-stf-pode-mudar-tudo-em-2026-entenda-os-riscos-para-empresas-e-contadores/)

### Inferences — cálculo do custo mensal total por cargo

[E] Método: custo = salário × (1 + 0,2744) + benefícios fixos [+ 0,268 × salário fora do Simples]. Benefícios: VT R$ 400 líquido (R$ 440 − desconto de 6%), VR R$ 600, plano de saúde R$ 400 = **R$ 1.400/mês** (meio da faixa da Contabilidade Zen). Metodologia valorfinal; a da Contabilidade Zen (encargos sobre provisões) somaria ~7% ao bruto fora do Simples. Valores em R$/mês.

| Cargo (salário-base de referência, seção 1) | Salário | FGTS+provisões (27,44%) | Benefícios | **Custo no Simples** | Multiplic. | Patronal fora do Simples (26,8%) | **Custo fora do Simples** | Multiplic. |
|---|---|---|---|---|---|---|---|---|
| Assistente administrativo | 2.400 | 659 | 1.400 | **4.459** | 1,86x | 643 | **5.102** | 2,13x |
| SDR pleno (fixo; variável à parte) | 4.500 | 1.235 | 1.400 | **7.135** | 1,59x | 1.206 | **8.341** | 1,85x |
| Customer success coordinator | 3.800 | 1.043 | 1.400 | **6.243** | 1,64x | 1.018 | **7.261** | 1,91x |
| Analista fiscal júnior | 4.300 | 1.180 | 1.400 | **6.880** | 1,60x | 1.152 | **8.032** | 1,87x |
| Analista fiscal pleno | 6.000 | 1.646 | 1.400 | **9.046** | 1,51x | 1.608 | **10.654** | 1,78x |
| Analista fiscal sênior | 8.500 | 2.332 | 1.400 | **12.232** | 1,44x | 2.278 | **14.510** | 1,71x |
| Contador CRC (mediana Robert Half pleno P/M ≈ P50 CAGED+) | 7.000 | 1.921 | 1.400 | **10.321** | 1,47x | 1.876 | **12.197** | 1,74x |
| Advogado consultivo tributário pleno (escrit. pequeno) | 11.800 | 3.238 | 1.400 | **16.438** | 1,39x | 3.162 | **19.600** | 1,66x |
| Dev full stack pleno (SP, P50 RH) | 12.500 | 3.430 | 1.400 | **17.330** | 1,39x | 3.350 | **20.680** | 1,65x |
| Dev full stack pleno (Indeed SP) | 7.400 | 2.031 | 1.400 | **10.831** | 1,46x | 1.983 | **12.814** | 1,73x |

- [E] Variável de vendas (SDR): adicionar R$ 1.500–4.000/mês conforme meta (JobRise); sobre comissão incidem FGTS e provisões, então custo total do SDR pleno no Simples ≈ 7.135 + 2.500 × 1,2744 ≈ **R$ 10.300** no atingimento de meta.
- [E] Sócio com pró-labore de R$ 5.000 no Simples custa à empresa **R$ 5.000** (CPP no DAS; os 11% são retidos do sócio); fora do Simples, **R$ 6.000** (20% patronal). Isso torna o Simples decisivamente mais barato para uma empresa de 2–3 sócios operadores.
- [E] Comparação CLT × PJ para um dev pleno: CLT R$ 12.500 custa R$ 17.330 (Simples). Um PJ que peça R$ 16–17 mil (dentro da faixa JobRise de R$ 10–20 mil) custa o mesmo, sem provisões, mas com o risco do Tema 1389. Regra de bolso: **PJ só compensa financeiramente se o valor pedido for ≤ ~1,35x o salário CLT equivalente** (no Simples) e se a relação for genuinamente autônoma (sem exclusividade, horário e subordinação direta; entregas por escopo).
- [H] Para o passivo de pejotização, a conta prudente é provisionar a diferença de encargos (≈ 27–37% do valor pago) mais multa de 40% do FGTS e juros, para um horizonte de 5 anos de prescrição — na prática, 35–45% do total pago ao PJ.

### Gaps
- Nenhuma fonte oficial (gov.br) foi acessada diretamente para a Portaria 13/2026 e o Decreto do salário mínimo; os valores (R$ 1.621; teto R$ 8.475,55) convergem em várias fontes secundárias.
- Status do Tema 1389 após 18/06/2026 não localizado em fonte primária (STF não exibe andamento na página do tema). Como obter: acompanhar o andamento do ARE 1.532.603 no portal do STF e a pauta do Plenário em nov–dez/2026.
- Não há dado de custo médio de rescisão (multa 40% FGTS, aviso prévio) por cargo; estimável como ~1,5–2 meses de salário para desligamento sem justa causa [H].

---

## 3. Modelos de negócio comparados (consultoria por projeto, retainer, educação, SaaS para PME, white label para contadores, híbrido)

### Takeaway
Com R$ 100 mil e um fundador técnico sem CRC/OAB, o único modelo que atinge equilíbrio dentro do caixa é **serviço recorrente (retainer) de baixo ticket, vendido via contadores, com um sócio técnico tributarista**; ele financia o software. O SaaS puro exige ~250–350 clientes pagantes para cobrir uma equipe mínima de 4 pessoas e, com CAC e churn típicos de PME, precisa de R$ 500–800 mil de capital até o break-even — inviável sem receita de serviço ou investidor. Benchmarks: margem bruta mediana de SaaS 77% (assinatura 81%) contra 30% em serviços profissionais embutidos em SaaS; a hora de consultoria tributária é vendida por R$ 150–500 contra custo-hora de ~R$ 90–120 para um analista pleno no Simples.

### Cited Findings
- [F] Benchmarkit 2025 (SaaS B2B privadas, majoritariamente EUA): margem bruta **total 77%, assinatura 81%, serviços profissionais 30%** (medianas); S&M = 37% da receita; GRR 88% (era 90% três anos antes); NRR 101%; crescimento mediano 26% em 2024 — [Benchmarkit](https://www.benchmarkit.ai/2025benchmarks)
- [F] SaaS Capital 2026: crescimento mediano de SaaS B2B privadas caiu para **22% em 2025** (25% em 2024); 7,3% com crescimento zero ou negativo — [SaaS Capital](https://www.saas-capital.com/research/)
- [F] Modelos de cobrança de planejamento tributário na reforma praticados por escritórios: hora técnica (o mais comum para o primeiro diagnóstico), projeto fechado (leitura dos quatro regimes), honorário de êxito sobre economia apurada e retainer mensal de acompanhamento; exemplo: 10 clientes × R$ 2 mil/mês = R$ 240 mil/ano — [e-Auditoria, 25/09/2026](https://www.e-auditoria.com.br/blog/como-cobrar-planejamento-tributario-na-reforma/)
- [F] Reportagem com contadores (25/09/2026): mix de monetização = **85% da carteira com aumento de honorário**, 10% com diagnóstico pontual (R$ 2–15 mil), 5% com consultoria mensal (R$ 1.500–3.700); contratos de consultoria para empresas maiores de **R$ 100–130 mil**; caso de recuperação de créditos: R$ 70 mil de consultoria para R$ 1,8 mi de créditos identificados — [reformatributaria.com](https://www.reformatributaria.com/iva/contadores-buscam-novas-formas-de-monetizar-e-precificar-servicos-com-a-reforma-tributaria/)
- [F] Sescon-SP (via Makrosystem): serviços especializados (auditoria, recuperação de créditos) são cobrados **até 3x** os honorários contábeis convencionais; clientes totalmente integrados pagam 15–20% menos — [Makrosystem](https://makrosystem.com.br/blog/honorarios-contabeis)
- [F] Sondagem Omie das PMEs (2026): **63%** dos empresários apontam revisão da política de preços como principal mudança exigida pela reforma, mas só **17%** esperam que a contabilidade lidere o processo — [Omie](https://www.omie.com.br/blog/reforma-tributaria-precificacao-oportunidade-contadores/)
- [F] Robert Half, "Reforma Tributária: preparação, riscos e oportunidades" (PDF, dez/2025): compara três abordagens de implementação — **consultoria tributária** (pareceres robustos e chancela legal, menor transferência de know-how), **time próprio** (controle e retenção, exige maturação) e **staff loan/alocação** (agilidade com absorção de know-how) — e lista como frentes: contratos críticos, precificação, capital de giro (crédito só nasce após pagamento do fornecedor — split), benefícios, terceirizações, sistemas — [Robert Half PDF](https://www.roberthalf.com/content/dam/roberthalf/documents/br/pt/indexed/2025-reforma-tributaria-h2-rhi-br-por.pdf)
- [F] Preços de referência que delimitam o espaço de SaaS para PME: Conta Azul R$ 179,90–1.029,90/mês; Bling R$ 60–1.250/mês (seção 4). Vorbi (pesquisa CAC B2B Brasil 2026, site inacessível no dia — DNS): SaaS low-touch no Brasil opera com **tickets de R$ 150–250** e retenção é o principal desafio — citado nos resultados de busca ([Vorbi](https://avorbi.com.br/en/blog/growth/b2b-cac-research-brazil-2026))
- [F] Programas de canal com contadores: Conta Azul — "sem custo", **descontos de até 85%** sobre tabela para o parceiro, Bronze a partir de R$ 199,90/mês (Pro) e R$ 129,90 (Pro BPO), **mais de 14.000 contadores/BPOs parceiros**; sem comissão publicada — [Conta Azul Contadores](https://www.contaazul.com/contadores). Comissões recorrentes publicadas por outros SaaS: 15/20/25/30% por faixa de clientes indicados ([Planilha de Fluxo](https://www.planilhadefluxo.com.br/parceiros/contadores)); 100% da 1ª mensalidade ou 10% recorrente ([Contabilidade Zen](https://contabilidadezen.com.br/seja-parceiro-cz)); 10% recorrente ([Chatsac](https://chatsac.com/programa-de-parceiro-chatsac)); 35% ([Loja Integrada](https://lojaintegrada.com.br/hub/programa-de-indicacoes/)); 40% recorrente vitalício em um relato de founder ([TabNews](https://www.tabnews.com.br/LaunchSpy/pitch-como-montamos-um-programa-de-parceiros-com-40-por-cento-recorrente-vitalicio-cupom-link))
- [F] Educação: Imersão ESN 40h online ao vivo **R$ 2.850 (promo R$ 2.280)**; intensivo 10h **R$ 872**; CFC + Receita Federal ofereceram curso **gratuito** de 18 módulos (mai–set/2026) — [ESN](https://escolasuperioresn.com.br/?p=6202); [ESN intensivo](https://escolasuperioresn.com.br/?p=9362); [Fenacon](https://fenacon.org.br/?p=51223)

### Inferences — matriz comparativa

[E]/[H] Hipóteses comuns: custo-hora de analista pleno no Simples **≈ R$ 90–120** (R$ 9.046 ÷ 75–100 h faturáveis/mês; ver seção 8); tributos sobre receita de 6% (Simples Anexo III, 1ª faixa, com Fator R ≥ 28%) a 15,5% (Anexo V) ou 13,3–16,3% (Lucro Presumido); meios de pagamento 0–3%.

| Modelo | Receita típica/cliente | Margem bruta (após custo direto de entrega e tributos) | Capital para começar | Escalabilidade (limite) | Risco principal |
|---|---|---|---|---|---|
| (a) Consultoria por projeto (diagnóstico, adequação, repricing) | R$ 2–15 mil por PME [F]; R$ 20–130 mil para médias [F] | [E] 55–70%: diagnóstico R$ 8 mil com 25 h × R$ 90 = R$ 2.250 de custo + 6% imposto → contribuição R$ 5.270 (66%) | Baixo (R$ 20–40 mil: marca, site, ferramentas, 3 meses de pró-labore) | Linear em horas; 1 consultor ≈ 4–6 diagnósticos/mês | Venda recorrente de projetos (pipeline), concentração em poucos clientes, dependência do sócio técnico (CRC/OAB para assinar pareceres) |
| (b) Retainer mensal (acompanhamento da transição, preços, split) | R$ 1.500–3.700/mês [F] (PME: R$ 1–2 mil [H]) | [E] 60–75%: R$ 2.000 − 6 h × R$ 90 − 6% = R$ 1.340 (67%) | Baixo (igual a (a)) | Linear: 100 h faturáveis ≈ 15–20 retainers por analista | Churn ao fim da "urgência" (2027–2029), pressão de preço pelos contadores que oferecem como parte do honorário |
| (c) Educação (cursos online, in-company, workshops para ACs/CDLs) | R$ 870–2.850 por aluno [F]; in-company sem dado público | [E] 70–90% em online gravado; 40–60% em ao vivo/in-company (horas do instrutor) | Baixo–médio (produção de conteúdo, plataforma Hotmart/Eduzz com taxa 10–20% [H]) | Alta para gravado, mas competindo com **cursos gratuitos** (CFC/RFB) e marcas (IOB, Fenacon, ESN) | Comoditização; serve mais como canal de aquisição do que como negócio-fim |
| (d) SaaS para PME (simulador de carga/preço, motor de transição, conciliação de split, monitor de crédito) | R$ 150–400/mês [F ticket low-touch; faixa Conta Azul] | [E] 75–88% por cliente após impostos, pagamento, infra e API fiscal (seção 7); mediana setorial 81% [F] | Alto: equipe mínima R$ 45 mil/mês × 15–20 meses até 250–350 clientes ≈ **R$ 500–800 mil** incl. CAC [E] | Alta (custo marginal ~R$ 15–40/cliente) | Churn de PME (11–13%/ano a 3,5%/mês), CAC alto para ticket baixo, atualização normativa contínua (LC 214/2025, regulamentos, Comitê Gestor) |
| (e) White label / canal para escritórios contábeis | R$ 300–1.500/mês por escritório (10–50 clientes finais) [H] ou 15–30% de comissão ao parceiro [F] | [E] 65–80% (menor que (d) pela comissão/desconto ao canal; Conta Azul dá até 85% de desconto ao contador) | Médio (mesmo produto de (d), mais onboarding e multiempresa) | Alta e com CAC mais baixo (um escritório traz dezenas de CNPJs) | Dependência do canal; contador quer margem e marca própria; concorrência das plataformas instaladas (Conta Azul 14 mil parceiros, Omie, Bling/Qive) |
| (f) Híbrido serviço + software | Retainer R$ 1,5–2 mil + licença R$ 150–300 | [E] 65–75% blended; serviço paga a folha, software eleva a margem | Baixo no início (serviço), investimento do software financiado pelo fluxo de caixa | Serviço limita; software destrava | Diluição de foco; precificar bundle sem canibalizar |

- [E] Por que (b)+(f) é o caminho com R$ 100 mil: 15 retainers de R$ 2 mil geram R$ 30 mil/mês, cobrindo a célula mínima (seção 8); 15 clientes consomem ~90 h/mês, dentro da capacidade de um analista + sócio. O mesmo caixa não cobre dois meses do time de SaaS.
- [E] Por que educação é canal e não negócio: com cursos gratuitos do CFC/RFB e tickets de R$ 870–2.850 em escolas estabelecidas, um curso próprio precisaria de ~100 alunos/ano a R$ 1.000 (≈ R$ 100 mil brutos, ~R$ 70 mil líquidos) para pagar um salário sênior; melhor usá-lo como geração de leads para (b)/(d) via associações comerciais.
- [H] Em serviços profissionais, a mediana de 30% de margem bruta da Benchmarkit refere-se a serviços embutidos em empresas de SaaS (precificados abaixo do custo para vender licença); uma consultoria independente bem utilizada opera com margem bruta de 50–65% e margem operacional de 15–25% — hipótese a validar com dados de Sescon/consultorias listadas.

### Gaps
- Não encontrei dados públicos brasileiros de margem/utilização de consultorias tributárias independentes (benchmarks tipo SPI Research não acessados). Como obter: demonstrativos de consultorias listadas/auditadas (ex.: relatórios de BDO/Grant Thornton Brasil não publicam), pesquisa Sescon-SP de rentabilidade de escritórios, entrevistas com 5–10 sócios de boutiques tributárias.
- Preço de palestras/workshops in-company e cachê para associações comerciais/CDL: nenhuma fonte pública localizada (cota de busca esgotada). Como obter: pedir 3 propostas a palestrantes tributários; tabelas de agências de palestrantes.
- Comissão paga a contadores por Omie/Conta Azul não é pública (Conta Azul remunera com desconto, não comissão). Como obter: inscrever-se nos programas (Omie Contador, Conta Azul Mais) e ler os termos.

---

## 4. Preços de referência (hora de consultor, projetos, SaaS fiscal/contábil, cursos, honorários contábeis)

### Takeaway
A hora de consultoria tributária no Brasil é vendida por **R$ 150–500** (júnior/hora técnica R$ 150–300; sênior/complexa R$ 300–600). O diagnóstico de reforma para PME está sendo cobrado em **R$ 2–15 mil** (cobrança única) e a consultoria mensal em **R$ 1.500–3.700**; contratos para empresas maiores chegam a **R$ 100–130 mil**. O "teto psicológico" do SaaS para PME é dado pelos ERPs: Conta Azul **R$ 180–1.030/mês**, Bling **R$ 60–1.250/mês**; APIs de documentos fiscais custam **R$ 95–572/mês** (Focus NFe). Honorários contábeis de ME/EPP ficam em **R$ 250–1.500/mês** — o retainer de reforma precisa caber ao lado desse número.

### Cited Findings

**Hora de consultor tributário**
- [F] Estudo de mercado de valor-hora de consultorias no Brasil (2024–2025): consultoria tributária **R$ 150–500/h**; faixa geral de R$ 70 (empresarial básica) a >R$ 500 (estratégica/tributária complexa); referências de hora técnica contábil R$ 326,12 (serviços contábeis/assessoria) e R$ 601,73 (setor público); planilha de honorários por nível: **sênior R$ 293/h, auxiliar nível II R$ 117/h**; pacotes mensais de tributário "a partir de R$ 500" — [Roberto Dias Duarte](https://www.robertodiasduarte.com.br/estudo-de-mercado-valor-hora-praticado-por-consultorias-no-brasil-2024-2025) (página devolveu 403 ao fetch; dados via trecho indexado)
- [F] Hora técnica consultiva (atendimentos presenciais, auditorias pontuais, pareceres fora da rotina): **R$ 150–300** — [Jornal Contábil](https://jornalcontabil.com.br/noticia/honorarios-contabeis-como-calcular-os-precos-dos-seus-servicos/)
- [F] Autônomos: consultoria tributária **R$ 250–600/h**; consultoria jurídica para pequenas empresas/MEI R$ 200–410/h — [Freela sem Crise](https://www.freelasemcrise.com.br/quanto-cobrar/consultoria-juridica)
- [F] Método recomendado em 2026: partir do custo-hora real e aplicar margem mínima de 20–30% — [Contabilidade Zen](https://www.contabilidadezen.com.br/blog/precificacao-consultoria-hora-tecnica-2026/)

**Projetos de diagnóstico / consultoria de reforma**
- [F] Diagnóstico pontual (troca/avaliação de regime): **R$ 2 mil a R$ 15 mil**, conforme regime do cliente; consultoria mensal para empresas maiores: **R$ 1.500 a R$ 3.700/mês**; contratos de consultoria citados: **R$ 100–130 mil**; caso: R$ 70 mil de consultoria → R$ 1,8 mi de créditos (25/09/2026) — [reformatributaria.com](https://www.reformatributaria.com/iva/contadores-buscam-novas-formas-de-monetizar-e-precificar-servicos-com-a-reforma-tributaria/)
- [F] Marketplace Ohub "Diagnóstico de impacto da reforma tributária": escopo típico = simulação de carga IBS/CBS, impacto em preços/margens/créditos, mapa de adequações de processos e sistemas, plano de transição por fase; **"o investimento varia conforme a complexidade"** (sem preço); até 4 propostas em 24 h — [Ohub](https://www.ohub.com.br/gestao/diagnostico-de-impacto-da-reforma-tributaria)
- [F] Alíquotas de teste 2026: IBS 0,1% e CBS 0,9% — [e-Auditoria](https://www.e-auditoria.com.br/blog/como-cobrar-planejamento-tributario-na-reforma/)

**SaaS fiscal/contábil para PME (páginas oficiais, 01/11/2026)**
- [F] **Conta Azul** (preço cheio mensal / trimestral / anual): Essencial (MEI) R$ 289,90 / 269,90 / **179,90**, 1 usuário; Controle (ME) R$ 549,90 / 499,90 / **349,90**, 2 usuários; Avançado (EPP) R$ 719,90 / 579,90 / **439,90**, 5 usuários; Performance (>R$ 1,5 mi/ano) R$ 1.029,90 / 929,90 / **799,90**, 15 usuários — [Conta Azul](https://www.contaazul.com/planos)
- [F] **Bling**: Cobalto **R$ 60/mês** (5 usuários, até 200 pedidos, NF ilimitada); Titânio **R$ 120/mês** (50 usuários, financeiro completo); Diamante **R$ 650/mês** (100 usuários, 10.000 pedidos); Elite a partir de **R$ 1.250/mês**; 30 dias grátis, sem fidelidade — [Bling](https://www.bling.com.br/planos)
- [F] **Qive (ex-Arquivei)**: cinco planos (Inicial, Rotinas, Gestão, Customizado, Escritórios contábeis) com "precificação personalizada" — sem preço público — [Qive](https://qive.com.br/planos/)
- [F] **Focus NFe (API de documentos fiscais)**: Solo **R$ 94,90/mês** (1 CNPJ, 100 docs, excedente R$ 0,11/doc); Start **R$ 119,90** (3 CNPJs, 100 docs/CNPJ, +R$ 39,90/CNPJ adicional); Growth **R$ 572** (CNPJs ilimitados, 4.000 docs, excedente R$ 0,125/doc); Enterprise sob consulta (>50 mil notas/mês); recebimento de NF-e/CT-e/NFS-e Nacional incluído — [Focus NFe](https://focusnfe.com.br/precos/)
- [F] **Nuvem Fiscal**: entrada a partir de R$ 69/mês segundo comparativo de concorrente ([Notaas](https://www.notaas.com.br/blog/post/comparativo-apis-emissao-nfe-nfse-nfce/)); fórum ACBr registra "comunicado de desativação do serviço Nuvem Fiscal" datado de 22/04/2026 após aquisição pela ACBr (posts de usuários; não confirmado em fonte oficial) — [Fórum ACBr](https://www.projetoacbr.com.br/forum/topic/91922-comunicado-de-desativa%C3%A7%C3%A3o-do-servi%C3%A7o-nuvem-fiscal-22042026/)
- [F] **Omie**: páginas /planos e /planos-e-precos retornaram 429/404 em 01/11/2026; preço não verificado. Dootax e ROIT: preços não públicos (vendas consultivas) — não verificados.

**Cursos de reforma tributária**
- [F] ESN "Imersão em Reforma Tributária sobre o Consumo na Prática – Master Class": **R$ 2.850 (promo R$ 2.280)**, 40 h (7 módulos × 8 h), online ao vivo — [ESN](https://escolasuperioresn.com.br/?p=6202); "Intensivo de Atualização Tributária 2026": **R$ 872**, 10 h — [ESN](https://escolasuperioresn.com.br/?p=9362)
- [F] CFC + Receita Federal: curso gratuito, 18 módulos, mai–set/2026 — [Fenacon](https://fenacon.org.br/?p=51223); IOB Educação: formação de 17 módulos com certificado, preço não publicado — [Jornal Contábil, 14/10/2025](https://jornalcontabil.com.br/noticia/iob-oferece-curso-completo-e-certificado-anual-que-atesta-a-capacitacao-do-contador-para-a-reforma-tributaria/)

**Honorários contábeis por porte**
- [F] Sescon-SP (via Makrosystem): indústria até 300 lançamentos/mês **R$ 706–1.412**; até 600 lançamentos **R$ 1.200–2.100**; Simples com faturamento R$ 500 mil–1 mi **~R$ 1.000/mês**; >R$ 5 mi **>R$ 2.500/mês** — [Makrosystem](https://makrosystem.com.br/blog/honorarios-contabeis)
- [F] Agilize citando levantamento Sescon-SP fev/2026 (1.840 escritórios validados pelo CRC-SP; tabela com fonte intermediária dinheirodaminhaempresa.com): ME serviços online **R$ 249–549** / presencial **R$ 450–850**; ME comércio R$ 199–499 / R$ 380–650; EPP Simples online **R$ 399–899** / presencial **R$ 750–1.500**; até R$ 30 mil/mês de faturamento: R$ 139–369 — [Agilize](https://agilize.com.br/artigos/?p=4687)
- [F] Contabilizei (21/10/2026): planos **R$ 139–395/mês** (serviços); referência de mercado para serviços: **Simples R$ 250–1.400; Lucro Presumido R$ 580–2.200/mês**; abertura com honorários e certificado gratuitos; taxas governamentais "até R$ 1.800" — [Contabilizei](https://www.contabilizei.com.br/contabilidade-online/servicos-de-contabilidade-precos/)
- [F] Ohub ("preço justo"): MEI R$ 120–350; Simples R$ 300–1.200; Lucro Presumido R$ 600–1.500; Lucro Real ≥ R$ 1.800/mês — [Ohub](https://www.ohub.com.br/contabilidade-honorario-alto-pouco-servico)

### Inferences
- [E] Grade de preços coerente com o mercado para a nova empresa: **hora júnior R$ 150–200; hora sênior/sócio R$ 300–450**; **diagnóstico PME (Simples/Presumido) R$ 3–8 mil (15–30 h)**; **diagnóstico média empresa (Lucro Real, multi-UF, split) R$ 20–60 mil**; **retainer PME R$ 990–2.500/mês**; **retainer média empresa R$ 3–8 mil/mês**; **licença SaaS PME R$ 149–399/mês**; **licença para escritório contábil R$ 299–999/mês conforme nº de CNPJs**. A faixa reportada de R$ 2–15 mil para diagnóstico confirma a hipótese do briefing (R$ 3–15 mil); para médias, os R$ 100–130 mil citados são contratos completos de consultoria, não diagnósticos — a hipótese de R$ 20–100 mil é plausível mas não comprovada para o "diagnóstico" isolado.
- [E] Teste de "cabe no bolso": uma EPP que paga R$ 400–900 de honorário contábil (online) ou R$ 750–1.500 (presencial) dificilmente aceita um retainer de reforma maior que o honorário; isso empurra o retainer PME para **R$ 500–1.500/mês** ou para o modelo "licença + horas", enquanto o ticket de R$ 2–3,7 mil fica para empresas com faturamento > R$ 5 mi.
- [E] Custo de API fiscal por cliente SaaS: no plano Growth da Focus NFe, 4.000 docs por R$ 572 = **R$ 0,143/doc efetivo** (R$ 0,125 no excedente). Uma PME com 200 docs/mês custa **R$ 25–29/mês** de API — relevante só se o produto ingere documentos (conciliação de split, monitor de crédito); um simulador de preços não tem esse custo.

### Gaps
- Preço do Omie, Dootax e ROIT não obtidos (bloqueio/404 ou venda consultiva). Como obter: trial do Omie (preço aparece no checkout); pedir proposta a Dootax/ROIT como PME.
- Cursos no Hotmart sobre IBS/CBS: não pesquisados (cota de busca esgotada). Como obter: busca manual no marketplace Hotmart por "reforma tributária".
- A pesquisa Sescon-SP fev/2026 original não foi acessada; valores vêm de intermediários (Agilize/Makrosystem).

---

## 5. Aquisição: canais, CAC, ciclo de venda e conversão de funil

### Takeaway
Não existe benchmark público confiável de CAC para SaaS/serviços B2B de PME no Brasil em 2026 (a pesquisa Vorbi 2026 ficou inacessível; Distrito/Meetime/RD não foram alcançados). Os benchmarks globais indicam **CAC ratio mediano de US$ 2,00 de S&M por US$ 1 de ARR novo** (Benchmarkit 2025) e **CAC de US$ 1.100–1.400 para SaaS SMB** (OpenView 2025); traduzido para um ticket de R$ 199/mês, isso implica CAC de **R$ 4.800** e payback de ~30 meses — inviável; para fechar em 12 meses, o CAC precisa ficar **≤ R$ 1.800–2.100**, o que só o canal contador/indicação entrega. O funil brasileiro converte **2,5% de visitantes em leads qualificados** no B2B (Leadster 2025).

### Cited Findings
- [F] Benchmarkit 2025: **CAC ratio de novo cliente = US$ 2,00 de S&M por US$ 1,00 de novo ARR** (4º quartil US$ 2,82; +14% em 2024); CAC ratio de expansão US$ 1,00; blended ≈ US$ 1,39 (derivado); S&M = 37% da receita; payback "~12 meses" é senso comum, mas subiu 12,5% na mediana desde 2022 — [Benchmarkit](https://www.benchmarkit.ai/2025benchmarks)
- [F] Citações agregadas em resultados de busca (não verificadas na fonte primária): OpenView 2025 — **CAC mediano de SaaS SMB US$ 1.100–1.400**; SaaS Capital 2025 — **LTV:CAC mediano 2,1:1** vs benchmark 3:1; Aleph × Benchmarkit 2025 (LatAm) — **CAC payback mediano 16 meses** em 2025, melhor que 2024 — [wearefounders (agregador)](https://www.wearefounders.uk/saas-churn-rates-and-customer-acquisition-costs-by-industry-2025-data/)
- [F] Antom (04/12/2025): "60% das empresas de SaaS brasileiras recuperam o CAC em até seis meses"; manchete fala em payback médio de 6–12 meses — **fonte da pesquisa não nomeada** — [Antom](https://knowledge.antom.com/latin-america-on-the-rise-sme-demand-powers-saas-growth)
- [F] Agregador (out/2025, atualizado fev/2026, sem fontes): CAC médio B2B US$ 1.200; **CAC por indicação US$ 150** vs busca paga US$ 802 vs orgânico US$ 480–942; small business CAC US$ 100–400 com ciclo de 1–3 meses; 40% do novo ARR vem de clientes existentes — [wearefounders](https://www.wearefounders.uk/saas-churn-rates-and-customer-acquisition-costs-by-industry-2025-data/) (internamente inconsistente; usar com cautela)
- [F] Leadster, Panorama de Geração de Leads no Brasil 2025 (2.861 sites, 3,7 mi leads, 167 mi visitas): conversão **visitante → lead qualificado B2B mediana 2,50%** (2,47% em 2024); mercado geral 2,98%; B2C 3,28% — [Agendor](https://www.agendor.com.br/blog/panorama-de-geracao-de-leads-no-brasil/)
- [F] Pesquisa citada pelo Jornal de Brasília: **71% das empresas B2B no Brasil** dizem que gerar leads é seu maior desafio — [Jornal de Brasília](https://jornaldebrasilia.com.br/brasil-7/por-que-71-das-empresas-b2b-no-brasil-dizem-que-gerar-leads-e-seu-maior-desafio-e-como-algumas-estao-revertendo-esse-numero/)
- [F] RAIN Group (via Sebrae): >80% das vendas B2B exigem 5–8 interações — [Sebrae RS](https://conhecimento.sebraers.com.br/wp-content/uploads/2026/04/07.04.26-Mentalidade-vendedora-como-fazer-seu-negocio-vender-mais-Gustavo-Malavota.pdf)
- [F] Canal contador: Conta Azul tem **>14.000 contadores/BPOs parceiros** e remunera com desconto de até 85% (o contador revende/embute) — [Conta Azul](https://www.contaazul.com/contadores); comissões recorrentes de 10–40% em programas de outros SaaS (seção 3)
- [F] Demanda latente: 63% das PMEs veem a revisão de preços como a principal mudança da reforma e só 17% esperam que o contador lidere — espaço para um terceiro — [Omie](https://www.omie.com.br/blog/reforma-tributaria-precificacao-oportunidade-contadores/)
- [F] Custo de ferramentas de aquisição: RD Marketing Light a partir de R$ 50/mês (3 meses), Basic **R$ 309/mês**, Pro a partir de R$ 1.121/mês + implementação R$ 1.499 — [RD Station](https://www.rdstation.com/precos/); Pipedrive **US$ 14–69/licença/mês** (anual) — [Pipedrive](https://www.pipedrive.com/pt/pricing); WeWork All Access SP a partir de **R$ 1.003/mês** (para eventos/reuniões) — [WeWork](https://www.wework.com/pt-BR/l/coworking-space/sao-paulo)

### Inferences
- [E] CAC máximo admissível por ticket, para payback ≤ 12 meses com margem de contribuição de ~75–88% (seção 7): R$ 149 → CAC ≤ **R$ 1.300–1.550**; R$ 199 → ≤ **R$ 1.800–2.100**; R$ 399 → ≤ **R$ 3.600–4.300**. Aplicando o CAC ratio mediano global (2,0 × ARR): R$ 199 × 12 × 2 = **R$ 4.776** → payback ≈ 4.776 ÷ 165 ≈ **29 meses** → o SaaS low-touch só fecha a conta com CAC de canal/indicação (um terço do outbound) ou com ticket maior.
- [E] CAC de consultoria via fundador (sem SDR): tempo do fundador (R$ 5.000 pró-labore ÷ 160 h = R$ 31/h) × 10–15 h por fechamento (prospecção + 2 reuniões + proposta) + R$ 500–1.000 de mídia/eventos ≈ **R$ 800–1.500 por retainer**; com SDR CLT (R$ 7.100/mês + variável) fechando 4–6 retainers/mês, CAC ≈ **R$ 1.500–2.500**. Contra um retainer de R$ 2.000 (contribuição ~R$ 1.340), payback de 1–2 meses — excelente.
- [H] Funil de consultoria B2B para PME (sem fonte brasileira localizada; padrão de mercado): lead → reunião 25–40%; reunião → proposta 50–70%; proposta → fechamento 20–35%; ciclo PME 2–6 semanas; média empresa 2–4 meses (comitê, compras, jurídico). Para 2 retainers/mês são necessárias ~6–10 propostas e ~25–40 leads qualificados/mês.
- [H] Ordem de prioridade dos canais para esta empresa: (1) **contadores como canal** (um escritório abre 20–200 CNPJs; comissão 15–25% recorrente ou desconto de revenda); (2) **associações comerciais/CDL/sindicatos patronais** com workshops gratuitos (educação como isca; conversão para diagnóstico); (3) **conteúdo técnico no LinkedIn/YouTube** sobre split payment e repricing (SEO de cauda longa; o tema tem pico de busca 2026–2027); (4) **indicação** de clientes atendidos; (5) outbound só para médias empresas (ticket > R$ 20 mil).

### Gaps
- Benchmarks brasileiros específicos (Vorbi 2026 — DNS falhou; Distrito SaaS Report; Meetime Inside Sales Benchmark; RD Station Panorama de Vendas; Ploomes) não acessados. Como obter: baixar os relatórios mediante cadastro; a Vorbi publicou "B2B CAC Research Brazil 2026".
- Taxas de conversão por etapa (lead→reunião→proposta→fechamento) para consultoria no Brasil: nenhuma fonte pública encontrada; as hipóteses acima precisam de calibração com os primeiros 90 dias de operação.
- Ciclo de venda em dias por porte: sem fonte brasileira; usei a faixa de 1–3 meses (SMB global) do agregador.

---

## 6. Retenção: churn, LTV/CAC, payback e recompra

### Takeaway
Para SaaS de PME, o churn bruto anual de referência é **11–13%** (ChartMogul 2025, empresas de 1–50 funcionários) a **12%** (GRR mediana de 88%, Benchmarkit 2025), com casos de **3,5%/mês (~35%/ano)** em B2B de ticket muito baixo; relato (não verificável) de SaaS brasileiro com churn de 12% em boleto caindo para 6% com Pix recorrente. LTV:CAC mediano real é **2,1:1** (SaaS Capital 2025), abaixo do alvo de 3:1. Não encontrei dados de churn de escritórios contábeis (perda de clientes/ano) nem de recompra em consultoria.

### Cited Findings
- [F] Benchmarkit 2025: **GRR mediana 88%** (≈ 12% de churn bruto anual), caindo de 90% em três anos; GRR cresce com o ACV; NRR mediana 101% — [Benchmarkit](https://www.benchmarkit.ai/2025benchmarks)
- [F] ChartMogul 2025 (via agregador): SMB (1–50 funcionários) **churn bruto anual mediano 11–13%**; SaaS Capital 2025: **LTV:CAC mediano 2,1:1** vs 3:1 — [wearefounders](https://www.wearefounders.uk/saas-churn-rates-and-customer-acquisition-costs-by-industry-2025-data/)
- [F] Agregadores: churn B2B blended **3,5%/mês** (2,6% voluntário + 0,8% involuntário ≈ 35%/ano); B2B SaaS "tipicamente abaixo de 3–4%/mês"; SaaS B2B de ticket < US$ 5 mil/ano: **14–22% de churn anual**; mid-market (US$ 5–50 mil): 6,8% — [wearefounders](https://www.wearefounders.uk/saas-churn-rates-and-customer-acquisition-costs-by-industry-2025-data/); [voxbooster](https://www.voxbooster.com/pt-BR/blog/saas-churn-statistics-2026/)
- [F] Corrigir falhas de pagamento (churn involuntário) pode elevar a receita do 1º ano em 8,6% — [wearefounders](https://www.wearefounders.uk/saas-churn-rates-and-customer-acquisition-costs-by-industry-2025-data/)
- [F] Relato isolado (blog, sem fonte verificável): SaaS brasileiro com **12% de churn em boleto bancário caiu para 6%** ao integrar Pix com renovação automática — citado em resultados de busca ([ecosistemastartup](https://ecosistemastartup.com/?p=59797))
- [F] Antom (dez/2025): 60% dos SaaS brasileiros recuperam o CAC em até 6 meses (fonte não nomeada) — [Antom](https://knowledge.antom.com/latin-america-on-the-rise-sme-demand-powers-saas-growth)
- [F] Pesquisa Zendesk citada pelo Insper: 35% cancelaram após problema com atendimento — [Insper](https://www.insper.edu.br/pt/noticias/2022/11/churn-rate--o-que-e-e-como-diminuir-essa-metrica)
- [F] Em retainers de reforma, o próprio desenho do serviço é "acompanhar a transição ano a ano" (2026–2033), o que ancora recorrência — [e-Auditoria](https://www.e-auditoria.com.br/blog/como-cobrar-planejamento-tributario-na-reforma/)

### Inferences
- [E] LTV e LTV/CAC para o SaaS a R$ 199/mês com contribuição de R$ 165 (seção 7):
  - churn 1,0%/mês (≈ 11,4%/ano, boa retenção via contador): vida média 100 meses → LTV (não descontado) **R$ 16.500**; com CAC R$ 2.000 → LTV/CAC 8,3; com CAC R$ 4.776 → 3,5.
  - churn 1,5%/mês (≈ 17%/ano): vida 67 meses → LTV **R$ 11.000**; LTV/CAC 5,5 (CAC 2.000) / 2,3 (CAC 4.776 — próximo da mediana real de 2,1:1).
  - churn 3,5%/mês (35%/ano, low-touch sem canal): vida 29 meses → LTV **R$ 4.700**; LTV/CAC 2,4 (CAC 2.000) / 1,0 (CAC 4.776) → destrói valor.
  - Conclusão: a viabilidade do SaaS depende mais de manter o churn ≤ 1,5%/mês (canal contador + cobrança recorrente automática) do que do preço.
- [E] Payback de CAC em meses = CAC ÷ contribuição mensal: R$ 2.000 ÷ 165 = **12 meses**; R$ 1.500 ÷ 165 = 9; R$ 4.776 ÷ 165 = 29.
- [H] Retainer de consultoria: churn esperado baixo durante 2026–2028 (fase de maior incerteza) — 1–2%/mês — subindo em 2029–2033 conforme as regras se estabilizam e os contadores internalizam; a recompra em consultoria por projeto (diagnóstico → adequação → repricing → revisão anual) pode ser desenhada como uma "esteira" de 3–4 projetos por cliente ao longo da transição.
- [H] Churn de escritórios contábeis: sem dado. A hipótese usual do setor é perda de 5–15% da carteira/ano (fechamento de empresas + troca de contador), que importa para o canal: se o escritório parceiro perde 10% dos clientes/ano, a base indicada por ele também gira nessa ordem.

### Gaps
- Churn de escritórios contábeis (perda de clientes/ano) no Brasil: nenhuma pesquisa localizada (Sescon/Fenacon/Omie). Como obter: pesquisa "Perfil dos escritórios" do Sescon-SP; dados de plataformas de BPO; survey próprio com 30 escritórios.
- Taxa de recompra em consultoria tributária: sem dado público. Como obter: entrevistar boutiques tributárias; usar NPS/recontratação dos primeiros 20 clientes.
- Churn por meio de pagamento no Brasil (boleto vs Pix automático vs cartão): só relato anedótico; Vindi/Asaas/Pagar.me publicam estudos — não acessados.

---

## 7. Unit economics: margem de contribuição por cliente (consultoria e SaaS), tributos sobre receita, meios de pagamento, comissões de canal

### Takeaway
No **Simples Nacional**, consultoria e software estão sujeitos ao **Fator R**: com folha + pró-labore ≥ 28% da receita, a empresa paga pelo **Anexo III (6% na 1ª faixa; ~11% efetivo em R$ 720 mil/ano)**; abaixo disso, **Anexo V (15,5%)**. **Lucro Presumido** para serviços custa **13,33–16,33%** da receita. Meios de pagamento: Pix e boleto custam **R$ 0–4 por recebimento** (Cora grátis; Asaas Pix R$ 1,99; Sicoob boleto R$ 4,00) e cartão **2,3–2,9% à vista**. Resultado: um retainer de R$ 2.000 deixa **~R$ 1.340 (67%)** de contribuição; uma licença de R$ 199 deixa **R$ 150–175 (75–88%)** por mês.

### Cited Findings

**Tributos sobre a receita**
- [F] Simples Nacional 2026 (tabelas da LC 155/2016, sem alteração em 2026). **Anexo III**: até R$ 180 mil **6,0%**; até 360 mil 11,2% (−R$ 9.360); até 720 mil 13,5% (−R$ 17.640); até 1,8 mi 16% (−R$ 35.640); até 3,6 mi 21% (−R$ 125.640); até 4,8 mi 33% (−R$ 648.000). **Anexo V**: 15,5%; 18% (−4.500); 19,5% (−9.900); 20,5% (−17.100); 23% (−62.100); 30,5% (−540.000). **Fator R**: folha dos últimos 12 meses ÷ receita ≥ 28% → Anexo III; consultoria (§ 5º-I) e software (§ 5º-D) estão sujeitos à regra. A partir de 2027 valem os novos Anexos da LC 214/2025 (CBS substitui PIS/Cofins) e o optante poderá escolher, a cada semestre, recolher IBS/CBS dentro ou fora do DAS — [valorfinal.com.br, 30/10/2026](https://valorfinal.com.br/tabela-simples-nacional-2026)
- [F] Lucro Presumido, serviços (presunção 32%): IRPJ 4,80% + CSLL 2,88% + PIS 0,65% + COFINS 3,00% + ISS 2–5% = **13,33–16,33%**; adicional de IRPJ de 10% sobre a base acima de R$ 60 mil/trimestre (faturamento > R$ 187.500/trimestre); pró-labore com INSS 11% do sócio + 20% patronal. Comparativo por faturamento anual: R$ 180 mil — III 6%, V 15,5%, LP 13,3–16,3%; R$ 720 mil — III ~11,2%, V ~18%; R$ 2,4 mi — III ~17%, V ~21%, LP ~12,8–15,8% — [Contabilidade Zen, 30/06/2026](https://www.contabilidadezen.com.br/blog/lucro-presumido-prestador-servico-2026/)

**Meios de pagamento**
- [F] Asaas (atualizado 23/04/2026): conta PJ sem mensalidade; **Pix R$ 0,99 nos 3 primeiros meses, depois R$ 1,99 por recebimento** (100 primeiras entradas por chave/QR estático isentas); **boleto cobrado só quando pago**, sem taxa de emissão (valor não exibido no texto); cartão com taxa fixa independente do nº de parcelas (via simulador) — [Asaas](https://blog.asaas.com/taxas-asaas/)
- [F] Cora: **emissão ilimitada e gratuita de boletos** (inclusive com QR Pix) e **Pix PJ sem tarifa** — [Cora](https://www.cora.com.br/blog/pix-pode-ser-cobrado-de-pessoa-juridica/)
- [F] Sicoob, tabela PJ vigente 05/03/2026: **liquidação de boleto R$ 4,00** — [Sicoob](https://www.sicoob.com.br/documents/d/sicoobempresasrj/tabela-de-tarifas-pj-vigencia-2026-03-05-pdf); Itaú Bolecode até R$ 5,50 — [Tecnoblog](https://tecnoblog.net/noticias/pix-itau-bradesco-e-bb-cobram-ate-r-150-de-clientes-pj-veja-tarifas/); bancos cobram Pix PJ de 0,99–1,45% (mín. R$ 1, máx. R$ 10) — [Nuvemshop](https://www.nuvemshop.com.br/blog/pix-pessoa-juridica/)
- [F] InfinitePay (link de pagamento, D+1): **crédito à vista 2,29–2,89%** conforme faturamento; 2–6x 3,18–3,68%; 7–12x 5,39–5,89%; Pix grátis; maquininha D+1 crédito 2,69–3,15% — [InfinitePay](https://www.infinitepay.io/taxas)

**Comissões de canal**
- [F] 15–30% recorrente por faixa (Planilha de Fluxo); 10% recorrente ou 100% da 1ª mensalidade (Contabilidade Zen); 10% (Chatsac); 35% (Loja Integrada); 40% vitalício (relato) — links na seção 3. Conta Azul remunera o contador com até 85% de desconto (modelo de revenda) — [Conta Azul](https://www.contaazul.com/contadores)

**Custos diretos de entrega (SaaS)**
- [F] API fiscal: R$ 0,11–0,125/documento no excedente; planos de R$ 94,90–572/mês — [Focus NFe](https://focusnfe.com.br/precos/)
- [F] Margem bruta mediana de assinatura 81% — [Benchmarkit](https://www.benchmarkit.ai/2025benchmarks)

### Inferences — contas de margem de contribuição

**Consultoria (retainer de R$ 2.000/mês; cliente consome 6 h/mês)** [E]
- Custo-hora do analista pleno: R$ 9.046 ÷ 100 h faturáveis = **R$ 90/h** (ou R$ 121/h a 75 h faturáveis).
- Custo direto: 6 h × R$ 90 = R$ 540. Tributo (Anexo III, 1ª faixa) 6% = R$ 120. Pagamento (Pix/boleto) ≈ R$ 2–4.
- **Contribuição ≈ 2.000 − 540 − 120 − 4 = R$ 1.336 (67%)**. No Anexo V (15,5%): 2.000 − 540 − 310 − 4 = **R$ 1.146 (57%)**. No Lucro Presumido (ISS 3% → 14,33%): **R$ 1.169 (58%)**.
- Se o cliente consumir 10 h/mês, a contribuição cai para R$ 976 (49%) — o controle de escopo (horas incluídas, excedente a R$ 200/h) é o principal determinante da margem.

**Diagnóstico (R$ 8.000; 25 h)** [E]: custo direto 25 × 90 = 2.250; imposto 6% = 480; contribuição **R$ 5.270 (66%)**. Se sênior/sócio fizer 10 das 25 h a custo de oportunidade de R$ 150/h: contribuição R$ 4.670 (58%).

**SaaS (licença R$ 199/mês)** [E]
- Imposto: 6% (R$ 12) na 1ª faixa; **~11% (R$ 22)** quando a receita anual passa de R$ 360–720 mil (Anexo III, 3ª faixa: (720.000 × 13,5% − 17.640) ÷ 720.000 = 11,05%). Se o Fator R cair abaixo de 28% (típico quando o SaaS escala com pouca folha), Anexo V: 15,5–19,5% (R$ 31–39).
- Pagamento: Pix/boleto R$ 2–4; cartão recorrente 2,9% ≈ R$ 6.
- Infra (hospedagem, banco, e-mail, monitoramento): **R$ 5–10/cliente/mês** [H].
- API fiscal: R$ 0 (simulador) a R$ 25–29 (200 docs/mês ingeridos).
- Comissão de canal: 0 (direto) a 20% (R$ 40).
- **Contribuição**: direto, sem API, 1ª faixa: 199 − 12 − 4 − 8 = **R$ 175 (88%)**; em escala (11%), sem API: 199 − 22 − 4 − 8 = **R$ 165 (83%)**; com API: **R$ 140 (70%)**; via canal 20% + API: **R$ 100 (50%)**. Com Anexo V e API: 199 − 31 − 4 − 8 − 25 = **R$ 131 (66%)**.
- Para R$ 149: direto sem API ≈ **R$ 125 (84%)**; para R$ 399: ≈ **R$ 340 (85%)**.

**Leitura**: a comissão ao contador (20–30%) pesa mais que impostos e infra somados; por isso o modelo de **revenda com desconto** (o contador compra a R$ 100–120 e cobra o que quiser do cliente, como faz a Conta Azul) protege a margem unitária e transfere a cobrança/inadimplência ao canal.

- [E] Fator R na prática: no cenário de serviço (seção 8) a folha mensal é R$ 6.000 (CLT) + R$ 13.000 (pró-labore) ≈ R$ 19.000 + FGTS ≈ R$ 19.500 contra receita de R$ 30 mil → **Fator R ≈ 65%** → Anexo III garantido. No cenário SaaS maduro (300 clientes, R$ 60 mil/mês de receita, folha R$ 32 mil) → Fator R ≈ 53% → ainda Anexo III. O risco de cair no Anexo V aparece só se a receita crescer muito acima da folha (bom problema) — ou se os sócios não se pagarem pró-labore.

### Gaps
- Valor do boleto Asaas e taxa exata de cartão (ficam no simulador logado). Como obter: criar conta no Asaas/Vindi/Pagar.me.
- Alíquota de ISS depende do município (2–5%); cidades como SP cobram 2% para alguns serviços de TI e 5% para consultoria — verificar no cadastro municipal [H].
- Comportamento de IBS/CBS para optantes do Simples a partir de 2027 (recolher por dentro/fora do DAS) afeta a competitividade com clientes do regime regular que querem crédito; análise detalhada pertence ao dossiê regulatório.

---

## 8. Operação mínima, gargalos em 10/100/1.000 clientes e ponto de equilíbrio

### Takeaway
A célula mínima viável é **fundador (tech, vendas, produto) + sócio tributarista com CRC/OAB (entrega e assinatura técnica) + 1 analista fiscal pleno CLT**, remota, com overhead de ferramentas de **~R$ 2–3 mil/mês** e abertura de **~R$ 1,2–3 mil**. Com pró-labore cheio o burn é **~R$ 27 mil/mês** (3,7 meses de caixa); com os sócios adiando pró-labore, **~R$ 14 mil/mês** (7 meses). Ponto de equilíbrio da consultoria: **8 retainers de R$ 2 mil** (sem pró-labore) ou **15 retainers** (com pró-labore). O SaaS precisa de **~250–350 licenças** de R$ 199 para cobrir uma equipe de 4 — alcançável só depois que o serviço pagar as contas.

### Cited Findings

**Custos de abertura e operação**
- [F] Abertura de Ltda em 2026 (exemplo Maranhão, 23/03/2026): Junta Comercial **R$ 304** (EI R$ 133; S/A R$ 557); alvará municipal variável (~R$ 700; ME isenta em São Luís); e-CNPJ A1 ~R$ 150, A3 até R$ 450; honorários de abertura **R$ 600–2.000**; total de taxas Ltda ≈ **R$ 1.154** — [Jornal Contábil](https://jornalcontabil.com.br/noticia/quanto-custa-abrir-uma-empresa-no-maranhao-em-2026/); Contabilizei: taxas governamentais de abertura "até R$ 1.800", honorários e certificado gratuitos em campanha — [Contabilizei](https://www.contabilizei.com.br/contabilidade-online/servicos-de-contabilidade-precos/)
- [F] Certificado digital e-CNPJ (out/2026): **A1 (1 ano) R$ 180–280; A3 R$ 210–470** — [Omie](https://www.omie.com.br/blog/qual-e-o-valor-do-certificado-digital-a1-e-a3-em-2026/); em licitações: R$ 190–248 — [CRCPR](https://www3.crcpr.org.br/crcpr/conteudo/licitacoes/sei_1185486_aviso_de_contratacao_direta_12_2026.pdf)
- [F] Contabilidade própria: Contabilizei **R$ 139–395/mês**; mercado para serviços no Simples R$ 250–1.400 — [Contabilizei](https://www.contabilizei.com.br/contabilidade-online/servicos-de-contabilidade-precos/)
- [F] Coworking SP: WeWork All Access **a partir de R$ 1.003/mês**; diária R$ 214; mesa dedicada e sala sob consulta — [WeWork](https://www.wework.com/pt-BR/l/coworking-space/sao-paulo)
- [F] CRM: Pipedrive **US$ 14–69/licença/mês** — [Pipedrive](https://www.pipedrive.com/pt/pricing); RD Marketing Basic **R$ 309/mês** — [RD Station](https://www.rdstation.com/precos/)
- [F] API fiscal: Focus NFe **R$ 94,90–572/mês** — [Focus NFe](https://focusnfe.com.br/precos/)
- [F] Marca: página de custos do INPI remete à tabela de retribuições (PDF de 20/12/2025); valores não extraídos — [INPI](https://www.gov.br/inpi/pt-br/servicos/marcas/custos)
- [F] Ferramentas de cobrança: Asaas/Cora sem mensalidade — seção 7

**Capacidade e qualidade**
- [F] Benchmarkit: S&M mediana 37% da receita e R&D 34% em SaaS privadas — [Benchmarkit](https://www.benchmarkit.ai/2025benchmarks)
- [F] A implementação exige frentes múltiplas (contratos, precificação, capital de giro, sistemas, benefícios) e o Robert Half aponta escassez de capacidade interna como razão para consultoria/staff loan — [Robert Half PDF](https://www.roberthalf.com/content/dam/roberthalf/documents/br/pt/indexed/2025-reforma-tributaria-h2-rhi-br-por.pdf)

### Inferences — orçamento, equilíbrio e escala

**Overhead mensal mínimo (remoto)** [E]: contabilidade R$ 200–400; Google Workspace/e-mail/armazenamento ~R$ 150 (3 contas) [H]; CRM R$ 100–400; cobrança R$ 0–50; API fiscal R$ 95–120 (quando houver produto); cloud R$ 200–500 [H]; domínio/site/hospedagem R$ 50; seguro/jurídico (contratos, LGPD) R$ 300 [H]; certificado R$ 20 (amortizado); marketing (eventos, LinkedIn Ads, material) **R$ 1.500–3.000**; coworking opcional R$ 1.000. **Total: R$ 2,6–6 mil/mês; adotado R$ 5.000** (com marketing) nos cenários. Custo único de abertura + marca + site + identidade: **R$ 5–12 mil** [E].

**Cenário A — Consultoria (serviço-primeiro)** [E]
- Equipe: fundador (pró-labore R$ 5.000) + sócio tributarista (R$ 8.000) + analista fiscal pleno CLT (custo R$ 9.046) + overhead R$ 5.000 = **R$ 27.046/mês** ≈ R$ 27.000. Sem pró-labore nos primeiros meses: **R$ 14.046** ≈ R$ 14.000.
- Capacidade de entrega: analista 100 h faturáveis + sócio 60 h = **160 h/mês** (fundador vende e constrói ferramentas internas).
- Ponto de equilíbrio em clientes (receita líquida de tributo; Anexo III 6% | Anexo V 15,5%):

| Preço do retainer | Líquido/cliente (III / V) | Clientes p/ cobrir R$ 27.000 (III / V) | Horas (6 h/cliente) | Clientes p/ cobrir R$ 14.000 (III) |
|---|---|---|---|---|
| R$ 1.500 | 1.410 / 1.268 | **20 / 22** | 120 h ✔ | 10 |
| R$ 2.000 | 1.880 / 1.690 | **15 / 16** | 90 h ✔ | 8 |
| R$ 3.000 | 2.820 / 2.535 | **10 / 11** | 60 h ✔ | 5 |

(Obs.: o custo do analista já está no fixo; o líquido acima desconta só o tributo. Em termos de contribuição após horas, 15 clientes × R$ 1.336 = R$ 20 mil cobre o fixo sem o analista — consistente.)

- Diagnósticos avulsos: contribuição R$ 5.270 (R$ 8 mil) → **6 diagnósticos/mês** para R$ 27 mil, consumindo 150 h (toda a capacidade) e exigindo ~25–30 propostas/mês a 20–25% de conversão [H] — mais difícil de sustentar do que 15 retainers.
- **Meses até o equilíbrio** (hipótese: 2 novos retainers de R$ 2.000/mês a partir do mês 3, zero churn) [E]:
  - Com pró-labore cheio: 15 clientes no mês 10. Caixa acumulado: meses 1–2 = −54.000; meses 3–10 = 8 × 27.000 − 3.760 × (1+2+…+8) = 216.000 − 135.360 = −80.640 → **−R$ 134.640 + abertura R$ 8.000 ≈ −R$ 143 mil** → **não cabe em R$ 100 mil**.
  - Sem pró-labore até o equilíbrio: 8 clientes no mês 6. Caixa: −28.000 (m1–2) − 10.240 − 6.480 − 2.720 + 1.040 ≈ **−R$ 46.400 + R$ 8.000 ≈ −R$ 54 mil** → sobra ~R$ 45 mil de colchão para inadimplência, marketing e o início do software. **Este é o único arranjo que fecha com R$ 100 mil.**
  - Sensibilidade: a 1 retainer/mês, o equilíbrio sem pró-labore vem no mês 10 e o caixa consumido sobe para ~R$ 85–90 mil — na borda.

**Cenário B — SaaS puro** [E]
- Equipe: fundador dev (R$ 5.000) + sócio tributarista (R$ 8.000) + dev pleno CLT (R$ 17.330) + CS/SDR CLT (R$ 6.500) + overhead com cloud/API/marketing R$ 8.000 = **R$ 44.830/mês** ≈ R$ 45.000.
- Equilíbrio em licenças (contribuição da seção 7, em escala, 11% de imposto): R$ 149 → R$ 125 → **360 licenças**; R$ 199 → R$ 165 → **273** (com API: R$ 140 → 321); R$ 399 → R$ 340 → **132**.
- Capital até o equilíbrio: 20 novos clientes líquidos/mês (ambicioso para PME sem marca) → 273 em ~14 meses; burn acumulado ≈ 45.000 × 14 − 165 × 20 × (1+…+13) = 630.000 − 300.300 = R$ 330 mil + CAC 273 × R$ 1.500 = R$ 410 mil → **~R$ 740 mil** (sem churn). Com churn de 1,5%/mês, +15–20%. → **Inviável com R$ 100 mil**; exige investidor ou o fluxo do Cenário A.

**Cenário C — Híbrido (recomendado pela aritmética)** [E]
- Fase 1 (meses 1–8): Cenário A sem pró-labore; fundador constrói simulador interno (planilha → web) como ferramenta de entrega; 8–15 retainers.
- Fase 2 (meses 9–18): com 20–25 retainers (R$ 40–50 mil/mês; precisa do 2º analista, custo fixo ~R$ 36 mil), sobra R$ 5–12 mil/mês que, somados ao colchão, bancam um dev pleno a partir do mês ~12; o simulador vira produto "licença + horas" para os clientes de retainer (R$ 1.500 + R$ 199).
- Fase 3 (meses 18–30): canal contadores (revenda com desconto); meta 150–300 licenças; aí sim o SaaS cobre seu time.

**O que muda com 10, 100 e 1.000 clientes** [E]/[H]

| Escala | Consultoria/retainer | SaaS/híbrido | Gargalo dominante |
|---|---|---|---|
| **10 clientes** | 60 h/mês; fundador + sócio entregam; receita R$ 15–20 mil | Irrelevante (produto interno) | Vendas pelo fundador; dependência da assinatura técnica do sócio (CRC/OAB) |
| **100 clientes** | 600 h/mês → **6 analistas** (custo ≈ R$ 54 mil + 1 coordenador sênior R$ 12 mil) para R$ 150–200 mil de receita; margem operacional cai para 25–35%; qualidade exige revisão por pares e base de conhecimento | 100 licenças = R$ 20 mil/mês; 1 CS para 100–200 clientes [H]; onboarding padronizado | **Contratação e treinamento** de analistas (salário mediano sobe com a demanda da reforma), padronização de pareceres, **atualização normativa** (regulamentos IBS/CBS, Comitê Gestor, obrigações acessórias) consumindo 10–15% das horas [H] |
| **1.000 clientes** | 6.000 h/mês → **~60 analistas** (folha ≈ R$ 550–650 mil/mês); impraticável sem virar BPO; só viável com produto que reduza as horas por cliente para < 1 h/mês | 1.000 × R$ 199 = R$ 199 mil/mês; 4–6 CS; suporte em camadas; infra ~R$ 8–10 mil; API fiscal R$ 25–30 mil se ingerir documentos; tributo sobe para Anexo III 4ª–5ª faixa (16–21% nominal; ~14–17% efetivo) ou migração para Lucro Presumido/Real (13,3–16,3%) | **Suporte e churn**: 1,5%/mês = 15 cancelamentos/mês a repor; **qualidade do motor de cálculo** (erro sistêmico atinge todos de uma vez — risco de responsabilidade civil); **tributação**: acima de R$ 4,8 mi/ano sai do Simples |

- [E] Prazo até a primeira venda: com rede de contadores já aquecida, 30–60 dias (workshop → diagnóstico pago); do zero, 60–120 dias [H]. O e-CNPJ, contabilidade e cobrança se resolvem em 1–2 semanas; o site/marca em 2–4 semanas.
- [H] Sem CRC/OAB o fundador não pode assinar laudos contábeis nem pareceres jurídicos; o sócio técnico é condição de existência do serviço (ou contratar um responsável técnico PJ — o que reabre o risco do Tema 1389 se houver subordinação).

### Gaps
- Valores do INPI (pedido de marca eletrônico com/sem desconto) não extraídos — a tabela está em PDF; confirmar em gov.br/inpi.
- Preço do Omie e de ferramentas de help desk/suporte não verificados.
- Produtividade real (h/cliente/mês) de retainers de reforma: hipótese de 6 h sem fonte; calibrar nos primeiros 5 clientes com timesheet.

---

## 9. Capital de giro: prazos de recebimento, inadimplência B2B PME (Serasa 2026)

### Takeaway
A inadimplência empresarial está em **recorde histórico**: 9,3 milhões de CNPJs negativados em agosto/2026 (+14,3% a/a), **94,6% deles micro e pequenas empresas**, com dívida média de R$ 23,9 mil por MPE e **serviços = 56% dos inadimplentes**. O público-alvo (PME de serviços e comércio) é exatamente o mais inadimplente; isso impõe cobrança antecipada ou recorrente automática (Pix/cartão) e provisão para perdas. Não encontrei estatística pública de prazo médio de recebimento B2B para PMEs no Brasil em 2026; a prática de boleto 30 dias com "prazo realizado" de ~50 dias aparece só em fonte comercial.

### Cited Findings
- [F] Serasa Experian, agosto/2026 (publicado 20/10/2026): **9,3 milhões de empresas inadimplentes** (+14,3% a/a), 68,2 milhões de dívidas somando **R$ 244,4 bilhões**; **MPEs = 8,8 milhões** (R$ 211,0 bi); dívida média R$ 26.355 (MPE **R$ 23.903**); setor das inadimplentes: **serviços 56,0%, comércio 32,0%, indústria 8,0%**; origem das dívidas: serviços 31,7%, bancos/cartões 19,7%, cooperativas 8,5%, utilities 6,7%, telecom 6,2%; credores não financeiros = 75,6% — [Serasa Experian](https://www.serasaexperian.com.br/sala-de-imprensa/indicadores/novo-recorde-inadimplencia-das-empresas-chegou-a-93-milhoes-em-agosto-revela-serasa-experian/)
- [F] Trajetória 2026: jan 8,7 mi (R$ 201,7 bi) → fev 8,8 mi → mar 8,9 mi → abr 9,0 mi (primeiro na série) → jun 9,1 mi (R$ 232,9 bi) → jul 9,2 mi (R$ 238,6 bi) → ago 9,3 mi; Serasa avalia que os cortes da Selic ainda não reverteram a tendência — [Serasa jul/2026](https://www.serasaexperian.com.br/sala-de-imprensa/indicadores/inadimplencia-chegou-a-9-milhoes-de-empresas-em-julho-e-dividas-somaram-238-bilhoes-revela-serasa-experian/); [Serasa jan/2026](https://www.serasaexperian.com.br/sala-de-imprensa/indicadores/inadimplencia-das-empresas-cai-em-janeiro-e-atinge-87-milhoes-de-cnpjs-revela-serasa-experian/); [Poder360](https://www.poder360.com.br/poder-economia/inadimplencia-bate-recorde-e-chega-a-93-milhoes-de-empresas/)
- [F] Em maio/2025 eram 7,3 milhões de empresas com R$ ~170 bi — ou seja, +2 milhões de CNPJs negativados em 15 meses — [Serasa mai/2025](https://www.serasaexperian.com.br/sala-de-imprensa/indicadores/inadimplencia-bate-recorde-no-brasil-com-73-milhoes-de-empresas-que-somam-dividas-de-quase-rdollar-170-bilhoes-aponta-serasa-experian/)
- [F] Fonte comercial (antecipação de recebíveis): exemplo de "prazo concedido de 30 dias, prazo realizado de 52 dias por atraso recorrente"; causas: erro de NF, divergência pedido/faturamento, aprovação documental — [Antecipa Fácil](https://antecipafacil.com.br/artigo/prazo-medio-alto-como-identificar-e-corrigir-no-b2b-x5cdwl) (ilustrativo, não estatístico)
- [F] Antecipação de recebíveis no Asaas: até 2 dias úteis (cartão) e 3 (boleto), taxas não publicadas — [Asaas](https://blog.asaas.com/taxas-asaas/)
- [F] Split payment muda o capital de giro dos clientes: "o crédito só nasce após o pagamento do fornecedor, alterando capital de giro, caixa e margens" — [Robert Half PDF](https://www.roberthalf.com/content/dam/roberthalf/documents/br/pt/indexed/2025-reforma-tributaria-h2-rhi-br-por.pdf)

### Inferences
- [H] Prazos de recebimento a planejar (prática de mercado; sem estatística pública localizada): PME — à vista/Pix ou boleto 7–30 dias; retainer cobrado no início do mês; diagnóstico com **50% na assinatura e 50% na entrega**; média empresa — 30–60 dias após NF, com compras/jurídico adicionando 15–30 dias ao ciclo; governo — 30–90+ dias (fora do foco).
- [E] Necessidade de capital de giro no Cenário A em regime (15 retainers, R$ 30 mil/mês faturados): com DSO efetivo de 45 dias [H], contas a receber ≈ 30.000 × 45/30 = **R$ 45 mil** permanentemente financiados pela empresa; com Pix recorrente no dia 1 (DSO ~5 dias), cai para ~R$ 5 mil. A diferença (R$ 40 mil) é quase metade do capital inicial — a política de cobrança é decisão de sobrevivência.
- [E] Provisão para perdas: dado o perfil (serviços = 56% dos inadimplentes; 94,6% MPE), provisionar **3–5% da receita** de PME [H] e exigir cartão/Pix recorrente ou pré-pagamento semestral com desconto (como fazem Conta Azul e Bling: até 38% de desconto no anual). Ticket de software baixo (R$ 199) não justifica cobrança ativa; a suspensão automática do acesso é o mecanismo.
- [E] Caixa mínimo de segurança: 2–3 meses de custo fixo (R$ 28–42 mil sem pró-labore; R$ 54–81 mil com) — o que, somado ao déficit até o equilíbrio (R$ 54 mil no cenário sem pró-labore), consome praticamente todo o capital de R$ 100 mil. Não há folga para SaaS na fase 1.

### Gaps
- Estatística de prazo médio de pagamento B2B no Brasil (Atradius Payment Practices Barometer não tem edição Brasil recente acessível; Serasa não publica DSO). Como obter: Serasa "Indicador de Atraso de Pagamento PJ"; Boa Vista/Equifax; Banco Central (inadimplência de crédito PJ, não comercial); pesquisas da CNDL/SPC.
- Taxa de inadimplência específica de honorários contábeis/consultoria (quanto do faturado não é recebido): sem fonte; Sescon-SP tem pesquisas sobre atraso de clientes de escritórios — não acessadas.
- Taxas de antecipação de recebíveis em 2026 (custo de financiar o prazo): não publicadas nas páginas acessadas.

---

## Síntese para o redator (ligações entre as seções)

- **Custo da hora** (seções 1–2): analista fiscal pleno R$ 6.000 → custo total R$ 9.046 no Simples → **R$ 90–120/h faturável**. **Preço da hora** (seção 4): R$ 150–500. **Spread** de 1,7–4x — a economia da consultoria funciona; o problema é escala, não margem.
- **Ticket que o mercado aceita** (seção 4): retainer PME R$ 500–2.000 (ancorado no honorário contábil de R$ 250–1.500); diagnóstico R$ 2–15 mil; licença SaaS R$ 150–400.
- **Equilíbrio** (seção 8): 8 retainers de R$ 2 mil (sem pró-labore) ou 15 (com); 270–360 licenças para o time de SaaS. **Capital** (seções 8–9): R$ 100 mil suportam só o caminho serviço-primeiro com sócios sem pró-labore por ~6 meses e cobrança via Pix recorrente.
- **Retenção e CAC** (seções 5–6): o SaaS só vale se churn ≤ 1,5%/mês e CAC ≤ R$ 2 mil — i.e., canal contador. Revenda com desconto preserva margem melhor que comissão de 20–30%.
- **Risco regulatório trabalhista** (seção 2): com o Tema 1389 pendente, contratar o responsável técnico como PJ subordinado é o maior risco oculto do modelo; a solução é sócio com equity.
- **Riscos de dado**: muitos benchmarks de CAC/churn são globais (EUA) e de agregadores sem fonte; os dados brasileiros de salário têm viés (CAGED para baixo, Robert Half para cima). Tudo o que está marcado [H] deve ser calibrado nos primeiros 90 dias de operação.
