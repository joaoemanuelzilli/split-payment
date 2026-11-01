# 07 — Advogado do diabo: contra-evidências, precedentes e critérios de parada

**Tese sob ataque:** uma nova empresa brasileira (consultoria primeiro, software depois), fundada por perfil de tecnologia sem CRC/OAB, com ~R$ 100 mil, em cidade média, consegue capturar com lucro a demanda de PMEs criada pela reforma do consumo (IBS/CBS 2026–2033, split payment).

**Data de referência: 1 de novembro de 2026.** Todos os links foram acessados em 2026-11-01. Legenda: **[F]** fato com fonte; **[E]** estimativa (conta mostrada); **[H]** hipótese/opinião sem evidência verificada.

**Nota metodológica (leia antes).** A coleta foi feita por cinco pesquisadores paralelos + verificações diretas. O orçamento de busca web da sessão esgotou-se no meio do trabalho; parte das lacunas abaixo é "não consegui verificar nesta sessão", não "não existe". Onde um pesquisador recorreu à memória, o item está marcado **[H] não verificado**. Nenhum nome, data ou valor foi inventado. Divergências entre fontes estão registradas no corpo do texto.

---

## Q1. Precedentes brasileiros de ondas de compliance: o que aconteceu com a demanda por consultoria e software

### Takeaway
Em seis ondas regulatórias brasileiras (SPED/NF-e, eSocial, Reinf/DCTFWeb, LGPD, Lei Anticorrupção, Pix/Open Finance), **nenhum caso verificável de consultoria nascida na onda e vendendo direto a PME escalou ou teve saída documentada**. Quem capturou valor foi software com receita recorrente e canal (Arquivei, Tecnospeed, Migrate, Synchro), consolidadores (TOTVS, Thomson Reuters, Sovos, Visma, Celcoin) e incumbentes com distribuição (bancos no Open Finance; folhas no eSocial). A PME entrou por último em cada onda, quando o preço já era commodity, e a adoção voluntária de PMEs estagnou em 15% (compliance) e 27–31% (LGPD). O regulador tende a **afrouxar para PME** e **fechar para startups** (capital mínimo de ITP de R$ 1 mi → R$ 17 mi). A janela útil de "hype" ficou em ~3 anos; a janela de obrigatoriedade escalonada em ~8 anos, parecida com 2026–2033.

### Cited Findings

**Tabela-resumo [E] (síntese dos achados abaixo)**

| Onda | Janela de demanda | Quem capturou valor | Virou commodity? | Nasceram e sumiram / foram absorvidas | Nasceram e prosperaram (por quê) |
|---|---|---|---|---|---|
| SPED/NF-e (2006–2014) | ~8 anos escalonados por porte; PME em 2010 (NF-e) e 2014 (SPED) | ERPs/consolidadores (TOTVS), casas fiscais (Synchro, Mastersaf→TR, Taxweb→Sovos), plataformas sobre o XML (Arquivei, Migrate, Tecnospeed) | Sim: emissão ilimitada por R$ 60/mês hoje | Easy-Way (domínio não resolve; destino não verificado); Mastersaf e Taxweb absorvidas por estrangeiros | Arquivei (2014, pós-onda, R$ 260 mi em 2021 — dado novo + SaaS); Tecnospeed (API para 2,5 mil software houses, +27%/ano); Migrate (130 mil empresas) |
| eSocial (2014–2023) | ≥10 atos de cronograma; folha do Simples atrasou ~34 meses | Folhas e sistemas contábeis incumbentes; contador | Sim (feature de folha) | Não encontrei destino documentado de consultorias "eSocial" (lacuna) | Nenhum novo entrante dominante identificado |
| EFD-Reinf/DCTFWeb (2018–2025) | Carona do eSocial | Módulos de Synchro/Mastersaf/Domínio/ERPs | Sim | — | — |
| Lei Anticorrupção (2013–2018) | ~4 anos, só grandes e fornecedores do Estado | Big 4/escritórios [H]; Sebrae comoditizou a base com plataforma gratuita | Sim para PME desde o início | Não encontrei fechamentos documentados | — |
| LGPD (2018–2022) | ~3 anos de hype (2019–2021) | Escritórios estabelecidos; privacytechs B2B vendidas no pico (Privally→Tivit) ou via canal (Privacy Tools via Logicalis) | Sim: 80% das bancas vendiam o mesmo; DPO externo a partir de R$ 1,5 mil/mês | Não encontrei fechamentos documentados (lacuna); Dataguide/LGPD Now destino não verificado | Privally (SaaS, saída em 2 anos); Privacy Tools (canal) |
| Pix/Open Finance (2020–2026) | ~3 anos até consolidação; fechamento regulatório em 2026 | Bancos, big fintechs, Celcoin/BTG; infra B2B (Belvo, Pluggy, Klavi, Iniciador) | Agregação de dados virou API de prateleira | Quanto Network "dormente, buscando venda ou liquidação" (2024); licenças canceladas (Zapay, For You), Sebrae-SCD desistiu | Belvo (US$ 43 mi), Klavi (CIP/Vivo no captable), Celcoin (comprou 3) |

**(a) SPED e NF-e**
- [F] SPED instituído pelo Decreto 6.022/2007; 2008 teste; 2009 lucro real; 2014 lucro presumido — [Wikipedia pt – SPED](https://pt.wikipedia.org/wiki/Sistema_P%C3%BAblico_de_Escritura%C3%A7%C3%A3o_Digital).
- [F] NF-e: primeiras notas com validade em 15/09/2006; 2008 "12.000 maiores empresas"; Protocolo ICMS 42/09 ampliou até fim de 2010 para "todos os portes, inclusive Simples"; 3 migrações obrigatórias de leiaute (2.00 em 2011, 3.10 em 2015, 4.00 em 2018) — [Wikipedia pt – NF-e](https://pt.wikipedia.org/wiki/Nota_fiscal_eletr%C3%B4nica).
- [F] Consolidação de ERPs na véspera da onda: TOTVS comprou Logocenter (2005, R$ 380 mi), RM Sistemas (R$ 164,8 mi) e Datasul (2008, ~R$ 700 mi); depois Linx (2025, R$ 3,05 bi) — [Wikipedia pt – TOTVS](https://pt.wikipedia.org/wiki/TOTVS). Sonda comprou a Procwork em 2007 por US$ 118 mi — [Wikipedia pt – Procwork](https://pt.wikipedia.org/wiki/Procwork).
- [F] Taxweb: o domínio taxweb.com.br redireciona (HTTP 301) para sovos.com/pt-br — marca absorvida pela Sovos; data/valor **não encontrados** (busca esgotada; página de press releases da Sovos só mostra 2026) — [Sovos press releases](https://sovos.com/press-releases/).
- [F] Mastersaf hoje é "ONESOURCE Mastersaf" (Thomson Reuters), "mais de 1400 clientes", "mais de 10 anos acompanhando o projeto SPED" — [TR](https://www.thomsonreuters.com.br/pt/tax-accounting/onesource-mastersaf.html). [H] Aquisição em 2011 — de memória, **não verificada** (URL de notícia testada retornou 404).
- [F] Synchro (independente desde 1991, "sem aporte de capital"): ~400 grupos, 44 mil estabelecimentos, 420 funcionários; NF-e Manager em 2007; já tem página de Reforma Tributária — [Synchro](https://www.synchro.com.br/empresa).
- [F] Easy-Way: domínios easy-way.com.br não resolvem (DNS) em 2026-11-01; destino **não encontrado**.
- [F] Arquivei → Qive: fundada em 2014 (NF-e já universal); 5 mil clientes em 2017; +210 mil CNPJs em 2022; R$ 260 mi liderados pela Riverwood (2021); rebranding 2024 — [Qive](https://qive.com.br/sobre).
- [F] Tecnospeed (Maringá): atende >2,5 mil software houses (~25% do mercado), impacta >600 mil estabelecimentos, cresceu 27%/ano por 4 anos, >260 funcionários; comprou a Decision IT (SPED para grandes) em 18/07/2024 — [Baguete](https://www.baguete.com.br/noticias/grupo-tecnospeed-compra-decision-it); modelo de APIs para software houses, clientes TOTVS, IOB, Contabilizei — [Tecnospeed](https://www.tecnospeed.com.br/).
- [F] Migrate (InvoiCy): +130 mil empresas ativas, ~130 mi documentos/mês; já vende "Apuração Assistida" — [Migrate](https://www.migrate.info/).
- [F] Preço da emissão hoje: Bling Cobalto **R$ 60/mês** com notas ilimitadas (NF-e/NFC-e/NFS-e) — [Bling planos](https://www.bling.com.br/planos). Contabilidade online: Contabilizei a partir de **R$ 195/mês**, +100 mil clientes — [Contabilizei](https://www.contabilizei.com.br/).
- [F] Contabilizei: fundada 2013; Kaszek 2015; R$ 75 mi (Point72, 2019); R$ 320 mi (SoftBank/Goldman); secundária Warburg Pincus ~R$ 700 mi (out/2024); conflito com CRCs por preço e automação, CRC-PR concluiu regularidade em 2015 — [Wikipedia pt – Contabilizei](https://pt.wikipedia.org/wiki/Contabilizei) (verbete com alerta de neutralidade).

**(b) eSocial**
- [F] Decreto 8.373/2014; previa obrigatoriedade para todas as empresas no 2º semestre de 2018 — [Wikipedia pt – eSocial](https://pt.wikipedia.org/wiki/ESocial).
- [F] Normas de cronograma: Res. CDES 1/2015, 2/2016, 3/2017, 4/2018, 5/2018; Portarias 716/2019 e 1.419/2019; PC 76/2020; PC 71/2021; PC 2/2022 — [E] **≥10 atos em 7 anos** — [gov.br eSocial – Legislação](https://www.gov.br/esocial/pt-br/centrais-de-conteudo/legislacao/empresas).
- [F] Cronograma final: Grupo 3 (Simples) folha em **10/05/2021**, SST em 10/01/2022 — [gov.br eSocial – Cronograma](https://www.gov.br/esocial/pt-br/acesso-ao-sistema/cronograma-de-implantacao). [E] Atraso para a PME típica: jul/2018 → mai/2021 ≈ **34 meses**.
- [F] Leiaute ainda muda em 2026 (S-1.3 NT 07/2026, revisões 24/09 e 20/10/2026) — [gov.br eSocial – Notícias](https://www.gov.br/esocial/pt-br/noticias).
- [F] Consolidação de HR tech por ERP: TOTVS comprou Feedz (2022) e Ahgora (2023, R$ 380 mi) — Wikipedia TOTVS (acima). Domínio/TR atende "mais de 30 mil escritórios contábeis" — [Domínio](https://www.dominiosistemas.com.br/visao-geral).
- Consultorias "eSocial" que fecharam/pivotaram: **não encontrei evidência** (busca esgotada).

**(c) EFD-Reinf / DCTFWeb**
- [F] DCTFWeb substituiu a GFIP por grupo entre ago/2018 e out/2022; MIT (JSON 1.0) retificado em 2025 — [Receita – DCTFWeb](https://www.gov.br/receitafederal/pt-br/assuntos/orientacao-tributaria/declaracoes-e-demonstrativos/DCTFWeb). Sem mercado próprio visível; módulos de Synchro e similares.

**(d) LGPD**
- [F] ICTS Protiviti (dez/2020, n=296): 82% atrasadas; grandes 50,2% mais preparadas que MPEs — [Convergência Digital](https://convergenciadigital.com.br/?p=18525).
- [F] Sebrae/SC (2021, n=810): **31% adequados** — [ASN](https://agenciasebrae.com.br/?p=3169). Sebrae Minas (2022, n=1.880): **27% adequadas**; 57% não adequaram por falta de conhecimento — [Diário do Comércio](https://diariodocomercio.com.br/legislacao/adesao-de-mpes-a-lgpd-e-baixa-em-mg/).
- [F] Hype de oferta: "cerca de 80% das bancas jurídicas já oferecem" adequação (2021) — [Análise](https://analise.com/noticias/quase-oito-em-cada-dez-escritorios-de-advocacia-ja-oferecem-servicos-de-adequacao-a-lgpd); previsão de "50 mil vagas" — [Convergência Digital](https://convergenciadigital.com.br/carreira/lgpd-expectativa-de-gerao-de-50-mil-vagas-para-advogados-orientados-a-ti).
- [F] Saídas no pico: Privally (2018, 14 funcionários) → Tivit, 02/12/2020 — [Baguete](https://www.baguete.com.br/noticias/tivit-compra-startup-de-seguranca); Privacy Tools via Logicalis (parceria de revenda, 03/08/2021) — [Baguete](https://www.baguete.com.br/noticias/logicalis-vai-vender-privacy-tools).
- [F] Regulador afrouxou para PME: ANPD dispensou agentes de pequeno porte de indicar encarregado (consulta → Res. CD/ANPD 2/2022) — [Fenacon](https://fenacon.org.br/noticias/anpd-coloca-em-consulta-regras-de-tratamento-de-dados-para-microempresas-e-empresas-de-pequeno-porte/).
- [F] Preço atual DPO as a Service: PME R$ 1.500–4.000/mês (fonte = fornecedor) — [Confidata](https://confidata.com.br/blog/dpo-interno-vs-externo-dpo-as-a-service).
- Fechamentos de consultorias LGPD e série de preços 2020 vs 2023: **não encontrei evidência**.

**(e) Lei Anticorrupção**
- [F] Sebrae (n=2.000 MPEs, divulgada 10/01/2019): **15%** têm programa de integridade; **65% não sabiam** que grandes/governo exigem; plataforma gratuita "Compliance PME" lançada fim de 2017 — [Contadores.cnt.br](https://www.contadores.cnt.br/projetos/59/noticias/empresariais/2019/01/10/etica-nos-negocios-e-exigencia-para-conquistar-mercado.html).
- [F] Decreto 8.420/2015 reduziu formalidades para ME/EPP — [Jus](https://jus.com.br/artigos/44260/programa-de-integridade-nas-microempresas-e-empresas-de-pequeno-porte).
- [F] PMEs resistem por custo; CGU oferece material gratuito (LEC, 2024) — [LEC](https://lec.com.br/compliance-por-pequenas-e-medias-empresas-quando-a-estrutura-e-o-apetite-financeiro-desafiam-os-programas-de-integridade).

**(f) Pix / Open Finance**
- [F] ITP: R$ 139,6 mi (dez/2023) → R$ 3,2 bi (2024) → R$ 8,3 bi (jan–set/2025); 57 ITPs aptos em out/2025, lista dominada por bancos/big fintechs; inclui **Omie** (ERP de PME) — [Finsiders](https://finsidersbrasil.com.br/?p=348833) e [Finsiders 2024](https://finsidersbrasil.com.br/economia-open/transacoes-via-iniciacao-de-pagamento-crescem-5x-em-um-ano).
- [F] Cancelamento/venda de licenças (set/2024): Zapay, For You; Sebrae desistiu da SCD; **Quanto Network "em estado dormente, buscando opções de venda ou liquidação"** — [Finsiders](https://finsidersbrasil.com.br/reportagem-exclusiva-fintechs/cresce-cancelamento-e-venda-de-licencas-por-fintechs).
- [F] Capital mínimo de ITP **R$ 1 mi → R$ 17 mi**, piso de PL R$ 30 mi (2026): "Uma startup... não vai imobilizar R$ 30 milhões" — [Finsiders, 28/05/2026](https://finsidersbrasil.com.br/?p=368293).
- [F] Celcoin (BTG) comprou Finansystech, 3ª aquisição — [NeoFeed](https://neofeed.com.br/startups/o-ma-do-open-finance-celcoin-investida-do-btg-compra-finansystech/). Belvo Série A US$ 43 mi — [Finsiders](https://finsidersbrasil.com.br/noticias-sobre-fintechs/belvo-capta-us-43-milhoes-na-maior-serie-a-em-fintech-na-america-latina).

**(g) Custo de conformidade (contexto)**
- [F] Doing Business 2020: Brasil **1.501 h/ano** para cumprir obrigações; OCDE 158,8 h; LAC 317,1 h; rank Paying Taxes 184 — [DB2020 Brazil PDF](https://archive.doingbusiness.org/content/dam/doingBusiness/country/b/brazil/BRA.pdf). [E] 9,45x a OCDE. [H] Série histórica (~2.600 h em 2008–2012) de memória, **não verificada**.
- [F] IBPT (27/10/2026): 8,62 mi de normas desde 1988, 569.469 tributárias, >40/dia — [IBPT](https://ibpt.org.br/brasil-editou-862-milhoes-de-normas-desde-1988-quase-7-sao-tributarias/).

### Inferences
- [E] "Stack de conformidade" de uma PME hoje: contador online R$ 195–245/mês + ERP R$ 60/mês ≈ **R$ 255–305/mês**. Qualquer oferta nova de reforma compete contra essa âncora para o Simples.
- [E] Padrão de tempo: o hype dura ~3 anos; saídas (Privally, Privacy Tools, Celcoin comprando) ocorrem no pico, antes da obrigação "pegar" para PME. Para IBS/CBS, o pico de dúvida provável é dez/2026–2027 (CBS plena, alíquota fixada só em dez/2026); quem quiser vender ou virar fornecedor de incumbente precisa fazê-lo até ~2028 [H].
- [H] Diferença decisiva entre ondas: NF-e criou um **dado novo público** (XML circulando) capturável por terceiros (Arquivei); eSocial não (a folha já era do incumbente). IBS/CBS cria dados novos (apuração assistida, fluxos de split, crédito por fornecedor) — favorece a tese, **se** o entrante tiver acesso ao dado (procuração e-CAC, API da plataforma).
- [H] Em todas as ondas o setor público/associativo comoditizou a camada básica para PME (Compliance PME, cartilhas CGU, Sebrae LGPD). Esperar o mesmo (já em curso: Sebrae, Calculadora RTC, CFC/Fenacon).

### Gaps
- Datas/valores das aquisições Mastersaf→TR e Taxweb→Sovos; destino de Easy-Way, Sispro, Sieg; notícias datadas de "boom de consultoria SPED" e queda de preços 2008–2012.
- Nomes e destino de consultorias eSocial/LGPD/compliance que fecharam — nenhuma encontrada em nenhuma onda (possível viés: fechamentos B2B pequenos não saem na imprensa).
- Pesquisas Fenacon/CFC/Sebrae de honorários por porte (série histórica).

---

## Q2. Argumento 1 — "O contador já é o canal natural e vai absorver a demanda das PMEs sem pagar a terceiros"

### Takeaway
**Probabilidade de que o canal contábil absorva a maior parte da demanda PME sem remunerar um terceiro: [E] ~65%.** A demanda já chegou ao contador (68% procurados), as entidades estão capacitando em massa e o maior sistema contábil (Domínio/TR, 250 mil contadores conectados) está armando o contador para vender consultoria e reprecificar honorários. Mas só 5% têm estratégia estruturada e 61–63% não mapearam a carteira — há um vácuo real **hoje**, que tende a se fechar ao longo de 2027.

### Cited Findings
- [F] Sondagem Omie/Fenacon/SESCONs (abr–mai/2026, **n=149**): 56% em estágio inicial; **5% com estratégia estruturada**; **68% já procurados por clientes**; 70% esperam ganhar peso consultivo — [CartaCapital, 13/07/2026](https://www.cartacapital.com.br/do-micro-ao-macro/contadores-reforma-tributaria-pesquisa/); [Fenacon](https://fenacon.org.br/reforma-tributaria/contadores-ja-sentem-impacto-da-reforma-tributaria-mas-maioria-ainda-nao-tem-plano/).
- [F] Pesquisa IOB (mai–jul/2025, n=347): 58% não prontos — [Fenacon](https://fenacon.org.br/reforma-tributaria/contadores-admitem-falta-de-preparo-para-a-reforma-tributaria-aponta-pesquisa-da-iob/).
- [F] Omie + Portal Contábeis (jan/2026, n=633 escritórios): 61% não mapearam impactos; **apenas 25% das PMEs foram procuradas pelo contador**; 58% dizem que o maior obstáculo é "fazer o cliente perceber valor" — [AmdJus](https://amdjus.com.br/impacto-da-reforma-tributaria-prejuizos-para-contadores-e-oportunidades-em-declinio/). Omie (19/10/2026): 63% não mapearam; **só 17% dos gestores de PME esperam que o contador lidere** revisão de preços — [Omie](https://www.omie.com.br/blog/reforma-tributaria-precificacao-oportunidade-contadores/index.md).
- [F] CFC + Fenacon + RFB: capacitação de 40 h ministrada pela Receita (abr/2026) — [CRC-MA](https://crcma.org.br/noticias/cfc-fenacon-e-receita-federal-consolidam-parceria-para-capacitar-contadores-na-implementacao-da-reforma-tributaria); "Reforma Tributária pelo Brasil": 41 encontros até dez/2026, meta ~10 mil profissionais — [Contábeis](https://www.contabeis.com.br/noticias/79961/reforma-tributaria-fenacon-e-cfc-farao-41-encontros/).
- [F] Domínio (TR), 22/10/2026: "Módulo Reforma Tributária" com Calculadora, Planejador, assistente de IA (TRIA), Classificador cClassTrib; recomenda ao contador **vender consultoria** e **reprecificar honorários** — [Domínio](https://www.dominiosistemas.com.br/blog/reforma-tributaria-para-contadores/). TR: "mais de 250 mil contadores" conectados; Domínio BPO e Domínio AI lançados (Forbes, 08/10/2026) — [Forbes](https://forbes.com.br/forbes-money/2026/10/a-reforma-tributaria-muda-radicalmente-a-forma-de-trabalhar-diz-vp-da-thomson-reuters/).
- [F] Precificação já praticada por contadores (evento 25/09/2026): diagnóstico **R$ 2 mil–15 mil**, consultoria **R$ 1.500–3.700/mês**; estratégia sugerida: 85% da carteira via reajuste de honorário — [Portal da Reforma Tributária](https://www.reformatributaria.com/iva/contadores-buscam-novas-formas-de-monetizar-e-precificar-servicos-com-a-reforma-tributaria/).
- [F] Alterdata, Fortes, Sage, Questor, Prosoft: **não encontrei evidência** (busca esgotada).

### Inferences
- [E] 0,68 × 0,95 ≈ **65% dos escritórios recebem demanda sem plano** (n=149, ±8 p.p.). Isso é o espaço do terceiro — mas a Domínio está dizendo ao contador para ocupá-lo, e a evidência histórica (eSocial) mostra que o contador absorve a parte operacional.
- [H] O que o contador tende a absorver: cClassTrib, parametrização, conferência da apuração assistida. O que ele tende a não fazer sozinho: simulação de margem/preço, decisão Simples × regime regular/híbrido, caixa sob split. Esse é o único espaço plausível, e ele é melhor atacado **via** o contador (white label) do que contra ele.
- **O que refutaria o argumento:** em 20 escritórios da cidade-alvo, pedir o preço cobrado por "diagnóstico de reforma" e quantos venderam em 2026; se a resposta for "embutido/nenhum", o canal não monetiza e pode querer um parceiro. Pré-venda de pacote white label com conversão > 10% em 30 escritórios.

### Gaps
- Quantos escritórios cobram adicional vs. embutem; dados de Alterdata/Fortes/Sage.

---

## Q3. Argumento 2 — "O Estado dá a solução de graça"

### Takeaway
**Probabilidade de que a oferta estatal gratuita elimine o produto "cálculo/apuração" para PME: [E] ~85%. De que elimine a demanda por "decisão e implementação": [E] ~30%.** O Estado entrega motor oficial de cálculo em código aberto, apuração assistida (beta 2026, definitiva em 2027 para regime regular), APIs gratuitas gradativas e capacitação Sebrae com mentoria individual. Mas não há API pública online (exige Docker/JAR local), o motor não cobre DeRE/imóveis/combustíveis/cashback, a AA não trata devoluções nem split, Simples/MEI ficam fora da AA e o Sebrae alcança uma fração ínfima do universo.

### Cited Findings
- [F] Manual Plataforma da CBS (RFB, maio/2026): Ambiente Beta de 13/01/2026 a dez/2026; "sistema definitivo a partir de 2027"; DF-e "automaticamente carregados... tratados pela Apuração Assistida"; AA exclusiva para CNPJ; Calculadora = "motor de cálculo oficial... código-fonte aberto... executado localmente"; **"Não há APIs públicas para cálculo online"**; AA "ainda não tratará de cancelamento/devolução"; conta de split "não terá informações" — [PDF RFB](https://www.gov.br/receitafederal/pt-br/centrais-de-conteudo/publicacoes/manuais/reforma-tributaria-do-consumo/manual-plataforma-cbs-21-maio-2026-07h40.pdf); documentação em [piloto-cbs.tributos.gov.br](https://piloto-cbs.tributos.gov.br/servico/calculadora-consumo/calculadora/documentacao).
- [F] Fora do motor oficial: DeRE, imóveis, monofasia de combustíveis, cashback (síntese de terceiro sobre documentação RFB, 28/10/2026) — [BuscadorNCM](https://buscadorncm.com.br/reforma/calculadora-oficial).
- [F] Base legal: art. 46 LC 214/2025 ("poderão apresentar"); AA em produção para regime regular em jan/2027; Simples/MEI fora; Decreto 12.955/2026 (CBS) e Res. CGIBS 6/2026 (IBS) — [Contábeis, 29/05/2026](https://www.contabeis.com.br/artigos/77062/apuracao-assistida-do-ibs-e-da-cbs-por-que-o-contador-deixa-de-ser-calculador-e-passa-a-ser-auditor-do-fisco/); [Contábeis 73410](https://www.contabeis.com.br/noticias/73410/reforma-tributaria-como-funcionara-a-apuracao-assistida/). Divergência: data do decreto 29/04 (manual) vs 30/04 (artigo).
- [F] Piloto: RTC-CBS (Portaria RFB 549/2025, até 31/12/2026); piloto IBS desde 05/01/2026, **134 empresas** (123 + 11; divergência), sem autocandidatura; split payment sem piloto formal, uso "facultativo e gradual em 2027" — [TaxUp](https://taxup.com.br/solucoes/reforma-tributaria/projeto-piloto/).
- [F] APIs de consulta de débitos/créditos da CBS com beta/produção restrita a partir de out/2026 (blog de integrador) — [Weepulse](https://weepulse.com.br/blog/apuracao-assistida-ibs-cbs-protheus/).
- [F] Sebrae "Up Digital Tributação": gratuito, 3 encontros + **2 mentorias individuais**, 2 mil vagas (24/08/2026) + 3 mil (08/09/2026) — [ContNews](https://www.portalcontnews.com.br/curso-gratuito-ajuda-pequenos-negocios-a-se-preparar-para-as-mudancas-da-reforma-tributaria/); "Descomplique: Reforma Tributária" com mentorias gratuitas e ferramentas de diagnóstico — [ASN, 02/09/2026](https://agenciasebrae.com.br/economia-e-politica/capacitacao-do-sebrae-simplifica-a-reforma-tributaria-para-pequenos-negocios/). Sebrae (13/10/2026): "volume de desinformação elevado" — [Correio Braziliense](https://www.correiobraziliense.com.br/economia/2026/10/7520137-sebrae-alerta-para-desafios-da-reforma-tributaria-aos-pequenos-negocios.html).
- [F] CRC-SP: livro gratuito sobre contabilização CBS/IBS — [CRC-SP PDF](https://www.crcsp.org.br/portal/publicacoes/livros/reforma-tributaria-contabilizacao-com-a-incidencia-da-cbs-e-ibs.pdf).
- [F] Chatbot oficial da Receita sobre reforma: **não encontrei evidência**.

### Inferences
- [E] Alcance Sebrae: 5 mil vagas iniciais; mesmo a 2,5 mil/quinzena, ~60 mil/ano vs. ~24 mi de pequenos negócios → cobertura < 1%. O Sebrae **não satura** a demanda, mas **ancora o preço de referência em zero** para educação básica.
- [H] O Estado resolve o "quanto devo", não o "o que faço com isso" (preço, margem, fornecedor, caixa, regime). Produtos de calculadora/apuração estão mortos como negócio; diagnóstico/decisão não.
- [H] "Sem API online" + Docker/JAR = brecha para perfil técnico (integrar o motor oficial a planilhas/ERPs de PMEs) — porém ERPs grandes vão embutir isso (Arg. 3).
- **O que refutaria:** 20 PMEs tentando usar o simulador oficial e a plataforma beta — se < 20% conseguem e saem sabendo o impacto no próprio preço, "de graça" ≠ "acessível". Disposição a pagar R$ 1–3 mil por "implantar a Calculadora oficial no meu ERP/planilha".

### Gaps
- Status "ao vivo" das APIs em 01/11/2026 (manual de maio diz disponíveis; TaxUp ago/2026 diz fora do piloto nesta fase); consultoria subsidiada Sebraetec específica para reforma.

---

## Q4. Argumento 3 — "ERPs e emissores embutem tudo; a PME não precisa de outro software"

### Takeaway
**Probabilidade de que um software standalone de "emitir/calcular IBS-CBS" para PME seja inviável: [E] ~85%. De que ERPs fechem também as brechas residuais (split, simulação de margem, decisão de regime) em 24 meses: [E] ~60%.** Conta Azul, Omie e Bling já embutem campos/cálculo sem cobrar adicional, a R$ 60–800/mês. O que ninguém executa ainda é o split payment (sem data, sem piloto formal) e a Receita suspendeu as rejeições em 01/08/2026 — a dor foi empurrada para 2027.

### Cited Findings
- [F] Conta Azul: "já emite NF-e e NFS-e com IBS e CBS automaticamente"; simulador gratuito; "diagnóstico de maturidade" gratuito; planos R$ 179,90–799,90/mês; split: "prepare... com conciliação automática" (não executa) — [Conta Azul reforma](https://contaazul.com/reforma-tributaria/), [planos](https://contaazul.com/planos/). Conta Azul foi comprada pela Visma (ago/2025) — [Finsiders](https://finsidersbrasil.com.br/negocios-em-fintechs/fusoes-e-aquisicoes/visma-compra-dootax-pag-util-brasil-de-olho-na-reforma-tributaria/).
- [F] Omie: tags IBS/CBS desde 21/08/2025; "IA Fiscal" desde 18/12/2025; split: grupo YC implementado, "não é exigido comercialmente em 2026"; **sem módulo de apuração geral descrito** — [Omie ajuda](https://ajuda.omie.com.br/pt-BR/articles/12062353-reforma-tributaria-cronograma-geral-de-atualizacoes).
- [F] Bling: R$ 60/mês notas ilimitadas; página de planos não menciona reforma — [Bling](https://www.bling.com.br/planos).
- [F] NT 2025.002 (Tecnospeed, 27/10/2026): Ato Conjunto RFB/CGIBS 4/2026 (31/07) criou cronograma escalonado; **Ato Técnico Conjunto 1/2026 (01/08/2026) suspendeu as rejeições** previstas para 03/08; regra de ausência do grupo IBSCBS adiada "sem data"; Simples/MEI obrigatórios a partir de jan/2027 — [Tecnospeed](https://blog.tecnospeed.com.br/nota-tecnica-reforma-tributaria-nfe-nfce/). IBPT alertava rejeição em 03/08 (20/07/2026) — [IBPT](https://ibpt.org.br/sua-nota-fiscal-pode-ser-rejeitada-em-3-de-agosto-entenda-por-que-sua-empresa-precisa-agir-agora/).
- [F] Receita (09/10/2026): "quase nove em cada dez documentos fiscais emitidos já registravam a CBS" — [Agência Senado, 26/10/2026](https://www12.senado.leg.br/noticias/materias/2026/10/26/reforma-tributaria-aliquota-da-cbs-avanca-nesta-semana).
- [F] Thomson Reuters ONESOURCE (corporativo): split no DFE Plus previsto out/2026; apuração CBS/IBS out–dez/2026; integração com AA "depende de APIs sem datas definidas" — [Roadmap TR](https://roadmap.thomsonreuters.com/reforma_2026.html).
- [F] TOTVS: posicionamento de reforma em toda a empresa; material sobre apuração assistida — [Portal RT](https://www.reformatributaria.com/tax-capital/reforma-tributaria-elevara-o-nivel-de-sofisticacao-das-operacoes-empresariais-diz-o-diretor-executivo-de-produtos-da-totvs/).
- [F] Grant Thornton + Ramo (SAP B1, 700 clientes): BPO fiscal para PMEs (ago/2025) — [Baguete](https://www.baguete.com.br/noticias/ramo-e-grant-thornton-oferta-foca-reforma-tributaria).

### Inferences
- [E] Um SaaS "de reforma" vendido à PME compete contra **R$ 0 incremental** dentro de um ERP de R$ 60–800/mês.
- [H] A suspensão das rejeições atrasou o mercado em 6–12 meses, não o eliminou. Split payment é o buraco mais claro — e é exatamente o que os ERPs vão fechar quando houver data.
- **O que refutaria:** em 20 PMEs com Bling/Omie/Conta Azul, checar NF-e de out/2026 — se > 50% têm grupo IBSCBS vazio/errado "com o ERP pronto", o software não resolve sem alguém configurar. Pré-venda de "parametrização cClassTrib + simulação de margem" a R$ 1,5–3 mil com conversão > 10%.

### Gaps
- Páginas de Tiny/Olist, Nuvem Fiscal (DNS falhou), Sankhya, Senior, Linx; preço do Omie (404); se ERPs cobram a mais.

---

## Q5. Argumento 4 — "Grandes e médias já contrataram Big 4; sobra a PME, que não paga consultoria"

### Takeaway
**Probabilidade de que a PME típica (Simples/Presumido pequeno) não pague ticket ≥ R$ 2 mil por consultoria de reforma em escala: [E] ~60%.** Não encontrei dado direto de disposição a pagar. Os proxies são ruins para a tese: 58% dos contadores dizem que o maior obstáculo é o cliente perceber valor; só 17% das PMEs esperam que o contador lidere; nas ondas anteriores a adoção voluntária de PME ficou em 15–31%. Os proxies bons: PME mal atendida (25% procuradas, 3% entendem sozinhas), vagas tax +138%, Visma comprando capacidade fiscal "para PME e middle market".

### Cited Findings
- [F] Vagas fiscais/tributárias +138,5% (1S25 vs 1S26, Assigna/Talenses) — [TAGD Law](https://tagdlaw.com.br/?p=16339). Robert Half (jul/2025, n=100): 53% das empresas devem contratar ≥3 pessoas; PMEs 2–4 vagas — [Fenacon](https://fenacon.org.br/reforma-tributaria/reforma-tributaria-impulsiona-contratacao-de-contadores-e-tributaristas/).
- [F] KPMG (out/2025, n=35): 51% sem plano; 72% sem orçamento — [KPMG](https://kpmg.com/br/pt/insights/2025/10/pesquisa-reforma-tributaria-consumo.html).
- [F] Omie/CNDL (fev/2025, n=285 líderes do Simples): 65% acreditam que serão afetadas; 26% não sabem avaliar; 75% dizem que o contador será essencial — [CNDL](https://cndl.org.br/varejosa/65-das-pequenas-empresas-preveem-impactos-da-reforma-tributaria/).
- [F] "Apenas 11% se consideram preparadas" (fonte primária não identificada) — [NetCPA](https://netcpa.com.br/colunas/reforma-tributaria-em-2026-empresas-enfrentam-desafios-apenas-11-se-consideram-preparadas/26626). Conta Azul: "83% não sabem por onde começar" (fonte não verificada).
- [F] Precedentes de adoção PME: 15% (compliance, 2017–18); 27–31% (LGPD, 2021–22) — ver Q1.
- [F] Visma: aquisições de Conta Azul (ago/2025), MaisMei (fev/2026), Dootax e Pag Útil (13/05/2026), "de olho na reforma tributária", mirando PME e middle market "onde os impactos tendem a ser mais intensos" — [Finsiders](https://finsidersbrasil.com.br/negocios-em-fintechs/fusoes-e-aquisicoes/visma-compra-dootax-pag-util-brasil-de-olho-na-reforma-tributaria/).
- Contratos nomeados de Big 4, faturamento tax, pesquisas Sebrae de gasto com consultoria, ticket médio de honorários: **não encontrei evidência** (busca esgotada).

### Inferences
- [E] Para recuperar R$ 100 mil com diagnósticos a R$ 2–15 mil são necessários 7–50 diagnósticos/ano; com consultoria recorrente a R$ 1.500/mês, ~6 clientes ativos pagam R$ 100 mil/ano. Só é viável com canal (contadores) ou recorrência — não com venda avulsa a PME.
- [H] A barreira declarada nas ondas anteriores foi "não sei o que é / não tenho apoio", não "é caro" — favorece canais de confiança (contador, ERP, banco) sobre consultoria nova.
- **O que refutaria:** 20–30 entrevistas com PMEs do Presumido/Simples B2B na cidade-alvo com orçamento declarado ≥ R$ 2 mil; conversão ≥ 10% em pré-venda paga.

### Gaps
- Disposição a pagar em R$; ticket de honorários; qualquer pesquisa Sebrae sobre gasto com consultoria.

---

## Q6. Argumento 5 — "A transição 2026–2028 afeta pouco quem está no Simples; chegar cedo queima caixa"

### Takeaway
**Probabilidade de que o argumento se sustente (universo pagante 2027–2028 restrito a ~15% dos CNPJs fora do Simples + Simples com vendas B2B): [E] ~80%.** 84% dos CNPJs estavam no Simples em 2024; para eles 2026 é informativo, 2027 traz CBS mas sem mudança no DAS salvo opção pelo regime híbrido, e o split payment começa opcional, B2B e sem data em 2027. A dor plena do Simples (ICMS/ISS → IBS) é 2029–2033.

### Cited Findings
- [F] 25,7 mi de empresas ativas (Mapa de Empresas, set/2026) — [gov.br](https://www.gov.br/empresas-e-negocios/pt-br/mapa-de-empresas). ~24 mi pequenos negócios (95%); 77,3% dos abertos em 2026 são MEI — [compilação com links ASN](https://viniensina.com.br/estatisticas-pequenos-negocios-brasil-2026/).
- [F] (2024, secundário) 21,6 mi ativas; **18,2 mi (84%) Simples; 2,1 mi Presumido; 1,1 mi Real** — [Jornal Contábil](https://www.jornalcontabil.com.br/noticia/brasil-atinge-216-milhoes-de-empresas-ativas-em-2024-simples-nacional-domina-84-do-mercado/amp/). Estoque oficial 2026 Simples/MEI: **não encontrado**.
- [F] Cronograma: 2026 testes sem cobrança; 2027 CBS e IS efetivos; IBS a partir de 2029; ICMS/ISS extintos em 2033 — [Agência Câmara, 06/01/2026](https://www.camara.leg.br/noticias/1237089-reforma-tributaria-comeca-fase-de-transicao-com-testes-de-novos-impostos-em-2026/).
- [F] Simples: opção pelo regime híbrido (IBS/CBS fora do DAS, crédito integral ao cliente PJ), alterável semestralmente; MEI sem mudança imediata; NF obrigatória para todas as operações em 2027 (fonte secundária) — [InfinitePay](https://www.infinitepay.io/blog/reforma-tributaria-pequenas-empresas). Janela de desenquadramento até 30/11/2026 e próxima em mar/2027 (Domínio, Q2).
- [F] Split payment: CGIBS (12/08/2026): "não estará disponível em janeiro de 2027"; 1ª etapa opcional e B2B — [Contábeis](https://www.contabeis.com.br/noticias/78723/split-payment-nao-comeca-em-janeiro-de-2027-entenda/); Fazenda (05/05/2026): facultativo em 2027 entre contribuintes — [Convergência Digital](https://convergenciadigital.com.br/governo/reforma-tributaria-governo-projeta-comecar-split-payment-facultativo-em-2027/); Ato Conjunto 08/09/2026: manuais para bancos/IPs, cartões em etapa posterior, "data de início efetivo em 2027 ainda não foi definida" — [IstoÉ Dinheiro](https://istoedinheiro.com.br/regras-split-payment-receita-federal-aprova-conexao-bancos); testes de integração só com PSPs desde 15/10/2026; Omie projeta B2B real no 2S27 — [Omie](https://www.omie.com.br/blog/testes-split-payment-receita-federal-15-outubro/index.md). "Obrigatoriedade B2B em 2028" circula em snippets mas a página citada diz "ainda não há data oficial" — tratar como [H].
- [F] Alíquota da CBS 2027 ainda não fixada (Senado até 15/12/2026; TCU até 30/10; estimativa não oficial 9,21%) — Agência Senado (acima).
- [F] Omie: 1,1 mi de empresas do Simples (58%) nos 26 setores de alta exposição; híbrido vantajoso se 60–70% das vendas forem PJ — [Omie](https://www.omie.com.br/blog/reforma-tributaria-precificacao-oportunidade-contadores/index.md).

### Inferences
- [E] Universo "pagante" 2027–2028: LP + LR ≈ 3,2 mi (15%) + fração do Simples com vendas B2B relevantes (não quantificada; Omie indica ~1,1 mi em setores expostos).
- [H] A decisão semestral de regime híbrido cria um serviço recorrente real para Simples B2B — mas é "contábil" por natureza (favorece o contador).
- **O que refutaria:** levantamento local mostrando ≥ 30% das PMEs-alvo em Presumido ou Simples com maioria de vendas PJ.

### Gaps
- Estoque oficial Simples/MEI 2026; texto dos arts. da LC 214 sobre híbrido; data oficial do split obrigatório.

---

## Q7. Argumento 6 — "Infoprodutores, YouTube, LinkedIn e IA generativa já saturaram a educação sobre reforma"

### Takeaway
**Probabilidade de saturação de "explicar a reforma/responder dúvidas": [E] ~85%. De saturação de "diagnóstico aplicado à minha empresa com meus dados": [E] ~40%.** Há 24+ infoprodutos na 1ª página do Hotmart, cursos profissionais de R$ 1.340–4.200, oferta gratuita de Sebrae/CFC/RFB, IA embutida em Domínio (TRIA), Omie, Jettax (MCP para ChatGPT/Claude/Gemini) e Bling, e a própria Calculadora oficial é um "oráculo" com memória de cálculo e base legal. O diagnóstico já é oferecido grátis como isca (Conta Azul, TaxUp, Sebrae).

### Cited Findings
- [F] Hotmart, busca "reforma tributária": 24 produtos na 1ª página, inclusive "Como Ganhar Dinheiro com a Reforma Tributária" — [Hotmart](https://hotmart.com/pt-br/marketplace/busca?q=reforma%20tribut%C3%A1ria).
- [F] Cursos: APET 57 h, R$ 4.200 — [APET](https://apet.org.br/courses/curso-de-especializacao-reforma-tributaria-ibs-e-cbs-na-constituicao-e-na-lei-complementar-11-08-2026/); Cursos Módulos R$ 1.340,90 — [link](https://cursosmodulos.com.br/Curso/Dominio-da-Reforma-Tributaria-IBS-CBS-e-Transicao-ate-2033-Online); IBDT 18 h esgotado — [IBDT](https://ibdt.org.br/curso/curso-de-reforma-tributaria-sobre-o-consumo-ibs-cbs-e-imposto-seletivo-3a-edicao-2026-2/).
- [F] IA aplicada: TRIA da Reforma (Domínio, 22/10/2026); Omie IA Fiscal (18/12/2025); Jettax IA via MCP (30/10/2026), que admite "a IA não substitui o sistema fiscal nem a apuração assistida" — [Jettax](https://www.jettax.com.br/blog/ia-e-reforma-tributaria-aplicacoes-praticas-para-escritorios-contabeis/).
- [F] Diagnóstico grátis: TaxUp (30 min com consultor sênior) — [TaxUp](https://taxup.com.br/solucoes/reforma-tributaria/projeto-piloto/); Conta Azul calculadora + maturidade; Sebrae simulador; "Reforma Tributária 360" diagnóstico gratuito — [RT360](https://reformatributaria360.com.br/receba-um-diagnostico-gratuito-da-sua-empresa/); Taxcel calculadora — [Taxcel](https://taxcel.com.br/calculadora-ibs-cbs). IOB "Análise Diagnóstica" paga sob proposta — [IOB](https://noticias.iob.com.br/analise-diagnostica-da-reforma-tributaria/).

### Inferences
- [E] Preço/hora do conteúdo profissional: APET R$ 4.200/57 h ≈ R$ 74/h; para a PME a referência é R$ 0. Um fundador sem CRC/OAB não compete em credencial com APET/IBDT/IOB.
- [H] A IA comoditiza "responder a lei", não "aplicar aos meus dados" — Omie/Jettax fazem isso **dentro** da base do cliente. Terceiro sem acesso aos DF-e fica em desvantagem; com acesso (procuração e-CAC), pode competir.
- [H] O infoproduto "ganhe dinheiro com a reforma" sinaliza bolha de consultores improvisados em 2026–2027 → pressão de preço e ceticismo da PME.
- **O que refutaria:** landing page com "Diagnóstico aplicado — R$ 1.490" vs "Curso — R$ 297": se o diagnóstico vende e o curso não, o argumento cai para serviço e se confirma para conteúdo.

### Gaps
- Dados de YouTube/Udemy/IOB (busca esgotada); preços dos produtos Hotmart.

---

## Q8. Argumento 7 — "Fundador sem CRC/OAB não tem credibilidade nem pode assinar; risco de exercício ilegal"

### Takeaway
**Probabilidade de sanção legal efetiva a um consultor que não escritura, não assina e não postula: [E] ~10–20%. Probabilidade de que a falta de credencial prejudique materialmente a venda a PMEs e contadores: [E] ~60%.** O texto do DL 9.295/46 **não** menciona "consultoria tributária" entre as atribuições privativas (art. 25/26: escrituração, balanços, perícias, revisão de contas), e o TRF-4 já afastou restrição de conselho por violar a legalidade. Mas a Lei 8.906/94 reserva "consultoria, assessoria e direção jurídicas" a advogados, o CFC lavrou >7 mil autos de infração em 2020 e CRCs denunciam leigos ao MP. O risco maior é reputacional: a PME e o contador compram credencial.

### Cited Findings
- [F] DL 9.295/1946, art. 25: "organização e execução de serviços de contabilidade em geral"; "escrituração dos livros de contabilidade obrigatórios"; "perícias judiciais ou extra-judiciais, revisão de balanços e de contas em geral... e quaisquer outras atribuições de natureza técnica conferidas por lei"; art. 26: alínea c privativa de contadores diplomados; art. 12 (Lei 12.249/2010): exercício só após bacharelado, Exame de Suficiência e registro, e "o exercício sem esse registro será considerado como infração"; art. 20: quem se anuncia sem registro "fica sujeito às penalidades aplicáveis ao exercício ilegal da profissão". **"Consultoria tributária" e "planejamento tributário" não aparecem no texto.** — [Planalto](https://www.planalto.gov.br/ccivil_03/decreto-lei/del9295.htm).
- [F] Lei 8.906/1994, art. 1º, II: são privativas de advocacia "as atividades de consultoria, assessoria e direção jurídicas"; § 3º: "É vedada a divulgação de advocacia em conjunto com outra atividade" — [Planalto](https://www.planalto.gov.br/ccivil_03/leis/l8906.htm). [H] Alcance de "consultoria jurídica" sobre orientação tributária não jurídica (cálculo, preço, processo) é controverso; não localizei julgado específico.
- [F] CFC (FAQ): exercício sem registro "não é permitido em hipótese nenhum" [sic]; em 2020 houve **mais de 7.000 autos de infração**; CRCs enviam relatórios às "autoridades competentes" — [CFC](https://cfc.org.br/fiscalizacao-etica-e-disciplina/perguntas-frequentes/sistema-cfccrcs/). A FAQ **não** trata explicitamente de consultoria tributária.
- [F] CRC-AL (15/03/2019): denúncias de leigos ao MPE/AL (Gaesf); cita pena de "prisão de 15 dias a três meses" (art. 47, exercício ilegal de profissão) — [CFC](https://cfc.org.br/?p=27862).
- [F] Posição interpretativa de portal do setor (14/02/2025): "somente os contadores com registro no CRC podem exercer atividades regulamentadas", listando "consultorias fiscais" como exclusivas, mas a tabela do mesmo artigo marca consultoria fiscal sem CRC como "Limitada" — inconsistente — [Jornal Contábil](https://jornalcontabil.com.br/noticia/quais-atividades-um-contador-sem-registro-no-crc-pode-oferecer/).
- [F] TRF-4, 4ª Turma, 08/10/2013 (Atta Consultores, Umuarama): Resolução CFC 1.390/2012 (maioria do capital com contadores) afastada: "Quando ultrapassa as fronteiras da lei, o ato infralegal não pode ser considerado válido"; "somente a lei pode estabelecer restrições ao exercício da profissão" — [Conjur](https://www.conjur.com.br/2013-out-13/norma-conselho-classe-nao-restringir-atuacao-profissional/).
- [F] Contabilizei enfrentou conflito com CRCs por preço/automação; CRC-PR concluiu regularidade em ago/2015 — Wikipedia Contabilizei (Q1).
- Jurisprudência específica sobre consultoria tributária por não contador/não advogado: **não encontrei** (busca retornou só fontes de conselhos e portais).

### Inferences
- [H] Juridicamente, um consultor que entrega simulações, diagnósticos de processo/preço e integração de software — sem escriturar, assinar demonstrações, emitir parecer jurídico ou postular — está fora do núcleo privativo literal do DL 9.295 e numa zona cinzenta quanto à Lei 8.906. O risco cresce se o marketing usar termos como "parecer", "consultoria jurídico-tributária" ou "planejamento tributário".
- [H] Comercialmente, a credencial importa mais que a lei: a PME confia no contador (75% dizem que será essencial), e o contador não subcontrata um não-contador para falar de tributo com seu cliente sem forte razão. Mitigação óbvia: sócio ou parceiro com CRC (e/ou OAB) que assina e responde; o fundador fica com tecnologia, dados e produto.
- **O que refutaria:** 10 escritórios aceitando parceria white label sabendo que o fundador não tem CRC; consulta formal ao CRC local (resposta escrita) sobre o escopo pretendido; parecer de advogado sobre o rótulo do serviço.

### Gaps
- Julgados do STJ/TRFs sobre consultoria tributária sem registro; resultado da ADI 1.127 quanto ao inciso II (não verificado).

---

## Q9. Argumento 8 — "Adiamento/diluição: Congresso, STF, eleições"

### Takeaway
**Probabilidade de adiamento legal da CBS plena de 2027 (PEC/LC) nos próximos 60 dias: [E] ~10–15%. Probabilidade de nova diluição administrativa (split sem data, obrigações acessórias relaxadas, rejeições adiadas) nos próximos 12 meses: [E] ~75%. Probabilidade de alterações relevantes de regras por LC em 2027–2028: [E] ~50%.** O candidato que levantou o adiamento perdeu (Lula reeleito em 25/10/2026); adiar a CBS exige PEC e não havia PEC em tramitação; nenhuma das 15 ações no STF ataca o cronograma. Mas o padrão de 2025–2026 é de diluição por ato infralegal, e o precedente eSocial (≥10 atos, 34 meses de atraso para o Simples) mostra como isso corrói a urgência que uma consultoria vende.

### Cited Findings
- [F] Lula (PT) reeleito em 25/10/2026: 51,79% (64.256.232 votos) vs. Flávio Bolsonaro (PL) 48,21%; Migalhas registra 51,77% com 99,91% apuradas (divergência de arredondamento) — [Wikipedia](https://pt.wikipedia.org/wiki/Elei%C3%A7%C3%A3o_presidencial_no_Brasil_em_2026); [Migalhas](https://www.migalhas.com.br/quentes/467138/acompanhe-a-apuracao-do-2-turno-das-eleicoes-2026); [TRE-SP](https://www.tre-sp.jus.br/comunicacao/noticias/2026/Outubro/eleicoes-2026-lula-e-reeleito-presidente-da-republica-confira-resultado-do-2o-turno-em-sp).
- [F] Flávio Bolsonaro "levantou a proposta de adiamento durante a campanha"; ministro Dario Durigan (08/10/2026) criticou "querer prorrogar a reforma" mas admitiu "transições normativas adaptando o calendário"; Appy: "prudente estender o período de teste"; MRV/Abrainc pedem ≥1 ano; adiar exige PEC (3/5, dois turnos) antes de 1/1/2027 — [A Crítica/Estadão-Broadcast, 29/10/2026](https://acritica.net/economia/pressao-adiar-reforma-tributaria-cresce-mudanca-exige-pec-2027/).
- [F] Systax (14/10/2026): adiar CBS/extinção PIS-Cofins para 2028+ exige EC; LC só pode unificar data CBS+IS dentro de 2027; MP não serve — [Systax](https://www.systax.com.br/artigos-e-novidades/reforma-tributaria-ha-espaco-para-adiar-o-cronograma-ou-mudar-as-regras-antes-de-2027/). Adiamento administrativo do split depende só de atos da RFB; IS não incide em janeiro por anterioridade nonagesimal — [Brasil em Folhas, 14/10/2026](https://www.brasilemfolhas.com.br/2026/10/reforma-tributaria-pode-sofrer-adiamentos-antes-de-2027-diz-especialista/).
- [F] Diluições já ocorridas: Decreto 13.075/2026 adiou obrigações de PF/produtores rurais (não afeta o cronograma geral) — [NetCPA](https://netcpa.com.br/colunas/reforma-tributariaobrigatoriedade-do-cbs-e-adiada-para-2027/28229); rejeição NF-e por ausência de IBS/CBS adiada em dez/2025 (NT v1.33) e novamente suspensa em 01/08/2026 — [IOB](https://noticias.iob.com.br/reforma-cronograma-de-adequacoes/), Tecnospeed (Q4); split sem data (Q6).
- [F] STF: 15 processos (14 ADIs + 1 ADPF) sobre a reforma (levantamento Valor/APET, 19/08/2026): ADIs 7755, 7779, 7790, 7963, 7920, 7936, 7944, 7882; CNI ajuizou ADI 8002 contra LC 224/2025 — nenhuma ataca o cronograma — [APET](https://apet.org.br/?p=142078).
- [F] Precedente eSocial: ≥10 atos de cronograma, folha do Simples 34 meses atrasada (Q1). NF-e: 3 migrações de leiaute.
- Posição explícita de Lula pós-vitória sobre o cronograma e composição do novo Congresso: **não encontradas**.

### Inferences
- [H] "Diluição" é pior para a tese do que "adiamento": o adiamento legal seria um evento claro para replanejar; a diluição administrativa drena a urgência percebida pela PME aos poucos ("vai adiar de novo"), como no eSocial.
- [H] Produto hiper-específico ao split payment tem risco regulatório alto (precedentes Romênia/Polônia, Q13); produto genérico de "gestão de mudança fiscal" sobrevive a qualquer cenário.
- **O que refutaria:** PEC/PLP protocolado com relator até dez/2026; declaração de Lula/Durigan abrindo adiamento da CBS; ou, no sentido inverso, ato RFB/CGIBS fixando data obrigatória do split.

### Gaps
- Texto do Ato Conjunto RFB/CGIBS 4/2026; andamento das ADIs em stf.jus.br; Informativo STF 1224 (03/08/2026) sobre inconstitucionalidade parcial de dispositivos da LC 214 (não verificado).

---

## Q10. Argumento 9 — "Comoditização rápida; milhares de contadores oferecendo o mesmo"

### Takeaway
**Probabilidade de que o "diagnóstico de reforma" avulso caia a ≤ R$ 2 mil ou vire isca gratuita até 2028: [E] ~70%.** Preços já estão ancorados pelo mercado contábil (R$ 2–15 mil; R$ 1.500–3.700/mês) e por ofertas gratuitas (Sebrae, Conta Azul, TaxUp, RT360). O precedente LGPD (80% das bancas vendendo o mesmo em 2021; DPO externo a R$ 1.500/mês) mostra a velocidade. A oferta é numerosa, mas não competente: 58–63% dos escritórios não mapearam a carteira.

### Cited Findings
- [F] Preços praticados (25/09/2026): diagnóstico R$ 2–15 mil; consultoria R$ 1.500–3.700/mês; contratos R$ 100–130 mil para empresas maiores — [Portal RT](https://www.reformatributaria.com/iva/contadores-buscam-novas-formas-de-monetizar-e-precificar-servicos-com-a-reforma-tributaria/).
- [F] Gratuitos: Sebrae, Conta Azul, TaxUp, RT360 (Q3, Q7).
- [F] TaxUp vende com "success fee, misto ou por escopo" — sinal de pressão de preço — [TaxUp](https://taxup.com.br/solucoes/reforma-tributaria/projeto-piloto/).
- [F] LGPD: 80% das bancas em 2021; DPO as a service PME R$ 1.500–4.000/mês (Q1).
- Número de escritórios/consultorias anunciando "diagnóstico de reforma": **não encontrei**.

### Inferences
- [H] O valor migra do diagnóstico para implementação/monitoramento recorrente (decisão semestral de regime, precificação, conferência da apuração assistida, caixa sob split).
- **O que refutaria:** mapeamento de ≥ 20 escritórios da cidade-alvo mostrando que nenhum oferece diagnóstico estruturado, ou que cobram > R$ 5 mil com fila de espera.

### Gaps
- Contagem de ofertantes; série de preços 2025→2026.

---

## Q11. Argumento 10 — "Um player grande ocupa o nicho com distribuição que um novo não tem"

### Takeaway
**Probabilidade de que a camada de software de reforma para PME seja capturada por incumbentes (TR, TOTVS, Omie/Visma, Conta Azul/Visma, bancos/PSPs no split): [E] ~80%.** Thomson Reuters tem 250 mil contadores conectados e módulo lançado; Visma comprou quatro ativos de PME em 9 meses "de olho na reforma"; Grant Thornton desce a PME via ERP; o split será operado por bancos/PSPs via plataforma pública; Omie virou ITP no Open Finance (incumbente de software absorvendo função regulatória). O que sobra é serviço humano local e integração — exatamente o que não escala.

### Cited Findings
- [F] TR: 250 mil contadores; Domínio BPO e Domínio AI (SYNERGY 2026); "muito poucas empresas fizeram coisas conectadas" — [Forbes](https://forbes.com.br/forbes-money/2026/10/a-reforma-tributaria-muda-radicalmente-a-forma-de-trabalhar-diz-vp-da-thomson-reuters/).
- [F] Visma: Conta Azul (ago/2025), MaisMei (fev/2026), Dootax + Pag Útil (13/05/2026) — [Finsiders](https://finsidersbrasil.com.br/negocios-em-fintechs/fusoes-e-aquisicoes/visma-compra-dootax-pag-util-brasil-de-olho-na-reforma-tributaria/). Dootax: ~1 mil clientes, >R$ 3 bi em impostos processados — [Exame](https://exame.com/exame-in/dootax-startup-contas-em-dia-leao).
- [F] Grant Thornton + Ramo (BPO fiscal PME) — [Baguete](https://www.baguete.com.br/noticias/ramo-e-grant-thornton-oferta-foca-reforma-tributaria).
- [F] Split: habilitação de bancos/IPs via manuais RFB/CGIBS; piloto coordenado pela CNF; custo estimado R$ 0,39–0,61/operação, 1,5 bi transações/ano — [IstoÉ Dinheiro](https://istoedinheiro.com.br/regras-split-payment-receita-federal-aprova-conexao-bancos); [Omie](https://www.omie.com.br/blog/custo-split-payment-reforma-tributaria/index.md).
- [F] Omie entre os 57 ITPs aptos (Open Finance) — Finsiders (Q1).
- [F] Sovos comprou Flowie (01/10/2026) e Blue dot (15/09/2026) — [Sovos](https://sovos.com/press-releases/). Contabilizei já oferece "Calculadora de Reforma Tributária" — [Contabilizei](https://www.contabilizei.com.br/).
- Movimentos de Nuvem Fiscal, bancos nomeados no split, aquisições de tax techs 2024–2026 além da Visma: **não encontrados** (busca esgotada).

### Inferences
- [H] O comprador estratégico típico (Visma, TR, Sovos, TOTVS) já está preenchendo o portfólio — reduz o prêmio de saída para um entrante de 2027.
- [H] Espaço residual: integração entre sistemas que as plataformas não fazem + serviço humano local. Ambos têm teto baixo de escala.
- **O que refutaria:** PMEs locais com Domínio/Omie/TOTVS que mesmo assim não receberam diagnóstico; escritórios locais que usam < 20% dos módulos de reforma do sistema.

### Gaps
- Bancos/adquirentes nomeados no split; preços de módulos de reforma dos ERPs.

---

## Q12. Argumento 11 — "Mercado local pequeno; expansão remota exige marketing que R$ 100 mil não cobre"

### Takeaway
**Probabilidade de que o mercado de uma cidade média (100–500 mil hab.) sozinho não sustente uma firma de 2–3 pessoas com ticket PME: [E] ~60%.** Não encontrei dado por município nem benchmark de CAC de SaaS fiscal B2B; a estimativa de bolso dá ~5 mil empresas "pagantes" (fora do Simples) numa cidade de 300 mil habitantes e ~50 clientes a 1% de conversão.

### Cited Findings
- [F] 25,7 mi CNPJs ativos; ~15% fora do Simples (2024) — Q6. Sebrae publica "Pequenos negócios em números" por região/UF — [exemplo Datasebrae](https://datasebrae.com.br/wp-content/uploads/2026/07/Pequenos-negocios-em-numeros-Alto-Oeste-2026.2-1-1.pdf). Mapa de Empresas tem painel por município — [gov.br](https://www.gov.br/empresas-e-negocios/pt-br/mapa-de-empresas).
- CAC/CPL de SaaS fiscal, CPC Google Ads "reforma tributária": **não encontrados**.

### Inferences
- [E] 25,7 mi / ~213 mi hab ≈ 0,12 CNPJ/hab. Cidade de 300 mil hab → ~36 mil CNPJs; × 15% fora do Simples → ~5,4 mil; × 1% conversão [H] → ~54 clientes; × R$ 1.500/mês → ~R$ 81 mil/mês de receita potencial máxima no cenário otimista; a 0,3% de conversão → ~16 clientes, ~R$ 24 mil/mês. Toda a cadeia é [E]/[H]; substituir pelo número real do município (Painel Mapa de Empresas).
- [E] Runway: R$ 100 mil a R$ 6–8 mil/mês de burn (fundador + ferramentas, sem funcionário) ≈ 12–16 meses; qualquer gasto de mídia relevante (R$ 3–5 mil/mês) reduz para 8–11 meses.
- **O que refutaria:** extração do Painel por município mostrando ≥ 8–10 mil CNPJs fora do Simples na microrregião; teste de Google Ads local com CPL < R$ 150 e ≥ 3 reuniões/semana.

### Gaps
- Dados municipais; CAC/CPL.

---

## Q13. Quem tentou e falhou (Brasil e internacional)

### Takeaway
No Brasil **não encontrei nenhum caso documentado de tax tech/fiscal tech ou contabilidade online que tenha encerrado operações entre 2015 e 2026** — mas também nenhum vencedor que tenha nascido como consultoria: todos são software com VC pesado (R$ 60 mi a R$ 700 mi) e canal escalável, com 8–18 anos de maturação. Internacionalmente: a camada de compliance do GST indiano foi comoditizada pelo próprio governo (GSPs "non-functional"); Malásia revogou o GST em 3 anos; Romênia revogou o split payment em 25 meses; Polônia manteve split só para ~150 grupos de risco; Bench (EUA) levantou ~US$ 104 mi, chegou a 650 pessoas e faliu com US$ 2,8 mi em caixa — serviço humano barato para PME não fechou a conta nem com capital abundante.

### Cited Findings

**Brasil**
- [F] Buscas por "tax tech encerra/fecha" e "contabilidade online fecha" (Agilize, Conube, Contabilix, Contabilivre) não retornaram nenhum fechamento; Conube e Contabilix listadas como concorrentes ativas — [Ahrefs](https://ahrefs.com/websites/contabilizei.com.br/competitors). Brinta "Alive" — [CB Insights](https://www.cbinsights.com/company/brinta).
- [F] Vencedores: Contabilizei (Q1); Agilize (12 anos, R$ 60 mi AXA/L4/Stone, >25 mil empresas, fev/2025) — [Exame](https://exame.com/bussola/como-essa-startup-de-contabilidade-online-chegou-aos-12-anos-e-conquistou-aporte-de-r-60-mi/); Dootax → Visma (Q11); Tecnospeed (Q1); Arquivei (Q1); ROIT já apontava em 14/01/2021 a reforma como driver — [Finsiders](https://finsidersbrasil.com.br/reportagem-exclusiva-fintechs/fintechs-de-contabilidade-crescem-com-a-demanda-e-ja-atraem-investidores-e-players-internacionais/).
- [F] Mortalidade: FDC — 50% das startups brasileiras fecham antes de 4 anos; 75% antes de 13 — Exame/Agilize (acima). Sebrae "Sobrevivência das Empresas 2026" existe, mas os PDFs não foram extraídos — [Datasebrae](https://datasebrae.com.br/empresas/).
- [F] Open Finance: Quanto dormente/à venda; licenças canceladas; N26 saiu do Brasil (07/11/2023) — [Tecnoblog](https://tecnoblog.net/noticias/2023/11/07/fintech-alema-n26-fracassa-no-brasil-e-decide-sair-do-pais); demissões Brex/Cora/Unico (jan/2024) — [Forbes](https://forbes.com.br/negocios/2024/01/demissoes-indicam-consolidacao-nas-fintechs-saiba-quais-podem-ser-compradas/).
- [H] Taxweb→Sovos, Mastersaf→TR: saídas por aquisição, **não verificadas** nesta sessão.

**Índia (GST 2017) e outros**
- [F] GSPs: "Taxpayers using offline tool will not require services of any GSP" (Vikaspedia, gov. indiano) — [Vikaspedia](https://egovernance.vikaspedia.in/viewcontent/e-governance/online-citizen-services/government-to-business-services-g2b/goods-and-services-tax/gst-suvidha-provider?lgn=en); "Currently, the GSPs are in a non-functional mode as the taxpayers are opting to file... directly on the GSTN portal" — [SAG Infotech](https://blog.saginfotech.com/basic-concept-of-gsp-asp-with-role-in-gstn).
- [F] Tally (incumbente de ERP para PME, fundada 1986): GSP em 2016, software GST em 2017, >28 mil parceiros, receita FY23 ₹578 crore — [Wikipedia](https://en.wikipedia.org/wiki/Tally_Solutions). [H] ClearTax (fundada 2011, >US$ 100 mi levantados, GSP) — de memória, **não verificado** (páginas 404). Casos nominais de startups GST que fecharam: **não encontrados**.
- [F] Malásia: GST 6% em 01/04/2015; zerado em 01/06/2018 após eleição; revogado em 01/09/2018 (volta do SST) — [Wikipedia](https://en.wikipedia.org/wiki/Goods_and_Services_Tax_(Malaysia)); transição exigiu "reconfigurar software e treinar equipes" — [activpayroll](https://www.activpayroll.com/news-articles/abolition-of-gst-and-transition-to-sst-in-malaysia).
- [F] Itália: e-invoicing B2B via SdI desde 01/01/2019 — [PwC](https://taxsummaries.pwc.com/italy/corporate/other-taxes).

**Romênia × Polônia (split payment)**
- [F] Romênia: split desde 01/01/2018 (obrigatório para insolventes/inadimplentes; opcional com desconto para os demais) — [Easytax](https://www.easytax.co/tax-mag/info/romania-split-vat-payment-abolished/); Comissão Europeia notificou (nov/2018) por ônus sobre "honest businesses" — [Fiscal Solutions](https://fiscalsolutions.co.uk/news/eu-commission-take-action-against-split-payment-regime-in-romania/); revogado pela OUG 78/2019 (DO 23/12/2019), efeito 01/02/2020 — [Lawyers Week](https://lawyersweek.net/16475/romania-repeals-controversial-vat-split-payment-mechanism.html); "abandonado em 2020... desproporcional" — [vatcalc](https://www.vatcalc.com/romania/romania-vat-guide/). **Nenhuma fonte encontrada sobre o que aconteceu com fornecedores de software/consultoria** — a ausência é, em si, um sinal.
- [F] Polônia: split vigente só para faturas > PLN 15 mil em ~150 grupos de risco (aço, combustíveis, eletrônicos, construção...); esforço regulatório migrou para e-invoicing KSeF (2026–2027) — [PwC](https://taxsummaries.pwc.com/poland/corporate/other-taxes).

**EUA**
- [F] Bench Accounting: fundada 2012; rodadas somando ~US$ 104 mi (Série C US$ 60 mi em 2021); ~650 funcionários; plataforma "immediately inaccessible" em 27/12/2024; Employer.com anunciou aquisição em 30/12/2024; falência no Canadá em 07/01/2025 com US$ 65,4 mi de passivos e US$ 2,8 mi em caixa; fundida com Mainstreet em 08/2025 — [Wikipedia](https://en.wikipedia.org/wiki/Bench_Accounting) (inconsistências de citação); [GeekWire](https://www.geekwire.com/2024/bench-accounting-to-be-acquired-by-employer-com-following-abrupt-shutdown/). O valor "US$ 113 mi" **não** foi confirmado. [H] ScaleFactor (Austin, ~US$ 100 mi, fechou jun/2020, "IA" feita por humanos) — de memória, **não verificado**.

### Inferences
- [H] Padrão dos vencedores: (1) software recorrente; (2) canal escalável (software houses, assinatura digital); (3) VC de dezenas a centenas de milhões; (4) entrada 5–10 anos antes da consolidação. "Consultoria primeiro, sem capital" não replica nenhum dos quatro.
- [H] Intermediários licenciados pelo Estado (GSPs) não foram proteção competitiva — o próprio Estado os tornou obsoletos. Esperar o mesmo para "integradores" de split/AA.
- [H] Split payment universal nunca foi mantido em nenhum país; precedentes são revogação (Romênia) ou restrição setorial (Polônia/Itália). Produto que só existe com split universal e obrigatório carrega esse risco.
- [H] Bench é o modelo "consultoria/serviço humano + software para PME": ticket baixo, custo humano variável, churn alto — e virou feature de uma empresa de folha. Análogo brasileiro: carteiras absorvidas por Visma/TOTVS/Omie.

### Gaps
- Fechamentos nominais de tax techs brasileiras (se houver); números de GSPs apontados vs ativos; ClearTax; ScaleFactor; impacto do fim do split na Romênia sobre fornecedores; México CFDI/PACs; Arábia/EAU.

---

## Q14. Onde a evidência favorece a tese (registro honesto)

### Takeaway
A tese não está morta; está **mal especificada**. A evidência favorece um negócio de **decisão e implementação para o Lucro Presumido e o Simples B2B, vendido via/junto ao contador, com janela jan/2027–2028 e software como destino desde o dia 1** — e desfavorece "educar", "calcular", "emitir" ou vender consultoria avulsa direto à PME do Simples.

### Cited Findings
- [F] Vácuo real hoje: 68% dos escritórios procurados, 5% com estratégia; 61–63% sem mapeamento; 25% das PMEs procuradas; 3% entendem sozinhas (Q2, Q5).
- [F] Lacunas técnicas no gratuito: sem API online, Docker/JAR; motor não cobre DeRE/imóveis/combustíveis/cashback; AA sem devolução/split; Simples fora da AA (Q3).
- [F] Ninguém executa split; nenhum ERP de PME afirma executá-lo; TR corporativo ainda entregando apuração em nov–dez/2026 (Q4).
- [F] Decisão de regime do Simples com janelas semestrais (30/11/2026; mar/2027) — serviço consultivo recorrente que Receita/Sebrae não executam individualmente (Q6).
- [F] Pico de dúvida garantido: CBS plena em 01/01/2027 com alíquota fixada só até 15/12/2026; candidato pró-adiamento perdeu (Q9).
- [F] Comprador existe: Visma declara PME/middle market "onde os impactos tendem a ser mais intensos" (Q11); vagas tax +138% (Q5).
- [F] Entrantes pós-onda venceram sobre o dado novo (Arquivei, 2014) e via canal indireto (Tecnospeed → 2,5 mil software houses) (Q1).
- [F] Fardo estrutural: 1.501 h/ano, >40 normas/dia — a demanda por conformidade não acaba em 2033 (Q1).

### Inferences
- [H] Posicionamento que sobrevive aos 11 argumentos: parceiro técnico do contador (white label), entregando simulação de margem/preço por produto e cliente, análise de fornecedores por crédito, decisão de regime, caixa sob split, integração do motor oficial aos dados da PME — com um sócio/parceiro CRC assinando. Consultoria apenas como mecanismo de aquisição de dados e clientes por 18–24 meses.

### Gaps
- Nenhum dado de disposição a pagar em R$ — a maior lacuna de todo o dossiê.

---

## Q15. Pre-mortem: as 5 causas mais prováveis de fechar em 3 anos

### Takeaway
Se a empresa fechar até nov/2029, as causas mais prováveis, em ordem, são: vendeu a data errada; vendeu para quem não compra (PME direta) em vez de para quem distribui (contador); vendeu o que é grátis (educação/cálculo); perdeu credibilidade por falta de credencial; e queimou os R$ 100 mil em CAC e tempo antes da receita recorrente.

### Cited Findings
- Evidências de base: eSocial ≥10 atos / 34 meses (Q1); rejeições suspensas em 01/08/2026 e split sem data (Q4, Q6); adoção PME 15–31% nas ondas anteriores (Q1); "obstáculo nº 1 é o cliente perceber valor" 58% (Q2); diagnósticos gratuitos (Q7); Calculadora oficial e Sebrae (Q3); CFC >7 mil autos (Q8); Bench US$ 104 mi → US$ 2,8 mi em caixa (Q13); FDC 50% das startups fecham em 4 anos (Q13).

### Inferences
1. **Vendeu a data errada (diluição/adiamento).** [E] P ≈ 0,75 de nova diluição em 12 meses. *Mitigação:* não vender "preparação para X data"; vender acompanhamento recorrente indexado a decisões que acontecem independentemente do split (regime semestral, preço, crédito de fornecedor); modelar fluxo de caixa com cronograma alterado 2–3 vezes.
2. **Canal errado: PME não compra direto; contador não repassa.** [E] P ≈ 0,6–0,65. *Mitigação:* pré-venda white label com 30 escritórios antes de qualquer gasto; meta de ≥ 3 escritórios parceiros assinados antes de produzir conteúdo ou software; nunca competir com o contador do cliente.
3. **Vendeu o que é grátis (educar, calcular, emitir).** [E] P ≈ 0,85 de comoditização dessa camada. *Mitigação:* escopo restrito a decisão + implementação com os dados da PME (DF-e via procuração/API); integrar o motor oficial em vez de reescrevê-lo; não produzir curso.
4. **Credencial/legal: sem CRC/OAB, sem venda; ou notificação de CRC.** [E] P ≈ 0,6 de dano comercial; 0,1–0,2 de sanção. *Mitigação:* sócio ou parceiro CRC (ideal: também OAB de apoio) que assina e responde; nomenclatura do serviço sem "parecer"/"jurídico"; consulta formal escrita ao CRC local.
5. **Caixa: R$ 100 mil não cobre CAC + 12–18 meses até recorrência (precedente Bench).** [E] Runway 12–16 meses a R$ 6–8 mil/mês sem mídia; 8–11 com mídia. *Mitigação:* receita antes de contratar; ticket mínimo R$ 1.500/mês ou R$ 3 mil avulso; equipe = fundador + parceiro CRC comissionado; zero mídia paga até 10 clientes orgânicos/indicados.

(Causa 6, menos provável mas letal: incumbente lança exatamente o produto — Domínio/Omie/Conta Azul já têm calculadora, planejador e IA; [E] P ≈ 0,5 em 24 meses para "simulação de margem por produto/cliente". *Mitigação:* vender serviço sobre o produto do incumbente, não contra ele.)

### Gaps
- Sem dado de churn/margem de serviços fiscais para PME no Brasil (Contabilizei/Agilize não divulgam).

---

## Q16. Critérios de parada objetivos (números e datas)

### Takeaway
Cada critério abaixo é um gatilho binário; dois gatilhos simultâneos = encerrar ou pivotar sem nova rodada de "mais um mês". As datas assumem início em nov/2026 e usam os marcos regulatórios conhecidos (CBS plena 01/01/2027; alíquota até 15/12/2026; janela do Simples 30/11/2026 e mar/2027; NTs 16/11/2026; split facultativo em 2027 sem data).

### Cited Findings
- Marcos: Agência Senado 26/10/2026 (alíquota até 15/12); Tecnospeed (NTs 16/11/2026); Contábeis 13/08/2026 (split não em jan/2027); Domínio (janela Simples 30/11/2026); A Crítica 29/10/2026 (PEC necessária) — links em Q4, Q6, Q9. Preços de referência: diagnóstico R$ 2–15 mil, recorrente R$ 1.500–3.700/mês (Q10).

### Inferences — critérios [E]
1. **Pré-venda (validação de demanda):** < **10 contratos pagos** (≥ R$ 1.500 cada, dinheiro recebido) até **31/03/2027** → parar. Racional: o 1º trimestre de 2027 é o pico de dúvida (CBS plena + alíquota recém-fixada); se não vende aí, não vende depois.
2. **Canal:** < **3 escritórios contábeis** com acordo white label assinado e ≥ 1 cliente indicado cada até **28/02/2027** → parar a via contador; se também falhar a via direta (critério 1), encerrar.
3. **CAC:** CAC médio (tempo do fundador valorado a R$ 100/h + mídia) > **50% da receita de 12 meses** do cliente, medido em ≥ 15 clientes, ou CPL pago > **R$ 300** por 60 dias → cortar aquisição paga; se orgânico/indicação não repõe ≥ 2 clientes/mês até **30/06/2027** → parar.
4. **Recorrência:** < **30%** dos clientes de diagnóstico convertidos em recorrente até o 6º mês após o diagnóstico (medir em **30/09/2027**) → o negócio é projeto, não empresa; encerrar ou vender carteira.
5. **Caixa:** receita mensal < burn mensal no **9º mês** (**31/07/2027**), ou caixa < R$ 30 mil sem MRR ≥ R$ 10 mil → encerrar com reserva.
6. **Regulatório:** (a) PEC/LC promulgada adiando a cobrança da CBS para **≥ 2028** → suspender vendas e replanejar em 30 dias; (b) ato RFB/CGIBS fixando split obrigatório B2B só a partir de **≥ 2029**, ou restringindo a setores (cenário Polônia) → matar qualquer produto específico de split; (c) nova suspensão de rejeições/obrigações do Simples além de **jul/2027** → cortar escopo Simples.
7. **Concorrência:** Domínio/Omie/Conta Azul/Contabilizei lançando, antes do MVP próprio, simulação de margem/preço por produto e cliente + análise de crédito por fornecedor **sem custo adicional** → pivotar para serviço sobre a ferramenta deles ou encerrar o software.
8. **Legal:** notificação formal de CRC/OAB → suspender atendimento direto em 48 h e só retomar com sócio registrado assinando.

### Gaps
- Os limiares de CAC e conversão são hipóteses de bolso (sem benchmark brasileiro de SaaS fiscal); recalibrar após os primeiros 15 clientes.

---

## Divergências entre fontes registradas neste dossiê
- Lula 51,79% (Wikipedia/TRE-SP) vs 51,77% (Migalhas, 99,91% apuradas).
- Decreto 12.955/2026: 29/04 (manual RFB) vs 30/04 (Contábeis).
- Piloto IBS: 123 vs 134 empresas (TaxUp).
- Disponibilidade das APIs no piloto CBS: "disponíveis" (manual maio/2026) vs "não fazem parte nesta fase" (TaxUp ago/2026).
- Bench: total captado ~US$ 104 mi (soma das rodadas) vs "US$ 113 mi" (briefing, não confirmado).
- "Obrigatoriedade do split B2B em 2028": circula em snippets; página citada diz que não há data oficial.

## Lacunas prioritárias para trabalho de campo (ordem de valor)
1. Disposição a pagar da PME em R$ (nenhuma fonte encontrada) — resolver com pré-venda real, não com pesquisa.
2. Preço e volume de "diagnóstico de reforma" vendido por escritórios da cidade-alvo em 2026.
3. Estoque oficial de CNPJs por regime (Simples/Presumido/Real) no município (Painel Mapa de Empresas + Receita).
4. Texto do Ato Conjunto RFB/CGIBS 4/2026 e da NT 2025.002 v1.51; data oficial do split.
5. Datas/valores de Mastersaf→TR e Taxweb→Sovos; destino de Easy-Way; fechamentos nominais de consultorias eSocial/LGPD (nenhum encontrado em nenhuma onda).
6. Consulta formal ao CRC local sobre o escopo pretendido; parecer sobre rótulo do serviço frente à Lei 8.906.
