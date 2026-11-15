# Refinamento do jogo a partir das referências NASA

Rodada 10 · 14 de novembro de 2026 · Missão Ipê / Space Mission Design Game.

**Nota editorial R17 · 15/11/2026:** a orientação atual usa funções científicas assumidas pelo participante e registros reais Terra/MODIS, sem personagens ou equipes inventadas. O roteiro vigente está em [Narrativa científica de quatro níveis](STORYTELLING-4-NIVEIS.md). Essa atualização de apresentação preserva o contrato do motor e as evidências técnicas da Rodada 10; contatos, capacidades, créditos e duração continuam sendo parâmetros didáticos.

## 1. A oportunidade principal

As referências enviadas por AB reforçam um caminho de produto: **cada escolha de engenharia precisa responder a uma necessidade da missão e produzir uma consequência verificável**. Isso orienta a evolução do beta: explicitar para quem os dados servem, antecipar limites, verificar requisitos e mostrar o retorno científico realmente disponível.

Nossa interpretação de design é que essa cadeia ensina mais do que acrescentar componentes sem finalidade ou uma sequência longa de aprovações formais. A interface mantém a entrada rápida no jogo, com detalhes técnicos acessíveis quando ajudam a decidir. O contrato da campanha continua sendo entregar **6/6 registros completos e válidos**, respeitando todas as demais restrições.

O [Appendix S do Systems Engineering Handbook](https://www.nasa.gov/reference/appendix-s-concept-of-operations-annotated-outline/) organiza objetivos, usuários, operadores, interfaces, modos e cenários nominais e fora do nominal. O [currículo NTRS 20210021839](https://ntrs.nasa.gov/citations/20210021839) conecta conceito de operações, requisitos, alternativas, realização e verificação. Essas estruturas foram adaptadas ao tamanho de um jogo educacional; não representam uma revisão formal de projeto NASA.

## 2. Auditoria das referências e suas revisões

Consulta documental em 14/11/2026. Os links originais foram abertos e suas indicações de revisão foram conferidas.

| Referência indicada | Estado encontrado | Aplicação apropriada |
| --- | --- | --- |
| NASA SP-2016-6105 Rev. 2 | [Systems Engineering Handbook](https://www.nasa.gov/reference/systems-engineering-handbook/), edição Rev. 2; Appendix S disponível como seção | Estruturar o raciocínio de missão, interfaces, alternativas e evidência |
| Concept of Operations, Appendix S | [Estrutura anotada](https://www.nasa.gov/reference/appendix-s-concept-of-operations-annotated-outline/), incluindo §§3.1–3.4 e 6.1–6.2 | Plano de missão curto, com finalidade, atores e operação prevista |
| NPR 7123.1D | [Change 2](https://nodis3.gsfc.nasa.gov/displayDir.cfm?Internal_ID=N_PR_7123_001D_&page_name=main), efetiva em 05/07/2023, expiração indicada em 05/07/2028 | Requisitos mensuráveis, rastreabilidade, verificação e validação |
| NPR 7120.5, descrita como F, URL com 5E | O [endereço fornecido](https://nodis3.gsfc.nasa.gov/displayDir.cfm?t=NPR&c=7120&s=5E) resolve para **7120.5F, Change 4**, com indicação expressa de consultar **NID 7120.148** | Ciclo de projeto, decisões e configuração; preservar a referência à diretiva interina |
| NID 7120.148 | A capa do PDF conserva expiração original em 09/12/2025; o [catálogo oficial NODIS](https://nodis3.gsfc.nasa.gov/OPD/OPD_list.cfm?dir=asc&moduleInputs=NID&sort=opr) registra extensão até **01/08/2027** | Registrar a prorrogação, evitando concluir que a diretiva está vencida apenas pela capa |
| NPR 7120.8A | [Revalidada com Change 5](https://nodis3.gsfc.nasa.gov/displayDir.cfm?Internal_ID=N_PR_7120_008A_&page_name=main), expiração indicada em 14/09/2028 | Distinguir desenvolvimento de tecnologia e pesquisa do gerenciamento de missão operacional |
| NPR 8705.4B | [Risk Classification for NASA Payloads](https://nodis3.gsfc.nasa.gov/displayDir.cfm?t=NPR&c=8705&s=4B), efetiva em 01/11/2024, expiração indicada em 31/10/2032 | Explicar tolerância a risco e expectativas de garantia, respeitando seu escopo |
| NASA Science / Learn | [Science Activation](https://science.nasa.gov/learn/) | Aproximar a experiência de perguntas científicas, dados autênticos e recursos educacionais |
| NTRS 20210021839 | [Currículo publicado em 11/10/2021](https://ntrs.nasa.gov/citations/20210021839), arquivo de 20/09/2021 | Referência didática de engenharia de sistemas, especialmente o trade-off de armazenamento em LEO |

As NPRs possuem escopo institucional próprio. A [NPR 8705.4B, Preface](https://nodis3.gsfc.nasa.gov/displayDir.cfm?Internal_ID=N_PR_8705_004B_&page_name=Preface) aplica-se a programas/projetos robóticos geridos sob 7120.5 e exclui, de sua aplicação direta, os geridos sob 7120.8, embora estes possam adotar objetivos de garantia em sua documentação. O jogo usa essas referências como base de estudo e adaptação pedagógica.

## 3. Refinamentos de produto desta rodada

### Plano da missão: começar pela necessidade

Na orientação vigente R17, o participante assume as funções de planejamento, engenharia de dados, operação de solo e revisão científica. A pergunta é comparar o NDVI entre dois períodos em três pontos do pacote real Terra/MODIS. O jogador projeta o processamento e a entrega desses arquivos históricos em um modelo didático de CubeSat.

A ficha de missão apresenta a cadeia de operações: preparar o projeto, processar os arquivos, armazenar entre contatos, transmitir e verificar o que chegou ao solo. O limite de 180 minutos pertence ao relógio da simulação; as datas dos dados pertencem ao arquivo histórico.

Essa ficha aplica o raciocínio do ConOps em linguagem de jogo. A informação necessária para compreender a missão aparece antes das opções de subsistema. A estrutura detalhada fica no caderno de pesquisa.

### Revisão prévia: contas necessárias, com alcance declarado

Antes da execução, a pessoa pode abrir uma revisão do plano operacional. Ela compara o volume dos lotes com o teto de transmissão permitido pela política escolhida, o acúmulo antes do primeiro contato com a capacidade de memória e a potência requerida com a descarga máxima da bateria.

Uma conta favorável nessa revisão não garante a entrega. Por exemplo, o teto de comunicação supõe serviço útil durante o tempo disponível; a operação ainda depende de energia, memória, produção dos lotes e continuidade. A integração temporal da energia fica explicitamente para a execução.

A memória é analisada em relação à agenda. Neste catálogo, os trabalhos terminam antes do primeiro contato. Essa propriedade permite explicar o acúmulo prévio, mas não cria uma regra geral de que toda missão precise guardar todos os dados ao mesmo tempo.

O [exemplo de armazenamento no currículo NASA](https://ntrs.nasa.gov/api/citations/20210021839/downloads/SE-Curriculum-Intro.2021-09-20.pdf), página impressa 12, trata justamente da necessidade de guardar dados entre contatos de um satélite LEO e dos compromissos com massa, potência, tamanho e custo. Essa é a ligação mais direta entre as novas referências e o mecanismo do jogo.

### Requisitos: mostrar o que foi demonstrado

O relatório acrescenta uma matriz com requisito, valor observado, limite e evidência. Massa e créditos são verificações da configuração executada. Reserva, potência e memória dependem da operação. A qualidade dos dados de origem e a entrega completam a análise. A primeira é a pré-validação do arquivo histórico usado pelos lotes produzidos; ela não comprova o cálculo de NDVI no solo nem a recepção completa. Somente registros efetivamente entregues e válidos alimentam a comparação científica.

Os estados distinguem **atendido**, **não atendido** e **não concluído**. Se a missão termina antes do horizonte, a ausência de um alerta não demonstra que aquele requisito seria satisfeito até o fim. Uma falha já registrada continua sendo falha; o encerramento precoce não apaga a evidência.

O relatório também separa os limites do projeto, a conclusão da operação e a meta científica. Uma configuração pode entregar seis registros e ainda ser inválida por massa ou custo. O resultado geral continua vindo do motor, sem ser redefinido pela interface.

A [NPR 7123.1D, Appendix A](https://nodis3.gsfc.nasa.gov/displayDir.cfm?Internal_ID=N_PR_7123_001D_&page_name=AppendixA) distingue verificação dos requisitos e validação do propósito em relação às expectativas e ao conceito de operações. No produto, verificamos as regras da simulação; a utilidade educacional ainda exige avaliação com o público.

### Retorno científico: usar apenas o que chegou

Os resultados agora permitem comparar os dois registros de cada ponto quando ambos foram recebidos integralmente e passaram pela verificação científica. Uma recepção parcial não habilita o valor ausente. A variação só aparece com o par completo.

Os valores vêm do resultado executado. Isso respeita a diferença de representação entre transmitir bandas para calcular o NDVI no solo e transmitir o índice processado a bordo. As datas de observação são identificadas separadamente do início do composto MOD13Q1.

No cenário curto inicial, o par A chega completo, enquanto os pares B e C permanecem incompletos. Portanto, uma comparação temporal fica disponível e duas aguardam dados. Isso dá significado ao retorno científico: a engenharia determina quais perguntas podem ser examinadas com a informação efetivamente recebida.

A variação de NDVI entre duas observações é descritiva. Não estabelece, sozinha, causa de mudança, seca, incêndio ou desmatamento, e três pontos não representam todo o bioma. O [MOD13 User Guide V6.1](https://modis-land.gsfc.nasa.gov/pdf/MOD13_User_Guide_V61.pdf) continua sendo a referência de produto e qualidade.

### Operação prevista e folgas

Eclipse, término de contato e espera entre janelas são condições previstas pela agenda. Uma violação de potência, energia ou memória é um resultado distinto que exige investigação. A interface passa a nomear essa diferença. O estado de encerramento do motor não é apresentado como um modo seguro com capacidade de recuperação que não foi modelada.

A comparação entre missões acrescenta folga de massa, créditos restantes e energia mínima acima da reserva. Esses números ajudam a discutir o custo de uma solução. Eles são diferenças dentro do modelo e não probabilidades de sucesso em voo.

## 4. Risco: como incorporar sem fabricar certeza

As classes A–D de 8705.4B expressam tolerância a risco e expectativas de garantia. O [Appendix C](https://nodis3.gsfc.nasa.gov/displayDir.cfm?Internal_ID=N_PR_8705_004B_&page_name=AppendixC) orienta considerar conjuntamente prioridade, duração, complexidade e custo. Nenhum fator isolado determina automaticamente a classe.

Por isso, esta rodada não transforma classe A–D em fácil/difícil ou em percentuais arbitrários de falha. Também não transforma 9 configurações viáveis entre 64 em chance de sucesso de 14,1%. A enumeração descreve um catálogo finito sob hipóteses fixas; probabilidade exigiria um modelo de incerteza justificado.

A adaptação atual trabalha com condições conhecidas, restrições calculadas, evidências disponíveis e aspectos que ainda precisam de investigação. Isso permite raciocinar sobre risco sem prometer uma avaliação de garantia de missão real.

## 5. Oportunidades priorizadas para evolução

| Prioridade | Oportunidade | Valor para o jogo | Evidência necessária antes de apresentar como validada |
| --- | --- | --- | --- |
| Agora | ConOps curto, revisão prévia, requisitos e retorno científico | Conectar propósito, decisão e consequência | QA de fluxo, coerência com o motor e clareza com jogadores |
| Próxima | Sessões com estudantes e educadores | Identificar onde a pessoa confunde potência, energia, memória e ciência útil | Tarefas de transferência, explicações antes/depois e observação de erros |
| Próxima | Instrumentos e objetivos científicos alternativos | Tornar a escolha de payload uma decisão de missão | Dados, resolução, cobertura, qualidade e recursos de cada instrumento |
| Próxima | Órbita e agenda de contatos configuráveis | Transformar geometria e segmento de solo em decisões jogáveis | Propagação adequada, horizonte, eclipses e visibilidade comparados com referência independente |
| Depois | Contingências em contrato separado | Ensinar detectar, escolher resposta e recuperar operação | Modos explícitos, duração, efeitos, recursos e critério de recuperação; nenhuma falha aleatória sem explicação |
| Depois | Plano didático de garantia inspirado na AIM | Escolher verificações e acompanhar que evidências faltam | Custo/tempo de verificação e rastreabilidade; sem equivaler a certificação NASA |
| Depois | Incerteza, sensibilidade e Monte Carlo | Comparar robustez de alternativas | Distribuições justificadas, dependências, semente, métricas e limites de interpretação |
| Depois | Campanha lunar e, em seguida, interplanetária | Expandir para propulsão, captura, latência e janela | Modelos de trajetória apropriados e distinção entre manobras impulsivas e baixo empuxo |

O critério para priorizar uma nova mecânica é ela criar uma decisão explicável e observável. Uma nova variável deve ter significado, unidade, fonte, hipótese e forma de verificação.

## 6. Como conduzir a demonstração

1. Ler o plano da missão e formular a pergunta científica.
2. Projetar a configuração inicial e abrir a revisão prévia.
3. Registrar hipótese; executar o cenário longo e observar seis registros recebidos.
4. Executar o mesmo projeto com contatos curtos; verificar o limite de transmissão, os registros na fila e as comparações científicas possíveis.
5. Relacionar o resultado a um requisito e a um evento, antes de consultar alternativas.
6. Aplicar o redesign mínimo, registrar nova previsão e executar.
7. Comparar a entrega, as folgas e os pares de NDVI disponíveis; explicar o compromisso entre processamento a bordo e potência da bateria.

Esse roteiro propõe uma atividade. Concluir a missão ou selecionar uma combinação vencedora, isoladamente, não comprova aprendizagem.

## 7. Procedência e limites

Os três pareceres integrais desta rodada estão em `research/round10/refinamento-conops.md`, `refinamento-requisitos.md` e `refinamento-risco-ux.md`. O caderno também mantém a pesquisa anterior para tornar as decisões rastreáveis.

O motor `0.1.1-rd`, o catálogo `ipe-64-v1`, os seis registros históricos, o objetivo 6/6 e os dois cenários foram preservados. Os refinamentos acrescentam apresentação, análise dos resultados e explicações. O laboratório de física permanece separado da campanha.

Esta experiência foi desenvolvida com assistência de IA. Não há validação de voo, certificação NASA, endosso NN/g ou estudo de aprendizagem concluído. As verificações automatizadas e visuais têm alcance descrito nos respectivos registros de QA.
