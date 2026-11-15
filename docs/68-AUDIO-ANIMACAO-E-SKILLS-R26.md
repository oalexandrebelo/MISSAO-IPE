# R26 — áudio, animação e skills de jogos

Leitura em 15 de novembro de 2026. O objetivo é reforçar a consequência das decisões de engenharia sem mudar a simulação, a pontuação ou a identidade da MISSÃO IPÊ. A revisão partiu de `.impeccable.md`: Plus Jakarta Sans, Bricolage Grotesque, assinatura SVG e paleta existentes.

## Fontes inspecionadas

| Referência | Estado consultado | Função e decisão para R26 |
| --- | --- | --- |
| [Earshot](https://github.com/Leonxlnx/earshot/tree/4ac3d2ac2b151e1c23376f9ce7f3047a17050013) | `0.4.1`, `4ac3d2ac2b151e1c23376f9ce7f3047a17050013` | Produção e avaliação de áudio por CLI, Python e MCP. Não incluído no runtime web. |
| [ManimGX](https://github.com/academa-labs/manimgx/tree/1fb4dd7327bf5ed7d0c40d022c05cb816455ae1d) | `0.1.1`, `1fb4dd7327bf5ed7d0c40d022c05cb816455ae1d` | Geração de animações 2D/3D por Python e renderizador Rust/wgpu; possui player web. Não incluído no jogo. |
| [Awesome game-dev agent skills](https://github.com/gamedev-skills/awesome-gamedev-agent-skills/tree/c6ca6c41c839b68319ffc08430b99ab768debc32) | `c6ca6c41c839b68319ffc08430b99ab768debc32` | Três skills específicas foram lidas como orientação. Nenhum instalador remoto executado. |

## Earshot: ferramenta de autoria, não biblioteca de reprodução

O [README](https://github.com/Leonxlnx/earshot/blob/4ac3d2ac2b151e1c23376f9ce7f3047a17050013/README.md) descreve análise, comparação, síntese e avaliação de arquivos. Os comandos `sfx`, `kit` e `measure` não carregam modelos; o banco contém receitas de efeitos renderizáveis offline. Análises semânticas carregam CLAP/AST, com aproximadamente 1,1 GB no primeiro uso. A crítica opcional via Gemini depende de chave e consentimento de envio.

O [manifesto](https://github.com/Leonxlnx/earshot/blob/4ac3d2ac2b151e1c23376f9ce7f3047a17050013/pyproject.toml) exige Python 3.10+ e inclui Torch, Transformers, NumPy, SciPy e bibliotecas de análise. O projeto declara [MIT](https://github.com/Leonxlnx/earshot/blob/4ac3d2ac2b151e1c23376f9ce7f3047a17050013/LICENSE); gravações de referência e modelos têm sua própria proveniência. Não há cobrança obrigatória pelo código local; há custo de instalação, armazenamento e processamento. A opção Gemini é separada.

Decisão: uma futura trilha de produção pode renderizar WAVs localmente e revisar licenças dos materiais efetivamente usados. Para os sinais curtos desta entrega, não foi instalado Earshot, baixado modelo nem enviado áudio. Os efeitos desta R26 são síntese original com Web Audio; não são saída do Earshot.

## ManimGX: útil para explicadores, excessivo para este feedback

O [manifesto](https://github.com/academa-labs/manimgx/blob/1fb4dd7327bf5ed7d0c40d022c05cb816455ae1d/pyproject.toml) requer Python 3.13+ no fluxo nativo. O [player web](https://github.com/academa-labs/manimgx/blob/1fb4dd7327bf5ed7d0c40d022c05cb816455ae1d/browser/README.md) usa Python em Worker/Pyodide e WASM/WebGPU. O autor informa primeiro download de cerca de 6 MB para Python e 20 MB para ManimGX, além de exigir suporte do adaptador a `float32` blending e `depth32float-stencil8`. Suporte nominal do navegador não garante esses recursos em todo celular.

O código próprio declara [MIT](https://github.com/academa-labs/manimgx/blob/1fb4dd7327bf5ed7d0c40d022c05cb816455ae1d/LICENSE). O [README](https://github.com/academa-labs/manimgx/blob/1fb4dd7327bf5ed7d0c40d022c05cb816455ae1d/README.md#license) diferencia os wheels nativos, GPL-3.0-or-later no conjunto com x264, e os componentes/fontes com avisos próprios. Não há serviço pago obrigatório no fluxo local descrito.

Decisão: não adicionar um segundo runtime 3D e seu download a uma interação que o Rive existente e os dados do motor já atendem. Um vídeo didático pré-renderizado seria uma aplicação possível, mas não foi produzido nesta R26. Não há alegação de integração ManimGX, de paridade com Manim ou de compatibilidade física universal.

## Skills realmente aplicadas

O catálogo declara [Apache-2.0](https://github.com/gamedev-skills/awesome-gamedev-agent-skills/blob/c6ca6c41c839b68319ffc08430b99ab768debc32/LICENSE). Foram lidos os arquivos completos, sem instalar ou copiar implementações de engines externas:

- [game-feel](https://github.com/gamedev-skills/awesome-gamedev-agent-skills/blob/c6ca6c41c839b68319ffc08430b99ab768debc32/skills/disciplines/game-feel/SKILL.md): ligar feedback a eventos discretos, preservar o relógio da simulação, manter intensidade proporcional e evitar efeitos que bloqueiem entradas.
- [audio-design](https://github.com/gamedev-skills/awesome-gamedev-agent-skills/blob/c6ca6c41c839b68319ffc08430b99ab768debc32/skills/disciplines/audio-design/SKILL.md): ganho comum, margem para soma, silêncio real e limpeza de fontes. Não há música ou voz para justificar uma hierarquia de mixagem.
- [game-ui-ux](https://github.com/gamedev-skills/awesome-gamedev-agent-skills/blob/c6ca6c41c839b68319ffc08430b99ab768debc32/skills/disciplines/game-ui-ux/SKILL.md): controle rotulado, acionável pelo teclado, informações equivalentes em texto e atualização pelos eventos do jogo.

## Contrato da integração

O navegador permanece silencioso até a ativação explícita. O contexto de áudio só é criado nesse gesto e é retomado segundo a [política de autoplay do Chrome](https://developer.chrome.com/blog/autoplay/#web_audio). A [API Web Audio](https://www.w3.org/TR/webaudio/) fornece osciladores, ganho e agendamento local; não há chamada de rede, chave, microfone, dependência nova ou arquivo sonoro externo.

| Evento | Gatilho permitido | Informação equivalente |
| --- | --- | --- |
| `choice` | Uma peça realmente mudou | Rádio selecionado, nome e indicadores atualizados. |
| `launch` | Uma tentativa válida iniciou | Estado de lançamento e comando para ir ao resultado. |
| `success` | O motor devolveu `success` | Título, registros válidos, pontos e relatório. |
| `failure` | O motor devolveu `failure` | Diagnóstico e linha da missão. |
| `invalid` | O motor devolveu `invalid` | Lançamento bloqueado e motivo. |

O áudio não decide sucesso a partir do botão, de CSS ou de pontuação. Sons curtos são suplementares ao texto; não há trilha contínua, leitura de texto em voz, flash, tremor ou alteração do tempo simulado. Mute interrompe os nós ativos. Ocultar a página cancela os sons pendentes, evitando reproduzir um resultado antigo ao voltar. Sair da campanha fecha o contexto.

## Verificação e limites

Arquivos: `R26MissionAudio.ts`, `R26MissionAudioControl.tsx` e `tests-ui/r26-mission-audio.test.mjs`, dentro de `experiments/mission-design-lab`. Os eventos foram ligados em `BrunoCampaign.tsx` à troca efetiva de peça, ao início da operação e a `attempt.outcome`. A referência `play` do hook é estável para não reiniciar o temporizador da operação ao renderizar o controle.

O controlador e o controle React foram verificados isoladamente enquanto o componente Rive da integração era produzido. A primeira tentativa de empacotar a suíte completa parou no import então ausente `./MissionSequenceRive.tsx`; esse erro não foi mascarado por um substituto de Rive. Depois de o módulo existir, o arquivo de testes de áudio completo passou **9/9**. A suíte inclui execuções reais de ISS e Marte pelo `BrunoCampaign`, com resultados de sucesso, falha e bloqueio produzidos pelo motor, além de ativação recusada, desativação durante a ativação, ocultação da página, limpeza, limite de vozes e PCM a 44,1/48 kHz. O transporte Web Audio é simulado no teste. `tsc --noEmit` e `git diff --check` também passaram.

O PCM real produzido pela mesma função usada pelo navegador foi enviado em memória ao FFmpeg local (`f32le`, mono, 48 kHz; filtro `astats`). Não houve download de mídia nem geração por modelo.

| Sinal | Duração | Pico medido, dBFS | RMS medido, dBFS |
| --- | --- | --- | --- |
| Escolha | 85 ms | −28,82 | −38,64 |
| Lançamento | 240 ms | −27,68 | −37,26 |
| Sucesso | 370 ms | −27,54 | −37,01 |
| Missão incompleta | 290 ms | −27,87 | −37,37 |
| Lançamento bloqueado | 175 ms | −29,20 | −39,57 |

Essas medidas são dos sinais isolados, antes do volume do aparelho; não representam LUFS de uma sessão, nível sonoro físico nem conforto auditivo validado. Testes com DOM e Web Audio simulados verificam contratos; não comprovam som físico ou a política de autoplay de todos os navegadores. Inspeção em navegador real e escuta em dispositivo são provas distintas.
