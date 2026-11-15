# PROJETO IPÊ — Ciência que chega

Jogo educativo de engenharia de missões espaciais com três casos científicos: vegetação do Cerrado, levantamento de Bennu e observação infravermelha. Comece pela pergunta, defina requisitos, projete a nave, verifique recursos, opere a missão e investigue o que chegou aos cientistas.

**Beta atual: 0.7.0-beta.1 · edição R16 · 15/11/2026.**

**Comece aqui:** [guia didático completo](docs/32-GUIA-DIDATICO-MISSOES-3D.md) · [handoff atual dos dois devs](docs/38-HANDOFF-R16.md) · [oito oportunidades NASA Science](docs/33-OPORTUNIDADES-NASA-SCIENCE.md).

**Dois desenvolvedores começando agora:** leia primeiro o [guia de continuidade](docs/25-HANDOFF-DOIS-DEVS.md), com a divisão sugerida de responsabilidades, mapa do código, prioridades e critérios de aceite. O [estudo completo](https://projeto-ipe.vercel.app/context/research-library.html) reúne o contexto atual e o acervo histórico, com busca e índice.

## Descobrir antes de otimizar

A R16 torna o propósito explícito e acrescenta três experimentos guiados, ligados ao mesmo motor e à nave 3D. O jogador faz uma previsão, executa A/B mudando um único fator, inspeciona ambos no mesmo segundo e decide se quer copiar aquelas escolhas para seu projeto. A aplicação não executa nem salva uma tentativa automaticamente.

| Missão | Pergunta e aprendizagem | Experimento controlado |
| --- | --- | --- |
| Cerrado | Como comparar vegetação sem confundir ausência de dados com mudança? Potência, energia e limites do NDVI. | BANDAS → ÍNDICE: menos dados pode exigir um pico de potência que a bateria não suporta. |
| Bennu | Como transformar observações da superfície em informação disponível aos cientistas? Produção, fila e recepção. | Contatos de 120 → 500 s: mais tempo de transmissão com a mesma antena e taxa. |
| Telescópio | Que instrumento responde à pergunta sobre a luz? Imagem, espectro e evidência válida. | Câmera → espectrômetro: receber seis arquivos não garante seis medidas cientificamente compatíveis. |

Após cada missão, uma interpretação orientada retoma a pergunta e preserva lacunas. Não há alegação de aprendizagem comprovada por concluir o exercício. Leia a [proposta pedagógica e análise das tecnologias](docs/37-PROPOSTA-PEDAGOGICA-E-TECNOLOGIAS-R16.md), a [revisão da PR #1](docs/35-REVISAO-PRS-E-DIRECAO-R16.md) o [handoff R16](docs/38-HANDOFF-R16.md) e a [análise dos assets da PR](docs/39-ATIVOS-DA-PR-E-APLICACOES.md).

O [Planet Jumping](https://projeto-ipe.vercel.app/planet-jumping.html) é uma experiência visual independente em um único HTML, com as mídias exatas da referência fornecida. Demonstra a transição Marte → Terra → Vênus; não é simulação orbital nem uma quarta missão. Depende do CDN externo. [Detalhes, créditos e limitações](docs/36-PORTAL-PLANET-JUMPING.md).

## Campanha didática de quatro níveis

Além das três missões da edição R14, a sequência **Primeiro sinal → Memória em disputa → Janela estreita → Ciência que chega** está disponível em [Jogar a campanha](https://projeto-ipe.vercel.app/campanha/index.html). Ela mantém o caso do Cerrado e acrescenta objetivos de memória, preservação das bandas e custo. [Mapa e pitch](https://projeto-ipe.vercel.app/campanha/apresentacao/index.html) · [PRD, PRT, diagramas, schema e handoff](https://projeto-ipe.vercel.app/campanha/research/index.html).

O código e os documentos completos dessa experiência ficam em [`experiments/four-level-campaign/`](experiments/four-level-campaign/). O seu contrato e os testes são independentes das expedições Bennu e Telescópio. A integração serve a campanha em uma rota própria e preserva o laboratório de três missões, agora na R16. Veja [o registro da campanha](docs/32-CAMPANHA-QUATRO-NIVEIS.md).

## Explorar

- [Portal interativo: contexto, etapas e fontes NASA](https://projeto-ipe.vercel.app/)
- [Jogar o beta atual](https://projeto-ipe.vercel.app/lab/index.html)
- [Contexto e cronograma detalhados](https://projeto-ipe.vercel.app/context/index.html)
- [Biblioteca integral](https://projeto-ipe.vercel.app/context/research-library.html)
- [Apresentação e pitch](https://projeto-ipe.vercel.app/presentation/Missao_Ipe_Apresentacao.html)
- [Documentação pública](https://projeto-ipe.vercel.app/docs/index.html)
- [Jogo clássico preservado](https://projeto-ipe.vercel.app/game/index.html)

O recibo de publicação está em [PUBLICADO.md](PUBLICADO.md). Metas ou evidências históricas não comprovam uma nova publicação por si só.

## O que existe

O Cerrado preserva seu motor determinístico, 64 configurações por cenário, dados históricos MOD13Q1.061, replay verificável e busca de alternativas. Bennu e Telescópio acrescentam seis decisões de projeto: lançador, perfil orbital, instrumento, energia, contatos e vida operacional. Seus registros são sintéticos e claramente identificados.

As três jornadas têm quatro segmentos — usuários, lançamento, espaço e solo — e cenas ligadas aos estados registrados. Voltar no tempo mostra apenas os dados disponíveis naquele instante. Bennu e Telescópio incluem requisitos, hipótese, execução, retorno científico, redesign, comparação A/B no mesmo segundo e projetos JSON exportáveis. O modo equipe distribui quatro papéis entre até quatro pessoas no mesmo dispositivo; não há sessão online sincronizada.

## Exploração visual

A R15 torna as escolhas reconhecíveis na nave: carga de processamento, câmera ou espectrômetro, painéis, bateria e rádio. Inspecione cada sistema, separe os componentes e gire a montagem. As explicações usam valores do catálogo: W, Wh, Mbit, taxa, massa, créditos e agenda. Nas expedições, ampliar contatos mantém a mesma antena e taxa. Na reprodução e comparação, a nave conserva a configuração executada.


A marca usa o símbolo e lettering SVG enviados pelo autor, sem fundo. Quatro modelos oficiais NASA são locais: CubeSat genérico, antena DSN, Bennu e JWST. Bennu e JWST contextualizam as novas cenas; o acervo permite inspecionar os quatro modelos. O estado e os indicadores vêm do motor; uma malha não valida a engenharia. Os [créditos e limites](docs/30-ATIVOS-NASA-IMPLEMENTADOS.md) distinguem geometria real, parâmetros didáticos e dados sintéticos.

A cena oferece alternativa 2D e legendas. Integrações vivas NASA/JPL, GMAT, trajetória de chegada, operação de antenas reais, multiplayer remoto e validação de aprendizagem permanecem futuros trabalhos. As duas ou três horas das novas missões representam somente operação após chegada.

## Código e documentação

| Material | Local |
| --- | --- |
| Beta 0.7.0-beta.1 / R16 | `experiments/mission-design-lab/` |
| Portal HTML interativo | `web/index.html` |
| PRD / PRT | [PRD](docs/02-PRD.md) / [PRT](docs/03-PRT.md) |
| Fluxogramas Mermaid | [Fluxogramas](docs/04-FLOWCHARTS.md) |
| Prisma proposto, sem banco implantado | [schema.prisma](prisma/schema.prisma) |
| Pesquisa atual de APIs e materiais | [Oportunidades NASA](docs/21-OPORTUNIDADES-NASA.md) |
| Estado e sequência de trabalho | [Plano de continuidade](docs/22-PLANO-CONTINUIDADE.md) |
| Entrada da equipe de dois devs | [Handoff](docs/25-HANDOFF-DOIS-DEVS.md) |
| Oportunidades dos Estudos | [Análise](docs/24-OPORTUNIDADES-ESTUDOS.md) / [fontes históricas](references/estudos/README.md) |
| Marca SVG e fontes locais | [Identidade](docs/23-IDENTIDADE-VISUAL.md) / [tipografia](docs/26-TIPOGRAFIA.md) |
| Origem e curadoria pública | [Procedência](GIT-PROVENIENCIA.md) |

Stack existente: React, TypeScript, Vite, Three.js, React Three Fiber e Drei; motor em Worker, persistência no navegador e publicação estática. Sem serviço de pontuação remoto ou nova dependência adicionada nesta edição.

## Executar e compilar

Requer Node 24. Instalação e compilação da distribuição completa:

```bash
npm --prefix experiments/mission-design-lab ci --ignore-scripts --no-audit --no-fund
npm run build:release
npm run start:beta
```

Abra `http://127.0.0.1:4175/`. Para desenvolver o beta: `npm --prefix experiments/mission-design-lab run dev`. O arquivo `portable/Missao_Ipe_Local.html` é a alternativa autocontida do jogo clássico.

O build compila o beta para `/lab/`, preserva a versão clássica em `/game/`, monta apenas os materiais públicos em `site/` e calcula os hashes de scripts para a política CSP. O `dist/` da raiz é o runtime clássico preservado; alterações em `src/` da raiz exigem recompilação própria.

## Verificar

```bash
npm ci --ignore-scripts --no-audit --no-fund
npm test
npm --prefix experiments/mission-design-lab run verify
npm run build:release
npm run test:context
npm run test:beta
```

O registro R11 preserva 101 testes de domínio do beta, 9 de interface, 51 do motor clássico, 24 verificações da central, 15 da distribuição/HTTP e uma partida observada com 6/6 registros válidos. Na revisão visual/documental R12, foram executados novamente a compilação, os 9 testes de interface, as 24 verificações da central e as 15 da distribuição. Navegação, busca, filtros, SVG e leitura foram conferidos em navegador no computador e em tela estreita. Isso não substitui pesquisa de aprendizagem, auditoria completa de acessibilidade ou validação de voo.

Na R13, passaram a compilação, 24 verificações da central e 16 da distribuição. Diagramas, galeria e estudo de Game Design foram conferidos em navegador com telas estreitas e amplas. O motor e a UI do beta não mudaram; suas suítes de domínio e interface não foram reexecutadas nesta revisão.

## Próximos passos

A [revisão de Game Design 3D](docs/29-GAME-DESIGN-3D.md) define a próxima direção: conectar a cena à evidência da missão, acompanhar o registro da nave ao usuário científico e comparar visualmente o redesign. O [estudo interativo](https://projeto-ipe.vercel.app/game-design.html) apresenta os quatro segmentos e as cinco cenas propostas; o [catálogo NASA 3D](docs/28-OPORTUNIDADES-NASA-3D.md) registra ativos oficiais, formatos, pesos e limitações. O plano E0–E5 divide domínio/evidência e 3D/experiência entre dois desenvolvedores. A revisão publica o projeto dessa evolução, sem declarar as novas mecânicas como implementadas.

1. Validar uso e aprendizado com jogadores.
2. Refinar narrativa e fichas usando os materiais NASA.
3. Preparar coleta sequencial e snapshots com procedência.
4. Validar uma campanha de pequenos corpos com SBDB, Mission Design e Horizons.
5. Ensaiar a apresentação e confirmar regulamento/elegibilidade do desafio.

A documentação histórica mantém seus cortes originais. O handoff para dois desenvolvedores e o plano de continuidade são as referências da evolução atual. Os materiais SmartCity são referências de outro projeto; seu código ilustrativo, regras de concurso e resultados não se transferem para o Ipê. Nenhuma tarefa futura foi agendada automaticamente.

## Licenças e atribuições

Código original sob Apache-2.0; dependências e materiais de terceiros conservam suas licenças em `licenses/`, nos diretórios vendor e em [NOTICE.md](NOTICE.md). Assistência de IA em pesquisa, programação e redação está declarada. Referências NASA não significam endosso institucional. Condições oficiais de participação e elegibilidade ainda requerem confirmação.
