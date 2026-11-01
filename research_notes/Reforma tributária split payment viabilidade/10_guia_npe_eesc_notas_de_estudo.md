# Notas de estudo — "Reforma Tributária e geração de valor" (Guia de Estudo do Núcleo de Private Equity, EESC Finance)

Fonte: arquivo local `/home/joaoemanuel/git/split/Guia_Reforma_Tributaria_NPE.pdf` (18 páginas, A4, produzido com pypdf; sem data explícita no corpo; cita EC 132/2023 e LC 214/2025, logo é de 2025 ou 2026). Texto integral extraído em `10_guia_npe_eesc_texto_integral.txt` nesta pasta. Autor: Núcleo de Private Equity da EESC Finance (liga de finanças da Escola de Engenharia de São Carlos, USP). Público-alvo: analistas de private equity. Estas notas foram escritas pelo coordenador do estudo após leitura integral; tudo abaixo é [F] "o guia afirma", salvo onde marcado [E]/[H] como interpretação minha. O guia é material didático, não norma: suas afirmações legais precisam ser cruzadas com a nota 01 (lei e cronograma) e a nota 09 (dores por perfil).

Contexto do usuário [F]: o fundador é de Uberlândia (MG), não de São Carlos; o guia foi apenas material de estudo. Uberlândia é polo nacional de atacado-distribuidor e logística (o perfil de empresa que o estudo de caso do guia mais se aproxima: varejo/distribuição de alto giro, muito ICMS, substituição tributária e saldo credor), o que torna as alavancas descritas no guia (float, DPO, ciclo do crédito, legado de ICMS, fornecedores no Simples) especialmente relevantes para o mercado local.

## 1. O que o guia explica (conteúdo técnico)

### 1.1 Mecanismo débito/crédito e o problema do saldo credor
- Débito = imposto devido na venda; crédito = imposto embutido na compra, abatível. Exemplo a 10%: indústria vende por R$ 1.000 (R$ 100 de imposto), varejo revende por R$ 1.500 (débito R$ 150), recolhe R$ 50.
- Ponto central do guia: quando sobra crédito (comprou muito, vendeu pouco, ou vendeu a alíquota menor), no sistema atual ele fica preso no balanço, imobiliza capital de giro e pode virar perda. [F]

### 1.2 Os cinco tributos atuais
- PIS/Cofins 3,65% (cumulativo, Lucro Presumido, sem crédito) ou 9,25% (não cumulativo, Lucro Real, com crédito). Altíssimo contencioso sobre o conceito de insumo (STJ: essencialidade e relevância; marketing, TI, logística, segurança em zona cinzenta). Em aquisições, esse contencioso é passivo contingente. [F]
- IPI: seletivo, só indústria.
- ICMS: 17–20% por estado, 27 legislações, interestadual 7%/12%/4%, crédito acumulado preso no estado de origem. [F]
- ISS: 2–5%, cumulativo (não gera crédito), disputa de competência entre municípios. [F]

### 1.3 O que muda: IVA dual
- CBS (federal) substitui PIS/Cofins; IBS (estados e municípios) substitui ICMS/ISS; IS (federal, extrafiscal). IPI reduzido a zero em 2027 para quase tudo, mantido só para proteger a Zona Franca de Manaus. [F]
- Três mudanças estruturais: **crédito amplo**, **ressarcimento do saldo credor em dinheiro**, **tributação no destino**.

### 1.4 Crédito amplo (e seus limites)
- Critério passa de "lista de hipóteses" para "finalidade": em regra, todo bem ou serviço adquirido para a atividade gera crédito. [F]
- Impacto operacional: volume de créditos a rastrear cresce muito; cada nota de entrada é crédito potencial; exige sistemas e escrituração. Quem captura mal não realiza o benefício. [F]
- Três exceções: uso e consumo pessoal (carro do sócio); compra a alíquota zero não gera crédito (mas venda a alíquota zero em geral preserva créditos anteriores); **crédito depende de o fornecedor ter efetivamente recolhido** ("crédito amplo não significa crédito automático"). [F]

### 1.5 Ressarcimento do saldo credor
- LC 214/2025 cria direito estruturado ao ressarcimento em dinheiro, com prazos de **apreciação** escalonados: 30 dias (contribuinte em programa de conformidade e pedido enquadrado nas categorias abaixo), 60 dias (créditos de ativo imobilizado ou pedidos até 150% da média mensal da diferença créditos–débitos), 180 dias (demais). Vencido o prazo sem manifestação, concluída a fiscalização ou atingidos 360 dias, pagamento em até 15 dias. Fiscalização suspende o prazo. [F, segundo o guia; verificar artigos na nota 01]
- Lição de modelagem do guia: contar com ressarcimento em 30 dias é otimista; qualquer prazo de recuperação é premissa, não consequência automática da lei. [F]

### 1.6 Tributação no destino
- IBS pertence ao destino; guerra fiscal perde objeto; crédito acumulado em travessias interestaduais deixa de existir. Empresas cuja malha logística foi definida por incentivo podem ter pegada subótima (risco e oportunidade de reotimizar). [F]

### 1.7 Alíquotas
- LC 214 não fixa percentual; Senado define alíquotas de referência para manter a carga. Estimativa do Ministério da Fazenda citada: cerca de **26,5%** (aprox. **8,8% CBS + 17,7% IBS**). "26,5% não é lei." Deve ser célula de premissa com sensibilidade. [F]
- **Serviços intensivos em mão de obra são os mais afetados**: folha não gera crédito; consultoria com 90% de custo em gente paga alíquota quase cheia sobre a venda; supermercado credita quase todo o custo. [F] — Implicação direta para a própria empresa de consultoria em estudo [E].

### 1.8 Cronograma da transição (tabela do guia)
| Ano | O que acontece | Tributos vigentes | Efeito financeiro (segundo o guia) |
|---|---|---|---|
| 2026 | Ano de teste: CBS 0,9% e IBS 0,1% na nota, só para calibrar | Cinco antigos integrais + CBS/IBS simbólicos | Nulo; quem cumpre obrigações acessórias fica dispensado do recolhimento |
| 2027 | CBS cheia; PIS/Cofins extintos; IPI zero (exceto ZFM); começa IS; **começa a implantação do split payment** | ICMS e ISS integrais + CBS cheia | "Primeiro choque de caixa" |
| 2028 | Consolidação da CBS; IBS segue em teste | idem | Estabilização; auditar captura de créditos |
| 2029 | IBS a 10% do cheio; ICMS/ISS a 90% | três sistemas convivem | "Pico de complexidade operacional" |
| 2030 | IBS 20%; ICMS/ISS 80% | idem | Benefícios fiscais estaduais encolhem |
| 2031 | IBS 30%; ICMS/ISS 70% | idem | Revisar preços e contratos longos |
| 2032 | IBS 40%; ICMS/ISS 60%; último ano do ICMS | idem | Fechar e homologar saldos credores |
| 2033 | ICMS/ISS extintos; IBS integral | CBS, IBS, IS (IPI residual ZFM) | Sistema novo completo |

- Duas simplificações didáticas que o guia declara: em 2027–2028 o IBS fica em 0,1% com CBS reduzida em 0,1 p.p. (líquido ~zero); em 2026 o modelo não lança CBS/IBS por causa da dispensa. [F]
- Detalhe de modelagem: "ICMS cai para 90%" é fração da alíquota (18% → 16,2% → 14,4% → 12,6% → 10,8% → 0), não desconto em pontos. [F]

### 1.9 Split payment e o fim do float tributário
- Hoje: empresa recebe o valor cheio e recolhe semanas depois; o imposto em trânsito ("float tributário") é capital de giro gratuito de cerca de um mês de imposto. Exemplo: supermercado com R$ 100 mi/mês de venda e R$ 5 mi de imposto gira os R$ 5 mi por ~1 mês. [F]
- Com split: o sistema de pagamentos separa a parcela do imposto no ato e envia ao governo; no procedimento padrão, a parcela corresponde ao débito real da operação; no simplificado, percentual estimado com acerto posterior. A empresa recebe só o líquido. [F]
- Split **não aumenta o imposto devido**; muda o momento. Para margem estreita e giro alto (varejo alimentar), perder um mês de fôlego é material. [F]
- Implantação gradual, depende de regulamentação e da infraestrutura de pagamentos; dinheiro em espécie não passa pelo split. [F]
- **Alavanca**: a perda do float é igual para todos; o que diferencia é a preparação prévia (renegociar prazo com fornecedor, reforçar caixa, ajustar sistemas). Quem não se preparou tapa o buraco com dívida de curto prazo, cara. [F]
- DPO (prazo médio de pagamento a fornecedores): alongar compensa a perda do float, mas tem custo comercial; DPO que sobe por negociação estruturada ≠ DPO que sobe por atraso (estresse de liquidez). [F]

### 1.10 Disciplina fiscal: por que o crédito amplo não é automático
- Três pilares: escrituração correta (código errado deixa o valor fora da apuração), ERP preparado (calcular CBS/IBS, identificar aquisições elegíveis, separar créditos de mercadorias e de despesas, novo leiaute), nota idônea (fornecedor regular; vira política de compras: revisar cadastros, validar documentos, acompanhar regularidade de fornecedores). [F]
- **Ciclo do crédito** (vocabulário útil para produto): potencial → pendente/bloqueado (fica no ativo em regularização, consome capital de giro) → apropriado/disponível → utilizado (compensado) ou ressarcido (vira caixa); rejeitado (vira perda no CMV ou SG&A); estornado (perde validade depois de apropriado). [F]

### 1.11 Regimes tributários
- **Lucro Real**: continuidade conceitual (já é não cumulativo a 9,25%); desafio operacional é volume de créditos e dois sistemas em paralelo 2029–2032. [F]
- **Lucro Presumido**: "o choque mais severo". Hoje 3,65% cumulativo sem crédito; em 2027 CBS a ~8,8% com crédito. Quem tem muitos insumos tributáveis compensa; **serviços intensivos em folha veem a alíquota mais que dobrar sem crédito suficiente**. A partir de 2027 a escolha Real × Presumido passa a ser orientada por IRPJ/CSLL. [F]
- **Simples Nacional e regime híbrido**: empresa continua no Simples mas IBS/CBS saem do DAS e são apurados pelas regras gerais. Fornecedor 100% no DAS transfere crédito limitado ao efetivamente recolhido dentro do Simples; fornecedor híbrido transfere crédito potencialmente integral. Para B2C é pouco relevante; para cadeia B2B, mapear o regime dos fornecedores vira due diligence. Sublimite de R$ 3,6 milhões: acima dele ICMS/ISS já saem do DAS; a legislação estende o sublimite ao IBS; a CBS não segue necessariamente a mesma dinâmica. [F]

## 2. Estudo de caso do guia: Rede Meridiano (prepara cedo) × Rede Aurora (prepara tarde)
Duas redes fictícias idênticas em operação; só a execução difere. Valores em R$ mil; faturamento de R$ 470 mi (2025) a R$ 731 mi (2033).

| Variável | Meridiano (early adopter) | Aurora (late adopter) |
|---|---|---|
| Custos de adaptação | R$ 3.000 (2026–28) | R$ 4.300 (2028–32) |
| Multas e contingências | 0 | R$ 3.300 |
| Novos créditos pendentes | 0,5% | 5,0% |
| Regularização | 95% | 65% |
| Rejeição definitiva | 0% | 20% |
| DPO | 37→40 dias até 2028 | ~37 dias até 2033 |
| Legado de ICMS | monetiza R$ 4.449 em 2033 | mantém no ativo |

Resultados: EBITDA acumulado 2025–2033 da Meridiano supera o da Aurora em **R$ 6.313 mil** (R$ 345.481 vs R$ 339.168), decomposto em R$ 1.533 menores perdas em mercadorias, R$ 180 em despesas, R$ 1.300 de menor custo de adaptação e **R$ 3.300 de multas/retrabalho/contingências evitados**. Caixa final 2033: **R$ 112.991 vs R$ 99.046, gap de R$ 13.944 mil** (EBITDA R$ 6.313; menos IR adicional R$ 2.146; capital de giro +R$ 6.371, dos quais ~R$ 2.044 de créditos presos evitados e ~R$ 4.327 de DPO; legado +R$ 4.449; dividendos adicionais −R$ 1.042). Margens EBITDA em 2033 quase iguais (9,1% vs 9,0%): o valor vem de execução, não de margem. [F]

Leitura temporal: a Meridiano tem EBITDA **menor** em 2026 e 2027 (está investindo) e só ultrapassa em 2028. O bridge acumulado evita a conclusão errada de julgar o early adopter pelo custo inicial. [F]

Premissas comuns do caso: 40% das despesas operacionais elegíveis a crédito IBS/CBS; 15% elegíveis no sistema antigo; split payment de 100% como simplificação; base do IBS/CBS líquida de ICMS/PIS/Cofins durante a coexistência 2027–2032. [F]

Monetização do legado: R$ 10.000 de valor de face de saldo credor de ICMS = R$ 4.449 a valor presente, com 240 parcelas e taxa real de 10% a.a. [F]

### 2.1 O que o caso implica para a tese de negócio [E — interpretação minha]
- **Benchmark de disposição a pagar por adaptação**: uma varejista de R$ 500 mi/ano gasta R$ 3,0 mi (0,6% de um ano de receita) para se adaptar cedo e evita R$ 7,6 mi (adaptação tardia + multas). Para empresas menores o custo não escala linearmente para baixo (há piso de horas), mas a proporção "preparar cedo custa menos que a metade de preparar tarde" é um argumento de venda quantificável.
- **O argumento de venda é temporal**: o cliente que se prepara em 2026–2027 piora o resultado no curto prazo e só vê o retorno em 2028+. Isso explica por que a demanda é difícil de antecipar (dono de PME olha o EBITDA do ano) e por que o "pitch" precisa ser em caixa e risco, não em margem.
- **Vocabulário de produto pronto**: ciclo do crédito (potencial/pendente/apropriado/utilizado/ressarcido/rejeitado/estornado) é um painel de software. Checklist de due diligence (ciclo do crédito, sistemas, fornecedores, legado, capital de giro, base tributável, contratos) é o escopo de um diagnóstico de consultoria.
- **A própria consultoria é "perdedora" da reforma** (serviço intensivo em folha, provavelmente no Presumido ou Simples): precisa modelar seu próprio preço e regime desde o início (ver nota 06).

## 3. Implicações para private equity (seção 5 do guia) e sua tradução para o negócio
Riscos de destruição de valor listados: benefícios de ICMS com data de validade; redução da substituição tributária (preços, margens, créditos, processos no varejo); serviços intensivos em mão de obra; contratos plurianuais sem cláusula tributária; cadeia de fornecedores no Simples puro em negócios B2B; contencioso herdado (extinção dos tributos não extingue processos de períodos anteriores); créditos bloqueados sem trilha de regularização. [F]

Proteção de valor: captura e regularização de créditos (ERP, escrituração, documentação); prevenção de perdas e contingências (R$ 5.013 dos R$ 6.313 de gap vêm daí); gestão de capital de giro contra o split (DPO, liquidez); **normalização da base de comparação** (CBS/IBS "por fora" mudam o patamar de receita e margens reportadas; comparar períodos sem normalizar gera conclusão errada). [F]

Criação de valor: monetização do legado de ICMS (documentar, homologar, avaliar a VP); arbitragem de preço na aquisição; reotimização logística; reorganizações societárias para uso de saldos credores; orientação da cadeia de fornecedores (ajudar fornecedores-chave a corrigir documentos ou avaliar o regime híbrido). [F]

Checklist de due diligence tributária (7 áreas): ciclo do crédito; sistemas (ERP calcula CBS/IBS e despesas elegíveis?); fornecedores (regime, documentos, regularidade); legado (face, homologação, prazo, VP); capital de giro (DPO, float, créditos bloqueados, revolver); base tributável (exclui ICMS/PIS/Cofins na coexistência?); contratos (cláusulas de revisão tributária). [F]

Conclusão do guia: a reforma busca neutralidade agregada, mas não produz neutralidade entre empresas; o resultado depende de sistemas, documentação, contratos, fornecedores e decisões de liquidez. [F]

## 4. Lista de "serviços vendáveis" que o guia implicitamente descreve [E]
1. Diagnóstico de impacto por regime e setor (carga efetiva antes/depois; vencedores e perdedores; Presumido-serviços como alvo prioritário de dor).
2. Plano de adaptação cedo (sistemas, cadastros, escrituração, política de compras/fornecedores) com o caso Meridiano×Aurora como argumento.
3. Mapeamento da cadeia de fornecedores (Simples puro × híbrido × regime geral) e orientação de fornecedores-chave.
4. Revisão de contratos plurianuais (cláusulas de reequilíbrio tributário).
5. Preparação de caixa para o split payment (simulação de perda de float, DPO, linhas de liquidez).
6. Gestão do ciclo do crédito (recorrente; candidato a software): pendências, bloqueios, rejeições, estornos, pedidos de ressarcimento e prazos.
7. Homologação e monetização do saldo credor legado de ICMS (240 parcelas).
8. Normalização de demonstrações (receita e margem "por fora") para comparabilidade, covenants e valuation.
9. Due diligence tributária da reforma para M&A (nicho de maior ticket: compradores, fundos, bancos).

## 5. Limitações do guia que o estudo precisa cobrir por outras fontes
- Não traz números de mercado, nem de preços de consultoria, nem de concorrentes.
- Não detalha artigos da LC 214 nem atos infralegais (notas técnicas, atos do Comitê Gestor, regulamentação do split): cruzar com notas 01 e 02.
- Alíquota 26,5% e cronograma do split são estimativas/previsões na data em que foi escrito; verificar o estado em 1º/11/2026.
- Foco em varejo de grande porte e em private equity; a tradução para PMEs e para contadores é inferência minha.
