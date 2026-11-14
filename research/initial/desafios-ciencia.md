# Oito desafios — ciência, dados, exequibilidade e afinidade AB

Nota de pesquisa intermediária para a frente principal. Corte: 14/11/2026. Fontes consultadas em 14/11/2026. Não é implementação nem previsão de premiação. Avaliações de afinidade, execução e diferenciação são julgamento analítico a partir do perfil fornecido, não estatística sobre vencedores.

## Achados que mudam a decisão

1. **Os oito cards pertencem a 2026**, não a 2025. A edição é 14–15/11/2026 e oferece 14 desafios. O título do card CLPS mudou na página atual para **Lunar Landing Site Navigator**. O texto central é equivalente. NASA Science confirma os temas de missões, análogos e SPHEREx na edição 2026. [S1–S4]
2. **NISAR já tem observações públicas reais.** Há BETA, PROVISIONAL e VALIDATED; o conjunto VALIDATED L0–L2 foi lançado em 06/11/2026, para aquisições a partir de 21/10/2026. Portanto, o histórico plenamente validado ainda é muito curto no corte. Não misturar maturidades como se mudanças de processamento fossem mudanças na superfície. [N1–N4]
3. **SPHEREx mudou de release às vésperas do hackathon.** A documentação primária de 12/11/2026 registra DR1 + QR3 como recomendação para novos trabalhos; QR1 foi retirado e QR2 deixou de ser pesquisável. Tutoriais de QR1/QR2 podem estar desatualizados. [P1–P3]
4. **Suomi-NPP deixou de entregar observações em 02/11/2026**, segundo FIRMS. NOAA-20/21 são alternativas atuais. Há diferenças nas datas iniciais de cobertura descritas em páginas FIRMS: a cobertura deve ser conferida por produto/coleção, sem assumir uma data universal para todo VIIRS. [F1–F3]
5. O desafio de fogo pede **calendário histórico harmonizado de atividade de queima por área de interesse**. Um mapa de pontos recentes ou alertas, sozinho, não cumpre seu núcleo. Detecção térmica não equivale a incêndio individual, área queimada ou previsão. [C8, F4–F8]
6. O maior ativo de AB é transformar restrições e dados complexos em decisões compreensíveis. A escolha não deveria ser determinada pela GPU: **acesso, recorte, qualidade e interpretação dos dados dominam o risco** nos oito temas.

## Identificação dos oito enunciados

As páginas de desafio do Space Apps retornaram 502/503 em aberturas diretas nesta sessão. O índice de busca oficial entregou resumos de vários desafios; em outros, o resumo aparece no bloco oficial “About the Challenge” de equipes. A transcrição do evento local HackAthlone ajudou a localizar recursos e detalhes, mas é fonte secundária: não a tratar como enunciado normativo integral. Os fatos de ciência abaixo foram confirmados em NASA/JPL/IRSA/ASF/USGS, não na transcrição local.

| Card de AB | Título inglês / página oficial 2026 | Pedido central, em paráfrase | Verificação obtida |
|---|---|---|---|
| Navegador de missões lunares CLPS | **Lunar Landing Site Navigator** — https://www.spaceappschallenge.org/2026/challenges/lunar-landing-site-navigator/ | Facilitar comparação de locais e datas lunares, mostrando Sol e Terra em relação ao horizonte para avaliar potencial solar e visibilidade direta da Terra. | Resumo oficial direto [C1]; nome anterior CLPS continua em páginas de equipes. |
| A Jukebox de Informações da Terra | **The Earth Information Jukebox** — https://www.spaceappschallenge.org/2026/challenges/the-earth-information-jukebox/ | Associar frames do Earth Information Center a sonificações dinâmicas, tornando a ciência terrestre multissensorial. | Título oficial direto e resumo no bloco oficial de equipe [C2]. |
| Planeta X e SPHEREx | **Planet X and SPHEREx** — https://www.spaceappschallenge.org/2026/challenges/planet-x-and-spherex/ | Ferramenta web pública para comparar imagens SPHEREx ao longo do tempo e perceber mudanças/movimento. | Resumo oficial no bloco de equipe [C3]; detalhes adicionais transcritos localmente. |
| Locais terrestres semelhantes à Lua/Marte | **Identify Earth Locations that Analog the Permanent Moon Base Locations and Mars** — https://www.spaceappschallenge.org/2026/challenges/permanent-moon-base-locations-and-mars/ | Identificar e caracterizar novos análogos terrestres com dados abertos da Terra, Lua e Marte, apresentando mapa/visualização/ferramenta. | Resumo oficial direto [C4]. |
| Dançando com os SARs | **Dancing with the SARs** — https://www.spaceappschallenge.org/2026/challenges/dancing-with-the-sars/ | Aplicação interativa usando NISAR para acompanhar e comunicar um ou mais tipos de mudança da superfície. | Título e texto em eventos locais; página oficial inacessível nesta consulta. Ciência e disponibilidade verificadas em ASF/NASA. [C5, N1–N7] |
| Guia de sobrevivência interplanetário | **Interplanetary Survival Guide: Martian Map** — https://www.spaceappschallenge.org/2026/challenges/interplanetary-survival-guide-martian-map/ | Integrar camadas de missões NASA para um lugar/rota de exploração humana em Marte. | Título oficial indexado [C6]; detalhes locais apontam dados de missões NASA. |
| Jogo de design de missões espaciais | **Space Mission Design Game** — https://www.spaceappschallenge.org/2026/challenges/space-mission-design-game/ | Jogo para projetar, gerir e simular missão, expondo efeitos das decisões de engenharia e recursos limitados. | Resumo no bloco oficial de equipe [C7]; detalhes locais; fundamento de engenharia em NASA [G1–G2]. |
| Harmonização de focos MODIS/VIIRS | **Harmonization of MODIS and VIIRS Hot Spots** — https://www.spaceappschallenge.org/2026/challenges/modis-and-viirs-hot-spots/ | Aplicação web que harmonize os registros em um calendário de atividade de queima, para comparar padrões históricos, períodos críticos e condições incomuns dentro de uma AOI. | Resumo oficial direto [C8]. |

Não confundir **Space Mission Design Game** com o desafio separado **Build a Junior Astronaut Mission Trainer**, também em 2026.

## Matriz: afinidade não é chance de ganhar

Escala 1–5. Execução considera 48 horas, recorte controlado, equipe sem coautor astro/geocientista confirmado e sem experiência em jogos/áudio confirmada. Diferencial é potencial **se o núcleo for demonstrado**, não exclusividade comprovada no universo de inscrições.

| Tema | Afinidade AB | Execução defensável | Potencial de diferencial | Dependência especialista | Leitura |
|---|---:|---:|---:|---|---|
| Mission Design Game | **5** | **4** | 4 | Média | Forte conexão com React Flow, sistemas, telemetry, UX e explicação causal. O risco é criar configurador bonito sem jogo nem física coerente. |
| CLPS / Lunar Navigator | **5** | 3 | **4,5** | Média/alta | Excelente problema de UX de comparação e replanejamento. Horizonte local, referenciais e validação aumentam o custo. |
| MODIS/VIIRS | **4,5** | 3 | **4,5** | Alta para inferência | Forte aderência a mapas/dados e contexto brasileiro. A harmonização é o produto; não pode ficar só no discurso. |
| Mars Map | **4,5** | **4** | 3,5 | Média | Forte em jornadas, mapas e camadas. Precisa resolver uma decisão local melhor que uma simples coleção de mapas existentes. |
| Earth Jukebox | 4 | **4** | 4 | Média, áudio/acessibilidade | Oportunidade real para UX Research. Sem prática de áudio e usuários alvo, acessibilidade e boa sonificação continuam hipóteses. |
| Análogos Terra/Lua/Marte | 3,5 | 3,5 | 3,5 | Alta para caracterização | Descoberta guiada e explicação de similaridade são boas interfaces; provar analogia útil é o centro científico. |
| NISAR | 3,5 | 2,5 | **4,5** | Alta | Dados muito recentes, impacto visual forte, muita chance de confundir geometria/processamento com fenômeno real. |
| SPHEREx | 3 | 2,5 | 4 | Alta | Produto de exploração pública promissor; alinhamento, bandas, flags e releases exigem domínio astronômico. |

**Recomendação sob as condições atuais:** Mission Design Game é a escolha mais robusta para transformar a bagagem confirmada de AB em uma entrega completa. CLPS é a aposta com maior encaixe de produto especializado, desde que a equipe consiga verificar a geometria. Fogo tem grande potencial de impacto e dados, mas sua seleção deve depender de um gate de harmonização, não de uma preferência por mapa/dashboard. Não há base para prometer finalista.

**Gate de escolha em 60–90 minutos (proposta, não regra do evento):**

- Jogo: demonstrar em papel/código descartável uma missão do objetivo ao resultado, com pelo menos três decisões acopladas, uma falha explicável e uma correção. Se não houver loop interessante após 3 testes formativos, reconsiderar.
- CLPS: obter dois locais × duas datas com azimute/elevação Sol/Terra, convenções consistentes e comparação reproduzível contra Horizons/Moon Trek; incluir um horizonte local pré-calculado. Se só houver esfera lisa, reduzir a alegação e avaliar se o diferencial continua suficiente.
- Fogo: obter histórico de uma AOI com período de sobreposição; mostrar descontinuidade entre sensores; testar correção simples em período/área reservados; definir como cobertura observacional será obtida. Se só há CSV de detecções e nenhuma resposta para missingness, não prometer calendário cientificamente harmonizado.

Se houver mentor de sensoriamento remoto e os dados já estiverem prontos, Fogo pode ultrapassar o Jogo. Se houver apoio de efemérides/geodesia, CLPS pode ultrapassá-lo. Essas são condições observáveis de decisão.

## Oportunidade e recorte por tema

### Mission Design Game

Proposta de produto: uma missão científica curta como jogo de decisões. O usuário escolhe objetivo, instrumento, energia, enlace e órbita dentro de um pequeno catálogo fundamentado. O jogo mostra o ciclo de operação e um debrief: qual decisão tornou impossível transmitir/gerar a ciência. Um fluxo visual pode representar dependências; o jogador deve conseguir experimentar, falhar e aprender.

Direção convergente com a frente principal: missão LEO de observação da Terra com contexto do Cerrado; motor determinístico; orçamentos de massa, energia e dados; replay contrafactual de uma escolha. O contexto local dá sentido ao objetivo científico sem exigir que o jogo também implemente um sistema operacional de detecção de incêndios. O sucesso pode ser definido por ciência entregue e restrições cumpridas. Catálogo e parâmetros devem usar referências NASA atuais e explicitar parâmetros didáticos. A frente principal encontrou NASA SmallSat State of the Art 2026 (https://www.nasa.gov/smallsat-institute/sst-soa/) como complemento atual ao CubeSat 101; esta frente não fez leitura integral desse relatório.

Recorte: **uma** missão, 6–10 componentes, 3–4 recursos, 10–15 minutos de experiência. NASA distingue segmentos de lançamento, espacial, terrestre e usuário; incluir o caminho até a ciência entregue ajuda a representar uma missão completa [G1]. O CubeSat 101 oferece base de referência, mas seus valores antigos não são preços atuais [G2].

Modelo pedagógico proposto: massa total e capacidade; orçamento rastreável; balanço de energia ao longo do tempo; geração, armazenamento e transmissão de dados. Distinguir potência W de energia Wh. Estados operacionais e dependências são mais valiosos que um score opaco. Simplificações devem estar documentadas; valores fictícios devem ser rotulados como parâmetros de cenário. Não precisa tentar integrar GMAT ao vivo para cumprir a experiência.

Diferencial verificável: debrief causal, comparação de duas arquiteturas viáveis, ganho observado de compreensão em tarefas antes/depois. Amostra pequena é evidência formativa, não demonstração de eficácia educacional generalizável. Plano B: turnos/sessão local, sem multiplayer simultâneo; cenário determinístico; interface 2D com operações completas.

### CLPS / Lunar Landing Site Navigator

Proposta: comparação lado a lado de 2–3 locais e datas, timeline conjunta de Sol/Terra, maior intervalo contínuo de sombra, janelas simultâneas e explicação do efeito de adiar o pouso. Isso serve bem à experiência AB com rastreamento e telemetria.

Horizons fornece azimute/elevação topocêntricos e aceita observadores na superfície lunar; a elevação é relativa ao plano perpendicular ao zênite, não automaticamente ao relevo real [L1]. LOLA tem produtos abertos de topografia/iluminação; médias de 18,6 anos não substituem uma janela operacional específica [L2]. Há DEMs de 5 m/pixel para regiões selecionadas, com interpolação e incerteza relevantes [L3].

Rigor: coordenadas/referencial lunar, convenção longitude, UTC e tempo da efeméride, altura do observador, horizonte de terreno por azimute, raio aparente do Sol/Terra e passo temporal. Visibilidade do centro da Terra não garante link: antena, margem, potência, estação terrestre e disponibilidade da rede são outros fatores. Elevação solar isolada não é geração elétrica: orientação/área/eficiência do painel e sombras entram no modelo. Dizer “potencial” e “visibilidade geométrica” quando esses subsistemas não estiverem modelados.

Plano B: 3 locais curados, perfis de horizonte pré-calculados, datas limitadas e arquivos locais; não permitir pin global se não houver cobertura de terreno. 3D é secundário ao comparador e à precisão das janelas.

### MODIS/VIIRS — análise aprofundada

Produto: calendário de atividade histórica de queima para uma AOI brasileira, com marcação explícita de sensor/versão/cobertura, sazonalidade, anomalias retrospectivas e incerteza. O serviço deve permitir comparar o dado observado e o índice padronizado para o usuário entender a correção.

**O que o dado significa.** MODIS ativo nominalmente 1 km; VIIRS I-band 375 m. VIIRS detecta mais eventos pequenos/fracos e tem melhor desempenho noturno. A dimensão real do footprint varia; `scan` e `track` não são decoração. Sensores observam em horários distintos. Um ponto corresponde à localização aproximada de um pixel com anomalia térmica, não a um polígono de incêndio. Vulcões, flares e outras fontes podem aparecer. Nuvens, fumaça espessa, copa, horário de passagem e falhas de aquisição criam omissões. [F4–F7]

**Não fazer:** somar todas as plataformas e chamar a curva de número de incêndios; multiplicar MODIS por 7,11 por causa da razão nominal de áreas; interpolar nuvens como zero; converter número de focos diretamente em hectares; afirmar previsão de ignição baseada apenas na sazonalidade histórica; igualar as escalas de confiança MODIS 0–100 e VIIRS l/n/h.

**FRP.** É potência radiativa integrada do pixel, em MW, não área queimada nem temperatura do fogo. No VIIRS 375 m, o cálculo usa informação de 750 m; uma FRP pode ser dividida entre pixels menores coincidentes, portanto valores iguais não são necessariamente duplicatas. Zero de FRP pode representar falha da recuperação/saturação, mesmo havendo detecção. Somar valores adequados dentro de uma passagem pode ter sentido; somar sucessivas passagens não dá energia sem integração temporal defensável. [F6–F8]

**Dados e acesso.** FIRMS oferece CSV/mapas/API e arquivo histórico. Para análise retrospectiva escolher produtos standard/science-quality e guardar a coleção; NRT pode ter geolocalização diferente e lacunas, sendo depois substituído no arquivo. Uma chave/API e Earthdata Login podem ser necessários conforme via. Não garantir API ilimitada ou fazer download nacional inteiro no hackathon. Usar um recorte e cache reproduzível. [F1, F5, F9]

**Cobertura é indispensável.** CSV de pontos não traz os pixels que foram observados sem fogo, os cobertos por nuvem e os que faltaram. Para denominador observacional, buscar fire masks/QA completos L2 ou produto de cobertura adequado. `fire mask` distingue classes relevantes, incluindo missing/poor-quality, cloud, non-fire, insufficient background. Se não for possível obter isso, publicar análises por sensor com aviso de cobertura desconhecida; não apresentar ausência de focos como ausência de fogo. [F7, F8]

**Harmonização proposta, com rigor viável.** É um desenho de método para o protótipo, não algoritmo NASA validado:

1. Definir o estimando: índice de **detecções comparável sob um protocolo de observação de referência**, nunca número verdadeiro de incêndios. Recortar uma AOI/bioma, uma janela temporal e um tamanho de grade/semana. Testar sensibilidade da agregação espacial.
2. Preservar plataforma, sensor, versão, data/hora UTC, dia/noite, footprint, qualidade e FRP. Separar standard/NRT. Retirar fontes estáticas somente com classificação/regras documentadas e mostrar o efeito.
3. Construir observações em comum entre sensores no período sobreposto, condicionando a janelas próximas e geometria aceitável; não atribuir toda divergência a resolução se há diferente horário. Harmonizar dentro do suporte observado, evitando extrapolar regimes de fogo nunca vistos no treino.
4. Para célula g, semana t e sensor s, formar contagem Y(g,t,s), exposição E(g,t,s) em oportunidades válidas de observação em área comum, e covariáveis x de horário, ângulo, tipo de cobertura etc. Um baseline adequado é regressão de contagem sobredispersa:

   `Y_gts ~ NegBin(mu_gts, k)`

   `log(mu_gts) = log(E_gts) + alpha_g + f_ciclica(semana_t) + beta_s + gamma'x_gts`

   O efeito sensor pode interagir com bioma/estação. Predizer sob o mesmo sensor/protocolo de referência fornece um índice padronizado. Sem calibração externa, o fator de detectabilidade e a atividade verdadeira não são separáveis; não chamar o latente de verdade. Um ajuste simples/monótono pareado pode ser melhor que esse modelo se a amostra for pequena.

   A exposição deve ter suporte físico consistente (por exemplo, área válida × passagens dentro da mesma janela), e não simplesmente quantidade bruta de pixels de tamanhos diferentes. Padronizar a grade não iguala a detectabilidade. As detecções se agrupam espacial/temporalmente; intervalos devem respeitar dependência por blocos/evento, não assumir que cada foco é amostra independente.
5. Para o MVP, contrastar (a) curva bruta; (b) só uma plataforma; (c) correção simples na sobreposição; (d) modelo com exposição, se houver suporte. Nenhum modelo sofisticado sem ganho demonstrado sobre baseline.
6. Treinar e ajustar em anos/blocos espaciais separados; reservar anos inteiros e locais distintos. Focos próximos do mesmo episódio não podem aparecer aleatoriamente em treino e teste. Normalização, escolha de limiar e ajuste sazonal só veem treino. Para avaliação de anomalia de um ano, não incluir esse ano no baseline histórico.
7. Relatar viés entre sensores, erro de agregados semanais/mensais, estabilidade sazonal e cobertura dos intervalos. Mostrar onde o modelo falha. Se usar burned-area/relato como validação externa, esclarecer que são observáveis diferentes e não verdade perfeita. Produto derivado do mesmo MODIS/VIIRS não é confirmação totalmente independente.

Uma razão simples calibrada em 2012–2020 não é automaticamente aplicável a 2026: constelação, horários, processamento e regimes de fogo podem mudar. Um calendário com incerteza e rastreabilidade é mais defensável que “IA prevê incêndios”.

Plano B: AOI única, agregados semanais/mensais, histórico fechado com dados standard, um par sensor/plataforma e janela de sobreposição; exportação de relatório. Se a harmonização não resistir ao holdout, mostrar honestamente limites e dados separados, embora isso enfraqueça cumprimento do desafio.

### NISAR — análise aprofundada

Escolher um fenômeno e uma região com cenas reais comparáveis, preferivelmente inundação/variação de água bem documentada; evitar “detecta queimadas, agro, geleiras e terremotos” no mesmo MVP.

NISAR L-band está disponível no ASF, com Earthdata Login para downloads. GCOV é produto L2 geocodificado, retroespalhamento gamma-0 com correção radiométrica/terreno; é ponto de entrada muito melhor que dados brutos. A documentação de GCOV fala em pixel spacing 10/20 m; a tabela geral inclui 80 m em modos específicos. Não confundir grade com resolução efetiva nem prometer detalhe centimétrico no mapa. A missão descreve resolução SAR 3–10 m dependente de modo, repetição orbital 12 dias e visita média ~6 dias combinando ascendente/descendente; isso não significa par interferométrico de mesma geometria a cada seis dias. [N4–N7]

No corte: PROVISIONAL desde julho, com aquisições junho–outubro; VALIDATED só a partir de 21/10. Um gap permanente está documentado entre 27/07 e 10/08/2026. Há versões antigas em formato NISAR que usam ALOS-1 PALSAR/UAVSAR e protótipos Sentinel-1: rotular claramente surrogate/simulado versus medido pelo NISAR. [N1–N3, N8]

Método mínimo proposto: mesmos frame/track/orbit direction/polarização/frequência/maturidade/CRID; interseção espacial; máscaras; comparação de backscatter em dB ou log-ratio com tratamento de speckle; datas e geometria expostas. Não misturar ascendente e descendente como se diferenças de olhar fossem mudanças de terreno. Inundação pode reduzir retroespalhamento de água aberta, mas vegetação inundada pode produzir outra resposta. Mudança de amplitude sozinha não identifica causa. InSAR exige coerência, fase, componente linha-de-visada, geometria e correções; não converter fase colorida diretamente em “deslocamento vertical”.

Validação: amostras independentes de evento/área, dados ópticos quando disponíveis e referência externa; separar treino/teste por região/evento. Evitar derivar “verdade” do mesmo limiar usado no modelo. Mostrar regiões desconhecidas, sombra/layover e insuficiência de dados. Não exigir modelo de ML no MVP.

Plano B: duas cenas L2 coerentes em uma AOI, visualizador antes/depois com metodologia, máscara e história causal cautelosa. Harmony permite extração/subsetting/reprojeção para COG; reduzir volume antes de baixar [N6]. O hardware AB é suficiente para esse recorte; processamento bruto, global ou múltiplos produtos pode consumir o hackathon.

### SPHEREx

Proposta: observatório público de mudanças com alvos guiados, RA/Dec, blink de épocas registradas e apresentação honesta das flags. Os alvos sugeridos no detalhamento transcrito incluem Barnard’s Star, Epsilon Indi B, WISE 0855, RW Aurigae e R Draconis. Usar alvo conhecido para prova funcional; não prometer descoberta do Planeta X.

DR1 reúne Surveys 1/2 reprocessados e acrescenta All-Sky Cubes; QR3 cobre Surveys 3/4 com processamento compatível. Guardar release e IDs [P1]. FITS contém imagem, flags, variância, previsão zodiacal, PSF e tabela de comprimento de onda. O comprimento de onda varia dentro da imagem; imagens simultâneas dos seis detectores não são simplesmente seis vistas do mesmo campo [P3].

Riscos: WCS, alinhamento astrométrico, PSF/seeing instrumental, máscaras, bandas, background zodiacal e calibragem podem criar aparente mudança. Variabilidade de brilho não equivale a movimento. É preciso comparar bandas/épocas compatíveis; diferença de pixels sem registro é enganosa. Acesso aberto não elimina volume/latência. A interface IRSA já permite bastante exploração: diferencial seria jornada acessível, comparação temporal verificável e explicação, não apenas outro viewer.

Plano B: três cutouts de alvos conhecidos e épocas pré-cacheadas, sem espectro ao vivo nem descoberta automática; incluir a origem e as incertezas. Requer mais apoio astronômico que as alternativas principais.

### Mars Map

Proposta: uma exploração fictícia em Jezero ou Gale com objetivo científico claro, 3 camadas reais e uma rota comparada. Apresentar mapa local, perfil de inclinação, pontos científicos e incertezas; mostrar a razão de escolher a rota. NASA Trek oferece camadas WMTS e ferramentas de distância/elevação [M1]. CTX tem imagem nominal ~6 m/pixel; HiRISE chega a escala submétrica em áreas alvo; terreno global grosseiro não detecta toda pedra ou obstáculo [M2–M3].

Riscos: misturar resoluções, projeções/datum, épocas e extrapolar interpolação como detalhe; estimar segurança individual real de astronauta sem modelo validado de traje, fadiga, exposição e terreno. Não chamar “condição atual” uma camada histórica. Dados de temperatura/radiação muitas vezes têm cobertura regional ou medição local, não uma superfície perfeita sobre toda a rota.

Plano B: região pequena bem documentada, topografia/óptico/geologia estáticos, parâmetros de energia/tempo de caminhada como cenário educacional explícito, sem previsão de tempo em Marte. Diferencial fica na decisão contextual, não no globo 3D.

### Análogos terrestres

Proposta: matcher explicável por objetivos de ensaio. Usuário define o que quer testar (mobilidade, geologia, operação em terreno árido, isolamento), e compara candidatos com mapa, atributos, fonte e limitações.

Rigor proposto: similaridade não é identidade. Não há local terrestre com gravidade, pressão, radiação e ambiente completos da Lua/Marte. Pesos de relevo, aridez, litologia, temperatura e acesso precisam estar relacionados ao ensaio. Normalizar unidades; documentar missingness; mostrar sensibilidade do ranking aos pesos. Não usar embedding de foto para afirmar equivalência geológica. “Novo” candidato precisa pesquisa para não só renomear análogo conhecido; validação de campo não cabe em 48h.

Plano B: comparar 3–5 áreas com métricas rastreáveis e uma tarefa concreta de teste, explicitando o que cada local reproduz e o que não reproduz. Análogos brasileiros podem criar narrativa forte, mas a alegação geológica precisa apoio.

### Earth Jukebox

Proposta: três visualizações EIC e regras audíveis consistentes, controle de tempo/variável, legenda sonora, texto descritivo e navegação por teclado. A coleção NASA SVS/EIC está aberta para obtenção dos visuais [J1].

Rigor proposto: cor de frame pode incluir legenda, continente, títulos e estética; não é automaticamente valor científico. Segmentar a região do dado, respeitar escala temporal/espacial e declarar se a transformação usa pixel visual ou variável física. Não inferir concentração numérica apenas de cor sem escala válida. Som agradável não demonstra acessibilidade. Com usuários cegos/baixa visão, testar tarefas concretas (identificar aumento, máximo, região) e preferências; sem esses usuários, apresentar como protótipo a validar.

Plano B: regras determinísticas, síntese simples e 2–3 sequências curadas; sem IA musical e sem promessa de leitura de qualquer vídeo. Excelente potencial de Art & Technology, mas AB não tem experiência confirmada em sonificação; reservar tempo para áudio de verdade.

## Infraestrutura AB

As máquinas descritas são suficientes para aplicações React/TS, mapas e modelos estatísticos em AOIs pequenas. RTX 3070/2060 SUPER de 8 GB não precisam ser critério de escolha; treinamento grande e processamento global introduzem custo sem necessidade. Mac M-series 24 GB e i9 ajudam em manipulação raster, mas RAM/disco reais e largura de banda devem ser medidos; não assumir configuração do Mac mini. Pré-processar pequenos conjuntos reproduzíveis, servir COG/tiles/JSON/Parquet conforme necessidade e manter demonstração offline. Credenciais Earthdata/API ficam no backend/ambiente, não no frontend.

## Fontes e refs para o agente principal reabrir/citar

### Edição / enunciados

- S1 — https://www.spaceappschallenge.org/2026/ — `turn4search6`, `turn38search1`.
- S2 — https://www.spaceappschallenge.org/2026/challenges/?linkId=1029316445 — `turn4search3` / `turn11search0` (14 desafios).
- S3 — https://science.nasa.gov/universe/nasa-welcomes-all-ages-experience-levels-for-space-apps-challenge/ — `turn4search7` (NASA, edição 2026).
- S4 — https://assets.spaceappschallenge.org/media/documents/2026_NASA_Space_Apps_Registration_Recruitment.pdf — `turn4search9`, `turn38search7`.
- C1 — https://www.spaceappschallenge.org/2026/challenges/lunar-landing-site-navigator/ — `turn16search2`; nome anterior no bloco oficial https://www.spaceappschallenge.org/2026/find-a-team/orbitforge1/ — `turn16search0`.
- C2 — https://www.spaceappschallenge.org/2026/challenges/the-earth-information-jukebox/ — `turn22search0`; resumo oficial https://www.spaceappschallenge.org/2026/find-a-team/proteas/ — `turn22search6`.
- C3 — https://www.spaceappschallenge.org/2026/find-a-team/exomapper/ — `turn16search4`, `turn25search5`, bloco “About the Challenge”.
- C4 — https://www.spaceappschallenge.org/2026/challenges/permanent-moon-base-locations-and-mars/ — `turn4search4`, `turn25search0`.
- C5 — fonte secundária para detalhes: https://hackathlone.com/challenges/dancing-with-the-sars — `turn11search2`.
- C6 — título oficial https://www.spaceappschallenge.org/2026/challenges/interplanetary-survival-guide-martian-map/?tab=teams — `turn4search5`, `turn25search1`; transcrição secundária https://hackathlone.com/challenges/interplanetary-survival-guide-martian-map — `turn48view2`.
- C7 — resumo oficial https://www.spaceappschallenge.org/2026/find-a-team/missionforge/ — `turn16search1`, `turn25search3`; transcrição secundária https://hackathlone.com/challenges/space-mission-design-game — `turn48view1`.
- C8 — https://www.spaceappschallenge.org/2026/challenges/modis-and-viirs-hot-spots/ — `turn2search8`, `turn57search0`.
- Detalhe secundário CLPS atual: https://hackathlone.com/challenges/lunar-landing-site-navigator — `turn58view0`.
- Detalhe secundário Jukebox: https://hackathlone.com/challenges/the-earth-information-jukebox — `turn48view3`.

### Fogo

- F1 — https://firms.modaps.eosdis.nasa.gov/download/ — `turn40search3` (arquivo, quality, cobertura).
- F2 — https://firms.modaps.eosdis.nasa.gov/content/notifications/firms/news.html — `turn40search2` (fim entrega S-NPP 02/11/2026).
- F3/F6 — https://firms.modaps.eosdis.nasa.gov/content/descriptions/FIRMS_VIIRS_Firehotspots.html — `turn38search5`, `turn40search4` (metadados, FRP, horários, confidence).
- F4 — https://firms2.modaps.eosdis.nasa.gov/alerts/notes.php — `turn27search9` (omissões, resolução e cautelas).
- F5 — https://firms.modaps.eosdis.nasa.gov/content/active_fire/ — `turn27search8` (standard versus NRT).
- F7 — https://viirsland.gsfc.nasa.gov/PDF/VIIRS_activefire_User_Guide.pdf — `turn40search7` (FRP fracionária/zeros e máscaras).
- F8 — https://modaps.modaps.eosdis.nasa.gov/services/about/products/viirs-land-c1/VNP14IMG.html — `turn40search0`; especificação https://ladsweb.modaps.eosdis.nasa.gov/filespec/VIIRS/1/VNP14IMG — `turn40search1`.
- F9 — https://modaps.modaps.eosdis.nasa.gov/services/about/products/viirs-land-c2-nrt/vnp14imgtdl_nrt.html — `turn40search5` (diferenças de geolocalização/reprocessamento NRT).
- Guia adicional primário USGS: https://lpdaac.usgs.gov/documents/427/VNP14_User_Guide_V1.pdf — `turn40search6`.

### NISAR

- N1 — https://nisar-docs.asf.alaska.edu/availability-overview/ — `turn58view1` (fonte mais atual e detalhada; datas/release/gap).
- N2 — https://nisar-docs.asf.alaska.edu/products-overview/ — `turn35view2`, `turn27search2` (maturidade e tipos).
- N3 — https://asf.alaska.edu/notices/nisar-l-band-data-now-publicly-available/ — `turn27search0` (anúncio julho).
- N4 — https://nisar-docs.asf.alaska.edu/gcov/ — `turn27search3`.
- N5 — https://science.nasa.gov/mission/nisar/mission-overview/ — `turn27search5` (revisita, modo, L/S).
- N6 — https://nisar-docs.asf.alaska.edu/earthdata-search/ — `turn27search4` (login, subsetting Harmony/COG).
- N7 — https://science.nasa.gov/mission/nisar/ — `turn27search1`.
- N8 — https://science.nasa.gov/mission/nisar/data/ — `turn27search7` (surrogates ALOS/UAVSAR/protótipos).
- Repo oficial para conferência: https://github.com/ua-asf/nisar-docs/blob/develop/data-availability/availability-overview.md — `turn29search1`.

### SPHEREx / lunar / Marte / jogo / áudio

- P1 — https://caltech-ipac.github.io/spherex-archive-documentation/spherex-data-releases/ — `turn35view3`, `turn29search2` (12/11/2026).
- P2 — https://irsa.ipac.caltech.edu/Missions/spherex.html — `turn29search3`.
- P3 — https://irsa.ipac.caltech.edu/onlinehelp/spherex/spherex/visualization.html — `turn57search2`.
- L1 — https://ssd.jpl.nasa.gov/horizons/manual.html — `turn55search0`.
- L2 — https://pgda.gsfc.nasa.gov/products/69 — `turn55search2` (illumination, averages, COG cautions).
- L3 — https://pgda.gsfc.nasa.gov/products/78 — `turn55search1` (DEMs 5 m e incertezas).
- L4 — https://naif.jpl.nasa.gov/pub/naif/toolkit_docs/C/req/dsk.html — `turn55search4` (geometria de terreno/horizonte).
- M1 — https://trek.nasa.gov/ — `turn55search3` (WMTS e ferramentas).
- M2 — https://science.nasa.gov/resource/a-decade-of-compiling-the-sharpest-mars-map/ — `turn57search6` (CTX 6 m).
- M3 — https://science.nasa.gov/resource/first-mars-image-from-newly-arrived-camera-2/ — `turn57search7` (escala HiRISE); https://science.nasa.gov/mission/mars-reconnaissance-orbiter/science-instruments/ — `turn57search4`.
- G1 — https://www.nasa.gov/wp-content/uploads/2025/04/250323-design-and-develop-science-mission.pdf — `turn53view1` (engenharia e segmentos).
- G2 — https://www3.nasa.gov/sites/default/files/atoms/files/nasa_csli_cubesat_101_508.pdf — `turn53view2`.
- J1 — https://svs.gsfc.nasa.gov/gallery/earth-information-center/ — `turn50view1`.

## Limites desta frente

Não baixei cenas científicas nem executei consultas autenticadas de AOI; confirmei disponibilidade documental e caminhos de acesso. Nenhuma métrica de desempenho/validação foi medida. Os modelos, planos B e gates são propostas próprias. O acesso direto ao texto integral de algumas páginas oficiais falhou, portanto detalhes que só apareceram na transcrição local devem ser revalidados no enunciado visível antes de fechar escopo. Não há prova de exclusividade das ideias nem base para uma probabilidade de premiação.
