# Ativos da PR #1 e aplicações no MISSÃO IPÊ

Auditoria de 15/11/2026. A [PR #1](https://github.com/oalexandrebelo/MISSAO-IPE/pull/1) permanece aberta no repositório canônico **oalexandrebelo/MISSAO-IPE**, anteriormente PROJETO-IPE, no head `b628b429fe201e9445443c8205c4e4b4fee284f7`. A conta autora exibida é `oalexandrebelo`; isso não confirma a atribuição humana a Bruno.

**Decisão recomendada:** manter os modelos NASA e a nave configurável atuais. A contribuição mais fácil de reaproveitar depois é a imagem editorial terrestre de 800 px. KayKit é uma biblioteca opcional para cenários fictícios; não acrescenta dados científicos ou mecânicas às três missões. Esta auditoria não importou ativos, instalou dependências, alterou o aplicativo ou publicou uma entrega.

## O que existe e o que é usado

Os 69 arquivos da pasta `apps/immersive-lp/` foram conferidos contra os identificadores Git do head. Os **15 itens do manifesto**, somando **1.268.290 bytes**, conferem em tamanho e SHA-256. O [inventário JSON](../research/pr-assets-r16.json) contém caminhos, hashes, uso e todos os modelos; os números abaixo são bytes de arquivo, não transferência comprimida ou memória de GPU.

| Ativo da PR | Tamanho | Uso constatado / aplicação recomendada |
| --- | ---: | --- |
| `public/assets/earth-mobile.webp` / `earth.webp` | 96.344 / 379.916 B | Blue Marble de 800² / 1600² px. `Planet.tsx` usa seleção responsiva; a versão maior também aparece no filme e nos metadados sociais. Candidata a introdução terrestre; não é textura equiretangular nem mapa dos seis registros. |
| `public/assets/game-preview.jpg` | 95.217 B | Captura de 1348×926 da interface antiga, inspecionada visualmente. Disponível, sem consumidor no código de execução. Atualizar a captura antes de apresentar funcionalidades atuais. |
| `public/assets/science-provenance.json` | 5.942 B | Metadados disponíveis, sem consumidor no código de execução. O minilaboratório importa os seis registros de `lib/mission/data/science-data.ts`. Preferir a procedência canônica do jogo. |
| `public/brand/projeto-ipe-logo.png` / `projeto-ipe-symbol.svg` | 13.315 / 42.871 B | PNG 300×100 no cabeçalho/filme; símbolo no rodapé/favicon. Preservar a identidade vetorial atual do MISSÃO IPÊ ao reaproveitar a composição. |
| Três WOFF2: EB Garamond normal/itálico e Figtree | 69.444 B | Licenças SIL OFL incluídas. O build offline usa esses arquivos; o build padrão usa `next/font/google`. Remotion referencia duas fontes locais. Manter Bricolage Grotesque e Plus Jakarta Sans atuais, salvo mudança deliberada de direção visual. |
| `components/Planet.tsx` / `Icon.tsx` | 3.054 / 2.253 B de código | Satélite SVG ilustrativo, 12 ícones e glifos botânicos usados na contribuição. Úteis em explicações e navegação, sem substituir a nave cujo desenho acompanha a configuração executada. |
| `remotion/MissionFilm.tsx` | 3.338 B de código | Composição de 24 s, 1080p/30 fps; **nenhum MP4 versionado**. Movimento e reprodução exigem código/dependências; não são um vídeo pronto. O áudio da página é sintetizado após ação do visitante, sem arquivo de gravação. |
| `asset-packs/kaykit-space-base-gltf.zip` | 533.500 B | Fora de `public/`, sem carregador na LP. Biblioteca opcional, não custo do carregamento inicial. |

Os arquivos de `public/` somam **715.939 B**, mas nem todos são solicitados pelo visitante. A imagem Blue Marble é uma composição histórica NASA/Goddard, com créditos a Reto Stöckli, Robert Simmon e equipes de dados; não representa telemetria ou uma fotografia atual do Cerrado. Preservar os créditos e as condições de uso NASA, sem tratar o conjunto como CC0 ou sugerir endosso. [Fonte e créditos](https://science.nasa.gov/earth/earth-observatory/the-blue-marble-true-color-global-imagery-at-1km-resolution/), [diretrizes NASA](https://www.nasa.gov/nasa-brand-center/images-and-media/).

## KayKit: conteúdo e custo reais

O ZIP foi aberto e **117 arquivos internos** conferiram com o manifesto: **57 GLTF + 57 BIN + uma textura + licença + README**, totalizando **1.796.600 B**. Não há imagens separadas de preview, apesar dessa menção no README da PR. Os 57 GLTF foram analisados: dependências locais resolvidas, nenhuma animação e 27.652 triângulos somados nas malhas únicas. Isso não mede draw calls, instâncias ou FPS.

O atlas compartilhado mede 1024² px e ocupa 25.749 B. Cada custo inicial abaixo inclui GLTF, BIN e esse atlas uma vez; usos seguintes podem compartilhar a textura.

| Modelo | Primeiro uso | Triângulos | Aplicação adequada / limite |
| --- | ---: | ---: | --- |
| `solarpanel` | 35.475 B | 118 | Adereço de energia de uma base fictícia. Os painéis configuráveis de voo já existem. |
| `roofmodule_solarpanels` | 45.293 B | 284 | Cenário de solo, sem acrescentar geração ao motor por aparência. |
| `rock_A` / `terrain_low` | 30.452 / 29.536 B | 30 / 12 | Ilustração genérica; não são relevo medido de Bennu. |
| `landingpad_small` / `lander_A` | 55.300 / 110.072 B | 454 / 1.464 | Reservar para um futuro exercício de pouso. Os três casos atuais não simulam pouso. |
| `windturbine_low` | 75.033 B | 826 | Apenas cenário com atmosfera; inadequado para vácuo espacial/Bennu. |

O pacote é de **Kay Lousberg/KayKit, CC0-1.0**, não NASA. A licença interna e o [repositório do autor](https://github.com/KayKit-Game-Assets/KayKit-Space-Base-Bits-1.0) confirmam a condição. Conservar origem, licença e hashes ao selecionar peças. Nenhuma dessas peças determina capacidade, potência, taxa de rádio ou valor científico. Não houve renderização dos 57 modelos nem teste de desempenho nesta auditoria.

## Reaproveitar primeiro o que já funciona

A PR não adiciona modelos NASA. O aplicativo atual já possui os quatro originais abaixo, novamente conferidos por tamanho e hash. A procedência e a otimização estão em [Ativos NASA implementados](30-ATIVOS-NASA-IMPLEMENTADOS.md).

| Ativo atual em `public/models/nasa/` do beta | Bytes / triângulos | Uso atual e decisão |
| --- | --- | --- |
| `cubesat-generic-2ru.glb` | 206.108 / 36.896 | Visualizador de referência. Manter separado da nave didática configurável. |
| `dsn-70m.glb` | 2.216.584 / 14.852 | Visualizador de referência de comunicação. Não representa disponibilidade DSN nem a estação efetiva do Cerrado. |
| `bennu-1999-rq36.glb` | 329.596 / 18.240 | Referência e contexto da missão Bennu. Preferir sua geometria a rochas genéricas. |
| `jwst-a.glb` | 4.710.016 / 493.785 | Referência e contexto do telescópio. Manter carregamento sob demanda e união de malhas já implementada; arquivo pequeno não implica render barato. |

Os quatro GLBs somam **7.462.304 B**, mais **779.715 B** do decodificador e avisos compartilhados. Os modelos não produzem resultados científicos. O atlas KayKit 1024², por exemplo, pode ocupar cerca de 4 MiB em RGBA8 antes de mipmaps: tamanho de download e custo gráfico são medidas diferentes.

| Missão | Próxima aplicação concreta, ainda proposta | Limite obrigatório |
| --- | --- | --- |
| Cerrado | Reaproveitar Blue Marble de 800 px num cartão editorial, com crédito, e manter a nave configurável e os registros históricos atuais. | A imagem não posiciona precisamente a área de estudo nem substitui MOD13Q1; não sustenta diagnóstico de desmatamento. |
| Bennu | Usar a geometria já carregada para explicar setores e contrastar dados a bordo com registros recebidos no instante escolhido. | Observações continuam explicitamente sintéticas; rocha KayKit não é dado de superfície ou local de pouso. |
| Telescópio | Usar a referência Webb e a inspeção câmera/espectrômetro existentes para ligar instrumento, entrega e validade científica. | Nem Webb nem KayKit fornecem medições das faixas sintéticas do exercício ou descoberta de moléculas/vida. |

**Identidade e integração:** não transplantar branding Ubernatural para o IPÊ; a pasta auditada não contém ativo identificado com essa marca. Aproveitar princípios de hierarquia/movimento preservando nome, logotipos e fontes aprovados. Reutilizar imagens/SVG não exige importar Next, GSAP ou Remotion. Estes últimos têm termos próprios; a licença Apache-2.0 do código da contribuição não substitui licenças de fontes, mídia ou dependências. Qualquer integração futura deve registrar apenas os arquivos selecionados, adaptar seus caminhos e manter créditos, alternativa 2D e leitura fiel do estado executado.
