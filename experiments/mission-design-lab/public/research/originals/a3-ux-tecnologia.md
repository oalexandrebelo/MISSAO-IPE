# A3 — UX, acessibilidade, stack e repositórios para Missão Ipê

Pesquisa concluída em 14/11/2026. Escopo: referências primárias NN/g, W3C, documentação oficial e repositórios indicados. Avaliação documental: os projetos externos não foram instalados, executados ou auditados numericamente nesta frente.

**Recomendação:** construir a nova experiência em Vite + React + TypeScript, com React Three Fiber para Terra e satélite, sobre o motor determinístico existente. A campanha Cerrado/LEO precisa primeiro de decisões legíveis, orçamento visível, diagnóstico contextual e comparação de tentativas. Não precisa adotar uma nova biblioteca de efemérides ou um simulador científico externo para justificar o 3D. Expansão lunar deve ser um módulo posterior com hipóteses e modelos próprios.

Contexto informado pela coordenação, não revalidado nesta frente: repositório AB-NASA-TEAM-IPE; motor com 64 combinações, duas agendas didáticas e seis registros históricos NDVI Terra/MODIS. A arquitetura proposta preserva esse motor e trata a interface como consumidora dos seus resultados. Não apresentar a visualização como órbita calculada ou cobertura real se o motor ainda não produzir essa informação.

## 1. Evidência de UX e aplicação concreta

NN/g descreve as heurísticas como princípios gerais, não uma especificação pronta. São especialmente relevantes visibilidade de estado, correspondência com a linguagem do usuário, controle e liberdade, prevenção de erros, reconhecimento e recuperação. A divulgação progressiva recomenda expor as escolhas principais e oferecer parâmetros especializados sob demanda. A orientação de onboarding favorece ajuda contextual recuperável em vez de depender de uma apresentação inicial que o usuário precisa memorizar. Mensagens de erro devem ser visíveis, construtivas e preservar o trabalho. [S01–S04]

As decisões abaixo são uma **proposta de produto aplicada a esses princípios**, não recomendações literais da NN/g nem resultados de teste com o público da Missão Ipê.

| Momento | Interface recomendada | Comportamento verificável |
|---|---|---|
| Briefing | Uma missão com objetivo em linguagem comum: observar o Cerrado e cumprir as condições científicas disponíveis no cenário. Mostrar prazo, orçamento, critérios de sucesso e a procedência dos dados. | O jogador consegue dizer o que precisa entregar e quais limites existem antes de entrar no hangar. |
| Hangar | Satélite 3D central; catálogo de componentes em DOM; painel de engenharia ao lado. Seleção do componente destaca a peça e abre sua ficha. | Toda operação 3D também existe em botão, lista ou campo. O clique seleciona; rotação da câmera não instala componentes acidentalmente. |
| Orçamento | Barra fixa com gasto, limite e saldo; detalhamento acionável por categoria. No celular, o orçamento permanece fixo sem cobrir os botões. | Alterar uma escolha atualiza o saldo imediatamente e comunica a diferença. Valores numéricos e rótulos acompanham as cores. |
| Trade-offs | A ficha apresenta efeito sobre massa, energia, armazenamento, comunicação e resultado científico, apenas quando essas relações existirem no motor. | Antes de substituir uma peça: valor atual, valor proposto e consequência. Nenhum benefício é sugerido se o modelo não o calcula. |
| Planejamento | Agenda com blocos de observar, transmitir e recarregar, seguindo as duas agendas já suportadas. Um resumo explica por que as fases competem pelo mesmo recurso. | O usuário vê a escolha ativa, as restrições e o efeito previsto sem abrir uma enciclopédia. |
| Validação | Problema junto da escolha responsável, com valor encontrado, limite e ação de correção. | “Armazenamento insuficiente: reveja a agenda ou escolha mais capacidade” só aparece se a causa for sustentada pelo motor. Um erro técnico é distinguido de missão inviável. |
| Simulação | Iniciar, pausar, avançar para o próximo evento e rever etapas; indicador de tempo simulado separado da velocidade de reprodução. | Nenhuma decisão é exigida contra um cronômetro real. Pausar a animação não altera o resultado da execução. |
| Debrief | Resultado geral, objetivos cumpridos, gargalo principal e evidências. Abrir o evento onde surgiu a restrição. | O texto aponta configuração → mecanismo modelado → efeito. Se o motor não provar a relação, usar “associado nesta execução”, não “causou”. |
| Comparação | Duas tentativas com escolhas alteradas e diferenças de custo, restrições e resultado científico. Ação “usar esta configuração”. | Comparar o mesmo cenário e versão do modelo; registrar parâmetros e semente quando houver aleatoriedade. Evitar “melhor” sem declarar o critério. |

O catálogo deve ajudar a reconhecer peças: nome curto, imagem ou miniatura, função e duas ou três características decisivas. Unidades, definição de siglas e modelo físico ficam em “Entender este cálculo”. Evitar tooltips como único acesso a instruções essenciais, pois precisam funcionar em toque e teclado.

Não transformar toda margem pequena em bloqueio. Separar **configuração inválida**, **restrição operacional violada**, **alerta de margem** e **oportunidade de melhoria**. Um modo de diagnóstico pode permitir simular um projeto inviável para aprender com ele; a interface deve explicar a condição antes de iniciar. Se um botão ficar indisponível, a razão e o caminho de correção permanecem visíveis.

## 2. Tutorial, ritmo e aprendizado

Proposta de primeira experiência: tutorial opcional e retomável com quatro tarefas reais — selecionar uma peça, observar uma mudança no orçamento, escolher a agenda e simular. Exibir uma dica no ponto da ação; permitir fechar e consultar novamente. A ajuda acompanha o trabalho, sem exigir lembrar uma sequência de telas. Essa escolha aplica a orientação contextual da NN/g. [S03]

Começar o hangar sem giro automático de câmera. Oferecer vistas “Geral”, “Instrumento” e “Energia”, além de “Recentrar câmera”. Manter “Reiniciar missão” visualmente separado; reiniciar câmera não apaga configurações. O histórico permite desfazer uma troca e duplicar uma tentativa. Acelerações de reprodução precisam ter rótulo explícito, por exemplo “1 segundo da interface representa X minutos da missão”, conforme o modelo.

O debrief pode convidar: “Qual mudança você faria primeiro?” antes de mostrar a sugestão. A sugestão deve ser produzida por regras do modelo e incluir o custo da alternativa. Não gerar uma nota de engenharia única que esconda objetivos incompatíveis: custo menor, margem maior e mais ciência podem apontar para soluções diferentes. Um painel com três indicadores e seus critérios explica melhor o compromisso.

Para os dados Terra/MODIS, distinguir **observação histórica usada no desafio**, **resultado calculado pelo jogo** e **representação ilustrativa**. Uma imagem bonita da Terra não valida previsão de NDVI, resolução de um instrumento ou cobertura de um satélite fictício. Rótulos de fonte e data pertencem à ficha de evidência e ao relatório.

## 3. Acessibilidade como parte da interface principal

Meta proposta: atender WCAG 2.2 AA; ainda depende de auditoria da implementação. A redução de animações por interação é uma recomendação adicional alinhada ao critério 2.3.3, que é AAA — não confundir seu nível com AA. [S05–S12]

| Requisito | Implementação proposta | Referência |
|---|---|---|
| Teclado | Fluxo completo por Tab, Enter, Espaço e controles nativos; foco visível; nenhuma armadilha no canvas ou painel. | 2.1.1, [S06] |
| Alternativa ao arraste | Botões “selecionar/instalar/remover”, campos numéricos e vistas de câmera. Teclado sozinho não satisfaz a exigência de alternativa por clique/toque. | 2.5.7, [S07] |
| Equivalência do conteúdo | Modo 2D com esquema, lista de peças, agenda e os mesmos resultados. Se o canvas for decorativo, retirá-lo da navegação assistiva; se transmitir informação, oferecer descrição equivalente no DOM. | 1.1.1, [S08] |
| Movimento | Respeitar preferência de movimento reduzido; desativar órbita automática, fly-through e parallax; controle de pausa para conteúdo em movimento aplicável. | 2.2.2 e 2.3.3, [S09–S10] |
| Atualizações | Resumo de mudança em região de status, sem mover foco a cada ajuste. Agregar avisos; não anunciar telemetria a cada frame. | 4.1.3, [S11] |
| Alvos | Usar 44 × 44 CSS px como objetivo de projeto para controles principais. O mínimo AA documentado é 24 × 24 CSS px, com exceções e regras de espaçamento. | 2.5.8, [S12] |
| Informação visual | Texto e ícone além de verde/vermelho; contraste legível; gráfico acompanhado de tabela; ampliar texto sem perder controles. | WCAG 2.2, [S05] |

Modos acessíveis não devem diminuir o conteúdo científico ou limitar a pontuação. O modo 2D também é a alternativa para WebGL indisponível, falha de carregamento ou dispositivos modestos. A escolha pode ficar visível em “Visualização: 3D / 2D”; a interface não precisa expor jargão de GPU para o jogador.

## 4. Avaliação dos seis repositórios indicados

“Disponível” significa página pública/README consultável nesta pesquisa. Não significa compilação confirmada, compatibilidade atual de dependências ou qualidade científica auditada.

| Repositório | O que foi verificado | Licença e atribuição | Uso recomendado no beta |
|---|---|---|---|
| NASA-3D-Resources | Coleção pública de modelos, imagens e texturas. O README descreve os assets como livres de copyright, mas encaminha às regras de uso. [S13] | `meta.json` declara NOSA 1.3; isso não resolve os direitos de cada asset. A política NASA distingue conteúdo próprio, terceiros e identificadores de marca. Conferir a página e os créditos de cada arquivo. [S14–S15] | Seleção curada de poucos modelos; converter/otimizar antes do uso. Não importar a coleção toda nem apresentar logo NASA como endosso. |
| rijulpaul/Planetarium | Público; React, TypeScript e Three.js, controles de tempo e cálculo próprio por elementos orbitais. As alegações de precisão são do autor. [S16] | Não foi localizada licença na listagem raiz/README consultados. Repositório público não é concessão geral de reprodução ou redistribuição. [S17] | Referência visual e de interação. Não copiar código ou assets antes de resolver licença. Não adotar como autoridade de física. |
| ethanplusai/earth-moon-solar | Público; JavaScript, Three.js e Vite. Dados JPL interpolados, delimitados de 01/01/2026 a 01/01/2027. O projeto distingue escala ilustrada e real e declara limitações educativas. [S18] | Código original MIT; texturas Solar System Scope CC BY 4.0 e HYG adaptado CC BY-SA 4.0. Manter termos dos assets separados. A página CREDITS existe, mas seu conteúdo integral não foi recuperado pelo mecanismo de consulta. | Boa referência para Terra, controles e transparência de escala. Extrair seletivamente somente após conferir créditos do arquivo usado; portar lógica para componentes React, sem acoplar a aplicação multipágina inteira. |
| sakobu/koenig-guffanti-damico-roe-stm | Público; React 19, TS, R3F, Zustand e Vite. Foco em rendezvous/proximidade em LEO, ROE/RIC, J2 e arrasto. README descreve alvos e Δv por trecho. [S19] | README declara MIT; o arquivo LICENSE separado não foi recuperado. Confirmar texto/copyright no commit adotado antes de redistribuir. | Melhor proximidade arquitetural com a stack. Pode informar separação entre órbita, cena, UI e stores. Não é planejador Terra–Lua ou interplanetário; não aplicar seu regime de movimento relativo a esses casos. |
| nasa/muscat | Público; MuSCAT simula conceitos de missões e subsistemas. Instalação documentada usa MATLAB, arquivos de suporte externos e SPICE/MICE. [S20] | LICENSE Apache 2.0. Dados externos precisam de conferência própria. O apêndice do LICENSE consultado contém nomes de copyright que parecem não corresponder ao projeto; conservar o arquivo e esclarecer procedência antes de incorporar código. [S21] | Referência de dependências entre energia, atitude, instrumentos e comunicação. Não é dependência direta apropriada ao beta no navegador. Possível ferramenta de validação offline futura. |
| nasa/cml | Público; modelos C++ compatíveis com Trick, com compartilhamento de modelos Trick/JEOD. [S22] | LICENSE confirma NASA Open Source Agreement 1.3; não tratar como MIT ou domínio público. [S23] | Referência para evolução de modelos e validação científica. Integração ou port para browser seria um projeto separado, desproporcional ao beta. |

NASA: a política consultada permite, em geral, utilização educativa/informativa de seu conteúdo sob as diretrizes, pede reconhecimento da fonte e não transfere direitos sobre material de terceiros. Marca e endosso têm tratamento próprio. A ação prática é manter um manifesto de assets com origem, autor, licença/termos, modificações e texto de crédito, mais uma tela “Fontes e créditos”. [S15]

## 5. Efemérides, órbitas e otimização são responsabilidades diferentes

**No beta Cerrado/LEO:** usar o modelo atual para resultados e a geometria que ele de fato disponibiliza. Não adicionar Astronomy Engine apenas para desenhar a Terra. Se o modelo não fornece estado orbital, a órbita de apresentação deve ser explicitamente ilustrativa e não determinar o resultado da missão.

**Astronomy Engine** é uma alternativa MIT para posições e eventos astronômicos no navegador. O projeto documenta vetores heliocêntricos/geocêntricos e precisão angular de aproximadamente um minuto de arco, insuficiente para navegação de espaçonaves. Seu escopo documentado não é um otimizador de transferências nem o cálculo do orçamento Δv de uma missão. Posições podem ser entradas de outro modelo; não substituem solver, condições de contorno e modelo propulsivo. [S24]

**JPL Horizons** fornece efemérides e estados; para uma expansão, um conjunto de dados pré-calculado e versionado evita depender de consulta de rede durante o jogo. Registrar corpo central, referencial, escala de tempo, unidades, período e método de interpolação. Usar estados geométricos quando o cálculo exigir geometria física; não misturar posições aparentes corrigidas por tempo de luz com estados dinâmicos. Essa escolha depende do cálculo científico e deve ser validada. [S25]

**ESA PyKEP/kep3** é uma opção real de projeto de trajetória: documenta solução de Lambert e formulações de otimização, inclusive baixo empuxo. O repositório atual identifica MPL 2.0. A linha 3 está em evolução e a documentação/README consultados apresentam diferenças sobre disponibilidade de pacotes; selecionar uma versão comprovada por execução e fixar a dependência. [S26–S28] Recomendação de arquitetura: processo offline para gerar casos de referência ou serviço científico isolado numa expansão; não presumir que um pacote Python/C++ possa entrar diretamente no bundle Vite.

Um solver de Lambert fornece um arco sob hipóteses específicas. Δv de partida, chegada, captura e margens ainda dependem das condições da missão; otimizar um arco não prova viabilidade operacional total. A escolha de modelo lunar deve preceder a implementação visual dessa expansão. [S27]

## 6. Arquitetura proposta para implementação

| Camada | Responsabilidade | Limite essencial |
|---|---|---|
| `domain/` existente | Configuração, restrições, métricas, resultado determinístico e explicações estruturadas. | Não importar React, Three ou elementos de UI. Não duplicar fórmulas no debrief. |
| `application/` | Comandos de alterar configuração, validar, executar, salvar e comparar tentativas. | Cada tentativa preserva versão do modelo, cenário e entradas. |
| `stores/` | Estado de edição, seleção, preferências, simulação e histórico. | Persistir escolhas; não gravar objetos Three ou estado de frame. |
| `components/ui/` | Briefing, catálogo, orçamento, agenda, mensagens e relatório em HTML semântico. | Fluxo completo permanece disponível fora do canvas. |
| `components/scene/` | Terra, satélite, destaque de peças, câmera e efeitos limitados. | Escala visual não alimenta cálculos físicos. |
| `adapters/` | Persistência, leitura de dados, importação/exportação, futuras efemérides. | Validar esquema e unidades na fronteira. |
| `workers/` opcional | Cálculo dispendioso e geração de séries. | Só introduzir se o custo medido justificar; não reescrever motor pequeno por antecipação. |

React Three Fiber é um renderer React para Three.js. A documentação atual associa R3F 8 a React 18 e R3F 9 a React 19; R3F 10 aparece como alpha. Para o beta, manter um par estável compatível com o repositório e fixar versões. Vite oferece template React/TS; a documentação atual pede Node 20.19+ ou 22.12+, podendo haver exigência maior de templates. [S29–S30]

Zustand é adequado ao estado de produto. `persist` permite armazenar e selecionar campos persistidos; `subscribeWithSelector` observa fatias específicas. Proposta: configuração e preferências pequenas em armazenamento local; histórico volumoso em IndexedDB, se necessário. Versionar o esquema e tratar falhas de armazenamento sem perder a edição corrente. O usuário deve saber se “salvo” significa apenas neste navegador. [S31–S32]

Separar tempo físico, reprodução e renderização. A execução científica produz um resultado/série estável; mudar FPS, câmera ou velocidade visual não muda ciência, custo ou consumo. Em R3F, usar `useFrame` e referências para transformações rápidas. A documentação recomenda evitar `setState` dentro do loop e reutilizar geometrias/materiais. [S33] Durante edição estática, renderização sob demanda reduz trabalho; durante playback, atualizar apenas o necessário. [S34]

Modelos selecionados devem chegar ao produto como GLB/glTF, com orçamento de tamanho e testes no aparelho alvo. Three.js oferece GLTFLoader e extensões de compressão; KTX2Loader trata texturas GPU com transcodificação. [S35–S36] Compressão, sombras, atmosfera e pós-processamento são escolhas medidas: um planeta legível e o satélite selecionável valem mais que efeitos que atrasam feedback. Deixar cenas e assets pesados em carregamento tardio; carregar o briefing e os controles primeiro.

Para eventual estado orbital, definir contrato explícito com `position`, `velocity`, `frame`, `origin`, `epoch`, `timeScale` e `units`. Manter valores físicos separados de escala/offset de cena. Tipos TS ajudam, mas não substituem validação numérica, conversão de unidades ou testes de referencial.

## 7. Relatório causal e comparação de tentativas

Resultado proposto: `inputs`, `modelVersion`, `scenarioVersion`, `summary`, `constraints`, `events`, `evidence`, `sourceRecords` e `assumptions`. Cada problema aponta `ruleId`, métrica, valor, limite e campos de configuração envolvidos. O texto visível é formatado a partir desses dados, com linguagem pt-BR. Isso permite explicar a execução sem inventar uma narrativa após o cálculo.

Só afirmar uma causa específica se a regra do motor a demonstrar ou uma execução contrafactual controlada confirmar a diferença mantendo o restante igual. Para interações entre várias escolhas, o relatório deve reconhecer a combinação. Não atribuir a uma única peça a diferença de resultado entre duas tentativas que mudaram peça, agenda e cenário.

Comparação mínima: configuração A/B, mudanças, métricas lado a lado, deltas, condições cumpridas e limitações. Uma tentativa deve ser imutável após executar; editar cria um novo rascunho. Guardar a versão do modelo evita comparar como equivalentes resultados calculados sob regras diferentes. Se a expansão introduzir sorte, guardar a semente e usar condições iguais para comparação didática.

## 8. Critérios de aceite e validação focada

1. Primeiro contato: o participante identifica objetivo, orçamento e sucesso sem ajuda do facilitador.
2. Montagem: trocar uma peça atualiza a representação, a seleção e os valores no mesmo fluxo; é possível desfazer.
3. Compreensão: o participante explica um compromisso real do modelo com suas palavras, não apenas repete uma legenda.
4. Diagnóstico: diante de uma configuração inviável, encontra a causa e modifica uma escolha pertinente.
5. Ritmo: pausar, acelerar, abrir ajuda e trocar 2D/3D preserva a tentativa e seu resultado.
6. Comparação: identifica o que mudou entre duas tentativas e relaciona a diferença ao objetivo declarado.
7. Acesso: briefing → montagem → execução → debrief completo por teclado; testar leitor de tela, toque, zoom e movimento reduzido.
8. Regressão científica: para configurações conhecidas do motor, a nova UI produz os mesmos resultados e não introduz cálculos paralelos.
9. Robustez visual: ausência de WebGL ou falha de asset oferece modo 2D funcional; teste em dispositivo modestamente equipado.
10. Proveniência: todos os arquivos externos incorporados têm origem e termos registrados; conjunto de dados mostra data e limites.

Testes com novatos e pessoas com repertório técnico devem observar conclusão, erros, tempo até recuperar uma restrição e compreensão dos trade-offs. Não usar rapidez como único critério de aprendizagem. As metas quantitativas de FPS, payload e tempo de carregamento devem ser definidas pelo aparelho/rede alvo e medidas; esta pesquisa não mediu performance da aplicação.

## 9. Prioridade de implementação

**Agora:** preservar motor e fontes; construir briefing curto, hangar R3F, orçamento fixo, agenda, validação, debrief e comparação; garantir equivalência 2D e créditos. Usar poucos assets com licença confirmada.

**Depois de testar o beta:** refinar explicações conforme erros observados, histórico/exportação, cenários adicionais e visualização de séries realmente calculadas.

**Expansão lunar:** definir objetivos e regime orbital, validar solver/efemérides e referências, então adicionar conteúdo e cena. MuSCAT, CML e PyKEP são candidatos a referência ou infraestrutura científica futura, com papéis diferentes; nenhum deles deve substituir o motor atual por mera associação à NASA/ESA.

## Fontes primárias consultadas

| ID | Fonte |
|---|---|
| S01 | NN/g — [10 Usability Heuristics](https://www.nngroup.com/articles/ten-usability-heuristics/) |
| S02 | NN/g — [Progressive Disclosure](https://www.nngroup.com/articles/progressive-disclosure/) |
| S03 | NN/g — [Onboarding Tutorials vs. Contextual Help](https://www.nngroup.com/articles/onboarding-tutorials/) |
| S04 | NN/g — [Error-Message Guidelines](https://www.nngroup.com/articles/error-message-guidelines/) |
| S05 | W3C — [WCAG 2.2](https://www.w3.org/TR/WCAG22/) |
| S06 | W3C — [Keyboard](https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html) |
| S07 | W3C — [Dragging Movements](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements) |
| S08 | W3C — [Non-text Content](https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html) |
| S09 | W3C — [Pause, Stop, Hide](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide) |
| S10 | W3C — [Animation from Interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html) |
| S11 | W3C — [Status Messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html) |
| S12 | W3C — [Target Size Minimum](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) |
| S13 | NASA — [NASA-3D-Resources](https://github.com/nasa/NASA-3D-Resources) |
| S14 | NASA — [NASA-3D-Resources/meta.json](https://github.com/nasa/NASA-3D-Resources/blob/master/meta.json) |
| S15 | NASA — [Images and Media Usage Guidelines](https://www.nasa.gov/nasa-brand-center/images-and-media/) |
| S16 | Autor — [rijulpaul/Planetarium](https://github.com/rijulpaul/Planetarium) |
| S17 | GitHub — [Licensing a repository](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/licensing-a-repository) |
| S18 | Autor — [ethanplusai/earth-moon-solar](https://github.com/ethanplusai/earth-moon-solar) |
| S19 | Autor — [sakobu/koenig-guffanti-damico-roe-stm](https://github.com/sakobu/koenig-guffanti-damico-roe-stm) |
| S20 | NASA — [MuSCAT](https://github.com/nasa/muscat) |
| S21 | NASA — [MuSCAT LICENSE](https://github.com/nasa/muscat/blob/main/LICENSE) |
| S22 | NASA — [Common Model Library](https://github.com/nasa/cml) |
| S23 | NASA — [CML LICENSE](https://github.com/nasa/cml/blob/main/LICENSE) |
| S24 | Autor — [Astronomy Engine](https://github.com/cosinekitty/astronomy) |
| S25 | JPL — [Horizons Manual](https://ssd.jpl.nasa.gov/horizons/manual.html) |
| S26 | ESA — [PyKEP repository](https://github.com/esa/pykep) e [COPYING](https://github.com/esa/pykep/blob/master/COPYING) |
| S27 | ESA — [PyKEP documentation](https://esa.github.io/pykep/) e [Lambert class](https://esa.github.io/pykep/lambert.html) |
| S28 | ESA — [Trajectory Optimization](https://esa.github.io/pykep/trajopt.html) |
| S29 | PMNDRS — [R3F Introduction](https://r3f.docs.pmnd.rs/getting-started/introduction) |
| S30 | Vite — [Getting Started](https://vite.dev/guide/) |
| S31 | PMNDRS — [Zustand persistence](https://zustand.docs.pmnd.rs/reference/integrations/persisting-store-data) |
| S32 | PMNDRS — [subscribeWithSelector](https://zustand.docs.pmnd.rs/reference/middlewares/subscribe-with-selector) |
| S33 | PMNDRS — [R3F Performance pitfalls](https://r3f.docs.pmnd.rs/advanced/pitfalls) |
| S34 | PMNDRS — [R3F Scaling performance](https://r3f.docs.pmnd.rs/advanced/scaling-performance) |
| S35 | Three.js — [GLTFLoader](https://threejs.org/docs/pages/GLTFLoader.html) |
| S36 | Three.js — [KTX2Loader](https://threejs.org/docs/pages/KTX2Loader.html) |
