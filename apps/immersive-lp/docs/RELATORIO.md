# Relatório de implementação e verificação

Data: 14/11/2026. Entrega: nova LP imersiva PROJETO IPÊ, em aplicação Next.js independente.

## Resultado entregue

Experiência orbital com Terra NASA local, tipografia EB Garamond/Figtree, narrativa em capítulos, experimento real do beta, quatro horizontes de aprendizagem, timeline, perguntas frequentes e filme Remotion de 24 segundos. A marca original foi preservada. A leitura do repositório determinou o tema correto: engenharia de missões educativas e dados históricos da vegetação do Cerrado.

PR: https://github.com/oalexandrebelo/PROJETO-IPE/pull/1

Prévia da branch: https://projeto-ipe-lp-git-feat-immersive-lp-orbital-alexandrebelo.vercel.app

A aplicação está em `apps/immersive-lp`. A PR é aditiva e foi criada sobre a main atualizada `7682c8a11178f80b09302c3c85872d4a5068b872`. O merge não foi executado. A prévia usa o projeto Vercel próprio `projeto-ipe-lp`.

## Verificação executada

| Verificação | Resultado observado |
|---|---|
| TypeScript strict | Aprovado |
| Build Next.js de produção | Aprovado; rotas estáticas `/` e `/creditos/` |
| Testes do motor | 4/4 aprovados |
| Playwright | 18/18 aprovados no GitHub Actions, desktop e celular |
| Axe WCAG 2.0/2.1 A/AA | Nenhuma violação nos dois testes automáticos da página/laboratório com movimento reduzido |
| Overflow | Verificado pela suíte em 360, 768 e 1440 px |
| Recursos da página | Suíte verificou ausência de erros JS, HTTP de assets e requisições externas de runtime |
| Assets da entrega | 15 entradas conferidas por tamanho e SHA-256 |
| Pacote KayKit | 57 modelos GLTF únicos; 114 referências locais BIN/textura resolvidas |
| Inspeção visual | Chrome conectado: desktop 1440×1000 e celular 390×844; hero, narrativa, laboratório, jornada, horizonte, timeline e menu |
| Remotion Player | Reprodução observada no navegador; cena avançou, composição e fontes locais carregaram |

Detalhes e trechos do log: `QA-CI.md`. A suíte foi executada depois das correções de contraste e nomes acessíveis apontadas pela primeira rodada. A revisão visual também motivou pequenos ajustes de legibilidade durante a revelação do manifesto, navegação lateral e posição do marcador no celular.

O laboratório foi conferido contra o motor: configuração base/contato longo 6/6; base/contato curto 2/6; bateria maior e processamento INDEX/contato curto 6/6. O redesenho usa 84/86 créditos e 3,50 kg. Os quatro testes também verificam determinismo e conservação de energia. O download JSON contém a saída calculada.

## Stack e performance de implementação

Next.js 16.4.6, React 19.3.1, TypeScript 5.9.3 strict, pnpm 11.25.0, Tailwind v4.3.5, GSAP 3.15.1 e Remotion 4.0.543. ScrollTrigger, SplitText, DrawSVGPlugin e MotionPathPlugin estão integrados. Os pacotes Remotion pedidos estão no manifesto/lockfile. Não foram adicionados shadcn, Radix, Framer Motion, Lottie ou Three.js à LP.

HTML pré-renderizado; imagens WebP 1600/800 px; recursos locais; player importado ao abrir; laboratório carregado perto do viewport; eventos de mouse restritos a ponteiro fino; órbita pausada fora da tela/aba; preferência de movimento reduzido e controle de pausa; som desligado por padrão. A exportação `out/` é estática e pode ser servida sem Node em hospedagem HTTP compatível.

## Conteúdo do pacote de publicação

Código TypeScript, dependências fixadas no lockfile, configurações, fontes e licenças, imagens locais, composição Remotion, testes, documentação, manifesto de assets, pacote KayKit e build `out/`. O ZIP não contém `node_modules`, cache de build, credenciais ou arquivos do jogo completo. O jogo completo permanece acessível pela URL já publicada; o laboratório da LP funciona de forma independente.

## Limitação concreta do executor e do MP4

O Chromium local foi encerrado ao criar o socket de processo com `Operation not permitted`. Por isso a suíte real foi executada no GitHub Actions e a inspeção visual no navegador conectado. A tentativa local de render MP4 Remotion encontrou o mesmo bloqueio. O player e os 720 frames da composição funcionam no navegador; **não há MP4 pré-renderizado nesta entrega**. O comando `pnpm video:render` permanece disponível em ambiente com Chromium suportado. O MP4 não é necessário para publicar ou reproduzir a composição no player.

## Limites do produto e decisões

Semente e Raízes representam os dois cenários existentes; progressão, Copa e Horizonte estão planejados. A timeline apresenta estado e próximos objetivos sem prometer datas. A composição orbital é artística e não representa telemetria nem posição cartográfica exata. O manifesto de assets registra origem e licença; imagens/marcas NASA não significam parceria ou endosso.

Não foi atribuída nota Awwwards, certificação WCAG ou resultado de Core Web Vitals de campo. Os testes automáticos, a inspeção visual e as medidas de implementação são evidências delimitadas. Testes com jogadores e tecnologias assistivas continuam como trabalho de produto previsto na timeline.

As ambiguidades e as 16 decisões principais estão registradas em `DECISOES.md`; movimentos em `MOTION-SPEC.md`; oportunidades de assets em `ASSETS-OPORTUNIDADES.md`.
