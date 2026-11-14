# Apresentação editável do PROJETO-IPÊ

O arquivo final contém dez slides com texto editável, duas tabelas nativas, fontes nas notas e roteiro de orador. As duas capturas de tela são imagens da base R9/R10, identificadas na apresentação. O conteúdo acompanha [PITCH](../docs/PITCH.md).

Na distribuição integrada, os caminhos da aplicação recebem o prefixo `/campanha/`. O mapa citado nas notas está disponível em [campanha/apresentacao/index.html](https://projeto-ipe.vercel.app/campanha/apresentacao/index.html). Essa integração não altera os slides renderizados.

Arquivo publicado: [PROJETO-IPE-Pitch.pptx](../public/apresentacao/PROJETO-IPE-Pitch.pptx). Mapa HTML: [public/apresentacao](../public/apresentacao/).

## Reprodução no runtime de artefatos

`build-deck.mjs` usa `@oai/artifact-tool` e o finalizador da skill Presentations. Esse runtime é uma ferramenta de autoria e não uma dependência do jogo. O build Vite não gera slides nem precisa dele.

1. Criar um diretório privado de trabalho fora do repositório sincronizado.
2. Configurar `IPE_REPO` com o caminho absoluto do repositório e `IPE_DECK_WORK` com o diretório privado.
3. Usar `CODEX_PRIMARY_RUNTIME_NODE`, `CODEX_PRIMARY_RUNTIME_NODE_MODULES`, `CODEX_PRIMARY_RUNTIME_ROOT` e `CODEX_PRIMARY_RUNTIME_PYTHON` do runtime instalado.
4. Copiar `build-deck.mjs` para o diretório privado e criar ali um symlink `node_modules` para `CODEX_PRIMARY_RUNTIME_NODE_MODULES`.
5. Executar a cópia com `CODEX_PRIMARY_RUNTIME_NODE`. Se a skill estiver em outro local, informar `IPE_PRESENTATION_SKILL`.
6. Inspecionar os dez PNGs em `previews/` e o recibo `validation.json`. O script verifica dez slides, duas tabelas, geometria, fontes, integridade e reimportação.
7. Copiar o arquivo final de `out/PROJETO-IPE-Pitch.pptx` para `public/apresentacao/` somente após a inspeção. Para uma revisão, usar um novo diretório de trabalho, preservando o candidato anterior.

Fontes de design: DejaVu Sans e DejaVu Serif. No ambiente de autoria, ambas constavam no registro de fontes do runtime. Outros editores podem substituir fontes indisponíveis. O arquivo foi renderizado e inspecionado pelo runtime de artefatos, sem alegação de inspeção nativa no PowerPoint.

As notas do slide 8 preservam o alcance dos testes do beta 0.5. Antes de mudar contagens, versão ou URL, conferir o recibo da revisão correspondente em [QA-BETA-0.5](../docs/QA-BETA-0.5.md) e no [README principal](../README.md).

## Recibo do arquivo entregue

Em 14/11/2026, o finalizador confirmou dez slides, dez partes de notas, duas tabelas nativas, fontes de design e reimportação pelo Artifact Tool. Integridade e geometria passaram sem achados. Os dez slides foram renderizados e inspecionados individualmente. O arquivo final é idêntico ao candidato renderizado.

SHA-256: `01580db767d9bc8d4002cc75d179ea71886930c8211e3a1fa6978e9d3954af11`. Tamanho: 207.658 bytes. Esses controles não equivalem a teste nativo no PowerPoint.
