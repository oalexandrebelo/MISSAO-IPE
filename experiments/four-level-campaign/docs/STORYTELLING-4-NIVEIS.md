# MISSÃO IPÊ — narrativa científica de quatro níveis

Versão editorial 1.1 · atualização R17 em 15/11/2026 · America/Sao_Paulo. Direção de produto: AB / Alexandre Belo; conteúdo e verificação do contrato com assistência de IA. Documento vigente da campanha. Os dados científicos são reais e históricos; as configurações, os contatos, os limites e os créditos pertencem ao exercício didático.

## 1. Arco da campanha

O instrumento MODIS, a bordo do satélite Terra da NASA, observa a vegetação terrestre. O produto MOD13Q1 V6.1 reúne índices de vegetação em períodos compostos de 16 dias e resolução de 250 m. A campanha usa um recorte de seis registros históricos de 2024: dois períodos em três pontos próximos a Rio Verde. O participante investiga como os valores de NDVI variam e quais decisões permitem que os dados necessários à comparação cheguem completos ao solo.

Os registros já existem no arquivo científico. O CubeSat é um modelo didático de processamento e transporte desses arquivos. A experiência progride de uma primeira entrega orientada para decisões de armazenamento, comunicação e uso de recursos; ela não recria a aquisição de dados pela missão Terra.

A história avança quando surge uma necessidade nova: compreender o caminho do dado; trabalhar com memória compacta; preservar bandas sob contatos curtos; e produzir a mesma entrega com folga de créditos. As necessidades são conhecidas antes da execução. Nenhum incidente exige uma falha aleatória, um desastre ambiental inventado ou uma recuperação que o motor não oferece.

**Pergunta científica:** como os valores de NDVI dos três pontos diferem entre os dois períodos efetivamente recebidos? **Meta operacional:** entregar 6/6 registros válidos e completos com todas as restrições satisfeitas. **Convite educativo:** explicar como uma escolha alterou o caminho dos dados até o solo.

As condições particulares dos níveis são escolhas pedagógicas da campanha. O envelope do motor permanece em 3,6 kg, 86 créditos e 180 minutos simulados. O nível 4 acrescenta uma meta de custo de 78 créditos; isso não altera retroativamente o teto de 86 créditos do motor.

## 2. Funções científicas e linguagem

| Função exercida pelo participante | Instrução do briefing | Função didática | Linguagem de orientação |
|---|---|---|---|
| Planejamento de missão | Defina a informação que precisa chegar | Relacionar finalidade, etapas e resultado | Uma pergunta concreta e um próximo passo claro |
| Engenharia de dados | Escolha o que processar e armazenar | Tornar visível o acúmulo na memória | Aponta volume, limite e instante, sem culpar o jogador |
| Operação de solo | Dimensione o caminho até a análise | Conectar requisito científico e comunicação | Explica por que a representação do dado importa neste exercício |
| Revisão de projeto e ciência | Defenda a decisão e os limites da conclusão | Pedir evidência, comparar folgas e limitar conclusões | Convida a defender uma escolha sem dar nota à pessoa |

Cada função é uma perspectiva de trabalho que o participante assume. Os briefings são instruções pedagógicas da MISSÃO IPÊ, sem falas atribuídas a pessoas ou equipes da NASA. O símbolo da árvore pertence à identidade da equipe; a progressão da campanha se fundamenta nas perguntas científicas e nos compromissos de engenharia.

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

**Função:** planejamento de missão. **Intenção pedagógica:** reconhecer que o valor científico depende de chegar ao solo com integridade e qualidade.

**Situação de aprendizagem:** examine o pacote histórico e o projeto inicial que já atende à operação simulada. A primeira tarefa é acompanhar o fluxo completo e entender por que ele funciona. A comparação entre dois períodos só fica disponível quando ambos os registros de um ponto chegam completos e válidos.

**Orientação ao participante:**

> Examine seis registros históricos Terra/MODIS de três pontos próximos a Rio Verde. Antes de interpretar a variação de NDVI, faça os pares chegarem completos. Acompanhe o caminho de cada lote até o solo.

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

**Transição:** o segundo exercício exige manter uma memória menor. Leve o raciocínio sobre volume e agenda para esse novo limite do modelo.

**Conceitos:** cadeia de dados; lote completo; tempo de contato; projeto versus operação; dados históricos versus simulação; primeira leitura de evidência.

## 5. Nível 2 — Memória em disputa

**Função:** engenharia de dados. **Intenção pedagógica:** investigar armazenamento antes do contato e perceber que reduzir volume exige uma decisão de processamento e potência.

**Situação de aprendizagem:** o novo exercício fixa a memória compacta de 512 Mbit. Mantidos os demais componentes iniciais, seis lotes de bandas não cabem antes do primeiro contato. Não é uma pane de fabricação: é uma incompatibilidade entre a agenda e o projeto.

**Orientação ao participante:**

> Neste exercício, a memória disponível é de 512 Mbit. Os trabalhos terminam antes do primeiro contato com o solo. Investigue como entregar todos os registros mantendo essa capacidade.

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

**Transição:** o próximo exercício exige receber as bandas para calcular NDVI no solo, com contatos menores. A solução aprendida continua válida para o exercício anterior; agora o requisito de representação mudou.

**Conceitos:** acúmulo antes do contato; perda de lote novo; processamento a bordo; representação de dados; potência instantânea versus energia; solução que depende do objetivo.

## 6. Nível 3 — Janela estreita

**Função:** operação de solo. **Intenção pedagógica:** coordenar comunicação, potência e envelope quando o pedido científico restringe uma alternativa.

**Situação de aprendizagem:** neste exercício, os contatos duram quatro minutos cada e a representação precisa permanecer em bandas. As janelas menores são uma condição do cenário anunciada no briefing, não uma estação que falha ao acaso.

**Orientação ao participante:**

> Preserve as bandas vermelha e infravermelha próxima para calcular o NDVI no solo. O cenário oferece dois contatos de quatro minutos. Revise o projeto para entregar os seis registros nesse tempo.

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

**Transição:** o exercício final permite receber o índice para responder à mesma pergunta sobre NDVI e exige oito créditos de folga. Escolha a representação conforme os requisitos e justifique a decisão usando o resultado da execução.

**Conceitos:** taxa e duração; recepção parcial; capacidade útil de contato; potência do rádio; compromissos de massa e orçamento; representação solicitada; comparação com múltiplas mudanças.

## 7. Nível 4 — Ciência que chega

**Função:** revisão de projeto e ciência. **Intenção pedagógica:** otimizar sob uma necessidade explícita, defender uma alternativa e reconhecer o limite do que os dados permitem afirmar.

**Situação de aprendizagem:** o projeto de partida já entrega 6/6 nos contatos curtos por 84 créditos. O novo pedido é reservar ao menos oito dos 86 créditos totais. A missão funciona; a pergunta agora é como atingir a mesma entrega usando no máximo 78 créditos.

**Orientação ao participante:**

> O projeto inicial já entrega todos os registros. Encontre uma configuração de até 78 créditos e mostre, no relatório, o que sustenta sua decisão. Descreva a diferença de NDVI dos pares recebidos e indique o limite dessa conclusão.

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

**Encerramento:** o participante examina os três pares recebidos, consulta as fontes e compara outra solução ou explora o laboratório. O resultado reúne decisões verificadas dentro do modelo e uma leitura descritiva dos dados. A conclusão da campanha não equivale a certificação de engenharia de voo ou classificação NASA.

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
| ST-01 | Os quatro níveis apresentam função científica, necessidade, objetivo mensurável, escolha, feedback, conclusão e transição |
| ST-02 | Cenário e restrição particular são anunciados antes da tentativa; nenhum requisito surge apenas no relatório |
| ST-03 | Feedback corresponde ao resultado da execução; a orientação pedagógica nunca substitui a evidência do motor |
| ST-04 | “Sucesso operacional” e “nível concluído” permanecem separados quando necessário |
| ST-05 | A ajuda não exige penalidade, não remove conclusão e respeita o pedido particular do nível |
| ST-06 | Reflexão tem caráter formativo; nenhuma heurística de texto produz uma alegação de compreensão |
| ST-07 | Progresso e mapa usam resultados executados, sem atribuir conclusão por visitar um cartão |
| ST-08 | Narrativa é utilizável em DOM, teclado e alternativa 2D; nenhuma informação depende só de animação |
| ST-09 | Datas históricas, origem MODIS, parâmetros didáticos e limites do NDVI continuam visíveis |
| ST-10 | Revisitar uma etapa permite experimentar; não cria recompensas repetidas nem apaga a conquista anterior |

## 10. Referências e alcance

A base científica é o [produto MOD13Q1 V6.1, NASA Earthdata](https://doi.org/10.5067/MODIS/MOD13Q1.061). A página [MODIS — missão Terra](https://terra.nasa.gov/about/terra-instruments/modis) explica o instrumento e suas observações da vegetação. Os seis registros usados no jogo, suas bandas, qualidade, coordenadas de consulta e hashes estão em `public/data/mod13q1-research-pack.json`; o contrato executável conserva esses dados em `src/data/science-data.ts`. O [MOD13 User Guide V6.1](https://modis-land.gsfc.nasa.gov/pdf/MOD13_User_Guide_V61.pdf) detalha produto e indicadores de qualidade.

O [Appendix S do NASA Systems Engineering Handbook](https://www.nasa.gov/reference/appendix-s-concept-of-operations-annotated-outline/) inspira a ligação entre necessidade, usuários e operação. [My NASA Data — Building Claims from Evidence](https://mynasadata.larc.nasa.gov/lesson-plans/introduction-building-claims-evidence) informa a separação entre afirmação, evidência e raciocínio. As funções, instruções e condições pedagógicas da campanha são uma adaptação autoral, sem endosso das instituições.

Referências pedagógicas consultadas em **14/11/2026**; produto MOD13Q1 e instrumento Terra/MODIS reconferidos em **15/11/2026, America/Sao_Paulo**. O código do catálogo e do motor fornece a evidência dos números do jogo. O roteiro propõe uma experiência educativa; revisão humana, clareza com o público e transferência de aprendizagem permanecem pendentes de pesquisa. O [PRD](PRD.md) define o produto e [INSIGHTS-E-OPORTUNIDADES](INSIGHTS-E-OPORTUNIDADES.md) registra hipóteses de evolução.
