# Craft Anything × MISSAO IPE
## Como o repositório vira a fábrica de missões do jogo

**Analisado em:** 15/11/2026 · [github.com/storytold/craft-anything](https://github.com/storytold/craft-anything)
**Licença:** MIT OR Apache-2.0 · **Versão:** early alpha (0.x) · **Plataformas:** macOS, Windows, Linux, FreeBSD, Web (viewer)

---

## 1. O que o repositório é (fatos, não impressão)

| Item | O que é |
|---|---|
| Produto | **Craft Anything**, do time ArtCraft — app desktop + CLI + servidor MCP |
| Função | estuda um alvo (site, app, jogo, arquivo), manda um agente de código construir uma versão nova e **compara** o resultado com o original até ficar próximo |
| Motor | Rust puro, 303 ferramentas de engine em 17 toolsets (+ camada de IA/setup) |
| Fluxo | **Study → Build → Check → Ready**, com cartões de pergunta e aprovação |
| Modos | **Clean room** (padrão: não lê código do alvo, só o que é visível) e **Deep** (lê código, arquivos, usa Ghidra) |
| Formatos | nativo (PE/Mach-O/ELF), .NET, Java, Android, Apple, Electron/JS, sites, firmware, capturas de rede, **bancos SQLite** e **arquivos de jogo** (Unity assets/bundles, Unreal pak/IoStore) |
| Saídas | projeto em pasta (`craft.json`, `capture/`, `app/`, `checks/`, `investigation.cany/`, `inbox/`), relatórios, builds fixados (*pins*) |
| IA | usa **seu** agente de código (Claude Code primeiro; Codex, Copilot, Grok e ACP em estágios diferentes) — não embute modelo |
| Assets | geração de **imagem** e **modelo 3D** via fal.ai (opt-in, chave própria) |
| Automação | todo tool é subcomando de CLI **e** tool MCP → um agente (nós) pode orquestrar |

### 1.1 O que ele **não** é

- **Não é engine de jogo** e não roda dentro do MISSAO IPE. É ferramenta de produção.
- **Não é biblioteca de assets.** Ele *gera* e *extrai* assets; não os fornece.
- **Não substitui o motor determinístico** do jogo (regras, pontuação, semente). Código gerado por agente não é auditável o suficiente para ser a fonte da verdade do balanceamento.
- **Não está pronto para produção**: alpha declarado, com partes "construídas mas não verificadas ao vivo" (outros agentes por API, checagem de comportamento de jogos).

> **Conclusão de uma linha:** o Craft Anything é o **acelerador de produção de missões e de interface**, não uma dependência do produto.

---

## 2. Por que ele interessa ao MISSAO IPE

O gargalo do nosso projeto não é a regra — é produzir **cinco missões jogáveis, distintas e verificáveis** em 48 h, cada uma com sua tela, seu cenário e seu relatório. É exatamente o tipo de trabalho repetitivo com especificação clara que o Craft Anything faz bem.

Três usos legítimos, em ordem de retorno:

### Uso A — Fábrica de Missões (o principal)

Cada missão do MISSAO IPE é um **pacote de dados + uma cena**. O Craft Anything gera a cena a partir do brief e compara com referências visuais; o motor (nosso, determinístico) consome o pacote. Resultado: 1 missão nova em ~2 h em vez de ~6 h.

### Uso B — Calibragem por extração de arquivos de jogo

As ferramentas `game_unity_list`, `game_unity_asset_export`, `game_pak_list` e `game_unreal_texture_export` permitem ler catálogos de peças de jogos **que possuímos ou podemos examinar** (jogos open source e os nossos próprios protótipos). Serve para conferir ordens de grandeza de massa/potência/custo contra jogos comerciais de referência — não para copiar conteúdo.

> **Regra dura:** só usar Deep mode em software nosso ou explicitamente permitido. Nada de copiar modelos, texturas, nomes ou textos de terceiros. O produto final não contém asset de terceiro sem licença.

### Uso C — QA visual e de comportamento

`web_pixels_compare`, `web_snapshots_compare` e `web_walkthrough_check` comparam nossa build com a referência em três larguras e num roteiro de cliques. Isso vira **evidência de qualidade** para a banca: "a tela de operações foi verificada contra o padrão X em 3 larguras, diferença de 0,8%".

---

## 3. O pipeline, com comandos reais

### 3.1 Preparação (uma vez)

```bash
# baixar o app assinado (macOS universal) ou compilar
# https://github.com/storytold/craft-anything/releases/latest

craft-anything-cli doctor          # confere instalação, agentes e engines
craft-anything-cli commands        # lista as 303 ferramentas por toolset
craft-anything-cli mcp             # expõe tudo ao nosso agente via MCP
```

### 3.2 Ciclo por missão (o "Mission Factory")

| Etapa | Ferramenta / comando | Saída |
|---|---|---|
| 1. Escrever o brief | `core_brief_write` (ou o arquivo `missao-Mn.md`) | brief com objetivo, restrições, estética, critérios |
| 2. Estudar referências | `web_site_open` + `web_site_capture` + `web_page_states_capture` | `capture/` com telas, menus, medidas, cores |
| 3. Gerar a cena | `craft-anything-cli rebuild - "<brief + design tokens + stack>" --rounds 2` | `app/` com projeto React/TS |
| 4. Comparar | `web_pixels_compare`, `web_snapshots_compare` | `checks/` com % de semelhança e diferenças |
| 5. Refinar | `craft-anything-cli rebuild … --continue-in "<pasta>"` | nova rodada |
| 6. Gerar assets | `assets_model_generate` (nave), `assets_image_generate` (fundos, cards) | modelos/texturas com orçamento de assets |
| 7. Fixar o build | `project_pin_create` | build jogável congelado para a demo |
| 8. Jogar | `project_play` | validação humana em 2 min |

Exemplo de brief enxuto (o que o agente precisa ouvir):

```text
Construa a tela de OPERAÇÕES do MISSAO IPE (React 19 + TypeScript + Tailwind),
desktop 1440×900 e responsivo até 390×844.
Layout: HUD de 7 recursos à esquerda; evento ao centro; até 4 ações embaixo.
Paleta: fundo #070A12, acento #E8B33A (ipê), alerta #E4572E, ok #3DDC97.
Tipografia: Space Grotesk (títulos), IBM Plex Mono (números).
Sem biblioteca de UI pesada; componentes próprios + Motion para transições de 180 ms.
Estados: evento, escolha, resolução, "por quê". Acessível: contraste 4,5:1, foco visível.
Critério de aceite: qualquer ação mostra consequência em ≤ 300 ms e registra no log.
```

### 3.3 Por que `rebuild -` (sem alvo) é o modo certo aqui

Com `-` não há alvo para copiar: o Craft Anything constrói **a partir da descrição**, sem material de terceiros. Isso resolve o problema de proveniência do hackathon e mantém o projeto 100% original. O estudo de referências (etapa 2) serve para *padrões de interação*, não para clonar tela de ninguém.

---

## 4. As missões específicas (e o que cada uma exige)

O jogo tem **cinco missões + tutorial + sandbox**. Cada uma existe para ensinar um subconjunto do desafio; juntas, cobrem a rubrica inteira (matriz na §5).

| # | Missão | Duração | Mecânica central | O que o jogador aprende | Requisitos do desafio que ela carrega |
|---|---|---|---|---|---|
| **M0** | **Semente** (tutorial) | 5 min | escolher 1 instrumento e 1 órbita com dicas | o loop inteiro em miniatura | acessibilidade, tutorial, feedback |
| **M1** | **Raízes** — Amazônia | 25 min | observar a Terra: órbita, dados, downlink | órbita define cobertura; dados sem descida são dados perdidos | cenário 1, restrições, verificação de massa |
| **M2** | **Gelo** — Lua | 30 min | sobreviver ao eclipse e à radiação | energia é bateria; dose é carreira | órbita, energia, radiação, eventos |
| **M3** | **Travessia** — Marte | 45 min | manter 4 tripulantes vivos e produtivos | latência obriga autonomia; saúde é recurso | tripulação, saúde, colaboração, latência |
| **M4** | **Mensageiro** — asteroide | 40 min | decidir com 5 anos de atraso | autonomia e planejamento de longo prazo | comms, dados, orçamento |
| **M5** | **Sentinela** — L1 | 35 min | alertar a Terra antes do Sol | ciência que vira serviço; dados ao vivo (DONKI) | comms, tempo real, relevância |
| **M∞** | **Sandbox** | livre | experimentar sem restrição | curiosidade e domínio do modelo | sandbox |

### 4.1 O que o Craft Anything acelera em cada missão

| Missão | Referência a estudar (padrão, não cópia) | Cena gerada | Asset gerado |
|---|---|---|---|
| M0 | onboarding de jogos de tabuleiro digitais | tela de 3 passos com destaque único | ícones |
| M1 | painéis de observação da Terra (NASA Worldview, Copernicus Browser) | mapa/globo + faixa de dados | cubo-sat, câmera |
| M2 | visualizações de órbita lunar (NASA Eyes, OpenSpace) | vista de órbita com eclipse animado | lander, radar |
| M3 | consoles de missão tripulada (ISS, Orion) | HUD de tripulação + linha do tempo | habitat, colete |
| M4 | trajetórias de missão de longa duração | mapa de cruzeiro + log de decisões | sonda, perfuratriz |
| M5 | monitores de clima espacial (NOAA SWPC, DONKI) | painel de alerta ao vivo | satélite L1 |

> **Nota jurídica:** "estudar o padrão" = capturar layout e interação em clean room, nunca baixar código, logo, texto ou asset. O material do alvo fica em `capture/` como evidência, não entra no build.

### 4.2 Especificação de um pacote de missão (o contrato)

O motor consome isto; o Craft Anything gera a cena em volta disto. Se o pacote estiver completo, a missão é jogável mesmo com a interface provisória.

```json
{
  "id": "M2",
  "nome": "Gelo",
  "subtitulo": "Seis meses no escuro da Lua",
  "duracao_min": 30,
  "nivel": "engenheiro",
  "brief": "As crateras do polo sul nunca veem o Sol. Se houver gelo, há água.",
  "objetivo": { "id": "A", "criterio": "cobertura >= 70% das crateras", "meta_ciencia": 300 },
  "requisitos": [
    { "id": "cobertura", "obrigatorio": true, "nivel_esperado": 70, "verificacao": "órbita e apontamento" },
    { "id": "profundidade", "obrigatorio": true, "nivel_esperado": 3, "verificacao": "radar de penetração" },
    { "id": "dose", "obrigatorio": true, "nivel_esperado": 150, "verificacao": "blindagem" }
  ],
  "segmento_terrestre": ["dsn34", "moc"],
  "nivel_dados": "L2",
  "orbitos_permitidas": ["nrho"],
  "orcamento_ms": 380,
  "prazo_meses": 24,
  "tripulacao": 0,
  "baralho": ["eclipse_longo", "spe_1972", "spe_1989", "instrumento_degrada", "falha_comms"],
  "turnos": 6,
  "requisitos_cobertos": ["orbita", "energia", "radiacao", "eventos", "pontuacao"],
  "debrief": {
    "cadeia": ["eclipse", "bateria", "instrumento", "ciencia"],
    "alavancas": ["painel maior", "duty cycle menor", "órbita diferente"]
  }
}
```

---

## 5. Matriz de composição (missão × requisito do desafio)

`●` = a missão exercita diretamente · `○` = aparece de forma secundária

| Requisito | M0 | M1 | M2 | M3 | M4 | M5 | Sandbox |
|---|---|---|---|---|---|---|---|
| Acessível a leigos | ● | ● | ○ | ○ | ○ | ○ | ● |
| Individual e equipe até 4 | ● | ● | ● | ● | ● | ● | ● |
| Papéis distintos | ○ | ○ | ● | ● | ● | ○ | ○ |
| Objetivo claro + feedback | ● | ● | ● | ● | ● | ● | ○ |
| Replanejar e simular de novo | ● | ● | ● | ● | ● | ● | ● |
| Pontuação (4 blocos) | ○ | ● | ● | ● | ● | ● | ○ |
| Dificuldades e tipos de missão | ● | ● | ● | ● | ● | ● | ● |
| Objetivo antes da espaçonave | ● | ● | ● | ● | ● | ● | ○ |
| Consequência por decisão | ● | ● | ● | ● | ● | ● | ○ |
| Sem solução única | ○ | ● | ● | ● | ● | ● | ● |
| Restrições realistas | ● | ● | ● | ● | ● | ● | ○ |
| Componentes da nave | ● | ● | ● | ● | ● | ● | ● |
| Instrumentos com atributos | ● | ● | ● | ● | ● | ● | ● |
| Simples × avançados | ● | ○ | ● | ● | ● | ○ | ● |
| Órbitas explicadas e com efeito | ● | ● | ● | ● | ● | ● | ● |
| Lançadores e verificação de massa | ○ | ● | ● | ● | ● | ● | ● |
| Recursos no HUD | ● | ● | ● | ● | ● | ● | ● |
| Negociação entre papéis | ○ | ○ | ● | ● | ● | ○ | ○ |
| Explicações simples / "por quê" | ● | ● | ● | ● | ● | ● | ● |
| Conceitos via jogo | ● | ● | ● | ● | ● | ● | ● |
| Tutoriais e indicadores | ● | ○ | ○ | ● | ○ | ○ | ● |
| Ensinar a causa, não o acerto | ● | ● | ● | ● | ● | ● | ○ |
| **Requisitos mensuráveis antes do projeto** | ○ | ● | ● | ● | ● | ● | ● |
| **Segmento terrestre (estações + MOC)** | ○ | ● | ● | ● | ● | ● | ○ |
| **Segmento de usuários (prontidão de dados)** | ○ | ● | ● | ● | ● | ● | ○ |
| **CML 1–4 e trade study** | ● | ● | ● | ● | ● | ● | ○ |
| **Sequência de lançamento** | ● | ● | ● | ● | ● | ● | ○ |
| **Missão análoga real no relatório** | ● | ● | ● | ● | ● | ● | ○ |
| Múltiplos cenários | | ● | ● | ● | ● | ● | ● |
| Eventos aleatórios | ○ | ● | ● | ● | ● | ● | ○ |
| Visualização interativa | ● | ● | ● | ● | ● | ● | ● |
| Painel de consumo | ● | ● | ● | ● | ● | ● | ● |
| Ranking | | ○ | ○ | ● | ○ | ○ | |
| Relatório final | ● | ● | ● | ● | ● | ● | ○ |
| Salvar / compartilhar / comparar | ● | ● | ● | ● | ● | ● | ● |
| Cooperativo até 4 | ○ | ● | ● | ● | ● | ● | ● |
| Competitivo (mesma semente) | | ● | ● | ● | ● | ● | |
| Sandbox | | | | | | | ● |
| Análise pós-missão do porquê | ● | ● | ● | ● | ● | ● | ○ |

**Leitura da matriz:** nenhuma missão precisa cobrir tudo — **o conjunto cobre**. As seis linhas em negrito são as que o enunciado completo acrescentou (requisitos, quatro segmentos, CML, lançamento, missão análoga) e que a versão 1.1 não cobria.

 É isso que o desafio pede quando fala em "múltiplos cenários com objetivos diferentes": a composição é a resposta, não o cenário único.

---

## 6. O que **não** delegar ao Craft Anything

| Componente | Por quê |
|---|---|
| **Motor de regras** (`engine/`: massa, potência, dados, dose, pontuação) | precisa ser determinístico, auditável e testável; código gerado não é fonte da verdade |
| **Balanceamento** (`dados_missao_ipe.json`) | é decisão de design, não de geração |
| **Texto científico e âncoras** | cada número tem fonte; um agente não pode "inventar citação" |
| **Narrativa e tom** (o ipê, o "por quê") | é a assinatura do projeto |
| **Acessibilidade** | exige revisão humana e teste com leitor de tela |

Regra prática: **gera-se a moldura, não a física.** A cena, o CSS, as transições e os assets podem ser gerados; a regra e o número, não.

---

## 7. Riscos e governança

| Risco | Probabilidade | Mitigação |
|---|---|---|
| Alvo estudado tem licença restritiva | média | só repositórios/demos abertos; `capture/` como evidência, nunca como asset |
| Cópia involuntária de layout/texto | média | modo **clean room** sempre; `rebuild -` (sem alvo) para a cena |
| Projeto gerado não compila no nosso stack | média | brief fixa a stack (React 19 + TS + Tailwind); `build_command_run` no CI |
| Dependência de agente pago (Claude Code) | alta | o pipeline não é requisito de runtime; se falhar, o motor e o JSON seguem válidos |
| Alpha com partes não verificadas | alta | usar só o que está em "Works today"; não depender de checks de comportamento de jogo |
| Tempo de setup no hackathon | média | instalar e rodar `doctor` **antes** do evento; ter fallback manual |
| Proveniência dos assets gerados por IA | baixa | fal.ai com termo comercial; registrar prompts e licença em `ATTRIBUTION.md` |

---

## 8. Cronograma de 48 h com a fábrica

| Bloco | Horas | Trabalho | Craft Anything? |
|---|---|---|---|
| 0 | 2 h | instalar, `doctor`, `mcp`, escrever os 6 briefs | setup |
| 1 | 4 h | motor determinístico + JSON das missões (sem UI) | não |
| 2 | 6 h | M0 + M1: cena, HUD, verificação de massa | sim (cena) |
| 3 | 6 h | M3: tripulação, dose, latência (a missão que ganha o pitch) | sim (cena + assets) |
| 4 | 4 h | M2, M4, M5 em paralelo com o mesmo template | sim |
| 5 | 3 h | checks visuais, pins, vídeo de demo | sim |
| 6 | 3 h | relatório, pitch, ensaio | não |

**Regra de ouro:** se o tempo apertar, o corte é em missões (fica M0 + M1 + M3), nunca no relatório causal — é ele que a banca avalia.

---

## 9. Checklist de aceitação da fábrica

- [ ] `craft-anything-cli doctor` verde na máquina da demo
- [ ] `mcp` conectado ao agente do time
- [ ] 6 briefs escritos em `missoes/briefs/Mn.md`
- [ ] cada missão tem `pacote.json` válido contra o schema do motor
- [ ] cada build tem `checks/` com 3 larguras e o roteiro de cliques
- [ ] nenhum asset de terceiro no build final (`ATTRIBUTION.md` limpo)
- [ ] build fixado (`pin`) da demo, jogável offline
- [ ] 2 minutos de jogo sem travar, em 1440×900 e 390×844

---

## 10. Veredito

**Vale usar?** Sim, como **acelerador de produção**, com três condições: (1) só em software nosso ou aberto; (2) clean room para referências; (3) o motor e os números ficam fora da geração.

**O que ele resolve do desafio:** a produção das **missões específicas** (M0–M5) com qualidade visual comparável e verificável, em tempo de hackathon — e a **evidência de checagem** que a banca valoriza.

**O que ele não resolve:** a ciência, o balanceamento, a narrativa e a acessibilidade. Essas quatro continuam sendo trabalho nosso — e são, não por acaso, o que faz o MISSAO IPE ganhar.
