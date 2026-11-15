# R29 · seleção de missões, assets NASA e handoff

A seleção de missões apresenta um destino por vez, com a pergunta científica, o aprendizado e a ação **Jogar**. Os controles anterior/próximo e os sete nomes permitem trocar de destino sem iniciar uma partida. A referência de composição e movimento é [Space planet, do MotionSites](https://motionsites.ai/?prompt=space-planet), adaptada ao jogo e à identidade da MISSÃO IPÊ.

## O que cada destino ensina

| Destino | Pergunta e exercício | Evidência e limite |
| --- | --- | --- |
| ISS · Pulso Orbital | Entregar um monitor preservando a calibração e receber leituras de compostos voláteis. | Exercício de engenharia inspirado em hardware documentado; as leituras simuladas não são telemetria da ISS. |
| Lua · Eco Lunar | Combinar observações de LEND e Diviner com energia e comunicação suficientes. | Os instrumentos têm referências reais; o voo e sua pontuação são didáticos. |
| Marte · Horizonte Rubro | Operar MEDA, preservar o equipamento e entregar observações ambientais. | Referência científica à missão Mars 2020; não é controle de um rover real. |
| Europa · Oceano Silencioso | Equipar MISE e REASON e equilibrar proteção, energia e enlace. | Baseado no contexto da Europa Clipper; não apresenta resultados futuros como descobertas. |
| Cerrado · O que mudou aqui? | Interpretar registros de vegetação e distinguir consumo de potência, energia e entrega de dados. | Arquivo histórico MODIS; a imagem do planeta é apenas contexto visual. |
| Bennu · Ler uma superfície | Escolher instrumento, memória e janelas de comunicação para entregar registros úteis. | Arquivo científico OSIRIS-REx; não simula uma manobra TAG ou uma cápsula de retorno. |
| Webb · A luz guarda pistas | Distinguir o que uma imagem e um espectro podem responder. | Arquivo Webb/NIRSpec; compatibilidade científica e limites da evidência permanecem explícitos. |

ISS, Lua, Marte e Europa preservam a contribuição de Bruno na campanha integrada. Bennu está na trilha científica existente. A árvore ipê identifica a equipe; não cria uma missão biológica ou uma narrativa científica fictícia. A comparação detalhada de repositórios, missões e arquivos está na [auditoria R29](74-AUDITORIA-BRUNO-E-IMERSAO-R29.md).

## Fontes das superfícies 3D

| Superfície | Fonte verificável | Crédito | Arquivo publicado |
| --- | --- | --- | --- |
| Terra / ISS / Cerrado | [Blue Marble](https://science.nasa.gov/earth/earth-observatory/the-blue-marble-true-color-global-imagery-at-1km-resolution/) | NASA/Goddard; Reto Stöckli, Robert Simmon e equipes de dados | `earth.webp`, 510.254 bytes |
| Lua | [CGI Moon Kit / LROC](https://svs.gsfc.nasa.gov/4720/) | NASA Scientific Visualization Studio; Ernie Wright; LRO/LROC, Arizona State University | `moon.webp`, 286.286 bytes |
| Marte | [Mars Image Texture](https://science.nasa.gov/3d-resources/mars/) | NASA/JPL & Caltech; imagens Viking processadas no USGS | `mars.webp`, 177.056 bytes |
| Europa | [Jupiter – Europa](https://science.nasa.gov/3d-resources/jupiter-europa/) | USGS, JPL & Caltech; mosaico Voyager | `europa.webp`, 140.342 bytes |

São mapas equiretangulares de 2048 × 1024 pixels, convertidos para WebP com `cwebp -q 82 -resize 2048 1024`. Os quatro arquivos somam 1.113.938 bytes. O [manifesto publicado](https://nasa-missaoipe.alexandrebelo.com/lab/textures/lobby/manifest.json) registra URL original, crédito, transformação, data de coleta e SHA-256 do original e do derivado. As fotografias de disco da LP não foram usadas como mapas de uma esfera.

Bennu e Webb reutilizam os modelos oficiais já distribuídos pelo jogo. As fontes e créditos permanecem em `public/models/nasa/manifest.json` e nos manifestos R25/R27. Iluminação, enquadramento, órbitas decorativas e escalas da seleção são composição visual. Não fornecem trajetórias calculadas, relevo validado ou observações em tempo real. O modelo da Europa Clipper de aproximadamente 35,7 MB continua uma referência de carregamento voluntário na missão; não integra o carregamento inicial do lobby. A NASA não endossa este projeto. [Diretrizes de mídia](https://www.nasa.gov/nasa-brand-center/images-and-media/).

## Interface e continuidade

**Dev A · Engenharia, ciência e métricas.** Preserve os IDs `iss`, `moon`, `mars`, `europa`, `cerrado`, `bennu` e `telescope`. Trocar o destino no lobby não compra instrumentos, não consome créditos e não cria uma tentativa. O clique em Jogar mantém o fluxo existente. Na loja, a compra em lote deve gerar uma única transação autoritativa e devolver o inventário confirmado; a interface não concede saldo ou unidades por conta própria. Pontuação, desgaste, identificação e regras de envio continuam no motor e na API.

**Dev B · Experiência e cena.** `GameShell.tsx` controla o destino e a pausa. `LobbyScene.tsx` recebe `missionId` e `paused`; sua função é representar o destino. `game-shell.css` organiza título, pergunta, CTA e navegação responsiva. Não acople resultados do motor ao relógio de animação. Preserve foco visível, texto acessível, seleção por teclado, tradução contextual de Libras, movimento reduzido e a possibilidade de jogar quando WebGL não está disponível. Verifique celulares estreitos, orientação horizontal, troca rápida entre os sete destinos e retomada após sair de uma missão.

O mapa de acesso permanece: [LP principal](https://projeto-ipe-lp.vercel.app/), [apresentação da equipe](https://missao-ipe-central-ab.alexandrebelo.chatgpt.site/), [jogo](https://nasa-missaoipe.alexandrebelo.com/lab/index.html), [painel privado](https://nasa-missaoipe.alexandrebelo.com/dashboard/index.html) e [documentação](https://nasa-missaoipe.alexandrebelo.com/docs/index.html).

## Verificação desta revisão

Passaram 180 testes de domínio, 121 de interface, 53 de métricas e 18 verificações da distribuição. Os testes novos cobrem seleção e foco por teclado, pausa, preferência por movimento reduzido, carregamento fora de ordem, perda do contexto WebGL, redução do DPR no celular e liberação de recursos. São verificações controladas de comportamento, não medições de FPS.

No navegador, foram selecionados os sete destinos, conferindo pergunta, CTA e identificação da cena. O lobby foi inspecionado em 1512 × 949, 1280 × 720, 390 × 844 e 320 × 740, sem overflow horizontal observado. A câmera e os modelos são contexto de seleção; o botão Jogar continua abrindo o briefing correspondente. A pausa suspendeu a animação e a mudança de tamanho reduziu o DPR para 1 em largura de celular.

A jornada sintética comprou dois monitores por 10 créditos. Depois de recarregar, havia duas unidades novas e saldo de 15. Uma unidade foi equipada na ISS e a proteção foi reforçada: a missão entregou 6 registros válidos, obteve 92 pontos e consumiu um ciclo apenas da unidade equipada. O painel do jogador confirmou dois eventos, sem pendências ou recusas. Uma segunda recarga preservou a pontuação. O reenvio de compra após perda de confirmação também foi exercitado com o handler real em teste, sem duplicar unidades.

Esta rodada percorreu a seleção dos sete destinos e completou uma tentativa ISS. A rodada anterior com sete missões completas permanece no [handoff R28](73-QA-MOVEL-E-HANDOFF-R28.md). O navegador em tamanho de celular não substitui telefone físico nem avaliação com jogadores iniciantes. O ensaio local usa repositório em memória durante o processo; a prova durável anterior em Blob privado é identificada no recibo R28.

[Recibo de QA R29](https://github.com/oalexandrebelo/MISSAO-IPE/blob/main/evidence/r29-lobby-qa.json) · [Histórico de publicação e acessos](https://github.com/oalexandrebelo/MISSAO-IPE/blob/main/PUBLICADO.md)
