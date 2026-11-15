# R31 · Escolhas claras no hangar

O hangar ensina uma decisão por vez. O jogador identifica o sistema, escolhe uma opção, lê seu efeito previsto e inspeciona a montagem ou a agenda. A operação mostra o efeito calculado sobre a entrega. O resultado permite testar outra configuração para a mesma pergunta científica. [Sequência e contratos das sete missões](76-COCKPIT-SETE-MISSOES-E-HANDOFF-R30.md).

## Skills aplicadas

- **game-ui-ux.** Apliquei foco visível e ações explícitas de ida e volta entre a vista e a montagem. Os indicadores reagem ao plano selecionado. O texto dá acesso à escolha, aos limites e ao próximo controle em telas pequenas e no esquema 2D. [Arquivo da skill](https://github.com/gamedev-skills/awesome-gamedev-agent-skills/blob/c6ca6c41c839b68319ffc08430b99ab768debc32/skills/disciplines/game-ui-ux/SKILL.md).
- **level-design.** Apliquei a sequência de ensinar e experimentar antes de cobrar um resultado. A pendência de instrumentos mostra o caminho até compra, equipagem ou revisão dos encaixes. O plano A oferece um ponto de comparação, e o relatório devolve o jogador ao hangar para outro teste. [Arquivo da skill](https://github.com/gamedev-skills/awesome-gamedev-agent-skills/blob/c6ca6c41c839b68319ffc08430b99ab768debc32/skills/disciplines/level-design/SKILL.md).

A revisão de Bruno trouxe um teste que percorre os cinco destinos, da montagem à recompensa. A versão oficial também precisa provar pressupostos além do percurso de sucesso, como falta de encaixes, troca entre planos, tentativa incompleta e retomada após recarregar. [Teste de Bruno](https://github.com/bruno-assis-carvalho/missao-ipe-deploy/blob/891fe880d2e9b899431e80651e2e883be8f5afd8/tests/campaign-happy-path.spec.ts) · [Auditoria R31](78-AUDITORIA-BRUNO-E-INTEGRACAO-R31.md).

## O que observar ao mudar uma escolha

| Destino | Decisão para experimentar | Efeito para inspecionar |
| --- | --- | --- |
| ISS | Reforçar a proteção do monitor. | A peça ganha massa. Compare a previsão de registros válidos e a calibração no relatório. |
| Lua | Trocar a reserva de 360 para 640 Wh com LEND e Diviner. | O banco de bateria cresce. Compare a energia restante para coleta e o limite do enlace. |
| Marte | Selecionar um lançador de maior capacidade e rever a proteção. | Interprete massa transportada e capacidade antes de verificar a chegada prevista. |
| Europa | Prever três encaixes para REASON e MISE. | O hangar informa os instrumentos pendentes e a capacidade inicial de dois. Outro lançador abre espaço para equipar os dois. |
| Cerrado | Trocar de contato longo para curto. | A agenda muda de duas janelas de dez para duas de quatro minutos. Compare a fila e a entrega no replay. |
| Bennu | Escolher a câmera e mudar o tempo de contato com o solo. | Diferencie a peça de imagem dos horários de envio dos registros históricos. |
| Webb | Escolher o espectrômetro e revisar a duração da operação. | Veja a peça de espectrometria e confira quais janelas ainda cabem na agenda. |

## Verificação de interação

- Em 320 e 390 px, os nomes da carga pendente, a quantidade de encaixes e a primeira ação cabem na largura da coluna. A nave, as opções e seus indicadores podem ser alcançados por rolagem vertical.
- Nas quatro missões da campanha, abrir a referência NASA e depois alterar uma opção retorna à nave do plano B. O foco permanece na opção. **Ver esta escolha na nave** leva o foco à figura e **Ir às opções** volta ao sistema em foco. Para ver o plano anterior, use a ação explícita na comparação A/B.
- Com movimento reduzido, teclado ou WebGL indisponível, confirme que os controles HTML e o texto de efeito ainda permitem escolher, inspecionar e executar. A seleção e o foco se distinguem visualmente, e a Libras recebe os números da previsão em contexto.
- Após executar, confira a diferença entre registros produzidos, recebidos e válidos. Recarregue para conferir a tentativa confirmada e, onde aplicável, saldo e condição dos instrumentos. O dado publicado pela NASA e a origem do modelo ficam disponíveis nas respectivas fontes.
