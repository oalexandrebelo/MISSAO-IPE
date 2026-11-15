# Acervo ASTRAL VITAL: o que aproveitar na MISSÃO IPÊ

Auditoria de 15/11/2026 do pacote local `ASTRAL VITAL/MISSAO-IPE 2`, fornecido pela equipe. Referência do repositório: `6c3eeee2eec94a2c7aed1ac551ebce7d7b865463`. Este documento registra oportunidades e limites; não anuncia novos componentes implementados.

## O que existe na pasta

São **40 arquivos, totalizando 2.890.710 bytes**: 12 Markdown, 9 PNG, 4 JavaScript, 4 JSON, 5 CSV, 2 Python, 2 HTML, 1 CSS e um manifesto. As 39 entradas do manifesto conferem. Não há modelos GLB, glTF, OBJ ou FBX, texturas dedicadas, vídeos, áudio gravado, fontes ou SVGs avulsos.

**22 arquivos já são idênticos aos do repositório oficial**, comparados por SHA-256. Isso inclui todo o aplicativo HTML/CSS/JavaScript, seis documentos e arquivos de design e oito das nove capturas. O pacote documenta a contribuição FASTMODE da PR #2, incorporada no merge `6c8df63`. A cópia canônica é [fastmode/](https://github.com/oalexandrebelo/MISSAO-IPE/tree/main/fastmode).

A única imagem sem equivalente idêntico é `missao-ipe/app/docs/pitch-demo.png` (302.859 bytes; 1440 × 757): uma captura da apresentação mostrando bancada e comparação A/B. É uma referência de composição, não uma peça 3D ou evidência de uso por jogadores. Os outros arquivos diferentes são dossiê, documentação de empacotamento, dados OSDR/DONKI, simulações e scripts. As afirmações desses materiais não foram validadas externamente nesta auditoria.

O FASTMODE está preservado no Git, mas não integra a distribuição pública curada do jogo científico. Não copiar a pasta inteira, criar outro motor ou substituir o pitch atual por essa captura.

## Cinco oportunidades priorizadas

| Ordem | Recurso aproveitável | Aplicação proposta | Resultado esperado |
| --- | --- | --- | --- |
| 1 | Bancada por categorias e painel persistente de recursos | Reaproveitar a hierarquia visual: escolha à esquerda, nave no centro, consequências à direita. Exibir valor anterior, novo valor e explicação curta junto ao sistema selecionado. | O iniciante percebe que um instrumento exige massa, energia e capacidade de dados antes de executar a missão. |
| 2 | Comparação A/B e relatório causal | Usar a clareza das colunas A, B e diferença sobre os resultados do motor científico atual. Explicar quais parâmetros mudaram e permitir rever o evento correspondente no 3D. | O jogador justifica uma melhoria sem confundir mais dados produzidos com mais dados recebidos e válidos. |
| 3 | Bancada conectada aos modelos NASA já presentes | Manter a nave didática configurável e os modelos históricos como contexto. Destacar instrumento, bateria, painéis e comunicação com as propriedades atuais da cena. | A peça visível, o indicador e a explicação descrevem a mesma decisão, sem fingir que o modelo histórico foi redesenhado. |
| 4 | Atmosfera visual e feedback curto | Avaliar campo de estrelas, horizonte e bipes existentes. Reutilizar somente onde ajudam a reconhecer seleção, evento ou transmissão. Oferecer silêncio e respeitar movimento reduzido. | A imersão orienta o olhar e não compete com leitura, teclado ou tecnologia assistiva. |
| 5 | Curadoria para ISS, Lua e Marte | Usar as referências a ISS, Orion, Curiosity e terrenos como lista de pesquisa da expansão aprovada. Selecionar e verificar cada arquivo antes de importar. | As futuras missões terão assets ligados a uma pergunta científica e a uma decisão, com procedência e custo de carregamento conhecidos. |

Referências visuais já versionadas: [bancada](https://github.com/oalexandrebelo/MISSAO-IPE/blob/main/fastmode/docs/bancada.png), [operações](https://github.com/oalexandrebelo/MISSAO-IPE/blob/main/fastmode/docs/operacoes.png) e [comparação A/B](https://github.com/oalexandrebelo/MISSAO-IPE/blob/main/fastmode/docs/trade-study-full.png). Não é necessário duplicar esses arquivos para consultá-los.

## Aplicação nas três missões científicas

| Missão | Decisão que merece destaque | Consequência a mostrar na cena e no painel | Aprendizado a pedir ao jogador |
| --- | --- | --- | --- |
| Cerrado · Terra/MODIS | Processar bandas ou índice e dimensionar energia, memória e transmissão | Destacar processador/instrumento, consumo e pacote entregue. Mostrar quando o segundo período necessário à comparação ainda não chegou. | “Por que preciso de dois registros válidos para comparar a vegetação? Qual recurso impediu a entrega?” Ausência de registro não significa ausência de vegetação. |
| Bennu · OSIRIS-REx | Escolher o instrumento exigido pelo levantamento visual e ampliar o serviço de solo | Mostrar a câmera didática e a linha do tempo dos contatos. Na comparação de solo, conservar a mesma antena e taxa; evidenciar mudanças de início, duração e custo. | “Que dimensões de rochas consigo comparar com os registros recebidos?” Tamanho não prova composição; o desenho do asteroide não localiza esses seis objetos. |
| Webb · WASP-39 b | Compatibilizar o instrumento com o espectro e sustentar sua operação | Destacar o espectrômetro didático, o recurso limitante e os bins recebidos no instante do replay. Manter valores e incertezas publicados. | “Por que a câmera genérica do exercício não responde à pergunta? O que os pontos recebidos permitem descrever?” Seis bins não reproduzem a significância da descoberta de CO₂ nem indicam vida. |

O vínculo entre escolhas e inspeção 3D já existe no laboratório. A oportunidade é tornar a apresentação mais legível, preservando esse vínculo e as regras atuais. As novas interfaces devem consumir o estado existente; não recalcular ciência por conta própria. Veja [dados reais e limites](45-DADOS-REAIS-BENNU-WEBB-R18.md) e [percurso do iniciante](51-QA-INICIANTE-E-HANDOFF-R20.md).

## Modelos reais já disponíveis

O [manifesto dos modelos NASA](https://github.com/oalexandrebelo/MISSAO-IPE/blob/main/experiments/mission-design-lab/public/models/nasa/manifest.json) registra origem e hashes. A inspeção local confirmou GLB versão 2, malhas e ausência de arquivos externos referenciados.

| Modelo | Tamanho | Uso e limite |
| --- | ---: | --- |
| CubeSat | 206.108 bytes | Referência visual genérica de pequenos satélites. Não representa o Terra/MODIS nem uma nave real chamada Ipê. |
| Bennu | 329.596 bytes | Contexto do asteroide; opção leve. Não há registro cartográfico validado das seis rochas da tabela sobre a malha. |
| Antena DSN | 2.216.584 bytes | Contexto do segmento terrestre. Exibir um contato do exercício não implica disponibilidade real de antena. |
| Webb | 4.710.016 bytes | Contexto do observatório; usa Draco e tem 1.657 primitivas. Medir desempenho antes de ampliar efeitos ou duplicar instâncias. |

Nenhum desses arquivos traz animações prontas. Um modelo visual da NASA não valida automaticamente números, física ou a história contada na interface. A biblioteca já tem esses modelos; a pasta ASTRAL não acrescenta versões deles.

## O que não importar como fato científico

`fastmode/design/dados_missao_ipe.json` declara valores ajustados para uma sessão de 45 minutos e custos na escala do jogo. Preços e massas dos itens não têm fonte individual. Exemplos como Electron a 7,5 M$, CubeSat 6U de 12 kg/2 M$ ou bateria de 30 kg/3 M$ não devem aparecer como especificações NASA verificadas.

No FASTMODE, `pick()` atualiza `S.build`; `renderProjeto()` recalcula indicadores e cartões HTML. Não existe vínculo entre a escolha e uma malha de nave. `fx.js` desenha estrelas e lançamento em Canvas2D; o horizonte é CSS; os bipes são sintetizados com Web Audio. A aparência espacial não significa simulação 3D ou astrodinâmica real.

O acervo não contém LICENSE, NOTICE ou ATTRIBUTION. As licenças citadas na curadoria não substituem a verificação do arquivo externo efetivamente escolhido. Não baixar assets em lote nem anunciar domínio público para todo material hospedado pela NASA. A abertura sugerida de um “ipê florescendo” também não deve ser incorporada: IPÊ identifica a equipe; as histórias das missões se apoiam em fontes científicas.

## Handoff para os dois desenvolvedores

**Dev A — ciência e simulação:** usar os contratos de `experiments/mission-design-lab/src/lab/` como fonte dos indicadores e das diferenças A/B. Preservar IDs, unidades, incertezas e proveniência. Expor o recurso que limita a tentativa sem substituir os dados históricos pelos números do FASTMODE. Validar os resultados com o motor determinístico já existente.

**Dev B — interface e 3D:** aproveitar a organização visual da bancada e do relatório, mantendo as cenas de `experiments/mission-design-lab/src/ui/` e o foco por `inspectSubsystem`. Seleção muda o foco; o estado da simulação determina se há consumo, processamento ou transmissão. Não usar uma cor ou um efeito como única explicação. Rever teclado, celular, silêncio e movimento reduzido.

Mapa de integração, com caminhos relativos a `experiments/mission-design-lab/src/`:

| Ponto existente | Arquivo e função | O que preservar |
| --- | --- | --- |
| Escolhas no hangar | `ui/Workbench.tsx`, `App.tsx` → `chooseComponent()`; `ui/ScientificExpedition.tsx` → `choose()` | Atualizar o projeto e invalidar o resultado anterior quando necessário. |
| Apresentação da nave | `lab/spacecraft-presentation.ts` → `getSpacecraftPresentation()`; `ui/Scene.tsx`; `ui/ConfiguredSpacecraft.tsx` | Uma tradução comum da configuração para peças e métricas; a cena não executa outro motor. |
| A/B Cerrado | `ui/CompareDialog.tsx`; `ui/CerradoLearning.tsx` → `compareCerrado()` | Comparar configurações executadas e estados no mesmo relógio, não o projeto atualmente em edição. |
| A/B Bennu e Webb | `ui/ExpeditionLearning.tsx` → `explainExpeditionComparison()`; `lab/mission-curriculum.ts` → `runLearningExperiment()` | Explicar atributos alterados e a primeira diferença observável; uma opção pode mudar vários atributos. |
| Métricas e relatório | `metrics/mission-score.ts` → `scoreMissionResult()`; `metrics/player-metrics.ts` → `summarizeAttempt()` | Usar a pontuação e os diagnósticos existentes; não importar a rubrica do FASTMODE. |

**Aceite conjunto:** percorrer as três missões; trocar instrumento, energia e solo; executar A e B; apontar a consequência no 3D; explicar por que um resultado mudou. Rebobinar não revela registros futuros. Alterar recursos não muda o valor científico observado. Ampliar contatos não troca a antena silenciosamente. Um iniciante deve conseguir relatar a causa da falha e justificar a próxima tentativa; isso requer teste com pessoas, ainda não produzido por esta auditoria.

Começar pela bancada e pela comparação, com uma missão de cada vez. ISS, Lua e Marte continuam em preparação, conforme o [catálogo e plano de integração](58-CATALOGO-NASA-E-INTEGRACAO-BRUNO-R22.md). Este levantamento não muda o motor, não importa o pacote e não instala dependências.
