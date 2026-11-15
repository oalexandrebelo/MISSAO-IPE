# MISSÃO IPÊ · Pitch para jurados e fala de Alexandre Belo

**R21 · 15/11/2026** · [Apresentação pública](https://projeto-ipe.vercel.app/pitch) · [Jogar MISSÃO IPÊ](https://projeto-ipe.vercel.app/jogar).

## Fala de três minutos

Seis blocos somam exatamente 180 segundos. A fala tem cerca de 331 palavras. Os tempos reservam espaço para transições e para a pausa de dois segundos na demonstração. Confirme a cadência no equipamento de apresentação.

Selecione **Iniciar pitch de 3 min**. Use as setas ou os botões do rodapé para avançar. **Notas** mostra a fala da cena atual e permite reiniciar o relógio. Antes de começar, deixe Bennu em A e carregue o laboratório em outra aba, com uma tentativa pronta para inspeção.

### 0:00–0:20 · Abertura (20 s)

*Inicie o relógio. Olhe para a banca ao fazer a pergunta.*

> Uma nave pode coletar seis arquivos e deixar a Terra sem resposta. Como saber se o problema foi o instrumento, a energia ou o contato com o solo? Sou Alexandre Belo, da MISSÃO IPÊ.

### 0:20–0:50 · Problema (30 s)

*Aponte a bateria e o instante do replay.*

> Para quem está começando, projetar uma missão vira uma lista de peças e números. Se algo falha, a tela pode mostrar só uma nota. O aluno fica sem saber que decisão causou a falha, qual dado perdeu e se ainda pode responder à pergunta científica. Precisávamos tornar esse caminho visível para permitir uma segunda tentativa informada.

### 0:50–1:30 · Solução (40 s)

*Mostre os três casos na ordem Cerrado, Bennu e Webb.*

> A MISSÃO IPÊ é um jogo de engenharia espacial em que você projeta, faz uma previsão e usa a evidência recebida para redesenhar a missão. Criamos o jogo para o desafio Space Mission Design Game. No Cerrado, dados reais do Terra MODIS ajudam a distinguir potência instantânea de energia armazenada. Em Bennu, separar dados produzidos dos que chegaram ao solo muda a comparação de tamanhos. No Webb, você escolhe o instrumento pela pergunta e lê um espectro com incerteza.

### 1:30–2:20 · Demo (50 s)

*Comece em A. Aponte T+85 min e o total. Deixe o laboratório aberto em outra aba.*

> Em Bennu, usamos dimensões publicadas da missão OSIRIS-REx. Em A, aos oitenta e cinco minutos, o replay mostra a nave aguardando contato. No final, chegam dois registros. Com o mesmo rádio e um serviço de solo que abre antes e dura mais, quantos chegam?

*Espere dois segundos. Selecione B e aponte a transmissão e as quatro medidas adicionais.*

> Em B, a nave já transmite nesse mesmo instante. Chegam seis registros por seis créditos a mais. Aqui vemos capturas do replay. No laboratório, você pode repetir a comparação, abrir uma medida recebida e seguir o evento até a antena no 3D.

### 2:20–2:45 · Validação (25 s)

*Mostre a trilha da evidência e o alcance das verificações.*

> Rodamos as três missões localmente e conferimos as decisões, os dados que chegam, a trilha e as respostas. Os testes cobriram o motor, a interface, o servidor e o painel privado. Já conseguimos rastrear a entrega até a decisão. Ainda precisamos observar se iniciantes explicam a falha e justificam uma mudança.

### 2:45–3:00 · Fechamento (15 s)

*Deixe as duas marcas, o endereço e o botão de jogo visíveis.*

> Nosso próximo passo é observar iniciantes usando o jogo para justificar uma decisão. Escolham uma missão e mostrem qual evidência responde à sua pergunta. Obrigado.

## O que a validação cobre

A equipe jogou as três missões localmente. A rodada do candidato registrou 158 testes de domínio, 64 de interface do laboratório, 17 de servidor, 6 de painel e 17 verificações da distribuição. As verificações cobrem resultados, entrega de dados, trilha, registros e acesso do painel. A próxima validação é observar iniciantes explicando a causa de uma falha e justificando a revisão. [Métricas e critérios de aceite](54-METRICAS-E-HANDOFF-R21.md)

## O que a banca vê em cada missão

| Caso | Decisão e consequência | Aprendizagem e limite |
| --- | --- | --- |
| Cerrado · Terra/MODIS | Com contatos curtos e a mesma bateria, envie as bandas ou calcule o índice a bordo. Em B, a demanda de descarga atinge 29,58 W, acima do limite de 20 W, em T+10 min. Ainda há 13,96 Wh armazenados. A entrega final passa de 2 para 0 registros válidos. | Distinguir potência instantânea de energia armazenada. Os dois registros de A formam um par no mesmo ponto, em dois períodos de 2024. O exercício preserva lacunas e a diferença de índice por si só deixa a causa em aberto. [Índices de vegetação, NASA](https://science.nasa.gov/earth/earth-observatory/measuring-vegetation-ndvi-evi/) |
| Bennu · OSIRIS-REx | Troque o serviço de solo com o mesmo rádio de 1,2 Mbit/s. A primeira janela muda de T+90 para T+85 min e de 120 para 500 s. O custo de serviço sobe de 6 para 12 créditos. Aos 85 min, A aguarda e B começa a transmitir. No final, 2 e 6 registros chegam válidos, respectivamente. | Separar arquivos produzidos, arquivos recebidos e evidência disponível para a comparação. Os eixos maiores publicados informam tamanho. Composição, origem e segurança de pouso exigem outras evidências. [Estudo arquivado pela NASA](https://ntrs.nasa.gov/citations/20205007912) |
| Webb · WASP-39 b | Escolha a câmera genérica ou o espectrômetro. Em T+15 min, o quadro mostra o espectrômetro processando o arquivo. Ao final, chegam seis pacotes nas duas tentativas. A câmera satisfaz o transporte, com 0 medidas compatíveis. O espectrômetro entrega 6 medidas válidas nesta configuração. | Escolher o instrumento a partir da pergunta e interpretar a luz bloqueada por faixa com as incertezas de 1σ. A câmera do jogo é genérica. O Webb possui modos de espectroscopia em seus instrumentos reais, e a detecção molecular depende da análise completa. [Dados FIREFLy](https://doi.org/10.5281/zenodo.6959427) · [Instrumentos do Webb](https://science.nasa.gov/mission/webb/science-overview/science-explainers/webbs-scientific-instruments/) |

Os valores científicos são recortes de observações históricas. A geometria da nave, o relógio, os recursos e os custos são parâmetros do exercício. A troca de configuração determina a entrega e a compatibilidade dos registros. [Proveniência das três missões](45-DADOS-REAIS-BENNU-WEBB-R18.md).

## Leitura de jurado

- **Relevância.** A fala abre com a dificuldade de ligar escolhas de engenharia a uma resposta científica. Apresenta o desafio Space Mission Design Game e mostra o percurso de um iniciante, da hipótese à interpretação. [Perfil oficial da MISSÃO IPÊ no Space Apps 2026](https://www.spaceappschallenge.org/2026/find-a-team/missao-ipe/?tab=details).
- **Criatividade e execução.** Aos 85 minutos do ensaio de Bennu, trocar o serviço de solo muda o estado do enlace e a entrega final. No jogo, seguir um dado recebido de volta ao evento e ao componente permite justificar a próxima tentativa.
- **Uso dos dados e validade.** Os três casos ligam uma decisão aos dados históricos que ela permite interpretar. A banca pode repetir os ensaios e conferir números, unidades e limites nas fontes e no motor.
- **Impacto.** Uma pessoa, ou até quatro no mesmo dispositivo, pode projetar e revisar uma tentativa. Uma avaliação com iniciantes ainda precisa verificar se explicam uma falha e justificam uma nova escolha.
- **Comunicação.** O pitch pede uma previsão antes de revelar B, mostra o estado da nave, abre as quatro dimensões adicionais e encerra com o endereço do jogo.

A organização local de Rewari publica suas orientações de avaliação de 2026 no portal Space Apps. Os critérios locais de Rio Verde e o guia global ficaram indisponíveis na consulta desta revisão. [Orientações publicadas para Rewari](https://www.spaceappschallenge.org/2026/local-events/rewari/) · [Guia global de julgamento](https://www.spaceappschallenge.org/resources/judging-awards-guide/).

## Para levar o 3D ao vivo

No [laboratório](https://projeto-ipe.vercel.app/lab/), abra **Projetar missão do Cerrado**, **Explorar missão Bennu** ou **Projetar telescópio científico**. Abra **Investigar esta escolha**, registre uma previsão e execute os dois ensaios. **Investigar primeira diferença** leva ao subsistema e ao instante do replay. Em Bennu, compare A e B com o relógio em T+85 min e inspecione **Comunicação**. Para seguir uma medida da tentativa principal, abra sua entrega na trilha da evidência.

Os quatro quadros do pitch foram recortados do laboratório público R20. O botão A/B alterna duas capturas do mesmo instante e seus resultados finais pré-calculados. A simulação, o relógio navegável e a inspeção das peças ficam no laboratório. A edição conserva a marca da equipe, a assinatura de Alexandre Belo e a adaptação das curvas da MotionMaxxing. [Créditos visuais e instruções de palco R20](52-PITCH-ALEXANDRE-BELO-R20.md).

Na captura de Bennu, uma sessão no Chrome exibiu o canvas vazio ou conservou o quadro anterior após a troca. A abertura direta do laboratório antes de cada tentativa permitiu obter as duas cenas no tempo correto. Confira a renderização no equipamento de apresentação antes de usar o jogo ao vivo. Para apresentar offline, guarde a pasta do pitch com CSS, JavaScript e assets. A fala também está na cópia autocontida do painel da equipe. [Painel e fala offline](https://projeto-ipe.vercel.app/equipe/index.html)

## Rastreabilidade dos quadros

Os resultados foram reexecutados com `runLearningExperiment` e `summarizeLearningTrial`. Os arquivos e os estados do motor permitem conferir os exemplos usados nesta fala. [Código dos ensaios](https://github.com/oalexandrebelo/MISSAO-IPE/blob/main/experiments/mission-design-lab/src/lab/mission-curriculum.ts).

| Quadro | Evidência do motor |
| --- | --- |
| Cerrado B · T+10 min | Evento `PEAK_POWER`. Em A chegaram `A-A2024241` e `A-A2024257`. |
| Bennu A/B · T+85 min | B registra `CONTACT_START`. A entrega sítios 1 e 2. B acrescenta os sítios 3, 5 e 6, além do clasto 4a. |
| Webb B · T+15 min | Evento `JOB_START`. As seis faixas correspondem às linhas 25, 39, 54, 58, 65 e 80 da redução FIREFLy. |

## Equipe MISSÃO IPÊ

O perfil oficial consultado em 15/11/2026 informa o evento local de Rio Verde, Brasil, e o desafio Space Mission Design Game. O cadastro da equipe identifica os seis integrantes abaixo. [Perfil oficial da equipe](https://www.spaceappschallenge.org/2026/find-a-team/missao-ipe/?tab=details)

- Alexandre Belo · @alexandrebelo
- Bruno Assis Carvalho Meyer · @brunoassiscarvalho
- Enzo Chaves Melo · @enzocmelo
- Paulo Eduardo Canassa Monteiro · @paulo_canassa
- Castanete Rodrigues Araújo de Vlagelaier · @cherry01
- Rebecca Pádua Rocha · @rebeccapádua
