# Publicação PROJETO IPÊ — R13

Edição publicada e conferida em **14/11/2026**: marca sem caixa nos cabeçalhos claros, SVGs interativos, seis imagens NASA, revisão do Game Design e catálogo de oportunidades 3D para dois desenvolvedores.

- [Portal público](https://projeto-ipe.vercel.app/)
- [Game Design interativo](https://projeto-ipe.vercel.app/game-design.html)
- [Game Design completo e plano da dupla](https://projeto-ipe.vercel.app/docs/29-GAME-DESIGN-3D.html)
- [11 oportunidades NASA 3D](https://projeto-ipe.vercel.app/docs/28-OPORTUNIDADES-NASA-3D.html)
- [Biblioteca — 87 documentos](https://projeto-ipe.vercel.app/context/research-library.html)
- [Simulador beta](https://projeto-ipe.vercel.app/lab/index.html)
- [Logo SVG para cabeçalho claro](https://projeto-ipe.vercel.app/brand/projeto-ipe-logo-on-light.svg)
- [Código e documentação](https://github.com/oalexandrebelo/PROJETO-IPE)

## Versão e registro da publicação

Beta `0.4.0-beta.2`, distribuição `R13-visual-study`. Commit da revisão: `0dbbb17fecc31097557784c64b0a7679419da54c`. A primeira implantação conferida desta revisão foi `dpl_37zemSdLG5Rp3zFsy5CvU3cXNNmA`, em estado `READY`, com o domínio principal atribuído. O [recibo remoto R13](evidence/production-r13.json) registra essa implantação e o instante da conferência.

O site abre publicamente, sem login. Este documento e o recibo são posteriores à primeira compilação da revisão. O Git conectado à Vercel pode gerar uma nova implantação ao publicar este registro; o recibo permanece evidência da implantação que identifica, sem pretender certificar um build posterior. A biblioteca compilada preserva o corte de seu build e aponta para este documento no GitHub.

## Entregas desta edição

- Marca horizontal vetorial preservada: 108 paths, incluindo os 104 paths originais do símbolo. A variante clara muda a palavra PROJETO para azul e remove a necessidade de fundo escuro no cabeçalho. Sem imagem raster embutida.
- Diagrama orbital com seleção de Terra, CubeSat e estação; animação opcional com pausa. Fluxo de dados explorável por mouse ou teclado. Preferência por movimento reduzido respeitada.
- Galeria local com seis imagens oficiais, contexto, datas, créditos e fontes. Total das imagens: 839.655 bytes. [Procedência](docs/27-ACERVO-VISUAL-NASA.md).
- Estudo de Game Design com quatro segmentos, três comparações qualitativas e cinco cenas 3D propostas. [Especificação](docs/29-GAME-DESIGN-3D.md) inclui jornada, contratos, aceites, pitch e divisão E0–E5 entre dois devs.
- Catálogo de 11 recursos 3D oficiais: nove GLBs, sete deles abaixo de 5 MB, além de STL e ZIP. Créditos, tamanhos, Draco, arquivos externos e limites da inspeção declarados. [Catálogo JSON](research/nasa-3d-catalog.json).
- Biblioteca ampliada para 87 documentos, mantendo busca, navegação e acervo histórico. Bricolage Grotesque e Plus Jakarta Sans continuam hospedadas localmente.

O Game Design é uma proposta de evolução. A página de estudo usa diagramas SVG 2D; não representa cinco novas cenas 3D já implementadas. Nenhum GLB NASA foi incorporado ao runtime, GMAT não foi integrado e o motor da missão permaneceu inalterado.

## Verificação

Compilação aprovada; **24 verificações da central e 16 da distribuição/HTTP passaram**. Os testes de domínio e da UI do beta não foram reexecutados nesta rodada visual/documental; os registros anteriores conservam seu corte.

Verificação remota sem cookies ou autorização: **182 arquivos com HTTP 200 e SHA-256 correspondente**, scripts embutidos compatíveis com a política de segurança e índice público com 87 documentos. Nenhuma divergência no recibo da primeira implantação R13.

No navegador foram conferidos seleção e pausa do diagrama orbital, fluxo por teclado, galeria local, expansão do caderno visual, busca, segmentos do Game Design e comparação qualitativa. As superfícies observadas não apresentaram rolagem horizontal global em telas estreitas e amplas nem erros de console. A revisão DOM delegada conferiu estados ARIA e navegação dos controles; não equivale a teste de GPU ou auditoria completa de acessibilidade.

- [Revisão local R13](evidence/revision-r13.json)
- [Verificação remota R13](evidence/production-r13.json)
- [Histórico R12](evidence/production-r12.json)
- [Histórico R11](evidence/production-r11.json)

Não foram realizados estudo de aprendizagem, teste em dispositivo físico ou ensaio offline a frio. Inscrição e elegibilidade no desafio continuam exigindo confirmação. Referências e recursos NASA não representam endosso institucional.
