# Ferramentas documentais e de inspeção

Estas ferramentas não participam do runtime do jogo. A aplicação compilada é servida com `node scripts/serve.mjs`; reconstruir o jogo usa as dependências do `package-lock.json`.

## Dossiê

Ambiente efetivamente usado: Python 3.12.14, ReportLab 4.4.9, Pillow 13.0.0, Matplotlib 3.10.8, Pandoc 3.1.11.1, Graphviz, Poppler e fontes DejaVu Sans/Sans Mono em `/usr/share/fonts/truetype/dejavu/`. Essa lista registra o ambiente; não é um lockfile completo do sistema operacional.

```bash
python3 tools/render_diagrams.py
python3 tools/build_study_artifacts.py
python3 tools/qa_document.py
```

`render_diagrams.py` produz projeções Graphviz dos fluxos e preserva Mermaid editável. O HTML incorpora SVG e MathML sem buscar renderizadores na rede. O PDF usa texto vetorial, diagramas e equações renderizadas localmente. `artifact-build.json` registra hashes das fontes e dos documentos. `qa_document.py` gera geometria, contatos e amostras para inspeção humana/visual; resultado geométrico sozinho não comprova legibilidade. Os arquivos temporários ficam em uma pasta `tmp` adjacente ao projeto.

## AB-R3A / REA

`rea-audit.mjs` é um wrapper de leitura e análise estática para runtime REA 6.7.0 já disponível. O runtime privado não é redistribuído. Consulte o cabeçalho e os argumentos do wrapper, além de `evidence/ab-r3a-digest.json`, antes de reutilizar. Cobertura parcial, truncamentos e desconhecidos semânticos estão declarados. A ferramenta não executa o jogo e não equivale a teste de navegador, auditoria completa de segurança ou aprovação NASA.

## Fontes e embalagem

`build-evidence-index.py` indexa links e requisitos; inclusão no índice não comprova verificação de cada página. Os pareceres preservam as limitações de cada fonte. `package-manifest.json` identifica os bytes do pacote; hashes não autenticam autoria nem elegibilidade.

## Apresentação e pacote R5

A apresentação tem build próprio e incorpora o núcleo existente. Com as dependências de desenvolvimento já instaladas:

```bash
node scripts/build-presentation.mjs
node scripts/test-presentation.mjs
node scripts/smoke-presentation-kit.mjs
python3 tools/package_presentation_kit.py
```

O teste da apresentação utiliza DOM simulado. O smoke do servidor realiza HTTP em loopback e não abre navegador. O empacotador exige os recibos aprovados e o registro `evidence/presentation-release-r5.json`, confere o SHA-256 da apresentação testada, verifica os arquivos conferidos por HTTP e impede empacotar alterações nos 52 arquivos do jogo congelados em `game-baseline-r5.json`. Uma evolução do jogo exige uma nova decisão de versão e regressão; não edite o baseline para esconder alterações.

O empacotador escreve `output/packages/AB_Missao_Ipe_R5_Apresentacao_Completa.zip`, o manifesto SHA-256 de sua raiz e o recibo de integridade fora do ZIP para evitar referências circulares. Ele conserva o dossiê de base R4 e inclui a revisão atual separadamente. Recompilar o HTML muda seus bytes; execute a QA novamente antes de congelar a nova cópia.

Para servir os builds incluídos, não é necessário instalar dependências:

```bash
node scripts/serve-presentation-kit.mjs
```

O servidor publica a entrada, a apresentação e o jogo em `http://127.0.0.1:4174`, com lista de arquivos permitidos. O comando não publica um site na internet.
