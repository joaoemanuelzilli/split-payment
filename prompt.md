# Prompt mestre — Estudo de oportunidade: Reforma Tributária do Consumo e Split Payment

Versão 2.0 · 1º de novembro de 2026 · @ZIZA (original) com reforço de Claude
A versão 1.0 está preservada em `prompt.original.md`. Tudo que a v2 acrescentou está marcado com **(novo)** ou **(reforçado)**.

---

## Papel e postura

Você é um analista sênior de estratégia e venture capital no Brasil, com experiência em estudos de mercado, modelagem financeira de empresas nascentes e regulação. **(reforçado)** Você também é operador: já construiu empresas de serviços profissionais e de software B2B e sabe que o plano no papel nunca sobrevive ao primeiro cliente. Seu trabalho é dizer, com números e fontes, se vale a pena criar uma empresa para atender a uma demanda que deve surgir com uma mudança, e como fazer isso. Faça um estudo completo com dados atualizados até hoje (**1º de novembro de 2026**). Responda em português.

O ônus da prova está na tese. A maioria das empresas novas fecha nos primeiros anos: parta das taxas-base reais e só conclua que vale a pena se os números sustentarem. Um "não vale" bem fundamentado é tão útil quanto um "vale".

## Regras de verdade **(novo)**

1. **Data de referência: 1º de novembro de 2026.** Seu conhecimento interno pode estar defasado em meses. Tudo que é "estado atual" (leis, prazos, regulamentos, status de tramitação, preços, salários, juros, concorrentes, rodadas) vem da web, com link e data de acesso. Se não puder navegar, diga isso na primeira linha e marque todo número como não verificado.
2. **Toda afirmação sobre lei cita o diploma e o artigo.** Toda data diz se "já ocorreu", "está marcada em norma" ou "é previsão de alguém" (de quem).
3. **Diferencie cinco estados de uma regra:** em vigor e aplicada; em vigor sem regulamento; regulamentada mas com prazo futuro; em tramitação; judicializada. Não trate "previsto na lei" como "acontecendo".
4. **Marcação obrigatória em todo número:** [F] fato com fonte; [E] estimativa sua (mostre a conta); [H] hipótese que precisa ser validada em campo.
5. **Quando duas fontes divergirem**, mostre ambas, explique a divergência e diga qual usa e por quê.
6. **Separe evidência de opinião do cliente:** o que ele JÁ FEZ e JÁ PAGOU vale; o que ele DIZ que fará vale pouco (teste da mãe, Rob Fitzpatrick).
7. **Nenhuma frase que serviria para qualquer negócio.** "É preciso ter bom marketing" não entra. "Contadores de cidades médias cobram R$ X por cliente e perdem Y% da base por ano, logo…" entra.
8. **Conclusão com a mesma convicção nos dois sentidos.** "Não vale" ou "vale só se" são respostas completas, não fracasso do estudo.
9. **Quando não encontrar um dado, diga que não encontrou**, estime com a conta aberta e proponha o jeito mais barato de obtê-lo (entrevista, pré-venda, pedido de informação via LAI, consulta a base aberta).

## Contexto (preenchido)

- **A mudança:** Reforma Tributária do Consumo no Brasil. Emenda Constitucional 132/2023; Lei Complementar 214/2025 (institui IBS, CBS e Imposto Seletivo); segunda lei complementar de regulamentação (PLP 108/2024, sancionada no início de 2026, verificar número e conteúdo: Comitê Gestor do IBS, processo administrativo, ITCMD etc.); regulamentos da Receita Federal e do Comitê Gestor; notas técnicas dos documentos fiscais eletrônicos (NF-e, NFC-e, NFS-e). Transição longa com **coexistência de regras antiga e nova**: 2026 ano-teste (CBS 0,9% e IBS 0,1%, com dispensa condicionada às obrigações acessórias); 2027 CBS em alíquota cheia e extinção de PIS/Cofins, entrada do Imposto Seletivo, IPI reduzido; 2029 a 2032 redução gradual de ICMS e ISS com IBS subindo; 2033 regime pleno. **Split payment** (recolhimento do tributo no momento da liquidação financeira) previsto na LC 214, com implementação faseada a partir de 2027 (verificar status e cronograma).
- **A demanda que acredito que vai surgir:** relato de um empresário da minha cidade: empresas de todos os portes terão dúvidas sobre as regras duplas, errarão e deixarão de tomar as melhores decisões (regime, preço, crédito, contratos, fluxo de caixa sob split). Quem oferecer orientação prática e depois ferramenta pode capturar a onda. Isto é **opinião de um cliente potencial**, não evidência: trate como hipótese nº 1 a validar.
- **Minha ideia inicial de empresa:** começar com consultoria (diagnóstico de impacto, adequação, precificação, decisão de regime) e evoluir para software (simulador de carga e preço, motor de cálculo na transição, conciliação do split payment, monitoramento de crédito). Clientes: pequenas e médias empresas e seus contadores; cobrança por projeto no início e assinatura depois.
- **Geografia:** Brasil. Início por **Uberlândia (MG)**, cidade do fundador [F]: segunda maior de Minas Gerais (cerca de 700 mil habitantes), polo nacional de atacado-distribuidor e logística (Martins, Arcom, Peixoto e outros), agronegócio do Triângulo Mineiro, sede da Sankhya (ERP) e do grupo Algar; ecossistema local com ACIUB, CDL, Sebrae-MG, Fiemg, UFU e BDMG/FAPEMIG como fontes de fomento. Expansão remota para o Triângulo Mineiro, Minas e depois nacional.
- **Meu perfil — PREMISSAS ADOTADAS NA AUSÊNCIA DE RESPOSTA, corrigir se errado:** capital disponível R$ 100 mil [H]; perda máxima aceitável R$ 100 mil [H]; dedicação integral [H]; competências: tecnologia e desenvolvimento de software, **sem formação contábil ou jurídica** (a confirmar) [H]; contatos: ao menos um empresário local que relatou a dor [F]; aceito sócios ou investidores: sim [H].
- **Minha renda atual, que deixaria de ganhar:** R$ 10 mil por mês [H, substituir].
- **O que já sei ou suspeito:** uma conversa com um empresário local; hipótese de que a dor começa em 2026/2027 e cresce até 2033; hipótese de que contadores serão o canal natural e também o concorrente natural.

## Perguntas que eu deveria responder antes **(novo)** — se não responder, o estudo adota a premissa mais razoável, declara e segue

1. ~~Cidade e estado?~~ Respondido: Uberlândia, MG. (Implica ISS municipal de Uberlândia, benefícios de ICMS de Minas Gerais, perfil setorial de atacado, logística e agro, contadores locais, FAPEMIG e BDMG para financiamento.)
2. Sou contador, advogado, administrador ou desenvolvedor? Tenho sócio com registro no CRC ou na OAB?
3. Capital e perda máxima reais, em reais?
4. Renda atual e por quantos meses sobrevivo sem ela?
5. Que acesso tenho hoje a contadores, associação comercial, CDL, sindicatos patronais e Sebrae local?

## Parâmetros (use exatamente estes, salvo indicação em contrário)

- Taxa de desconto do capital próprio: 35% ao ano na fase de validação, caindo até 20% quando o negócio estiver maduro (receita recorrente e lucro). Explique a curva.
- g (crescimento na perpetuidade): 3% nominal. Calcule também o valor terminal por múltiplo de saída (seção 7).
- Projeções mensais nos primeiros 24 meses e anuais até 2036.
- Horizonte para a comparação com renda fixa: 5 anos.
- Critérios mínimos de decisão: TIR de CDI + 10 p.p. ao ano; payback de até 4 anos; pró-labore de R$ 8 mil por mês a partir do mês 7 [H].

## Como trabalhar

- Se você tiver agentes ou subagentes, divida o trabalho e rode em paralelo o que for independente:
  1. **Agente da mudança:** texto oficial, cronograma, status, chance de adiamento, precedentes no Brasil e no exterior.
  2. **Agente do split payment (novo):** mecânica, modalidades, cronograma, impacto no caixa, precedentes (Polônia, Itália, Romênia), dificuldades e oportunidades.
  3. **Agente de mercado e demanda:** clientes, tamanho, disposição a pagar, curva da demanda no tempo, pesquisas de prontidão.
  4. **Agente de concorrência:** incumbentes, startups, substitutos (inclusive ferramentas gratuitas da Receita e do Sebrae), quem já está se mexendo, preços praticados.
  5. **Agente de operação e custos:** equipe, salários, fornecedores, capex, licenças, prazos, CAC, churn, unit economics.
  6. **Agente jurídico-tributário e de financiamento:** quem pode prestar consultoria tributária (CRC, OAB), forma societária, regime tributário da própria empresa na transição, linhas de crédito, investidores, editais, juros de hoje.
  7. **Agente advogado do diabo:** tenta derrubar a tese com evidências: quem tentou e falhou, por que a demanda pode não vir, por que um player grande ou o próprio Estado pode levar o mercado. Precedentes das ondas SPED, NF-e, eSocial e LGPD.
  8. **Agente do playbook (novo):** como construir a empresa do zero a muitos clientes, com casos reais (Brasil e exterior) e conselhos de grandes empresários e CEOs, sempre citando a fonte (livro, carta, entrevista).
  9. **Agente das dores por perfil (novo):** o que muda de fato, por tipo de empresa, com exemplos numéricos de uma nota fiscal em 2026, 2027, 2029 e 2033; o que é consultorável (pontual) e o que é softwareável (recorrente).
  10. No fim, um **agente revisor independente**: refaz as contas do modelo do zero, confere cada número relevante contra a fonte, lista as 10 afirmações mais frágeis e aponta incoerências entre seções. Se não tiver agentes, faça essas etapas você mesmo, em sequência.
- Pesquise na web tudo que é "estado atual": leis e prazos, tamanho de mercado, concorrentes, preços, salários, juros, tributos, linhas de crédito. Não use números de memória para nada disso.
- Prefira fontes primárias: Diário Oficial e Planalto, Receita Federal, Comitê Gestor do IBS, Senado e Câmara, Ministério da Fazenda, Banco Central, IBGE, dados abertos de CNPJ da Receita Federal (empresas por CNAE e município), Mapa de Empresas (MDIC), RAIS e CAGED, Portal Nacional de Contratações Públicas, balanços de empresas abertas do setor, CFC e Fenacon, associações setoriais e Sebrae. Relatórios de consultoria e notícias entram como complemento, sempre com data.
- Cite a fonte, com link e data, de cada número relevante, com a marcação [F], [E] ou [H].
- Se encontrar uma oportunidade melhor na mesma mudança (outro elo da cadeia, outro cliente, vender a pá em vez de garimpar), aponte e compare com a minha ideia.

## 0) A tese em uma frase

- Reescreva a tese assim: "Por causa de [mudança], a partir de [data], [cliente] vai precisar de [solução], e uma empresa nova consegue capturar [parcela] porque [vantagem]."
- Liste de 5 a 8 hipóteses que precisam ser verdade para a tese funcionar, da mais arriscada para a menos arriscada. As seções seguintes devem testar cada uma. No final, diga quais se confirmaram, quais caíram e quais seguem em aberto.
- **(novo)** Inclua obrigatoriamente estas hipóteses: (a) a dor existe cedo o bastante (2026–2028) para empresas fora do Lucro Real, ou só chega em 2029+; (b) PMEs pagam por orientação tributária além do que já pagam ao contador; (c) o contador é canal e não concorrente; (d) um fundador sem CRC/OAB consegue vender credibilidade; (e) o Estado (apuração assistida, calculadora oficial) não elimina a necessidade de cálculo privado.

## 1) A mudança (o gatilho)

- O que muda exatamente: base legal (número da lei e artigos), quem é obrigado ou afetado, o que passa a ser exigido ou possível.
- Cronograma: publicação, regulamentação, vigência, fases e prazos de adaptação. Monte uma linha do tempo com datas.
- Status hoje: aprovado, regulamentado, em consulta pública, em tramitação ou judicializado, com fonte oficial.
- Chance de acontecer no prazo: histórico de adiamentos de normas parecidas no Brasil, pressão dos setores afetados, ações judiciais, calendário eleitoral (eleições de outubro de 2026 e posição dos eleitos), capacidade de fiscalização. Estime a probabilidade de atraso de 6, 12 e 24 meses e de revogação ou diluição.
- Se a demanda nasce de obrigação: quem fiscaliza, qual a punição e se a fiscalização é real. Obrigação sem punição crível não gera demanda.
- Precedentes: países, estados ou setores onde algo parecido já aconteceu (Índia GST 2017, Canadá HST, Austrália GST 2000, UE). O que houve com a demanda, quanto durou a janela, quem capturou o valor, se virou commodity e o que aconteceu com os preços.
- Natureza da demanda: pico de adequação ou necessidade recorrente? Quantifique os dois componentes separadamente.
- **(novo) Específico desta reforma:** a regra dual ano a ano (o que coexiste em 2026, 2027, 2028, 2029–2032, 2033); a dispensa do pagamento em 2026 condicionada às obrigações acessórias; a apuração assistida pela administração; a classificação tributária (cClassTrib) e os novos campos dos documentos fiscais; o crédito financeiro amplo e o crédito condicionado ao pagamento; a opção do optante do Simples por recolher IBS/CBS fora do Simples e seu efeito em vendas B2B; os regimes específicos e diferenciados; o fim gradual dos benefícios de ICMS e da substituição tributária; a Zona Franca; o cashback.

## 1b) Split payment **(novo)**

- Base legal e artigos; modalidades (inteligente, simplificado, recolhimento pelo adquirente); quem opera (instituições de pagamento, arranjos, Pix, cartão, boleto) e o papel do Banco Central.
- Cronograma real: pilotos, obrigatoriedade por fase e por tributo, atos publicados até hoje, manifestações de Febraban, Abecs, Zetta e outras.
- Efeito no caixa das empresas: perda do "float" do tributo, saldo credor, devoluções, parcelamento, antecipação de recebíveis, conciliação, integração entre ERP, meio de pagamento e documento fiscal.
- Precedentes: Polônia, Itália, Romênia; o que aconteceu com empresas e fornecedores de software.
- Dificuldades concretas por porte e oportunidades que o split abre (conciliação, gestão de crédito, capital de giro).

## 2) Mercado e demanda

- Cliente: segmentos (empresas, consumidores, governo), quem usa, quem decide e quem paga em cada um. **(reforçado)** Em PMEs o dono decide e o contador influencia; em médias o controller ou CFO; em grandes a diretoria tributária com TI.
- Tamanho (TAM, SAM e SOM) por dois caminhos: bottom-up (CNPJs ativos por regime, porte, CNAE e região × taxa de adoção × ticket × frequência) e top-down (gasto atual em contabilidade, consultoria tributária e software fiscal; analogia com precedentes). Reconcilie e use o mais conservador.
- Dor e disposição a pagar: quanto custa ao cliente não resolver (multa, perda de crédito, preço errado, perda de competitividade, capital de giro), o que ele usa hoje e quanto já gasta.
- **(novo)** Pesquisas de prontidão publicadas em 2025–2026 (consultorias, CNI, Sebrae, FGV, CFC, Fenacon): quantas empresas e quantos contadores se dizem preparados.
- Curva da demanda ano a ano até 2036, com pico e pós-pico, separando componente pontual e recorrente.
- Ciclo de venda, sazonalidade, concentração e poder de barganha do cliente.
- Sinais de demanda real hoje: Google Trends, vagas, cursos e eventos (quantidade e preço), licitações, consultas públicas, discussões em associações.

## 2b) Mapa de dores por perfil **(novo)**

Para cada perfil, diga o que muda, quando, qual a dor, qual decisão precisa tomar, quanto custa errar, e se a solução é pontual (consultoria) ou recorrente (software): MEI e ME no Simples vendendo a consumidor; ME e EPP no Simples vendendo a empresas; Lucro Presumido serviços; Lucro Presumido comércio; Lucro Real indústria; Lucro Real varejo; agronegócio; saúde; construção e imobiliário; tecnologia e SaaS; profissionais liberais; e o próprio escritório de contabilidade.

## 3) Concorrência e dinâmica competitiva

- Mapa de concorrentes: incumbentes, startups, empresas adjacentes que podem entrar e substitutos (inclusive o cliente resolver internamente, o contador absorver, não fazer nada, pagar a multa, **e as ferramentas gratuitas da Receita Federal, do Comitê Gestor e do Sebrae**).
- Tabela dos principais: oferta, preço, porte, canais, investimento recebido, pontos fortes e fracos.
- Quem já está se posicionando para a mudança: lançamentos, contratações, rodadas, parcerias.
- Barreiras de entrada, poder de clientes e fornecedores, ameaça de substitutos. Diga por que um player grande não esmagaria uma empresa nova.
- A vantagem defensável que eu poderia construir e por quanto tempo a janela fica aberta. Se não houver vantagem, diga.
- Quem tentou algo parecido, aqui ou lá fora, e falhou, e por quê.

## 4) Modelo de negócio e operação

- Compare 2 ou 3 modelos possíveis (serviço por projeto, retainer recorrente, educação e treinamento, software por assinatura, canal via contadores, marketplace) em receita, margem, capital necessário, escalabilidade e risco. Escolha um e justifique.
- Preço: compare com os concorrentes e com a disposição a pagar, e diga onde se posicionar.
- Aquisição: canais, CAC por canal (com benchmarks do setor), ciclo de venda e conversão em cada etapa do funil.
- Retenção: churn, recompra, LTV, relação LTV/CAC e payback do CAC.
- Unit economics: margem de contribuição por cliente, com todos os custos variáveis (tributos sobre a receita, taxas de meios de pagamento, comissões, suporte).
- Operação mínima para começar: equipe (cargos e salários de mercado com encargos reais), fornecedores, tecnologia, espaço, licenças, capex e prazo até a primeira venda.
- Como a operação escala: o que muda com 10, 100 e 1.000 clientes, e quais são os gargalos.
- Ponto de equilíbrio em clientes e em meses.

## 4b) Da consultoria ao software **(novo)**

- Critérios para produtizar: o que se repete em todo cliente, que dado a consultoria gera que o software pode usar, qual é o produto-cunha (wedge) mais simples que já vale assinatura.
- Escada de oferta: "faço por você" (consultoria), "faço com você" (serviço assistido por ferramenta), "você faz" (software).
- Quando começar a construir, quem constrói, quanto custa, e como não virar software house de um único cliente.
- Casos de empresas que fizeram essa transição no Brasil e fora, com o que deu certo e errado.

## 5) Jurídico, regulatório e tributário

- **(reforçado)** Quem pode prestar consultoria tributária: limites do CRC (Decreto-Lei 9.295/1946 e normas do CFC) e da OAB (Lei 8.906/1994), riscos de exercício ilegal, CNAEs adequados, responsabilidade civil do consultor, seguro de responsabilidade, contratos com cláusulas de limitação.
- Licenças, registros, certificações, alvarás necessários, com prazos e custos; registro de marca no INPI; LGPD para dados fiscais.
- Forma jurídica e acordo de sócios recomendados (inclusive vesting e cláusulas para sócio técnico contador ou advogado).
- Regime tributário da própria empresa: Simples Nacional (anexo e fator R), Lucro Presumido e Lucro Real para o faturamento projetado em cada ano, incluindo a transição da reforma (CBS, IBS, IS) e seu efeito no preço, na margem e na competitividade do Simples diante de clientes que tomam crédito.

## 6) Projeções financeiras

- DRE, fluxo de caixa e balanço simplificado: mensais nos primeiros 24 meses e anuais até 2036.
- Receita por drivers: clientes × ticket × frequência, a partir do funil (contatos, propostas, vendas). Nada de "crescimento de X% ao ano" solto.
- Rampa realista: tempo até o primeiro cliente e até o break-even, ancorado em empresas comparáveis. Ajuste para o viés de otimismo.
- Custos fixos em degraus, custos variáveis por unidade e pró-labore desde o início.
- Capital de giro: prazos reais de recebimento e pagamento; clientes grandes e governo pagam em 30 a 90 dias ou mais.
- Capex, depreciação e reinvestimento.
- Necessidade de capital: queima máxima de caixa (fundo do vale), quando ocorre, quanto aportar e com que folga. Caixa acumulado mês a mês.
- Crescimento desacelerando até perto do g. Cada premissa comparada com benchmark e justificada em uma linha.
- Margem EBITDA, margem líquida e ROIC projetados.

## 7) Valuation e viabilidade

- Fluxo do sócio com datas: aportes, retiradas, dividendos e valor terminal. VPL, TIR, payback simples e descontado, convenção de meio de período.
- Valor terminal por perpetuidade (reinvestimento = g ÷ ROIC) e por múltiplo de saída (transações de M&A do setor: tax tech, contabilidade online, consultorias; múltiplos de comparáveis abertas com desconto por tamanho e iliquidez). Se a demanda tiver prazo de validade, modele o declínio.
- Valor esperado ponderado por probabilidade, incluindo o cenário de fracasso. Use taxas de sobrevivência do IBGE e do Sebrae.
- Custo de oportunidade: TIR versus CDI (curva DI e Focus de hoje), prefixado e Tesouro IPCA+ travável hoje, brutos e líquidos de IR, mais a renda que eu deixaria de ganhar.
- Ponto de empate: clientes, receita e margem que empatam com renda fixa mais renda atual.

## 8) Sensibilidades e cenários

- Tabelas: preço × volume; CAC × churn; taxa de desconto × g; atraso da mudança (0, 6, 12 e 24 meses) × capital necessário e VPL.
- Ranking das premissas que mais movem o VPL, em R$.
- Cenários fracasso, pessimista, base e otimista, com probabilidade e trajetória explícita da variável-chave.
- Pre-mortem: daqui a 3 anos a empresa fechou; as 5 causas mais prováveis e como mitigar.
- Critérios de parada: sinais objetivos, com números e datas.

## 9) Financiamento

- Caminhos: capital próprio, dívida, anjo, venture capital, subvenção e editais; para cada um, valor, custo, prazo, garantias, diluição e exigências.
- Linhas vigentes hoje, pesquisadas (BNDES, Finep, Pronampe, bancos estaduais, fundações de amparo, Sebrae, editais setoriais).
- Investidores e aceleradoras ativos em tax tech, contabilidade e fintech B2B, com investimentos de 2024–2026.
- Estrutura de capital recomendada por fase.

## 10) Plano de validação e execução

- Para cada hipótese da seção 0 ainda em aberto: o experimento mais barato (entrevistas, landing page, pré-venda, piloto, MVP), com custo, prazo e métrica de sucesso.
- Roteiro de 10 perguntas para entrevistas com donos de PMEs e outro de 10 para contadores, focados no que já fizeram e já gastaram.
- Cronograma mês a mês até os marcos da mudança (jan/2027, jan/2029, jan/2033) e nos 12 meses seguintes ao início: o que fazer, quanto gastar e quais decisões de seguir ou parar.
- Riscos, catalisadores e datas a acompanhar.

## 10b) Plano de ação 0 → N clientes **(novo)**

- Fases: 0→1 cliente pagante; 1→10; 10→100; 100→1.000. Para cada fase: objetivo, oferta, preço, canal, equipe e organograma, métricas que importam, caixa necessário, decisões go/no-go com números e datas, o que NÃO fazer.
- Conselhos de grandes empresários e CEOs aplicados a cada fase, **sempre com a fonte** (livro, carta aos acionistas, entrevista, ensaio) e com a tradução para este negócio específico. Preferir quem construiu negócios de serviços ou software B2B ou passou por ondas regulatórias: Paul Graham, Rob Fitzpatrick, Steve Blank, Ben Horowitz, Andy Grove, Jeff Bezos, Jim Collins, Peter Thiel, Geoffrey Moore, David Maister, Alan Weiss, Jason Lemkin, Jorge Paulo Lemann, Guilherme Benchimol, Luiza Trajano, Vitor Torres, David Vélez, Warren Buffett e Charlie Munger, entre outros.
- Casos análogos de captura de onda regulatória: ClearTax na Índia (GST 2017), Avalara e Vertex nos EUA, ROIT, Arquivei, Contabilizei, Omie, Conta Azul e Domínio no Brasil, e as consultorias que surgiram com SPED, eSocial e LGPD.
- Governança mínima: conselho consultivo, rituais, controle de caixa, cultura de escrita e documentação.

## 11) Entrega

- **Entregável principal:** um arquivo `.md` completo, legível de ponta a ponta, com todas as seções acima, tabelas no próprio texto, fórmulas principais explicadas, fontes com link e data, marcação [F]/[E]/[H], e o plano de ação da seção 10b.
- **Entregável complementar, se o ambiente permitir:** planilha Excel com as abas Resumo, Premissas, Mudanca_Cronograma, Mercado, Concorrencia, Unit_Economics, Projecoes_Mensais, Projecoes_Anuais, Giro_Capex, Tributario, Valuation, Sensibilidades, Cenarios, Retorno_vs_RendaFixa, Validacao, Fontes. Fórmulas, nunca valores colados. Inputs em azul, fórmulas em preto, links entre abas em verde. Zero erros. Mudar uma premissa deve atualizar o modelo inteiro.
- Na resposta, de forma direta e curta:
  - Veredito: vale criar, não vale, ou vale só se [condições]. Grau de confiança (alto, médio ou baixo) e o que mudaria sua opinião.
  - A tese em uma frase e quais hipóteses se confirmaram, caíram ou seguem em aberto.
  - Tamanho da oportunidade, duração da janela e se a demanda é pico ou recorrente.
  - Capital necessário, fundo do vale, break-even, payback, VPL e TIR por cenário, e o valor esperado ponderado.
  - As 5 premissas que mais pesam e o racional de cada uma.
  - Comparação com a renda fixa e com a minha renda atual no horizonte.
  - Principais riscos, critérios de parada e datas a acompanhar.
  - A oportunidade alternativa melhor que você encontrou, se houver.
  - Os 3 próximos passos concretos para os próximos 30 dias, com custo.
- Termine com a lista de fontes. Deixe claro que é análise, não consultoria jurídica, contábil ou de investimento.

## 12) Revisão independente **(novo)**

- Um revisor que não escreveu o estudo refaz as contas principais do zero (TAM/SAM/SOM, unit economics, break-even, VPL e TIR), confere os 20 números mais relevantes contra as fontes, lista as **10 afirmações mais frágeis** e diz, para cada uma, se é [F], [E] ou [H] e o que a derrubaria.
- Checagens de coerência obrigatórias: o SOM cabe no SAM e no TAM; a equipe de vendas sustenta as vendas projetadas; o caixa nunca fica negativo sem aporte; as datas do plano de ação batem com o cronograma legal; o preço do plano bate com a disposição a pagar da seção 2; o veredito bate com os números.
- O que for inconsistente é corrigido no próprio documento, não só anotado.

---

## Como usar este prompt (não copie esta parte)

- Copie de "Papel e postura" até o fim da seção 12.
- Preencha o Contexto com o máximo de detalhe; é o que mais melhora a resposta. Responda as 5 perguntas da seção "Perguntas que eu deveria responder antes". Se a mudança for uma lei ou norma, anexe o texto oficial.
- Os valores entre colchetes e marcados [H] no Contexto são padrões ajustáveis. A taxa de 35% caindo a 20% reflete o risco de um negócio novo, bem acima dos 22% usados para empresas listadas.
- Use uma IA com busca na web e execução de código; se tiver modo de pesquisa profunda, ative.
- Se a resposta vier rasa ou for cortada, rode em duas etapas: primeiro as seções 0 a 3 (vale aprofundar?), depois 4 a 12 com o resultado da primeira colado no Contexto. A primeira etapa sozinha já pode matar a ideia barato.
- Com o estudo pronto, peça a outra IA que liste as 10 afirmações mais frágeis e confira as fontes delas (a seção 12 já pede isso, mas uma segunda IA independente reduz o viés).
- **(novo)** O que mudou da v1 para a v2: data fixada; Contexto preenchido com premissas declaradas; regras de verdade; agentes 2 (split payment), 8 (playbook) e 9 (dores por perfil); seções 1b, 2b, 4b, 10b e 12; hipóteses obrigatórias na seção 0; limites CRC/OAB na seção 5; ferramentas gratuitas do Estado como concorrente na seção 3; entregável principal em `.md`.
