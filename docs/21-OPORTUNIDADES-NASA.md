# 21 — Oportunidades NASA para a Missão Ipê

**Corte da pesquisa: 14/11/2026 · distribuição de referência: 0.4.0-beta.2 · estado: propostas de evolução.**

Esta pesquisa identifica dados e materiais oficiais que podem fortalecer o projeto. **Nenhuma nova API foi integrada por esta pesquisa.** A leitura de documentação não comprova disponibilidade operacional, integração, desempenho ou aceitação científica. Versões anteriores dos documentos conservam seus próprios cortes históricos.

## 1. Decisão de escopo

O MVP continua sendo a missão terrestre de **CubeSat no Cerrado**, com seis registros históricos MOD13Q1, seis escolhas binárias e 64 configurações por cenário. O objetivo permanece entregar ciência válida ao solo respeitando recursos limitados. Os dados científicos e as hipóteses operacionais didáticas precisam continuar distinguíveis.

A prioridade é validar essa experiência: compreensão do objetivo, explicação das falhas, redesenho com evidência e funcionamento no equipamento de apresentação. Novos destinos não substituem esses critérios. As oportunidades abaixo complementam o plano existente em [16 — Oportunidades para a beta](16-OPORTUNIDADES-BETA.md) e a [central de contexto](20-CENTRAL-CONTEXTO-CRONOGRAMA.md).

Uma campanha de asteroides com SBDB, Mission Design e Horizons é uma **possível segunda campanha, posterior à validação da atual**. Seu objetivo, regras, dados e avaliação terão contrato próprio. Não se atribuem cálculos de trajetória do JPL ao motor CubeSat já existente.

## 2. Priorização por impacto e esforço

Impacto e esforço são julgamentos de planejamento, não medições de retorno ou estimativas de duração. Baixo esforço significa principalmente curadoria e explicação; alto esforço envolve novos modelos, dados e verificação independente.

| Prioridade | Oportunidade | Impacto esperado | Esforço | Critério verificável antes de anunciar entrega |
|---|---|---|---|---|
| P0 — consolidar o MVP | Usar o NASA Systems Engineering Handbook para explicitar objetivo, requisito, decisão e evidência | Alto: torna a demonstração defensável | Baixo | Cada requisito apresentado aponta comportamento observável, versão e prova; distinguir verificação do software de validação com participantes |
| P0 — consolidar o MVP | Relacionar diagnósticos a capítulos de Basics of Space Flight | Alto: melhora a explicação de potência, comunicação e operações | Baixo | Cada conceito tem fonte, unidade e exemplo coerente com o motor; nenhum texto troca falha de potência por falta de energia |
| P1 — após o corte atual | Fundamentar fichas comparativas de componentes no relatório Small Spacecraft Technology | Alto: melhora a relação entre escolhas e engenharia | Médio | Toda especificação real tem referência e contexto; valores simplificados do jogo são identificados separadamente; revisar balanços e testes ao alterar números |
| P1 — após o corte atual | Curar imagens e modelos NASA para briefings e fichas | Médio: facilita reconhecer instrumentos e missão | Baixo a médio | Créditos e origem por recurso; arquivos locais quando permitidos; alternativa textual; nenhuma imagem é apresentada como produto gerado pelo CubeSat simulado |
| P2 — somente após validar o MVP | Campanha de reconhecimento de asteroide com SBDB + Mission Design + Horizons | Alto para ampliar o domínio de aprendizagem | Alto | Objetivo e regras próprios, dados versionados, unidades e referências consistentes, casos de falha e replay conferidos; validação da campanha terrestre registrada antes da implementação |
| P2 — experimento isolado | Comparar um cenário orbital com SPICE ou GMAT | Alto para avaliar fidelidade, sem ganho imediato garantido de UX | Alto | Cenário, versões, referenciais e tolerâncias definidos antes da comparação; registrar diferenças; não usar concordância visual como prova |
| P3 — expansão opcional | Eventos históricos DONKI e painel contextual DSN | Médio: acrescenta decisões operacionais | Médio a alto | Separar evento observado de consequência simulada; mostrar data e origem; agenda DSN fictícia identificada como tal |
| P3 — outras campanhas | Trek e Exoplanet Archive | Incerto para o recorte atual | Alto | Novo problema científico e critério de sucesso definidos; não ampliar apenas por disponibilidade de dados |

Não há compromisso de implementar toda a lista. A próxima prioridade deve responder ao problema observado na validação da beta.

## 3. Materiais com melhor relação entre utilidade e custo

### NASA Systems Engineering Handbook

O [handbook oficial](https://www.nasa.gov/reference/systems-engineering-handbook/), com registro bibliográfico da [Rev. 2 no NTRS](https://ntrs.nasa.gov/citations/20170001761), cobre desenvolvimento de conceitos, requisitos, projeto, produto e gestão técnica. Pode orientar uma ficha curta de missão: objetivo → requisito mensurável → escolha → evidência.

Aplicação proposta: transformar o debrief em revisão da missão, mostrando o requisito que falhou e a decisão que o afetou. Verificar se o software executa seu contrato e validar se a experiência atende à necessidade educativa são perguntas diferentes. O documento é uma referência metodológica; usá-lo não certifica o projeto como sistema NASA ou software de voo.

### State-of-the-Art of Small Spacecraft Technology

O [relatório NASA de 2026](https://www.nasa.gov/smallsat-institute/sst-soa/) reúne plataformas, potência, propulsão, controle, estruturas, térmica, aviônica, comunicações e operações. É especialmente aderente ao CubeSat atual. O relatório informa que é uma síntese de tecnologias publicamente disponíveis, não uma especificação completa de uma missão ou endosso de fornecedores.

Aplicação proposta: fichas de engenharia com fonte e contexto, explicando o que uma escolha custa em massa, energia ou complexidade. Não transportar um número de tabela para o jogo sem conferir condições de operação e compatibilidade. Preservar claramente o valor documental e o valor simplificado usado no cenário.

### Basics of Space Flight

O [tutorial NASA](https://science.nasa.gov/learn/basics-of-space-flight/) oferece capítulos de trajetórias, experimentos, telecomunicações, sistemas de bordo, instrumentos, navegação e operações. É uma base adequada para explicações curtas associadas ao resultado da partida.

Aplicação proposta: após uma falha, mostrar o recurso limitante, a consequência e uma pergunta de redesenho. A fonte sustenta o conceito; o motor continua responsável pelo resultado concreto da simulação. Um glossário fundamentado não substitui observação com participantes.

### SPICE, GMAT e acervo visual

- [SPICE/NAIF](https://naif.jpl.nasa.gov/naif/spiceconcept.html): sistema de geometria com software e kernels. Útil para cenários de referência e interpretação de observações. Não é uma API REST intercambiável com Horizons.
- [GMAT R2026 no catálogo NASA](https://software.nasa.gov/software/GSC-19640-1): software aberto de análise, otimização e navegação de missões. Candidato a validação offline de um cenário futuro; não está incorporado à beta.
- [NASA 3D Resources](https://science.nasa.gov/3d-resources/) e [NASA Image and Video Library API](https://images.nasa.gov/docs/images.nasa.gov_api_docs.pdf): modelos e imagens para comunicação visual. Conferir crédito e condições de cada recurso. Representação visual não demonstra fidelidade dinâmica.
- [NTRS](https://ntrs.nasa.gov/): relatórios técnicos para documentar decisões específicas quando a pergunta de engenharia estiver definida. Evitar acumular referências sem uso verificável.

## 4. Auditoria da lista de APIs recebida

As fontes abaixo foram consultadas como documentação em 14/11/2026. O catálogo mistura APIs, protocolos de mapas, feeds e ferramentas; não é correto descrever todos como serviços REST JSON/XML uniformes ou prometer a mesma autenticação e disponibilidade.

| Serviço e documentação oficial | Oportunidade | Correção ou limite que deve acompanhar o uso |
|---|---|---|
| [JPL Mission Design](https://ssd-api.jpl.nasa.gov/doc/mdesign.html) — `ssd-api.jpl.nasa.gov/mdesign.api` | Comparar opções de missão e janelas para pequenos corpos | Modos de consulta incluem opções pré-calculadas e mapas de trajetórias balísticas. Não é calculadora universal de missões à Lua, Marte, Europa ou Titã. `C3`, velocidade de excesso hiperbólico na chegada e delta-V total são grandezas distintas. HTTP 200 pode conter avisos de órbita desatualizada/incerta ou ausência de solução |
| [Horizons](https://ssd-api.jpl.nasa.gov/doc/horizons.html) — `ssd.jpl.nasa.gov/api/horizons.api` | Efemérides, vetores e distâncias em épocas definidas | Especificar centro, referencial, unidades e escala temporal. Não anunciar posições “exatas em tempo real” para qualquer corpo. JSON pode encapsular uma tabela textual no campo `result` |
| [SBDB](https://ssd-api.jpl.nasa.gov/doc/sbdb.html) — `ssd-api.jpl.nasa.gov/sbdb.api` | Identidade, órbita e propriedades de asteroides/cometas | Parâmetros físicos são selecionados e podem estar ausentes. Preservar incertezas e referências; pedir `phys-par=1` quando necessário. Não fixar uma contagem de objetos que envelhece rapidamente |
| [NHATS](https://ssd-api.jpl.nasa.gov/doc/nhats.html) — `ssd-api.jpl.nasa.gov/nhats.api` | Acessibilidade de NEAs sob restrições do estudo | Resultados têm hipóteses de missão e intervalos próprios; não são orçamento genérico de qualquer missão robótica |
| [CAD](https://ssd-api.jpl.nasa.gov/doc/cad.html) — `ssd-api.jpl.nasa.gov/cad.api` | Oportunidades de observação por aproximação | Aproximação não implica impacto ou emergência. Conservar corpo de referência, datas, unidades e limites da consulta |
| [DSN Now](https://www.nasa.gov/communicating-with-missions/dsn/) | Contexto real de comunicações | A NASA informa atualização de cinco em cinco segundos e diz expressamente que não é uma agenda de sessões futuras. Antena sem transmissão visível não está necessariamente disponível. O XML sugerido não teve disponibilidade confirmada nesta pesquisa |
| [DONKI](https://ccmc.gsfc.nasa.gov/tools/DONKI/) | Reproduzir eventos históricos de clima espacial | Observações e análises em contexto de pesquisa não fornecem automaticamente dose, dano ou perda de comunicação para a nave do jogador. Consequência didática precisa de regra explícita |
| [Exoplanet Archive TAP](https://exoplanet.ipac.caltech.edu/docs/TAP/usingTAP.html) — `exoplanetarchive.ipac.caltech.edu/TAP/sync` | Campanha futura de observação com telescópio | Consultas ADQL; saída padrão VOTable, com JSON opcional. Selecionar colunas e limites. Um planeta catalogado não significa bioassinatura detectada |
| [Trek WMTS](https://trek.nasa.gov/tiles/apidoc/) | Cartografia em campanha de superfície | Tile visual não é automaticamente um modelo de elevação métrico pronto para relevo 3D. Conferir camada, projeção, resolução, unidade e interpretação |
| [Mars Rover Photos / portal NASA APIs](https://api.nasa.gov/) | Referência histórica | O portal oficial informa que a API Mars Rover foi arquivada. Não incluí-la como integração disponível; selecionar acervo oficial alternativo para a necessidade concreta |
| [NASA Images API](https://images.nasa.gov/docs/images.nasa.gov_api_docs.pdf) — `images-api.nasa.gov/search` | Briefings, fichas e imagens educativas | REST/JSON com CORS documentado. Preservar identificador `nasa_id`, autoria, descrição e crédito. Resultado de busca não é resultado científico produzido pela missão simulada |
| `tle.ivanstanojevic.me/api/tle/` | Eventual fonte externa de TLE | Não foi encontrada comprovação oficial NASA de que esse serviço seja um “espelho oficial NORAD/NASA”. Excluir esse rótulo e não contá-lo como API NASA; não foi adotado pelo projeto |

### Limites de acesso e mudanças recentes

O [portal NASA APIs](https://api.nasa.gov/) informa para `DEMO_KEY` **30 requisições por IP por hora e 50 por IP por dia**. O limite padrão de uma chave própria é 1.000/h, sujeito ao serviço. Isso não é um limite universal aplicável a todos os recursos NASA/JPL.

A [política JPL SSD](https://ssd-api.jpl.nasa.gov/doc/index.php) exige uma requisição por vez, cache/reuso quando praticável, tratamento de indisponibilidade com redução de frequência, identificação válida da aplicação no `User-Agent` com versão e contato, e atenção à versão da resposta. Também proíbe embutir as APIs diretamente no website segundo a política CORS. Um proxy não deve servir de justificativa para ampliar consultas indiscriminadamente.

O [comunicado CCMC](https://ccmc.gsfc.nasa.gov/news/major-updates/) registra a migração DONKI de 30/09/2026, com base pública `https://ccmc.gsfc.nasa.gov/DONKI-API/get/...`. O portal `api.nasa.gov` ainda documenta seu gateway DONKI; esta pesquisa não comprovou sua desativação. A integração futura deve confirmar o endpoint escolhido e sua resposta antes de adotá-lo.

## 5. Arquitetura proposta para uma futura integração

Para preservar a demonstração, a opção inicial é **coleta editorial controlada → validação → snapshot versionado → jogo local**. Ela evita tornar cada interação dependente da rede. Não há implementação dessa coleta nova nesta entrega.

1. Definir a pergunta e as consultas permitidas. Não criar um proxy público de URL arbitrária.
2. Coletar dados JPL sequencialmente, com identificação da aplicação. Deduplicar consultas, reutilizar respostas e interromper ou aplicar espera progressiva em falhas e limites; não fazer repetição infinita.
3. Guardar resposta original e projeção normalizada separadamente. Registrar URL de origem sem segredo, parâmetros, horário UTC da coleta, versão da API, versão da normalização, unidades, referencial, época, avisos e hash do conteúdo.
4. Validar identificadores, tipos, campos ausentes, unidades e avisos científicos. Não converter ausência em zero, nem aceitar somente pelo status HTTP.
5. Publicar um snapshot pequeno e identificado, com fontes e data visíveis. A partida usa dados congelados; atualizar uma fonte não altera silenciosamente um replay antigo.
6. Se houver atualização online futura, manter a última versão validada e indicar quando ela está sendo usada. Cache em memória de função serverless não é persistência garantida. O uso de cache durável ou CDN deve ter contrato de validade explícito antes da implementação.

Os dez alvos sugeridos originalmente misturam planetas, luas e pequenos corpos. Não compartilhar uma única interpretação de Mission Design entre eles. Para a eventual campanha de asteroides, começar com poucos alvos compatíveis e somente aumentar o catálogo após verificar o ciclo completo.

### Critérios de aceite da futura camada de dados

- Com rede indisponível, a campanha documentada abre e conclui uma partida usando o snapshot incluído.
- Toda métrica derivada pode ser rastreada até fonte, parâmetros, unidade e transformação.
- Uma resposta sem campo obrigatório, com versão incompatível ou aviso impeditivo é recusada com diagnóstico; não produz uma missão aparentemente válida.
- O mesmo snapshot, configuração e versão de motor reproduzem o mesmo resultado.
- Logs de coleta demonstram ausência de chamadas JPL simultâneas e comportamento limitado após erro.
- Nenhuma chave privada aparece no HTML, repositório público ou recibo; apenas os metadados necessários de consulta são publicados.
- Estados “histórico”, “consultado em” e “simulado” ficam claros. O selo “ao vivo” exige evidência de atualização compatível.

## 6. Sequência recomendada e gates

| Etapa | Trabalho | Evidência para avançar |
|---|---|---|
| A — verificar a entrega atual | Publicação, navegação, jogo, exportação/replay e funcionamento no ambiente escolhido | Versão e origem identificadas; testes compatíveis com cada alegação; limitações registradas |
| B — validar a tarefa educativa | Observar se a pessoa entende o objetivo e explica o recurso limitante antes/depois do redesenho | Registro de tarefa, ajuda e explicação; não inferir aprendizagem populacional de uma sessão |
| C — fundamentar conteúdo | Selecionar conceitos e fichas NASA que respondem às dúvidas observadas | Referência por afirmação, revisão de unidades e separação entre dado real e hipótese didática |
| D — avaliar a próxima campanha | Especificar uma missão de asteroide e seu valor educativo | Objetivo, recursos, resultado científico e critérios próprios aprovados para implementação |
| E — integrar e comparar | Criar coleta, snapshots, novo contrato e comparação com referência quando cabível | Critérios da seção 5 satisfeitos, revisão científica e regressão da campanha CubeSat |

O HTML de contexto pode expor essas etapas desde já como planejamento. Botões, diagramas ou cards de recursos não constituem integrações implementadas.

## 7. Limites desta pesquisa e vínculo com o desafio

A página oficial indicada para [Space Mission Design Game 2026](https://www.spaceappschallenge.org/2026/challenges/space-mission-design-game/) não pôde ser carregada pela ferramenta de pesquisa nesta rodada: houve resposta 502 e falha de acesso na variante sem `www`. Este documento não declara o regulamento completo ou a lista oficial de Resources conferidos. A avaliação da candidatura continua separada da publicação de P&D.

As recomendações acima são decisões de produto fundamentadas em documentação oficial, não exigências atribuídas aos jurados. Não houve coleta nova de dados de missão, execução de GMAT/SPICE, teste de endpoint DSN, reserva de antena, simulação de dano radiativo ou nova validação com participantes. O estado dessas ações continua **proposto** até existir evidência própria.

Dados e materiais NASA não implicam endosso institucional. O projeto deve conservar autoria, créditos e limites dos materiais utilizados, além de sua declaração de assistência de IA.
