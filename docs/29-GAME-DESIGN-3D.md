# 29 — Game Design: a missão termina quando a ciência chega

**Implementação R14:** a [entrega das três missões](31-TRES-MISSOES-CIENTIFICAS-R14.md) concretiza a reprodução temporal na cena, os quatro segmentos, Bennu/Telescópio com narrativa e revisão de equipe local. [Quatro modelos NASA](30-ATIVOS-NASA-IMPLEMENTADOS.md) foram integrados como referências. As cinco cenas e demais ideias abaixo conservam o desenho original R13; nem toda proposta virou funcionalidade.


**Revisão R13 · 14/11/2026 · proposta de evolução sobre o beta 0.4.0-beta.2.**

[Explorar a proposta interativa](https://projeto-ipe.vercel.app/game-design.html) · [Jogar a base atual](https://projeto-ipe.vercel.app/lab/index.html) · [Acervo NASA 3D](28-OPORTUNIDADES-NASA-3D.md) · [Handoff da dupla](25-HANDOFF-DOIS-DEVS.md).

## 1. Proposta e diferencial

**PROJETO IPÊ é um jogo de engenharia de missões em que você constrói uma nave para responder a uma pergunta científica, acompanha o caminho dos dados e redesenha a missão quando a ciência não chega.**

O propósito vem antes da peça. A pergunta inicial é sobre vegetação do Cerrado; o jogador precisa entregar seis registros históricos válidos, respeitando os limites do projeto. A experiência desejada conecta cinco cenas 3D: uma mesa científica, o hangar, a integração ao lançamento, a órbita e a estação de recepção. O mesmo registro acompanha essa viagem: pedido, processado, armazenado, recebido e validado.

O diferencial proposto é a **revisão causal da missão**. Ao encontrar uma falha, o jogador volta ao instante relevante, vê qual componente e recurso estavam envolvidos, declara uma hipótese, altera uma escolha e compara a nova tentativa. A cena mostra a evidência produzida pelo motor. Cada tentativa conserva seu projeto e suas entradas.

Essa combinação é uma hipótese de diferenciação do Ipê, ainda a avaliar com jogadores; não é uma alegação de novidade mundial. Uma animação convincente ajuda a compreender, mas não comprova que uma missão é viável.

## 2. O que já existe e o que esta revisão propõe

| Capacidade | Base implementada | Próxima evolução proposta |
|---|---|---|
| Ciência | Seis registros Terra/MODIS históricos, validação e retorno científico | Mesa de descoberta 3D com os mesmos registros e suas limitações |
| Projeto | Seis escolhas binárias, 64 configurações por cenário | Inspeção de peças com requisito, unidade e efeito esperado |
| 3D | Terra conceitual, CubeSat configurável, vistas de câmera e alternativa SVG 2D | Seleção de subsistemas, vista explodida e cena guiada pelo resultado |
| Operação | Motor determinístico, diário de eventos, energia, memória e contatos | Linha do tempo que destaca restrições observadas e recursos envolvidos na nave e no solo |
| Redesign | Hipótese, execução, comparação, busca de alternativas e replay | Comparação visual A/B sincronizada pelo mesmo instante da missão |
| Lançamento | Limites didáticos de massa/custo; não há veículo selecionável | Explicação visual da integração e, em etapa posterior, contrato próprio de lançamento |
| Recursos NASA | Registros científicos, referências e seis fotografias locais | Curadoria de modelos e texturas com procedência; adoção por ativo |

A página interativa desta revisão é um **estudo de experiência**, com esquemas SVG e comparação qualitativa. Ela não implementa as cinco novas cenas, não altera a pontuação e não executa GMAT. O jogo atual continua sendo a referência para resultados numéricos.

## 3. Quatro segmentos, uma cadeia de decisões

A apresentação NASA [Design and Develop Science Missions](https://ntrs.nasa.gov/citations/20250002492) orienta a leitura da missão como um sistema completo. A aplicação abaixo é uma proposta de game design do Ipê.

| Segmento | Pergunta do jogador | Interação 3D desejada | Consequência verificável |
|---|---|---|---|
| Usuário científico | Que evidência preciso receber? | Selecionar um registro na mesa do Cerrado e ler sua procedência | Só registros integralmente recebidos e válidos contribuem para o objetivo |
| Espaço | Que nave consegue executar o plano? | Inspecionar painel, bateria, processamento, memória e rádio no hangar | Alterações usam os totais e resultados do motor existente |
| Lançamento | Este projeto cabe no envelope da missão? | Inspecionar o satélite no volume de integração; confirmar requisitos antes da transição | Na primeira entrega, usar apenas limites já modelados; escolha de lançador requer novos dados e regras |
| Solo | Como a ciência chega às pessoas? | Ver contato disponível, fila e recepção dos registros | A estação apresenta os contatos didáticos e os bits recebidos; não reserva uma antena real |

O segmento de usuário abre e fecha a experiência. Não basta mostrar um foguete decolando: o jogador deve terminar capaz de explicar o que foi recebido e por que uma mudança ajudou ou prejudicou a missão.

## 4. Jornada de uma partida

1. **Entender.** Um pedido científico apresenta a pergunta, os seis registros e o critério de sucesso. Um exemplo mostra a diferença entre arquivo recebido e evidência válida.
2. **Construir.** No hangar, escolher componentes por botões e fichas; a geometria acompanha a configuração. Inspecionar uma peça revela W, Wh, capacidade ou taxa com unidade explícita.
3. **Prever.** Registrar a hipótese antes da execução. O pré-voo aponta restrições, sem revelar automaticamente a solução.
4. **Preparar o lançamento.** Mostrar a checagem de integração e a transição para a missão. No primeiro recorte, esta etapa é uma representação dos requisitos existentes, sem física de subida inventada.
5. **Executar.** Assistir ou avançar por eventos. Pausar, voltar e escolher um instante não recalculam a missão nem mudam seu resultado.
6. **Investigar.** Selecionar um evento de perda ou atraso e seguir o registro entre processamento, memória e recepção. Texto e diagrama apresentam a mesma restrição observada; a comparação ajuda a investigar a hipótese causal.
7. **Redesenhar e comparar.** Alterar preferencialmente uma escolha, formular nova hipótese e executar outra tentativa. Comparar ciência válida e margens de recursos sob o mesmo cenário.

Meta de produto para uma demonstração: tornar esse ciclo legível em poucos minutos, sem exigir domínio prévio de astrodinâmica. O tempo real de uso deve ser medido; não está estabelecido nesta revisão.

## 5. Onde o 3D tem função

| Cena proposta | O que o jogador deve perceber | Reuso e fonte | Primeira entrega |
|---|---|---|---|
| Mesa científica | Os registros têm local, data, qualidade e origem | Dados MOD13Q1 preservados; fotografia NASA como contexto | Globo com pontos e ficha fora do canvas; nenhuma superfície inventada como medição |
| Hangar | Cada peça tem uma função e compromissos | CubeSat procedural existente; CubeSat 101 e estado da arte como referências | Foco por subsistema e configuração visível; vista explodida opcional |
| Integração/lançamento | Restrições precisam ser atendidas antes da partida | Envelope didático existente; modelos NASA selecionados no catálogo | Breve cena de integração com botão para pular |
| Órbita operacional | O tempo e os recursos limitam a missão | Cena R3F existente, eventos e séries do motor | Pausa/seleção de evento e estados de energia, processamento e memória |
| Recepção e descoberta | Transmitir, receber e validar são etapas diferentes | Contatos simulados e retorno científico existente | Destaque da estação e do registro que chega; retorno à mesa científica |

O objetivo é usar 3D em toda a **experiência espacial**, mantendo leitura, unidades, fontes e decisões acessíveis em HTML. O usuário pode completar a partida com teclado e representação 2D. Evitar textos pequenos presos ao modelo, decisões dependentes de arrastar ou informação transmitida somente por cor.

Cada cena deve oferecer uma câmera inicial útil, seleção por botões, reposição da câmera, pausa e preferência por movimento reduzido. Não executar vários canvases pesados em paralelo: a comparação pode reutilizar uma cena com alternância A/B e gráficos comuns.

### Linguagem visual

Manter a identidade Ipê: cobre para construção, azul para comunicação, papel claro para estudo e fundo espacial para operação. A marca vetorial permanece sem caixa no cabeçalho claro. Bricolage Grotesque organiza títulos e Plus Jakarta Sans sustenta leitura e controles, com arquivos locais. As fotografias têm legenda e crédito; um modelo de uma missão NASA aparece identificado como referência, não como projeto original do Ipê.

Os modos de visualização devem informar sua fidelidade: **conceitual**, **resultado do motor didático** ou **trajetória de referência importada**. São camadas distintas. A aparência realista de um GLB não fornece massa, potência, trajetória ou desempenho de engenharia.

## 6. Mecânicas e equilíbrio

**Condição atual de sucesso:** seis registros válidos e atendimento às restrições da missão. Preservar esse contrato; não acrescentar um score secreto ou pontuação calculada na cena.

**Conflitos produtivos:** capacidade versus massa/custo, transmissão versus disponibilidade de energia, processamento versus volume de dados, memória versus duração do contato. A explicação precisa vir dos eventos registrados e das unidades corretas; não concluir causalidade apenas porque dois indicadores mudaram juntos.

**Progressão sugerida:** primeiro aprender a cadeia de dados no cenário de contatos longos; depois enfrentar contatos curtos; por fim comparar projetos. Semente e Raízes podem nomear esses percursos já fundamentados. Campanhas sobre tempestades solares, asteroides e telescópios são expansões com objetivos próprios, posteriores ao ciclo completo do Cerrado.

**Ajuda gradual:** começar com uma pergunta orientadora; depois indicar um evento; só então oferecer uma alternativa explicada pelo motor. Registrar se a comparação usou ajuda, sem apresentar esse registro como certificado de aprendizagem.

**Sem sorte oculta no recorte inicial:** o cenário e as entradas ficam conhecidos e preservados. Eventos solares futuros devem usar snapshot identificado, regras explícitas e possibilidade de repetir a partida.

## 7. Ferramentas NASA como oportunidade concreta

| Recurso oficial | Uso recomendado no Ipê | Limite e prioridade |
|---|---|---|
| [NASA 3D Resources](https://science.nasa.gov/3d-resources/) | Modelos, texturas e referências para cenas; catálogo com URLs, créditos, formato e tamanho | P0: curar ativos da missão escolhida. Download gratuito não equivale a licença genérica para qualquer marca ou conteúdo terceiro |
| [CubeSat 101](https://www.nasa.gov/wp-content/uploads/2017/03/nasa_csli_cubesat_101_508.pdf) | Dar contexto às fichas e ao percurso conceito–integração–operação | P0: conteúdo educativo; não usar medidas de um modelo visual como requisitos reais |
| [Mission Design Lab](https://etd.gsfc.nasa.gov/capabilities/integrated-design-center/mission-design-lab) | Inspirar revisões de conceito e comparação de alternativas | P0: método de trabalho; não é API nem serviço integrado ao jogo |
| [CMLs no Mission Design Center](https://www.nasa.gov/ames-engineering/spaceflight-division/mission-design-center/about-our-studies/) | Organizar o estudo: ideia, viabilidade inicial, alternativas e projeto de referência | P0: progressão didática inspirada nos níveis iniciais; não emitir classificação CML oficial |
| [NASA Mission Viz](https://github.com/nasa/mission-viz) | Estudar exemplos e tutoriais de representação orbital | P1: referência de visualização; não pressupor um endpoint de trajetórias prontas |
| [GMAT](https://software.nasa.gov/software/GSC-19640-1) | Gerar uma trajetória de referência fora do navegador e comparar com o modelo didático | P1: software de análise, não API REST de tempo real. Executar e validar antes de anunciar integração |
| [Build It Yourself / Scope It Out](https://science.nasa.gov/mission/webb/game-scope-it-out/) | Aprender como objetivos científicos restringem instrumentos e óptica | P1: estudar progressão; não copiar arte, código ou toda a estrutura do jogo |
| [SPICE e ferramentas de missão](https://www.nasa.gov/smallsat-institute/space-mission-design-tools/) | Futuras geometrias e orientação com kernels e referenciais declarados | P2: exige contrato de época, unidade, referencial e procedência |
| [JPL Mission Design](https://ssd-api.jpl.nasa.gov/doc/mdesign.html), Horizons e SBDB | Campanha futura de pequenos corpos com decisões de janela e energia | P2: escopo próprio; Mission Design não é um projetista universal para todos os planetas |
| [DONKI](https://ccmc.gsfc.nasa.gov/tools/DONKI/) | Desafio futuro com evento solar histórico e escolha de proteção/segurança | P2: transformar ocorrência em mecânica exige um modelo explícito; registro de CME não prova dano a uma nave |

As descrições da página do desafio enviadas pelo usuário foram usadas como briefing. O endereço oficial do desafio não pôde ser lido integralmente nesta consulta; as fontes acima foram procuradas individualmente. Recursos encontrados não confirmam inscrição, elegibilidade nem situação atual do evento.

## 8. Contrato entre simulação, cena e dados

O motor existente continua sendo a única fonte de resultados. A futura camada de apresentação recebe configuração preservada, cenário, resultado e instante selecionado. Ela deriva qual peça destacar e qual restrição e recurso explicar; não substitui equações ou cria eventos de sucesso.

A inspeção do código encontrou um ponto de integração preciso: `MissionControl.tsx` já reproduz a série `trace`; `Scene.tsx` aparece no briefing e no hangar, e seus consumidores atuais não passam o progresso da missão. O canvas também não aceita seleção direta de peças. Portanto, o primeiro ganho é conectar esses estados existentes, antes de acrescentar uma nova simulação.

Para o replay visual, Dev A deve primeiro definir um mapeamento dos campos existentes de resultado para tempo, eventos, energia, memória, transmissão e validação. Dev B implementa a cena sobre esse contrato. Se um estado não está registrado ou não pode ser derivado com fidelidade, a interface mostra ausência de informação.

Casos de aceite do adaptador: no eclipse, geração e bateria refletem o estado registrado; o enlace aparece apenas durante transmissão efetiva; um registro parcial continua incompleto ao fechar o contato; o par científico só fica disponível após as duas entregas válidas. Ao voltar na linha do tempo, não antecipar dados ou eventos futuros. Usar estados discretos do motor e identificar qualquer interpolação apenas visual.

A comparação A/B sincroniza por `timeS`, nunca pelo índice da `trace`: tentativas podem ter fronteiras temporais diferentes. O adaptador deve documentar se apresenta o estado anterior ou posterior à transição e conservar todos os eventos daquele horário. `appendTrace` substitui pontos com tempo igual, enquanto `events` pode manter vários eventos; uma amostra não deve apagar essa sequência.

Trajetórias GMAT/SPICE futuras precisam declarar: ferramenta e versão, arquivo de entrada, época, unidade, referencial, passo temporal, hipóteses e hash. O consumidor rejeita unidades ou referenciais incompatíveis. Interpolação visual deve ser identificada e não alimentar regras de missão sem validação específica.

APIs externas entram por coleta controlada, com cache e snapshots; chaves ficam fora do cliente. A missão demonstrada deve funcionar com os dados locais publicados. Antes de prometer operação offline, testar também a recarga e o primeiro acesso sem rede.

## 9. Ativos 3D e desempenho

Usar o [catálogo curado](28-OPORTUNIDADES-NASA-3D.md), sem importar o acervo inteiro. Priorizar Earth/terreno como contexto e nave procedural como projeto interativo. Uma antena de espaço profundo é referência de uma expansão; não substituir a estação didática LEO pela DSN como se fossem equivalentes.

Para cada ativo adotado: guardar URL oficial, autoria, condições de uso, arquivo original, data de obtenção, hash, tamanho, e registrar alterações de materiais/escala/geometria. Modelos STL voltados à impressão podem precisar de conversão, materiais e redução de geometria; não supor que todos são GLB prontos para web.

Metas propostas, ainda não medidas: cena essencial sob demanda; até 5 MB adicionais comprimidos para o primeiro pacote 3D; texturas iniciais até 2K; resolução de renderização limitada conforme dispositivo; tentar 30 quadros/s estáveis no dispositivo móvel escolhido para ensaio. Se a medição falhar, reduzir geometria/textura/efeitos e manter alternativa 2D. Um limite de bytes não garante fluidez.

Evitar pós-processamento e partículas sem função de leitura. Suspender renderização contínua quando não houver movimento ou quando a cena estiver fora de vista. Preservar geometria procedural para partes que mudam com as escolhas; não trocar um hangar funcional por uma nave pronta e indivisível.

## 10. Plano para dois desenvolvedores

Sequência por entregas, sem inventar prazo ou velocidade da dupla. Antes de iniciar, ambos confirmam o commit-base, um responsável por arquivo compartilhado e o cenário de demonstração.

| Entrega | Dev A — domínio e evidência | Dev B — 3D e experiência | Aceite para integrar |
|---|---|---|---|
| E0 — referência | Reproduzir resultados longo/curto/redesign e congelar entradas | Reproduzir navegação, hangar e alternativa 2D | Mesma versão e casos de referência, sem alteração de resultado |
| E1 — uma causa visível | Mapear um evento real e seus recursos; documentar o contrato | Selecionar o evento, focar a peça e mostrar causa/unidade | Evento e números iguais ao motor; teclado e 2D equivalentes |
| E2 — redesign visível | Preservar tentativas e calcular comparação A/B no mesmo cenário | Alternar duas configurações e destacar a diferença | A cena nunca apresenta resultado antigo como projeto novo |
| E3 — missão completa | Revisar requisitos e estado de cada registro | Integrar mesa, hangar, transição de lançamento, órbita e solo | Cadeia completa; cenas propostas identificadas até serem implementadas |
| E4 — um ativo NASA | Verificar procedência e consistência do recurso adotado | Otimizar e integrar o ativo, medir dispositivo alvo | Crédito, tamanho, fallback e ausência de regressão documentados |
| E5 — apresentação | Conferir fatos, hipóteses e resultados da demonstração | Ensaiar roteiro e observar jogadores | Uma pessoa explica a causa da falha e a melhoria; relatar achados sem generalizar |

Na primeira rodada, concluir E0–E2 antes de ampliar o número de cenas. Isso entrega um diferencial observável sobre a base atual. E3–E4 ampliam presença espacial com o contrato estável. GMAT e novas campanhas entram depois da demonstração completa; não bloqueiam o núcleo educativo.

Arquivos: Dev A assume `experiments/mission-design-lab/src/core/`, `src/lab/` e testes de domínio; Dev B assume `src/ui/`, `src/ui/OrbitalScene.tsx`, `src/ui/Scene.tsx`, estilos, testes de interface e ativos. `src/App.tsx`, contratos e versão têm um editor por vez. Consultar o [handoff](25-HANDOFF-DOIS-DEVS.md) para o mapa completo.

## 11. Critérios de avaliação e roteiro de apresentação

1. O jogador identifica o objetivo científico antes de escolher peças.
2. Uma escolha muda a configuração visual e a ficha correta, sem resultado paralelo.
3. Uma falha é explicada por evento e unidade, com caminho do registro visível.
4. Uma nova tentativa usa sua própria hipótese e suas próprias entradas.
5. A comparação mantém ciência válida, restrições e origem dos dados legíveis.
6. O percurso essencial funciona por teclado, sem arrastar o canvas e com alternativa 2D.
7. Ativos NASA têm crédito e função pedagógica; limites do modelo estão próximos da visualização.

**Pitch proposto:** “Projetar uma missão é fazer a ciência chegar. No Ipê, você constrói um CubeSat, acompanha os dados do Cerrado e descobre por que uma escolha falhou. Volta à evidência, muda o projeto e vê a diferença. O espaço em 3D torna visível a engenharia que conecta uma pergunta científica à sua resposta.”

Na demonstração, mostrar objetivo → projeto → falha explicada → uma mudança → resultado comparado → dado com procedência. Usar somente casos reproduzidos na versão apresentada. A revisão R13 publica esta especificação e seu estudo interativo; o aceite das novas mecânicas depende das próximas entregas e de verificações próprias.
