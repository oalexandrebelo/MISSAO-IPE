# Publicação MISSÃO IPÊ

## R33 · LP no domínio oficial, copy e sete jornadas móveis

**Publicada e conferida em 15/11/2026.** Código `9d0737e61593ef34a71b5599b470457dd968b6e8`; principal `dpl_HZXm7W8AEJtAVK8yRoZF6pWqvsF5` e LP `dpl_FYcymnjDZFmxNd71GT1PCns2wgzn` **READY**. A [página principal](https://nasa-missaoipe.alexandrebelo.com/) retorna HTTP 200 e mantém o domínio oficial, sem redirecionar para vercel.app. O hub anterior está em [/documentacao](https://nasa-missaoipe.alexandrebelo.com/documentacao).

A copy explica sete destinos, três casos com registros históricos NASA, etapas de briefing, hangar, operação e relatório, além do modo de equipe no mesmo aparelho. Nas missões de Bruno, comprar, equipar, conferir, lançar, transferir, coletar e receber têm funções explícitas. Loja, indicação de lançador incompatível e atalhos de inspeção 3D foram ajustados. A/B identifica corretamente o efeito da janela de comunicação sem inventar diferenças de massa ou custo.

**QA:** 180 testes de domínio, 163 de interface, 53 de métricas, 20 de distribuição e dois de política HTTP/CSP passaram. LP: quatro testes do motor, 21 assets por SHA, TypeScript e export aprovados. No navegador local a 390 px, foram concluídas as sete missões e uma tentativa de contraste do Cerrado. Após recarga: oito tentativas, sete destinos cumpridos, 29 eventos confirmados, nove créditos e os ciclos de seis instrumentos permaneceram salvos. Inventário conferido também a 320 px. O teste HTTP isolado recuperou os sete resultados após reinício e recusou duplicação de recompensa/desgaste.

**Produção:** 43 verificações passaram, incluindo 16 arquivos idênticos ao build por SHA-256, recursos da LP, documentação, sessão anônima, painel privado e subdomínios. No navegador a 390 px, menu e Escape funcionaram; Jogar agora abriu `/lab/index.html` no mesmo domínio, com Iniciar jogo visível, sem overflow horizontal ou erros de console observados. A falha inicial por versão incompatível do PNPM foi corrigida fixando a versão 11.25.0 já adotada pela LP. Os scripts de hidratação foram externalizados sem mudar a ordem, preservando a CSP no build remoto.

Esta rodada não criou partidas em produção. Percursos sintéticos, viewport emulado e reinício local não equivalem a teste com iniciantes reais, telefone físico ou nova prova de reinício do Blob de produção. O recibo documental pode ter commit posterior ao código verificado; os IDs acima identificam exatamente os deploys conferidos.

[Handoff R33](docs/82-FLUXO-MOVEL-PERSISTENCIA-E-HANDOFF-R33.md) · [Percursos móveis](evidence/r33-mobile-journey.json) · [Publicação verificada](evidence/r33-production-publication.json) · [Jogar](https://nasa-missaoipe.alexandrebelo.com/lab/index.html)

---

## R32 · jogo refinado e LP principal publicada

- Código do jogo e da LP: `17a714ea1258ca38fc43c643d3bbd7eee106ac66`, publicado no GitHub e com ambos os projetos Vercel em **READY**.
- [LP principal](https://projeto-ipe-lp.vercel.app/): a raiz do domínio oficial abre esta entrada. [Documentação geral](https://nasa-missaoipe.alexandrebelo.com/documentacao): antigo hub, com acesso ao handoff atual e estudos históricos identificados.
- [Jogo](https://nasa-missaoipe.alexandrebelo.com/lab/index.html): escolhas junto à nave, plataforma Kenney ajustada, controles compactos, leitura da operação móvel e retorno ao mesmo destino.
- [Handoff R32](docs/81-DESIGN-DO-JOGO-E-HANDOFF-R32.md) · [Verificação pública do código](evidence/r32-production-publication.json) · [Percursos locais](evidence/r32-mobile-design.json).
- 180 testes de domínio, 161 de interface, 53 de métricas e 20 da distribuição aprovados. LP: quatro testes do motor, 21 assets por SHA, TypeScript e export aprovados.
- Conferência pública: 16 arquivos iguais ao build por SHA-256 e nove verificações de rotas/acesso. Jogo a 320 px sem transbordamento nem erro de console; LP local a 1280/390/320 px com navegação e laboratório funcionando.
- Pontuação, créditos e desgaste foram conferidos na participação sintética local. Esta rodada não criou partidas em produção nem repetiu sete voos completos; os limites constam no handoff. Não houve teste em telefone físico.

## R31 — plataforma Kenney e escolhas claras

**Publicada e conferida em 15/11/2026.** Código `9e1b0ed6ea49e63452122352ead86419753da7e0`; jogo `dpl_73UV1GTSejWc8XqxywZ5qjpZVhgy` e LP `dpl_BdSK8q6WBxbVXLqib9myPvJUeFSH` READY nesse commit. A plataforma Kenney CC0 foi integrada aos sete hangares; o GLB local tem 17.200 bytes. O plano em edição volta ao 3D ao trocar uma opção, os instrumentos faltantes têm nome e indicação de encaixes, e Meu progresso conta até sete destinos distintos com sucesso confirmado.

Passaram 180 testes de domínio, 157 de interface, 53 de métricas e 20 de distribuição. Os sete hangares foram inspecionados em 390 px; ISS e Webb também em 320 px. A jornada ISS terminou com 92 pontos, 6/6 registros válidos, saldo de 26 créditos e monitor com 2/3 ciclos. Esses valores permaneceram após recarga no servidor local de QA. A rodada não repetiu as sete jornadas completas da R30.

Em produção, 15 arquivos corresponderam ao build por SHA-256 e sete verificações confirmaram limites de acesso, 404, subdomínios e ligação da LP à apresentação. O navegador confirmou a plataforma no hangar ISS em 390 px, sem overflow ou erros de console observados. Telefone físico e testes educativos com pessoas seguem pendentes.

[Handoff R31](docs/80-HANGAR-KENNEY-E-HANDOFF-R31.md) · [Auditoria Bruno](docs/78-AUDITORIA-BRUNO-E-INTEGRACAO-R31.md) · [QA móvel](evidence/r31-mobile-hangar.json) · [Publicação](evidence/r31-production-publication.json)

---

## R30 — hangar, montagem e operação nas sete missões

**Publicada e conferida em 15/11/2026.** Código `1409995812973de6b3bca0221b2a990b2087459f`; principal `dpl_2RdykrJGUsqe3wYZw76FfxUsFCBa` e LP `dpl_6taGqc6tojUb6SKBYSkVwYxKyPcY` **READY** no mesmo commit. O [jogo oficial](https://nasa-missaoipe.alexandrebelo.com/lab/index.html) mostra montagem, instrumentos equipados, bateria, proteção, lançador e comunicação conforme a configuração. Eventos revelados orientam a cena; a trilha declara o que está atual, concluído ou pendente. O hangar usa iluminação Poly Haven CC0, com crédito e integridade local.

**QA:** 180 testes de domínio, 144 de interface, 53 de métricas e 19 de distribuição passaram. O navegador percorreu as sete missões em 390 px: sete tentativas com seis registros válidos e uma oitava, Cerrado com contato curto, com dois registros. A comparação A/B explicou a diferença e acompanhou os estados finais no mesmo relógio. A recarga preservou oito tentativas, 25 eventos confirmados, nove créditos e os ciclos de seis instrumentos. Esses percursos usaram participação sintética e servidor local de teste. Inventário e comparação também foram inspecionados em 320 px.

**Produção:** 12 arquivos publicados tiveram SHA-256 idêntico ao build, incluindo as cenas, HDRI e documentos 76/77. Sete verificações adicionais confirmaram sessão anônima, recusa do painel privado, 404 real, subdomínios de jogo/documentação/painel e link da LP à apresentação oficial. O hangar ISS abriu no domínio em 390 px; energia ampliada, montagem separável e atalho de inspeção responderam, sem erros de console observados. Esta publicação não repete a campanha HTTP de inventário da R28; telefone físico e testes educativos com pessoas continuam pendentes.

O Sol 6.1 Max pesquisou os assets: uma plataforma Kenney CC0 de 17.200 bytes e 96 triângulos é o próximo ensaio proposto. Rodin/Meshy, Blender/DCC e modelos locais têm requisitos, custos e licenças documentados; não foram apresentados como integrações já operantes.

[Handoff R30](docs/76-COCKPIT-SETE-MISSOES-E-HANDOFF-R30.md) · [Assets e oportunidades](docs/77-ASSETS-3D-E-OPORTUNIDADES-R30.md) · [Jornadas móveis](evidence/r30-mobile-journey.json) · [Publicação](evidence/r30-production-publication.json)

---

## R29 — seleção imersiva e compra em lote

**Publicada e conferida em 15/11/2026.** Código `7f798af44fad12a2c3b09e7a466d8d303e7dd4f4`; principal `dpl_EFrE2p4EqcQPUnxGaWRAmNWrRWCb` e LP `dpl_HEzZhnFW94jMGrt14GdyADHWg7Nf` **READY** no mesmo commit. O [jogo oficial](https://nasa-missaoipe.alexandrebelo.com/lab/index.html) apresenta os sete destinos com horizonte planetário 3D, transições de câmera, texturas NASA e os modelos de Bennu e Webb. Cada destino mostra sua pergunta, aprendizado e botão Jogar. A composição segue a referência Space planet, com a marca e o fluxo da MISSÃO IPÊ.

A revisão dos repositórios de Bruno encontrou mudanças de interface e compra em quantidade, sem novos arquivos de mídia. A loja oficial ganhou quantidade por instrumento, com uma única transação confirmada pelo servidor. ISS, Lua, Marte e Europa mantêm a contribuição integrada; o contexto histórico de coleta e retorno da OSIRIS-REx complementa Bennu. A auditoria distingue missões executáveis de cenários apenas documentados.

**Aceite:** 180 testes de domínio, 121 de interface, 53 de métricas e 18 de distribuição passaram. A seleção dos sete destinos foi inspecionada em desktop e viewports móveis de 320 e 390 px. Uma jornada local comprou duas unidades, retomou o inventário, completou ISS com seis registros válidos e 92 pontos, consumiu um ciclo e preservou a pontuação após recarga. Pausa, navegação por teclado e redução de movimento têm verificações específicas. Telefone físico e avaliação com iniciantes reais permanecem pendentes.

**Produção:** 50 verificações passaram; 16 arquivos publicados tiveram SHA-256 idêntico ao build, incluindo as cenas, as quatro novas texturas, os modelos e os handoffs. Uma participação técnica comprou duas unidades por dez créditos; uma nova leitura confirmou saldo de 15 e dois instrumentos com três ciclos. Repetir o pedido devolveu o mesmo recibo. O painel privado recusou visitante e jogador. O cenário de Marte abriu no navegador público sem erros de console observados. A prova desta rodada não repete as sete jornadas completas registradas em R28.

[Handoff R29](docs/75-LOBBY-IMERSIVO-E-HANDOFF-R29.md) · [Auditoria Bruno](docs/74-AUDITORIA-BRUNO-E-IMERSAO-R29.md) · [QA de interface](evidence/r29-lobby-qa.json) · [Publicação e persistência](evidence/r29-production-publication.json)

---

## R28 — sete jornadas e acessos oficiais

**Publicada e conferida em 15/11/2026.** Implementação `9f86436c73455682c049bb604dfda1e3762298b1`; principal `dpl_Cj6efJP8hTRpFoSYGTCTCxZ4mQhb` e LP `dpl_8EsSXZJpa21XVhsKXY1suS9fcMKp` READY. A [LP principal](https://projeto-ipe-lp.vercel.app/) apresenta sete missões e encaminha o pitch para a [central de apresentação](https://missao-ipe-central-ab.alexandrebelo.chatgpt.site/). `/pitch`, `/apresentacao` e a raiz de `pitch.nasa-missaoipe.alexandrebelo.com` redirecionam à central. Jogo e painel preservam o domínio oficial.

O hangar orienta comprar e equipar antes do 3D, diferencia orçamento e carteira e avisa o custo de lançar sem instrumentos. Cerrado mostra a pergunta científica antes da montagem. Bennu/Webb confirmam o rascunho junto ao comando e distinguem arquivos recebidos de registros válidos, inclusive no acervo e no gráfico.

**Validação:** 180 testes de domínio, 113 de interface, 53 de métricas e 18 de distribuição passaram. No navegador com largura efetiva de 390 px, as sete missões foram cumpridas em nove tentativas. Pontuações finais: Cerrado 92, Bennu 90, Webb 92, ISS 92, Lua 92, Marte 91, Europa 93. Retomada após recarregar preservou nove tentativas, 32 eventos confirmados, seis unidades com desgaste e carteira de 9 créditos. A API de produção passou em **344 verificações / 117 requisições**, nas sete missões, com Blob privado, resultados recalculados, autorização, deduplicação e desgaste até exaustão.

A central Sites versão 4, commit `ef1d88d3fc129888387c4e9d076a9235d59c9679`, foi publicada com o vídeo de três minutos selecionado e reprodução observada. Os downloads audiovisuais anteriores foram preservados e identificados como históricos. O ensaio técnico não substitui testes com iniciantes reais ou telefone físico; 320 px não foi verificado nesta rodada.

[Handoff R28](docs/73-QA-MOVEL-E-HANDOFF-R28.md) · [Jornada móvel](evidence/r28-mobile-journey.json) · [Métricas privadas](evidence/r28-production-metrics.json) · [Rotas e publicação](evidence/r28-publication-links.json)

---

## R27 — loja, inventário, desgaste e Europa

**Publicada e conferida em 15/11/2026.** Implementação `fb89ec583ffc784fd4b58aebec8e5fd5d98fd33e`, correção de persistência `12617d6aeeb370262c12c63538b3c489571188e2`. Principal `dpl_Dzq9MroJhwXR3BERr94j3coX6Pue` e LP `dpl_GQmbZkWmU6JJQjQ85YcUh17sF5Mm` ficaram **READY** no mesmo commit. A API privada passou no aceite no domínio oficial.

A campanha de Bruno inclui **ISS, Lua, Marte e Europa**, com compra, devolução de unidades intactas, reserva por missão, desgaste na partida e recompensa confirmada pelo servidor. Cerrado, Bennu e Webb permanecem disponíveis. Instrumentos, energia e comunicação alteram a montagem 3D; a comparação A/B guarda os equipamentos e a condição de cada plano. O painel privado mostra operações da carteira, ciclos consumidos e tentativas. A loja aberta pelo hangar destaca primeiro um instrumento exigido pela missão.

**Aceite local:** 180 testes de domínio, 113 de interface, 51 de métricas e 18 de distribuição passaram, com builds do jogo e da LP. No navegador, as quatro missões chegaram a seis registros válidos: Europa 92, ISS 92, Lua 92 e Marte 91 pontos nas configurações registradas. Europa demonstrou A/B de comunicação de dois para seis registros; a condição gasta reduziu a previsão para cinco. Compra, reembolso, cancelamento, retomada e reinício sem apagar métricas foram exercitados. Viewports de 320 e 390 px ficaram sem overflow horizontal; celular físico continua pendente. [Recibo funcional R27](evidence/r27-functional-qa.json).

**Aceite de produção:** 183 verificações em 72 requisições passaram no armazenamento Blob privado. Foram persistidos 31 eventos de inventário, seis tentativas autoritativas e uma tentativa legada da participação sintética. As quatro missões tiveram resultado recalculado pelo servidor. Concorrência, repetição do mesmo pedido, desgaste único, recompensa única, cancelamento, bloqueio em T+0 e retomada foram conferidos. O painel recusou visitante e sessão de jogador; estados de outra participação e pontuação/condição forjadas foram recusados. [Recibo das métricas](evidence/r27-production-metrics.json).

A primeira verificação de produção revelou conflito na devolução após o crescimento do documento do inventário. A leitura agora solicita a representação sem compressão e exige ETag forte para a escrita condicional. O mesmo inventário do teste no navegador aceitou o estorno após a correção, sem reset ou migração. O teste completo de produção passou em seguida. [Primeira falha preservada](evidence/r27-production-first-failure.json).

**Domínios:** os cinco subdomínios responderam por HTTPS. `jogo`, `pitch`, `painel` e `docs` redirecionam para suas áreas no host canônico; `lp` serve o projeto separado. Doze assets/páginas foram comparados por SHA-256 ao build, incluindo o GLB oficial da Europa Clipper, além de seis rotas. [Assets, rotas e subdomínios](evidence/r27-production-assets.json).

[Jogar](https://jogo.nasa-missaoipe.alexandrebelo.com/) · [Pitch](https://pitch.nasa-missaoipe.alexandrebelo.com/) · [Painel privado](https://painel.nasa-missaoipe.alexandrebelo.com/) · [Documentação](https://docs.nasa-missaoipe.alexandrebelo.com/) · [LP](https://lp.nasa-missaoipe.alexandrebelo.com/) · [Central da equipe](https://nasa-missaoipe.alexandrebelo.com/equipe/index.html) · [Handoff dos dois devs](docs/71-INVENTARIO-EUROPA-E-HANDOFF-R27.md) · [Operação dos domínios](docs/72-DOMINIOS-E-ACESSOS-R27.md).

As verificações usam participações técnicas identificadas como testes; não são evidência de aprendizagem humana. O modelo Clipper é referência visual, carregado voluntariamente; créditos e desgaste são didáticos. A publicação documental posterior inclui os recibos e o ajuste de seleção inicial da loja. Cada recibo identifica seu corte de código e alcance.

---

## R26 — operação conectada ao 3D, comparação e Rive

**Publicada e conferida em 15/11/2026.** Código `789af317b737243afa8f928152f3e488e1e6ab5c`. Principal `dpl_E66f2F38Us5whEzqT8qn6249fPqz` e LP `dpl_Cgb3KxWwoRNioCK2STXX4M2DDwEf`, ambos **READY** no mesmo commit, com os domínios oficiais associados.

ISS, Lua e Marte ganharam comparação A/B ligada à nave, retomada por participação, revisão pré-voo, operação com pausa e avanço por evento, áudio opcional e análise dos quatro segmentos. O novo artboard Rive **IpeMissionSequence** acompanha decisão, lançamento, coleta, recepção e desfecho; a confirmação de **End Prompt** foi recebida. Cerrado, Bennu e Webb continuam disponíveis. A tentativa é calculada pelo motor; a animação apresenta seus eventos.

**Aceite local:** 171 testes de domínio, 111 de interface, 33 de métricas e 18 de distribuição passaram. As três jornadas foram exercitadas no navegador, incluindo falha, redesenho, A/B, reload e cancelamento sem recompensa. Viewports de 320 e 390 px ficaram sem overflow horizontal. [Recibo funcional](evidence/r26-functional-qa.json).

**Aceite de produção:** treze páginas/assets conferidos com SHA-256 idêntico ao build local, incluindo os dois Rives e os JS/CSS de entrada; a LP respondeu HTTP 200. Jogo e handoff abriram no navegador público. A API persistiu seis tentativas sintéticas, recalculou exatamente os seis resultados e aceitou repetição sem duplicar. Inspeção A/B, revisão dos papéis e cancelamento também foram persistidos. O painel administrativo recusou visitante e sessão de jogador com `401`. [Assets e rotas](evidence/r26-production-assets.json) · [Métricas privadas](evidence/r26-production-metrics.json).

As pontuações das configurações técnicas conferidas foram Cerrado 91, Bennu 93, Webb 92, ISS 92, Lua 90 e Marte 91, todas com seis registros válidos. São resultados de teste, sem participantes humanos e sem demonstração de aprendizagem. A configuração da Lua no teste de API inclui proteção reforçada; a jornada local com 91 pontos usa outra configuração.

O repositório preserva 37 arquivos úteis da nova contribuição de Bruno, com manifesto e autoria. Loja, inventário múltiplo, desgaste, reserva e Europa ainda não foram migrados ao motor oficial. Earshot e ManimGX foram avaliados; o jogo aplica feedback com Web Audio e Rive, sem instalar esses runtimes. Aceite em telefone físico, avaliação de aprendizagem e validação de Libras por pessoa surda permanecem pendentes.

[Jogar](https://nasa-missaoipe.alexandrebelo.com/lab/index.html) · [Painel privado](https://nasa-missaoipe.alexandrebelo.com/dashboard/index.html) · [Handoff dos dois devs](https://nasa-missaoipe.alexandrebelo.com/docs/70-HANDOFF-GAME-R26.html) · [Auditoria Bruno/Fastmode](docs/67-AUDITORIA-BRUNO-FASTMODE-R26.md) · [Áudio e skills](docs/68-AUDIO-ANIMACAO-E-SKILLS-R26.md) · [Autoria Rive](docs/69-RIVE-MISSOES-R26.md)

Este registro identifica as implantações verificadas. O commit documental posterior publica os recibos e atualiza o handoff, sem mudar o runtime do jogo.

---

## R25 — seis missões, Start, hangar e progresso

**Publicada em 15/11/2026.** Implementação `ccfad7cc1c3e57e2a4eeb16d04acde40de44489e`. Principal `dpl_78mHsM8kwxip6pK42sZSnAYS6YmS` e LP `dpl_CyCXVNPMbpYBB8s5PUz6YWj3xKXE`, ambos **READY** no mesmo commit. Inclui a revisão R24 de design, identidade SVG, navegação, fontes locais e Rive.

Start abre o fluxo Nome → E-mail → Tipo → Play. O centro de comando reúne ISS, Lua, Marte, Cerrado, Bennu e Webb. Nas três adaptações de Bruno, seis escolhas alteram a nave e os recursos; lançamento e relatório permitem investigar e redesenhar. A pontuação é recalculada pelo servidor e os resultados alimentam o painel privado. A nave é didática; os três casos científicos preservam seus dados históricos.

Verificação local: 169 testes de domínio, 98 de interface, 33 de métricas, 16 de Libras/analytics e 18 de distribuição aprovados. Em navegador: ISS 0→6 válidos/92 pontos, Lua 6/90, Marte bloqueado→6/91; cinco tentativas confirmadas e conservadas após reload. Os três GLBs NASA renderizaram, incluindo Perseverance a 390 px. Em 320 e 390 px não houve overflow horizontal. [Recibo funcional](evidence/r25-functional-qa.json).

**Aceite em produção.** Quatorze rotas e assets do domínio oficial responderam corretamente, incluindo o jogo e os quatro handoffs. Os bytes do Rive e dos três GLBs correspondem ao original. Na LP, sete verificações passaram, incluindo a 404 real, fontes locais e a apresentação de seis missões. A API persistiu seis tentativas sintéticas únicas, aceitou o reenvio sem duplicar e recalculou exatamente os resultados dos seis motores; acesso anônimo ou de jogador ao painel permaneceu em `401`. [Assets e rotas](evidence/r25-production-assets.json) · [Métricas privadas](evidence/r25-production-metrics.json) · [LP](evidence/r25-lp-production.json). No navegador público, o novo Start abriu corretamente e o avatar de Libras continuou da tela inicial à orientação de Nome, sem receber os campos. Estes recibos identificam a implantação verificada; o commit documental posterior os publica sem alterar o jogo.

O DCC-MCP respondeu com zero hosts conectados. O pacote usa assets NASA locais; Meshy não foi conectado e nenhum crédito foi consumido. A exportação Rive mantém sua abertura de marca. O aceite em celular físico, a qualidade linguística de Libras e a aprendizagem humana permanecem pendentes.

[Handoff dos dois devs](docs/65-GAME-E-MISSOES-BRUNO-R25.md) · [Assets e DCC](docs/66-PIPELINE-ASSETS-3D-R25.md) · [Rive](docs/63-RIVE-E-HANDOFF-R24.md) · [Design acessível](docs/64-DESIGN-ACESSIVEL-R24.md)

---

## R23 — bancada de equipamentos, comparação e Libras

**Publicada em 15/11/2026.** Commit `80ce5ade8e566e3e3a6ff03ac998fff2814ac94f`. Principal `dpl_JzXF1uf9fG2y4erahFjXWe1rkriJ` e LP `dpl_e9YKvrsRVoMCy5SYPo1PonHFWPx5`, ambos **READY**. A bancada liga as escolhas ao equipamento e aos recursos. A comparação A/B usa o mesmo T+ e permite investigar o primeiro evento diferente. Os callouts usam valores do catálogo.

**Verificação local do candidato.** `npm run build:release` passou com o ajuste do cabeçalho em telas estreitas; o build da LP também passou. O laboratório passou em **164/164** testes de domínio e **83/83** de interface. A suíte de métricas passou em **26/26**. Em navegador com GPU e viewports desktop e móvel, o Cerrado entregou **6/6** com bateria de 24 Wh e contatos longos, Bennu passou de **2/6 para 6/6** ao ampliar os contatos e Webb passou de **0/6 para 6/6** ao trocar a câmera pelo espectrômetro. O reteste em 320 px confirmou ausência de overflow horizontal em Cerrado e Webb (largura do documento igual à viewport).

**Domínio e Cloudflare.** O domínio oficial serviu o portal e o laboratório por HTTPS. O beacon carregou e o painel Cloudflare registrou **uma visita técnica** em `/`, Brasil, Chrome desktop, com o filtro de exclusão de bots desligado. [Portal](https://nasa-missaoipe.alexandrebelo.com/) · [Jogo](https://nasa-missaoipe.alexandrebelo.com/lab/index.html) · [Central da equipe](https://nasa-missaoipe.alexandrebelo.com/equipe/index.html) · [Pitch](https://nasa-missaoipe.alexandrebelo.com/presentation/pitch/index.html)

**Libras em produção.** O avatar sinalizou no portal, continuou ativo ao entrar no laboratório e acompanhou **Nome → E-mail**. O trecho continha apenas a orientação da etapa. O console registrou avisos de armazenamento no iframe isolado e bloqueio de uma importação opcional do PostHog pela CSP. Na inspeção do laboratório também foi observado o aviso de depreciação de `THREE.Clock`. [Recibo funcional R23](evidence/r23-functional-qa.json)

**Métricas privadas em produção.** Cadastro sintético `201`, gravação e reenvio idêntico `200`, três tentativas únicas na leitura autenticada. O servidor recalculou **92/100** no Cerrado, **51/100** em Bennu e **92/100** no Webb e a rota administrativa manteve `401` sem sessão. [Recibo da API em produção](evidence/r23-production-metrics.json)

**LP e fechamento documental.** Sete verificações HTTP da LP passaram, incluindo a 404 personalizada e a igualdade dos assets de Libras. Esta revisão reúne os recibos e direciona os links da LP e da central da equipe ao domínio oficial. [Recibo da LP](evidence/r23-lp-production.json)

A autoria Rive aguarda um arquivo ativo no editor. O aceite em celular físico, a qualidade linguística da Libras e a aprendizagem humana dependem de validação com usuários.

[Handoff dos dois devs](docs/61-BANCADA-COMPARACAO-E-LIBRAS-R23.md) · [Domínio e Cloudflare](docs/62-DOMINIO-E-CLOUDFLARE-R23.md) · [Recibo DNS/TLS](evidence/domain-cloudflare-r23.json)

---

## R21 — entrada imersiva, métricas privadas e pitch de 3 minutos

**Correção posterior de marca e Libras:** commit `6c3eeee2eec94a2c7aed1ac551ebce7d7b865463`, principal `dpl_AdCLA4JZZxBc14eJE9CRssHqhv2A` e LP `dpl_EUTccHSM6WQJd85p22xo4yYf6wZp`, ambos READY. Os SVGs oficiais estão aplicados no cabeçalho, painel e pitch; a assinatura vertical e os originais estão na [galeria da marca](https://projeto-ipe.vercel.app/brand/preview-r22.html). O guia de Libras da LP abre na rota correta, com isolamento conferido. [Revisão e alcance](evidence/brand-deploy-review-r22.json).

**Acervo ASTRAL:** o [levantamento para os dois devs](https://projeto-ipe.vercel.app/docs/60-OPORTUNIDADES-ACERVO-ASTRAL.html) identifica 40 arquivos, 22 já idênticos ao repositório e nenhuma nova malha 3D. Prioriza bancada, recursos, comparação A/B e ligação aos modelos NASA existentes. Não houve importação duplicada nem alteração do motor. A conferência pública da marca passou em sete caminhos com conteúdo idêntico ao local; a conferência integral de todos os arquivos deste commit ficou incompleta por problemas de conexão, sem substituir o recibo completo do R21 anterior.

Implementação `327710db39ce070991f01595a54b5800a4f97f64`, beta **0.12.0-beta.1**. Jogo `dpl_Aeq3CfXP1xHLYfAsSCCyoqH5Ag49` e LP `dpl_37udA3fCezmdSUCbgGkU8Q5KgNnN` concluídos como **READY**. O recibo do principal verificou 393 arquivos públicos e 119 documentos; o teste HTTP da API passou em 30 verificações, com uma participação sintética e três tentativas de teste, identificadas como testes técnicos, não participantes humanos.

- Entrada em tela inteira: nome → e-mail → missão → play; alternativa funcional se o navegador não permitir tela cheia.
- Três missões científicas atuais, pontuação calculada no servidor, painel privado, comparação A/B e análise por papéis.
- Pitch: seis cenas, 180 segundos, fala de Alexandre Belo e assinatura final com as marcas.
- Acesso a Libras sob demanda, separado dos campos privados. A revisão posterior identificou o link incorreto da LP e trata a URL de guia exportada pelo Next.
- [Handoff das métricas](https://projeto-ipe.vercel.app/docs/54-METRICAS-E-HANDOFF-R21.html), [marca e deploy](https://projeto-ipe.vercel.app/docs/59-MARCA-OFICIAL-E-DEPLOY.html), [kit da pré-banca](https://projeto-ipe.vercel.app/docs/57-KIT-PRE-BANCA-R21.html).

Os recibos em `evidence/production-r21.json`, `evidence/production-lp-r21.json` e `evidence/metrics-production-r21.json` identificam o commit e o escopo efetivamente conferidos. A prova da API não certifica aprendizado, acessibilidade humana ou prazo de retenção no provedor. A pesquisa da expansão ISS/Lua/Marte está no documento 58; essas novas missões ainda não integram o jogo publicado.

---

## R20 — primeira experiência e pitch de Alexandre Belo

**Beta 0.11.0-beta.1 publicada e conferida em 15/11/2026**, edição `R20-beginner-journey-and-pitch`. Commit de implementação e integração `4dfc9db57401f151541a47ea50fa5c9635b0a146`. Vercel principal `dpl_FzyYbNALWL3CH4fBZF4FiLPpfWaw`; LP `dpl_CAobAam3N7wixbP57HCcrDw766kz`: ambas **READY**, mesmo commit e domínios públicos confirmados pela API.

- [Jogar as três missões](https://projeto-ipe.vercel.app/lab/index.html): escolha destaca o sistema correspondente; termos científicos são explicados; resultado final e relógio do replay ficam separados. Copiar o ensaio A/B orienta o retorno ao projeto, sem executar automaticamente.
- [Pitch de Alexandre Belo](https://projeto-ipe.vercel.app/pitch): sete cenas, roteiro de três minutos, notas, teclado, tela cheia, movimento reduzido, fontes NASA e comparação interativa de Bennu. Duas curvas da MotionMaxxing adaptadas para Web Animations, com licença e atribuição locais.
- [Handoff dos dois devs](https://projeto-ipe.vercel.app/docs/51-QA-INICIANTE-E-HANDOFF-R20.html) e [guia do apresentador](https://projeto-ipe.vercel.app/docs/52-PITCH-ALEXANDRE-BELO-R20.html). Alexandre recebe crédito nominal; a marca principal é a logo oficial da equipe. Como complemento solicitado após esta conferência, o pitch inclui a assinatura pessoal AB exportada do brandbook Figma e o link para alexandrebelo.com.br. Os recibos abaixo preservam o corte anterior a esse complemento.
- [LP imersiva](https://projeto-ipe-lp.vercel.app/) conecta o novo pitch, mantendo jogo, créditos e 404.

**Verificação:** 152 testes de domínio e 60 de interface no laboratório, 2 regressões do pitch, 17 da distribuição e 24 do contexto. LP: build, 22 testes de navegador, 4 de motor e 17 assets íntegros. [Recibo local](evidence/revision-r20.json). Percurso de iniciante realizado por agentes nas três missões; não constitui estudo com participantes humanos.

**Produção:** 368 arquivos com HTTP 200, hashes e políticas corretos; biblioteca de 114 documentos; `/pitch` redireciona para a apresentação canônica. No navegador público, A/B de Bennu mudou de 2 para 6 e a câmera incompatível do Webb manteve a explicação do próprio caso, sem erro de console observado. [Recibo principal](evidence/production-r20.json) · [recibo LP](evidence/production-lp-r20.json).

A PR #2 de FASTMODE chegou ao repositório durante esta revisão e foi preservada integralmente em `fastmode/`, por merge sem conflitos. Seus casos e pitch são uma contribuição paralela, não fazem parte da validação ou da distribuição curada desta R20. O próximo trabalho é revisar essa contribuição antes de associá-la à jornada científica principal.

Este registro identifica as implantações verificadas acima. Seu commit documental aciona outra implantação com os mesmos runtimes. Aprendizagem humana, toque em celular físico e desempenho GPU continuam sem certificação. A auditoria automatizada de acessibilidade do pitch ficou incompleta; os testes de acessibilidade da LP pertencem à suíte própria.

---

## R18 — registros reais de Bennu e Webb

Beta **0.9.0-beta.1**, edição `R18-real-nasa-scientific-records`. **Publicada e conferida** no commit `1bb440801e2e6dcd3094c10878b5d643ba55dd83`. Implantação principal `dpl_2kU48qhgiXLNpKRCwNiryfCLzSXW`, READY, em [jogo e documentação](https://projeto-ipe.vercel.app/). LP `dpl_FLo1NQcrA3e9B4uaTrCYuwgQaZhq`, READY, em [entrada orbital](https://projeto-ipe-lp.vercel.app/). API da Vercel confirmou o mesmo commit e os dois domínios; acesso público sem login.

- **Bennu:** dimensões reais de seis rochas/clastos, fonte NASA NTRS e Tabela Suplementar 1; sete linhas preservadas para auditoria, seleção e resolução documentadas. Imagem contextual oficial com crédito.
- **Webb:** seis bins de um trânsito de WASP-39 b, redução FIREFLy/NIRSpec PRISM. Tabela NASA de 95 pontos conferida contra o arquivo dos autores. Grandeza em porcentagem de luz bloqueada, com incertezas de 1σ em pontos percentuais.
- **Jogo e 3D:** registros por ID, gráfico com incertezas, lacunas preservadas e botão para rever a entrega no 3D. Escolhas de instrumento, energia e comunicação mudam a entrega; jamais os valores científicos.
- **Continuidade:** [dados, fontes e limites](https://projeto-ipe.vercel.app/docs/45-DADOS-REAIS-BENNU-WEBB-R18.html) · [handoff dos dois devs](https://projeto-ipe.vercel.app/docs/46-HANDOFF-DOIS-DEVS-R18.html). Projetos antigos são recusados com explicação; novos contratos identificam R18/v2.
- **Referência visual:** Cosmic Mapping inspecionado na prévia pública; fluxo original de evidência e uso dos modelos NASA existentes. Nenhum asset pago copiado ou dependência nova; REA/AB-R3A não foi necessário.

**Validação:** laboratório 148 testes de domínio + 38 de interface; campanha 120 + 14; contexto 24; distribuição 17; portal 12; LP 18 jornadas de navegador. Builds estáticos aprovados. [Recibo local](evidence/revision-r18.json).

**Produção:** 339 arquivos públicos com HTTP 200 e hashes/políticas conferidos; biblioteca de 108 documentos nessa implantação. LP: 15 assets públicos e duas páginas conferidos. Navegador abriu o espectro real na produção, sem erro de console observado. [Recibo principal](evidence/production-r18.json) · [recibo LP](evidence/production-lp-r18.json). O commit de encerramento republica estes recibos e o estudo de oportunidades, separa os JSON de execução das cópias públicas e esclarece a comparação dos pacotes de solo; os recibos preservam o corte das implantações acima.

Os arquivos são históricos reais. A nave, a agenda e os recursos são didáticos; não há nova observação NASA, telemetria ao vivo, validação de voo ou comprovação de aprendizagem humana.

---

## R17 — identidade oficial, fontes NASA e consolidação

Beta **0.8.0-beta.1**, edição `R17-official-brand-and-evidence-based-stories`. **Publicada e conferida** no commit `5ecb1a44fcabf32c63741711a78bf3c17efff671`. Site principal: `dpl_FcoSRJ2J4fANM6wPjxdL8KQHJrsq`, READY, [jogo e documentação](https://projeto-ipe.vercel.app/). Página imersiva: `dpl_4ZXSCxTUUwutpU3MnfHNHHRDRwv3`, READY, [entrada orbital](https://projeto-ipe-lp.vercel.app/). Ambos públicos, sem login; a API confirmou o mesmo SHA e a atribuição dos domínios.

- Marca **MISSÃO IPÊ** em SVG transparente, originais preservados e variante para fundo claro. O ipê identifica a equipe; a narrativa científica não usa a árvore como tema.
- Três histórias reais: Terra/MODIS, OSIRIS-REx/Nightingale e Webb/WASP-39 b, com fontes NASA, datas e limites dos exercícios sintéticos. Personagens inventados também foram retirados da campanha.
- PR #1 incorporada com histórico em `apps/immersive-lp/`, corrigindo a pasta ausente que causava erros no projeto Vercel da LP. O site principal mantém seu endereço.
- Contribuição de Bruno consolidada como snapshot revisado de 32 arquivos, autoria e cinco commits referenciados. Três moodboards e favicon excluídos; código de referência fora do motor e do build oficial.
- [Handoff R17](https://projeto-ipe.vercel.app/docs/43-HANDOFF-GERAL-R17.html), [histórias reais](https://projeto-ipe.vercel.app/docs/44-HISTORIAS-REAIS-E-LIMITES-DIDATICOS.html), [marca e Figma](https://projeto-ipe.vercel.app/docs/40-IDENTIDADE-MISSAO-IPE-R17.html), [avaliação de prontidão](https://projeto-ipe.vercel.app/docs/42-PRONTIDAO-E-CRITERIOS-SPACE-APPS-R17.html).

**Verificação local:** 145 testes de domínio + 38 de interface no laboratório; 120 + 14 na campanha; 24 de contexto; 17 de distribuição; 12 do portal. LP: 4 de motor, 18 de interface e 17 assets conferidos. Compilações e TypeScript aprovados. [Recibo R17](evidence/revision-r17.json).

**Verificação pública:** 326 arquivos do principal com HTTP 200 e hashes/políticas correspondentes; biblioteca com 103 documentos. LP com 15 assets públicos correspondentes e páginas inicial/créditos HTTP 200; os dois arquivos KayKit de desenvolvimento permanecem somente no Git. Navegador confirmou marca, três entradas científicas, fontes e quatro segmentos; nenhum erro de console observado nas ações realizadas. [Recibo principal](evidence/production-r17.json) · [recibo LP](evidence/production-lp-r17.json). Este commit documental aciona uma nova compilação; os recibos identificam as implantações acima.

A candidatura ainda exige comprovação de aprendizagem, verificação em aparelho físico, pacote de submissão e esclarecimento da elegibilidade temporal. Nenhuma promessa de premiação ou decisão dos organizadores é inferida dos testes.

---

## Histórico R16

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



## R19 · trilha da evidência, A/B e quatro papéis · 15/11/2026

Versão 0.10.0-beta.1. A implementação das três prioridades está concluída nas três missões. A integração local passou 151 testes de domínio, 56 de interface, 17 verificações da distribuição e 18 jornadas da apresentação. O recibo técnico está em `evidence/revision-r19.json`. [Handoff R19](docs/48-HANDOFF-DOIS-DEVS-R19.md) · [roteiro de apresentação](docs/49-ROTEIRO-APRESENTACAO-MVP-R19.md). Primeira publicação R19 confirmada no commit `2dc6766fd4f690fb3f07c9a6c29beb6e67158cb1`: jogo `dpl_AeY179hA29psoAUZaF9Vn6hTPris` e apresentação `dpl_9XGthS5JJSQXdLKvTiqQS1JXowEv`, ambos READY na Vercel. A conferência pública de 345 arquivos e 111 documentos passou sem falhas; consulte `evidence/production-r19.json`. O ajuste final da etapa selecionada na trilha e este recibo são publicados no commit de fechamento; o recibo anterior conserva a identificação da versão conferida.
