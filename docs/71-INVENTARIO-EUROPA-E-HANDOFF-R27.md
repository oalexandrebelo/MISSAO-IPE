# R27 — loja, inventário, desgaste e Europa

## O que muda para o jogador

A MISSÃO IPÊ reúne sete missões. Cerrado, Bennu e Webb preservam os exercícios com arquivos científicos históricos. ISS, Lua, Marte e Europa formam a campanha de engenharia derivada da contribuição de Bruno, agora conectada à interface oficial, à nave 3D e à participação cadastrada.

O percurso é **Start → Nome → E-mail → missão → loja e montagem → comparação → lançamento → operação → relatório**. A pergunta científica vem antes da compra. Cada instrumento tem uma finalidade: comprar mais peças não garante responder melhor. A pessoa vê o que instalou, o custo da partida, a condição das unidades e por que um projeto consegue ou não entregar a evidência exigida.

A árvore IPÊ identifica a equipe. As perguntas e referências vêm das fontes NASA; personagens, descobertas e operações reais não são inventados. A simulação tem recursos, duração, créditos, massa e desgaste didáticos, identificados como tais. Não é um propagador de alta fidelidade nem telemetria de uma sonda em operação.

## Como apresentar Europa em dois minutos

1. Entre em **Europa · Oceano Silencioso** e leia a pergunta sobre gelo e composição da superfície.
2. Na loja, compre **MISE** e **REASON**. A carteira começa com 25 créditos virtuais; o par custa 16. MISE ocupa um espaço e REASON ocupa dois.
3. Use o lançador de maior capacidade, propulsão química, reserva ampliada, proteção reforçada e enlace direcional. Equipe as duas unidades: os módulos aparecem na nave e compõem massa, energia e dados do projeto.
4. Compare a montagem com apenas um instrumento e com os dois. O radar investiga estrutura; o espectrômetro investiga composição. O relatório explica a falta de uma das evidências, em vez de afirmar que se encontrou vida.
5. Lance e acompanhe os eventos, a peça destacada e os registros entregues. Uma partida válida custa dois créditos e consome um ciclo de cada unidade instalada. Concluir com sucesso rende oito créditos.
6. Volte à montagem: as mesmas unidades estão desgastadas. O consumo por registro cresce no modelo educativo. Repita a comparação ou substitua equipamentos e explique a decisão.

No motor local, esse plano com unidades novas produziu seis registros válidos e 92 pontos. Com enlace local, produziu seis e entregou dois válidos. Com um ciclo disponível em cada unidade, a coleta caiu para cinco registros válidos.

Os créditos da carteira são distintos do orçamento de engenharia da missão. O primeiro organiza compra e reutilização; o segundo representa a restrição do projeto. Nenhum deles é dinheiro real.

## O que se aprende

| Missão | Pergunta e decisão | Evidência de aprendizagem a observar |
| --- | --- | --- |
| Cerrado | Quais bandas chegam para comparar vegetação? Potência e energia têm papéis diferentes. | O jogador distingue W de Wh e identifica por que faltou um par de dados. |
| Bennu | Os registros medidos chegaram ao solo? A agenda de contato muda a entrega. | Explica a diferença entre produzir dados e recebê-los; consulta a fonte da medida. |
| Webb | A pergunta precisa de imagem ou espectro? | Justifica o instrumento e lê a incerteza dos bins, sem extrapolar a seleção. |
| ISS | Como transportar e operar um experimento de monitoramento do ar? | Relaciona carga científica, acesso orbital, energia e comunicação. |
| Lua | Como cruzar temperatura e indícios de hidrogênio na superfície? | Equipa Diviner e LEND e avalia energia e janela de enlace. |
| Marte | Como manter autonomia e enviar dados de longe? | Identifica o custo de proteção e a limitação do enlace. |
| Europa | O que radar e espectrometria revelam sobre gelo e superfície? | Combina duas evidências complementares e distingue habitabilidade de vida detectada. |

**Pontuação e testes automáticos não provam aprendizagem humana.** A banca pode observar previsão, decisão, resultado e justificativa. O painel separa tentativas, respostas, mudanças, inspeções e transações; não transforma uma compra em acerto educativo.

## Regras do inventário

- Carteira inicial: **25 créditos**; partida válida: **2**; conclusão bem-sucedida: **+8**.
- Há sete tipos de instrumento no catálogo. Cada compra cria uma unidade identificada no servidor, com durabilidade própria. Instrumentos adicionais ocupam espaço, acrescentam massa e consomem energia e banda. Cópias de um tipo atendem apenas à mesma grandeza.
- O conjunto equipado é reservado por missão. O lançador compacto oferece dois espaços e o de maior capacidade oferece quatro. A reserva verifica a disponibilidade da unidade, os espaços e a massa.
- A loja reembolsa o preço de uma unidade **nova e livre de reserva**.
- O desgaste acontece na partida válida, mesmo que a operação termine em falha ou seja cancelada. Um projeto bloqueado em T+0 não gasta crédito nem ciclo.
- A simulação guarda a condição **antes da partida**. O inventário recebe o desgaste; o replay e a pontuação usam a montagem congelada daquela tentativa.
- Quando acabam os ciclos, a unidade sai do estoque ativo. O histórico da partida continua no painel.
- A recompensa ocorre uma única vez, na conclusão bem-sucedida confirmada pelo servidor. Cancelar não gera recompensa nem devolve os ciclos consumidos.
- **Reiniciar carteira** volta para 25 créditos e remove estoque e reservas, após confirmação. Não apaga nome, participação, métricas, recibos ou tentativas. É bloqueado enquanto houver uma operação ativa.
- Loja e partida precisam de conexão. A interface mantém o pedido incerto para confirmar o mesmo recibo; não repete uma compra automaticamente com outro identificador.

## Ligação com o 3D

O projeto e a carga instalada alimentam a mesma simulação que produz os medidores e o relatório. Os módulos científicos têm geometrias distintas. Reserva de energia, proteção e antena aparecem na montagem. A comparação A/B deve explicar **qual configuração** está visível e não trocar o inventário real por uma hipótese silenciosamente.

O arquivo Rive R26 continua acompanhando os estados de montagem e operação. Os botões e explicações HTML permanecem utilizáveis sem manipular o canvas. Movimento reduzido, pausa e estado textual continuam necessários para acessibilidade. A validação em viewport móvel não substitui ensaio em Android e iPhone físicos nem avaliação com usuários de tecnologia assistiva.

O modelo oficial da **Europa Clipper**, de NASA VTAD, está disponível como referência visual por carregamento voluntário. São **35.706.144 bytes (aproximadamente 34 MiB)**: o jogo não deve baixá-lo automaticamente no celular. Ele não é a montagem modular nem prova que a configuração fictícia é a nave real. Procedência e hash: `experiments/mission-design-lab/public/models/nasa/manifest-r27.json`.

## Contrato entre os dois devs

### Dev 1 — regras, dados e métricas

- `src/lab/bruno-missions.ts`: catálogo, requisitos, simulação e resultados. O modelo `ipe-bruno-r27-v2` preserva a chave estrutural `payload` com o valor `targeted`. Os tipos e condições em `loadout` determinam a carga usada no cálculo.
- `src/lab/bruno-inventory.ts`: funções puras de comprar, devolver, equipar, lançar e reiniciar. Os IDs das unidades são criados pelo servidor.
- `server/metrics/inventory.mjs`: estado por participação, revisão, recibos idempotentes, operações ativas, recompensa e projeção dos eventos.
- `server/metrics/blob.mjs`: persistência privada. Leitura com ETag e escrita condicional com `x-if-match`; concorrência entre abas não pode vender, gastar ou premiar duas vezes.
- `dashboard/metrics.mjs`: agrega os eventos carregados e deduplica por versão, participação, tipo e ID. O detalhe da tentativa identifica a versão legada.

A API usa `GET /api/metrics?action=inventory&sessionId=...` e `POST /api/metrics` com `action: inventory-command`, `sessionId`, `requestId`, `expectedRevision` e `command`. Comandos: `buy`, `return`, `equip`, `launch`, `complete`, `cancel`, `reset`. O cliente não envia saldo, preço, desgaste, recompensa nem pontuação autoritativos.

Resposta: `snapshot` com revisão, inventário e tentativas; `receipt` com operação, ID estável e revisão; `attempt` quando aplicável. Conflitos retornam o estado atualizado. Reenvie um pedido incerto **com o mesmo conteúdo, requestId e expectedRevision**. Alterar o conteúdo sob o mesmo recibo gera conflito de idempotência.

O documento privado `r27/inventory/<participação>/state.json` guarda o estado e uma fila de projeção. O registro e a alteração do saldo são confirmados juntos. Uma nova leitura ou o reenvio do mesmo pedido retoma a projeção pendente. Os eventos projetados usam caminhos distintos dos eventos legados. O adaptador solicita expiração de 90 dias por objeto.

Clientes R25/R26 podem reenviar suas seis escolhas pelo endpoint antigo. O servidor recalcula com as regras antigas e marca `legacyInventory`; esses eventos não concedem saldo nem alteram o estoque R27. Europa e configurações v2 precisam passar pelo endpoint autoritativo. Essa compatibilidade evita perder uma fila antiga depois da atualização.

### Dev 2 — experiência, 3D e operação

- `src/ui/BrunoCampaign.tsx`: coordena escolhas, comparação, execução e relatório.
- `src/ui/BrunoEquipmentShop.tsx`: catálogo, estoque e ações explícitas de compra/equipamento/devolução.
- `src/ui/BrunoInventoryController.ts`: estado e comandos da participação, recuperação de resposta incerta e conflito entre abas.
- `src/ui/BrunoHangarScene.tsx` e `BrunoInstrumentMesh.tsx`: peças, condição e destaque ligados à configuração ativa.
- `src/metrics/inventory-client.ts`: contrato de transporte compartilhado com o backend.
- `GameShell.tsx`: sete missões, início e retomada. `PlayerMetrics.tsx`: sessão, armazenamento e progresso.

Os caminhos `src/...` acima são relativos a `experiments/mission-design-lab/`. Antes de mexer em um contrato, avise o outro dev e atualize os testes de ambos os lados. Não renomeie instrumentos persistidos nem altere resultados legados sem nova versão e migração explícita.

## Verificação e publicação

Execute `npm --prefix experiments/mission-design-lab test`, `npm --prefix experiments/mission-design-lab run test:ui`, `npm run test:metrics`, `npm run build:release` e `npm run test:beta`. A LP separada usa `npm --prefix apps/immersive-lp run build`.

No navegador: cadastro, compra, devolução, montagem, A/B, partida, cancelamento, conclusão, desgaste, retomada e reinício; repita em 390 px e 320 px. Confira foco, rolagem, explicações e peças visíveis. Na API de produção, confira repetição de recibo, concorrência, isolamento de participação e recusa de métricas forjadas. Use apenas participantes técnicos identificados como testes, não como pessoas reais.

O estado efetivamente verificado e os links dos deployments ficam em `PUBLICADO.md`. DNS configurado, testes locais, commit publicado e deploy validado são provas diferentes.

## Origem e fontes

- O snapshot de Bruno A Carvalho está em `contributions/bruno-figma/deploy-2026-11-15`, com origem em `fa18fd38439921f97286325b2bdf8c7545d7c776` e licença declarada como `null` no GitHub. A simulação, as métricas e a marca desta entrega são da MISSÃO IPÊ. [Contribuição de Bruno](https://github.com/bruno-assis-carvalho/missao-ipe-deploy/commit/fa18fd38439921f97286325b2bdf8c7545d7c776)
- [NASA · Europa Clipper, instrumentos](https://science.nasa.gov/mission/europa-clipper/spacecraft-instruments/): MISE, REASON e contexto do magnetômetro ECM. ECM é referência científica; não é anunciado como um oitavo instrumento jogável.
- A ficha OVIRS na loja indica sua afinidade com a ciência de Bennu. A expedição histórica de Bennu conserva sua seleção e seus registros próprios. [NASA Goddard · OVIRS](https://svs.gsfc.nasa.gov/12309/)
- [NASA · modelo 3D Europa Clipper](https://science.nasa.gov/resource/europa-clipper-3d-model/): crédito NASA Visualization Technology Applications and Development (VTAD).
- [NASA · uso de imagens e mídia](https://www.nasa.gov/nasa-brand-center/images-and-media/): preservar atribuição e evitar qualquer afirmação de endosso.

A NASA não endossa a MISSÃO IPÊ. As fontes oficiais sustentam os conceitos e os modelos creditados; créditos virtuais, ciclos de desgaste e pontuação são escolhas pedagógicas da equipe.
