# Missão Ipê · roteiro de fala PT / EN

Material de apoio para o protótipo de pesquisa 0.1.1-rd. O HTML principal está em português e contém notas em ambos os idiomas. A [copy inglesa integral dos sete quadros](PITCH_EN_7_SLIDES.md) é um documento separado, para preparar tradução/exportação. A aceitação de formato pelo formulário oficial e a elegibilidade do projeto continuam pendentes.

## Fala preparatória de aproximadamente 30 segundos · português

“Quanta ciência chega ao chão? No Missão Ipê, você equilibra energia, memória e comunicação para entregar seis resultados conferidos com dados NASA de arquivo. Contatos mais curtos reduzem a entrega a dois. Trocar só o processamento cria uma falha de potência. Bateria maior mais ÍNDICE recuperam seis resultados, com duas mudanças mínimas no catálogo. O protótipo torna essa decisão explicável. A elegibilidade para o evento permanece pendente.”

A duração depende da locução. Cronometrar o áudio final. Esse texto não estabelece a duração de pitch presencial de Rio Verde e não substitui a leitura do guia/formulário. Uma fala de 30 segundos não comporta operar todos os controles. Para vídeo, ensaiar uma sequência de resultados já calculados, preservando os rótulos de condição e status em cada cena.

## Preparation script of approximately 30 seconds · English

“How much science reaches the ground? In IPÊ, players balance power, storage and communications to deliver six results checked against archived NASA data. Shorter contacts reduce delivery to two. Changing processing alone creates a power failure. A larger battery plus INDEX restores all six, with two minimum changes in this catalog. The prototype makes that decision explainable. Event eligibility remains unresolved.”

Timing depends on delivery. Rehearse the final recording. This script does not establish the duration of the local Rio Verde stage presentation, confirm acceptance of interactive HTML, or resolve eligibility. Keep scenario labels and research status visible when recording the live result.

## Conversa local com demonstração · sequência sugerida

Esta sequência é um roteiro de facilitação, não uma duração observada com usuários. Reserve aproximadamente cinco a oito minutos e ajuste ao palco disponível. O cronômetro é opcional e não move os quadros.

| Quadro | Fala e ação em português | Speaking cue in English |
|---|---|---|
| 1. Quanta ciência chega? | “A missão tem um objetivo no solo: seis resultados utilizáveis.” Apresente a pergunta antes das peças. | “The mission has a goal on the ground: six usable results.” Start with the outcome. |
| 2. A missão termina no usuário | “São dados MOD13Q1 reais, de 2024. O jogo só conta recepção integral com QA e NDVI aceitos.” Clique nos segmentos se precisar explicar a cadeia. | “The records are real historical MOD13Q1 data. Only complete, quality-accepted and NDVI-verified records count.” |
| 3. Seis escolhas que se afetam | “Cada decisão tem duas opções. Temos 64 combinações, mas massa, créditos e potência limitam o projeto.” | “Six binary choices create 64 configurations, constrained by mass, credits and power.” |
| 4. A janela encurta | “A mesma base entrega 6/6 com contato longo e 2/6 com contato curto.” Peça uma hipótese antes de avançar. | “The same baseline delivers 6/6 with long contacts and 2/6 with short contacts.” Invite a redesign hypothesis. |
| 5. Demonstrador real | Execute **Base longa**, **Base curta**, **Só ÍNDICE**. “Menos bits exigem mais potência de processamento.” Mostre `PEAK_POWER` aos 600 s. Após o gate, execute **Duas mudanças**. | Run **Long baseline**, **Short baseline**, **INDEX only**. “Fewer bits demand more processing power.” Inspect the peak-power event, then run the two-change case. |
| 6. Menor redesenho | Execute **Enumerar 64 configurações**. “Duas mudanças são o mínimo neste catálogo. A única testemunha a essa distância é bateria grande mais ÍNDICE.” Mostre 9/49/6/0. | Run the catalog search. “Two changes are the minimum within this catalog. The unique witness at that distance is a larger battery plus INDEX.” Show the full classification. |
| 7. Resultado explicável | “O próximo passo é ensaiar no equipamento e observar pessoas. Aprendizagem e elegibilidade ainda precisam de evidência.” Abra o jogo se houver tempo. | “Next, we need hardware rehearsal and observed sessions. Learning and eligibility still need evidence.” Open the game when time permits. |

## O que observar durante a demo

1. A base curta falha por **entrega**, mantendo energia. O rádio recebe 460,8 Mbit, mas só dois lotes de 180 Mbit estão completos.
2. A troca isolada para ÍNDICE falha por **potência instantânea**, não por energia esgotada. O evento ocorre aos 600 s. A demanda na bateria é aproximadamente 29,58 W, contra limite de 20 W. A energia restante é aproximadamente 13,96 Wh.
3. A bateria grande mais ÍNDICE respeita massa e créditos. O resultado de 6/6 exige atender também às demais restrições.
4. O mínimo de alterações se refere ao catálogo fixo e ao cenário curto. Não é prova de projeto universalmente ótimo.
5. Selecionar uma célula da grade carrega um novo projeto pendente. **Executar configuração** recalcula o resultado. Mudar entrada limpa os números antigos.

## Apêndices para perguntas

| Apêndice | Quando abrir |
|---|---|
| A1 · Ciência | Distinguir arquivos MOD13, datas reais, QA, NDVI e simulação de 180 min. |
| A2 · Potência e energia | Explicar por que uma bateria com energia ainda pode falhar. |
| A3 · Arquitetura | Mostrar que jogo, busca, replay e apresentação compartilham o motor. |
| A4 · UX Research | Explicar a hipótese educativa e o plano de sessões ainda não realizado. |
| A5 · Evidências | Consultar testes, oráculo, benchmark e limites da AB-R3A. |
| A6 · Metodologia | Declarar cronologia, Resources, escopo, assistência de IA e elegibilidade. |
| A7 · Fontes | Abrir fontes primárias ou baixar os JSONs incorporados. |
| A8 · Uso local | Explicar controles, impressão, notas e dependências do pacote. |

## Respostas curtas que preservam o estado real

**“A NASA validou o jogo?”** Não. O jogo usa dados de arquivo e referências primárias identificadas. As hipóteses do motor são didáticas. Elegibilidade, Resources e qualificação de uso permanecem pendentes.

**“Isso mostra o Cerrado agora?”** Não. Os registros são de 2024. Três coordenadas não sustentam tendência regional, rendimento ou diagnóstico de lavoura.

**“O usuário aprendeu?”** Ainda não temos sessões com participantes. O núcleo e a jornada DOM têm recibos de teste. A aprendizagem é uma hipótese para pesquisa formativa.

**“O que a IA faz?”** Ajudou na pesquisa, código, narrativa e ilustrações. O runtime calcula regras determinísticas. Não existe chamada de inferência de IA que altere classificação, potência, bits ou NDVI.

**“Por que não Marte?”** A missão terrestre é a implementação funcional. Marte permanece expansão visual proposta, sem integração com o motor atual.

**“Seven slides means this is ready for global submission?”** No. The Portuguese HTML is a local presentation tool. English copy is supplied separately. Current guide/form requirements, official Resources and temporal eligibility still need confirmation.

**“Is the benchmark from AB’s machine?”** No. The archived p95 figures come from Node 24.22.1 on the AMD EPYC 9V45 executor and exclude interface, Worker transport, persistence and GPU.

Ao usar as notas durante a projeção, lembre que o painel é visível ao público e contém ajuda do facilitador. Feche-o antes de pedir uma hipótese ao participante.
