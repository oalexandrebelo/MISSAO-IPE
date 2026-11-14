# Frente 4 — Motor determinístico, catálogo e prova finita

Implementação específica de P&D realizada em 14/11/2026, antes das 09h BRT do evento. O benchmark foi executado às **08:46:05 UTC / 05:46:05 BRT**. Este código não estabelece elegibilidade NASA, não é calibração de hardware e não deve ser apresentado como produção realizada durante a janela do hackathon.

## Entrega e domínio

Foram implementados `src/core/catalog.ts`, `engine.ts`, `science.ts`, `search.ts`, os auxiliares `exact.ts`/`power.ts` e `tests/engine.test.mts`. `contracts.ts` permaneceu sob propriedade da coordenação, sem alteração nesta frente. A API pública é a prevista no contrato. O catálogo também exporta `BASE_MASS_KG`, `BASE_CREDITS`, `getConfigTotals` e `PHYSICS` para impedir cópias divergentes na interface.

O domínio jogável permanece fechado: seis escolhas binárias, 64 tuplas, dois cenários, seis registros MOD13Q1 de arquivo, 10.800 s de relógio fictício. `simulateMission` é o único ponto de execução usado por busca, interface e replay. `simulateMissionModel` e `evaluateConfigurations` são pontos internos para contraprovas de teste; não acrescentam cenários ou dados importáveis ao produto.

Todos os números propostos para massa, créditos, potência, energia, taxa e memória foram mantidos. O padrão foi explicitado como `small/standard/bands/economy/large/every-contact`. **O painel padrão precisa ser standard**, pois BANDAS com painel compact requer `(26 − 6,6)/0,95 = 20,42105263157895 W` na bateria pequena, acima de 20 W. Com standard, a exigência é `322/19 W ≈ 16,947368421 W`. A memória grande acomoda os seis lotes de 180 Mbit antes do primeiro contato.

## Regras executadas

As janelas são intervalos `[início,fim)`. O motor conclui o intervalo anterior, contabiliza a última recepção e o fim de trabalho, depois aplica as mudanças de luz/contato e inicia o próximo modo. Um último bit recebido exatamente no fim do contato conta. Um lote só surge após todos os 60 s de trabalho. A fila é FIFO; pode transmitir um lote parcialmente entre contatos; falta de espaço descarta o lote novo inteiro. A fila vazia muda imediatamente o consumo de rádio para os 8 W de espera.

As cargas de 26/38/16/26 W são **totais**, já incluindo a base. O fator solar é 55% durante trabalho e 85% nos outros modos. Nos dois cenários, todos os contatos ocorrem em eclipse. A entrada de carga é limitada a 10 W; a eficiência é 95% tanto na carga quanto na descarga. O pico compara a potência retirada **da bateria**, `(carga − solar)/0,95`, com seu limite. A violação é terminal e interrompe produção e transmissão posteriores. Energia zero também encerra a operação. A reserva é inclusiva: energia igual à reserva atende; continuar a descarga abaixo dela registra falha e preserva o restante do trace.

Massa e orçamento são verificados separadamente, sem encerrar a avaliação na primeira restrição. Tuplas que violam ambos registram ambos. Sua trajetória física também é calculada para diagnóstico, mas o resultado continua `invalid` mesmo quando os seis dados chegam ao solo. Entradas fora do catálogo ou cenários desconhecidos falham explicitamente; não são convertidos silenciosamente em uma opção padrão.

## Aritmética e conservação

Relógio, energia, fluxos de potência e fração de bit usam frações BigInt reduzidas por MDC. Exemplos efetivamente usados: eficiência `19/20`, energia inicial pequena `64/5 Wh`, solar standard em espera `153/10 W`, solar standard em trabalho `99/10 W`, carga química em espera `1387/200 W` e descarga BANDAS `322/19 W`. A primeira saturação do baseline ocorre em `60111540/26353 s`, exposta como `2281,013167381323 s`. Não há passo de frame nem epsilon de sucesso.

Os contadores inteiros de bits são verificados como números seguros. Totais e observações são serializados como strings decimais; `TracePoint` conserva números seguros conforme o contrato. Nenhum BigInt sai no resultado JSON. O ledger verifica exatamente:

`energia inicial + solar − carga − perdas de conversão − descarte − energia final = 0`

`bits gerados = bits recebidos + bits perdidos + bits na fila`

O residual interno de energia foi zero nas 128 combinações testadas. Os valores finais de energia são convertidos a Number apenas para o contrato externo; o recálculo do balanço a partir desses valores pode mostrar arredondamento IEEE. O teste desse arredondamento não altera a classificação. A repetição foi verificada neste runtime; não se promete equivalência bit a bit entre motores JavaScript distintos.

## Ciência e contraprovas

A interpretação de campos segue o [guia primário MOD13 C6.1](https://modis-land.gsfc.nasa.gov/pdf/MOD13_User_Guide_V61.pdf), tabelas 1, 4 e 5, consultado nesta frente. A seleção é política didática declarada: MODLAND 0; usefulness 0/1/2; aerosol 0/1/2; reliability 0; classe de terra 1; rejeição de nuvem adjacente, nuvem mista, neve/gelo e sombra. Não se chama o pack de qualidade máxima.

As duas representações usam `(NIR−RED)/(NIR+RED)`, as mesmas máscaras e a mesma pergunta. Os inteiros de reflectância devem estar entre 0 e 10.000; escala 0,0001 e offset zero são fixos. Fill, denominador zero e valores não finitos resultam em `ndvi:null`, nunca zero substituto. Há verificação da data selecionada dentro do composto e coerência da data MODIS.

A concordância com NDVI publicado usa a quantização explícita do pack: truncamento para inteiro de escala 10.000 e aceitação das representações IEEE de multiplicar/dividir pela escala. Isso valida estes seis registros, não oferece um limiar universal de acurácia MODIS. Um payload integralmente recebido com QA adulterado entrega zero registros científicos válidos. EVI não foi introduzido no objetivo.

## Resultados reais da enumeração

| Cenário | Avaliadas | Sucessos | Falhas | Inválidas | Indeterminadas | Distância mínima ao padrão |
|---|---:|---:|---:|---:|---:|---:|
| long-contact | 64 | 17 | 41 | 6 | 0 | 0 |
| short-contact | 64 | 9 | 49 | 6 | 0 | 2 |

| Projeto / caso | Resultado | Recebidos | Registros válidos | Energia final |
|---|---|---:|---:|---:|
| Padrão, contato longo | sucesso | 1.080.000.000 bits | 6/6 | 8,414868421052631 Wh |
| Padrão, contato curto | falha de entrega | 460.800.000 bits | 2/6 | 9,923640350877193 Wh |
| Somente ÍNDICE, contato curto | pico terminal em 600 s | 0 bits | 0/6 | execução interrompida |
| Somente rádio rápido, contato curto | pico terminal em 5.400 s | 0 bits | 0/6 | execução interrompida |
| Bateria grande + ÍNDICE, contato curto | sucesso | 360.000.000 bits | 6/6 | 18,169254385964912 Wh |
| Bateria grande + rádio rápido, contato curto | inválido por massa | 1.080.000.000 bits | 6/6 | 16,678026315789474 Wh |

A única testemunha de distância 2 no contato curto é **bateria large + processamento index**, mantendo painel standard, rádio economy, buffer large e every-contact. Custa 84 créditos e pesa 3,5 kg. Bateria large + rádio fast pesa 3,7 kg, excedendo 3,6 kg, apesar de transmitir todos os dados. Os sete projetos de distância 0 ou 1 foram avaliados e nenhum teve sucesso curto. Essa é uma prova finita relativa a estas versões, este catálogo e este objetivo; não é otimização de todas as arquiteturas espaciais possíveis.

A busca não para ao achar uma testemunha. A ordem reversa produz o mesmo resultado. Uma avaliação que lança erro, uma lista incompleta ou uma tupla repetida remove `complete`, `minimumDistance` e `best`; não conserva um selo anterior. A execução síncrona não oferece cancelamento interno. O cancelamento/descartamento de respostas de Worker deve continuar sob controle da coordenação, sem publicar resultados de uma solicitação anterior.

## Verificação e medição

Foram aprovados **22 testes próprios do motor**. Eles cobrem 64×2 ledgers; limites seguros; fila parcial e descarte atômico; pico terminal; igualdade da reserva; continuidade após violação de reserva; energia zero; saturação; carga máxima; fim de trabalho no início do contato; último bit no fim da janela; interrupção durante transmissão; política de último contato; QA e metadados adversariais; mesma ciência nas duas rotas; prova mínima; erro e incompletude; repetição e supressão de trace.

Fixtures fora do catálogo exercitam limites não alcançados pelas condições jogáveis. Em eclipse contínuo, a bateria pequena toca a reserva em **4.446 s** sem falhar se o horizonte termina ali, e esgota em **5.472 s** sem energia negativa. Uma interrupção durante TX termina em **5.356,125 s**, com **52.920.000 bits** recebidos e **127.080.000 bits** ainda na fila. Uma entrada solar sintética de 30 W e carga de 8 W aceita 10 W no carregador, armazena 9,5 W, perde 0,5 W e descarta 12 W. Essas fixtures são testes do núcleo, não novos fatos de missão.

`npx tsc --noEmit` passou. A execução integrada `npm test` feita nesta frente após os testes próprios aprovou **43/43 testes**, incluindo os testes da frente de persistência e replay disponíveis naquele momento. Nenhum teste de integração foi editado por esta frente.

Medição local em Node **v24.22.1**, CPU **AMD EPYC 9V45 96-Core Processor**, às 08:46:05 UTC: dez aquecimentos e cem chamadas completas de `searchCatalog(DEFAULT_CONFIG,'short-contact')`, cada uma calculando as 64 tuplas. Mínimo **3,927 ms**, mediana **4,201 ms**, p95 **7,879 ms**, máximo **20,041 ms**. Isso mede o núcleo nesse executor e não prevê latência de interface, navegador, dispositivo móvel ou acesso a disco.

## Limites mantidos

O modelo não estima link budget RF, apontamento orbital real, degradação térmica, envelhecimento de bateria, codificação/FEC, perdas de pacote, retransmissões ou tamanho físico dos arquivos MODIS. As taxas representam serviço útil assumido. Volumes de 60/180 Mbit são cargas lógicas didáticas; não provêm dos bytes dos seis JSONs. O CubeSat fictício não adquire os dados MODIS históricos em 180 minutos. A política de QA e a quantização são fixas para esta amostra. A prova do catálogo não mede aprendizagem nem constitui certificação NASA. Nenhuma implementação de UI, persistência, configuração de build ou documentação geral foi alterada nesta frente.

## Correção posterior da revisão independente — engine0.1.1-rd

A frente7 reproduziu um desacordo entre a primeira implementação e o contrato: exigir truncamento do NDVI rejeitava produtos que satisfaziam a tolerância científica declarada de0,0001. O guia documenta escala e tipo, mas não fundamenta esse algoritmo de truncamento. A coordenação corrigiu somente a comparação de concordância para `abs((NIR−RED)*10000−produtoInteiro*(NIR+RED)) <= NIR+RED`, mantendo a quantização do campo armazenado separada. A versão do motor mudou de0.1.0-rd para0.1.1-rd; catálogo e dados não mudaram. O achado e o teste vermelho anterior permanecem em `evidence/adversarial-review.json`. As contagens e benchmarks acima descrevem a execução inicial desta frente; o recibo final da rodada registra a verificação após a correção.
