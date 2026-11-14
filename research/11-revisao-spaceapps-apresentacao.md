# Revisão Space Apps para a apresentação do Missão Ipê

**Rodada 5 · 14/11/2026 · revisão documental.** Relógio consultado: **10:32:50 UTC / 07:32:50 BRT**. O início publicado para Rio Verde, 09h BRT, ainda era futuro nessa conferência. Esta frente revisou fontes públicas e a documentação existente; não alterou motor, interface, dados, histórico ou inscrição.

O pacote pode apresentar o Missão Ipê como **protótipo educacional de P&D com uma missão de observação da Terra verificável**. Deve conservar duas pendências já registradas: elegibilidade temporal não estabelecida e confirmação de uma fonte NASA na lista oficial de Resources do desafio. Nenhuma orientação recuperada nesta revisão regulariza trabalho específico anterior ao evento. Também não foi observada decisão dos organizadores sobre esta equipe.

## 1. O que a revisão atual confirmou

| Item | Evidência recuperada | Autoridade e alcance |
|---|---|---|
| Edição e tema | A página 2026 indexada anuncia 14–15/11 e “The Next Frontier”. | Página institucional; conteúdo indexado, abertura direta falhou. [S02] |
| Janela geral e equipe | Edição/envio na aba Project: sábado 09h até domingo 23h59 locais; até seis participantes. | Página institucional. Não comprova inscrição ou composição humana do Ipê. [S02] |
| Recorte do desafio | O bloco “About the Challenge” de uma página de equipe descreve jogo de projeto, gestão e simulação de missão, com decisões de engenharia e recursos limitados. | Resumo contextual no domínio oficial. O enunciado integral do desafio não foi recuperado. [S03] |
| Formato da demonstração | Navigators orientam vídeo de até 30 segundos ou apresentação de até sete slides, incluindo abertura/fecho; inglês ou legendas inglesas. | Respostas atuais no repositório NASA; não substituem a leitura do guia e do formulário vigentes. [S07–S08] |
| Guias atuais | Anúncio de Madison-GO-Team de 13/11 remete a Project Submission Guide e Judging & Awards. | Confirma os links de referência. Os conteúdos completos falharam nesta recuperação. [S09] |
| IA e recurso NASA | GO Team permite IA com declaração de uso e exige ao menos uma fonte NASA da lista Resources do desafio para Global Awards. | Resposta expressa do GO Team. A lista específica continua pendente. [S06] |
| Agenda Rio Verde | Domingo: pré-apresentações 15h30, entrega 17h, apresentações 18h. | Página do organizador local hospedada no site; marcada como conteúdo de participante/Local Lead. [S10] |

A homepage solicitada, `https://www.spaceappschallenge.org/`, retornou 502 nesta tentativa. Isso não permite afirmar que o site esteja indisponível para todos. O conteúdo institucional 2026 foi recuperado por busca, sem navegação autenticada, acesso direto por browser ou contorno de restrições.

## 2. Limites que precisam acompanhar a apresentação

**Cronologia.** O registro `evidence/chronology.json` informa desenvolvimento específico iniciado na rodada anterior às 05h23 BRT. Paula-GO-Team orienta início às 09h locais; Nick-GO-Team recomenda esperar inclusive para funcionalidades/esboço de UI; Madison-GO-Team reafirma o horário ao responder sobre especificações Markdown e prompts prontos. A resposta de Navigator sobre reúso refere-se a trabalho anterior que não foi criado especificamente para Space Apps. Citar, regravar, reescrever ou recompilar não foi apresentado nessas fontes como regularização do Ipê. [S14–S17]

**Resources.** A URL oficial do desafio e sua aba Resources não forneceram conteúdo. A regra é conhecida, mas o requisito ainda não foi comprovado para a entrega. O inventário candidato preservado em `research/01-regras-ciencia.md` veio de pesquisa anterior; esta revisão não o promove a lista oficial. Dados MOD13Q1 reais e material NASA de engenharia têm valor científico documentado; sua procedência não demonstra, por si só, que satisfaçam a lista específica. [S04–S06]

**Escopo implementado.** Segundo `docs/09-VERIFICACAO.md`, a versão 0.1.1-rd possui lançamento e perfil orbital fixos, sem propagador orbital, orçamento RF completo ou ambiente térmico. Apresentar uma missão didática delimitada. A expressão “missão completa” pertence ao resumo do desafio; não deve ser aplicada ao produto como comprovação de que todas as dimensões do enunciado foram implementadas.

**Marte.** O mapa ou a ilustração marciana pode ocupar um apêndice de visão de produto com a legenda **“Expansão visual proposta — sem integração com o motor atual”**. A demonstração funcional permanece a missão terrestre. Não ligar visualmente esse mapa à telemetria ou ao resultado científico como se o fluxo estivesse implementado.

## 3. Formato recomendado para HTML, pitch e apêndices

Produzir sete quadros no modo principal do HTML e deixar apêndices em um modo separado é uma decisão editorial adequada ao material existente. A recomendação de sete slides vem das respostas S07–S08; **não foi recuperada uma confirmação de que qualquer HTML interativo com sete telas será aceito como a apresentação exigida pelo formulário**. O HTML funciona como peça de apoio e acesso à demonstração. Uma exportação de sete páginas em inglês ou vídeo curto pode materializar a demonstração global quando o formulário for conferido.

Não foi localizada duração de pitch presencial específica de Rio Verde. O roteiro de 30 segundos é um formato de preparação, não uma atribuição de regra ao palco local.

| Quadro | Mensagem central | Evidência ou interação indicada |
|---|---|---|
| 1 — Missão Ipê | “O satélite coletou. A ciência chegou?” | Nome, desafio escolhido e identificação de P&D. |
| 2 — Quem aprende | Estudantes precisam entender como uma escolha afeta o sistema inteiro. | Objetivo educacional como hipótese; sem alegar aprendizagem medida. |
| 3 — O que o jogador decide | Energia, potência, armazenamento e comunicação limitam a entrega. | Bancada real e restrições declaradas; lançamento/órbita fixos. |
| 4 — O papel dos dados | Seis registros de arquivo MOD13Q1.061 permitem conferir os índices recebidos. | Origem → bandas → índice → recepção; cenário operacional didático separado. |
| 5 — Falha explicável | A base com contatos curtos entrega 2/6. | Traço e recibo do exemplo `02-short-base`; não uma estatística de usuários. |
| 6 — Redesenho verificável | Bateria grande + ÍNDICE entrega 6/6 no cenário curto. | Exemplo `03-short-repaired`; busca de 64 configurações e mínimo de duas mudanças neste catálogo. |
| 7 — O que já sabemos | O núcleo foi verificado; aprendizagem e execução real no equipamento-alvo ainda precisam ser observadas. | Acesso ao jogo, evidências e próximos testes; fonte NASA qualificada e elegibilidade ainda pendentes. |

Os resultados 2/6, 6/6 e o mínimo de duas mudanças são do contrato e catálogo desta versão, conforme `docs/09-VERIFICACAO.md`. Não são garantias de uma missão espacial real ou de ótimo global de engenharia. Antes de gravar a demonstração, usar os exemplos importáveis da entrega corrente; esta frente não realizou nova sessão visual do jogo.

Apêndices úteis: procedência científica; definição das hipóteses físicas; testes e seus limites; registro de IA/ativos; fontes e regras; cronologia; expansão Marte. A navegação deve deixar claro quando o público saiu dos sete quadros principais. O modelo de evidências não exige transformar todo apêndice em slide de pitch.

### Roteiro PT, cerca de 30 segundos

“O satélite coletou. A ciência chegou? No Missão Ipê, você projeta uma missão didática e equilibra energia, memória e comunicação. Dados NASA de arquivo permitem conferir a ciência recebida. No cenário curto, a configuração inicial entrega dois de seis resultados. O jogador investiga a causa, redesenha e verifica a nova execução. O protótipo registra suas hipóteses e evidências; a elegibilidade para o evento permanece pendente.”

### Roteiro EN, cerca de 30 segundos

“The satellite collected the data. Did the science reach the ground? In Missão Ipê, players balance power, storage and communications in a learning mission. Archived NASA data lets us check the received science. With shorter contacts, the starting design delivers two of six results. Players investigate, redesign and verify the next run. This research prototype records its assumptions and evidence; event eligibility remains unresolved.”

Esses textos são redação original de apoio. A duração depende da locução; cronometrar o arquivo final. O roteiro não afirma experiência humana observada, afiliação NASA ou autorização de candidatura.

## 4. Julgamento: matriz editorial, sem pesos inventados

Páginas dos eventos Ajmer e Faisalabad em 2026 citam **Impact, Creativity, Validity, Relevance e Presentation**. São fontes primárias dos respectivos organizadores locais. O guia global atual não foi recuperado; não afirmar pesos, escala, número de jurados ou rubrica específica de Rio Verde. [S11–S12]

| Eixo editorial | Como o pacote pode evidenciá-lo | O que permanece limitado |
|---|---|---|
| Impacto | Nomear o estudante e a decisão que ele deve aprender a explicar. | Benefício esperado; sem pesquisa humana concluída. |
| Criatividade | Mostrar a ligação entre escolha, gargalo, ciência recebida e reexecução. | Evitar “primeiro”, “único” ou superioridade mundial não demonstrada. |
| Validade | Conectar cada afirmação aos dados, contrato, traço e recibos. | Testes Node/DOM não equivalem a certificação de missão ou navegador real. |
| Relevância | Mostrar gestão de recursos e consequência das decisões no objetivo científico. | Enunciado integral e Resources específicos não foram fechados. |
| Apresentação | Uma cadeia causal em sete quadros, com exploração adicional acessível. | O formato do formulário e o pitch presencial ainda precisam ser observados. |

## 5. IA, visuais e créditos

S06 exige identificar onde e como a IA foi utilizada. Imagens e vídeos gerados devem conter marca visível; áudio, código e dados gerados devem ser reconhecidos em texto descritivo e metadados. Conteúdo gerado não deve usar, conter ou modificar elementos de marca NASA. A recomendação prática para as ilustrações geradas é conservar a indicação no próprio visual exibido/exportado, por exemplo **“Visual gerado por IA”**, além do registro de ferramenta, finalidade e arquivo. Isso não atribui geração por IA a dados NASA reais.

A declaração deve refletir o uso efetivo: assistência de IA em pesquisa, redação, código ou produção visual só deve ser detalhada quando o histórico o comprovar. Não listar um runtime local, modelo de classificação ou integração Fastino como funcionalidade do jogo se ele não estiver integrado. Fotografias, dados, bibliotecas, ferramentas e ativos próprios anteriores continuam precisando de procedência e créditos pertinentes. Os termos institucionais indexados pedem citação de todas as fontes usadas, inclusive abertas. [S13]

Copy compacta sugerida para o estado do projeto: **“Protótipo de P&D. Dados NASA de arquivo; cenário e recursos operacionais didáticos. Elegibilidade temporal e confirmação nos Resources do desafio pendentes.”** No apêndice, preservar o registro de horários e os links oficiais. O rótulo informa o estado; não pretende conceder elegibilidade.

## 6. Agenda útil para Rio Verde

| Marco publicado | Horário local BRT | UTC |
|---|---:|---:|
| Início do desenvolvimento orientado pelo GO Team | 14/11, 09h00 | 14/11, 12h00 |
| Pré-apresentações de domingo, agenda local | 15/11, 15h30 | 15/11, 18h30 |
| Entrega, agenda local | 15/11, 17h00 | 15/11, 20h00 |
| Apresentações, agenda local | 15/11, 18h00 | 15/11, 21h00 |
| Fechamento geral informado na página 2026 | 15/11, 23h59 | 16/11, 02h59 |

A agenda local escreve a entrega às 17h com interrogação na versão portuguesa; a inglesa afirma o horário sem interrogação. Usar 17h como corte operacional conservador enquanto se acompanha a organização local. A abertura de sexta-feira e atividades de sábado às 08h/08h30 não autorizam antecipar a janela de desenvolvimento das 09h. Não foi enviada mensagem aos organizadores. [S10, S14]

## 7. Fontes e recibo

O arquivo `evidence/spaceapps-review-r5.json` contém URLs, identificadores de recuperação, afirmações e graus de confirmação. Os identificadores de busca são procedência desta sessão; as URLs abaixo são os endereços canônicos para reconsulta.

| ID | Fonte exata | Tipo de recuperação nesta rodada |
|---|---|---|
| S01 | https://www.spaceappschallenge.org/ | Abertura: 502. |
| S02 | https://www.spaceappschallenge.org/2026/ | Conteúdo institucional indexado; abertura: 502. |
| S03 | https://www.spaceappschallenge.org/2026/find-a-team/project_morazan/ | Bloco contextual do desafio indexado; abertura: 502. |
| S04 | https://www.spaceappschallenge.org/2026/challenges/space-mission-design-game/ | Abertura: 502; enunciado integral não recuperado. |
| S05 | https://www.spaceappschallenge.org/2026/challenges/space-mission-design-game/?tab=resources | Ferramenta declarou URL inacessível; nenhum conteúdo da lista. |
| S06 | https://github.com/nasa/spaceapps/discussions/1849 | GO Team; resposta integral recuperada. |
| S07 | https://github.com/nasa/spaceapps/discussions/1947 | Navigator; resposta integral recuperada. |
| S08 | https://github.com/nasa/spaceapps/discussions/1973 | Navigator; resposta integral recuperada. |
| S09 | https://github.com/nasa/spaceapps/discussions/2028 | Anúncio GO Team; links de guias recuperados. |
| S10 | https://www.spaceappschallenge.org/2026/local-events/rio-verde/ | Página local indexada; abertura: 502. |
| S11 | https://www.spaceappschallenge.org/2026/local-events/ajmer/ | Página local indexada. |
| S12 | https://www.spaceappschallenge.org/2026/local-events/faisalabad/ | Página local indexada. |
| S13 | https://www.spaceappschallenge.org/legal/ | Termos indexados; abertura: 502. |
| S14 | https://github.com/nasa/spaceapps/discussions/1827 | GO Team; orientação de horário recuperada. |
| S15 | https://github.com/nasa/spaceapps/discussions/1872 | GO Team; orientação sobre UI/funcionalidades recuperada. |
| S16 | https://github.com/nasa/spaceapps/discussions/2009 | Resposta GO Team recuperada; estado geral da discussão “Closed Unanswered”. |
| S17 | https://github.com/nasa/spaceapps/discussions/1924 | Navigator; regra de reúso recuperada. |
| S18 | https://www.spaceappschallenge.org/resources/project-submission-guide | Link indicado por S09; timeout. |
| S19 | https://www.spaceappschallenge.org/resources/judging-awards-guide | Link indicado por S09; timeout. |
| S20 | https://www.spaceappschallenge.org/resources/participant-faqs/ | Link indicado por S09; 502. |

Não foram usados como regra atual textos de staging com datas antigas, guias de edições anteriores, inferências de competidores ou espelhos de terceiros. O relatório preserva o que já estava conhecido e registra que a nova revisão não fechou Resources, formulário atual, rubrica global integral ou elegibilidade desta equipe.
