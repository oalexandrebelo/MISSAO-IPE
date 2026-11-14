# 02 — PRD: Missão Ipê — Ciência que chega

**Product Requirements Document · versão 0.1 de P&D · contrato ipe-64-v1.** Uso pretendido: educação em decisões de missão; não planejamento operacional de voo. Documento produzido antes do início local oficial; elegibilidade de uso na competição não estabelecida.

## 1. Problema, público e tarefa

Um iniciante consegue reconhecer bateria, painel e antena, mas pode tratar cada escolha como uma melhoria independente. O problema de produto é permitir que ele observe um compromisso entre recursos: reduzir o volume transmitido exige processamento; aumentar a taxa de transmissão exige potência; escolher peças maiores pode ultrapassar o envelope de lançamento. A evidência de compreensão exige a pessoa justificar uma decisão sob uma condição diferente, não somente alcançar o estado verde.

Público inicial para validação: estudantes e visitantes de formação heterogênea em uma sessão acompanhada por educador ou facilitador. Não foi recrutada uma amostra nesta rodada. Não se presume idade, deficiência, escolaridade ou domínio de inglês dos participantes. A interface de pesquisa é pt-BR; a versão em inglês permanece tarefa de preparação da submissão, com revisão humana dos termos científicos.

Tarefa principal: entregar seis resultados NDVI utilizáveis ao solo dentro da missão simulada, preservando todos os limites do cenário. Meta de duração: oito minutos por ciclo introdutório. Essa duração é uma hipótese de UX, ainda não uma medição.

## 2. Fronteira funcional

P0 tem uma missão e duas condições de contato. O objetivo científico e o pacote de dados permanecem iguais. O lançador e o perfil orbital são fixos e declarados. As seis escolhas disponíveis são bateria, painel, representação/processamento, rádio, armazenamento e política de contato. O escopo não equivale a selecionar todos os subsistemas e destinos de uma missão real. A adequação integral ao enunciado oficial ainda precisa da leitura dos Resources e do brief integral.

A pergunta científica é calcular NDVI nos seis registros de arquivo MOD13Q1 selecionados para três coordenadas solicitadas no entorno de Rio Verde, em duas composições temporais de 2024. A nave didática não adquire fisicamente esses pixels em 180 minutos. O volume lógico de cada lote é uma hipótese de missão e não o tamanho dos JSONs empacotados.

| Escolha | Opção 1 | Opção 2 | Consequência que o jogo deve tornar inspecionável |
|---|---|---|---|
| Bateria | 16 Wh, até 20 W de descarga | 24 Wh, até 35 W | Energia armazenada e potência instantânea são limites distintos. |
| Painel | 12 W nominal | 18 W nominal | O painel nominal recebe fatores de orientação/iluminação do cenário. |
| Processamento | BANDAS R/NIR, 180 Mbit/lote, 26 W totais | ÍNDICE NDVI, 60 Mbit/lote, 38 W totais | Menor payload aumenta a demanda durante o trabalho. |
| Rádio | 0,96 Mbit/s, 16 W totais | 2,4 Mbit/s, 26 W totais | Taxa e energia/potência mudam juntas. |
| Armazenamento | 512 Mbit | 1.536 Mbit | Lotes completos disputam espaço antes do contato. |
| Política | Todos os contatos | Somente o último | Uma capacidade técnica não utilizada pela política não entrega ciência. |

Os números são hipóteses didáticas versionadas, não parâmetros atribuídos a MODIS, Terra ou um fornecedor de CubeSat. As massas/créditos ficam no catálogo executável. A capacidade total é limitada a 3,6 kg e 86 créditos, incluindo base fixa de 1,2 kg/20 créditos. Não exibir o maior valor de todas as peças como solução automaticamente válida.

## 3. Jornada e telas

### Observatório

A primeira tela apresenta o pedido científico, a origem dos registros, as duas condições e um diorama procedural. O usuário pode escolher por botão HTML; clicar numa forma 3D nunca é o único acesso. “Contatos longos” introduz o ciclo; “Contatos curtos” funciona como transferência próxima. A Terra, o satélite e os arcos são representação explicativa, sem claim de efemérides ou geometria orbital calculada.

### Bancada de projeto

As seis decisões mostram parâmetros, massa e créditos. A configuração padrão é bateria de 16 Wh, painel de 18 W, BANDAS R/NIR, rádio econômico, armazenamento grande e todos os contatos. Antes da primeira execução de cada condição, registrar uma previsão do gargalo. As hipóteses não podem ser alteradas por texto livre, e o usuário não edita números físicos arbitrários nesta versão.

A previsão é evidência de interação da pessoa, não dado NASA. Não registrar nome, email, CPF ou identificador externo. O diário local deve ser exportado deliberadamente, com aviso de que textos livres podem conter informações pessoais. Nenhum detector de PII é presumido instalado. Esse aviso é pertinente ao conteúdo efetivamente exportado e não uma promessa regulatória.

### Sala de missão e debrief

A simulação produz o resultado independentemente da câmera e da taxa de quadros. A linha do tempo lê o trace já calculado; avançar, pausar ou arrastar o marcador não altera a física. A tela mostra resultados entregues, reserva, fila, balanço energético e eventos. Selecionar um evento revela regra, instante e valores. Distinguir lote parcialmente transmitido de registro científico utilizável.

O usuário volta à bancada para redesenhar. A busca oferece a menor quantidade de escolhas alteradas dentro das 64 configurações e da condição fixada, somente após uma tentativa própria. O caso curto bloqueia ajuda antes da primeira execução. Aplicar uma sugestão cria nova entrada; não edita retrospectivamente uma execução já salva. Empates, quando houver, precisam permanecer visíveis.

## 4. Requisitos funcionais e critérios de aceite

| ID | Requisito | Aceite verificável |
|---|---|---|
| PRD-01 | Selecionar condição com objetivo fixo | IDs e dados iguais; apenas janelas de contato diferem. |
| PRD-02 | Configurar seis escolhas | Exatamente 64 tuplas; escolhas desconhecidas rejeitadas. |
| PRD-03 | Ver envelope antes de executar | Total de massa/créditos corresponde ao catálogo versionado. |
| PRD-04 | Registrar previsão | Primeira execução de cada condição exige uma previsão não vazia. |
| PRD-05 | Executar motor único | UI, busca e reexecução importam a mesma função de simulação. |
| PRD-06 | Mostrar ciência recebida | Só registro inteiro, com QA aceito e NDVI verificado, conta. |
| PRD-07 | Inspecionar diagnóstico | Evento e regra existem no resultado; valores não vêm de um LLM. |
| PRD-08 | Buscar redesenho | Mínimo só aparece após enumeração completa sem indeterminados. |
| PRD-09 | Proteger transferência | Ajuda indisponível antes da primeira tentativa no caso curto. |
| PRD-10 | Salvar localmente | Commit IndexedDB concluído antes da confirmação; falha não apaga o resultado em tela. |
| PRD-11 | Exportar/importar recibo | Importação estrita, versões compatíveis e reexecução; claim e resultado distinguíveis. |
| PRD-12 | Operar sem serviço externo | Dados, bibliotecas e assets compilados localmente; não existe chamada de inferência/API no caminho de execução. |
| PRD-13 | Alternativa 2D | Seleção, configuração, execução e debrief disponíveis sem WebGL. |
| PRD-14 | Preservar contexto de pesquisa | Datas dos dados e simulação distintas; hipótese física não recebe atribuição NASA. |
| PRD-15 | Evitar resultado obsoleto | Mudar entrada invalida resultado/busca e cancela trabalho pendente. |

O documento de verificação registra quais desses aceites foram executados em Node, DOM de teste ou navegador. Um checkbox nesta especificação não é recibo de teste.

## 5. Vitória, falha e experiência de erro

Vitória exige simultaneamente: envelope estático admissível; conclusão do horizonte; nenhuma violação operacional; seis registros esperados inteiros recebidos e cientificamente utilizáveis. Missão inválida por massa/orçamento não se transforma em missão bem-sucedida porque alguma telemetria chegou. Falha de potência e esgotamento de energia interrompem a operação. Cruzar a reserva marca violação e preserva o trace. Buffer cheio perde o lote novo conforme política fixa do cenário.

Erro de software, timeout, cancelamento ou entrada inválida de replay nunca vira falha física nem vitória. O usuário recebe um estado de erro e pode repetir com a entrada preservada. Perder a cena WebGL mantém a interação HTML. Falhar um salvamento local mantém resultado e exportação; não prometer persistência que o navegador rejeitou.

## 6. Conteúdo, acessibilidade e imersão

A estética combina papel claro, carvão e âmbar de ipê, com números tabulares e rótulos visíveis. Cor reforça, mas não é a única informação de estado. Foco, labels, ordem de navegação, contraste e overflow exigem inspeção de navegador no equipamento real. O teste DOM só cobre parte disso. Redução de movimento interrompe animação contínua; a aba oculta não deve manter renderização desnecessária. A física não depende dessas otimizações.

A referência Kapsch é funcional: selecionar pontos espaciais e abrir informações contextualizadas. Não foram copiados os assets ou a identidade da empresa. O escopo usa Three.js procedural; não carrega cidade fotorrealista, terreno planetário global, áudio gerado ou catálogo de múltiplos planetas. Esses elementos ampliariam produção, licenças e tempo de carga antes de demonstrar a aprendizagem central.

## 7. Hipóteses e pesquisa com usuários

Hipótese H1: a inspeção de consequências ajuda o participante a distinguir energia de potência. H2: a pessoa transfere a relação processamento/comunicação para a condição curta sem abrir a solução. H3: a visualização permite localizar quando o problema ocorreu. H4: a missão cabe no tempo de demonstração previsto. Nenhuma hipótese foi confirmada por pessoas nesta rodada.

Protocolo: dois pilotos para corrigir instruções e seis sessões observadas; informar finalidade, evitar coleta pessoal e preservar erros/desistências. Pedir previsão, executar, solicitar explicação, mudar contato e registrar a primeira escolha antes da ajuda. Dois avaliadores classificam explicações por recurso limitante, mecanismo e justificativa da intervenção, documentando divergências. Isso é pesquisa formativa de compreensão imediata; não estima efeito causal, retenção ou generalização populacional.

Registrar tempo até primeira escolha, tempo por tarefa, ajuda solicitada, erros de interpretação, revisões de configuração e explicação final. Não otimizar uma taxa de conclusão sacrificando a dificuldade que revela o compromisso técnico. O objetivo não é forçar todas as pessoas a acertarem com o solver.

## 8. Evolução por gates

P1a: nova pergunta EVI3, com BLUE explicitamente transportada e política científica própria. P1b: conjunto finito de perturbações para comparar margens, sem chamar taxa na grade de probabilidade real. P1c: avaliação opcional de modelo compacto para escolher perguntas de acompanhamento, sem alterar pontuação. P1d: tradução integral e revisão terminológica em inglês.

P2: pacotes orbitais derivados de Orekit/Basilisk/SPICE, comparação com referência de maior fidelidade, criação de conteúdo por educadores e avaliação longitudinal. Cada incremento exige novo contrato, dados, oráculo, evidência e orçamento de desempenho. O primeiro núcleo não depende dessas entregas.
