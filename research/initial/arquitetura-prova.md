# Arquitetura e prova — Space Mission Design Game

Pesquisa de preparação para AB / Hackatur – Zer0Slop, NASA Space Apps Rio Verde, corte de 14/11/2026. Frente 05. **Este documento é uma análise e especificação proposta; não houve construção do jogo, execução de benchmark, teste com usuários nem acesso validado ao hardware.** Horários abaixo são locais de Rio Verde. A janela operacional informada de 14/11 às 09h até entrega em 15/11 às 17h tem **32 horas corridas**; “hackathon de 48h” não autoriza planejar 48 horas de implementação. Pitch às 18h e pré-apresentação às 15h30 orientam os congelamentos.

## Decisão proposta

**GO condicional para um jogo cooperativo local que ensina a fechar uma única missão de observação da Terra em LEO.** O momento demonstrável é: uma equipe explica por que sua missão falhou, faz uma alteração mínima permitida no catálogo, consegue entregar observações e entende o custo dessa mudança. Cerrado é o contexto da tarefa; isso não torna o simulador um produto operacional de monitoramento ambiental.

A contribuição mais defensável é unir **restrições físicas rastreáveis, consequências visíveis e comparação de decisões**. React Flow pode representar dependências entre subsistemas, mas não precisa ser o editor de toda a aplicação. O mapa pode ser uma visualização 2D de uma órbita e de pontos de interesse, sem tiles remotos. Não há necessidade funcional de multiplayer em rede, LLM, CUDA, WebGPU, 3D, autenticação, banco de dados ou pipeline de dados ao vivo.

Até 09h, limitar o trabalho à pesquisa, leitura, organização de equipe e decisão de escopo, conforme a orientação GO Team registrada na pesquisa de regras. Iniciar código, assets do projeto, pack de produção e implementação somente na janela autorizada. Não contar este estudo como execução técnica do MVP.

**Gate técnico até 11h de 14/11:** requisitos do desafio conferidos; ao menos uma fonte NASA dos Resources do desafio identificada e ligada a uma mecânica central; catálogo mínimo com proveniência viável; resultado físico de um caso manual; uma pessoa responsável por revisão científica; distribuição pública e distribuição local escolhidas. A mera existência da SoA no site NASA não prova que ela satisfaça o requisito de estar nos Resources específicos do desafio: isso deve ser conferido no enunciado vigente.

## Fontes científicas: o que cada uma sustenta

| Fonte primária verificada | Uso adequado no jogo | O que ela não certifica |
|---|---|---|
| [NASA Small Spacecraft SoA 2026](https://www.nasa.gov/smallsat-institute/sst-soa/), edição publicada em maio de 2026; página atualizada em 14/05/2026 | Selecionar referências de subsistemas, condições e maturidade; ligar escolhas a uma origem auditável | Que um conjunto de peças do catálogo forme uma nave compatível ou pronta para voo |
| [SoA, 3.0 Power](https://www.nasa.gov/smallsat-institute/sst-soa/power-subsystems/), 07/05/2026, especialmente 3.1–3.2 | Separar geração, armazenamento e gerenciamento; registrar incidência, eclipse e condições BOL/EOL | O texto alerta que características de fornecedores podem diferir da performance real e não foram verificadas independentemente pela NASA; o jogo deve preservar essa qualificação |
| [NASA CubeSat 101](https://science.nasa.gov/wp-content/uploads/2023/06/nasa_csli_cubesat_101_508.pdf), revisão de outubro de 2017 | Vocabulário, fases de projeto e interfaces; conectar o jogo a um processo real de desenvolvimento | Manual atualizado de qualificação de peças de 2026 ou certificação de engenharia do protótipo |
| [Mission Design Lab, Goddard](https://etd.gsfc.nasa.gov/capabilities/integrated-design-center/mission-design-lab) | Inspirar a colaboração entre disciplinas, alternativas e estimativas de massa, potência e taxa de dados | Alegação de parceria com a NASA ou equivalência do jogo aos estudos do MDL |
| [GMAT R2026, catálogo NASA](https://software.nasa.gov/software/GSC-19640-1) e [especificações matemáticas GMAT, NTRS 20080031744](https://ntrs.nasa.gov/citations/20080031744) | Referência independente para uma trajetória de controle se houver instalação utilizável durante o evento; documentar modelo e referencial usados | Equivalência automática ao GMAT, validação de toda a missão ou necessidade de embarcar o GMAT no navegador |

**Separação editorial obrigatória:** “valor transcrito da referência”, “valor derivado por equação” e “hipótese didática” são três classes diferentes. Uma massa arredondada, capacidade adaptada, taxa de downlink efetiva ou custo em créditos não passa a ser “dado NASA” por estar no mesmo JSON que uma citação NASA. Evitar copiar tabelas inteiras de fornecedores; selecionar poucos parâmetros necessários, com origem e condições.

## Contrato de uma missão que cabe no prazo

**Proposta de recorte, ainda não validada por simulação:** uma órbita terrestre circular predefinida; horizonte de 24h simuladas; três pontos de interesse no Cerrado; uma estação terrena didática; três famílias de componentes de energia e poucas alternativas de instrumento, rádio e armazenamento. O requisito de missão é entregar um número definido de observações completas dos alvos dentro do horizonte, sem violar massa, capacidade elétrica, reserva de energia ou integridade do armazenamento. “Observação completa” tem identificador, tamanho em bits, alvo, horário e requisitos de geometria explícitos.

Fixar altitude, inclinação e fase na primeira versão. Um exemplo de altitude de 550 km é uma **hipótese de cenário**, não uma especificação extraída da NASA. Escolher a geometria durante o evento de modo que realmente existam janelas sobre os alvos e contato com a estação; não desenhar uma passagem inexistente para acomodar a narrativa. Se a geometria não for validada a tempo, usar uma tabela de janelas didáticas explicitamente identificada e não alegar previsão de passagem real.

Quatro modos mutuamente exclusivos — espera, observação, transmissão e estado terminal de falha — reduzem inconsistências. O modo de observação depende da janela do alvo e iluminação aplicável. Transmissão depende de contato, rádio compatível e potência disponível. Uma orientação favorável à câmera não pode ganhar automaticamente a geração máxima de um painel que exigiria outro apontamento: o pack define o fator de incidência por modo.

Um catálogo finito possível: 3 baterias × 3 painéis × 2 instrumentos × 2 rádios × 2 buffers × 4 planos operacionais = **288 combinações antes de excluir incompatibilidades**. É uma escolha de engenharia do MVP, não uma contagem já implementada. Os planos operacionais são regras de agenda, não sequências arbitrárias de milhares de comandos. Congelar os requisitos de ciência impede que “desligar a câmera” seja uma solução falsa para a falta de energia.

### Limites orbitais e geográficos

Para uma órbita circular ideal, com raio geocêntrico `a = R_Terra + h`, em metros, e parâmetro gravitacional `μ` em m³/s²:

- `n = sqrt(μ / a³)` tem unidade s⁻¹; `T = 2π/n` resulta em segundos.
- A equação de referência de dois corpos é `r̈ = −μ r / |r|³`; coordenadas, origem, época e orientação do referencial precisam ser declaradas.
- Movimento inercial não é a trilha sobre o solo: a conversão para longitude exige rotação da Terra e convenção de tempo. Não chamar coordenadas inerciais de latitude/longitude.
- Um eclipse cilíndrico simplificado ocorre quando o satélite está atrás da Terra em relação ao Sol e a distância ao eixo da sombra é menor que o raio terrestre. A aproximação usa Sol distante e não resolve penumbra.
- Uma janela de estação pode usar elevação acima de máscara em uma Terra esférica, sem relevo, refração ou apontamento real de antena. Visada geométrica não prova que o enlace de rádio feche.

Dois corpos não inclui achatamento/J2, arrasto, terceiros corpos, pressão de radiação, manobras, dispersões de lançamento ou efemérides completas. Não sustenta promessa de órbita heliossíncrona estável, revisita operacional, vida útil, colisões, cobertura real de nuvens ou qualidade radiométrica. Um horizonte curto reduz o escopo, mas não mede o erro dessas omissões. Registrar o que foi comparado, contra qual referência e com qual tolerância; não inventar um erro percentual único.

**SGP4 não é um propagador lunar genérico.** O [Spacetrack Report No. 3](https://celestrak.org/NORAD/documentation/spacetrk.pdf), fonte original de Hoots e Roehrich, trata a propagação de elementos NORAD de objetos em órbita terrestre e sua compatibilidade com o modelo. Não alimentar TLEs como elementos osculadores de um integrador diferente sem conversão adequada. Uma futura missão lunar exige outro cenário, modelos e validação; a palavra “deep-space” em variantes da família não autoriza reutilizá-las como mecânica cislunar.

## Motor e fronteiras da aplicação

| Bloco | Responsabilidade e contrato | Corte de escopo |
|---|---|---|
| Interface React + TypeScript + Vite | Seleção de peças/agenda; missão atual; comparação; fontes; feedback acessível | Componentes conhecidos; evitar framework novo no evento |
| Núcleo TypeScript puro | `entrada validada → trace + métricas + violações`; sem DOM, rede, relógio de parede ou aleatoriedade global | Sem banco, agente autônomo ou serviço externo para decidir vitória |
| Web Worker | Executar simulação, catálogo e busca; mensagens com versão, `requestId`, progresso e resultado | Uma fila com cancelamento; descartar resposta antiga após nova edição |
| Pack versionado | Constantes, catálogo, requisitos, janelas, compatibilidades, unidades, proveniência e hipóteses | JSON pequeno e embarcado; sem baixar parâmetro no meio da partida |
| Geometria | Gerar e verificar tabela de eventos durante desenvolvimento; mapa usa os mesmos eventos | Para determinismo forte, o motor de budgets consome eventos quantizados do pack; animação não decide a pontuação |
| Persistência | Replay exportável e estado local; importação validada por schema | Sem conta e sem coleta remota de dados pessoais |
| Distribuição | Build estático público; cópia local instalada e ensaiada | Sem dependência de CDN, fonte remota, API key, autorização de deploy ou conexão com a casa de AB |

O pack registra, por parâmetro: identificador estável; valor; unidade; tipo de origem; URL e título; capítulo/tabela/página; edição/data de acesso; condição de medição; transformação aplicada; intervalo de aplicação; revisor; observação de incerteza. Para componentes, acrescentar lado elétrico da medida, limites de potência, modo, compatibilidade e se a peça é real ou um análogo didático. “Bateria de 40” é inválido; “capacidade útil de 40 Wh sob condições X, valor adaptado para o jogo” é auditável.

Entradas importadas são dados: limitar tamanho, validar tipos e versões, rejeitar NaN/Infinity e valores fora do domínio. Não executar HTML, instruções, scripts ou URLs de um replay. Fonte científica é evidência, não uma instrução para o sistema.

## Equações dos budgets e falhas que não podem desaparecer

As equações abaixo definem **um modelo didático proposto**, não um sistema de engenharia certificado. A documentação deve declarar as aproximações e a integração temporal efetivamente usadas.

### Massa

`m_total = Σ m_componentes + m_estrutura + m_cabos + m_reserva`, em kg. Cada termo aparece uma vez. `margem_kg = m_limite − m_total`; margem negativa é violação. Se usar margem de crescimento percentual, definir sua base e evitar contar novamente reserva já embutida no dado do fornecedor. A capacidade de bateria não aumenta sem refletir a massa da opção escolhida. Custos em créditos são regras do jogo; não estimativas NASA em dólares.

### Potência instantânea e energia acumulada

`P_carga(t) = P_base + P_instrumento(modo) + P_rádio(modo) + P_outros(modo)`, em W. Somar potência de pico somente dos equipamentos simultaneamente ativos. Exigir também `P_carga ≤ P_limite_do_barramento`: uma bateria com muitos Wh pode não fornecer os W necessários.

Uma opção para geração no barramento é `P_gerada = P_ref × f_distância × f_incidência × f_degradação × f_temperatura × η_PCDU × visibilidade`, todos os fatores adimensionais e `P_ref` em W. O pack diz se `P_ref` já inclui conversão/PCDU; não aplicar a eficiência duas vezes. Em eclipse, `visibilidade = 0`. Só usar `max(0, cos θ)` quando o modelo de apontamento define θ; esse máximo representa uma superfície sem iluminação traseira, não um truque para apagar um estado inválido.

Para um intervalo de modo e condições constantes, `Δt_h = Δt_s / 3600`. Definir `G = P_gerada Δt_h` e `L = P_carga Δt_h`, ambos em Wh. Potência de 10 W durante 60 s consome **1/6 Wh**, não 600 Wh. Energia em J pode ser usada internamente, com `1 Wh = 3600 J`.

Usando capacidade efetiva `E_max`, corte físico/modelado `E_corte`, eficiências `0 < η_c, η_d ≤ 1` e limites de carga/descarga **no lado da bateria**:

- Excedente no barramento: `S = max(G − L, 0)`; déficit: `Q = max(L − G, 0)`.
- Entrada na bateria: `C = min(η_c S, E_max − E, P_carga_bateria_max Δt_h)`.
- Saída da bateria: `D = min(Q/η_d, E − E_corte, P_descarga_bateria_max Δt_h)`.
- Estado: `E_seguinte = E + C − D`.
- Energia descartada no barramento: `spill = S − C/η_c`; demanda não atendida: `unmet = Q − η_d D`.

Todas as parcelas acima são Wh. A reserva requerida de missão `E_reserva` é separada de `E_corte`: cruzar a reserva reprova o requisito; alcançar corte pode causar brownout. Não transformar um estado fisicamente impossível em sucesso aplicando `clamp(E,0,E_max)`. Registrar o primeiro instante, mecanismo e magnitude da violação. Saturação de carga pode ser comportamento normal se contabilizada como spill; energia não atendida não é normal.

No MVP, brownout pode encerrar a execução com falha explícita; não é necessário inventar uma recuperação autônoma. Dividir intervalos em mudanças de modo, eclipse, contato e cruzamentos críticos; não conceder uma imagem inteira depois de uma falha elétrica ocorrida no meio da exposição. Parâmetros devem entrar válidos, com `E_corte ≤ E ≤ E_max`. Quantização e tolerâncias devem ser fixas e documentadas, sem usar epsilon grande para fazer uma missão passar.

### Produção, armazenamento e comunicação

`bits_por_observação = pixels × bits_por_pixel × bandas / fator_de_compressão`, se essas grandezas forem realmente o modelo adotado. Compression ratio é uma hipótese ou característica declarada, não melhoria gratuita. A produção pode ser `R_payload × Δt_s`, com `R_payload` em bit/s. `1 byte = 8 bits`; unidades de armazenamento e taxas ficam explícitas.

No modo de transmissão, `capacidade_de_serviço_bits = R_link_bit_s × η_protocolo × Δt_contato_s`. A taxa pode ser uma taxa efetiva assumida no catálogo; nesse caso declarar que **não foi calculado um orçamento de enlace RF completo**. Um enlace físico completo exigiria frequência, distância, potências, ganhos, perdas, ruído e requisito de demodulação. Não apresentar capacidade nominal como garantida em toda elevação.

Com modos exclusivos, observar adiciona dados e transmitir retira dados em intervalos distintos. Em cada intervalo: calcular produção válida `A`; retirar `X = min(buffer + A, capacidade_de_serviço)` quando transmissão for permitida; calcular `buffer_bruto = buffer + A − X`; registrar `perda = max(buffer_bruto − capacidade_buffer, 0)` e então limitar o buffer físico. O ledger conserva `buffer_inicial + ΣA = buffer_final + ΣX + Σperda`. Não contar bits transmitidos acima do que existia nem ocultar perda ao limitar a fila.

O sucesso conta **observações completas e válidas entregues**, não apenas volume bruto. IDs impedem premiar a mesma observação duas vezes. Mostrar fila no fim do horizonte; volume capturado não é volume entregue. Nuvens e resolução real do sensor não foram inferidas desse budget: se não forem modeladas, o texto de produto não promete observações utilizáveis no mundo real.

## Explicações contrafactuais, Pareto e replay

Para uma configuração que falha, enumerar as combinações permitidas com os mesmos requisitos, janelas e condições. Ordenar reparos viáveis por: **(1) menor número de escolhas alteradas; (2) menor distância no catálogo definida antecipadamente; (3) desempate estável por IDs**. Exibir todos os empates úteis ou explicitar o desempate. A frase correta é “menor alteração entre as opções disponíveis que satisfaz estes requisitos neste modelo”. Se nenhuma troca isolada funcionar, dizer que são necessárias duas alterações ou que não há reparo no catálogo. Não esconder objetivos perdidos.

Explicar o mecanismo por comparação de trace: evento original, variável limitante, mudança aplicada, ΔWh/Δkg/Δbits e novas margens. Exemplo de estrutura, sem resultado inventado: “a opção B evita a violação de reserva no eclipse modelado, acrescenta massa e mantém as entregas exigidas”. Isso é uma intervenção computacional no modelo. Não é evidência de causalidade externa, nem garantia de que uma troca real produziria o mesmo efeito.

Para o Pareto, escolher poucas métricas transparentes: minimizar massa e créditos didáticos, maximizar observações válidas completas entregues. Filtrar inviáveis ou separá-los visualmente. Uma opção domina outra somente se não é pior em nenhuma métrica e é estritamente melhor em pelo menos uma. Não somar W, kg e bits em um “score científico” sem normalização e pesos assumidos. “Fronteira exata do catálogo enumerado” é uma alegação verificável; “melhor projeto possível de satélite” não é. Se a busca for parcial por tempo, rotular “fronteira das opções avaliadas”.

Replay inclui versão do motor/schema, hash do pack, parâmetros e agenda, condições/seed, algoritmo e versão do PRNG quando houver, unidades, política de quantização e evento inicial. Não usar `Math.random`, data atual ou ordem de resposta da rede para resultados. Caso exista aleatoriedade, gerar a lista de eventos por índices estáveis antes da simulação; uma troca de componente não pode consumir sorteios diferentes e mudar o ambiente ocultamente.

Hash do input canônico identifica o experimento; ele **não comprova validade científica**. Canonicalizar chaves, ordenação, números e codificação antes de SHA-256. Comparar resultados numéricos com tolerância publicada. Para replay idêntico entre navegadores, usar tabelas de eventos quantizadas e budgets em inteiros/fixo com arredondamento definido; não presumir identidade de últimos bits de trigonometria em todo runtime. A animação pode usar ponto flutuante sem afetar a avaliação. Validar overflow de inteiros seguros nos limites do catálogo.

## Contratos e testes de invariantes com valor real

| Contrato | Caso de teste e resultado esperado | Bloqueia entrega? |
|---|---|---|
| Unidades | 10 W × 60 s = 1/6 Wh; 1 MB decimal = 8 Mb decimais; prefixos binários explicitados quando usados | Sim |
| Massa | Total e reserva calculados uma vez; qualquer margem negativa reprova | Sim |
| Conservação de energia | Entrada solar + bateria inicial = serviços + bateria final + perdas de conversão + spill, dentro da tolerância | Sim |
| Brownout visível | Carga acima da geração e bateria insuficiente gera evento e falha; não segue pontuando | Sim |
| Potência de pico | Mesma capacidade em Wh, limite de W insuficiente: falha instantânea identificada | Sim |
| Eclipse | Geração solar zero no intervalo de sombra; bateria cai segundo a carga | Sim |
| Saturação | Bateria cheia não acumula energia; excesso aparece como spill sem criar energia | Sim |
| Conservação de dados | Inicial + produzidos = final + transmitidos + perdidos; transmissão sem buffer não cria bits | Sim |
| Contato | Nenhum bit transmitido fora da janela; buffer nunca fica negativo | Sim |
| Overflow | Buffer excedido gera perda explícita e efeito no requisito; não apaga a violação | Sim |
| Ciência válida | Não contar observação incompleta, fora de janela, sem energia ou repetida | Sim |
| Modos e ordem | Eventos simultâneos têm precedência definida; intervalo [início,fim) evita dupla contagem | Sim |
| Detalhe temporal | Reduzir passo nas fronteiras não muda sucesso/fracasso de fixtures afastadas do limiar; diferença perto do limiar é explicada | Sim |
| Geometria | Órbita circular ideal conserva raio e período analítico; converter referencial corretamente | Se a UI alegar órbita física |
| Referência independente | Caso manual simples separado do código; se GMAT for usado, mesma época, forças e referencial, residual registrado | Caso manual: sim; GMAT: desejável |
| Replay | Mesmo pack/input/seed → mesmos eventos e métricas no critério documentado; seed não altera condições entre candidatos | Sim |
| Pareto | Catálogo pequeno de teste com dominado, empate e tradeoff conhecido devolve a fronteira correta | Se apresentado |
| Menor reparo | Exhaustão de um catálogo diminuto confirma minimalidade; “nenhum reparo” é um resultado válido | Se apresentado |
| Worker | Editar duas vezes rapidamente não troca estado novo por resposta antiga; cancelamento preserva interface | Sim |
| Entrada hostil/corrompida | Versão desconhecida, NaN, JSON excessivo, ID inexistente e conteúdo HTML são rejeitados sem executar conteúdo | Sim |
| Distribuição | Link em janela anônima externa; pacote local em perfil limpo, rede desligada e cache vazio | Sim |

Os testes não devem apenas repetir as fórmulas do código em outra função. Os casos manuais de uma fonte constante, eclipse total, fila com transmissão conhecida e violações intencionais funcionam como oráculos independentes. Um gráfico bonito que coincide com seu próprio cálculo não valida a física.

## Prova de produto e aprendizado

**Roteiro demonstrável em três minutos:** apresentar requisito e fontes; executar uma configuração que falha por mecanismo compreensível; pedir previsão à equipe; aplicar uma alteração mínima; comparar traces e massa; mostrar uma segunda opção não dominada; exportar/importar replay e repetir a execução sem rede. Usar parâmetros reais do protótipo no pitch; nada de números de eficácia fabricados.

Além da demo, fazer um estudo exploratório com **6–8 pessoas, se houver disponibilidade**, registrando a amostra efetivamente obtida. Não converter indisponibilidade em dados simulados. Público: estudantes ou participantes que não escreveram o motor; registrar familiaridade prévia com espaço e engenharia.

Baseline: uma folha/tela estática com o mesmo catálogo, unidades e requisitos, sem feedback temporal ou recomendação. Comparar com o jogo em tarefas distintas de dificuldade semelhante, com ordem contrabalançada AB/BA quando a amostra permitir. As pessoas não recebem primeiro a solução de uma tarefa e depois repetem a mesma tarefa “melhoradas” no jogo. Perguntas prévias e ajuda do facilitador são padronizadas.

Após cada condição, usar uma situação nova de transferência **sem recomendação automática**: eclipse mais longo, janela de downlink menor ou instrumento com maior taxa de dados. Pedir previsão, escolha e explicação. Rubrica preparada antes dos testes: 0–2 por identificar a restrição, 0–2 por justificar um reparo, 0–2 por antecipar o tradeoff. “Conseguir passar de fase com a dica” é usabilidade/execução, não demonstração suficiente de aprendizagem.

Registrar sucesso sem ajuda, tempo limitado por tarefa, número de tentativas, intervenção do facilitador, acerto de previsão, escore de transferência e trechos de raciocínio com consentimento. Relatar contagens individuais e medianas/ranges, não apenas uma porcentagem. Exemplo de redação aceitável após dados reais: “5 de 7 reconheceram o limite do buffer no problema novo”; não “71% de ganho de aprendizagem” sem definição e baseline adequados.

Com n pequeno e conveniência, não prometer significância, causalidade, generalização para escolas nem retenção de longo prazo. O contrabalanceamento reduz viés de ordem, mas não elimina contaminação entre tarefas. Se houver avaliador independente disponível, ele pontua respostas sem saber a condição; divergências são preservadas e discutidas. O objetivo do evento é produzir evidência exploratória sobre entendimento, principais erros e necessidade de ajustes.

## Plano de CPU, GPU, memória e performance

| Recurso informado por AB | Uso proposto | Estado de evidência |
|---|---|---|
| i9-13900K + RTX 3070 padrão 8 GB | Desenvolvimento/build principal; referência rápida para o Worker | Hardware relatado; acesso, RAM total, sistema e desempenho não validados |
| Ryzen 5600X + RTX 2060 SUPER 8 GB | Segunda máquina, regressão e backup de demo | Hardware relatado; nada medido |
| MacBook com 24 GB | Compatibilidade em outro sistema/navegador; cópia local de contingência | Não assumir modelo de chip não informado |
| Mac mini sem especificação | Reserva somente depois de inventário e teste | Não estimar capacidade, RAM ou tempo de execução |

O jogo deve funcionar na CPU com uma Worker; GPU fica restrita à composição normal da interface. Ter duas GPUs com 8 GB não cria uma memória unificada de 16 GB nem aceleração automática do navegador. Nenhuma inferência de LLM local é necessária. Não planejar um serviço na casa de AB como dependência do julgamento.

Com passo máximo proposto de 10 s, 24h representam 8.640 passos antes de eventos adicionais. 288 combinações correspondem a cerca de 2,49 milhões de avaliações de passo — **conta de carga de trabalho, não benchmark**. Pré-computar condições compartilhadas; busca guarda métricas agregadas por candidato e traces completos só para os selecionados. Decimar a série visual, por exemplo para um ponto/minuto preservando eventos: 1.441 amostras × 8 canais × 8 bytes ≈ 92 KB de números por trace, sem overhead de objetos/transferência.

**Metas propostas, todas NÃO MEDIDAS:** build comprimido inicial ≤ 5 MB, sem fotos pesadas; resposta de simulação individual p95 ≤ 300 ms após carga; busca de 288 opções ≤ 3 s com cancelamento; heap da aplicação ≤ 150 MB no fluxo central; interação contínua sem tarefas longas relevantes na thread principal. Definir máquina, navegador, versão, condição térmica/energia, número de execuções e inclusão/exclusão do warm-up ao medir. Se não alcançar: reduzir série visual e catálogo, não esconder resultados lentos. Não reportar FPS, TPS, VRAM ou latências estimadas como observadas.

## Distribuição que resiste ao evento

1. **Juiz remoto:** URL HTTPS pública, sem login, proteção de preview ou chamadas obrigatórias a contas de desenvolvedor. Testar em janela anônima e outro dispositivo/rede. Fontes, imagens, dados e dependências devem estar no build, com fallback visual local.
2. **Primeira abertura offline na máquina instalada:** pasta de build completa e servidor local já instalado/ensaiado, sem `npm install` ou downloads no momento da demo. Abrir um perfil novo com rede desligada e cache vazio. Não pressupor que abrir `index.html` por `file://` reproduza módulos/Worker do ambiente HTTP.
3. **Cache web/PWA, se incluído:** ajuda visitas posteriores depois de instalação concluída; não faz uma URL nunca carregada abrir sem rede. Só anunciar “pronto offline” depois de validar todos os assets e pack. Versão de cache e pack precisam combinar.
4. **Contingência:** cópias do mesmo build e replay em duas máquinas; vídeo curto e capturas do fluxo; dados/versionamento visíveis. Vídeo comprova o fluxo gravado, não substitui alegar que uma funcionalidade ao vivo funciona.

Um launcher simples em ambiente local já preparado é suficiente. Criar instaladores nativos para quatro sistemas, empacotar Electron e implantar sincronização distribuída adiciona trabalho sem resolver o núcleo educativo. O contrato de offline deve informar qual pacote e qual ambiente foram verificados.

## Riscos cirúrgicos, gatilho e resposta

| Falha | Sinal de parada | Resposta e responsável |
|---|---|---|
| NASA apenas decorativa | Remover citações não altera nenhuma mecânica/parâmetro | Ciência liga origem → parâmetro → cálculo → consequência; trocar recorte se isso não for possível |
| Não há configuração viável | Catálogo inteiro falha ou missão passa sem observar | Motor revisa requisitos e compatibilidades antes de polir UI; manter caso viável e duas falhas distintas |
| Clamp cria sucesso falso | Reserva, buffer ou entrega parecem válidos após excedente negativo | Motor bloqueia a versão até ledger e eventos fecharem |
| Orbital enganoso | Mapa mostra captura sem passagem ou downlink sem contato | Ciência corrige a geometria ou rotula agenda didática; não inventar fidelidade |
| LLM decide resultado | Pontuação muda com prompt/serviço/temperatura; texto inventa fonte | Retirar LLM do caminho de execução; explicação por templates e trace |
| Autoria opaca | Código, texto, dados ou imagens gerados sem registro de uso | Manter registro de contribuição humana/IA e fontes; declaração específica na submissão conforme regras verificadas |
| Licença impeditiva | Dependência, asset ou componente privado sem direito de redistribuir | Entrega substitui por alternativa com licença compatível e registra NOTICE/licenças; não presumir AB-51DEV redistribuível |
| Overengineering | Nenhuma missão ponta a ponta até tarde do primeiro dia | AB corta 3D, rede, editor livre, API ao vivo e conteúdo extra; preserva núcleo e prova |
| Worker/rede travam demo | Busca monopoliza UI, resposta antiga sobrescreve nova, falta de asset offline | Frontend usa IDs/cancelamento; QA testa pacote frio; matar Worker e reiniciar a execução é fallback aceitável |
| Build divergente | Máquina A e URL usam packs diferentes | Entrega fixa commit, hash de pack e versão exibida; só um candidato de release |
| Teste educacional enviesado | Autor do sistema instrui cada clique ou mostra solução antes | UX registra assistência, usa nova tarefa e reporta limite; não fabricar eficácia |
| Prazo perdido | Vídeo, project tab, fontes ou links ainda incompletos no domingo | Submeter candidato funcional antes do limite; materiais de apresentação evoluem sobre ele |

Nenhuma licença específica de biblioteca foi verificada nesta frente; escolher e registrar versões/licenças reais ao montar o projeto. NASA no URL não elimina direitos de terceiros, requisitos de atribuição ou regras de marca. Hash, open source e uso de IA não substituem um histórico honesto de contribuições.

## Seis papéis humanos e cronograma executável

Papéis são responsabilidades para uma equipe de até seis; não presumem seis especialistas disponíveis. AB deve concentrar sua vantagem em produto/UX e integração, sem virar o único responsável por ciência, backend, pitch e deploy ao mesmo tempo.

| Pessoa/papel | Entrega principal | Interface com os demais |
|---|---|---|
| 1 — AB, produto/UX e direção | Recorte, fluxo de decisão, facilitação da cooperação e cortes de escopo | Decide prioridade; valida explicação com ciência e teste com UX |
| 2 — Ciência/sistemas | Fontes, pack auditável, hipóteses, caso manual, compatibilidades | Revisa motor e conteúdo; não entrega só uma lista de links |
| 3 — Motor/testes | Núcleo TS, ledger, Worker, busca, replay | Contrato de entrada/saída estável para interface |
| 4 — Frontend/visualização | Componentes, mapa/linha do tempo, comparação e acessibilidade | Consome o contrato; não reimplementa física na UI |
| 5 — Pesquisa/QA | Protocolo, participantes, testes exploratórios e matriz de compatibilidade | Preserva evidência, assistência e limitações |
| 6 — Entrega/narrativa | Build público/local, README, licenças, project tab, demo e pitch | Congela release com motor/QA; AB revisa narrativa |

| Janela local | Resultado esperado / gate |
|---|---|
| Antes de 14/11 09h | Pesquisa, recursos, equipe, ferramentas gerais; sem construir o projeto |
| 14/11 09h–11h | Confirmar desafio/regras; fixar missão, fontes centrais, unidades, contratos e entrega. Gate GO |
| 11h–14h | Motor mínimo com um caso viável e um inviável; pack pequeno revisado; UI básica; rascunho de narrativa e materiais em paralelo |
| 14h–17h | Fatia completa: configurar → executar → explicar → alterar → entregar. URL pública inicial e pacote local funcionando |
| 17h–19h | Ledgers/testes bloqueantes; segundo mecanismo de falha; replay; Pareto/reparo só após núcleo estável |
| 19h–21h | Dois pilotos exploratórios, correções de compreensão; revisão de fontes/unidades; primeira gravação de backup |
| 21h–22h30 | Candidato estável, cópias, merge e plano do domingo; cortar funcionalidades incompletas |
| Noite | Descanso e contingência individual, sem tornar virada obrigatória para cumprir o plano |
| 15/11 08h–11h | Sessões exploratórias restantes, teste de transferência, compatibilidade, testes offline; corrigir falhas críticas |
| 11h–13h | Congelar funcionalidade; consolidar resultados reais e limites; finalizar materiais e declaração de IA/licenças |
| 13h–14h30 | Release candidato, revisão em dispositivo externo, ensaio de demo e preenchimento integral da submissão |
| 14h30–15h30 | Submissão antecipada se o fluxo permitir; checagem por outra pessoa; pré-apresentação local às 15h30 |
| 15h30–16h30 | Apenas correções bloqueantes e links; guardar confirmação e conteúdo da submissão |
| 17h | Prazo operacional local de entrega informado; não usar 23h59 global como folga automática |
| 18h | Pitch com build congelado, replay conhecido e cópia offline |

O domingo exige reservar tempo de entrega, descanso, contexto e ensaio. Somar “6 pessoas × 32 horas” como 192 horas úteis omite sono, coordenação, integração e indisponibilidade. Se houver menos pessoas, combinar pesquisa/QA com produto e narrativa com frontend; cortar Pareto interativo antes de cortar correção científica ou prova da missão.

## Alternativa Fire: gate de dados em até duas horas

Só mudar para harmonização MODIS/VIIRS se o responsável por dados demonstrar, no gate inicial, que o conjunto necessário já pode ser obtido e interpretado dentro do evento. O objetivo possível é **comparar observações compatíveis e explicitar divergências entre sensores**, não inferir incêndios individuais, área queimada, risco futuro ou causalidade a partir da contagem de hotspots.

O [treinamento NASA FIRMS de 2025](https://appliedsciences.nasa.gov/sites/default/files/2025-05/Part%203%20FIRMS%202025%20Q%26A%20Session.docx.pdf) desaconselha estimar área queimada diretamente das posições de detecção por limitações de amostragem espacial/temporal. O [próprio FIRMS](https://firms.modaps.eosdis.nasa.gov/map2/) esclarece que um pixel marcado pode conter atividade pequena/intensa ou mais ampla; não significa que todo o pixel está em fogo. A FAQ atual retornou 403 nesta consulta; essa limitação de acesso não invalida as duas fontes NASA recuperadas.

**Exigir todos os itens em 2h:**

- Um recorte espacial/temporal histórico pequeno com MODIS e VIIRS, produtos/versões identificados e acesso funcionando sem depender de promessa de API futura.
- Tempo de aquisição em UTC, sensor/plataforma, qualidade/confiança, geometria de pixel ou informação equivalente e deduplicação definida. Não misturar confiança categórica e percentual como se fossem a mesma escala.
- **Cobertura e oportunidade de observação**, por máscara/granule/footprint e indicadores adequados de nuvem/dado ausente. Uma CSV contendo só pontos positivos não demonstra ausência de fogo nem ausência de aquisição.
- **Sobreposição temporal e espacial suficiente para comparações honestas**: pares de oportunidades observacionais com regras de tolerância justificadas e disponibilidade documentada. Dia civil comum é insuficiente para chamar duas passagens de simultâneas.
- Um denominador e uma unidade de análise definidos: células/intervalos conjuntamente observados com qualidade suficiente. Contar pixels correlacionados como milhares de experimentos independentes é inválido.
- Uma tabela inicial com detecções comparáveis, não detecções observadas, dados ausentes e exclusões; quantidades conhecidas antes de prometer modelagem.

Não existe um número universal de pares que assegure validade. Para o MVP, a equipe pode definir um mínimo operacional antes de examinar resultados — por exemplo, um conjunto de passagens e células suficiente para mostrar mais de uma condição —, mas deve apresentar esse número como critério de viabilidade da demonstração, não cálculo de poder estatístico. Se só houver pontos de detecção e não houver cobertura, o resultado defensável é uma visualização descritiva de amostras; **NO-GO para a alegação de harmonização validada**.

Comparar baseline transparente: contagem bruta versus contagem em suporte comum e intervalo compatível; registrar amostras excluídas e efeitos de resolução, horário, nuvem e ângulo de visada. Deteção de um sensor não é ground truth do outro. Um eventual ajuste aprendido exige separar locais/datas entre treino e teste e avaliar erro em dados retidos; n pequeno e dependência espaço-temporal limitam conclusão. Se acesso, cobertura, overlap e semântica não fecharem até 11h, manter Mission Design Game. A alternativa não deve consumir metade do evento na tentativa de salvar uma premissa de dados.

## Índice de fontes para o relatório principal

Fontes abertas por esta frente (o root deve abrir as referências antes de usar citações GenUI):

- SoA 2026: `turn65view0`, `turn67view1`; https://www.nasa.gov/smallsat-institute/sst-soa/
- Power 2026: `turn65view1`; https://www.nasa.gov/smallsat-institute/sst-soa/power-subsystems/
- MDL: `turn73view0`; https://etd.gsfc.nasa.gov/capabilities/integrated-design-center/mission-design-lab
- GMAT R2026: `turn81view2`; https://software.nasa.gov/software/GSC-19640-1
- GMAT Mathematical Specifications: `turn73view1`; https://ntrs.nasa.gov/citations/20080031744
- CubeSat 101, PDF e revisão 2017: `turn73view2`; https://science.nasa.gov/wp-content/uploads/2023/06/nasa_csli_cubesat_101_508.pdf
- Spacetrack Report No. 3, fonte original: `turn81view1`; https://celestrak.org/NORAD/documentation/spacetrk.pdf
- NASA FIRMS treinamento Q&A 2025: `turn73search8`; https://appliedsciences.nasa.gov/sites/default/files/2025-05/Part%203%20FIRMS%202025%20Q%26A%20Session.docx.pdf
- NASA FIRMS interface explicativa: `turn73search1`; https://firms.modaps.eosdis.nasa.gov/map2/

Cronograma local e regra de pré-trabalho foram tratados como premissas fornecidas pela coordenação desta pesquisa; a frente de regras contém os links oficiais e as qualificações. Equações, arquitetura, metas, gates, amostra, desenho do estudo, papéis e cronograma de execução são **propostas/inferências desta análise**, não recomendações emitidas pela NASA nem resultados observados.
