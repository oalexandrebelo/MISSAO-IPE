# MISSÃO IPÊ · pitch de Alexandre Belo

**R20 · 15/11/2026.** Pitch em português para jurados do NASA Space Apps Challenge e pessoas começando em engenharia espacial. [Abrir apresentação](../presentation/pitch/index.html) · [Jogar](../lab/index.html) · [Roteiro estendido](49-ROTEIRO-APRESENTACAO-MVP-R19.md).

## Apresentar em três minutos

Abra a apresentação e selecione **Iniciar pitch de 3 min**. O relógio começa no primeiro quadro. A fala é de Alexandre Belo, ao vivo. Use as setas ← e →, os botões do rodapé ou deslize horizontalmente na cena. **Cenas** abre o índice para explorar fora da ordem. **Notas** abre a fala sugerida do quadro atual e permite reiniciar o relógio.

A tela cheia é acionada pelo rodapé quando há suporte do navegador. **Reduzir movimento** desliga o deslocamento da câmera e os efeitos do ensaio. A preferência de movimento do sistema é respeitada na abertura e quando muda. O avanço sempre depende de quem apresenta. Ensaie em tela cheia no equipamento da apresentação e deixe o jogo carregado em outra aba se for abrir a experiência completa.

| Tempo | Cena | O que mostrar |
| --- | --- | --- |
| 0:00–0:25 | A pergunta | No horizonte da Terra, pergunte qual evidência precisa chegar ao solo. Apresente o jogo e a equipe. |
| 0:25–0:50 | Cerrado | Aponte o ensaio BANDAS versus ÍNDICE. Calcular o índice reduz volume e aumenta o pico de potência. |
| 0:50–1:10 | Bennu | Mostre o mosaico histórico. Situe a pergunta sobre tamanhos e a janela de transmissão. |
| 1:10–1:35 | Webb | Mostre seis pontos com incerteza. Explique por que a adequação do instrumento importa mesmo quando os seis pacotes chegam. |
| 1:35–2:15 | Decisão A/B | Mostre A com dois registros válidos. Peça uma previsão, selecione B e deixe os identificadores e as quatro medidas adicionais aparecerem. |
| 2:15–2:43 | Conselho | Aponte a trilha que vincula o registro ao evento do 3D. Selecione Solo ou Usuários para exemplificar uma responsabilidade. |
| 2:43–3:00 | Convite | Convide o público a escolher um destino, prever o resultado e defender uma conclusão com evidência. |

## O que o pitch reproduz do jogo

Resultados obtidos com `runLearningExperiment` e `summarizeLearningTrial` de [mission-curriculum.ts](https://github.com/oalexandrebelo/MISSAO-IPE/blob/main/experiments/mission-design-lab/src/lab/mission-curriculum.ts). Os quadros exibem estados finais dos ensaios guiados. O visual do enlace em perspectiva mostra a mudança de estado e a entrega dos registros. Seu movimento é ilustrativo. Para investigar quando cada registro chegou, com o motor em operação e a cena 3D selecionando o componente, abra [o laboratório](../lab/index.html).

| Caso | Configuração do catálogo e IDs | Resultado |
| --- | --- | --- |
| Cerrado | `short-contact`, `DEFAULT_CONFIG`, `processing: bands` → `index`. | 2 → 0 registros válidos. Em A chegaram `A-A2024241` e `A-A2024257`. |
| Bennu | `compact` / `near` / `full` / `camera` / `extended` para lançador, perfil, duração, instrumento e energia. `ground: short` → `extended`. | 2 → 6 registros válidos. A entrega `bennu-site-1` e `bennu-site-2`. B também entrega `bennu-site-3`, `bennu-site-4a`, `bennu-site-5` e `bennu-site-6`. |
| Webb | `science` / `far` / `full` / `extended` / `extended` para lançador, perfil, duração, energia e solo. `instrument: camera` → `spectrometer`. | Seis pacotes recebidos em cada lado. 0 → 6 registros válidos. Os bins de B vêm das linhas 25, 39, 54, 58, 65 e 80 da redução FIREFLy. |

O rádio de Bennu permanece em 1,2 Mbit/s. O seletor de solo muda em conjunto o início da primeira janela, de T+90 para T+85 min, a duração, de 120 para 500 s, e o custo do serviço, de 6 para 12 créditos. A comparação é entre os dois serviços completos. A configuração de cada nova tentativa pode produzir outro resultado.

Em Webb, `camera` é a câmera genérica do catálogo didático. Os seis bins de um único trânsito em 10/07/2022 conservam as incertezas publicadas de 1σ. O recorte serve para interpretar um espectro, com a detecção molecular documentada na fonte completa. No Cerrado, os dois períodos são de 2024. A imagem do Brasil central é de 2000 e contextualiza o instrumento.

IPÊ é o nome da equipe. Os dados de ciência são históricos. A nave configurável, o tempo operacional, os recursos e os custos são didáticos. O laboratório representa a nave sem escala física e sem telemetria NASA ao vivo. Os quatro papéis (lançamento, espaço, solo e usuários) podem ser conduzidos por uma pessoa ou por até quatro no mesmo dispositivo. Essa colaboração ocorre no local, sem multiplayer online. O piloto com iniciantes ainda é uma etapa de avaliação da aprendizagem.

## Direção e movimento

O palco segue o caminho da observação até a evidência no solo. No Cerrado, o volume economizado encontra um limite físico. Em Bennu, os registros produzidos aguardam contato. No Webb, o mesmo número de pacotes pode gerar resultados científicos diferentes. O gesto que fecha a demonstração é trocar o serviço de solo e ler quais registros chegaram.

A composição usa o horizonte amplo e a tipografia editorial observados em *Space planet*, além da passagem entre destinos de *Space Voyage*, referências do catálogo MotionSites. As imagens usadas no pitch estão no acervo da equipe e da NASA. Os palcos alternam imagem integral, órbita lateral, gráfico e mesa de decisão. As imagens de contexto permanecem estáticas durante a leitura.

Apliquei a versão [8c8ec0f da MotionMaxxing](https://github.com/Tejashmakwana/motionmaxxing/tree/8c8ec0f2a6f6c9a0da15cd24f7b1298ab298368c). A direção aproveita o fio visual entre cenas e concentra o movimento no gesto que torna a consequência visível. A adaptação usa as funções medidas `softLand` e `accelExit` de [runtime/motion.js](https://github.com/Tejashmakwana/motionmaxxing/blob/8c8ec0f2a6f6c9a0da15cd24f7b1298ab298368c/runtime/motion.js#L16-L39), de Tejas Makwana, Apache 2.0. O código da apresentação calcula poses de partida e chegada com amostras em 30 fps, interpoladas pelas Web Animations nativas. São 8 frames para deslocar a câmera antes do corte, 15 para assentá-la depois do corte e 12 para o texto. Não há animação contínua durante a leitura. [Licença da adaptação](../presentation/pitch/assets/LICENSE-MOTIONMAXXING-APACHE-2.0.txt).

O navegador renderiza uma cena estável até receber uma ação, inclusive no modo de movimento reduzido. Os medidores de quadros parados, cadência e duração de cartões finais do fluxo de MP4 da MotionMaxxing não se aplicam ao pitch controlado ao vivo. Os controles de navegação e tempo ficam abaixo do palco e as notas abrem sob demanda. A página usa CSS, JavaScript e fontes locais, sem GSAP nem Three no navegador da apresentação.

## Créditos dos ativos

| Ativo | Origem e tratamento |
| --- | --- |
| Marca MISSÃO IPÊ | SVG canônico da equipe, de `experiments/mission-design-lab/public/brand/`. Alexandre Belo recebe crédito textual na abertura e no fechamento. |
| Terra | [NASA/Goddard, Blue Marble](https://science.nasa.gov/earth/earth-observatory/the-blue-marble-true-color-global-imagery-at-1km-resolution/). Reuso dos WebP prontos de `apps/immersive-lp/public/assets/`, com enquadramento, sombra e atmosfera em CSS. |
| Cerrado | [Terra/MODIS, Brasil central](https://science.nasa.gov/earth/earth-observatory/central-brazil-1111/). Brian Montgomery, Reto Stöckli e Robert Simmon com dados da equipe MODIS. Reuso do JPEG de `web/media/`. |
| Bennu | [Mosaico PolyCam](https://science.nasa.gov/resource/bennu-mosaic/), NASA/Goddard/University of Arizona. Reuso do JPEG de `web/media/`. |
| Webb | [Modelo Webb (A)](https://science.nasa.gov/3d-resources/james-webb-space-telescope-a/), NASA/Goddard Space Flight Center. Imagem renderizada do GLB local com câmera em perspectiva (2,5, 1,4, 2,5), Three existente e iluminação de apresentação. PNG com alfa e recorte. |
| Espectro | Gráfico do pitch a partir dos seis intervalos FIREFLy, com barras de 1σ. [Arquivo científico NASA](https://exoplanetarchive.ipac.caltech.edu/cgi-bin/atmospheres/nph-firefly?atmospheres=&planet=WASP-39%20b) e [dados dos autores](https://doi.org/10.5281/zenodo.6959427). |
| Tipografia | EB Garamond e Figtree do acervo local da landing page. Licenças SIL OFL 1.1 inclusas na pasta `assets/`. |

O [handoff R19](48-HANDOFF-DOIS-DEVS-R19.md) e a [extração das fontes científicas](45-DADOS-REAIS-BENNU-WEBB-R18.md) descrevem a mecânica e os limites de conclusão. A publicação usa [as diretrizes de imagens e mídia da NASA](https://www.nasa.gov/nasa-brand-center/images-and-media/).

## Manutenção

A entrada é `presentation/pitch/index.html`. O diretório é autossuficiente para renderizar o pitch, inclusive aberto como arquivo local. Links de aprofundamento e do jogo precisam de rede se abertos desse modo. Na distribuição, os links do jogo e do guia apontam para as páginas no mesmo site. Os IDs de cena são âncoras copiáveis, como [Decisão A/B](../presentation/pitch/index.html#decisao).

Ao atualizar o laboratório, rode os ensaios guiados novamente e confira os valores nesta página e no pitch. A troca A/B usa os resultados finais do ensaio de Bennu. As páginas históricas da apresentação têm seus próprios arquivos e roteiro.

## Verificação local

O Chrome local confirmou abertura direta do HTML, início, pausa e reinício do relógio, setas, Home e End, índice de cenas, notas e saída por Escape, troca de papéis, A/B reversível e entrada e saída de tela cheia. A cena de Bennu revela as quatro novas medidas ao selecionar B. Com movimento reduzido, a troca de cena não gerou animações. O mesmo instante de uma transição produziu a mesma posição antes e depois de saltar para outro instante.

Os totais e os IDs dos registros foram reexecutados no motor de cada ensaio. A varredura automatizada de acessibilidade no navegador ficou incompleta por uma limitação da configuração da ferramenta de teste. Esses resultados são locais e não medem legibilidade no projetor, uso com leitor de tela nem tocabilidade em dispositivo físico.

A revisão R20 também corrigiu o atalho “Ir para a cena”: ele preserva a cena atual. `node --test scripts/test-pitch.mjs` passou em duas regressões DOM, cobrindo âncoras/atalho e a reversão completa de A/B (contagem, agenda, custo e lacunas). A conferência CUA percorreu as sete cenas, tabela Webb, notas, relógio e seleção dos papéis; a 390 px, as cenas de leitura e A/B permaneceram sem transbordamento horizontal. Nenhum erro de console foi observado nessas ações.
