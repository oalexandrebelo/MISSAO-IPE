# Persistência cloud opcional — Missão Ipê

O [schema Prisma](schema.prisma) descreve uma evolução possível de armazenamento. **O beta usa IndexedDB e `localStorage`; não usa Prisma, PostgreSQL, autenticação, API de sincronização ou RLS.** Nenhum banco foi provisionado, nenhuma migração foi aplicada e este diretório não é importado pelo frontend.

Referência técnica: **Prisma ORM 7.10.1**, PostgreSQL e Node.js 24. Consulta oficial em 14/11/2026. A documentação já distingue Prisma 8 RC de Prisma 7; por isso os comandos fixam a versão e não usam `@latest`. A escolha mantém esta proposta no formato de schema estável da linha 7, sem migrar a aplicação para outro runtime.

## Validar sem banco

Na raiz do projeto, com Node 24 e acesso ao registro npm:

```bash
npm exec --yes --package=prisma@7.10.1 -- prisma validate --schema ./prisma/schema.prisma
```

Esse comando valida a linguagem e as relações do schema; não cria tabelas nem testa autorização, migração, exclusão, desempenho ou compatibilidade de um cliente gerado com TypeScript 7. O ambiente de verificação pode instalar o CLI em uma pasta temporária para manter o `package.json` do beta intacto. Não é necessário fornecer uma conexão para essa validação.

**Verificação executada em 14/11/2026:** `prisma format` e `prisma validate`, usando CLI 7.10.1 isolado e Node 24.22.1, terminaram com código 0; o validador confirmou o schema como válido. Os 12 modelos foram conferidos. Nenhum comando de conexão ou migração foi executado.

O gerador usa `provider = "prisma-client"`, saída explícita em `server/generated/prisma` e ESM. No Prisma 7, a URL de conexão pertence à configuração do CLI, fora do schema. O client gerado e seu driver adapter pertencem exclusivamente a um serviço de servidor futuro.

## Doze modelos e suas responsabilidades

| Modelo | Responsabilidade e identidade |
|---|---|
| `Campaign` | Revisão de uma campanha; único por `slug + version`. Conteúdo publicado não é reescrito. |
| `Level` | Revisão de um nível, seu cenário, configuração inicial, critérios e dataset; único por campanha, chave e versão. |
| `Dataset` | Pacote científico histórico versionado, manifesto, produto, coleção, intervalo temporal e hash do pacote. |
| `Evidence` | Fonte, recibo, metadado ou guia ligado ao dataset; URL, revisão, data de consulta e, quando preservado, arquivo, bytes e SHA-256. |
| `Player` | Identidade aleatória pseudônima, sem cadastro pessoal; não representa uma credencial de acesso. |
| `Session` | Sessão de um jogador em uma revisão de campanha; `clientSessionKey` evita criação repetida por retry. |
| `Project` | Revisão imutável da configuração de um jogador em um nível; editar gera outra versão. |
| `Run` | Tentativa ou importação com entradas, resultado, replay, versões, hashes e projeções numéricas; imutável após ingestão. |
| `Prediction` | Previsão ligada a uma revisão de projeto, anterior à tentativa própria. |
| `Decision` | Registro append-only de uma ação relevante, com payload fechado e chave de idempotência. |
| `Reflection` | Reflexão sobre uma execução; pode referenciar um evento existente no replay. |
| `LearningProgress` | Projeção recalculável dos critérios do jogo por jogador e nível. Conclusão do nível não demonstra aprendizagem. |

`Project → Session → Player` define o proprietário. As relações compostas entre `Project`, `Session` e `Level` impedem ligar uma sessão a um nível de outra revisão de campanha. As relações compostas de `Run`/`Prediction` e `Decision`/`Run` impedem ligar esses registros a projetos diferentes. A pertença de `LearningProgress.supportingRun` ao mesmo jogador e nível ainda deve ser validada pelo serviço: um simples FK não expressa essa regra transitiva.

O manifesto em `Campaign.content` deve fixar a lista ordenada de IDs/versões dos níveis. A execução consulta esse manifesto; não escolhe a revisão mais recente implicitamente. Publicar a campanha também congela esse conjunto. Alterar um nível publicado exige nova revisão de conteúdo e campanha, sem mudar o significado de tentativas já registradas.

## Relação com o beta local

| Dado atual | Destino futuro | Regra de adaptação |
|---|---|---|
| Rascunho ativo e `revision` do IndexedDB | `Project` versionado | Criar snapshot; a revisão local não é automaticamente a versão global. Conflito exige escolha explícita. |
| `SavedRun.id = run-<hash>` | `Run.contentId` | Preservar a identidade do conteúdo. O ID UUID do banco identifica a ocorrência de uma tentativa/importação. |
| `SavedRun.inputHash/resultHash` | Campos homônimos de `Run` | Revalidar com a mesma canonicalização e versões. |
| Resultado e entrada do replay | `resultCanonical`, `inputCanonical`, `replayCanonical` | Texto canônico preservado, depois de parser estrito e recálculo. |
| Diário `prediction/completed/...` | `Prediction`, `Decision`, `Reflection` | Importação histórica não comprova ordem temporal nem autoria. Sem promover a tentativa própria validada pelo servidor. |
| Estados locais da trilha | `LearningProgress` | Recalcular pelos critérios da versão do nível e pela origem da execução. |
| `public/data/` e manifesto | `Dataset` e `Evidence` | Preservar datas reais, produto, coleção, recibos e hashes por arquivo. |

O armazenamento local atual deduplica snapshots iguais por identidade de entrada e resultado. O modelo cloud distingue **conteúdo** de **ocorrência**: dois `Run` podem ter o mesmo `contentId` quando representam tentativas diferentes. `projectId + clientRunKey` torna o retry da mesma tentativa idempotente. A migração de um snapshot local deve usar `LOCAL_ARCHIVE`; não deve inventar quantas tentativas o produziram.

## Identidade, replay e imutabilidade

O contrato existente é preservado:

- `inputHash`: SHA-256 de `{ kind: "mission-ipe-input-v1", ...IDENTITY_VERSIONS, input }` usando `ipe-json-v1`.
- `resultHash`: SHA-256 de `{ kind: "mission-ipe-result-v1", ...IDENTITY_VERSIONS, result }` pela mesma canonicalização.
- `contentId`: `run-` seguido do SHA-256 canônico de `{ kind: "mission-ipe-run-v1", inputHash, resultHash }`.
- `replayHash`: campo novo da proposta cloud; SHA-256 dos bytes UTF-8 do replay canônico completo, sem acrescentar um hash autorreferente ao envelope v1.
- `configHash`: campo novo de `Project`; SHA-256 canônico de `{ kind: "mission-ipe-project-config-v1", scenarioId, config }`. A configuração continua validada contra a versão de catálogo fixada no nível.

O hash detecta alteração de conteúdo; não prova identidade do jogador, autoria, sequência de pensamento ou autenticidade institucional. `recordedAt` é o horário informado pelo cliente. `receivedAt`/`verifiedAt` são horários do servidor proposto. Uma importação offline não recebe retrospectivamente uma garantia de previsão registrada antes da tentativa.

O schema fornece tipos, chaves e relações. **Ele não impõe imutabilidade sozinho.** Antes de usar o modelo em produção, o serviço deve permitir apenas inserção em `Project`, `Run`, `Prediction`, `Decision` e `Reflection`; uma migração revisada deve acrescentar proteção contra `UPDATE` nesses dados e nas revisões publicadas de conteúdo. Exclusão por retenção ou pelo titular permanece possível por um caminho específico. `LearningProgress` é a exceção mutável: projeção reconstruível com controle de revisão, sem alterar as evidências originais.

## Unidades e precisão

| Campo | Tipo persistido | Contrato |
|---|---|---|
| `*Bits`, `byteLength` | `BigInt` | Bits e bytes inteiros. Serializar como strings decimais em JSON; nunca passar `BigInt` diretamente a `JSON.stringify`. |
| `massKg` | `Decimal(8,3)` | Quilogramas, coerente com as massas do catálogo em gramas inteiros. |
| `*EnergyWh`, `reserveWh` | `Decimal(24,12)` | Watt-hora para consultas. A projeção pode arredondar; não é a fonte dos hashes nem muda o resultado do motor. |
| `completedAtS` | `Int` | Segundos simulados desde o início, distintos de data/hora real. |
| `credits` | `Int` | Créditos didáticos; não é valor monetário. |
| Datas de observação/fonte | `Date` / manifesto | Datas do arquivo científico, sem confusão com os 180 minutos simulados. |
| Datas de sessão/recebimento | `Timestamptz(3)` | Instantes de atividade ou ingestão, sem usar o relógio do cliente como prova. |

`resultCanonical` permanece a autoridade numérica do replay. As projeções SQL não devem ser serializadas de volta para reconstruir o hash. Para o motor `0.1.1-rd`, a ingestão mantém o limite de inteiro seguro dos contratos existentes, mesmo que PostgreSQL aceite um `BigInt` maior. Toda conversão parte de strings decimais validadas.

## Invariantes que ainda exigem implementação

Antes de autorizar qualquer escrita cloud:

1. Validar UUIDs, hashes hexadecimais de 64 posições, números não negativos, versões positivas e payloads fechados. `Char(64)` sozinho não verifica um hash.
2. Conferir `scenarioId`, as seis escolhas e as versões de motor, catálogo, schema, canonicalização e dataset. Conferir igualdade entre a configuração do projeto, a entrada e o resultado recalculado.
3. Validar o replay com limite de 1 MiB, profundidade 20, rejeição de chaves duplicadas e proibidas, números não finitos e campos desconhecidos; nenhuma URL importada é buscada ou executada.
4. Reexecutar o motor compatível. Somente o resultado recalculado é canônico. Divergência da alegação produz diagnóstico explícito, sem salvar a alegação como verificada.
5. Exigir previsão anterior para `OWN_EXECUTION`; `REPLAY_IMPORT` e `LOCAL_ARCHIVE` não completam critérios que exigem tentativa própria. O vínculo não prova participação humana nem aprendizagem.
6. Conferir conservação de bits e demais invariantes do motor. `SUCCESS` exige `outcome === "success"`, seis registros completos e válidos e todas as restrições; o banco não redefine essa lógica.
7. Conferir se `Reflection.eventId` existe no resultado referido e se a evidência usada em `LearningProgress` pertence ao mesmo jogador, nível e revisão de regra.
8. Acrescentar `CHECK`s SQL para intervalos, não negatividade e condição `PRESERVED → assetPath/contentHash/byteLength`; testar a exclusão em cascata de toda a árvore de um jogador.

## Protocolo de sincronização proposto

Não há endpoint implementado. O fluxo de uma API futura é:

1. Autenticar o contexto da sessão e resolver `playerId` no servidor. Não confiar em um owner enviado no JSON.
2. Validar o lote fora da transação, limitar tamanho/tempo e recalcular resultados com as versões permitidas.
3. Em uma transação, resolver a sessão e o projeto versionado; inserir os registros por suas chaves `client*Key`.
4. Se a chave já existir, comparar o conteúdo canônico: igual retorna o mesmo recibo; diferente retorna conflito. Não usar `upsert` para sobrescrever um replay imutável.
5. Recalcular `LearningProgress` sem contar novamente o retry; aplicar comparação de `revision` para concorrência.
6. Confirmar somente após commit. Falha de rede mantém os dados locais e o estado pendente; a campanha permanece executável.

O conjunto de chaves resolve repetição, não autorização. A consulta e a mutação sempre devem carregar a condição de owner em `Session.playerId`. RLS seria defesa adicional, com SQL próprio, políticas testadas e identidade de sessão transacional; **não é criada por este schema**. Um client Prisma conectado com função privilegiada não fornece isolamento por jogador automaticamente. Credenciais de banco ficam exclusivamente no servidor, nunca em variáveis `VITE_*` ou no bundle.

## Minimização e retenção

O beta não pede nome, e-mail, idade, escola ou localização do jogador. Seu texto de previsão/reflexão fica no navegador. Um pseudônimo e UUID aleatórios ainda podem constituir dados vinculáveis; não são chamados de anonimização.

Na proposta cloud, textos livres são opcionais e omitidos na sincronização padrão. Eles podem conter dados pessoais espontaneamente digitados; o contrato não presume que estejam anonimizados. `payload` de decisão deve aceitar somente escolhas, IDs de regras/eventos e medidas previstas no DTO, sem cópia de texto livre, IP ou user agent.

Política técnica proposta para um piloto: **30 dias desde a criação da identidade**, com `Player.expiresAt` explícito; sessões e progresso expiram no máximo nessa data. Um job de expurgo ainda precisa ser implementado e testado; `expiresAt` não é TTL automático. A exclusão do jogador elimina sessões, projetos, tentativas e escritos associados; pacotes científicos e conteúdo editorial compartilhado permanecem. Não há coleta infantil adicional para viabilizar o beta. Qualquer pesquisa educacional com contas ou grupos requer protocolo próprio antes de ativar essa camada.

No beta local, não há expurgo agendado: a disponibilidade depende do navegador e de limpeza/exclusão local. Não transportar essa característica silenciosamente para a futura retenção cloud.

## Configuração futura, fora do build do beta

Somente quando a API for implementada em um pacote/branch de servidor, ela precisará do CLI, `@prisma/client@7.10.1`, adapter PostgreSQL compatível e driver `pg`, com lockfile próprio. A configuração abaixo é uma referência, **não um arquivo ativo deste repositório**:

```ts
// prisma.config.ts — criar apenas no pacote de servidor futuro.
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: { path: 'prisma/migrations' },
  datasource: { url: process.env.DATABASE_URL },
});
```

O ambiente deve fornecer `DATABASE_URL`; Prisma 7 não carrega `.env` implicitamente. O serviço usará `PrismaPg` e `new PrismaClient({ adapter })`. Antes de integrar: gerar o client, compilar com TypeScript 7.0.2/Node 24, revisar a migração em banco descartável, testar ownership, concorrência, idempotência e expurgo. A compatibilidade mínima documentada de TypeScript não substitui esse teste concreto do client gerado.

## Referências oficiais

Consultadas em 14/11/2026:

- [Release Prisma ORM 7.10.1](https://github.com/prisma/orm/releases/tag/7.10.1): versão fixada e correções da linha 7.
- [Prisma 7: caminhos de instalação](https://www.prisma.io/docs/v7/getting-started): distinção da linha estável em relação ao Prisma 8 RC.
- [Geradores Prisma 7](https://www.prisma.io/docs/orm/v7/prisma-schema/overview/generators): `prisma-client`, saída explícita e ESM.
- [Referência de configuração](https://www.prisma.io/docs/orm/v7/reference/prisma-config-reference): conexão fora do schema e carregamento de variáveis.
- [Introdução ao client](https://www.prisma.io/docs/orm/v7/prisma-client/setup-and-configuration/introduction): adapter de banco obrigatório na linha 7.
- [Requisitos de sistema](https://www.prisma.io/docs/orm/v7/reference/system-requirements): Node `^24.0.0` e TypeScript `5.4+`.
- [Modelos e relações](https://www.prisma.io/docs/orm/v7/prisma-schema/data-model/models): tipos e restrições do schema.

Arquitetura, requisitos e diagramas estão em [ARQUITETURA](../docs/ARQUITETURA.md), [PRT](../docs/PRT.md) e [FLOWCHARTS](../docs/FLOWCHARTS.md).
