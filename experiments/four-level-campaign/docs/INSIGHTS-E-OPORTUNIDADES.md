# PROJETO-IPÊ — insights e oportunidades

Pesquisa e decisões de produto · 14/11/2026 · referência de data: America/Sao_Paulo. Direção: AB / Alexandre Belo. Investigação e redação com assistência de IA. Este documento distingue evidência externa, observação do código e hipótese autoral.

## 1. Decisão principal

A evolução de maior valor para este beta é transformar o motor existente em quatro pedidos de missão diferentes e explicáveis. O projeto já consegue conservar recursos, distinguir entrega parcial e total, verificar qualidade e comparar alternativas. A campanha dá motivo a essas decisões sem acrescentar física não modelada.

A pesquisa adicional favorece três oportunidades: apoio à exploração que não revele a solução; uma explicação final apoiada em evidência; e alfabetização de dados que inclua procedência e limites. As fontes orientam hipóteses de design. Elas não validam a eficácia do PROJETO-IPÊ.

## 2. O que foi consultado

Foram revisados README, pesquisa R9, refinamento R10 e os três pareceres de `research/round10/`, além dos contratos, catálogo, motor, busca, pacote de registros e diário local. Os anexos de SmartCity enviados por AB foram consultados como referência contextual de estrutura e avaliação; não redefinem o tema da missão espacial.

Foram abertas fontes primárias de NASA, My NASA Data, University of Colorado/PhET e W3C. A consulta ao catálogo LP DAAC retornou 403; o guia oficial MOD13 Collection 6.1 permaneceu acessível. Um artigo da RSC foi localizado por busca, mas sua abertura também retornou 403; ele não é usado como base de uma afirmação sobre resultados no projeto. A investigação sobre orientação em simulações usa o estudo disponível no domínio do PhET [S-05].

Não foram realizados entrevistas, aplicação com estudantes, revisão pedagógica por especialista humano, experimento controlado ou coleta de resultados de campo. Esta frente não publicou serviços, criou banco ou modificou a física do jogo.

## 3. Evidência externa e interpretação de produto

| Fonte / observação sustentada | Interpretação para o PROJETO-IPÊ | Limite |
|---|---|---|
| O Appendix S organiza necessidades, usuários e operação; o currículo de engenharia aproxima esses elementos de requisitos e alternativas [S-01, S-02] | Cada nível começa com um pedido compreensível, e o relatório responde ao mesmo pedido | Adaptação didática autoral, sem conformidade institucional |
| My NASA Data propõe conectar afirmação, evidência e raciocínio [S-03] | Pedir que o jogador aponte um evento ou valor antes de defender seu redesign | Escrever uma frase não demonstra automaticamente domínio |
| My NASA Data apresenta recursos que vão de leitura visual a análise de dados e perguntas sobre limites de investigações [S-04, S-07] | Relacionar mapa, pares históricos, qualidade e alcance da conclusão | Não converter três pontos e dois períodos em diagnóstico do bioma |
| PhET descreve pesquisa iterativa de interface e entrevistas de uso [S-06] | Observar a pessoa pensando em voz alta e revisar os controles que geram confusão | Processo de outro projeto; nenhuma eficácia transferida para este beta |
| Paulson, Perkins e Adams estudaram orientações diferentes com 12 estudantes universitários em uma simulação específica; observaram diferenças na exploração [S-05] | Testar perguntas orientadoras e ajuda opcional, evitando roteiro que dite todas as ações | Amostra, contexto e fenômeno distintos; não sustenta eliminar apoio universalmente |
| WCAG 2.2 fornece critérios verificáveis para acessibilidade web [S-08] | Manter objetivos e decisões acessíveis por DOM, teclado e estados textuais | Referência de verificação, não certificação pronta |
| O guia MOD13 documenta composição temporal, bandas, escalas e QA [S-09] | Mostrar o período histórico e o estado de recepção junto ao valor científico | Não confundir data do composto, observação e relógio da missão |

## 4. Oportunidades incorporadas ao contrato do beta

### O-01 — Quatro pedidos, uma engenharia coerente

Os níveis usam os mesmos seis registros e 64 projetos, mas mudam o pedido: entrega inicial, memória compacta, bandas sob contatos curtos e economia com oito créditos de folga. As condições surgem no briefing e são avaliadas depois. Essa distinção dá significado à necessidade do usuário da missão: uma configuração bem-sucedida pode não atender à representação ou ao custo pedido no nível.

**Entrega prevista:** quatro níveis no mapa com cenário, preset, personagem, intenção e critério próprios. **Evidência de aceite:** concluir com os resultados elegíveis; rejeitar progresso quando apenas o motor, mas não o pedido particular, foi satisfeito. **Risco de UX:** chamar as duas avaliações de “falha” indistintamente. **Resposta:** apresentar “operação concluída” e “condição do nível pendente” quando for o caso.

### O-02 — Ajuda que protege o objetivo do exercício

A busca existente enumera o catálogo para sucesso da missão. No nível 2, a solução mínima genérica seria ampliar memória, o que viola o pedido de manter 512 Mbit. No nível 3, uma solução com índice também poderia violar o pedido de bandas. Portanto, uma ajuda de campanha precisa considerar o critério do nível ou dizer claramente que está respondendo apenas à operação.

**Entrega prevista:** ajuda contextual após tentativa própria, mantendo explicação de mudanças e oportunidade de prever novamente. **Aceite:** nenhuma alternativa anunciada como solução do nível falha em sua condição adicional. **Hipótese a investigar:** a ajuda orienta o raciocínio ou induz a copiar opções sem compreensão?

### O-03 — Explicação final com evidência, sem nota automática

O diário e os eventos existentes permitem uma reflexão curta: escolha defendida, valor/evento observado, consequência e limite. Isso pode apoiar a discussão com um facilitador sem inserir um avaliador generativo ou uma regra frágil de palavras-chave.

**Entrega prevista:** perguntas de reflexão integradas ao arco narrativo e acesso às evidências do resultado. **Aceite:** conclusão depende de condições computáveis da missão; texto livre não recebe um selo de aprendizagem. **Pesquisa posterior:** revisão humana de explicações e de uma tarefa distinta de transferência.

### O-04 — Mapa como orientação de campanha

O mapa deve mostrar propósito, estado e próxima ação dos quatro níveis. Ele representa a progressão educativa; não é uma órbita operacional nem precisa pedir localização do jogador. Uma lista de ações no DOM deve oferecer a mesma informação e acesso.

**Entrega prevista:** seleção de nível, progresso real e retorno ao briefing. **Aceite:** teclado e alternativa textual permitem acessar cada etapa; visitar um nó não concede conclusão. **Pesquisa posterior:** observar se mapa e lista produzem diferenças de orientação, sem presumir que uma decoração espacial melhora compreensão.

## 5. Novas oportunidades para o próximo ciclo

| ID / prioridade | Proposta | Valor esperado e decisão a apoiar | Dependências e evidência antes de anunciar resultado |
|---|---|---|---|
| O-05 / P1 | Caderno curto de evidências exportável | Reunir previsão, resultado, evento e redesign para discussão | Definir formato, versões, minimização de texto pessoal e legibilidade com educadores |
| O-06 / P1 | Leitura guiada da procedência | Comparar data de observação, início do composto, QA e recepção | Conferir metadados e compreensão; não transformar procedência em questionário obrigatório |
| O-07 / P1 | Apoio selecionável e não punitivo | Permitir uma pergunta orientadora, exemplo de leitura ou ajuda de catálogo conforme necessidade | Testar com iniciantes; ajuda explícita sempre disponível e sem bloquear acessibilidade |
| O-08 / P1 | Missão de transferência fora da sequência ensinada | Investigar se a pessoa aplica uma relação em situação nova | Instrumentos paralelos revisados; não duplicar literalmente a solução do jogo |
| O-09 / P1 | Comparação orientada por critério | Escolher entre custo, massa e energia acima da reserva em projetos elegíveis | Explicar critério; distinguir alteração isolada de mudanças múltiplas; não chamar folga de probabilidade |
| O-10 / P1 | Guia de mediação e observação de falas | Separar confusão conceitual, usabilidade e leitura | Sessões reais; preservar registro de ajuda e permitir pausa/recusa de resposta |
| O-11 / P2 | Novo pacote científico com objetivo próprio | Demonstrar que a necessidade científica modifica o projeto | Dados, licença, QA, escala, pergunta e contrato versionados; revisão independente |
| O-12 / P2 | Órbita e contatos configuráveis | Fazer geometria orbital produzir uma decisão verificável | Modelo de propagação adequado, referência independente e agendas completas |
| O-13 / P2 | Contingência determinística anunciada | Escolher uma resposta e observar recuperação explicitamente modelada | Máquina de modos, efeitos, duração e critérios de recuperação; novo contrato |
| O-14 / P2 | Camada institucional opcional | Apoiar oficinas e pesquisa sem tornar login requisito do visitante | Finalidade, acesso, retenção, governança e testes; Prisma sozinho não habilita coleta |

`P1` é o próximo ciclo de investigação e `P2` é expansão dependente de nova engenharia. Essas oportunidades não são funcionalidades já implementadas. O beta mantém o laboratório independente e não conecta seus controles à campanha sem um contrato novo.

## 6. Decisões que evitam conclusões indevidas

**Dificuldade não será uma contagem oculta de falhas.** O nível 4 pode ser resolvido com uma troca de painel a partir do preset; seu desafio está em otimizar com autonomia e explicar o compromisso. Se participantes o perceberem como mais simples que o nível 3, a observação deve orientar a próxima revisão. Não inventar um indicador de dificuldade para defender a ordem.

**“Processar índice” não significa compressão genérica sem perdas.** O catálogo representa duas formas de responder à mesma pergunta NDVI, com volumes e cargas diferentes. A documentação deve falar em processamento ou redução de volume. Novos usos científicos que dependam das bandas precisam de objetivo próprio e não são simulados por uma frase da narrativa.

**Folga não é confiabilidade.** A diferença entre limite e uso é informativa, mas não mede probabilidade de pane. As contagens de configurações elegíveis tampouco representam chance de sucesso de um satélite real.

**Conhecimento científico continua separado da história.** A equipe é fictícia; o pacote MODIS e sua procedência são reais; recursos e operação da nave são didáticos. A ciência só aparece conforme recepção e qualidade. Um quadro com delta positivo ou negativo não autoriza identificar uma causa ambiental.

**O domínio SmartCity fornece estrutura, não regras deste produto.** Aproveitam-se a preocupação com evidência, acessibilidade, separação de serviços e critérios por mecânica. Não se importam afirmações sobre legislação, público infantil, licenças de repositórios ou resultados de oficinas. O dossiê também não é tratado como validação de dados que não vieram acompanhados de evidência.

## 7. Verificação numérica realizada nesta frente

Foi executada leitura direta de `simulateMission` e enumeração de `enumerateConfigurations` em Node com `--experimental-strip-types`, usando os contratos atuais. Os resultados abaixo são observações do motor local em 14/11/2026. Não substituem a suíte integrada nem uma inspeção do novo mapa no navegador.

| Verificação | Resultado observado |
|---|---|
| Operação longa, todas as 64 configurações | 17 sucessos operacionais |
| N2: operação longa e memória compacta | Seis configurações elegíveis; solução de referência com 81 créditos |
| Operação curta, todas as 64 configurações | Nove sucessos operacionais |
| N3: operação curta e bandas | Uma configuração elegível; 3,40 kg e 79 créditos |
| N4: operação curta e custo ≤ 78 | Duas configurações elegíveis; 75 e 78 créditos |
| Preset N2 | 2/6, quatro perdas de lote, primeira em 1.860 s; 720 Mbit perdidos |
| Preset N3 | 2/6, sem perda de memória, 619,2 Mbit ainda na fila |
| Índice com bateria pequena a partir do preset | Encerramento por `PEAK_POWER` em 600 s; não é falta de capacidade em Wh |
| Preset N4 | Sucesso 6/6 por 84 créditos; condição pedagógica de custo ainda pendente |

Critérios usados na enumeração: resultado `success` e, conforme o nível, `config.buffer === 'compact'`, `config.processing === 'bands'` ou `result.credits <= 78`. O cenário faz parte de cada comparação. Configurações, soluções e consequências estão detalhadas em [STORYTELLING-4-NIVEIS.md](STORYTELLING-4-NIVEIS.md).

## 8. Perguntas para uma pesquisa futura

1. O jogador entende por que os pedidos dos níveis 2 e 3 exigem representações diferentes, ou interpreta isso como contradição do jogo?
2. O preset bem-sucedido do nível 4 ajuda a separar operação e objetivo de projeto, ou precisa de uma apresentação mais clara?
3. O jogador identifica o primeiro evento relevante e formula uma mudança, ou a quantidade de informação do relatório atrapalha?
4. A pessoa diferencia “perdido por memória” de “ainda em fila por contato curto” quando ambos mostram 2/6?
5. O mapa permite retomar contexto e próximo passo sem obrigar a ler novamente toda a narrativa?
6. A ajuda de catálogo mantém espaço para prever e explicar, ou encerra a investigação cedo demais?
7. O retorno científico comunica ausência de dados e limites da inferência sem parecer um erro da interface?
8. Quais diferenças aparecem com teclado, leitor de tela, zoom, movimento reduzido e aparelhos de menor capacidade?

O protocolo deve distinguir comportamento observado, fala do participante e interpretação do pesquisador. Registrar versão do software, tarefa, apoio recebido, incidentes e dados ausentes. Não usar duração de sessão, cliques ou número de tentativas como medida isolada de aprendizagem.

## 9. Registro de fontes primárias

Todas as fontes abaixo foram consultadas em **14/11/2026, America/Sao_Paulo**. Datas editoriais ou de versão são preservadas quando identificadas; não se usa a data de acesso como revisão técnica do documento.

| ID | Documento e URL | Localizador / uso |
|---|---|---|
| S-01 | [NASA — Appendix S: Concept of Operations Annotated Outline](https://www.nasa.gov/reference/appendix-s-concept-of-operations-annotated-outline/) | §§3.1–3.4 e estrutura de cenários; necessidade e operação |
| S-02 | [NASA NTRS 20210021839 — Systems Engineering Curriculum](https://ntrs.nasa.gov/citations/20210021839) | Material curricular de Kenneth Freeman e Gilena A. Monroe; publicação 11/10/2021; armazenamento entre contatos tratado na pesquisa R10 |
| S-03 | [My NASA Data — Introduction: Building Claims from Evidence](https://mynasadata.larc.nasa.gov/lesson-plans/introduction-building-claims-evidence) | Overview e Procedure; afirmação, evidência e raciocínio |
| S-04 | [My NASA Data — About My NASA Data](https://mynasadata.larc.nasa.gov/about-mnd) | Earth System Approach e Data Literacy Cubes; formatos e progressão de análise |
| S-05 | [Paulson, Perkins e Adams — How does the type of guidance affect student use of an interactive simulation?](https://phet.colorado.edu/publications/Paulson_etal_2009/Paulson_etal_2009.pdf) | Método e discussão, estudo de 12 universitários com Faraday's Electromagnetic Lab; hipótese de apoio a testar |
| S-06 | [PhET / University of Colorado Boulder — Research](https://phet.colorado.edu/en/research) | Pesquisa de design e uso das simulações; entrevistas e iteração |
| S-07 | [My NASA Data — Planning and Carrying Out Investigations](https://mynasadata.larc.nasa.gov/basic-page/planning-and-carrying-out-investigations-mnd) | Perguntas sobre dados, duração e limites da investigação |
| S-08 | [W3C — Web Content Accessibility Guidelines 2.2](https://www.w3.org/TR/WCAG22/) | Recomendação de 12/12/2024; critérios de percepção, teclado, foco, interação e estados |
| S-09 | [MODIS Vegetation Index User's Guide — Collection 6.1](https://modis-land.gsfc.nasa.gov/pdf/MOD13_User_Guide_V61.pdf) | Versão 3.10, setembro/2019; §§1.2, 4, 5.2 e 5.5; bandas, composição, escala e QA |

As referências R9/R10 continuam preservadas, inclusive a distinção entre orientações NASA e obrigações institucionais. O PROJETO-IPÊ mantém a autoria e a licença de sua base, declara assistência de IA e não apresenta endosso, certificação, parceria ou aprendizagem demonstrada que não tenha evidência própria.
