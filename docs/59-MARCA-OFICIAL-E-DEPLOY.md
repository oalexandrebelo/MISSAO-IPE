# Marca oficial e continuidade da publicação

Revisão de 15/11/2026. Nome público: **MISSÃO IPÊ**. O ipê identifica a equipe; não substitui a evidência científica das missões.

## Arquivos aprovados

O responsável confirmou `LOGO_MISASO_IPE.svg` (marca horizontal), `LOGO_MISSAO.svg` (símbolo) e `Frame 11.svg` (outra composição horizontal). Os originais ficam preservados em `experiments/mission-design-lab/public/brand/originals/`.

A marca horizontal e o símbolo já usados no R21 conservam os traços dos arquivos enviados. A assinatura vertical `missao-ipe-logo-stacked.svg` recompõe o símbolo e o lettering dos SVGs para seguir a referência vertical enviada. Ela é uma composição derivada, não um arquivo original byte a byte. O cinza da referência não integra o SVG. Não há imagem raster, fonte remota ou script nas marcas.

Use a marca horizontal nos cabeçalhos; a vertical na assinatura final e em áreas com altura suficiente; o símbolo isolado nas abas e identificadores pequenos. Não comprima o lettering horizontal em um quadrado. Preserve proporção, transparência e as cores `#F5F0E5`, `#508AA2`, `#E29A6F` e `#BF6C47`. Não aplique filtros ou fundos retangulares à imagem.

As variantes `*-on-light.svg` documentadas no R17 continuam como adaptações de contraste para as páginas claras de estudo. Elas não são novos originais enviados e não substituem a paleta das aplicações escuras. O manifesto `brand-provenance-r22.json` identifica fontes, transformações e hashes; `preview-r22.html` permite comparar as três aplicações e o símbolo em tamanhos pequenos.

## Aplicação nesta revisão

- LP: marca horizontal no cabeçalho, assinatura vertical no rodapé e retirada de lettering artificial sobre o símbolo do convite final. A entrada informa nome, e-mail, missão e play, conforme o jogo atual.
- Jogo: marca horizontal e símbolo vetoriais oficiais preservados.
- Pitch: símbolo na aba e assinatura vertical no encerramento, junto da marca de Alexandre Belo e do agradecimento.
- Painel privado: marca horizontal oficial no cabeçalho e símbolo na aba. A política de acesso e as métricas não mudam.
- Central da equipe: mantém a mesma marca horizontal oficial incorporada no HTML, para leitura local.

## Diagnóstico dos deploys

O último erro encontrado na LP antes desta revisão foi `NOW_SANDBOX_WORKER_ROOTDIR_NOT_EXIST`, na tentativa `dpl_Fco7AFQB9jTuSRX5VcRbThbG6LSG`, commit `bf8b099a5c2c2947786b4357a10c6825d152c794`. O log informa que `apps/immersive-lp` não existia naquele commit. Essa pasta já está incorporada na versão atual. Reexecutar aquele commit antigo reproduz a ausência; publique a versão atual de `main`.

No R21, o jogo (`dpl_Aeq3CfXP1xHLYfAsSCCyoqH5Ag49`) e a LP (`dpl_37udA3fCezmdSUCbgGkU8Q5KgNnN`) chegaram a `READY` no commit `327710db39ce070991f01595a54b5800a4f97f64`. Isso comprova a compilação dessa versão; não significa que todos os links estejam corretos. A revisão encontrou um 404 no atalho de Libras da LP: o export Next serve o guia em `/acessibilidade/guia/`. O ajuste usa essa URL, resolve CSS/JS por caminhos absolutos e aplica a política de isolamento ao guia.

## Handoff para os dois desenvolvedores

**Front-end:** preservar a geometria dos originais; revisar logo, navegação e Libras em desktop e celular. Alterações em `apps/immersive-lp/public/acessibilidade/` também chegam ao site principal pelo empacotamento. Rodar a compilação da LP antes de `node --test tests/libras*.test.mjs`.

**Integração/publicação:** o repositório oficial é [oalexandrebelo/MISSAO-IPE](https://github.com/oalexandrebelo/MISSAO-IPE). O projeto Vercel principal chama-se `missao-ipe`, mantém o domínio `projeto-ipe.vercel.app` e usa a raiz do repositório. O projeto `projeto-ipe-lp` usa `apps/immersive-lp` e o domínio `projeto-ipe-lp.vercel.app`. Um push pode iniciar um deploy por projeto. Consulte as tentativas do SHA antes de disparar novas: a revisão R21 encontrou tentativas duplicadas do mesmo commit, todas concluídas.

Após a publicação, conferir o SHA e `READY` na Vercel; executar `scripts/verify-publication-r21.mjs` para o principal e `scripts/verify-lp-r21.mjs` para a LP, informando deployment ID e SHA completos. Os recibos verificam os arquivos e as políticas, sem certificar aprendizagem humana ou tradução humana em Libras. Um HTTP 401 em `/api/metrics?action=admin` sem autenticação é o comportamento esperado do painel privado.

ISS, Lua e Marte continuam sendo integração em preparação. O catálogo do documento 58 é pesquisa de referência; esta correção de marca e publicação não anuncia essas três novas missões como jogáveis.

Orientação de tratamento vetorial: [logo-designer-skill](https://github.com/neonwatty/logo-designer-skill/blob/main/skills/logo-designer/SKILL.md), aplicada à marca já escolhida pelo responsável.
