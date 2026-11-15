# Catálogo de equipamentos e integração da contribuição de Bruno

**MISSÃO IPÊ · R22 · Fontes consultadas em 15/11/2026**

O catálogo registra a fonte, o estado factual e o contexto de cada uma das 18 opções. Os identificadores acompanham a contribuição original de Bruno A Carvalho. No R22, a opção `atlas` apresenta o Atlas V. O nome Atlas L-2 e o perfil fictício de lançador leve pertencem ao protótipo original. [Catálogo em JSON](../research/nasa-equipment-r22.json) · [Origem da contribuição](https://github.com/oalexandrebelo/MISSAO-IPE/blob/main/contributions/bruno-figma/ORIGEM-E-INTEGRACAO.md) · [Ficha original](https://github.com/oalexandrebelo/MISSAO-IPE/blob/main/contributions/bruno-figma/src/App.tsx).

## Veículos de lançamento

As associações de destino descrevem um voo específico ou um uso previsto. Selecionar um lançador real exige considerar a órbita ou trajetória de entrega, a massa e o volume da carga, suas interfaces e as condições de separação. A aproximação da ISS, a transferência e o pouso têm seus próprios veículos ou sistemas, conforme a missão. [NASA Launch Services Program](https://www.nasa.gov/kennedy/launch-services-program/) · [NASA SmallSat, integração e lançamento](https://www.nasa.gov/smallsat-institute/sst-soa/integration-launch-and-deployment/).

| Opção | Voo ou uso documentado | Fontes |
| --- | --- | --- |
| Falcon 9 | Lançou cápsulas Dragon para a ISS e a Blue Ghost Mission 1 rumo à Lua. | [Commercial Crew](https://www.nasa.gov/humans-in-space/spaceships-and-rockets/commercial-crew-rockets/) · [Commercial Resupply](https://www.nasa.gov/humans-in-space/spaceships-and-rockets/commercial-resupply-rockets/) · [Lançamento Blue Ghost](https://www.nasa.gov/news-release/liftoff-nasa-sends-science-tech-to-moon-on-firefly-spacex-flight/) |
| Atlas V | Lançou o teste Starliner OFT-2 sem tripulação para a ISS, LRO e LCROSS para a Lua, e o Perseverance para Marte. | [Teste Starliner](https://www.nasa.gov/humans-in-space/spaceships-and-rockets/commercial-crew-rockets/) · [Lançamento LRO e LCROSS](https://science.nasa.gov/mission/lro/about/) · [Lançamento Perseverance](https://science.nasa.gov/resource/nasas-perseverance-rover-launches-to-mars/) |
| Vulcan Centaur | Lançou a missão lunar Peregrine em 2024. O módulo se separou e coletou dados em voo. Uma falha do módulo impediu o pouso suave. | [LSP Rockets](https://www.nasa.gov/launch-services-program-rockets/) · [Encerramento Peregrine](https://www.nasa.gov/news-release/nasa-science-astrobotic-peregrine-mission-one-concludes/) |
| Electron | Lança pequenos satélites. No caso CAPSTONE, o estágio Lunar Photon colocou o CubeSat na trajetória de transferência. CAPSTONE entrou em órbita lunar. | [Integração e lançamento](https://www.nasa.gov/smallsat-institute/sst-soa/integration-launch-and-deployment/) · [Lançamento CAPSTONE](https://www.nasa.gov/news-release/capstone-launches-to-test-new-orbit-for-nasas-artemis-moon-missions/) · [Missão CAPSTONE](https://www.nasa.gov/mission/capstone/) |
| Antares 330 | Uso previsto para reabastecer a ISS no relatório de junho de 2026. As entregas Cygnus documentadas sob a família Antares ocorreram em versões anteriores. | [IG-26-010, p. 7, nota 12](https://oig.nasa.gov/wp-content/uploads/2026/06/final-report-ig-26-010-nasas-launch-infrastructure.pdf) · [Página do relatório](https://oig.nasa.gov/audits/nasas-launch-infrastructure/) · [Commercial Resupply](https://www.nasa.gov/humans-in-space/spaceships-and-rockets/commercial-resupply-rockets/) |
| New Glenn | Lançou as sondas ESCAPADE em 2025. A atualização NASA de 09/11/2026 confirmou a partida em direção à órbita marciana, onde a missão estudará a interação do vento solar com Marte. | [Missão ESCAPADE](https://science.nasa.gov/mission/escapade/) · [Atualização de trajetória](https://science.nasa.gov/science-research/heliophysics/nasas-escapade-completes-powered-earth-flybys-now-en-route-to-mars/) |

A nota sobre o Antares 330 foi conferida no trecho indexado do PDF oficial. A página do OIG permite abrir o relatório completo.

## Subsistemas

| Grupo | Fatos para as fichas | Fontes |
| --- | --- | --- |
| Propulsão | A química bipropelente usa combustível e oxidante e atende a manobras que exigem empuxo elevado. A iônica usa energia elétrica e oferece baixo empuxo sustentado, como na Dawn. A Cassini usou propulsores monopropelentes para controlar a atitude e realizar pequenas mudanças de velocidade. | [Propulsão no espaço](https://www.nasa.gov/smallsat-institute/sst-soa/in-space_propulsion/) · [Dawn](https://science.nasa.gov/mission/dawn/technology/ion-propulsion/) · [Cassini](https://science.nasa.gov/mission/cassini/engine/) |
| Energia | Painéis solares geram eletricidade quando iluminados. Baterias Li-ion armazenam energia. Na ISS, a combinação recarrega baterias na luz e usa a reserva no eclipse. | [Sistemas de energia](https://www.nasa.gov/smallsat-institute/sst-soa/power-subsystems/) · [Baterias da ISS](https://ntrs.nasa.gov/citations/20200000004) |
| Estrutura e proteção | Uma estrutura suporta a carga e transmite os esforços da montagem. O ARIS é um exemplo de isolamento ativo de vibração para instrumentos em órbita. A manta multicamada reduz a troca de calor por radiação e é passiva. | [Estruturas](https://www.nasa.gov/smallsat-institute/sst-soa/structures-materials-and-mechanisms/) · [ARIS](https://ntrs.nasa.gov/citations/20000032438) · [Controle térmico](https://www.nasa.gov/smallsat-institute/sst-soa/thermal-control/) |
| Atitude, navegação e rádio | O Star tracker determina para onde a nave aponta. A banda S pode transportar telemetria e comandos. GPS orbital tem uso estabelecido em órbita baixa da Terra. O LuGRE demonstrou localização com GPS e Galileo na Lua. A Orion exemplifica sensores e processamento redundantes. | [Guiagem, navegação e controle](https://www.nasa.gov/smallsat-institute/sst-soa/guidance-navigation-and-control/) · [Comunicações](https://www.nasa.gov/smallsat-institute/sst-soa/soa-communications/) · [LuGRE](https://www.nasa.gov/missions/artemis/clps/nasa-successfully-acquires-gps-signals-on-moon/) · [Aviônica Orion](https://www.nasa.gov/reference/avionics-and-software/) |

## Decisões científicas no jogo

- **ISS** · Acompanhar um composto orgânico volátil dentro da estação exige medidas ao longo do tempo. A decisão é escolher um monitor de ar e sustentar a aquisição das leituras. O experimento começa após a entrega. [Toxicologia e química ambiental da NASA](https://www.nasa.gov/directorates/esdmd/hhp/toxicology-and-environmental-chemistry/).
- **Lua** · Comparar mapas de temperatura e de indícios de hidrogênio ajuda a escolher áreas para investigar gelo. Diviner mede temperaturas e LEND usa contagens de nêutrons para inferir a distribuição de hidrogênio. A sobreposição é uma evidência indireta para escolher o próximo ponto de investigação. [Instrumentos do LRO](https://science.nasa.gov/mission/lro/spacecraft-and-instruments/).
- **Marte** · Investigar tempo local e geologia pede medidas diferentes. MEDA mede variáveis atmosféricas e poeira em Jezero. PIXL mapeia elementos por fluorescência de raios X. O exercício liga cada pergunta à escolha de instrumento e ao produto que chega à equipe. [Instrumentos do Perseverance](https://science.nasa.gov/mission/mars-2020-perseverance/science-instruments/).

## Uso das fichas na aplicação

1. Exibir **Referência NASA** com `fact`, o estado factual e o link correspondente em `sourceIds`. Usar **Uso previsto** para o Antares 330 e **Combinação didática** para a ficha de sensor estelar com rádio.
2. Exibir massa, capacidade, compartimentos, duração, créditos, energia e pontuação da montagem sob **Regra do jogo**. Uma ficha genérica de tecnologia descreve o princípio e a fase de uso. Especificações de voo exigem referência a uma configuração e missão concretas.
3. Na preparação, ligar uma escolha à pergunta e à medida previstas. No relatório, mostrar primeiro o dado recebido ou faltante e o evento que explica o resultado. Exemplos de comparação incluem reserva de energia na sombra, apontamento do instrumento e entrega de dados pelo rádio.

O JSON é um registro de proveniência e sugestões de integração. As histórias já documentadas para Cerrado, Bennu e Webb têm seu próprio [registro de evidências](44-HISTORIAS-REAIS-E-LIMITES-DIDATICOS.md).
