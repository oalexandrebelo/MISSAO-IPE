# 32 — Guia didático do Ipê: projetar, operar e explicar uma missão científica

**14/11/2026 · edição R15.** Este guia explica o projeto para quem vai jogar, facilitar uma atividade ou continuar seu desenvolvimento. Parte dos três casos e dos contratos implementados na R14. A implementação da montagem 3D configurável R15 e sua verificação integrada local estão concluídas. O status da publicação e a implantação efetivamente conferida devem ser consultados em [PUBLICADO.md](https://github.com/oalexandrebelo/PROJETO-IPE/blob/main/PUBLICADO.md) e no [recibo de produção R15](https://github.com/oalexandrebelo/PROJETO-IPE/blob/main/evidence/production-r15.json).

O ponto de entrada é o [beta de três missões](../lab/index.html). Para detalhes de implementação, leia [31 — Três missões científicas](31-TRES-MISSOES-CIENTIFICAS-R14.md). Para ampliar o repertório, consulte [33 — Oportunidades NASA Science](33-OPORTUNIDADES-NASA-SCIENCE.md).

## 1. O que estamos construindo

O Ipê é um jogo de projeto de missões científicas. O jogador recebe uma pergunta, escolhe uma arquitetura limitada por recursos, prevê o resultado, executa o modelo e verifica quais evidências chegaram ao solo. Depois explica o resultado e tenta uma alteração. A proposta é aprender como decisões de engenharia interferem no que pode ser conhecido cientificamente.

O desafio central é fazer a ciência chegar. Um instrumento pode produzir um registro e a missão ainda falhar porque a bateria não sustenta a operação, a memória não comporta os dados ou o contato acaba antes da recepção completa. Também é possível transmitir tudo e não responder à pergunta, se o instrumento escolhido não atende ao objetivo.

A experiência aproxima quatro atividades normalmente vistas separadamente: formular uma necessidade, projetar recursos, acompanhar a operação e interpretar o retorno. O 3D ajuda a localizar funções e relacionar os eventos aos componentes. As contas e as regras ficam em um domínio separado da apresentação: girar a câmera ou trocar de vista não altera o resultado.

O projeto trabalha com três perguntas científicas. Elas compartilham uma forma de investigar, mas não usam todas o mesmo catálogo nem a mesma física simplificada. Cada caso tem seis decisões com duas alternativas: 64 configurações por caso. No Cerrado, essas configurações podem ser executadas em duas condições de contato. Bennu e telescópio têm seus próprios perfis e agendas.

Não se trata de software de voo, planejamento de uma missão real ou reprodução completa de um veículo NASA. Aprender com um modelo exige compreender tanto suas regras quanto o que ficou fora dele.

## 2. Três histórias e três tipos de retorno

### Cerrado — observar mudança sem inventar a causa

Uma equipe precisa comparar vegetação em três pontos próximos a Rio Verde, Goiás, em dois períodos. São seis registros históricos Terra/MODIS do produto MOD13Q1 Collection 061. O jogo transporta e processa esses arquivos em uma operação didática de 180 minutos; a nave fictícia não faz uma nova aquisição MODIS durante a partida.

Os compostos têm início em **28/08/2024** e **13/09/2024**. No pacote local, as observações selecionadas são de **01/09/2024** e **23/09/2024**. Essas datas não são intercambiáveis: o início do composto identifica o período do produto, enquanto a data de observação identifica o registro escolhido dentro desse contexto.

O jogador decide enviar as bandas vermelha e infravermelha próxima para calcular NDVI no solo, ou calcular o índice a bordo e transmitir um lote menor. A pergunta e a regra de qualidade permanecem as mesmas. A economia de dados tem um custo de processamento e potência.

O retorno permite comparar dois valores do mesmo ponto somente quando ambos foram recebidos integralmente e são válidos. Um valor indisponível permanece ausente. Uma diferença de NDVI não identifica sozinha chuva, irrigação, manejo ou desmatamento. Outras observações e contexto seriam necessários para investigar a causa.

A explicação conceitual de índices de vegetação pode ser aprofundada no artigo NASA Earth Observatory [Measuring Vegetation](https://science.nasa.gov/earth/earth-observatory/measuring-vegetation-ndvi-evi/). Ele é uma referência histórica de conceitos, não a especificação do pacote de dados do jogo.

### Bennu — escolher uma observação que responda à pergunta

Uma equipe fictícia quer estudar a morfologia de uma superfície. Pede dois registros de cada uma de três regiões didáticas, A, B e C. A pergunta exige a câmera de superfície. O jogador precisa sustentar a produção e a entrega de seis registros dentro da vida operacional escolhida.

A rugosidade usada no exercício é **sintética**, em unidades arbitrárias. Os seis valores não são medições NASA, as regiões não são locais nomeados de Bennu e o resultado não escolhe um lugar seguro para pousar. O modelo 3D oficial fornece contexto visual do alvo.

A história real da OSIRIS-REx ajuda a distinguir observação remota, amostra e análise: a missão coletou material em 2020 e entregou a amostra à Terra em 2023. O Ipê não simula esse retorno físico. Seu exercício entrega registros digitais de uma pesquisa fictícia. [Fonte: missão OSIRIS-REx](https://science.nasa.gov/mission/osiris-rex/).

Uma boa resposta ao final é: “Recebi seis registros compatíveis com a pergunta e posso comparar a variável do exercício; isso não é uma caracterização científica real de Bennu.”

### Telescópio — ler luz não é apenas produzir uma imagem

Uma equipe fictícia quer comparar três faixas infravermelhas em duas exposições. O pedido exige o espectrômetro. A câmera pode produzir dados dentro do modelo, mas não atende à pergunta especificada.

As faixas didáticas são **1,2 µm, 2,0 µm e 3,5 µm**. Os seis valores de fluxo relativo foram inventados para o exercício. Nenhuma diferença demonstra água, atmosfera, composição ou vida. O modelo do Webb é uma referência visual; não representa uma reprodução de seus instrumentos, massa, refrigeração ou desempenho.

Na astronomia real, observações por imagem e por espectroscopia respondem a necessidades diferentes. A página [Webb’s Scientific Instruments](https://science.nasa.gov/mission/webb/science-overview/science-explainers/webbs-scientific-instruments/) ajuda a estudar essa distinção. No Ipê, a regra instrumental é deliberadamente pequena e explícita para que o jogador possa justificá-la.

As duas ou três horas de Bennu e telescópio representam **operação depois da chegada**. Não são o tempo de viagem para um asteroide ou para L2. Os perfis LEO/L2 são conceituais e mudam agendas didáticas; não há cálculo de transferência orbital.

## 3. Os quatro segmentos: quem precisa, o que viaja e como a informação volta

Um segmento é uma parte da missão com responsabilidades próprias. Trocar de segmento muda o foco da inspeção, não cria quatro simulações independentes.

| Segmento | Pergunta principal | O que observar no jogo | Exemplo de dependência |
| --- | --- | --- | --- |
| **Usuários** | Qual evidência responde à necessidade? | Objetivo, quantidade requerida e registros disponíveis naquele instante. | Um dado transmitido com instrumento incompatível não atende ao pedido. |
| **Lançamento** | O projeto cabe no envelope escolhido? | Massa e orçamento; nas expedições, compatibilidade entre lançador e perfil. | Ampliar energia ou instrumento aumenta massa e custo. |
| **Espacial** | A nave consegue produzir, guardar e transmitir? | Instrumento, bateria, geração, memória e modo operacional. | Menos bits podem exigir mais potência de processamento. |
| **Terrestre** | O que foi recebido a tempo? | Contato, fila, transmissão e recepção completa. | Ter energia e dados não basta se a janela de recepção termina. |

No Cerrado, lançador e perfil orbital são fixos. Nas expedições, existem escolhas didáticas de lançador e perfil. A estação operacional desenhada pelo projeto é própria; a antena DSN oficial fica no acervo de referências. Não há reserva nem controle de antenas NASA.

Essas conexões permitem pensar em sistemas: uma melhoria local pode criar uma dificuldade em outra parte. A decisão precisa funcionar no conjunto.

## 4. O processo completo, da necessidade ao retorno

Bennu e telescópio apresentam seis etapas explícitas. O Cerrado reúne os mesmos assuntos em **Briefing → Projetar → Sala de missão**, além do laboratório de física. As seis etapas abaixo são uma forma comum de estudar os casos, não uma afirmação de que a navegação do Cerrado já possui seis abas.

| Etapa | Ação do jogador | Evidência a registrar | Erro frequente a investigar |
| --- | --- | --- | --- |
| **1. Necessidade** | Ler a história e dizer o que precisa ser conhecido. | Uma frase com objeto, observação e comparação desejada. | Começar escolhendo o equipamento mais caro sem entender o pedido. |
| **2. Requisitos** | Converter o pedido em condições verificáveis. | Quantidade, instrumento, limites e prazo. | Tratar “muita ciência” como critério sem quantidade ou validade. |
| **3. Projeto** | Escolher as seis opções e inspecionar os totais. | Configuração e motivo de cada escolha. | Examinar uma peça isoladamente. |
| **4. Verificação** | Conferir restrições, escrever hipótese e revisar os papéis. | Previsão antes de ver o resultado. | Confundir pré-voo aprovado com operação comprovada. |
| **5. Operação** | Executar; selecionar eventos e instantes; alternar segmentos. | Evento, horário e recurso que sustentam a explicação. | Julgar só pelo aspecto da cena ou pelo último número. |
| **6. Retorno científico** | Conferir registros válidos, interpretar e propor nova tentativa. | Conclusão limitada pela evidência e alteração justificada. | Usar informação que não chegou ou atribuir uma causa não medida. |

Nas novas expedições, uma hipótese precisa ter pelo menos oito caracteres para permitir a execução. Isso é um requisito da interface, não uma avaliação de qualidade científica. “Vai funcionar” pode cumprir um limite de texto e continuar sendo uma previsão fraca. Uma hipótese útil prevê uma mudança observável e explica o mecanismo esperado.

Exemplo: “Com a mesma câmera e energia, ampliar os contatos deve aumentar os registros recebidos porque a fila terá mais tempo para transmitir.” A execução poderá confirmar ou contrariar essa expectativa no modelo.

O processo tem afinidade com a relação entre conceito, requisitos e revisão discutida em [Basics of Space Flight — Mission Inception](https://science.nasa.gov/learn/basics-of-space-flight/chapter7-1/). Essa inspiração não atribui certificação NASA nem um nível formal de maturidade ao projeto.

## 5. As seis decisões do Cerrado

Os números abaixo são os valores reais do **catálogo implementado**, mas representam hipóteses didáticas. Não são especificações de componentes comerciais ou NASA. A estrutura fixa acrescenta **1,2 kg e 20 créditos**. O limite do caso é **3,6 kg e 86 créditos**.

| Decisão | Alternativa A | Alternativa B | Questão que a escolha provoca |
| --- | --- | --- | --- |
| Bateria | 16 Wh, descarga máxima 20 W; 0,6 kg; 12 créditos | 24 Wh, descarga máxima 35 W; 1 kg; 19 créditos | Preciso de mais energia armazenada, mais potência disponível ou ambas? |
| Painel | 12 W nominais; 0,25 kg; 10 créditos | 18 W nominais; 0,55 kg; 16 créditos | A geração adicional compensa massa e custo? |
| Processamento | BANDAS: 180 Mbit por lote; 26 W totais por 60 s; 0,35 kg; 8 créditos | ÍNDICE: 60 Mbit por lote; 38 W totais por 60 s; 0,4 kg; 14 créditos | Vale trocar volume de comunicação por potência de processamento? |
| Rádio | 0,96 Mbit/s úteis; 16 W totais; 0,2 kg; 10 créditos | 2,4 Mbit/s úteis; 26 W totais; 0,45 kg; 17 créditos | A taxa maior cabe na alimentação e no orçamento? |
| Memória | 512 Mbit; 0,05 kg; 2 créditos | 1.536 Mbit; 0,15 kg; 5 créditos | Quantos lotes se acumulam antes de poder transmitir? |
| Política | Todos os contatos | Somente o último contato | Quanto tempo de serviço será utilizado e quanto ficará na fila? |

Os contatos são uma condição escolhida separadamente: duas janelas de **600 s** ou duas de **240 s**. O objetivo continua sendo seis registros. A política de rádio é decidida antes da execução; mover a linha do tempo não envia comandos à nave.

As potências de processamento e transmissão da tabela são **cargas totais daquele modo**. Não se deve somar novamente o consumo de espera. O domínio do Cerrado inclui fatores de geração solar, limite de entrada para carga e eficiências de 95% para carga/descarga. A bateria começa em 80% e deve respeitar uma reserva de 15%.

As seis opções independentes não significam que qualquer combinação funcione. O interesse do catálogo é permitir testar combinações e explicar suas restrições.

## 6. As seis decisões de Bennu e telescópio

Esses dois casos usam outro catálogo. A estrutura fixa soma **1,2 kg e 15 créditos**; a memória é fixa em **720 Mbit**. A energia começa em 80%. O modelo de conversão é ideal, com eficiência de 100%, explicitamente diferente do Cerrado.

| Decisão | Alternativa A | Alternativa B | Efeito principal |
| --- | --- | --- | --- |
| Lançador | Compacto: envelope 3 kg/80 créditos; custa 8 créditos | Científico: envelope 4,2 kg/115 créditos; custa 20 créditos | O compacto admite apenas o perfil próximo. |
| Perfil | Próximo; custo adicional zero | Distante; mais 6 créditos | Muda agendas de iluminação, trabalho e contato; exige lançador científico. |
| Instrumento | Câmera: 120 Mbit/registro; 22 W totais por 60 s; 0,45 kg; 12 créditos | Espectrômetro: 180 Mbit/registro; 30 W totais por 60 s; 0,75 kg; 22 créditos | Câmera atende Bennu; espectrômetro atende telescópio. |
| Energia | 6 Wh, painel 10 W, descarga máxima 18 W; 0,65 kg; 14 créditos | 24 Wh, painel 22 W, descarga máxima 35 W; 1,25 kg; 26 créditos | Muda autonomia, geração e limite de potência juntos. |
| Solo | Duas janelas de 120 s; 6 créditos | Duas janelas de 500 s; 12 créditos | A taxa permanece 1,2 Mbit/s; rádio com carga total de 16 W. |
| Vida operacional | 2 horas; custo adicional zero | 3 horas; mais 4 créditos | Muda o horizonte do exercício; o objetivo continua sendo seis registros. |

Bennu chama os perfis de **Sobrevoo próximo** e **Órbita de levantamento**. Telescópio usa **Órbita terrestre conceitual (LEO)** e **L2 conceitual**. Não há C3, subida do lançador, transferência, gravidade local ou dimensionamento de propulsão nessas escolhas.

Um lançador não entra como massa da nave. Os serviços de solo e de lançamento acrescentam créditos conforme o catálogo; a massa do total é a estrutura e os componentes embarcados. A alternativa de energia é um pacote: mudar de compacta para ampliada não isola apenas a bateria. Isso deve ser lembrado ao atribuir causas.

## 7. As unidades que tornam as decisões compreensíveis

### W é potência; Wh é energia

**Watt (W)** expressa uma taxa de uso ou geração de energia. **Watt-hora (Wh)** expressa uma quantidade acumulada. Com potência constante, energia = potência × tempo em horas. Um consumo de 12 W por meia hora usa 6 Wh. Isso é uma relação de unidades, sem afirmar que qualquer bateria de 6 Wh permita esse regime.

A capacidade e o limite de descarga são restrições distintas. Uma bateria pode ter energia restante e não conseguir fornecer a potência exigida naquele instante. Também pode atender ao pico e acabar antes do fim da operação.

No telescópio padrão, o espectrômetro pede 30 W e o painel compacto gera 10 W no início da observação. A bateria precisaria fornecer 20 W; o limite é 18 W. O modelo encerra aos **600 s**, com evento de pico de potência. Não é necessário esperar a energia chegar a zero para ocorrer uma falha.

No Cerrado, durante processamento, o painel de 18 W recebe fator didático de 55%: gera **9,9 W**. O modo ÍNDICE demanda 38 W no total. Considerando a eficiência de descarga de 95%, a bateria precisa fornecer aproximadamente **29,58 W**. A bateria de 16 Wh permite somente 20 W; a de 24 Wh permite 35 W. A troca do processamento exige examinar a alimentação.

### bit é quantidade; bit/s é taxa

Um bit é uma unidade de informação; um byte contém oito bits. Neste catálogo, **1 Mbit = 1.000.000 bits**. Mbit não é MB. Uma memória de 512 Mbit representa 64 MB em unidades decimais.

**Mbit/s** ou **Mbps** é uma taxa. Para uma transmissão contínua na taxa útil do modelo, quantidade = taxa × tempo. Um lote de 120 Mbit a 1,2 Mbit/s exige 100 s. Um de 180 Mbit exige 150 s. Essa conta presume que há dados disponíveis, contato e alimentação durante todo o intervalo.

As taxas do jogo já representam serviço útil. Não adicionar um segundo desconto de protocolo sem mudar explicitamente o modelo. Na realidade, comunicação também envolve ganho, ruído, codificação e outros fatores; o tutorial [Basics of Space Flight — Telecom](https://science.nasa.gov/learn/basics-of-space-flight/chapter10-1/) oferece contexto além da simplificação usada aqui.

### Memória, fila e recepção completa

A memória guarda o que foi produzido e ainda precisa sair. A fila usa ordem de chegada, chamada FIFO. A recepção pode avançar parcialmente entre contatos, mas um registro só conta como entregue quando chega inteiro e passa a regra científica.

Com lotes de 180 Mbit, três lotes ocupam 540 Mbit e não cabem numa memória de 512 Mbit. No modelo, o lote novo precisa entrar inteiro; se não houver espaço, ele é perdido. Isso é diferente de uma transmissão parcial, em que os bits recebidos permanecem no solo e o restante continua na fila.

Um número baixo de registros completos não significa necessariamente que nenhum bit foi transmitido. Essa diferença explica por que um placar sozinho é insuficiente para entender a missão.

### Índice, diferença e ausência

NDVI é calculado a partir das bandas vermelha e infravermelha próxima: **(NIR − vermelho) / (NIR + vermelho)**. Ele não tem unidade de energia, massa ou tempo. No registro histórico A do primeiro período, os inteiros 2.626 e 1.654 resultam em aproximadamente **0,2271**; a escala comum das bandas se cancela nessa razão.

Uma diferença entre dois índices é “valor posterior menos valor anterior”; não é automaticamente uma porcentagem. O jogo só apresenta a comparação quando os dois valores da execução foram entregues e são válidos. Conhecer o arquivo original para estudar a fórmula não autoriza preencher um valor ausente no resultado da missão.

## 8. Três investigações guiadas por resultados verificáveis

Os exemplos abaixo foram executados diretamente no código dos domínios em 14/11/2026. São referências do modelo local, não resultados de missões espaciais, testes de GPU ou observações de aprendizagem. O facilitador pode guardar as soluções para a discussão final.

### Investigação A — reduzir dados pode aumentar a exigência elétrica

Use o Cerrado com bateria 16 Wh, painel 18 W, BANDAS, rádio econômico, memória 1.536 Mbit e todos os contatos.

| Tentativa | Mudança | Resultado verificado | O que investigar |
| --- | --- | --- | --- |
| A1 | Contatos longos | Sucesso; 6/6 | A base consegue entregar o conjunto nesse cenário. |
| A2 | Somente contatos curtos | Falha; 2/6 | Tempo de serviço disponível para os mesmos 1.080 Mbit. |
| A3 | A2, trocando somente BANDAS por ÍNDICE | Falha aos 600 s; 0/6 | Pico de potência antes do primeiro lote terminar. |
| A4 | A3, trocando bateria por 24 Wh | Sucesso; 6/6 | Capacidade de descarga atende ao processamento; volume total cai para 360 Mbit. |

A2 oferece 480 s de contato a 0,96 Mbit/s: **460,8 Mbit** recebidos. Isso completa dois lotes de 180 Mbit e parte do terceiro; não completa seis. A4 demanda 360 Mbit e respeita as demais restrições. Seu total é **3,5 kg e 84 créditos**, dentro de 3,6 kg e 86 créditos.

Perguntas: em qual tentativa apareceu uma dificuldade nova? Qual evento a demonstra? Por que “arquivo menor” não garantiu sucesso sozinho? O que se perdeu em massa e custo para resolver o problema?

### Investigação B — mudar o solo pode resolver a entrega

Use Bennu com lançador compacto, sobrevoo próximo, câmera, energia ampliada e vida de três horas. Compare apenas a escolha de solo.

| Tentativa | Solo | Resultado verificado | Quantidade recebida |
| --- | --- | --- | --- |
| B1 | Contatos curtos | Falha; 2/6 | 288 Mbit |
| B2 | Contatos ampliados | Sucesso; 6/6 | 720 Mbit |

B1 tem 240 s de contato no total a 1,2 Mbit/s. Os 288 Mbit completam dois lotes de 120 Mbit e parte do terceiro. B2 mantém câmera e dados, mas disponibiliza mais tempo para a transmissão. Seu total é **2,9 kg e 77 créditos**, dentro do envelope compacto de 3 kg e 80 créditos.

Agora mantenha B2 e reduza a vida para duas horas. O resultado verificado é **3/6**; o horizonte termina antes da última observação e do contato final. Aumentar a bateria não criaria tempo de operação que o projeto decidiu não usar.

Perguntas: qual parte da missão resolveu B1? A mudança alterou a taxa do rádio? Qual diferença existe entre um registro ainda na fila e um registro não produzido?

### Investigação C — o instrumento certo também precisa de suporte

No telescópio padrão, o espectrômetro é compatível com a pergunta, mas a energia compacta não atende ao pico inicial. O modelo falha aos 600 s e entrega **0/6**.

Uma configuração de referência usa lançador científico, L2 conceitual, espectrômetro, energia ampliada, contatos ampliados e três horas. O resultado verificado é **sucesso, 6/6, 3,2 kg e 105 créditos**, dentro de 4,2 kg e 115 créditos.

Essa referência altera várias decisões em relação ao padrão. Serve para mostrar uma possibilidade viável, mas não permite atribuir a melhora a uma única mudança. Para investigar uma causa, crie uma sequência de tentativas mudando uma decisão por vez e registrando quando o evento limitante muda.

Perguntas: o que a câmera permitiria perguntar em outra missão? Por que ela não atende a esta? Qual dado adicional seria necessário antes de associar um espectro real a uma substância? O que, entre os resultados apresentados, foi inventado para aprender engenharia?

## 9. Como explicar sucesso, falha e projeto inválido

O objetivo não é descobrir uma combinação secreta. É identificar quais requisitos foram atendidos, quais não foram e qual evidência sustenta essa conclusão.

| Situação | Significado no modelo | Primeira evidência a procurar |
| --- | --- | --- |
| **Sucesso** | Todos os requisitos aplicáveis e seis registros completos e válidos. | Requisitos finais, registros e trajetória dos recursos. |
| **Projeto inválido** | Uma restrição estática não foi atendida. | Massa/orçamento; nas expedições, instrumento ou lançador/perfil. |
| **Falha operacional** | O projeto não concluiu todas as condições de operação e entrega. | Primeiro evento limitante, tempo de encerramento e saldo dos recursos. |
| **Recepção parcial** | Parte dos bits chegou, mas o registro ainda não está completo. | Contadores de bits, fila e horário do fim do contato. |
| **Dado indisponível** | A execução não estabeleceu um valor utilizável. | Estado do registro e regra científica, sem substituir por zero. |

O Cerrado inclui exigência de reserva de energia e eficiências próprias. As expedições usam balanço ideal e não herdam automaticamente essa reserva. As regras de um caso não devem ser aplicadas mentalmente a outro sem conferir o catálogo.

Uma explicação forte pode seguir esta ordem: **requisito → evento → consequência → mudança proposta**. Exemplo: “O requisito era receber seis registros. Os contatos acabaram com dados na fila; dois registros estavam completos. Vou ampliar o contato, mantendo câmera e energia, para testar se esse limite explica a entrega.”

Pode haver mais de uma restrição. O primeiro evento ajuda a organizar a investigação, mas não prova que ele seja a única causa possível. Depois de corrigir um limite, outro pode aparecer.

## 10. Ler a cena 3D e a linha do tempo

A cena combina três camadas que precisam continuar reconhecíveis:

- **Contexto:** Terra, Bennu, telescópio, nave e estação ajudam a situar o problema. Posição, distância e escala são ilustrativas.
- **Configuração:** a apresentação da arquitetura comunica escolhas do projeto. Uma montagem visual precisa corresponder ao catálogo, sem sugerir especificações ausentes.
- **Estado:** iluminação, energia, fila, transmissão e registros seguem o resultado calculado e o instante selecionado.

Ao voltar no tempo, a vista usa o último estado registrado até aquele segundo. Não interpola energia nem antecipa dados futuros. Eventos simultâneos permanecem possíveis: um contato, um trabalho e uma mudança de modo podem compartilhar uma fronteira temporal. O relatório final é identificado como final; ele não deve ser confundido com a informação disponível naquele instante da cena.

A reprodução percorre uma execução já calculada. Ela não recalcula a missão nem recebe telemetria NASA. Na comparação A/B das expedições, o relógio usa segundos comuns, não posições iguais em duas listas de amostras. Uma execução encerrada conserva seu estado final.

A base oferece alternativa 2D/SVG, controles HTML e preferência por movimento reduzido. A existência dessas opções não equivale a uma auditoria completa de acessibilidade ou a desempenho validado em todo aparelho.

Os quatro modelos oficiais são referências: CubeSat genérico, antena DSN, Bennu e Webb. O [registro de ativos](30-ATIVOS-NASA-IMPLEMENTADOS.md) conserva créditos, origem, hashes e limites. Um modelo bonito não demonstra energia suficiente, compatibilidade de lançamento ou trajetória possível.

## 11. Trabalhar sozinho ou com uma equipe local

A interface oferece uma, duas, três ou quatro pessoas no mesmo dispositivo. Quatro papéis revisam o mesmo projeto:

| Papel | Responsabilidade | Pergunta de revisão |
| --- | --- | --- |
| Ciência e usuários | Defender a evidência necessária. | O instrumento e os registros respondem à pergunta? |
| Nave e recursos | Examinar energia, memória e carga útil. | O conjunto produz e preserva os dados sem violar os limites? |
| Lançamento e trajetória | Examinar envelope e perfil. | As escolhas de massa, custo e destino são compatíveis? |
| Solo e operações | Examinar contato e prazo. | Os registros podem chegar inteiros dentro da vida escolhida? |

Com menos de quatro pessoas, os papéis são distribuídos ciclicamente; no modo individual, uma pessoa assume os quatro. Em equipe, as quatro revisões precisam estar marcadas antes de executar. Alterar escolhas, hipótese ou número de participantes invalida a revisão anterior; no Cerrado, cenário, previsão e justificativa também fazem parte desse contexto.

A marcação registra uma declaração de revisão. Não verifica a identidade de quem participou nem prova discussão independente. Para uma atividade presencial, a equipe pode ler sua justificativa em voz alta antes de marcar cada papel e trocar responsabilidades na tentativa seguinte.

Não há contas, sala online, comunicação entre máquinas ou sincronização remota. O facilitador precisa organizar a conversa fora do software. Isso permite começar em um único computador, mas não transforma o jogo em uma plataforma de colaboração remota.

## 12. Roteiro sugerido para uma atividade de 50 minutos

Este é um plano de facilitação proposto, ainda não uma duração validada com participantes. Adapte o ritmo ao público, à leitura e ao equipamento. Uma primeira sessão pode usar apenas um caso.

| Tempo sugerido | Atividade | Entrega observável |
| --- | --- | --- |
| 0–5 min | Ler a história e identificar o pedido. | Uma frase com a pergunta e o dado necessário. |
| 5–12 min | Distribuir papéis e examinar o catálogo. | Configuração inicial e uma justificativa por área. |
| 12–17 min | Escrever hipótese e revisar. | Previsão que possa ser confrontada com eventos. |
| 17–25 min | Executar e inspecionar os quatro segmentos. | Um evento com horário e consequência. |
| 25–35 min | Alterar uma decisão e executar novamente. | Comparação A/B com uma causa candidata. |
| 35–43 min | Interpretar o retorno científico. | Conclusão que só usa registros disponíveis e válidos. |
| 43–50 min | Compartilhar explicação e limites. | Uma descoberta sobre engenharia e uma conclusão que os dados não permitem. |

Para uma sessão mais curta, o facilitador pode fornecer uma configuração inicial e concentrar a atividade em uma alteração. Para aprofundar, pedir as contas de potência, energia e tempo de transmissão antes da execução. Os três casos podem ser usados em encontros separados, com troca de papéis.

A busca por uma solução viável não deve consumir toda a aula. Reserve tempo para explicar por que funcionou, o que foi simplificado e como uma medição real exigiria mais contexto.

## 13. Perguntas, exercícios e avaliação formativa

As atividades abaixo avaliam raciocínio sobre o modelo. Não pressupõem domínio prévio de astrodinâmica.

| Exercício | Pergunta | Evidência esperada na resposta |
| --- | --- | --- |
| Potência e energia | Uma bateria com energia restante pode falhar? | Distinguir Wh de limite instantâneo em W e apontar um evento. |
| Comunicação | Um lote de 180 Mbit cabe em 120 s a 1,2 Mbit/s? | Calcular 144 Mbit de capacidade de serviço; reconhecer recepção incompleta. |
| Memória | Três lotes de 180 Mbit cabem em 512 Mbit? | Calcular 540 Mbit e explicar a política de entrada inteira. |
| Ciência | Um valor ausente de NDVI pode ser substituído por zero? | Separar ausência de evidência de um valor numérico válido. |
| Instrumento | Transmitir uma imagem atende a qualquer pergunta? | Relacionar instrumento, variável e requisito científico. |
| Tempo | Três horas significam viagem até Bennu? | Identificar a janela operacional após chegada e a ausência de transferência calculada. |
| Comparação | Duas tentativas mudaram quatro escolhas. Qual mudança causou o sucesso? | Reconhecer que não se isolou uma variável; propor sequência controlada. |
| 3D | A presença de um modelo Webb valida a potência do telescópio fictício? | Distinguir referência geométrica de parâmetros do domínio. |

Para avaliar uma explicação, use quatro critérios simples: identifica o requisito, aponta evidência concreta, conecta mecanismo e consequência, e reconhece um limite. Um relato pode ser bom mesmo quando a missão falha. Da mesma forma, alcançar 6/6 sem entender por quê não demonstra sozinho aprendizagem.

Um fechamento possível pede três frases: “Eu previa…”, “O evento que mudou minha interpretação foi…” e “Ainda não posso concluir…”. Compare as respostas antes e depois de uma segunda tentativa. Esse procedimento gera material para observar compreensão, mas não substitui um estudo educacional com desenho e análise próprios.

## 14. O que salvar e o que não confundir com replay

Nas expedições Bennu e telescópio, as tentativas e a comparação ficam na memória da sessão. **Sair do caso ou recarregar a página não preserva automaticamente esse histórico.** Salvar projeto grava escolhas e hipótese em `localStorage`; exportar projeto permite levar esse conjunto para outro uso. A importação confere o formato e exige executar novamente no modelo atual.

Exportar relatório guarda resultado, hipótese, reflexão e contexto declarado da equipe em JSON. Isso é um registro da tentativa, mas não é a reprodução verificada por hash do motor do Cerrado. As duas funcionalidades têm contratos diferentes.

O Cerrado mantém persistência e replay próprios. Dados locais dependem do navegador e da origem usada; mudar de domínio pode apresentar outro armazenamento. Exporte o que precisar preservar antes de trocar de instalação. O HTML portátil clássico não contém automaticamente as novas expedições.

Durante uma atividade, prefira nomes de equipe que não precisem identificar pessoas. O valor didático está na hipótese, na configuração e na explicação, não em coletar dados pessoais desnecessários.

## 15. Dados reais, hipóteses e limites do modelo

| Camada | O que existe | O que não se pode deduzir |
| --- | --- | --- |
| Arquivos do Cerrado | Seis registros históricos reais Terra/MODIS, com origem e qualidade. | Aquisição em tempo real pelo CubeSat fictício ou causa ambiental determinada apenas pelo NDVI. |
| Observações de Bennu | Seis valores de rugosidade sintéticos, em unidades arbitrárias. | Mapa científico, segurança de pouso ou medição real das regiões A/B/C. |
| Observações do telescópio | Seis fluxos relativos sintéticos em três faixas didáticas. | Detecção de água, vida, atmosfera ou desempenho instrumental Webb. |
| Engenharia | Catálogos finitos, agendas e balanços versionados. | Certificação de hardware, orçamento real ou projeto pronto para voar. |
| Geometria e cena | Modelos oficiais de referência e elementos próprios. | Precisão física, escala validada ou efemérides calculadas. |
| Revisão da equipe | Papéis e marcações no mesmo dispositivo. | Identidade verificada, participação independente ou colaboração remota. |
| Testes do software | Verificações delimitadas de domínio e interface, conforme recibos. | Aprendizagem demonstrada, acessibilidade integral ou desempenho em qualquer equipamento. |

A ausência de um fenômeno é uma decisão de escopo. O jogo não integra propagador orbital, trajetória de transferência, ambiente térmico completo, degradação por radiação ou óptica real do Webb. As simplificações permitem investigar relações específicas sem fingir que todos os aspectos de uma missão foram resolvidos.

## 16. Estado atual e continuidade

| Capacidade | Situação no corte deste guia | Próxima evidência útil |
| --- | --- | --- |
| Três casos científicos e dois domínios separados | Implementados na base R14. | Preservar os contratos e resultados de referência ao evoluir. |
| Quatro segmentos, revisão local e linha do tempo | Implementados na base R14. | Verificar compreensão e navegação no equipamento escolhido. |
| Quatro modelos NASA locais, fontes e alternativa 2D | Implementados na base R14. | Medir carregamento, memória e operação gráfica em dispositivos alvo. |
| Montagem 3D configurável R15 | Implementação e verificação integrada local concluídas. | Consultar o recibo de produção R15 para o estado da implantação; ampliar a medição em dispositivos alvo. |
| Guia e oito oportunidades NASA Science | Documentados nesta edição. | Transformar prioridades em atividades pequenas e verificar seu uso. |
| Trajetórias ou APIs NASA/JPL no cálculo | Não integradas. | Definir pergunta, contrato de dados e validação antes de implementar. |
| Novos dados reais de Bennu ou espectros | Não integrados às expedições. | Selecionar produto, unidade, qualidade, proveniência e objetivo compatível. |
| Colaboração remota | Não implementada. | Validar a necessidade antes de adicionar contas e sincronização. |
| Eficácia educacional | Hipótese de produto. | Pilotar atividades e analisar explicações, dificuldades e revisões. |

Na conferência local da R15, 140 testes de domínio passaram. O ensaio de Bennu em navegador verificou a troca câmera/espectrômetro, energia de 6 para 24 Wh e contatos de 120 para 500 s, preservando a representação da antena e o canvas ativo. A verificação integrada local foi concluída. Esse recorte não comprova desempenho em todos os dispositivos. [PUBLICADO.md](https://github.com/oalexandrebelo/PROJETO-IPE/blob/main/PUBLICADO.md) e [evidence/production-r15.json](https://github.com/oalexandrebelo/PROJETO-IPE/blob/main/evidence/production-r15.json) delimitam o estado da publicação e a implantação conferida, separadamente dos ensaios locais.

A evolução deve manter a relação entre propósito, escolha, resultado e evidência. O [handoff atual da imersão 3D R15](34-HANDOFF-IMERSAO-3D-R15.md) detalha esta rodada; o [handoff para dois desenvolvedores](25-HANDOFF-DOIS-DEVS.md) preserva o mapa geral de responsabilidades e aceites técnicos. O uso de material NASA não estabelece endosso institucional nem elegibilidade competitiva; esses assuntos têm documentação e verificação próprias.

## 17. Fontes locais e alcance desta revisão

Este guia foi cruzado com os arquivos abaixo em 14/11/2026. Os links apontam para o código público; a versão exata da entrega deve ser obtida no recibo e no commit correspondente.

| Fonte do projeto | O que sustenta neste guia |
| --- | --- |
| [Catálogo do Cerrado](https://github.com/oalexandrebelo/PROJETO-IPE/blob/main/experiments/mission-design-lab/src/core/catalog.ts) | Alternativas, massas, créditos, cenários e premissas elétricas. |
| [Motor do Cerrado](https://github.com/oalexandrebelo/PROJETO-IPE/blob/main/experiments/mission-design-lab/src/core/engine.ts) | Lotes, fila, eventos, limites, sucesso e falha. |
| [Pacote científico](https://github.com/oalexandrebelo/PROJETO-IPE/blob/main/experiments/mission-design-lab/src/data/science-data.ts) e [retorno científico](https://github.com/oalexandrebelo/PROJETO-IPE/blob/main/experiments/mission-design-lab/src/lab/science-return.ts) | Datas, registros, pareamento e ausência de valores não entregues. |
| [Domínio das expedições](https://github.com/oalexandrebelo/PROJETO-IPE/blob/main/experiments/mission-design-lab/src/lab/scientific-expeditions.ts) | Dados sintéticos, catálogos, agendas, balanços e critérios dos novos casos. |
| [Interface das expedições](https://github.com/oalexandrebelo/PROJETO-IPE/blob/main/experiments/mission-design-lab/src/ui/ScientificExpedition.tsx) | Etapas, hipótese, comparação, persistência e exportação. |
| [Revisão de equipe](https://github.com/oalexandrebelo/PROJETO-IPE/blob/main/experiments/mission-design-lab/src/ui/CrewReview.tsx) | Participantes, distribuição e invalidação de revisões. |
| [Estado visual](https://github.com/oalexandrebelo/PROJETO-IPE/blob/main/experiments/mission-design-lab/src/lab/mission-visual-state.ts) | Projeção temporal do resultado sem antecipação. |

Além da leitura, foram executados dez exemplos de domínio: quatro variações do Cerrado, os dois padrões das expedições, três variações de Bennu com energia ampliada e a configuração viável de telescópio. As quantidades e falhas citadas na seção 8 correspondem a essas execuções. Não foi realizado por esta revisão um novo ensaio de navegador, dispositivo físico, turma, infraestrutura remota ou trajetória real.
