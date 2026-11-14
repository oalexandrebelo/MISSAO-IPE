# Arquitetura — PROJETO IPÊ

**A execução científica do beta acontece no navegador, com um motor determinístico independente da interface.** A trilha de quatro níveis acrescenta objetivos didáticos sobre os dois cenários existentes; não substitui o contrato científico. A persistência cloud descrita ao final é uma proposta opcional e isolada.

Data de referência: 14/11/2026. Base inspecionada: motor `0.1.1-rd`, catálogo `ipe-64-v1`, trilha `ipe-campaign-v1`, resultado/replay v1, canonicalização `ipe-json-v1`, pacote científico `6f49100126a82e1783281083e2c268bcf7b4661b500280de4dc96123036b2a1e`. As versões do frontend estão fixadas no [package.json](../package.json) e lockfile.

## 1. Limite de cada camada

| Camada | Implementação do beta | Responsabilidade | Limite deliberado |
|---|---|---|---|
| Apresentação | React, HTML/CSS, Three.js, R3F, Drei | Briefing, hangar, escolhas, narrativa, relatórios e cena 3D/2D | FPS, câmera, pausa visual e geometria da cena não alteram física. |
| Coordenação | `src/App.tsx`, cliente de Worker e `src/campaign/` | Navegação, previsão, tentativa, cancelamento, quatro níveis e publicação de resultados | Estado da UI não redefine `outcome` nem modifica resultados já executados. |
| Domínio | `src/core/` | Configuração, recursos, energia/potência, fila, ciência, resultado e enumeração | Sem dependência de React, Three, rede, banco ou LLM. |
| Dados científicos | `src/data/` e `public/data/` | Seis registros históricos, metadados, recibos e arquivos preservados | Não representa aquisição MODIS pelo CubeSat fictício durante a simulação. |
| Persistência local | `src/persistence/`, diário e progresso local | Rascunho, snapshots, hashes, exportação/importação, decisões e níveis concluídos | Disponibilidade depende do navegador. Falha não apaga resultado em memória. |
| Laboratório | `src/lab/physics.ts` e UI própria | Modelos escalares de órbita, solar, bateria, foguete e rádio | Seus controles não alimentam a campanha fechada. |
| Distribuição | Vite, `dist/`, assets de `public/` | Aplicação estática e documentação científica | Um build local não comprova publicação ou operação offline a frio. |
| Cloud opcional | `prisma/schema.prisma`, proposta | Modelo de armazenamento versionado, sessões pseudônimas e evidências | Sem dependência instalada, endpoint, banco conectado, migration ou política RLS ativa. |

## 2. Stack e compatibilidade

| Parte | Versão/configuração da base | Decisão |
|---|---|---|
| Runtime de desenvolvimento/CI | Node `24.x`; QA do beta usou `24.22.1` | Usar Node 24 no build e nos testes com remoção nativa de tipos. |
| Linguagem | TypeScript `7.0.2`; `strict`, `noUncheckedIndexedAccess` | `tsc --noEmit` deve passar junto do build. |
| UI | React/React DOM `19.3.1` | DOM semântico para todas as escolhas e resultados essenciais. |
| Build | Vite `8.3.8`; ES modules | Artefato estático reproduzível por `npm ci` e `npm run build`. |
| Cena | Three `0.187.0`, R3F `9.8.2`, Drei `10.7.9` | Camada de apresentação com alternativa 2D. |
| Testes | Node test runner, Testing Library, jsdom, fake-indexeddb | Testes de domínio e DOM; não substituem GPU, navegador ou usuário real. |
| Dados locais | IndexedDB v1 + `localStorage` | Execução sem conta e sem backend obrigatório. |
| Banco futuro | Prisma ORM `7.10.1`, PostgreSQL | Versão fixada; client gerado somente em diretório de servidor. |

Prisma 7 documenta suporte a Node `^24.0.0` e TypeScript `5.4+`. Isso permite escolher Node 24 para a proposta, mas não comprova que um serviço futuro com o client gerado já foi compilado/testado com TypeScript 7.0.2. Esse teste integra o gate de ativação cloud. O frontend atual não importa Prisma. Ver [requisitos oficiais](https://www.prisma.io/docs/orm/v7/reference/system-requirements) e [decisão do modelo de dados](../prisma/README.md).

## 3. Contratos de execução

`src/core/contracts.ts` é a autoridade de tipos do motor; o [contrato de implementação](../specs/IMPLEMENTATION-CONTRACT.md) preserva suas invariantes.

| Operação | Contrato | Consequência para quem integra |
|---|---|---|
| Simulação | `simulateMission(config, scenarioId, options?) → MissionResult` | Entrada validada com exatamente seis escolhas e cenário conhecido. |
| Execução assíncrona | `simulateAsync(config, scenarioId, signal?)` | Snapshot antes de executar; identidade do pedido conferida antes de aplicar resposta. |
| Busca | `searchCatalog(baseConfig, scenarioId) → SearchResult` | Avalia as 64 configurações do catálogo; mínimo só existe com busca completa e testemunha viável. |
| Avaliação do nível | `assessCampaignResult(levelId, result)` | Lê configuração e `MissionResult`; não concede progresso nem transforma falha científica em sucesso. |
| Tentativa da campanha | `beginCampaignAttempt` / `completeCampaignAttempt` | Token em memória, snapshot e recálculo antes de conceder progresso; token cancelado, consumido ou reconstruído via JSON é rejeitado. |
| Persistência | `saveRun`, `listRuns`, `saveDraft`, `loadDraft`, `deleteRun` | Commit é o fim da transação, não o sucesso isolado de um request IDB. |
| Replay | `exportReplay(result)` / `importReplay(text)` | Importação valida, confere identidade e recalcula. O resultado alegado não é autoridade. |
| Progresso | Tentativa própria + gate do nível | Importação não deve produzir evidência retroativa de previsão própria. |

O resultado distingue `success`, `failure` e `invalid`. A condição científica é **6/6 registros completos e válidos, com todas as restrições respeitadas**. Massa de até 3,6 kg, até 86 créditos, horizonte de 10.800 s e as condições de energia, potência, memória, transmissão e qualidade permanecem válidos nos quatro níveis.

### Trilha didática e cenários

| Nível | Cenário do motor | Critério adicional de conclusão |
|---|---|---|
| 1 — Primeiro sinal | `long-contact` | Sucesso do motor com o projeto executado; a configuração inicial já entrega 6/6. |
| 2 — Memória em disputa | `long-contact` | Sucesso mantendo `buffer = "compact"` — 512 Mbit. O projeto inicial do nível começa com memória compacta. |
| 3 — Janela estreita | `short-contact` | Sucesso mantendo `processing = "bands"`, preservando bandas para processamento no solo. |
| 4 — Ciência que chega | `short-contact` | Sucesso com até 78 créditos, objetivo adicional ao envelope global de 86. |

Os níveis selecionam os mesmos seis componentes do catálogo. O motor mantém dois cenários: duas janelas de 600 s ou duas de 240 s. Um relatório pode informar “missão científica concluída; requisito deste nível pendente” quando o motor tem sucesso mas a restrição pedagógica não foi cumprida. Essa distinção evita esconder um resultado científico correto ou completar o nível por uma regra diferente da declarada.

A busca geral responde sobre viabilidade científica no catálogo. `searchCampaignCatalog` aplica também os critérios do nível, recalcula a distância mínima entre soluções elegíveis e separa `missionSuccessful` de `rejectedByLevel`. As contagens da ajuda contextual devem somar elegíveis, rejeitados pelo nível, falhas e inválidos; não usar a regra de contagem da busca científica sem incluir essa nova categoria. Os níveis são liberados em ordem e podem ser revisitados depois de concluídos.

## 4. Cálculo, recursos e proveniência

O motor progride por eventos e fronteiras de tempo. Potência instantânea e energia armazenada são grandezas distintas. Os contadores de dados preservam bits e registram estados como produzido, em fila, parcialmente transmitido, entregue ou perdido. Somente recepção completa com qualidade válida conta como registro científico entregue.

Os seis registros históricos são Terra/MODIS **MOD13Q1, Collection 061**, em três locais próximos a Rio Verde, com compostos iniciados em 28/08/2024 e 13/09/2024. Cada observação preserva sua própria data, separada do início do composto e do relógio simulado. A cadeia de proveniência relaciona respostas ORNL DAAC, recibos de recuperação, metadados CMR e pacote compilado. O [refinamento NASA](REFINAMENTO-NASA-R10.md) registra a auditoria científica e as referências da rodada.

O retorno científico só compara um ponto quando os dois registros do par chegaram e foram validados. Variação de NDVI entre datas é descritiva; não determina causa ambiental, nem três pontos representam o Cerrado inteiro. As massas, potências, créditos e agendas do catálogo são parâmetros didáticos.

## 5. Concorrência e falhas locais

A ponte de Worker preserva entrada e ID do pedido, valida o tipo de resposta e ignora respostas obsoletas. Cancelamento termina o trabalho correspondente; o fallback local utiliza o mesmo motor quando Worker não está disponível. Isso mantém equivalência de regras, sem prometer equivalência de responsividade entre execução fora e dentro da thread principal.

`App` mantém tokens para execução, importação e histórico. Trocar projeto ou cenário invalida a relação com o resultado anterior; aplicar uma alternativa cria um projeto ainda não executado. Pausar o relatório apenas percorre um trace já calculado. O tempo visual da cena não é o tempo de integração do motor.

O rascunho do IndexedDB usa comparação de revisão dentro de transação `readwrite`, inclusive entre abas. Divergência gera conflito e exige recarregar/conciliar; não sobrescreve silenciosamente o trabalho mais recente. Para salvar execução, snapshot e hashes são preparados antes de abrir a transação. O retorno ao chamador acontece após `transaction.complete`.

O diário pedagógico em `localStorage` é independente dos snapshots do IndexedDB. Não há transação atômica entre os dois mecanismos. Portanto, o diário não é usado como um registro antifraude ou comprovante institucional; uma falha em um deles deve ser comunicada sem descartar o resultado da missão.

O progresso da trilha usa `mission-ipe:campaign:v1` em `localStorage`, com a versão da campanha, motor e catálogo. Ao restaurar, valida estrutura, ordem de conclusões, configuração e critério de cada nível por recálculo. Na sessão ativa, um token mantido em `WeakMap` impede que importação ou histórico sejam tratados como o lançamento próprio atual. Isso protege o fluxo da aplicação; não transforma armazenamento controlado pelo usuário em prova antifraude. Reflexão é uma atividade pedagógica disponível, não uma exigência do gate numérico de conclusão.

## 6. Importação como fronteira de confiança

O replay v1 tem uma gramática JSON deliberadamente limitada: tamanho máximo de 1 MiB, profundidade máxima de 20, limitação de nós/strings/arrays e rejeição de chaves duplicadas, propriedades perigosas, números inválidos e versões incompatíveis. URLs, scripts e instruções presentes em arquivo importado não são executados nem consultados.

Depois do parser, a importação confere a entrada, o resultado alegado e seus hashes; então roda novamente o motor. `matchesClaim` informa se o resultado recalculado corresponde à alegação. A UI deve manter essa distinção e nunca usar um trace importado como substituto do cálculo. Uma importação inválida não deve apagar um resultado anterior ainda válido.

SHA-256 canônico garante identidade do conteúdo dentro do formato; não atesta autoria, aquisição NASA, avaliação humana ou verdade de um modelo de voo. O contrato versionado limita a reexecução ao motor e pacote compatíveis. Não se promete determinismo binário entre versões diferentes de motores.

## 7. Modelo cloud proposto

O [schema completo](../prisma/schema.prisma) tem 12 modelos e mantém três grupos:

- **Conteúdo científico versionado:** `Campaign`, `Level`, `Dataset`, `Evidence`.
- **Atividade pseudônima e suas evidências:** `Player`, `Session`, `Project`, `Run`, `Prediction`, `Decision`, `Reflection`.
- **Projeção derivada:** `LearningProgress`.

Uma revisão de `Project` é um snapshot imutável da configuração. `Run` mantém entrada, resultado e replay canônicos, mais versões e hashes. O campo `contentId` conserva a identidade numérica atual; `clientRunKey` distingue tentativas e torna retries idempotentes. Os valores SQL em `Decimal`/`BigInt` servem para consulta; o texto canônico mantém a autoridade do replay. Ver [mapeamento e invariantes](../prisma/README.md).

O futuro serviço resolveria owner pelo contexto autenticado e sempre filtraria `Project → Session → Player`. UUIDs e hashes não são credenciais. RLS é uma camada adicional a implementar em SQL e testar; não é criada automaticamente pelo Prisma. O frontend jamais recebe URL de banco ou uma chave privilegiada.

Os registros de jogador não possuem nome civil, e-mail, idade, escola, IP ou localização. Texto livre continua local por padrão. A proposta técnica de retenção é explícita, com expiração e expurgo a implementar. Não há serviço de analytics ou coleta infantil adicional necessário para executar o beta.

## 8. Decisões arquiteturais

| ADR | Decisão | Motivo e consequência |
|---|---|---|
| ADR-001 | Motor puro e determinístico no navegador | Consequência observável das escolhas sem latência ou autoridade de um serviço externo. |
| ADR-002 | Apresentação 3D isolada do cálculo | Experiência visual pode degradar para 2D sem alterar as regras da missão. |
| ADR-003 | Quatro níveis sobre dois cenários fechados | Progressão pedagógica sem adicionar física orbital não validada ou enfraquecer 6/6. |
| ADR-004 | Resultado executado imutável e versionado | Comparação e replay preservam a configuração que realmente produziu o resultado. |
| ADR-005 | Dados históricos empacotados com proveniência | Ciência pode ser examinada sem uma API NASA ao vivo; datas e limites permanecem visíveis. |
| ADR-006 | IndexedDB para snapshots; diário local separado | Funciona sem conta; aceita a limitação de não haver atomicidade entre os dois stores. |
| ADR-007 | Prisma/PostgreSQL fora do runtime do beta | Permite planejar sincronização sem inventar um backend ou aumentar o bundle científico. |
| ADR-008 | Laboratório físico separado | Modelos idealizados podem ser explorados sem atribuir órbita, Δv ou enlace operacional ao motor fechado. |
| ADR-009 | Conclusão de nível distinta de aprendizagem | Gates verificam regras do jogo; estudo com público ainda é necessário. |
| ADR-010 | Sem LLM para calcular resultados | Fórmulas, QA e resultado vêm de código testável e dados identificados. |

## 9. Publicação e gates de evolução

O caminho de distribuição é repositório → verificações → build estático → hospedagem HTTP(S). A Vercel é um destino de publicação previsto para `dist/`; o endereço, commit implantado e estado do deploy pertencem ao recibo de entrega da coordenação. O build também gera a documentação pública de pesquisa. GitHub guarda a origem versionada; as URLs só devem ser anunciadas como publicadas depois de confirmação real.

Antes de declarar beta distribuível, passar testes de domínio, fluxo e build, verificar os quatro níveis com resultados do motor real, conferir fontes no artefato e executar QA de navegador do fluxo principal. Evidência jsdom não valida WebGL, foco real, leitor de tela, persistência durável ou recarga offline. Esses itens devem ter estado próprio no handoff.

Antes de ativar cloud, exigir: client gerado e compilado, migração revisada em banco descartável, autenticação/ownership, idempotência e conflitos, validação/reexecução de entradas, exclusão por retenção e teste de restauro. Nenhum desses gates é satisfeito apenas pela presença ou validação sintática do schema.

Os diagramas fonte e renderizáveis estão em [FLOWCHARTS](FLOWCHARTS.md). Os requisitos verificáveis estão no [PRT](PRT.md), e o [PRD](PRD.md) descreve os resultados de produto esperados.
