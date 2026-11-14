# A1 — Desafio oficial, referências NASA e escopo didático

Pesquisa realizada em 14 de novembro de 2026. Contexto recebido do agente coordenador: existe uma base real no repositório privado AB-NASA-TEAM-IPE, versão 0.3.0-beta.1, denominada Missão Ipê. Ela utiliza seis resultados históricos MOD13Q1 de Rio Verde, um catálogo de seis escolhas binárias `ipe-64-v1` e simulação determinística. Não inspecionei o código nem os seis registros; estas informações sobre a implementação vieram do coordenador.

## 1. Conclusão para decisão de produto

Recomendo preservar a Missão Ipê / Cerrado como campanha inicial. O tema de observação terrestre permite demonstrar, em uma partida curta, os quatro segmentos de uma missão científica: lançamento, nave, solo e pessoas que usam os resultados. A nova interface pode tornar visível o percurso objetivo → configuração → revisão → operação → ciência entregue → comparação de decisões. A Lua é uma expansão coerente, depois de o ciclo terrestre ser demonstrável.

O núcleo verificado do desafio 2026 é criar um jogo interativo para projetar, gerir e simular uma missão espacial completa, tornando perceptíveis escolhas de engenharia, recursos limitados e suas consequências. Isso favorece uma missão pequena e completa. Uma montagem de nave sem operação e sem avaliação de resultados deixaria de demonstrar parte desse núcleo.

## 2. O que foi efetivamente verificado sobre 2026

URL solicitada: https://www.spaceappschallenge.org/2026/challenges/space-mission-design-game/?tab=resources

Nesta pesquisa, a ferramenta web não conseguiu abrir a página específica: houve `DisabledError`, timeout e URL inacessível, inclusive ao testar a URL canônica, a variante sem `www` e a aba `details`. Isso não prova que a página inexista. Sua existência temática em 2026 é corroborada por páginas oficiais do Space Apps de equipes que exibem a seção institucional **About the Challenge** e nomeiam **Space Mission Design Game**.

Fontes oficiais com o resumo:

- https://www.spaceappschallenge.org/2026/find-a-team/project_morazan/
- https://www.spaceappschallenge.org/2026/find-a-team/missionforge/
- https://www.spaceappschallenge.org/2026/find-a-team/los-marcianos/

É importante distinguir a descrição escrita pelas equipes do bloco institucional do desafio. A confirmação acima usa o segundo. Um trecho curto desse bloco: “design, manage, and simulate a complete space mission”. O resumo menciona objetivos, desenho da nave, instrumentos, lançadores, orçamento, potência, massa, comunicações e restrições orbitais.

O calendário de 2026 também é confirmado diretamente por NASA e Space Apps: evento em 14–15/11/2026, tema The Next Frontier; o cronograma oficial informa divulgação dos enunciados em 28/10/2026.

- NASA: https://science.nasa.gov/universe/nasa-welcomes-all-ages-experience-levels-for-space-apps-challenge/
- PDF oficial: https://assets.spaceappschallenge.org/media/documents/2026_NASA_Space_Apps_Registration_Recruitment.pdf

**Limite desta auditoria:** não atribuir a mim a leitura integral da aba oficial de recursos. O coordenador informou que o projeto já tinha um gate Resources aberto; uma evidência anterior válida pode completar esta lacuna, mas não foi reproduzida por esta frente.

## 3. Obrigação, sugestão e decisão nossa

| Item | Classificação e evidência | Consequência para o MVP |
|---|---|---|
| Jogo interativo | Núcleo confirmado no resumo oficial 2026 | Escolhas precisam mudar um resultado observável |
| Projetar, gerir e simular missão completa | Núcleo confirmado no resumo oficial | Mostrar concepção, preparação, operação e resultado científico |
| Restrições e recursos limitados | Núcleo confirmado no resumo oficial | Orçamento, massa, energia e capacidade de entregar dados precisam ter consequências |
| Tornar compreensíveis as consequências | Núcleo confirmado no resumo oficial | Explicar causa, efeito e possibilidade de revisão |
| Até quatro participantes | Consta como possibilidade na reprodução de um evento local; não confirmado por leitura direta do original | Não transformar multiplayer online em bloqueio artificial de MVP |
| Múltiplos cenários, ranking, eventos aleatórios, sandbox | Sugestões na reprodução local, não núcleo confirmado | Adiar se não ajudarem o ciclo principal |
| VR/3D obrigatório | Não encontrado no núcleo 2026 confirmado | Não herdar obrigação de desafio antigo |
| IA generativa, blockchain, Supabase, OAuth, realtime | Não encontrados como exigência nas fontes oficiais consultadas | Só incluir por necessidade concreta de produto |
| Campanha Cerrado, seis escolhas, seis resultados e determinismo | Contexto do projeto informado pelo coordenador | Preservar a base e verificar a aderência do fluxo |

Uma reprodução extensa foi localizada no evento local HackAthlone: https://hackathlone.com/challenges/space-mission-design-game . Ela indica nove recursos e apresenta colaboração e outras funcionalidades em linguagem opcional. Usei essa página para localizar os destinos primários abaixo, não como autoridade técnica nem substituto da página oficial. A obrigatoriedade detalhada continua sujeita ao original.

## 4. Recursos localizados e acesso aos destinos primários

A associação destes nove itens à aba do desafio vem da reprodução local. O conteúdo técnico dos destinos NASA/JPL/CSA foi verificado separadamente, salvo indicação explícita.

| Recurso | URL canônica/destino | Uso recomendado e limite |
|---|---|---|
| Design and Develop Science Missions | https://www.nasa.gov/wp-content/uploads/2025/04/250323-design-and-develop-science-mission.pdf | Slides NASA, 25 páginas. Estruturam missão em lançamento, espaço, solo e usuário. Excelente base para o fluxo e para “ciência que chega”. Não é tabela de valores de componentes. |
| GMAT R2025a | https://software.nasa.gov/software/GSC-19468-1 | Catálogo oficial confirma software aberto para design, otimização e navegação, de LEO a espaço profundo. Usar como referência de validação futura; não é necessário embarcar seu motor numa primeira interface. |
| Concept Maturity Levels | https://dataverse.jpl.nasa.gov/dataset.xhtml?persistentId=hdl:2014/44299 | Preprint JPL de 2013. Descreve maturação incremental de conceitos, sobretudo CML 1–4 antes da formulação. Inspirar progressão de decisões; evitar chamar um conceito de “certificado NASA”. |
| Mission Design Lab | https://etd.gsfc.nasa.gov/capabilities/integrated-design-center/mission-design-lab/ | Confirma trabalho colaborativo e integração de requisitos, alternativas, massa, potência, dados, risco e custo. Sustenta a ideia de comparar configurações, não apenas maximizar peças. |
| Mission Viz | https://nasa.github.io/mission-viz/ | Destino acessível, mas a extração mostrou apenas a estrutura mínima da aplicação. Não auditei suas funcionalidades interativas. |
| Build It Yourself: Satellite! | https://science.nasa.gov/mission/webb/game-build-it-yourself/ | Precedente NASA: ciência direciona escolhas; opções incompatíveis são explicitadas; revisão antes do lançamento; progressão por níveis. A página declara limitações de acessibilidade e de telas pequenas: não copiar essas limitações. |
| CubeSat 101 | https://www3.nasa.gov/sites/default/files/atoms/files/nasa_csli_cubesat_101_508.pdf | Guia NASA de 96 páginas acessível. Útil para ConOps, integração, testes, interfaces, preparação e operação. Os requisitos de um lançamento real dependem da missão e de sua documentação específica. |
| Visualize a Space Mission Using Virtual Reality | https://www.spaceappschallenge.org/2023/challenges/visualize-a-space-mission-using-virtual-reality/ | Link de 2023; a página específica também falhou nesta consulta. O título foi confirmado em lista oficial de evento 2023. É precedente histórico, não o enunciado 2026. |
| Digital Games and Activities — CSA | https://www.asc-csa.gc.ca/eng/youth-educators/digital-games-and-activities.asp | Destino oficial da agência canadense acessível. Referência de experiências educativas, não requisito funcional do MVP. |

Fonte oficial que distingue os anos: https://www.spaceappschallenge.org/2023/ registra o evento de 7–8/10/2023 e seu tema Explore Open Science Together. A lista https://www.spaceappschallenge.org/2023/locations/shah-alam/ inclui o desafio de VR. Não foi encontrado motivo para transportar VR para uma obrigação de 2026.

## 5. NASA Systems Engineering Handbook: aplicação didática

Fonte central: https://www.nasa.gov/reference/systems-engineering-handbook/

PDF oficial: https://www.nasa.gov/wp-content/uploads/2018/09/nasa_systems_engineering_handbook_0.pdf

O documento é NASA/SP-2016-6105 Rev2. O próprio prefácio o caracteriza como orientação de boas práticas, sem transformá-lo em diretiva. Não apresentar o jogo como execução integral ou certificação desse handbook.

| Conceito consultado | Tradução para o jogo | Evidência observável |
|---|---|---|
| Ciclo de vida inclui operação e encerramento | Partida não termina na decolagem | Tela de operação seguida de resultado, lições e encerramento |
| ConOps conecta necessidades, cenários e arquitetura | Começar com o objetivo de quem receberá os dados | Meta escrita antes de escolher componentes |
| Cenários nominais e degradados | Mostrar eclipse, capacidade limitada e eventual modo seguro de forma prevista | Linha do tempo explica por que uma observação não foi realizada |
| Verificação contra requisitos | Revisão pré-voo com critérios específicos | Massa compatível, orçamento válido, capacidade de energia e dados verificáveis |
| Validação do propósito de uso | Avaliar se dados úteis chegaram ao destinatário | Resultado final distingue capturado, armazenado, transmitido e útil |
| Rastreabilidade e registro | Manter escolhas, parâmetros, fonte e resultado juntos | Relatório de missão reproduzível |

Capítulos primários consultados:

- Ciclo de vida: https://www.nasa.gov/reference/3-0-nasa-program-project-life-cycle/ . A fase de operação envolve realização dos objetivos, obtenção e análise dos dados, resolução de anomalias e relatórios. O encerramento contempla destinação do sistema e arquivamento.
- Design: https://www.nasa.gov/reference/4-0-system-design-processes/ . ConOps deve considerar o uso do sistema, decisões, interfaces e situações relevantes, inclusive degradadas, desde cedo.
- Realização: https://www.nasa.gov/reference/5-0-product-realization/ . A distinção entre verificação de requisitos e validação de expectativas é importante. A NASA inclui seres humanos e interfaces na validação; também trata limitações dos modelos como possível origem de resultados inadequados.

Aplicação proposta, não prescrição NASA: traduzir esses conceitos em linguagem comum, com “Objetivo”, “Projeto”, “Revisão”, “Operação” e “Resultados”. Siglas como PDR, CDR e CML podem ficar no conteúdo opcional de aprofundamento.

## 6. Basics of Space Flight: o que aproveitar e o que atualizar

Portal atual: https://science.nasa.gov/learn/basics-of-space-flight/

O material originou-se no JPL e hoje está hospedado em NASA Science. Sua apresentação diz que é amplo e introdutório, voltado a compreender como as áreas de uma missão se relacionam. Serve à alfabetização científica do jogo, não a validar sozinho um simulador de engenharia.

Fontes e uso:

- Missão e fases: https://science.nasa.gov/learn/basics-of-space-flight/chapter7-1/ . Apoia o percurso de uma ideia até projeto e desenvolvimento.
- Telecom: https://science.nasa.gov/learn/basics-of-space-flight/chapter10-1/ . Explica comunicação, taxas e multiplexação. Aplicação: dado gerado não equivale a dado recebido; parte da capacidade serve a funções de engenharia.
- Sistemas a bordo: https://science.nasa.gov/learn/basics-of-space-flight/chapter11-1/ . Relaciona estrutura, controle, processamento e proteção da nave. Aplicação: modo seguro preserva a missão com impacto temporário na ciência.
- Energia: https://science.nasa.gov/learn/basics-of-space-flight/chapter11-3/ . A relação geração, consumo, armazenamento e eclipse é útil. Não importar como valores de CubeSat seus exemplos de naves interplanetárias.
- Instrumentos: https://science.nasa.gov/learn/basics-of-space-flight/chapter12-1/ . Fonte para explicar por que instrumentos diferentes respondem a perguntas científicas diferentes.

**Achado de qualidade:** o tutorial contém exemplos e afirmações tecnológicas antigas. O capítulo de energia ainda usa números históricos e um trecho que limita a praticabilidade solar para além de Marte. Juno demonstra energia solar em Júpiter, como descreve https://science.nasa.gov/mission/juno/ . Portanto, reutilizar princípios e revisar afirmações quantitativas ou de tecnologia.

Fonte adicional atualizada, muito útil ao catálogo: https://www.nasa.gov/smallsat-institute/sst-soa/ . A edição disponível é a de 2026; o resumo diz cobrir tecnologias públicas até abril de 2026. O capítulo de energia está em https://www.nasa.gov/smallsat-institute/sst-soa/power-subsystems/ . É uma revisão tecnológica, com informações agregadas; valores específicos de hardware ainda devem ser rastreados às condições e à fonte original. Para o jogo, separar dados de referência de parâmetros didáticos calibrados.

## 7. Dados abertos adequados à Missão Ipê

### Base preferida: manter MOD13Q1 histórico

Earthdata Search: https://search.earthdata.nasa.gov/search?q=MOD13Q1

Catálogo USGS/LP DAAC: https://lpdaac.usgs.gov/products/mod13q1v061/ — a abertura direta retornou 403 nesta sessão, portanto os fatos abaixo foram confirmados nas entradas Earthdata/CMR.

Registro CMR de distribuição INPE: https://cmr.earthdata.nasa.gov/search/concepts/C3560374404-INPE.html . Atenção: essa distribuição tem sua própria extensão temporal; não usar a última data dela como prova de encerramento do produto global.

MOD13Q1 V061 é um produto Terra/MODIS nível 3, em grade, com resolução nominal de 250 m e composição de 16 dias. Inclui NDVI e EVI, camadas de qualidade e informações auxiliares. A composição seleciona observações segundo critérios de qualidade; não é uma única imagem instantânea. A série MOD13 é Terra, enquanto MYD13 corresponde a Aqua.

Implicações de produto e de fidelidade:

1. Mostrar “Referência histórica Terra/MODIS”, período do composto, localização, produto e versão.
2. Não dizer que o CubeSat Ipê real mediu esses seis resultados. A nave é parte da simulação educativa; os dados vieram da missão NASA.
3. A escolha do jogador muda a entrega, o armazenamento e a disponibilidade dos resultados simulados; não muda os valores históricos de NDVI.
4. Não representar seis compostos como seis fotos tiradas em seis órbitas reais. A duração de uma rodada pode ser pedagógica, identificada dessa forma.
5. Não atribuir automaticamente uma queda de NDVI a desmatamento, fogo ou seca. O indicador necessita contexto, série temporal, qualidade e análise para uma interpretação causal.
6. Preservar valores ausentes e baixa qualidade; não transformá-los silenciosamente em zero ou “vegetação ruim”.

Fundamento do indicador: https://science.nasa.gov/earth/earth-observatory/measuring-vegetation-ndvi-evi/ e https://science.nasa.gov/earth/earth-observatory/global-vegetation-8622/ . NDVI usa a diferença normalizada entre infravermelho próximo e vermelho. Na explicação ao jogador: instrumentos precisam captar as faixas adequadas; uma câmera RGB simples não entrega automaticamente essa capacidade.

Limite físico importante: https://science.nasa.gov/mission/aqua/modis/ descreve MODIS como instrumento de 36 bandas, com massa de 229 kg. Usar seus produtos como referência científica não significa que o instrumento caiba em um CubeSat. “Inspirado em observação multiespectral” é mais fiel que “réplica de MODIS”.

### Acesso programático e proveniência

Documentação oficial ORNL DAAC/TESViS:

- https://modis.ornl.gov/data.html
- https://modis.ornl.gov/data/modis_webservice.html
- https://modis.ornl.gov/rst/globalsubset_ui/

O serviço documenta consultas de produtos, bandas, datas e subconjuntos por localização. O endpoint `/rst/api/v1/MOD13Q1/subset` aceita latitude, longitude, intervalo e área; os exemplos mostram JSON e CSV. A documentação apresenta limite de dez datas por pedido síncrono, suficiente para um pacote de seis resultados se as datas estiverem cobertas. Não executei a extração dos seis registros existentes.

Para cada resultado empacotado, recomenda-se registrar: produto, coleção/versão, bandas, coordenadas e área, datas do composto e da obtenção, valor bruto, fator de escala, valor final, regra de QA, método de agregação e URL da consulta. Os exemplos ORNL documentam fator 0,0001 para EVI; conferir o metadado efetivamente retornado de cada banda antes de converter. Guias antigos V5/V6 não devem ser apresentados como se fossem a especificação completa V061.

O jogo pode operar com um pacote histórico fixado e auditável, sem depender de API ao vivo durante a demonstração. Um link “Ver origem deste dado” leva à proveniência. Isso é uma decisão de robustez e clareza do projeto, não uma exigência formal da NASA.

## 8. MVP concreto recomendado

Nome de campanha: **Missão Ipê — Ciência que chega**.

Papel: equipe que configura uma pequena missão de observação do Cerrado e precisa entregar resultados úteis a quem estuda a vegetação de Rio Verde.

Missão curta: selecionar uma configuração, passar pela revisão, acompanhar uma simulação determinística de seis oportunidades didáticas e entregar a meta científica sem violar as restrições essenciais. Tempo de experiência proposto: 8–12 minutos na primeira partida, 2–4 minutos para revisar uma decisão e repetir.

**Contrato de compatibilidade:** manter o catálogo `ipe-64-v1` e os resultados conhecidos até auditar o motor existente. Não renomear parâmetros científicos nem modificar limiares apenas para acomodar um layout. Se a nova interface fizer escolhas diferentes, tratá-las como nova versão de catálogo ou campanha.

Loop proposto:

1. **Entender a missão.** Uma pergunta científica, destinatário, seis referências históricas e uma meta visível. Explicar o que conta como resultado útil.
2. **Projetar.** Apresentar as seis escolhas existentes progressivamente, com delta imediato de recursos e uma frase causal por opção. Mostrar limites e unidade de cada recurso.
3. **Revisar.** Separar impedimentos de lançamento de margens apertadas. Explicar o problema e levar diretamente à escolha responsável. Uma configuração inviável é oportunidade de revisão, não tela terminal.
4. **Operar.** Executar a mesma sequência para a mesma configuração. Permitir pausar e avançar etapas. Mostrar energia, memória, coleta e comunicação; explicar por que cada resultado foi ou não entregue.
5. **Avaliar.** Exibir ciência capturada, ciência transmitida e ciência útil. Justificar sucesso ou falha por requisitos concretos. Relacionar cada consequência a uma decisão.
6. **Experimentar.** Duplicar a configuração, alterar uma decisão e comparar o antes/depois sob o mesmo cenário. Isso ensina causalidade e trade-offs.

Condição de vitória proposta para calibrar: entregar pelo menos quatro dos seis resultados úteis, manter orçamento e compatibilidade de lançamento e concluir a operação sem falha terminal de energia. Esse número é uma decisão inicial de design, **não requisito do desafio nem descrição verificada do motor atual**. Antes de adotá-lo, avaliar todas as 64 configurações: deve haver mais de um caminho viável, trocas reais e pelo menos uma falha instrutiva explicável.

Condições de insucesso: chegar ao final abaixo da meta; perder a capacidade operacional crítica; ou não entregar observações por insuficiência de comunicação/armazenamento. Falha deve terminar com causa, efeito e uma sugestão ligada à configuração. Evitar explosão aleatória como justificativa sem vínculo com o modelo.

Regras de modelagem propostas:

- Separar potência instantânea (W) e energia armazenada (Wh).
- Energia varia por geração menos consumo ao longo de um intervalo; dados armazenados variam por coleta menos transmissão.
- Capacidade de lançamento e orçamento são restrições explícitas; não se resolvem com “pontos de ciência”.
- Pontuação é secundária à entrega da meta. Evitar um único score opaco que permita compensar nave inviável com bônus.
- Valores de componentes, janelas e custos devem estar identificados como reais documentados ou didáticos. Não nomear preços fictícios como cotações de fornecedores.
- Se a órbita for só uma animação, dizer que é representação didática; não chamá-la de propagação orbital validada.

Cooperação de escopo contido: dois a quatro participantes podem debater a mesma missão na mesma tela, distribuindo papéis de ciência, nave, comunicação e recursos. Isso preserva colaboração sem alegar multiplayer online. Realtime, salas e contas só entram quando houver necessidade demonstrada.

## 9. Mapa de aderência e evidência de demonstração

| Necessidade | Evidência no MVP | Verificação útil |
|---|---|---|
| Missão completa | Objetivo, projeto, revisão, operação e relatório final | A primeira partida alcança resultado sem mediação do apresentador |
| Decisões de engenharia | Alterar uma escolha muda pelo menos um recurso e uma consequência relevante | Comparação A/B determinística sob mesmo cenário |
| Recursos limitados | Valores, unidades, limites, saldo e causas visíveis | Conferir casos de limite e configurações inviáveis |
| Integração entre subsistemas | Melhor instrumento pode exigir mais energia, memória e enlace | O relatório mostra a cadeia causal, se implementada no modelo |
| Dados NASA | Cada referência histórica possui proveniência acessível | Datas, produto, escala e QA podem ser auditados |
| Valor educativo | Explicação curta no ponto de decisão e no resultado | Pessoa consegue explicar por que entregou menos ciência |
| Clareza de sucesso/falha | Meta visível antes e depois da simulação | Resultado bate com a regra publicada |
| Repetição e aprendizagem | Duplicar, alterar e comparar | A pessoa consegue melhorar uma missão com base no feedback |

## 10. Lacunas e próximos passos objetivos

1. Recuperar/arquivar a página oficial integral de 2026 ou a evidência anterior do gate Resources para resolver a obrigatoriedade fina e a associação exata dos nove recursos.
2. Auditar os seis resultados reais de Rio Verde: fonte, datas, QA, escala, agregação e rótulos da UI. Não foram lidos nesta frente.
3. Ler as seis decisões e as condições atuais do motor `ipe-64-v1` antes de implementar a proposta de apresentação.
4. Validar os 64 resultados existentes e os motivos de falha; não introduzir um threshold novo sem recalibrar e versionar.
5. Separar simulação pedagógica de dados observados em todos os pontos que possam causar confusão.
6. Usar Handbook, Basics e CubeSat 101 para conceitos; recorrer ao estado da arte 2026 e a fontes originais para valores contemporâneos.

Nenhum código de aplicação foi modificado por esta frente.
