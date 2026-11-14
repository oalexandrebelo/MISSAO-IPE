# 05 — Cronograma, responsabilidades e passagem de etapa

**Calendário de referência: Rio Verde, UTC−03.** A orientação global situa o início às 09h de 14/11/2026. A agenda local indexada indica entrega às 17h de 15/11 e apresentações às 18h; o formulário global aparece aberto até 23h59. O corte operacional é 17h, sujeito à confirmação no evento. Não usar o horário global mais tarde para ignorar um corte local. Fontes: [GO Team](https://github.com/nasa/spaceapps/discussions/1827), [Rio Verde](https://www.spaceappschallenge.org/2026/local-events/rio-verde/).

## 1. Gate de elegibilidade e estado atual

O protótipo e as especificações desta rodada foram iniciados antes da abertura local. Esse material já existe e não deve ser apresentado como produzido apenas depois das 09h. A resposta oficial sobre a possibilidade de aproveitamento é um gate de candidatura. Enquanto não houver confirmação, ele pode ser estudado e revisado como P&D, sem alegar autorização competitiva. Recriar uma solução a partir de especificações antecipadas não deve ser apresentado como exceção automaticamente válida.

A segunda verificação inicial é conferir o Resources oficial e vincular uma fonte qualificada a uma decisão substancial do jogo. O terceiro gate é registro/composição da equipe no evento e acesso ao formulário real. Não foram efetuados inscrição, envio, publicação ou contato externo em nome de AB.

## 2. Sequência operacional para a equipe

O calendário abaixo é um plano para desenvolvimento permitido na janela oficial ou para continuação de P&D identificada como tal. A aprovação de uso do material anterior não é presumida.

| Janela BRT | Frente principal | Entrega verificável | Regra para avançar |
|---|---|---|---|
| 14/11, 09h–10h | AB + ciência | Elegibilidade, brief, Resources e compromisso de escopo | Registrar autoridade e decisão; não inventar autorização. |
| 10h–12h | Ciência + motor | Contrato de uma missão, dados e oráculos | Origem, unidades, QA e semântica de fronteira resolvidos. |
| 12h–15h | Engenharia | Motor, busca e recibo | Dois casos contrastantes, contabilidade e importação adversarial passam. |
| 15h–18h | Produto + frontend | Jornada navegável, fallback 2D e transferência | Uma tarefa completa sem ajuda indevida; entrada/resultado sempre coerentes. |
| 18h–20h | QA no equipamento | Ensaio local sem WAN, WebGL/fallback, armazenamento, exportação | Registrar navegador e hardware reais; nenhum erro fatal. |
| 20h–21h | UX Research | Até dois pilotos | Corrigir instruções e bloqueios, preservar registros do piloto. |
| 15/11, 08h–10h | UX + facilitador | Seis sessões formativas, se houver participantes | Consentimento apropriado, ausência de dados pessoais desnecessários; relatar falhas. |
| 10h–12h | Integração | Correções prioritárias e nova regressão | Corrigir defeitos; congelar funcionalidades adicionais. |
| 12h–14h | AB + narrativa | Texto em inglês e demo compacta | Toda afirmação aponta dado, execução ou observação; limites claros. |
| 14h–15h30 | Revisão cruzada | Pacote, licenças, declaração de IA, links acessíveis | Verificar na máquina limpa e no formulário efetivo. |
| 15h30–16h | Equipe | Pré-apresentação local, conforme agenda | Incorporar só correções indispensáveis. |
| 16h–16h30 | Responsável humano | Conferência final e envio | Elegibilidade e campos confirmados; equipe assume o envio. |
| 16h30–17h | Contingência | Recibo de submissão e backup | Sem funções novas; preservar versão apresentada. |

O calendário não é um relatório de atividades realizadas nem reserva a disponibilidade das pessoas. O trabalho de dez agentes de pesquisa não substitui a equipe humana inscrita, e não acrescenta dez membros à competição.

## 3. Responsabilidades humanas por função

AB coordena produto, priorização e narrativa, coerentemente com o perfil informado. As demais funções precisam ser distribuídas entre pessoas disponíveis: ciência/procedência, motor/testes, frontend/3D, validação com usuários e preparação da submissão. Uma pessoa pode acumular funções; a revisão cruzada de ciência e código deve permanecer independente quando possível. Não atribuímos nomes ou formações não informados.

A pessoa que desenvolve uma regra não é sua única verificadora. A pessoa que conduz a sessão não deve ensinar a resposta antes de registrar a primeira decisão. A pessoa que grava a demo precisa usar o build congelado, e não uma animação com números escolhidos à mão.

## 4. Política de escopo

Às 12h de domingo, congelar novas funcionalidades. Se a tarefa central tiver defeito, corrigir esse defeito antes de acrescentar EVI, IA, novos mapas, áudio, multiplayer ou banco relacional. O jogo pode explicar limites do modelo sem adicionar um subsistema que a equipe não consegue conferir.

Cortes previstos: remover efeitos gráficos antes de reduzir a validade dos dados; reduzir número de telas auxiliares antes de remover diagnóstico; retirar um módulo de IA experimental antes de torná-lo obrigatório; manter texto inglês e fontes mesmo quando o vídeo precisa ser mais simples. O motor, a reexecução e a atribuição são requisitos do recorte escolhido.

## 5. Continuação após o evento ou como P&D

| Etapa | Duração planejada | Gate |
|---|---|---|
| Compatibilidade/hardware | 1 dia | Chromium/Firefox/Safari reais; versão portátil e servidor local; medições sem promessas transferidas. |
| Ajuste pedagógico | 2 dias | Taxonomia de erros formada por observações, não inventada por modelo. |
| EVI3 e informação preservada | 2–3 dias | Novo contrato e volume explícito de BLUE; oráculo e casos negativos. |
| Modelos compactos | 3–5 dias de avaliação | Corpus revisado, split fechado, ablações, calibração, cobertura/erro, latência e memória. |
| Robustez finita | 2 dias | Grade versionada e todas as combinações conferidas; nenhuma taxa tratada como probabilidade física. |
| Pacote orbital de referência | 3–5 dias | Efemérides/agenda verificadas, kernels/dados versionados, comparação com referencial. |

Os prazos são estimativas de planejamento para o recorte descrito, não compromissos de equipe ou serviços externos. Um gate reprovado reabre a etapa; o prazo não torna um resultado verdadeiro.
