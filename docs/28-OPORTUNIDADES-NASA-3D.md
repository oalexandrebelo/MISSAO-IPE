# Oportunidades NASA 3D para o projeto Ipê

**Pesquisa verificada em 14 de novembro de 2026. Estado: proposta de design e catálogo técnico; nenhuma integração 3D nova foi implementada por este estudo.**

A oportunidade mais forte é tornar o projeto de missão manipulável: o jogador monta uma configuração, vê como ela processa os arquivos históricos do Cerrado, acompanha os recursos durante a órbita e compara duas decisões no mesmo instante. O 3D deve tornar visíveis as causas do resultado. O beta atual e seus dados continuam como base verificável; a proposta amplia a experiência depois de validar essa base.

O [NASA 3D Resources](https://science.nasa.gov/3d-resources/) fornece modelos de referência e um [espelho oficial no GitHub](https://github.com/nasa/NASA-3D-Resources). Esta curadoria selecionou **11 ativos**, confirmou os downloads por cabeçalhos HTTP e leu parcialmente nove GLBs. **Sete GLBs têm menos de 5.000.000 bytes**, mas tamanho e extensão de arquivo não bastam para aprovar uma integração.

## Uma direção de experiência para o Game Design

Proposta: organizar uma missão educativa curta em cinco momentos conectados. A equipe deve testar sua duração e clareza com jogadores; ainda não há evidência de aprendizagem ou diversão desta proposta.

| Momento | Interação espacial | Consequência que precisa ficar clara | Evidência ao final |
| --- | --- | --- | --- |
| Montar | Girar a nave, selecionar subsistemas, destacar posição e volume ocupado | Uma troca altera recursos do mesmo modelo de missão | Configuração e orçamento antes/depois |
| Planejar | Manipular a linha do tempo e inspecionar órbita, iluminação e direção do sensor | Nem todo instante serve igualmente para observar, recarregar e transmitir | Agenda com restrições e premissas |
| Operar | Acompanhar processamento e transmissão numa cena com tempo controlável | Produzir arquivos processados ocupa memória; entregar ciência depende da cadeia completa | Eventos de processamento e entrega rastreáveis |
| Comparar | Sobrepor dois replays sincronizados após mudar uma única decisão | A diferença visual corresponde à diferença calculada pelo motor | Resultado A/B reproduzível |
| Explicar | Selecionar um dado entregue e abrir sua origem, contexto e limite | A nave e as decisões são simuladas; o conjunto científico possui proveniência própria | Relatório de missão com fonte e hipótese |

O diferencial proposto está na comparação causal. Uma pessoa deve poder apontar na cena onde sua escolha mudou a missão e explicar o resultado com os mesmos números do relatório. Isso é uma hipótese de produto a validar, não uma alegação de novidade mundial.

A nave Ipê precisa de geometria própria se houver montagem, peças intercambiáveis, pontos de seleção e estados de implantação. Um modelo NASA pode funcionar como referência identificada no hangar. O catálogo não comprova que suas malhas correspondam a peças removíveis, massas reais, interfaces elétricas ou superfícies de colisão.

## Catálogo curado e disponibilidade

Tamanhos abaixo são bytes exatos informados por `Content-Length` em respostas HTTP 200. Para GLB, a leitura parcial confirmou assinatura `glTF`, versão 2 e tamanho total no cabeçalho. Páginas e URLs de download, créditos, prioridades e limites estão no [catálogo JSON](https://github.com/oalexandrebelo/PROJETO-IPE/blob/main/research/nasa-3d-catalog.json).

| Ativo e página oficial | Formato escolhido | Bytes | Prioridade | Resultado técnico |
| --- | --- | ---: | --- | --- |
| [CubeSat – 2 RU Generic](https://science.nasa.gov/3d-resources/cubesat-2-ru-generic/) | GLB | 206108 | MVP: referência | Draco obrigatório; 1 malha, sem animações |
| [CubeSat – ICECube](https://science.nasa.gov/3d-resources/cubesat-icecube/) | GLB | 309684 | MVP: referência | Draco obrigatório; 6 malhas, sem animações |
| [Earth 3D Model Interactive](https://science.nasa.gov/learn/heat/resource/earth-3d-model/) | GLB | 12916400 | MVP: otimizar | 12,92 MB; autoria do GLB não explicitada |
| [Earth with Clouds 3D Model](https://science.nasa.gov/resource/earth-with-clouds-3d-model/) | GLB | 18928336 | Depois | 18,93 MB; uma malha |
| [Terra](https://science.nasa.gov/3d-resources/terra/) | GLB | 2150600 | MVP: reparar pacote | 2 texturas TGA externas; pacote incompleto |
| [70 meter dish](https://science.nasa.gov/3d-resources/70-meter-dish/) | GLB | 2216584 | Depois | Autocontido; 1 malha; sem animações |
| [1999 RQ36 asteroid](https://science.nasa.gov/3d-resources/1999-rq36-asteroid/) | GLB | 329596 | Depois | Autocontido; forma histórica sem precisão demonstrada |
| [Saturn V](https://science.nasa.gov/3d-resources/saturn-v/) | GLB | 927212 | Depois | Autocontido; 23 animações ainda não reproduzidas |
| [James Webb Space Telescope (A)](https://science.nasa.gov/3d-resources/james-webb-space-telescope-a/) | GLB | 4710016 | Depois | JSON maior que a amostra; estrutura pendente |
| [Apollo 11 – Landing Site](https://science.nasa.gov/3d-resources/apollo-11-landing-site/) | STL | 7138484 | Depois | Impressão; exagero vertical 60× |
| [Space Launch System (SLS)](https://science.nasa.gov/3d-resources/space-launch-system-sls/) | ZIP | 39941491 | Depois; não selecionado | ZIP não inventariado; excluído da primeira carga |

**MVP** significa utilidade potencial para a campanha Cerrado; não indica aprovação para produção. **Depois** identifica material para uma campanha ou sala de estudos futura. O SLS foi registrado como alternativa pesada, sem baixar seu ZIP. O arquivo de terreno lunar não é um modelo do Cerrado.

### O que a inspeção dos arquivos revelou

- **CubeSat genérico e IceCube:** os cabeçalhos exigem `KHR_draco_mesh_compression`. O carregador precisa de suporte compatível e do decodificador disponível localmente, caso o objetivo seja funcionar offline. Não há animações prontas. A malha única do modelo genérico limita montagem por peças.
- **Terra:** o GLB inclui caminhos relativos para `Side_Panels_TERRA.tga` e `solarpanels.tga`, em uma pasta externa. O peso de 2,15 MB não inclui necessariamente um pacote utilizável. Recuperação das texturas e reparo de referências são trabalho futuro. Mostrar Terra seria útil para explicar quem mediu o MODIS; a nave não deve ser rebatizada como Ipê.
- **Antena, Bennu e Saturn V:** os cabeçalhos não declaram extensões obrigatórias nem arquivos externos. São candidatos simples para um ensaio de carregamento isolado. A antena de 70 m pertence ao contexto DSN; não é a estação de solo do CubeSat. Bennu usa um modelo sob a designação histórica 1999 RQ36. Saturn V é referência histórica, sem vínculo com lançamento do Ipê.
- **JWST:** 4,71 MB no transporte, mas seu bloco JSON tem 1.256.896 bytes. A amostra de 131.072 bytes confirmou o cabeçalho, não a estrutura completa. Não declarar suporte a materiais, animações, extensões ou desempenho até concluir a inspeção.
- **Planeta Terra, sem e com nuvens:** 12,92 MB e 18,93 MB. A primeira implementação pode usar uma esfera própria e uma textura aprovada, com orçamento explícito. Camadas científicas precisam de mapeamento geográfico próprio; uma textura bonita não resolve georreferenciamento.

Estas inspeções não renderizaram os modelos, não verificaram triângulos/VRAM nem mediram tempo de carregamento. Não foram salvos modelos completos no projeto. A semântica das 23 animações do Saturn V permanece pendente.

## Créditos, escala e direitos

O catálogo conserva a autoria explícita de cada página quando disponível: Christopher R. Meaney nos dois CubeSats e no asteroide; Christian A. Lopez em Terra; Ames Research Center na antena; Michael D. Carbajal em Saturn V; Goddard Space Flight Center em JWST; VTAD em Terra com nuvens, todos com o prefixo NASA presente nas fontes. Para o GLB Earth da página HEAT, o terreno Apollo e o pacote SLS, a autoria específica não foi estabelecida; o catálogo indica essa lacuna em vez de inventar crédito.

A base de reutilização é a [política de imagens e mídia NASA](https://www.nasa.gov/nasa-brand-center/images-and-media/), que inclui recursos de modelos tridimensionais. Manter reconhecimento da fonte, identificar alterações e evitar aparência de endosso. Marcas, insígnias, colaboradores e material de terceiros exigem tratamento próprio. A licença do código do Ipê não relicencia automaticamente modelos ou texturas.

Verificar inscrições e logos existentes no próprio modelo antes de uma integração visual. Escala, eixos e origem também devem ser medidos: GLB é um formato de representação, não um certificado de engenharia. No terreno Apollo 11, a própria fonte informa exagero vertical de **60 vezes**; apresentá-lo como relevo em escala real distorceria o estudo.

As páginas do hub preservam descrições antigas. A ficha JWST ainda cita uma previsão de lançamento de 2018. A data de publicação/migração de um asset não atualiza a narrativa científica nem o cronograma da missão.

## Recursos NASA que podem orientar a mecânica

| Recurso primário | Aplicação concreta proposta | Limite de uso |
| --- | --- | --- |
| [GMAT R2026](https://software.nasa.gov/software/GSC-19640-1) | Produzir cenários orbitais de referência fora do navegador e confrontar resultados do motor com épocas, unidades e referenciais documentados | Não é API REST já integrada; instalar ou automatizar exigirá uma tarefa própria |
| [Common Model Library](https://github.com/nasa/cml) e [licença](https://raw.githubusercontent.com/nasa/cml/main/LICENSE) | Estudar contratos de subsistemas e sua verificação | Modelos C++ compatíveis com Trick; NOSA 1.3; não é biblioteca de arte 3D nem dependência web imediata |
| [Mission Design Lab](https://etd.gsfc.nasa.gov/capabilities/integrated-design-center/mission-design-lab) | Transformar a revisão de missão em comparação de alternativas entre energia, comunicação, voo, custo e operação | Referência de processo; não significa que a NASA analisou ou certificou o projeto |
| [Concept Maturity Levels](https://www.nasa.gov/ames-engineering/spaceflight-division/mission-design-center/about-our-studies/) | Inspirar etapas educativas que exigem evidência antes de avançar | Outra expansão da sigla CML; não atribuir nível oficial à nave fictícia |
| [Mission Visualization](https://nasa.github.io/mission-viz/) | Aprender formas de apresentar elipses, órbitas tridimensionais e tabelas sincronizadas | Exemplos X3DOM/R; código e licenças específicas não foram auditados para incorporação |
| [CubeSat 101, revisão outubro de 2017](https://science.nasa.gov/wp-content/uploads/2023/06/nasa_csli_cubesat_101_508.pdf) | Organizar interfaces, estação de solo, testes, preparação e operações como decisões jogáveis | Guia histórico; valores e requisitos não são catálogo atual de peças ou regras universais de 2026 |

Uma separação útil é manter **simulação**, **visualização** e **evidência** em contratos distintos: o motor produz os estados; a cena os representa; a ficha científica informa origem e premissas. Alterar a câmera, resolução visual ou qualidade gráfica não deve mudar o resultado da missão.

## Ordem de execução e critérios de aceite

1. **Definir a decisão central.** Escolher uma mudança que o beta já consiga calcular e especificar o resultado esperado antes de montar a cena. Aceite: replay A/B determinístico, mesma condição inicial, única escolha alterada e diferenças explicadas.
2. **Construir uma cena pequena.** Uma Terra de contexto, uma nave Ipê identificada e a linha do tempo. Aceite: processar e transmitir refletem os eventos do motor; pausar controla somente a reprodução; a geometria não cria resultados independentes.
3. **Ensaiar um ativo oficial isolado.** Baixar somente o candidato escolhido, registrar hash e licença, verificar extensões, materiais, eixos, escala e referências externas. Aceite: carregar sem rede após os arquivos locais estarem disponíveis e mostrar crédito. O critério de 5 MB é uma triagem, não uma meta suficiente de desempenho.
4. **Medir em condições reais.** Registrar dispositivo, navegador, tamanho transferido, tempo até interação e fluidez. Definir um orçamento de qualidade antes de expandir a cena. Aceite proposto: controles responsivos em aparelho alvo e qualidade reduzida selecionável, comprovados por medição.
5. **Garantir a mesma missão fora do canvas.** Seleção por teclado, foco visível, resumo textual, pausa, redução de movimento e controles equivalentes. Aceite: concluir as mesmas decisões e consultar os mesmos dados com a representação textual.
6. **Validar entendimento.** Observar jogadores explicando a consequência de uma escolha e distinguindo dado NASA, hipótese didática e referência visual. Registrar problemas antes de adicionar Bennu, telescópios ou campanhas lunares.

A integração não depende de incorporar todos os ativos. O catálogo torna as escolhas futuras concretas e auditáveis; o primeiro avanço deve provar que a representação 3D ajuda a compreender a missão e mantém os resultados verificáveis.
