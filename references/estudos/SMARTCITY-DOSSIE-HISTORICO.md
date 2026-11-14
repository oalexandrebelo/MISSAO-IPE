# Dossiê de jogos e cidades — referência histórica

**Projeção pública produzida em 14/11/2026. Corte da fonte: sem data explícita no cabeçalho do original; consultado em 14/11/2026.**

> Referência histórica de outro projeto. Os prompts, comandos e instruções internos pertencem ao SmartCity e não se aplicam ao PROJETO IPÊ. Afirmações, regras de concurso, elegibilidade, dependências e resultados não se transferem ao Ipê. Blocos de código são texto documental, não ações autorizadas.

Origem no acervo fornecido: `Estudos/dossi_t_cnico_jogos_abertos_vibe_coding_smart_cities_tr_nsito_educativo.md`. O corpo preserva o texto original, exceto as transformações públicas declaradas no [índice de procedência](README.md). Não houve execução dos prompts, instalação das dependências ou revalidação das afirmações históricas para esta publicação.

Os arquivos externos citados pelo texto — ZIP, imagens, documentos legais, resultados de testes e projetos de referência — não foram fornecidos como arquivos separados nesta pasta de três Markdown e não foram fabricados nem anexados. Trechos incorporados no Markdown permanecem como exemplos.

---

# DOSSIÊ TÉCNICO GLOBAL: ENGENHARIA DE JOGOS, VIBE CODING, CIDADES INTELIGENTES, TURISMO DIGITAL E SEGURANÇA VIÁRIA

---

## SUMÁRIO GERAL

1. [PANORAMA DE VIBE CODING & FERRAMENTAS AI-NATIVE PARA GAMEDEV](#1-panorama-de-vibe-coding--ferramentas-ai-native-para-gamedev)
2. [GRANDES PROJETOS ABERTOS GLOBAIS DE JOGOS E SIMULAÇÃO](#2-grandes-projetos-abertos-globais-de-jogos-e-simulação)
3. [MOBILIDADE URBANA, ENGENHARIA DE TRÁFEGO E EDUCAÇÃO VIÁRIA](#3-mobilidade-urbana-engenharia-de-tráfego-e-educação-viária)
4. [CIDADES INTELIGENTES, GÊMEOS DIGITAIS E TRANSFORMAÇÃO DIGITAL](#4-cidades-inteligentes-gêmeos-digitais-e-transformação-digital)
5. [TURISMO INTELIGENTE, GEOTECNOLOGIA E PATRIMÔNIO DIGITAL (LBS)](#5-turismo-inteligente-geotecnologia-e-patrimônio-digital-lbs)
6. [MOTORES PEDAGÓGICOS GLOBAIS, APRENDIZAGEM CIENTÍFICA E LÓGICA](#6-motores-pedagógicos-globais-aprendizagem-científica-e-lógica)
7. [MODELAGEM CINEMÁTICA E ESPECIFICAÇÃO MATEMÁTICA DE TRÂNSITO](#7-modelagem-cinemática-e-especificação-matemática-de-trânsito)
8. [BLUEPRINT DE ENGENHARIA: MOTOR AUTOCONTIDO (TYPESCRIPT)](#8-blueprint-de-engenharia-motor-autocontido-typescript)
9. [DIRETIVAS DE ENGENHARIA PARA AGENTES DE IA (.CURSORRULES)](#9-diretivas-de-engenharia-para-agentes-de-ia-cursorrules)
10. [ROTEIRO METODOLÓGICO DE IMPLANTAÇÃO MUNICIPAL (5 FASES)](#10-roteiro-metodológico-de-implantação-municipal-5-fases)

---

## 1. PANORAMA DE VIBE CODING & FERRAMENTAS AI-NATIVE PARA GAMEDEV

O conceito de *Vibe Coding* transcende o mero autocompletar sintático: trata-se da condução de desenvolvimento de software onde a especificação semântica de alto nível, os grafos de dependência e as lógicas de gameplay são gerados e orquestrados por Grandes Modelos de Linguagem (LLMs) integrados via protocolos de contexto aberto (como o Model Context Protocol - MCP).

Abaixo estão listados os repositórios públicos, motores e ferramentas que sustentam esse fluxo na indústria de jogos:

### 1.1 Motores e Camadas de Abstração AI-First
* **VibeGame (`https://github.com/dylanebert/vibegame`)**
  * **Stack:** TypeScript, WebGL, Entity-Component-System (ECS).
  * **Licença:** MIT.
  * **Diferencial Arquitetural:** Motor 3D web desenhado especificamente para interação via prompts. Elimina interfaces baseadas em binários e painéis visuais pesados; cada cena, colisor e comportamento é expresso em sintaxe declarativa textual e arquivos de contexto (`llms.txt`).
  * **Ponto de Injeção de Agentes:** Ideal para agentes locais (Claude Code, Cursor) gerarem lógica procedural de física e movimentação sem etapas de compilação intermediárias.

* **Vibe GameDev for Unity (`https://github.com/ryholmdahl/vibe-gamedev`)**
  * **Stack:** C#, Python, Unity Editor Bridge.
  * **Licença:** MIT.
  * **Diferencial Arquitetural:** Servidor de automação local que expõe a árvore de GameObjects da Unity, componentes de física e hierarquias de cena como recursos JSON consultáveis por ferramentas MCP.
  * **Ponto de Injeção de Agentes:** Um agente LLM pode inspecionar a hierarquia ativa, criar nós de física 3D, ajustar valores de atrito de materiais e atrelar scripts sem intervenção do ponteiro do mouse.

* **SparkLabs (`https://github.com/Yuan-ManX/SparkLabs`)** *(China)*
  * **Stack:** Python, C++, bindings para Unity e Godot.
  * **Licença:** Apache-2.0.
  * **Diferencial Arquitetural:** Framework multiagente criado na comunidade chinesa de IA para orquestrar comportamentos emergentes. Provê memória de longo prazo para NPCs (via vetores e RAG), planejamento hierárquico de tarefas e balanceamento adaptativo de gameplay em tempo de execução.

* **PlumAI Godot (`https://github.com/danielmerja/PlumAI`)**
  * **Stack:** C++, GDScript, Godot Engine.
  * **Licença:** MIT.
  * **Diferencial Arquitetural:** Extensão nativa para a Godot Engine que acopla modelos de geração procedural de malhas, texturas e roteiros em GDScript diretamente no editor de nós da engine.

### 1.2 Simuladores de Agentes e Modelos de Mundo Generativos
* **Generative Agents (Stanford / Google) (`https://github.com/joonspk-research/generative_agents`)**
  * **Stack:** Python, Django, Phaser.js.
  * **Licença:** Apache-2.0.
  * **Diferencial Arquitetural:** Marco acadêmico da IA generativa interativa. Implementa uma arquitetura de cognição com módulos de *Memória*, *Reflexão* e *Planejamento* sobre 25 agentes virtuais que habitam a vila "Smallville", organizam eventos comunitários, propagam notícias e desenvolvem rotinas sem regras fixas predeterminadas.

* **Open-Oasis (Decart & Etched) (`https://github.com/etched-ai/open-oasis`)**
  * **Stack:** PyTorch, CUDA, Python.
  * **Licença:** Apache-2.0.
  * **Diferencial Arquitetural:** Primeiro modelo de mundo interativo aberto onde a computação gráfica tradicional (shaders, malhas poligonais) é substituída por um modelo de difusão de vídeo autorregressivo em tempo real. O modelo recebe entradas de teclado/mouse e sintetiza o próximo frame de vídeo preservando consistência física e de voxel.

* **AI Dungeon Classic Engine (`https://github.com/latitudegames/AIDungeon`)**
  * **Stack:** Python, GPT-Neo / Transformers.
  * **Licença:** Apache-2.0.
  * **Diferencial Arquitetural:** O projeto pioneiro que estabeleceu a mecânica de aventuras de texto infinitas guiadas por processamento de linguagem natural.

---

## 2. GRANDES PROJETOS ABERTOS GLOBAIS DE JOGOS E SIMULAÇÃO

Para além de protótipos de IA, o desenvolvimento de simulações em larga escala requer o estudo dos maiores projetos mundiais de código aberto. Esses repositórios representam o estado da arte em gerenciamento de memória, concorrência, arquitetura ECS e modularidade.

```
+-----------------------------------------------------------------------------------------+
|                  PANORAMA DOS GIGANTES OPEN SOURCE DO DESENVOLVIMENTO DE JOGOS          |
+-----------------------------------------------------------------------------------------+
|   Voxel & RPG 3D         │ Estratégia e Logística      │ Sobrevivência e Simulação      |
|   - Veloren (Rust)       │ - OpenRA (C#)               │ - Cataclysm: DDA (C++)         |
|   - Luanti/Minetest (C++)│ - OpenTTD (C++)             │ - Mindustry (Java)             |
|                          │ - 0 A.D. (C++/JS)           │ - OpenXRay (C++/Vulkan)        |
+-----------------------------------------------------------------------------------------+
```

### 2.1 Veloren (`https://gitlab.com/veloren/veloren`)
* **Stack:** Rust, motor gráfico próprio sobre `wgpu`, arquitetura ECS (`specs`).
* **Licença:** GPL-3.0.
* **Escopo do Projeto:** O maior RPG de ação e simulação voxel de código aberto do mundo. Possui mais de 300 colaboradores ativos.
* **Engenharia:**
  * Servidor desacoplado capaz de lidar com centenas de conexões simultâneas via UDP.
  * Pipeline completo de geração procedural de terreno (placas tectônicas, biomas hidrológicos, erosão, rotas comerciais simuladas séculos antes do início do jogo).
  * Código em Rust de alta segurança de memória (*zero-cost abstractions*), servindo de modelo global para motores de física e agentes concorrentes.

### 2.2 Cataclysm: Dark Days Ahead (C-DDA) (`https://github.com/CleverRaven/Cataclysm-DDA`)
* **Stack:** C++17, Lua, serialização profunda em JSON.
* **Licença:** CC-BY-SA-3.0 / GPL-3.0.
* **Escopo do Projeto:** Um dos repositórios de simulação mais complexos da história do desenvolvimento de software, com centenas de milhares de commits.
* **Engenharia:**
  * Simulação microscópica de termodinâmica corporal, decomposição de nutrientes, balística de materiais e física veicular parte por parte (peso por eixo, atrito do tipo de borracha, conexões elétricas de alternadores).
  * Estrutura altamente modular onde itens, monstros, facções e regras de clima são externalizados em JSON, permitindo que agentes LLM adicionem sistemas inteiros sem recompilar o binário em C++.

### 2.3 OpenRA (`https://github.com/OpenRA/OpenRA`)
* **Stack:** C#, OpenGL, multi-engine renderer.
* **Licença:** GPL-3.0.
* **Escopo do Projeto:** Reimplementação e modernização de motores clássicos de estratégia em tempo real (Command & Conquer, Red Alert, Dune 2000).
* **Engenharia:**
  * Algoritmos de busca de caminho (*Pathfinding*) hierárquicos otimizados para milhares de unidades simultâneas.
  * Arquitetura em camadas com sincronização determinística de estado de rede via Lockstep.

### 2.4 OpenTTD (`https://github.com/OpenTTD/OpenTTD`)
* **Stack:** C++, SDL.
* **Licença:** GPL-2.0.
* **Escopo do Projeto:** O padrão global de simulação econômica e logística de transporte (ferroviário, rodoviário, aéreo e hidroviário).
* **Engenharia:**
  * API nativa `NoAI`: interface dedicada para desenvolvimento de inteligências artificiais concorrentes em Squirrel ou C++, com cálculo de rotas econômicas, ROI de linhas de trem e balanceamento de malha de carga.

### 2.5 Mindustry (`https://github.com/Anuken/Mindustry`)
* **Stack:** Java, framework proprietário `Arc`.
* **Licença:** GPL-3.0.
* **Escopo do Projeto:** Sucesso comercial e de comunidade aberta mundial (com volume massivo de contribuições na China, Coreia do Sul e Japão).
* **Engenharia:**
  * Mecânica híbrida de Tower Defense e automação fabril estilo Factorio.
  * Emulação de processadores lógicos virtuais: os jogadores programam micro-instruções (semelhantes a assembly) em terminais virtuais dentro do jogo para controlar portas lógicas, direcionar frotas de drones e regular fluxo de esteiras.

### 2.6 Ecossistema Leste-Europeu e Russo: Preservação e Engenharia Reversa
* **OpenXRay (`https://github.com/OpenXRay/xray-16`):**
  * Modernização em C++ e Vulkan da X-Ray Engine da franquia S.T.A.L.K.E.R. Mantida predominantemente por desenvolvedores do Leste Europeu, é utilizada para experimentos de inteligência artificial de vida simulada autônoma (sistema A-Life).
* **VCMI (`https://github.com/vcmi/vcmi`):**
  * Recriação completa em C++ da engine do Heroes of Might and Magic III. Serve de base aberta para implementação de modelos de aprendizado por reforço profundo aplicados a combate tático em malha hexagonal.

---

## 3. MOBILIDADE URBANA, ENGENHARIA DE TRÁFEGO E EDUCAÇÃO VIÁRIA

Esta vertical engloba simuladores microscópicos, cálculo cinético de desaceleração, comportamentos estocásticos de travessia e ambientes virtuais para formação de condutores e pedestres.

```
+---------------------------------------------------------------------------------------+
|                               CAMADA DE MICROSSIMULAÇÃO                               |
+---------------------------------------------------------------------------------------+
|  Topologia Geoespacial     │ Modelagem Cinética & Comportamental │ Protocolos de Rede |
|  - OpenStreetMap (.osm)    │ - IDM (Intelligent Driver Model)    │ - TraCI (TCP/IP)   |
|  - ASAM OpenDRIVE (.xodr)  │ - Social Force Model (Pedestres)    │ - ROS2 / Autoware  |
|  - CityGML / GeoJSON       │ - Krauß / Wiedemann 99              │ - gRPC / WebSockets|
+---------------------------------------------------------------------------------------+
                                           │
                                           ▼
+---------------------------------------------------------------------------------------+
|                              MOTORES DE EXECUÇÃO ABERTOS                              |
|  1. Eclipse SUMO (C++/Python)       -> Escala de malha viária municipal/regional      |
|  2. CARLA Simulator (Unreal/C++)    -> Visão em primeira pessoa, sensores físicos     |
|  3. A/B Street (Rust/Wasm)          -> Urbanismo tático e microssimulação ativa       |
|  4. CityFlow / CBEngine (C++/Py)    -> RL massivo e controle semafórico adaptativo    |
|  5. OpenDS (Java/jMonkey)           -> Ergonomia de condutores e distração ao volante |
+---------------------------------------------------------------------------------------+
```

### 3.1 Eclipse SUMO (Simulation of Urban MObility)
* **Organização:** DLR (Centro Aeroespacial Alemão) / Eclipse Foundation.
* **Repositório:** `https://github.com/eclipse-sumo/sumo`
* **Linguagens & Stack:** C++17 (core), Python (`traci`, `libsumo`), XML Schemas estritos.
* **Módulos do Sistema:**
  * `netconvert`: Ingestor universal de cartografia. Lê arquivos brutos do OpenStreetMap (`.osm`), OpenDRIVE (`.xodr`), Shapefiles e VISUM, compilando-os em topologias viárias com conexões de faixas calculadas métrica a métrica.
  * `duarouter`: Gerador de roteamento dinâmico que implementa o equilíbrio de Wardrop através dos algoritmos de Dijkstra e A*.
  * `TraCI (Traffic Control Interface)`: Servidor TCP/IP local que permite inspecionar e alterar em tempo real o estado de cada semáforo, velocidade de cada automóvel, ângulo de aproximação de bicicletas e posição de pedestres.
* **Modelos de Tráfego Imputados:**
  * **Krauß:** Modelo de acompanhamento veicular livre de colisões com desaceleração determinística.
  * **Intelligent Driver Model (IDM):** Modela a aceleração suave dependente da relação de velocidade com o veículo líder.
  * **Social Force Model (Helbing & Molnár):** Rege a dinâmica microscópica de pedestres, calculando vetores repulsivos contra obstáculos e outros transeuntes.
* **Potencial em Vibe Coding:** Agentes LLM podem gerar scripts de orquestração Python que consomem o módulo `traci` para acionar eventos didáticos: corte abrupto de semáforo, veículos furando sinal e medição precisa de tempo de frenagem.

### 3.2 CARLA Simulator
* **Organização:** Computer Vision Center (Espanha) / Linux Foundation.
* **Repositório:** `https://github.com/carla-simulator/carla`
* **Linguagens & Stack:** Unreal Engine 4/5, C++, Python 3, especificações ASAM OpenDRIVE e OpenSCENARIO.
* **Capacidades Operacionais:**
  * Motor de referência global para simulação de condução autônoma e treinamento sensorial.
  * Emulação exata de sensores: Câmeras RGB, Matrizes de Profundidade, Câmeras de Segmentação Semântica (onde cada pedestre, faixa e asfalto tem um ID numérico), LIDAR de feixes configuráveis e Radares.
* **Aplicação em Educação Viária:**
  * Permite colocar o usuário em uma cabine virtual para experienciar situações extremas: perda súbita de aderência por óleo ou aquaplanagem, cones de ponto cego em carretas e o perigo de travessia infantil entre veículos estacionados.

### 3.3 A/B Street
* **Repositório:** `https://github.com/a-b-street/abstreet`
* **Linguagens & Stack:** Rust puro, biblioteca gráfica `widgetry`, suporte nativo a WebAssembly.
* **Inovação Técnica:**
  * Ao contrário de simuladores macroscópicos que usam grafos simples de linha de centro, o A/B Street renderiza as vias de meio-fio a meio-fio, dividindo o espaço métrico entre calçadas, faixas de rolamento, baias de ônibus e ciclovias.
  * Permite editar o desenho urbano instantaneamente: transformar uma rua residencial em uma via de tráfego restrito (*Low Traffic Neighborhood*) e calcular os desvios causados nas rotas vizinhas.

### 3.4 CityFlow & CBEngine (China / Pesquisa de MARL Urbano)
* **Repositórios:** `https://github.com/cityflow-project/CityFlow` | `https://github.com/DistMe/CBEngine`
* **Instituições:** Tsinghua University, Penn State University, Shanghai Jiao Tong University.
* **Stack:** C++ multi-threaded otimizado com wrappers para Gymnasium e PyTorch.
* **Diferencial:** Capaz de simular mais de 10 milhões de veículos por segundo em uma CPU intermediária. Focado no treinamento de controladores semafóricos neurais via aprendizado por reforço multiagente (MARL).

### 3.5 OpenDS
* **Repositório:** `https://github.com/OpenDS/OpenDS`
* **Stack:** Java, jMonkeyEngine 3.
* **Foco Pedagógico:** Simulador projetado por centros de ergonomia e psicologia de transporte na Alemanha para autoescolas e pesquisas de fadiga. Integra-se a equipamentos de rastreamento ocular (*eye-trackers*) para quantificar a perda de atenção provocada por notificações no smartphone.

---

## 4. CIDADES INTELIGENTES, GÊMEOS DIGITAIS E TRANSFORMAÇÃO DIGITAL

Projetos voltados à orquestração de dados municipais, governança aberta, redes de sensores IoT e simulação macroeconômica.

| Projeto / Plataforma | Mantenedor / Origem | Stack Tecnológica | Padrão / Protocolo | Papel em Smart Cities |
| :--- | :--- | :--- | :--- | :--- |
| **FIWARE Orion-LD**<br>`github.com/FIWARE/context.Orion-LD` | FIWARE Foundation (UE) | C++, Libmicrohttpd, MongoDB | NGSI-LD (ETSI Standard), JSON-LD | Corretor de contexto central. Padroniza dados de sensores de lixeiras, iluminação, radares e estações de qualidade do ar. |
| **Smart Data Models**<br>`github.com/smart-data-models` | Consórcio Global Aberto | JSON Schema, GeoJSON | ETSI, TM Forum | Repositório de esquemas abertos para modelagem de entidades municipais (estacionamentos inteligentes, hidrantes, sensores). |
| **CityBound**<br>`github.com/citybound/citybound` | Projeto Aberto Comunitário | Rust, Bevy Engine, WebAssembly | ECS Concorrente | Simulação microscópica da economia urbana. Cada habitante sintético possui orçamento, rotina de trabalho e consumo energético. |
| **UrbanSim / UDST**<br>`github.com/UDST/urbansim` | Urban Data Science Toolkit | Python, Cython, Pandas, NumPy | LUTI (Land Use Transport Interaction) | Modelagem econométrica do uso do solo urbano. Usado por governos para projetar impactos de planos diretores em 20 ou 30 anos. |
| **Bigscity / LibCity**<br>`github.com/LibCity/Bigscity-LibCity` | Beihang University (China) | Python, PyTorch, Ray | Spatio-Temporal Graph Neural Networks | Benchmark asiático para previsão de fluxo de tráfego, demanda de micro-mobilidade e alocação ótima de infraestruturas públicas. |
| **Decidim**<br>`github.com/decidim/decidim` | Prefeitura de Barcelona / Global | Ruby on Rails, React, PostgreSQL | Open Government Data, OAuth2 | Framework de democracia participativa e governança digital aberta, permitindo orçamentos participativos gamificados. |

```
+-----------------------------------------------------------------------------------------+
|                  ARQUITETURA DE DADOS: DO SENSOR FÍSICO À GAMIFICAÇÃO                   |
+-----------------------------------------------------------------------------------------+
|   [ SENSORES MUNICIPAIS IoT ] -> Protocolos MQTT / HTTP                                 |
|   (Radares de Velocidade, Contadores de Ciclistas, Estações Meteorológicas, Lixeiras)   |
|                                │                                                        |
|                                ▼                                                        |
|   [ FIWARE ORION-LD CONTEXT BROKER ] -> Especificação NGSI-LD                           |
|   (Entidades de Contexto Estruturadas com GeoJSON e Séries Temporais)                   |
|                                │                                                        |
|                                ▼ [WebSockets / GraphQL]                                 |
|   [ MOTOR DO JOGO / DIGITAL TWIN ] -> MapLibre GL / Three.js / Cesium                   |
|   - Gamificação do Orçamento Municipal (Cálculo de Eficiência Ecológica)                |
|   - Visualização de Pontos Críticos de Acidentes e Emissões de CO2                      |
+-----------------------------------------------------------------------------------------+
```

---

## 5. TURISMO INTELIGENTE, GEOTECNOLOGIA E PATRIMÔNIO DIGITAL (LBS)

Plataformas para gamificação baseada em localização espacial (*Location-Based Services - LBS*), renderização de nuvens de pontos de monumentos tombados e cartografia vetorial aberta.

### 5.1 StreetComplete (`https://github.com/streetcomplete/StreetComplete`)
* **Stack:** Kotlin nativo, Android SDK, SQLite / Room, OpenStreetMap API.
* **Licença:** GPL-3.0.
* **Mecânica Central de Gamificação Cívica:**
  * O aplicativo pesquisa lacunas cadastrais no OpenStreetMap em um raio próximo à localização do usuário via Overpass API.
  * O cidadão resolve "quests" (desafios lúdicos): verificar acessibilidade de cadeirantes na entrada de um museu, informar se uma rua possui piso tátil, ou registrar o horário de funcionamento de uma feira pública.
* **Reaproveitamento de Engenharia:** A arquitetura modular de classes em `app/src/main/java/de/westnordost/streetcomplete/quests` permite criar versões municipais de "Caça ao Tesouro Turístico", substituindo tarefas genéricas por charadas culturais e fatos históricos georreferenciados.

### 5.2 Ecossistema Cesium (CesiumJS & Cesium for Unreal)
* **Repositórios:** `https://github.com/CesiumGS/cesium` | `https://github.com/CesiumGS/cesium-unreal`
* **Padrões de Dados:** OGC 3D Tiles 1.1, glTF 2.0 com compressão Draco, GeoTIFF, WGS84.
* **Aplicações em Turismo:**
  * Permite carregar cidades inteiras em escala métrica 1:1, combinando malhas fotogramétricas de monumentos com dados de elevação de terreno.
  * Base para visitas virtuais imersivas acessíveis e linhas do tempo históricas que renderizam monumentos em diferentes épocas.

### 5.3 Potree (`https://github.com/potree/potree`)
* **Stack:** JavaScript, WebGL, Three.js.
* **Licença:** BSD-2-Clause.
* **Foco:** Visualizador web de nuvens de pontos LIDAR de alta densidade (centenas de bilhões de pontos) estruturados em Octree. É o padrão internacional para preservação digital de sítios arqueológicos, ruínas e fachadas históricas, rodando diretamente no navegador sem plugins proprietários.

### 5.4 MapLibre GL (`https://github.com/maplibre/maplibre-gl-js`)
* **Stack:** TypeScript (Web), C++ (Native Android/iOS).
* **Licença:** BSD-3-Clause.
* **Foco:** Fork comunitário e 100% aberto do Mapbox GL original. Renderiza dados cartográficos vetoriais (MVT) a 60 FPS com aceleração de hardware (WebGL/WebGPU). Permite construir jogos estilo Pokémon GO sem custos recorrentes de APIs comerciais de mapas.

### 5.5 Indexação Espacial Avançada (Uber H3 & Google S2)
* **H3 (`https://github.com/uber/h3`):** Sistema de particionamento global em grades hexagonais discretas. Essencial para turismo inteligente ao agrupar a densidade de visitantes, criar zonas de calor de segurança viária e modelar preços dinâmicos de passagens ou ingressos.
* **S2 Geometry (`https://github.com/google/s2geometry`):** Projeção da esfera terrestre em um cubo desdobrado em quadtrees hierárquicas. Ideal para indexação e busca ultra-rápida de pontos de interesse (POIs) em raios de proximidade métricos.

---

## 6. MOTORES PEDAGÓGICOS GLOBAIS, APRENDIZAGEM CIENTÍFICA E LÓGICA

Frameworks didáticos consolidados que fornecem padrões comprovados de design instrucional, telemetria pedagógica e física interativa.

```
+-----------------------------------------------------------------------------------------+
|                  ECOSSISTEMAS DIDÁTICOS E SANDBOXES DE APRENDIZAGEM                     |
+-----------------------------------------------------------------------------------------+
|   Simulações Científicas   │ Sandboxes de Automação     │ Alfabetização e Lógica        |
|   - PhET Sims (TS/Canvas)  │ - Luanti/Minetest (Lua/C++)│ - GCompris (C++/QML)          |
|   - The Powder Toy (C++)   │ - Screeps (Node.js/WebGL)  │ - CodeCombat (CoffeeScript/JS)|
|                            │ - Mindustry (Java)         │ - SugarLabs MusicBlocks (JS)  |
+-----------------------------------------------------------------------------------------+
```

### 6.1 Luanti / Minetest (`https://github.com/minetest/minetest`)
* **Stack:** C++ (Core de renderização e física voxel), Lua (API declarativa de extensões).
* **Licença:** LGPL-2.1.
* **Aplicação em Cidades Inteligentes e Ensino Técnico:**
  * Ecossistema sandbox aberto onde alunos podem programar redes complexas via mods:
    * `advtrains`: Simulação ferroviária realista com cálculo de aceleração por carga, controle de desvios e sinalização por blocos semafóricos elétricos.
    * `mesecons` & `digilines`: Emulação completa de sinais lógicos binários, barramentos de comunicação digital e microcontroladores virtuais programáveis em Lua, transformando o jogo em um laboratório aberto de sensores de cidades inteligentes e IoT.

### 6.2 PhET Interactive Simulations (`https://github.com/phetsims`)
* **Instituição:** Universidade do Colorado em Boulder.
* **Stack:** TypeScript, JavaScript, HTML5 Canvas, SVG, WebGL.
* **Licença:** GPL-3.0.
* **Padrões de Engenharia Pedagógica:**
  * **Axon (`phet-core/axon`):** Biblioteca reativa que estabelece instâncias observáveis (`Property<T>`). Quando um valor cinemático muda (ex.: coeficiente de atrito do pavimento), a interface, os gráficos vetoriais e os medidores virtuais se atualizam instantaneamente.
  * **Tandem:** Sistema de instrumentação profunda de dados que registra cada decisão do estudante para análise de aprendizagem pós-interação (*learning analytics*).

### 6.3 GCompris (`https://invent.kde.org/education/gcompris`)
* **Instituição:** KDE Community.
* **Stack:** C++, QML / Qt Quick 2.
* **Licença:** GPL-3.0.
* **Foco:** Mais de 100 atividades lúdicas de ciências, matemática, alfabetização e noções de trânsito. A arquitetura em QML mantém interface vetorial, animações e regras pedagógicas isoladas em arquivos declarativos de fácil manutenção por agentes de IA.

### 6.4 CodeCombat & Screeps
* **CodeCombat (`https://github.com/codecombat/codecombat`):** Plataforma web voltada para escolas que ensina lógica de programação (Python, JavaScript, Lua) transformando comandos de sintaxe real em movimentações de personagens e resolução de labirintos.
* **Screeps (`https://github.com/screeps/screeps`):** MMO para programadores rodando em Node.js. Os jogadores não controlam suas unidades com cliques manuais; escrevem scripts reais em JavaScript que rodam 24/7 gerenciando coleta de recursos, expansão militar e logística de rotas.

---

## 7. MODELAGEM CINEMÁTICA E ESPECIFICAÇÃO MATEMÁTICA DE TRÂNSITO

Um jogo educativo sério voltado à segurança viária deve reproduzir as equações fundamentais da física clássica, abandonando aproximações lineares inverossímeis.

### 7.1 Distância de Percepção e Reação ($d_r$)
Durante o período em que o motorista enxerga o obstáculo e aciona o pedal de freio, o veículo trafega em Movimento Retilíneo Uniforme (MRU):

$$d_r = v_0 \cdot t_r$$

Onde:
* $v_0$ é a velocidade inicial em metros por segundo:
  $$v_0 = \frac{v_{\text{km/h}}}{3.6}$$
* $t_r$ é o tempo de percepção e reação humano:
  * Motorista atento em condições normais: $t_r \approx 1.5\text{ s}$
  * Motorista desatento / utilizando smartphone: $t_r \approx 2.5\text{ s} \text{ a } 3.0\text{ s}$
  * Condutor fatigado ou sob efeito de substâncias: $t_r > 3.5\text{ s}$

---

### 7.2 Distância Efetiva de Frenagem ($d_f$)
Após o início da desaceleração mecânica provocada pelo contato pneu-asfalto, o trabalho realizado pela força de atrito dissipa a energia cinética do veículo:

$$W_{\text{atrito}} = \Delta E_c$$

$$F_{\text{atrito}} \cdot d_f = \frac{1}{2} m v_0^2$$

Substituindo a força de atrito ($F_{\text{atrito}} = \mu \cdot m \cdot g$):

$$\mu \cdot m \cdot g \cdot d_f = \frac{1}{2} m v_0^2$$

Isolando $d_f$:

$$d_f = \frac{v_0^2}{2 \cdot \mu \cdot g}$$

Onde:
* $\mu$ é o coeficiente de atrito longitudinal entre pneu e pista (adimensional):
  * Asfalto seco com pneus novos: $\mu \approx 0.75 - 0.85$
  * Asfalto molhado (chuva moderada): $\mu \approx 0.35 - 0.45$
  * Pista com lâmina de água (risco de aquaplanagem): $\mu \approx 0.20$
  * Pista com óleo ou lama fina: $\mu \approx 0.15$
* $g$ é a aceleração da gravidade local ($g = 9.81\text{ m/s}^2$).

---

### 7.3 Distância Total de Parada ($D_{\text{total}}$)
A distância total percorrida pelo veículo desde a identificação do perigo até o repouso absoluto é dada por:

$$D_{\text{total}} = d_r + d_f = \left( \frac{v_{\text{km/h}}}{3.6} \cdot t_r \right) + \left( \frac{\left( \frac{v_{\text{km/h}}}{3.6} \right)^2}{2 \cdot \mu \cdot g} \right)$$

---

## 8. BLUEPRINT DE ENGENHARIA: MOTOR AUTOCONTIDO (TYPESCRIPT)

Abaixo está a implementação de referência de um motor completo de trânsito educativo e turismo inteligente em TypeScript puro. O código opera sem dependências externas e pode ser executado em navegadores (Canvas 2D) ou no Node.js.

```typescript
/**
 * civic_traffic_engine.ts
 * Motor de Microssimulação de Trânsito Educativo, Cinemática e Turismo Inteligente.
 * Licença: MIT
 */

export interface SimulationConfig {
  speedLimitKmh: number;
  frictionCoefficient: number; // mu
  driverReactionTime: number;  // segundos
  trafficLightState: 'VERDE' | 'AMARELO' | 'VERMELHO';
  scalePixelsPerMeter: number;
}

export interface PointOfInterest {
  id: string;
  name: string;
  category: 'PATRIMONIO_HISTORICO' | 'INFRAESTRUTURA_SMART' | 'PRESERVACAO_AMBIENTAL';
  positionX: number; // metros na via
  description: string;
  unlocked: boolean;
}

export interface TelemetryReport {
  currentPositionMeters: number;
  currentSpeedKmh: number;
  stoppingDistanceMetrics: {
    reactionDistanceMeters: number;
    brakingDistanceMeters: number;
    totalStoppingDistanceMeters: number;
  };
  infractions: string[];
  systemLogs: string[];
}

export class CivicTrafficEngine {
  private carX: number = 0; // Posição em metros
  private currentSpeedMps: number; // m/s
  private isBraking: boolean = false;
  private brakingElapsedTime: number = 0;
  private readonly g: number = 9.81;

  public config: SimulationConfig;
  public pedestrianCrossingX: number = 250; // Faixa de pedestres a 250 metros
  public pointsOfInterest: PointOfInterest[] = [];
  public infractions: string[] = [];
  public systemLogs: string[] = [];

  constructor(initialSpeedKmh: number = 60, friction: number = 0.75, reactionTime: number = 1.5) {
    this.config = {
      speedLimitKmh: 60,
      frictionCoefficient: friction,
      driverReactionTime: reactionTime,
      trafficLightState: 'VERMELHO',
      scalePixelsPerMeter: 4.0
    };
    this.currentSpeedMps = initialSpeedKmh / 3.6;
    this.initializePointsOfInterest();
  }

  private initializePointsOfInterest(): void {
    this.pointsOfInterest.push({
      id: 'poi-01',
      name: 'Palacete Histórico Provincial',
      category: 'PATRIMONIO_HISTORICO',
      positionX: 130,
      description: 'Edifício neobarroco de 1892 tombado pelo patrimônio histórico cultural.',
      unlocked: false
    });
    this.pointsOfInterest.push({
      id: 'poi-02',
      name: 'Estação Meteorológica e Sensor IoT de Ar',
      category: 'INFRAESTRUTURA_SMART',
      positionX: 320,
      description: 'Sensor em malha de cidade inteligente conectado ao barramento FIWARE Orion-LD.',
      unlocked: false
    });
  }

  public activateBrakes(): void {
    if (!this.isBraking) {
      this.isBraking = true;
      this.brakingElapsedTime = 0;
      this.systemLogs.push("COMANDO: Freio de emergência acionado pelo condutor.");
    }
  }

  public setWeatherCondition(condition: 'SECO' | 'CHUVA' | 'OLEO_LAMA'): void {
    switch (condition) {
      case 'SECO':
        this.config.frictionCoefficient = 0.75;
        break;
      case 'CHUVA':
        this.config.frictionCoefficient = 0.38;
        break;
      case 'OLEO_LAMA':
        this.config.frictionCoefficient = 0.18;
        break;
    }
    this.systemLogs.push(`AMBIENTE: Clima atualizado para ${condition} (Atrito mu: ${this.config.frictionCoefficient}).`);
  }

  public setDriverDistraction(distracted: boolean): void {
    this.config.driverReactionTime = distracted ? 2.8 : 1.5;
    this.systemLogs.push(`CONDUTOR: Estado alterado para ${distracted ? 'DISTRAÍDO (Celular - 2.8s)' : 'ATENTO (1.5s)'}.`);
  }

  public update(deltaTimeSeconds: number): void {
    // 1. Cinemática de desaceleração considerando o tempo de percepção e reação
    if (this.isBraking && this.currentSpeedMps > 0) {
      this.brakingElapsedTime += deltaTimeSeconds;

      // O veículo só dissipa energia de frenagem após o decurso do tempo de reação humano
      if (this.brakingElapsedTime >= this.config.driverReactionTime) {
        const deceleration = this.config.frictionCoefficient * this.g;
        this.currentSpeedMps = Math.max(0, this.currentSpeedMps - (deceleration * deltaTimeSeconds));
      }
    }

    // 2. Integração de Posição
    this.carX += this.currentSpeedMps * deltaTimeSeconds;

    // 3. Auditoria de Faixa de Pedestre e Semáforo
    if (this.currentSpeedMps === 0 && this.isBraking) {
      const distanceToCrossing = this.pedestrianCrossingX - this.carX;
      if (distanceToCrossing < -1.5) {
        this.recordInfraction(`INFRAÇÃO GRAVÍSSIMA: O veículo invadiu a faixa e parou ${Math.abs(distanceToCrossing).toFixed(2)}m além da área permitida.`);
      } else if (distanceToCrossing >= 0 && distanceToCrossing <= 12.0) {
        this.systemLogs.push(`DIREÇÃO DEFENSIVA: Imobilização segura realizada a ${distanceToCrossing.toFixed(2)}m da faixa de travessia.`);
      }
    }

    // 4. Auditoria de Limite de Velocidade
    const currentSpeedKmh = this.currentSpeedMps * 3.6;
    if (currentSpeedKmh > this.config.speedLimitKmh + 2.0) {
      this.recordInfraction(`INFRAÇÃO MÉDIA: Velocidade registrada de ${currentSpeedKmh.toFixed(1)} km/h em via regulamentada a ${this.config.speedLimitKmh} km/h.`);
    }

    // 5. Verificação de POIs Culturais e Turísticos
    this.auditPointsOfInterest();
  }

  private auditPointsOfInterest(): void {
    for (const poi of this.pointsOfInterest) {
      if (!poi.unlocked && Math.abs(this.carX - poi.positionX) < 12.0) {
        poi.unlocked = true;
        this.systemLogs.push(`TURISMO DIGITAL DESBLOQUEADO: [${poi.name}] - ${poi.description}`);
      }
    }
  }

  private recordInfraction(description: string): void {
    if (!this.infractions.includes(description)) {
      this.infractions.push(description);
    }
  }

  public getTelemetry(): TelemetryReport {
    const v0 = this.currentSpeedMps;
    const mu = this.config.frictionCoefficient;
    const tr = this.config.driverReactionTime;

    const reactionDistance = v0 * tr;
    const brakingDistance = (v0 * v0) / (2 * mu * this.g);

    return {
      currentPositionMeters: this.carX,
      currentSpeedKmh: this.currentSpeedMps * 3.6,
      stoppingDistanceMetrics: {
        reactionDistanceMeters: reactionDistance,
        brakingDistanceMeters: brakingDistance,
        totalStoppingDistanceMeters: reactionDistance + brakingDistance
      },
      infractions: this.infractions,
      systemLogs: this.systemLogs
    };
  }
}
```

---

## 9. DIRETIVAS DE ENGENHARIA PARA AGENTES DE IA (.CURSORRULES)

Copie e armazene este bloco no arquivo `.cursorrules` (ou no painel de instruções de contexto de agentes como Claude Code e Windsurf) para assegurar rigor técnico nas extensões geradas automaticamente:

```markdown
# DOMAIN RULES: SMART CITIES, TRAFFIC SAFETY & CIVIC GAMIFICATION

## 1. Rigor Físico e Cinemático
- Proibida a implementação de desacelerações lineares fictícias ou constantes arbitrárias. Toda frenagem veicular deve empregar a cinemática baseada no coeficiente de atrito longitudinal (\mu) e na gravidade padrão ($g = 9.81\text{ m/s}^2$).
- Tempos de reação humanos estritos:
  * Motorista atento padrão: fixado em 1.5s.
  * Motorista distraído (uso de smartphone): fixado em 2.8s a 3.0s.
- Faixas de coeficiente de atrito longitudinal (\mu):
  * Asfalto seco: 0.75 a 0.85
  * Asfalto molhado por chuva: 0.35 a 0.45
  * Pista com óleo / lama / lâmina profunda: 0.15 a 0.20

## 2. Ingestão de Dados do OpenStreetMap (Overpass API)
- Utilize exclusivamente as tags formais e canônicas da especificação OSM:
  * Semáforos veiculares: `highway=traffic_signals`
  * Travessias e faixas: `highway=crossing` com `crossing=marked`
  * Moderadores de tráfego: `traffic_calming=bump` ou `traffic_calming=table`
  * Zonas de segurança escolar (30 km/h): `amenity=school`
  * Patrimônio e atrativos: `historic=*`, `tourism=attraction`, `heritage=*`

## 3. Padrões Arquiteturais de Código
- Desacoplamento estrito entre a Camada de Dinâmica Física e a Camada Visual (Three.js, MapLibre GL ou Canvas 2D).
- Implemente telemetria pedagógica reativa (padrão Observer / Axon do PhET) para registrar violações de trânsito e descobertas turísticas sem bloquear o loop de simulação a 60 FPS.
```

---

## 10. ROTEIRO METODOLÓGICO DE IMPLANTAÇÃO MUNICIPAL (5 FASES)

Estratégia para órgãos de Planejamento Urbano, Secretarias de Educação e Turismo estruturarem aplicações a partir deste dossiê:

```
[ FASE 1: MAPAS ]  ──▶  [ FASE 2: SUMO ]  ──▶  [ FASE 3: IOT ]  ──▶  [ FASE 4: WEB ]  ──▶  [ FASE 5: AUDITORIA ]
Cadastramento OSM      Simulação de Vias      Hub FIWARE/Data      Serious Game Cidadão    Avaliação de Impacto
```

1. **Fase 1: Mapeamento Aberto e Georreferenciamento (Mês 1)**
   * Capacitar servidores e alunos da rede pública para utilizar o **StreetComplete** e o editor **JOSM**, cadastrando todas as faixas de pedestre, sinalizações semafóricas, ciclovias e monumentos históricos da cidade no OpenStreetMap.
2. **Fase 2: Modelagem e Microssimulação Viária (Mês 2)**
   * Exportar a malha viária urbana para o **Eclipse SUMO** através do módulo `netconvert`. Mapear os cruzamentos com maior taxa histórica de atropelamentos e calibrar novos tempos semafóricos.
3. **Fase 3: Implantação da Camada de Dados Abertos (Mês 3)**
   * Configurar uma instância de contexto baseada em **FIWARE Orion-LD** com os esquemas da iniciativa *Smart Data Models*, conectando a telemetria dos semáforos, sensores ambientais e dados de GPS de frotas municipais.
4. **Fase 4: Publicação da Aplicação Educativa e Turística Cidadã (Mês 4)**
   * Disponibilizar uma plataforma web interativa (utilizando o motor TypeScript acima integrado ao **MapLibre GL**):
     * *Ambiente de Trânsito Escolar:* Alunos experimentam a física real de frenagem, constatando o perigo da distração por smartphone e da condução em alta velocidade sob chuva.
     * *Passaporte Cultural Gamificado:* Turistas e cidadãos recebem medalhas e desbloqueiam conteúdos históricos ao visitar os patrimônios mapeados.
5. **Fase 5: Avaliação Contínua e Impacto nas Políticas Públicas (Mês 5 em diante)**
   * Cruzar dados de redução de sinistros viários e fluxo de visitação em museus e centros culturais por meio de painéis abertos de governança urbana baseados em ferramentas cívicas como o **Decidim**.