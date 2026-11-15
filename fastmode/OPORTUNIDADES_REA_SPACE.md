# Oportunidades — REA × space-planet
## O que vale puxar para o MISSAO IPE e o que fica no backlog

**Data:** 15/11/2026 · **contexto:** FASTMODE (MVP jogável em [`app/`](app/))

---

## 1. O que a referência space-planet entrega — e o que não entrega

A página [motionsites.ai/?prompt=space-planet](https://motionsites.ai/?prompt=space-planet) é uma **vitrine de prompt** (galeria paga): o HTML público traz a taxonomia (Hero, 3D, Interactive, Dashboard), não o prompt em si. Então não copiamos texto nem código — extraímos **princípios**:

| Princípio da vitrine | Tradução para o MISSAO IPE | Status |
|---|---|---|
| Um corpo celeste como herói, não como fundo | horizonte de planeta com rim light próprio por destino | ✅ feito |
| Profundidade em camadas | estrelas em 3 planos + grão + scanline | ✅ feito |
| Órbita como gramática visual | anéis/anéis tracejados na abertura | ✅ feito |
| Movimento medido | entradas 550–700 ms, sem fade que esconde conteúdo | ✅ feito |
| Cor como identidade de cenário | paleta por missão: Terra (âmbar), Lua (gelo), Marte (óxido) | ✅ feito |
| Interface que respira com o dado | barras que preenchem, contagem, pulso de alerta | ✅ feito |
| Descida/transição cinematográfica | sequência de lançamento de 5 s | ✅ feito |
| Shader de nebulosa em tempo real | nebulosa procedural em WebGL | ⏳ backlog |
| Scroll-driven descent (hero → órbita → superfície) | LP de apresentação, não o jogo | ⏳ backlog |
| Nave 3D real (R3F + modelo NASA) | substituir cartões por modelo girando | ⏳ backlog |

---

## 2. O que o REA abre (e o que não abre)

[REA](https://github.com/morluto/rea) é um **MCP de engenharia reversa** — inspeciona binários, apps JS/Electron, .NET, Android, sites e WASM, com evidência. Ele não é runtime e não deve ser embarcado.

### 2.1 Usos legítimos para o projeto

| Uso | Alvo | O que sai | Como entra |
|---|---|---|---|
| **Padrões de HUD** | apps de referência abertos (NASA Eyes, OpenSpace Web, jogos da CSA) | estrutura de painéis, estados, atalhos, transições | checklist de redesign do HUD |
| **Auditoria do nosso bundle** | a própria build | módulos mortos, peso, dependências | reduzir o pacote de 12 MB |
| **Prova de comportamento** | demo de concorrente | o que acontece no clique X, em que ordem | evidência para o pitch ("o padrão é este") |
| **Extração de catálogo** | jogos que possuímos (Unity/Unreal) | nomes de peças, faixas de massa/potência | calibrar `dados_missao_ipe.json` |
| **Pós-morte** | crash de WebGL em demo | pilha, contexto, driver | estabilidade da demo |

### 2.2 Limites (inegociáveis)

- Só software **nosso** ou **explicitamente permitido**; nada de burlar DRM/login.
- **Clean room** para referências visuais: capturar padrão, nunca asset, texto ou logo.
- O que é gerado/extraído não vira dependência do jogo.
- Toda conclusão do REA vem com evidência e limitação — usar isso no relatório, não como slogan.

### 2.3 Comandos de partida

```bash
npx rea-agents setup                       # registra o MCP no agente
rea analyze-javascript-application ./dist --json   # bundle: módulos, rotas, peso
rea --help                                  # catálogo de alvos
```

---

## 3. Backlog priorizado (impacto × esforço)

| # | Oportunidade | Impacto | Esforço | Status |
|---|---|---|---|---|
| 1 | **Trade study A/B** com Δ colorido e restauração | alto (CML 2) | baixo | ✅ FASTMODE |
| 2 | **M2 Gelo** (radar, dose, eclipse lunar) | alto (4ª missão) | baixo | ✅ FASTMODE |
| 3 | **Paleta por destino** (Terra/Lua/Marte) | alto (imersão) | baixo | ✅ FASTMODE |
| 4 | **Recorde local por missão** | médio (rejogada) | baixo | ✅ FASTMODE |
| 5 | **Exportar relatório em PDF** | alto (banca) | baixo | ✅ FASTMODE |
| 6 | Nave 3D em R3F (modelo NASA decimado) | alto | médio | backlog |
| 7 | Shader de nebulosa + poeira estelar | médio | médio | backlog |
| 8 | Áudio adaptativo (camadas por fase) | médio | médio | backlog |
| 9 | Ranking por semente + código de turma | alto (competitivo) | médio | backlog |
| 10 | M4 Mensageiro e M5 Sentinela | alto (cobertura) | médio | backlog |
| 11 | Multiplayer em rede (até 4) | médio | alto | backlog |
| 12 | i18n EN/ES | médio (alcance) | baixo | backlog |

---

## 4. O que o FASTMODE prova

- **Missão específica** pode ser um pacote de dados: M2 entrou sem tocar em uma linha do motor de UI (só dados + uma métrica `profundidade`).
- **Trade study** transforma o CML 2 em tela: A vs B com Δ de massa, custo, ciência, integridade e requisitos.
- **Identidade visual** por destino custa 30 linhas de CSS e muda a sensação de "mesmo jogo" para "outro lugar".
- **Exportação** resolve a pergunta da banca ("como vocês entregam evidência?") sem servidor.

O que ainda **não** está provado: rede, 3D real e acessibilidade completa com leitor de tela. São os três itens que o próximo ciclo deve atacar.
