# Sequência de missão no Rive · R26

Pulso Orbital, Eco Lunar e Horizonte Rubro usam a mesma sequência de decisão, lançamento, coleta e recepção. No hangar, a sequência marca a bancada. Durante a tentativa, o motor entrega os eventos à interface. No relatório, a mesma ilustração sinaliza o desfecho com um símbolo e uma legenda HTML.

## Autoria e exportação

O artboard **IpeMissionSequence**, de 680 × 224 px, foi desenhado no Rive.app 0.9.642 do MacBook Pro pelo MCP oficial. O desenho usa roxo `#905DC3`, amarelo `#ECA53C` e azul `#085D9D` como acentos do diagrama. Alexandre confirmou **End Prompt** na edição R26. O ID de revisão na nuvem permanece pendente de verificação. [Arquivo de autoria](https://editor.rive.app/file/untitled/2728718) · [Identidade visual](23-IDENTIDADE-VISUAL.md) · [MCP do Rive](https://rive.app/docs/editor/ai/mcp)

O editor exportou [`ipe-mission-sequence.riv`](https://nasa-missaoipe.alexandrebelo.com/lab/rive/ipe-mission-sequence.riv) com **20.637 bytes** e SHA-256 `e0a7c87f9ce5177402e3ca5d5223edf1796cc614512ce33e6f1c6c4fc4a2437f`. A exportação inclui o novo artboard como componente e o runtime o abre pelo nome. O binário R24 `ipe-subsystems.riv` conserva seu SHA-256 `103b0ce860cf3b696dc6d9eaea3603ca24922a54f85fd862cda188348d37e5db`. A consulta da máquina **IpeAssembly** no editor retornou os mesmos estados, transições e condições antes e depois da autoria. [Handoff R24](63-RIVE-E-HANDOFF-R24.md)

## Contrato com o jogo

O componente `MissionSequenceRive` recebe `stage` do jogo e aplica o número ao View Model **IpeMissionSignal**, instância **Default**, na máquina **IpeMissionFlow**. As sete condições dirigem transições de 180 ms e poses de 24 quadros a 60 fps.

| `stage` | Estado no editor | Entrada do jogo |
| --- | --- | --- |
| 0 | `Decision` | Configuração ou retorno ao hangar |
| 1 | `Launch` | Eventos de lançamento e transferência |
| 2 | `Acquisition` | Evento de coleta |
| 3 | `Downlink` | Evento da janela de recepção |
| 4 | `Complete` | Resultado concluído |
| 5 | `Incomplete` | Resultado incompleto |
| 6 | `Blocked` | Lançamento bloqueado |

A etapa de recepção identifica a janela de enlace. O total recebido e a quantidade de registros válidos vêm do relatório do motor. Pausar a operação mantém o evento atual. Avançar ou ir ao resultado usa a mesma tentativa calculada.

O runtime oficial `@rive-app/canvas@2.50.0` carrega o `.riv` e o WASM da própria origem. A janela inicial dá 3,2 segundos de avanço à abertura de marca e à primeira pose. As mudanças seguintes recebem até 0,65 segundo de avanço. O componente suspende a reprodução fora da área visível e conserva as etapas e o desfecho em HTML com movimento reduzido, sem Canvas2D ou em caso de falha do asset. [Runtime web do Rive](https://rive.app/docs/runtimes/web/web-js)

## Verificações locais

- O MCP validou a estrutura e a máquina percorreu `Decision → Launch → Acquisition → Downlink → Complete → Decision → Launch → Incomplete → Decision → Blocked → Decision`.
- No Chrome, o runtime oficial exibiu a abertura de marca, as sete poses e o retorno à decisão depois de repouso. O fluxo integrado foi conferido nas etapas de coleta e recepção.
- Dois testes de DOM exercitaram as etapas e os resultados em HTML com movimento reduzido e indisponibilidade de Canvas2D.
