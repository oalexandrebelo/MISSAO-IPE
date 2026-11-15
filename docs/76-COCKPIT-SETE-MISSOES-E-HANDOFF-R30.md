# R30 · cockpit das sete missões e handoff

O jogador deve conseguir responder três perguntas em qualquer etapa: onde estou, o que minha escolha mudou e o que falta fazer. A revisão leva a composição do lobby ao hangar, à montagem e à operação, usando o estado do jogo como fonte para as cenas.

## Referência de Bruno e decisões de integração

A tela de Bruno foi percorrida em 15/11/2026: início, guia, catálogo, briefing ISS e montagem por sistema. A referência organiza decisões de veículo, propulsão, energia, proteção e navegação, mantendo indicadores previstos visíveis. A captura enviada pela equipe também sugere progressão por níveis. O jogo oficial mantém os sete destinos acessíveis: uma visita ao briefing ou uma troca de componente não prova domínio de um nível.

O briefing original de 2031 e o equipamento fictício AERIS não foram importados como fatos NASA. Permanecem o contexto científico documentado e os parâmetros identificados como didáticos. O comparativo de versões, assets e autoria está na [auditoria R29](74-AUDITORIA-BRUNO-E-IMERSAO-R29.md). [Aplicativo de referência](https://missao-ipe-deploy.vercel.app/) · [Repositório de Bruno](https://github.com/bruno-assis-carvalho/missao-ipe-deploy).

A nova revisão de Bruno, [`8b106264abf578ac0fd39a70a077381c01ba42c3`](https://github.com/bruno-assis-carvalho/missao-ipe-deploy/commit/8b106264abf578ac0fd39a70a077381c01ba42c3), acrescenta orçamento inicial de 35, ajustes de recompensa e um encerramento de campanha. O comparativo com `f29ab8c` altera apenas `GameRules.md`, `src/App.tsx` e `src/index.css`; não contém novas mídias. O bloqueio de reconstrução após sucesso não foi transportado: testar alternativas é parte do aprendizado da MISSÃO IPÊ. A carteira oficial e as regras de pontuação continuam nas unidades didáticas do motor atual.

## O propósito das sete missões

| Missão | Decisão que ensina | O que conta como resultado |
| --- | --- | --- |
| ISS | Transportar o monitor sem perder calibração e manter energia e enlace. | Leituras simuladas produzidas, recebidas e válidas, com condição do instrumento. |
| Lua | Combinar LEND e Diviner, reserva e janela de comunicação. | Registros completos; a referência ao polo sul não equivale a descobrir gelo. |
| Marte | Equilibrar prazo, proteção de entrada e MEDA. | Medições didáticas entregues após a chegada prevista. |
| Europa | Reservar encaixes para MISE e REASON e sustentar a coleta. | Registros simulados compatíveis; não são descobertas futuras da Europa Clipper. |
| Cerrado | Equilibrar processamento, memória, energia e rádio. | Seis registros históricos MODIS completos e válidos. |
| Bennu | Escolher a cadeia de imagem e entregar dimensões publicadas de rochas. | Arquivos históricos preservados; não há simulação TAG ou retorno de cápsula. |
| Webb | Escolher espectrometria e entregar os bins de WASP-39 b. | Profundidade de trânsito e incerteza publicadas; não há nova observação NASA. |

## Contratos que os dois devs devem preservar

### A escolha e sua representação

| Família | Escolha | Como interpretar a vista |
| --- | --- | --- |
| ISS, Lua, Marte e Europa | Lançador | Veículo e envelope de integração compatíveis com a classe didática selecionada. |
| ISS, Lua, Marte e Europa | Propulsão e proteção | Bocal e proteção se distinguem; a pluma depende da fase, não apenas do painel aberto. |
| ISS, Lua, Marte e Europa | Energia | Banco de bateria de 360 ou 640 Wh. Essa escolha não representa aumento de painéis solares no catálogo atual. |
| ISS, Lua, Marte e Europa | Navegação e instrumentos | Antena, destaque de enlace e instrumentos equipados. A condição vem da unidade do inventário. |
| Cerrado | Painel e bateria | Área conceitual dos painéis e capacidade da reserva; os estados registrados indicam iluminação e energia. |
| Cerrado | Processamento, memória e rádio | Módulos, ocupação e transmissão representam escolhas e eventos; não alteram o valor científico dos arquivos. |
| Bennu e Webb | Instrumento e energia | Óptica/carga e geração/reserva acompanham o catálogo. Imagem e espectro atendem a perguntas diferentes. |
| Bennu e Webb | Lançador, perfil, duração e solo | Envelope e agenda de operação. Ampliar contatos mantém a mesma antena e taxa do catálogo; muda o tempo disponível. |

O lançamento nas campanhas científicas é inspecionado como envelope de integração e verificação do projeto. O relógio operacional começa após a chegada. Não há propagação de ascensão, manobra TAG ou viagem física até L2 escondida na animação.

### Luz e recursos

O hangar usa [Studio Small 01](https://polyhaven.com/a/studio_small_01), de Greg Zaal / Poly Haven, sob [CC0](https://polyhaven.com/license). O arquivo HDR de 1024 × 512 pixels tem 1.701.440 bytes, sem conversão; o manifesto local conserva origem, crédito e SHA-256. A imagem ilumina reflexos da montagem, sem aparecer como fundo espacial ou evidência NASA. As luzes existentes oferecem uma alternativa se o carregamento falhar. As superfícies NASA e seus créditos seguem os manifestos da R29.

**Dev A · simulação e dados.** O motor calcula a tentativa. A cena consome configuração e eventos; seu relógio de renderização não pode conceder pontos, criar registros, consumir ciclos ou recompensar a carteira. Os quatro casos da campanha de Bruno usam reserva e inventário autoritativos. O custo de lançamento, o desgaste e a recompensa continuam sujeitos à confirmação da API. A previsão deve permanecer distinta do resultado executado. Não transformar a tabela de decisões em uma alegação de trajetória ou desempenho de hardware real.

**Dev B · interface e 3D.** A escolha deve destacar a peça correspondente e explicar a consequência em texto. Nem toda escolha troca uma peça: janelas de contato e duração mudam a agenda, por exemplo. Manter alternativa HTML, foco visível, tradução contextual, movimento reduzido e controles de pausa. A tela em 320 ou 390 px deve permitir ver a nave e alcançar a próxima ação sem perder os indicadores. Um contexto WebGL indisponível não deve impedir a configuração ou a execução.

**Integração.** `App.tsx` mantém seleção, participação e navegação. Os nomes da navegação global agora correspondem às áreas que abrem: Missões, Hangar e Operação e resultado. O cabeçalho móvel foi compactado para liberar espaço de jogo, preservando progresso, menu e tela cheia. Dados pessoais permanecem fora das páginas públicas.

## Acessos oficiais

[Jogar](https://nasa-missaoipe.alexandrebelo.com/lab/index.html) · [LP principal](https://projeto-ipe-lp.vercel.app/) · [Apresentação](https://missao-ipe-central-ab.alexandrebelo.chatgpt.site/) · [Painel privado](https://nasa-missaoipe.alexandrebelo.com/dashboard/index.html) · [Documentação](https://nasa-missaoipe.alexandrebelo.com/docs/index.html) · [GitHub](https://github.com/oalexandrebelo/MISSAO-IPE).

## Validação e alcance

Em 15/11/2026 passaram **180 testes de domínio, 144 de interface, 53 de métricas e 19 de distribuição**. O build de release também passou. Os testes de interface incluem as novas trilhas de etapas, previsão sem evento futuro, foco de inspeção, cenas e alternativas sem WebGL. Uma falha inicial de teste apontou o nome antigo da navegação: o seletor passou a usar “Operação e resultado”, preservando as asserções do percurso.

No navegador, uma participação técnica percorreu as sete missões em viewport de 390 px. Foram oito tentativas: ISS 92, Lua 92, Marte 91, Europa 93, Bennu 90, Webb 92 e Cerrado 92 pontos com seis registros válidos; uma segunda tentativa do Cerrado, com contatos curtos, entregou dois registros e marcou 52 pontos. A comparação A/B mostrou os mesmos módulos, agendas diferentes e os estados finais 6/6 versus 2/6 no relógio comum. A tentativa incompleta permanece no histórico.

Depois de recarregar, Meu progresso preservou **8 tentativas, 7 cumpridas, 1 não cumprida, 25 eventos confirmados pelo servidor local, zero pendentes e zero recusados**. A carteira preservou 9 créditos e seis unidades: monitor 2/3, LEND 2/3, Diviner 3/4, MEDA 2/3, MISE 2/3 e REASON 2/3 ciclos. Esses números são evidência de QA, não resultados de participantes humanos. O servidor local usa o armazenamento de testes; a prova da publicação oficial é registrada separadamente.

O cabeçalho móvel passou de 129 para 60 px; a cena inicial do hangar ISS passou de aproximadamente 882 para 414 px do topo. O atalho “Ver esta escolha na nave” recebeu foco na figura, sem deslocar a tela automaticamente ao trocar uma opção. Em 320 px, inventário e comparação A/B ficaram sem overflow horizontal; em 390 px, a montagem final também. Não foram observados erros de console na jornada local. Modelos científicos podem ter alternativa 2D enquanto carregam ou se WebGL falhar.

Emulação de viewport não equivale a teste em telefone físico; uma jornada técnica não comprova aprendizagem ou usabilidade com iniciantes reais. As missões de Bruno ainda não possuem a avaliação de interpretação presente nas três científicas. Cooperação continua no mesmo dispositivo. O laboratório não possui ascensão física, multijogador remoto ou um editor CAD. Essas etapas não são apresentadas como executadas.

[Recibo das jornadas R30](https://github.com/oalexandrebelo/MISSAO-IPE/blob/main/evidence/r30-mobile-journey.json) · [Pesquisa de assets e próximos ensaios](77-ASSETS-3D-E-OPORTUNIDADES-R30.md).

## Arquivos para continuidade

- **Dev A:** preservar as interfaces de configuração, resultado, evento e carteira usadas por `BrunoCampaign.tsx`, `ScientificExpedition.tsx` e `MissionControl.tsx`. Alterações de simulação precisam atualizar os testes de domínio e de persistência, sem permitir que o desenho conceda resultados.
- **Dev B:** `ScientificCockpit.tsx` e `scientific-cockpit.css` controlam a orientação; `BrunoCampaign.tsx` e `bruno-campaign.css` controlam a sequência e pendências. `r30-scene-state.ts` projeta estados em sinais visuais, `r30-scene.css` apresenta a agenda; `HangarEnvironment.tsx` carrega e descarta a iluminação compartilhada. `Scene.tsx`, `OrbitalScene.tsx` e `BrunoHangarScene.tsx` consomem esses sinais.
- **Revisão:** os quatro testes `tests-ui/r30-*` e o fluxo de `flows.test.mjs` protegem a integração. Executar `npm --prefix experiments/mission-design-lab run test:ui`, `npm run build:release` e `npm run test:beta` após novas mudanças. O manifesto `public/environments/polyhaven/manifest.json` preserva os créditos e a integridade do HDR.
