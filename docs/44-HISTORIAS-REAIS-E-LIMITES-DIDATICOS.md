# 44 — Histórias reais e limites dos exercícios

**R17 · fontes conferidas em 15/11/2026.** As três histórias do laboratório passam a partir de fatos NASA identificáveis. Foram retirados pedidos e equipes fictícias da narrativa. Ipê é o nome da equipe; a árvore não é a explicação científica das missões.

Essa mudança altera textos, referências e o guia de leitura. Não troca os registros do domínio nem transforma o simulador em uma reprodução histórica. A implementação e a implantação conferida são estados diferentes: consulte o [registro de publicação](https://github.com/oalexandrebelo/MISSAO-IPE/blob/main/PUBLICADO.md).

## Uma distinção que o jogador precisa enxergar

| Camada | O que significa | Exemplo |
| --- | --- | --- |
| Fato documentado | Uma missão, observação ou resultado que a fonte NASA descreve. | A escolha de Nightingale pela OSIRIS-REx em 2019. |
| Dado incorporado | Um valor efetivamente presente no pacote local, com origem. | Os seis registros históricos Terra/MODIS do Cerrado. |
| Exercício didático | Um conjunto pequeno de regras para investigar uma decisão. | Contatos de 120 ou 500 segundos no caso Bennu. |
| Referência visual | Um objeto 3D que ajuda a reconhecer o contexto. | O modelo NASA do Webb; sua geometria não valida a energia do catálogo. |

Um fato verdadeiro na introdução não torna verdadeiros os números sintéticos da partida. Por isso a história e a explicação dos resultados mantêm seus limites próximos à atividade.

## Terra/MODIS: observar vegetação ao longo do tempo

O caso se apoia no uso de observações de luz refletida para estudar vegetação. O artigo do NASA Earth Observatory, publicado em **30/08/2000**, explica NDVI e EVI. O [catálogo Earthdata de MOD13](https://search.earthdata.nasa.gov/search?q=mod13) identifica o MOD13Q1 como produto Terra/MODIS composto a cada 16 dias, com resolução de 250 m. [Conceito NASA de índices de vegetação](https://science.nasa.gov/earth/earth-observatory/measuring-vegetation-ndvi-evi/).

O recorte já incorporado tem três pontos próximos a Rio Verde e dois períodos de 2024. Os compostos começam em **28/08** e **13/09**; as datas selecionadas das observações são **01/09** e **23/09**. Esses campos foram conferidos no [arquivo de dados do jogo](https://github.com/oalexandrebelo/MISSAO-IPE/blob/main/experiments/mission-design-lab/src/data/science-data.ts). O [NOTICE](https://github.com/oalexandrebelo/MISSAO-IPE/blob/main/NOTICE.md) conserva DOI, origem ORNL DAAC e alcance do subset.

O exercício pergunta como processar e entregar esse arquivo com recursos limitados. Não há uma encomenda real da NASA para a equipe Ipê, uma nova aquisição MODIS durante a partida ou uma reprodução do satélite Terra. A diferença de NDVI é uma observação a investigar; não identifica por si só desmatamento, manejo ou chuva. Uma lacuna de entrega permanece lacuna.

## Bennu: reconhecimento antes da coleta

A OSIRIS-REx encontrou terreno mais rochoso do que o esperado. A análise dos locais de coleta passou por mais de 50 possibilidades e chegou a quatro candidatos. Nightingale foi selecionado em dezembro de 2019; a NASA descreve a necessidade de avaliar material acessível e obstáculos na aproximação. Esse episódio substitui a equipe de cartografia inventada. [Relato NASA de 29/03/2023](https://science.nasa.gov/blogs/osiris-rex/2023/03/29/2019-2020-choosing-a-touchdown-site-from-a-sea-of-hazards/).

A coleta ocorreu em **20/10/2020**, e a cápsula com a amostra retornou à Terra em **24/09/2023**. O jogo não simula esse transporte físico. [Cronologia oficial da OSIRIS-REx](https://science.nasa.gov/mission/osiris-rex/).

A ligação pedagógica é observar → transmitir → avaliar evidência. **Os setores A/B/C e as seis rugosidades do jogo são sintéticos**, em unidades arbitrárias. Não correspondem a Nightingale, Osprey ou aos demais candidatos reais. Os tempos, contatos e capacidades não são telemetria da OSIRIS-REx. O resultado não certifica local de coleta, pouso ou navegação.

## Webb: instrumento, espectro e uma descoberta documentada

Em **25/08/2022**, a NASA divulgou evidência de CO₂ na atmosfera do exoplaneta **WASP-39 b**. O espectro usado foi observado pelo **NIRSpec em 10/07/2022**, com uma característica entre **4,1 e 4,6 µm**. É um exemplo concreto da relação entre pergunta, instrumento e medida. [Publicação NASA sobre WASP-39 b](https://science.nasa.gov/missions/webb/nasas-webb-detects-carbon-dioxide-in-exoplanet-atmosphere/).

O exercício mantém seus seis fluxos relativos sintéticos, nas faixas de **1,2, 2,0 e 3,5 µm**. Eles não são o espectro acima, não contêm sua característica de CO₂ e não permitem anunciar moléculas, água ou vida. A atividade avalia se o instrumento genérico escolhido atende ao requisito e se os pacotes chegam completos.

Há uma correção conceitual importante: **o NIRCam também faz espectroscopia**. Todos os quatro instrumentos científicos do Webb possuem recursos espectroscópicos. A opção “câmera” do catálogo Ipê é deliberadamente mais simples e não representa o NIRCam. Nome de instrumento e modo de observação não são sinônimos. [Instrumentos científicos do Webb](https://science.nasa.gov/mission/webb/science-overview/science-explainers/webbs-scientific-instruments/).

## O que esta revisão alterou

| Material | Alteração | Preservado |
| --- | --- | --- |
| `MissionStories.tsx` | Três introduções factuais, fontes NASA clicáveis, datas, títulos de contexto e limites. | Seleção das missões e comportamento de expansão. |
| `mission-curriculum.ts` | Contexto histórico, distinção entre instrumento genérico e NIRCam, limites dos dados. | Funções, ensaios A/B, parâmetros, tipos e resultados. |
| [Guia didático](32-GUIA-DIDATICO-MISSOES-3D.md) | Capítulo das histórias e referências, sem personagens inventados. | Catálogos, cálculos, exercícios e contratos operacionais. |
| Registro factual | [JSON de fatos e fontes](https://github.com/oalexandrebelo/MISSAO-IPE/blob/main/research/nasa-mission-stories-r17.json). | Separação entre fonte documental e dado integrado. |

Os cinco testes existentes do domínio dos experimentos guiados e os 12 testes de interface do módulo de aprendizagem passaram após a revisão; TypeScript também. A interface foi exercitada em DOM simulado, não em navegador real. O corpo das funções de ensaio e seus tipos foi comparado com a base e permanece byte a byte idêntico. Isso verifica preservação dos resultados e compilação, não valida uma missão NASA ou aprendizagem humana. O recibo da rodada integrada documenta os demais testes quando executados.

## Continuidade científica

Para substituir um conjunto sintético, a próxima entrega precisa selecionar um produto real, preservar unidade, qualidade, data, licença e proveniência, definir uma pergunta compatível e testar o cálculo com uma referência independente. Acrescentar nomes de alvos reais aos valores atuais seria incorreto. Também não basta importar um modelo 3D ou uma imagem científica: a presença visual não torna esses valores parte do motor.

O arquivo de fatos registra as fontes efetivamente consultadas, incluindo o limite de recuperação do catálogo Earthdata: o índice foi legível, mas a página individual do produto retornou 403 nesta sessão. Não houve coleta de novas observações NASA nesta revisão.
