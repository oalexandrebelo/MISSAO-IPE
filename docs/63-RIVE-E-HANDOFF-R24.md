# MISSÃO IPÊ · animações das três escolhas · R24

O laboratório permite investigar instrumento, energia e comunicação na bancada e no replay de Cerrado, Bennu e Webb. A animação Rive foi solicitada para reforçar a relação entre escolha, componente e estado do motor no navegador e no celular. Este guia registra o contrato e o roteiro de aceite da integração. A R24 foi integrada à edição R25; a R23 foi a base desta revisão. [Jogo](https://nasa-missaoipe.alexandrebelo.com/lab/index.html) · [Handoff da bancada e comparação R23](61-BANCADA-COMPARACAO-E-LIBRAS-R23.md)

## Arquivo do editor e exportação

A ilustração foi criada no Rive.app do MacBook Pro, no artboard **IpeSubsystems** de 640 × 180 px. A máquina **IpeAssembly** tem quatro camadas independentes, dois estados por camada e transições de 200 ms. Alexandre confirmou **End Prompt** na primeira edição. A correção de bateria e do módulo foi exportada do estado atual do editor. O arquivo aberto no Rive.app é a fonte editável. A exportação `.rev` requer um plano Rive que a inclua. [Abrir o arquivo de autoria](https://editor.rive.app/file/untitled/2728718)

O MCP oficial exportou `experiments/mission-design-lab/public/rive/ipe-subsystems.riv`, com **15.019 bytes** e SHA-256 `103b0ce860cf3b696dc6d9eaea3603ca24922a54f85fd862cda188348d37e5db`. O editor confirmou estrutura válida, gerou uma captura PNG e simulou as **16 combinações** dos quatro controles e o retorno aos estados iniciais. Em um ensaio da primeira versão com intervalo mais longo, o simulador encerrou o avanço em `Done`. O aceite no navegador inclui uma troca após a animação ficar em repouso.

O runtime usa o View Model **IpeConfiguration**, instância **Default**, com vínculo automático. Os quatro booleanos começam em `false` no editor. O jogo inicializa cada escolha pela configuração em tela.

| Propriedade | Base · `false` | Alternativa · `true` |
| --- | --- | --- |
| `payloadAlternate` | `bands` no Cerrado ou `camera` nas expedições | `index` no Cerrado ou `spectrometer` nas expedições |
| `powerExpanded` | Painel de 12 W no Cerrado ou 10 W nas expedições | Painel de 18 W no Cerrado ou 22 W nas expedições |
| `batteryExpanded` | Bateria de 16 Wh no Cerrado ou 6 Wh nas expedições | Bateria de 24 Wh nas três missões |
| `linkExpanded` | Rádio econômico no Cerrado ou contatos curtos nas expedições | Rádio rápido no Cerrado ou contatos ampliados nas expedições |

O Rive ilustra a seleção em bancada e A/B. A variante base do instrumento usa um chip genérico, e a legenda HTML identifica a escolha do catálogo. A bateria e os painéis se movem de forma independente no cartão de energia. As faixas do enlace representam capacidade no Cerrado e agenda nas expedições. Em Bennu e Webb a mesma antena serve os dois pacotes de contato. Os estados operacionais continuam nas leituras e na cena do motor.

## O que cada escolha mostra

| Missão | Instrumento e processamento | Energia | Comunicação |
| --- | --- | --- | --- |
| Cerrado | **BANDAS → ÍNDICE.** O desenho identifica o processador de 180 ou 60 Mbit por lote. A carga total durante processamento passa de 26 para 38 W. | **Bateria 16 → 24 Wh.** Mostre capacidade e limite de descarga, 20 ou 35 W. A leitura de energia restante começa no replay. | **Rádio econômico → rápido.** A capacidade do rádio muda de 0,96 para 2,4 Mbit/s. A transmissão depende da janela, do projeto e do estado da tentativa. |
| Bennu | **Câmera → espectrômetro.** Mostre a troca na carga e a adequação da câmera ao levantamento visual das dimensões publicadas. | **Energia compacta → ampliada.** O pacote muda de 10 W / 6 Wh para 22 W / 24 Wh, com massa e custo do catálogo. | **Contatos curtos → ampliados.** Mostre a agenda de recepção mantendo o mesmo desenho de antena e a taxa de 1,2 Mbit/s. No ensaio guiado, chegam 2 e 6 registros válidos, respectivamente. |
| Webb | **Câmera → espectrômetro.** Mostre imagem versus espectro conforme a pergunta. No ensaio guiado chegam seis pacotes dos dois lados e 0 ou 6 registros válidos. | **Energia compacta → ampliada.** Exiba geração e capacidade. O replay mostra se a descarga suporta a carga do espectrômetro na execução. | **Contatos curtos → ampliados.** A seleção atualiza a agenda. Ambos os pacotes usam a mesma antena e taxa. Compare quais registros estavam disponíveis no segundo escolhido. |

Na bancada, mudar uma opção atualiza o rascunho e destaca o sistema. Em A/B, use a configuração executada de cada lado e o segundo comum do replay. Rascunhos e replays sem amostras mostram capacidades e agenda como previsão. Os estados de processamento, iluminação, energia, contato e transmissão vêm das amostras gravadas. Recuar no relógio reavalia a amostra e os IDs dos registros disponíveis no instante.

Os desenhos representam o equipamento didático e seu estado. Os dados de vegetação Terra/MODIS, dimensões em Bennu e trânsito de WASP‑39 b vêm de arquivos históricos, com unidades e incertezas próprias. [Limites científicos e didáticos](44-HISTORIAS-REAIS-E-LIMITES-DIDATICOS.md) · [Dados Bennu e Webb](45-DADOS-REAIS-BENNU-WEBB-R18.md)

## Contrato de integração

- **Dev de ciência e motor.** Confira os booleanos do Rive a partir de `SpacecraftPresentation` e o replay a partir de `MissionVisualState`. No replay, diferencie `contactAvailable` de `transmitting`, capacidade nominal de `energyFraction`, e seleção de instrumento de processamento efetivo. Compare os resultados com o motor e preserve o T+ e a configuração de cada lado.
- **Dev de interface e autoria.** Registre o arquivo do Rive.app, o artboard, a máquina de estados, as propriedades expostas e a exportação `.riv` usada pelo site. Carregue apenas na cena configurada e use o runtime oficial. Inclua o asset e o WASM na mesma origem do jogo. Use a preferência de movimento reduzido e preserve os controles HTML, as legendas e a vista 2D. [MCP do editor Rive](https://rive.app/docs/editor/ai/mcp) · [runtime web oficial](https://rive.app/docs/runtimes/web/web-js)
- **Revisão conjunta.** A animação acompanha escolhas e amostras do motor. Use a mesma explicação em HTML e Libras, com capacidades públicas e estados calculados. Dados pessoais, respostas e credenciais ficam nos fluxos de participação e API privada.

Os módulos de referência do laboratório ficam em `experiments/mission-design-lab/src/`. `lab/spacecraft-presentation.ts` projeta o catálogo e os callouts. `lab/mission-visual-state.ts` e `lab/scientific-expeditions.ts` projetam os estados. `ui/Scene.tsx` conecta as cenas de `Workbench.tsx`, `ExpeditionWorkbench.tsx`, `CompareDialog.tsx` e `ExpeditionComparison.tsx`.

## Revisão móvel a partir do CSS da R23

- A bancada das expedições já coloca editor e nave em uma coluna a **720 px** ou menos. A comparação empilha as leituras A/B até **640 px**. O último reteste da R23 registrou documento e viewport com **320 px** no Cerrado e Webb. [Recibo funcional R23](https://github.com/oalexandrebelo/MISSAO-IPE/blob/main/evidence/r23-functional-qa.json)
- A cena reserva altura para a ilustração absoluta em `.orbit-render` e posiciona os controles em `.orbit-bottom`. Preserve a geometria atual se o Rive entrar nesse plano. Para um canvas complementar externo, use um bloco em fluxo com largura limitada ao contêiner. O desenho deve deixar os toques passarem à peça existente e a rolagem vertical seguir; mantenha a ação equivalente nos botões HTML.
- Na comparação, **Investigar no 3D** leva o foco ao título da cena. Em mobile, teste com o painel de Libras aberto, pois ele pode cobrir a região central quando ocupa a área inferior. Caso o foco fique oculto, o ajuste pontual é alinhar ao início o `scrollIntoView` da comparação nessa condição.

## Aceite da R24

| Verificação | Evidência esperada |
| --- | --- |
| Editor e exportação | Arquivo aberto no Rive.app do MacBook Pro, máquina percorrida com os estados utilizados pelo jogo, arquivo `.riv` exportado e identificado pelo hash. |
| Nove escolhas em navegador | No desktop e em viewports de 320 e 390 px, selecionar os três sistemas nas três missões. Verificar peça, legenda e números em bancada e em A/B. No Cerrado, alterar primeiro só a bateria e depois só o painel. Esperar a transição terminar, fazer uma pausa de pelo menos um segundo e alternar novamente. |
| Replay e recursos | Alternar A/B, investigar um evento, avançar e rebobinar. Para energia e enlace, conferir amostra ausente, eclipse, janela sem transmissão e rádio transmitindo. Confirmar que os totais finais continuam identificados como totais da execução. |
| Uso móvel e acessibilidade | Conferir foco, toque, rolagem, movimento reduzido, orientação retrato/paisagem e uso com Libras. Carregar a cena sem WebGL e com o asset de animação bloqueado para verificar a operação pela vista e pelos controles disponíveis. |
| Publicação | Conferir o commit e o deploy, abrir o domínio oficial, verificar carregamento dos assets e repetir um contraste por missão. Registrar aparelho e navegador. Validação por viewport e uso em celular físico são observações distintas. |

## Runtime publicado com a R25

O runtime oficial é `@rive-app/canvas@2.50.0`, com WASM local. A exportação do plano gratuito inclui a abertura com a marca Rive; ela é preservada. A primeira reprodução recebe 3,2 segundos de avanço da engine e as trocas seguintes 0,6 segundo antes do repouso. A versão Lite não renderizava o texto dessa abertura, por isso foi substituída pela Canvas completa. O componente pausa fora de vista, respeita movimento reduzido e mantém alternativas em HTML.
