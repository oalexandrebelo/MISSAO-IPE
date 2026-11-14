# Seleção adversarial: qual projeto merece as próximas 32 horas?

Pesquisa estratégica para AB · 14/11/2026 · Space Apps 2026 · não implementa nem altera o PRD canônico.

## 1. Decisão, sem promessa de final mundial

**Manter Space Mission Design Game, mas elevar Missão Ipê por evidência de aprendizagem e correção do modelo, não por quantidade de cenários ou acabamento 3D.** Recomendo o conceito “Missão Ipê: Ciência que Chega”, descrito abaixo. CLPS/Lunar Landing Site Navigator torna-se preferível se a equipe dispuser de geometria e horizonte local já conferidos; MODIS/VIIRS só assume a liderança com cobertura observacional e validação da harmonização resolvidas. Essas condições não estão demonstradas.

Não existe aqui base para estimar probabilidade de final mundial. Faltam universo comparável de submissões, avaliações individuais e composição efetiva da equipe. A recomendação pondera riscos e provas que AB pode produzir, conforme sua experiência declarada em produto, pesquisa, dados e tecnologia.

Li `research/dossie-corpo.txt` e os documentos `02-PRD.md`, `04-CIENCIA-PROVENIENCIA.md` e `12-DECISOES-E-ETAPAS.md`. O estado continua sendo documentação: três packs sintéticos, 288 combinações por pack, meta de seis observações completas cobrindo A/B/C, 4,4 kg, 100 créditos e reserva de 15%. Não há motor executado, calibração, usuários observados ou recurso elegível confirmado. A prioridade proposta abaixo é uma revisão explícita de escopo, não uma alteração silenciosa dessa decisão anterior.

## 2. O que as fontes de 2026 confirmam

O resumo oficial indexado do jogo pede projetar, gerir e simular uma missão completa, tornando visíveis decisões de engenharia e recursos limitados. A página oficial de equipe `missionforge` reproduz esse resumo na seção do desafio; informações que a equipe publica sobre si não são regras NASA. A abertura direta do desafio e de Resources continuou falhando com 502/inacessibilidade nesta pesquisa. Portanto, **não confirmei a lista oficial integral**. [F01]

As respostas do GO Team exigem ao menos uma fonte NASA incluída nos Resources para disputar prêmios globais, atribuição das fontes e declaração de IA. Também delimitam pesquisa prévia versus início de projeto às 09h locais de sábado. Este relatório é pesquisa; não comprova admissibilidade automática dos documentos anteriores. O evento global abre submissões em 14/11 e encerra em 15/11, 23h59 locais; o planejamento da equipe conserva 17h de domingo como limite operacional de Rio Verde. [F02–F04]

Foram recuperados diretamente o registro e o PDF NASA *Design and Develop Science Missions*. A apresentação define segmentos de lançamento, espaço, solo e usuário e relaciona ConOps, necessidades e validação. Isso permite uso substantivo em uma mecânica, mas sua presença nos Resources segue pendente. O *CubeSat 101* é explicitamente dirigido a desenvolvedores iniciantes, especialmente instituições educacionais: sustenta um público plausível, não prova que ele usará Ipê. [F05–F06]

## 3. O ataque competitivo que o pitch precisa sobreviver

“Monte um satélite, administre recursos e veja as consequências” já descreve o desafio. *Build It Yourself*, da NASA, relaciona ciência, comprimentos de onda, instrumentos e óptica. Kerbal oferece montagem, experimentos, gestão de recursos e comunicações. Ipê não deve reivindicar superioridade geral, exclusividade de escolhas acopladas ou substituir simuladores de voo. [F07–F08]

Há ainda sobreposição contemporânea mais direta:

| Referência primária dos autores | Sobreposição documentada | Limite da comparação |
|---|---|---|
| `NASA-SPACEAPP-2026/Space-Mission-Design-Game` | CubeSat, negociação de requisitos, construção, teste, lançamento, operação, Vite estático e salvamento local | Nome da organização não comprova vínculo NASA; README não prova correção, execução observada ou elegibilidade |
| `Bee92-exe/what-if` | Barras de engenharia, missão terrestre, debrief causal, nova tentativa mudando uma decisão, simulação separada da arte e procedência por registro | O próprio README declara números provisórios e datasets ainda não ingeridos; não auditei runtime nem autoria temporal |

Essas evidências retiram “offline”, “replay causal”, “NASA no JSON” e “narrativa regional” da lista de novidades exclusivas. Não foi copiado código desses projetos. A lacuna defensável é **demonstrar**, em um recorte pequeno, correção independente do resultado e transferência de uma decisão aprendida para outro caso. Não encontrar essa avaliação nos READMEs não demonstra que ninguém a realizou. [F09–F10]

Há também uma falha estrutural no catálogo atual: `cam-rich` produz 300 Mbit, exige mais potência, massa e créditos, mas não entrega benefício científico modelado sobre `cam-compact`, de 180 Mbit. Como a meta conta observações completas, “rica” não significa melhor observação. A opção corre o risco de ensinar apenas a evitar uma peça onerosa. Antes de adicionar peças, remover a alternativa redundante ou definir um requisito científico que justifique sua capacidade, com fonte e revisão. Esta é crítica ao desenho documentado, não resultado de enumeração executada.

## 4. Três jogos distintos dentro do tema escolhido

| Conceito | Decisão aprendida e experiência | Força | Condição que mata o conceito |
|---|---|---|---|
| **A — Ciência que Chega** | Projetar a cadeia inteira, prever o gargalo, operar, identificar a primeira violação e reparar sem diminuir a missão; 10–12 minutos | Aproveita PRD e permite prova objetiva de transferência | Jogador vence repetindo recomendação automática, mas não prevê um caso novo; ou catálogo não oferece escolhas viáveis com consequências distintas |
| **B — Conselho de Missão** | Quatro papéis negociam requisitos de ciência, energia, solo e orçamento; decisões exigem justificativa compartilhada | Expõe engenharia de sistemas e adequa-se a oficina presencial | Exige facilitador explicando toda decisão; papéis não têm conflitos reais; não há grupos para testar colaboração |
| **C — Ciência sob Nuvens** | Planejar quais observações valem a captura e transmissão usando QA real de recortes HLS; diferenciar cobertura, qualidade e quantidade | Dado NASA altera diretamente o conjunto de observações úteis | Falta recorte com QA íntegro; política de qualidade não é defensável; imagens viram decoração; ingestão consome a primeira manhã |

**Escolha A.** B demanda validar uma dinâmica social adicional. C é cientificamente atraente: HLS oferece QA por pixel para nuvens, sombras e aerossóis. Entretanto, exige uma nova camada de dados e aprendizagem. Não combinar os três para prometer mais inovação. HLS é uma alternativa concreta, ainda sem recorte baixado ou presença confirmada nos Resources do jogo. Sua harmonização óptica tampouco resolve harmonização de focos MODIS/VIIRS. [F11]

## 5. O nicho de A, com utilidade verificável

Usuário inicial: **estudante de ensino técnico ou graduação entrando em uma atividade de projeto CubeSat, acompanhado por educador**. O trabalho concreto é decidir se um desenho atende ao objetivo e justificar uma mudança quando a missão falha. Não são brigadistas, agricultores ou planejadores de voo operacional. NASA documenta o público iniciante; Rio Verde registra participação escolar em astronomia e foguetes. Isso indica um canal de recrutamento plausível, não parceria, demanda atual ou disponibilidade no fim de semana. [F06, F12]

A origem brasileira acrescenta utilidade se gerar um exercício em português que um educador local consiga aplicar em computador compartilhado, com vocabulário compreensível e caso do Cerrado pertinente ao grupo. A versão em inglês permite avaliação externa. O valor não decorre do ipê na paisagem: precisa aparecer no roteiro do educador, no tempo de preparação e nas respostas de participantes. Não presumir que toda escola careça de internet nem chamar voluntários do evento de amostra representativa do Brasil.

A aprendizagem central fica deliberadamente estreita: **uma missão científica termina quando o usuário recebe observações adequadas ao objetivo; mais coleta ou hardware não garante mais resultado.** O participante prevê antes de executar, encontra uma causa e escolhe uma correção com custo explícito. Só depois recebe comparação com alternativas. O botão de reparo não pode resolver a tarefa de transferência por ele.

A fonte NASA opera o projeto de duas maneiras separadas. Primeiro, o fluxo e a condição de sucesso incorporam os quatro segmentos e requisitos verificáveis de [F05]; decolar ou preencher o buffer não basta. Segundo, balanços e escolhas são conferidos contra referências de energia e comunicação [F13–F14]. Cada número continua rotulado como publicado, derivado ou hipotético. Um manual conceitual não transforma 100 créditos ou 15% em dados NASA. A efetiva aceitação dessa aplicação do recurso para elegibilidade depende da lista oficial e da orientação vigente.

Para fortalecer o uso numérico, extrair um pequeno conjunto coerente de especificações e condições de um exemplo publicado, com unidades e referência exata, antes de congelar o pack. Não misturar números de fabricantes incompatíveis para simular um veículo real. O relatório SmallSat adverte que desempenho anunciado não foi necessariamente verificado pela NASA. Se os valores permanecerem didáticos, assumir isso claramente e demonstrar a transformação do recurso documental; não adicionar imagens de satélite apenas para dizer “dados reais”. [F13–F14]

**Evolução recebida da coordenação, aprovada apenas como hipótese:** substituir as duas câmeras por dois modos do mesmo instrumento red/NIR: transmitir bandas para processamento no solo ou calcular o índice a bordo e transmitir o resumo. Mantém-se a pergunta científica; trocam-se consumo de computação, volume transmitido e possibilidade de reprocessar. É uma decisão melhor formada que pagar mais por arquivos maiores sem benefício. Não implica IA nem precisa de modelo generativo.

O candidato informado pela frente de dados é MOD13Q1, três pixels em dois compósitos com QA. Não executei nem auditei essa extração. A NASA descreve MOD13Q1 como produto L3 de 250 m, composto em intervalos de 16 dias a partir de reflectâncias corrigidas atmosfericamente. Portanto, as bandas desse produto não são dados brutos do detector, e os seis registros não representam seis passagens reais de uma missão de 180 minutos. Devem ser amostras históricas usadas em um exercício, com agenda simulada separada. NDVI não identifica sozinho desmatamento ou saúde de lavoura. [F22]

Essa evolução só entra se a pergunta puder ser resolvida igualmente pelos dois modos, mantendo QA, unidades, precisão declarada e tratamento de valores ausentes. Consumo e volumes permanecem hipóteses independentes; uma pequena tabela de pixels não justifica 180/300 Mbit nem ganho real de computação embarcada. Exigir um caso em que transmitir bandas seja viável e outro em que processar ajude diante do contato curto; se um modo sempre vencer, o novo catálogo continua sem troca interessante. A perda de reprocessamento aparece como consequência, sem penalidade arbitrária oculta. Na ablação, remover o dado/QA deve mudar a resposta científica admissível; alterar modo deve mudar a engenharia sem mudar indevidamente o índice. Se isso não estiver demonstrado até o gate do núcleo, manter o exercício documental honesto, reduzindo a reivindicação de uso empírico NASA.

Manter a direção visual 3D escolhida por AB, vinculada aos mesmos eventos da lista: energia, armazenamento, contato e entrega. A vantagem comparativa proposta sobre Build It Yourself é praticar diagnóstico operacional e transferência em um tempo curto. Sobre Kerbal, é a atividade delimitada e explicável para uma oficina. Ambas são hipóteses de adequação à tarefa; não foram realizados estudos comparativos.

### Prova numérica que já pode orientar a calibração

Os números seguintes são limites analíticos das **hipóteses existentes**, não missões executadas. Seis observações compactas requerem 1.080 Mbit. Com eficiência de protocolo 0,80, rádio econômico entrega no máximo 0,96 Mbit/s; rádio rápido, 2,4 Mbit/s.

| Instrumento / seis observações | Volume | Contato mínimo econômico | Contato mínimo rápido |
|---|---:|---:|---:|
| Compacto | 1.080 Mbit | 18,75 min | 7,50 min |
| Rico | 1.800 Mbit | 31,25 min | 12,50 min |

Cálculo: `tempo = volume / (taxa nominal × eficiência)`. Assim, 14 minutos nominais do Litoral já tornam impossível entregar seis compactas pelo rádio econômico, mesmo ignorando energia e conflitos. Em Cerrado, 22 minutos também não comportam seis ricas nesse rádio. O recíproco não vale: caber no limite de transmissão não prova viabilidade energética, de buffer ou de agenda. Esse contraste oferece uma tarefa de transferência precisa, sem fingir órbitas reais.

### Ablações: o que realmente carrega valor?

| Retirada controlada | Resultado que examinar | Conclusão permitida |
|---|---|---|
| Desligar 3D, manter dados e controles | Mesma simulação; tempo e erros de tarefa | 3D é apresentação; benefício de compreensão exige evidência própria |
| Ocultar explicação causal, manter totais | Pessoa localiza causa e prevê caso novo? | Avalia a hipótese de valor da explicação; pequena amostra não prova causalidade geral |
| Permitir diminuir a meta durante reparo | Surgem sucessos que abandonam A/B/C? | Demonstra por que preservar requisito é necessário |
| Retirar validação de entrega ao usuário | Missão incompleta passa indevidamente? | Mostra que o recurso de sistemas orienta uma regra efetiva |
| Trocar enumeração completa por uma sugestão | Garantia de menor alteração desaparece | Separa sugestão útil de afirmação matemática auditada |

Nenhuma ablação demonstra pioneirismo mundial. Reprodutibilidade demonstra consistência sob premissas; correção requer oráculos independentes; aprendizado requer pessoas resolvendo novas tarefas.

## 6. Comparação adversarial com outras rotas

**CLPS:** o enunciado oficial pede comparar locais e datas observando Sol/Terra frente ao horizonte. Horizons permite geometria de observador, mas não incorpora automaticamente topografia local. NASA disponibiliza DEMs LOLA com referencial e incertezas. Um produto com dois locais e duas datas, horizonte correto e comparação conferida tem forte uso NASA e ótima afinidade com UX de AB. Sem isso, uma Lua bonita com horários errados é mais arriscada que o jogo. Visibilidade da Terra não garante enlace; elevação solar não é potência. [F15–F17]

**MODIS/VIIRS:** calendário histórico consistente responde a necessidade descrita pelo desafio. Contudo, VIIRS detecta mais focos pequenos que MODIS; nuvens, passagens e sensibilidade afetam ausência de registros. Deduplicar pontos ou multiplicar contagens pela razão de áreas não harmoniza detectabilidade. O mínimo aceitável exige área/período delimitados, exposição observacional, protocolo de comparação e avaliação em período ou área retidos. Sem especialista ou pipeline preparado, há risco de produzir uma alegação maior que a ciência. [F18–F19]

**Earth Jukebox:** entra como quarta alternativa porque aproveita produto e experiência multimídia. O enunciado pede sonificação dinâmica de frames EIC; SVS fornece sequências de frames. O núcleo cabe num protótipo curto, mas distinguir música atraente de interpretação útil exige tarefa e participantes apropriados. Não há competência de áudio ou acesso a usuários cegos confirmado. Sua facilidade visual não é argumento suficiente para trocar a escolha. [F20–F21]

### Sensibilidade auditável da recomendação

Notas abaixo são **julgamentos prospectivos**, de 1 a 5, sob equipe e prazo atuais; não resultados, notas NASA ou probabilidades. Gates eliminatórios vêm antes da soma. N representa potencial de uso substantivo de fonte NASA, não elegibilidade já comprovada. E: execução em 32h; U: acesso e avaliação de usuário; D: contribuição diferenciável/reproduzível; P: clareza de demonstração.

`S = 0,30E + 0,25N + 0,20U + 0,15D + 0,10P`

| Rota | E | N | U | D | P | S / 5 |
|---|---:|---:|---:|---:|---:|---:|
| Ipê atual, três packs ainda não calibrados | 3 | 1 | 3 | 2 | 3 | 2,35 |
| A focado, condicionado às provas propostas | 4 | 3 | 4 | 3 | 4 | **3,60** |
| CLPS com escopo pequeno, geometria ainda pendente | 2 | 5 | 3 | 3 | 4 | 3,30 |
| MODIS/VIIRS com cobertura ainda pendente | 1 | 5 | 2 | 4 | 4 | 2,95 |
| Jukebox com mapeamento e usuários pendentes | 3 | 4 | 2 | 2 | 4 | 3,00 |

Não comparar 3,60 com resultados observados de concorrentes: a nota de A pressupõe trabalho que pode falhar. A diferença frente a CLPS é frágil. Se E de A cair de 4 para 3, empata em 3,30. Se U cair de 4 para 2, A cai a 3,20. Se CLPS ganhar geometria pronta e E subir de 2 para 4, chega a 3,90.

Variando somente o peso NASA para `n` e preservando a proporção dos demais pesos, a diferença A−CLPS torna-se `(16/15)(1−n)−2n`. CLPS ultrapassa A em `n > 8/23 ≈ 34,8%`. Isso explicita a escolha de valor: a recomendação favorece fechar produto e provar aprendizagem no prazo. Uma equipe com evidência lunar pronta ou prioridade científica maior pode decidir diferente sem contradição.

## 7. Gates e mortes objetivas

| Gate | Evidência mínima e momento | Se falhar |
|---|---|---|
| NASA elegível e substantiva | Até 11h sábado: lista oficial, item NASA, transformação e efeito rastreáveis; dúvidas resolvidas com organização | Não anunciar elegibilidade; nem logo nem fonte genérica compensam a lacuna |
| Núcleo em um dia | Até 18h sábado: uma missão completa, uma falha explicável, reparo preservando objetivo e oráculos de energia/dados | Cortar packs extras/Pareto/efeitos; se não houver jornada até 22h, abandonar promessa de protótipo completo competitivo |
| Escolha real | Duas soluções viáveis com custos distintos; ao menos uma falha de energia e uma de entrega | Recalibrar ou reduzir catálogo; 288 tuplas não substituem decisões interessantes |
| Teste de usuário | Domingo até 11h: 4–6 voluntários, previsão, tarefa sem dica, caso novo e registro de assistência | Sem teste, retirar alegação de aprendizagem; com erros sistemáticos, corrigir ensino antes do pitch |
| Reprodutibilidade | Pacote frio offline, inputs/versionamento, resultados equivalentes, conservação e casos manuais independentes | Retirar “mínimo” se busca não verificada; corrigir divergência antes de expandir |
| Pitch | Até 14h30: demonstração curta mostra falha→explicação→reparo→transferência e fonte operante | Cortar narrativa paralela; congelar build para entrega operacional às 17h |

Para seis participantes, uma regra interna exigente é ao menos quatro preverem corretamente uma alteração nova e justificarem o recurso limitante sem ajuda. É um limiar de produto escolhido, não teste estatístico ou evidência de retenção. Publicar `n`, tarefas, erros e assistência; não converter satisfação em eficácia. Se ninguém estiver disponível, isso reduz materialmente a tese competitiva de A, como mostra a sensibilidade.

A sobrevivência do jogo não exige preservar todo o backlog: primeiro Cerrado completo, depois Litoral como transferência e Eclipse se sua contribuição for distinta e verificável. Essas prioridades precisam constar de revisão do PRD. Uma troca para CLPS ou MODIS permanece decisão explícita de tema, sujeita aos respectivos gates; não deve aparecer disfarçada de novo pack.

## 8. Fontes primárias e limites de uso

Acesso em 14/11/2026. Páginas oficiais indexadas estão identificadas; nenhuma réplica foi usada para certificar Resources. READMEs são fontes primárias sobre alegações de seus autores, não auditorias independentes.

| ID | Fonte e URL | Evidência utilizada |
|---|---|---|
| F01 | [Space Apps — missão](https://www.spaceappschallenge.org/2026/challenges/space-mission-design-game/) · [Resources](https://www.spaceappschallenge.org/2026/challenges/space-mission-design-game/?tab=resources) · [resumo oficial indexado](https://www.spaceappschallenge.org/2026/find-a-team/missionforge/) | Brief indexado; páginas diretas inacessíveis |
| F02 | [GO Team 1849](https://github.com/nasa/spaceapps/discussions/1849) | Fonte dos Resources e IA |
| F03 | [GO Team 1827](https://github.com/nasa/spaceapps/discussions/1827) | Início, preparação e atribuição |
| F04 | [Space Apps 2026](https://www.spaceappschallenge.org/2026/) · [Rio Verde](https://www.spaceappschallenge.org/2026/local-events/rio-verde/) | Datas; limite operacional local preservado |
| F05 | [NASA NTRS 20250002492](https://ntrs.nasa.gov/citations/20250002492) | PDF recuperado; slides 6–7, segmentos e ConOps |
| F06 | [NASA CubeSat 101](https://science.nasa.gov/wp-content/uploads/2023/06/nasa_csli_cubesat_101_508.pdf) | Introdução; desenvolvedores iniciantes |
| F07 | [NASA Build It Yourself](https://science.nasa.gov/mission/webb/game-build-it-yourself/) | Mecânica ciência→instrumento |
| F08 | [Kerbal — descrição do produto pelo publicador](https://store.steampowered.com/app/220200/KSP) | Funcionalidades declaradas |
| F09 | [Space-Mission-Design-Game — autores](https://github.com/NASA-SPACEAPP-2026/Space-Mission-Design-Game) | Sobreposição; sem vínculo NASA inferido |
| F10 | [What IF — autores](https://github.com/Bee92-exe/what-if) | Debrief, retry, procedência; placeholders declarados |
| F11 | [NASA HLS Algorithms](https://hls.gsfc.nasa.gov/algorithms/) · [Data Products](https://hls.gsfc.nasa.gov/data-products/) | QA e limites da alternativa C |
| F12 | [Prefeitura Rio Verde — OBA/MOBFOG](https://www.rioverde.go.gov.br/rio-verde-conquista-medalhas-na-olimpiada-brasileira-de-astronomia-e-astronautica/) | Evidência histórica de público escolar local |
| F13 | [NASA SmallSat 2026 — Power](https://www.nasa.gov/smallsat-institute/sst-soa/power-subsystems/) | Referência de energia; não calibração realizada |
| F14 | [NASA SmallSat 2026 — Communications](https://www.nasa.gov/smallsat-institute/sst-soa/soa-communications/) | Segmentos e ressalva sobre desempenho anunciado |
| F15 | [Space Apps — Lunar Landing Site Navigator](https://www.spaceappschallenge.org/2026/challenges/lunar-landing-site-navigator/) | Enunciado oficial indexado; abertura 502 |
| F16 | [NASA/JPL Horizons Manual](https://ssd.jpl.nasa.gov/horizons/manual.html) | Observador, referenciais e horizonte sem relevo local |
| F17 | [NASA LOLA — South Pole DEMs](https://pgda.gsfc.nasa.gov/data/LOLA_5mpp/) | Terreno, referencial e incerteza |
| F18 | [Space Apps — MODIS/VIIRS](https://www.spaceappschallenge.org/2026/challenges/modis-and-viirs-hot-spots/) · [resumo oficial indexado](https://www.spaceappschallenge.org/2026/find-a-team/celestial-x/) | Calendário histórico e harmonização |
| F19 | [NASA FIRMS Fire Alert Notes](https://firms.modaps.eosdis.nasa.gov/alerts/notes.php) | Resolução, detectabilidade e ausências |
| F20 | [Space Apps — Jukebox](https://www.spaceappschallenge.org/2026/challenges/the-earth-information-jukebox/) · [resumo oficial indexado](https://www.spaceappschallenge.org/2026/find-a-team/proteas/) | Frames EIC e sonificação dinâmica |
| F21 | [NASA SVS — ajuda](https://svs.gsfc.nasa.gov/help/) | Distribuição de sequências de frames |
| F22 | [NASA MODIS — MOD13](https://modis.gsfc.nasa.gov/data/dataprod/mod13.php) | Composição temporal, reflectância e índices; não prova extração nesta frente |
