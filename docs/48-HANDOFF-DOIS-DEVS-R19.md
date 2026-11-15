# MISSÃO IPÊ · handoff dos dois devs · R19

**15/11/2026 · 0.10.0-beta.1.** Esta edição implementa as três prioridades da [pesquisa R18](47-OPORTUNIDADES-NASA-PARA-DOIS-DEVS-R18.md) no laboratório de Cerrado, Bennu e Telescópio. O jogo liga pergunta, requisito, registro e evento; explica comparações A/B; e encerra com a análise dos quatro papéis. [Jogar](https://projeto-ipe.vercel.app/lab/) · [roteiro de apresentação](49-ROTEIRO-APRESENTACAO-MVP-R19.md) · [dados e fontes](45-DADOS-REAIS-BENNU-WEBB-R18.md).

## O que o jogador faz e aprende

| Caso | Evidência real | Decisão e consequência | Conclusão defensável |
| --- | --- | --- | --- |
| Cerrado | Três pares de arquivos históricos Terra/MODIS MOD13Q1.061 | BANDAS versus ÍNDICE altera volume e pico de potência. Mais energia armazenada não remove automaticamente um limite de descarga. | Comparar NDVI somente quando os dois registros chegaram válidos. Uma diferença não prova a causa da mudança. |
| Bennu | Eixos maiores de seis rochas/clastos publicados com PolyCam e OLA | Serviço de solo altera início da primeira janela, duração e custo. A mesma taxa de rádio pode entregar conjuntos diferentes. | Comparar dimensões recebidas; tamanho sozinho não identifica composição, origem ou segurança de pouso. |
| Webb | Seis bins FIREFLy do trânsito de WASP-39 b em 10/07/2022, com 1σ | Instrumento altera compatibilidade, carga, massa, custo e volume. Receber todos os pacotes não garante ciência válida. | Ler o espectro com suas incertezas; seis bins não refazem a detecção molecular publicada. |

As fontes são históricas; a nave configurável, orçamento em créditos, calendário operacional e envelopes são didáticos. O 3D é uma representação sem escala física, sem navegação georreferenciada ou telemetria NASA ao vivo. IPÊ identifica a equipe.

## Entregas implementadas

### 1. Trilha da evidência ligada ao 3D

Na operação, selecionar um registro revela seu caminho. O Cerrado mantém a identidade do ponto e os dois períodos; Bennu e Webb mostram pergunta, requisito, registro, solo e interpretação. Eventos reais do motor mudam o relógio e o componente inspecionado. O retorno científico oferece o caminho de volta à entrega na cena.

O valor fica oculto antes da recepção válida. Um pacote incompatível pode ser recebido e permanecer sem valor científico no jogo. A fonte histórica externa continua acessível e está explicitamente separada da disponibilidade operacional. Avançar e rebobinar reavaliam os mesmos IDs. O 2D mantém controles e explicações quando WebGL não está disponível.

### 2. Comparação A/B explicada

Os ensaios guiados nas três missões mostram a primeira diferença **operacional** entre amostras, duas leituras no mesmo T+ e um histórico opcional de potência ou memória. As curvas são degraus das amostras completas, identificadas como histórico final; a leitura do instante nunca interpola recursos. O botão de investigação seleciona o lado e o sistema correspondente.

As comparações das tentativas próprias mostram a primeira diferença em eventos/estados, inclusive verificações em T+0. Listam os atributos de cada escolha alterada. Cenários ou vários componentes diferentes são explicitados como contraste conjunto. Em Bennu, mudar um seletor de serviço de solo não isola a duração da janela. Após encerramento antecipado, cada vista conserva o último estado disponível.

### 3. Análise dos quatro papéis

Lançamento, espaço, solo e usuários recebem achados calculados, acesso a eventos e campos para conclusão, evidência e próximo passo. Uma pessoa pode assumir os quatro papéis; equipes compartilham o mesmo dispositivo. O contador indica preenchimento, não nota ou certificação de aprendizagem.

- **Cerrado:** registrar as quatro respostas adiciona entradas no diário local existente. A exportação da análise inclui configuração, resultado, respostas e IDs dos eventos, no formato `ipe-cerrado-four-role-analysis-v1`. O replay anterior não muda.
- **Bennu/Webb:** pareceres ficam no estado da tentativa e entram no relatório científico exportado, com evento e registro citados. Nova execução inicia uma nova análise. Os formatos de projeto e o modelo físico R18 são preservados porque os dados e cálculos não mudaram.

### Imersão e apresentação

Cena ampliável dentro da página, saída com Escape, inspeção por sistema e transição suave da nave. O destaque segue o evento selecionado ou o foco explícito da trilha. As capacidades do componente aparecem em texto, ao lado da montagem. A direção do enlace aparece durante transmissão registrada. No solo, os cartões seguem os IDs efetivamente recebidos, inclusive no Cerrado; não basta pintar os primeiros N cartões.

Reutilizamos os quatro modelos NASA locais e a pilha React/Three já instalada. Movimento reduzido e controles de texto permanecem disponíveis. Não foram adicionadas bibliotecas, modelos gerados, vídeo remoto ou serviços externos durante a partida.

## Divisão dos dois devs

| Responsável | Arquivos e tarefas | Contrato que precisa preservar |
| --- | --- | --- |
| Dev A · ciência e motor | `src/lab/learning-comparison.ts`, `mission-curriculum.ts`, `scientific-expeditions.ts`, `mission-visual-state.ts`, `core/`, `data/science/`; revisar comparadores de `CerradoLearning.tsx` e `ExpeditionLearning.tsx` | IDs, unidades, procedência, incertezas e causalidade. Funções de apresentação não alteram o motor. Comparar resultados executados, nunca rascunhos posteriores. |
| Dev B · interação e 3D | `MissionLearning.tsx`, `LearningComparison.tsx`, `CerradoLearning.tsx`, `ExpeditionLearning.tsx`, `MissionControl.tsx`, `ScientificExpedition.tsx`, `CompareDialog.tsx`, `Scene.tsx`, `ConfiguredSpacecraft.tsx`, `OrbitalScene.tsx` e CSS associados | A mesma seleção controla texto, relógio e cena. Alternativa 2D, foco por teclado, movimento reduzido, textos curtos e visibilidade de registros futuros. |
| Revisão conjunta | Roteiro das três missões, casos incompletos, exportação e reabertura | Não confundir seis pacotes com seis evidências válidas; não atribuir causalidade isolada a opções compostas. |

Os caminhos da tabela são relativos a `experiments/mission-design-lab/`. As três experiências de aprendizagem são componentes pequenos sobre resultados existentes. Os dois fluxos mantêm seus contratos de persistência próprios. Uma futura consolidação só se justifica quando reduzir duplicação sem esconder diferenças científicas.

## Verificação e comandos

1. `npm --prefix experiments/mission-design-lab run verify`: domínio, UI simulada e build. Os testes R19 cobrem estados temporais, pares incompletos, incompatibilidade, comparações e pareceres.
2. `npm run build:beta && npm run test:beta && npm run prepare:vercel`: documentos, arquivos científicos, hashes e política da publicação.
3. `npm --prefix apps/immersive-lp run build`: apresentação pública, com link para o roteiro atual.
4. Conferir no navegador as três missões, expansão da cena, retorno por evento, A/B e exportação. Verificar o commit do deploy e os arquivos públicos após publicação.

O executor de testes UI usa uma pasta temporária compartilhada: apenas um agente deve rodar `test:ui` por vez. Suites de agentes podem usar diretórios temporários próprios. Testes DOM não medem GPU, desempenho de aparelho físico, experiência de leitor de tela ou aprendizagem humana. O recibo `evidence/revision-r19.json` registra os resultados efetivamente obtidos nesta rodada.

## Recursos NASA pesquisados e aproveitados

- [Science Traceability Matrix — NASA HESTO](https://hesto.smce.nasa.gov/focused-topics/): orienta o encadeamento de objetivo, observável, requisito e produto. A trilha é uma adaptação educativa própria, não uma certificação STM.
- [PI Launchpad — elementos da STM](https://science.nasa.gov/wp-content/uploads/2023/04/PILaunchpad__STM__JLeisner210615.pdf): referência para separar pergunta, medida e desempenho requerido. Texto e UI foram escritos para este jogo.
- [Instrumentos científicos do Webb](https://science.nasa.gov/mission/webb/science-overview/science-explainers/webbs-scientific-instruments/) e [observatório Webb](https://science.nasa.gov/mission/webb/spacecraftoverview/): reforçam a diferença entre instrumentos, plataforma e comunicação. O catálogo didático não reproduz o desempenho do hardware NASA.
- [Construir um modelo do Webb](https://science.nasa.gov/mission/webb/build-a-model-of-webb/) e [Webb em 3D](https://science.nasa.gov/mission/webb/webb-3d/): atividades externas de aprofundamento; não foram incorporadas dependências ou mídias desses sites.

A pesquisa anterior conserva GMAT/NAIF e terreno georreferenciado como etapas posteriores. Nesta edição não executamos GMAT, não integramos API JPL e não introduzimos um segundo motor de física. O próximo passo é um piloto com iniciantes: observar se conseguem explicar um evento, apontar um registro e revisar uma conclusão sem ajuda. Esse resultado ainda não foi medido.
