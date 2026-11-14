# PROJETO-IPÊ · Ciência que chega

**Um jogo de engenharia espacial em que cada decisão precisa fazer a ciência chegar à Terra.**

Beta **0.5.0-beta.1**, em português, criado para explorar o tema *Space Mission Design Game* do NASA Space Apps Challenge. O jogador projeta um CubeSat fictício, prevê o resultado, executa o modelo e usa evidências para redesenhar a missão. A campanha tem quatro níveis, dados históricos NASA, seis subsistemas e 64 configurações possíveis.

[Mapa interativo e pitch](public/apresentacao/index.html) · [PRD](docs/PRD.md) · [PRT](docs/PRT.md) · [Handoff](docs/HANDOFF.md) · [Pesquisa e oportunidades](docs/INSIGHTS-E-OPORTUNIDADES.md)

## Integração ao projeto atual

Esta campanha complementar está em `experiments/four-level-campaign/` e é servida em `/campanha/index.html`. O beta com Cerrado, Bennu e Telescópio permanece em `/lab/index.html`. As duas experiências preservam seus contratos próprios.

## Jogar e apresentar

O código público está em **[oalexandrebelo/PROJETO-IPE](https://github.com/oalexandrebelo/PROJETO-IPE)**. A grafia visual é **PROJETO-IPÊ**; os identificadores de repositório e hospedagem usam `projeto-ipe`.

A apresentação estática em `/apresentacao/` oferece um mapa por capítulos, modo de apresentação e notas de estudo. O caderno em `/research/` reúne documentos completos, fontes e downloads. O jogo aceita os atalhos `/?view=campaign` e `/?view=lab`.

## Quatro níveis, uma história

Uma equipe fictícia precisa comparar a vegetação do Cerrado em dois períodos, usando três pontos de referência. Os mesmos seis registros acompanham toda a história, para que o jogador reconheça o efeito de cada nova restrição.

| Capítulo | Personagem | Missão do jogador | O que investigar |
|---|---|---|---|
| **1 · Primeiro sinal** | Lina Duarte | Entregar 6/6 registros com contatos longos. | Como os seis subsistemas trabalham juntos. |
| **2 · Memória em disputa** | Caio Mendes | Entregar 6/6 mantendo a memória de **512 Mbit**. | Processar a bordo reduz dados, mas exige potência. |
| **3 · Janela estreita** | Joana Costa | Entregar 6/6 em contatos curtos, preservando as **bandas R/NIR**. | Informação científica, rádio, bateria e massa. |
| **4 · Ciência que chega** | Ravi Almeida | Redesenhar uma missão que funciona por 84 créditos até atingir **78 créditos ou menos**. | Custo, folgas e justificativa de projeto. |

Todo nível exige `outcome === 'success'`, seis registros completos e válidos e todas as restrições operacionais atendidas. As condições pedagógicas são adicionais: um resultado 6/6 que excede o custo do capítulo 4 não conclui esse capítulo.

A progressão depende de uma **tentativa própria**, iniciada depois da previsão e da justificativa. A busca exaustiva é liberada após essa tentativa e só oferece projetos compatíveis com o briefing do nível. Reflexões são opcionais, sem nota automática. Importar replays e abrir o histórico não concede avanço.

A busca verifica **17 / 6 / 1 / 2 soluções elegíveis**, respectivamente. Dificuldade é tratada como autonomia e complexidade da decisão; o número mínimo de mudanças não cresce necessariamente de um nível para o seguinte.

## Executar localmente

Requer **Node.js 24.x** e npm. Versões e integridades estão no lockfile.

```bash
git clone https://github.com/oalexandrebelo/PROJETO-IPE.git
cd PROJETO-IPE/experiments/four-level-campaign
npm ci
npm run dev
```

| Comando | Resultado |
|---|---|
| `npm run dev` | Servidor Vite; abra o endereço informado no terminal. |
| `npm test` | Testes do motor, física, ciência, integridade, persistência e campanha. |
| `npm run test:ui` | Jornada React com motor real em jsdom. |
| `npm run build` | Documentação pública, recibo da versão, TypeScript e build em `dist/`. |
| `npm run verify` | Domínio, UI e build, nessa ordem. |
| `npm run preview` | Serve o build local depois de `npm run build`. |

A instalação necessita do registro npm ou de um cache completo. A execução científica usa os arquivos locais incluídos; não depende de API NASA durante a partida. Recarga offline a frio ainda não é uma funcionalidade validada.

## Stack efetivamente usada

| Camada | Tecnologia e versão |
|---|---|
| Aplicação | React **19.3.1**, TypeScript **7.0.2**, Vite **8.3.8**, Node **24.x** |
| Cena conceitual | Three.js **0.187.0**, React Three Fiber **9.8.2**, Drei **10.7.9** |
| UI | HTML semântico, CSS responsivo próprio, SVG para telemetria, controles fora do canvas |
| Modelo | TypeScript puro, motor determinístico **0.1.1-rd**, catálogo **ipe-64-v1** |
| Campanha | Regras e progresso versionados **ipe-campaign-v1** |
| Execução | Web Worker com cancelamento e caminho local equivalente |
| Persistência | IndexedDB para projetos/execuções; localStorage para diário e campanha |
| Verificação | Node Test Runner, Testing Library, jsdom, fake-indexeddb, oracle e recibos de proveniência |
| Publicação | GitHub + build estático Vercel, configuração em `vercel.json` |
| Modelo cloud proposto | PostgreSQL + schema Prisma **7.10.1**, validado, sem banco conectado |

A documentação técnica explica por que Zustand, Tailwind, shadcn, Recharts, `astronomy-engine`, `satellite.js` e propagadores externos não foram acrescentados ao runtime deste recorte. A campanha usa condições fixas e um motor próprio verificável. A cena é carregada separadamente e possui alternativa 2D; uma meta de 60 FPS ainda requer medição em dispositivos reais.

## Documentação e entregáveis

| Arquivo | Conteúdo |
|---|---|
| [PRD](docs/PRD.md) | Problema, público, 19 requisitos, aceite, métricas propostas e pesquisa com usuários. |
| [PRT](docs/PRT.md) | Plano de Requisitos Técnicos, contratos, unidades, segurança de resultados e critérios de entrega. |
| [Storytelling dos quatro níveis](docs/STORYTELLING-4-NIVEIS.md) | Personagens, incidentes, briefings, escolhas, feedback e soluções verificadas. |
| [Arquitetura](docs/ARQUITETURA.md) | Camadas, stack, concorrência, persistência e decisões registradas. |
| [Flowcharts Mermaid](docs/FLOWCHARTS.md) | Jornada, estados, fluxo de dados/replay, distribuição e dois diagramas de entidades. Fontes em [diagrams/](diagrams/). |
| [Schema Prisma](prisma/schema.prisma) | Doze modelos e suas relações; [guia de evolução cloud](prisma/README.md). |
| [Handoff geral](docs/HANDOFF.md) | Mapa de arquivos, comandos, contratos, roteiro de demo, publicação e continuidade. |
| [Pitch para estudar](docs/PITCH.md) | Versões de 30 s, 90 s e 3 min, roteiro de dez slides, notas e perguntas difíceis. |
| [Mapa interativo](public/apresentacao/index.html) | Apresentação web por capítulos, navegável e responsiva. |
| [Insights e oportunidades](docs/INSIGHTS-E-OPORTUNIDADES.md) | Pesquisa primária adicional e 14 oportunidades priorizadas, com hipóteses e limites. |
| [QA do beta](docs/QA-BETA-0.5.md) | Evidências atuais, verificações e limites. |
| [Pesquisa R9](docs/PESQUISA-E-DECISOES-R9.md) e [refinamento NASA R10](docs/REFINAMENTO-NASA-R10.md) | Auditoria das referências, física, UX, ConOps, requisitos e risco. |
| [Pareceres completos](research/) | Pesquisas originais, preservadas com suas decisões e ressalvas. |
| [Guia didático](docs/GUIA-DIDATICO-R9.md) | Roteiro de investigação e observação da aprendizagem. |

`npm run build:research` gera o caderno HTML a partir dos originais, com hashes, links e MathML. Os diagramas `.mmd` e o schema também são publicados em `/kit/` para download.

## Ciência, engenharia e limites

Os seis registros vêm de **Terra/MODIS, MOD13Q1 Collection 061**, obtidos como subconjuntos de três locais próximos a Rio Verde. Os compostos históricos começam em **28/08/2024** e **13/09/2024**. Os arquivos e recibos de ORNL DAAC/CMR estão preservados em [`public/data/`](public/data/). O CubeSat fictício processa e transporta esses arquivos; não adquire novas observações MODIS durante os 180 minutos simulados.

O envelope do projeto é **3,6 kg / 86 créditos / 180 minutos**, com contatos de **2 × 10 min** ou **2 × 4 min**. Massas, potências, capacidades, agendas e créditos são parâmetros didáticos. Os balanços distinguem watts de watt-hora e contabilizam bits produzidos, transmitidos, perdidos e em fila. A ciência só conta após recepção completa e QA.

O laboratório independente contém órbita circular/eclipses ideais, geração solar, dimensionamento de bateria, equação ideal de foguete e enlace Friis/tempo de luz. Esses controles não alteram a campanha. A visualização 3D não é telemetria orbital. Lançador, destino, trajetória e janela de lançamento não são configuráveis neste beta.

O schema Prisma é uma proposta técnica validada, **sem migração, API ou banco em produção**. O jogo não solicita conta. O armazenamento local pode ser editado ou apagado e não é inviolável. Testes aprovados não demonstram aprendizagem, conformidade WCAG completa ou validação de voo. O projeto não declara endosso NASA, NN/g ou outra instituição.

## Evidências de verificação

Em **14/11/2026**, passaram **120/120 testes de domínio e integridade** e **14/14 testes UI**. Os testes UI exercitam os quatro capítulos, restrições adicionais, alternativas compatíveis, recálculo, falha de armazenamento e restauração do progresso. O build verifica os tipos. **Prisma 7.10.1** validou os 12 modelos; **Mermaid 11.14.0** aceitou os seis diagramas e seus blocos Markdown correspondem às fontes.

Os testes UI usam **jsdom e fake-indexeddb**, sem GPU ou Worker real. A extensão do que foi observado no navegador e na publicação está no [QA do beta](docs/QA-BETA-0.5.md). O histórico de inspeção R9–R10 está preservado em [QA-NAVEGADOR-R9](docs/QA-NAVEGADOR-R9.md).

## Publicação do beta

Entrega consolidada em **14/11/2026**, no repositório público **[oalexandrebelo/PROJETO-IPE](https://github.com/oalexandrebelo/PROJETO-IPE)**, branch **`main`**. O [histórico de commits](https://github.com/oalexandrebelo/PROJETO-IPE/commits/main/) identifica cada revisão publicada.

A verificação integrada desta entrega executou `npm run verify` com **Node 24.22.1** e **npm 11.9.0**: **120 testes de domínio**, **14 testes de interface**, checagem TypeScript e build de produção aprovados. O [log completo](evidence/verify-beta-0.5.log) preserva os resultados e avisos observados.

O repositório inclui código, dados locais, pesquisas, documentação, testes, diagramas, schema, mapa interativo e [pitch editável em PowerPoint](public/apresentacao/PROJETO-IPE-Pitch.pptx), com [fonte de geração](presentation/README.md). Dependências instaladas, caches e `dist/` são reproduzidos pelos comandos documentados. A publicação na Vercel usa `vercel.json`; o build gera `/release.json` com a versão e o SHA informado pelo ambiente de implantação.

## Origem, autoria e licenças

A base deriva de [oalexandrebelo/AB-NASA-TEAM-IPE](https://github.com/oalexandrebelo/AB-NASA-TEAM-IPE), commit `73162276b46227e8965eed2b91a7dc8edae70b96`, com evolução R9–R10 e beta da campanha. O experimento anterior foi preservado; esta publicação tem repositório próprio. O [README histórico](docs/HISTORICO-R9-R10.md) registra o estado anterior.

Código sob [Apache-2.0](LICENSE), com avisos em [NOTICE.md](NOTICE.md) e [licenses/](licenses/). Dependências e dados conservam suas licenças e atribuições. Pesquisa, implementação, documentação e testes receberam assistência de IA, com quatro frentes Astra 6 Max nesta rodada. A documentação distingue fatos de fontes, resultados do modelo e hipóteses ainda não testadas com pessoas.
