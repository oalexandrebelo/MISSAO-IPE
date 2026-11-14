# 09 — QA de integração, release e desempenho

Frente 9 de 10, execução em 14/11/2026 UTC. Projeto de P&D **pré-evento**, com elegibilidade competitiva pendente. A validação abaixo foi executada em Node e DOM simulado; não houve navegador, avaliação com participantes ou medição de FPS nesta frente. Nenhum arquivo de `src/` precisou de alteração.

## Resultado observado

A jornada React passou com motor, catálogo, busca, reexecução de replay e adaptador de persistência reais. O runner Node reporta **9/9 PASS, zero falhas e zero skips**: uma jornada principal com seis subtestes, mais dois testes independentes. O total do runner inclui o teste pai; não são nove ensaios independentes.

| Verificação executada | Resultado observado | Limite da evidência |
|---|---|---|
| Previsão obrigatória | Botão indisponível sem hipótese ou com justificativa menor que oito caracteres; clique desabilitado não cria tentativa | Verifica presença e ordem, não qualidade da explicação |
| Contato longo padrão | 6/6 entregues, sucesso; previsão registrada antes da conclusão, vinculada por `attemptId`; resultado salvo corresponde integralmente ao motor | A igualdade com o mesmo motor prova integração, não correção física independente |
| Transferência ao contato curto | Previsão limpa, ajuda ausente na bancada; nova execução padrão entrega 2/6 e registra falha | Modelo educacional fechado |
| Busca após tentativa própria | 64/64 avaliadas, zero indeterminadas, menor distância de duas escolhas | Mínimo restrito ao catálogo e cenário atuais |
| Replay inválido | Aviso explícito; resultado, recibo, busca, histórico e configuração ativa preservados; rádios conferidos ao retornar à bancada | Um arquivo estruturalmente inválido nesta jornada; adversariais detalhados pertencem à suíte de replay |
| Aplicação de candidato | Limpa resultado e previsão, muda duas escolhas, exige outra execução e entrega 6/6; resultado e configuração persistidos conferidos | Não reutiliza o resultado candidato como execução própria |
| Replay válido sem tentativa pessoal | Recalcula 2/6, mantém busca desabilitada e diário de decisões vazio | Importar evidência não satisfaz o gate pedagógico |
| IndexedDB e escrita de localStorage indisponíveis | Mantém sucesso 6/6 em memória, informa falha de gravação e mantém botão de exportação habilitado | Não foi verificado download nativo de arquivo nem durabilidade de navegador |
| WebGL indisponível | Renderer real falha ao obter contexto e a UI ativa o equivalente 2D antes de percorrer os fluxos | Contexto ausente foi provocado no ambiente; não testa GPU ou perda de contexto real |

Os testes estão em `tests-ui/flows.test.mjs`; `scripts/test-ui.mjs` transforma TSX por esbuild, mantendo pacotes externos, e executa o runner Node. Não há mocks de score, ciência, equações, resultados, busca ou importação. O cliente usa seu fallback normal quando `Worker` não existe. `fake-indexeddb` fornece o armazenamento em memória do teste; a transação e a validação de registros continuam sendo código do produto.

As adaptações do ambiente são explícitas: contexto canvas nulo, `scrollTo` sem efeito e métodos `showModal`/`close` que mudam o atributo `open`. A importação recebe um `File` de Node porque jsdom não implementa `File.text()`. Os logs de erro WebGL são esperados e preservados no TAP; a última execução não contém warnings de `act`. Durante a construção do harness, um cleanup que alcançava subtestes foi corrigido no próprio teste, sem modificar o produto.

## Comandos e recibos

| Comando | Estado nesta frente | Recibo |
|---|---|---|
| `node scripts/test-ui.mjs` | PASS, 9 contabilizados pelo runner | `evidence/ui-dom-release-final.tap`, `evidence/ui-dom-release-final.json` |
| `node scripts/benchmark-engine.mjs` | PASS, quatro workloads; 30 aquecimentos e 200 amostras cada | `evidence/engine-benchmark.json` |
| `node scripts/audit-release.mjs` | Inventário e varredura concluídos | `evidence/release-dependencies-network.json` |
| `node scripts/smoke-server.mjs` | PASS, oito requisições HTTP | `evidence/server-http-smoke.json` |

A coordenação informou execução separada de `npm test` com 51/51 PASS às 08:59:39 UTC. Esse resultado não foi reexecutado nem somado como execução própria desta frente. Build, HTML portátil, empacotamento, AB-R3A, PDF e entrega persistente pertencem à coordenação. `evidence/release-qa-manifest.json` identifica por SHA-256 os scripts, teste e recibos desta rodada, além das limitações declaradas.

O recibo DOM final foi preservado separadamente: execução de 09:05:39.122 a 09:05:40.353 UTC, duração do runner de 1.182,983 ms. Inclui a inspeção dos rádios da configuração ativa após rejeitar o replay. O gate da coordenação e o snapshot AB-R3A podem conter a versão imediatamente anterior desse teste; o código runtime é o mesmo. Essa diferença é explicitada, sem atribuir ao snapshot antigo as asserções acrescentadas.

## Benchmark do motor 0.1.1-rd

Medição final às **09:04:05.479 UTC**, com `ENGINE_VERSION=0.1.1-rd`, catálogo `ipe-64-v1` e hash do pack registrado no recibo. A segunda rodada foi feita depois de concluir DOM/HTTP/auditoria para evitar a concorrência que existiu na primeira tentativa. Ainda é um executor compartilhado, sem exclusividade de CPU, afinidade, controle térmico ou controle de energia.

Ambiente observado: Node **v24.22.1**, V8 **13.6.233.17-node.58**, Linux **6.18.57**, x64, identificação de CPU **AMD EPYC 9V45 96-Core Processor**, nove CPUs lógicas expostas e `availableParallelism=9`. Memória total exposta: 10.451.427.328 bytes. RSS do processo ao final: 150.294.528 bytes; isso inclui Node e o carregamento TypeScript, não é consumo isolado da aplicação no navegador. Nenhuma máquina pessoal de AB foi medida.

Cada workload usa 30 aquecimentos descartados e 200 execuções medidas por `performance.now()`, sequenciais, com trace padrão habilitado. Os percentis usam nearest rank: posição `ceil(N × p) − 1` na série ordenada. As 800 amostras brutas e hashes de todos os módulos numéricos estão no JSON. Não se força coleta de lixo e os máximos permanecem registrados.

| Workload | Condição | p50 (ms) | p95 (ms) | Máximo (ms) |
|---|---|---:|---:|---:|
| Uma missão padrão | Longa | 0,140 | 0,364 | 0,894 |
| Busca exaustiva, 64 configurações | Longa | 4,201 | 4,936 | 13,494 |
| Uma missão padrão | Curta | 0,083 | 0,102 | 0,329 |
| Busca exaustiva, 64 configurações | Curta | 3,994 | 4,237 | 32,073 |

A enumeração longa registrou 17 sucessos, 41 falhas e seis inválidas, com distância mínima zero para a configuração padrão. A curta registrou nove sucessos, 49 falhas e seis inválidas, com distância mínima dois. Ambas avaliaram 64, com zero indeterminados. Esses totais também são assertados pelo script para que um benchmark rápido com trabalho incompleto não seja aceito.

O tempo medido inclui cálculo e construção do resultado/trace. Exclui startup de Node, importação de módulos, Worker e mensagens, React, persistência, hashing de replay, carregamento inicial de página e renderização. Portanto, ele não demonstra que a meta de busca no Worker, carregamento offline em três segundos ou frame p95 de 33,3 ms foi cumprida no equipamento de demonstração. Não há FPS publicado.

## Dependências, licenças e rede

O inventário leu o `package-lock.json` e os metadados efetivamente instalados: **157 entradas de pacote no lock, 83 instaladas**, zero divergências entre versão instalada e fixada e zero entradas sem metadado de licença. As entradas não instaladas incluem variantes opcionais de outras plataformas; não foram tratadas como execução comprovada. Não foi executada uma auditoria de vulnerabilidades remota nesta frente.

| Dependência de runtime instalada | Versão | Licença declarada | Arquivo local conferido |
|---|---|---|---|
| React | 19.3.1 | MIT | `node_modules/react/LICENSE` |
| ReactDOM | 19.3.1 | MIT | `node_modules/react-dom/LICENSE` |
| Scheduler | 0.28.0 | MIT | `node_modules/scheduler/LICENSE` |
| Three.js | 0.187.0 | MIT | `node_modules/three/LICENSE` |

Hashes e tamanho dos arquivos de licença estão no inventário. Os avisos de distribuição estão em `licenses/` e `NOTICE.md`; o código original tem `LICENSE` Apache-2.0. O campo `license` de `package.json` estava ausente no instantâneo inventariado; a licença do projeto foi observada nos documentos, sem inferir licença das dependências a partir dela. Este inventário de metadados e avisos não constitui revisão jurídica nem certificação de compatibilidade de todo uso futuro.

A varredura estática de **28 arquivos** (`src/**/*.ts`, TSX, CSS e `index.html`) encontrou zero referências a APIs de rede pesquisadas, zero assets/imports remotos e uma URL HTTPS, localizada apenas no comentário de proveniência em `src/core/science.ts`. O código de aplicação não usa CDN, fonte externa, serviço de IA ou pesos de modelo no caminho inspecionado. A ausência de correspondências em uma varredura por padrões não é prova formal de toda execução possível. Não foi realizado teste de rede de navegador, primeira abertura offline ou medição de cache. Instalar dependências para recompilar continua sendo uma etapa distinta do runtime distribuído.

## Smoke HTTP do servidor local

Uma instância de `scripts/serve.mjs` foi iniciada em `127.0.0.1:45179`, recebeu as oito requisições abaixo e foi encerrada pelo teste. Este é um teste do serviço Node, não uma tentativa de abrir ou contornar restrições de navegador.

| Requisição | Esperado e observado |
|---|---:|
| GET `/` | 200, HTML presente |
| HEAD `/` | 200, corpo vazio |
| POST `/` | 405, `Allow: GET, HEAD` |
| GET arquivo inexistente | 404 |
| GET caminho ascendente codificado | 403 |
| GET byte nulo codificado | 400 |
| GET barra invertida codificada | 400 |
| GET percent encoding malformado | 400 |

Todas as respostas incluíram CSP e `X-Content-Type-Options: nosniff`. O recibo preserva cabeçalhos, status, hashes de corpo, horário e hash do servidor. Não foram testados concorrência de alto volume, travessia por symlink ou publicação fora de loopback. O script faz uma única tentativa de inicialização e registraria EPERM/EACCES sem tentar bypass; nesta execução o socket HTTP foi permitido.

## Pendências reais para liberação de demonstração

É necessário testar em navegador e hardware de demonstração: primeira abertura sem rede, Worker real, seleção e download nativo de arquivos, persistência após reiniciar, teclado/foco/modal, leitor de tela, contraste, zoom, clipping responsivo, qualidade e descarte do WebGL, carga inicial e orçamento de frames. O bloqueio anterior do Chromium e a rejeição CUA de `file://` foram respeitados; nenhum navegador ou workaround foi usado nesta frente.

O DOM simulado não substitui esses testes. Tampouco comprova aprendizagem, validade física de voo, integração Fastino, disponibilidade de um modelo offline ou elegibilidade de submissão. A evidência desta rodada sustenta a integração funcional examinada e o custo do núcleo neste executor, com entradas, versões e comandos reproduzíveis.
