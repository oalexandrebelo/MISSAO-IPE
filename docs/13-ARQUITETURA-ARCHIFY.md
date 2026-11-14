# Arquitetura verificável da Missão Ipê — R6 BETA

O [mapa interativo](../architecture/index.html) descreve o código inspecionado da BETA. O fluxo principal foi gerado pelo renderer nativo do **Archify 3.2.0**. Um inspetor local complementa o desenho com os imports por arquivo, pontos de chamada, hashes, fronteiras e oportunidades. O HTML funciona sem CDN, servidor de diagramas ou consulta remota.

Esta é uma edição de P&D. A meta de release é **15/11/2026, 08:00, America/Sao_Paulo**. A existência do mapa, do repositório ou do site não estabelece elegibilidade no Space Apps e não resolve a exigência de Resources do desafio. A cronologia anterior continua preservada.

## Como ler

1. No desenho, clique em um componente para abrir suas relações. `Find` procura componentes e `Route` acompanha setas. Os controles nativos do Archify estão em inglês; os rótulos do projeto e o inspetor estão em português.
2. Em **Do componente ao arquivo**, busque um caminho ou pacote. Filtre área e tipo de relação. Troque entre dependências e inventário.
3. Selecione um arquivo para ver hash, proveniência, imports de saída e dependências recebidas.
4. Consulte **Chamadas, armazenamento e arquivos entregues** para os comportamentos corroborados no código. Uma declaração de import e uma chamada são evidências diferentes.
5. Consulte **Oportunidades** para próximos passos. Itens propostos não recebem arestas de execução.

O [modelo JSON](../architecture/model.json) contém metadados, linhas e hashes; não contém os valores dos registros científicos, conteúdo de arquivos de ambiente ou credenciais. O [Mermaid](../architecture/map.mmd) oferece uma topologia textual editável.

## Arquitetura implementada

| Área | Implementação observada | Fronteira |
| --- | --- | --- |
| Jogo | `src/main.tsx`, `src/App.tsx`, componentes em `src/ui/` | React controla jornada, configuração, resultados e diário. A cena 3D tem alternativa 2D. |
| Cálculo assíncrono | `src/workers/client.ts`, `src/workers/mission.worker.ts` | Worker de módulo, validação de mensagens, timeout e encerramento. O modo portátil ou ausência de Worker usa o thread principal. |
| Núcleo | `src/core/engine.ts`, `search.ts`, `catalog.ts`, `exact.ts`, `power.ts`, `science.ts`, `contracts.ts` | Motor determinístico e catálogo finito. Busca e missão usam o mesmo motor. Não há serviço remoto de simulação. |
| Ciência | `src/data/science-data.ts`, `public/data/`, verificador local | Registros MOD13 congelados e validação científica. NDVI observado é distinto de órbita, potência, massa, enlace e objetivos didáticos. |
| Persistência | `src/persistence/store.ts`, `identity.ts`, `json.ts`, `validation.ts`, `replay.ts` | IndexedDB para execuções e rascunhos; hashes e reexecução verificam replay. Diário usa localStorage. Sem sincronização remota. |
| Apresentação | `presentation/src/main.ts`, CSS e template; build esbuild | O demonstrador importa o núcleo real e roda no thread principal. HTML final autocontido, com sete quadros de pitch e apêndices. |
| Portal | `web/index.html` | Página estática que liga módulos por navegação. Não há estado compartilhado entre portal, jogo, pitch e mapa. |
| Publicação | `scripts/build-beta-site.mjs` e configuração da rodada R6 | Allowlist monta `site/`; preserva bytes dos artefatos selecionados, renderiza Markdown escapado e publica projeções explícitas de evidências. O manifesto registra fonte, transformação e SHA-256. |
| Documentação | `docs/`, `research/`, `evidence/`, documentos públicos selecionados | A curadoria do site é explícita; o inventário do código não é uma autorização para publicar todos os arquivos. |
| Propostas | `prisma/`, pesquisa Fastino e mapas de Marte | Prisma é contrato futuro; não há backend Prisma, IA remota ou cenário marciano integrado ao motor. |

O termo nativo `backend` do schema Archify foi rotulado como **Lógica no navegador** na legenda. Ele classifica responsabilidades de cálculo, sem afirmar a existência de uma API de produto.

## Uso efetivo do Archify

Repositório: [tt-a1i/archify](https://github.com/tt-a1i/archify). Commit fixado: **e37848822238e3a61b12739185cdadd49843a620**, recuperado pelo plugin GitHub. Foram lidos o [README](https://github.com/tt-a1i/archify/blob/e37848822238e3a61b12739185cdadd49843a620/README.md), o [SKILL.md](https://github.com/tt-a1i/archify/blob/e37848822238e3a61b12739185cdadd49843a620/archify/SKILL.md), as referências de autoria e entrega, o exemplo de arquitetura e os schemas. Não foi feito clone integral do repositório.

O Archify é uma skill de **autoria de representação intermediária tipada**, com renderizadores e validadores. Não foi executado nem alegado um scanner Archify de repositórios. A inspeção de imports foi implementada neste projeto com a AST do TypeScript 7.0.2 já instalado.

Foram recuperados somente **42 arquivos upstream, 2.591.903 bytes**: a cadeia necessária do renderer de arquitetura, template, catálogos de interface, schemas e licenças. Cada arquivo foi comparado ao Git blob anunciado pela API; nenhum mismatch. O manifesto está em `architecture/vendor/archify/upstream-manifest.json`. Os arquivos upstream foram preservados sem alteração.

O procedimento realizado foi:

1. Inspeção dos arquivos do projeto, chamadas relevantes e imports pela AST; autoria explícita do IR.
2. Revisão dos imports e das capacidades dos módulos upstream antes da execução. Conferência sintática de 32 módulos, hashes e ausência de chamadas perigosas nos dois módulos gerados. A captura HTTP opcional de logos foi identificada; nenhum `brand` foi configurado.
3. Execução do renderer nativo de arquitetura com **rede bloqueada por preload local**. Schema e geometria foram aceitos no perfil `showcase`. O relatório nativo de layout registra sete componentes, seis relações e canvas 1070 × 770.
4. Composição do HTML nativo com navegação do portal, inventário, filtros, relações, oportunidades e avisos completos. Sem iframe, `srcdoc`, CDN, avaliação dinâmica de código ou handlers HTML inline.
5. Verificação estática do artefato e testes DOM do inspetor do projeto. Isso não equivale a inspeção visual ou de interação do Archify em navegador real.

**Adaptações explícitas:** o comando completo `finalize` não foi executado, pois inclui uma etapa de navegador indisponível nesta sessão. Também não houve verificação de origem remota pelo validador de evidências do Archify: ao autorar esta edição não havia um `origin` confirmado no checkout. O IR não contém uma URL inventada nem referências de fonte falsamente validadas. A proveniência do código está no modelo próprio, por Git blob da base R5 e SHA-256 local. Não se declara conclusão dos gates de entrega completos do Archify.

## Proveniência do código e alcance da cobertura

Base real local: **3d6e8e9bd8dcb1618e00c6fc7ace181141cb4aaf**. O inspetor compara o Git blob de cada arquivo da base com a árvore desse commit. Arquivos novos ou alterados da R6 ficam identificados como locais e recebem SHA-256. A edição não inclui o próprio commit futuro nem promete identidade com ele, evitando um ciclo de autorreferência.

O inventário inclui arquivos textuais do produto, apresentação, scripts, testes, contratos, documentação, pesquisa e evidências. Exclui dependências instaladas, vendor Archify, binários, mídia, diretórios gerados `site/`, `dist/`, `portable/`, `output/`, arquivos ocultos e de ambiente. Os próprios artefatos de `architecture/` ficam fora do inventário para evitar hashes circulares; sua proveniência é registrada pelo recibo separado.

**Duas saídas geradas têm exclusão explícita de hash:** `vercel.json` contém a CSP calculada sobre os scripts dos HTML finais, inclusive o mapa; inventariar seu hash dentro do próprio mapa criaria autorreferência. `evidence/beta-runtime-preservation.json` é reemitido após o build com timestamp e comparação dos bytes publicados. Ambos aparecem como saídas e relações do pipeline em `model.json → generatedOutputs` e na tabela de comportamentos, sem hash inventariável. Os scripts que os geram, `scripts/prepare-vercel-static.mjs` e `scripts/build-beta-site.mjs`, permanecem inspecionados e hashados. Recibos posteriores de build, QA, arquitetura e deployment também ficam fora do inventário para preservar esse limite.

Todos os `.ts`, `.tsx`, `.mts`, `.mjs`, `.js` e `.jsx` desse inventário são analisados. A análise reconhece imports estáticos, reexports, `import()` literal, `require()` literal e a entrada `new Worker(new URL(...))`. Imports apenas de tipo são marcados; não representam dependência de execução. Pacotes e módulos nativos do Node são destinos externos identificados, não arquivos de aplicação inventados.

Os totais do snapshot estão em `model.json → statistics` e no próprio mapa. Um caminho não resolvido ou erro sintático interrompe a geração. Relações de chamada, armazenamento e build são listas separadas, apoiadas em caminho, linha e trecho mínimo de identificação. A análise não infere chamadas calculadas, fluxo de dados completo, frequência de execução ou cobertura de testes a partir dos imports.

## Reproduzir no checkout

Os comandos abaixo usam as dependências existentes do projeto e a cópia mínima fixada do Archify. Não instalam uma skill global e não alteram o motor.

```sh
node architecture/build-model.mjs
node --import ./architecture/offline-guard.mjs architecture/vendor/archify/renderers/architecture/render-architecture.mjs architecture/runtime.architecture.json architecture/runtime.html
node --import ./architecture/offline-guard.mjs architecture/vendor/archify/renderers/architecture/render-architecture.mjs architecture/runtime.architecture.json architecture/runtime.html --layout-json > architecture/runtime.layout.json
node architecture/build-page.mjs
node architecture/check-map.mjs
```

`runtime.html`, `runtime.architecture.json` e `runtime.layout.json` são intermediários reproduzíveis. O site recebe somente `architecture/index.html`, `architecture/model.json` e `architecture/map.mmd`. O HTML público contém o visualizador e modelo integralmente; não depende dos intermediários ou do vendor na hospedagem.

## Licenças e limites de verificação

O commit consultado do Archify usa **Apache-2.0**, com o aviso MIT histórico preservado e avisos de terceiros. A fonte incorporada **JetBrains Mono** usa SIL Open Font License 1.1. `LICENSE`, `LICENSE-MIT`, `NOTICE`, `THIRD_PARTY_NOTICES.md` e `JetBrainsMono-OFL.txt` estão preservados no vendor e integralmente acessíveis em **Fontes e licenças** no HTML público. Licenças de software não implicam endosso dos projetos ou organizações citados.

A geração e a verificação local não comprovam publicação remota. O recibo de deployment produzido pela coordenação fecha esse estado separadamente. Permanecem pendentes a inspeção em navegador real, teclado e foco no dispositivo final, exportações gráficas do Archify e leitura visual em tamanhos de tela representativos. O navegador bloqueado não foi contornado.

As oportunidades P0 do mapa são verificar a experiência publicada e obter confirmação oficial de Resources/elegibilidade. P1 trata de aprendizagem observada, novos pacotes científicos e manutenção do mapa. P2 mantém sincronização remota e Marte como decisões de produto, sem antecipar implementação.
