# 34 — Continuidade para dois devs: escolhas visíveis na nave

**R15 · beta 0.6.0-beta.1 · 14/11/2026.** Esta rodada conecta as escolhas das três missões à montagem da nave. O [recibo de publicação](https://github.com/oalexandrebelo/PROJETO-IPE/blob/main/PUBLICADO.md) identifica a implantação verificada. Este guia complementa o [contrato das missões R14](31-TRES-MISSOES-CIENTIFICAS-R14.md), o [guia didático completo](32-GUIA-DIDATICO-MISSOES-3D.md) e as [oportunidades NASA Science](33-OPORTUNIDADES-NASA-SCIENCE.md).

## 1. O comportamento que o jogador recebe

Ao escolher uma câmera ou um espectrômetro, a nave didática muda a carga instalada. No Cerrado, a escolha é entre transportar bandas e calcular o índice a bordo: aparecem placas de processamento diferentes, sem apresentar uma câmera MODIS como parte do CubeSat. Os arquivos do Cerrado continuam históricos.

Ao mudar energia, a superfície dos painéis e a representação do conjunto de bateria acompanham as capacidades do catálogo do caso. A proporção visual não especifica área real nem quantidade certificada de células. Durante a execução, iluminação e carga da bateria vêm do estado registrado; a prévia de projeto não inventa nível de carga.

Ao trocar o rádio do Cerrado, sua representação e as leituras de taxa e potência mudam. Nas expedições, a escolha de comunicação muda as janelas de contato: a antena e a taxa permanecem iguais. Em operação, o enlace só aparece ativo quando o estado informa transmissão, e não durante toda janela disponível.

O jogador pode inspecionar **Nave completa, Carga científica, Energia e Comunicação**, separar/reunir componentes, girar a nave e restaurar a montagem. A seleção da peça em 3D tem controles equivalentes por teclado fora do canvas. Cada inspeção explica função, valores, contribuição ao custo/massa e consequência da escolha. A alternativa SVG usa a mesma configuração.

## 2. Contrato de dados: uma escolha, duas representações

| Camada | Responsabilidade | Arquivo no beta |
| --- | --- | --- |
| Catálogo e motor do Cerrado | Regras, unidades, agendas, resultado e conservação | `src/core/catalog.ts`, `engine.ts`, `contracts.ts` |
| Domínio das expedições | Configuração, pré-voo, agendas e cálculo exato | `src/lab/scientific-expeditions.ts` |
| Apresentação da nave | Traduzir a configuração em formas, capacidades e explicações, sem executar a missão | `src/lab/spacecraft-presentation.ts` |
| Projeção temporal | Último estado conhecido no instante escolhido; nenhuma leitura futura | `src/lab/mission-visual-state.ts` e `getExpeditionVisualState` |
| Cena e inspeção | Seleção, vista separada, texto, opção 2D e controles | `src/ui/Scene.tsx`, `SpacecraftInspector.tsx` |
| Desenho 3D | Peças da nave fictícia, destaques e resposta ao estado | `src/ui/ConfiguredSpacecraft.tsx`, `OrbitalScene.tsx` |
| Fontes NASA | Modelos locais, créditos, hashes e decoder | `public/models/nasa/manifest.json` e [documento 30](30-ATIVOS-NASA-IMPLEMENTADOS.md) |

Os caminhos da tabela são relativos a `experiments/mission-design-lab/`.

`getSpacecraftPresentation` recebe uma união discriminada: `{world:'earth', config, scenarioId}` ou `{world:'bennu'|'telescope', expeditionConfig}`. O retorno inclui `payload`, `energy`, `communications`, `storage`, `totals`, identidade da configuração e versão da fonte. Não contém resultado de missão. Valores vêm dos catálogos e do pré-voo existentes.

`getExpeditionSchedule` expõe a mesma agenda usada pelo motor, com entradas validadas e retorno imutável. A agenda planejada pode conter uma janela posterior ao fim da vida operacional curta; a interface explica isso. Não confundir a agenda com tempo efetivamente transmitido.

### A regra que evita uma comparação enganosa

- No projeto, passar a configuração em edição.
- Na operação, passar **`result.config`** e o estado temporal daquele resultado.
- Na comparação A/B, passar **`comparison.result.config`**, nunca o rascunho atual.
- Uma mudança no projeto não deve redesenhar retroativamente a tentativa executada.
- Ausência de amostras significa indisponibilidade de leituras, e não energia zero, memória vazia ou transmissão encerrada.

A cena não chama o motor para produzir uma prévia de sucesso. Câmera visual, separação dos componentes e cliques não mudam as regras nem o relógio da missão.

## 3. Continuidade do Dev A — domínio, dados e confiança

1. Manter os valores canônicos nos catálogos. Não duplicar números em componentes 3D, legendas ou material didático.
2. Para cada opção nova, definir unidade, limite, custo, massa, compatibilidade científica e efeito no resultado antes de desenhar a peça.
3. Atualizar o modelo de apresentação e testar todas as opções suportadas. Preservar a distinção entre capacidade nominal e leitura durante a operação.
4. Tratar novas fontes NASA como dados com origem, época, qualidade e unidades. Um modelo 3D não substitui esses contratos.
5. Versionar mudanças de regra e revisar compatibilidade de projetos/relatórios; não alterar silenciosamente o significado de um replay antigo.

**Aceite do Dev A:** conservação de energia e bits continua passando; resultados conhecidos permanecem iguais quando a mudança é somente visual; configuração executada preservada; nenhuma observação ausente vira zero; cenário e duração não são descartados na projeção.

## 4. Continuidade do Dev B — experiência, 3D e aprendizagem

1. Conferir os três casos em projeto, operação e comparação; a mesma peça deve ser reconhecível nas três vistas.
2. Manter uma diferença perceptível por escolha, explicando quando a diferença é de agenda, e não de hardware.
3. Preservar leitura sem WebGL, controles por teclado e comportamento com movimento reduzido. Informação essencial deve estar fora do canvas.
4. Medir modelos e cenas no equipamento de apresentação antes de prometer FPS. O agrupamento do Webb reduz objetos, mas ainda há custo de geometria e carregamento.
5. Validar o texto com pessoas iniciantes: pedir que expliquem W versus Wh, capacidade versus entrega e instrumento versus objetivo.

**Aceite do Dev B:** peças não cortadas no desktop e no celular; seleção acessível e foco visível; estado de transmissão coerente; nenhum carregamento quebrado silencioso; alternativa 2D equivalente; cores não são o único canal de informação.

## 5. Como trabalhar em paralelo

Dev A é responsável pelo contrato em `src/lab/` e pelos testes de domínio; Dev B consome esse contrato em `src/ui/` e mantém as jornadas. Combinem nomes e unidades do contrato antes de alterar os consumidores. Um ajuste de dimensão, iluminação ou enquadramento não justifica alterar o motor.

Cada revisão deve entregar: um exemplo antes/depois, teste ligado ao risco real, fonte quando houver dado externo e evidência visual do comportamento. Não usar screenshot como prova da conta e não usar teste DOM como prova de GPU ou aprendizagem.

## 6. Comandos e publicação

Na raiz do repositório:

```bash
npm --prefix experiments/mission-design-lab ci --ignore-scripts --no-audit --no-fund
npm --prefix experiments/mission-design-lab run verify
npm run build:release
npm run test:context
npm run test:beta
npm run start:beta
```

`verify` cobre domínio, interface DOM, TypeScript e build. `build:release` monta a lista pública de arquivos em `site/`. O GitHub conectado à Vercel compila `main`; verificar commit, estado `READY`, domínio, bytes e políticas servidas após cada publicação. Os recibos anteriores permanecem históricos.

## 7. O que permanece fora desta entrega

As oportunidades NASA Science são pesquisa priorizada, com estado explícito por recurso. Não há nova API ao vivo, propagação orbital, GMAT, operação real de antena ou cálculo de transferência. A nave procedural é fictícia; Bennu e Webb contextualizam o caso e não são transformados em hardware validado do jogador.

Cooperação continua local, no mesmo dispositivo. Bennu e Telescópio mantêm dados sintéticos. A capacidade de aprender com o jogo exige avaliação com participantes; não decorre automaticamente de mais detalhe 3D. Prioridades seguintes: sessões didáticas, acessibilidade assistiva, desempenho em dispositivo físico e integração de dados escolhida por valor científico.

## 8. Evidência desta revisão

Na R15 passaram 140 testes de domínio, 26 de interface DOM, 24 de contexto e 17 de distribuição/HTTP, além de TypeScript e compilação. No navegador foram conferidas as peças dos três casos, escolha incompatível, inspeção direta, separação pelo teclado, alternativa 2D e viewport de 390 px. O ensaio Bennu viável terminou 6/6. O [recibo local R15](https://github.com/oalexandrebelo/PROJETO-IPE/blob/main/evidence/revision-r15.json) delimita essas verificações; a publicação é comprovada separadamente em [PUBLICADO.md](https://github.com/oalexandrebelo/PROJETO-IPE/blob/main/PUBLICADO.md).

## 9. Campanha paralela preservada

Durante a publicação, foram incorporados os commits de uma frente paralela até `29fcc46`, que acrescentam `experiments/four-level-campaign/` e a rota `/campanha/index.html`. O laboratório R15 continua em `/lab/index.html`. A campanha tem seu próprio catálogo, progresso, testes, documentação e build; a montagem configurável desta revisão pertence ao laboratório de três missões. Não compartilhar persistência entre as experiências sem comparar seus contratos. O build de publicação agora compila ambas e preserva os redirecionamentos, o mapa, o pitch e a pesquisa da campanha. Consulte [o handoff dessa frente](32-CAMPANHA-QUATRO-NIVEIS.md).

Na integração foram executados também os 120 testes de domínio e 14 de interface da campanha, com compilação aprovada. A checagem compartilhada de distribuição inclui os dois aplicativos. Os resultados da campanha não são somados à cobertura do laboratório como se fossem a mesma base.

## 10. Armazenamento compartilhado: limite preexistente

Rotas diferentes não isolam armazenamento no mesmo domínio. Laboratório e campanha usam o mesmo IndexedDB `mission-ipe-research-v1`, versão 1, e o mesmo diário `mission-ipe:learning:v1`. Os contratos, catálogo, motor, hash científico, validação e replay foram comparados e são idênticos; a integração não introduziu incompatibilidade de recibos.

O caderno reúne execuções das duas experiências sem identificação de origem. Há somente um rascunho `drafts/active`: salvar em uma experiência substitui o rascunho compartilhado; o controle de revisão recusa uma gravação desatualizada. O diário usa uma cópia em memória sem sincronização entre abas: **edições simultâneas podem sobrescrever entradas recentes**. Para a demonstração, use uma experiência por vez e exporte o registro antes de alternar. A progressão da campanha e os projetos Bennu/Telescópio têm chaves próprias.

Dev A deve planejar migração e identificação de origem antes de isolar os bancos; renomear a chave diretamente esconderia o histórico existente. Dev B deve explicar onde o projeto foi salvo e testar alternância e concorrência. Esta limitação antecede a R15 e permanece registrada, sem prometer isolamento por rota.
