# Contexto completo — AB-NASA-TEAM-IPE

**Missão Ipê — Ciência que chega · R8 · 14/11/2026 · pt-BR.**

## Escopo deste registro

Consolidação das mensagens disponíveis e arquivos preservados; não é transcrição literal de todo o chat. P&D: elegibilidade e Resources pendentes. GitHub privado publicado e conferido durante R8; recibos registram o corte de cada publicação. Marcações pessoais não alteram evidência oficial.

Este documento conecta o histórico do pedido à decisão de produto. A base tem corte editorial às 09h45 BRT; a criação remota GitHub foi atualizada durante a integração R8 e o recibo final da coordenação determina o estado de envio/publicação. O contexto não reconstrói mensagens ausentes, não mistura trabalho de outros projetos e não publica dados de autenticação.

**Resposta direta:** AB escolheu explicitamente Jogo de Missão. A pesquisa sustentou manter essa escolha pela afinidade com UX Research, produto, dados e engenharia e pela possibilidade de demonstrar uma cadeia científica pequena. Não existe probabilidade calculada de classificação mundial. O diferencial a provar é compreender e conferir por que a ciência chega ao solo.

## 1. O problema inicial

**Selecionar um desafio capaz de transformar o repertório de AB em uma entrega demonstrável.**

AB apresentou oito temas dentre um conjunto local de quatorze e pediu pesquisa mundial, referências brasileiras, tendências, repositórios e uma estratégia para representar o Brasil. A análise procurou afinidade com produto, UX Research, dados, inovação e engenharia. Faltavam notas de jurados, universo comparável e composição efetiva da equipe para estimar probabilidade de premiação.

Na mensagem seguinte, AB escolheu expressamente Jogo de Missão e trouxe o showroom Kapsch como referência para seleção visual de ambientes. Os pedidos evoluíram para PRD, PRT, Mermaid, Prisma, dossiê, handoff, jogo local, apresentação e publicação. A seleção não foi atribuída a uma pontuação matemática que não existiu.

Este contexto reconstrói mensagens disponíveis e arquivos preservados. Não é transcrição literal de todo o chat nem inclui conversas externas ausentes. Credenciais, sessões e conteúdo privado de outros projetos AB não pertencem à publicação.

Fontes: [S02 — Space Mission Design Game](https://www.spaceappschallenge.org/2026/challenges/space-mission-design-game/); [S22 — Kapsch Experience](https://experience.kapsch.net/es); [P08 — Biblioteca integral de pesquisas](../context/research-library.html); [P10 — Autoria e IA](../docs/AUTORIA-E-IA.html).

## 2. Por que Jogo de Missão

**A escolha reúne UX Research, desenho de decisões, dados e implementação verificável.**

UX Research entra no desenho da tarefa e na observação do raciocínio. Design de produto organiza restrições e consequências compreensíveis. Dados sustentam validade e procedência. Engenharia transforma essas relações em regras que outra pessoa consegue executar e conferir. A adequação ao perfil de AB é uma inferência fundamentada, sem atribuir competências não informadas aos demais membros.

CLPS, astronomia temporal, SAR, harmonização entre sensores e navegação marciana exigiriam fechar cadeias científicas adicionais antes da demonstração. No jogo, um recorte pequeno permite concentrar esforço em uma decisão significativa e verificável. O critério foi tornar possível investigar e explicar a falha, não acumular cenários, modelos ou interfaces.

Não há probabilidade calculada de chegar à final. A decisão de manter o tema reduziu troca de contexto e preservou o investimento existente. A hipótese competitiva é uma combinação demonstrável de ciência entregue, consequências acopladas, investigação e reexecução. A aprendizagem ainda precisa de observação com pessoas.

Fontes: [S10 — Design and Develop Science Missions](https://ntrs.nasa.gov/citations/20250002492); [S11 — CubeSat 101](https://science.nasa.gov/wp-content/uploads/2023/06/nasa_csli_cubesat_101_508.pdf); [S36 — Build It Yourself](https://science.nasa.gov/mission/webb/game-build-it-yourself/); [P01 — Verificação pública](../docs/09-VERIFICACAO.html); [P08 — Biblioteca integral de pesquisas](../context/research-library.html).

## 3. Por que Terra, CubeSat e Rio Verde

**Uma missão pequena torna a ciência e os limites de engenharia auditáveis.**

Missão Ipê — Ciência que chega pergunta se um satélite que coletou dados entregou resultados úteis ao solo. O primeiro cenário usa uma nave didática de observação da Terra, seis decisões e registros históricos de vegetação. Não reproduz operacionalmente Terra/MODIS nem promete planejar um voo.

Três coordenadas solicitadas no entorno de Rio Verde e duas composições de 2024 formam seis registros MOD13Q1.061. O vínculo regional dá sentido à pergunta e à linguagem. Não comprova parceria, demanda educacional, diagnóstico agronômico ou impacto humano. NDVI isolado não é uma conclusão sobre desmatamento ou saúde da lavoura.

O perfil orbital e o lançamento estão fixos. Marte continua como expansão proposta: terreno, riscos e navegação precisariam mudar decisões reais do motor e ter dados/validação próprios. Uma imagem marciana não torna esse cenário integrado. Adiar essa cadeia preserva uma demonstração terrestre completa no seu recorte.

Fontes: [S12 — MOD13 C6.1 User Guide](https://modis-land.gsfc.nasa.gov/pdf/MOD13_User_Guide_V61.pdf); [S13 — MOD13Q1.061 — DOI](https://doi.org/10.5067/MODIS/MOD13Q1.061); [S14 — Serviço MODIS de extração](https://modis.ornl.gov/data/modis_webservice.html); [P02 — Origem dos dados](../docs/ORIGEM-DOS-DADOS.html); [P06 — Revisão Space Apps R5](../research/11-revisao-spaceapps-apresentacao.html).

## 4. Dados que determinam vitória

**Procedência, QA, completude e cálculo têm consequências no resultado.**

MOD13Q1 é um produto processado com composições de 16 dias. O jogo de 180 minutos não simula aquisição instantânea desses pixels. Bandas, escala, QA, datas e referências são preservados; coordenada solicitada não é centro exato garantido do pixel.

A tarefa exige seis NDVIs utilizáveis. Só registros completos, únicos, aceitos pelo QA e conferidos numericamente contam. Parte dos bytes recebida, duplicata ou dado inválido não completam a missão. BANDAS transmite vermelho e infravermelho próximo; ÍNDICE calcula NDVI a bordo, alterando processamento e payload sem mudar a pergunta atual.

EVI3 foi recalculado em pesquisa nos seis registros, com diferença inferior a 0,0001 do produto. Isso abre uma pergunta futura sobre perda de possibilidade de reprocessamento ao transmitir apenas um índice. A missão EVI não foi implementada; a constante na fórmula impede cancelar ingenuamente a escala como no NDVI.

Fontes: [S12 — MOD13 C6.1 User Guide](https://modis-land.gsfc.nasa.gov/pdf/MOD13_User_Guide_V61.pdf); [S13 — MOD13Q1.061 — DOI](https://doi.org/10.5067/MODIS/MOD13Q1.061); [S14 — Serviço MODIS de extração](https://modis.ornl.gov/data/modis_webservice.html); [S15 — NDVI e EVI](https://science.nasa.gov/earth/earth-observatory/measuring-vegetation-ndvi-evi/); [P01 — Verificação pública](../docs/09-VERIFICACAO.html); [P02 — Origem dos dados](../docs/ORIGEM-DOS-DADOS.html).

## 5. O motor e a cadeia causal

**O catálogo pequeno permite conferir todas as alternativas.**

Seis escolhas binárias — bateria, painel, representação, rádio, armazenamento e política de contato — geram 64 configurações por condição, 128 nos dois cenários. Massa total e créditos são limitados a 3,6 kg e 86. Os parâmetros são hipóteses didáticas versionadas; não são especificações NASA de um satélite real.

A base entrega 6/6 com contatos longos e 2/6 com contatos curtos. No caso curto, o replay registra 460,8 Mbit recebidos e 619,2 Mbit na fila. Alterar somente para ÍNDICE viola potência aos 600 segundos. Bateria grande + ÍNDICE entrega 6/6, com 3,5 kg e 84 créditos.

Todas as sete configurações a distância zero ou um da base curta falham; a testemunha a distância dois é a configuração citada. Isso demonstra a menor quantidade de escolhas alteradas no catálogo e cenário fixos. Não é ótimo universal de engenharia, menor custo industrial ou prova de causa única. Energia acumulada e potência instantânea permanecem restrições distintas.

Fontes: [P01 — Verificação pública](../docs/09-VERIFICACAO.html); [P07 — Apresentação HTML](../presentation/Missao_Ipe_Apresentacao.html); [P08 — Biblioteca integral de pesquisas](../context/research-library.html).

## 6. A experiência e a referência Kapsch

**A cena orienta a decisão e tem alternativa HTML/2D.**

Kapsch foi referência de gramática de navegação: contexto espacial, pontos de interesse, câmera e painéis. Não foi inferida a tecnologia interna do showroom nem incorporado código, marca ou asset proprietário. A proposta traduz a interação para um ambiente de missão autoral.

React e Three.js implementam uma cena procedural conceitual. Controles HTML preservam seleção, configuração, execução e investigação quando WebGL não está disponível. A simulação é independente do FPS; a linha do tempo apresenta o traço já calculado. Ilustração não significa efeméride ou escala física.

A apresentação tem sete quadros principais, oito apêndices, notas PT/EN e texto inglês de preparação. O demonstrador usa o núcleo real. O próximo teste é com pessoa nova e equipamento final: prever, executar, explicar e redesenhar. Testes DOM não medem entendimento, contraste, leitor de tela ou foco nativo.

Fontes: [S22 — Kapsch Experience](https://experience.kapsch.net/es); [S23 — Three.js](https://github.com/mrdoob/three.js); [P01 — Verificação pública](../docs/09-VERIFICACAO.html); [P07 — Apresentação HTML](../presentation/Missao_Ipe_Apresentacao.html).

## 7. Arquitetura local e persistência

**O caminho de cálculo não depende de IA remota ou backend de produto.**

Dados e dependências de runtime foram empacotados. A distribuição pode ser servida em loopback e há HTML portátil. O pacote pronto não exige npm para servir os arquivos, mas isso não é uma imagem de sistema completo nem prova de execução de agentes Astra no equipamento de AB.

Worker de módulo separa o cálculo da interface; validação, timeout e cancelamento tratam resultados inválidos ou obsoletos. No modo portátil, o thread principal executa o mesmo motor. IndexedDB conserva execuções; o diário é local. Importação valida estrutura, versões e reexecuta a alegação.

Hash detecta diferença contra bytes esperados, sem autenticar autoria ou tornar o diário inviolável. Prisma é schema validado para evolução, sem backend ou sincronização ativos. Uma camada remota adicionaria concorrência, migração e controle de acesso antes de existir benefício demonstrado para a tarefa atual.

Fontes: [P01 — Verificação pública](../docs/09-VERIFICACAO.html); [P03 — Mapa Archify](../architecture/index.html); [P08 — Biblioteca integral de pesquisas](../context/research-library.html).

## 8. O que aprendemos com o mundo e o Brasil

**Precedentes mostram possibilidades; não fornecem fórmula de vitória.**

O catálogo histórico cobriu 30 Global Winners de 2023–2025, dez categorias por edição. Global Nominee, Finalist, Winner e Honorable Mention foram separados. País do evento não foi tratado como nacionalidade individual. Não foram recuperadas notas ou avaliações comparáveis suficientes para explicar causalmente cada prêmio.

LunarTech Ensemble e TeamVoyagers em 2023, Eco-Metropolis e Connected Earth Museum em 2024 mostram espaço para jogo e experiência científica. PureFlow, de Aracaju, foi Best Mission Concept em 2025. A.T.L.A.S., naiπ, Stellar Narrators, The new Saraquatys e Titan aparecem como outros finalistas brasileiros daquele ano, sem serem convertidos em vencedores.

Comparáveis atuais já descrevem CubeSat, Vite, Three.js e salvamento local. Esses itens não são novidade exclusiva do Ipê. O nome NASA numa organização GitHub não prova afiliação ou elegibilidade. A proposta precisa demonstrar seu benefício e limites, sem declarar ineditismo mundial pela ausência de uma funcionalidade em alguns READMEs.

Fontes: [S03 — Global Winners 2023](https://science.nasa.gov/directorates/smd/2023-nasa-international-space-apps-challenge-announces-10-global-winners/); [S04 — Global Winners 2024](https://www.nasa.gov/learning-resources/stem-engagement-at-nasa/nasa-international-space-apps-challenge-announces-2024-global-winners/); [S05 — Global Winners 2025](https://www.nasa.gov/learning-resources/stem-engagement-at-nasa/nasa-announces-2025-international-space-apps-challenge-global-winners/); [S06 — Seis equipes brasileiras finalistas em 2025](https://www.gov.br/aeb/pt-br/assuntos/noticias/seis-equipes-brasileiras-estao-entre-os-finalistas-do-nasa-space-apps-2025); [S35 — Comparável Space Mission Design Game](https://github.com/NASA-SPACEAPP-2026/Space-Mission-Design-Game); [S36 — Build It Yourself](https://science.nasa.gov/mission/webb/game-build-it-yourself/).

## 9. Países, regiões e tendências

**Ranking de inovação e seleção de referências para o produto são perguntas diferentes.**

A pesquisa inicial usou o Global Innovation Index 2026: Suíça, Suécia e Estados Unidos nas três primeiras posições. Isso caracteriza ecossistemas de inovação; não prevê desempenho no hackathon. Indicadores distintos do AI Index também não foram fundidos num top 3 universal de IA.

O trio operacional para estudar este recorte foi Estados Unidos, França e Japão: NASA, Orekit e S2E/C2A oferecem referências pertinentes. É uma seleção técnica nossa, não alteração do ranking WIPO. Repositórios globais têm autoria distribuída; país não substitui análise de licença, capacidade e custo.

A Rússia tem o precedente HALA, Ivanovo, vencedor Best Use of Hardware em 2017. Não houve vencedor de evento russo no catálogo recente dos 30 casos analisados; isso não prova ausência de participantes russos ou capacidade. As tendências transferidas ao Ipê são processamento próximo à origem, ciência aberta, simulação explícita e avaliação orientada ao uso, sem instalar um modelo apenas por popularidade.

Fontes: [S07 — Space Apps Mission Report 2017](https://assets.spaceappschallenge.org/media/documents/SpaceApps2017_MissionReport.pdf); [S08 — Global Innovation Index 2026](https://www.wipo.int/pressroom/en/articles/2026/article_0014.html); [S09 — AI Index 2026](https://hai.stanford.edu/ai-index/2026-ai-index-report); [S31 — Orekit](https://github.com/CS-SI/Orekit); [S33 — S2E](https://github.com/ut-issl/s2e-core); [S34 — C2A](https://github.com/ut-issl/c2a-core); [S37 — Prithvi — aplicações geoespaciais](https://science.data.nasa.gov/blog/prithvi-geospatial-model-applications).

## 10. Fastino e o texto anexado

**A pesquisa separou possibilidades técnicas de promessas sem medição.**

GLiNER2.5-Decide, PII multi e GLiDE foram examinados por checkpoint, arquitetura, runtime, licença e benchmark. Nenhum modelo foi executado no jogo. Classificação sem sampling não garante acerto; extração PII local não garante conformidade total; suporte a alguns GGUF não torna llama.cpp compatível com qualquer encoder e head.

O uso futuro proposto é feedback pedagógico local ligado a rubrica, com abstenção e revisão humana. O modelo não decide física, ciência ou vitória. Deve ser comparado com regras determinísticas e avaliação humana em português, medindo erros, confiança, latência, memória e entradas adversariais.

Economia superior a 95%, decisão instantânea e zero overhead não foram demonstrados no Ipê. Sidecar e contratos estritos ajudam a delimitar falhas, mas IPC, carregamento, validação e serialização custam recursos. A licença de pesos exige conferência própria. Manter inferência fora do caminho crítico reduz risco da demonstração e reserva a avaliação para um benefício definido.

Fontes: [S27 — GLiNER2 oficial](https://github.com/fastino-ai/GLiNER2); [S28 — GLiNER2.5-Decide](https://huggingface.co/fastino/GLiNER2.5-Decide); [S29 — PII multi — model card](https://huggingface.co/fastino/gliner2-privacy-filter-PII-multi); [S30 — GLiDE 0.4B — licença](https://huggingface.co/fastino/GLiDE-0.4B/blob/main/LICENSE); [P08 — Biblioteca integral de pesquisas](../context/research-library.html).

## 11. Repositórios e reuso criterioso

**A auditoria selecionou funções úteis e corrigiu identidades equivocadas.**

Foram organizadas 33 famílias editoriais e 67 consultas GitHub. Isso não significa 67 tecnologias integradas, instaladas ou auditadas linha a linha. Código, modelos, datasets e assets têm termos diferentes; licença do framework não libera automaticamente todo conteúdo usado com ele.

Three.js está no runtime. Spec Kit inspirou a disciplina documental sem executar o CLI. Open MCT foi referência de inspeção temporal. Orekit, Basilisk e S2E/C2A ficaram como possíveis produtores de cenários externos. Terreno 3D, Cesium, geoprocessamento pesado e GeoAI só justificam integração quando modificam uma tarefa necessária.

A análise corrigiu LSR/LandsatShadowRemoval, separou SAMRS de SamGeo, identificou upstream de stackstac e distinguiu SpiceyPy, Skyfield e renderizadores. Nenhuma associação institucional garante precisão, processamento gratuito ou validade científica. Cada adoção exige versão, termos, exemplo mínimo e orçamento medido.

Fontes: [S23 — Three.js](https://github.com/mrdoob/three.js); [S24 — Open MCT](https://github.com/nasa/openmct); [S25 — Spec Kit](https://github.com/github/spec-kit); [S31 — Orekit](https://github.com/CS-SI/Orekit); [S32 — Basilisk](https://github.com/AVSLab/basilisk); [S33 — S2E](https://github.com/ut-issl/s2e-core); [S38 — 3D Tiles Renderer JS](https://github.com/NASA-AMMOS/3DTilesRendererJS); [P08 — Biblioteca integral de pesquisas](../context/research-library.html).

## 12. O que foi verificado

**Cada resultado pertence a uma versão, ambiente e escopo.**

A R4 registrou 51 testes Node, nove contagens TAP DOM, verificação científica, build, HTML portátil e validação de schema Prisma. A revisão independente confrontou 128 casos; defeitos encontrados em tolerância, Worker, imutabilidade e importação foram corrigidos, mantendo contraprovas. DOM não equivale a jornadas humanas ou navegador real.

O AB-R3A executou análise estática REA em snapshot delimitado: 43 arquivos selecionados, 40 processados JS/TS e zero falhas de parsing. Cobertura semântica foi parcial; achados estruturais não foram chamados de vulnerabilidades confirmadas ou certificação de segurança. Não houve benchmark no hardware de AB.

A R6 conferiu 15 checks locais de distribuição, 25 do mapa, preservação de 18 arquivos e 17 rotas de produção: 16 respostas 200 e uma 404 esperada. A identidade do conteúdo foi verificada pelo acesso do provedor. Isso não substitui teste anônimo em outra rede ou interação real no dispositivo final.

Fontes: [P01 — Verificação pública](../docs/09-VERIFICACAO.html); [P03 — Mapa Archify](../architecture/index.html); [P07 — Apresentação HTML](../presentation/Missao_Ipe_Apresentacao.html); [P08 — Biblioteca integral de pesquisas](../context/research-library.html).

## 13. Archify e documentação da estrutura

**O mapa distingue fonte real, artefato gerado e proposta.**

O renderizador oficial Archify foi usado numa revisão fixa. O inventário de imports foi produzido pelo projeto com AST TypeScript; não se afirmou a execução de um scanner upstream. O snapshot R6 inclui 189 arquivos, 51 de código, 262 relações sintáticas, 145 arestas locais, dez imports dinâmicos e uma entrada de Worker.

O visualizador local acrescenta busca, inventário e inspeção de relações. Prisma, Fastino e Marte não recebem arestas de execução inexistentes. Arquivos gerados que criariam hashes circulares foram tratados explicitamente. As licenças pertinentes estão preservadas e o HTML não exige CDN.

A verificação estática e DOM não completou os gates de navegador e origem remota do Archify. Os números pertencem ao snapshot R6; documentação nova exige novo corte ou identificação histórica. A central de contexto melhora a leitura, mas não atualiza automaticamente a proveniência de um mapa anterior.

Fontes: [S26 — Archify — revisão fixada](https://github.com/tt-a1i/archify/tree/e37848822238e3a61b12739185cdadd49843a620); [P03 — Mapa Archify](../architecture/index.html); [P08 — Biblioteca integral de pesquisas](../context/research-library.html).

## 14. Release, Git e elegibilidade

**Planejamento interno, publicação e candidatura têm evidências distintas.**

A meta de AB é 15/11/2026 às 08h BRT, equivalente a 11h UTC. O cronograma organiza ensaio, correção e aceite; não agenda trabalho automático. Uma data vencida ou marcação pessoal não altera evidência oficial. As tarefas precisam de saída observável e responsável funcional.

A cronologia registra desenvolvimento específico antes das 09h locais oficiais. A interpretação inicial de preparação permitida foi corrigida após respostas GO Team. Não foi observada autorização ou decisão de desclassificação sobre a equipe. A fonte NASA existe, mas sua qualificação na lista Resources continua pendente. Orientações de Navigator sobre sete slides/30 segundos não substituem formulário e guia.

A Vercel tem BETA publicada e o GitHub privado recebeu o projeto durante R8. A primeira importação integral foi conferida em 14/11/2026 às 10h30 BRT: 315 arquivos, zero divergências de SHA de blob ou modo, commit 2bf2d05b0d98efa38e97de13def1712453235486. O relatório AB-R3A está comprimido sem perda e o histórico local é restaurável por partes verificadas. Recibos posteriores registram atualizações e o deployment da central. A R7 permanece uma auditoria histórica anterior, sem push.

Fontes: [S16 — GO Team — início do trabalho](https://github.com/nasa/spaceapps/discussions/1827); [S17 — GO Team — funcionalidades e interface antes do evento](https://github.com/nasa/spaceapps/discussions/1872); [S18 — GO Team — especificações e prompts](https://github.com/nasa/spaceapps/discussions/2009); [S19 — GO Team — IA e Resources](https://github.com/nasa/spaceapps/discussions/1849); [S20 — Formato de demonstração](https://github.com/nasa/spaceapps/discussions/1947); [S21 — Evento local Rio Verde](https://www.spaceappschallenge.org/2026/local-events/rio-verde/); [P04 — Plano de release](../docs/15-PLANO-RELEASE.html); [P06 — Revisão Space Apps R5](../research/11-revisao-spaceapps-apresentacao.html); [P09 — Estado público](../docs/ESTADO-PUBLICO.html); [P11 — Repositório do projeto](https://github.com/oalexandrebelo/AB-NASA-TEAM-IPE).

## 15. Matriz dos oito temas

Comparação qualitativa, sem notas, pesos de júri ou probabilidade inventados. Os cartazes fornecidos por AB definiram o conjunto inicial; a aderência integral depende do enunciado vigente.

| Tema | Afinidade | Oportunidade | Risco | Decisão |
|---|---|---|---|---|
| Navegador lunar CLPS | Produto de decisão e visualização técnica. | Comparar locais/datas por iluminação, energia e comunicação. | Geometria, referenciais, horizonte e validação de restrições. | Alternativa relevante; fora deste MVP. |
| Jukebox de informações da Terra | Experiência, narrativa e acessibilidade. | Relacionar dado a percepção sonora verificável. | Mapeamento arbitrário e acessibilidade presumida; Arcobaleno é precedente. | Não escolhida; requer avaliação perceptiva. |
| Planeta X e SPHEREx | Exploração de dados e ferramenta científica. | Comparar observações e tornar candidatos auditáveis. | Ruído, registro temporal, disponibilidade e falsos positivos. | Não escolhida; nova cadeia astronômica. |
| Análogos terrestres Lua/Marte | Pesquisa e critérios geográficos. | Comparar atributos de locais de teste. | Semelhança visual não implica equivalência física ou operacional. | Não escolhida; exige matriz própria. |
| Dançando com os SARs / NISAR | Dados e mudanças ambientais. | Explicar fenômeno detectável por radar. | SLC, GRD e interferometria têm cadeias distintas; óptico não se transfere a SAR. | Não escolhida; validação SAR seria central. |
| Mapa de sobrevivência em Marte | UX espacial e exploração. | Ligar terreno, recursos e atividades a decisões. | Atlas sem mecanismo; riscos e navegação exigem dados/motor próprios. | Expansão proposta; não integrada. |
| Jogo de design de missões | UX Research, produto, dados e engenharia. | Aprender escolhas acopladas por investigação e redesenho. | Simulador genérico ou resposta automática sem aprendizagem. | Escolha explícita de AB; Missão Ipê. |
| Harmonização MODIS/VIIRS | Dados ambientais e relevância local. | Distinguir mudança real de artefato de sensor. | Resolução, limiar, cobertura, horário e QA impedem soma ingênua. | Alternativa forte com validação; fora do MVP. |

## 16. Sumário das pesquisas

### Histórico mundial

30 vencedores de 2023–2025 mostram diversidade de formatos e públicos. Ciência, experiência e explicação podem ser examinadas nos casos próximos ao problema.

**Limites:** Não há notas comparáveis nem chance calculada. Prêmio não certifica aprendizagem ou originalidade absoluta.

Fontes: [S03 — Global Winners 2023](https://science.nasa.gov/directorates/smd/2023-nasa-international-space-apps-challenge-announces-10-global-winners/); [S04 — Global Winners 2024](https://www.nasa.gov/learning-resources/stem-engagement-at-nasa/nasa-international-space-apps-challenge-announces-2024-global-winners/); [S05 — Global Winners 2025](https://www.nasa.gov/learning-resources/stem-engagement-at-nasa/nasa-announces-2025-international-space-apps-challenge-global-winners/).

### Brasil e regiões

PureFlow é vencedor 2025; cinco outros nomes brasileiros permanecem finalistas. HALA/2017 é referência russa histórica; Europa, Ásia e EUA integram o catálogo recente.

**Limites:** Local do evento não identifica nacionalidade. Ausência entre 30 registros não é ausência de capacidade.

Fontes: [S04 — Global Winners 2024](https://www.nasa.gov/learning-resources/stem-engagement-at-nasa/nasa-international-space-apps-challenge-announces-2024-global-winners/); [S05 — Global Winners 2025](https://www.nasa.gov/learning-resources/stem-engagement-at-nasa/nasa-announces-2025-international-space-apps-challenge-global-winners/); [S06 — Seis equipes brasileiras finalistas em 2025](https://www.gov.br/aeb/pt-br/assuntos/noticias/seis-equipes-brasileiras-estao-entre-os-finalistas-do-nasa-space-apps-2025); [S07 — Space Apps Mission Report 2017](https://assets.spaceappschallenge.org/media/documents/SpaceApps2017_MissionReport.pdf).

### Dados NASA

Seis MOD13Q1.061 tornam o índice e QA conferíveis. BANDAS e ÍNDICE respondem à mesma pergunta com custos de engenharia diferentes. EVI3 abre pesquisa posterior de preservação de informação.

**Limites:** Composição de 16 dias não é captura fictícia de 180 minutos. Origem NASA não fecha o requisito Resources.

Fontes: [S12 — MOD13 C6.1 User Guide](https://modis-land.gsfc.nasa.gov/pdf/MOD13_User_Guide_V61.pdf); [S13 — MOD13Q1.061 — DOI](https://doi.org/10.5067/MODIS/MOD13Q1.061); [S14 — Serviço MODIS de extração](https://modis.ornl.gov/data/modis_webservice.html); [S15 — NDVI e EVI](https://science.nasa.gov/earth/earth-observatory/measuring-vegetation-ndvi-evi/); [S19 — GO Team — IA e Resources](https://github.com/nasa/spaceapps/discussions/1849); [P02 — Origem dos dados](../docs/ORIGEM-DOS-DADOS.html).

### Fastino e IA local

Checkpoints, runtime, licença e benchmark foram separados. Feedback por rubrica e abstenção é proposta, mantendo física determinística.

**Limites:** Nenhum modelo rodou no jogo ou no hardware AB. Economia de 95% e conformidade total não foram demonstradas.

Fontes: [S27 — GLiNER2 oficial](https://github.com/fastino-ai/GLiNER2); [S28 — GLiNER2.5-Decide](https://huggingface.co/fastino/GLiNER2.5-Decide); [S29 — PII multi — model card](https://huggingface.co/fastino/gliner2-privacy-filter-PII-multi); [S30 — GLiDE 0.4B — licença](https://huggingface.co/fastino/GLiDE-0.4B/blob/main/LICENSE).

### Ecossistema aberto

33 famílias e 67 consultas foram organizadas por capacidade, licença e custo. Three é runtime; Spec Kit método; Open MCT referência; Orekit/Basilisk/S2E evolução.

**Limites:** Consulta não é instalação nem auditoria completa. Licença de código não cobre automaticamente dados, pesos e mapas.

Fontes: [S23 — Three.js](https://github.com/mrdoob/three.js); [S24 — Open MCT](https://github.com/nasa/openmct); [S25 — Spec Kit](https://github.com/github/spec-kit); [S31 — Orekit](https://github.com/CS-SI/Orekit); [S32 — Basilisk](https://github.com/AVSLab/basilisk); [S33 — S2E](https://github.com/ut-issl/s2e-core); [S38 — 3D Tiles Renderer JS](https://github.com/NASA-AMMOS/3DTilesRendererJS).

### Motor e verificação

Enumeração finita e oráculo independente conferem 128 configurações. Explicações apontam eventos reais; busca mantém objetivo e cenário fixos.

**Limites:** Replay com o mesmo motor não é validação independente. Menor reparo no catálogo não é ótimo físico universal.

Fontes: [P01 — Verificação pública](../docs/09-VERIFICACAO.html); [P07 — Apresentação HTML](../presentation/Missao_Ipe_Apresentacao.html); [P08 — Biblioteca integral de pesquisas](../context/research-library.html).

### Imersão e aprendizagem

Kapsch inspirou navegação por contexto e pontos de interesse. Alternativa HTML/2D preserva a tarefa. Previsão anterior à ajuda permite observar transferência próxima.

**Limites:** Não há estudo humano concluído. Foco, FPS e equipamento real ainda exigem ensaio.

Fontes: [S22 — Kapsch Experience](https://experience.kapsch.net/es); [S23 — Three.js](https://github.com/mrdoob/three.js); [S36 — Build It Yourself](https://science.nasa.gov/mission/webb/game-build-it-yourself/); [P01 — Verificação pública](../docs/09-VERIFICACAO.html); [P07 — Apresentação HTML](../presentation/Missao_Ipe_Apresentacao.html).

### Distribuição e rastreabilidade

A BETA R6 tem manifesto, URLs e verificação de conteúdo. Archify diferencia implementação e roadmap. R8 acrescenta central de contexto e cronograma sobre o histórico preservado.

**Limites:** Fetch do provedor não equivale a navegação anônima em outra rede. Deploy, push e submissão têm recibos distintos.

Fontes: [S26 — Archify — revisão fixada](https://github.com/tt-a1i/archify/tree/e37848822238e3a61b12739185cdadd49843a620); [P03 — Mapa Archify](../architecture/index.html); [P04 — Plano de release](../docs/15-PLANO-RELEASE.html); [P08 — Biblioteca integral de pesquisas](../context/research-library.html); [P11 — Repositório do projeto](https://github.com/oalexandrebelo/AB-NASA-TEAM-IPE).

## 17. Decisões e seus custos

### D01 — Tema escolhido

**Escolha:** Jogo de missões. **Motivo:** Escolha expressa de AB; reúne seus campos de atuação. **Custo assumido:** Concentra esforço e adia temas com outras cadeias de validação.

Fontes: [S02 — Space Mission Design Game](https://www.spaceappschallenge.org/2026/challenges/space-mission-design-game/); [P08 — Biblioteca integral de pesquisas](../context/research-library.html).

### D02 — Unidade de sucesso

**Escolha:** Seis resultados científicos úteis ao solo. **Motivo:** Conecta coleta, processamento, fila e comunicação à pergunta humana. **Custo assumido:** Limita variedade de destinos para fechar uma missão demonstrável.

Fontes: [S10 — Design and Develop Science Missions](https://ntrs.nasa.gov/citations/20250002492); [S11 — CubeSat 101](https://science.nasa.gov/wp-content/uploads/2023/06/nasa_csli_cubesat_101_508.pdf); [P02 — Origem dos dados](../docs/ORIGEM-DOS-DADOS.html).

### D03 — Arquivo NASA local

**Escolha:** MOD13Q1.061 histórico de Rio Verde. **Motivo:** Dados pequenos com QA e transformações conferíveis. **Custo assumido:** Não representa aquisição orbital em tempo real ou diagnóstico agronômico.

Fontes: [S12 — MOD13 C6.1 User Guide](https://modis-land.gsfc.nasa.gov/pdf/MOD13_User_Guide_V61.pdf); [S13 — MOD13Q1.061 — DOI](https://doi.org/10.5067/MODIS/MOD13Q1.061); [S14 — Serviço MODIS de extração](https://modis.ornl.gov/data/modis_webservice.html); [P02 — Origem dos dados](../docs/ORIGEM-DOS-DADOS.html).

### D04 — Modos equivalentes

**Escolha:** BANDAS versus ÍNDICE para a mesma pergunta NDVI. **Motivo:** Muda engenharia sem benefício científico oculto de uma peça cara. **Custo assumido:** Outra pergunta como EVI precisa de novo contrato.

Fontes: [S12 — MOD13 C6.1 User Guide](https://modis-land.gsfc.nasa.gov/pdf/MOD13_User_Guide_V61.pdf); [S15 — NDVI e EVI](https://science.nasa.gov/earth/earth-observatory/measuring-vegetation-ndvi-evi/); [P01 — Verificação pública](../docs/09-VERIFICACAO.html).

### D05 — Domínio finito

**Escolha:** Seis decisões binárias. **Motivo:** Permite enumeração completa e prova limitada do menor redesenho. **Custo assumido:** Não cobre todos os subsistemas ou projetos possíveis.

Fontes: [P01 — Verificação pública](../docs/09-VERIFICACAO.html); [P08 — Biblioteca integral de pesquisas](../context/research-library.html).

### D06 — Cálculo separado

**Escolha:** Motor e Worker; cena lê o traço. **Motivo:** Animação não determina física nem resultado. **Custo assumido:** Exige validação de mensagens, cancelamento e fallback.

Fontes: [P01 — Verificação pública](../docs/09-VERIFICACAO.html); [P03 — Mapa Archify](../architecture/index.html).

### D07 — Inferência fora do P0

**Escolha:** Nenhum modelo arbitra vitória. **Motivo:** A tarefa atual cabe em regras verificáveis; benefício semântico não medido. **Custo assumido:** Feedback livre fica para avaliação em português.

Fontes: [S27 — GLiNER2 oficial](https://github.com/fastino-ai/GLiNER2); [S28 — GLiNER2.5-Decide](https://huggingface.co/fastino/GLiNER2.5-Decide); [P01 — Verificação pública](../docs/09-VERIFICACAO.html).

### D08 — Persistência local

**Escolha:** IndexedDB e exportação/reexecução. **Motivo:** Operação sem API de produto e recuperação por arquivo. **Custo assumido:** Não há colaboração remota na BETA.

Fontes: [P01 — Verificação pública](../docs/09-VERIFICACAO.html); [P03 — Mapa Archify](../architecture/index.html).

### D09 — Marte e órbita no roadmap

**Escolha:** Terreno e propagador não integram o MVP. **Motivo:** São contratos científicos e operacionais adicionais. **Custo assumido:** A visão futura não pode ser apresentada como módulo executado.

Fontes: [S31 — Orekit](https://github.com/CS-SI/Orekit); [S32 — Basilisk](https://github.com/AVSLab/basilisk); [S38 — 3D Tiles Renderer JS](https://github.com/NASA-AMMOS/3DTilesRendererJS); [P06 — Revisão Space Apps R5](../research/11-revisao-spaceapps-apresentacao.html).

### D10 — Estado rastreável

**Escolha:** Separar implementado, testado, publicado e proposto. **Motivo:** Evita transformar prazo ou intenção em fato. **Custo assumido:** Exige manter cortes e evidências próprias para cada rodada.

Fontes: [P03 — Mapa Archify](../architecture/index.html); [P04 — Plano de release](../docs/15-PLANO-RELEASE.html); [P09 — Estado público](../docs/ESTADO-PUBLICO.html).

## 18. Insights e próxima ação

### I01 — A ciência precisa chegar · P0

Bytes recebidos não bastam. Completude, QA e cálculo ligam engenharia ao objetivo. **Ação:** Exibir origem e motivo de aceitação de cada resultado.

Fontes: [P01 — Verificação pública](../docs/09-VERIFICACAO.html); [P02 — Origem dos dados](../docs/ORIGEM-DOS-DADOS.html).

### I02 — Uma melhoria pode causar falha · P0

Menos payload pode exigir potência demais. O cenário torna uma troca abstrata observável. **Ação:** Demonstrar base curta, alteração isolada e reparo com duas escolhas.

Fontes: [P01 — Verificação pública](../docs/09-VERIFICACAO.html); [P07 — Apresentação HTML](../presentation/Missao_Ipe_Apresentacao.html).

### I03 — Prever antes da ajuda · P0

Acerto após recomendação não demonstra compreensão. Primeira hipótese distingue investigação de cópia. **Ação:** Observar uma pessoa nova explicando a restrição antes da sugestão.

Fontes: [P01 — Verificação pública](../docs/09-VERIFICACAO.html); [P08 — Biblioteca integral de pesquisas](../context/research-library.html).

### I04 — Demonstrar é o diferencial · P0

CubeSat, offline e 3D já existem em comparáveis. Exclusividade não foi provada; evidência concreta pode ser examinada. **Ação:** Concentrar pitch numa cadeia causal conferível.

Fontes: [S35 — Comparável Space Mission Design Game](https://github.com/NASA-SPACEAPP-2026/Space-Mission-Design-Game); [S36 — Build It Yourself](https://science.nasa.gov/mission/webb/game-build-it-yourself/); [P07 — Apresentação HTML](../presentation/Missao_Ipe_Apresentacao.html).

### I05 — Brasil precisa alterar a tarefa · P1

Identidade local sozinha não comprova impacto. Dados regionais e linguagem precisam ajudar o público. **Ação:** Validar vocabulário e aplicação com educador/participante.

Fontes: [S21 — Evento local Rio Verde](https://www.spaceappschallenge.org/2026/local-events/rio-verde/); [P02 — Origem dos dados](../docs/ORIGEM-DOS-DADOS.html); [P08 — Biblioteca integral de pesquisas](../context/research-library.html).

### I06 — Mínimo com domínio explícito · P0

Duas mudanças bastam no catálogo curto atual. Enumeração pequena elimina necessidade de cluster para esta prova. **Ação:** Mostrar testemunha, domínio e limites da afirmação.

Fontes: [P01 — Verificação pública](../docs/09-VERIFICACAO.html); [P07 — Apresentação HTML](../presentation/Missao_Ipe_Apresentacao.html).

### I07 — Preservar informação cria opções · P2

Só NDVI pode impedir outra pergunta futura. EVI exige banda adicional e outra transformação. **Ação:** Projetar missão separada de reprocessamento com contrato próprio.

Fontes: [S12 — MOD13 C6.1 User Guide](https://modis-land.gsfc.nasa.gov/pdf/MOD13_User_Guide_V61.pdf); [S15 — NDVI e EVI](https://science.nasa.gov/earth/earth-observatory/measuring-vegetation-ndvi-evi/); [P02 — Origem dos dados](../docs/ORIGEM-DOS-DADOS.html).

### I08 — Modelo deve superar baseline · P2

Checkpoint menor não garante feedback melhor. Idioma, rubrica e confiança podem produzir erros relevantes. **Ação:** Comparar regras, modelo local e avaliação humana com abstenção.

Fontes: [S27 — GLiNER2 oficial](https://github.com/fastino-ai/GLiNER2); [S28 — GLiNER2.5-Decide](https://huggingface.co/fastino/GLiNER2.5-Decide); [S29 — PII multi — model card](https://huggingface.co/fastino/gliner2-privacy-filter-PII-multi); [S30 — GLiDE 0.4B — licença](https://huggingface.co/fastino/GLiDE-0.4B/blob/main/LICENSE).

### I09 — Progresso precisa de evidência · P0

Prazo, marcação local e execução são estados distintos. Confundi-los gera cronograma otimista sem lastro. **Ação:** Manter dependências, critérios e personalização local separados.

Fontes: [P03 — Mapa Archify](../architecture/index.html); [P04 — Plano de release](../docs/15-PLANO-RELEASE.html); [P09 — Estado público](../docs/ESTADO-PUBLICO.html).

### I10 — O próximo teste é uso real · P0

Cálculo e distribuição têm provas; experiência continua aberta. Repetir checks não mede foco, WebGL ou aprendizagem. **Ação:** Ensaiar jornada e apresentação no equipamento final.

Fontes: [P01 — Verificação pública](../docs/09-VERIFICACAO.html); [P04 — Plano de release](../docs/15-PLANO-RELEASE.html); [P05 — Oportunidades da BETA](../docs/16-OPORTUNIDADES-BETA.html).

## 19. Histórico das rodadas

Rodadas são a sequência preservada, não oito eventos competitivos. Resultados anteriores não foram reexecutados por esta consolidação.

### R1 — Exploração dos oito desafios

**Corte:** Pesquisa inicial preservada; sem horário individual consolidado. **Estado editorial:** documentado.

Histórico mundial 2023–2025, Brasil, países e repositórios. Separação de ranking de inovação e estratégia do hackathon.

Fontes: [S03 — Global Winners 2023](https://science.nasa.gov/directorates/smd/2023-nasa-international-space-apps-challenge-announces-10-global-winners/); [S04 — Global Winners 2024](https://www.nasa.gov/learning-resources/stem-engagement-at-nasa/nasa-international-space-apps-challenge-announces-2024-global-winners/); [S05 — Global Winners 2025](https://www.nasa.gov/learning-resources/stem-engagement-at-nasa/nasa-announces-2025-international-space-apps-challenge-global-winners/); [S06 — Seis equipes brasileiras finalistas em 2025](https://www.gov.br/aeb/pt-br/assuntos/noticias/seis-equipes-brasileiras-estao-entre-os-finalistas-do-nasa-space-apps-2025); [S08 — Global Innovation Index 2026](https://www.wipo.int/pressroom/en/articles/2026/article_0014.html); [P08 — Biblioteca integral de pesquisas](../context/research-library.html).

### R2 — Escolha do jogo e primeira estrutura

**Corte:** Etapa anterior à implementação R4. **Estado editorial:** documentado.

AB escolheu Jogo de Missão e forneceu Kapsch como referência. Primeiro PRD/PRT e desenho amplo; seus parâmetros são históricos.

Fontes: [S22 — Kapsch Experience](https://experience.kapsch.net/es); [P08 — Biblioteca integral de pesquisas](../context/research-library.html).

### R3 — Revisão adversarial do diferencial

**Corte:** 14/11/2026; parecer de seleção preservado. **Estado editorial:** documentado.

Recorte Ciência que chega e comparação com jogos existentes. Crítica a peça cara sem benefício modelado; escolha de modos para a mesma ciência. Desenho anterior de 288 combinações por pack não é motor executado da BETA.

Fontes: [S35 — Comparável Space Mission Design Game](https://github.com/NASA-SPACEAPP-2026/Space-Mission-Design-Game); [S36 — Build It Yourself](https://science.nasa.gov/mission/webb/game-build-it-yourself/); [P08 — Biblioteca integral de pesquisas](../context/research-library.html).

### R4 — Motor e jogo local

**Corte:** 14/11/2026; início específico anterior às 09h BRT registrado. **Estado editorial:** concluido.

Dez frentes em ondas, não dez modelos rodando no hardware AB. Motor 0.1.1-rd, catálogo ipe-64-v1, UI, ciência, replay e verificações. Dossiê, Prisma, rastreabilidade e handoff com limites.

Fontes: [P01 — Verificação pública](../docs/09-VERIFICACAO.html); [P02 — Origem dos dados](../docs/ORIGEM-DOS-DADOS.html); [P08 — Biblioteca integral de pesquisas](../context/research-library.html); [P09 — Estado público](../docs/ESTADO-PUBLICO.html).

### R5 — Apresentação e revisão Space Apps

**Corte:** 14/11/2026; revisão de regras às 07h32 BRT. **Estado editorial:** concluido.

Sete quadros principais, oito apêndices e demonstrador real. Notas PT/EN e preparação inglesa; mídia final não qualificada. Elegibilidade e Resources permaneceram pendentes.

Fontes: [P06 — Revisão Space Apps R5](../research/11-revisao-spaceapps-apresentacao.html); [P07 — Apresentação HTML](../presentation/Missao_Ipe_Apresentacao.html).

### R6 — BETA, portal e Archify

**Corte:** 14/11/2026; publicação com recibo próprio. **Estado editorial:** concluido.

BETA 0.2.0-beta.1 na Vercel com jogo, apresentação, mapa e documentos. Checks locais e de produção com limites explícitos. GitHub ainda não publicado naquele corte; bundle local preservado.

Fontes: [P01 — Verificação pública](../docs/09-VERIFICACAO.html); [P03 — Mapa Archify](../architecture/index.html); [P04 — Plano de release](../docs/15-PLANO-RELEASE.html); [P08 — Biblioteca integral de pesquisas](../context/research-library.html).

### R7 — Auditoria antes do envio Git

**Corte:** 14/11/2026; após publicação da BETA. **Estado editorial:** documentado.

284 arquivos presentes, histórico íntegro e estado limpo na conferência. Criação remota ainda bloqueada pelo acesso naquele momento; sem push ou deploy nesta auditoria. Bloqueio de criação posteriormente superado durante R8.

Fontes: [P08 — Biblioteca integral de pesquisas](../context/research-library.html); [P11 — Repositório do projeto](https://github.com/oalexandrebelo/AB-NASA-TEAM-IPE).

### R8 — Contexto e cronograma interativo

**Corte:** 14/11/2026; corte editorial base às 09h45 BRT, com atualização de acesso. **Estado editorial:** em-andamento.

Consolidação do tema, pesquisa, decisões, insights e próximos critérios. Repositório privado fornecido por AB; primeira importação integral publicada e conferida, com 315 arquivos sem divergência. Central HTML verificada e preparada para publicação; o recibo final registra o deployment observado. Meta interna 15/11/2026 às 08h BRT, sem automação futura presumida.

Fontes: [P04 — Plano de release](../docs/15-PLANO-RELEASE.html); [P08 — Biblioteca integral de pesquisas](../context/research-library.html); [P11 — Repositório do projeto](https://github.com/oalexandrebelo/AB-NASA-TEAM-IPE).

## 20. Handoff e critérios de continuidade

Ler esta central para entender o motivo da escolha, o histórico e as próximas perguntas. Para implementar, partir de PRD/PRT, ciência/procedência, contrato do motor, persistência e verificação. O ponto de entrada de publicação R6 é PUBLICADO.md; novos recibos R8 devem acrescentar estado sem apagar o anterior. O bundle recupera histórico local, mas não cria repositório GitHub.

Uma tarefa só muda de estado oficial com evidência compatível: build não prova navegação; DOM não prova aprendizagem; push não prova deploy; deploy não prova submissão. O cronograma interativo pode guardar marcações pessoais, identificadas como locais. Prazo vencido não significa tarefa concluída. Cada mudança de contrato precisa de versão e regressão das camadas afetadas.

Antes das 08h, o foco é ensaio real, clareza do primeiro minuto, potência versus energia, versão inglesa de apresentação e correção de bloqueadores observados. Depois, a sequência é aprendizagem, robustez finita, novos pacotes científicos, referência orbital externa e avaliação de feedback compacto. Sincronização remota e terreno planetário exigem uma tarefa de produto que justifique sua operação.

A meta de representar o Brasil orienta a qualidade, mas o resultado competitivo não é controlado pela equipe. Publicação de P&D não cria afiliação ou endosso NASA. A organização decide as condições da candidatura; a equipe responde por validar ciência, uso humano e evidências que não podem ser inferidas de aparência ou quantidade de código.

## Apêndice A — contrato de produto preservado da R4

O texto seguinte é o PRD canônico da base 0.1.1-rd, preservado para ligar esta síntese à tarefa implementada. Metas e pendências pertencem ao corte original; a consolidação não as transforma em resultados novos. Fonte de projeto: docs/02-PRD.md.

### 02 — PRD: Missão Ipê — Ciência que chega

**Product Requirements Document · versão 0.1 de P&D · contrato ipe-64-v1.** Uso pretendido: educação em decisões de missão; não planejamento operacional de voo. Documento produzido antes do início local oficial; elegibilidade de uso na competição não estabelecida.

#### 1. Problema, público e tarefa

Um iniciante consegue reconhecer bateria, painel e antena, mas pode tratar cada escolha como uma melhoria independente. O problema de produto é permitir que ele observe um compromisso entre recursos: reduzir o volume transmitido exige processamento; aumentar a taxa de transmissão exige potência; escolher peças maiores pode ultrapassar o envelope de lançamento. A evidência de compreensão exige a pessoa justificar uma decisão sob uma condição diferente, não somente alcançar o estado verde.

Público inicial para validação: estudantes e visitantes de formação heterogênea em uma sessão acompanhada por educador ou facilitador. Não foi recrutada uma amostra nesta rodada. Não se presume idade, deficiência, escolaridade ou domínio de inglês dos participantes. A interface de pesquisa é pt-BR; a versão em inglês permanece tarefa de preparação da submissão, com revisão humana dos termos científicos.

Tarefa principal: entregar seis resultados NDVI utilizáveis ao solo dentro da missão simulada, preservando todos os limites do cenário. Meta de duração: oito minutos por ciclo introdutório. Essa duração é uma hipótese de UX, ainda não uma medição.

#### 2. Fronteira funcional

P0 tem uma missão e duas condições de contato. O objetivo científico e o pacote de dados permanecem iguais. O lançador e o perfil orbital são fixos e declarados. As seis escolhas disponíveis são bateria, painel, representação/processamento, rádio, armazenamento e política de contato. O escopo não equivale a selecionar todos os subsistemas e destinos de uma missão real. A adequação integral ao enunciado oficial ainda precisa da leitura dos Resources e do brief integral.

A pergunta científica é calcular NDVI nos seis registros de arquivo MOD13Q1 selecionados para três coordenadas solicitadas no entorno de Rio Verde, em duas composições temporais de 2024. A nave didática não adquire fisicamente esses pixels em 180 minutos. O volume lógico de cada lote é uma hipótese de missão e não o tamanho dos JSONs empacotados.

| Escolha | Opção 1 | Opção 2 | Consequência que o jogo deve tornar inspecionável |
|---|---|---|---|
| Bateria | 16 Wh, até 20 W de descarga | 24 Wh, até 35 W | Energia armazenada e potência instantânea são limites distintos. |
| Painel | 12 W nominal | 18 W nominal | O painel nominal recebe fatores de orientação/iluminação do cenário. |
| Processamento | BANDAS R/NIR, 180 Mbit/lote, 26 W totais | ÍNDICE NDVI, 60 Mbit/lote, 38 W totais | Menor payload aumenta a demanda durante o trabalho. |
| Rádio | 0,96 Mbit/s, 16 W totais | 2,4 Mbit/s, 26 W totais | Taxa e energia/potência mudam juntas. |
| Armazenamento | 512 Mbit | 1.536 Mbit | Lotes completos disputam espaço antes do contato. |
| Política | Todos os contatos | Somente o último | Uma capacidade técnica não utilizada pela política não entrega ciência. |

Os números são hipóteses didáticas versionadas, não parâmetros atribuídos a MODIS, Terra ou um fornecedor de CubeSat. As massas/créditos ficam no catálogo executável. A capacidade total é limitada a 3,6 kg e 86 créditos, incluindo base fixa de 1,2 kg/20 créditos. Não exibir o maior valor de todas as peças como solução automaticamente válida.

#### 3. Jornada e telas

##### Observatório

A primeira tela apresenta o pedido científico, a origem dos registros, as duas condições e um diorama procedural. O usuário pode escolher por botão HTML; clicar numa forma 3D nunca é o único acesso. “Contatos longos” introduz o ciclo; “Contatos curtos” funciona como transferência próxima. A Terra, o satélite e os arcos são representação explicativa, sem claim de efemérides ou geometria orbital calculada.

##### Bancada de projeto

As seis decisões mostram parâmetros, massa e créditos. A configuração padrão é bateria de 16 Wh, painel de 18 W, BANDAS R/NIR, rádio econômico, armazenamento grande e todos os contatos. Antes da primeira execução de cada condição, registrar uma previsão do gargalo. As hipóteses não podem ser alteradas por texto livre, e o usuário não edita números físicos arbitrários nesta versão.

A previsão é evidência de interação da pessoa, não dado NASA. Não registrar nome, email, CPF ou identificador externo. O diário local deve ser exportado deliberadamente, com aviso de que textos livres podem conter informações pessoais. Nenhum detector de PII é presumido instalado. Esse aviso é pertinente ao conteúdo efetivamente exportado e não uma promessa regulatória.

##### Sala de missão e debrief

A simulação produz o resultado independentemente da câmera e da taxa de quadros. A linha do tempo lê o trace já calculado; avançar, pausar ou arrastar o marcador não altera a física. A tela mostra resultados entregues, reserva, fila, balanço energético e eventos. Selecionar um evento revela regra, instante e valores. Distinguir lote parcialmente transmitido de registro científico utilizável.

O usuário volta à bancada para redesenhar. A busca oferece a menor quantidade de escolhas alteradas dentro das 64 configurações e da condição fixada, somente após uma tentativa própria. O caso curto bloqueia ajuda antes da primeira execução. Aplicar uma sugestão cria nova entrada; não edita retrospectivamente uma execução já salva. Empates, quando houver, precisam permanecer visíveis.

#### 4. Requisitos funcionais e critérios de aceite

| ID | Requisito | Aceite verificável |
|---|---|---|
| PRD-01 | Selecionar condição com objetivo fixo | IDs e dados iguais; apenas janelas de contato diferem. |
| PRD-02 | Configurar seis escolhas | Exatamente 64 tuplas; escolhas desconhecidas rejeitadas. |
| PRD-03 | Ver envelope antes de executar | Total de massa/créditos corresponde ao catálogo versionado. |
| PRD-04 | Registrar previsão | Primeira execução de cada condição exige uma previsão não vazia. |
| PRD-05 | Executar motor único | UI, busca e reexecução importam a mesma função de simulação. |
| PRD-06 | Mostrar ciência recebida | Só registro inteiro, com QA aceito e NDVI verificado, conta. |
| PRD-07 | Inspecionar diagnóstico | Evento e regra existem no resultado; valores não vêm de um LLM. |
| PRD-08 | Buscar redesenho | Mínimo só aparece após enumeração completa sem indeterminados. |
| PRD-09 | Proteger transferência | Ajuda indisponível antes da primeira tentativa no caso curto. |
| PRD-10 | Salvar localmente | Commit IndexedDB concluído antes da confirmação; falha não apaga o resultado em tela. |
| PRD-11 | Exportar/importar recibo | Importação estrita, versões compatíveis e reexecução; claim e resultado distinguíveis. |
| PRD-12 | Operar sem serviço externo | Dados, bibliotecas e assets compilados localmente; não existe chamada de inferência/API no caminho de execução. |
| PRD-13 | Alternativa 2D | Seleção, configuração, execução e debrief disponíveis sem WebGL. |
| PRD-14 | Preservar contexto de pesquisa | Datas dos dados e simulação distintas; hipótese física não recebe atribuição NASA. |
| PRD-15 | Evitar resultado obsoleto | Mudar entrada invalida resultado/busca e cancela trabalho pendente. |

O documento de verificação registra quais desses aceites foram executados em Node, DOM de teste ou navegador. Um checkbox nesta especificação não é recibo de teste.

#### 5. Vitória, falha e experiência de erro

Vitória exige simultaneamente: envelope estático admissível; conclusão do horizonte; nenhuma violação operacional; seis registros esperados inteiros recebidos e cientificamente utilizáveis. Missão inválida por massa/orçamento não se transforma em missão bem-sucedida porque alguma telemetria chegou. Falha de potência e esgotamento de energia interrompem a operação. Cruzar a reserva marca violação e preserva o trace. Buffer cheio perde o lote novo conforme política fixa do cenário.

Erro de software, timeout, cancelamento ou entrada inválida de replay nunca vira falha física nem vitória. O usuário recebe um estado de erro e pode repetir com a entrada preservada. Perder a cena WebGL mantém a interação HTML. Falhar um salvamento local mantém resultado e exportação; não prometer persistência que o navegador rejeitou.

#### 6. Conteúdo, acessibilidade e imersão

A estética combina papel claro, carvão e âmbar de ipê, com números tabulares e rótulos visíveis. Cor reforça, mas não é a única informação de estado. Foco, labels, ordem de navegação, contraste e overflow exigem inspeção de navegador no equipamento real. O teste DOM só cobre parte disso. Redução de movimento interrompe animação contínua; a aba oculta não deve manter renderização desnecessária. A física não depende dessas otimizações.

A referência Kapsch é funcional: selecionar pontos espaciais e abrir informações contextualizadas. Não foram copiados os assets ou a identidade da empresa. O escopo usa Three.js procedural; não carrega cidade fotorrealista, terreno planetário global, áudio gerado ou catálogo de múltiplos planetas. Esses elementos ampliariam produção, licenças e tempo de carga antes de demonstrar a aprendizagem central.

#### 7. Hipóteses e pesquisa com usuários

Hipótese H1: a inspeção de consequências ajuda o participante a distinguir energia de potência. H2: a pessoa transfere a relação processamento/comunicação para a condição curta sem abrir a solução. H3: a visualização permite localizar quando o problema ocorreu. H4: a missão cabe no tempo de demonstração previsto. Nenhuma hipótese foi confirmada por pessoas nesta rodada.

Protocolo: dois pilotos para corrigir instruções e seis sessões observadas; informar finalidade, evitar coleta pessoal e preservar erros/desistências. Pedir previsão, executar, solicitar explicação, mudar contato e registrar a primeira escolha antes da ajuda. Dois avaliadores classificam explicações por recurso limitante, mecanismo e justificativa da intervenção, documentando divergências. Isso é pesquisa formativa de compreensão imediata; não estima efeito causal, retenção ou generalização populacional.

Registrar tempo até primeira escolha, tempo por tarefa, ajuda solicitada, erros de interpretação, revisões de configuração e explicação final. Não otimizar uma taxa de conclusão sacrificando a dificuldade que revela o compromisso técnico. O objetivo não é forçar todas as pessoas a acertarem com o solver.

#### 8. Evolução por gates

P1a: nova pergunta EVI3, com BLUE explicitamente transportada e política científica própria. P1b: conjunto finito de perturbações para comparar margens, sem chamar taxa na grade de probabilidade real. P1c: avaliação opcional de modelo compacto para escolher perguntas de acompanhamento, sem alterar pontuação. P1d: tradução integral e revisão terminológica em inglês.

P2: pacotes orbitais derivados de Orekit/Basilisk/SPICE, comparação com referência de maior fidelidade, criação de conteúdo por educadores e avaliação longitudinal. Cada incremento exige novo contrato, dados, oráculo, evidência e orçamento de desempenho. O primeiro núcleo não depende dessas entregas.

## Apêndice B — catálogo de fontes

As fontes externas foram identificadas nas pesquisas preservadas. Inclusão não transforma tentativa de recuperação em leitura bem-sucedida, nem estudo de ferramenta em instalação. Fontes de projeto permitem navegar pelos documentos públicos e pela biblioteca integral.

- **S01 — [Space Apps 2026](https://www.spaceappschallenge.org/2026/)** · NASA Space Apps. Calendário institucional; não comprova inscrição ou elegibilidade do Ipê.

- **S02 — [Space Mission Design Game](https://www.spaceappschallenge.org/2026/challenges/space-mission-design-game/)** · NASA Space Apps. URL oficial identificada. Enunciado integral e Resources não foram integralmente recuperados nas revisões preservadas.

- **S03 — [Global Winners 2023](https://science.nasa.gov/directorates/smd/2023-nasa-international-space-apps-challenge-announces-10-global-winners/)** · NASA. Fonte identificada na pesquisa preservada; a consolidação não equivale a nova execução do sistema citado.

- **S04 — [Global Winners 2024](https://www.nasa.gov/learning-resources/stem-engagement-at-nasa/nasa-international-space-apps-challenge-announces-2024-global-winners/)** · NASA. Fonte identificada na pesquisa preservada; a consolidação não equivale a nova execução do sistema citado.

- **S05 — [Global Winners 2025](https://www.nasa.gov/learning-resources/stem-engagement-at-nasa/nasa-announces-2025-international-space-apps-challenge-global-winners/)** · NASA. Fonte identificada na pesquisa preservada; a consolidação não equivale a nova execução do sistema citado.

- **S06 — [Seis equipes brasileiras finalistas em 2025](https://www.gov.br/aeb/pt-br/assuntos/noticias/seis-equipes-brasileiras-estao-entre-os-finalistas-do-nasa-space-apps-2025)** · Agência Espacial Brasileira. Fonte identificada na pesquisa preservada; a consolidação não equivale a nova execução do sistema citado.

- **S07 — [Space Apps Mission Report 2017](https://assets.spaceappschallenge.org/media/documents/SpaceApps2017_MissionReport.pdf)** · NASA Space Apps. HALA, Ivanovo, Rússia: Best Use of Hardware. Referência histórica, não resultado recente.

- **S08 — [Global Innovation Index 2026](https://www.wipo.int/pressroom/en/articles/2026/article_0014.html)** · WIPO. Métrica de ecossistema de inovação; não ranking de chance de premiação.

- **S09 — [AI Index 2026](https://hai.stanford.edu/ai-index/2026-ai-index-report)** · Stanford HAI. Indicadores de IA não foram combinados num ranking próprio do Ipê.

- **S10 — [Design and Develop Science Missions](https://ntrs.nasa.gov/citations/20250002492)** · NASA NTRS. Registro de março/2025 de Julie Levri; não intercambiar paginação com outro PDF de abril.

- **S11 — [CubeSat 101](https://science.nasa.gov/wp-content/uploads/2023/06/nasa_csli_cubesat_101_508.pdf)** · NASA. Referência de missão e operação; números das peças do jogo são hipóteses próprias.

- **S12 — [MOD13 C6.1 User Guide](https://modis-land.gsfc.nasa.gov/pdf/MOD13_User_Guide_V61.pdf)** · NASA MODIS Land. Bandas, escala, QA e composição temporal; não fundamenta a agenda orbital didática.

- **S13 — [MOD13Q1.061 — DOI](https://doi.org/10.5067/MODIS/MOD13Q1.061)** · NASA LP DAAC. Identifica o produto; não demonstra inclusão na lista Resources do desafio.

- **S14 — [Serviço MODIS de extração](https://modis.ornl.gov/data/modis_webservice.html)** · ORNL DAAC. Coordenada solicitada não equivale ao centro exato do pixel resultante.

- **S15 — [NDVI e EVI](https://science.nasa.gov/earth/earth-observatory/measuring-vegetation-ndvi-evi/)** · NASA Earth Observatory. Fonte identificada na pesquisa preservada; a consolidação não equivale a nova execução do sistema citado.

- **S16 — [GO Team — início do trabalho](https://github.com/nasa/spaceapps/discussions/1827)** · NASA Space Apps GO Team. Fonte identificada na pesquisa preservada; a consolidação não equivale a nova execução do sistema citado.

- **S17 — [GO Team — funcionalidades e interface antes do evento](https://github.com/nasa/spaceapps/discussions/1872)** · NASA Space Apps GO Team. Fonte identificada na pesquisa preservada; a consolidação não equivale a nova execução do sistema citado.

- **S18 — [GO Team — especificações e prompts](https://github.com/nasa/spaceapps/discussions/2009)** · NASA Space Apps GO Team. Fonte identificada na pesquisa preservada; a consolidação não equivale a nova execução do sistema citado.

- **S19 — [GO Team — IA e Resources](https://github.com/nasa/spaceapps/discussions/1849)** · NASA Space Apps GO Team. Fonte identificada na pesquisa preservada; a consolidação não equivale a nova execução do sistema citado.

- **S20 — [Formato de demonstração](https://github.com/nasa/spaceapps/discussions/1947)** · Space Apps Navigator. Orientação de Navigator; não substitui o formulário e guia vigentes.

- **S21 — [Evento local Rio Verde](https://www.spaceappschallenge.org/2026/local-events/rio-verde/)** · Space Apps / organizador local. Agenda local não se confunde com alvo interno de software às 08h.

- **S22 — [Kapsch Experience](https://experience.kapsch.net/es)** · Kapsch TrafficCom. Referência interativa fornecida por AB. Código, marca e assets proprietários não foram incorporados.

- **S23 — [Three.js](https://github.com/mrdoob/three.js)** · Three.js / comunidade. Fonte identificada na pesquisa preservada; a consolidação não equivale a nova execução do sistema citado.

- **S24 — [Open MCT](https://github.com/nasa/openmct)** · NASA. Referência para inspeção temporal; framework não integrado ao runtime.

- **S25 — [Spec Kit](https://github.com/github/spec-kit)** · GitHub. Disciplina documental aplicada; CLI upstream não instalado ou executado.

- **S26 — [Archify — revisão fixada](https://github.com/tt-a1i/archify/tree/e37848822238e3a61b12739185cdadd49843a620)** · tt-a1i / Archify. Renderizador usado na R6; inventário AST foi implementado separadamente pelo projeto.

- **S27 — [GLiNER2 oficial](https://github.com/fastino-ai/GLiNER2)** · Fastino. Pesquisa documental; nenhum modelo Fastino executado no jogo.

- **S28 — [GLiNER2.5-Decide](https://huggingface.co/fastino/GLiNER2.5-Decide)** · Fastino. Model card do fornecedor; benchmark não valida português ou hardware de AB.

- **S29 — [PII multi — model card](https://huggingface.co/fastino/gliner2-privacy-filter-PII-multi)** · Fastino. Extração local não garante conformidade ou mascaramento completo.

- **S30 — [GLiDE 0.4B — licença](https://huggingface.co/fastino/GLiDE-0.4B/blob/main/LICENSE)** · Fastino. Condições específicas; não equivalem automaticamente a MIT/Apache.

- **S31 — [Orekit](https://github.com/CS-SI/Orekit)** · CS GROUP / comunidade. Referência futura, não integrada ao motor.

- **S32 — [Basilisk](https://github.com/AVSLab/basilisk)** · Autonomous Vehicle Systems Lab. Produtor de cenários de referência proposto; não dependência atual.

- **S33 — [S2E](https://github.com/ut-issl/s2e-core)** · ISSL / Universidade de Tóquio. Fonte identificada na pesquisa preservada; a consolidação não equivale a nova execução do sistema citado.

- **S34 — [C2A](https://github.com/ut-issl/c2a-core)** · ISSL / comunidade. Fonte identificada na pesquisa preservada; a consolidação não equivale a nova execução do sistema citado.

- **S35 — [Comparável Space Mission Design Game](https://github.com/NASA-SPACEAPP-2026/Space-Mission-Design-Game)** · Autores do repositório. README/arquitetura consultados; nome NASA não comprova afiliação, funcionamento ou elegibilidade.

- **S36 — [Build It Yourself](https://science.nasa.gov/mission/webb/game-build-it-yourself/)** · NASA. Precedente educacional de ciência conectada a decisões de projeto.

- **S37 — [Prithvi — aplicações geoespaciais](https://science.data.nasa.gov/blog/prithvi-geospatial-model-applications)** · NASA. Referência de GeoAI e avaliação; nenhum checkpoint integrado.

- **S38 — [3D Tiles Renderer JS](https://github.com/NASA-AMMOS/3DTilesRendererJS)** · NASA AMMOS. Oportunidade futura de terreno; não fornece automaticamente geometria SPICE ou dinâmica orbital.

- **P01 — [Verificação pública](../docs/09-VERIFICACAO.html)** · AB-NASA-TEAM-IPE. Recorte público; resultados históricos pertencem às versões identificadas.

- **P02 — [Origem dos dados](../docs/ORIGEM-DOS-DADOS.html)** · AB-NASA-TEAM-IPE. Observação científica, transformação e hipótese didática separadas.

- **P03 — [Mapa Archify](../architecture/index.html)** · AB-NASA-TEAM-IPE. Snapshot identificado; integrações propostas não são execução.

- **P04 — [Plano de release](../docs/15-PLANO-RELEASE.html)** · AB-NASA-TEAM-IPE. Meta interna 15/11/2026 às 08h BRT; não agenda trabalho automático.

- **P05 — [Oportunidades da BETA](../docs/16-OPORTUNIDADES-BETA.html)** · AB-NASA-TEAM-IPE. Priorização R6 preservada.

- **P06 — [Revisão Space Apps R5](../research/11-revisao-spaceapps-apresentacao.html)** · AB-NASA-TEAM-IPE. GO Team, Navigator, agenda local e lacunas distinguidos.

- **P07 — [Apresentação HTML](../presentation/Missao_Ipe_Apresentacao.html)** · AB-NASA-TEAM-IPE. Sete quadros principais e oito apêndices.

- **P08 — [Biblioteca integral de pesquisas](../context/research-library.html)** · AB-NASA-TEAM-IPE. Documentos-base, pesquisas e decisões, com cortes históricos preservados.

- **P09 — [Estado público](../docs/ESTADO-PUBLICO.html)** · AB-NASA-TEAM-IPE. P&D e limites do escopo.

- **P10 — [Autoria e IA](../docs/AUTORIA-E-IA.html)** · AB-NASA-TEAM-IPE. Assistência de IA e ativos observacionais distintos.

- **P11 — [Repositório do projeto](https://github.com/oalexandrebelo/AB-NASA-TEAM-IPE)** · AB-NASA-TEAM-IPE. Privado. Publicação integral conferida na R8; evidência em evidence/git-publication-r8.json.

## Apêndice C — documentos-base da trajetória

- docs/01-DOSSIE-DECISAO.md: escolha e precedentes competitivos.
- docs/02-PRD.md e docs/03-PRT.md: produto, unidades, contratos e fronteiras.
- docs/04-FLOWCHARTS.md e docassets/: jornada, motor, replay e topologia.
- docs/06-IA-LOCAL-E-ANEXOS.md e research/02-fastino-anexos.md: modelos compactos e plano de avaliação.
- docs/07-SCHEMA-PRISMA.md, docs/11-APENDICE-SCHEMA.md e prisma/: contrato futuro, sem backend ativo.
- docs/09-VERIFICACAO.md: comandos, resultados e limites da implementação do jogo.
- docs/10-FRENTES-E-RASTREABILIDADE.md: dez frentes R4, requisitos, código e evidência.
- research/history/: histórico mundial e seleção adversarial anteriores.
- research/initial/: pesquisas iniciais preservadas pela coordenação R8.
- research/08-auditoria-repositorios.md: 33 famílias, termos e correções.
- research/11-revisao-spaceapps-apresentacao.md e docs/12-HANDOFF-APRESENTACAO.md: R5.
- docs/13-ARQUITETURA-ARCHIFY.md e architecture/: geração e proveniência do mapa.
- docs/14-BETA-DEPLOY.md a docs/17-PUBLICACAO-GIT-VERCEL.md: distribuição e planejamento R6.
- evidence/: recibos completos; versão pública usa projeção/curadoria identificadas.
