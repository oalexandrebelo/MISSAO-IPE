# Assets e imersão para o MISSAO IPE
## Curadoria dos maiores repositórios que realmente servem

**Levantamento:** 15/11/2026 · tamanhos e estrelas via API do GitHub na data · tamanho do repositório é **proxy** do acervo (inclui histórico), não o peso do que você vai usar.

---

## 1. Como ler esta lista

Três perguntas decidem se um repositório entra no projeto:

1. **O que ele entrega** — modelo 3D, textura, componente de UI, dado científico, engine?
2. **Qual a licença** — MIT/Apache/CC0 entram; "custom" e "none" exigem checagem item a item.
3. **Quanto pesa no produto** — o MISSAO IPE precisa rodar offline, então o orçamento é rígido (§6).

> **Aviso sobre "maior":** o tamanho do repositório mede o acervo, não a utilidade. O `google/fonts` tem 3,2 GB e você usará 300 KB; o `motion` tem 1,6 GB e você usará ~40 KB. Já o `Kenney` (fora do GitHub) entrega centenas de assets CC0 que valem mais que qualquer repo gigante.

---

## 2. Os maiores, por tamanho

| Repositório | Tamanho | ★ | Licença | O que entrega | Serve ao MISSAO IPE? |
|---|---|---|---|---|---|
| [nasa/NASA-3D-Resources](https://github.com/nasa/NASA-3D-Resources) | **5,0 GB** | 3,9k | NASA media guidelines | modelos 3D, texturas e imagens de dentro da NASA (Orion, ISS, Hubble, sondas) | **Sim** — é a fonte mais rica de nave/espaçonave realista |
| [google/model-viewer](https://github.com/google/model-viewer) | 4,3 GB | 8,3k | Apache-2.0 | web component para exibir glTF/USDZ com AR | Sim — se precisar de viewer isolado |
| [recharts/recharts](https://github.com/recharts/recharts) | 4,3 GB | 27,7k | MIT | gráficos React | Sim — painéis de dose/dados |
| [google/fonts](https://github.com/google/fonts) | 3,2 GB | 20,8k | OFL por fonte | ~2.000 famílias | **Sim** — Space Grotesk / IBM Plex |
| [KhronosGroup/glTF-Sample-Assets](https://github.com/KhronosGroup/glTF-Sample-Assets) | 1,7 GB | 1,2k | por modelo (CC0/CC-BY) | modelos de teste do padrão glTF | Sim — testes de pipeline |
| [mrdoob/three.js](https://github.com/mrdoob/three.js) | 1,6 GB | 118k | MIT | engine 3D web + centenas de exemplos | **Sim** — base de toda a imersão 3D |
| [motiondivision/motion](https://github.com/motiondivision/motion) | 1,6 GB | 35k | MIT | animação React/JS (Framer Motion) | **Sim** — transições de HUD |
| [BabylonJS/Babylon.js](https://github.com/BabylonJS/Babylon.js) | 1,4 GB | 26k | Apache-2.0 | engine 3D completa com editor | Alternativa ao three.js (mais pesada) |
| [CesiumGS/cesium](https://github.com/CesiumGS/cesium) | 1,2 GB | 16k | Apache-2.0 | globo 3D com tempo e terreno | Sim, se o mapa da Terra for central |
| [tabler/tabler-icons](https://github.com/tabler/tabler-icons) | 1,1 GB | 22,7k | MIT | 6.500+ ícones SVG | **Sim** — ícones do HUD |
| [excaliburjs/Excalibur](https://github.com/excaliburjs/Excalibur) | 620 MB | 2,4k | BSD-2 | engine 2D TypeScript | Pouco — o jogo é de painéis |
| [NASA-AMMOS/3DTilesSampleData](https://github.com/NASA-AMMOS/3DTilesSampleData) | 570 MB | 21 | NASA | tiles 3D de Marte/Lua (JPL) | Sim, para terreno planetário |
| [godotengine/godot-demo-projects](https://github.com/godotengine/godot-demo-projects) | 540 MB | 9,8k | MIT | demos e templates Godot | Só se migrar para Godot |
| [OpenSpace/OpenSpace](https://github.com/OpenSpace/OpenSpace) | 530 MB | 1,3k | custom | astrovisualização científica (C++/Qt) | Não como runtime — como referência/vídeo |
| [phaserjs/phaser](https://github.com/phaserjs/phaser) | 460 MB | 40,7k | MIT | engine 2D HTML5 | Pouco — 2D não é o formato |
| [airbnb/lottie-web](https://github.com/airbnb/lottie-web) | 340 MB | 32,5k | MIT | animações After Effects no browser | **Sim** — briefing animado |
| [nolly-studio/cult-ui](https://github.com/nolly-studio/cult-ui) | 210 MB | 7,4k | MIT | 150+ componentes animados shadcn | Sim — cards e modais |
| [juliangarnier/anime](https://github.com/juliangarnier/anime) | 180 MB | 74,7k | MIT | animação JS leve | Sim — alternativa ao Motion |
| [NASA-AMMOS/MMGIS](https://github.com/NASA-AMMOS/MMGIS) | 180 MB | 240 | Apache-2.0 | GIS planetário web (Marte/Lua) | Sim — camada de mapa se houver |
| [skyfielders/python-skyfield](https://github.com/skyfielders/python-skyfield) | 85 MB | 1,8k | MIT | efemérides astronômicas | Backend/validação de órbitas |
| [magicuidesign/magicui](https://github.com/magicuidesign/magicui) | 81 MB | 23,3k | MIT | componentes animados (efeito "motionsites") | **Sim** — imersão de landing/HUD |
| [shadcn-ui/ui](https://github.com/shadcn-ui/ui) | 73 MB | 128k | MIT | componentes acessíveis | **Sim** — base de UI |
| [typpo/spacekit](https://github.com/typpo/spacekit) | 68 MB | 586 | MIT | visualização 3D de espaço (three.js) | **Sim** — órbitas prontas |
| [shashwatak/satellite-js](https://github.com/shashwatak/satellite-js) | 60 MB | 1,1k | MIT | SGP4/SDP4 (TLE) | Sim — órbitas reais |
| [poliastro/poliastro](https://github.com/poliastro/poliastro) | 44 MB | 1k | MIT | astrodinâmica em Python | Backend/validação |
| [pmndrs/react-three-fiber](https://github.com/pmndrs/react-three-fiber) | 30 MB | 33,7k | MIT | three.js como React | **Sim** — é a ponte que queremos |
| [theatre-js/theatre](https://github.com/theatre-js/theatre) | 26 MB | 13k | Apache-2.0 | editor de animação no browser | Opcional — timelines de cena |
| [ibelick/motion-primitives](https://github.com/ibelick/motion-primitives) | 1 MB | 7k | MIT | primitivas animadas (menos é mais) | **Sim** — leve e direto |

---

## 3. O caso motionsites.ai

O [motionsites.ai](https://motionsites.ai/) **não é um repositório**: é uma galeria paga de *prompts* de sites animados ("copie, cole e lance"), com filtros por seção (Hero, 3D, Dashboards, Interactive). Ele resolve o *prompt*, não o código.

Os equivalentes abertos que entregam o mesmo tipo de imersão:

| Fonte | O que dá | Licença |
|---|---|---|
| **Magic UI** + **Motion Primitives** + **Cult UI** | componentes animados copiáveis (blur-in, marquee, glow, tilt, beam) | MIT |
| **Motion** (Framer Motion) | orquestração de transições e gestos | MIT |
| **three.js + R3F + drei** | cena 3D real (não só CSS) | MIT |
| **Lottie** | animação vetorial premium sem peso | MIT |
| **Theatre.js** | timeline de cena para o briefing | Apache-2.0 |

**Para o MISSAO IPE, o caminho certo não é "site animado":** é **HUD de sala de controle**. Imersão aqui significa *informação que respira* — número que conta, painel que enche, alerta que pulsa — não scroll cinematográfico. Magic UI e Motion dão 80% disso com 20% do peso.

---

## 4. O que entra em cada camada do jogo

### 4.1 Camada 3D (a nave, a órbita, o planeta)

- **`three.js` + `react-three-fiber` + `drei`** — a stack. R3F permite declarar a cena como componente React, o que combina com o resto do app.
- **`spacekit`** — atalho para esfera, órbitas e corpos; bom para o mapa de missão.
- **`NASA-3D-Resources`** — modelos reais (Orion, ISS, Hubble, Curiosity). Decimar com `gltf-transform` para ≤ 1,5 MB por modelo e converter texturas para KTX2.
- **`glTF-Sample-Assets`** — casos de teste do pipeline (materiais, animação, compressão).
- **`Cesium`** — só se a missão M1 ("Raízes") exigir globo de verdade com terreno e camadas de satélite. Custa alguns MB de core + tiles; decisão de escopo, não de gosto.

### 4.2 Camada motion e UI

- **`motion`** para transições de ≤ 200 ms entre estados de decisão.
- **`magicui` / `motion-primitives`** para os efeitos de entrada dos cards e do briefing.
- **`shadcn/ui`** como base acessível (foco, teclado, ARIA) — não reinventar.
- **`tabler-icons`** (6.500 ícones MIT) para o HUD: massa, watt, antena, dose, relógio.
- **`lottie`** para a animação de abertura (o ipê florescendo — 200 KB, não 20 MB de vídeo).

### 4.3 Camada de dados científicos

- **`skyfield`** (Python) para efemérides e validação das órbitas do jogo.
- **`satellite-js`** para TLE/SGP4 se quisermos órbitas reais no mapa.
- **`MMGIS`** como referência de GIS planetário (não precisa rodar).
- **`poliastro`** para conferir Δv e transferências.

> Esses três primeiros rodam **fora do jogo** (build/validação). O jogo em si consome JSON pré-calculado — offline-first.

### 4.4 Ferramentas de referência da NASA (não são repos, mas entram no pipeline)

| Ferramenta | O que dá | Como usar no MISSAO IPE |
|---|---|---|
| **GMAT** (General Mission Analysis Tool) | astrodinâmica open source de alta fidelidade: propagação, janelas de lançamento, manobras, otimização | rodar **offline** para gerar os JSONs de órbita, eclipse e janela; o jogo consome pronto |
| **NASA Mission Viz** | visualização 3D web de trajetórias, corpos e eventos | benchmark de experiência para a vista de órbita |
| **Jogo educativo de telescópios** ([link](https://spaceplace.nasa.gov/)) | objetivos → instrumentos → lançamento → missões reais | benchmark de fluxo e de "opção cinza por incompatibilidade" |
| **CML / MDL** | processo de maturidade de conceito do JPL | referência para rotular as fases do jogo |
| **CubeSat 101** | ConOps e fases de uma missão pequena | referência do ConOps em três fases |

**Por que isso importa para os assets:** os números de órbita do jogo não são estimados "a olho" — saem do GMAT e viram JSON. É o mesmo padrão do dossiê: dado real onde dá, simulação declarada onde não dá.

### 4.5 Camada de assets de jogo (CC0)

- **Kenney** ([kenney.nl](https://kenney.nl)) — milhares de assets CC0: Space Kit, UI Pack, ícones, áudio. O GitHub da org ([KenneyNL](https://github.com/KenneyNL)) tem *starter kits* (City Builder, Platformer, FPS), não os packs completos — baixe do site.
- **`bobeff/open-source-games`** — lista de jogos abertos, útil para **estudar mecânicas** com o Craft Anything (não para copiar assets).

---

## 5. Licenças: o que pode entrar no produto

| Licença | Pode usar | Obrigação |
|---|---|---|
| MIT / Apache-2.0 / BSD | sim | manter aviso de copyright |
| CC0 | sim | nenhuma |
| OFL (fontes) | sim, embutir | manter `OFL.txt` |
| NASA media | sim, uso educativo | creditar "NASA" e não sugerir endosso |
| glTF samples | por modelo | checar `LICENSE.md` de cada pasta |
| OpenSpace (custom) | **não** redistribuir sem ler | evitar no produto |
| "None" na API | **tratar como restrito** | verificar arquivo de licença |

Script rápido para conferir antes de baixar:

```bash
curl -s https://api.github.com/repos/OWNER/REPO | jq '{license: .license.spdx_id, size: .size}'
```

E manter **`ATTRIBUTION.md`** no repositório do jogo desde o primeiro asset — é o documento que a banca lê quando pergunta "de onde veio isso?".

---

## 6. Orçamento de peso (o jogo tem de rodar offline)

| Item | Orçamento | Observação |
|---|---|---|
| Shell PWA (JS+CSS gzip) | 1,5 MB | three.js + R3F ≈ 350 KB gzip |
| Modelos 3D | 4,5 MB | 3 naves × 1,5 MB, com Draco/KTX2 |
| Texturas | 2 MB | 1K, KTX2 |
| Fontes | 250 KB | 2 famílias, subset latino |
| Áudio | 1,5 MB | 3 loops + 6 SFX |
| Dados das missões | 300 KB | JSON |
| **Total** | **≤ 12 MB** | carregamento por missão, não tudo de uma vez |

Regra: **nada acima de 3 MB entra no primeiro carregamento.** O modelo da nave carrega depois do briefing, enquanto o jogador lê.

---

## 7. Stack recomendada (decisão)

```
React 19 + TypeScript + Vite
├── three.js + @react-three/fiber + @react-three/drei   cena 3D
├── spacekit                                            órbitas (atalho)
├── motion                                              transições
├── magic-ui + motion-primitives                        efeitos de entrada
├── shadcn/ui + tailwind                                base acessível
├── tabler-icons                                        ícones
├── recharts                                            painéis de dose/dados
├── lottie-react                                        abertura
└── zustand + localStorage                              estado e save
```

**Fora da stack, por decisão:** Cesium (só se o globo for indispensável), Babylon (engine paralela sem ganho), Phaser (2D), Godot (mudaria o motor do jogo), OpenSpace (runtime desktop).

---

## 8. O que fazer nas próximas 2 horas

1. Baixar 3 modelos da NASA (Orion, ISS, uma sonda) e rodar `gltf-transform` para ≤ 1,5 MB.
2. Subir uma cena R3F com a nave girando + HUD estático por cima.
3. Medir o bundle: se passar de 1,5 MB gzip, trocar `drei` por helpers próprios.
4. Escrever `ATTRIBUTION.md` com as 3 fontes.
5. Só então pensar em Cesium.

---

## 9. Veredito

- **Maior acervo de assets espaciais reais:** `nasa/NASA-3D-Resources` (5,0 GB) — é o que dá verossimilhança às naves.
- **Melhor custo/benefício para imersão:** `three.js` + `R3F` + `motion` + `magic-ui` — juntos, menos de 1 MB no bundle e o efeito de "sala de controle" que o jogo precisa.
- **Melhor acervo de assets de jogo (fora do GitHub):** Kenney, CC0.
- **Maior armadilha:** confundir "repositório grande" com "asset útil". O MISSAO IPE precisa de 12 MB, não de 5 GB.
