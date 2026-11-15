# R18 — Bennu e Webb: da fonte científica ao resultado do jogo

**15/11/2026 · MISSÃO IPÊ.** Esta revisão substitui as rugosidades e intensidades inventadas das duas expedições por resultados científicos publicados. A entrega didática continua separada da observação histórica: mudar bateria, instrumento ou contato muda **quais registros chegam**, nunca o valor medido ou sua incerteza.

O Cerrado conserva seus arquivos históricos Terra/MODIS. Os três casos agora usam dados reais para exercitar perguntas diferentes: mudança de vegetação, comparação de dimensões de rochas e interpretação de um espectro. IPÊ é a equipe e a marca, sem papel na história científica.

## Bennu: que tamanhos aparecem nas rochas investigadas?

A OSIRIS-REx encontrou material brilhante entre rochas escuras de Bennu. DellaGiustina e colegas combinaram imagens, terreno e espectroscopia para investigar esse material. A semelhança de espectros de piroxênio com meteoritos HED sustenta a discussão sobre uma origem associada à família de Vesta. **O tamanho sozinho não estabelece essa origem.** [Artigo arquivado pela NASA](https://ntrs.nasa.gov/citations/20205007912) · [explicação NASA](https://www.nasa.gov/solar-system/nasas-osiris-rex-to-asteroid-bennu-youve-got-a-little-vesta-on-you/).

O exercício usa uma parte concreta desse estudo: o **eixo maior**, em metros, de seis rochas/clastos da Tabela Suplementar 1. Os eixos foram medidos com imagens PolyCam registradas sobre terreno obtido pelo altímetro OLA. Os métodos listam imagens de morfologia de 27 de fevereiro a 28 de março de 2019; a tabela não atribui um horário individual a cada dimensão. [Suplemento original](https://static-content.springer.com/esm/art%3A10.1038%2Fs41550-020-1195-z/MediaObjects/41550_2020_1195_MOESM1_ESM.pdf), página física 12, impressa 11.

| ID do exercício | Objeto na tabela | Eixo maior (m) |
| --- | --- | ---: |
| `bennu-site-1` | Sítio 1 | 1,53 |
| `bennu-site-2` | Sítio 2 | 3,93 |
| `bennu-site-3` | Sítio 3 | 2,62 |
| `bennu-site-4a` | Clasto 4a | 1,6 |
| `bennu-site-5` | Sítio 5 | 3,221 |
| `bennu-site-6` | Sítio 6 | 1,453 |

A tabela integral tem sete linhas porque o sítio 4 contém os clastos 4a e 4b. O jogo seleciona um objeto de cada sítio; **4b, com eixo maior de 0,927 m, permanece no CSV de auditoria**. Não houve média, interpolação ou duplicação para completar os seis registros.

A legenda limita a precisão dos eixos pela escala de **5,25 cm/pixel**. Essa escala não é uma barra de erro estatístico de ±1σ. A precisão vertical estimada de 1 cm refere-se à altura por OLA, não ao eixo maior. Os algarismos originais são preservados para rastreabilidade, sem prometer precisão adicional.

O participante aprende a comparar escalas e a separar dado disponível a bordo de dado entregue ao solo. Um contato ampliado pode liberar mais registros da mesma medida histórica. O jogo não reprocessa imagens PDS brutas, calcula rugosidade, certifica pouso ou projeta essas coordenadas sobre o GLB. Não foi verificado registro cartográfico entre o modelo NASA e a tabela. A imagem contextual publicada pela NASA não é apresentada como seis fotografias individuais desses registros.

Downloads da versão publicada: [seis registros](../lab/data/science/bennu-records.json) · [tabela completa em CSV](../lab/data/science/bennu-table1.csv) · [proveniência e hashes](../lab/data/science/bennu-provenance.json). No repositório: [pesquisa e extração](https://github.com/oalexandrebelo/MISSAO-IPE/tree/main/research/bennu-r18).

## Webb: quanta luz foi bloqueada em cada faixa?

Em 10 de julho de 2022, o NIRSpec/PRISM do Webb observou o trânsito de WASP-39 b. A NASA anunciou evidência de CO₂ em 25 de agosto daquele ano. Durante um trânsito, parte da luz estelar é bloqueada; a variação desse bloqueio com o comprimento de onda pode carregar informação atmosférica. [Explicação NASA da descoberta](https://science.nasa.gov/missions/webb/nasas-webb-detects-carbon-dioxide-in-exoplanet-atmosphere/).

O conjunto escolhido é a redução **FIREFLy**, com 95 pontos, do [NASA Exoplanet Archive](https://exoplanetarchive.ipac.caltech.edu/cgi-bin/atmospheres/nph-firefly?atmospheres=&planet=WASP-39%20b). Os valores foram conferidos também contra os [dados dos autores, DOI 10.5281/zenodo.6959427](https://doi.org/10.5281/zenodo.6959427). O jogo seleciona seis bins existentes próximos das âncoras 3,6; 3,9; 4,2; 4,3; 4,5 e 4,9 µm. Um **bin** é uma pequena faixa do espectro: os seis bins pertencem ao mesmo trânsito, não a seis exposições nem a duas observações de três bandas.

| Linha entre os 95 pontos | Comprimento de onda (µm) | Luz bloqueada (%) | Incerteza (pontos percentuais, 1σ) |
| --- | ---: | ---: | ---: |
| 25 | 3,59308 | 2,13814 | 0,01009 |
| 39 | 3,89121 | 2,10084 | 0,01222 |
| 54 | 4,19111 | 2,13836 | 0,01171 |
| 58 | 4,30310 | 2,24669 | 0,01259 |
| 65 | 4,49196 | 2,22426 | 0,01393 |
| 80 | 4,89040 | 2,15689 | 0,01512 |

A grandeza é a profundidade de trânsito, `(Rp/R★)² × 100`, não fluxo relativo. O arquivo dos autores fornece a fração absoluta: multiplicar o valor e sua incerteza por 100 produz porcentagem e pontos percentuais, respectivamente. A tabela do arquivo NASA já apresenta os valores arredondados utilizados no exercício. Não houve ajuste de curva, criação de dados intermediários ou digitalização de uma figura.

As barras de 1σ expressam as incertezas publicadas daquela redução. Não são garantia de que o valor real esteja dentro da barra, nem indicam que dois pontos sejam independentes. O recorte não fornece covariância entre bins. O participante pode descrever a variação dos pontos recebidos, mas **não refazer a significância da detecção de CO₂, estimar abundâncias ou anunciar vida** com esses seis valores.

A decisão instrumental é didática: o espectrômetro do catálogo atende ao requisito do caso; a câmera genérica não. Essa câmera não representa o NIRCam real, que também possui modos espectroscópicos. Bateria, memória e comunicação afetam a entrega de arquivos históricos; não alteram o resultado observado pelo Webb.

Downloads da versão publicada: [subconjunto e linhas de origem](../lab/data/science/webb-spectrum-subset.json) · [tabela NASA de 95 bins](../lab/data/science/webb-firefly-nasa.tbl) · [proveniência e hashes](../lab/data/science/webb-provenance.json). No repositório: [pesquisa e reprodução](https://github.com/oalexandrebelo/MISSAO-IPE/tree/main/research/webb-r18).

## Fonte → instrumento → observação → downlink → resultado

1. **Fonte:** cada registro preserva ID, grandeza, unidade, linha da publicação e origem. Data de publicação, data histórica de observação e T+ do jogo têm significados diferentes.
2. **Instrumento:** o jogador escolhe o tipo de medida exigido. Na nave didática, a peça acompanha câmera/espectrômetro; o modelo NASA contextualiza a missão.
3. **Processamento:** o motor agenda trabalhos, consumo e armazenamento. A unidade de transporte de 120/180 Mbit é um pacote didático; não é o tamanho do CSV nem uma especificação do hardware NASA.
4. **Downlink:** cada pacote precisa ser recebido integralmente e ser compatível com a pergunta. Recursos insuficientes deixam registros ausentes.
5. **Resultado:** cartões, gráfico e cena usam os mesmos IDs disponíveis. Um valor ausente permanece ausente. O botão de rever a entrega abre o evento correspondente no 3D; rebobinar o relógio não pode revelar dados futuros.

O modelo da operação é `ipe-expeditions-r18-v1`. O relatório `ipe-scientific-report-v2` conserva a evidência e o resultado da tentativa. O projeto `ipe-scientific-design-v2` descreve escolhas e hipótese. Projetos antigos são recusados porque suas hipóteses podiam se referir a três bandas sintéticas ou setores inventados; reinterpretá-las silenciosamente comprometeria o aprendizado.

## O que permanece didático

Massa, orçamento em créditos, potências, capacidades, tamanhos de pacote, agenda, órbita conceitual e tempo comprimido pertencem ao motor educativo. O 3D não calcula trajetória, aponta antenas reais, acessa telemetria ao vivo ou representa uma nova descoberta NASA. Os modelos de Bennu e Webb têm origem própria e não substituem as fontes dos números.

A inspiração visual [Cosmic Mapping](https://motionsites.ai/?prompt=cosmic-mapping) foi inspecionada somente pela prévia pública. Camadas e foco orientam a leitura causal; o vídeo, prompt protegido e assets não foram copiados. Não foi necessário usar REA/AB-R3A ou instalar dependências. [Registro da inspeção](https://github.com/oalexandrebelo/MISSAO-IPE/blob/main/research/motion-opportunities-r18.md).

Dados publicados precisam de atribuição mesmo quando numericamente reutilizáveis. A hospedagem no NTRS não torna automaticamente todos os textos e imagens domínio público. O projeto publica a seleção numérica, documentação original, extração e referências; os PDFs completos de leitura de Bennu permanecem fora do Git.

Leia o [handoff R18 para os dois devs](46-HANDOFF-DOIS-DEVS-R18.md) antes de modificar conjuntos, contratos ou visualização.
