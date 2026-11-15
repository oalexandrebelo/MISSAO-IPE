# Complexidade dos jogos da CSA
## Análise comparativa dos 11 itens de "Digital games and activities"

**Fonte:** [asc-csa.gc.ca — Digital games and activities](https://www.asc-csa.gc.ca/eng/youth-educators/digital-games-and-activities.asp) · consulta em 15/11/2026
**Método:** inspeção das páginas oficiais e do código público dos jogos embutidos (HTML, JS e manifests de assets), não apenas do texto de marketing.

---

## 1. O que existe lá

A página lista 11 itens. Só **quatro** são jogos; o resto é atividade interativa, acervo ou material de apoio:

| Item | Tipo | Jogo? |
|---|---|---|
| Tomatosphere Adventure | jogo (Minecraft Education) | ✅ |
| Mission: Astronaut | jogo (plataforma web) | ✅ |
| Game – RADARSAT Constellation Mission | jogo (web, 3 cenários) | ✅ |
| Game – OSIRIS-REx | jogo (web, 1 cenário) | ✅ |
| Exploring Earth | exploração de imagens | ⚠️ interativo, sem jogo |
| Quizzes | quiz | ❌ |
| Puzzle: Canada from space | quebra-cabeça | ⚠️ |
| Astronaut cutouts | gerador de imagem | ❌ |
| 3D printing models | modelos para impressão | ❌ |
| Explorers Club e-books | leitura | ❌ |
| Playlists | música | ❌ |

---

## 2. Como a complexidade foi medida

Três eixos, cada um de 1 a 5, com pesos diferentes:

| Eixo | Peso | O que mede | Evidência usada |
|---|---|---|---|
| **Sistemas** | 40% | variáveis interligadas, estado, economia, progressão, consequência | recursos, moedas, desbloqueios, save, ramificação |
| **Conteúdo** | 30% | missões, atividades, cenários, texto, assets | contagem de missões, chaves de texto, manifests |
| **Técnica** | 30% | engine, 3D, contas, plataforma, multiplayer | stack, código, infraestrutura |

```
índice = (0,40·S + 0,30·C + 0,30·T) / 5 × 100
```

---

## 3. Ranking

| # | Jogo | Sistemas | Conteúdo | Técnica | **Índice** |
|---|---|---|---|---|---|
| 1 | **Mission: Astronaut** | 4 | 5 | 4 | **86** |
| 2 | **Tomatosphere Adventure** | 2 | 4 | 5 | **70** |
| 3 | **RADARSAT Constellation** | 2 | 3 | 2 | **46** |
| 4 | **OSIRIS-REx** | 1 | 2 | 2 | **32** |
| 5 | Exploring Earth | 1 | 2 | 1 | 26 |
| 6 | Puzzle / Quiz / Cutout | 1 | 1 | 1 | 20 |

---

## 4. Por que cada um ficou onde ficou

### 4.1 Mission: Astronaut — 86 (o mais complexo)

É o único que tem **sistema**, não só conteúdo:

- **8 missões temáticas** (treinamento, vida no espaço, robótica, ciência, espaçonave, Lua, Webb, saúde) com **dezenas de atividades curtas** e **6 minigames**, incluindo um de **programação em blocos** (rover lunar).
- **Economia de estrelas** + **7 coleções** + avatar com acessório: laço de recompensa e progressão persistente.
- **Infraestrutura de sala de aula**: conta de professor gera **50 chaves de aluno**, sem e-mail; funciona em computador e tablet; turmas podem competir.
- Público declarado: **3º ao 6º ano** — a complexidade é alta, mas *embalada* para criança.

**Evidência técnica:** SPA em **AngularJS 1.4 + jQuery + Bootstrap**, com conteúdo servido por atividades. Ou seja: a complexidade está na **plataforma e na curadoria**, não em simulação.

**O que ele ensina ao MISSAO IPE:** economia de recompensa e entrada sem fricção (chave de turma) são mais eficazes para retenção do que mais mecânica.

### 4.2 Tomatosphere Adventure — 70 (complexidade herdada)

- **3 experiências de laboratório** obrigatórias (biologia vegetal, máquina de fotossíntese, papel dos componentes químicos) antes da missão final: **construir estufa e cultivar tomate em Marte**.
- Narrativa com **NPCs** (astronautas Joshua Kutryk e Jenni Gibbons), público 10+.
- Parceria Let's Talk Science + CSA + Logics Academy.

**O ponto central:** a técnica é 5 porque o **Minecraft Education** já entrega 3D, construção e física de mundo. O jogo em si é um **mapa** — sistemas desenhados: 2. É o exemplo mais claro de **complexidade herdada da plataforma**, não projetada.

**Lição:** dá para parecer muito mais complexo "morando" dentro de um engine existente. Foi exatamente o que propusemos com o Craft Anything — só que sem herdar a dívida de licença.

### 4.3 RADARSAT Constellation — 46

- **3 cenários** (agricultura, enchente, Ártico), um por persona: fazendeiro, capitão de navio, socorrista.
- Mecânica: escolher imagem/interpretar radar para resolver o problema de cada persona.
- **Evidência de código:** `game1.js`, `game2.js`, `game3.js` (1,4–2,2 KB cada), um `Text.json` com **61 chaves**, e **2 imagens por missão** (`mission_game` e `mission_final`). É um **player de cenas** com hotspots e arrastar (interact.js), não uma simulação.

**Leitura:** três cenários dão sensação de variedade, mas cada um é **uma tela**. Complexidade de conteúdo média, de sistema baixa.

### 4.4 OSIRIS-REx — 32

- **1 cenário**: escolher o melhor local de coleta em Bennu usando imagens reais.
- **Evidência:** `game.js` de 2,4 KB, `Text.json` com 44 chaves, 2 imagens, engine própria (jQuery 3.3 + interact.js + Howler).
- É o mais **enxuto** dos quatro — e, ainda assim, o mais **cientificamente honesto**: a decisão é a decisão real da missão.

**Leitura:** complexidade não é o mesmo que qualidade científica. Este é o melhor exemplo de "uma decisão, uma tela, um dado real".

### 4.5 Os demais

- **Exploring Earth:** exploração de fotos de astronautas e satélites, sem estado, sem falha, sem objetivo — não é jogo.
- **Puzzle, quiz, cutout:** interação de minutos, sem sistema. Servem como *aquecimento* de aula, não como experiência.

---

## 5. O ranking engana em um ponto

Se o critério for **"quanto o jogador precisa entender para vencer"**, a ordem muda:

| Critério | Vencedor |
|---|---|
| Mais sistemas e progressão | **Mission: Astronaut** |
| Mais mundo e imersão | **Tomatosphere Adventure** |
| Mais decisão científica por minuto | **OSIRIS-REx** |
| Mais variedade de contexto | **RADARSAT RCM** |

Ou seja: **complexidade não é uma coisa só**. Mission: Astronaut tem mais *sistema*; OSIRIS-REx tem mais *substância por decisão*. E o MISSAO IPE, comparado a todos, é de outra categoria (§6).

---

## 6. Onde o MISSAO IPE se posiciona

| Dimensão | CSA (melhor caso) | MISSAO IPE |
|---|---|---|
| Recursos interligados | 1 (estrelas) | **7** (massa, potência, orçamento, dados, comms, tempo, tripulação) |
| Requisitos mensuráveis | 0 | **3 obrigatórios + 2 opcionais** |
| Simulação determinística | não | **sim** (semente + regras) |
| Consequência causal | parcial | **cadeia de 3 elos no relatório** |
| Colaboração | competição entre turmas | **4 papéis com veto e assinatura** |
| Onboarding | **excelente** | a construir (M0 Semente) |
| Entrada sem fricção | **chave de turma** | a construir |

**Conclusão dura:** o MISSAO IPE é **mais complexo em sistema** que qualquer jogo da CSA — e **menos pronto em experiência**. A banca vai comparar a *experiência*, não a planilha de mecânicas.

---

## 7. O que copiar de cada um (e o que não copiar)

| Pegar | De quem | Como |
|---|---|---|
| Economia de recompensa leve | Mission: Astronaut | "selos de missão" (não mudam a nota; mudam a vontade de rejogar) |
| Entrada sem e-mail | Mission: Astronaut | código de turma no save/share |
| Narrativa-guarda-chuva | Tomatosphere | o arco do ipê ligando M0→M5 |
| Uma decisão, uma tela | OSIRIS-REx | tela de operações com no máximo 4 ações |
| Variedade por persona | RADARSAT | papéis (§14) já fazem isso; falta o cenário por persona |
| **Não copiar** | todos | stack legado (jQuery/AngularJS 1.x) e ausência de simulação |

---

## 8. Limitações desta análise

- Avaliação feita por **página oficial + código público**, sem sessão de jogo assistida — a percepção de dificuldade pode diferir.
- Os jogos web são de **2019–2020** (jQuery 1.8/3.3) e o Mission: Astronaut é de **2019–2022** (AngularJS): parte da complexidade técnica já é **dívida**, não virtude.
- "Complexidade" aqui é **de design**, não de dificuldade para o jogador: um jogo simples pode ser difícil e um complexo pode ser fácil.

---

## 9. Resposta curta

**O mais complexo é o Mission: Astronaut** (8 missões, 6 minigames, economia de estrelas, coleções e contas de turma). **O mais complexo por unidade de decisão é o OSIRIS-REx**, que faz uma única pergunta científica com dados reais. O Tomatosphere parece o mais complexo, mas a complexidade é do Minecraft, não do jogo.

E o MISSAO IPE não deve competir em volume de conteúdo com nenhum deles: deve competir em **profundidade de consequência** — que é justamente o que nenhum dos quatro tem.
