# Evidência de validação em CI

Execução: https://github.com/oalexandrebelo/MISSAO-IPE/actions/runs/43632846898

Commit verificado: `4ae6c2855d55322583d20e5e751a9099370fef8f`.
Ambiente: GitHub Actions, Ubuntu 24.04, Node 24, Chromium Playwright.
Resultado: 18 testes de interface aprovados (9 cenários em desktop e celular), incluindo axe WCAG 2.0/2.1 A/AA. Quatro testes do motor, typecheck, assets e build também aprovados.

O teste de overflow verifica 360, 768 e 1440 px. A auditoria automática não substitui avaliação humana completa de acessibilidade ou testes com tecnologias assistivas.

## Trechos relevantes do log

```text
2026-11-14T19:34:59.3115604Z ℹ tests 4
2026-11-14T19:34:59.3116317Z ℹ pass 4
2026-11-14T19:34:59.3116573Z ℹ fail 0
2026-11-14T19:34:59.6458345Z 15 assets conferidos por tamanho e SHA-256; stack sem bibliotecas proibidas.
2026-11-14T19:36:03.8125360Z   ✓   2 [desktop] › tests/experience.spec.ts:4:1 › a página completa não causa erros e mantém os assets locais (9.3s)
2026-11-14T19:36:04.3025972Z   ✓   1 [desktop] › tests/experience.spec.ts:16:1 › o laboratório calcula a falha, o redesenho e exporta o resultado real (9.7s)
2026-11-14T19:36:04.9753239Z   ✓   3 [desktop] › tests/experience.spec.ts:29:1 › timeline funciona com clique e teclado, incluindo os estados planejados (1.2s)
2026-11-14T19:36:05.4083472Z   ✓   4 [desktop] › tests/experience.spec.ts:39:1 › perguntas e capítulos têm conteúdo real expandível (1.1s)
2026-11-14T19:36:06.4363285Z   ✓   5 [desktop] › tests/experience.spec.ts:47:1 › movimento reduzido e o controle de pausa preservam a leitura (1.4s)
2026-11-14T19:36:07.4853349Z   ✓   6 [desktop] › tests/experience.spec.ts:58:1 › filme abre, carrega o player, fecha por Escape e devolve foco (2.1s)
2026-11-14T19:36:08.5189551Z   ✓   7 [desktop] › tests/experience.spec.ts:67:1 › layout não transborda em três larguras e todos os links locais resolvem (2.1s)
2026-11-14T19:36:09.2614334Z   ✓   9 [desktop] › tests/experience.spec.ts:85:1 › navegação responsiva mantém o foco e os destinos (712ms)
2026-11-14T19:36:10.2653426Z   ✓   8 [desktop] › tests/experience.spec.ts:79:1 › auditoria WCAG A/AA na página e no laboratório (2.7s)
2026-11-14T19:36:11.5091685Z   ✓  10 [mobile] › tests/experience.spec.ts:4:1 › a página completa não causa erros e mantém os assets locais (1.4s)
2026-11-14T19:36:12.4525367Z   ✓  12 [mobile] › tests/experience.spec.ts:29:1 › timeline funciona com clique e teclado, incluindo os estados planejados (925ms)
2026-11-14T19:36:12.6545344Z   ✓  11 [mobile] › tests/experience.spec.ts:16:1 › o laboratório calcula a falha, o redesenho e exporta o resultado real (1.6s)
2026-11-14T19:36:13.4917874Z   ✓  13 [mobile] › tests/experience.spec.ts:39:1 › perguntas e capítulos têm conteúdo real expandível (1.0s)
2026-11-14T19:36:14.2358845Z   ✓  14 [mobile] › tests/experience.spec.ts:47:1 › movimento reduzido e o controle de pausa preservam a leitura (1.6s)
2026-11-14T19:36:15.3888101Z   ✓  15 [mobile] › tests/experience.spec.ts:58:1 › filme abre, carrega o player, fecha por Escape e devolve foco (1.9s)
2026-11-14T19:36:16.2979298Z   ✓  16 [mobile] › tests/experience.spec.ts:67:1 › layout não transborda em três larguras e todos os links locais resolvem (2.0s)
2026-11-14T19:36:17.2483979Z   ✓  18 [mobile] › tests/experience.spec.ts:85:1 › navegação responsiva mantém o foco e os destinos (922ms)
2026-11-14T19:36:17.8696994Z   ✓  17 [mobile] › tests/experience.spec.ts:79:1 › auditoria WCAG A/AA na página e no laboratório (2.5s)
2026-11-14T19:36:17.9766803Z   18 passed (39.7s)
2026-11-14T19:36:19.6896591Z Artifact download URL: https://github.com/oalexandrebelo/MISSAO-IPE/actions/runs/43632846898/artifacts/14129041834
```

O artefato do workflow conserva o resultado JSON, arquivos de teste e build estático por 14 dias. O código da suíte permanece no repositório e pode ser executado novamente.
