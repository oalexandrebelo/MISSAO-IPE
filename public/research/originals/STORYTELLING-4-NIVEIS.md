# PROJETO-IPÊ — storytelling de quatro níveis

Versão editorial 1.0 · 14/11/2026 · America/Sao_Paulo. Direção de produto: AB / Alexandre Belo; conteúdo e verificação do contrato com assistência de IA. Narrativa original proposta para o beta. Todos os personagens e pedidos operacionais abaixo são fictícios.

## 1. Arco da campanha

Uma equipe fictícia de estudo da vegetação precisa comparar dois períodos históricos em três pontos próximos a Rio Verde. Os arquivos Terra/MODIS já existem. O jogador recebe um laboratório de transporte de dados por CubeSat e passa de uma primeira entrega orientada a decisões de processamento, armazenamento, comunicação e uso de recursos.

A história avança quando surge uma necessidade nova: compreender o caminho do dado; trabalhar com memória compacta; preservar bandas sob contatos curtos; e produzir a mesma entrega com folga de créditos. As necessidades são conhecidas antes da execução. Nenhum incidente exige uma falha aleatória, um desastre ambiental inventado ou uma recuperação que o motor não oferece.

**Pergunta científica:** como os valores de NDVI dos três pontos diferem entre os dois períodos efetivamente recebidos? **Meta operacional:** entregar 6/6 registros válidos e completos com todas as restrições satisfeitas. **Convite educativo:** explicar como uma escolha alterou o caminho dos dados até o solo.

As condições particulares dos níveis são escolhas pedagógicas da campanha. O envelope do motor permanece em 3,6 kg, 86 créditos e 180 minutos simulados. O nível 4 acrescenta uma meta de custo de 78 créditos; isso não altera retroativamente o teto de 86 créditos do motor.

## 2. Personagens e linguagem

| Personagem fictício | Papel na história | Função didática | Forma de falar |
|---|---|---|---|
| Lina Duarte | Coordenação da missão | Relacionar finalidade, etapas e resultado | Uma pergunta concreta e um próximo passo claro |
| Caio Mendes | Engenharia de dados | Tornar visível o acúmulo na memória | Aponta volume, limite e instante, sem culpar o jogador |
| Joana Costa | Operação de solo | Conectar pedido científico e comunicação | Explica por que a representação do dado importa neste exercício |
| Ravi Almeida | Revisão do projeto e ciência | Pedir evidência, comparar folgas e limitar conclusões | Convida a defender uma escolha sem dar nota à pessoa |

Os personagens não representam funcionários, parceiros ou porta-vozes de instituições reais. A narrativa não atribui a eles medições de campo, missões de voo ou uma equipe escolar que não existiu. Orientação e créditos são de jogo.

O feedback deve seguir **ocorrência observada → consequência → oportunidade de investigação**. Evitar “você errou tudo”, “missão segura”, “risco zero” ou “aprovado pela NASA”. Uma tentativa incompleta continua disponível para estudo; nunca é necessário falhar deliberadamente para obter a conquista.

## 3. Regras comuns de progressão

O identificador do nível, seu briefing e sua condição acompanham a tentativa. A conclusão é avaliada sobre a configuração realmente executada. Alterar o projeto depois do relatório não reaproveita o resultado anterior como evidência de uma nova solução.

Em todos os níveis, a primeira condição é `result.outcome === 'success'`, com 6/6 registros exigidos e nenhuma violação. As condições adicionais vêm da tabela a seguir. Nenhuma resposta de texto, escolha de câmera, velocidade de animação ou pontuação visual substitui esse contrato.

| ID estável | Nome | Cenário | Configuração inicial | Condição adicional |
|---|---|---|---|---|
| `first-signal` | Primeiro sinal | `long-contact` | `DEFAULT_CONFIG` | Nenhuma |
| `memory-tradeoff` | Memória em disputa | `long-contact` | `DEFAULT_CONFIG` com `buffer: compact` | `result.config.buffer === 'compact'` |
| `narrow-window` | Janela estreita | `short-contact` | `DEFAULT_CONFIG` | `result.config.processing === 'bands'` |
| `science-delivered` | Ciência que chega | `short-contact` | `DEFAULT_CONFIG` com `battery: large`, `processing: index` | `result.credits <= 78` |

O apoio muda de orientação inicial para perguntas de investigação e, por fim, síntese autônoma. Recursos de ajuda permanecem disponíveis e não anulam conclusão. A reflexão pode ser sugerida e salva, mas sua qualidade depende de interpretação humana; não é corrigida por contagem de palavras ou palavras-chave.

## 4. Nível 1 — Primeiro sinal

**Personagem:** Lina Duarte, coordenação fictícia. **Intenção pedagógica:** reconhecer que o valor científico depende de chegar ao solo com integridade e qualidade.

**Incidente de abertura:** o laboratório acaba de receber o pacote histórico. A equipe já tem um projeto inicial plausível e precisa verificar se o fluxo completo funciona. Este nível oferece uma primeira experiência de sucesso; não apresenta um componente quebrado ou uma falsa urgência.

**Briefing proposto:**

> “Temos seis registros históricos de três pontos do Cerrado. Antes de interpretar qualquer mudança, precisamos recebê-los por inteiro. Vamos acompanhar o caminho de cada lote até o solo.”

**Objetivo mensurável:** entregar os seis registros válidos no cenário de contatos longos, sem violação do motor. O jogador pode manter ou alterar o projeto inicial; a configuração vencedora não precisa ser única.

**Escolha significativa:** decidir quando transmitir e conferir se as capacidades escolhidas atendem o volume. A política de todos os contatos ajuda a perceber por que duas oportunidades importam. O jogador pode usar a revisão prévia, mas deve distinguir uma conta necessária de uma execução concluída.

**Interação:** examinar a meta, observar um subsistema, registrar uma previsão e executar. No relatório, acompanhar ao menos um registro do fim de processamento à entrega; essa inspeção é uma orientação de aprendizagem, não um clique obrigatório que simula compreensão.

**Feedback contextual:**

- Em sucesso: “Os seis registros chegaram completos e válidos. Agora os três pontos têm os dois períodos necessários à comparação.”
- Se um lote estiver parcial: “Parte deste lote chegou, mas o registro ainda não conta como entregue.”
- Se a configuração falhar: apresentar o evento real e permitir redesenhar; não insistir em uma fala de sucesso do roteiro.

**Critério de conclusão:** sucesso operacional 6/6 no cenário longo, atribuído a este nível. A configuração inicial já o satisfaz quando executada.

**Evidência de referência:** `DEFAULT_CONFIG` entrega 6/6 com 3,05 kg e 71 créditos. Produz e transmite 1.080 Mbit; não perde dados e termina sem fila. Esses números vêm do motor, não de uma recompensa narrativa.

**Pergunta de debrief:** “Qual é a diferença entre produzir um lote e disponibilizar sua ciência no solo?”

**Transição:** Caio apresenta um novo pedido de projeto: manter uma memória menor. O jogador leva o raciocínio sobre volume e agenda para um limite mais apertado.

**Conceitos:** cadeia de dados; lote completo; tempo de contato; projeto versus operação; dados históricos versus simulação; primeira leitura de evidência.

## 5. Nível 2 — Memória em disputa

**Personagem:** Caio Mendes, engenharia de dados fictícia. **Intenção pedagógica:** investigar armazenamento antes do contato e perceber que reduzir volume exige uma decisão de processamento e potência.

**Incidente de abertura:** o novo exercício fixa a memória compacta de 512 Mbit. Mantidos os demais componentes iniciais, seis lotes de bandas não cabem antes do primeiro contato. Não é uma pane de fabricação: é uma incompatibilidade entre a agenda e o projeto.

**Briefing proposto:**

> “Neste ensaio, a memória será de 512 Mbit. Os trabalhos terminam antes do primeiro contato com o solo. Como entregar todos os registros sem ampliar a memória?”

**Objetivo mensurável:** sucesso 6/6 no cenário longo **mantendo `buffer: compact`**. Uma execução bem-sucedida com memória grande cumpre a operação, mas deixa este pedido pendente.

**Escolha significativa:** manter bandas maiores e investigar por que não cabem, ou processar o índice a bordo e sustentar sua demanda de potência. A qualidade científica da pergunta permanece igual no catálogo; a mudança não cria precisão adicional.

**Interação:** comparar capacidade e volume antes do primeiro contato, prever o gargalo, executar e localizar uma perda de lote quando houver. Redesenhar o processamento e a alimentação; executar outra vez para verificar a hipótese.

**Feedback contextual:**

- No preset: “O terceiro lote completo não coube. A transmissão ainda não havia começado, e o lote novo foi perdido.”
- Ao escolher índice com bateria pequena e observar pico: “O volume diminuiu, mas a demanda instantânea excedeu a descarga permitida. Investigue W e Wh separadamente.”
- Se trocar apenas para memória grande: “A missão entregou 6/6. Para concluir este nível, a entrega também precisa funcionar com 512 Mbit.”
- Em sucesso com memória compacta: “O projeto acomodou os seis lotes e entregou os registros mantendo a memória prevista.”

As frases só aparecem quando a evidência da execução corresponder. O motor emite `BUFFER_OVERFLOW` no primeiro descarte aos 1.860 s do preset, depois do terceiro trabalho; não existe animação de restauração dos arquivos perdidos nessa tentativa.

**Critério de conclusão:** sucesso operacional e memória compacta na configuração executada. Não exigir um número arbitrário de tentativas, uma falha prévia ou uma solução específica entre as viáveis.

**Evidência de referência:** o preset entrega 2/6, perde 720 Mbit e termina sem fila porque os lotes rejeitados não foram armazenados. Trocar processamento para índice e bateria para grande, mantendo painel padrão, rádio econômico, memória compacta e todos os contatos, entrega 6/6 com 3,40 kg e 81 créditos. Existem seis configurações que atendem este nível no catálogo atual.

**Pergunta de debrief:** “Que escolha reduziu o volume, e que outro requisito precisou ser atendido para ela funcionar?”

**Transição:** Joana apresenta uma condição diferente: a equipe do próximo exercício precisa receber as bandas para calcular NDVI no solo, e os contatos serão menores. A solução aprendida continua válida para a missão anterior, mas o pedido mudou.

**Conceitos:** acúmulo antes do contato; perda de lote novo; processamento a bordo; representação de dados; potência instantânea versus energia; solução que depende do objetivo.

## 6. Nível 3 — Janela estreita

**Personagem:** Joana Costa, operação de solo fictícia. **Intenção pedagógica:** coordenar comunicação, potência e envelope quando o pedido científico restringe uma alternativa.

**Incidente de abertura:** neste exercício, os contatos duram quatro minutos cada e a representação precisa permanecer em bandas. As janelas menores são uma condição do cenário anunciada no briefing, não uma estação que falha ao acaso.

**Briefing proposto:**

> “Agora precisamos receber as bandas e calcular o NDVI no solo. Teremos dois contatos de quatro minutos. Revise o projeto para entregar os seis registros nesse tempo.”

O pedido de bandas é uma restrição pedagógica de representação. O motor mantém a mesma pergunta NDVI; não simula automaticamente uma nova análise científica apenas por preservar as bandas.

**Objetivo mensurável:** sucesso 6/6 em `short-contact` com **`processing: bands`**. Usar índice pode resolver a operação em outras configurações, mas não atende a condição deste nível.

**Escolha significativa:** aumentar a taxa de transmissão requer suportar a potência do rádio; acomodar rádio e bateria maiores também exige manter massa e créditos dentro do envelope. O projeto não pode simplesmente maximizar todas as peças.

**Interação:** comparar volume total com a capacidade útil das janelas; executar a hipótese; inspecionar fila e registros completos; redesenhar rádio, alimentação e painel conforme necessário; verificar novamente e comparar.

**Feedback contextual:**

- No preset: “Nenhum lote foi perdido na memória. A janela terminou com dados ainda a bordo.”
- Ao trocar somente para rádio rápido e observar pico: “O rádio oferece maior taxa, mas esta execução parou no limite de descarga. Confira a demanda na bateria.”
- Ao ultrapassar o envelope: “O projeto não atende ao limite indicado. A entrega, sozinha, não conclui a missão.”
- Em sucesso com bandas: “As bandas dos seis registros chegaram. O cálculo no solo pôde ser concluído dentro das regras deste exercício.”

**Critério de conclusão:** sucesso operacional, cenário curto e bandas na configuração executada. Uma solução por índice deve mostrar “pedido de bandas pendente” sem renomear o sucesso do motor como falha física.

**Evidência de referência:** o preset entrega 2/6, transmite 460,8 Mbit e mantém 619,2 Mbit na fila, sem perda de memória. Há uma configuração que atende a este nível no catálogo: bateria grande, painel compacto, bandas, rádio rápido, memória grande e todos os contatos. Ela entrega 6/6 com 3,40 kg e 79 créditos.

**Pergunta de debrief:** “Por que aumentar a taxa de rádio exigiu rever a alimentação e outra escolha do projeto?”

**Transição:** a equipe aceita agora receber o índice para a mesma pergunta NDVI. Ravi pede uma decisão autônoma de projeto com oito créditos de folga. O jogador volta a escolher a representação com base no pedido, em vez de tratar a solução anterior como universal.

**Conceitos:** taxa e duração; recepção parcial; capacidade útil de contato; potência do rádio; compromissos de massa e orçamento; representação solicitada; comparação com múltiplas mudanças.

## 7. Nível 4 — Ciência que chega

**Personagem:** Ravi Almeida, revisão fictícia do projeto e da ciência. **Intenção pedagógica:** otimizar sob uma necessidade explícita, defender uma alternativa e reconhecer o limite do que os dados permitem afirmar.

**Incidente de abertura:** o projeto de partida já entrega 6/6 nos contatos curtos por 84 créditos. O novo pedido é reservar ao menos oito dos 86 créditos totais. A missão funciona; a pergunta agora é como atingir a mesma entrega usando no máximo 78 créditos.

**Briefing proposto:**

> “Já temos uma entrega completa, mas precisamos reservar oito créditos. Escolha um projeto de até 78 créditos e mostre, no relatório, o que sustenta sua decisão. Depois confira o que os dados permitem dizer.”

**Objetivo mensurável:** sucesso 6/6 em contatos curtos com **custo ≤ 78 créditos**. A explicação acompanha a reflexão e não vira uma condição de aprovação automática de texto.

**Escolha significativa:** escolher quais folgas preservar. Um projeto de 78 créditos mantém a memória grande; um de 75 usa memória compacta. Ambos cumprem a missão sob as condições fixas do motor. O menor custo não representa, por si só, maior confiabilidade ou uma decisão universalmente melhor.

**Interação:** revisar o briefing com menos orientação passo a passo; escolher, prever e executar; consultar requisitos e folgas; comparar ao projeto de partida; abrir os pares recebidos e elaborar uma afirmação descritiva com limite.

**Feedback contextual:**

- No preset: “Operação concluída: 6/6. A condição deste nível ainda pede reduzir o projeto de 84 para até 78 créditos.”
- Em sucesso: “Os seis registros chegaram e o projeto preservou pelo menos oito créditos. Veja quais folgas sua escolha mantém.”
- Na ciência: “A diferença entre dois valores descreve o par recebido. Ela não revela, sozinha, a causa da mudança.”

**Critério de conclusão:** sucesso operacional e custo de até 78 créditos no resultado executado. Contador, etapa do mapa e mensagem de conclusão devem corresponder a essa avaliação.

**Evidência de referência:** há duas configurações elegíveis no catálogo curto: bateria grande, painel compacto, índice, rádio econômico e todos os contatos; a memória pode ser grande, totalizando 3,20 kg/78 créditos, ou compacta, totalizando 3,10 kg/75 créditos. Ambas entregam 6/6. O preset tem bateria grande, painel padrão, índice, rádio econômico e memória grande, somando 3,50 kg/84 créditos.

**Debrief final sugerido:**

1. “Qual escolha você defende e que valor ou evento sustenta sua explicação?”
2. “Que folga mudou em relação ao projeto anterior?”
3. “Qual diferença de NDVI pode ser descrita com os pares recebidos e o que ainda não pode ser concluído?”

Essas perguntas podem ser respondidas por texto, fala em atividade mediada ou discussão fora da aplicação. O beta não presume gravar áudio nem interpretar automaticamente a resposta. Concluir a campanha demonstra cumprimento dos desafios; aprendizagem continua sendo uma questão de pesquisa.

**Encerramento:** a equipe fictícia recebe os três pares, apresenta fontes e convida o jogador a comparar outra solução ou explorar o laboratório. A conquista é o conjunto de decisões verificadas; não há certificado de engenharia de voo, nota de inteligência ou classificação NASA.

**Conceitos:** objetivos e restrições; folga de recursos; comparação de alternativas; evidência e raciocínio; dado versus inferência; limite do modelo; autonomia com possibilidade de ajuda.

## 8. Configurações e resultados para integração

`small/large`, `compact/standard`, `bands/index`, `economy/fast`, `compact/large` e `every-contact/last-contact` são os valores dos seis campos do contrato. A tabela escreve as opções por extenso para revisão humana.

| Caso | Bateria | Painel | Processamento | Rádio | Memória | Política | Resultado / uso |
|---|---|---|---|---|---|---|---|
| N1 inicial e solução | 16 Wh | 18 W | Bandas | Econômico | 1.536 Mbit | Todos | Longo: sucesso 6/6; 3,05 kg; 71 cr |
| N2 inicial | 16 Wh | 18 W | Bandas | Econômico | 512 Mbit | Todos | Longo: 2/6; perda por memória |
| N2 solução de referência | 24 Wh | 18 W | Índice | Econômico | 512 Mbit | Todos | Longo: sucesso 6/6; 3,40 kg; 81 cr |
| N3 inicial | 16 Wh | 18 W | Bandas | Econômico | 1.536 Mbit | Todos | Curto: 2/6; fila remanescente |
| N3 solução elegível | 24 Wh | 12 W | Bandas | Rápido | 1.536 Mbit | Todos | Curto: sucesso 6/6; 3,40 kg; 79 cr |
| N4 inicial | 24 Wh | 18 W | Índice | Econômico | 1.536 Mbit | Todos | Curto: sucesso 6/6; 84 cr; condição do nível pendente |
| N4 solução 78 cr | 24 Wh | 12 W | Índice | Econômico | 1.536 Mbit | Todos | Curto: sucesso 6/6; 3,20 kg; condição atendida |
| N4 solução 75 cr | 24 Wh | 12 W | Índice | Econômico | 512 Mbit | Todos | Curto: sucesso 6/6; 3,10 kg; condição atendida |

As contagens de soluções foram verificadas por enumeração das 64 configurações em 14/11/2026: 17 satisfazem a operação longa, seis também atendem à memória compacta do nível 2; nove satisfazem a operação curta, uma também preserva bandas no nível 3 e duas atendem ao teto de 78 créditos do nível 4. Esses conjuntos não são probabilidades de sucesso em voo.

## 9. Aceite narrativo e pedagógico

| ID | Verificação |
|---|---|
| ST-01 | Os quatro níveis apresentam pessoa fictícia, necessidade, objetivo mensurável, escolha, feedback, conclusão e transição |
| ST-02 | Cenário e restrição particular são anunciados antes da tentativa; nenhum requisito surge apenas no relatório |
| ST-03 | Fala do personagem corresponde ao resultado atual; o roteiro nunca substitui eventos reais |
| ST-04 | “Sucesso operacional” e “nível concluído” permanecem separados quando necessário |
| ST-05 | A ajuda não exige penalidade, não remove conclusão e respeita o pedido particular do nível |
| ST-06 | Reflexão tem caráter formativo; nenhuma heurística de texto produz uma alegação de compreensão |
| ST-07 | Progresso e mapa usam resultados executados, sem atribuir conclusão por visitar um cartão |
| ST-08 | Narrativa é utilizável em DOM, teclado e alternativa 2D; nenhuma informação depende só de animação |
| ST-09 | Datas históricas, origem MODIS, parâmetros didáticos e limites do NDVI continuam visíveis |
| ST-10 | Revisitar uma etapa permite experimentar; não cria recompensas repetidas nem apaga a conquista anterior |

## 10. Referências e alcance

O [Appendix S do NASA Systems Engineering Handbook](https://www.nasa.gov/reference/appendix-s-concept-of-operations-annotated-outline/) inspira a ligação entre necessidade, atores e operação. [My NASA Data — Building Claims from Evidence](https://mynasadata.larc.nasa.gov/lesson-plans/introduction-building-claims-evidence) informa a separação entre afirmação, evidência e raciocínio. A aplicação desses princípios à campanha, os personagens e as falas são autorais, sem endosso das instituições.

Consultas: **14/11/2026, America/Sao_Paulo**. O código do catálogo e do motor fornece a evidência dos números do jogo. O roteiro propõe uma experiência educativa; revisão humana, clareza com o público e transferência de aprendizagem permanecem pendentes de pesquisa. O [PRD](PRD.md) define o produto e [INSIGHTS-E-OPORTUNIDADES](INSIGHTS-E-OPORTUNIDADES.md) registra hipóteses de evolução.
