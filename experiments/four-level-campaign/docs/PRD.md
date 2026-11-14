# PROJETO-IPÊ — PRD do beta

Versão editorial 1.0 · 14/11/2026 · referência de data: America/Sao_Paulo. Direção de produto: AB / Alexandre Belo. Pesquisa, organização e redação com assistência de IA. Documento de produto; a evidência de implementação, testes e publicação deve acompanhar o handoff da versão.

## 1. Produto e problema

**PROJETO-IPÊ — Ciência que chega** é um jogo educativo de projeto de missão espacial. A pessoa configura um CubeSat fictício para entregar seis registros científicos históricos do Cerrado. Precisa relacionar processamento, memória, energia, potência e comunicação para cumprir o objetivo dentro do envelope do projeto.

A dificuldade de aprendizagem que o beta pretende investigar é a distância entre escolher um componente e entender sua consequência no sistema. Capacidade de bateria não é potência de descarga; produzir um lote não significa entregá-lo; um índice calculado não permite qualquer conclusão ambiental. Uma montagem visualmente convincente também não demonstra que a missão funciona. Essas dificuldades são hipóteses de produto, ainda sem estudo próprio com participantes.

A proposta de valor é permitir **prever → executar → investigar → redesenhar** com consequências reproduzíveis. O motor apresenta recursos, eventos e dados efetivamente recebidos; o jogador pode explicar o que mudou usando evidência da própria execução. O cenário científico próximo a Rio Verde dá contexto à decisão sem sugerir que os três pontos representam todo o Cerrado.

## 2. Público e hipóteses

As personas abaixo são hipóteses de trabalho, não resultados de entrevistas nem pessoas reais da narrativa. O público inicial proposto reúne estudantes dos anos finais da educação básica, ensino médio e pessoas adultas iniciantes em engenharia espacial. A adequação de linguagem e mediação precisa ser observada antes de fixar faixa etária de uso autônomo.

| Persona hipotética | Necessidade | Barreira provável | O que observar |
|---|---|---|---|
| Estudante curioso | Descobrir por que um projeto entrega dados e outro falha | Confusão entre unidades, pouca familiaridade com sistemas | Consegue prever uma consequência e apontar o evento que a sustenta? |
| Educador ou facilitador | Conduzir uma atividade curta com discussão produtiva | Tempo de preparação e dificuldade de interpretar o relatório | Consegue iniciar a atividade e diferenciar erro de interface de dúvida conceitual? |
| Maker ou participante de hackathon | Experimentar configurações e defender escolhas | Tendência a escolher peças maiores ou copiar a primeira solução | Compara alternativas por critérios explícitos e reconhece limites do modelo? |

| ID | Hipótese | Forma proposta de investigação |
|---|---|---|
| H-01 | Mostrar uma cadeia causal entre escolha, recurso e entrega ajuda a explicar o resultado | Pergunta antes/depois com situações distintas e justificativa apoiada em evento |
| H-02 | Quatro níveis com necessidades diferentes estimulam redesign, além de memorizar uma configuração | Observar transferência de uma solução entre os níveis 2, 3 e 4 |
| H-03 | Previsão anterior ao resultado torna a revisão de ideias visível | Comparar previsão, execução e reflexão sem classificar a pessoa |
| H-04 | O mapa e os personagens tornam objetivo e próximo passo mais claros | Sessões de navegação e compreensão do briefing, com e sem mediação |
| H-05 | Controles no DOM permitem a mesma atividade sem depender do 3D | Jornadas equivalentes com teclado, leitor de tela e alternativa 2D |

Nenhuma dessas hipóteses está demonstrada pela existência do software, pela aprovação de testes ou por uma execução 6/6.

## 3. Contrato científico e operacional

O beta reutiliza o motor `0.1.1-rd`, o catálogo `ipe-64-v1` e os contratos em `src/core/`. São seis decisões binárias — bateria, painel, processamento, rádio, memória e política de transmissão — formando 64 configurações. Há dois cenários: `long-contact`, com duas janelas de 600 s, e `short-contact`, com duas janelas de 240 s.

O sucesso operacional exige **6/6 registros completos e válidos, nenhuma violação, massa ≤ 3,6 kg, custo ≤ 86 créditos e atendimento às demais regras do motor até 180 minutos simulados**. A decisão final vem de `MissionResult.outcome`; a interface não converte um 6/6 inválido em sucesso. Capacidade, potência, reservas, agendas e créditos são parâmetros didáticos.

Os registros são Terra/MODIS MOD13Q1 Collection 061, preservados com procedência e metadados. São dois períodos históricos de 2024 em três pontos próximos a Rio Verde. Os 180 minutos pertencem à simulação de processamento e transporte. Não são o período de aquisição dos dados históricos. As bandas e o índice oferecem a mesma pergunta científica do catálogo atual; um rádio ou componente diferente não melhora a qualidade original da observação. O guia oficial do produto sustenta a leitura de composição temporal, bandas, escala e qualidade [F-07].

O objetivo científico narrativo é descrever diferenças de NDVI entre os períodos recebidos. Só há comparação temporal quando os dois registros do ponto chegaram completos e válidos. Diferença de NDVI, isoladamente, não identifica a causa da mudança, e o beta não diagnostica seca, incêndio, desmatamento ou produtividade agrícola.

## 4. Campanha de quatro níveis

As condições abaixo são **objetivos pedagógicos adicionais da campanha**. Não modificam os limites globais, os parâmetros, o conjunto de dados ou o resultado do motor. Uma operação pode ter sucesso e ainda deixar a condição específica do nível pendente. A interface deve comunicar ambos os estados.

| Nível / ID | Situação e apoio | Cenário | Condição específica para concluir |
|---|---|---|---|
| 1. Primeiro sinal / `first-signal` | Reconhecer o percurso dos dados com orientação | `long-contact` | Sucesso operacional 6/6 |
| 2. Memória em disputa / `memory-tradeoff` | Investigar o acúmulo antes do primeiro contato | `long-contact` | Sucesso 6/6 mantendo memória de 512 Mbit (`buffer: compact`) |
| 3. Janela estreita / `narrow-window` | Preservar as bandas para calcular NDVI no solo apesar do contato curto | `short-contact` | Sucesso 6/6 com `processing: bands` |
| 4. Ciência que chega / `science-delivered` | Escolher um projeto com oito créditos de folga e explicar os compromissos | `short-contact` | Sucesso 6/6 com custo ≤ 78 créditos |

A dificuldade cresce pela interdependência de decisões, pelo tipo de evidência a interpretar e pela autonomia. O número mínimo de trocas não cresce em todos os níveis: a missão final começa com uma configuração que já cumpre a operação por 84 créditos e pede otimização. A descrição de dificuldade não deve prometer mais falhas ou um espaço maior de hardware no quarto nível.

Personagens, incidentes, configurações iniciais, soluções de referência, feedback e transições estão em [STORYTELLING-4-NIVEIS.md](STORYTELLING-4-NIVEIS.md). A reflexão é uma oportunidade de explicação; texto livre não recebe nota automática nem comprova aprendizagem.

## 5. Escopo do beta e fronteira do roadmap

| Área | Contrato do beta | Fora do beta / evolução |
|---|---|---|
| Entrada e campanha | Identidade PROJETO-IPÊ, mapa interativo de quatro níveis, briefing contextual, progresso e retomada local | Campanhas autorais e catálogo amplo de missões |
| Projeto e execução | Seis sistemas, 64 configurações, dois cenários e motor determinístico existente | Órbita, lançador e payload configuráveis; incerteza estocástica |
| Investigação | Previsão, revisão prévia, eventos, requisitos, comparação e ajuda após tentativa própria | Tutor generativo, nota automática de explicações e diagnóstico adaptativo |
| Ciência | Seis registros históricos, três pares de NDVI, metadados, QA e procedência | Dados ao vivo, novas regiões, séries longas e diagnósticos ambientais |
| Apresentação | Cena conceitual 3D com alternativa 2D; controles e informações essenciais no DOM | Navegação orbital operacional, cobertura real e telemetria de satélite |
| Persistência | Progresso e execuções no dispositivo, replay validado e recalculado; falha de armazenamento comunicada | Conta, turmas, sincronização, banco operacional e painel institucional |
| Laboratório | Modelos idealizados de física separados da campanha | Usar sliders do laboratório para alterar silenciosamente a campanha |
| Entrega e estudo | Repositório, publicação estática, PRD, PRT, diagramas, proposta de dados, handoff e pitch de estudo | Estudo com resultados, parceria institucional ou elegibilidade competitiva comprovada |

Um schema Prisma é um artefato de preparação para uma possível camada conectada. Sua presença não significa banco criado, migração executada, autenticação ativa ou coleta remota. O jogo visitante não depende desses serviços. Publicação no GitHub ou Vercel precisa de URL e evidência próprias; este PRD não é recibo de deploy.

A partida usa o pacote científico incluído, sem consultar uma API de dados durante a simulação. Recarga offline a frio não está estabelecida pela evidência anterior e não é promessa do beta. Preparar e verificar um cache offline seria um trabalho específico.

## 6. Jornada

1. A pessoa lê a finalidade científica, reconhece que os dados são históricos e seleciona o próximo nível no mapa.
2. O briefing apresenta personagem, incidente, meta 6/6, condição particular e recursos disponíveis.
3. No hangar, revisa escolhas, limites e condições necessárias; registra sua previsão antes de executar.
4. A execução determinística produz um resultado imutável. A animação é uma apresentação desse resultado.
5. O relatório separa operação, condição do nível e ciência disponível. Um evento ou requisito fornece a evidência para a investigação.
6. A pessoa pode refletir, comparar, solicitar ajuda e redesenhar. Ajuda não reduz reconhecimento de conclusão.
7. Uma nova execução que satisfaça o contrato do nível registra a conclusão; o mapa apresenta a próxima etapa e permite revisitar as anteriores.

O tempo simulado de 180 minutos não é contagem regressiva para a pessoa. Pausa, inspeção, ajuda, teclado e movimento reduzido não mudam os resultados nem penalizam progresso.

## 7. Requisitos e aceite

`P0` identifica o contrato de liberação do beta; `P1` identifica evolução posterior. O aceite é prescritivo e precisa ser confrontado com a evidência final de QA.

| ID | Prioridade | Requisito | Aceite observável |
|---|---|---|---|
| PRD-01 | P0 | Entrar sem conta ou chave de API | A campanha abre e executa com o pacote científico local |
| PRD-02 | P0 | Apresentar quatro níveis reais | Cada nível carrega briefing, cenário, preset e critério próprios; cartões sozinhos não completam etapas |
| PRD-03 | P0 | Preservar sucesso do motor | `invalid`, `failure` e `success` permanecem distintos; 6/6 com violação nunca conclui nível |
| PRD-04 | P0 | Separar critério do nível | Sucesso com memória grande no N2, índice no N3 ou 84 créditos no N4 mostra condição pendente |
| PRD-05 | P0 | Avaliar a execução correta | Progresso usa o snapshot executado, ID do nível e versões; editar depois não transforma execução antiga em prova |
| PRD-06 | P0 | Preservar intenção de aprendizagem | Previsão antecede execução; resultado apresenta hipótese, evidência e oportunidade de redesign |
| PRD-07 | P0 | Mostrar informação derivada do motor | Contadores, perdas, fila, energia, eventos e requisitos correspondem à mesma execução |
| PRD-08 | P0 | Exibir ciência efetivamente recebida | Um par incompleto não mostra delta de NDVI; dado ausente não é interpolado ou preenchido |
| PRD-09 | P0 | Tornar a ajuda coerente com a campanha | Alternativas sugeridas para concluir o nível atendem seu critério; ajuda genérica declara seu alcance e não afirma conclusão |
| PRD-10 | P0 | Permitir comparação responsável | Cenários e escolhas diferentes ficam explícitos; múltiplas mudanças não são apresentadas como efeito isolado |
| PRD-11 | P0 | Progresso repetível e revisável | Reabrir nível concluído não duplica marcos; novo resultado não apaga evidência anterior; repetir falha não concede conclusão |
| PRD-12 | P0 | Usar mapa com alternativa textual | Nível, estado, objetivo e ação podem ser compreendidos e acionados sem canvas ou arraste |
| PRD-13 | P0 | Preservar escolhas sem depender de WebGL | Fallback 2D mantém montagem, execução, investigação e progresso funcionais |
| PRD-14 | P0 | Tratar armazenamento indisponível | Erro de armazenamento é informado; atividade pode continuar na sessão e não informa salvamento inexistente |
| PRD-15 | P0 | Validar importação | Replay rejeita estrutura ou versões incompatíveis e recalcula o resultado aceito; importação não fabrica conquista |
| PRD-16 | P0 | Preservar fontes e autoria | Dados, datas, licença, origem do código, assistência de IA e limites da cena são acessíveis |
| PRD-17 | P0 | Entregar material consistente | PRD, storytelling, PRT e handoff usam os mesmos IDs, critérios e distinção beta/roadmap |
| PRD-18 | P1 | Avaliar uso real | Protocolo e instrumentos revisados; participantes e resultados somente após pesquisa efetiva |
| PRD-19 | P1 | Preparar modo institucional opcional | Autenticação, finalidade, isolamento, retenção e testes antes de habilitar coleta; visitante permanece independente |

## 8. Acessibilidade e qualidade de uso

WCAG 2.2 é a referência para planejar e verificar acessibilidade, com foco nos critérios de texto alternativo, teclado, foco, contraste, reflow, movimentos de arraste e mensagens de estado [F-05]. Isso não constitui declaração de conformidade do beta.

| ID | Requisito de produto | Verificação planejada |
|---|---|---|
| A11Y-01 | Operar mapa, escolhas, execução, relatório e diálogos por teclado | Percurso completo em navegador real, ordem de foco, escape e retorno ao acionador |
| A11Y-02 | Manter objetivo e estado fora do canvas | Conferir nomes, relações, textos e valores com leitor de tela |
| A11Y-03 | Não depender exclusivamente de cor ou movimento | Estados com texto; pausa; preferência de movimento reduzido; alternativa 2D |
| A11Y-04 | Manter informação utilizável em telas pequenas e zoom | Inspecionar reflow, sobreposição, rolagem e foco visível em larguras documentadas |
| A11Y-05 | Fornecer alvos e feedback claros | Evitar controles pequenos e gestos de precisão; anúncio conciso de conclusão/erro |
| A11Y-06 | Explicar unidades e termos no contexto | Mbit, bit/s, W, Wh, NDVI e reserva têm apoio curto próximo da decisão |

Não impor prazo de resposta, punição por pedir ajuda, ranking público, recompensa por tempo de tela ou ação motora que seja desnecessária à decisão. Qualidade de navegação e compreensão serão avaliadas separadamente de velocidade de conclusão.

## 9. Dados e analytics propostos

O beta já dispõe de diário local de previsões, tentativas, reflexões, ajuda e redesign. Isso é um recurso do dispositivo, não uma plataforma de analytics institucional. Os eventos abaixo formam uma proposta de instrumentação mínima para estudo futuro, sem autorização implícita para enviar dados a servidor.

| Evento proposto | Campos mínimos | Pergunta de pesquisa |
|---|---|---|
| `level_opened` | ID/versão do nível, modo de apoio, instante local | A pessoa reconhece e acessa a próxima etapa? |
| `prediction_recorded` | Tentativa, hipótese, cenário, configuração | O que esperava antes de conhecer o resultado? |
| `attempt_completed` | Tentativa, versões, resultado, restrições, condição do nível | Onde a operação e o briefing divergem? |
| `evidence_viewed` | Tentativa, código/ID de evento ou requisito | Que evidência foi consultada antes do redesign? |
| `redesign_started` | Tentativas relacionadas e escolhas alteradas | Houve alteração justificada ou tentativa sem hipótese? |
| `help_requested` | Nível, momento e tipo de apoio | A interface deixou a pessoa sem próximo passo compreensível? |
| `level_completed` | Nível, tentativa válida e critério atendido | O percurso foi concluído sem confundir operação e condição pedagógica? |

Evitar nome completo, e-mail, data de nascimento, localização da pessoa, gravação de tela, áudio ou perfil público no núcleo visitante. Coordenadas do pacote MODIS descrevem os dados, não a localização do jogador. Texto livre pode conter identificação espontânea; sua eventual exportação exige orientação e revisão. Não chamar armazenamento local de anonimato garantido.

As métricas propostas são: conclusão por nível e critério; tentativas até uma solução; incidentes de usabilidade; uso de apoio; capacidade de explicar uma relação com evidência; e desempenho em uma tarefa distinta de transferência. Informar denominadores, faltantes, contexto, versão e apoio recebido. Percentual de conclusão mede o fluxo; aprendizagem exige instrumento próprio. Não há resultados de campo neste documento.

## 10. Validação e decisão de liberação

Há três camadas de evidência: **software/modelo**, **usabilidade/acessibilidade** e **valor educativo**. A primeira verifica contratos; a segunda observa a interação; a terceira investiga compreensão e transferência. Nenhuma substitui as demais.

Antes da liberação, o integrador deve confrontar os requisitos P0 com testes do domínio e da campanha, fluxo UI, build e inspeção de navegador. A documentação de QA deve informar ambiente, comandos, resultado, achados corrigidos e limites. Não marcar leitor de tela, durabilidade de armazenamento, Worker real, GPU ou recarga offline como verificados por um teste jsdom.

Para uma rodada formativa posterior, propõe-se começar com um grupo pequeno e diverso de iniciantes e educadores, com sessões observadas e consentimento adequado ao contexto. O objetivo inicial é encontrar problemas de compreensão e interação, não estimar um efeito causal ou anunciar uma porcentagem de aprendizagem. A quantidade e o recrutamento serão definidos no protocolo real.

Perguntas prioritárias:

1. O jogador explica a diferença entre dado histórico, processamento simulado e ciência recebida?
2. Diferencia W de Wh ao investigar a limitação de pico?
3. Explica por que a memória precisa suportar o acúmulo antes do primeiro contato?
4. Percebe por que a solução com índice deixa de atender o pedido do nível 3?
5. Identifica que 6/6 por 84 créditos cumpre a operação, mas não a condição de 78 créditos do nível 4?
6. Consegue propor um redesign com base em uma evidência, sem copiar a solução da ajuda?
7. Entende que um delta de NDVI não estabelece uma causa ambiental?
8. Consegue completar a jornada com os recursos de acessibilidade que utiliza?

## 11. Riscos e respostas de produto

| Risco | Consequência | Resposta prevista |
|---|---|---|
| Memorizar uma configuração | Conclusão sem transferência | Pedidos diferentes, previsão, comparação e tarefa externa de explicação |
| Condição do nível parecer uma regra física oculta | Frustração e modelo mental incorreto | Expor no briefing e separar avaliação do motor e da campanha |
| Ajuda revelar uma solução fora do pedido | Redesign que funciona mas não progride | Filtrar ou rotular o alcance da ajuda; testar N2/N3/N4 explicitamente |
| Cena sugerir órbita operacional | Confiança indevida no visual | Identificar cena conceitual e manter laboratório separado |
| Confundir NDVI com diagnóstico | Afirmação ambiental sem suporte | Exibir datas, QA, escala e limite de inferência junto do retorno científico |
| Tratar contagem do catálogo como probabilidade | Certeza estatística fictícia | Falar em configurações viáveis; não calcular chance de voo |
| Registro local perder-se | Ruptura de continuidade | Comunicar falha, permitir sessão e replay/exportação existente |
| Documentação anunciar implementação não verificada | Handoff incorreto | Separar requisito, observação e roadmap; registrar URLs e QA reais |
| Narrativa ou publicação sugerir parceria | Uso indevido de confiança institucional | Personagens fictícios, atribuição de fontes e nenhuma alegação de endosso |

## 12. Origem, referências e decisões

O projeto preserva a origem em [oalexandrebelo/AB-NASA-TEAM-IPE](https://github.com/oalexandrebelo/AB-NASA-TEAM-IPE), commit `73162276b46227e8965eed2b91a7dc8edae70b96`, e os avisos de autoria/licença existentes. O nome PROJETO-IPÊ identifica a evolução solicitada; não apaga a história da Missão Ipê. Não há endosso NASA, PhET ou W3C.

Os anexos SmartCity fornecidos por AB foram usados como referência de estrutura: separar evidência de intenção, ligar mecânica a feedback, preservar autoria e manter serviços futuros distintos do núcleo visitante. A campanha continua espacial. Faixas etárias, legislação de trânsito, 12 missões, Prisma de 23 modelos e promessas de offline daquele material não foram transferidos para este produto.

Fontes consultadas em **14/11/2026, America/Sao_Paulo**. As aplicações ao PROJETO-IPÊ são decisões autorais de produto.

| ID | Fonte primária | Uso e alcance |
|---|---|---|
| F-01 | [NASA — Appendix S: Concept of Operations Annotated Outline](https://www.nasa.gov/reference/appendix-s-concept-of-operations-annotated-outline/) | Necessidade, usuários, operação e cenários como estrutura de briefing; sem revisão NASA |
| F-02 | [NASA — Systems Engineering Curriculum, NTRS 20210021839](https://ntrs.nasa.gov/citations/20210021839) | Raciocínio de sistemas; o exemplo curricular de armazenamento apoia a discussão de compromissos |
| F-03 | [My NASA Data — Introduction: Building Claims from Evidence](https://mynasadata.larc.nasa.gov/lesson-plans/introduction-building-claims-evidence) | Separar afirmação, evidência e raciocínio no debrief |
| F-04 | [PhET / University of Colorado Boulder — Research](https://phet.colorado.edu/en/research) | Inspirar investigação da interface e observação de uso; não transferir eficácia para este jogo |
| F-05 | [W3C — WCAG 2.2](https://www.w3.org/TR/WCAG22/) | Planejar critérios de acessibilidade e verificações reais |
| F-06 | [My NASA Data — About](https://mynasadata.larc.nasa.gov/about-mnd) | Referência de progressão entre leitura visual e análise de dados autênticos |
| F-07 | [MODIS Vegetation Index User's Guide — Collection 6.1](https://modis-land.gsfc.nasa.gov/pdf/MOD13_User_Guide_V61.pdf) | Versão 3.10, setembro/2019; contexto científico e interpretação das bandas, escala e QA |

Continuam válidas as fontes e limitações documentadas em [PESQUISA-E-DECISOES-R9.md](PESQUISA-E-DECISOES-R9.md), [REFINAMENTO-NASA-R10.md](REFINAMENTO-NASA-R10.md) e `research/round10/`. A nova pesquisa e as oportunidades estão em [INSIGHTS-E-OPORTUNIDADES.md](INSIGHTS-E-OPORTUNIDADES.md).
