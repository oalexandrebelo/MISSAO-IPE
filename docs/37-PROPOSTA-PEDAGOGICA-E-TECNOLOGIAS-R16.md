# 37 — Proposta pedagógica e tecnologias para as três missões · R16

**Pesquisa e corte de código: 15/11/2026.** A R15 é a base publicada inspecionada. A R16 propõe tornar explícito, dentro do jogo, o que cada caso ensina: escolher uma pergunta, prever um efeito, observar evidências e explicar uma revisão do projeto. Os três miniexperimentos estão implementados no código local em `mission-curriculum.ts` e `MissionLearning.tsx`, com comparação A/B, previsão e reflexão. A integração do percurso e sua verificação são registradas separadamente; este documento não declara a publicação R16. O estado da entrega deve ser consultado em [PUBLICADO.md](https://github.com/oalexandrebelo/PROJETO-IPE/blob/main/PUBLICADO.md).

A prioridade imediata é reutilizar o domínio, a cena e os componentes existentes. **Nenhuma nova dependência é necessária para realizar os três miniexperimentos propostos.** As bibliotecas pesquisadas entram como oportunidades condicionais, cada uma ligada a uma necessidade concreta e a limites verificáveis. O [catálogo estruturado R16](../research/technology-opportunities-r16.json) guarda oito oportunidades e os três experimentos.

Este documento complementa o [guia didático extenso](32-GUIA-DIDATICO-MISSOES-3D.md), a [pesquisa NASA Science](33-OPORTUNIDADES-NASA-SCIENCE.md) e o [handoff R15](34-HANDOFF-IMERSAO-3D-R15.md).

## 1. Para quem e para quê

O público inicial proposto é formado por estudantes de ensino médio/técnico, graduação introdutória e visitantes de divulgação científica com mediação. Essa escolha orienta linguagem e profundidade; ainda não representa validação com essas pessoas nem alinhamento curricular certificado.

A pessoa deve conseguir entrar sem conhecer astrodinâmica. Precisa entender a pergunta do caso e fazer uma previsão pequena antes de enfrentar o catálogo completo. Quem desejar aprofundar encontra unidades, contas e fontes. Quem tiver dificuldade com 3D deve realizar a mesma atividade por controles textuais e representação 2D.

A aprendizagem procurada é observável: explicar uma decisão com o requisito, o mecanismo e a evidência correta. “Gostei da nave”, “cliquei em todas as peças” ou “obtive 6/6” não são suficientes para demonstrar essa compreensão.

| Caso | Entrada por interesse | Pergunta científica | Aprendizado observável proposto |
| --- | --- | --- | --- |
| **Cerrado** | Vegetação, território e sensoriamento remoto | O que mudou entre dois períodos em três pontos, considerando apenas os registros recebidos e válidos? | Explicar que reduzir o volume de dados pode aumentar a exigência de potência; distinguir dado ausente de índice baixo. |
| **Bennu** | Geologia planetária e exploração robótica | Como comparar duas observações de cada região didática da superfície? | Calcular ou explicar por que produzir um registro não garante sua recepção; relacionar taxa e tempo de contato. |
| **Telescópio** | Luz, astronomia e instrumentos | Como comparar três faixas infravermelhas em duas exposições? | Distinguir arquivo recebido de evidência adequada: o instrumento precisa responder à pergunta. |

Cerrado usa seis registros históricos Terra/MODIS. Bennu usa rugosidade sintética e telescópio usa fluxos relativos sintéticos. O jogador deve ver essa distinção antes de interpretar o resultado. Os modelos NASA são referências geométricas, não as naves parametrizadas nem provas de engenharia.

## 2. A promessa didática de cada caso

### Cerrado — economizar dados tem consequências na nave

**Convite:** “Três pontos, dois períodos. Faça os registros chegarem e descubra o que é possível comparar.” O pedido é científico; as escolhas de energia, processamento e comunicação são meios para atendê-lo.

**Decisão → efeito → evidência → reflexão:** trocar BANDAS por ÍNDICE reduz o lote de 180 para 60 Mbit, mas aumenta a carga total durante o processamento de 26 para 38 W. Com a bateria pequena, o evento de pico mostra a falha antes do primeiro lote terminar. A reflexão deve explicar por que o volume menor não resolveu tudo e qual recurso precisa ser revisto.

O retorno científico exige pares completos e válidos. A interface deve distinguir o início do composto da data da observação e impedir que ausência seja interpretada como zero. Uma diferença de NDVI não determina, sozinha, seca, manejo ou outra causa ambiental.

**Quatro segmentos:** usuários precisam dos pares; lançamento limita massa e orçamento; a nave escolhe processamento e alimentação; o solo precisa receber o conjunto. O lançador e o perfil do Cerrado continuam fixos no modelo atual.

### Bennu — a descoberta só chega quando o enlace dá conta

**Convite:** “Uma superfície, três regiões. Produza observações e enfrente o limite entre guardar e receber.” O instrumento exigido é a câmera de superfície; as regiões A/B/C e sua rugosidade são construções didáticas.

**Decisão → efeito → evidência → reflexão:** ampliar contatos de 120 para 500 s aumenta o tempo de transmissão, mantendo taxa e antena. A fila e os horários de recepção demonstram a diferença. A reflexão deve separar registro produzido, parcialmente recebido e completo.

O objetivo não é ensinar mineração nem escolher um pouso real. O caso trabalha com entrega e comparação de observações fictícias, situado num alvo visual de referência NASA.

**Quatro segmentos:** usuários pedem seis registros; lançamento define envelope e compatibilidade do perfil; a nave precisa produzi-los e armazená-los; o solo determina as oportunidades de recepção.

### Telescópio — mais arquivos não significam a informação certa

**Convite:** “A luz carrega pistas. Escolha o instrumento capaz de responder à pergunta.” O pedido exige comparação por faixa infravermelha; a arquitetura precisa sustentar essa escolha.

**Decisão → efeito → evidência → reflexão:** uma câmera pode transmitir seis arquivos completos sem atender ao objetivo. O evento de incompatibilidade e a contagem de registros válidos mostram a diferença. Trocar por espectrômetro na arquitetura de referência permite satisfazer o pedido. A reflexão deve reconhecer em que outra investigação uma câmera seria apropriada.

Essa distinção tem apoio conceitual na explicação de [instrumentos científicos do Webb](https://science.nasa.gov/mission/webb/science-overview/science-explainers/webbs-scientific-instruments/). O Ipê não reproduz esses instrumentos: usa três faixas e seis fluxos sintéticos. Não detecta água, atmosfera ou vida.

**Quatro segmentos:** usuários definem a informação procurada; lançamento suporta envelope e perfil; a nave fornece instrumento, potência e memória; o solo recebe os registros. LEO/L2 continuam nomes de agendas conceituais. As duas ou três horas começam depois da chegada, sem viagem orbital calculada.

## 3. Uma experiência curta antes do projeto completo

O seletor de três missões deve apresentar **pergunta, dado e aprendizado**, além da aparência do destino. A pessoa não deve precisar abrir um documento externo para descobrir o que fará no jogo.

O percurso didático da R16 conecta os módulos locais ao projeto completo:

1. **Escolher uma história:** destino, necessidade e origem dos dados em poucas frases.
2. **Observar um contraste:** duas alternativas de uma única decisão, com a peça ou função correspondente em foco.
3. **Prever:** escolher uma hipótese antes de ver o resultado; permitir justificar em linguagem simples.
4. **Experimentar:** mostrar efeito, unidade e evidência; manter a explicação acessível sem animação.
5. **Projetar a missão:** entrar no catálogo completo, usando a descoberta como ponto de partida.
6. **Operar e interpretar:** inspecionar os quatro segmentos e os eventos da própria tentativa.
7. **Explicar e revisar:** confrontar a previsão, localizar o limite e propor uma alteração.

Isso complementa as etapas existentes de necessidade, requisitos, projeto, verificação, operação e retorno. Não substitui a navegação do Cerrado por seis abas que ele não possui.

O miniexperimento implementado é uma atividade orientada com condições fixas, identificadas como exemplos independentes do projeto atual. `runLearningExperiment` chama os mesmos domínios do jogo, sem física paralela. A previsão vem antes da execução dos dois ensaios; o feedback compara a quantidade válida calculada.

A comparação A/B mantém o mesmo segundo na linha do tempo e mostra a nave configurada de cada ensaio, obtida de `trial.result.config`. A tabela identifica seus valores como finais, separadamente do instante inspecionado. O término antecipado conserva o último estado e não cria novas observações.

Abrir, prever e executar a prévia não alteram o projeto atual nem salvam uma missão no caderno. A ação explícita **Usar A/B como ponto de partida** entrega as escolhas ao projeto; pode copiar inclusive uma configuração que falha. O jogador ainda precisa justificar e executar sua própria tentativa. O feedback da missão completa deve usar esse resultado real, não a solução didática pré-escrita.

## 4. Três miniexperimentos implementados localmente

Os seis resultados abaixo foram reexecutados no domínio local em 15/11/2026. Não são ensaios de bibliotecas candidatas, GPU ou aprendizagem. O JSON desta pesquisa conserva as configurações e os resultados de referência. A chamada do novo `runLearningExperiment` também foi conferida para os seis resultados e para a separação entre registros recebidos e válidos.

### Experimento 1 — ÍNDICE resolve sozinho?

**Condições fixas:** Cerrado, contatos curtos, bateria 16 Wh, painel 18 W, rádio econômico, memória 1.536 Mbit e todos os contatos. Mudar somente o processamento.

**Previsão:** “Trocar BANDAS por ÍNDICE fará os seis registros chegarem com esta bateria?” Respostas possíveis podem separar “sim, basta reduzir os bits”, “a potência pode impedir o processamento” e “o rádio ficará automaticamente mais rápido”. A explicação deve ser mostrada depois da escolha.

| Alternativa | Registros válidos | Evidência verificada |
| --- | --- | --- |
| BANDAS | 2/6 | Recebe 460,8 Mbit; encerra com entrega insuficiente. |
| ÍNDICE, sem outras mudanças | 0/6 | `PEAK_POWER` aos 600 s; nenhum lote termina. |

Durante processamento, o painel fornece 18 × 0,55 = 9,9 W. A bateria precisa fornecer aproximadamente (38 − 9,9) / 0,95 = **29,58 W**, acima de seu limite de **20 W**. O problema é potência instantânea, não simplesmente quantidade de Wh disponível.

**Feedback:** “O lote ficou menor, mas a nave passou a exigir mais potência para produzi-lo.” **Reflexão:** “O que você mudaria primeiro, e qual evento esperaria deixar de ocorrer?” O aprofundamento pode testar a bateria de 24 Wh, cujo limite de descarga é 35 W, preservando a hipótese antes da nova execução.

### Experimento 2 — a mesma antena pode entregar mais?

**Condições fixas:** Bennu, lançador compacto, perfil próximo, três horas, câmera e energia ampliada. Mudar somente solo curto/ampliado.

**Previsão:** “Sem aumentar a taxa do rádio, ampliar a duração dos contatos pode mudar o retorno?” As alternativas devem diferenciar tempo disponível de velocidade e de quantidade produzida.

| Alternativa | Registros válidos | Bits recebidos |
| --- | --- | --- |
| Duas janelas de 120 s | 2/6; falha de entrega | 288.000.000 |
| Duas janelas de 500 s | 6/6; sucesso | 720.000.000 |

A taxa permanece **1,2 Mbit/s**. O caso curto fornece 240 s de serviço: 288 Mbit. Isso completa dois lotes de 120 Mbit e parte do terceiro. A opção ampliada oferece mais tempo; não cria observações extras nem aumenta a potência do rádio.

**Feedback:** “A fila teve mais tempo para sair durante os contatos.” **Reflexão:** “Qual registro estava completo no solo e qual ainda dependia da fila?” A vista deve manter a mesma antena e representar a agenda alterada. Não sugerir que uma antena visualmente maior foi comprada.

### Experimento 3 — seis arquivos são seis evidências válidas?

**Condições fixas:** telescópio, lançador científico, perfil distante, três horas, energia ampliada e contatos ampliados. Mudar somente câmera/espectrômetro.

**Previsão:** “Se os seis arquivos da câmera chegarem, a pergunta sobre as faixas estará respondida?” Uma resposta correta precisa relacionar variável e instrumento, não somente o tamanho do arquivo.

| Alternativa | Arquivos recebidos integralmente | Registros válidos para o objetivo | Resultado |
| --- | --- | --- | --- |
| Câmera | 6 | 0 | Inválido; `INSTRUMENT_MISMATCH` |
| Espectrômetro | 6 | 6 | Sucesso |

A câmera transmite **720 Mbit**; o espectrômetro, **1.080 Mbit**. O maior volume não é uma recompensa por si: decorre do instrumento escolhido. A arquitetura de referência consegue suportá-lo.

**Feedback:** “A entrega funcionou, mas a câmera não produziu o tipo de informação pedido.” **Reflexão:** “Que pergunta poderia ser respondida por uma câmera?” A interface deve distinguir **recebidos** de **válidos**; mostrar apenas “0/6” sem a causa esconderia a descoberta central.

O pico de energia do espectrômetro na configuração padrão permanece um aprofundamento útil. Ele mostra que instrumento correto e alimentação suficiente são condições diferentes, sem sobrecarregar o primeiro exercício com duas causas simultâneas.

## 5. Componentes, mecânicas e estados

| Componente da experiência | Estado comprovado na base R15 | Evolução R16 e estado local | Critério de aceite |
| --- | --- | --- | --- |
| Entrada por missão | Três histórias e destinos selecionáveis. | Seletor imersivo com pergunta, dados e aprendizado explícitos. | As três opções têm nome acessível e explicam a atividade antes de iniciar. |
| Nave configurável | Instrumento, energia, comunicação e montagem seguem escolhas. | Usar a peça selecionada para explicar o contraste didático. | Aparência corresponde ao catálogo; vista não altera cálculo. |
| Previsão | Hipótese e revisão prévia existem. | Implementada no módulo local: previsão por caso, execução de A/B e feedback calculado. | A resposta não aparece antes da previsão; erro não bloqueia aprender ou continuar. |
| Execução | Dois domínios separados, estados e eventos determinísticos. | Implementado: `runLearningExperiment` chama os domínios existentes. | Exemplos não sobrescrevem o projeto nem inventam novos resultados. |
| Operação | Quatro segmentos, linha do tempo e comparação A/B. | Implementada no módulo local: comparação A/B com relógio comum e nave de cada ensaio. | Evento, instante, unidade e significado aparecem juntos. |
| Pós-missão | Requisitos, registros e reflexão disponíveis. | Implementado no componente local: interpretação por caso, com integração à tentativa a verificar. | O texto usa a tentativa executada, inclusive resultados inválidos e parciais. |
| Equipe | Revisão local por até quatro pessoas. | Organizar discussão sobre previsão e evidência por papel. | Sem alegar contas, cooperação remota ou verificação de participação. |
| Acesso | Controles HTML, alternativa 2D e movimento reduzido. | Manter equivalência do miniexperimento sem 3D. | Conteúdo e resposta continuam utilizáveis por teclado e sem animação. |

“Implementado localmente” identifica código inspecionado; não substitui o aceite integrado da jornada. Os testes da R15 não certificam automaticamente a R16. O seletor, os pontos de aplicação no projeto e a reflexão da tentativa devem constar da verificação da rodada. A publicação é identificada pelo recibo, não pela existência deste plano.

## 6. Feedback que explica sem inventar uma causa

Uma explicação pós-missão precisa começar pelo resultado e pelo requisito relevante. Nas expedições, incompatibilidade estática, falha de potência e entrega insuficiente não são a mesma situação.

A proposta é apresentar: **o que foi pedido → o que ocorreu → qual evidência sustenta isso → o que vale testar depois**. Um evento pode indicar um recurso envolvido sem provar causa única. Quando várias escolhas mudam, o texto deve reconhecer que a comparação não isolou uma variável.

Três regras são essenciais:

- Separar quantidade produzida, quantidade transmitida, recepção completa e validade científica.
- Usar dados da tentativa executada. Editar o rascunho não muda retroativamente a explicação da execução anterior.
- Preservar a fronteira temporal. Ao voltar no tempo, não revelar na cena uma observação que só chegou depois; o relatório final deve permanecer identificado como final.

O objetivo é apoiar uma revisão justificada, não escrever uma conclusão ambiental ou astronômica que o modelo não mediu.

## 7. Oito oportunidades tecnológicas, com prioridade e limites

A consulta abaixo usou repositórios dos próprios projetos, documentação dos mantenedores e fontes NASA em **15/11/2026**. Não foram instaladas ou executadas as bibliotecas candidatas. Compatibilidade estrutural com Three/React não é prova de funcionamento na versão do Ipê.

| ID | Oportunidade | Decisão para o Ipê | Esforço se adotada |
| --- | --- | --- | --- |
| T01 | Three.js e inspeção de câmera | Reutilizar agora o que já existe. | Baixo a médio |
| T02 | Motionmaxxing / GSAP / Rive | Referência para comunicação; adoção posterior se necessária. | Médio |
| T03 | 3DTilesRendererJS | Adiar até existir atividade que precise de terreno/tileset. | Alto |
| T04 | three-geospatial | Adiar até justificar atmosfera e custo gráfico. | Alto |
| T05 | satellite.js | Experimento orbital separado e versionado, se necessário. | Alto |
| T06 | Astronomy Engine | Futuro exercício de orientação celeste. | Médio a alto |
| T07 | Open MCT / Astro UXDS | Estudar padrões; manter a interface didática atual. | Baixo para estudo; alto para migração |
| T08 | Assets NASA / CC0 | Reutilizar o acervo local com procedência. | Baixo para reuso; médio para novos itens |

### T01 — interatividade de câmera com a base existente

[OrbitControls](https://threejs.org/docs/pages/OrbitControls.html) oferece órbita de câmera, zoom e pan. É uma opção do ecossistema Three.js, não um propagador orbital. O Ipê já possui giro, enquadramento por inspeção e montagem separada; isso não significa que OrbitControls esteja integrado.

A melhoria imediata é orientar a câmera para o componente relevante e manter um comando claro para voltar. Reutilizar os mecanismos existentes evita introduzir outra forma de interação sem necessidade. Se um controle adicional for escolhido, precisa respeitar toque, teclado, movimento reduzido e leitura das informações. A câmera não deve se mover autonomamente enquanto a pessoa tenta comparar números.

### T02 — motionmaxxing é para filmes; uma interface precisa esperar o jogador

[Motionmaxxing](https://github.com/Tejashmakwana/motionmaxxing) se apresenta como skill de produção de filmes, peças de marca e motion graphics. Pode ajudar a planejar um convite ou uma explicação curta. Não é biblioteca de câmera interativa nem motor científico. Seus critérios de ritmo e movimento pertencem à produção audiovisual; aplicá-los como obrigação de movimento contínuo no jogo prejudicaria o tempo de observação e escolha. As comparações visuais descritas pelo autor não medem aprendizagem.

[GSAP](https://gsap.com/docs/v3/) organiza animações e sequências; possui [licença própria](https://gsap.com/community/standard-license/), que não deve ser chamada de MIT ou CC0. [Rive](https://rive.app/features) oferece interação e ligação de dados, mas editor, runtime e arquivos artísticos são coisas distintas. Sua adoção precisaria de um contrato de estado e revisão dos recursos realmente usados. Nesta rodada, CSS, React e Three já atendem ao percurso proposto.

### T03 — 3D Tiles precisa de dados e de uma pergunta geográfica

[NASA-AMMOS/3DTilesRendererJS](https://github.com/NASA-AMMOS/3DTilesRendererJS) renderiza o formato 3D Tiles e oferece integrações e plugins. Não entrega automaticamente o terreno adequado à missão. Alguns exemplos usam provedores com chave e condições próprias; cache e nível de detalhe precisam de orçamento.

A oportunidade futura seria comparar relevo ou cobertura em uma atividade que dependa de geografia. Antes de instalar: escolher um tileset, documentar origem/escala/condições, limitar download e medir memória no aparelho alvo. Os três casos atuais não precisam de streaming de terreno para ensinar potência, entrega e instrumento.

### T04 — atmosfera visual não substitui o ambiente do modelo

[three-geospatial](https://github.com/takram-design-engineering/three-geospatial) oferece módulos de renderização e se integra a outros projetos. O README consultado classifica módulos como alpha/beta e descreve uma transição de API ligada a WebGPU. Isso exige fixar versão e testar o backend, não presumir compatibilidade por usar Three.js.

Atmosfera ou nuvens só devem entrar se ajudarem uma pergunta explícita. Nuvens renderizadas não são QA de MODIS; iluminação visual não deve passar a decidir o balanço elétrico. O ganho precisa justificar GPU, manutenção e alternativa sem o efeito.

### T05 — satellite.js já calcula sombra, mas não certifica uma missão

[satellite.js](https://github.com/shashwatak/satellite-js) propaga TLE/OMM e fornece transformações. A documentação atual inclui [Sun & Shadow](https://shashwatak.github.io/satellite-js/docs/sun-and-shadow), com `sunPos` e `shadowFraction`. Portanto, afirmar que a biblioteca não calcula sombra seria incorreto. O cálculo documentado trata a Terra como esfera e exige posições/unidades coerentes.

Isso não torna eclipse observado ou contato operacional certos. Para janelas terrestres, ainda é preciso definir elementos e época, estação, máscara de elevação, critérios temporais e testes. Visibilidade geométrica não garante disponibilidade da antena nem enlace RF. A oportunidade é uma prova separada de geometria terrestre; não substituir silenciosamente as agendas didáticas nem aplicar esse fluxo a uma transferência para Bennu/L2.

### T06 — Astronomy Engine orienta fenômenos; não navega uma sonda

[Astronomy Engine](https://github.com/cosinekitty/astronomy) calcula posições, eventos e transformações astronômicas, incluindo uma implementação JavaScript. O próprio autor explica que sua meta de precisão não é adequada à navegação de sondas.

Um uso futuro seria relacionar observador, data e direção de uma observação. Não forneceria desempenho Webb, espectros reais ou trajetória do telescópio fictício. Qualquer resultado precisaria de referência temporal visível e validação independente. O exercício instrumental atual já funciona sem essa dependência.

### T07 — Open MCT e Astro UXDS são referências de operação, não o jogo pronto

[Open MCT](https://github.com/nasa/openmct) é um framework NASA de visualização de dados, extensível por plugins. Pode inspirar contexto temporal, inspeção de séries e estados. Não fornece automaticamente o motor do Ipê, telemetria de uma missão específica ou colaboração remota.

[Astro UXDS](https://github.com/RocketCommunicationsInc/astro) reúne padrões e componentes de interfaces espaciais; não é o framework web Astro. O [arquivo de licença do repositório](https://raw.githubusercontent.com/RocketCommunicationsInc/astro/master/LICENSE) possui condições próprias, incluindo aviso de copyright na redistribuição. Não presumir que essa licença cobre qualquer linha Nova: a [página de termos Nova](https://www.astrouxds.com/license-agreement) não forneceu texto integral legível nesta consulta.

A aplicação imediata é estudar clareza de unidades, alerta e horário do dado. Migrar a interface inteira acrescentaria outro sistema para manter sem resolver o principal problema didático.

### T08 — NASA e CC0 exigem procedência por item

[NASA 3D Resources](https://science.nasa.gov/3d-resources/) é uma fonte de modelos; as [diretrizes de mídia NASA](https://www.nasa.gov/nasa-brand-center/images-and-media/) distinguem usos e materiais de terceiros. Não é correto declarar toda imagem, marca ou arquivo NASA como CC0 ou irrestrito. Os créditos de cada item precisam acompanhar a decisão de uso.

[Poly Haven](https://polyhaven.com/license) declara CC0 para seus assets, mas isso não transfere a mesma condição a qualquer site, ferramenta ou arquivo externo. Uma textura ilustrativa continua sendo ilustração, não medição do Cerrado ou de Bennu.

O Ipê já possui quatro GLBs oficiais auditados. Reutilizá-los e explicar suas funções tem prioridade. Só incorporar outro asset se ele resolver uma necessidade concreta; registrar página, crédito, condição, tamanho, hash e transformação. O logo NASA não deve virar identidade do projeto.

## 8. Critérios de aceite pedagógico e técnico

A primeira verificação é de comportamento observável, sem presumir eficácia educacional:

1. A pessoa identifica, no seletor, a pergunta e a origem dos dados de cada caso.
2. Cada miniexperimento pede previsão antes de revelar explicação; errar permite continuar e revisar.
3. O contraste muda somente a decisão declarada. As demais condições ficam disponíveis para consulta.
4. O feedback mostra unidade, evento ou contagem que sustenta a conclusão. Bits recebidos e registros válidos não são fundidos.
5. A atividade funciona em 2D/texto, teclado e movimento reduzido. A animação não avança escolhas nem responde pelo jogador.
6. A explicação pós-missão usa a configuração executada e não muda quando o rascunho é editado.
7. Os resultados de referência dos três casos permanecem iguais; não há mudança silenciosa do catálogo para favorecer uma narrativa.
8. O recibo separa teste de domínio, interface, observação em navegador e publicação. Aprendizagem e desempenho físico precisam de ensaios próprios.

Um piloto pode pedir quatro respostas curtas: “qual era o requisito?”, “qual evidência você usou?”, “por que a escolha alterou o resultado?” e “o que não é possível concluir?”. A comparação dessas respostas antes/depois oferece material de avaliação formativa. Não é uma alegação antecipada de ganho educacional, e não exige coletar nomes ou dados pessoais.

## 9. Fontes locais e fronteira desta entrega

A base foi conferida em [catálogo do Cerrado](https://github.com/oalexandrebelo/PROJETO-IPE/blob/main/experiments/mission-design-lab/src/core/catalog.ts), [motor do Cerrado](https://github.com/oalexandrebelo/PROJETO-IPE/blob/main/experiments/mission-design-lab/src/core/engine.ts), [domínio das expedições](https://github.com/oalexandrebelo/PROJETO-IPE/blob/main/experiments/mission-design-lab/src/lab/scientific-expeditions.ts), [cena 3D](https://github.com/oalexandrebelo/PROJETO-IPE/blob/main/experiments/mission-design-lab/src/ui/OrbitalScene.tsx), [miniexperimentos](https://github.com/oalexandrebelo/PROJETO-IPE/blob/main/experiments/mission-design-lab/src/lab/mission-curriculum.ts), [interação didática](https://github.com/oalexandrebelo/PROJETO-IPE/blob/main/experiments/mission-design-lab/src/ui/MissionLearning.tsx) e [dependências do laboratório](https://github.com/oalexandrebelo/PROJETO-IPE/blob/main/experiments/mission-design-lab/package.json). A consulta encontrou React, Three, R3F e Drei já presentes.

Esta pesquisa produziu documentação e um catálogo JSON. Não instalou dependências, não importou terrenos, não executou prompts dos repositórios consultados e não publicou arquivos. Os exemplos numéricos foram calculados pelos domínios existentes; as tecnologias candidatas não foram submetidas a ensaios de integração. A implementação R16 precisa registrar seu próprio aceite e recibo, preservando os limites científicos e a cooperação local.
