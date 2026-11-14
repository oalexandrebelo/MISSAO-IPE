# Ativos NASA incorporados ao laboratório 3D

**R14 · verificação em 14 de novembro de 2026.** Este documento registra quatro modelos originais baixados, o decodificador local e a inspeção geométrica. A renderização no navegador e a publicação pertencem à verificação da interface e aos recibos da entrega; não foram demonstradas pela inspeção descrita aqui.

## Pacote local

Os modelos estão em `experiments/mission-design-lab/public/models/nasa/`. Todos são GLB 2, foram recebidos com HTTP 200 e MIME `model/gltf-binary` e não contêm referências a arquivos externos. Somam **7.462.304 bytes**. O decodificador e seus avisos somam **779.715 bytes**, reutilizados da dependência Three.js já instalada, sem instalar pacotes.

| Modelo e fonte oficial | Arquivo | Bytes | Triângulos decodificados | Primitivas | Decodificador exigido |
| --- | --- | ---: | ---: | ---: | --- |
| [CubeSat – 2 RU Generic](https://science.nasa.gov/3d-resources/cubesat-2-ru-generic/) | `cubesat-generic-2ru.glb` | 206108 | 36896 | 18 | Draco local |
| [70 meter dish](https://science.nasa.gov/3d-resources/70-meter-dish/) | `dsn-70m.glb` | 2216584 | 14852 | 1 | Nenhum |
| [1999 RQ36 asteroid](https://science.nasa.gov/3d-resources/1999-rq36-asteroid/) | `bennu-1999-rq36.glb` | 329596 | 18240 | 1 | Nenhum |
| [James Webb Space Telescope (A)](https://science.nasa.gov/3d-resources/james-webb-space-telescope-a/) | `jwst-a.glb` | 4710016 | 493785 | 1657 | Draco local |

O [manifesto](https://github.com/oalexandrebelo/PROJETO-IPE/blob/main/experiments/mission-design-lab/public/models/nasa/manifest.json) contém fontes, URLs originais de download, créditos, datas, MIME, tamanho, SHA-256, extensões, limites e estado de verificação por modelo. O [resultado da inspeção](https://github.com/oalexandrebelo/PROJETO-IPE/blob/main/experiments/mission-design-lab/public/models/nasa/inspection.json) registra os limites geométricos após aplicar as transformações internas dos nós.

Créditos preservados:

- Antena de 70 m: **NASA/Ames Research Center**.
- CubeSat genérico e asteroide 1999 RQ36: **NASA/Christopher R. Meaney**.
- James Webb Space Telescope (A): **NASA/Goddard Space Flight Center**.

## O que foi efetivamente conferido

Os quatro GLBs foram baixados integralmente e mantidos sem alterações. A inspeção confirmou assinatura e versão, comprimento total, limites dos blocos binários, ausência de URIs externas e hashes. A cena geométrica foi carregada pelo `GLTFLoader` do Three.js 0.187.0 em Node.

O CubeSat e o JWST exigem `KHR_draco_mesh_compression`. Para a inspeção Node, um adaptador síncrono utilizou o decodificador JavaScript existente para descomprimir as geometrias; isso permitiu contar triângulos e calcular limites. Esse ensaio não testa Web Workers, WebAssembly ou desempenho do navegador.

A antena contém uma textura WebP e seu fallback JPEG incorporados ao GLB. As assinaturas dos dois formatos foram verificadas e o JPEG foi inspecionado visualmente após extração temporária. O carregamento de imagens foi desativado apenas na inspeção Node; o GLB original continua com ambas as imagens. Os outros três modelos não possuem texturas externas nem incorporadas.

Os arquivos originais não foram simplificados, reexportados, rotacionados ou remodelados. A otimização de apresentação abaixo trabalha sobre geometrias carregadas em memória. O exame não certifica unidades físicas, fidelidade de materiais, orientação operacional, capacidade de subsistemas ou precisão científica da forma.

## Carregamento e normalização

Usar o caminho relativo à base do aplicativo: `models/nasa/<arquivo>.glb`. O decodificador está em `models/nasa/draco/`:

- `draco_wasm_wrapper.js`: wrapper do decoder WebAssembly.
- `draco_decoder.wasm`: binário WebAssembly.
- `draco_decoder.js`: alternativa JavaScript.

O `DRACOLoader` deve apontar para esse diretório local. Servir `.glb` como `model/gltf-binary`, `.wasm` como `application/wasm` e `.js` como JavaScript. Se a aplicação usar uma política CSP, verificar autorização para o Worker criado por blob e para a execução WebAssembly, conforme a configuração real. Não depender de CDN durante a apresentação.

A publicação R14 usa permissões específicas para esses recursos locais: `script-src 'self' 'wasm-unsafe-eval'` permite a decodificação WebAssembly; `worker-src 'self' blob:` permite o Worker Draco; `connect-src 'self' blob:` permite que o `ImageBitmapLoader` leia a textura incorporada da antena por `fetch(blob:…)`; `img-src 'self' data: blob:` cobre as imagens locais e incorporadas. Autorizar somente `img-src blob:` não atende à leitura feita por `fetch`. O gerador é `scripts/prepare-vercel-static.mjs`; conferir a política efetivamente servida após gerar o pacote. Não há dependência de CDN ou domínio externo para carregar os quatro modelos.

O GLB da antena mantém o WebP e o JPEG originais; não foi acrescentado um plugin que os substitua. O componente só informa carregamento completo após receber a cena, e exige que o material da antena tenha sua textura. Se o recurso falhar, apresenta um esquema 2D próprio identificado como alternativa. Ao voltar de 2D para 3D, o estado de carregamento é renovado; selecionar novamente o mesmo modelo já ativo conserva seu estado. Na desmontagem, geometrias, materiais e texturas compartilhados são liberados uma vez, e imagens `ImageBitmap` são fechadas explicitamente.


Os limites no manifesto já incluem as transformações dos nós do arquivo. Para centralizar, adicionar um grupo de apresentação com deslocamento igual ao negativo de `bounds.center`; aplicar a escala em um grupo pai. `presentationScaleForMaxDimension2` adapta a maior dimensão para duas unidades de cena. Esse procedimento é visual e não afirma que uma unidade corresponde a um metro.

| Modelo | Centro após transformações internas | Tamanho X × Y × Z | Escala para maior lado = 2 |
| --- | --- | --- | ---: |
| CubeSat – 2 RU Generic | -0.00415, 0.29923, 0.01697 | 5.38582, 5.00154, 2.21394 | 0.37134580 |
| 70 meter dish | 0.00000, 26.35000, -0.15001 | 91.56534, 85.53871, 91.31534 | 0.02184233 |
| 1999 RQ36 asteroid | -17.46924, -0.81879, -4.23529 | 1350.70605, 1301.63757, 1309.63391 | 0.00148071 |
| James Webb Space Telescope (A) | -3.97684, 5.24364, -0.00001 | 27.39710, 12.00455, 14.77337 | 0.07300043 |

O sistema de coordenadas glTF é destro, com +Y para cima; conservar as transformações originais antes de medir ou centralizar. A antena já possui rotação em um nó raiz. Não adicionar uma segunda correção de eixo sem inspeção visual.

O JWST tem **1.657 primitivas e 493.785 triângulos** após decodificação. Seu tamanho de download não representa sozinho o custo de renderização. Carregar apenas ao entrar no caso do observatório, medir fluidez e memória no aparelho alvo e evitar sombras ou pós-processamento caros até essa medição. O CubeSat possui uma malha glTF com 18 primitivas de material; isso não comprova 18 peças funcionais ou desmontáveis. Nenhum dos quatro arquivos contém animações.

## Otimização do JWST para apresentação

A geometria do JWST foi agrupada por material e por atributos compatíveis depois de aplicar as transformações dos nós. A prova em Node reduziu **1.657 primitivas para 54**, mantendo **493.785 triângulos**, **508.474 vértices** e os mesmos **46 objetos de material**. Isso reduz em aproximadamente **96,7%** o número potencial de submissões de desenho por passe opaco; chamadas reais da GPU e fluidez ainda devem ser medidas no navegador.

Foram corrigidas 99 transformações refletidas, invertendo a ordem dos índices do triângulo quando o determinante da matriz era negativo. Sem isso, aplicar a matriz à geometria poderia inverter a face aparente. A maior diferença de posição causada pela representação float32 ficou abaixo de 0,000001; a diferença máxima dos limites foi 0,000000414, em coordenadas do próprio modelo. Não houve redução de triângulos nem alteração intencional da forma. A prova não certifica precisão física.

Um GLB derivado foi exportado temporariamente para avaliar a alternativa. Ele ficou com **19.727.348 bytes**, pois o exportador existente não aplica Draco, contra **4.710.016 bytes** do original. Esse derivado **não foi incluído no pacote público**. A solução escolhida conserva o original comprimido e faz a união em memória após o carregamento, antes da centralização e escala de apresentação. Não há um arquivo público `jwst-a-web.glb`.

A função foi integrada em [OrbitalScene.tsx](https://github.com/oalexandrebelo/PROJETO-IPE/blob/main/experiments/mission-design-lab/src/ui/OrbitalScene.tsx), exclusivamente para `jwst-a.glb`, antes de calcular a centralização. A função real desse arquivo foi extraída e verificada em Node: 54 meshes, 493.785 triângulos e os mesmos 46 materiais. Ela devolve um grupo novo, mantém os materiais e descarta as geometrias substituídas. Deve receber a cena recém-carregada de propriedade exclusiva do componente, evitando descartar geometrias de um clone compartilhado em cache. O ensaio, hashes e tolerâncias estão em [optimization.json](https://github.com/oalexandrebelo/PROJETO-IPE/blob/main/experiments/mission-design-lab/public/models/nasa/optimization.json). O arquivo comprova a operação geométrica em Node; integração visual e chamadas medidas pertencem ao teste do aplicativo.

## Uso nos três casos científicos

**Cerrado:** o CubeSat genérico é referência de representação de um pequeno satélite. A nave Ipê continua uma construção didática própria. A configuração, o motor, as séries MODIS e os números do jogo não são derivados da malha NASA.

**Bennu:** o modelo histórico 1999 RQ36 permite inspecionar um asteroide no caso didático. A fonte científica independente é a [visão geral da OSIRIS-REx](https://science.nasa.gov/mission/osiris-rex/): a missão mapeou a superfície para selecionar um sítio, coletou material em 20/10/2020 e entregou amostras à Terra em 24/09/2023. Setores, objetivos, parâmetros e métricas criados para o jogo devem ser identificados como didáticos. O modelo não substitui uma forma científica PDS nem prova precisão geográfica, pouso ou coleta real.

**Observatório:** o modelo JWST é referência visual para escolhas de observação científica. A [descrição dos instrumentos Webb](https://science.nasa.gov/mission/webb/science-overview/science-explainers/webbs-scientific-instruments/) explica a escolha de alvo e modo de observação e o uso de imagens e espectros infravermelhos. Uma curva ou pontuação sintética no jogo não é observação real do JWST nem descoberta de bioassinatura. A narrativa antiga da página do modelo não deve ser usada como cronograma atual.

A antena DSN permanece uma referência de comunicação de espaço profundo. Ela não concede acesso à rede, agenda de antenas ou infraestrutura de solo ao projeto Ipê. Essas distinções devem acompanhar o modelo e o relatório do caso.

## Proveniência e licenças

Os ativos NASA seguem as [NASA Images and Media Usage Guidelines](https://www.nasa.gov/nasa-brand-center/images-and-media/), com finalidade educativa, crédito e ausência de endosso. A política inclui modelos tridimensionais, preserva o tratamento de marcas e distingue material de terceiros. Não usar logotipos NASA como identidade do Ipê nem transferir a licença do código automaticamente aos modelos.

O Draco possui licença Apache 2.0. Os arquivos de distribuição foram copiados sem mudanças de `three@0.187.0`, pasta `examples/jsm/libs/draco/gltf/`. O pacote mantém `LICENSE-DRACO.txt`, obtido do [repositório oficial Draco](https://github.com/google/draco/blob/main/LICENSE), o aviso MIT do Three.js e o README original dos decodificadores. Seus hashes também constam no manifesto.

A evidência aqui cobre os bytes locais e a leitura geométrica. Aprovação visual, navegação por teclado, comportamento sem rede, processamento WebAssembly/Worker, MIME efetivamente servido e desempenho do aplicativo precisam aparecer nos testes da entrega integrada. O estado público final deve ser consultado no recibo de publicação do projeto.
