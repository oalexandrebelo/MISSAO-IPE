# Tarefas e gates da especificação 001

Estado de coordenação da rodada 4. “Implementado” significa que o artefato existe; “verificado” exige um recibo correspondente. A especificação não transforma o trabalho anterior ao evento em candidatura elegível.

| ID | Tarefa | Artefato | Estado e próximo gate |
|---|---|---|---|
| T01 | Preservar as duas entradas coladas e comprovar duplicação | research/anexo-original.txt; chronology.json | Concluído: hash e tamanho iguais. |
| T02 | Confrontar regras temporais e Resources | research/01-regras-ciencia.md | Pesquisa concluída; resposta da organização e Resources específicos pendentes. |
| T03 | Conferir o pacote NASA | public/data; verify-science-data.mjs | Verificado: seis registros e procedência; não aquisição orbital simulada. |
| T04 | Congelar catálogo e semântica | IMPLEMENTATION-CONTRACT.md; core/catalog.ts | Implementado: 64 tuplas, duas condições. |
| T05 | Implementar energia, potência e fronteiras | core/exact.ts, power.ts, engine.ts | Verificado no domínio fechado e em casos de fronteira. |
| T06 | Implementar produção, buffer e FIFO | core/engine.ts | Verificado: lotes completos, perda e progresso parcial. |
| T07 | Tornar ciência condição de sucesso | core/science.ts; science-data.ts | Verificado; política QA explícita, tolerância inclusiva corrigida. |
| T08 | Enumerar e certificar mínimo | core/search.ts | Verificado: cobertura integral, quatro ordens, indeterminado invalida mínimo. |
| T09 | Implementar recibo e parser limitado | persistence/json.ts, replay.ts, identity.ts | Verificado: adulteração, duplicatas, versões e recálculo. |
| T10 | Persistir sem confirmar antes do commit | persistence/store.ts | Verificado em fake-indexeddb; navegador real pendente. |
| T11 | Isolar trabalho e cancelar retorno obsoleto | workers/client.ts, mission.worker.ts; App.tsx | Contratos do Worker verificados; fluxo DOM e navegador distinguidos nos recibos. |
| T12 | Criar três telas e alternativa 2D | ui/* | Compila; inspeção visual e acessibilidade manual pendentes. |
| T13 | Preservar previsão e restringir ajuda | ui/learning.ts; App.tsx | Implementado; testes DOM documentam os fluxos exercitados. |
| T14 | Auditar contra oráculo independente | tests/adversarial.test.mts | Verificado: 128 combinações e regressões preservadas. |
| T15 | Executar QA de interface e benchmark | tests-ui/*; scripts/benchmark-engine.mjs | Recibos e limitações em research/09 e docs/09. |
| T16 | Aplicar AB-R3A à fonte final | tools/rea-audit.mjs | Cobertura observada em evidence/ab-r3a-analysis.json; não certificação de segurança. |
| T17 | Compilar variantes e conferir hashes | dist; portable; evidence | Reconstruir após qualquer alteração material; usar recibo final. |
| T18 | Validar schema Prisma | prisma/schema.prisma | Estrutura aprovada; backend/migração fora da implementação atual. |
| T19 | Preparar instalação nos equipamentos de AB | docs/08-HANDOFF.md | Pendente: navegador, tela, armazenamento, offline, desempenho e exportação reais. |
| T20 | Fazer dois pilotos e seis sessões | protocolo no PRD | Pendente: não há evidência humana de aprendizagem. |
| T21 | Revisar inglês e demonstração | cronograma e roteiro do dossiê | Pendente: edição do material de candidatura e revisão científica humana. |
| T22 | Resolver uso competitivo deste material | registro temporal + orientação da organização | Pendente: divulgação/procedência não equivalem a autorização. |
| T23 | Investigar EVI3, modelos compactos e agenda orbital | research/01,02,03,08 | P1/P2; sem modificar a condição NDVI do P0. |

O método documental é inspirado no github/spec-kit. O CLI não foi instalado nem executado. Nenhum estado acima deriva de uma etiqueta automática “converged”.
