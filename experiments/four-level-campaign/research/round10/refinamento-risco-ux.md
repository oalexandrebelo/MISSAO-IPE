# Refinamento de risco, garantia e UX — Missão Ipê

Pesquisa primária e revisão pontual de componentes em 14/11/2026. Este parecer propõe evolução didática da interface; não altera o checkout, o motor, o catálogo de 64 combinações ou o requisito de 6/6 registros válidos com todas as restrições atendidas. Não constitui classificação oficial de missão, conformidade com diretivas NASA ou homologação de voo.

**Prioridade imediata de implementação:** revisão prévia determinística de contato, memória e potência, apresentada como condições necessárias. Um teto de transmissão pode usar a duração das janelas permitidas pela política multiplicada pela taxa útil do catálogo: se for insuficiente para o volume necessário, há um impedimento; se for suficiente, energia, disponibilidade dos lotes e sequência ainda precisam ser simuladas. Para memória, capacidade menor que um lote é impeditiva, mas não é necessário guardar todos os dados da missão simultaneamente se há contatos intermediários. Para potência, comparar a demanda das operações relevantes com a descarga disponível sob as condições declaradas. **Passar nesses filtros não garante 6/6 nem estima probabilidade de sucesso.** Não criar um selo NASA nem substituir a execução do motor por esses filtros.

## 1. Achados prioritários

1. **NPR 8705.4B é a revisão publicada atualmente identificada no NODIS**, efetiva em 01/11/2024, com expiração indicada em 31/10/2032. Ela substituiu a revisão A. A comunicação da OSMA sobre planos para uma futura revisão C não equivale à publicação dessa revisão. [R01, R02, R14, R15]
2. **Classe de risco não é probabilidade de falha.** A classificação declara a tolerância dos responsáveis ao risco e orienta o nível de escrutínio e atividades de garantia. Um resultado do jogo também não estima confiabilidade de hardware. [R04]
3. **Classe D não significa ausência de segurança.** A diretiva diferencia expectativas de garantia, mas mantém requisitos institucionais que não variam com a classe. A abordagem é proporcional à missão, não uma autorização geral para desconsiderar segurança. [R06]
4. **A aplicabilidade precisa ser preservada.** A NPR 8705.4B se aplica a programas/projetos robóticos NASA geridos sob NPR 7120.5, inclusive cargas robóticas em veículos humanos. Não se aplica automaticamente a veículos humanos, sistemas de lançamento ou projetos sob NPR 7120.8. Estes últimos podem adotar objetivos do apêndice D. [R02]
5. **Há uma atualização importante em 7120.5:** a página da NPR 7120.5F, Change 4, orienta usar NID 7120.148. O PDF ainda mostra expiração em 09/12/2025, mas o catálogo oficial registra extensão até **01/08/2027**. Capa e catálogo devem ser citados juntos; não concluir que a NID expirou pela capa isolada. [R08–R10]
6. **Aprendizado e missão cumprida são resultados diferentes.** O jogo pode reconhecer uma investigação bem sustentada sem transformar 2/6 ou 4/6 em sucesso da campanha. A NPR 7120.8A oferece um paralelo útil: em pesquisa, demonstrar que uma hipótese não é viável pode ser um resultado válido, conforme o objetivo declarado. Isso não redefine os objetivos de uma missão operacional. [R13]

## 2. Versões e escopo confirmados

| Referência | Situação observada na fonte primária | Uso correto no projeto |
|---|---|---|
| NPR 8705.4B | NODIS: efetiva 01/11/2024; expira 31/10/2032. | Referência de classificação e planejamento de Safety and Mission Assurance — SMA. |
| NPR 7120.5F, Change 4 | NODIS: efetiva 03/08/2021; expira 03/02/2027. Página indica a NID 7120.148 para requisitos mais recentes. | Referência de gestão de programas/projetos de voo, considerada junto da diretiva interina. |
| NID 7120.148 | Efetiva 09/12/2024. Capa conserva 09/12/2025; catálogo NODIS estende a expiração a 01/08/2027. | Registrar a extensão e o documento-base; não ocultar a diferença de metadados. |
| NPR 7120.8A, revalidada com Change 5 | NODIS: efetiva 14/09/2018; expira 14/09/2028. | Referência de pesquisa e tecnologia, com limites de aplicabilidade próprios. |

Fontes: [R01, R08–R11, R15].

NPR 7120.8 não é uma versão simplificada livremente escolhida de 7120.5. Seu prefácio descreve circunstâncias nas quais atividades de pesquisa e tecnologia são geridas sob 7120.5, incluindo dependência direta de um programa de voo e outras condições. A decisão depende de governança e aplicabilidade; não decorre apenas de ser pequeno, educacional ou um CubeSat. [R12]

Para o beta independente, apresentar essas fontes como referências de engenharia e ensino. Não etiquetar a Missão Ipê como “NASA Classe D” por ser um CubeSat, ter custo didático baixo ou possuir poucas escolhas.

## 3. O que as classes A–D significam

| Classe na NPR 8705.4B | Tolerância descrita | Implicação para leitura didática |
|---|---|---|
| A | A menor tolerância, orientada por objetivos técnicos. | Exigir mais confiança e evidência não elimina todas as incertezas. |
| B | Baixa tolerância; objetivos técnicos predominam sobre restrições programáticas. | Comparar alternativas com expectativas de garantia adequadas à missão. |
| C | Tolerância moderada; objetivos técnicos ainda predominam. | Discutir quais objetivos precisam de evidência e quais limitações são aceitas. |
| D | Alta tolerância; restrições programáticas pesam mais. | A aceitação de risco precisa ser explícita; não equivale a desligar requisitos de segurança. |

O enquadramento é designado e documentado pela Mission Directorate, com justificativa, até o marco KDP B; não é calculado a partir de uma única característica. [R03]

O apêndice C trata prioridade, duração, complexidade e custo de ciclo de vida de forma conjunta. Seus exemplos mostram que duração curta não determina classe D e duração longa não determina classe A. Uma régua automática “massa/preço → classe NASA” ensinaria uma regra que a própria fonte rejeita. [R05]

A definição de risco combina **cenário que pode prejudicar um objetivo, sua possibilidade de ocorrência e suas consequências**, com consideração das incertezas. A possibilidade pode ser expressa qualitativa ou quantitativamente; a classificação A–D não fornece um percentual universal. [R04]

Consequências para a interface, por inferência de produto:

- Não mostrar “Classe D = 40% de chance de falha”, “Classe A = 99% de sucesso” ou “baixo risco” calculado somente por margem de bateria.
- A quantidade de configurações bem-sucedidas entre as 64 é uma contagem de alternativas discretas sob uma condição fixa, **não uma distribuição de falhas físicas**. Não convertê-la em “chance de sucesso da nave”.
- Margem de massa, saldo de créditos e energia acima da reserva são folgas calculadas; não são estimativas de confiabilidade, segurança ou robustez probabilística.
- Um limite violado no motor é um resultado da simulação sob suas hipóteses. Uma incerteza não modelada não deve receber verde por ausência de erro.

## 4. Garantia, evidência e revisão de prontidão

A revisão B organiza objetivos de garantia e admite abordagens apropriadas à missão. O apêndice D contempla confiabilidade, tolerância a falhas, verificação ambiental, cobertura de telemetria e gestão de riscos. A consideração de contingências e a análise de alternativas fazem parte desse contexto. Alguns objetivos institucionais, como proteção planetária, detritos orbitais e segurança nuclear, não são reduzidos por escolher uma classe de maior tolerância. [R06]

A Assurance Implementation Matrix — AIM — documenta objetivos, implementação planejada e abordagens alternativas, apoiando acordo inicial entre responsáveis. Ela não é apenas uma lista de caixas marcadas depois de construir o sistema. [R07] O capítulo 3 inclui operação e atividades pré-voo no planejamento de garantia e prevê apresentação das diferenças em relação ao plano nos marcos de revisão. [R03]

Na NID 7120.148, a revisão de prontidão para lançamento avalia sistemas de solo, hardware e software. A SMSR prepara gestores para decisões de prosseguir ou não em atividades significativas. [R09] **Aplicação didática proposta:** a revisão no hangar deve reunir objetivo, limites, evidências e pendências antes do ensaio; não emitir um certificado de prontidão real.

Uma decisão pedagógica pode ter quatro campos: “objetivo ameaçado”, “evidência observada”, “mudança proposta” e “como conferir”. O primeiro remete ao contrato da campanha; o segundo, a um evento ou resultado; os demais, ao próximo experimento. Isso torna o raciocínio revisável sem imitar toda a burocracia de um programa espacial.

## 5. Três melhorias mínimas para os componentes atuais

As propostas abaixo são incrementais. A leitura local confirmou que a UI já possui hipótese prévia, avisos de potência, eventos com critério/valor/limite, diário, comparação e mensagens contra atribuição causal indevida. Não é necessário reconstruir esses mecanismos.

### 1 — Revisão pré-voo didática com estado da evidência

**Onde:** `src/ui/Workbench.tsx`, no painel `project-dossier` existente.

**Mudança:** organizar a revisão em três grupos curtos e sempre identificados por texto:

| Grupo | Conteúdo usando dados existentes | Texto sugerido |
|---|---|---|
| Verificado nesta configuração | Massa, créditos e o aviso de pico já calculado. Mostrar valor e limite. | “Massa e orçamento conferidos. A execução ainda precisa verificar a entrega.” |
| A verificar na execução | Energia ao longo do tempo, memória, transmissão e recepção científica. | “A hipótese será confrontada com os eventos da missão.” |
| Fora deste modelo | Falhas aleatórias de hardware, radiação, redundância e confiabilidade. | “Esta simulação não estima probabilidade de falha.” |

O aviso atual `peakRisk` representa uma comparação de demanda com limite; apresentar “Demanda prevista acima do limite de descarga”, com `demandW` e `maxDischargeW`, é mais preciso do que sugerir uma probabilidade. Não produzir um estado global “apto ao voo” só porque massa e créditos cabem.

**Esforço mínimo:** apresentação, rótulos e estados derivados de `getConfigTotals`, cenário e catálogo existentes. Não antecipar uma execução silenciosa para revelar a solução antes da previsão do jogador. Não acrescentar caixas obrigatórias de “aceito o risco”. Uma troca de componente atualiza imediatamente os dados; execução antiga não é evidência válida para o projeto alterado.

**Critério de aceite:** uma configuração dentro do envelope ainda mostra pendências; uma fora do envelope mantém o caminho de verificação já existente e explica a restrição; nenhuma mudança de visual ou texto altera o resultado do motor.

### 2 — Distinguir operação nominal de ocorrência que exige investigação

**Onde:** `src/ui/MissionControl.tsx`, em `TRACE_MODES`, painel de eventos e evidência selecionada.

**Mudança:** acrescentar uma classificação descritiva dos eventos, sem modificar severidade ou lógica do motor:

| Evidência existente | Categoria de UI | Interpretação correta |
|---|---|---|
| Início/fim de luz ou contato, processamento, fila vazia | “Sequência prevista” | Eclipse e fim de contato fazem parte da agenda; não são automaticamente falhas. |
| `MASS_LIMIT`, `BUDGET_LIMIT` | “Restrição do projeto” | Uma incompatibilidade de configuração não é acidente em voo. |
| `PEAK_POWER`, `ENERGY_DEPLETED`, `RESERVE_BREACH`, `BUFFER_OVERFLOW` | “Limite registrado” | Investigar valor, limite, instante e efeitos registrados, preservando as diferenças entre aviso e erro. |
| `DELIVERY_SHORTFALL`, resultado global | “Objetivo não atendido” | A entrega final não identifica sozinha uma causa única. |

Acrescentar abaixo da evidência: “Qual ação você testaria na próxima tentativa?”. O botão já existente de localizar na linha do tempo e a reflexão vinculada a `eventId` continuam sendo o caminho de investigação.

**Limite fundamental:** o motor atual tem `idle`, `processing`, `transmitting`, `terminated` e `complete`; não há um modo operacional de contingência/autorreparo demonstrado. Não renomear `terminated` para “modo seguro”, não animar recuperação inexistente e não chamar o cenário de contato curto de falha aleatória. No beta, a resposta a uma ocorrência é a investigação e o redesign de uma nova tentativa.

**Esforço mínimo:** mapa estático de descrições por código e microtexto. Preservar mensagens, valores, regras e cores já vinculadas à severidade.

**Critério de aceite:** o jogador distingue um eclipse previsto de energia esgotada e sabe se está inspecionando uma execução encerrada ou preparando outra. Pausa/reprodução continuam sem alterar ciência ou energia.

### 3 — Comparar folgas e evidências, sem um “índice de risco” inventado

**Onde:** `src/ui/CompareDialog.tsx` e os textos de busca/reflexão em `src/ui/MissionControl.tsx`.

**Mudança:** acrescentar à tabela existente três leituras simples: margem de massa `limite − massa`, saldo `orçamento − créditos` e energia mínima acima da reserva `minEnergyWh − reserveWh`. Rotular valores negativos como limite excedido, não como porcentagem de risco. Usar os valores exatos existentes para decidir o estado; arredondamento é só apresentação.

Expor `engineVersion` e `catalogVersion` nas duas execuções e sinalizar diferenças antes de sugerir comparação direta. Manter o aviso atual quando cenários diferem ou múltiplas escolhas mudaram. No resumo da busca finita, acrescentar: “A contagem descreve o catálogo neste cenário; não estima a probabilidade de uma falha real.”

Na reflexão existente, o prompt pode ser mais específico: “Eu testaria __ para proteger __. O evento __ mostra __. Vou comparar __.” Não é necessário mudar o esquema persistido: o campo de texto e o `eventId` já existem.

**Esforço mínimo:** linhas de tabela, operações de diferença de grandezas já calculadas e textos. Nenhum ajuste em procura de alternativas, estado `outcome` ou critério de mínimo.

**Critério de aceite:** duas execuções 6/6 podem revelar folgas diferentes; seis registros com envelope violado continuam mostrando projeto inválido; a UI não promove uma alternativa a “mais segura” sem declarar o que comparou.

## 6. Três melhorias futuras

### 1 — Laboratório de contingências com contrato próprio

Criar um cenário separado, com máquina de modos explícita: operação nominal, detecção, proteção, recuperação e retomada quando permitida. Definir gatilhos, cargas desligadas, preservação de dados, prioridade de comunicação, condições de saída e consequências temporais. Começar com injeção determinística de uma ocorrência identificada, por exemplo perda de uma oportunidade de contato; documentar o instante e permitir comparar o mesmo ensaio com duas respostas.

Adicionar semente somente quando houver aleatoriedade de fato. O painel deve mostrar “evento injetado para o exercício”, evitando atribuir uma frequência NASA inventada. Não inserir esse comportamento retrospectivamente no contrato `ipe-64-v1`.

### 2 — Plano didático de garantia e revisão por evidências

Introduzir uma atividade inspirada na AIM: para cada objetivo, registrar evidência planejada, resultado do teste, limitação conhecida e ação. Perfis fictícios de tolerância ajudam a discutir quanto investir em análise, ensaio e contingência, com custos/tempo de jogo declarados. Uma biblioteca explica A–D por exemplos e consideração conjunta de contexto; não classifica automaticamente a missão do jogador.

Na revisão, diferenciar “teste planejado”, “teste executado” e “evidência insuficiente”. Um controle visual marcado não substitui um resultado. A consequência educativa pode ser a qualidade da justificativa, separada do cumprimento da campanha e sem selo de conformidade NASA.

### 3 — Análise de incerteza com hipóteses verificáveis

Somente depois de definir distribuições, dependências, limites e justificativas, criar conjuntos de execuções para estudar dispersão e sensibilidade. Mostrar tamanho da amostra, sementes, modelo e intervalo de incerteza da estimativa. Separar incerteza sobre parâmetros de eventos aleatórios e evitar tratar componentes como independentes sem justificativa.

Permitir comparar decisões sob as mesmas realizações do cenário. A probabilidade resultante será condicional ao modelo e às hipóteses, não uma propriedade universal de uma classe NASA. Antes dessa modelagem, manter a apresentação determinística atual, com folgas e limites explícitos.

## 7. Linguagem recomendada

| Evitar | Preferir |
|---|---|
| “Classe D: alto risco de falha” como propriedade calculada | “Classe D: maior tolerância a risco no enquadramento NASA; não é uma probabilidade.” |
| “Pré-voo aprovado pela NASA” | “Revisão didática do projeto.” |
| “Risco zero” | “Nenhuma restrição deste modelo foi violada nesta execução.” |
| “Modo seguro ativado” sem comportamento implementado | “Operação encerrada pelo modelo; consulte o evento e redesenhe.” |
| “9 de 64: 14% de chance de sucesso” | “9 configurações atendem aos critérios neste cenário.” |
| “Falhou, mas passa com 4/6” | “Missão não cumprida. A investigação pode orientar o próximo projeto.” |

Estas são recomendações autorais de UX derivadas da leitura das fontes e dos componentes, não prescrições de interface feitas pela NASA.

## 8. Fontes primárias

| ID | Documento e local relevante |
|---|---|
| R01 | [NPR 8705.4B — índice e datas](https://nodis3.gsfc.nasa.gov/displayDir.cfm?t=NPR&c=8705&s=4B) |
| R02 | [NPR 8705.4B — Preface, P.1/P.2/P.6](https://nodis3.gsfc.nasa.gov/displayDir.cfm?Internal_ID=N_PR_8705_004B_&page_name=Preface) |
| R03 | [NPR 8705.4B — Chapter 3, classificação e implementação](https://nodis3.gsfc.nasa.gov/displayDir.cfm?Internal_ID=N_PR_8705_004B_&page_name=Chapter3) |
| R04 | [NPR 8705.4B — Appendix A, Risk / Risk classification](https://nodis3.gsfc.nasa.gov/displayDir.cfm?Internal_ID=N_PR_8705_004B_&page_name=AppendixA) |
| R05 | [NPR 8705.4B — Appendix C, considerações holísticas](https://nodis3.gsfc.nasa.gov/displayDir.cfm?Internal_ID=N_PR_8705_004B_&page_name=AppendixC) |
| R06 | [NPR 8705.4B — Appendix D, objetivos e expectativas](https://nodis3.gsfc.nasa.gov/displayDir.cfm?Internal_ID=N_PR_8705_004B_&page_name=AppendixD) |
| R07 | [NPR 8705.4B — Appendix E, AIM](https://nodis3.gsfc.nasa.gov/displayDir.cfm?Internal_ID=N_PR_8705_004B_&page_name=AppendixE) |
| R08 | [NPR 7120.5F — Change 4 e orientação para NID 7120.148](https://nodis3.gsfc.nasa.gov/displayDir.cfm?t=NPR&c=7120&s=5F) |
| R09 | [NID 7120.148 — PDF, capa e tabela 2-6](https://nodis3.gsfc.nasa.gov/OPD_Docs/NID_7120_148_.pdf) |
| R10 | [NODIS — catálogo NID, extensão da 7120.148 a 01/08/2027](https://nodis3.gsfc.nasa.gov/OPD/OPD_list.cfm?dir=asc&moduleInputs=NID&sort=opr) |
| R11 | [NPR 7120.8A — índice, revalidação e Change 5](https://nodis3.gsfc.nasa.gov/displayDir.cfm?t=NPR&c=7120&s=8A) |
| R12 | [NPR 7120.8A — Preface, aplicabilidade](https://nodis3.gsfc.nasa.gov/displayDir.cfm?Internal_ID=N_PR_7120_008A_&page_name=Preface) |
| R13 | [NPR 7120.8A — Chapter 4, 4.2.11.3 e tabela 4-7](https://nodis3.gsfc.nasa.gov/displayDir.cfm?Internal_ID=N_PR_7120_008A_&page_name=Chapter4) |
| R14 | [OSMA — lançamento da NPR 8705.4B, 02/12/2024](https://sma.nasa.gov/news/articles/newsitem/2024/12/02/npr-8705-4b-risk-classification-for-nasa-payloads-formally-released-agencywide) |
| R15 | [NODIS — lista atual de diretivas NASA](https://nodis3.gsfc.nasa.gov/Rpt_current_directives.cfm) |

Material local lido para propostas de integração: `src/ui/Workbench.tsx`, `src/ui/MissionControl.tsx`, `src/ui/CompareDialog.tsx`, `src/ui/learning.ts` e `src/core/contracts.ts`. Leitura de código não equivale a ensaio de navegador. Nenhuma nova suíte ou navegador foi executado nesta pesquisa.
