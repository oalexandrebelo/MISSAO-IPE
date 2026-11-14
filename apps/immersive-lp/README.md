# PROJETO IPÊ — LP imersiva orbital

Landing page Next.js independente, criada para o conceito **Missão Ipê — Ciência que chega**. Edição 14/11/2026, versão 1.0.0-beta.1.

## Executar

```bash
cd apps/immersive-lp
pnpm install --frozen-lockfile
pnpm dev
```

Desenvolvimento em `http://localhost:3000`. Requer Node >=22.14; verificado com Node 24.22.1 e pnpm 11.25.0.

## Publicar

```bash
pnpm build
pnpm start
```

`pnpm build` gera `out/`, uma distribuição estática completa. `pnpm start` a serve em `http://localhost:4177`. Um servidor HTTP estático é necessário; abrir o HTML por `file://` não é suportado. A configuração Vercel fica nesta pasta; configure **Root Directory = apps/immersive-lp**, Node 24, install `pnpm install --frozen-lockfile`, build `pnpm build`, output `out`. O app não precisa de banco, API key ou variáveis secretas. `NEXT_PUBLIC_SITE_URL` pode ajustar a base de metadados antes da compilação.

Por padrão, `next/font/google` obtém as fontes durante o build e as serve localmente ao visitante. Para reconstruir sem consultar Google Fonts, depois de instalar as dependências:

```bash
pnpm build:offline-fonts
```

O script usa as fontes WOFF2 incluídas via `next/font/local`, restaura `lib/fonts.ts` ao terminar e mantém a tipografia. A instalação inicial de dependências requer rede; o ZIP não contém `node_modules`. O `out/` incluído no pacote pode ser servido diretamente sem instalar dependências. Links para o jogo completo e a pesquisa abrem serviços externos; o pequeno laboratório da LP roda localmente.

## Stack entregue

Next.js 16.4.6 / App Router, React 19.3.1, TypeScript 5.9.3 strict, pnpm 11.25.0, Tailwind CSS 4.3.5 e tokens em `app/globals.css`. GSAP 3.15.1 com ScrollTrigger, SplitText, DrawSVGPlugin e MotionPathPlugin. Remotion 4.0.543 com Player, CLI, google-fonts, paths e layout-utils. EB Garamond 400 normal/itálico e Figtree 400/500/600. Playwright 1.65.0 e axe-core/playwright 4.14.0.

Não há dependências shadcn, Radix, Framer Motion, Lottie, Three.js ou React Three Fiber nesta aplicação. O jogo preexistente fora desta pasta continua com sua própria stack.

## Experiência

- Hero orbital com imagem Blue Marble NASA otimizada, sombra CSS, órbitas SVG e satélite em MotionPath.
- Narrativa editorial, entradas de texto por SplitText, linhas desenhadas e parallax de baixa amplitude.
- Navegação por capítulos, progresso de leitura e menu móvel em dialog nativo.
- Laboratório carregado sob demanda, usando o motor determinístico do beta e download do resultado JSON.
- Quatro capítulos educativos com estados claros: Semente/Raízes apresentam cenários existentes; Copa/Horizonte são planos.
- Timeline operável por clique e teclado, FAQs nativas, fontes/créditos, CTA para o beta real.
- Remotion Player carregado apenas ao abrir o manifesto de 24 s. A reprodução é iniciada pelo visitante.
- Som sintetizado localmente, opcional, sem autoplay. Movimento respeita `prefers-reduced-motion` e tem controle explícito de pausa.

## Verificar

```bash
pnpm typecheck
pnpm test:engine
pnpm assets:verify
pnpm build
pnpm exec playwright install --with-deps chromium
pnpm test
```

O workflow `.github/workflows/immersive-lp-qa.yml` faz essas verificações para PRs desta pasta. Não usa segredos nem publica produção. Há 18 casos de interface em desktop e celular e quatro casos do motor. Consulte `docs/RELATORIO.md` para distinguir verificações executadas de verificações bloqueadas ou pendentes.

## Filme

```bash
pnpm video:studio
pnpm video:render
```

Composição `IpeMission`: 1920×1080, 30 fps, 720 frames, 24 segundos. Fontes, imagem terrestre, logotipo e ilustração são locais. O arquivo MP4 só existe após render bem-sucedido; o player interativo não depende de um MP4. A presença da composição não é alegação de render concluído. Remotion possui licença própria; ver `public/assets/REMOTION-LICENSE.md`.

## Assets e continuidade

`public/` contém todos os assets necessários à LP. `asset-packs/kaykit-space-base-gltf.zip` contém 57 modelos GLTF, seus BIN, textura, previews e licença CC0, para a evolução do game. Este pacote não é baixado pelo visitante. `asset-packs/kaykit-manifest.json` fixa a origem e os hashes. Descompacte o arquivo para usar os modelos.

Leia `docs/DECISOES.md`, `docs/MOTION-SPEC.md`, `docs/ASSETS-OPORTUNIDADES.md`, `docs/RELATORIO.md` e `docs/ARQUITETURA.md`. Código original sob Apache-2.0, conforme o projeto. Materiais de terceiros conservam suas condições. A marca IPÊ é a fornecida pelo responsável. Assistência de IA em pesquisa, código e redação declarada.
