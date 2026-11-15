# MISSÃO IPÊ — integração da LP na R17

Revisão de 15/11/2026. Esta página substitui as descrições atuais de marca, campanha e fontes do README original da contribuição; os recibos anteriores permanecem em `RELATORIO.md` e `QA-CI.md` como histórico.

## Comportamento atual

A LP apresenta três casos disponíveis no laboratório oficial: **Terra/MODIS**, **Bennu/OSIRIS-REx** e **Webb/NIRSpec**. Cada cartão explica a pergunta, o aprendizado, o fato histórico e os limites do exercício. As medições sintéticas de Bennu e Webb não são apresentadas como telemetria real. A cadeia de projeto continua sendo pergunta → requisitos → nave/instrumentos → operação → interpretação.

As referências históricas foram conferidas em fontes primárias:

- [NASA Earth Observatory — Measuring Vegetation](https://science.nasa.gov/earth/earth-observatory/measuring-vegetation-ndvi-evi/): Terra, MODIS, índices de vegetação e limitações das observações.
- [NASA — seleção de Nightingale](https://www.nasa.gov/news-release/x-marks-the-spot-nasa-selects-site-for-asteroid-sample-collection/): seleção do local em 2019 após o estudo da superfície de Bennu.
- [NASA — CO₂ em WASP-39 b](https://science.nasa.gov/missions/webb/nasas-webb-detects-carbon-dioxide-in-exoplanet-atmosphere/): anúncio de 25/08/2022 e observações com NIRSpec.

A sequência **Primeiro sinal → Memória em disputa → Janela estreita → Ciência que chega** já tem um link explícito para `/campanha/index.html`. A antiga descrição que prometia uma campanha futura foi retirada da interface. O laboratório dos três casos permanece em `/lab/index.html`.

Os quatro painéis interativos agora explicam os **segmentos de lançamento, espacial, terrestre e de usuários**. Mantêm navegação por setas, Home e End, além de clique e toque. A marca e a árvore IPÊ representam a equipe; não definem uma narrativa científica ou a progressão das missões.

## Marca e assets

Header, favicon, rodapé e composição Remotion usam os SVGs canônicos fornecidos para **MISSÃO IPÊ**, copiados de `experiments/mission-design-lab/public/brand/`. A geometria e a paleta são preservadas; o fundo é transparente. O cabeçalho respeita a proporção original 1064 × 499. Os dois arquivos foram acrescentados ao manifesto, com bytes e SHA-256.

Os arquivos antigos da marca permanecem como patrimônio histórico da contribuição original, sem referência na interface atual. A LP usa esquemas próprios de Terra, asteroide e telescópio nos cartões; eles são ilustrativos, não modelos ou instrumentos NASA. A imagem Blue Marble e seus créditos continuam presentes. A cena 3D configurável permanece no laboratório; a LP não adiciona um segundo motor 3D.

## Build e Vercel

O aplicativo está em `apps/immersive-lp`. Um projeto Vercel configurado com esse Root Directory exige que a pasta exista no commit implantado. A integração da contribuição torna a pasta parte da árvore oficial; isso deve ser confirmado junto com o SHA de produção, pois um build local não comprova o estado de um deployment remoto.

O build normal agora usa `next/font/local` e os WOFF2 já versionados. Não depende de consultar Google Fonts durante a compilação. Nenhuma dependência nova foi adicionada e o lockfile permanece intacto. O motor em `lib/mission/` também permanece intacto; seu manifesto registra a origem histórica e o nome canônico atual do repositório.

Configuração esperada do projeto dedicado: Root Directory `apps/immersive-lp`, framework Next.js, instalação com lockfile congelado, build `pnpm build` e sem override de Output Directory. `next.config.ts` continua exportando um site estático. O domínio principal e sua configuração não foram alterados por esta tarefa.

## Verificação R17

- TypeScript: aprovado, sem erros.
- Motor: quatro testes aprovados, incluindo resultados 6/6, falha 2/6, redesenho e determinismo.
- Assets: 17 arquivos verificados por tamanho e SHA-256.
- Build: `next build --webpack` concluído; `/`, `/creditos` e a página de erro exportadas estaticamente.
- Interface: 18/18 testes Playwright aprovados em desktop e celular, incluindo navegação, resultado/exportação, casos/fontes, campanha, filme, teclado e ausência de overflow em 360, 768 e 1440 px.
- Acessibilidade automatizada: verificações axe WCAG A/AA da página e laboratório sem violações detectadas nos dois perfis; isso não substitui teste manual completo ou estudo com participantes.
- Inspeção visual local: header/hero em 1440 × 1000 e 390 × 844, e seção dos três casos; SVG legível, proporcional e sem placa de fundo. As imagens foram conferidas após a decodificação dos assets.

Ambiente desta revisão: Node 24.18.0. Dependências restauradas do lockfile com pnpm 11.9.0 e bypass explícito somente da seleção de versão local; o pacote continua declarando pnpm 11.25.0. Scripts de instalação de dependências foram desativados. Isso não altera as versões fixadas da aplicação. O comando de build foi executado diretamente pelo binário local.

Os testes de interface existentes foram atualizados para o contrato novo: três cartões com fontes, logo SVG canônica, link da campanha, GitHub oficial e quatro segmentos. Não houve mudança nas fórmulas ou nos resultados do motor para adaptar os testes.

## Continuidade dos dois desenvolvedores

**Ciência e simulação:** manter as fontes junto das narrativas; sincronizar os resumos da LP quando a pergunta, os limites ou os resultados do laboratório mudarem. A cópia do motor da LP é identificada por SHA e não deve receber correções silenciosas sem atualizar procedência e testes.

**Interface e 3D:** preservar os links que levam aos casos e à campanha existentes; manter controles acessíveis por teclado/toque; usar a mesma marca e verificar proporção da logo, menu, cartões e filme em telas pequenas. Mudanças de produto no laboratório não podem ser anunciadas como prontas na LP antes de funcionar.

Esta integração não oferece multiplayer remoto nem comprovação de aprendizagem com público. A FAQ distingue colaboração no mesmo dispositivo de sincronização em rede. A publicação remota e sua inspeção pertencem ao recibo de release do repositório oficial.
