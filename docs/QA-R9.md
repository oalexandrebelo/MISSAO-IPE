# Missão Ipê — registro factual de QA R9

Data: 14/11/2026. Revisão independente A6. Projeto: `missao-ipe-orbit`, origem informada `oalexandrebelo/AB-NASA-TEAM-IPE`, base recuperada `73162276b46227e8965eed2b91a7dc8edae70b96`. Este documento descreve verificações locais; não declara publicação, homologação de voo, certificação WCAG ou aprendizagem demonstrada.

## Escopo e ambiente

Revisados o motor fechado, as seis escolhas do catálogo, os dois cenários, o pacote científico preservado, o fluxo de previsão e redesign, persistência, ponte assíncrona, testes existentes e as funções do laboratório de física. A pesquisa A1/A2/A3 foi lida como subsídio, sem tratar propostas como comportamento implementado.

- Node executado: **v24.22.1**.
- Motor da campanha: `0.1.1-rd`; catálogo: `ipe-64-v1`; esquema do resultado: `1`.
- Requisito científico preservado: **6/6 registros válidos**, com as demais restrições do motor. A proposta exploratória A1 de 4/6 não foi adotada.
- A campanha não calcula lançamento, propagação orbital ajustável ou Δv. A cena é ilustrativa. O módulo `src/lab/physics.ts` é independente e não modifica a configuração nem o ledger da campanha.
- Nenhum arquivo de implementação ou dependência foi editado por A6. Foram adicionados dois contratos de proveniência em `tests/ux-contract.test.mts` porque uma divergência real de bytes foi encontrada. As asserções anteriores foram preservadas.

## Matriz de execução

| Verificação | Situação nesta revisão | Evidência e limite |
|---|---|---|
| Varredura direta de 64 configurações × 2 cenários | **Executada; 128 resultados decididos** | Mesmo motor usado pelo produto; zero indeterminados. Não substitui o oracle independente já presente na suíte. |
| `npm test` | **Executado; 71/71 passaram** | Inclui 51 testes anteriores, 18 testes do laboratório e dois contratos novos de proveniência. A suíte cobre oracle de 1 segundo, fronteiras, ciência, replay, armazenamento e protocolo Worker simulado. |
| Hashes e valores dos dados preservados | **Executados; passaram após restauração** | Pacote e três respostas brutas coincidem byte a byte com os recibos; seis registros correspondem às bandas, QA, NDVI e dia do ano retidos. Não houve nova aquisição remota por A6. |
| Revisão numérica independente do laboratório | **Executada; 18 relações e 14 rejeições de domínio passaram** | Fórmulas escalares e testes metamórficos em Node; sem alegação de validação de navegação. |
| `npx tsc --noEmit` | **Executado; passou na rodada final** | A falha transitória de props `variant/config` durante a integração foi resolvida pela atualização de `Scene`. Comando final retornou código 0. |
| `npm run test:ui` | **Executado; 9/9 passaram** | Aplicação React e motor reais em jsdom; não houve alteração de testes, asserções ou adapters de ambiente. A rota sem WebGL foi exercitada. |
| Navegador real, layout, teclado e árvore de acessibilidade | **Não rodados por A6** | Coordenação mantém a única infraestrutura de navegador e fará essa inspeção separadamente. |
| WebGL real, perda de contexto, desempenho GPU/FPS | **Não rodados por A6** | O teste DOM força contexto indisponível; isso só verifica a rota de fallback. |
| Navegador offline após recarga a frio | **Não rodado por A6** | Cálculo local e ausência de API em runtime não provam cache, instalação ou recarga offline. |
| Estudos com participantes e aprendizagem | **Não rodados** | O guia fornece um protocolo; não apresenta resultados de pesquisa empírica. |

## Resultado numérico de todo o catálogo

| Cenário | Avaliadas | Sucesso | Falha | Inválidas | Indeterminadas | Distância mínima da configuração inicial |
|---|---:|---:|---:|---:|---:|---:|
| `long-contact` | 64 | 17 | 41 | 6 | 0 | 0 |
| `short-contact` | 64 | 9 | 49 | 6 | 0 | 2 |

Sucesso requer o estado `outcome === 'success'`, não apenas o contador 6/6. Há seis projetos inválidos no cenário longo que ainda calculam seis registros entregues. No curto, cinco dos seis inválidos entregam seis registros e um entrega três. O envelope não é compensado por ciência entregue.

| Execução de referência | Resultado | Massa | Créditos | Gerados | Transmitidos | Em fila | Menor energia | Reserva |
|---|---|---:|---:|---:|---:|---:|---:|---:|
| Inicial, longo | sucesso, 6/6 | 3,05 kg | 71 | 1.080 Mbit | 1.080 Mbit | 0 | 8,414868 Wh | 2,4 Wh |
| Inicial, curto | falha, 2/6 | 3,05 kg | 71 | 1.080 Mbit | 460,8 Mbit | 619,2 Mbit | 9,923640 Wh | 2,4 Wh |
| Testemunha mínima, curto | sucesso, 6/6 | 3,50 kg | 84 | 360 Mbit | 360 Mbit | 0 | 18,169254 Wh | 3,6 Wh |

A testemunha mínima é única a distância 2: `large / standard / index / economy / large / every-contact`, na ordem bateria / painel / processamento / rádio / memória / política. Em relação à inicial, muda bateria e processamento. Cada execução de referência tem residual de conservação de energia zero. A suíte completa verifica conservação de bits e energia em todo o domínio.

As seis alternativas de distância 1 no cenário curto falham:

| Única troca | Entregues | Evidência do motor |
|---|---:|---|
| Bateria maior | 2/6 | Mesma capacidade de serviço dos contatos; fila final de 619,2 Mbit. |
| Painel compacto | 0/6 | Pico de potência a 600 s; aproximadamente 20,42 W exigidos da bateria, limite de 20 W. |
| ÍNDICE | 0/6 | Pico de potência a 600 s; aproximadamente 29,58 W exigidos, limite de 20 W. |
| Rádio rápido | 0/6 | Pico de potência no contato a 5.400 s; aproximadamente 27,37 W exigidos, limite de 20 W. |
| Memória compacta | 2/6 | 720 Mbit perdidos por falta de espaço; nova produção é descartada inteira. |
| Último contato | 1/6 | Apenas 230,4 Mbit transmitidos; 849,6 Mbit em fila. |

“Distância mínima” é o número de escolhas diferentes dentro das 64 combinações. Não é menor custo, menor massa ou ótimo contínuo. O guia inclui um projeto curto de 75 créditos e 3,10 kg, viável a distância 4, para tornar o critério explícito.

## Proveniência: achado e correção verificável

**Achado inicial:** os três arquivos `mod13q1-{A,B,C}-raw.json` tinham 4.233 bytes, mas seus recibos declaravam 4.232. O pacote `mod13q1-research-pack.json` também não correspondia ao hash publicado pela aplicação. Os quatro terminavam com um LF extra após o conteúdo recuperado.

Uma verificação sem modificar os arquivos demonstrou que remover somente o último byte de cada um restaurava exatamente os hashes esperados. A coordenação restaurou os bytes usando também o SHA do blob upstream como condição, sem reescrever recibos nem trocar o hash científico. Os dois testes novos passaram em seguida.

| Arquivo | SHA-256 conferido após restauração |
|---|---|
| `mod13q1-A-raw.json` | `ffaa53eab7a43ce1c9e40ddcb3f21f4f37d30440dc0eab17f5e728bafeb8bd47` |
| `mod13q1-B-raw.json` | `94662069c4560be7d1ef1991dacfe399e5c031b2f41bf3ad2fdb93a5531f6c10` |
| `mod13q1-C-raw.json` | `1efe29e75b88fc4b84f557679b42b86908de0d60385077d7c9d12eab0565cfa6` |
| `mod13q1-research-pack.json` | `6f49100126a82e1783281083e2c268bcf7b4661b500280de4dc96123036b2a1e` |

Os seis registros passam a política declarada de QA e a comparação entre NDVI reconstruído e produto. Os subconjuntos retidos têm um pixel por local e data; esta verificação não introduziu uma agregação espacial. As observações de 01/09 e 23/09/2024 foram conferidas contra os campos de dia do ano do serviço.

O pacote histórico possui status `RESEARCH_ONLY_NOT_GAME_DATA_CONTRACT`; o contrato fechado da campanha está nos tipos, registros compilados, política científica e versões do motor. Preservar essa distinção. Hashes verificam identidade, não autenticidade de quem forneceu um arquivo. A amostra de três locais escolhidos não representa toda a região e não permite atribuição causal de mudanças de vegetação.

## Revisão dimensional e de domínio do laboratório

Foram conferidas as cinco funções de `src/lab/physics.ts` sem importá-las no motor da campanha. `EngineeringLab.tsx` declara hipóteses de uso. Os resultados abaixo empregam as entradas do teste independente, não necessariamente os valores iniciais da interface.

| Função e caso | Resultado conferido | Hipóteses / limite |
|---|---|---|
| `circularLeo(500)` | raio 6.871 km; velocidade 7,616560746 km/s; período 5.668,144414 s; eclipse 2.141,523158 s | Terra esférica com raio médio arredondado de 6.371 km, dois corpos, órbita circular, sombra cilíndrica e β = 0. |
| Solar, 0,05 m², eficiência 0,30, incidência 0°, 1 au | 68,05 W incidentes; 20,415 W elétricos | Eficiência aplicada uma vez. Não é o painel nominal em W do catálogo. |
| Eclipse, 10 W por 360 s, reserva 20% | 1 Wh no barramento; 1,052631579 Wh retirados; capacidade mínima 1,315789474 Wh | Bateria cheia ao entrar no eclipse; rendimento de descarga 95%; reserva sobre a capacidade nominal. Não prova recarga no ciclo. |
| Foguete, 10 kg secos + 10 kg propelente, Isp 300 s | Δv ideal 2.039,235539 m/s | Logaritmo natural, g₀ = 9,80665 m/s²; todo o propelente consumido; sem perdas ou trajetória de lançamento. |
| Rádio, 2 W RF, 2,2 GHz, 1.000 km | FSPL 159,296236838 dB; −103,285936882 dBm; 3,335640952 ms de propagação unidirecional | Ganhos fixos de 3/20 dBi, espaço livre, campo distante e antenas alinhadas. Não calcula C/N₀, Eb/N₀, disponibilidade de estação ou bitrate. |

Relações verificadas: período cresce com altitude; fração de eclipse menor que meia órbita no domínio; dobro da área dobra a potência; dobro da distância ao Sol reduz potência a um quarto; incidência 90° produz zero; 10 W × 360 s = 1 Wh; eficiência e reserva não criam energia; propelente zero produz Δv zero; maior massa seca reduz Δv para mesmo propelente; dobrar distância de rádio soma 6,0206 dB à perda, reduz potência recebida a um quarto e dobra latência; dobrar potência RF acrescenta 3,0103 dB ao recebido.

As 14 entradas inválidas incluem altitude fora de 200–2.000 km, NaN, área negativa, eficiência acima de um, incidência acima de 90°, distância solar zero, reserva igual a um, duração negativa, massa seca zero, propelente negativo e entradas não positivas do rádio. Foram rejeitadas explicitamente. A relação de potência recebida foi comparada com tolerância relativa de escala de ponto flutuante, não por igualdade bit a bit de fórmulas logarítmicas equivalentes.

Não há bloqueador dimensional identificado nessas funções. O valor LEO difere ligeiramente da tabela A2 porque aquela pesquisa adotou raio equatorial de 6.378,1366 km; a implementação declara o raio médio arredondado. Essa diferença de hipótese não é erro aritmético. Não usar os tempos do laboratório como agenda de contato de Rio Verde.

## UI, estado, armazenamento e rotina assíncrona

**Constatado por leitura de código:** a configuração de cada execução é copiada antes do cálculo. `requestId` e `AbortController` invalidam trabalho antigo; o cliente Worker valida envelope, identidade de configuração/cenário e resultado, termina o Worker ao resolver, e tem um limite de 15 segundos que gera erro técnico, sem classificar uma missão. O caminho sem Worker usa o mesmo motor.

O resultado anterior é preservado quando um replay inválido falha antes de aplicar nova entrada. Importação válida é recalculada e não conta como previsão própria. A busca exige tentativa própria no cenário. Aplicar uma alternativa cria um novo projeto e limpa a previsão, sem promovê-la automaticamente a resultado executado. Os testes DOM existentes exercitaram esses contratos na rodada R9 com a cena R3F integrada.

O IndexedDB salva snapshots, usa transação concluída como confirmação, confere integridade de leituras e controla conflito de revisão do rascunho. A suíte executada inclui escritas concorrentes, falha de quota, abort após sucesso de request, corrupção e preservação do rascunho. `fake-indexeddb` reproduz o contrato da API para testes; não demonstra durabilidade real de um navegador ou entre dispositivos. O diário em `localStorage` é relato local, não evidência inviolável.

A navegação usa botões, o catálogo usa `fieldset` e rádios, e o formulário usa rótulos explícitos. A mudança de vista tenta focar o elemento principal. Os diálogos usam `<dialog>` nativo. Isso é evidência de implementação semântica, não execução de teclado real. A animação do relatório percorre estados já calculados e não recalcula ciência.

**Recomendações comunicadas e estado ao fechar a rodada:**

1. **Atendida na implementação:** a tela de fontes recebeu links para pacote, recibo A, ORNL e guia MOD13. O link adicional `./research/index.html` ainda precisava de arquivo/rota final na árvore pública quando inspecionado; sua entrega foi sinalizada à coordenação.
2. **Atendida na implementação:** `chooseComponent` limpa uma previsão já selecionada, preserva a justificativa e anuncia que a hipótese deve ser revista. Isso impede executar silenciosamente com a mesma seleção após uma troca de peça. Esse novo ramo foi conferido por leitura; não possui caso dedicado na suíte DOM existente.
3. **Atendida no texto do produto:** o cabeçalho declara “SIMULAÇÃO LOCAL” e a tela de fontes “Local no navegador”. Recarga offline continua fora do que A6 verificou.
4. **Preservada e conferida:** o estado geral vem de `outcome`, inclusive em projetos inválidos que entregam 6/6.

A coordenação adicionou `CompareDialog` durante a revisão. A leitura confirmou rótulos dos seletores A/B, tabela de escolhas e métricas, indicação textual de opções alteradas, aviso quando os cenários diferem e ressalva sobre múltiplas mudanças. A suíte DOM existente passou com essa integração, mas não abre e opera esse novo diálogo; sua interação e apresentação devem ser conferidas no navegador.

## Verificações manuais ainda necessárias

Estas são tarefas de validação pendentes por A6, não falhas observadas:

- Completar observatório → hangar → previsão → execução → relatório → redesign usando somente teclado; conferir foco visível, ordem e retorno do foco após fechar diálogos.
- Conferir controles principais em 320 CSS px, zoom de 200% e 400%, sem ocultar ações de execução, cancelamento ou navegação.
- Testar leitor de tela, nome/estado de cada controle, mudanças de status sem anúncios excessivos e equivalência do conteúdo científico fora do canvas.
- Testar preferência de movimento reduzido, pausa, retorno de aba oculta e alternância 2D/3D sem alterar projeto ou resultado.
- Verificar WebGL indisponível e perda de contexto em navegador real; conferir performance em dispositivo alvo, carga inicial e erro de asset.
- Testar falha real de armazenamento, importação/exportação de arquivo, tentativa concorrente em abas e Worker em navegador.
- Confirmar o significado de “offline” no artefato distribuído, incluindo recarga sem rede. Não inferir esse comportamento dos testes Node.
- Avaliar compreensão com participantes usando o roteiro didático. Não confundir completar a missão com aprender o mecanismo.

## Fontes e material consultado

Evidência primária de comportamento: código e testes do repositório, respostas preservadas de ORNL DAAC e recibos em `public/data/`. As três frentes de pesquisa foram fornecidas em `research/a1-desafio.md`, `research/a2-fisica.md` e `research/a3-ux-tecnologia.md` do workspace de pesquisa. A1 registra que não conseguiu abrir integralmente a página específica do desafio 2026; esta revisão não transforma essa limitação em uma leitura verificada.

Fontes externas reabertas nesta revisão em 14/11/2026:

- [MOD13 Collection 6.1 User Guide](https://modis-land.gsfc.nasa.gov/pdf/MOD13_User_Guide_V61.pdf), versão 3.10, setembro de 2019: produto e campos científicos.
- [JPL Astrodynamic Parameters](https://ssd.jpl.nasa.gov/astro_par.html): μ terrestre de DE440 e velocidade da luz.
- [NASA Glenn — Ideal Rocket Equation](https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/ideal-rocket-equation/): relação ideal de Δv.
- [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/): referência de critérios de acesso, sem auditoria completa nem declaração de conformidade.

Outras referências rastreáveis usadas pelas frentes de pesquisa: [ORNL MODIS Web Service](https://modis.ornl.gov/data/modis_webservice.html), [NASA Systems Engineering Handbook](https://www.nasa.gov/reference/systems-engineering-handbook/), [NASA Small Spacecraft Power](https://www.nasa.gov/smallsat-institute/sst-soa/power-subsystems/) e [NASA Small Spacecraft Communications](https://www.nasa.gov/smallsat-institute/sst-soa/soa-communications/). A6 não realizou uma nova consulta remota a todas elas.

## Registro final de integração

Rodada final executada em **14/11/2026, aproximadamente 16:07 UTC**, depois da integração dos arquivos R3F e do laboratório:

| Comando | Resultado |
|---|---|
| `npm test` | 71 testes, 71 aprovados, zero falhas/cancelamentos/skips; saída 0. |
| `npm run test:ui` | 9 testes, 9 aprovados, zero falhas/cancelamentos/skips; saída 0. |
| `npx tsc --noEmit` | Sem erros de TypeScript; saída 0. |

A suíte UI exercitou previsão obrigatória, execução inicial longa 6/6, transferência curta 2/6, busca de 64/64 com distância mínima 2, preservação após replay inválido, aplicação de testemunha como projeto ainda não executado, nova previsão e resultado 6/6. Também verificou importação sem tentativa própria e resultado/exportação preservados quando `IndexedDB` e `localStorage` falham. O fallback “3D indisponível · equivalente 2D ativo” foi alcançado pelo ambiente sem contexto, sem mock de física.

Evidência escrita pelo runner: `evidence/ui-dom-test.tap` e `evidence/ui-dom-test.json`. O relatório JSON registra início às `2026-11-14T16:07:05.781Z`, fim às `2026-11-14T16:07:07.512Z`, Node v24.22.1, contexto jsdom e limites. O shim de `<dialog>` só alterna o atributo `open`; ele não exercita foco modal real. Worker real, durabilidade de navegador, layout, árvore de acessibilidade, GPU e recarga offline não foram simulados como se tivessem sido verificados.

Houve um aviso não bloqueador de depreciação `THREE_CJS_DEPRECATED` no ambiente Node por `require("three")` em dependência. Não houve falha relacionada ao aviso. Nenhuma alteração em `tests-ui/` foi necessária.

**Bloqueadores de domínio encontrados e resolvidos:** a divergência de bytes da proveniência foi restaurada e protegida por testes; a incompatibilidade transitória de props foi resolvida. **Bloqueadores de domínio/compilação pendentes ao fechar esta rodada: nenhum observado.** A inspeção de navegador é uma frente separada da coordenação; A6 não a realizou nem a substitui por uma declaração de acessibilidade. Antes de divulgar links de fontes, confirmar que a rota de pesquisa está presente no artefato final.
