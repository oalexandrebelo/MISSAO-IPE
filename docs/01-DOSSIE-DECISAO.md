# 01 — Dossiê de decisão: Missão Ipê — Ciência que chega

**Rodada 4 · 14 de novembro de 2026 · AB / Hackatur–Zer0Slop.** Produto escolhido: jogo de projeto de missão espacial. Esta revisão preserva o histórico das rodadas anteriores e inicia código de um protótipo local. As conclusões executadas estão discriminadas em `09-VERIFICACAO.md`; as metas de produto permanecem separadas de resultados observados.

## 1. Decisão e vantagem que precisa ser demonstrada

A proposta para AB é uma missão educacional curta em que o participante projeta um satélite didático, entrega seis resultados científicos de arquivo e explica por que sua decisão funcionou. Energia disponível, potência instantânea, massa, orçamento, capacidade de armazenamento e tempo de contato produzem consequências acopladas. O catálogo permite conferir integralmente as alternativas. A experiência expõe o registro causal e exige uma previsão antes da execução.

A afinidade com o perfil informado por AB é concreta: UX Research entra no desenho e observação da tarefa; design de produto organiza restrições compreensíveis; dados sustentam os critérios científicos; conhecimento técnico permite transformar consequências em regras verificáveis. Isso é uma inferência de adequação, não uma medição de habilidade nem uma probabilidade de premiação. O desconhecimento sobre a composição humana da equipe impede atribuir competências adicionais a outras pessoas.

O diferencial proposto tem quatro partes inseparáveis: dado NASA com procedência rastreável; consequência física dentro de hipóteses declaradas; explicação ligada a eventos; reexecução que confere o resultado. O diorama orienta a leitura espacial. A decisão educativa permanece acessível por controles HTML quando WebGL não funciona. A missão precisa continuar inteligível sem a paisagem.

Não há base estatística para chamar qualquer projeto de “maior chance mundial” em percentual. Não possuímos notas dos concorrentes, função de decisão dos jurados ou amostra representativa de inscrições. A escolha é uma decisão de portfólio: concentrar o esforço no tema já escolhido, no perfil de AB e numa demonstração delimitada que pode ser terminada, inspecionada e explicada. A meta é uma candidatura defensável; o resultado competitivo não está sob nosso controle.

## 2. Pendência que antecede a candidatura

O GO Team informa início às 09h locais de 14/11/2026 e possibilidade de desclassificação por trabalho antecipado. Há orientação para esperar inclusive para discutir funcionalidades/esboçar UI. Uma resposta de 13/11 aborda especificações Markdown e prompts detalhados e reitera o horário. Portanto, a descrição anterior de toda a especificação como “preparação permitida” era ampla demais. Esta revisão corrige essa conclusão sem apagar a versão histórica. [R01–R03]

O usuário solicitou expressamente iniciar o projeto. A implementação desta rodada começou antes das 09h BRT e tem esse fato registrado em `evidence/chronology.json`. **Trata-se de P&D específico pré-evento, sem elegibilidade temporal estabelecida.** Citar a origem, separar diretórios, recompilar após o horário ou renomear o material não concedem autorização dos organizadores. Não declarar que a equipe foi desclassificada: não foi observada uma decisão sobre esta equipe. A questão exige uma resposta efetiva da organização antes de apresentar esse material como elegível. Nenhuma mensagem foi enviada em nome de AB.

Outro gate é o vínculo aos Resources do desafio. A exigência atual do GO Team é usar ao menos uma fonte NASA incluída nessa lista. A página específica continuou inacessível durante esta pesquisa. MOD13Q1 é um produto NASA real e foi conferido; sua inclusão específica na lista não foi demonstrada. O espelho HackAthlone aponta materiais de engenharia como Design and Develop Science Missions e CubeSat 101, mas não substitui a fonte oficial. A arquitetura permite fazer esses materiais comandarem o briefing, os segmentos e os critérios de verificação; esse uso só deve ser apresentado depois de confrontado com os Resources oficiais. [R04–R05]

## 3. O padrão mundial e os referenciais brasileiros

O estudo histórico integral está preservado em `research/history/01-juri-mundial-rodada-anterior.md`. Ele confronta casos 2023–2025 com NASA, AEB, instituições participantes e repositórios dos autores, distinguindo descrição, código inspecionado e execução não realizada.

| Precedente | Evidência institucional | Implicação para o Ipê |
|---|---|---|
| LunarTech Ensemble / Lunar Trek, 2023 | Vencedor Best Use of Science; experiência sobre sismos Apollo | O formato jogo pode sustentar uma contribuição científica claramente delimitada. |
| TeamVoyagers / Aqua Explorer, Bangladesh, 2023 | Vencedor Best Storytelling; jogo sobre água e clima | A relação entre escolhas e fenômenos precisa sobreviver à redução da apresentação. |
| Space Quest Maidens, Campinas, 2023 | Vencedor Most Inspirational; educação sobre eclipses | Educação brasileira com recorte claro é precedente real. |
| Eco-Metropolis, Emirados Árabes Unidos, 2024 | Vencedor Most Inspirational; jogo de decisões ambientais | Gestão de sistemas e recursos já pertence ao repertório da competição. |
| Connected Earth Museum, Campinas, 2024 | Vencedor Art & Technology; museu virtual e visualização | Imersão e guia com IA não constituem novidade suficiente. |
| PureFlow, Aracaju, 2025 | Vencedor Best Mission Concept; projeto de habitats | É o referencial brasileiro mais próximo de configuração e análise espacial. |
| Zumorroda-X, Cairo, 2025 | Vencedor Art & Technology; jogos relacionados à agricultura | Contexto humano e científico reconhecível também aparece na edição mais recente encerrada. |

O anúncio NASA de 2025 confirma PureFlow. A AEB documenta seis finalistas brasileiros: A.T.L.A.S., naiπ, PureFlow, Stellar Narrators, The new Saraquatys e Titan. O resultado posterior distingue PureFlow como vencedor. Não converter as demais equipes em vencedoras nem transformar “top 0,24%” em chance de AB: equipes, participantes e submissões são denominadores diferentes. [R06–R07]

Nesta rodada apareceu um comparável ainda mais direto: `NASA-SPACEAPP-2026/Space-Mission-Design-Game` descreve um jogo CubeSat estático com Vite, decisões de requisitos e armazenamento no navegador. A organização de GitHub tem “NASA” no nome, mas isso não demonstra vínculo oficial. O README foi inspecionado; não executamos o jogo, não certificamos sua elegibilidade e não incorporamos seu código. A existência desse comparável enfraquece a alegação de originalidade de “montar um CubeSat offline”. Sua documentação também descreve Three.js e fallback 2D; esses recursos não constituem exclusividade do Ipê. Não permite afirmar que a integração completa proposta pelo Ipê inexiste em todos os demais projetos. [R08]

## 4. Países e regiões: critério útil para pesquisa

Não escolher biblioteca pela nacionalidade presumida do criador. Repositórios globais têm autoria distribuída; país de um evento, sede de empresa e nacionalidade do mantenedor são variáveis diferentes. O anexo mistura essas três coisas e usa superlativos sem universo de comparação. A auditoria de repositórios classifica capacidade, licença, custo de integração e limite, preservando a localização institucional quando a fonte a sustenta.

Para aprofundamento técnico deste jogo, a lista operacional de três ecossistemas é **Estados Unidos, França e Japão**. É uma seleção de referências úteis ao recorte, não um ranking mundial de tecnologia. Estados Unidos fornecem a cadeia NASA de dados, engenharia e visualização; França acrescenta referências verificáveis de dinâmica orbital/engenharia como Orekit; Japão oferece S2E/C2A para separar ambiente de simulação e software de bordo. A matriz completa cobre também iniciativas chinesas, russas, europeias, canadenses e australianas. Nenhuma origem torna um projeto candidato a integração sem conferir o custo.

As tecnologias centrais desta entrega são uma biblioteca gráfica global, React, TypeScript e APIs locais do navegador. A nacionalidade das ferramentas não entra na condição de vitória. A prioridade de benchmark competitivo continua sendo proximidade do problema, como PureFlow, e não PIB ou contagem de estrelas.

## 5. O que a nova bateria alterou

A pesquisa de Fastino rejeitou três premissas do texto enviado: classificação sem sampling não garante acerto nem reprodutibilidade entre plataformas; rodar um detector PII local não garante conformidade integral; um runtime que aceita algum GGUF não aceita automaticamente qualquer checkpoint GLiNER/GLiDE. O relatório 02 contém as diferenças de versões, as licenças, os resultados publicados e o plano de ablação. Nenhum modelo foi baixado ou executado nesta rodada.

A segunda alteração é científica. BLUE existe nos arquivos já recuperados, e o EVI de três bandas foi recalculado com aritmética racional. Os seis valores conferem com diferença inferior a 0,0001 em relação ao produto publicado. Isso permite pesquisar uma missão posterior sobre a preservação de informação para responder a uma nova pergunta. Não modifica o objetivo NDVI da primeira missão nem prova equivalência entre uma rota que transmite R/NIR e outra que requer R/NIR/BLUE. O termo constante do EVI impede cancelar ingenuamente a escala das reflectâncias.

A terceira alteração é de implementação: catálogo, simulação, busca e recibo deixam de ser apenas especificações. O aceite depende dos comandos e recibos desta rodada, nunca do preflight AB-R3A ou dos cálculos manuais anteriores. Os documentos históricos continuam corretos sobre seu próprio estado de pesquisa; não devem ser reescritos para insinuar que o jogo já existia naquela etapa.

## 6. Proposta de demonstração competitiva

A demonstração deve mostrar uma pergunta: “O satélite coletou os dados. A ciência chegou?”. Em seguida, um resultado com entrega incompleta; uma inspeção do gargalo; uma mudança que resolve comunicação mas viola potência; e um redesenho verificado que entrega os seis resultados. Uma resposta escrita de um participante pode revelar entendimento, mas só depois de uma sessão real observada.

No vídeo curto, selecionar uma única cadeia causal. O formulário atual e a agenda local precisam ser conferidos; as orientações consultadas indicam até 30 segundos ou sete slides e submissão em inglês. A apresentação longa da equipe pode usar mais detalhe, mas não substitui o artefato global. Não apresentar uma categoria de prêmio como direito adquirido nem anunciar afiliação NASA. [R09]

## Referências desta decisão

- R01: https://github.com/nasa/spaceapps/discussions/1827
- R02: https://github.com/nasa/spaceapps/discussions/1872
- R03: https://github.com/nasa/spaceapps/discussions/2009
- R04: https://github.com/nasa/spaceapps/discussions/1849
- R05: https://www.spaceappschallenge.org/2026/challenges/space-mission-design-game/?tab=resources — recuperação falhou; ver recibo em research/evidence.
- R06: https://www.nasa.gov/learning-resources/stem-engagement-at-nasa/nasa-announces-2025-international-space-apps-challenge-global-winners/
- R07: https://www.gov.br/aeb/pt-br/assuntos/noticias/seis-equipes-brasileiras-estao-entre-os-finalistas-do-nasa-space-apps-2025
- R08: https://github.com/NASA-SPACEAPP-2026/Space-Mission-Design-Game
- R09: https://github.com/nasa/spaceapps/discussions/1947 e https://github.com/nasa/spaceapps/discussions/1973

Os sete precedentes e suas fontes individuais estão no parecer histórico preservado. As escolhas de produto deste documento são decisões da coordenação, não recomendações atribuídas às instituições citadas.
