# 04 — Fluxos Mermaid e fronteiras do sistema

Os diagramas descrevem a versão de pesquisa. O fluxo do produto e a semântica do motor não mudam por animação ou por implantação. Os arquivos `.mmd` correspondentes ficam em `docs/diagrams`.

## 1. Jornada e proteção da primeira decisão

```mermaid
flowchart TD
  A["Escolher condição"] --> B["Ler pedido e fontes"]
  B --> C["Projetar seis escolhas"]
  C --> D{"Primeira tentativa?"}
  D -->|Sim| E["Registrar previsão"]
  D -->|Não| F["Congelar entrada"]
  E --> F
  F --> G["Executar motor"]
  G --> H{"Execução concluída?"}
  H -->|Erro ou cancelamento| I["Preservar entrada e explicar erro"]
  I --> C
  H -->|Sim| J["Inspecionar ciência e eventos"]
  J --> K["Explicar consequência"]
  K --> L{"Consultar alternativas?"}
  L -->|Sim| M["Enumerar catálogo completo"]
  M --> N{"Cobertura sem indeterminados?"}
  N -->|Sim| O["Mostrar mínimo e testemunhas"]
  N -->|Não| P["Não certificar mínimo"]
  O --> C
  P --> C
  L -->|Não| Q["Redesenhar ou mudar condição"]
  Q --> C
```

No caso de transferência, o controle de ajuda permanece indisponível antes da primeira execução. Essa barreira registra ordem de interação; não prova, por si, compreensão ou autoria de uma justificativa.

## 2. Simulação por eventos

```mermaid
flowchart TD
  A["Validar cenário e configuração"] --> B["Inicializar ledger e observações"]
  B --> C["Concluir eventos na fronteira"]
  C --> D{"Horizonte ou término?"}
  D -->|Sim| N["Classificar resultado e residual"]
  D -->|Não| E["Determinar modo e potências"]
  E --> F{"Descarga instantânea admissível?"}
  F -->|Não| G["Registrar falha terminal"]
  G --> N
  F -->|Sim| H["Próxima fronteira temporal"]
  H --> I["Dividir por bateria e entrega"]
  I --> J["Integrar energia e serviço"]
  J --> K["Atualizar FIFO e lotes completos"]
  K --> L["Conferir reserva e contabilidade"]
  L --> M["Registrar trace e avançar relógio"]
  M --> C
```

A fração exata é a base da decisão. Os valores do tipo number exibidos na UI são conversões para apresentação. O último intervalo é integrado antes dos eventos de seu limite. A implementação tem testes específicos para último bit, último trabalho e energia zero.

## 3. Importação de resultado não confiável

```mermaid
flowchart TD
  A["Arquivo selecionado"] --> B["Limitar tamanho e profundidade"]
  B --> C["Parse estrito sem duplicatas"]
  C --> D["Validar campos e versões"]
  D --> E["Conferir hashes da entrada e alegação"]
  E --> F["Reexecutar entrada permitida"]
  F --> G{"Resultado confere?"}
  G -->|Sim| H["Exibir consistência verificada"]
  G -->|Não| I["Exibir divergência e novo resultado"]
  B -->|Rejeição| J["Manter estado atual"]
  C -->|Rejeição| J
  D -->|Rejeição| J
  E -->|Rejeição| J
```

Consistência verificada não é autenticidade, aprovação NASA ou correção física universal. O importador nunca executa uma URL, script ou trace fornecido pelo arquivo. O resultado recomputado permanece distinto da alegação importada.

## 4. Topologia local e ramo de IA opcional

```mermaid
flowchart TD
  A["Pacote local versionado"] --> B["React e controles HTML"]
  A --> C["Dados científicos preservados"]
  B --> D["Three.js procedural"]
  B --> E["Worker de simulação e busca"]
  C --> E
  E --> F["Resultado e eventos"]
  F --> B
  F --> G["IndexedDB local"]
  F --> H["Recibo JSON exportado"]
  H --> I["Validador e reexecução"]
  I --> E
  B -. "P1: texto consentido" .-> J["Classificador local opcional"]
  J -. "Sugestão validada ou abstenção" .-> B
```

A seta P1 não indica serviço já implementado. O modelo não acessa o ledger nem altera a condição de vitória. Na distribuição portátil, o motor ocupa a thread principal e não o Worker; a API matemática permanece a mesma. O schema Prisma descreve evolução relacional e não integra a topologia executada do browser.
