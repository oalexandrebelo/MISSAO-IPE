# R31 · plataforma Kenney, escolhas no hangar e handoff

A bancada das sete missões agora usa a Structure Platform de Kenney como referência visual da montagem. O jogador inspeciona uma nave didática, altera o projeto e vê o que mudou antes de executar. O cenário não gera ciência, créditos ou desgaste.

[Auditoria completa do Bruno](78-AUDITORIA-BRUNO-E-INTEGRACAO-R31.md) · [Game design e skills](79-GAME-DESIGN-E-SKILLS-R31.md) · [Propósito e contratos das sete missões](76-COCKPIT-SETE-MISSOES-E-HANDOFF-R30.md).

## O que foi incorporado

- Plataforma compartilhada entre ISS, Lua, Marte, Europa, Cerrado, Bennu e Webb, servida localmente. Seu uso termina no hangar; ela não acompanha a nave no espaço.
- Instrumentos pendentes aparecem pelo nome, com encaixes necessários. Alterar um sistema retorna à nave do projeto em edição quando uma referência NASA ou o plano A estiver aberto.
- Consequências são apresentadas como previsões calculadas. O botão de inspeção leva o foco à nave; o caminho de volta leva às opções. A troca de uma opção não desloca a página automaticamente.
- Nas missões científicas, os rótulos distinguem alterações da agenda e alterações de peças. Mais tempo de contato não aumenta a antena nem a taxa do rádio.
- Meu progresso mostra quantos destinos diferentes têm pelo menos uma tentativa própria bem-sucedida e confirmada. Repetir ISS sete vezes continua sendo um destino. Eventos recusados, falhas e ensaios guiados não avançam esse marco. Não existe recompensa adicional nem bloqueio dos demais destinos.

## Asset e proveniência

[Structure Platform](https://poly.pizza/m/ovwrUrwADe), de Kenney, CC0. GLB 2.0 com 17.200 bytes, 96 triângulos e PNG embutido, sem arquivos externos. SHA-256 `bd1b99a3adea5f4567935a234e8d57ab09af34931b43002862b08a0746075d99`. Origem, crédito e transformação estão no manifesto `experiments/mission-design-lab/public/models/kenney/manifest.json`. A plataforma é cenografia, não um equipamento NASA. O HDRI Poly Haven e os modelos de contexto NASA mantêm seus manifestos próprios.

## Dev A · motor, métricas e inventário

Mantenha as funções de simulação como fonte das previsões e dos resultados. O carregamento de uma malha, um clique de inspeção ou a animação de câmera não pode gerar tentativa, gastar um ciclo ou conceder recompensa. Os recibos de compra, lançamento e desgaste continuam autoritativos no servidor. O marco de sete destinos é uma projeção de leitura dos eventos da participação ativa e só usa sucessos confirmados; não cria outro saldo ou armazenamento.

Não transportar as cifras do catálogo de Bruno como especificações físicas de foguetes. Elas são parâmetros de jogo. ISS/Lua/Marte/Europa ensinam engenharia com simulação didática; Cerrado/Bennu/Webb trabalham com registros científicos históricos rastreáveis. O nome IPÊ identifica a equipe.

## Dev B · interface, acessibilidade e 3D

`HangarPlatform.tsx` é compartilhado pelas três famílias de cena. Preserve carregamento local, geometria de apoio durante falha, descarte de recursos, ausência na operação e espaço para visualizar painéis, bateria, antena e carga. Evite carregar modelos grandes de contexto automaticamente em telas pequenas. O catálogo já mantém Clipper sob demanda.

Preserve o foco somente em ações explícitas de navegação, a descrição HTML da escolha, o contexto de Libras e a alternativa sem WebGL. O status de requisito deve dizer o nome do item faltante e a ação para resolver. A imagem 3D complementa a leitura dos recursos; não pode ser o único modo de entender a decisão.

## Integração e próximos passos

Bruno foi auditado no commit `891fe880d2e9b899431e80651e2e883be8f5afd8`. O incremento traz testes de percurso e uma vinheta por destino, sem novas mídias. O aplicativo oficial conserva operação pausável e etapas explícitas; não acrescenta uma espera de três segundos que alegue sucesso em tentativas incompletas. O marco de destinos aproveita a proposta de encerramento e continua permitindo redesenho e comparação A/B.

A próxima integração candidata é um carrinho com instrumentos distintos na mesma compra. A API atual aceita múltiplos IDs; a interface oferece compra em quantidade por ficha. Essa evolução exige testar saldo, idempotência e falha de rede antes da entrega. Rodin, Meshy e DCC não foram necessários para a plataforma CC0 existente.

## Acessos

[Jogo oficial](https://nasa-missaoipe.alexandrebelo.com/lab/index.html) · [LP](https://projeto-ipe-lp.vercel.app/) · [Apresentação](https://missao-ipe-central-ab.alexandrebelo.chatgpt.site/) · [Painel privado](https://nasa-missaoipe.alexandrebelo.com/dashboard/index.html) · [Documentação](https://nasa-missaoipe.alexandrebelo.com/docs/index.html) · [Repositório oficial](https://github.com/oalexandrebelo/MISSAO-IPE).

## Verificação desta revisão

O build de release passou, assim como 180 testes de domínio, 157 de interface, 53 de métricas e 20 de distribuição. Os dez testes novos de plataforma carregam o GLB real nas sete cenas, verificam afastamento da nave e do lançador, seleção sem interceptação, fallback, saída do hangar e descarte de recursos. Um teste de transição reproduziu a câmera retida no hangar; a posição agora é reaplicada ao entrar em operação.

No navegador, os sete hangares foram inspecionados em 390 px sem rolagem horizontal. ISS e Webb também foram inspecionados em 320 px. Foram conferidas trocas de bateria, lançador, comunicação e instrumento, o retorno da referência NASA ao plano B, o foco de ida e volta, a montagem separada e a alternativa 2D. Bennu mantém o rádio de 1,2 Mbit/s quando os contatos aumentam; o que muda é a agenda.

Uma jornada ISS comprou e equipou o monitor, reforçou a proteção e ampliou a reserva. A comparação A/B mostrou 179 → 235 kg, 29 → 39 créditos e 0 → 6 registros válidos previstos, explicando que três escolhas mudaram. A execução terminou com 92 pontos e 6/6 registros válidos. Ao sair do hangar, o GLB deixou a operação. Após recarga: uma tentativa, um destino cumprido, 26 créditos, monitor com 2/3 ciclos e sete eventos confirmados, zero pendentes ou recusados. Nenhum erro de console foi observado na jornada local.

Esses resultados usam participação sintética e servidor de testes. As sete jornadas completas da R30 continuam documentadas; nesta revisão a prova fim a fim foi repetida na ISS. Não houve teste em telefone físico, medição de FPS nem validação educativa com pessoas. [Recibo da revisão móvel](https://github.com/oalexandrebelo/MISSAO-IPE/blob/main/evidence/r31-mobile-hangar.json). A publicação é registrada em `PUBLICADO.md` após a Vercel confirmar o commit.
