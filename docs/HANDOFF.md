# PROJETO-IPÊ — handoff do beta

Referência da entrega: 14/11/2026, beta `0.5.0-beta.1`. Snapshot standalone da campanha de quatro níveis, preservado na branch `archive/campanha-quatro-niveis-2026-11-14`. A edição R14 continua na branch `main`. Direção de produto: AB / Alexandre Belo. Desenvolvimento, pesquisa e documentação com assistência de IA. Este documento permite retomar a implementação, demonstrar o produto e preparar o próximo ciclo sem confundir o beta funcional com o roadmap.

## 1. O que está sendo entregue

O PROJETO-IPÊ é um jogo educativo de projeto de missão. A pessoa escolhe seis subsistemas de um CubeSat fictício, registra uma previsão, executa o modelo e investiga a entrega de seis registros científicos históricos. Uma campanha de quatro níveis acrescenta pedidos de engenharia sobre o motor existente.

| Entrega | Onde começar | Estado e alcance |
|---|---|---|
| Código do beta | [GitHub PROJETO-IPE](https://github.com/oalexandrebelo/PROJETO-IPE) e [README](../README.md) | Frontend estático. O README reúne os dados da publicação; o histórico da branch `archive/campanha-quatro-niveis-2026-11-14` identifica o commit efetivamente publicado. |
| Jogo | [Raiz da publicação](/) | Campanha, hangar, execução, relatório, ciência, histórico, replay e laboratório independente. |
| Mapa de apresentação | [Apresentação interativa](/apresentacao/) | Sete capítulos, navegação por teclado, notas de orador, quatro níveis e links para a evidência. |
| Estudo e defesa | [PITCH](PITCH.md) | Falas de 30 s, 90 s e 3 min, roteiro de dez slides, demonstração e perguntas difíceis. |
| Deck editável | [PROJETO-IPE-Pitch.pptx](/apresentacao/PROJETO-IPE-Pitch.pptx) | Dez slides, notas e duas tabelas nativas. [Fonte e reprodução](../presentation/README.md). |
| Produto | [PRD](PRD.md), [storytelling](STORYTELLING-4-NIVEIS.md), [insights](INSIGHTS-E-OPORTUNIDADES.md) | Necessidade, hipóteses, critérios, narrativa e oportunidades. |
| Engenharia | [PRT](PRT.md), [arquitetura](ARQUITETURA.md), [fluxos](FLOWCHARTS.md) | Contratos, verificações, decisões, diagramas e limites. |
| Dados futuros | [Schema Prisma](../prisma/schema.prisma), [orientação de dados](../prisma/README.md) | Doze modelos para PostgreSQL. Proposta sem banco, API, migração ou autenticação de produção. |
| Pesquisa e procedência | [Dossiê público](/research/), [R10](REFINAMENTO-NASA-R10.md), [R9](PESQUISA-E-DECISOES-R9.md) | Fontes consultadas, decisões e materiais históricos preservados. |

**Fronteira do beta:** execução e persistência no navegador, sem conta obrigatória, sem API NASA durante a partida e sem LLM calculando os resultados. Testes automatizados verificam contratos de software. Ainda não existe evidência própria de aprendizagem, estudo com participantes, endosso NASA/NN/g ou validação de engenharia de voo.

## 2. Início em uma máquina nova

Requisitos: Git, Node.js 24 ou superior, npm e acesso ao registro de pacotes ou cache completo. Usar as versões fixadas pelo lockfile. Não substituir por `npm update` durante uma reprodução da entrega.

```bash
git clone --branch archive/campanha-quatro-niveis-2026-11-14 --single-branch https://github.com/oalexandrebelo/PROJETO-IPE.git
cd PROJETO-IPE
npm ci
npm run verify
npm run dev
```

O Vite informa a URL de desenvolvimento. Para testar o artefato de distribuição, executar:

```bash
npm run build
npm run preview
```

| Comando | O que verifica ou produz |
|---|---|
| `npm test` | Motor, ciência, laboratório, armazenamento, replay, campanha e casos adversariais. |
| `node --experimental-strip-types --test tests/campaign.test.mts` | Contratos dos quatro níveis, progresso, tentativas e ajuda de campanha. |
| `npm run test:ui` | Jornadas React em jsdom com o motor real e armazenamento simulado. |
| `npm run build:research` | Regenera a documentação pública a partir das fontes Markdown. |
| `npm run build` | Gera pesquisa, verifica TypeScript e produz `dist/`. |
| `npm run verify` | Executa domínio, UI e build em sequência. |
| `npm run preview` | Serve `dist/` por HTTP para inspeção. |

A aplicação visitante não requer variáveis de ambiente. Prisma pertence ao planejamento de um serviço futuro. Uma credencial nunca deve entrar em `VITE_*`, no HTML público ou em um replay.

## 3. Estrutura para manutenção

| Caminho | Responsabilidade | Regra ao alterar |
|---|---|---|
| `src/core/contracts.ts` | Tipos e versões do domínio | Autoridade para entradas e resultados. |
| `src/core/catalog.ts` | Seis decisões binárias e parâmetros didáticos | Qualquer alteração pode mudar as 64 testemunhas e exige revisão de versão. |
| `src/core/engine.ts`, `power.ts`, `science.ts`, `exact.ts` | Eventos, energia, potência, bits, entrega e integridade | Preservar invariantes e testes independentes. |
| `src/core/search.ts` | Enumeração e distância entre projetos | Só certificar mínimo com domínio completo e testemunha elegível. |
| `src/campaign/` | Níveis, critérios, progresso e busca contextual | Acrescentar condições sem redefinir `MissionResult.outcome`. |
| `src/App.tsx`, `src/workers/` | Coordenação de estado e execução | Congelar entrada e rejeitar respostas obsoletas. |
| `src/ui/` | Interação, mapa, relatórios, cena e diário | Manter escolhas e resultados essenciais acessíveis no DOM. |
| `src/persistence/` | IndexedDB, identidade, JSON estrito e replay | Importação é dado não confiável e exige recálculo. |
| `src/lab/` | Física exploratória, revisão prévia e ciência entregue | Sliders do laboratório não alteram a campanha. |
| `src/data/`, `public/data/` | Pacote científico e recibos | Preservar origem, datas, escala, QA e identidade. |
| `docs/`, `research/`, `diagrams/` | Fontes editoriais e diagramas Mermaid | Editar a fonte, depois regenerar a documentação pública. |
| `public/apresentacao/` | Mapa estático de apresentação | HTML/CSS/JS independentes do estado do jogo. Não concede progresso. |
| `public/research/` | Dossiê publicado e galeria | Conteúdo gerado pelo script. As imagens históricas identificam a base R9/R10. |
| `prisma/` | Desenho futuro de dados | Não importar no frontend nem tratar validação do schema como backend pronto. |
| `tests/`, `tests-ui/`, `evidence/` | Contratos e recibos de verificação | Relacionar resultado ao commit, comando e ambiente utilizados. |

## 4. Contratos que precisam sobreviver ao próximo ciclo

| Contrato | Valor e implicação |
|---|---|
| Motor / catálogo | `0.1.1-rd` / `ipe-64-v1`. Alterar física ou catálogo requer identidade e resultados de referência novos. |
| Campanha | `ipe-campaign-v1`, schema local `1`. Conteúdo e condições do nível são versionados. |
| Universo de projetos | Seis campos binários: bateria, painel, processamento, rádio, memória e política. Total de 64 tuplas. |
| Cenários | `long-contact`: duas janelas de 600 s. `short-contact`: duas de 240 s. |
| Horizonte / envelope | 10.800 s simulados, até 3,6 kg e 86 créditos, além das regras de recursos e ciência. |
| Sucesso | `result.outcome === 'success'`, seis registros completos e válidos e nenhuma violação. `6/6` isolado não basta. |
| Dados | Terra/MODIS MOD13Q1 Collection 061. Três pontos próximos a Rio Verde e dois períodos históricos de 2024. |
| Ciência | Comparar NDVI apenas com pares recebidos e válidos. Não inferir causa ambiental a partir da diferença isolada. |
| Replay | `mission-ipe-replay`, schema `1`, canonicalização `ipe-json-v1`, até 1 MiB e profundidade máxima 20. |
| Tempo visual | Animação, pausa e FPS percorrem resultado calculado. Não controlam integração física. |

### Campanha e referência de demonstração

Todas as conclusões exigem uma tentativa própria vinculada ao nível. A reflexão é opcional e não recebe nota automática.

| Nível / ID | Condição adicional | Preset | Solução de referência |
|---|---|---|---|
| 1 / `first-signal` | Sucesso no contato longo | Configuração inicial, 71 cr | O próprio preset entrega 6/6, 3,05 kg. |
| 2 / `memory-tradeoff` | Contato longo com memória compacta de 512 Mbit | 2/6, perda de 720 Mbit | Bateria grande, painel padrão, índice, rádio econômico, memória compacta, todos os contatos. 6/6, 81 cr, 3,40 kg. |
| 3 / `narrow-window` | Contato curto com processamento `bands` | 2/6, fila de 619,2 Mbit | Bateria grande, painel compacto, bandas, rádio rápido, memória grande, todos os contatos. 6/6, 79 cr, 3,40 kg. |
| 4 / `science-delivered` | Contato curto com custo ≤ 78 cr | Já entrega 6/6 por 84 cr | Bateria grande, painel compacto, índice, rádio econômico, todos os contatos. Memória grande: 78 cr/3,20 kg. Compacta: 75 cr/3,10 kg. |

N2 e N3 começam em 2/6 por razões diferentes. No N2, lotes novos não cabem antes do contato e são perdidos. No N3, dados permanecem na fila porque as janelas terminam. Esse contraste é a principal demonstração de raciocínio causal. No N4, a operação já funciona e a necessidade muda para otimização. A sequência não promete aumento monotônico de dificuldade ou de número de trocas.

### Progresso e ajuda

`beginCampaignAttempt` emite um token em memória após conferir nível disponível, cenário, configuração, previsão e justificativa. `completeCampaignAttempt` consome o token, confere o snapshot e recalcula o resultado antes de avaliar o nível. O token não pode ser reconstruído a partir de JSON, histórico ou replay. Editar um componente depois da execução não altera sua evidência.

O progresso restaurado valida versão, sequência, identificadores e configuração de cada conclusão, recalculando as testemunhas. Isso protege consistência local, mas não constitui um sistema antifraude ou uma avaliação institucional. Quem controla o dispositivo controla seu armazenamento.

`searchCampaignCatalog` avalia as 64 tuplas com o critério do nível. Uma opção que resolve apenas a operação, como ampliar a memória no N2, não pode ser anunciada como solução desse nível. Aplicar uma sugestão inicia um novo projeto e exige nova previsão e execução.

## 5. Persistência e recuperação

| Armazenamento | Identificador | Conteúdo e limite |
|---|---|---|
| IndexedDB | `mission-ipe-research-v1`, versão 1 | Rascunho revisionado e snapshots de execução. |
| `localStorage` | `mission-ipe:learning:v1` | Diário de previsões, decisões, ajuda e reflexões. |
| `localStorage` | `mission-ipe:campaign:v1` | Nível ativo e conclusões verificáveis da campanha. |
| Arquivo exportado | Replay JSON v1 | Evidência de uma execução. Não contém um token de tentativa própria. |

Não há transação única entre IndexedDB, diário e campanha. A disponibilidade e a durabilidade dependem do navegador. Armazenamento local também não equivale a anonimato garantido, sobretudo quando texto livre contém identificação.

| Ocorrência | Diagnóstico e ação |
|---|---|
| Progresso não reaparece | Conferir origem/URL, perfil do navegador e mensagens de armazenamento. Outro domínio ou janela privada possui contexto diferente. Preservar arquivos exportados antes de qualquer limpeza. |
| Falha de quota ou acesso | Manter o resultado em sessão e exportar replay. Investigar política do navegador e espaço. Não anunciar salvamento que falhou. |
| Duas abas editam rascunho | Respeitar `DraftConflictError`. Recarregar a revisão e conciliar escolhas antes de salvar novamente. |
| Importação recusada | Conferir formato, tamanho, versão, catálogo e pacote. A recusa não deve apagar o resultado anterior. Não remover a validação para aceitar um arquivo. |
| Replay aceito sem avanço | Comportamento esperado. Para concluir o nível, registrar previsão e executar um novo projeto no contexto correto. |
| WebGL indisponível | Usar alternativa 2D. Se escolhas, execução ou ciência dependem do canvas, registrar regressão. |
| Worker falha ou é cancelado | Preservar última evidência válida e conferir estado do pedido. Nunca aplicar resposta antiga a um novo projeto. |

Para investigar um problema, registrar versão/commit, navegador, origem, nível, configuração, cenário, mensagem e passos reproduzíveis. Compartilhar texto livre somente após revisar seu conteúdo. Limpeza total do armazenamento é uma ação destrutiva e não é o primeiro procedimento de suporte.

## 6. Runbook de demonstração

1. Abrir o beta e o [mapa de apresentação](/apresentacao/) em abas separadas. Conferir que o objetivo do N1, o contador de progresso e a URL estão visíveis.
2. Apresentar o pacote como histórico e o CubeSat como fictício. Distinguir os 180 minutos simulados da duração da sessão e das datas MODIS.
3. No N1, manter o preset, registrar uma previsão própria e executar. Mostrar 6/6, resultado operacional e conclusão do nível.
4. No N2, executar o preset compacto. Inspecionar perda de lote e o instante de 1.860 s. Comparar capacidade com volume antes do contato. Executar a solução de referência apenas depois de explicar sua hipótese.
5. No N3, observar que 2/6 corresponde a fila remanescente. Revisar taxa, potência e envelope antes da execução com bandas.
6. No N4, mostrar o preset 6/6 a 84 cr com condição pendente. Reduzir o custo a 78 ou 75, executar e explicar a folga conservada.
7. Abrir retorno científico e discutir um par recebido. Finalizar com uma afirmação descritiva e uma limitação da inferência.
8. Fechar no convite à pilotagem. Se houver falha de demonstração, o mapa e a galeria preservam explicação e evidência histórica, identificadas como tal.

Uma demonstração curta pode usar somente N1 e o contraste N2/N3 no mapa. Não chamar replay, screenshot ou solução aplicada de nova conquista. Testar o roteiro antes do encontro e não limpar o progresso de outra pessoa para encenar a primeira sessão.

## 7. Verificação e publicação

O beta integrado passou **120 testes de domínio e 14 testes UI**, sem falhas. Os 120 incluem os 19 testes da campanha e os 101 testes anteriores. Os 14 UI incluem o percurso dos quatro níveis e a restauração. O schema de 12 modelos passou em Prisma 7.10.1 e os seis diagramas passaram no parser Mermaid 11.14.0. Os detalhes estão no [QA do beta 0.5](QA-BETA-0.5.md), no [README](../README.md) e em `evidence/`. Uma publicação posterior precisa preservar a associação entre esses recibos e o commit entregue.

A inspeção local de navegador desta rodada foi bloqueada pela política de URL do ambiente de QA. As capturas R9/R10 são históricas e não comprovam a nova campanha. Testes DOM, validação de schema e parsing de Mermaid têm alcances próprios. A observação da URL publicada deve ser registrada separadamente quando realizada.

| Gate | Procedimento | Evidência que precisa acompanhar a entrega |
|---|---|---|
| Domínio | `npm test` | Resultado do runner e testemunhas/contraexemplos da campanha. |
| Jornada DOM | `npm run test:ui` | Resultado e ambiente jsdom. Não comprova foco real, GPU ou leitor de tela. |
| Build | `npm run build` | Tipos aprovados e `dist/` com jogo, apresentação, pesquisa e dados. |
| Navegador | Executar N1–N4, importação, teclado, fallback e telas pequenas | Ambiente, passos, achados, correções e screenshots da versão observada. |
| Distribuição | Abrir a URL publicada e conferir revisão | URL HTTPS, commit, estado do deploy e smoke test no destino. |
| Aprendizagem | Sessões com público e instrumento revisado | Ainda pendente. Não inferir resultado pedagógico do software. |

Para a Vercel, a unidade de entrega é o site Vite com `npm run build` e saída `dist/`, sob Node 24. A aplicação depende de HTTP(S) e caminhos de assets preservados. Conferir `/`, `/apresentacao/`, `/research/`, `/research/galeria.html`, `/kit/schema.prisma` e as fontes Mermaid expostas em `/kit/diagrams/`. O publish deve ocorrer após a verificação integrada, e seu estado real deve ser registrado pelo responsável pelo deploy.

Em regressão de publicação, preservar a evidência, identificar o último commit e deployment estáveis e usar a reversão da hospedagem para essa revisão. Depois reproduzir o defeito localmente e publicar correção verificada. Uma troca de URL pode mudar o armazenamento local percebido pelo jogador. Não prometer migração automática entre origens.

## 8. Decisões consolidadas

- A autoridade do resultado permanece no motor puro. Interface, roteiro, 3D e campanha não ajustam o resultado para favorecer a narrativa.
- A progressão usa necessidades diferentes sobre um catálogo fechado. O mesmo projeto pode funcionar fisicamente e não atender ao pedido atual.
- Dados reais possuem procedência e limites. Operação da nave, agenda, massas e créditos são didáticos.
- A busca revela alternativas elegíveis e explicita o domínio avaliado. Ajuda não penaliza a pessoa.
- O laboratório físico permanece separado. Transformar seus controles em parâmetros de missão exige outro contrato e revisão numérica.
- O beta visitante funciona sem conta. PostgreSQL/Prisma é uma possibilidade de evolução, sem coleta remota ativa.
- Acessibilidade orienta o DOM, o mapa e o fallback. Conformidade WCAG completa requer auditoria própria.
- Previsão e reflexão apoiam a atividade. A conclusão de quatro níveis demonstra cumprimento dos desafios, sem certificar aprendizagem.

## 9. Próximos trabalhos e decisão de aceite

| Prioridade | Trabalho | Critério de conclusão |
|---|---|---|
| P0 antes de cada publicação | Suíte integrada e smoke test do destino | Recibo com commit, ambiente, contagens e URLs. |
| P1 pesquisa | Sessões formativas com educadores e iniciantes | Registro de incidentes, explicações e tarefa de transferência, com contexto e denominadores. |
| P1 acessibilidade | Auditoria de teclado, leitor de tela, zoom e movimento reduzido | Problemas reproduzíveis resolvidos e evidência por ambiente. |
| P1 uso em oficina | Guia de mediação e caderno exportável | Educador consegue preparar, conduzir e interpretar a atividade. |
| P1 desempenho | Medir dispositivos-alvo | Benchmark com hardware, navegador, duração e bloqueios observados. |
| P2 persistência conectada | Serviço opcional sobre o schema proposto | Client compilado, migração revisada, autorização, idempotência, conflitos, retenção e restauro testados. |
| P2 modelo | Nova ciência ou órbita configurável | Pergunta, fonte, parâmetros, limites, contratos e referência independente aprovados. |

Não há prazo, adoção, parceiro institucional ou ganho de aprendizagem confirmado a registrar. O próximo compromisso proposto é uma pilotagem observada que permita decidir o que ajustar antes de expandir a complexidade.

## 10. Fontes e direitos

A origem do código e as licenças permanecem em [LICENSE](../LICENSE), [NOTICE](../NOTICE.md) e `licenses/`. A marca do projeto não usa logotipos NASA ou NN/g como selo. Os personagens são fictícios. As fontes científicas e de design orientam decisões autorais e não estabelecem parceria.

Para a rastreabilidade de produto e ciência, consultar [insights](INSIGHTS-E-OPORTUNIDADES.md), [R10](REFINAMENTO-NASA-R10.md) e [PITCH](PITCH.md). Para alterar o modelo, começar pelo [contrato de implementação](../specs/IMPLEMENTATION-CONTRACT.md), não pela narrativa ou pelo material de apresentação.
