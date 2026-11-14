# Assets entregues e oportunidades para o game

Pesquisa em fontes primárias em 14/11/2026. Assets do produto e recursos opcionais têm caminhos separados. Nada exige hotlink no runtime da LP.

## Incluídos e prontos para uso

| Conteúdo | Caminho | Origem e condição | Uso |
|---|---|---|---|
| Terra 1600 px e 800 px WebP | public/assets/earth*.webp | NASA / Goddard, Blue Marble; diretrizes NASA | Hero e horizonte |
| Marca fornecida | public/brand/ | Repositório IPÊ, identidade do responsável | Cabeçalho, footer e favicon |
| EB Garamond normal/itálico + Figtree | public/fonts/ | Google Fonts; SIL OFL, textos incluídos | Tipografia local |
| Satélite, botânica, ícones e órbitas | components/Planet.tsx, Icon.tsx, app/page.tsx | Vetores originais desta contribuição, Apache-2.0 | UI e composição Remotion |
| Snapshot do beta | public/assets/game-preview.jpg | Repositório IPÊ | Recurso editorial disponível |
| Procedência MOD13Q1 | public/assets/science-provenance.json | Manifesto científico já existente | Rastreabilidade |
| Motor didático + seis registros | lib/mission/ | Cópia identificada do beta, Apache-2.0 | Experimento executável |
| 57 modelos espaciais GLTF + BIN e textura | asset-packs/kaykit-space-base-gltf.zip | Kay Lousberg / KayKit Space Base Bits, CC0 | Evolução do game; não carregados pela LP |

A conversão do TIFF Blue Marble extraiu os três canais RGB da imagem de sete canais, redimensionou para duas resoluções e codificou em WebP. Sombra e atmosfera são camadas CSS, não dados científicos. Fonte original: https://assets.science.nasa.gov/content/dam/science/esd/eo/content-feature/bluemarble/images/globe_west_2048.tif. Página: https://science.nasa.gov/earth/earth-observatory/the-blue-marble-true-color-global-imagery-at-1km-resolution/. Diretrizes: https://www.nasa.gov/nasa-brand-center/images-and-media/.

KayKit: https://github.com/KayKit-Game-Assets/KayKit-Space-Base-Bits-1.0, commit `6dfbcac9927d06283752c4defd4882cfe0d29666`. Os 57 arquivos .gltf e suas dependências foram copiados. O atlas mede 1024×1024 no pacote. A licença está no ZIP, junto do README de origem. Não se confunde contagem de formatos duplicados com modelos únicos. Hashes de cada arquivo constam em kaykit-manifest.json.

## Oportunidades concretas

### 1. KayKit: cenário de operação em solo

Aproveitar `solarpanel`, `roofmodule_solarpanels`, `landingpad_small`, `lander_A`, `basemodule_*`, `containers_*`, `cargo_*`, `terrain_*` e `rock_*` para visualizar produção, armazenamento e envio. A estética low-poly favorece sessões educativas e pode ser pré-renderizada em sprites para manter um runtime 2D. Na LP os modelos não são usados: o briefing proíbe um motor Three.js.

Próximo incremento verificável: ligar estados reais do motor a uma base terrestre e ao envio de pacotes, sem inventar uma nova física. Mais tarde, reutilizar landers/terrenos no protótipo Horizonte. O tema de mineração do pack não deve deslocar a campanha científica sobre o Cerrado.

### 2. NASA 3D Resources: modelos reais para um modo de exploração

https://github.com/nasa/NASA-3D-Resources e https://science.nasa.gov/3d-resources/ oferecem modelos, imagens e texturas de missões NASA. Oportunidade: fichas interativas de instrumentos e comparação entre uma plataforma real e o CubeSat didático. Selecionar missão relevante, revisar crédito/condição por arquivo, otimizar ou pré-renderizar e identificar claramente modelo real versus hardware fictício.

A coleção não foi baixada em massa e não é declarada CC0. As diretrizes NASA, eventuais créditos de terceiros e restrições de marcas devem acompanhar cada seleção. Evitar colocar o logotipo NASA como selo de parceria.

### 3. Kenney: feedback e interface reutilizáveis

Fontes do autor: https://kenney.nl/assets/space-shooter-remastered, https://kenney.nl/assets/space-shooter-extension e https://kenney.nl/assets/space-kit. As páginas indicam CC0. Oportunidade: sprites, estruturas e feedback de entrega, sem adotar mecânica de combate em um jogo científico.

A pesquisa também encontrou o espelho https://github.com/shorepine/kenney. Usá-lo como índice; comparar os arquivos e licenças com o pacote original do autor antes de incorporar. Nenhum conteúdo desse espelho foi incluído na entrega.

## Critérios de integração

Assets opcionais precisam manter URL, autor, licença e hash; comparar custo em bytes, polígonos e draw calls; evitar texturas grandes sem ganho perceptível; verificar alternativas móveis e acessibilidade. O resultado da simulação permanece independente de animações e modelos. Integrar qualquer nova biblioteca 3D ao game existente exige PR específica; esta LP permanece CSS/SVG/Remotion.

GSAP é distribuído sob sua licença Standard No Charge, com condições específicas; não é declarado MIT. https://gsap.com/community/standard-license/. Remotion mantém licença própria: https://www.remotion.dev/license. Indivíduos e organizações elegíveis podem usar a licença gratuita; o enquadramento organizacional futuro deve seguir os termos. Não houve compra de licença nesta entrega.
