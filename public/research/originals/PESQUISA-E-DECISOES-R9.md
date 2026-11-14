# Missão Ipê — jogo de projeto de missão espacial

Pesquisa e decisões da rodada 9 · 14 de novembro de 2026 · português do Brasil.

## 1. Decisão de produto

O tema escolhido por AB é **Space Mission Design Game**, do NASA Space Apps Challenge 2026. A campanha inicial será **Missão Ipê — Ciência que chega**: projetar um CubeSat educacional que precisa entregar seis registros científicos válidos ao solo, dentro de limites de massa, orçamento, energia, potência, memória e tempo de contato.

O jogador não ganha por selecionar o componente mais caro ou por assistir ao lançamento. Precisa fazer sistemas interdependentes funcionarem juntos. A pergunta de produto é: **como tornar visível a consequência de uma escolha de engenharia, para que a pessoa possa prever, executar, investigar e redesenhar?**

A campanha principal foi preservada depois de inspecionar o repositório existente `oalexandrebelo/AB-NASA-TEAM-IPE`, no commit `73162276b46227e8965eed2b91a7dc8edae70b96`. O contrato `ipe-64-v1` e o motor `0.1.1-rd` já ofereciam dois cenários e conservação auditável de recursos. Recomeçar esse motor não era necessário para produzir a nova interface. A rodada evolui a experiência e acrescenta modelos de física separados.

**Critério de sucesso preservado: 6/6 registros válidos entregues e nenhuma restrição de missão violada.** A hipótese de aceitar 4/6 mencionada no parecer A1 não foi adotada. Um contador 6/6 não basta quando massa, orçamento ou outra restrição tornam a configuração inválida.

## 2. O que o desafio oficial sustenta

A URL da aba Resources fornecida pelo usuário retornou erros de recuperação nesta rodada. O resumo institucional do desafio foi confirmado no bloco **About the Challenge** de uma página oficial de equipe, separando-o da descrição autoral da equipe: https://www.spaceappschallenge.org/2026/find-a-team/missionforge/ . Ele sustenta projeto, gestão e simulação de uma missão completa, com decisões de engenharia, recursos limitados e consequências sobre o resultado.

O texto integral reproduzido no evento HackAthlone ajudou a localizar referências, mas não substitui a autoridade do original: https://hackathlone.com/challenges/space-mission-design-game . A associação exata dos nove recursos dessa reprodução à aba oficial permanece pendente. Não foram inventados requisitos obrigatórios de multiplayer, realidade virtual ou uso de IA. O desafio de VR de 2023 é uma referência histórica distinta.

O beta cobre o percurso objetivo → configuração → revisão → operação simulada → ciência recebida → explicação → novo projeto. A seleção livre de lançador, instrumento e órbita permanece para evolução: no catálogo atual, esses elementos são fixos. Isso deve ser apresentado como recorte explícito, não como cobertura integral de todos os exemplos do enunciado.

## 3. Por que Cerrado / LEO primeiro

O Cerrado aproxima a missão da equipe e do público de Rio Verde. A tarefa tem finalidade científica reconhecível: obter índices de vegetação válidos. A órbita terrestre permite estudar energia, eclipses, armazenamento e contatos sem introduzir simultaneamente captura planetária, múltiplos estágios e propulsão de baixo empuxo.

O recorte torna a consequência verificável: dois cenários mudam o tempo de contato mantendo os arquivos científicos e as opções. A configuração inicial entrega 6/6 no contato longo e apenas 2/6 no curto. O jogador pode investigar o limite de comunicação, perceber que processar a bordo reduz os dados e descobrir que esse processamento exige mais potência da bateria.

A campanha não afirma que o CubeSat fictício adquiriu os dados históricos. Os seis registros Terra/MODIS já existem. O motor usa representações didáticas de processamento e transporte para ensinar o caminho entre informação produzida e resultado disponível na Terra.

## 4. Fontes NASA aplicadas

| Fonte | Uso no produto | Limite |
|---|---|---|
| [Design and Develop Science Missions — NTRS 20250002492](https://ntrs.nasa.gov/citations/20250002492) | Estrutura da missão, necessidades científicas, requisitos e segmentos | Apresentação conceitual; não catálogo de peças |
| [NASA Systems Engineering Handbook](https://www.nasa.gov/reference/systems-engineering-handbook/) | Objetivo, ConOps, alternativas, verificação, operação e rastreabilidade | Orientação; não certificação do jogo |
| [CubeSat 101](https://science.nasa.gov/wp-content/uploads/2023/06/nasa_csli_cubesat_101_508.pdf) | Contexto de missão pequena, interfaces, preparação e operação | Guia com contexto e data próprios |
| [NASA SmallSat SoA — Power](https://www.nasa.gov/smallsat-institute/sst-soa/power-subsystems/) | Relações entre painéis, incidência, distância, baterias, eclipses e degradação | Valores do catálogo do jogo são hipóteses didáticas |
| [NASA SmallSat SoA — Communications](https://www.nasa.gov/smallsat-institute/sst-soa/soa-communications/) | Relação entre antena, potência, taxa, apontamento e segmento de solo | Ganho ou frequência isolados não garantem taxa |
| [ORNL DAAC / TESViS](https://modis.ornl.gov/data/modis_webservice.html) | Dados históricos com consultas e arquivos de procedência | O beta não depende de consulta online durante a partida |
| [MOD13 User Guide V6.1](https://modis-land.gsfc.nasa.gov/pdf/MOD13_User_Guide_V61.pdf) | Bandas, escalas, datas e máscaras de qualidade | NDVI isolado não demonstra produtividade agrícola ou diagnóstico ecológico |
| [JPL constantes astrodinâmicas](https://ssd.jpl.nasa.gov/astro_par.html) | Referência para os modelos de órbita do laboratório | Órbita de dois corpos; não solução operacional da campanha |

MOD13Q1 V061 é um produto de composição temporal de 16 dias, com resolução nominal de 250 m. O pacote preserva datas dos registros, bandas vermelha e infravermelha próxima, índice de referência e QA. Ele não é uma sequência de imagens instantâneas produzidas pelo satélite do jogo.

Os JSON de origem, recibos e pacote estão em `public/data`. A restauração local foi comparada com os hashes de blobs do repositório. A revisão A6 identificou e permitiu corrigir um LF excedente introduzido pelo transporte dos arquivos. Os recibos e hashes de origem foram preservados; não foram modificados para aceitar arquivos divergentes.

## 5. Correções das premissas do briefing

### Delta-v e lançamento

Tsiolkovsky usa `Δv = Isp × g0 × ln(m0/mf)`, com logaritmo natural e `g0 = 9,80665 m/s²`. Esse g0 é uma referência de definição do impulso específico; não muda para a gravidade local da Lua. Deve-se separar o serviço de lançamento das manobras realizadas pela própria nave. Valores de uma tabela Terra/LEO/Marte não são requisitos universais sem definir origem, destino, captura, janela, perdas e veículo.

Alto Isp não significa alto empuxo. A equação ideal não produz automaticamente duração de manobra ou trajetória de uma propulsão elétrica. O laboratório mostra a capacidade ideal de Δv e declara essas limitações.

### Energia solar e bateria

Há duas entradas diferentes: irradiância incidente em W/m² ou potência elétrica nominal de um painel. Para a primeira, aplicar área, eficiência e orientação. Para a segunda, não multiplicar novamente pela eficiência já incorporada ao nominal.

O laboratório usa `P = 1361 × A × η × cos(θ) / R²`, com R em UA, incidência medida em relação à normal e conversão aplicada uma vez. A campanha usa potências elétricas nominais de 12 e 18 W e fatores operacionais declarados. Energia em Wh é a integral da potência com o tempo em horas; potência máxima de descarga e capacidade energética são limites distintos.

### Comunicação

Friis descreve potência recebida no modelo ideal, não uma taxa de dados automaticamente. Com ganhos em dBi mantidos fixos, aumentar frequência aumenta a perda em espaço livre. Se a abertura física das antenas for mantida fixa, seus ganhos variam com frequência; é outra comparação. Taxa exige considerar ruído, modulação, codificação, Eb/N0, perdas e margem.

O laboratório mantém ganhos fixos, calcula perda, potência recebida e latência de luz e informa que não calcula bitrate. No jogo, taxas úteis de serviço são parâmetros didáticos de 960 kbit/s ou 2,4 Mbit/s.

### Custos, margens, massa e MMRTG

Preços de lançamento, capacidades máximas e contratos não são intercambiáveis. Não foi construída uma tabela de preços atuais com os números do briefing. O beta usa créditos claramente identificados como economia de jogo.

Faixas de distribuição de massa e margem não são regras universais. Uma margem precisa especificar sua base: percentual da estimativa ou da alocação. A revisão não converteu 20–25% em uma suposta obrigação NASA aplicável a toda missão.

O MMRTG tem referências NASA/JPL para aproximadamente 110 W elétricos iniciais e 45 kg, mas degradação total e custo não são constantes universais de catálogo. O MMRTG não foi inserido como opção plausível dentro do CubeSat de 3,6 kg.

## 6. O jogo que está sendo entregue

### Campanha

As seis decisões são bateria, painel solar, processamento, rádio, memória e plano de transmissão. Cada decisão tem duas opções; são 64 configurações. Há dois cenários com duas janelas cada: 600 s por janela ou 240 s. A missão didática tem horizonte de 10.800 s, envelope de 3,6 kg e 86 créditos.

O resultado considera conservação dos bits, fila FIFO, lotes completos, transmissão parcial, saturação da memória, geração solar, perdas de conversão, carga limitada, potência de descarga, reserva e energia mínima. Os seis registros precisam chegar completos e passar pela validação científica. A busca exaustiva conta configurações inválidas e não atribui certificado de mínimo a uma execução incompleta.

O relógio do motor é independente do frame de renderização. Pausar a imagem ou percorrer os estados do relatório não muda a missão já calculada. Isso é essencial para permitir comparação justa entre tentativas.

### Interface e aprendizado

O briefing apresenta objetivo e limites. O hangar mostra a montagem 3D e as opções de um subsistema por vez. Os outros sistemas permanecem reconhecíveis na navegação, com a escolha ativa. Massa, orçamento e capacidades são atualizados pelo projeto selecionado.

Antes de executar, a pessoa registra uma hipótese e uma justificativa. Alterar um componente invalida a seleção da hipótese, preservando a justificativa para revisão. O relatório mostra estado geral, dados completos, curva de energia e eventos. A comparação de duas execuções evidencia mudanças de configuração e alerta quando os cenários diferem.

A ajuda de catálogo aparece após a própria tentativa e explica o mínimo de escolhas alteradas dentro das 64 opções. Ela não se apresenta como inteligência artificial nem como diagnóstico causal universal. A proposta educativa é investigar relações de sistema, não memorizar uma combinação vencedora.

### Laboratório de física

Quatro experiências independentes permitem variar: altitude LEO; área, eficiência, incidência e distância solar; massa seca, propelente e Isp; potência, frequência e distância do enlace. Resultados e diagramas mudam imediatamente. Cada modelo tem unidades, hipóteses e fontes.

O laboratório não configura a campanha. Ele serve para aprofundamento didático e prepara a expansão futura. Dados reais de efemérides, janelas de lançamento, órbitas perturbadas ou captura lunar não foram implicitamente acrescentados ao motor por existir um globo 3D.

## 7. UX orientada por NN/g

Foram consultadas [as dez heurísticas](https://www.nngroup.com/articles/ten-usability-heuristics/), [divulgação progressiva](https://www.nngroup.com/articles/progressive-disclosure/), [reconhecimento e lembrança](https://www.nngroup.com/articles/recognition-and-recall/) e [heurísticas em aplicações complexas](https://www.nngroup.com/articles/usability-heuristics-complex-applications/).

As decisões de interface são aplicações nossas desses princípios: estado e limites visíveis, controle do ritmo, linguagem comum, escolhas nativas fora do canvas, fonte disponível junto do dado, recuperação por novo projeto e comparação de resultados. Não há endosso NN/g nem estudo de usabilidade com participantes concluído.

O modo 2D preserva os controles e resultados. O 3D é complementar, com detecção de indisponibilidade, movimento reduzido e controles de visualização. A verificação por teclado e em larguras menores complementa os testes de DOM; não constitui certificação de conformidade WCAG.

## 8. Stack e repositórios

Vite, React 19, TypeScript strict, Three.js, R3F 9 e Drei formam a implementação. O motor continua isolado e pode rodar em Worker. IndexedDB guarda execuções e rascunhos; replay importado é validado e recalculado. CSS local com tokens preserva a identidade da experiência. Não foi necessário adicionar um backend, autenticação ou LLM para resolver números de engenharia.

Astronomy Engine é apropriado a posições e eventos astronômicos, não a calcular sozinho um plano completo de Δv. Satellite.js atende propagação SGP4/SDP4 com elementos apropriados a satélites terrestres; não é substituto para trajetórias interplanetárias. MuSCAT é MATLAB; CML é C++/Trick/JEOD. Eles são referências arquiteturais futuras.

O parecer A3 separa licenças de código e assets. Planetarium não apresentou licença na raiz consultada. Earth-moon-solar declara MIT para código, CC BY 4.0 em texturas e CC BY-SA 4.0 em dados HYG. CML usa NOSA 1.3; MuSCAT usa Apache-2.0. Esta rodada criou geometrias próprias; não copiou esses projetos ou sua coleção de assets.

## 9. Evolução priorizada

1. Fechar a revisão humana do desafio integral e a associação de uma fonte da aba Resources ao uso demonstrado; preservar autoria, datas e declaração de IA.
2. Realizar sessões com jogadores do público: entender a meta, identificar restrição, explicar mudança, transferir a estratégia ao cenário curto. Medir compreensão antes/depois com tarefas distintas e registrar erros; não confundir conclusão com aprendizado.
3. Integrar escolha de órbita, lançador e instrumento em contrato versionado, com compatibilidades e agendas completas. Comparar resultados com referências independentes antes de mudar o catálogo.
4. Adicionar campanha lunar com transferência, captura, comunicação, eclipse e ciência própria. Separar modelos impulsivos de baixo empuxo.
5. Expandir para Marte com efemérides e solucionador de trajetórias apropriado, latência e plano de operações. Cada camada deve trazer decisão útil, hipótese explícita e verificação.
6. Só depois acrescentar cenários estocásticos com semente registrada, colaboração de equipe, missões autorais e progressão persistente.

## 10. Evidência e leitura completa

As pesquisas integrais estão em `research/round9/a1-desafio.md`, `a2-fisica.md` e `a3-ux-tecnologia.md`. O guia de demonstração e a revisão independente estão em `docs/GUIA-DIDATICO-R9.md` e `docs/QA-R9.md`. Os recibos de execução ficam em `evidence/`.

Preservar a diferença entre revisão documental, teste numérico, DOM simulado, inspeção visual no navegador e uso real por participantes. Nenhuma dessas evidências substitui todas as outras. Desenvolvimento assistido por IA; nenhuma afiliação ou validação institucional da NASA ou da NN/g é inferida.
