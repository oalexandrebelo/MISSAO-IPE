# 33 — Oportunidades NASA Science para o Ipê

**Curadoria de 14/11/2026 · edição R15.** O maior ganho imediato é ajudar o jogador a explicar suas decisões e o alcance da evidência recebida. A pesquisa seleciona oito oportunidades ligadas às três missões existentes. As propostas abaixo não acrescentam APIs ao jogo e não alteram seus modelos numéricos.

Todas as páginas principais foram abertas em fontes oficiais NASA Science nesta data. Os links das aplicações Eyes foram resolvidos, mas suas experiências WebGL não foram testadas nesta pesquisa. A consulta confirma o conteúdo encontrado, não disponibilidade futura, desempenho, acesso offline ou permissão de incorporação. Nenhuma mídia nova foi baixada nesta rodada.

O [catálogo estruturado](../research/nasa-science-opportunities.json) registra fontes, estado, custo qualitativo, limites e critérios de aceite. O [guia didático](32-GUIA-DIDATICO-MISSOES-3D.md) transforma o contexto do projeto em explicações e exercícios. O [recibo público](https://github.com/oalexandrebelo/PROJETO-IPE/blob/main/PUBLICADO.md) identifica a entrega efetivamente publicada.

## 1. Ordem recomendada

As prioridades são uma proposta de produto. “Baixo” significa redação, ligação contextual e revisão; “médio” inclui interação, acessibilidade ou ensaio com participantes. Não são prazos ou custos contratados.

| ID | Oportunidade | Missão | Impacto / esforço | Situação no corte |
| --- | --- | --- | --- | --- |
| NS01 | Explicar NDVI e qualidade no retorno | Cerrado | Alto / baixo | Domínio existente; atividade contextual proposta |
| NS02 | Justificar imagem ou espectro | Telescópio | Alto / baixo | Compatibilidade instrumental existente; ficha proposta |
| NS03 | Classificar evidências de Bennu | Bennu | Alto / baixo | História e modelo existentes; atividade proposta |
| NS04 | Anotar função e limites dos modelos 3D | Todas | Alto / médio | Quatro ativos locais existentes; montagem R15 implementada e verificada localmente |
| NS05 | Excursão orientada no Eyes on the Earth | Cerrado | Médio / baixo | Atividade externa proposta |
| NS06 | Separar viagem e operação com Eyes | Bennu e telescópio | Médio / baixo | Atividade externa proposta |
| NS07 | Preparar facilitador e avaliação de compreensão | Todas | Alto / médio | Exercícios documentados; piloto proposto |
| NS08 | Ligar eventos aos fundamentos de missão | Todas | Alto / baixo | Processo existente; leitura contextual proposta |

Começar por NS01–NS03 e NS08 oferece explicações diretamente relacionadas aos resultados do jogo. NS04 deve acompanhar a montagem configurável sem transformar aparência em prova física. NS07 verifica se a experiência ajuda a compreender; NS05–NS06 ampliam o contexto de forma opcional.

## 2. Oito oportunidades concretas

### NS01 — Cerrado: compreender o que o índice permite dizer

O artigo histórico [Measuring Vegetation (NDVI & EVI)](https://science.nasa.gov/earth/earth-observatory/measuring-vegetation-ndvi-evi/), de 30/08/2000, explica a relação entre refletância, índices de vegetação e dificuldades de observação. É adequado como leitura conceitual; a especificação e a qualidade dos seis registros do Ipê continuam vinculadas ao produto MOD13Q1.061 e ao pacote local.

**Proposta:** depois de receber dados, mostrar três perguntas: quais pares chegaram, quais diferenças podem ser calculadas e que explicações ainda precisariam de outras evidências. O jogador deve distinguir falta de recepção de um valor de vegetação baixo. Uma ficha curta pode relacionar BANDAS/ÍNDICE à mesma pergunta científica.

**Aceite:** pares incompletos continuam indisponíveis; o texto diferencia início do composto e data de observação; nenhuma diferença é automaticamente atribuída a seca, manejo ou desmatamento. O cálculo já existe; esta atividade contextual ainda é uma extensão proposta. Esforço baixo, sem coleta nova.

### NS02 — Telescópio: o instrumento nasce da pergunta

[Webb’s Scientific Instruments](https://science.nasa.gov/mission/webb/science-overview/science-explainers/webbs-scientific-instruments/) apresenta instrumentos, imagem e espectroscopia. A escolha do modo depende da informação procurada. Essa relação é útil para explicar por que a missão fictícia pede espectrômetro, sem sugerir que uma câmera seja uma escolha inferior em toda investigação.

**Proposta:** uma ficha comparativa antes do projeto: “quero estudar forma e distribuição” versus “quero comparar intensidade por comprimento de onda”. Solicitar uma justificativa curta e revisá-la após a execução. O modelo atual já diferencia a compatibilidade do instrumento; a explicação contextual amplia a compreensão dessa regra.

**Aceite:** a pergunta permanece visível; o estudante explica qual dado precisa; as faixas e os fluxos do exercício continuam identificados como sintéticos. Nenhum resultado do Ipê passa a ser uma observação Webb ou uma detecção de composição, atmosfera ou vida. Esforço baixo; reproduzir instrumentos reais exigiria outro modelo.

### NS03 — Bennu: separar observação, modelo e amostra

O pacote [OSIRIS-REx Resources](https://science.nasa.gov/solar-system/resources/resource-packages/osiris-rex-resources/) reúne materiais da missão, imagens, vídeos e atividades. Permite contrastar observação remota, retorno de material e análise em laboratório. O tour de Bennu e os materiais de coleta são referências externas para discutir como tipos diferentes de evidência sustentam perguntas diferentes.

**Proposta:** pedir que o jogador classifique quatro itens: geometria de referência NASA, rugosidade sintética do jogo, imagem real da missão e amostra física. Em seguida, explicar qual conclusão seria possível com cada um. As regiões A/B/C do Ipê continuam sendo rótulos didáticos.

**Aceite:** nenhum registro sintético é apresentado como medição real; o Ipê não reivindica coleta física, escolha de pouso ou análise química. Cada mídia eventualmente incorporada precisa de crédito próprio, tamanho controlado e revisão de uso. A primeira versão pode usar apenas links e perguntas, com esforço baixo.

### NS04 — 3D: tornar uma decisão visível sem exagerar sua precisão

O [NASA 3D Resources](https://science.nasa.gov/3d-resources/) oferece modelos de missões e direciona às regras de uso de mídia. O projeto já possui quatro GLBs locais: CubeSat genérico, DSN, Bennu e Webb. Sua procedência e inspeção estão em [30 — Ativos NASA implementados](30-ATIVOS-NASA-IMPLEMENTADOS.md); as candidatas adicionais permanecem em [28 — Oportunidades NASA 3D](28-OPORTUNIDADES-NASA-3D.md).

**Proposta:** associar anotações a funções — captar, processar, armazenar, alimentar e transmitir — e comparar a nave didática com a referência NASA. A montagem configurável R15 está implementada e sua verificação integrada local foi concluída. O estado da publicação é registrado em [PUBLICADO.md](https://github.com/oalexandrebelo/PROJETO-IPE/blob/main/PUBLICADO.md) e no [recibo de produção R15](https://github.com/oalexandrebelo/PROJETO-IPE/blob/main/evidence/production-r15.json). As anotações e atividades de aprendizagem propostas aqui continuam sendo extensões futuras.

**Aceite:** cada mudança de aparência corresponde a uma escolha explícita; dados e eventos vêm do resultado calculado; o texto distingue modelo NASA e montagem fictícia; há equivalente textual/2D. Geometria não fornece massa, potência ou validação orbital. O custo inclui interação, acessibilidade e desempenho: esforço médio, reutilizando os ativos já presentes.

### NS05 — Eyes on the Earth: ampliar o contexto do Cerrado

A [página oficial Eyes](https://science.nasa.gov/eyes/) apresenta aplicações de visualização de missões e dados; [Eyes on the Earth](https://eyes.nasa.gov/apps/earth/) é o destino oficial para explorar observações terrestres.

**Proposta:** excursão externa opcional de preparação: identificar um satélite, uma variável observada e uma escala temporal; depois voltar ao Cerrado e comparar com seus seis arquivos fixos. O exercício ensina a separar plataforma, instrumento e fenômeno observado.

**Aceite:** o jogo continua completo sem abrir Eyes; a atividade tem alternativa textual; nada exibido externamente substitui os arquivos locais. A integração proposta é um link orientado, de esforço baixo. Não foram confirmados API, contrato de dados, incorporação por iframe, CORS ou operação offline. A atividade externa depende de rede e do equipamento.

### NS06 — Eyes on the Solar System: uma missão tem mais de um relógio

A mesma [coleção oficial Eyes](https://science.nasa.gov/eyes/) encaminha a [Eyes on the Solar System](https://eyes.nasa.gov/apps/solar-system/), uma aplicação externa para explorar corpos e missões ao longo do tempo.

**Proposta:** antes de Bennu ou telescópio, desenhar uma linha do tempo com viagem, chegada, observações e retorno de dados. Relacionar o recorte operacional de duas ou três horas do Ipê a uma fase localizada dessa história. Isso evita interpretar o tempo do exercício como viagem até Bennu ou L2.

**Aceite:** a linha do tempo distingue cronologia real, perfil conceitual e relógio do jogo; o Ipê não importa efemérides nem declara uma trajetória validada. Esforço baixo para roteiro e ligação externa. Qualquer integração numérica seria um projeto separado, com contrato de fonte, unidades, referência temporal e validação própria.

### NS07 — Learn Science: preparar a pessoa que facilita a atividade

[Learn Science with NASA](https://science.nasa.gov/learn/resources/learn-with-nasa/) organiza materiais educativos por níveis escolares e oferece atividades e recursos para facilitadores. Serve como ponto de partida para selecionar linguagem e profundidade, não como certificação pedagógica do Ipê.

**Proposta:** duas fichas para a mesma missão: uma centrada em leitura de eventos e explicação verbal; outra com contas de energia, bits e comparação controlada. Registrar hipótese antes, evidência durante e revisão depois. O guia desta edição apresenta um roteiro inicial; a eficácia precisa ser estudada com participantes.

**Aceite:** cada objetivo corresponde a uma resposta observável; o facilitador avalia justificativa separadamente de sucesso no jogo; traduções e adaptações são identificadas. As categorias escolares norte-americanas não equivalem automaticamente à BNCC. Esforço médio para adaptação e piloto; nenhuma estimativa de aprendizagem é presumida.

### NS08 — Basics of Space Flight: explicar o motivo de cada requisito

O tutorial [Basics of Space Flight](https://science.nasa.gov/learn/basics-of-space-flight/) conecta assuntos de projeto e operação. O [capítulo 7, Mission Inception](https://science.nasa.gov/learn/basics-of-space-flight/chapter7-1/), ajuda a relacionar propósito e requisitos; o [capítulo 10, Telecom](https://science.nasa.gov/learn/basics-of-space-flight/chapter10-1/), apresenta nave e solo na comunicação.

**Proposta:** leituras curtas depois de um evento significativo: entrega incompleta leva a taxa e duração do contato; instrumento incompatível leva à pergunta científica; excesso de massa leva ao envelope de lançamento. Pedir uma alteração justificada e uma nova previsão.

**Aceite:** a indicação nomeia o conceito e o evento relacionado; o estudante distingue produzir dados de recebê-los; a antena DSN de referência não vira estação operacional do Cerrado. O tutorial não valida os parâmetros didáticos, e o projeto não agenda antenas reais nem calcula um orçamento RF completo. Esforço baixo para conteúdo e vínculos entre conceitos.

## 3. Como incorporar sem perder a clareza da evidência

1. **Registrar origem:** URL da página, URL do ativo quando houver, crédito, data de consulta e data do conteúdo, se identificada. Uma página recente pode mostrar observações antigas.
2. **Classificar a função:** referência de leitura, mídia de contexto, dado numérico ou modelo geométrico. A presença de um recurso no acervo não autoriza tratá-lo como entrada do cálculo.
3. **Preservar o núcleo local:** uma atividade externa pode falhar sem impedir projeto, execução, eventos e retorno científico. A primeira versão de cada oportunidade deve funcionar com conteúdo curto e link.
4. **Revisar mídia por item:** manter créditos e arquivos originais, documentar transformações e verificar dependências. Não usar insígnias NASA como identidade do Ipê nem sugerir apoio institucional.
5. **Criar critério observável:** avaliar se a pessoa diferencia dado ausente de zero, potência de energia e registro produzido de registro entregue. Um botão clicado ou uma missão bem-sucedida não demonstra sozinho compreensão.
6. **Medir o que for implementado:** rede, memória, carregamento, teclado, alternativa 2D e equipamento alvo. Não converter inspeção documental ou teste de domínio em afirmação de desempenho gráfico.

Não há necessidade de uma API nova para realizar as primeiras atividades. Se uma coleta numérica for escolhida depois, deve ter contrato próprio, proveniência, versão, cache, tratamento de limites, snapshot e testes. Esta pesquisa não encontrou nem promete endpoints públicos para controlar Eyes, reservar DSN ou alimentar automaticamente o jogo.

## 4. Continuidade e fronteiras

A base R14 tem três casos, quatro segmentos, revisão local em equipe, estados temporais e referências 3D. A implementação local R15 amplia a explicação e torna a configuração visível em 3D, com o domínio preservado. A implementação e a verificação integrada local estão concluídas; o estado da implantação é documentado separadamente em [PUBLICADO.md](https://github.com/oalexandrebelo/PROJETO-IPE/blob/main/PUBLICADO.md) e [evidence/production-r15.json](https://github.com/oalexandrebelo/PROJETO-IPE/blob/main/evidence/production-r15.json). O [documento 31](31-TRES-MISSOES-CIENTIFICAS-R14.md) descreve os contratos da base; o [handoff R15](34-HANDOFF-IMERSAO-3D-R15.md) registra a rodada atual e o [handoff geral](25-HANDOFF-DOIS-DEVS.md) concentra a coordenação técnica.

Integração NASA de trajetória, novas observações reais de Bennu/espectros, multiplayer remoto e validação pedagógica permanecem trabalhos próprios. Devem nascer de uma necessidade verificada, com escopo e evidência definidos. A seleção de fontes oficiais melhora a rastreabilidade do conteúdo; não estabelece qualificação de engenharia, endosso ou elegibilidade competitiva.
