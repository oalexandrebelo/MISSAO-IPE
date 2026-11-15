# MISSAO IPE
## Roteiro completo do jogo de projeto de missão

| | |
|---|---|
| **Desafio** | *Space Mission Design Game* — NASA Space Apps Challenge 2026 |
| **Versão** | 1.2 · 15/11/2026 — revisão contra o enunciado completo |
| **Formato** | jogo de tabuleiro digital (web), 1–4 jogadores, 5 a 90 minutos |
| **Público** | 12+ · escola, família, hackathon, sala de aula |
| **Tagline** | *A tripulação é o instrumento mais frágil da missão.* |
| **Lema** | *O ipê floresce na seca — o projeto floresce na restrição.* |

---

## Como usar este documento

| Se você quer… | Leia |
|---|---|
| entender a ideia em 2 minutos | §1 e §4 |
| desenhar as telas e o fluxo | §6 a §10 e §19 |
| implementar as regras | §11, §12, §16 e `dados_missao_ipe.json` |
| montar o pitch | §1, §22 e a tabela de números |
| checar contra a rubrica do desafio | §25 |
| cortar escopo para 48 h | §21.4 |

Este roteiro é **executável**: cada fase tem objetivo, decisões, consequências, textos de tela e critério de saída. Os números de balanceamento estão em `dados_missao_ipe.json` e podem ser ajustados sem tocar no motor.

---

## 1. Conceito

### 1.0 O nome

**Ipê** é a árvore que floresce quando tudo o mais secou. No Cerrado e na Mata Atlântica, ela espera a estação mais dura para abrir a copa inteira em amarelo — e é justamente por isso que ninguém a esquece.

É a metáfora exata do que o jogo pede: **projetar sob escassez e ainda assim florescer**. Massa que falta, energia que não sobra, orçamento que não estica, tripulação que tem limite de carreira. O nome também é uma assinatura brasileira no desafio — e um lembrete de que a restrição não é obstáculo ao projeto: é o projeto.

### 1.1 Elevator pitch (60 palavras)

> **MISSAO IPE** é um jogo de projeto de missão espacial para até quatro pessoas. A equipe escolhe um objetivo científico, monta a espaçonave peça por peça, escolhe órbita e lançador, e então opera a missão sob eventos reais — tempestades solares, falhas, atraso de comunicação. Cada decisão cobra um preço em massa, energia, dinheiro, dados ou saúde da tripulação. No fim, o relatório explica **por que** funcionou ou falhou.

### 1.2 Promessa ao jogador

> "Em 45 minutos você vai projetar uma missão espacial de verdade, ver o seu projeto quebrar por um motivo que você não previu, e entender exatamente qual decisão causou isso."

### 1.3 Frase-tese (o diferencial)

A maioria dos jogos de missão trata a tripulação como um ícone na tela. **MISSAO IPE trata a saúde humana como um recurso de engenharia**: massa, potência, dados, orçamento, tempo **e dose acumulada**. A missão não vale nada se a tripulação não chega inteira — e o jogo mostra a conta.

Dentro do jogo, o pacote de monitoramento de saúde embarcado chama-se **ASTRAL VITAL** — o mesmo nome do dossiê que sustenta os números (`../DOSSIE_ASTRAL_VITAL_NASA_2026.md`). A missão M3 ("A Travessia") só é vencível com ele a bordo: é a demonstração, em regra, de por que o software existe.

E os números do jogo não são inventados, são os mesmos que a banca pode verificar na literatura (dose de 1,18 mSv/dia na Orion, limite de carreira de 600 mSv, SPE tipo 1972 de 222 mSv, −60,7% com AstroRad, 6,09 h de sono na ISS, CO₂ de 3 mmHg, latência Terra–Marte de 4 a 24 min).

### 1.4 Por que este jogo ganha

1. **Cobre a rubrica inteira** — cada item sugerido no desafio tem um lugar explícito no jogo (§25).
2. **A falha é o conteúdo** — o relatório pós-missão transforma o fracasso em aula; isso é o que a banca chama de "feedback significativo".
3. **Dados reais** — DONKI ao vivo, OSDR, Artemis I; não é ficção científica.
4. **Roda em qualquer lugar** — web, offline-first, 1 a 4 pessoas, 5 minutos no modo demo.
5. **Rejogabilidade** — semente determinística, 5 cenários, 3 dificuldades, modo sandbox.

### 1.5 O que o jogo **não** é

- Não é simulador de mecânica orbital de alta fidelidade (as órbitas são modelos didáticos com números plausíveis).
- Não é quiz de astronomia.
- Não é jogo de ação em tempo real (é por turnos, para caber em sala de aula e em equipe).

---

## 2. Público e níveis de conhecimento

| Persona | Quem é | O que o jogo faz por ela |
|---|---|---|
| **Curioso** (12+) | nunca pensou em órbita | modo guiado, cartões "Por quê", zero jargão na primeira tela |
| **Aspirante** (16–25) | quer engenharia/ciência | trade-offs reais, orçamento apertado, replay |
| **Especialista** | engenheiro, professor, entusiasta | modo Diretor de Voo, margens apertadas, eventos ocultos, comparação numérica |

**Regra de acessibilidade cognitiva:** nenhum conceito é pré-requisito. Todo termo tem uma explicação de **uma frase + um número** ao lado (ver §17). O jogador aprende *jogando*, não lendo um manual.

---

## 3. Pilares de design

1. **Objetivo antes da peça.** A primeira decisão do jogo é *o que descobrir*, não *o que construir*.
2. **Toda decisão cobra um preço.** Nenhum componente é gratuito: ganho de ciência custa massa, energia, dinheiro e dados.
3. **Não existe solução única.** Pelo menos três arquiteturas distintas completam cada cenário com notas próximas (§7.6).
4. **A falha explica.** Todo fracasso gera uma cadeia causal de três elos, em linguagem simples.
5. **A tripulação é um recurso.** Dose, sono e carga de trabalho entram na conta como massa e watts.
6. **O requisito manda.** O objetivo vira número antes de virar peça — e a peça tem de provar que atende.
7. **Determinismo com semente.** Mesma semente + mesmas escolhas = mesmo resultado (justo para competir e para ensinar).

---

## 4. O loop de jogo

```
[1] BRIEFING
      │  cenário · prazo · orçamento · janela
      ▼
[2] OBJETIVO ─► [3] REQUISITOS ─► [4] PROJETO ─► [5] LANÇAMENTO
   o que          metas            barramento,      veículo,
   descobrir      mensuráveis      energia, solo,   órbita,
   e por quê      e verificáveis   instrumentos     massa, janela
                                        │
                                        ▼
                                  [6] OPERAÇÕES · 6–10 turnos
                                   evento → decisão → consumo → saúde
                                        │
                                        ▼
                                  [7] ANÁLISE · relatório causal
                                        │
                                        ▼
                                  [8] REJOGAR · mesma semente, novo projeto
```

**Micro-loop (30 s):** ver recurso crítico → escolher uma ação → ver a consequência imediata → entender por quê.

**Macro-loop (45 min):** objetivo → arquitetura → lançamento → operação → diagnóstico → tentativa melhor.

---

## 5. Estrutura da sessão (roteiro minuto a minuto)

### 5.1 Sessão padrão em equipe — 50 min

| Tempo | Fase | O que acontece | Papel em destaque |
|---|---|---|---|
| 0–3 | Abertura | cenário, prazo, orçamento; regra de ouro na tela | todos |
| 3–8 | Objetivo | 4 cartões de objetivo; cada jogador defende um; votação; objetivo travado | Diretor de Missão |
| 8–13 | **Requisitos** | 3 metas obrigatórias + 2 opcionais; níveis mínimo/esperado/ambicioso; matriz de conformidade nasce aqui | Cientista + Engenheiro |
| 13–24 | Projeto | bancada de 7 abas; cada compra mostra 5 consequências; semáforo; **trade study** de 2 arquiteturas | Engenheiro + Cientista |
| 24–27 | Lançamento | órbita e veículo; verificação de massa; commit; sequência de 5 s | Engenheiro |
| 27–42 | Operações | 6 turnos de ~2,5 min: evento → decisão → consumo | Operações |
| 42–47 | Análise | relatório causal, conformidade, missão análoga, nota | todos |
| 47–50 | Placar | comparação, ranking, compartilhar código da missão | Diretor |

### 5.2 Variantes

| Modo | Duração | Mudança |
|---|---|---|
| **Demo de banca** | 5 min | cenário pré-montado, 3 turnos, 1 evento, relatório completo (§22) |
| **Solo** | 30–40 min | um jogador veste os 4 chapéus; o jogo faz as perguntas de cada papel |
| **Aula** | 90 min | 50 min de jogo + 20 min de debrief guiado + 20 min de segunda tentativa |
| **Competitivo** | 60 min | 2–4 equipes, mesma semente, mesmo cenário; vence quem fizer mais pontos |
| **Sandbox** | livre | orçamento infinito, sem falha catastrófica; serve para experimentar |

---

## 6. Fase 1 — Briefing

### 6.1 Objetivo da fase

Dar contexto e restrição **antes** de qualquer peça. O jogador precisa sentir o aperto: prazo, dinheiro, janela.

### 6.2 Texto de tela (copy pronta)

> **Título:** *Você tem 18 meses, 150 milhões e uma janela que não volta.*
>
> **Corpo:** "Uma missão espacial começa muito antes do lançamento — começa com uma pergunta. Nesta missão, a pergunta é sua. Você vai escolher o que descobrir, decidir como chegar lá e operar a espaçonave quando ninguém puder apertar o botão por você.
>
> Tudo o que você comprar vai pesar, custar e consumir. Nada é de graça. E o relógio não para."

### 6.3 Ficha do cenário (sempre visível, topo da tela)

| Campo | Exemplo (M1 · Raízes) |
|---|---|
| Objetivo do cenário | monitorar desmatamento e metano na Amazônia |
| Prazo de desenvolvimento | 18 meses |
| Orçamento | 150 M$ |
| Duração da missão | 12 meses |
| Tripulação | 0 |
| Dificuldade | Engenheiro |
| Maturidade (CML) | CML 3 — point design (a missão começa em CML 1) |
| Semente | `AMZ-2026-014` |

---

## 7. Fase 2 — Objetivo e requisitos

### 7.1 Regra

O jogador escolhe **um objetivo primário** entre quatro cartões. O objetivo define: critério de sucesso, meta científica, instrumentos que contam ponto e risco dominante. **O objetivo não pode ser trocado depois** — é a decisão mais importante do jogo.

### 7.2 Cartões de objetivo (M1 · Raízes — "Olhos sobre a Amazônia")

| Cartão | Critério de sucesso | Meta científica | Risco dominante |
|---|---|---|---|
| **A. Desmatamento** | cobertura ≥ 80% da área, 12 meses | 220 | órbita e dados |
| **B. Metano** | detectar ≥ 3 hotspots | 200 | instrumento e resolução |
| **C. Fogo e aerossóis** | 2 estações + série temporal | 240 | energia e dados |
| **D. Combinado** | 2 dos 3 acima | 280 | orçamento e massa |

### 7.3 Mecânica de votação (equipe)

Cada jogador recebe **um voto**. Em caso de empate, o Diretor de Missão decide e **deve justificar em uma frase**; a justificativa vale 15 pontos de "qualidade de decisão" (§12.4). Isso treina decisão sob incerteza — e é conteúdo avaliável.

### 7.4 Modo solo

O jogo apresenta os quatro cartões e uma pergunta: *"Qual dessas descobertas mudaria mais a sua missão?"* — a escolha é livre, mas o jogo registra o tempo de decisão e usa no debrief ("você levou 2 min; especialistas levam 40 s — não há resposta certa, mas hesitação custa tempo de projeto").

### 7.5 Saída da fase

`objetivo_primario ∈ {A, B, C, D}` travado, exibido no HUD pelo resto da partida.

### 7.6 Prova de que não existe solução única (use no pitch e no debrief)

Três arquiteturas válidas para a missão M1 (a A entrega só dois terços da meta, mas lança e opera):

| | **A. Frugal** | **B. Equilibrada** | **C. Científica** |
|---|---|---|---|
| Barramento | SmallSat 180 kg | SmallSat 180 kg | SmallSat 180 kg |
| Lançador | Electron (300 kg) | Vega-C (1.500 kg em SSO) | Vega-C (1.500 kg em SSO) |
| Órbita | LEO 400 km | SSO 600 km | SSO 600 km |
| Instrumentos | câmera multi, magnetômetro, dosímetro | câmera HR, espectrômetro de imagem, magnetômetro, dosímetro | telescópio UV, câmera multi, magnetômetro, dosímetro |
| Massa total | 278 kg | 353 kg | 422 kg |
| Custo | 54 M$ (36%) | 112 M$ (75%) | 143 M$ (95%) |
| Ciência | 145 (66% da meta) | 245 (meta batida) | 240 (meta batida) |
| Dados | 4,2 / 7,2 GB/dia | 30,2 / 135 GB/dia | 24,2 / 135 GB/dia |
| **Nota** | **623** | **944** | **898** |
| **Lição** | barato, entrega dois terços | equilíbrio vence | 240 pts de ciência por 31 M$ a mais |

As três são válidas, e a nota **não** é sobre a peça mais cara: a arquitetura C compra o telescópio UV (95 pontos de ciência) e ainda assim perde para a B, porque gastou 95% do orçamento e 422 kg para entregar **cinco pontos a menos** de ciência. A B não é "a certa": é a que maximiza pontos **neste sistema de pontuação**. Quem valoriza ciência escolhe C; quem valoriza custo escolhe A. O jogo nunca diz "você errou" — diz "você escolheu isto, e custou aquilo".

### 7.7 Requisitos — do desejo ao número

O objetivo diz **o que descobrir**; o requisito diz **o quanto**. É a etapa que a engenharia de sistemas da NASA chama de definição de requisitos — e o degrau que separa "quero estudar a floresta" de "preciso de 10 m de resolução a cada 2 dias".

O cenário define **três requisitos obrigatórios** e dois opcionais. Para cada um, o jogador escolhe um nível:

| Nível | O que custa | O que entrega |
|---|---|---|
| **Mínimo** | menos massa, menos dinheiro | cumpre o critério de sucesso, sem folga |
| **Esperado** | custo médio | cumpre com margem |
| **Ambicioso** | +massa, +energia, +custo | +ciência e +robustez a eventos |

Exemplo (M1 · Raízes):

| Requisito | Mínimo | Esperado | Ambicioso | O que muda no projeto |
|---|---|---|---|---|
| Cobertura | 60% | 80% | 95% | órbita e largura de faixa |
| Resolução | 30 m | 10 m | 5 m | abertura óptica → massa e custo |
| Cadência | 5 dias | 2 dias | diária | agilidade de apontamento e dados |
| Latência (opcional) | 72 h | 24 h | 6 h | segmento terrestre (§8.7) |
| Vida útil (opcional) | 12 m | 24 m | 36 m | propelente e blindagem |

**Regra dura:** requisitos são travados como o objetivo. Mudá-los depois é **revisão de requisitos**: custa 1 mês e +5% de orçamento — exatamente como na vida real.

### 7.8 Conformidade: a matriz que a banca quer ver

Depois do projeto, o jogo monta a **matriz de conformidade**:

| Requisito | Decisão que atende | Verificação | Status |
|---|---|---|---|
| Resolução ≤ 10 m | câmera HR (12 kg) | GSD calculado pela abertura | ✅ |
| Cadência ≤ 2 dias | órbita SSO + 2 painéis | revisita orbital | ✅ |
| Latência ≤ 24 h | estação comercial | janela + fila de downlink | ⚠️ parcial |
| Cobertura ≥ 80% | faixa de 120 km | passagens/dia | ❌ |

**Efeito na nota:** o sucesso pleno (350 pts) exige **objetivo cumprido + requisitos obrigatórios atendidos**. Se o objetivo é cumprido mas um requisito obrigatório falha, o teto é 175 — e o relatório mostra qual requisito quebrou e por quê.

### 7.9 CML: onde o jogo se encaixa no processo da NASA

O JPL mede a maturidade de um conceito em **CMLs** (Concept Maturity Levels). As decisões que mais importam acontecem nos CML 1–4 — que é exatamente a janela do jogo:

| CML | Pergunta | Fase do MISSAO IPE | Saída |
|---|---|---|---|
| **CML 1** — ideia | o que vale a pena descobrir? | objetivo | objetivo + justificativa |
| **CML 2** — viabilidade | é possível? quanto custa? quais as trocas? | requisitos + *trade study* | 2 arquiteturas comparadas |
| **CML 3** — point design | qual é a arquitetura? | projeto + lançamento | massa, potência, dados, custo |
| **CML 4** — implementação | como operar e o que se aprende? | operações + análise | ConOps, relatório |

No CML 2 o jogo **exige** um *trade study*: comparar duas arquiteturas lado a lado antes de escolher (modo "comparar"). A justificativa entra no relatório e vale checkpoint.

---

## 8. Fase 3 — Projeto da espaçonave

### 8.1 Bancada de projeto

Sete abas, nesta ordem (a ordem importa: barramento define o envelope):

1. **Barramento** (estrutura, volume, blindagem, tripulação e **aviônica** — §8.10)
2. **Energia** (geração + baterias)
3. **Comunicações** (banda, antena, taxa)
4. **Solo** (segmento terrestre: estações e centro de controle — §8.7)
5. **Carga útil** (instrumentos científicos)
6. **Proteção & saúde** (colete, abrigo, kit de saúde)
7. **Usuários** (prontidão e produtos de dados — §8.8)

### 8.2 Cartão de componente — anatomia

Todo componente exibe, **antes** da compra, as cinco consequências:

```
┌─────────────────────────────────────────────┐
│ ESPECTRÔMETRO DE IMAGEM              [ciência]│
│ 25 kg   ·   45 W   ·   9 M$   ·   12 GB/dia  │
│ Valor científico: 90 pts                     │
│ ───────────────────────────────────────────  │
│ MASSA      +25 kg        ▲ +8% do lançador   │
│ POTÊNCIA   +45 W         ▲ +11% da carga     │
│ CUSTO      +9 M$         ▲ +7,5% do orçamento│
│ DADOS      +12 GB/dia    ▲ exige 192 Mbps·h  │
│ CIÊNCIA    +90 pts       ▲ 41% da meta       │
│ ───────────────────────────────────────────  │
│ Por quê: cada pixel carrega um espectro —     │
│ 200 bandas × 1.000 pixels = 200 mil medidas   │
│ por quadro. É o instrumento que "vê a         │
│ assinatura química" da cena.                  │
└─────────────────────────────────────────────┘
```

### 8.3 Consequência de cada decisão (tabela-mestra)

| Decisão | Ganha | Paga |
|---|---|---|
| Mais instrumentos | valor científico | massa, potência, custo, **dados** |
| Barramento maior | massa, potência, volume, tripulação | custo, precisa de lançador maior |
| Painéis solares maiores | potência | massa, custo, arrasto (órbita baixa) |
| Baterias | sobreviver ao eclipse | massa, custo |
| Banda mais larga | escoar dados | potência, custo, apontamento |
| Blindagem | menos dose | massa (e massa é o recurso mais caro) |
| Colete AstroRad | −60,7% em SPE | massa por tripulante, custo, conforto |
| Kit de saúde | detecta cedo, reduz dano | massa, potência, dados |
| Lançador maior | capacidade | custo (às vezes 10×) |
| Órbita mais alta | vida útil, cobertura | dose, comunicação, custo de lançamento |

### 8.4 Validação em tempo real (semáforo)

O jogo **não bloqueia** decisões inválidas — ele mostra em vermelho e deixa o jogador seguir, porque o erro é pedagógico. O semáforo tem quatro luzes:

| Luz | Verificação | Quando fica vermelha |
|---|---|---|
| 🟥 Massa | massa total × 1,10 ≤ capacidade do lançador na órbita | estouro de massa |
| 🟨 Potência | geração ≥ carga + recarga no eclipse | déficit de energia |
| 🟦 Dados | downlink/dia ≥ geração/dia × 0,8 | backlog crescente |
| 🟪 Radiação | dose projetada ≤ 600 mSv | carreira esgotada |

Além do semáforo, existem **incompatibilidades duras** (§8.9): combinações que o jogo bloqueia com o motivo escrito na tela.

### 8.5 Trade study e tensão de projeto (usar na demo)

Projeto "Frugal" aparentemente perfeito:

- SmallSat 180 kg + painel 25 kg + 2 baterias 60 kg + S-band 8 kg + câmera 5 kg + espectrômetro 25 kg + magnetômetro 3 kg + dosímetro 2 kg = **308 kg**
- Com margem de 10%: **339 kg** vs. Electron **300 kg** → 🟥 **39 kg acima**
- Duas saídas: trocar para Vega-C (+29,5 M$) **ou** cortar uma bateria (−30 kg, mas o eclipse de 35 min pode apagar os instrumentos)

O jogador descobre, na prática, que **massa é o recurso que decide tudo** — e que a margem de 10% não é burocracia.

**Modo comparar (o *trade study* do CML 2).** Antes de fechar o projeto, o jogo coloca duas arquiteturas lado a lado, com massa, custo, ciência, dados e conformidade de requisitos em colunas. Escolher uma exige **uma frase de justificativa** — que vai para o relatório e vale checkpoint. É a diferença entre "escolhi porque gostei" e "escolhi porque a B entrega 90 pontos de ciência a mais por 40 M$ a menos".

### 8.6 Regras de composição

- Máximo de instrumentos = slots do barramento (CubeSat 2, SmallSat 4, MicroSat 6, Midsize 8, Large 10).
- Instrumentos de saúde só pontuam com tripulação ≥ 1.
- Colete é por tripulante; abrigo é único.
- Kit de saúde exige barramento com tripulação.
- Cada instrumento tem **duty cycle** ajustável (0–100%) na fase de operações; o padrão é 100%, e reduzir economiza energia e dados ao custo de ciência.

### 8.7 Segmento terrestre — o que quase todo jogo esquece

A missão não termina na espaçonave. Das quatro partes que a NASA descreve no projeto de missões científicas — **lançamento, espacial, terrestre e usuários** — o MISSAO IPE modela todas; esta é a que costuma ficar de fora.

O segmento terrestre define **quanto dado desce** e **com que atraso o comando chega**:

| Opção | Custo | Downlink | Latência de comando | Observação |
|---|---|---|---|---|
| Estação própria | 8 M$ | 4 h/dia | 6 h | barata e limitada; serve para LEO |
| Rede comercial | 15 M$ | 8 h/dia | 2 h | cobertura global, contrato por janela |
| DSN 34 m | 40 M$ | 4 h/dia | 1 h | **obrigatória** em espaço profundo |
| DSN 70 m | 90 M$ | 6 h/dia | 0,5 h | emergências e alta taxa |
| Centro de controle (MOC) | 12 M$ | — | — | **obrigatório**; sem ele, dano de anomalia +50% |

```
downlink_efetivo = min(comms da nave, estação) × janela
latência_comando = latência da estação + distância
```

**Lição:** a antena mais cara do mundo não resolve se a estação não tem janela. E o centro de controle é o que transforma dado em decisão.

### 8.8 Segmento de usuários — o dado só vale quando alguém usa

O quarto segmento é quem analisa e aplica o dado. No jogo, isso é uma decisão de **prontidão de dados**:

| Nível | Produto | Custo/mês | Multiplicador de ciência |
|---|---|---|---|
| **L0** | bruto, sem calibração | 0 | ×0,85 |
| **L1** | calibrado e geoespacializado | 1,0 M$ | ×0,95 |
| **L2** | arquivo aberto, com metadados | 2,0 M$ | ×1,00 |
| **L3** | produtos derivados para usuários | 3,5 M$ | ×1,10 |

```
ciência_final = ciência_bruta × integridade × multiplicador_usuários
```

Sem L2, a missão pode até "funcionar" e ainda assim não valer nada para a ciência. É a diferença entre ter dados e ter conhecimento.

### 8.9 Incompatibilidades duras (bloqueiam, com o motivo na tela)

O semáforo avisa; estas o jogo **não deixa passar** — porque na física não passaria:

| Combinação | Efeito | Por quê |
|---|---|---|
| Espaço profundo + banda S | **bloqueia o lançamento** | o link não fecha; o dado não desce |
| Perfuratriz fora da superfície | inútil (0 ciência) | não há solo para perfurar |
| Telescópio UV sem aviônica de alta precisão | bloqueia | sem apontamento fino, a imagem borra |
| Colete/abrigo sem tripulação | sem efeito, custo mantido | não há quem proteger |
| Reator em barramento < Midsize | bloqueia | não cabe nem dissipa calor |
| Painel solar em Marte | geração × 0,43 | lei do inverso do quadrado |

Padrão de interface (como no jogo de telescópios da NASA): a opção fica **cinza, com o motivo legível** — nunca escondida, sempre explicada.

### 8.10 Aviônica — o computador e o controle de atitude

O enunciado lista "computadores de bordo e controle de atitude" como componentes da espaçonave. No MISSAO IPE eles são uma escolha de três níveis, dentro da aba Barramento:

| Aviônica | Massa | Potência | Custo | Buffer de dados | Apontamento | Efeito em falha |
|---|---|---|---|---|---|---|
| **Básica** | 5 kg | 10 W | 1 M$ | 1 dia | ±0,5° | falha de computador custa 1 turno |
| **Redundante** | 12 kg | 20 W | 4 M$ | 2 dias | ±0,1° | falha de computador custa 0 turno |
| **Alta precisão** | 25 kg | 35 W | 9 M$ | 3 dias | ±0,01° | **exigida** por telescópio UV e óptica fina |

**Por quê:** apontamento é pré-requisito de tudo — sem ele, o instrumento mais caro entrega imagem borrada. E buffer é memória: define quanto dado você pode segurar até a próxima janela (§12.3).

---

## 9. Fase 4 — Órbita e lançamento

### 9.1 Escolha da órbita

Cada órbita mostra quatro números grandes e uma frase:

| Órbita | Dose (mSv/dia) | Eclipse | Downlink | Latência | Frase de tela |
|---|---|---|---|---|---|
| LEO 400 km, 51,6° | 0,4 | 36% | 8 h/dia | 0,01 min | "Perto da Terra, longe do Sol a maior parte do tempo." |
| SSO 600 km | 0,6 | 35% | 6 h/dia | 0,01 min | "Passa sempre na mesma hora local — a órbita dos satélites de observação." |
| GTO | 1,0 | 5% | 4 h/dia | 0,02 min | "Atravessa o cinturão de prótons duas vezes por dia." |
| NRHO lunar | 1,18 | 3% | 4 h/dia | 0,02 min | "A órbita da Artemis: sempre vendo a Terra, sempre longe." |
| Espaço profundo | 1,18 | 0% | 2,5 h/dia | 12 min | "Aqui a luz leva minutos para chegar — e o socorro, muito mais." |
| L1 | 0,9 | 0% | 21 h/dia | 0,02 min | "O ponto onde o Sol e a Terra se equilibram: sentinela do clima espacial." |
| Órbita de Marte | 0,9 | 4% | 3 h/dia | 12 min | "Um atraso de 4 a 24 minutos em cada pergunta." |

**Efeito pedagógico:** a mesma espaçonave tem desempenhos diferentes por órbita; a órbita define cobertura, dose, comunicação e vida útil.

### 9.2 Escolha do lançador

| Veículo | LEO | SSO | GTO | NRHO | Custo | Frase |
|---|---|---|---|---|---|---|
| Electron | 300 kg | 200 kg | — | — | 7,5 M$ | "Pequeno, barato, sem perdão de massa." |
| Vega-C | 2.300 kg | 1.500 kg | 700 kg | — | 37 M$ | "O cavalo de batalha europeu para órbita baixa." |
| Falcon 9 | 22,8 t | 15 t | 8,3 t | 3,5 t | 67 M$ | "A régua do mercado: capacidade enorme por um preço conhecido." |
| Ariane 6 | 21,6 t | 14 t | 11,5 t | 4 t | 90 M$ | "Capacidade parecida, preço maior — escolha política." |
| Falcon Heavy | 63,8 t | 40 t | 26,7 t | 16,8 t | 150 M$ | "Quando a missão não cabe em mais nada." |
| SLS Block 1 | 95 t | 60 t | 40 t | 27 t | 900 M$ | "Leva a tripulação à Lua — e leva o orçamento junto." |

### 9.3 Verificação de compatibilidade (o "não" mais educativo do jogo)

```
massa_total = (barramento + instrumentos + energia + baterias + comms + proteção) × 1,10
compatível  = massa_total ≤ capacidade_lançador[órbita]
```

Se falhar, a tela não diz "erro". Diz:

> **"Sua espaçonave pesa 339 kg. O Electron leva 300 kg para esta órbita.**
> Você tem três caminhos: um lançador maior (+29,5 M$), 39 kg menos de carga, ou uma órbita que exija menos energia.
> **Nenhum deles é grátis.** Qual você escolhe?"

Isso é o coração do design: **o jogo ensina a negociar com a física**.

### 9.4 Janela de lançamento e tempo de integração

```
meses_desenvolvimento = 6 + 0,8 × n_instrumentos + 1,5 × n_sistemas_avancados
```

Se `meses_desenvolvimento > prazo_do_cenário`:
- 1 mês de atraso = **+8% de custo** (integração, equipe, retrabalho);
- 3 meses de atraso = **perde a janela** → missão lança na janela seguinte com **−20% de vida útil** (o veículo e a equipe já estavam pagos).

### 9.5 Commit

Botão final: **"Fechar o projeto e lançar"**. Antes, um resumo de uma tela: massa, potência, dados, dose, custo, margem. É o último momento de arrependimento — e o jogo avisa: *"Depois daqui, você só pode reagir."*

### 9.6 Sequência de lançamento (5 segundos que ensinam)

O commit dispara uma cena de 5 s, pulável:

```
T−10 … T−0     contagem, torre, ignição
T+0 … T+60     subida, Max Q, separação de estágio
T+8 min        separação da coifa
T+30 min       inserção orbital — os números do projeto viram realidade
```

Durante a cena, massa, potência e dados são carimbados no HUD. Se a verificação de massa falhar, a cena vira **abort**: *"o veículo não tem empuxo suficiente para esta massa"* — o erro fica visível, não escondido atrás de um alerta.

Referência de tom: a sequência de lançamento do jogo educativo de telescópios da NASA, que fecha o projeto com animação e depois entrega os resultados.

---

## 10. Fase 5 — Operações

### 10.1 Estrutura do turno

Cada turno representa **1 mês** (cenários curtos) ou **1 semana** (cenários de crise). Sequência fixa:

1. **Relógio** — avança o tempo; consumo de recursos é debitado.
2. **Evento** — carta do baralho (ou "nada acontece", que é raro de propósito).
3. **Leitura do painel** — o jogador vê dose, dados em atraso, energia, moral/sono.
4. **Decisão** — 2 a 4 opções, cada uma com custo e consequência parcialmente oculta.
5. **Resolução** — números atualizam, aparece uma linha de explicação.
6. **Registro** — a decisão entra no log da missão (vira o relatório final).

### 10.2 Os sete recursos do HUD

| Recurso | Unidade | Mostra | Fica vermelho quando |
|---|---|---|---|
| **Massa** | kg | usado / capacidade | > 95% da capacidade |
| **Potência** | W | geração / carga | carga > geração |
| **Orçamento** | M$ | gasto / total | > 90% |
| **Dados** | GB/dia | gerado / transmitido | backlog > 2 dias |
| **Comunicações** | Mbps | taxa × janela | janela perdida em evento crítico |
| **Tempo** | meses | decorrido / prazo | atraso > 1 mês |
| **Tripulação** | mSv, h de sono | dose / 600 · sono / 7 h | dose > 80% · sono < 6 h por 3 turnos |

### 10.3 Exemplo de turno narrado (M3 · Travessia, turno 7)

> **MÊS 7 · ESPAÇO PROFUNDO · 400 milhões de km de casa**
>
> A dose acumulada está em 214 mSv — **35,7% da carreira**. O dosímetro estabilizou depois do evento de julho. A tripulação dormiu 6,4 h por noite no último mês. O atraso de comunicação é de 11 minutos.
>
> **Evento:** *"O Sol acorda."* Um evento de partículas solares classe X atinge a nave. Sem proteção, a dose adicional é de **222 mSv** — 37% da carreira em uma tarde.
>
> | Ação | Efeito | Custo |
> |---|---|---|
> | Vestir AstroRad | −60,7% → 87 mSv | 0; 4 h de ciência perdidas |
> | Entrar no abrigo | −80% → 44 mSv | 6 h de ciência perdidas; 1 instrumento desligado |
> | Continuar operando | 222 mSv | +37% da carreira, risco de REID |
>
> **Por quê:** o GCR é contínuo e penetrante; o SPE é agudo e blindável. O colete foi medido em phantom na Artemis I: 222,3 → 87,5 mSv. O abrigo protege mais, mas você paga em ciência.

### 10.4 Decisões recorrentes (menu de operações)

| Decisão | Quando aparece | Trade-off |
|---|---|---|
| Ajustar duty cycle dos instrumentos | todo turno | ciência × energia × dados |
| Priorizar downlink | backlog > 1 dia | dados × janela de comunicação |
| Reduzir ritmo da tripulação | sono < 6 h | saúde × produtividade |
| Fazer EVA | evento científico | ciência × dose × risco |
| Reiniciar computador de bordo | anomalia | corrige × perde dados |
| Pedir apoio à Terra | evento crítico | resolve × latência × custo |
| Cancelar experimento | orçamento/dados no limite | economiza × perde ciência |

### 10.5 Regra da latência (o detalhe que ninguém lembra)

Em cenários além da Lua, **pedir ajuda custa tempo real**:

- Terra–Lua: 1,3 s → a Terra responde no mesmo turno.
- Terra–Marte: 4 a 24 min → a resposta chega **no turno seguinte**; se o evento for crítico, o dano já aconteceu.
- Consequência: em Marte, o jogador precisa ter **plano autônomo** — e o jogo dá pontos por isso (§13.3, checkpoint 9).

### 10.6 Falhas e como o jogo as trata

| Falha | Efeito | Ensina |
|---|---|---|
| Estouro de massa | lançamento impossível | margem de 10% |
| Déficit de potência | instrumentos desligam no eclipse | eclipse e bateria |
| Backlog de dados | ciência perdida (dados expiram) | downlink vs. geração |
| Dose > 600 mSv | missão inviável, tripulação evacuada | blindagem e SPE |
| Janela de comms perdida | comando atrasado, oportunidade perdida | planejamento de janela |
| Atraso de cronograma | custo +20%, vida útil −20% | tempo é recurso |

**Nenhuma falha encerra o jogo antes do fim** (exceto dose > 600 mSv em missão tripulada, que vira "missão abortada" e ainda gera relatório). O jogador sempre chega ao diagnóstico.

### 10.7 ConOps — como a missão vive o dia a dia

O jogo pede um **Conceito de Operações** em três fases (o "ConOps" do CubeSat 101):

| Fase | Duração | Ciência | Risco |
|---|---|---|---|
| Comissionamento | 1 turno | 30% | alto (tudo é primeira vez) |
| Nominal | até a vida útil | 100% | normal |
| Estendida | após a vida útil | 50% | +1 falha por turno |

Perfil de operação (escolha única, feita no projeto): **conservador** (menos dados, menos desgaste), **nominal**, **agressivo** (mais dados, vida útil −25%).

---

## 11. Fase 6 — Análise pós-missão

### 11.1 Estrutura do relatório

1. **O que você decidiu** — linha do tempo das 8–12 decisões-chave.
2. **O que aconteceu** — resultado por objetivo e por recurso.
3. **Por quê** — cadeia causal de três elos, em linguagem simples.
4. **O que teria mudado** — duas alavancas concretas, com o número do impacto.
5. **Conformidade** — matriz requisito → decisão → verificação, com o que falhou (§7.8).
6. **Missão análoga real** — "sua arquitetura se parece X% com a missão Y da NASA", com link e o que a missão real fez diferente.
7. **Nota** — 0 a 1.000, com decomposição.
8. **Comparação** — "sua nota está no percentil X deste cenário" (dados locais + ranking opcional).
9. **Código da missão** — string compartilhável que reproduz exatamente o projeto.

### 11.2 Exemplo de cadeia causal (texto real do relatório)

> **Sua missão perdeu 38% da ciência.**
>
> Você escolheu o espectrômetro de imagem (12 GB/dia) e a banda S (2 Mbps). A janela de downlink em SSO é de 6 h/dia, o que dá **5,4 GB/dia**. Faltaram 6,6 GB/dia — e o buffer de bordo só guarda 2 dias.
>
> **O que teria mudado:** (1) banda X (+9 M$ sobre a S, +45 Mbps) teria escoado tudo; (2) reduzir o duty cycle do espectrômetro para 45% teria custado 49 pontos de ciência, mas salvado 120.
>
> **Lição:** dados gerados sem plano de descida são dados perdidos. A antena é tão científica quanto o instrumento.

### 11.3 Debrief guiado (modo aula)

Perguntas impressas na tela, uma por vez, com 1 min de discussão:

1. Qual decisão você repetiria igual? Por quê?
2. Qual recurso quase estourou? O que o salvou?
3. Se o evento solar tivesse vindo no turno 2, o resultado mudaria?
4. O que você faria com 20% mais orçamento? E com 20% menos?

---

## 12. Modelo de recursos e fórmulas

> Todas as constantes ficam em `dados_missao_ipe.json` → `balance`. O motor é determinístico: `resultado = f(escolhas, semente)`.

### 12.1 Massa

```
massa_total = (Σ massa_componentes) × (1 + margem)     margem = 0,10
compatível  = massa_total ≤ lançador.capacidade[órbita]
```

### 12.2 Potência

```
carga        = barramento.base_w + Σ instrumento.w × duty + comms.w
geração      = Σ painel.w × fator_solar[órbita] × (1 − 0,02 × meses/12)   (degradação)
eclipse_h    = 24 × eclipse_fracao
energia_ecl  = carga × eclipse_h
bateria_wh   = Σ baterias × 1400
déficit      = energia_ecl > bateria_wh × 0,7
```

`fator_solar`: 1,0 em LEO, SSO, NRHO e L1 · 0,6 em cruzeiro de espaço profundo · **0,43 em Marte** (inverso do quadrado da distância).

Se houver déficit: no eclipse, instrumentos de maior consumo desligam em cascata; a ciência do turno cai proporcionalmente.

### 12.3 Dados

```
gerado_gb_dia  = Σ instrumento.gb_dia × duty
downlink_gb_dia= comms.mbps × janela_h × 3600 / 8 / 1000
backlog       += gerado − downlink
perda         = max(0, backlog − buffer_dias × gerado)
integridade   = 1 − perda / gerado_total
```

Se `backlog > 2 × gerado_dia`, o jogo avisa: *"Seus dados estão envelhecendo a bordo."*

### 12.4 Radiação e tripulação

```
dose_gcr   = órbita.taxa_msv_dia × dias × fator_blindagem
dose_spe   = Σ evento.dose × fator_protecao
dose_total = dose_gcr + dose_spe
carreira   = dose_total / 600
```

Fatores de proteção (multiplicadores aplicados só ao SPE):

| Proteção | Fator |
|---|---|
| nenhuma | 1,00 |
| AstroRad | 0,393 (−60,7%) |
| abrigo | 0,20 (−80%) |
| abrigo + colete | 0,12 |

Blindagem do barramento (aplica-se ao GCR): 0,3 g/cm² → 1,00 · 1,0 → 0,90 · 2,5 → 0,75 · 4,0 → 0,62 · 8,0 → 0,45.

Saúde (0–100), atualizada por turno:

```
saude = 100
      − 40 × carreira                         (dose)
      − 8  × max(0, 6,5 − sono_h) × turnos    (débito de sono)
      − 15 × max(0, co2_mmhg − 3) / 2          (CO₂ acima do nominal)
      − 10 × carga_trabalho_alta_turnos / 3
```

Kit de saúde a bordo: reduz **50%** do dano de eventos médicos e antecipa o aviso em 1 turno.

### 12.5 Tempo e orçamento

```
custo_total = (Σ hardware + segmento terrestre) × 1,12 (integração)
            + meses_ops × (custo_mês[classe] + nível_dados)
            + atrasos
atraso_meses = max(0, meses_desenvolvimento − prazo)
custo_atraso = custo_total × 0,08 × atraso_meses
```

Custo operacional mensal por classe de barramento: CubeSat 0,1 · SmallSat 0,4 · MicroSat 0,8 · Midsize 1,5 · Large 3,0 · Habitat 8,0 (M$/mês).

### 12.6 Solo, usuários e sol

```
downlink_efetivo = min(comms.mbps, estação.mbps) × estação.janela_h
latência_comando = estação.latência_h + distância_min
ciência_final    = ciência_bruta × integridade × multiplicador_usuários
geração_solar    = Σ painel.w × fator_solar[órbita]
```

Consequência de projeto: em espaço profundo, **banda larga sem DSN não desce**, e **DSN sem MOC não decide**. O segmento terrestre é a terceira ponta do triângulo — e a que o jogador descobre na fase de operações, quando já é tarde para trocar.

---

## 13. Pontuação

### 13.1 Estrutura (1.000 pontos)

| Bloco | Pontos | Como |
|---|---|---|
| **Sucesso da missão** | 0–350 | 350 objetivo pleno · 175 parcial · 0 falha |
| **Valor científico** | 0–250 | 250 × min(1, ciência_obtida / meta) × integridade_dados |
| **Eficiência de recursos** | 0–200 | média de 4 subnotas (custo, massa, energia, dados) |
| **Qualidade de decisão** | 0–150 | 10 checkpoints × 15 pts |
| **Bônus** | +50 | missão limpa (+30), descoberta ≥ 120% da meta (+20) |
| **Penalidades** | −200 | dose > 80% (−100), perda de dados > 30% (−50), falha crítica (−30 cada) |

### 13.2 Subnotas de eficiência

```
ef_custo  = clamp( (ciência/gasto) / (ciência_ref/custo_ref) / 1,15 , 0, 1)
ef_massa  = clamp( (ciência/massa) / (ciência_ref/massa_ref) / 1,15 , 0, 1)
ef_energia= clamp( margem_energia / 0,35 , 0, 1)
ef_dados  = integridade_dados
eficiência= 200 × média(ef_custo, ef_massa, ef_energia, ef_dados)
```

O divisor 1,15 é a folga entre o "projeto de referência" do cenário e o ótimo teórico: ninguém chega a 100% nas quatro frentes ao mesmo tempo. A métrica central é **retorno científico por real e por quilo** — eficiência não é economizar, é converter recurso em resultado. Quem gasta pouco e entrega pouco não é eficiente: é barato.

### 13.3 Checkpoints de qualidade de decisão

1. Declarou o objetivo **antes** de abrir a bancada.
2. Justificou a escolha do objetivo (texto livre ≥ 40 caracteres).
3. Nenhum recurso estourou no commit.
4. Verificou a massa antes de lançar.
5. Tinha plano de dados (downlink ≥ geração).
6. Manteve dose < 80% da carreira.
7. Reagiu ao primeiro evento com decisão coerente (não "continuar" em alerta crítico).
8. Não perdeu janela de comunicação em evento crítico.
9. **Registrou ao menos 3 assinaturas com justificativa** (colaboração).
10. **Resolveu um veto ou negociação sem escalar para o Diretor** (colaboração).

Os dois últimos existem porque o desafio pede que **colaboração bem-sucedida seja premiada**, não presumida.

### 13.4 Exemplo de nota (M1 · Raízes, arquitetura B)

| Bloco | Cálculo | Pontos |
|---|---|---|
| Sucesso | meta de 220 batida (245 pts de ciência) | 350 |
| Ciência | 250 × min(1; 245/220) × integridade 1,0 | 250 |
| Eficiência | custo 0,77 · massa 0,81 · energia 1,0 · dados 1,0 | 179 |
| Decisão | 9 de 10 checkpoints | 135 |
| Bônus | missão limpa | +30 |
| **Total** | | **944** |

> Nota alta, mas a eficiência de custo ficou em 0,77: você gastou 112 dos 150 M$ e ainda assim entregou ciência por real **abaixo** do projeto de referência. O relatório pergunta: *"com 38 M$ sobrando, por que não comprar mais ciência?"* — porque eficiência não é economizar, é converter recurso em resultado.

---

## 14. Papéis e colaboração (até 4 jogadores)

### 14.1 Os quatro papéis

| Papel | Vê com exclusividade | Decide | Poder |
|---|---|---|---|
| **Diretor de Missão** | objetivo, prazo, orçamento, janela | objetivo, prioridades, go/no-go | **voto de minerva** |
| **Engenheiro de Sistemas** | massa, potência, blindagem, lançador | barramento, energia, lançador, órbita | **veto de massa** |
| **Cientista Principal** | valor científico, dados, instrumentos | carga útil, duty cycle | **veto de ciência** |
| **Operações & Comunicações** | janela de comms, backlog, saúde da tripulação | downlink, ritmo da tripulação, EVAs | **veto de dados** |

### 14.2 Informação assimétrica (o motor da conversa)

Cada jogador vê **um painel diferente**. O Diretor vê o dinheiro, não vê a massa. O Engenheiro vê a massa, não vê a ciência. O Cientista vê a ciência, não vê a conta de dados. Operações vê os dados, não vê o orçamento.

Consequência: **ninguém consegue decidir sozinho** — é preciso perguntar, e perguntar é o jogo.

### 14.3 Assinaturas (mecânica de negociação)

Para fechar o projeto, cada compra acima de um limite precisa de **duas assinaturas**:

- instrumento novo → Cientista + Engenheiro (massa)
- painel/bateria → Engenheiro + Operações (consumo)
- colete/abrigo → Operações + Diretor (custo)
- lançador maior → Diretor + Engenheiro (orçamento + massa)

Se um jogador recusa assinar, o jogo pede **uma frase de justificativa** e registra no relatório. Isso gera os melhores momentos de negociação — e vira dado para o debrief.

### 14.4 Conflitos desenhados (não acidentais)

| Conflito | Como aparece |
|---|---|
| Ciência × massa | instrumento bom é pesado |
| Potência × dados | banda larga consome energia |
| Orçamento × radiação | blindagem é massa; massa é dinheiro |
| Tempo × ambição | cada instrumento adiciona 0,8 mês |
| Saúde × ciência | EVA rende ciência e custa dose |
| Velocidade × segurança | atrasar 1 mês custa 8%, mas evita falha |

### 14.5 Modo solo

O jogador veste os quatro chapéus, mas o jogo **força a troca**: a cada fase, uma pergunta do papel correspondente aparece em modal ("Como Engenheiro de Sistemas: a massa cabe?"). É a versão "checklist de equipe" para quem joga sozinho — e funciona bem em sala de aula com um tablet por aluno.

---

## 15. Dificuldade, cenários e modos

### 15.1 Níveis

| Nível | Orçamento | Eventos | Falhas | Ajuda |
|---|---|---|---|---|
| **Cadete** | +25% | 1 a cada 2 turnos | só advertência | dicas em todas as telas, sem perda de dados |
| **Engenheiro** | padrão | 1 por turno | reais | dicas sob demanda |
| **Diretor de Voo** | −15% | 2 por turno, 1 oculto | reais + irreversíveis | sem dicas, sem desfazer |
| **Sandbox** | ∞ | opcional | desligadas | tudo liberado |

### 15.2 Cenários (5 + sandbox)

| # | Missão | Órbita | Duração | Orçamento | Tripulação | Objetivo | Meta ciência |
|---|---|---|---|---|---|---|---|
| **M0** | **Semente** (tutorial) | LEO 400 | 3 meses | 60 M$ | 0 | escolher 1 instrumento e 1 órbita com dicas | 80 |
| **M1** | **Raízes** — Olhos sobre a Amazônia | SSO 600 | 12 meses | 150 M$ | 0 | desmatamento/metano | 220 |
| **M2** | **Gelo** — Gelo Lunar | NRHO | 6 meses | 380 M$ | 0 | mapear gelo em crateras polares | 300 |
| **M3** | **Travessia** — A Travessia | Espaço profundo + Marte | 900 dias | 2.800 M$ | 4 | chegar e voltar com a tripulação saudável | 260 |
| **M4** | **Mensageiro** — Mensageiro | Espaço profundo | 5 anos | 650 M$ | 0 | sobrevoo de asteroide + retorno de amostra | 320 |
| **M5** | **Sentinela** — Clima Extremo | L1 | 3 anos | 260 M$ | 0 | alerta precoce de tempestades solares | 280 |
| **M∞** | **Sandbox** | livre | livre | ∞ | 0–4 | experimentar | — |

### 15.3 M3 · Travessia é o elo com o ASTRAL VITAL

"Travessia" é a missão que justifica o software de monitoramento de saúde: 900 dias, 4 tripulantes, latência de 4–24 min, dose de 1,18 mSv/dia, SPE a qualquer momento. O kit de saúde a bordo é um **instrumento comprável** — e o jogo mostra, com números, por que ele paga o próprio custo: sem ele, um evento médico custa 50 pontos e 2 turnos; com ele, custa 25 e 1 turno.

Esse é o gancho de pitch: **"o jogo ensina por que o app existe"**.

---

## 16. Baralho de eventos

18 cartas, divididas em 3 níveis. Cada carta tem: título, texto, efeito, opções, "por quê" e âncora científica.

### 16.1 Nível 1 — ambiente (7 cartas)

| Carta | Efeito | Por quê |
|---|---|---|
| **SPE tipo 1972** | +222 mSv sem proteção | evento solar extremo; 37% da carreira em horas |
| **SPE tipo 1989** | +233,5 mSv (colete: 143,6) | espectro mais duro; colete protege menos (−38,5%) |
| **Cinturão de prótons** | +1,61 mSv no trânsito | atravessar o Van Allen custa dose, com ou sem colete |
| **Clima espacial elevado (DONKI)** | +20% de dose por 1 turno | RBE, elétrons energéticos; decisão é adiar EVA |
| **Micrometeoroide** | 30% de chance de dano em 1 instrumento | massa e área aumentam o risco |
| **Eclipse longo** | déficit de energia por 1 turno | bateria é seguro, não luxo |
| **Tempestade de poeira (Marte)** | −40% de geração solar por 2 turnos | poeira deposita no painel; nuclear não sofre |

### 16.2 Nível 2 — sistema (6 cartas)

| Carta | Efeito | Por quê |
|---|---|---|
| **Roda de reação travada** | apontamento degradado; −20% de ciência até consertar | atitude é pré-requisito de tudo |
| **Falha de comunicação** | perde 1 janela; backlog +2 dias | antena e janela são recursos |
| **Computador reinicia** | perde o buffer de dados do turno | buffer é memória, e memória é volátil |
| **Instrumento degrada** | −30% de valor científico do instrumento | vida útil e duty cycle |
| **Vazamento de cabine** | pressão cai; 2 turnos para achar | hipóxia não espera a Terra |
| **CO₂ sobe** | saúde −15; cefaleia e erro humano | 3 mmHg já é 4.000 ppm |

### 16.3 Nível 3 — humano e institucional (5 cartas)

| Carta | Efeito | Por quê |
|---|---|---|
| **Débito de sono** | saúde −10; chance de erro +15% | 6,09 h é a média real na ISS |
| **Conflito de tripulação** | −1 ação no próximo turno | confinamento é hazard |
| **Corte de orçamento** | −10% do restante | política espacial é variável de projeto |
| **Perda de janela de lançamento** | +3 meses, −20% de vida útil | a física não negocia |
| **Emergência médica** | sem kit: −50 pts e 2 turnos; com kit: −25 e 1 turno | latência de 4–24 min em Marte |

### 16.4 Como o baralho é usado

- Semente + cenário definem a ordem.
- Nível de dificuldade define quantas cartas por turno.
- Nenhuma carta repetida na mesma partida (exceto "clima espacial elevado").
- Cartas de nível 3 só entram a partir do turno 4 (tempo para o jogador se importar).

---

## 17. Valor educativo

### 17.1 O princípio

> O jogo nunca diz "errado". Diz **"isto custou aquilo"** e mostra o número.

### 17.2 Cartões "Por quê" (sempre a um clique)

Cada componente, órbita, evento e número tem um cartão de **uma frase + um número + uma fonte**:

- *Por que a órbita importa?* "A 600 km o eclipse dura 35 min por órbita: sem bateria, seus instrumentos dormem 14 h por dia."
- *Por que o colete é caro?* "Ele pesa 12 kg por pessoa — e cada quilo custa ~10 mil dólares para ir à Lua."
- *Por que os dados expiram?* "O buffer de bordo guarda 2 dias; passou disso, o dado antigo é sobrescrito."
- *Por que 600 mSv?* "É o limite de carreira da NASA (NASA-STD-3001 Rev. C) para risco de câncer < 3%. A 1,18 mSv/dia, isso são 508 dias."

### 17.3 Progressão de aprendizagem

| Momento | Conceito | Como aparece |
|---|---|---|
| Fase 2 | objetivo → requisito (engenharia de sistemas) | matriz de conformidade |
| Fase 3 | massa, volume | semáforo e verificação |
| Fase 3 | órbita, eclipse, dose | comparação lado a lado |
| Fase 4 | energia, potência | déficit no eclipse |
| Fase 5 | dados, downlink | backlog e perda |
| Fase 6 | trade-off | relatório e "o que teria mudado" |
| Pós-jogo | causalidade | cadeia de 3 elos |

### 17.4 Glossário embutido

Massa · empuxo · órbita · eclipse · potência × energia · Watt-hora · downlink · Mbps · GCR · SPE · mSv · dose de carreira · eclipse · duty cycle · margem · janela de lançamento · latência. Cada termo tem 1 frase e 1 exemplo numérico; nunca uma definição de dicionário.

### 17.5 Modo aula

- **Antes:** 5 min de contexto com o professor.
- **Durante:** 50 min de jogo em equipes de 4.
- **Depois:** 20 min de debrief com 4 perguntas (§11.3) + 20 min de segunda tentativa com a mesma semente.
- **Avaliação:** o relatório exportável (PDF/Markdown) serve como evidência de aprendizagem.

---

## 18. Dados e honestidade (o selo que ganha a banca)

Cada número exibido carrega um selo, como no dossiê:

| Selo | Significado | Exemplos no jogo |
|---|---|---|
| 🟢 **REAL** | fonte NASA/agência, verificável | DONKI (clima espacial), OSDR (baselines), Artemis I (1,18 mSv/dia), NASA-STD-3001 (600 mSv) |
| 🟡 **DERIVADO** | calculado de dados reais + modelo | fração de carreira, projeção de dose, consumo de energia |
| 🔵 **SIMULADO** | modelo físico com parâmetros publicados | fisiologia da tripulação, falhas de sistema, eventos |

**Integração ao vivo (diferencial de demo):**

- **DONKI** alimenta o baralho: o jogo consulta `notifications` e, se houver evento real nos últimos 7 dias, transforma em carta ("evento real de 12/11/2026"). Funciona offline com o snapshot `../dados/donki_snapshot_2026.json`.
- **OSDR OSD-575** calibra o baseline de saúde da tripulação na M3 (glicemia, eletrólitos).
- **Artemis I (MARE)** calibra a taxa de dose por órbita.

Frase de pitch: *"O jogo não inventa o espaço. Ele usa os mesmos números que a NASA publicou — e diz na tela de onde veio cada um."*

### 18.4 Os recursos oficiais do desafio e onde cada um entra

| Recurso | O que é | Como entra no MISSAO IPE |
|---|---|---|
| **Projetar e desenvolver missões científicas** | engenharia de sistemas; quatro segmentos: lançamento, espacial, terrestre, usuários | estrutura o jogo: §9 (lançamento), §8 (espacial), §8.7 (terrestre), §8.8 (usuários) |
| **GMAT** (General Mission Analysis Tool) | astrodinâmica open source de alta fidelidade: propagação, janelas, manobras, otimização | **gerador offline** dos números de órbita e janela; o jogo consome JSON pré-calculado |
| **CMLs** (Concept Maturity Levels, JPL) | maturidade do conceito, CML 1–4 | rotula as fases (§7.9) e exige *trade study* no CML 2 |
| **MDL** (Mission Design Lab) | ambiente colaborativo com níveis de estudo | inspira o modo equipe: brainstorm → conceito → trade → point design |
| **NASA Mission Viz** | visualização 3D web de trajetórias e eventos | referência de experiência para a vista de órbita (§19) |
| **Jogo educativo de telescópios** | objetivos → instrumentos → lançamento → missões reais | referência de fluxo: opções cinzas por incompatibilidade (§8.9), lançamento (§9.6), missão análoga (§11.1) |
| **CubeSat 101** | ConOps, fases, lançamento e operação | base do ConOps (§10.7) e do checklist de operações |
| **Desafio VR 2023** | missão completa em RV: conceito, trajetória, cronograma, 3D | referência de escopo "missão inteira"; RV fica fora do MVP |
| **CSA — jogos digitais** | acervo educacional da agência parceira | referência de acessibilidade e do conteúdo de radiação (CSA 2026) |

**Dados, marcas e endosso.** Os dados da NASA são usados com citação e sem sugerir endosso da agência; o jogo não afirma parceria com a NASA nem com qualquer agência, e cumpre os termos de uso de cada fonte — inclusive as não americanas, como a CSA (os termos do aviso oficial do desafio estão reproduzidos no [`README.md`](README.md)).

---

## 19. Interface

### 19.1 Mapa de telas

```
[Início] ─► [Cenário] ─► [Objetivo] ─► [Bancada] ─► [Lançamento] ─► [Operações] ─► [Relatório]
                                            │            │              │
                                            └─ semáforo  └─ massa       └─ HUD de 7 recursos
```

### 19.2 Tela de bancada (wireframe)

```
┌──────────────────────────────────────────────────────────────────────┐
│ MISSÃO · Olhos sobre a Amazônia        Semente AMZ-2026-014   [i] [?]│
├──────────────────────────────────────────────────────────────────────┤
│ MASSA  353/1.500 kg ███░░░░░░░   POT 195/400 W █████░░░░░            │
│ ORÇ   98/150 M$ ██████░░░░        DADOS 30/5,4 GB/d ████████░░        │
├───────────────┬──────────────────────────────────────────────────────┤
│ ▸ Barramento  │  [Câmera multiespectral]  [Espectrômetro de imagem]  │
│ ▸ Energia     │  ┌───────────────┐  ┌───────────────┐                │
│ ▸ Comunicações│  │ 5 kg · 15 W   │  │ 25 kg · 45 W  │                │
│ ▸ Carga útil  │  │ 2,5 M$ · 4GB/d│  │ 9 M$ · 12GB/d │                │
│ ▸ Proteção    │  │ ciência 60    │  │ ciência 90    │                │
│               │  └───────────────┘  └───────────────┘                │
│               │  [ Magnetômetro ]   [ Dosímetro ]                    │
├───────────────┴──────────────────────────────────────────────────────┤
│ ⚠ DADOS: 30 GB/d gerados · 5,4 GB/d transmitidos → perda estimada 82%│
│                                    [ Revisar projeto ] [ Lançar ▸ ]   │
└──────────────────────────────────────────────────────────────────────┘
```

### 19.3 Tela de operações (HUD)

```
MÊS 7/12 · SSO 600 km · 0 tripulantes                    DOSE ·  ·  ·  ·
┌──────────────┬───────────────────────────────────────────────────────┐
│ ENERGIA      │                                                       │
│ ████████░░   │   EVENTO · Clima espacial elevado                     │
│ 610 / 1.100 W│   O Sol emitiu uma ejeção de massa coronal.           │
│              │   Exposição adicional esperada nas próximas 6 h.      │
│ DADOS        │                                                       │
│ ████░░░░░░   │   [ Adiar EVA ]      [ Continuar ]      [ Abrigo ]   │
│ 18 GB atraso │                                                       │
│              │   Por quê ▸                                           │
│ ORÇAMENTO    │                                                       │
│ ██████░░░░   │                                                       │
└──────────────┴───────────────────────────────────────────────────────┘
```

### 19.4 Princípios visuais

- Escuro por padrão (sala de controle), claro opcional.
- Cor **nunca** sozinha: sempre cor + ícone + texto (daltonismo).
- Números grandes, unidades pequenas.
- Uma decisão por tela na operação; no máximo 4 opções.
- Micro-animação só para explicar (painel enchendo, dose subindo), nunca para enfeitar.

---

## 20. Acessibilidade

| Requisito | Implementação |
|---|---|
| Daltonismo | paleta segura + forma + rótulo textual em todo status |
| Contraste | ≥ 4,5:1 em texto; ≥ 3:1 em elementos |
| Alvos de toque | ≥ 44 px (modo "luva" com 64 px) |
| Leitor de tela | todos os cartões são botões com `aria-label` descritivo |
| Idioma | PT-BR e EN (i18n desde o dia 1) |
| Ritmo | modo por turnos, sem cronômetro (opcional no competitivo) |
| Cognição | modo guiado com uma ação destacada por vez |
| Offline | PWA com cache total; sem dependência de rede |

---

## 21. Arquitetura técnica e plano de 48 h

### 21.1 Stack

- **Next.js 15 + TypeScript** (App Router) ou Vite + React 19 se a equipe preferir SPA.
- **Motor puro** em `engine/` — funções sem React, testáveis com Vitest.
- **Estado** com Zustand + persistência em `localStorage`.
- **Dados** em `dados_missao_ipe.json` (versionado; nenhum número no código).
- **Gráficos** Recharts (dose, dados, orçamento).
- **Deploy** Vercel; funcionamento offline via service worker.
- **Ranking opcional** Supabase (tabela `runs`: seed, cenário, nota, código da missão).

### 21.2 Determinismo

```ts
// engine/random.ts
export function mulberry32(seed: number) { /* ... */ }
export function missionSeed(code: string): number { /* hash estável */ }
```

Mesma semente + mesmas escolhas = mesmo relatório. Isso permite ranking justo, replay e "código da missão" compartilhável.

### 21.3 Estrutura de pastas

```
missao-ipe/
├── ROTEIRO_MISSAO_IPE.md            ← este documento
├── CRAFT_ANYTHING_E_MISSOES.md      ← fábrica de missões (produção)
├── ASSETS_E_IMERSAO.md              ← assets, 3D e motion (licenças e peso)
├── dados_missao_ipe.json            ← balanceamento e conteúdo
├── missoes/                         ← um pacote JSON por missão (M0–M5)
├── engine/
│   ├── random.ts        seed, baralho
│   ├── project.ts       massa, potência, custo, validações
│   ├── science.ts       dados, integridade, valor científico
│   ├── crew.ts          dose, sono, saúde
│   ├── events.ts        resolução de cartas
│   └── score.ts         pontuação e relatório
├── app/                 telas
└── tests/               regras + balanceamento
```

### 21.4 Corte de escopo para 48 h (MVP)

**Entra no MVP (obrigatório):**
1. Um cenário (M1) + sandbox.
2. Bancada com 12 componentes.
3. Duas órbitas, três lançadores.
4. Verificação de massa, potência e dados.
5. Seis turnos com 6 eventos.
6. Relatório causal + nota + código da missão.
7. Modo solo e modo "passa o controle" para 4 pessoas.
8. Selo REAL/DERIVADO/SIMULADO.

**Fica para depois:** ranking online, multiplayer em rede, cenários 2–5, modo aula, PDF exportado, i18n completa.

**Regra de ouro do hackathon:** o relatório é o produto. Se o tempo apertar, corte telas bonitas, nunca o diagnóstico.

---

## 22. Demo de 5 minutos e pitch de 3 minutos

### 22.1 Demo (o jurado joga)

| Tempo | Ação |
|---|---|
| 0:00 | abre no cenário "Raízes", objetivo já escolhido: desmatamento |
| 0:20 | trava 3 requisitos: cobertura 80%, resolução 10 m, latência 24 h |
| 0:50 | adiciona espectrômetro de imagem → semáforo de **dados** fica vermelho |
| 1:20 | troca S-band por X-band → custo sobe 9 M$, dados ficam verdes |
| 1:50 | escolhe Vega-C porque a massa não cabe no Electron (mostra os 339 kg) |
| 2:20 | lança → sequência de 5 s com os números carimbados |
| 2:40 | turno 3 traz o evento solar; escolhe "adiar EVA" |
| 3:30 | turno 6: backlog perdido; ciência cai para 68% |
| 4:00 | relatório: conformidade, "missão análoga: Sentinel-2 (82%)" e a conta dos 6,6 GB/dia |
| 4:40 | botão "refazer com a mesma semente" → muda uma peça → nota sobe 120 pontos |

**Frase de fechamento:** *"O jogo não terminou quando a missão falhou. Terminou quando o jogador entendeu por quê."*

### 22.2 Pitch (3 min)

1. **0:00–0:20 — o problema.** "Projetar uma missão espacial é decidir sob restrição: massa, energia, dinheiro, tempo e — quase sempre esquecido — a vida de quem vai."
2. **0:20–0:50 — a virada.** "A maioria dos jogos deixa você escolher a espaçonave. O MISSAO IPE obriga você a escolher **o que descobrir** e **o quanto** — objetivo, depois requisitos numéricos — antes de tocar em uma peça. E cada peça tem cinco consequências na tela: massa, potência, custo, dados e ciência."
3. **0:50–1:30 — a prova.** "Não existe solução única: três arquiteturas diferentes terminam este cenário com notas 623, 944 e 898. O jogo não premia a peça certa, premia a decisão coerente."
4. **1:30–2:10 — a falha que ensina.** "Nesta demo, 6,6 GB/dia de dados sem downlink custaram 31% da ciência. O relatório mostra a cadeia: instrumento → banda → janela → perda. É o tipo de feedback que muda a próxima decisão."
5. **2:10–2:40 — a âncora real.** "Os números vêm da NASA: 1,18 mSv/dia medidos na Orion, limite de 600 mSv, 222 mSv em um SPE tipo 1972, −60,7% com AstroRad. Nada aqui é ficção — e cada número tem selo de fonte."
6. **2:40–3:00 — o convite.** "Quatro pessoas, 45 minutos, uma missão. O jogo termina com um relatório que explica o sucesso ou o fracasso — e com vontade de tentar de novo."

---

## 23. Métricas de sucesso do jogo

| Métrica | Meta | Como medir |
|---|---|---|
| Partida completa | ≥ 80% dos que começam terminam | telemetria local anônima |
| Rejogada | ≥ 50% refazem a missão | nova partida com mesma semente |
| Compreensão | ≥ 70% acertam "por que falhou" no debrief | pergunta pós-jogo |
| Tempo até a 1ª decisão informada | < 3 min | log |
| Equidade | diferença de nota entre papéis < 15% | análise de partidas |
| Sala de aula | 1 professor consegue rodar sem manual | teste com 3 professores |

---

## 24. Riscos e mitigação

| Risco | Probabilidade | Mitigação |
|---|---|---|
| Complexidade assusta o iniciante | alta | modo Cadete + uma ação destacada por tela |
| Números desbalanceados | alta | `dados_missao_ipe.json` + 10 playtests + script de balanceamento |
| "É só um monte de menus" | média | HUD de 7 recursos sempre visível; uma decisão por tela |
| Física simplificada demais para jurado técnico | média | selo SIMULADO + cartões "Por quê" com fonte |
| Multiplayer exigir servidor | baixa | modo "passa o controle" local; online é opcional |
| Escopo estourar em 48 h | alta | MVP da §21.4; relatório primeiro |

---

## 25. Rastreabilidade — cada requisito do desafio e onde ele vive

| Requisito do enunciado | Onde está no jogo |
|---|---|
| Acessível a diferentes níveis de conhecimento | §2, §15.1 (Cadete/Engenheiro/Diretor), §17 |
| Individual e equipe até 4 | §14, §5.2 |
| Papéis diferentes (missão, espaçonave, ciência, comunicações, recursos) | §14.1 |
| Objetivos claros e feedback | §7.2, §11.2, §13.3 |
| Interativo, replanejar e simular várias vezes | §5.2, §11.1, §22.1 (refazer) |
| Pontuação: sucesso, ciência, eficiência, decisão | §13 |
| Dificuldades, tipos de missão, cenários | §15 |
| Objetivo antes da espaçonave | §7 (regra: objetivo travado antes da bancada) |
| Consequência para cada decisão | §8.3, cartão de componente |
| Sem solução única | §7.6 (três arquiteturas) |
| Restrições realistas (orçamento, massa, energia, comms, duração) | §12 |
| Componentes (estrutura, energia, bateria, comms, computador, atitude, instrumentos) | §8.1, `dados_missao_ipe.json` |
| Instrumentos com massa, energia, custo, dados, valor | §8.2 |
| Componentes simples × avançados por dificuldade | §15.1 (bloqueio por nível) |
| Órbitas explicadas | §9.1 |
| Órbita afeta cobertura, observação, comms, vida útil | §9.1, §12 |
| Lançadores com capacidade, custo, órbita | §9.2 |
| Verificação massa × lançador × órbita | §9.3 |
| Recursos exibidos claramente (massa, potência, orçamento, dados, comms, tempo) | §10.2 (HUD) |
| Identificar recursos críticos | §10.2 (cor + alerta) |
| Equipe até 4, papéis, decisão coletiva | §14 |
| Negociação de prioridades conflitantes | §14.3, §14.4 |
| Resultado depende da coordenação | §14.2, §14.3 (assinaturas) |
| Explicações simples, não jargão | §17.2, §17.4 |
| Conceitos via jogo (altitude, carga útil, energia, dados, comms) | §17.3 |
| Tutoriais, indicadores, recursos opcionais | §15.1, §17.5, cartões "Por quê" |
| Ensinar **por que** a decisão afeta o desempenho | §11.2, §17.1 |
| Múltiplos cenários com objetivos diferentes | §15.2 |
| Eventos aleatórios / restrições inesperadas | §16 |
| Níveis de dificuldade | §15.1 |
| Modelos realistas ou simplificados | §1.5 + selo de dados |
| Visualizações interativas da espaçonave | §8.2, §19.2 |
| Painel de consumo em tempo real | §10.2, §19.3 |
| Rankings | §13, §21.1 (opcional) |
| Relatórios ao final | §11 |
| Salvar, compartilhar, comparar projetos | §11.1 (código da missão) |
| Missões cooperativas até 4 | §14 |
| Cenários competitivos (mesmo objetivo) | §5.2, §21.2 (semente) |
| Modo sandbox | §15.1 |
| Análise pós-missão do porquê | §11.2, §11.3 |
| Definir **requisitos** da missão antes do projeto | §7.7, §7.8 (matriz de conformidade) |
| Quatro segmentos: lançamento, espacial, terrestre, usuários | §9, §8, §8.7, §8.8 |
| Maturidade do conceito (CML) e estudo de trocas | §7.9, §8.5 (*trade study*) |
| Sequência de lançamento e verificação final | §9.3, §9.6 |
| Missão análoga real ao final | §11.1 (item 6) |
| Colaboração pontuada, não presumida | §13.3 (checkpoints 9–10), §14.3 |
| Vida útil como requisito e como fase de operação | §7.7, §10.7 |
| Computador de bordo e controle de atitude | §8.10 (aviônica em 3 níveis) |

---

## 26. Produção: a fábrica de missões

As missões M0–M5 não são seis jogos: são **seis pacotes de dados** sobre o mesmo motor, e cada um exercita um subconjunto da rubrica. A composição é a resposta ao pedido de "múltiplos cenários com objetivos diferentes" — nenhuma missão cobre tudo sozinha.

Dois documentos completam este roteiro:

| Documento | Responde |
|---|---|
| [`CRAFT_ANYTHING_E_MISSOES.md`](CRAFT_ANYTHING_E_MISSOES.md) | como produzir cada missão em ~2 h com o Craft Anything (estudo → build → check → pin), o contrato do pacote de missão e a **matriz de composição** missão × requisito |
| [`ASSETS_E_IMERSAO.md`](ASSETS_E_IMERSAO.md) | quais repositórios dão os assets e a imersão (three.js, R3F, NASA 3D, Motion, Magic UI), com licença, peso e orçamento de 12 MB para rodar offline |

### 26.1 Regra de ouro da produção

**Gera-se a moldura, não a física.** A cena, o CSS, as transições e os assets 3D podem ser gerados por agente; o motor (`engine/`), o balanceamento (`dados_missao_ipe.json`) e os textos com fonte **não**.

### 26.2 Corte de escopo se o tempo apertar

Ficam **M0 (tutorial) + M1 (Raízes) + M3 (Travessia)** — juntas, elas cobrem objetivo, projeto, órbita, energia, dados, tripulação, eventos, relatório e multiplayer. As outras três viram conteúdo do próximo release.

---

## 27. Próximos passos

1. **Validar o balanceamento** — rodar 10 partidas simuladas com o motor e ajustar `dados_missao_ipe.json` (script de balanceamento incluso no plano).
2. **Prototipar a bancada** — é a tela que decide se o jogo funciona.
3. **Escrever o relatório** — o texto causal é o produto; comece por ele, não pela interface.
4. **Testar com 3 pessoas que nunca jogaram** — se elas entenderem a falha sem explicação, o jogo está pronto.
5. **Gravar a demo de 5 min** — sem edição, para treinar o pitch.

---

## Apêndice A — Glossário de tela (1 frase + 1 número)

| Termo | Explicação de tela |
|---|---|
| Massa | "Tudo que sobe pesa. Cada quilo custa cerca de 10 mil dólares para ir à Lua." |
| Potência | "Potência é o quanto você gasta agora; energia é quanto você tem guardado." |
| Eclipse | "Metade da órbita fica no escuro: 35 min sem Sol a cada volta em órbita baixa." |
| Downlink | "É a descida dos dados. Sem antena, o dado fica preso a bordo e envelhece." |
| mSv | "Milésimo de sievert: a unidade de dose de radiação. 600 mSv é o limite de carreira." |
| SPE | "Evento de partículas solares: uma tempestade de prótons que dura horas." |
| GCR | "Raio cósmico galáctico: chuva contínua e penetrante de partículas." |
| Latência | "Tempo de ida e volta do sinal. Na Lua, 1,3 s; em Marte, até 24 min." |
| Margem | "Folga entre o que você precisa e o que você tem. Sobrepeso é tão ruim quanto falta." |
| Janela | "O intervalo em que a física permite lançar. Perdeu, espera meses." |

## Apêndice B — Arquivos deste pacote

```
missao-ipe/
├── ROTEIRO_MISSAO_IPE.md            ← este roteiro (design, regras, pitch)
├── CRAFT_ANYTHING_E_MISSOES.md      ← fábrica de missões: pipeline e matriz de composição
├── ASSETS_E_IMERSAO.md              ← curadoria de repositórios de assets, 3D e motion
├── dados_missao_ipe.json            ← componentes, órbitas, lançadores, eventos, cenários
└── README.md                        ← mapa do pacote
```

Fonte dos números reais: `../DOSSIE_ASTRAL_VITAL_NASA_2026.md` (§5, §6, §7, §9) e `../dados/`.
