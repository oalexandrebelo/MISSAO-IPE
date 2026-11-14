# Flowcharts e modelos — PROJETO IPÊ

Diagramas Mermaid de referência para o beta e sua evolução. As fontes `.mmd` em [`diagrams/`](../diagrams/) são editáveis e correspondem aos blocos abaixo. Layout vertical, labels curtas e diagramas separados mantêm a leitura compacta.

**Implementado/local** e **proposto/cloud** são contextos diferentes. A ciência continua exigindo 6/6 registros válidos e todas as restrições; os níveis acrescentam gates sem modificar o motor.

## 1. Jornada do jogador

O ciclo principal é prever, executar, investigar e redesenhar. O resultado científico e o critério adicional do nível recebem avaliações separadas. Os quatro níveis e seus critérios estão no PRT.

Fonte: [`01-user-flow.mmd`](../diagrams/01-user-flow.mmd).

```mermaid
flowchart TD
  Start["Abrir Missão Ipê"] --> Levels["Escolher nível disponível"]
  Levels --> Brief["Ler objetivo e limites"]
  Brief --> Design["Configurar seis subsistemas"]
  Design --> Predict["Registrar previsão e justificativa"]
  Predict --> Run["Executar projeto congelado"]
  Run --> Report["Investigar resultado e eventos"]
  Report --> Science{"Motor indica sucesso?"}
  Science -->|"Falha ou inválido"| Explain["Explicar causa e redesenhar"]
  Explain --> Design
  Science -->|"Sim, com 6/6"| Gate{"Critério do nível atendido?"}
  Gate -->|"Não"| Explain
  Gate -->|"Sim"| Reflect["Registrar reflexão opcional"]
  Reflect --> Next{"Há outro nível?"}
  Next -->|"Sim"| Levels
  Next -->|"Não"| Finish["Revisar a campanha"]
  Report --> Export["Exportar replay ou comparar"]
  Start --> Lab["Explorar laboratório independente"]
```

## 2. Estados de uma tentativa

Este é o contrato conceitual da coordenação. As labels descrevem estados de produto; não afirmam existir um reducer ou enum com esses nomes no código. Falha do motor, invalidade do projeto e objetivo pedagógico pendente permanecem distintos.

Fonte: [`02-game-state.mmd`](../diagrams/02-game-state.mmd).

```mermaid
stateDiagram-v2
  direction TB
  [*] --> Briefing
  Briefing --> Editing: entrar no hangar
  Editing --> Ready: previsão e justificativa válidas
  Ready --> Editing: alterar projeto ou cenário
  Ready --> Running: congelar entrada e executar
  Running --> Editing: cancelar e descartar resposta pendente
  Running --> Error: erro de execução
  Error --> Editing: revisar ou tentar novamente
  Running --> Result: receber e validar resultado
  Result --> Failed: outcome failure
  Result --> Invalid: outcome invalid
  Result --> Successful: outcome success
  Failed --> Editing: redesenhar
  Invalid --> Editing: corrigir envelope
  Successful --> LevelPending: critério adicional não atendido
  Successful --> LevelComplete: tentativa própria e critério atendido
  LevelPending --> Editing: revisar projeto
  LevelComplete --> Editing: próximo nível ou nova tentativa
  LevelComplete --> [*]

  state "Projeto editável" as Editing
  state "Pronto para executar" as Ready
  state "Execução em andamento" as Running
  state "Resultado imutável" as Result
  state "Falha científica" as Failed
  state "Projeto inválido" as Invalid
  state "Sucesso científico" as Successful
  state "Objetivo do nível pendente" as LevelPending
  state "Nível concluído" as LevelComplete
  state "Erro recuperável" as Error
```

## 3. Dados, simulação e replay

A entrada original e a importada convergem no mesmo motor. O parser e a checagem de identidade antecedem o recálculo. Comparar a alegação importada nunca substitui o resultado recalculado. A figura resume dados científicos e snapshots; o diário pedagógico separado continua em armazenamento local.

Fonte: [`03-data-flow.mmd`](../diagrams/03-data-flow.mmd).

```mermaid
flowchart TD
  subgraph Scientific["Arquivo científico histórico"]
    Sources["Respostas, recibos e metadados"] --> Pack["Seis registros e hash do pacote"]
  end
  subgraph Browser["Execução local no navegador"]
    Choices["Configuração e cenário"] --> Frozen["Entrada congelada e validada"]
    Frozen --> Engine["Motor determinístico"]
    Engine --> Result["Resultado completo e validado"]
    Result --> Report["Relatório e gate do nível"]
    Result --> Canonical["JSON canônico e hashes"]
    Canonical --> Store["IndexedDB: snapshot imutável"]
    Canonical --> Export["Replay exportado"]
    Imported["Replay importado"] --> Parser["Parser estrito e limites"]
    Parser --> Identity["Conferir versões e hashes"]
    Identity --> Engine
    Result --> Compare["Comparar com alegação importada"]
    Identity --> Compare
  end
  Pack --> Engine
```

## 4. Distribuição e evolução opcional

O bloco superior mostra o caminho técnico da entrega estática para GitHub/Vercel. Ele não é recibo de publicação: URL e commit implantado devem ser conferidos no handoff. O bloco inferior é proposto e ainda não implementado; o beta não envia dados a essa API nem se conecta a PostgreSQL.

Fonte: [`04-deployment.mmd`](../diagrams/04-deployment.mmd).

```mermaid
flowchart TD
  subgraph Delivery["Distribuição do beta estático"]
    Repo["Repositório GitHub"] --> Checks["Testes de domínio e UI"]
    Checks --> Build["TypeScript e Vite build"]
    Assets["Dados e documentação pública"] --> Build
    Build --> Dist["dist com assets preservados"]
    Dist --> Host["Hospedagem estática Vercel"]
    Host --> Browser["Navegador: UI, Worker e motor"]
    Browser --> Local["IndexedDB, diário e progresso local"]
  end
  subgraph Future["Proposta futura: cloud opcional"]
    Api["API com autenticação e owner"] --> Validate["Validar, recalcular e deduplicar"]
    Validate --> Prisma["Prisma 7.10.1 no servidor"]
    Prisma --> Db["PostgreSQL com políticas testadas"]
    Retention["Expurgo por retenção"] --> Db
  end
  Browser -.->|"Sync opcional ainda não implementado"| Api
```

## 5. Modelo de conteúdo e proveniência

Modelo cloud proposto. Cada nível fixa uma revisão de campanha e um dataset. Dataset referencia evidências com URL, datas e identidade dos arquivos preservados. Os campos mostrados são um recorte; o schema Prisma contém tipos e constraints completos.

Fonte: [`05-er-content.mmd`](../diagrams/05-er-content.mmd).

```mermaid
erDiagram
  direction TB
  Campaign ||--o{ Level : contains
  Dataset ||--o{ Level : pins
  Dataset ||--o{ Evidence : documents

  Campaign {
    uuid id PK
    string slug
    int version
    string contentHash
  }
  Level {
    uuid id PK
    uuid campaignId FK
    uuid datasetId FK
    string key
    int version
    string scenarioId
    json criterionSnapshot
  }
  Dataset {
    uuid id PK
    string key
    int version
    string packHash UK
    json manifest
  }
  Evidence {
    uuid id PK
    uuid datasetId FK
    string sourceUrl
    string contentHash
    datetime retrievedAt
  }
```

## 6. Modelo de atividade pseudônima

Modelo cloud proposto. O proprietário é derivado de Project → Session → Player. Run também referencia Dataset; Session referencia Campaign e Project/LearningProgress referenciam Level, mostrados no diagrama anterior. As relações opcionais não dispensam autorização e validação semântica no servidor.

Fonte: [`06-er-player.mmd`](../diagrams/06-er-player.mmd).

```mermaid
erDiagram
  direction TB
  Player ||--o{ Session : owns
  Session ||--o{ Project : freezes
  Project ||--o{ Prediction : records
  Project ||--o{ Run : executes
  Project ||--o{ Decision : logs
  Prediction o|--o| Run : precedes
  Run o|--o{ Decision : supports
  Run ||--o{ Reflection : inspires
  Player ||--o{ LearningProgress : has
  Run o|--o{ LearningProgress : supports

  Player {
    uuid id PK
    string pseudonym
    datetime expiresAt
  }
  Session {
    uuid id PK
    uuid playerId FK
    uuid campaignId FK
  }
  Project {
    uuid id PK
    uuid sessionId FK
    uuid levelId FK
    int version
    json configSnapshot
  }
  Run {
    uuid id PK
    uuid projectId FK
    string contentId
    string inputHash
    string resultHash
    string replayHash
  }
  Prediction {
    uuid id PK
    uuid projectId FK
    string target
  }
  Decision {
    uuid id PK
    uuid projectId FK
    uuid runId FK
    string kind
  }
  Reflection {
    uuid id PK
    uuid runId FK
    string eventId
  }
  LearningProgress {
    uuid id PK
    uuid playerId FK
    uuid levelId FK
    uuid supportingRunId FK
    string status
  }
```

## Como manter os diagramas

Ao mudar um contrato, editar a fonte `.mmd` correspondente e atualizar o bloco deste documento com o mesmo conteúdo. A sintaxe pode ser verificada com um parser Mermaid; renderizar também é necessário para conferir legibilidade. Uma figura não substitui os testes dos fluxos representados.

**Verificação executada em 14/11/2026:** os seis arquivos passaram por `mermaid.parse` com Mermaid 11.14.0; os seis blocos deste documento foram comparados com suas fontes e são idênticos. A tentativa de QA visual via Chromium local foi bloqueada pelo ambiente antes de abrir o navegador (`socket: Operation not permitted`). Portanto, esta verificação comprova sintaxe aceita pelo parser, sem alegar inspeção visual dos gráficos renderizados. A sintaxe segue as referências oficiais de [uso da API](https://mermaid.js.org/config/usage.html) e [relações entre entidades](https://mermaid.js.org/syntax/entityRelationshipDiagram.html).

A distinção entre snapshot, tentativa e progresso, a idempotência e os controles ainda pendentes estão no [README Prisma](../prisma/README.md). As decisões de implementação estão em [ARQUITETURA](ARQUITETURA.md) e os critérios de aceite em [PRT](PRT.md).
