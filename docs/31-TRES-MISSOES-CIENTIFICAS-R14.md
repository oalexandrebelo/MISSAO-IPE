# 31 — Três missões científicas: implementação e continuidade R14

**14/11/2026 · implementação R14 · beta 0.5.0-beta.1.** O guia descreve o código e seus limites. A verificação integrada está em `evidence/revision-r14.json`; a publicação identificada por commit e implantação está em [PUBLICADO.md](https://github.com/oalexandrebelo/PROJETO-IPE/blob/main/PUBLICADO.md).

O Ipê conecta uma necessidade científica a escolhas de engenharia e à evidência efetivamente recebida. A R14 mantém a campanha do Cerrado e acrescenta duas expedições independentes, Bennu e telescópio. Os três casos aparecem no briefing, com histórias próprias, quatro segmentos de missão e apresentação 3D/2D. O modelo numérico continua separado da aparência da cena.

## 1. Três perguntas, três tipos de evidência

| Caso e entrada no briefing | Pedido científico e conflito | Dados usados | Retorno e limite |
| --- | --- | --- | --- |
| **Cerrado** — “Projetar missão do Cerrado” | Comparar a vegetação de três pontos próximos a Rio Verde em dois períodos. Bandas ou índice a bordo, energia e contatos disputam recursos. | Seis registros históricos reais Terra/MODIS, MOD13Q1 Collection 061. Os compostos começam em 28/08/2024 e 13/09/2024. | Comparar somente pares integralmente recebidos e válidos. Dado ausente não vira zero; uma diferença de NDVI não identifica sozinha chuva, manejo ou outra causa. |
| **Bennu** — “Explorar missão Bennu” | Uma equipe fictícia pede dois registros de cada região A, B e C para um levantamento de morfologia. O instrumento precisa atender à pergunta, além de caber na missão. | Seis observações **sintéticas**, com variável de rugosidade didática em unidades arbitrárias. O modelo NASA oferece geometria de referência do alvo. | Receber seis registros feitos com a câmera. Os valores não são medições NASA, mapa operacional ou avaliação de local de pouso. |
| **Telescópio** — “Projetar telescópio científico” | Uma equipe fictícia quer comparar três faixas infravermelhas em duas exposições. Uma imagem não substitui o instrumento exigido para o espectro. | Seis valores **sintéticos** de fluxo relativo, nas faixas didáticas de 1,2, 2,0 e 3,5 µm. O Webb é referência visual. | Receber seis registros feitos com o espectrômetro. As diferenças não demonstram água, atmosfera, vida nem desempenho real do Webb. |

O CubeSat do Cerrado processa e transporta arquivos históricos; não adquire novas observações MODIS durante os 180 minutos. Nos dois novos casos, cada registro traz `goal`, `syntheticLabel`, `value` e `unit`. Não há NDVI aplicado a asteroides ou espectros.

As histórias estão em `src/ui/MissionStories.tsx`. As perguntas, referências e dados das expedições estão em `src/lab/scientific-expeditions.ts`. Os dados históricos e seus recibos permanecem em `src/data/` e `public/data/` do beta.

## 2. Da necessidade ao retorno

Bennu e telescópio possuem seis etapas explícitas em `ScientificExpedition.tsx`:

| Etapa na interface | Implementação atual |
| --- | --- |
| **Necessidade** | História do pedido, cena do alvo, origem dos dados e limites. “Definir esta missão científica” abre os requisitos. |
| **Requisitos** | Critérios de usuários, lançamento, espaço e solo. “Projetar a arquitetura” abre as escolhas. |
| **Projeto** | Seis seletores; totais de massa, orçamento, bateria e memória; salvar, restaurar, importar e exportar projeto. |
| **Verificação** | Pré-voo de instrumento, compatibilidade lançamento/perfil, massa e orçamento. Hipótese com pelo menos oito caracteres e revisão local da equipe antes de executar. Não antecipa o resultado operacional. |
| **Operação** | Resultado calculado, estados registrados, quatro segmentos, eventos e linha do tempo. Selecionar evento muda o instante inspecionado; reproduzir não recalcula a missão. |
| **Retorno científico** | Valores somente de registros recebidos integralmente e compatíveis; requisitos finais, hipótese preservada, reflexão e exportação do relatório. Nova tentativa permite comparação A/B. |

O Cerrado conserva sua navegação **Briefing → Projetar → Sala de missão**, além do laboratório de física. A necessidade e o plano aparecem no briefing; projeto, hipótese e revisão prévia ficam na bancada; operação, eventos, requisitos e retorno científico ficam na sala. Não se deve documentar as seis abas das expedições como uma mudança já feita na navegação do Cerrado.

Os quatro segmentos são selecionáveis na operação:

- **Usuários:** pergunta e registros científicos disponíveis naquele instante.
- **Lançamento:** envelope de integração; nas expedições, compatibilidade das escolhas de lançador e perfil.
- **Espacial:** instrumento, energia, memória e modos operacionais calculados.
- **Terrestre:** contato, transmissão e recepção. A estação operacional é uma representação própria; a antena DSN oficial é um ativo separado do acervo de referência.

O processo se inspira em revisões de engenharia de sistemas. A aplicação não atribui certificação nem nível CML oficial.

## 3. O que o 3D implementa

`Scene.tsx` recebe um mundo (`earth`, `bennu` ou `telescope`), segmento e estado visual. `OrbitalScene.tsx` apresenta Terra/CubeSat procedurais, volume de integração, estação terrestre própria, indicadores de recursos e enlace condicionado à transmissão. Os modelos locais de Bennu e Webb contextualizam os novos casos. O briefing também abre um acervo com CubeSat NASA, Bennu, DSN e Webb, fontes e créditos.

Na campanha do Cerrado, a montagem procedural acompanha as escolhas de componentes. Nas novas expedições, os seletores alteram o domínio e seus indicadores; não há conversão das seis escolhas em uma montagem detalhada de peças do modelo NASA. O Webb não se transforma no equipamento parametrizado pelo jogo.

A cena tem representação SVG 2D alternativa, controles HTML, preferência por movimento reduzido e tratamento de indisponibilidade de WebGL. Na reconstrução de uma execução, os recursos são dirigidos pelo resultado registrado; a posição continua ilustrativa, sem escala e sem propagação orbital. Vistas e câmera não alimentam o motor.

O pacote local e a otimização em memória do Webb estão documentados em [30 — Ativos NASA implementados](30-ATIVOS-NASA-IMPLEMENTADOS.md). Essa inspeção de arquivos e geometria não comprova fluidez, acessibilidade completa ou comportamento em GPU móvel. Não há afirmação de FPS validado neste documento.

## 4. Seis escolhas das novas expedições

Cada chave possui duas opções: **64 configurações por expedição**, 128 no conjunto. São catálogos finitos e inteiramente didáticos.

| Chave / rótulo da interface | Opções e efeitos atuais |
| --- | --- |
| `launch` / **Veículo de lançamento** | Compacto: máximo 3 kg e 80 créditos; só admite perfil `near`. Científico: máximo 4,2 kg e 115 créditos; admite ambos. Não calcula C3, empuxo ou subida. |
| `orbit` / **Perfil orbital** | Bennu: “Sobrevoo próximo” ou “Órbita de levantamento”. Telescópio: “Órbita terrestre conceitual (LEO)” ou “L2 conceitual”. Muda agendas de iluminação, observação e contato; `far` exige lançador científico. |
| `instrument` / **Instrumento científico** | Câmera: 120 Mbit por registro, carga total de 22 W por 60 s. Espectrômetro: 180 Mbit, carga total de 30 W por 60 s. Só câmera atende Bennu; só espectrômetro atende o telescópio. |
| `power` / **Energia e plataforma** | Compacta: 6 Wh, painel de 10 W, descarga máxima de 18 W. Ampliada: 24 Wh, painel de 22 W, descarga máxima de 35 W. |
| `ground` / **Comunicação com o solo** | Duas janelas de 120 s ou duas de 500 s. Taxa útil fixa de 1,2 Mbit/s e carga total de rádio de 16 W. A opção não muda a taxa. |
| `duration` / **Vida operacional do recorte** | Duas horas (7.200 s) ou três (10.800 s). A duração curta pode encerrar antes das últimas observações e do contato final. O requisito permanece seis registros. |

As horas representam **operação após chegada ao destino**, não o tempo para alcançar Bennu ou L2. “Vida operacional” é o recorte do exercício; não modela degradação de anos, radiação acumulada ou vida útil certificada.

### Premissas e agendas

A estrutura fixa pesa 1,2 kg e custa 15 créditos. A memória tem 720 Mbit. A espera consome 5 W. A bateria inicia em 80% da capacidade. A massa da estação terrestre não é somada à massa da nave. As massas e os custos de cada opção estão no catálogo e entram no pré-voo pela mesma função usada na execução.

No perfil próximo, os seis trabalhos começam em 600, 1.200, 1.800, 6.600, 7.200 e 7.800 s; no distante, em 900, 1.500, 2.100, 6.900, 7.500 e 8.100 s. Cada trabalho dura 60 s. São três regiões ou faixas, observadas em dois grupos. Um trabalho não produz um registro antes de terminar.

O perfil próximo usa luz em `[0,2700)`, `[4500,8100)` e `[9900,10800)`. No distante de Bennu, a luz ocorre em `[0,2400)`, `[7200,7800)` e `[10200,10800)`; no L2 conceitual do telescópio, em `[0,10800)`. Essas agendas são hipóteses do exercício, não efemérides calculadas.

Contatos próximos curtos começam em 5.400 e 9.000 s; os ampliados, em 5.100 e 9.000 s. No perfil distante, começam em 5.700 e 9.600 s. A duração vem da escolha de solo. Intervalos incluem o início e excluem o fim. A agenda planejada contém a terceira hora mesmo quando a vida escolhida encerra na segunda: a execução para no horizonte escolhido.

### Balanços e condição de sucesso

O novo domínio usa frações exatas para relógio e energia em **W·s**, convertidas para Wh na saída; mantém contagens inteiras de bits. A eficiência é explicitamente ideal, 100%, sem perdas de conversão. Excedente de energia com bateria cheia é registrado como descarte. Isso difere das eficiências do motor do Cerrado e não deve ser misturado com elas.

Um lote só entra completo na memória. Se não couber, perde-se o lote novo. O envio segue FIFO e pode deixar um registro parcialmente recebido. Recepção integral e instrumento compatível são condições distintas. Um registro incompatível não satisfaz o objetivo mesmo que todos os seus bits cheguem.

Demanda acima do pico de descarga encerra antes de executar o intervalo; bateria esgotada encerra na fronteira calculada. A execução conserva os bits já recebidos. Os contratos verificam geração = recepção + perdas + fila e fechamento exato de energia.

O resultado é `invalid` para incompatibilidade estática de instrumento/perfil ou violação de massa/orçamento; `failure` para condições operacionais ou entrega não atendidas; `success` apenas quando todas as condições e os seis registros válidos são atendidos. O pré-voo não prova sozinho a operação completa. Um projeto incompatível pode ser executado para inspecionar suas restrições.

## 5. Estado visual, persistência e versões

| Contrato | Comportamento atual |
| --- | --- |
| Cerrado | `getMissionVisualState(result, timeS, eventId?)` projeta o `MissionResult` existente. Não modifica catálogo, simulação, Worker, persistência ou replay desse caso. |
| Novas expedições | `getExpeditionChoices`, `getExpeditionPreflight`, `simulateExpedition` e `getExpeditionVisualState` ficam em módulo independente. Reutilizam a aritmética exata existente e os tipos de evento/trace; não passam pelo motor fechado do Cerrado. |
| Tempo | O adaptador escolhe o último ponto com horário menor ou igual ao solicitado. `sourceStateTimeS` revela a amostra; não há interpolação de recursos. Comparações usam segundos, nunca índices de amostras. |
| Eventos | Todos os eventos simultâneos são preservados na ordem original. Seleção de evento futuro não antecipa informação. Foco identifica um subsistema envolvido; não prova causa única. |
| Ciência | `deliveredRecordIds` contém apenas registros completos e válidos entregues até aquele instante. O relatório final é identificado como final; não altera a informação da cena ao retroceder. |
| Ausência de trace | `available:false`; leituras e horário de origem ficam `null`. Não substituir por totais finais nem tratar falta de informação como medição zero. |

Nas novas expedições, as tentativas, hipóteses e revisões ficam na memória da sessão do componente. As duas últimas podem ser comparadas. **Sair da expedição ou recarregar não preserva automaticamente esse histórico.** Salvar projeto grava escolhas e hipótese em `localStorage`; importar projeto verifica a estrutura e exige nova execução. Exportar relatório guarda o resultado, hipótese, reflexão e contexto da equipe em JSON. Esse relatório não é um replay verificado por hash do motor do Cerrado.

O novo domínio exporta `EXPEDITION_MODEL_VERSION=ipe-expeditions-r14-v1` e registra essa identidade em `result.modelVersion`. O formato de projeto é `ipe-scientific-design-v1`; o de relatório, `ipe-scientific-report-v1`. Esses sufixos de formato são distintos da versão do modelo. O commit da entrega também deve identificar o código usado. Importar projeto executa as escolhas no modelo atual; importação e reprodução verificada de relatórios entre versões ainda não existem.

O pacote do beta inspecionado declara `0.5.0-beta.1`. O motor anterior continua com `ENGINE_VERSION=0.1.1-rd`, `CATALOG_VERSION=ipe-64-v1` e schema de resultado 1. R14 é o identificador documental desta rodada, não uma mudança presumida nesses números.

## 6. Individual ou equipe local

`CrewReview.tsx` oferece **Individual**, **2 pessoas**, **3 pessoas** e **4 pessoas**, no mesmo dispositivo. Os quatro papéis são:

1. Ciência e usuários: registros e instrumento respondem à pergunta?
2. Nave e recursos: energia, memória e carga útil funcionam juntas?
3. Lançamento e trajetória: massa, destino e orçamento são compatíveis?
4. Solo e operações: os dados cabem nos contatos e no prazo?

Com menos de quatro participantes, a interface distribui os papéis de forma cíclica. No modo individual, uma pessoa reúne os quatro papéis. Em equipe, as quatro revisões precisam estar marcadas para executar. Alterar escolhas, hipótese ou número de participantes invalida as revisões anteriores; no Cerrado, cenário, previsão e justificativa também participam dessa identificação.

É colaboração presencial/local: não há contas, sala online, sincronização remota, validação da identidade de participantes ou comunicação entre máquinas. As expedições guardam número de participantes e papéis revisados junto da tentativa e no relatório exportado. Isso registra uma declaração de revisão, não comprova aprendizagem ou participação independente.

## 7. Roteiro de uso e configurações de referência

No briefing, abrir um dos três cartões científicos. Para Bennu ou telescópio: **Definir esta missão científica → Projetar a arquitetura → Revisar para executar**; escrever hipótese, escolher o modo de participação e concluir as revisões necessárias; usar **Executar missão científica**. Em operação, selecionar um evento e trocar entre Usuários/Lançamento/Espacial/Terrestre. Abrir **Interpretar o retorno científico**, registrar análise e **Criar uma nova tentativa**.

Estas configurações novas foram executadas nos testes delimitados desta rodada:

| Seletor | Bennu viável | Telescópio viável |
| --- | --- | --- |
| Veículo de lançamento | Lançador compacto | Lançador científico |
| Perfil orbital | Sobrevoo próximo | L2 conceitual |
| Instrumento científico | Câmera de superfície | Espectrômetro infravermelho |
| Energia e plataforma | Energia ampliada | Energia ampliada |
| Comunicação com o solo | Contatos ampliados | Contatos ampliados |
| Vida operacional do recorte | Vida operacional: 3 horas | Vida operacional: 3 horas |
| Resultado do domínio | 6/6; sucesso; 2,9 kg; 77 créditos | 6/6; sucesso; 3,2 kg; 105 créditos |

Equivalentes para testes e integração:

```ts
const bennu = {
  launch: 'compact', orbit: 'near', duration: 'full',
  instrument: 'camera', power: 'extended', ground: 'extended',
};
const telescope = {
  launch: 'science', orbit: 'far', duration: 'full',
  instrument: 'spectrometer', power: 'extended', ground: 'extended',
};
```

Os padrões iniciais foram escolhidos para permitir investigação: Bennu recebe 2/6 e falha na entrega; o telescópio encerra aos 600 s por pico de potência e recebe 0/6. Não usar a configuração viável como descoberta obrigatória do jogador: ela é referência de engenharia e QA.

Para o Cerrado, os casos de referência já existentes são base em contatos longos 6/6, base em contatos curtos 2/6 e redesign com bateria grande + processamento de índice 6/6. São referências do contrato anterior; esta redação não registra nova execução da suíte completa desse caso.

## 8. Continuidade para dois desenvolvedores

| Responsável | Arquivos e responsabilidade | Próxima verificação concreta |
| --- | --- | --- |
| Dev A — domínio e integridade | `src/lab/mission-visual-state.ts`, `scientific-expeditions.ts` e testes correspondentes. Motor/contratos antigos somente com necessidade explícita e análise de compatibilidade. | Preservar os resultados de referência, os 64 projetos por novo caso, unidades e balanços; versionar futuras mudanças do novo modelo antes de importar resultados antigos. |
| Dev B — experiência e apresentação | `src/ui/ScientificExpedition.tsx`, `CrewReview.tsx`, `MissionStories.tsx`, `MissionSegments.tsx`, `Scene.tsx`, `OrbitalScene.tsx`, `NASAReferenceScene.tsx`, estilos e jornadas UI. | Exercitar seis etapas, hipóteses, resets de equipe, edição após resultado, retorno indisponível, A/B e fallback; medir o custo dos modelos em navegador real. |
| Integração coordenada | `App.tsx`, manifests, documentação e scripts de distribuição, com um editor/integrador por vez. | Garantir que o build inclua modelos/decoder/licenças e que links, MIME/CSP e caminhos funcionem no destino; registrar recibo próprio antes de afirmar publicação. |

Próximos trabalhos: medir em dispositivos físicos, testar leitor de tela e aprendizagem, verificar primeiro acesso sem rede e definir compatibilidade de relatórios entre versões. Os três casos foram executados em navegador com WebGL; importação, revisão de equipe e comparação têm testes DOM. Isso não substitui os ensaios com participantes e equipamento alvo.

Comandos a partir da raiz do repositório público, com Node 24 ou superior e dependências dos lockfiles presentes:

```sh
npm --prefix experiments/mission-design-lab run dev
node --experimental-strip-types --test experiments/mission-design-lab/tests/mission-visual-state.test.mts experiments/mission-design-lab/tests/scientific-expeditions.test.mts
npm --prefix experiments/mission-design-lab run verify
npm run build:release
npm run test:context
npm run test:beta
```

`verify` do beta inclui domínio, UI em jsdom e build. `build:release` monta a distribuição e prepara Vercel, mas não publica. O clássico da raiz possui comandos e motor próprios; seu `build` não substitui o build do beta. Consultar [25 — Handoff de dois devs](25-HANDOFF-DOIS-DEVS.md) para o mapa geral.

## 9. Evidência delimitada e limites restantes

- **13 testes de `mission-visual-state.test.mts` passaram**: retenção do ponto anterior, fronteiras, timestamps fracionários, recepção parcial, término, eventos simultâneos, ausência de trace, foco e entrega sem antecipação. TypeScript focado passou.
- **15 testes de `scientific-expeditions.test.mts` passaram**: identidade explícita do modelo, objetivos e fixtures distintos, pré-voo, instrumentos, duração, órbitas, configurações viáveis, determinismo/imutabilidade, término por potência e por esgotamento, projeção temporal e conservação nas **128 configurações**. TypeScript focado passou.
- A verificação posterior dos quatro casos padrão/viável das expedições confirmou os números da seção 7. Esses resultados cobrem o domínio, não a jornada completa da interface.
- Verificação integrada: **129 testes de domínio e 17 de interface passaram**, com TypeScript e build aprovados. As regressões incluem comparação depois de reduzir a duração e replay sem amostras temporais.
- No navegador local, os três casos foram executados; carregamento WebGL, quatro modelos e textura DSN foram inspecionados. A revisão em largura de celular é emulação de viewport. O recibo R14 delimita as verificações e a publicação. Nenhum ensaio representa estudo de aprendizagem, leitor de tela, dispositivo físico, estação real ou trajetória espacial.

GMAT, SPICE, Horizons e APIs de missão não estão integrados ao novo cálculo. A geometria NASA não fornece massa, potência, contato ou precisão física. Não existe propagação orbital, transferência para Bennu/L2, óptica ou criogenia do Webb. A operação offline a frio e o primeiro acesso sem rede precisam de verificação própria. Uso de recursos NASA, bom resultado no jogo e aprovação de testes não estabelecem endosso, qualificação de voo ou elegibilidade competitiva.
