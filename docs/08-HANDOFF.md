# 08 — Handoff: o que existe, como conferir e quando avançar

**Missão Ipê — Ciência que chega · 14/11/2026.** Entrega de P&D pré-evento. Rodada iniciada às **08h23 UTC / 05h23 BRT**; abertura local oficial às **09h BRT / 12h UTC**. Código e especificações específicos são anteriores à abertura. A autorização de trabalho dada por AB não estabelece elegibilidade NASA Space Apps. Não existe decisão observada de aprovação especial ou de desclassificação desta equipe.

**Uso atual recomendado:** estudar e verificar um protótipo educacional local. O produto tem uma missão NDVI, duas condições de contato e 64 configurações. A candidatura permanece condicionada à decisão dos organizadores, à qualificação de um recurso nos Resources oficiais e à adequação ao enunciado completo. Preservar, separar, declarar ou reescrever o material não garante regularização.

## 1. Estado atual e leitura dos artefatos

| Área | Entregue e verificável | Próxima evidência necessária |
|---|---|---|
| Produto e especificação | PRD, fluxos, constituição, plano e PRT; aqui PRT significa **Plano de Requisitos Técnicos**, pois a sigla original era ambígua | Confronto com brief oficial, sobretudo escolhas de lançador e órbita hoje fixas |
| Núcleo | Motor `0.1.1-rd`, catálogo `ipe-64-v1`, integração por eventos, energia racional, FIFO e busca finita; regressão consolidada aprovada | Nova regressão se houver alteração material |
| Ciência | Seis registros MOD13Q1.061, três posições solicitadas em Goiás, dois compostos de 2024; originais e metadados preservados | Confirmar o vínculo de recurso qualificado à lista oficial do desafio |
| UI | Observatório, bancada, sala de missão, fontes, histórico, previsão e reflexão; cena Three procedural e alternativa HTML/2D | Navegador real, apresentação, teclado, zoom, leitor de tela e resolução do equipamento |
| Persistência | IndexedDB para execuções/rascunhos; diário separado em localStorage; replay estrito e reexecução | Quota/evicção, duas abas e retenção reais no navegador escolhido |
| Prisma | Schema relacional opcional validado pela CLI registrada | Backend, client, migrações e transações não implementados; fora do P0 |
| Pacote | Build estático e HTML portátil regenerados após correções, às 09h05 UTC, com recibo e hashes | Fechar PDF/ZIP com os bytes e documentos finais |
| IA | Pesquisa de Fastino e protocolo proposto de ablação | Pesos, instalação, inferência e avaliação não executados |
| Aprendizagem | Hipóteses e roteiro de dois pilotos/seis sessões | Recrutamento e observação reais; nenhum efeito educativo comprovado |

Os relatórios de pesquisa preservam o estado observado por cada frente. Não somar suas contagens de testes como execuções independentes nem copiar metas como medições. `evidence/final-validation.json`, concluído às 09h05min34s UTC, registra **51 testes Node, nove testes DOM simulado, ciência, TypeScript/Vite, build portátil e Prisma 7.10.1 aprovados**. O recibo DOM posterior das 09h05min40s também registra nove aprovados. Existem benchmark e nova inspeção AB-R3A, com limites abaixo. PDF/ZIP ficam sob fechamento da coordenação; testes de navegador e pesquisa humana permanecem abertos.

Para orientar a equipe: `docs/01` contém decisão e elegibilidade; `02`, produto; `03`, contrato técnico; `04`, fluxos; `05`, cronograma; `06`, modelos e anexos; `07`, Prisma e persistência. `docs/09-VERIFICACAO.md` consolida os recibos e `docs/10-FRENTES-E-RASTREABILIDADE.md` relaciona as dez frentes e seus artefatos. `research/07` conserva contraprovas independentes; `research/08` audita 33 famílias e 67 consultas de repositório; `research/10` registra esta revisão final. `evidence/chronology.json` preserva a cronologia e `evidence/adversarial-review.json`, as correções verificadas. O fechamento de PDF/ZIP deve ser conferido pelos recibos `artifact-build` e `package-manifest` emitidos pela coordenação; ele não fecha o gate de navegador real.

## 2. Responsáveis, entradas e saídas

AB é a referência humana de produto e coordenação informada. As demais linhas designam funções a distribuir entre as pessoas disponíveis, sem inventar composição de equipe. As dez frentes de IA são trabalho de pesquisa assistida, não dez participantes inscritos.

| Responsável | Entrada que recebe | Saída que entrega | Gate que fecha |
|---|---|---|---|
| AB / responsável pela candidatura | Cronologia real, regras, brief e pendências Resources | Decisão documentada da organização, equipe/formulário e prazo local confirmados | Elegibilidade e adequação |
| Ciência / procedência | Originais ORNL, metadados CMR, guia MOD13 e contrato NDVI | Mapa fonte → campo → transformação, QA, datas e verificador reproduzível | Ciência do recorte e uso substantivo de recurso qualificado |
| Motor / QA numérico | Catálogo, condições, regras e contraexemplos | Mesmos resultados do oráculo, balanços e testes de fronteira; versões atualizadas se necessário | Correção no domínio fechado |
| Frontend / interação | Contratos do núcleo, previsão, trace e estados de erro | Jornada coerente, cancelamento correto, alternativa 2D e acessibilidade inspecionada | Uso completo em navegador real |
| Persistência / replay | Resultados e versões congelados | Commit confirmado, CAS, importação estrita e resultado recalculado separado da alegação | Consistência local e portabilidade do recibo |
| Integração / release | Código estável, testes, fontes, licenças e documentação | `dist`, HTML, documentos e pacote final com hashes e recibos; nova inspeção AB-R3A | Entrega reproduzível |
| UX Research / facilitador | Build congelado, roteiro e hipótese educativa | Registros de pilotos/sessões, ajuda, erros, desistências e análise limitada à amostra | Evidência de uso e compreensão observada |
| AB / narrativa e envio | Somente evidências aprovadas, regras do formulário | Texto em inglês, demonstração correspondente ao build, atribuição e declaração de IA; recibo humano de envio | Submissão autorizada e verificável |

A pessoa que implementa uma regra não deve ser sua única verificadora. A explicação do facilitador não pode anteceder a primeira decisão que será reportada como transferência sem ajuda. Quem grava a demo usa o build identificado, sem substituir os resultados por números editados.

## 3. Reprodução técnica

Executar os comandos a partir da raiz de `ab-mission-ipe`. O ambiente declarado requer Node **24 ou superior**. O lockfile fixa dependências. A primeira instalação precisa de registro npm acessível ou de dependências/cache previamente provisionados; não faz parte da alegação de runtime offline.

```bash
node --version
npm ci
npm test
npm run test:ui
node --experimental-strip-types scripts/verify-science-data.mjs
npm run benchmark:engine
npm run build
npm run build:portable
node scripts/export-examples.mjs
```

Com dependências já instaladas e corretas, não é necessário repetir `npm ci` para usar o pacote. `npm test` executa núcleo, persistência, replay e revisão adversarial encontrados em `tests/*.test.mts`; `test:ui` usa jsdom, núcleo real e fake-indexeddb, sem navegador real. O verificador científico lê originais locais sem buscar URLs e sem escrever neles. O build portátil atual, de 09h05min25s UTC, tem 1.008.522 bytes e sucede as correções. Uma mudança futura exige novo build e recibo.

`export-examples.mjs` regenera `examples/01-long-base.json` (6/6), `02-short-base.json` (2/6) e `03-short-repaired.json` (6/6), importáveis pelo caderno. Também atualiza `evidence/catalog-enumeration.json` com 128 resultados de pesquisa gerados pelo motor. Não é certificado independente de busca; os oráculos e a revisão adversarial são evidências distintas.

Para servir o build estático:

```bash
npm start -- --port 4173
```

O endereço anunciado é `http://127.0.0.1:4173`; `Ctrl+C` encerra. Esse modo usa o Worker. A aplicação não precisa de banco remoto, chave de API, CUDA ou modelo local. O servidor serve arquivos em loopback e não deve ser apresentado como backend multiusuário.

O recibo `evidence/server-http-smoke.json` registra oito casos HTTP aprovados, incluindo arquivos servidos, métodos e rejeição de caminhos inválidos. Isso testa o servidor por requisições HTTP, sem executar a interface num navegador.

`portable/Missao_Ipe_Local.html` incorpora bibliotecas, CSS e dados. Sua execução por arquivo usa o núcleo na thread principal. A abertura por duplo clique e o comportamento de armazenamento ainda precisam de teste em navegador real autorizado. Mudar origem, porta ou localização do HTML pode mudar o armazenamento disponível; exportar recibos antes de mover a instalação. A origem de arquivo não garante IndexedDB em todos os navegadores.

A validação opcional de Prisma é independente do jogo:

```bash
npm exec --yes --package=prisma@7.10.1 -- prisma validate --config prisma/prisma.config.ts
```

Esse comando pode usar a rede se a CLI não estiver no cache. Valida o schema; não cria backend integrado. Não são necessários comandos de geração, migração ou reset para demonstrar o P0.

O benchmark de `evidence/engine-benchmark.json` usa Node 24.22.1 em AMD EPYC 9V45, 30 aquecimentos e 200 amostras por carga. Na busca de 64 tuplas, mediana/p95: **4,201/4,936 ms** no caso longo e **3,994/4,237 ms** no curto. O máximo curto foi 32,073 ms. Isso exclui inicialização, transporte Worker, React, persistência e GPU; não é medida do computador de AB.

A conferência EVI3 de pesquisa pode ser repetida com Python 3, sem alterar o recibo histórico:

```bash
python3 research/evidence/validate-evi3-research.py
```

O script corrigido lê `public/data` relativa ao projeto e imprime JSON. `--out caminho-novo.json` cria um recibo novo e recusa sobrescrita. `evidence/evi3-rerun.json` registra seis comparações aprovadas às 09h02min40s UTC, com diferença máxima de 0,00009379329454142421. É conferência de P1; EVI3 não entrou no jogo.

## 4. Casos de conferência e roteiro da demonstração

Configuração padrão: bateria pequena, painel standard, BANDAS R/NIR, rádio econômico, memória grande e todos os contatos. O objetivo continua sendo receber seis resultados científicos válidos nas duas condições.

| Caso | Resultado do modelo conferido | O que explica |
|---|---|---|
| Padrão, contatos longos | Sucesso, 6/6, 1.080.000.000 bits | A cadeia completa atende ao objetivo no cenário inicial |
| Padrão, contatos curtos | Falha de entrega, 2/6, 460.800.000 bits | Serviço de transmissão insuficiente para BANDAS |
| Curto, só trocar para ÍNDICE | Falha terminal de potência aos 600 s | Reduzir volume aumenta demanda de processamento |
| Curto, só trocar para rádio rápido | Falha terminal de potência aos 5.400 s | Taxa maior exige potência de descarga disponível |
| Curto, bateria grande + ÍNDICE | Sucesso, 6/6, 360.000.000 bits; 3,5 kg e 84 créditos | Única testemunha a duas mudanças do padrão |
| Curto, bateria grande + rádio rápido | Entrega os lotes, mas projeto inválido por 3,7 kg | Receber os dados não elimina a restrição de massa |

A enumeração longa registra 17 sucessos, 41 falhas e 6 inválidas; a curta, 9 sucessos, 49 falhas e 6 inválidas. São 64 avaliações em cada condição, sem indeterminadas. O mínimo curto é limitado a esse catálogo e foi conferido por um oráculo independente. O replay exporta a missão executada; não exporta a prova completa da busca.

Na demonstração, pedir previsão, executar o padrão curto, inspecionar a restrição, experimentar uma alteração isolada e só então revelar o redesenho verificado. O participante precisa distinguir W de Wh e dado recebido de registro utilizável. O roteiro é uma proposta de apresentação, não evidência de que alguém aprendeu. No estudo humano, preservar a primeira tentativa e o nível de ajuda; não ensinar a solução antes de registrá-la.

## 5. Gates de avanço

| Gate | Critério de saída | Estado neste corte |
|---|---|---|
| G0 — Uso competitivo | Resposta da organização sobre material anterior, brief/Resources e formulário confirmados | **Aberto**; não presumir exceção ou desclassificação automática |
| G1 — Ciência | Originais, transcrição, QA e NDVI conferidos; datas reais separadas da simulação | Conferência local aprovada; qualificação Resources pertence a G0 |
| G2 — Núcleo | 128 casos do domínio e contraprovas compatíveis com versões finais | **Aprovado no domínio fechado**; regressão final registrada |
| G3 — Distribuição | Build e HTML após últimas correções, hashes, licenças e comandos reproduzíveis | Builds e recibos aprovados; fechamento documental de PDF/ZIP pela coordenação |
| G4 — Navegador e equipamento | Tarefa completa sem WAN, Worker real, 2D, importação/exportação, armazenamento e acessibilidade | **Aberto**; DOM simulado não fecha este gate |
| G5 — Educação | Pilotos e sessões observadas com ajuda/erros preservados; conclusões limitadas | **Aberto**; hipótese educativa |
| G6 — Submissão | G0 resolvido, pacote identificado, campos e links conferidos, responsável humano envia | **Aberto**; nenhum envio realizado por esta revisão |

É possível continuar P&D com G0 aberto, mantendo o status explícito. Fechar G1/G2 não fecha G0, G4 ou G5. A nova execução AB-R3A começou às 09h05min21s UTC e terminou em 7,634 s, saída 0: 43 arquivos, 40 JS/TS analisados, zero falhas de parse, 40.369 nós AST e 596 achados estruturais. O digest em `evidence/ab-r3a-digest.json` declara cobertura de aplicação parcial e semântica parcial/truncada, além de alteração posterior apenas no teste DOM. Esses achados não são vulnerabilidades confirmadas, e a execução não certifica segurança, equivalência, navegador ou aprendizagem.

## 6. Cronograma crítico em BRT

| Janela planejada | Trabalho prioritário | Dependência |
|---|---|---|
| 14/11, 09h–10h | Resolver regras, brief, Resources, equipe e agenda | Uma decisão efetiva sobre uso competitivo do material |
| 10h–18h | Corrigir apenas lacunas do contrato aceito e completar integração | Se uso não for autorizado, tratar como continuação de P&D sem prometer candidatura |
| 18h–20h | Ensaiar no equipamento da demo sem WAN; exportar/importar e testar 2D | Build congelado e navegador real disponível |
| 20h–21h | Até dois pilotos, se houver participantes | Instruções e coleta revisadas |
| 15/11, 08h–10h | Até seis sessões formativas | Pessoas disponíveis; finalidade e tratamento dos registros claros |
| 10h–12h | Corrigir falhas prioritárias e repetir verificações afetadas | Sem ampliar domínio por conveniência |
| 12h | Congelar funcionalidades | EVI, IA, órbita real e Prisma continuam fora do caminho crítico |
| 12h–15h30 | Revisar narrativa inglesa, demo, fontes, licenças e links | Toda alegação vinculada à evidência correspondente |
| 15h30–16h30 | Pré-apresentação conforme agenda; conferência e eventual envio humano | G0/G6 resolvidos e formulário efetivo |
| 16h30–17h | Reserva para recibo de envio e backup | Corte local indexado às 17h, ainda a confirmar |

O prazo global de 23h59 de domingo não substitui o prazo local. O cronograma é planejamento, não relato de execução, escala de pessoas confirmada ou mecanismo de regularização temporal.

## 7. Limites a repetir na apresentação

MOD13Q1 é produto histórico composto em intervalos de 16 dias. O jogo usa seis registros arquivados de 2024 e não simula aquisição MODIS pelo CubeSat em 180 minutos. Os seis QA têm usefulness 1 e reliability 0. Volumes de lote e números de hardware são hipóteses didáticas. EVI3 foi recalculado apenas como pesquisa P1 e exige BLUE adicional.

Hash confere identidade de conteúdo em relação aos bytes esperados. Reexecução verifica consistência com o motor atual. Nenhum deles autentica autoria, identidade do aluno, aprovação NASA ou verdade física universal. O diário de previsão/reflexão é armazenado localmente no fluxo normal, pode conter texto pessoal e pode ser alterado por quem controla o navegador; não há filtro de PII instalado. A exportação é uma ação deliberada.

O ambiente desta rodada não permitiu iniciar Chromium com socket, e o CUA recusou explicitamente a navegação `file:`. Essas restrições não foram contornadas. DOM, FakeWorker e fake-indexeddb verificam contratos em ambiente simulado; não são screenshots, medições de GPU ou ensaio de navegador. Não foram medidos RTX 3070, RTX 2060 Super, Mac, celular, FPS ou latência de interface no equipamento de AB.

Fastino permanece pesquisa documental, sem pesos ou inferência. GLiDE 27B demanda cerca de 52,2 GB apenas nos pesos publicados e não deve ser prometido para as GPUs citadas. Licença, arquitetura e qualidade variam por modelo/revisão; formato GGUF não garante compatibilidade de runtime. O P0 funciona sem IA interpretando o aluno e sem IA decidindo ciência ou física.

Após a verificação do P0, cada expansão abre seu próprio contrato: EVI3 com três bandas; grade de robustez sem probabilidades inventadas; modelo compacto com abstenção e avaliação pt-BR; agenda orbital comparada com referência; backend relacional com transações reais. Nenhuma expansão é necessária para tornar o estado atual honesto e revisável.
