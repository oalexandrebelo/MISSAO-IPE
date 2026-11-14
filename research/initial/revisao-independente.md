# Revisão independente — decisões que precisam sobreviver à crítica

Frente 06. Corte de 14/11/2026. Leitura dos três estudos disponíveis (`desafios-ciencia.md`, `historico.md`, `paises-brasil.md`). Arquitetura e repositórios ainda não estavam gravados no momento da revisão. Esta revisão não executou protótipo, acessou hardware, validou cenas ou estimou probabilidade de premiação.

## Parecer

**Manter Mission Design Game como recomendação condicional de afinidade e entrega controlável.** Não há evidência para chamá-lo de maior chance de troféu. A justificativa é boa: o perfil confirmado de AB pode tornar restrições compreensíveis, construir uma interação completa e testar a experiência. Porém, familiaridade com React Flow, telemetria e interfaces não comprova game design, aprendizagem ou engenharia espacial. O jogo também tem uma obrigação científica: preservar relações corretas entre objetivo, instrumentos, recursos, operação e resultado.

Separar explicitamente três perguntas no relatório: (1) maior afinidade pessoal; (2) melhor entrega possível com equipe, tempo e dados confirmados; (3) competitividade global, que permanece não estimável. O catálogo de vencedores é evidência de possibilidades, não um conjunto de treinamento capaz de revelar por que ganharam. Uma comparação de oito temas não prova que os três mais discutidos sejam os únicos relevantes: explicar por que Mars Map e Jukebox, também considerados executáveis, não ultrapassam o Jogo nas condições reais da equipe.

## Correções prioritárias

| Prioridade | Problema observado | Correção concreta |
|---|---|---|
| P0 | Matriz de execução usa 48h; Rio Verde prevê entrega às 17h de domingo. | Reavaliar para teto de **32h corridas desde sábado09h**, com tempo de descanso, alimentação, testes e submissão. Se a decisão vier depois do início, descontar o tempo já passado. Quatro máquinas não significam quatro implementadores. |
| P0 | Texto integral/Resources oficiais de alguns desafios não abriram. | Apresentar a escolha como condicionada à conferência do enunciado oficial. Para Jogo, registrar qual recurso listado fundamenta efetivamente qual parte do modelo. CubeSat101 e Design and Develop Science Missions constam na transcrição local, mas ela não substitui a confirmação normativa. |
| P0 | Cooperação, restrições, fim a fim, replay e debrief podem soar como novidade. | Esses elementos já aparecem no enunciado transcrito2026 e em precedentes. Defender **qualidade e evidência da implementação**, sem afirmar ineditismo do conceito. |
| P1 | Notas 4,5 e 5 aparentam precisão objetiva. | Preferir faixas qualitativas ou declarar julgamento e premissas. Não somar dimensões sem pesos assumidos e análise de sensibilidade; não converter score em chances. |
| P1 | Recursos NASA genéricos podem virar bibliografia ornamental. | Exigir rastreabilidade `regra/parametro → fonte/página → transformação → limite`. Documentar números didáticos separadamente de valores observacionais ou de engenharia. |
| P1 | Contexto Cerrado pode prometer impacto local inexistente. | Definir público educacional e objetivo de aprendizagem. Se não houver usuários ambientais e produto de decisão validado, contexto regional é narrativa pertinente, não prova de redução de incêndios. |
| P1 | Ausência de especialista vira argumento absoluto contra temas. | Tratar como dependência ainda não suprida. Mentor com tarefa concreta, dados já preparados ou experiência efetiva mudam a decisão; não basta disponibilidade nominal. |

## Colisão de novidade confirmada nesta revisão

**Space Quest: The Game, 2021** já propunha ensinar arquitetura de missões por jogo, com objetivos, destino, lançamento, comunicação, orçamento, turnos e cooperação. Fonte primária: https://2021.spaceappschallenge.org/challenges/statements/space-quest-the-game/ (`turn84view0`, também `turn82search6`). Portanto, não limitar a busca de precedentes aos 30 vencedores2023–25: o próprio histórico de desafios mostra proximidade mais direta que ASTROGENESIS/PureFlow.

**Build It Yourself, NASA** já conecta objetivos científicos a comprimentos de onda, instrumentos, óptica, compatibilidade das escolhas e resultado da missão. Fonte primária: https://science.nasa.gov/mission/webb/game-build-it-yourself/ (`turn84view1`). Isso não impede um bom projeto novo; exige explicar que relação decisória ele torna mais compreensível e demonstrar essa melhoria.

A transcrição2026 já menciona repetir simulações, comparar projetos e análise pós-missão. Fonte secundária: https://hackathlone.com/challenges/space-mission-design-game (`turn83view2`). Não tratar “debrief causal” isoladamente como invenção. A candidata a diferenciação é um reparo verificável no catálogo, explicação fiel ao motor e compreensão observada em tarefas específicas. Ineditismo global não foi demonstrado. A primária2026 continuou retornando502 nesta revisão.

## Gates do jogo: o que poderia derrubar a recomendação

1. **Aderência e foco:** escolher estudante/público explícito e uma missão didática. Mapear requisitos do desafio para ações visíveis. Concepção, configuração, lançamento compatível, operação, comunicação e ciência entregue precisam formar um ciclo, ainda que simplificado. Lista de componentes sem operação não basta.
2. **Coerência do catálogo:** enumerar o pequeno espaço de configurações e encontrar pelo menos duas soluções viáveis com trade-offs diferentes. Se uma escolha domina todas as outras, se toda configuração falha ou se “maior componente” sempre vence, não há decisão interessante demonstrada.
3. **Conservação e tempo:** energia disponível deve financiar aquisição, processamento e transmissão no tempo; quantidade transmitida nunca supera a disponível; exceder armazenamento produz consequência explícita. Não esconder falha por simplesmente truncar valores para zero. Em um passo temporal, capacidade da bateria e potência máxima são restrições distintas. Cobertura, oportunidade de aquisição e contato terrestre precisam ser consistentes com o cenário declarado, mesmo que pré-calculados.
4. **Objetivo científico:** não chamar todo byte transmitido de ciência útil. Uma entrega válida precisa atender à missão escolhida: alvo, tipo de medida, resolução ou condição didática definida. Evitar alegar detecção operacional de fogo sem modelar o necessário. O objetivo deve permanecer fixo quando se procura uma correção.
5. **Contrafactual honesto:** “menor alteração” exige distância definida entre designs e busca que cubra o catálogo permitido. O reparo deve manter objetivo, cenário e eventos comuns e respeitar orçamento. Se não houver solução, informar isso. “Mínimo” vale dentro desse catálogo/modelo; não é ótimo de engenharia no mundo real. Um score ponderado sozinho não demonstra fronteira de Pareto.
6. **Interação e compreensão:** antes do polimento, pessoas externas à construção devem concluir uma rodada, explicar uma causa da falha e propor uma correção. Usar também tarefa nova para não medir apenas memorização da dica. Poucos testes são evidência formativa; não comprovam eficácia educacional generalizável. Definir em linguagem simples o que conta como compreensão e registrar erros.
7. **Entrega:** manter caminho completo local/offline e fontes acessíveis. Cooperativo local cabe no escopo; multiplayer em rede, login e LLM não devem virar caminho crítico sem motivo de produto. React Flow é opção de implementação; não deve determinar uma interface que confunda o público.

## Gates das alternativas

**Fogo:** os critérios científicos propostos estão corretos, mas obter máscaras de observação, exposição, pareamento e holdout é um projeto relevante dentro de32h. A escolha só sobe se um recorte real já puder ser lido e a comparação entre sensores puder ser avaliada. Curvas separadas por sensor são fallback honesto de exploração; **não completam automaticamente um desafio de harmonização**. Não apresentar essa redução como cumprimento integral. A alteração da constelação em2026 não pode ser confundida com queda da atividade de fogo. Separar objetivo de harmonizar do objetivo de prever; previsão não é bônus sem validação.

**CLPS:** precisa validar geometria, convenções e pelo menos um horizonte relevante. Fazer comparação solar/Terra contra referência independente com tolerâncias adequadas ao passo temporal e dados. Horizonte liso pode ser demonstrador, mas enfraquece decisões de superfície em terreno acidentado. Visibilidade geométrica não garante enlace; elevação solar não garante energia. Se isso continuar só documentação, a vantagem de produto não elimina risco técnico.

## Regras, geografia e redação final

- Os estudos distinguem corretamente Finalist/Winner/Honorable Mention. Preservar isso em títulos, tabelas e frases resumidas. PureFlow2025 é vencedor; naiπ/A.T.L.A.S.2025 são finalistas; SSF2022 tem o rótulo histórico de menção, não top10.
- Rubrica e sete slides/30s recuperados são de2025 ou de páginas locais. Não transformá-los em norma global2026 verificada. Dizer que não se conseguiu recuperar o guia2026, sem concluir que inexiste.
- WIPO é índice de ecossistema de inovação; Stanford usa diferentes medidas de IA. Ambos contextualizam países, mas não justificam uma suposta cultura tecnológica nacional nem estratégia de vitória. País do evento não é nacionalidade.
- Não calcular “chance de AB” por10/submissões: isso é uma taxa bruta histórica com seleção, categoria e denominador próprios. Não há taxas condicionais por tema, equipe ou qualidade disponíveis.
- NISAR/SPHEREx/Suomi-NPP são fatos recentes relevantes; citar fontes primárias e datar corte. Disponibilidade documental não prova que a AOI/época necessária está utilizável. Hardware relatado não é benchmark executado.
- **Orçamento por fonte:** tabelas de30vencedores, fichas brasileiras e conclusões repetem material dos mesmos três comunicados. Somar palavras derivadas por fonte em todo o documento/resposta, inclusive tabelas. O padrão é200palavras por página quando não há limite maior e até25palavras de citação literal. Usar fontes individuais adicionais para detalhes; não tratar repetição em outro capítulo como orçamento novo. Root precisa abrir os refs acima antes de usá-los como citações finais.

## Formulação recomendada

“Minha primeira escolha para seu perfil é o Jogo de Design de Missões, desde que a equipe consiga fechar uma missão cientificamente coerente e uma rodada compreensível no tempo local disponível. O ganho provável está em transformar restrições de engenharia em decisões e aprendizagem observáveis. Cooperação, recursos e debrief já fazem parte do campo; o diferencial precisa aparecer na qualidade da demonstração e nos testes. Fogo ou CLPS podem ultrapassá-lo se seus respectivos gargalos de dados e validação forem resolvidos cedo. Nenhuma dessas evidências permite prever premiação.”
