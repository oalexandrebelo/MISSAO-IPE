# Persistência e replay — implementação e verificação

Registro de 14/11/2026. Este é desenvolvimento específico do protótipo Missão Ipê iniciado antes das 09h BRT. A elegibilidade NASA permanece não estabelecida. Nenhum arquivo original de `public/data` foi alterado, nenhuma data foi retroagida e esta implementação não altera o status de pesquisa anterior ao evento.

**Resultado entregue.** O navegador tem persistência real por IndexedDB, com gravação atômica de cada execução, identidade determinística e revisão de rascunho por comparação e troca. O replay é JSON estrito, limitado e versionado: uma importação aceita passa por validação e hashes e executa novamente `simulateMission`. O schema Prisma é uma arquitetura local opcional validada estruturalmente; não há backend Prisma integrado, client gerado ou migração aplicada.

## API para a interface

Arquivo: `src/persistence/store.ts`.

| Chamada | Comportamento |
|---|---|
| `saveRun(result): Promise<string>` | Copia e valida o resultado antes dos awaits; calcula hashes e ID; grava uma execução completa numa transação; resolve apenas em `transaction.complete`. |
| `listRuns(): Promise<SavedRun[]>` | Lê um snapshot, valida estrutura, versões, ID e hashes de cada execução e ordena por data decrescente. Corrupção causa erro visível, sem apagar registros. |
| `deleteRun(id): Promise<void>` | Valida o ID e aguarda o commit. Apagar novamente um ID ausente é permitido. |
| `saveDraft(config, scenarioId, expectedRevision): Promise<number>` | Lê, compara e incrementa a revisão dentro da mesma transação `readwrite`. Primeira gravação usa revisão esperada `0`. Retorna a revisão confirmada. |
| `loadDraft(): Promise<MissionDraft \| null>` | Retorna `{config, scenarioId, revision}` ou `null` quando não existe rascunho. |

`SavedRun` contém exatamente `id`, `createdAt`, `result`, `inputHash` e `resultHash`. A interface foi avisada do protocolo de revisão. Em conflito, `DraftConflictError` possui `code='DRAFT_CONFLICT'`, `expectedRevision` e `currentRevision`; o chamador deve manter as escolhas locais visíveis e oferecer recarga/revisão do conflito. Não há sobrescrita silenciosa nem retry que descarte a comparação.

O banco atual se chama `mission-ipe-research-v1`, versão `1`, com stores `runs` e `drafts`. `runs` possui chave primária `id`, índice composto único `byIdentity=[inputHash,resultHash]` e índice `byCreatedAt`. Instâncias independentes abertas com `createMissionStore` usam conexões distintas ao mesmo banco. A serialização das transações de leitura/escrita do IndexedDB protege o CAS entre abas; não depende de uma variável JavaScript compartilhada.

Falhas de abertura, bloqueio, quota, request, abort e integridade chegam ao chamador. O módulo não converte falha em sucesso, não remove o resultado em memória e não cria um fallback silencioso para armazenamento efêmero. A UI controla a mensagem e a preservação da execução visível. `complete` é a confirmação da transação; não constitui garantia de retenção eterna contra limpeza do site, expulsão pelo navegador ou falha do dispositivo.

## Identidade e formato de replay

Arquivos: `json.ts`, `validation.ts`, `identity.ts`, `replay.ts` em `src/persistence`.

`exportReplay(result): Promise<string>` produz o envelope canônico abaixo. `importReplay(text)` retorna `{result, matchesClaim, importedClaim}`: `result` é sempre a reexecução local; `importedClaim` conserva a alegação validada recebida, separada do resultado calculado.

| Campo | Regra |
|---|---|
| `format` | `mission-ipe-replay` |
| `replaySchemaVersion` | `1` |
| `canonicalization` | `ipe-json-v1` |
| `engineVersion` | Constante corrente de `contracts.ts` |
| `catalogVersion` | Constante corrente de `contracts.ts` |
| `resultSchemaVersion` | Constante corrente de `contracts.ts` |
| `sciencePackHash` | SHA-256 dos bytes de `mod13q1-research-pack.json` |
| `input` | Somente `{config, scenarioId, trace}`; `trace` explicita se o resultado inclui amostras. |
| `inputHash` | SHA-256 canônico da entrada com domínio `mission-ipe-input-v1` e todas as versões acima. |
| `claimedResult` | `MissionResult` completo com allowlists por objeto. |
| `resultHash` | SHA-256 canônico da alegação com domínio `mission-ipe-result-v1` e todas as versões acima. |

O ID da execução é `run-` seguido do SHA-256 canônico de `{kind:'mission-ipe-run-v1',inputHash,resultHash}`. A mesma entrada e o mesmo resultado têm o mesmo ID, inclusive em gravações simultâneas. Repetir a gravação preserva `createdAt` da primeira confirmação. Resultados diferentes sob a mesma entrada são evidências distintas, não sobrescritas. O store valida integridade estrutural e de bytes; a reexecução de alegações importadas pertence ao importador.

Canonicalização: chaves dos objetos ordenadas, ordem dos arrays preservada, strings JSON e codificação UTF-8, representação numérica de `JSON.stringify` para números finitos seguros. Não se declara conformidade com RFC 8785. O formato próprio tem versão explícita. Timestamps de gravação não entram no ID. As versões e o hash do pacote entram nos hashes de entrada e resultado.

O parser rejeita chaves duplicadas **depois de decodificar escapes**, incluindo duplicatas como `battery` e `\u0062attery`. Rejeita chaves `__proto__`, `prototype` e `constructor` em qualquer nível, além de campos fora das allowlists. Limites: 1.048.576 bytes UTF-8, profundidade máxima 20, 60.000 nós, strings de até 8.192 unidades UTF-16, arrays genéricos de até 8.192 itens; o schema restringe ainda eventos a 2.048, trace a 4.096 e observações a seis. Surrogates isolados, JSON incompleto, comentários, conteúdo extra, NaN, Infinity e estouros numéricos são recusados. O serializador também rejeita ciclos, acessores, arrays esparsos, símbolos e tipos fora de JSON.

Os totais de bits e bits por observação permanecem strings decimais, sem conversão intermediária para ponto flutuante; o limite desta versão é `2^53−1`, conforme o motor. Os campos de bits das amostras `TracePoint` preservam o tipo numérico seguro definido pelo contrato TypeScript. A validação não aplica tolerâncias que mudem o resultado: uma divergência canônica do resultado recalculado resulta em `matchesClaim=false`.

Entrada, formato, versões ou hashes inválidos são rejeitados antes da reexecução. Uma alegação adulterada acompanhada de um novo hash correto continua sendo reexecutada e devolve mismatch. Nenhuma URL importada é buscada. Nenhum script, trace ou instrução do arquivo é executado. O importador não grava automaticamente o arquivo no histórico.

**Limite de confiança.** SHA-256 detecta alterações em relação ao hash fornecido; qualquer pessoa pode recalcular esse hash. Ele não autentica NASA, ORNL, o autor do replay ou a identidade de quem executou. Concordar com a reexecução confirma consistência com esta implementação e suas hipóteses, não verdade física, validade experimental ou aprendizado do participante. Não se promete resultado numérico idêntico entre futuros motores ou runtimes. Esta versão rejeita versões e pacotes diferentes, sem migração automática.

## Dados científicos preservados

`scripts/verify-science-data.mjs` lê os originais offline e não escreve arquivos nem busca URLs. A execução passou para:

- SHA-256 do pacote original: `6f49100126a82e1783281083e2c268bcf7b4661b500280de4dc96123036b2a1e`.
- Hash e tamanho dos três JSONs originais A, B e C; concordância com os receipts e as referências do pacote.
- Identidade e todos os campos transcritos dos seis registros usados pelo motor.
- Bandas RED, NIR, QA, pixel reliability e NDVI produto contra os arrays originais.
- Datas de composição contra `calendar_date`, coordenadas solicitadas contra os pedidos e datas do pixel derivadas do dia do ano original: `2024-09-01` e `2024-09-23`.
- Timestamps originais de recuperação preservados: `2026-11-14T07:44:09.037615+00:00`, `2026-11-14T07:44:09.093483+00:00` e `2026-11-14T07:44:09.060103+00:00`.

Isso verifica integridade local e transformação entre artefatos; não transforma composites históricos em aquisições do satélite fictício ou prova a autenticidade remota apenas pelo hash local.

## Schema Prisma opcional

`prisma/schema.prisma` e `prisma/prisma.config.ts` foram validados com **Prisma CLI 7.10.1**, sem adicionar dependência Prisma ao app e sem executar migração.

O schema inclui `ScenarioPack`, `SourceReference`, `ScienceRecord`, `ScientificParameter`, `ParameterSource`, `MissionConfig`, `Run`, `Observation`, `RunEvent`, `TraceChunk`, `ImportClaim` e `Draft`. Relações compostas incluem `packId` para impedir referência entre fonte/parâmetro, registro/fonte, configuração/execução e execução/observação/evento/importação de pacotes distintos. Bit counts são `BigInt` no modelo opcional, com strings na fronteira JSON. IDs de entidades por versão devem ser globalmente únicos; os identificadores originais permanecem no campo `key`.

Esse schema descreve uma arquitetura futura. Não implementa transações Prisma, migrations, aplicação de constraints de domínio além das relações, servidor, transporte HTTP, sincronização ou autenticação. Uma implementação futura deverá gravar execução e filhos na mesma transação, habilitar/verificar FKs SQLite, aplicar o mesmo parser e schema de entrada, e usar atualização condicional de revisão para CAS. `ImportClaim` é armazenamento planejado para conservar a alegação separada; no browser atual ela é apenas devolvida pela API de importação.

## Verificações executadas

| Verificação | Resultado observado |
|---|---|
| `node --experimental-strip-types --test tests/persistence.test.mts tests/replay.test.mts` | **21 testes passaram, zero falhas**; execução final desta frente: aproximadamente 509 ms. |
| Roundtrip do domínio fechado | **128 reexecuções concordantes**: 64 configurações × 2 cenários, incluídas configurações inviáveis. |
| Trace omitido | Entrada registra `trace:false`; reexecução concorda e mantém trace vazio. |
| Fraude com hash refeito | Importação válida estruturalmente retorna `matchesClaim=false`; resultado devolvido é o recalculado. |
| Corrupção sem refazer hash | Rejeitada para entrada, resultado e hash adulterados. |
| Parser adversarial | Duplicatas, escapes equivalentes, poluição de protótipo, extras em todos os níveis, NaN/Infinity, sintaxe inválida, limites e bits inseguros rejeitados. |
| Ausência de fetch | String de URL na alegação não provoca chamada a `fetch`. |
| Concorrência de execução | Três gravações simultâneas em conexões independentes produzem um único registro. |
| CAS em duas conexões | Apenas uma gravação de revisão 0 confirma; a outra recebe `DraftConflictError`; retry explícito na revisão 1 confirma revisão 2. |
| Request success sem commit | Um request `add` conclui, a transação é abortada depois; Promise rejeita e nenhuma execução permanece. |
| Erro assíncrono real de request | Segunda inserção com mesma chave produz `ConstraintError`; transação aborta e rollback é verificado. |
| Quota | `QuotaExceededError` injetado no `put` é propagado; rascunho anterior permanece intacto. Não é teste de exaustão física do disco. |
| Corrupção no IndexedDB | Alteração externa do resultado persistido é detectada por `listRuns`. |
| Snapshot durante await | Mutação posterior do objeto entregue a `saveRun` não altera a execução gravada. |
| TypeScript isolado desta frente e dependências core | Passou com `--strict --noUncheckedIndexedAccess`, sem emissão. |
| `node --experimental-strip-types scripts/verify-science-data.mjs` | Passou para pacote, três originais e seis registros. |
| `npm exec --yes --package=prisma@7.10.1 -- prisma validate --config prisma/prisma.config.ts` | `The schema at prisma/schema.prisma is valid`. |

Os testes de persistência usam `fake-indexeddb@6.2.8`; verificam operações e rollback do modelo de IndexedDB em Node. **Não equivalem a um teste manual em duas abas de um navegador real**, a uma medição de quota real, retenção após falha de sistema ou backup. Essas verificações de integração de navegador ficam para a validação do protótipo completo.

Uma checagem global de TypeScript durante edição simultânea da interface encontrou um erro JSX em `src/ui/MissionControl.tsx` linha 65; a frente da interface foi avisada. A checagem isolada de todos os arquivos desta frente e os testes passou depois. A coordenação deve rodar o build global quando os arquivos de todas as frentes estiverem concluídos.

## Referências técnicas consultadas

- [Indexed Database API 3.0 — W3C, Editor’s Draft de 30/10/2026](https://w3c.github.io/IndexedDB/): ciclo, agendamento e conclusão de transações. Referência consultada como draft, sem alegar recomendação final da W3C.
- [Prisma ORM v7 — Config API](https://www.prisma.io/docs/orm/v7/reference/prisma-config-reference): configuração de schema e datasource; caminhos resolvidos em relação ao arquivo de configuração. A compatibilidade concreta foi conferida pela CLI 7.10.1.

Nenhum SDK de IA foi instalado ou usado. Não há LLM decidindo hash, QA, energia, resultado ou verificação do replay.
