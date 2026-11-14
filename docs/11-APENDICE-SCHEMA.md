# 11 — Apêndice: schema Prisma integral

Cópia exata do contrato opcional de persistência relacional. A validação estrutural foi executada; o runtime atual usa IndexedDB. O schema não é evidência de backend integrado. Arquivos editáveis preservados no pacote.

## schema.prisma

```prisma
// MISSÃO IPÊ — P&D específico iniciado em 14/11/2026 antes das 09h BRT.
// Elegibilidade NASA não estabelecida. Datas e autoria não são retroagidas.
// Arquitetura OPCIONAL para Node/SQLite: NÃO é o IndexedDB que a UI usa.
// Não há backend, client gerado, migração aplicada nem integração Prisma no app.

generator client {
  provider = "prisma-client"
  output   = "../server/generated/prisma"
}

datasource db {
  provider = "sqlite"
}

enum ProvenanceKind {
  OBSERVATIONAL_PRODUCT
  TRANSCRIBED
  DERIVED
  ASSUMPTION
}

enum ParameterSourceRole {
  VALUE
  DERIVATION_INPUT
  CONCEPT
}

enum MissionOutcome {
  SUCCESS
  FAILURE
  INVALID
}

enum ReplayVerification {
  LOCAL_COMPUTED
  RECOMPUTED_MATCH
  RECOMPUTED_MISMATCH
}

enum ObservationState {
  NOT_PRODUCED
  QUEUED
  PARTIAL
  DELIVERED
  LOST
  INVALID
}

enum EventSeverity {
  INFO
  WARNING
  ERROR
}

// Revisão imutável. Hash de conteúdo não autentica a origem nem prova física.
model ScenarioPack {
  id                      String                @id
  key                     String
  version                 String
  sciencePackHash         String
  contentHash             String                @unique
  engineVersion           String
  catalogVersion          String
  resultSchemaVersion     Int
  canonicalizationVersion String
  numericPolicy           String
  content                 Json
  createdAt               DateTime              @default(now())
  sources                 SourceReference[]
  scienceRecords          ScienceRecord[]
  parameters              ScientificParameter[]
  missionConfigs          MissionConfig[]

  @@unique([key, version])
}

// URLs são apenas proveniência. Importação não as acessa automaticamente.
model SourceReference {
  id                  String              @id
  packId              String
  key                 String
  title               String
  publisher           String
  url                 String
  productDoi          String?
  serviceDoi          String?
  retrievedAt         DateTime?
  originalSha256      String?
  originalByteLength  Int?
  originalLocalPath   String?
  licenseNote         String?
  pack                ScenarioPack        @relation(fields: [packId], references: [id], onDelete: Cascade)
  records             ScienceRecord[]
  parameterReferences ParameterSource[]

  @@unique([packId, key])
  @@unique([id, packId])
}

// Datas de arquivo não são segundos simulados. Coordenadas são as solicitadas,
// não uma alegação de centro preciso de pixel. Um registro referencia fonte no mesmo pack.
model ScienceRecord {
  id                 String              @id
  packId             String
  key                String
  sourceId           String
  kind               ProvenanceKind      @default(OBSERVATIONAL_PRODUCT)
  latitudeRequested  Float
  longitudeRequested Float
  compositeStart     String
  observationDate    String
  modisDate          String
  redInteger         Int
  nirInteger         Int
  viQuality          Int
  pixelReliability   Int
  ndviProduct        Float
  scale              Float
  offset             Float
  pack               ScenarioPack        @relation(fields: [packId], references: [id], onDelete: Cascade)
  source             SourceReference     @relation(fields: [sourceId, packId], references: [id, packId], onDelete: Restrict)
  observations       Observation[]
  events             RunEvent[]

  @@unique([packId, key])
  @@unique([id, packId])
  @@index([sourceId, packId])
}

model ScientificParameter {
  id               String              @id
  packId           String
  key              String
  provenanceKind   ProvenanceKind
  value            Json
  unit             String
  conditions       String
  transformation   String?
  dependencyKeys   Json
  uncertaintyNote  String?
  pack             ScenarioPack        @relation(fields: [packId], references: [id], onDelete: Cascade)
  sourceReferences ParameterSource[]

  @@unique([packId, key])
  @@unique([id, packId])
}

// FKs compostas: fonte e parâmetro obrigatoriamente pertencem ao mesmo pack.
model ParameterSource {
  packId      String
  parameterId String
  sourceId    String
  locator     String
  role        ParameterSourceRole @default(CONCEPT)
  parameter   ScientificParameter @relation(fields: [parameterId, packId], references: [id, packId], onDelete: Cascade)
  source      SourceReference     @relation(fields: [sourceId, packId], references: [id, packId], onDelete: Restrict)

  @@id([parameterId, sourceId])
  @@index([sourceId, packId])
}

// inputHash cobre escolhas, cenário, modo de trace, versões e hash do pack.
model MissionConfig {
  id                  String       @id
  packId              String
  inputSchemaVersion  Int
  engineVersion       String
  catalogVersion      String
  inputHash           String       @unique
  input               Json
  createdAt           DateTime     @default(now())
  pack                ScenarioPack @relation(fields: [packId], references: [id], onDelete: Restrict)
  runs                Run[]

  @@unique([id, packId])
  @@index([packId, createdAt])
}

// Persistir Run, eventos, observações e chunks na MESMA transação de aplicação.
// O schema não implementa essa transação; não é alegação de integração concluída.
model Run {
  id                  String             @id
  packId              String
  missionConfigId     String
  inputHash           String
  resultHash          String
  resultSchemaVersion Int
  outcome             MissionOutcome
  verification        ReplayVerification
  completedAtS        Float
  result              Json
  createdAt           DateTime           @default(now())
  missionConfig       MissionConfig      @relation(fields: [missionConfigId, packId], references: [id, packId], onDelete: Restrict)
  observations        Observation[]
  events              RunEvent[]
  traceChunks         TraceChunk[]
  importClaims        ImportClaim[]

  @@unique([inputHash, resultHash])
  @@unique([id, packId])
  @@index([missionConfigId, packId])
  @@index([createdAt])
}

// BigInt no banco; string decimal no JSON. Aplicação limita a 2^53−1 nesta versão.
// Aplicação valida 0 <= downlinkedBits + lostBits <= generatedBits e QA.
model Observation {
  runId          String
  packId         String
  scienceRecordId String
  generatedBits  BigInt
  downlinkedBits BigInt
  lostBits       BigInt
  state          ObservationState
  producedAtS    Float?
  deliveredAtS   Float?
  ndvi           Float?
  expectedNdvi   Float
  scienceValid   Boolean
  run            Run           @relation(fields: [runId, packId], references: [id, packId], onDelete: Cascade)
  scienceRecord  ScienceRecord @relation(fields: [scienceRecordId, packId], references: [id, packId], onDelete: Restrict)

  @@id([runId, scienceRecordId])
  @@index([scienceRecordId, packId])
  @@index([runId, state])
}

model RunEvent {
  runId           String
  packId          String
  eventId         String
  ordinal         Int
  timeS           Float
  code            String
  severity        EventSeverity
  rule            String
  message         String
  scienceRecordId String?
  value           Float?
  limit           Float?
  run             Run            @relation(fields: [runId, packId], references: [id, packId], onDelete: Cascade)
  scienceRecord   ScienceRecord? @relation(fields: [scienceRecordId, packId], references: [id, packId], onDelete: Restrict)

  @@id([runId, eventId])
  @@unique([runId, ordinal])
  @@index([scienceRecordId, packId])
}

model TraceChunk {
  runId       String
  packId      String
  ordinal     Int
  startTimeS  Float
  endTimeS    Float
  sampleCount Int
  contentHash String
  samples     Json
  run         Run    @relation(fields: [runId, packId], references: [id, packId], onDelete: Cascade)

  @@id([runId, ordinal])
  @@index([runId, packId])
}

// Alegação importada preservada separadamente do resultado recalculado.
// Match apenas confirma consistência com esta versão do motor, não verdade física.
model ImportClaim {
  id                  String   @id
  packId              String
  recomputedRunId     String
  replaySchemaVersion Int
  envelopeHash        String   @unique
  claimedInputHash    String
  claimedResultHash   String
  importedClaim       Json
  matchesClaim        Boolean
  importedAt          DateTime @default(now())
  recomputedRun       Run      @relation(fields: [recomputedRunId, packId], references: [id, packId], onDelete: Cascade)

  @@index([recomputedRunId, packId])
}

// CAS futuro exige UPDATE ... WHERE id=? AND revision=? dentro da transação.
// Esta tabela não é usada pelo browser; store.ts implementa CAS no IndexedDB.
model Draft {
  id         String   @id
  revision   BigInt   @default(0)
  config     Json
  scenarioId String
  updatedAt  DateTime @updatedAt
}
```

## prisma.config.ts

```typescript
// CLI opcional fixada: prisma@7.10.1. Caminhos relativos a este arquivo.
// Sem dotenv, credenciais, geração de client ou conexão do app ao banco.
export default {
  schema: './schema.prisma',
  migrations: { path: './migrations' },
  datasource: { url: 'file:./mission-local.db' },
};
```
