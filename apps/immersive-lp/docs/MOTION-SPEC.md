# Sistema de movimento

| Superfície | Movimento | Implementação | Redução de movimento |
|---|---|---|---|
| Hero, título | Linhas entram 105%, 1,15 s; stagger 0,13 s | GSAP SplitText, máscara de linha, aria automática | Texto estático e legível |
| Imagem da Terra | Entrada de escala 0,88→1, 1,8 s | GSAP, raster local | Sem entrada |
| Órbita | Satélite percorre curva em 42 s | SVG + MotionPathPlugin | Sem loop |
| Hero e rolagem | Deslocamento vertical 13%, rotação 6° | ScrollTrigger scrub 1 | Sem parallax |
| Mouse | Terra segue até 24×18 px | quickTo, ponteiro fino e viewport >=900 | Sem listener |
| Botões principais | Atração discreta de 10%/16% | quickTo + pointerenter/move/leave | Sem deslocamento |
| Manifesto | Palavras passam de opacidade 0,52 a 1 durante leitura | SplitText + ScrollTrigger | Todas visíveis |
| Fluxo da ciência | Linha conectando observar/projetar/entregar | DrawSVGPlugin, 2 s | SVG estático |
| Seções | Entrada única de 36 px, 0,95 s | ScrollTrigger | Conteúdo estático |
| Timeline | Troca de painel em 0,45 s | CSS, estado React, ARIA tabs | Troca imediata |
| Laboratório | Flutuação conceitual do CubeSat, 8 s | CSS transform | Estático |
| Progresso | Linha de leitura no cabeçalho | ScrollTrigger scrub | Oculta no estado inicial |
| Som | Três osciladores locais suaves; ganho 0,018 | Web Audio após clique | Independente, desligado por padrão |
| Manifesto em vídeo | 4 cenas de 6 s, 1920×1080, 30 fps | Remotion, 720 frames | Só reproduz por ação do visitante |

Nenhuma animação dispara navegação, conta tempo de resposta ou altera o motor da demonstração. Os loops GSAP são revertidos no cleanup. Listeners são removidos; requests de import atrasados não iniciam animações após desativação. Fechar o filme desmonta o player. Ocultar a aba suspende áudio e órbita.

Desktop >=1100, tablet 801–1100/481–800, celular <=480. O laboratório passa de duas colunas para uma. A jornada passa de quatro colunas para duas e depois para capítulos verticais. A timeline permanece navegável por setas, Home e End. Foco, menu e filme usam comportamentos nativos em vez de bibliotecas de componentes.
