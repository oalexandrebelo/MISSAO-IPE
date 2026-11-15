# Publicação PROJETO IPÊ — R16

## R16 — propósito, investigação e assets · 15/11/2026

**Beta 0.7.0-beta.1 publicada**, distribuição `R16-purpose-and-discovery-plus-four-level-campaign`. Implementação `e5d9a40e3dac44745e7b1a0222bf90fbce202257`; implantação conferida `dpl_95cDC9NoM1rfrjwkb35ty8FXgDhp`, **READY**, em [projeto-ipe.vercel.app](https://projeto-ipe.vercel.app/), sem login. GitHub canônico: [oalexandrebelo/MISSAO-IPE](https://github.com/oalexandrebelo/MISSAO-IPE); o nome anterior redireciona para este repositório. O domínio público foi preservado.

- [Três missões com propósito e experimentos guiados](https://projeto-ipe.vercel.app/lab/index.html): prever, comparar um fator, investigar a nave no mesmo instante e redesenhar. Cerrado ensina potência/energia; Bennu, produção/recepção; telescópio, instrumento/evidência válida.
- [Planet Jumping](https://projeto-ipe.vercel.app/planet-jumping.html): referência cinematográfica independente, um HTML, Marte → Terra → Vênus, com as seis mídias exatas fornecidas e recuperação de falha. O CDN externo é permitido apenas nesta rota.
- [Proposta pedagógica e tecnologias](https://projeto-ipe.vercel.app/docs/37-PROPOSTA-PEDAGOGICA-E-TECNOLOGIAS-R16.html) · [handoff dos dois devs](https://projeto-ipe.vercel.app/docs/38-HANDOFF-R16.html).
- [Revisão da PR #1](https://projeto-ipe.vercel.app/docs/35-REVISAO-PRS-E-DIRECAO-R16.html) · [inventário e aplicação dos assets](https://projeto-ipe.vercel.app/docs/39-ATIVOS-DA-PR-E-APLICACOES.html). 15 ativos do manifesto e 57 modelos KayKit auditados; nenhuma importação indiscriminada da biblioteca ou nova dependência. A PR segue aberta, sem merge ou comentário publicado por esta revisão.
- [Biblioteca integral](https://projeto-ipe.vercel.app/context/research-library.html): **98 documentos**. Campanha de quatro níveis preservada em rota própria.

**Verificação:** 145 testes de domínio e 38 de interface do laboratório; campanha preservada em 120 + 14; contexto 24; distribuição 17; portal 10 verificações DOM + 2 de política/HTTP. Compilação e TypeScript aprovados. Navegador real: ensaios das três missões, aplicação explícita, tentativa completa do telescópio e reflexão, montagem 3D e viewport estreita; no portal, carregamento e duas viagens, destino terminal, menu e larguras 375/768/1440. Nenhum erro de console observado nas ações conferidas. A verificação pública leu **291 arquivos**, com HTTP 200, hashes, políticas e tipos de mídia corretos. Models/decoder atuais preservados.

[Recibo da validação R16](evidence/revision-r16.json) · [recibo público R16](evidence/production-r16.json). Este registro documenta a implantação acima; o commit do recibo dispara uma nova compilação documental. A verificação não se atribui automaticamente a builds futuros. `scripts/verify-publication-r16.mjs` permite repetir a auditoria informando o deployment ID e o commit previamente conferidos na Vercel.

**Alcance:** motor científico preservado, física e posição visual separadas, câmera com transição finita; aprendizagem não certificada. Equipe de até quatro pessoas no mesmo dispositivo, sem sessão online. Bennu/telescópio usam registros sintéticos e modelos NASA de referência. KayKit, novos propagadores, terrenos e serviços externos continuam oportunidades descritas, não integrações anunciadas. Não houve medição de FPS ou validação em celular físico. Os limites de armazenamento compartilhado registrados na R15 permanecem.

---

## Histórico — R15

Publicado e conferido em **14/11/2026**. As três missões científicas agora mostram na nave o efeito das escolhas de instrumento, energia e comunicação, com inspeção das peças, montagem separada e explicações didáticas.

- [Jogar Cerrado, Bennu e Telescópio](https://projeto-ipe.vercel.app/lab/index.html)
- [Guia didático completo — 17 capítulos](https://projeto-ipe.vercel.app/docs/32-GUIA-DIDATICO-MISSOES-3D.html)
- [Oito oportunidades NASA Science](https://projeto-ipe.vercel.app/docs/33-OPORTUNIDADES-NASA-SCIENCE.html)
- [Continuidade para dois devs](https://projeto-ipe.vercel.app/docs/34-HANDOFF-IMERSAO-3D-R15.html)
- [Biblioteca integral — 93 documentos](https://projeto-ipe.vercel.app/context/research-library.html)
- [Campanha paralela preservada](https://projeto-ipe.vercel.app/campanha/index.html)
- [Código e documentação no GitHub](https://github.com/oalexandrebelo/PROJETO-IPE)

## Entrega e verificação R15

Beta `0.6.0-beta.1`; distribuição `R15-configured-spacecraft-plus-four-level-campaign`. Implementação: `7f7ca7767b8773bf1ff6bfbb4d9980952b493e69`. Integração com a campanha existente: `79b53969cfedd0b3bc14efd37733d284e2a700ac`. Implantação conferida: `dpl_GKiyRcwkDGCAxpKCjKxfFsAqw1Mh`, **READY**, domínio `projeto-ipe.vercel.app`, público e sem login.

**Na nave:** processamento BANDAS/ÍNDICE no Cerrado; câmera ou espectrômetro nos demais casos; painéis e bateria proporcionais às capacidades escolhidas; rádio econômico/rápido no Cerrado. Nas expedições, ampliar contatos altera a agenda, mantendo o rádio. Durante a operação, carga, iluminação, fila e transmissão acompanham os estados registrados. Alterar o rascunho não modifica a nave da tentativa executada ou da comparação A/B.

**Para aprender:** guia de cerca de 5.800 palavras com histórias, necessidade científica, requisitos, projeto, verificação, operação, interpretação, quatro segmentos, unidades, exemplos calculados, exercícios e roteiro de aula de 50 minutos. A pesquisa NASA Science prioriza oito oportunidades e distingue recursos existentes de propostas. O handoff define responsabilidades, contratos, arquivos e critérios de aceite para dois devs.

**Evidência:** 140 testes de domínio e 26 de interface do laboratório; 24 de contexto e 17 de distribuição. A campanha preservada também passou em 120 testes de domínio e 14 de interface. Compilação e TypeScript aprovados. A conferência pública leu **278 arquivos**, todos com HTTP 200 e SHA-256 correspondente, MIME dos modelos/decoder e políticas de scripts corretos. Biblioteca com 93 documentos. No navegador foram conferidas peças, alternativa 2D, teclado, viewport de 390 px e o ensaio Bennu 6/6 local; na produção, nave configurada e guia abriram sem erro novo de console nas ações observadas.

[Recibo local R15](evidence/revision-r15.json) · [Recibo remoto R15](evidence/production-r15.json). Este registro é posterior à implantação identificada; seu push aciona uma nova compilação documental. O recibo certifica os arquivos da implantação indicada, sem se atribuir a builds futuros.

**Limites:** peças e dimensões são didáticas. Os modelos NASA são referências; Bennu e Telescópio usam dados sintéticos. Não houve nova API NASA ao vivo, propagação GMAT ou controle real de antena. Não foram medidos FPS, aprendizagem ou desempenho em celular físico. Cooperação permanece local.

**Continuidade da campanha:** o merge preservou as publicações até `29fcc46`, com jogo, mapa, pesquisa, pitch e redirecionamentos próprios. Laboratório e campanha compartilham caderno e rascunho de contratos compatíveis; o diário compartilhado pode perder entradas em edição simultânea entre abas. Projetos das expedições e progressão da campanha são separados. Detalhes e plano de migração estão no documento 34; recomenda-se uma experiência por vez durante a demonstração.

---

## Histórico — campanha de quatro níveis

A campanha didática foi publicada em **14/11/2026**, em uma área própria que preserva a edição R14.

- [Jogar os quatro níveis](https://projeto-ipe.vercel.app/campanha/index.html)
- [Mapa interativo para estudar e apresentar](https://projeto-ipe.vercel.app/campanha/apresentacao/index.html#niveis)
- [PRD, PRT, pesquisa, Mermaid, Prisma, pitch e handoff](https://projeto-ipe.vercel.app/campanha/research/index.html)
- [Pitch editável de dez slides](https://projeto-ipe.vercel.app/campanha/apresentacao/PROJETO-IPE-Pitch.pptx)
- [Recibo desta publicação e limites da verificação](experiments/four-level-campaign/evidence/production-smoke-2026-11-14.json)
- [Código e documentação da campanha](experiments/four-level-campaign/README.md)

Implementação: `ab66a424df505a627a611877fce5d8a4364c8be1`. Ajuste de rotas observado em produção: `f30ca994098262b75a86b25784b78657c34c0db5`. Implantação conferida: `dpl_DHsVtWQurf2w9do6bhcnXdD84aJT`, estado **READY**. O `release.json` público confirmou o mesmo SHA e ambiente de produção.

A inspeção na URL pública confirmou entrada na campanha, conclusão do nível 1 com 6/6 registros e liberação do nível 2, mapa interativo com seleção dos quatro níveis, documentação de 21 capítulos e download do PowerPoint idêntico ao arquivo validado. O ambiente apresentou a alternativa 2D; esta verificação não qualifica a renderização 3D. Os quatro níveis completos também passaram pela suíte DOM: 120 testes de domínio e 14 de interface.

Os acessos por diretório de apresentação e pesquisa agora redirecionam para `index.html`, preservando assets e links relativos com a normalização de barras da Vercel. As capturas desta publicação estão em `experiments/four-level-campaign/evidence/publication/`. O recibo é posterior à implantação inspecionada; seu push pode gerar uma nova implantação documental. A identidade de qualquer build está em [release.json](https://projeto-ipe.vercel.app/campanha/release.json).

A edição R14 permanece disponível abaixo. As duas experiências têm contratos próprios; a futura consolidação deve comparar regras, dados e schemas antes de compartilhar persistência.

---

## Publicação PROJETO IPÊ — R14

Publicado e conferido em **14/11/2026**: três missões científicas, cenas 3D ligadas aos eventos, quatro modelos NASA, revisão local em equipe e a marca SVG original enviada pelo autor.

- [Jogar — Cerrado, Bennu e Telescópio](https://projeto-ipe.vercel.app/lab/index.html)
- [Portal público](https://projeto-ipe.vercel.app/)
- [Implementação e continuidade para dois desenvolvedores](https://projeto-ipe.vercel.app/docs/31-TRES-MISSOES-CIENTIFICAS-R14.html)
- [Modelos NASA, créditos e limites](https://projeto-ipe.vercel.app/docs/30-ATIVOS-NASA-IMPLEMENTADOS.html)
- [Biblioteca — 89 documentos](https://projeto-ipe.vercel.app/context/research-library.html)
- [Logo vetorial](https://projeto-ipe.vercel.app/brand/projeto-ipe-logo.svg)
- [Código e documentação no GitHub](https://github.com/oalexandrebelo/PROJETO-IPE)

## Versão e implantação

Beta `0.5.0-beta.1`, distribuição `R14-scientific-missions`. Commit da implementação: `1a2990fbc304cb2c5add26f063d948bdd8f0238b`. Primeira implantação conferida: `dpl_9z4jXZ89cGM4iprckASM9GmNQnna`, em estado `READY`, com o domínio principal atribuído. O [recibo remoto R14](evidence/production-r14.json) identifica o instante e os arquivos verificados.

O site está público, sem login. Este registro é posterior à primeira compilação; seu push pode acionar outra implantação da documentação pela conexão Git. O recibo certifica apenas a implantação identificada. A biblioteca conserva o corte de seu build e aponta para este documento no GitHub.

## O que foi entregue

- **Marca original:** símbolo de `ARTE .svg` e lettering de `Vector.svg` em composição horizontal 900×320, sem fundo, bitmap ou fonte externa. As 99 curvas do símbolo e 14 do lettering preservam a paleta fornecida. Originais, histórico e hashes ficam em `experiments/mission-design-lab/public/brand/`. [Procedência](docs/23-IDENTIDADE-VISUAL.md).
- **Três casos científicos:** Cerrado com registros históricos Terra/MODIS; levantamento didático de Bennu; comparação de faixas infravermelhas por telescópio fictício. Cada caso traz história, propósito e limites de interpretação.
- **Engenharia de sistemas:** usuários, lançamento, segmento espacial e solo aparecem conectados. Bennu e Telescópio têm necessidade, requisitos, projeto, verificação, operação e retorno. Lançador, perfil orbital, instrumento, energia, contatos e vida operacional alteram o resultado.
- **3D ligado ao tempo:** voltar a um evento mostra o último estado disponível, sem antecipar observações. Energia, fila, iluminação, contato e recepção seguem o cálculo. Comparação A/B das expedições usa o mesmo segundo; as tentativas permanecem preservadas.
- **Quatro modelos oficiais locais:** CubeSat genérico, DSN 70 m, Bennu e JWST, com 7.462.304 bytes de GLB, créditos, hashes e decoder Draco local. A geometria do Webb é agrupada em memória para reduzir objetos sem substituir o arquivo original.
- **Equipe e documentação:** revisão dos quatro papéis por até quatro pessoas no mesmo dispositivo. Edição invalida revisões anteriores. Projetos das expedições podem ser salvos, restaurados, exportados e importados; relatórios finais são exportáveis. Guia dos dois devs descreve contratos, arquivos, aceites e lacunas.

Os novos registros de Bennu e Telescópio são **sintéticos**, identificados na interface. Os modelos NASA são referências geométricas; não fornecem os parâmetros de engenharia. As 2 ou 3 horas representam operação depois da chegada. Não há integração GMAT/JPL em tempo real, trajetória de transferência, controle real da DSN nem multijogador remoto. O motor e a persistência próprios do Cerrado foram preservados.

## Verificação

- **129 testes de domínio, 17 de interface, 24 de contexto e 17 de distribuição/HTTP passaram.** TypeScript e compilação aprovados.
- Verificação remota sem cookies ou autorização: **212 arquivos com HTTP 200 e SHA-256 correspondente**, MIME correto dos GLBs e WebAssembly, política de scripts conferida e biblioteca com 89 documentos.
- No navegador: os três casos locais concluíram o roteiro viável 6/6; eventos, retorno científico, geometria e textura foram inspecionados. Logo conferida em fundo claro e escuro; viewport de390px sem rolagem horizontal global na tela observada.
- Na produção: beta e portal abriram sem login; logo nova, antena e carregamento Draco do Webb conferidos. Nenhum novo erro de console da origem pública nas interações observadas.

Recibos: [revisão local R14](evidence/revision-r14.json), [publicação R14](evidence/production-r14.json), [histórico R13](evidence/production-r13.json).

Os testes DOM não comprovam GPU, aprendizagem ou acessibilidade completa. Não foram medidos FPS nem desempenho em dispositivo físico; primeiro acesso offline continua sem ensaio. Recursos NASA não representam endosso institucional, qualificação de voo ou elegibilidade no desafio.

