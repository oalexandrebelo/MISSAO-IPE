# R29 · missões e assets de Bruno e Fastmode

A base oficial da auditoria é `064141a7c7c9ed54720943236d15e4e26938b34e`. Na R28, as sete entradas do jogo já cobriam os cinco destinos de Bruno. A R29 reaproveita a escolha de quantidade da loja e mantém a origem das missões identificada no lobby. [GameShell na base R28](https://github.com/oalexandrebelo/MISSAO-IPE/blob/064141a7c7c9ed54720943236d15e4e26938b34e/experiments/mission-design-lab/src/ui/GameShell.tsx) · [Handoff do lobby R29](75-LOBBY-IMERSIVO-E-HANDOFF-R29.md)

## Versões conferidas

| Origem | Revisão e autoria | Diferença desde o snapshot |
| --- | --- | --- |
| Bruno · projeto de deploy | `main` em `f29ab8cca72bdf6d8d6dfb863c7670423b3400bf`, árvore `58154203996a09c1fc0f5024d1ab4b5119f107f7`. Bruno A Carvalho. | Três commits após `fa18fd3`, apenas em `App.tsx` e `index.css`. Ajustes de resposta ao toque, carrinho vazio, quebra de texto e rolagem. [Comparação do GitHub](https://github.com/bruno-assis-carvalho/missao-ipe-deploy/compare/fa18fd38439921f97286325b2bdf8c7545d7c776...f29ab8cca72bdf6d8d6dfb863c7670423b3400bf) |
| Bruno · repositório original | `master` em `53e031e82b8bd6c182ae5c37ea4ca6331ec4bdcf`, árvore `04dcc3923164ba88c3b11d3af764823ee9e8c2f5`. Bruno A Carvalho. | Um commit após `f54fb88` introduz loja, carrinho, devolução e troca do lockfile. Os blobs de App, CSS e regras são idênticos aos do primeiro deploy `5b2e42c080cdd332c397803c28a2076951603ff8`. [Comparação do GitHub](https://github.com/brunoassiscarvalho/missao-ipe/compare/f54fb88a237216d6c1e72b75b400767fb3a75661...53e031e82b8bd6c182ae5c37ea4ca6331ec4bdcf) · [Primeiro deploy](https://github.com/bruno-assis-carvalho/missao-ipe-deploy/commit/5b2e42c080cdd332c397803c28a2076951603ff8) |
| Fastmode · Alexandre Belo | Cabeça histórica `416c1f93b2c6557f98c4e8e7f8dc2a20b6dea7b3`, anunciada em `refs/pull/2/head`. Merge `6c8df630946c581c2a56d938d03386fd3ead111f`. | A árvore `fastmode/` da PR é idêntica à da base oficial. A branch `feat/fastmode-mvp` está identificada na PR. [PR #2](https://github.com/oalexandrebelo/MISSAO-IPE/pull/2) |

A contribuição filtrada do repositório original está em `contributions/bruno-figma/`. O snapshot de deploy contém 37 dos 38 blobs de `fa18fd3`, sob `deploy-2026-11-15/`. As duas árvores atuais de Bruno estão sem arquivo de licença. As fontes, créditos, hashes e exclusões originais estão no histórico. [Origem das contribuições](https://github.com/oalexandrebelo/MISSAO-IPE/blob/064141a7c7c9ed54720943236d15e4e26938b34e/contributions/bruno-figma/ORIGEM-E-INTEGRACAO.md) · [Manifesto R26](https://github.com/oalexandrebelo/MISSAO-IPE/blob/064141a7c7c9ed54720943236d15e4e26938b34e/contributions/bruno-figma/deploy-2026-11-15/MANIFESTO.json)

## Cinco destinos de Bruno na campanha oficial

| Cenário de Bruno | Entrada oficial | Ciência e asset de referência |
| --- | --- | --- |
| Pulso Orbital · ISS | `iss` | Proteção da calibração e monitor de ar. Modelo `iss-carbajal-b.glb`, NASA / Michael D. Carbajal. |
| Eco Lunar · Lua | `moon` | LEND e Diviner cruzam indícios de hidrogênio e temperatura. Modelo `lro-meaney-a.glb`, NASA / Christopher R. Meaney. |
| Horizonte Rubro · Marte | `mars` | MEDA, prazo e proteção de entrada. Modelo `mars-2020-perseverance.glb`, NASA / JPL-Caltech. |
| Oceano Silencioso · Europa | `europa` | MISE e REASON orientam uma investigação de habitabilidade. A Europa Clipper é a referência de voo, e MISE e REASON são as peças da carga didática. Modelo `europa-clipper-vtad.glb`, NASA VTAD, aberto a pedido na missão. |
| Retorno Bennu · Bennu | `bennu` | A entrada atual usa seis dimensões publicadas de rochas e clastos para investigar evidência e entrega de dados. Modelo `bennu-1999-rq36.glb`, com crédito no manifesto NASA. A contribuição fornece um objetivo de amostragem distinto. |

Os quatro casos de engenharia já usam montagem, inventário, reserva, desgaste, recálculo e métricas oficiais. A loja mantém sete fichas, incluindo OVIRS como referência a Bennu. Cerrado e Webb completam o catálogo oficial com arquivos científicos próprios. [Catálogo de Bruno](https://github.com/bruno-assis-carvalho/missao-ipe-deploy/blob/f29ab8cca72bdf6d8d6dfb863c7670423b3400bf/src/App.tsx#L202-L338) · [Missões no motor oficial](https://github.com/oalexandrebelo/MISSAO-IPE/blob/064141a7c7c9ed54720943236d15e4e26938b34e/experiments/mission-design-lab/src/lab/bruno-missions.ts) · [Handoff de inventário](71-INVENTARIO-EUROPA-E-HANDOFF-R27.md)

### Retorno Bennu no briefing atual

A fonte de Bruno descreve coleta e retorno à Terra em um briefing com a nave fictícia ÍCARO. O aplicativo aplica a montagem e a avaliação comuns a esse cenário. A representação das fases de coleta, retorno e recuperação exigiria um modelo próprio.

O conteúdo foi integrado em **Bennu → Necessidade → história da missão**, em `MissionStories.tsx`, com fonte NASA ligada ao texto. A OSIRIS-REx coletou material de Bennu em 20 de outubro de 2020. A cápsula trouxe a amostra à Terra em 24 de setembro de 2023. No exercício, o jogador compara seis dimensões publicadas e investiga o que chega ao solo pelo enlace. A descrição histórica completa a pergunta que a missão oficial já calcula. [Caso original de Bruno](https://github.com/bruno-assis-carvalho/missao-ipe-deploy/blob/f29ab8cca72bdf6d8d6dfb863c7670423b3400bf/src/App.tsx#L311-L337) · [Cronologia da OSIRIS-REx · NASA](https://science.nasa.gov/mission/osiris-rex/in-depth/) · [Expedição científica oficial](https://github.com/oalexandrebelo/MISSAO-IPE/blob/064141a7c7c9ed54720943236d15e4e26938b34e/experiments/mission-design-lab/src/lab/scientific-expeditions.ts#L77-L95)

## Cenários de Fastmode

| Cenário | Onde existe | O que cabe reaproveitar |
| --- | --- | --- |
| M0 · Semente | Um objetivo e dois requisitos no tutorial do runtime. | Orientação breve sobre projeto e verificação. A entrada oficial já permite começar diretamente por uma missão científica. |
| M1 · Raízes | Quatro objetivos terrestres e cinco requisitos no runtime. | O caso Cerrado já trabalha observação e entrega com dados Terra/MODIS. Objetivos como metano, fogo e aerossóis dependeriam de outros dados e critérios. |
| M2 · Gelo Lunar | Quatro objetivos e três requisitos no runtime. | A investigação polar já tem lugar em Eco Lunar com instrumentos coerentes com a pergunta. Profundidade de sondagem ou dose requerem um cálculo próprio. |
| M3 · A Travessia | Missão com quatro tripulantes. Saúde, dose e eventos de decisão no runtime. | Tema distinto da estação meteorológica de Jezero. A revisão por quatro papéis da missão oficial é uma atividade no mesmo dispositivo. Uma campanha tripulada precisa de requisitos, decisões causais e pontuação próprios. |
| M4 · Mensageiro | JSON de design. | Briefing de asteroides para pesquisa futura. O destino Bennu já tem caminho jogável com evidência identificada. |
| M5 · Clima Extremo | JSON de design. | Briefing de clima espacial para pesquisa futura, com outra pergunta, dados científicos e modelo. |

O seletor de Fastmode percorre os quatro casos de `fastmode/js/data.js`. O arquivo de design inclui seis propostas. O A/B do oficial usa a régua e a evidência de cada missão. As operações por turnos e a régua de mil pontos pertencem ao protótipo autônomo. [Seletor Fastmode](https://github.com/oalexandrebelo/MISSAO-IPE/blob/416c1f93b2c6557f98c4e8e7f8dc2a20b6dea7b3/fastmode/js/app.js#L138-L158) · [Dados do runtime](https://github.com/oalexandrebelo/MISSAO-IPE/blob/416c1f93b2c6557f98c4e8e7f8dc2a20b6dea7b3/fastmode/js/data.js) · [Catálogo de design](https://github.com/oalexandrebelo/MISSAO-IPE/blob/416c1f93b2c6557f98c4e8e7f8dc2a20b6dea7b3/fastmode/design/dados_missao_ipe.json)

## Inventário de mídia

| Origem | Itens auditados | Situação no oficial |
| --- | --- | --- |
| Deploy de Bruno | `public/missao-ipe.svg`, `public/favicon.png`, os PNGs de 192 e 512 px e o `manifest.webmanifest`. | Cinco blobs conferidos com o manifesto R26 e com os SHA-256 do snapshot local. São arquivos de identidade ou instalação do protótipo. O lobby usa a assinatura oficial da equipe. |
| Repositório original | `mood board/image.png`, `image copy.png`, `image copy 2.png` e `public/favicon.png`. | Quatro blobs idênticos aos que constavam nas exclusões R17. O inventário registra o favicon de scaffold e as referências de moodboard sem licença atribuída, incluindo a marca d’água de uma das imagens. |
| Fastmode | Oito capturas em `fastmode/docs/` de boot, bancada, Gelo, mobile, operações, relatório e duas versões do estudo A/B. | Oito blobs distintos já versionados. Horizonte, estrelas e movimento vêm de CSS, SVG e Canvas. O áudio vem de osciladores. As capturas documentam o protótipo. |
| Acervo oficial | Modelos NASA do ISS, LRO, Perseverance, Europa Clipper, Bennu, Webb, CubeSat genérico e DSN. Rive de subsistemas e sequência em `public/rive`. Imagens da Terra na LP e imagens Terra, Cerrado, Bennu e Sol em `web/media/`. | Arquivos com origem própria, já usados no jogo ou no portal. O manifesto do lobby registra a procedência dos mapas equiretangulares novos. A fotografia da Terra na LP e os modelos de espaçonave têm funções visuais distintas. |

Os novos commits de Bruno mantêm os blobs de mídia. As versões de deploy usam CSS, ícones, fontes remotas e arquivos de marca. A conferência das árvores encontrou os mesmos recursos listados no manifesto e nenhum novo modelo 3D, faixa de áudio, vídeo ou arquivo Rive para incorporar. O ZIP mantém o mesmo blob excluído no R26 e reúne uma cópia redundante da fonte com metadados Git. [Inventário R17](https://github.com/oalexandrebelo/MISSAO-IPE/blob/064141a7c7c9ed54720943236d15e4e26938b34e/research/bruno-consolidation-r17.json) · [Mídia Fastmode](https://github.com/oalexandrebelo/MISSAO-IPE/tree/416c1f93b2c6557f98c4e8e7f8dc2a20b6dea7b3/fastmode/docs) · [Fontes das superfícies do lobby](75-LOBBY-IMERSIVO-E-HANDOFF-R29.md)

## Diferenças úteis de interface

- **Compra por quantidade incorporada.** A ficha permite escolher várias unidades do instrumento selecionado e mostra o total em créditos. A quantidade respeita o saldo exibido e o limite de 20 unidades por pedido. A API recebe um único `buy` com a lista de IDs, aplica as regras de saldo e cria as unidades com identificadores próprios. O reenvio usa o mesmo recibo e a carga é equipada separadamente no hangar. No teste com handler local, três monitores custaram 15 créditos. O recibo recuperado manteve três unidades distintas, saldo de 10 e nenhuma reserva.
- **Carrinho misto e troca de estado.** No protótipo, o carrinho agrupa quantidades de instrumentos diferentes. A R29 leva uma quantidade de um instrumento por pedido, com preço total antes de confirmar. O checkout do Bruno que apenas sai da loja quando o carrinho está vazio cede lugar à ação explícita **Voltar ao hangar** no jogo oficial.
- **Cards bloqueados e rolagem.** A última revisão de Bruno acrescenta um aviso ao tocar em um cenário bloqueado e ajusta rolagem e quebras dos controles. O oficial oferece as sete missões desde a seleção. O aviso é aplicável a restrições reais, como saldo insuficiente, reserva indisponível ou operação ativa.
- **Créditos, pontuação e cenário.** O protótipo usa saldo compartilhado e recompensa por nível e capacidade. O oficial usa carteira virtual, orçamento de engenharia próprio e recálculo por versão. Os números do protótipo e o sistema de pontuação Fastmode são documentos de referência. [Regras e crédito R27](71-INVENTARIO-EUROPA-E-HANDOFF-R27.md)
