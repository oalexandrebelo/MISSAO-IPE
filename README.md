# MISSÃO IPÊ · R23 / Beta 0.12

Jogo educativo de engenharia de missões espaciais com três casos científicos. Investigue a vegetação do Cerrado, as dimensões de rochas em Bennu e um recorte do espectro de trânsito observado pelo Webb. Projete, execute e use os registros recebidos para revisar a missão.

**R23 publicada em 15/11/2026.** O site principal e a LP estão `READY` na Vercel no commit `80ce5ad`. A bancada mostra a mudança no equipamento e nos recursos. A comparação A/B usa a mesma cena e o mesmo tempo simulado, com callouts de instrumento, energia e comunicação. A animação Rive aguarda um arquivo ativo no editor do MacBook Pro. [Registro da publicação](PUBLICADO.md)

No domínio oficial, o avatar do VLibras sinalizou no portal e acompanhou a passagem de **Nome** para **E-mail** dentro do jogo. A API privada confirmou três tentativas sintéticas distintas após reenvio, e o painel Cloudflare registrou uma visita técnica. Continuam pendentes os testes em celular físico e a avaliação com jogadores e pessoas fluentes em Libras. [Jogo](https://nasa-missaoipe.alexandrebelo.com/lab/index.html) · [Pitch](https://nasa-missaoipe.alexandrebelo.com/presentation/pitch/index.html) · [Central da equipe](https://nasa-missaoipe.alexandrebelo.com/equipe/index.html) · [Painel privado](https://nasa-missaoipe.alexandrebelo.com/dashboard/index.html)

**Continuidade para dois desenvolvedores.** O handoff reúne os ensaios reproduzíveis, a divisão de trabalho e os critérios de aceite. [Handoff R23](docs/61-BANCADA-COMPARACAO-E-LIBRAS-R23.md) · [Domínio e Cloudflare](docs/62-DOMINIO-E-CLOUDFLARE-R23.md) · [Dicionário de métricas](docs/54-METRICAS-E-HANDOFF-R21.md) · [Fala de três minutos](docs/53-PITCH-JURADOS-E-FALA-R21.md) · [Roteiro do MVP](docs/49-ROTEIRO-APRESENTACAO-MVP-R19.md)

A [LP imersiva](https://projeto-ipe-lp.vercel.app/) oferece uma 404 espacial com caminhos de retorno ao jogo e à documentação. [Implementação, créditos e handoff da LP](docs/50-LP-E-404-R19.md).

[Guia didático completo](docs/32-GUIA-DIDATICO-MISSOES-3D.md) · [Oportunidades NASA Science](docs/33-OPORTUNIDADES-NASA-SCIENCE.md) · [Biblioteca de pesquisa](https://nasa-missaoipe.alexandrebelo.com/context/research-library.html)

## Direção vigente — histórias reais, identidade da equipe

**IPÊ é o nome da equipe.** A árvore identifica a marca; os três casos partem de fatos NASA: Terra/MODIS e vegetação; reconhecimento de Bennu pela OSIRIS-REx; espectroscopia do Webb em WASP-39 b. As introduções trazem fontes e datas, sem equipes ou acontecimentos inventados. Os três casos usam arquivos históricos reais: Terra/MODIS, dimensões de seis rochas/clastos da OSIRIS-REx e seis bins do Webb/NIRSpec PRISM para WASP-39 b. Fonte, unidade, seleção e qualidade acompanham cada registro. As naves e suas operações são didáticas.

[Próximas oportunidades NASA · Sol 6.1 max](docs/47-OPORTUNIDADES-NASA-PARA-DOIS-DEVS-R18.md) · [Dados reais e limites](docs/45-DADOS-REAIS-BENNU-WEBB-R18.md) · [logo SVG oficial e Figma](docs/40-IDENTIDADE-MISSAO-IPE-R17.md) · [prontidão para Space Apps](docs/42-PRONTIDAO-E-CRITERIOS-SPACE-APPS-R17.md).

A página orbital da PR #1 foi incorporada em `apps/immersive-lp/`, corrigindo a pasta ausente no projeto Vercel separado. A contribuição de **Bruno A Carvalho** foi consolidada em `contributions/bruno-figma/` como fonte revisada: 32 arquivos, autoria e cinco commits referenciados, com quatro assets excluídos e justificados. O motor oficial permanece a base das três missões. [Inventário, procedência e reaproveitamento](docs/41-CONSOLIDACAO-REPOSITORIOS-R17.md).

## Descobrir antes de otimizar

A experiência torna o propósito explícito e acrescenta três experimentos guiados, ligados ao mesmo motor e à nave 3D. O jogador faz uma previsão, executa A/B mudando um único fator, inspeciona ambos no mesmo segundo e decide se quer copiar aquelas escolhas para seu projeto. A aplicação não executa nem salva uma tentativa automaticamente.

| Missão | Pergunta e aprendizagem | Experimento controlado |
| --- | --- | --- |
| Cerrado | Como comparar vegetação sem confundir ausência de dados com mudança? Potência, energia e limites do NDVI. | BANDAS → ÍNDICE: menos dados pode exigir um pico de potência que a bateria não suporta. |
| Bennu | Como transformar observações da superfície em informação disponível aos cientistas? Produção, fila e recepção. | Serviço de solo: muda duração, início do primeiro contato e custo; antena e taxa permanecem iguais. |
| Telescópio | Que instrumento responde à pergunta sobre a luz? Imagem, espectro e evidência válida. | Câmera → espectrômetro: receber seis arquivos não garante seis medidas cientificamente compatíveis. |

Após cada missão, uma interpretação orientada retoma a pergunta e preserva lacunas. Não há alegação de aprendizagem comprovada por concluir o exercício. Leia a [proposta pedagógica e análise das tecnologias](docs/37-PROPOSTA-PEDAGOGICA-E-TECNOLOGIAS-R16.md), a [revisão da PR #1](docs/35-REVISAO-PRS-E-DIRECAO-R16.md) o [handoff R16](docs/38-HANDOFF-R16.md) e a [análise dos assets da PR](docs/39-ATIVOS-DA-PR-E-APLICACOES.md).

O [Planet Jumping](https://projeto-ipe.vercel.app/planet-jumping.html) é uma experiência visual independente em um único HTML, com as mídias exatas da referência fornecida. Demonstra a transição Marte → Terra → Vênus; não é simulação orbital nem uma quarta missão. Depende do CDN externo. [Detalhes, créditos e limitações](docs/36-PORTAL-PLANET-JUMPING.md).

## Campanha didática de quatro níveis

Além das três missões da edição R14, a sequência **Primeiro sinal → Memória em disputa → Janela estreita → Ciência que chega** está disponível em [Jogar a campanha](https://projeto-ipe.vercel.app/campanha/index.html). Ela mantém o caso do Cerrado e acrescenta objetivos de memória, preservação das bandas e custo. [Mapa e pitch](https://projeto-ipe.vercel.app/campanha/apresentacao/index.html) · [PRD, PRT, diagramas, schema e handoff](https://projeto-ipe.vercel.app/campanha/research/index.html).

O código e os documentos completos dessa experiência ficam em [`experiments/four-level-campaign/`](experiments/four-level-campaign/). A campanha tem rota e testes próprios. [Registro da campanha](docs/32-CAMPANHA-QUATRO-NIVEIS.md)

## Explorar

- [Portal interativo](https://nasa-missaoipe.alexandrebelo.com/)
- [Jogar a edição publicada](https://nasa-missaoipe.alexandrebelo.com/lab/index.html)
- [Contexto e cronograma detalhados](https://nasa-missaoipe.alexandrebelo.com/context/index.html)
- [Biblioteca integral](https://nasa-missaoipe.alexandrebelo.com/context/research-library.html)
- [Pitch interativo · Alexandre Belo](https://nasa-missaoipe.alexandrebelo.com/presentation/pitch/index.html)
- [Apresentação histórica](https://nasa-missaoipe.alexandrebelo.com/presentation/Missao_Ipe_Apresentacao.html)
- [Documentação pública](https://nasa-missaoipe.alexandrebelo.com/docs/index.html)
- [Jogo clássico](https://nasa-missaoipe.alexandrebelo.com/game/index.html)

O recibo de publicação está em [PUBLICADO.md](PUBLICADO.md). Metas ou evidências históricas não comprovam uma nova publicação por si só.

## O que existe

O Cerrado preserva seu motor determinístico, 64 configurações por cenário, dados históricos MOD13Q1.061, replay verificável e busca de alternativas. Bennu e Telescópio acrescentam seis decisões de projeto: lançador, perfil orbital, instrumento, energia, contatos e vida operacional. Seus registros são dados publicados: eixo maior em metros para Bennu e profundidade de trânsito em porcentagem com incerteza 1σ para Webb. O painel, os cartões 3D e o replay compartilham os IDs dos arquivos; um registro só aparece como evidência após recepção completa e compatível.

As três jornadas têm quatro segmentos — usuários, lançamento, espaço e solo — e cenas ligadas aos estados registrados. Voltar no tempo mostra apenas os dados disponíveis naquele instante. Bennu e Telescópio incluem requisitos, hipótese, execução, retorno científico, redesign, comparação A/B no mesmo segundo e projetos JSON exportáveis. O modo equipe distribui quatro papéis entre até quatro pessoas no mesmo dispositivo; não há sessão online sincronizada.

## Exploração visual

A R15 torna as escolhas reconhecíveis na nave: carga de processamento, câmera ou espectrômetro, painéis, bateria e rádio. Inspecione cada sistema, separe os componentes e gire a montagem. As explicações usam valores do catálogo: W, Wh, Mbit, taxa, massa, créditos e agenda. Nas expedições, ampliar contatos mantém a mesma antena e taxa. Na reprodução e comparação, a nave conserva a configuração executada.


A marca usa o símbolo e lettering SVG enviados pelo autor, sem fundo. Quatro modelos oficiais NASA são locais: CubeSat genérico, antena DSN, Bennu e JWST. Bennu e JWST contextualizam as novas cenas; o acervo permite inspecionar os quatro modelos. O estado e os indicadores vêm do motor; uma malha não valida a engenharia. Os [créditos e limites](docs/30-ATIVOS-NASA-IMPLEMENTADOS.md) distinguem geometria de referência e parâmetros didáticos; a [atualização R18](docs/45-DADOS-REAIS-BENNU-WEBB-R18.md) documenta os dados científicos reais.

A cena oferece alternativa 2D e legendas. Integrações vivas NASA/JPL, GMAT, trajetória de chegada, operação de antenas reais, multiplayer remoto e validação de aprendizagem permanecem futuros trabalhos. As duas ou três horas das novas missões representam somente operação após chegada.

## Código e documentação

| Material | Local |
| --- | --- |
| Beta 0.12.0-beta.1 / R23 | `experiments/mission-design-lab/` |
| Portal HTML interativo | `web/index.html` |
| PRD / PRT | [PRD](docs/02-PRD.md) / [PRT](docs/03-PRT.md) |
| Fluxogramas Mermaid | [Fluxogramas](docs/04-FLOWCHARTS.md) |
| Prisma proposto, sem banco implantado | [schema.prisma](prisma/schema.prisma) |
| Pesquisa atual de APIs e materiais | [Oportunidades NASA](docs/21-OPORTUNIDADES-NASA.md) |
| Estado e sequência de trabalho | [Plano de continuidade](docs/22-PLANO-CONTINUIDADE.md) |
| Entrada da equipe de dois devs | [Handoff R23](docs/61-BANCADA-COMPARACAO-E-LIBRAS-R23.md) |
| Oportunidades dos Estudos | [Análise](docs/24-OPORTUNIDADES-ESTUDOS.md) / [fontes históricas](references/estudos/README.md) |
| Marca SVG e fontes locais | [Identidade](docs/23-IDENTIDADE-VISUAL.md) / [tipografia](docs/26-TIPOGRAFIA.md) |
| Origem e curadoria pública | [Procedência](GIT-PROVENIENCIA.md) |

Stack existente: React, TypeScript, Vite, Three.js, React Three Fiber e Drei; motor em Worker, fila local e função de métricas na Vercel com armazenamento privado. O servidor recalcula as tentativas; nenhum SDK ou biblioteca nova foi adicionado nesta edição. O jogo medido exige rede para iniciar a participação; a fila de uma participação existente tolera interrupções.

## Executar e compilar

Requer Node 24. Instalação e compilação da distribuição completa:

```bash
npm --prefix experiments/mission-design-lab ci --ignore-scripts --no-audit --no-fund
npm --prefix experiments/four-level-campaign ci --ignore-scripts --no-audit --no-fund
npm run build:release
npm run start:beta
```

Abra `http://127.0.0.1:4175/`. Para testar entrada e painel localmente, use `IPE_METRICS_TEST=1 npm run start:beta`; esse modo funciona apenas em loopback e mantém dados de teste em memória, conforme o handoff R21. Para desenvolver o beta: `npm --prefix experiments/mission-design-lab run dev`. O arquivo `portable/Missao_Ipe_Local.html` é a alternativa autocontida do jogo clássico.

O build compila o beta para `/lab/`, preserva a versão clássica em `/game/`, monta apenas os materiais públicos em `site/` e calcula os hashes de scripts para a política CSP. O `dist/` da raiz é o runtime clássico preservado; alterações em `src/` da raiz exigem recompilação própria.

## Verificar

```bash
npm ci --ignore-scripts --no-audit --no-fund
npm test
npm --prefix experiments/mission-design-lab run verify
npm run build:release
npm run test:context
npm run test:metrics
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
