# Contrato de integração do protótipo de pesquisa

Início real: 14/11/2026 antes das 09h BRT. Este artefato é desenvolvimento específico anterior ao evento. Isolá-lo, creditá-lo ou renomeá-lo não estabelece elegibilidade. Não retroagir datas nem apresentá-lo como trabalho feito durante o hackathon. A questão com a organização permanece aberta, inclusive para especificações anteriores.

## Domínio fechado desta versão

Protótipo local de uma missão educacional e duas condições: long-contact e short-contact. A mesma pergunta exige seis NDVI válidos de arquivo. As duas rotas usam a mesma fórmula e política de QA. Arquivos MOD13Q1 históricos, datas reais separadas de relógio simulado. Nenhum dado de satélite é adquirido pelo CubeSat fictício em 180 min.

Seis escolhas binárias / 64 tuplas: battery small/large; panel compact/standard; processing bands/index; radio economy/fast; buffer compact/large; policy every-contact/last-contact. Lançador e perfil orbital estão fixos no briefing. Não alegar cobertura integral do brief oficial ainda indisponível. Valores didáticos; não calibração de hardware real. A enumeração avalia massa, créditos e todas as violações; inválidos são contabilizados.

## API entre frentes

`src/core/contracts.ts` pertence à coordenação. Alterações de contrato exigem mensagem, não edição paralela silenciosa.

Frente motor produz `src/core/engine.ts`, `src/core/catalog.ts`, `src/core/science.ts`, `src/core/search.ts`. Exportar:

- `catalog.ts`: CATALOG (Record<ConfigKey, readonly ComponentChoice[]>), CONFIG_KEYS, DEFAULT_CONFIG, SCENARIOS (readonly Scenario[]), getScenario(id).
- `engine.ts`: `simulateMission(config: MissionConfig, scenarioId: ScenarioId, options?: SimulationOptions): MissionResult`.
- `science.ts`: `validateScienceRecord(record: ScienceRecord): { valid: boolean; reasons: string[]; ndvi: number | null }`.
- `search.ts`: `enumerateConfigurations(): MissionConfig[]`, `hammingDistance(a,b): number`, `searchCatalog(baseConfig, scenarioId): SearchResult`.

Dados em `src/data/science-data.ts`: SCIENCE_RECORDS e SCIENCE_PACK_HASH. O JSON original vai em public/data com arquivos de origem. A coordenação gera o arquivo inicial; frente de persistência verifica procedência.

## Motor: hipóteses iniciais a verificar

Horizonte de 10800 s. Luz [0,5400) e [7200,9000). Seis trabalhos de 60 s começando em 600, 1200, 1800, 2400, 3000 e 3600 s. Contatos longos [5400,6000),[9000,9600); curtos [5400,5640),[9000,9240). Trabalho só produz lote completo no final, em ordem estável. Não há sobreposição de trabalho e contato nestes cenários fechados.

Bateria de 16 Wh / 20 W ou 24 Wh / 35 W, início em 80%, reserva de 15%, eficiência de carga/descarga de 0.95. Painel compact de 12 W ou standard de 18 W; fator 0.55 no trabalho e 0.85 na espera; zero em eclipse. Limite de carga deve constar e ser respeitado (proposta de 10 W de entrada). Base de 8 W; BANDAS: 26 W totais / 180e6 bits; ÍNDICE: 38 W totais / 60e6 bits. Rádio econômico: 16 W totais / 960000 bps; rápido: 26 W totais / 2400000 bps. Buffer de 512e6 ou 1536e6 bits. TX muda para espera ao esvaziar fila.

Cada componente tem massa/créditos para tornar trocas materiais; frente motor pode calibrar catálogo estático, preservando testemunhas e registrando decisões. Proposta de envelope: 86 créditos / 3.6 kg; base: 1.2 kg / 20 créditos; bateria: .6 / 1 kg e 12 / 19 créditos; painel: .25 / .55 kg e 10 / 16 créditos; modo: .35 / .4 kg e 8 / 14 créditos; rádio: .2 / .45 kg e 10 / 17 créditos; buffer: .05 / .15 kg e 2 / 5 créditos; política: 0 kg / 0 crédito. Esses números são hipóteses, não especificações NASA.

Integração por eventos, não frame da UI. Concluir intervalo anterior antes dos eventos na fronteira. Pico de descarga não atendido termina operação; reserva registra falha sem apagar trace; energia não negativa; saturação contabiliza spill. Bits inteiros seguros até 2^53−1 internamente e strings decimais externamente; números com unidade não recebem tolerância que muda sucesso. Residual de energia deve ser reportado. Não afirmar determinismo bit a bit em motores diferentes.

## Busca e explicação

Busca exaustiva sobre 64 tuplas, resultado não depende da ordem. Mínimo somente se há testemunha viável e todas as alternativas menores foram decididas; erro é indeterminado. Cancelamento ou erro não conserva selo de mínimo. Sem Monte Carlo como verdade; entradas fixas e reexecução com versões. A escolha física alterada é outro projeto antes do lançamento.

Política de operação é automática, escolhida antes de executar. Pausar/apontar a câmera não altera a execução. UI deve pedir previsão antes da primeira tentativa e bloquear ajuda de solver na primeira decisão do caso de transferência. Não chamar uso de botões de prova de aprendizagem. Sem LLM determinando potência, QA, resultado ou certificado.

## Persistência e Worker

Frente dados: `src/persistence/store.ts` exporta `saveRun(result): Promise<string>`, `listRuns(): Promise<SavedRun[]>`, `deleteRun(id): Promise<void>`, `saveDraft(config,scenarioId,expectedRevision): Promise<number>`, `loadDraft()`. SavedRun tem id, createdAt, result, inputHash e resultHash.

`src/persistence/replay.ts` exporta `exportReplay(result): Promise<string>`, `importReplay(text): Promise<{ result: MissionResult; matchesClaim: boolean; importedClaim: unknown }>`. Importar sempre valida schema/tamanho/versões e recalcula pelo motor; não confiar na alegação importada. Hash SHA-256 canônico com versão; campos contados como números seguros; rejeitar chaves duplicadas e prototype pollution. Não buscar URLs importadas. Nenhum SDKde IA instalado por conveniência.

A coordenação cria a bridge do Worker. A UI usa uma função Promise que retorna o resultado; a identidade da chamada e a etapa são conferidas antes da publicação. O IDB usa transação atômica; completar o request não equivale a commit. Em caso de erro de quota, o resultado visível em memória não é apagado. Migrações Prisma ficam separadas; o esquema permanece apenas fora do browser, sem backend desnecessário.

## Propriedade dos arquivos

Coordenação: contracts, configs, scripts build/server/worker, docs finais.
Frente 4: core engine/catalog/science/search e testes próprios.
Frente 5: App.tsx, ui/, styles.css, index.html/main.tsx; sem editar core/persistência.
Frente 6: data/ revisão, persistence/, Prisma e testes respectivos.
Frente 7: testes adversariais independentes e relatório, sem mudar a implementação.
Frente 8: auditoria completa do anexo/repositórios, somente research.
Frente 9: benchmark/offline e release scripts sob acordo com coordenação.
Frente 10: auditoria final e handoff; alterações somente via coordenação.
