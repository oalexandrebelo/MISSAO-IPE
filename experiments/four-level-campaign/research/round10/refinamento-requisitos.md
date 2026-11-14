# Refinamento por requisitos — Missão Ipê

Pesquisa de fontes primárias realizada em 14/11/2026. Escopo: propostas de interface, avaliação e rastreabilidade sobre o core determinístico existente, sem alterar catálogo, 64 combinações, agenda, fórmulas, pontuação ou comportamento operacional. Nenhum arquivo do site foi editado.

## As três melhorias de maior retorno

### 1. Mostrar um contrato de missão mensurável

Antes da simulação, apresentar objetivo, critérios de sucesso e restrições já existentes, em linguagem de jogo. Depois, preencher as mesmas linhas com o resultado e a evidência. Exemplo de estrutura, reutilizando os limites atuais:

| Item | Critério | Evidência após execução |
|---|---|---|
| Ciência recebida | Ciência entregue ≥ meta vigente | Valor entregue, unidade e instante da última entrega |
| Orçamento | Custo da configuração ≤ orçamento vigente | Total e folga em créditos |
| Massa | Massa selecionada ≤ limite vigente | Total e folga em kg |
| Energia | Respeitar o limite operacional já usado pelo core | Menor estado de carga e momento do evento limitante, se expostos |

Cada requisito recebe identificador curto, finalidade, regra de avaliação, unidade e estado: ainda não avaliado, atendido, não atendido ou não concluído. Encerramento precoce deve preservar falhas já demonstradas e deixar não concluídos apenas os critérios cuja evidência necessária não foi produzida; não transformar a ausência de medição em aprovação ou falha automática. “Ver evidência” leva ao evento/resultado correspondente; não precisa acrescentar um formulário para o jogador.

**Base documental:** NPR 7123.1D §3.2.3.2 pede requisitos quantitativos, mensuráveis, verificáveis e rastreáveis; §3.2.12 trata gestão e rastreabilidade. É a inspiração metodológica, não uma obrigação institucional da Missão Ipê [R05].

**Aceitação de produto proposta:** todos os critérios exibidos usam exatamente os limites e resultados atuais; nenhuma linha recebe “atendido” antes da avaliação; a configuração e o mesmo cenário produzem os mesmos resultados antes e depois desta camada.

### 2. Transformar o debrief em evidência + interpretação

Organizar o pós-missão em duas perguntas distintas, sem chamar ambas de “validação NASA”:

- **O projeto cumpriu os critérios?** Resultado calculado para cada requisito, com a causa dos limites: orçamento, massa, energia, armazenamento ou comunicação, conforme as saídas já disponíveis.
- **O resultado atende ao objetivo desta missão?** Explicação do que efetivamente chegou à Terra e do que faltou. Expor a diferença entre coletar e entregar, destacando um gargalo e uma mudança possível.

No texto auxiliar, explicar que verificação confronta requisitos, enquanto validação confronta finalidade e uso pretendido. A NPR 7123.1D distingue esses processos e também distingue validação do produto de validação dos próprios requisitos [R06].

**Duas camadas que não podem ser confundidas:** os testes determinísticos verificam o software e os critérios simulados; para validar o jogo como produto educacional, é necessário observar jogadores realizando a tarefa. Testes passando não demonstram que as pessoas aprenderam. Uma rodada de pesquisa pode avaliar se o participante consegue explicar um compromisso entre ciência, comunicação e energia, sem ajuda. Essa validação continua “planejada” até haver evidência.

**Aceitação proposta:** o debrief apresenta evidência numérica e interpretação sem inventar telemetria; um resultado que coletou dados mas não os entregou não recebe texto de sucesso científico; a interface não afirma validação educacional já realizada.

### 3. Comparar alternativas com folgas e motivo da escolha

Permitir fixar duas configurações existentes e comparar os resultados sob o mesmo cenário. Mostrar ciência entregue, custo, massa e indicadores operacionais já produzidos. Acrescentar uma explicação factual do ganho e da perda: “esta opção entrega mais ciência e usa mais créditos”, com números reais.

Folga de orçamento = limite − total; folga de massa = limite − massa. Para energia, preferir a diferença entre mínimo observado e limite operacional, se esses campos existem, em vez de inventar uma média. Percentuais precisam declarar denominador. Não introduzir taxa de falha probabilística ou ranking “NASA” sem modelo.

O processo de análise de decisões da NPR 7123.1D considera critérios, alternativas, análise, seleção e incertezas [R05]. O Apêndice G considera margens e recursos de massa, potência e memória nas revisões, sem prescrever nessas passagens uma porcentagem única [R08]. A NPR 7120.8A diferencia meta desejada e limiar mínimo para seus parâmetros de desempenho [R09].

**Aceitação proposta:** comparar sob o mesmo cenário; evitar premiar uma alternativa por uma restrição que a outra não recebeu; preservar o score existente; “melhor” deve sempre apontar o critério considerado. Um projeto dominado pode ser identificado por critérios explícitos, sem substituir o objetivo do jogador por um peso oculto.

## Auditoria das versões e dos três links solicitados

Todos os endereços fornecidos foram abertos diretamente pela web.

| Referência solicitada | Resultado observado em 14/11/2026 | Responsabilidade institucional e histórico |
|---|---|---|
| NPR 7123.1D | Página informa **Updated w/Change 2**, efetiva desde 05/07/2023, expiração em 05/07/2028 | Office of the Chief Engineer. O prefácio cancela NPR 7123.1C, de 14/02/2020 [R01, R04]. |
| NPR 7120.5, descrita F, URL com 5E | O endereço resolve para **NPR 7120.5F w/Change 4**, efetiva desde 03/08/2021, expiração mostrada em 03/02/2027 | Associate Administrator. A página encaminha expressamente para **NID 7120.148** como texto com requisitos mais recentes. Revisão E é antecedente substituída; não rotular o conteúdo aberto como E [R02, R10]. |
| NPR 7120.8A | Página informa **Revalidated w/change 5**, efetiva desde 14/09/2018, expiração em 14/09/2028 | Associate Administrator. Cancela NPR 7120.8 de 05/02/2008. Change 5, de 27/10/2023, atualizou a declaração de aplicabilidade [R03, R11, R12]. |

**Correção importante sobre a diretiva provisória:** a capa do PDF NID 7120.148 mostra vigência a partir de 09/12/2024 e expiração original em 09/12/2025. O catálogo oficial NODIS informa que a expiração foi prorrogada para **01/08/2027**. Portanto, não diagnosticar a NID como vencida com base só na capa. Citar o catálogo juntamente com o PDF [R07, R13].

As páginas informam que as diretivas não vinculam o público salvo autorização legal ou incorporação contratual. Os prefácios delimitam NASA, centros e situações contratuais. A 7123.1D prevê adaptação proporcional ao tipo, porte e complexidade; isso não cria processo formal de aprovação NASA para o jogo [R04]. A 7120.8A rege atividades de pesquisa e tecnologia da NASA e possui critérios próprios para casos geridos pela 7120.5; não é uma norma universal para todo protótipo [R11].

Texto editorial recomendado: **“Práticas de engenharia de sistemas adaptadas para esta simulação educacional.”** Na área de referências, identificar documento, revisão, mudança e data de consulta. Não usar “certificado”, “aprovado para voo”, “NASA compliant” ou o fato de os testes passarem como equivalentes a uma revisão institucional.

## Ciclo de vida: o que os documentos apoiam

A figura 2-5 da NID 7120.148 foi inspecionada visualmente. Para projetos de voo, apresenta **Pre-Phase A**, seguida de fases A a F: conceito, definição preliminar, projeto/fabricação, integração/testes/lançamento, operações e encerramento. **“Fase 0” não é o rótulo dessa figura.** KDP 0 aparece em ciclos de programas, e não deve ser confundido com uma fase inicial universal de qualquer projeto [R07, R14].

A NPR 7123.1D §5.1.5 vincula revisões à maturidade das evidências e aos critérios de entrada, não simplesmente à passagem do calendário. O mesmo capítulo explica que o ciclo depende da natureza do programa/projeto [R15].

Adaptação recomendada para o jogo, sem acrescentar bloqueios burocráticos:

| Momento do jogo | Ação do jogador | Evidência mostrada |
|---|---|---|
| Definir a missão | Entender objetivo e limites | Contrato de missão |
| Comparar projetos | Escolher configuração e examinar compromissos | Dois projetos no mesmo cenário |
| Executar | Observar o funcionamento da configuração | Eventos e métricas existentes |
| Revisar | Explicar o resultado e decidir uma mudança | Debrief, requisitos e diferença entre tentativas |

Esses quatro momentos são uma síntese didática nossa, não uma reprodução das fases NASA nem uma revisão formal MCR/SRR/PDR/CDR/FRR. Se for desejado usar “Fase 0” como nome de onboarding, explicitar que é nomenclatura do jogo. Para reduzir jargão, a interface principal pode ficar com verbos e manter a correspondência conceitual na área “Como foi pensado”.

## Risco, margens e decisões sem alterar o motor

Separar três situações:

1. **Resultado conhecido:** a execução ultrapassou um limite; mostrar evento e consequência.
2. **Folga pequena:** há pouca distância entre resultado e limite no cenário calculado; mostrar a quantidade sem convertê-la em probabilidade.
3. **Incerteza fora do modelo:** condições físicas e operacionais reais não representadas; tratar na explicação metodológica, não sortear falhas para aparentar realismo.

Uma reserva escolhida pelo jogo é didática e deve ser identificada assim. “10% de folga” não significa “90% de confiabilidade”. Não copiar valores de margens ou regras de autorização institucional para o score.

As comparações podem reutilizar os 64 resultados determinísticos já verificáveis. Um histórico pequeno pode guardar ID da configuração, cenário, versão do conjunto de regras, métricas e explicação do jogador. Isso permite repetir e comparar sem criar um novo simulador.

## Limites de implementação para a próxima frente

- Adicionar apenas leitura, apresentação, rastreabilidade e comparação sobre as saídas existentes.
- Conservar o mesmo catálogo, agenda, 64 combinações e semântica de ciência entregue.
- Não recalibrar pontuação silenciosamente para fazer novas telas parecerem úteis.
- Não exibir uma métrica que o core não calcula como se fosse medida. Se falta um campo, restringir a primeira entrega ao que já existe.
- Fazer uma verificação de regressão dos resultados antes/depois; os testes e o oracle já existentes são a referência. Testes novos devem cobrir a camada de critérios/comparação quando ela adicionar lógica.
- Não abrir uma nova frente de física, compliance de voo ou aprovação formal. Nenhuma dessas três melhorias precisa disso.

## Fontes consultadas

As referências R01–R03 são precisamente os links solicitados. As demais resolvem versão, contexto e trechos específicos. As URLs permitem conferir a versão e o contexto de cada documento.

| ID | Fonte primária | Data de consulta |
|---|---|---|
| R01 | NPR 7123.1D, página principal: https://nodis3.gsfc.nasa.gov/displayDir.cfm?Internal_ID=N_PR_7123_001D_&page_name=main | 14/11/2026 |
| R02 | URL fornecida 7120.5E, resolução para F: https://nodis3.gsfc.nasa.gov/displayDir.cfm?t=NPR&c=7120&s=5E | 14/11/2026 |
| R03 | NPR 7120.8A, página principal: https://nodis3.gsfc.nasa.gov/displayDir.cfm?Internal_ID=N_PR_7120_008A_&page_name=main | 14/11/2026 |
| R04 | NPR 7123.1D, Preface P.2/P.6: https://nodis3.gsfc.nasa.gov/displayDir.cfm?Internal_ID=N_PR_7123_001D_&page_name=Preface | 14/11/2026 |
| R05 | NPR 7123.1D, §3.2.3, §3.2.12, §3.2.18: https://nodis3.gsfc.nasa.gov/displayDir.cfm?Internal_ID=N_PR_7123_001D_&page_name=Chapter3 | 14/11/2026 |
| R06 | NPR 7123.1D, Appendix A, Validation/Verification: https://nodis3.gsfc.nasa.gov/displayDir.cfm?Internal_ID=N_PR_7123_001D_&page_name=AppendixA | 14/11/2026 |
| R07 | NID 7120.148, PDF, capa e figura 2-5 página 23: https://nodis3.gsfc.nasa.gov/OPD_Docs/NID_7120_148_.pdf | 14/11/2026 |
| R08 | NPR 7123.1D, Appendix G, margens e revisões: https://nodis3.gsfc.nasa.gov/displayDir.cfm?Internal_ID=N_PR_7123_001D_&page_name=AppendixG | 14/11/2026 |
| R09 | NPR 7120.8A, §4.2.7.7, meta/limiar de KPP: https://nodis3.gsfc.nasa.gov/displayDir.cfm?Internal_ID=N_PR_7120_008A_&page_name=Chapter4 | 14/11/2026 |
| R10 | NPR 7120.5F, prefácio e aplicabilidade: https://nodis3.gsfc.nasa.gov/displayDir.cfm?Internal_ID=N_PR_7120_005F_&page_name=Preface | 14/11/2026 |
| R11 | NPR 7120.8A, prefácio e cancelamento: https://nodis3.gsfc.nasa.gov/displayDir.cfm?Internal_ID=N_PR_7120_008A_&page_name=Preface | 14/11/2026 |
| R12 | NPR 7120.8A, Change Log: https://nodis3.gsfc.nasa.gov/displayDir.cfm?Internal_ID=N_PR_7120_008A_&page_name=ChangeLog | 14/11/2026 |
| R13 | Catálogo NODIS de NIDs, extensão até 01/08/2027: https://nodis3.gsfc.nasa.gov/OPD/OPD_list.cfm?dir=asc&moduleInputs=NID&sort=opr | 14/11/2026 |
| R14 | NPR 7120.5F, Chapter2, distinção ciclos de programa/projeto: https://nodis3.gsfc.nasa.gov/displayDir.cfm?Internal_ID=N_PR_7120_005F_&page_name=Chapter2 | 14/11/2026 |
| R15 | NPR 7123.1D, §5.1, revisões por maturidade: https://nodis3.gsfc.nasa.gov/displayDir.cfm?Internal_ID=N_PR_7123_001D_&page_name=Chapter5 | 14/11/2026 |
