# Design e acessibilidade da publicação R24

A revisão segue as heurísticas de orientação, consistência e legibilidade de `lp-nng-premium` e o contexto de design do Impeccable. A skill `logo-designer` orienta o uso das variantes de fundo e do símbolo existente para favicon. A autoria do SVG oficial permanece registrada nos arquivos de procedência da marca. [Impeccable](https://impeccable.style/) · [Logo Designer](https://github.com/neonwatty/logo-designer-skill)

## Estrutura das páginas ativas

| Rota | Ajuste |
| --- | --- |
| LP imersiva, créditos e 404 | Cabeçalho compartilhado e menu de celular com destinos explícitos. O menu devolve o foco ao botão ao fechar e encaminha o foco ao capítulo escolhido. A abertura acomoda texto ampliado e os controles de som e movimento no fluxo da página. Créditos usam a mesma navegação e têm acesso ao início, à apresentação e à biblioteca. |
| Portal e estudo de Game Design | Cabeçalho com marca, destinos e ação de jogar. Links de leitura e navegação têm espaço para toque. Os títulos quebram em telas estreitas. |
| Documentação, contexto, biblioteca e arquitetura | Navegação com indicação de página atual, atalho para o conteúdo e cabeçalhos refluíveis. Índices, filtros e áreas de leitura mantêm foco visível. A arquitetura usa a variante da marca correspondente ao tema do inspetor. |
| Equipe e observatório | Hierarquia tipográfica e foco consistentes. O painel da equipe conserva a marca embutida e o checklist para leitura offline. O observatório preserva a autenticação e os dados privados. |
| Pitch | Mesma família de títulos e textos no site, controle de foco e área de toque dos botões. Os seis quadros preservam seus tempos e o total de 180 segundos. |
| Laboratório | A integração da bancada e a continuidade da jornada do jogo têm registro específico no [handoff R24](63-RIVE-E-HANDOFF-R24.md). |

O CSS compartilhado define foco, largura de leitura, navegação e área mínima de 44 px para as ações do cabeçalho na escala padrão. A tipografia segue a [decisão de fontes do projeto](26-TIPOGRAFIA.md). Os binários do mesmo par foram copiados com as licenças OFL para a LP, que tem raiz de build própria. As variantes SVG fornecidas continuam a identificar a equipe. A publicidade da página segue o contrato anterior de analytics e a navegação pública conserva o acesso a Libras.

Campanha, jogo legado, arquivo portátil, demonstração planetária e fac-símiles históricos são experiências autônomas com composição e contratos próprios. O filme renderizado conserva sua tipografia original e seus créditos.

## Verificação

- A LP compilou e passou em 4 testes do motor e 21 verificações de SHA-256 dos assets. A central de contexto passou em 24 testes do DOM e o pitch em 2 regressões da navegação e da comparação A/B. A inspeção estática confirmou o atalho com destino focável em 11 páginas e a identidade dos SVGs compartilhados.
- O AccessLint registrou zero achados nos estados inspecionados da LP, créditos, 404, portal, documentação, equipe, painel sem autenticação, pitch, contexto, arquitetura e Game Design, em navegador local. A inspeção da LP em viewport de 319 px confirmou o retorno do foco ao botão depois de fechar o menu.
- Na arquitetura, o painel do diagrama usa uma seção nomeada dentro de `main` e o SVG interativo usa sua semântica nativa, com nome acessível e nós inspecionáveis. O reteste local com AccessLint registrou zero achados. [Mapeamento de acessibilidade SVG do W3C](https://www.w3.org/TR/svg-aam-1.0/#mapping_role_table)

O escopo cobre as rotas e os estados observados. A conformidade integral exige avaliação manual de teclado, ampliação de texto, tecnologias assistivas e dispositivos físicos.
