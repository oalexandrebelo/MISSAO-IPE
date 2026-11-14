# Refinamento ConOps — Missão Ipê 6/6

Pesquisa de 14/11/2026. Escopo: oportunidades de refinamento baseadas em fontes primárias NASA, sem editar o site durante o empacotamento. Continuidade: Missão Ipê, campanha LEO/Cerrado, seis escolhas binárias e seis resultados históricos MOD13Q1. O direcionamento desta rodada fixa a meta 6/6; a hipótese de calibração 4/6 da pesquisa inicial não deve ser aplicada a esta versão.

## Decisão recomendada

O maior ganho imediato é explicitar a lógica que já existe: para quem a missão trabalha, o que deve entregar, em quais condições opera e como cada escolha contribuiu para o resultado. Isso pode ser feito com texto contextual, estados derivados e relatório, mantendo catálogo, dados e motor determinístico.

As referências estudadas orientam este desenho. Elas não representam aprovação, certificação nem demonstração de conformidade do jogo com processos da NASA.

## Top 3 melhorias rápidas

| Prioridade | Mudança proposta | Onde aparece | Critério de aceitação |
|---|---|---|---|
| 1 | Uma abertura de missão com destinatário, pergunta científica, meta 6/6 e limites | Antes das escolhas; resumo persistente no planejamento | A pessoa consegue dizer o que precisa entregar e para quem antes de escolher hardware |
| 2 | Narrar a operação por causa e efeito, distinguindo condição prevista de anomalia | Replay e eventos da missão | Cada perda ou atraso tem causa ligada ao modelo; eclipse ou ausência prevista de contato não aparecem automaticamente como defeito |
| 3 | Fechar com três avaliações independentes e evidência | Revisão e relatório final | A interface separa projeto viável, operação concluída e meta científica atingida; explica o gargalo e permite voltar à escolha responsável |

### 1. Abertura: dar significado ao 6/6

Texto proposto, para ajustar aos nomes e critérios reais do motor:

> Você lidera uma missão de observação do Cerrado. Projete o satélite para que seis resultados cheguem à equipe que estuda a vegetação de Rio Verde. Equilibre os recursos da nave e acompanhe o caminho dos dados até o solo.

Complemento de precisão:

> A campanha usa referências históricas Terra/MODIS. As escolhas simulam a capacidade da missão de entregar os resultados; não alteram as medições originais.

Uma linha responde à pergunta científica: “Como a vegetação varia entre os períodos históricos apresentados?”. Essa é uma pergunta de exploração, não uma conclusão causal sobre seca, incêndio ou desmatamento.

Aplicação proposta: uma ficha com quatro campos curtos — **Quem usa**, **Pergunta**, **Entrega: 6/6**, **Limites**. Os limites devem vir do modelo atual. Evitar valores ou obrigações novas criadas apenas para preencher a interface.

Base documental: Appendix S §§1.1.1, 3.1 e 3.2; SEH §4.1. A adaptação da NASA para uma ficha curta é nossa decisão de UX.

### 2. Operação: deixar o gargalo compreensível

O currículo NASA oferece um exemplo particularmente próximo: um satélite LEO precisa armazenar dados porque não mantém contato contínuo com estações; o armazenamento disputa recursos da nave. Essa relação pode aparecer no replay com uma frase por evento, sempre derivada do motor.

Exemplos de microcopy proposta, usar somente onde o estado real corresponder:

- **Sem contato previsto:** “Os dados permanecem a bordo até a próxima janela de transmissão.”
- **Memória insuficiente:** “Esta coleta não foi armazenada porque a memória disponível era menor que o volume necessário.”
- **Enlace limitado:** “A janela terminou antes de transmitir todos os dados armazenados.”
- **Eclipse previsto:** “A nave está sem iluminação solar e depende da energia armazenada.”
- **Modo de proteção, se implementado:** “A coleta foi suspensa para preservar a operação da nave.”

Formato de cada evento: **o que aconteceu → qual recurso mudou → qual resultado foi afetado**. Uma ação “Ver decisão relacionada” pode levar ao componente ou escolha que realmente causou o efeito.

Não atribuir uma causa só porque ela parece plausível. Se o motor calcula apenas um balanço agregado, dizer “capacidade estimada insuficiente nesta simulação”, sem inventar instante de pane, sequência de comandos ou recuperação física.

Base documental: currículo NTRS 20210021839, §2.4, página impressa 12; Appendix S §§3.4, 6.1 e 6.2. A classificação de cada evento da Missão Ipê depende do comportamento implementado, não da presença de um ícone de alerta.

### 3. Resultado: três perguntas, três estados

| Avaliação | Pergunta que responde | Exemplos de evidência |
|---|---|---|
| Projeto viável | A configuração respeitou os limites do modelo? | Massa/capacidade; custo/orçamento; compatibilidade existente |
| Operação concluída | A sequência simulada chegou ao fim conforme suas regras? | Etapas concluídas; ocorrência terminal, caso exista |
| Meta 6/6 atingida | Os seis resultados exigidos foram entregues? | IDs únicos e contador já calculado pelo motor |

Uma operação concluída com 4/6 entregas pode ter projeto viável e meta não atingida. A interface deve explicar isso sem trocar o nome da meta nem tratar tudo como “missão explodiu”. A nave pode sobreviver e ainda assim deixar de cumprir o objetivo.

O relatório deve destacar primeiro o resultado principal, depois a causa dominante e a escolha relacionada. Comparar com outra configuração usando o mesmo cenário permite examinar causalidade. Não prometer que uma mudança isolada resolverá o problema sem recalcular a alternativa.

Base documental: SEH §5.3 distingue conformidade com requisitos; §5.4 trata adequação ao uso. No jogo, esses conceitos inspiram a separação dos resultados; não equivalem a uma validação de missão espacial real.

## Evidência primária: versão, localização e alcance

### NASA Systems Engineering Handbook

Página: https://www.nasa.gov/reference/systems-engineering-handbook/

PDF: https://www.nasa.gov/wp-content/uploads/2018/09/nasa_systems_engineering_handbook_0.pdf

Versão documental: **NASA/SP-2016-6105 Rev2**, substitui Rev1 de 2007. A data de atualização de uma página web não deve ser usada como uma nova revisão técnica. O prefácio informa que o handbook é orientação de boas práticas, não diretiva.

Trechos consultados para esta proposta:

| Localização | O que sustenta | Aplicação nossa |
|---|---|---|
| §4.1; abertura do capítulo 4 | Expectativas, objetivos, restrições e critérios de sucesso antecedem e orientam o desenho | Explicitar o pedido científico antes da montagem |
| §4.2.1.2.2–3 | Diferencia função e desempenho; pede racional e contexto dos requisitos | Cada limite ou meta precisa de razão compreensível |
| §4.2.1.2.4 | Requisitos devem ser coerentes com missão, ConOps e sucesso | Contador 6/6 e critérios finais têm de corresponder ao objetivo prometido |
| §5.3 e §5.4 | Verificação e validação respondem a perguntas diferentes | Separar viabilidade da configuração da entrega da missão |
| Appendix D | Recomenda identificar requisitos e sua fonte, planejando como verificá-los | Uma pequena matriz interna orienta a revisão e o relatório |

URLs dos capítulos:

- https://www.nasa.gov/reference/4-0-system-design-processes/
- https://www.nasa.gov/reference/5-0-product-realization/
- https://www.nasa.gov/reference/appendix-d-requirements-verification-matrix/

### Appendix S: Concept of Operations Annotated Outline

Página: https://www.nasa.gov/reference/appendix-s-concept-of-operations-annotated-outline/

Versão: integra o Handbook Rev2. **Páginas impressas 251–253**, correspondentes às páginas 261–263 do PDF contado a partir de 1. A página impressa 254 inicia Appendix T. A extração HTML desta sessão ficou parcial; o conteúdo restante foi conferido no PDF oficial.

Resumo dos trechos, mantido curto: o roteiro admite adaptação ao tipo, porte e complexidade do projeto. §§1.1 e 1.2 cobrem motivação, premissas e escopo; §§3.1–3.4 conectam expectativas, elementos, pessoas, interfaces e modos; §§4–5 tratam ambiente e suporte; §6 pede cenários rastreáveis; §§6.1–6.2 distinguem funcionamento esperado de falhas, baixo desempenho, condições inesperadas ou erro humano; §7.3 relaciona sucesso a perguntas científicas e lacunas de conhecimento.

Trecho curto decisivo: “cover both nominal and off-nominal conditions”. Ele sustenta tratar falhas e degradação de modo explícito, não exigir aleatoriedade ou complexidade extra.

### Currículo NASA — NTRS 20210021839

Registro: https://ntrs.nasa.gov/citations/20210021839

PDF: https://ntrs.nasa.gov/api/citations/20210021839/downloads/SE-Curriculum-Intro.2021-09-20.pdf

Metadados: autores Kenneth Freeman e Gilena A. Monroe, Ames Research Center; publicação em **11/10/2021**; arquivo identificado por **20/09/2021**; 27 páginas; material curricular para estudantes. O registro exibe o título “System Engineering Curriculum Into”, enquanto o PDF abre com “Systems Engineering Curriculum”.

O currículo foi adaptado do Handbook e desenvolve um exemplo de satélite/instrumento para detecção de incêndios. §§2.3 e 3 mostram a passagem de operação imaginada a requisitos, projeto, integração, testes e uso. A página impressa 12 apresenta o trade-off de armazenar dados entre contatos, sob limites de massa, potência, tamanho e custo. As atividades pedem aos estudantes formular poucos requisitos e explorar alternativas. As páginas 15–19 aproximam necessidades de stakeholders, conceito e requisitos derivados.

Limite: o exemplo é de detecção térmica de incêndio. Não importar sua operação noturna ou seu instrumento como se fossem propriedades do NDVI/MOD13Q1 da campanha. A oportunidade é adaptar o raciocínio de engenharia, preservando a diferença científica.

### NASA Science Activation / Learn

Portal: https://science.nasa.gov/learn/

Dados: https://science.nasa.gov/learn/entry-points-to-nasa-data/

Aprendizagem digital: https://science.nasa.gov/learn/digital/

São páginas de programa/catálogo, sem revisão técnica numerada indicada. SciAct oferece recursos para diferentes públicos, participação em ciência e conteúdo educativo revisado. O catálogo de dados organiza ferramentas também por nível de habilidade. Para Terra, lista entradas como My NASA Data, NEO, Eyes on Earth e Worldview.

Aplicação proposta: oferecer aprofundamento opcional depois da partida — origem do dado, explicação do indicador e uma ferramenta para explorar outros períodos. A existência dessas páginas não demonstra eficácia pedagógica da Missão Ipê e não autoriza afirmar parceria com o programa.

## ConOps leve proposto para o projeto

Este texto é uma definição proposta do produto, não uma reprodução do documento NASA.

**Necessidade:** aprender como decisões de engenharia tornam possível entregar dados científicos, com referência local ao Cerrado.

**Objetivo científico da história:** explorar variações de vegetação entre os períodos históricos de Rio Verde representados na campanha.

**Objetivo jogável:** configurar uma missão que entregue os seis resultados exigidos pelo cenário, respeitando as regras do catálogo atual.

**Objetivo educativo:** ao final, a pessoa consegue explicar uma cadeia causal entre escolha, recurso e entrega científica; distingue observação histórica de simulação.

**Sistema:** jogador/equipe, nave didática, instrumentos e recursos abstratos, sequência de operação, estação/recepção e destinatário científico. A interface apresenta o funcionamento; o catálogo define as escolhas e o motor determina resultados.

**Premissas:** cenário histórico fixado; mesmos inputs produzem os mesmos outputs; parâmetros didáticos identificados; duração da partida não equivale à duração física dos compostos de 16 dias; a animação orbital não deve sugerir fidelidade superior à do modelo.

**Limites:** este refinamento não muda valores históricos, parâmetros, catálogo ou condição de vitória. Operação de missão espacial real, licenciamento e engenharia de lançamento real ficam fora do escopo pedagógico.

**Início e término:** começa na compreensão do pedido científico e termina na avaliação do resultado, proveniência e possibilidade de comparar outra configuração. A decolagem é uma etapa.

## Stakeholders sem criar parceiros fictícios

| Papel | Natureza | Necessidade a representar |
|---|---|---|
| Jogador iniciante | Usuário real a validar | Entender as opções e corrigir uma escolha sem conhecimento prévio avançado |
| Professor/facilitador | Público potencial, ainda precisa de validação | Observar aprendizagem e conduzir discussão curta |
| Equipe que estuda a vegetação | Papel da narrativa, não organização real parceira | Receber resultados identificáveis e úteis para a pergunta científica |
| Controle da missão | Papel da narrativa e função do sistema | Manter operação e explicar o estado da nave |
| Equipe de desenvolvimento | Responsável real pelo produto | Preservar dados, regras e resultados reproduzíveis |

Não usar nome ou logotipo de organização como destinatária real sem vínculo existente. O jogador pode operar sozinho; papéis diferentes podem orientar cooperação na mesma tela, sem alegar multiplayer.

## Cenários que o ConOps deve distinguir

| Cenário proposto | Classificação | Informação essencial para o jogador | Limite de implementação |
|---|---|---|---|
| Coletar, armazenar e transmitir em contato previsto | Nominal | Dado segue etapas antes de chegar | Expor estados existentes; não inventar telemetria |
| Esperar contato | Nominal quando planejado | Guardar dados faz parte da missão | Ausência de contato não implica falha de rádio |
| Eclipse conhecido | Nominal quando previsto | Reserva de energia permite atravessar o período | Só mostrar duração/consumo se o modelo os fornecer |
| Meta não cumprida por capacidade insuficiente | Resultado de configuração inadequada | Identificar gargalo e contrafactual calculado | Evitar transformar todo trade-off ruim em pane física |
| Energia menor que a prevista ou rádio que falha | Anormal, se houver evento correspondente | Detecção, efeito, recuperação ou condição terminal | É expansão futura se não existe no motor |
| Dado rejeitado pela regra científica de qualidade | Controle de qualidade previsto | Explicar por que não serve para determinada análise | QA deve vir do dado/regra real; upgrade de rádio não melhora QA histórica |

Não é necessário introduzir eventos aleatórios para representar cenários anormais. Um modo de treino separado pode usar um evento reproduzível e identificado. Não alterar o cenário principal para fabricar drama durante o empacotamento.

## Cadeia missão → requisito → verificação

Matriz proposta para uso interno. Os identificadores são nossos e não pertencem à NASA.

| Missão/necessidade | Requisito candidato do jogo | Evidência/verificação | Limite |
|---|---|---|---|
| Entregar a meta | R-SCI-01: contabilizar os seis resultados conforme a definição atual do motor | Comparar IDs únicos entregues com IDs exigidos | Não introduzir outro critério de sucesso pela UI |
| Entender o resultado | R-EXP-01: todo resultado incompleto apresenta uma causa baseada no cálculo | Conferir relatório contra estados e regras da configuração | Explicação é inválida se não houver evidência no motor |
| Configurar missão viável | R-CFG-01: avaliação usa os limites atuais de massa, custo e compatibilidade | Casos conhecidos abaixo, no limite e acima | Sem inferir capacidade física real a partir de unidade didática |
| Preservar referência científica | R-DAT-01: valores e proveniência permanecem idênticos entre configurações | Comparar registros científicos antes/depois da simulação | Entrega simulada muda; observação histórica não |
| Permitir comparação | R-REP-01: mesma configuração e versão de cenário produzem o mesmo resultado | Comparar execuções e versões | Um cenário novo recebe identificação própria |
| Não confundir etapas | R-STS-01: apresentar capturado/transmitido/entregue somente conforme os estados existentes | Conferir contadores e mensagens na mesma execução | Se o motor não distingue etapas, declarar o grau de abstração |

Essas verificações avaliam o software/modelo segundo seu contrato. A validação educativa é separada: observar usuários compreendendo a meta, identificando um gargalo e escolhendo uma alteração justificável. Uma suíte técnica aprovada não demonstra, sozinha, que o jogo ensina.

## Oportunidades futuras, depois do pacote atual

1. **Comparação orientada.** Guardar duas configurações no mesmo cenário e perguntar qual atende a meta com menor uso de um recurso. Mostrar alternativas viáveis sem impor uma única solução universal.
2. **Treino de recuperação.** Campanha curta com perda de uma janela ou capacidade reduzida. A pessoa identifica impacto e escolhe uma resposta dentro de regras documentadas. Começar com um único evento reproduzível.
3. **Debrief para educadores.** Três perguntas: o que você previu, o que aconteceu, que evidência sustenta sua próxima escolha. Proposta nossa, a validar com usuários; não atribuir o método como requisito NASA.
4. **Exploração científica.** Ao concluir, abrir origem da observação e recurso de aprendizagem adequado ao nível. Comparar períodos preservando contexto e QA, sem converter diferença de NDVI em diagnóstico automático.
5. **Fim de missão.** Introduzir descarte/encerramento e arquivo de resultados em uma campanha futura. Sem inventar uma manobra real se o modelo só simula operação simplificada.

## Pontos a conferir antes de aplicar

- No retorno científico, comparar somente os registros recebidos, ordenar por período e manter localização/unidade comparáveis. Com menos de dois registros, apresentar o dado disponível sem calcular variação temporal. Ausências devem permanecer visíveis; não completar a série com dados não entregues nem concluir causa da variação. Ao comparar partidas, identificar quando os subconjuntos de datas recebidas diferem.
- Confirmar se 6/6 significa apenas entregues ou entregues e aprovados cientificamente; não alterar a definição por texto.
- Conferir se os seis registros já têm QA auditada. Se não têm, não declarar qualidade científica validada.
- Ler estados e causas efetivamente emitidos pelo motor antes de gerar narrativa de operação.
- Manter as escolhas e todos os resultados atuais reproduzíveis; mudanças de regras exigem versão própria.
- Apresentar Handbook e currículo como referências utilizadas no desenho educativo. Não usar “NASA compliant”, “NASA approved” ou equivalentes.

Nenhum arquivo do site foi alterado nesta frente.
