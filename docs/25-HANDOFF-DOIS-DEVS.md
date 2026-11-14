# 25 — Handoff do PROJETO IPÊ para dois desenvolvedores

**Leitura atual R15:** [montagem 3D e handoff dos dois devs](34-HANDOFF-IMERSAO-3D-R15.md), [guia didático completo](32-GUIA-DIDATICO-MISSOES-3D.md) e [oportunidades NASA Science](33-OPORTUNIDADES-NASA-SCIENCE.md). Os registros abaixo preservam seus cortes; a R15 acrescenta a nave configurável aos três casos.

**Entrada atual R14 · beta 0.5.0-beta.1:** leia primeiro [Três missões científicas e handoff da dupla](31-TRES-MISSOES-CIENTIFICAS-R14.md). Estão implementados Cerrado, Bennu e Telescópio, cena orientada por eventos, quatro segmentos, revisão local de equipe e modelos NASA locais. [Ativos e limites](30-ATIVOS-NASA-IMPLEMENTADOS.md). A proposta R13 e o inventário R12 abaixo são históricos; use o documento 31 para o mapa atual e [PUBLICADO.md](https://github.com/oalexandrebelo/PROJETO-IPE/blob/main/PUBLICADO.md) para o recibo.


**Direção de produto acrescentada na R13:** começar pela [revisão de Game Design 3D](29-GAME-DESIGN-3D.md) e pelo [catálogo NASA 3D](28-OPORTUNIDADES-NASA-3D.md). A prioridade proposta é conectar a reprodução dos eventos à cena existente e tornar o redesign visível, em uma missão completa do Cerrado. A divisão E0–E5 do novo Game Design orienta esse incremento; o mapa de código e os invariantes abaixo continuam aplicáveis. As novas cenas e integrações são propostas, não recursos já entregues no beta. O restante deste documento conserva o corte R12.

**Edição documental R12 · corte: 14/11/2026 · beta 0.4.0-beta.2 · motor 0.1.1-rd · catálogo ipe-64-v1.**

Este documento permite retomar o projeto sem confundir o runtime atual, os registros históricos e as propostas. Os caminhos de código são relativos à raiz do repositório público `PROJETO-IPE`; não dependem de uma pasta pessoal de máquina. A divisão entre Dev A e Dev B é uma sugestão de responsabilidade, a confirmar no início de cada rodada.

A edição R12 amplia o contexto e a biblioteca de continuidade. O recibo atual de publicação deve ser consultado em [PUBLICADO.md no repositório](https://github.com/oalexandrebelo/PROJETO-IPE/blob/main/PUBLICADO.md). Esta edição documental, isoladamente, não declara o deployment R12 concluído.

## 1. Objetivo e primeira leitura

O Ipê ensina engenharia de sistemas espaciais pela sequência **prever → executar → investigar → redesenhar**. O desafio atual é entregar **seis registros históricos válidos de vegetação do Cerrado** dentro das restrições de uma nave fictícia. Não é um simulador de voo qualificado, uma coleta MODIS feita pelo CubeSat nem uma campanha de asteroides já implementada.

Ler nesta ordem:

1. [README.md](https://github.com/oalexandrebelo/PROJETO-IPE/blob/main/README.md) e [PUBLICADO.md](https://github.com/oalexandrebelo/PROJETO-IPE/blob/main/PUBLICADO.md): entrada e recibo de publicação correntes. O [recibo R11](https://github.com/oalexandrebelo/PROJETO-IPE/blob/main/evidence/production-r11.json) permanece como histórico; a publicação R12 receberá seu próprio `evidence/production-r12.json` após o deployment e sua verificação.
2. [Plano de continuidade](22-PLANO-CONTINUIDADE.md): estado do produto e próximos passos.
3. [experiments/mission-design-lab/README.md](https://github.com/oalexandrebelo/PROJETO-IPE/blob/main/experiments/mission-design-lab/README.md) e `docs/GUIA-DIDATICO-R9.md` dentro desse diretório: como executar e demonstrar o beta atual.
4. [experiments/mission-design-lab/docs/REFINAMENTO-NASA-R10.md](https://github.com/oalexandrebelo/PROJETO-IPE/blob/main/experiments/mission-design-lab/docs/REFINAMENTO-NASA-R10.md): refinamentos de pré-voo, requisitos, retorno científico e limites das referências NASA.
5. [Oportunidades NASA](21-OPORTUNIDADES-NASA.md) e [oportunidades dos Estudos](24-OPORTUNIDADES-ESTUDOS.md): propostas, sem adoção automática de ferramentas ou campanhas.
6. PRD, PRT e contexto histórico: [PRD](https://github.com/oalexandrebelo/PROJETO-IPE/blob/main/docs/02-PRD.md), [PRT](https://github.com/oalexandrebelo/PROJETO-IPE/blob/main/docs/03-PRT.md), [contexto](18-CONTEXTO-COMPLETO.md) e [revisão de evidências](19-REVISAO-EVIDENCIAS-R8.md).

Documentos R6–R10 preservam seu corte. Uma frase antiga sobre publicação pendente não substitui o recibo posterior; uma proposta antiga de funcionalidade também não comprova implementação atual.

## 2. Estado comprovado, documentado e proposto

| Área | Estado no corte consultado | Fonte e alcance |
|---|---|---|
| Produto principal | Beta 0.4.0-beta.2 em `/lab/index.html`; clássico preservado em `/game/index.html` | `package.json`, README e fontes do beta |
| Catálogo e cenários | Seis escolhas binárias, 64 configurações por cenário; contatos longos e curtos | [src/core/catalog.ts](https://github.com/oalexandrebelo/PROJETO-IPE/blob/main/experiments/mission-design-lab/src/core/catalog.ts), `search.ts` e testes, no beta |
| Regras | Motor determinístico, ciência válida após recepção integral, orçamento e recursos | [src/core/engine.ts](https://github.com/oalexandrebelo/PROJETO-IPE/blob/main/experiments/mission-design-lab/src/core/engine.ts), `science.ts`, `power.ts`, `exact.ts` |
| Interface | Briefing, hangar, hipótese, pré-voo, diário de eventos, requisitos, comparação e retorno científico | [src/App.tsx](https://github.com/oalexandrebelo/PROJETO-IPE/blob/main/experiments/mission-design-lab/src/App.tsx), [src/ui/](https://github.com/oalexandrebelo/PROJETO-IPE/tree/main/experiments/mission-design-lab/src/ui/) e modelos em [src/lab/](https://github.com/oalexandrebelo/PROJETO-IPE/tree/main/experiments/mission-design-lab/src/lab/) |
| Persistência/replay | Navegador; importação estrita, hashes e recálculo pelo motor | [src/persistence/](https://github.com/oalexandrebelo/PROJETO-IPE/tree/main/experiments/mission-design-lab/src/persistence/); hash não certifica autoria ou aprendizagem |
| Cena e laboratório | Cena 3D conceitual com alternativa 2D; física exploratória independente | [src/ui/Scene.tsx](https://github.com/oalexandrebelo/PROJETO-IPE/blob/main/experiments/mission-design-lab/src/ui/Scene.tsx), `OrbitalScene.tsx`, [src/lab/physics.ts](https://github.com/oalexandrebelo/PROJETO-IPE/blob/main/experiments/mission-design-lab/src/lab/physics.ts) |
| Publicação R11 — histórico | Recibo registra produção pública, 134 arquivos conferidos e ausência de divergências | [evidence/production-r11.json](https://github.com/oalexandrebelo/PROJETO-IPE/blob/main/evidence/production-r11.json), verificado em 14/11/2026 às 18:44:04 UTC; não comprova a publicação R12 |
| Contexto R12 | Biblioteca ampliada com estado, documentação do beta, Estudos completos e handoff | Cobertura e hashes no índice gerado após o build; recibo remoto corrente em [PUBLICADO.md](https://github.com/oalexandrebelo/PROJETO-IPE/blob/main/PUBLICADO.md) |
| Testes registrados | 101 de domínio do beta, 9 de UI, 51 do clássico, 24 verificações da central e 15 da distribuição | Registro R11 e documentos de QA; reexecutar o conjunto pertinente após alteração |
| Observação de navegador | Recibo descreve partida 6/6, interações do portal e inspeção móvel | Evidência delimitada ao ambiente observado; não representa auditoria geral de acessibilidade ou desempenho |
| Semente/Raízes | Nomes narrativos propostos sobre os dois cenários existentes | Não há quatro níveis desbloqueáveis implementados |
| Copa/Horizonte | Planejados | DONKI e campanha de pequenos corpos ainda não integrados |
| Contas, backend, Prisma, multiplayer | Não implementados na experiência atual | Prisma é contrato de evolução; jogo funciona sem banco remoto |
| Aprendizagem, acessibilidade completa e recarga offline a frio | Não estabelecidas | Exigem protocolos e evidências próprios; não inferir a partir do número de testes |
| Candidatura Space Apps | Elegibilidade e Resources ainda exigem confirmação | Publicação do produto não equivale a inscrição ou aceite oficial |

A publicação R11 identifica o commit `2adff7a17912d890d893ee604c081d4c798e5315`. Alterações posteriores devem receber seu próprio commit e recibo; este texto não deve reaproveitar esse SHA para uma edição diferente.

## 3. Invariantes que orientam qualquer alteração

- O sucesso exige 6/6 registros válidos e atendimento às restrições. Contar seis registros em um projeto inválido não torna a missão bem-sucedida.
- Os dados são históricos Terra/MODIS, MOD13Q1 Collection 061, de três locais próximos a Rio Verde, com compostos iniciados em 28/08 e 13/09/2024. A nave simula processamento e transporte desses arquivos.
- A agenda de 180 minutos, envelope de 3,6 kg/86 créditos e parâmetros de componentes são didáticos. Não descrevem uma missão real homologada.
- Potência em W, energia em Wh, memória e transmissão são conceitos diferentes. Não trocar unidades ou causa da falha para simplificar a narrativa.
- A cena não determina o resultado. Os controles do laboratório de física não mudam os contatos, componentes ou ciência da campanha.
- Uma tentativa conserva suas entradas. Editar o projeto exige nova hipótese e execução; resultado antigo não deve parecer pertencer à configuração nova.
- Busca de alternativas e replay usam o motor. Não criar score, resultado de missão ou classificação científica paralelos na interface.
- Manter limites visíveis: testes automáticos, demonstração, observação e estudo de aprendizagem são evidências diferentes.

## 4. Mapa de fontes e código

O diretório principal do beta é [experiments/mission-design-lab/](https://github.com/oalexandrebelo/PROJETO-IPE/tree/main/experiments/mission-design-lab/), apesar do nome histórico “experiments”. A raiz também contém uma aplicação clássica. Confirmar o alvo antes de editar arquivos com nomes iguais.

| Caminho | Responsabilidade | Verificação relacionada |
|---|---|---|
| [experiments/mission-design-lab/src/core/contracts.ts](https://github.com/oalexandrebelo/PROJETO-IPE/blob/main/experiments/mission-design-lab/src/core/contracts.ts) | Tipos, versões e contrato de entradas/resultados | Testes de domínio e consumidores de Worker/replay |
| [experiments/mission-design-lab/src/core/catalog.ts](https://github.com/oalexandrebelo/PROJETO-IPE/blob/main/experiments/mission-design-lab/src/core/catalog.ts) | Componentes, cenário, configuração padrão e totais | [tests/engine.test.mts](https://github.com/oalexandrebelo/PROJETO-IPE/blob/main/experiments/mission-design-lab/tests/engine.test.mts), `adversarial.test.mts` |
| [experiments/mission-design-lab/src/core/engine.ts](https://github.com/oalexandrebelo/PROJETO-IPE/blob/main/experiments/mission-design-lab/src/core/engine.ts) | Simulação da campanha | Motor, ciência e oracle dos testes |
| [experiments/mission-design-lab/src/core/science.ts](https://github.com/oalexandrebelo/PROJETO-IPE/blob/main/experiments/mission-design-lab/src/core/science.ts), `power.ts`, `exact.ts` | Validação científica, potência e aritmética | Domínio e casos adversariais |
| [experiments/mission-design-lab/src/core/search.ts](https://github.com/oalexandrebelo/PROJETO-IPE/blob/main/experiments/mission-design-lab/src/core/search.ts) | Enumeração do catálogo e alternativas | Busca completa e distância de alterações |
| [experiments/mission-design-lab/src/data/science-data.ts](https://github.com/oalexandrebelo/PROJETO-IPE/blob/main/experiments/mission-design-lab/src/data/science-data.ts) e `public/data/` | Registros compilados e arquivos científicos preservados | Proveniência, hashes, qualidade e interpretação |
| [experiments/mission-design-lab/src/workers/](https://github.com/oalexandrebelo/PROJETO-IPE/tree/main/experiments/mission-design-lab/src/workers/) | Trabalho assíncrono, validação, cancelamento e fallback | Contratos de resposta e navegador com Worker real |
| [experiments/mission-design-lab/src/persistence/](https://github.com/oalexandrebelo/PROJETO-IPE/tree/main/experiments/mission-design-lab/src/persistence/) | IndexedDB, identidade, JSON estrito, importação e replay | `persistence.test.mts`, `replay.test.mts` |
| [experiments/mission-design-lab/src/lab/](https://github.com/oalexandrebelo/PROJETO-IPE/tree/main/experiments/mission-design-lab/src/lab/) | Pré-voo, requisitos, retorno científico e física independente | Testes correspondentes em [tests/](https://github.com/oalexandrebelo/PROJETO-IPE/tree/main/experiments/mission-design-lab/tests/) |
| [experiments/mission-design-lab/src/ui/](https://github.com/oalexandrebelo/PROJETO-IPE/tree/main/experiments/mission-design-lab/src/ui/) | Componentes visuais, texto e interação | [tests-ui/](https://github.com/oalexandrebelo/PROJETO-IPE/tree/main/experiments/mission-design-lab/tests-ui/), roteiro de navegador e revisão de conteúdo |
| [experiments/mission-design-lab/src/App.tsx](https://github.com/oalexandrebelo/PROJETO-IPE/blob/main/experiments/mission-design-lab/src/App.tsx) | Navegação, estado da tentativa e coordenação | Jornada React; arquivo compartilhado sob coordenação |
| [web/index.html](https://github.com/oalexandrebelo/PROJETO-IPE/blob/main/web/index.html) | Portal de entrada, contexto, oportunidades e etapas | Navegação, responsividade e links finais |
| [context/project-context.json](https://github.com/oalexandrebelo/PROJETO-IPE/blob/main/context/project-context.json), [context/schedule.json](https://github.com/oalexandrebelo/PROJETO-IPE/blob/main/context/schedule.json) | Conteúdo editorial e planejamento | [scripts/test-context-hub.mjs](https://github.com/oalexandrebelo/PROJETO-IPE/blob/main/scripts/test-context-hub.mjs) |
| [context/index.template.html](https://github.com/oalexandrebelo/PROJETO-IPE/blob/main/context/index.template.html) | Interface da central | Build da central e teste DOM |
| [scripts/build-research-library.mjs](https://github.com/oalexandrebelo/PROJETO-IPE/blob/main/scripts/build-research-library.mjs) | Biblioteca documental e índice de hashes | Inclusão, corte, projeção pública e busca |
| [scripts/build-beta-site.mjs](https://github.com/oalexandrebelo/PROJETO-IPE/blob/main/scripts/build-beta-site.mjs), `prepare-vercel-static.mjs` | Árvore pública curada e preparação para hospedagem | [scripts/test-beta-site.mjs](https://github.com/oalexandrebelo/PROJETO-IPE/blob/main/scripts/test-beta-site.mjs), manifesto e HTTP |
| [src/](https://github.com/oalexandrebelo/PROJETO-IPE/tree/main/src/), [tests/](https://github.com/oalexandrebelo/PROJETO-IPE/tree/main/tests/), `dist/` da raiz | Jogo clássico preservado | Testes/build próprios; não são o beta `/lab/` |
| [prisma/schema.prisma](https://github.com/oalexandrebelo/PROJETO-IPE/blob/main/prisma/schema.prisma) | Contrato futuro de dados | Não há banco implantado a validar como se existisse |
| [presentation/](https://github.com/oalexandrebelo/PROJETO-IPE/tree/main/presentation/), [architecture/](https://github.com/oalexandrebelo/PROJETO-IPE/tree/main/architecture/), [research/](https://github.com/oalexandrebelo/PROJETO-IPE/tree/main/research/) | Pitch, mapa e pesquisas | Inspecionar corte e fonte antes de atualizar afirmações |

`site/`, os HTML gerados em [context/](https://github.com/oalexandrebelo/PROJETO-IPE/tree/main/context/), a biblioteca compilada e os diretórios `dist/` são saídas de geradores. Alterar sua fonte e reconstruir; editar apenas a saída cria divergência no próximo build.

## 5. Divisão sugerida entre Dev A e Dev B

| Responsável | Ownership principal | Entregas iniciais |
|---|---|---|
| Dev A — motor, ciência e integridade | No beta: [src/core/](https://github.com/oalexandrebelo/PROJETO-IPE/tree/main/experiments/mission-design-lab/src/core/), [src/data/](https://github.com/oalexandrebelo/PROJETO-IPE/tree/main/experiments/mission-design-lab/src/data/), [src/workers/](https://github.com/oalexandrebelo/PROJETO-IPE/tree/main/experiments/mission-design-lab/src/workers/), [src/persistence/](https://github.com/oalexandrebelo/PROJETO-IPE/tree/main/experiments/mission-design-lab/src/persistence/), [src/lab/](https://github.com/oalexandrebelo/PROJETO-IPE/tree/main/experiments/mission-design-lab/src/lab/), [tests/](https://github.com/oalexandrebelo/PROJETO-IPE/tree/main/experiments/mission-design-lab/tests/); curadoria de `public/data/` | Confirmar baseline, explicar casos testemunha, revisar unidades e preservar contratos/replay |
| Dev B — experiência, conteúdo e distribuição | No beta: [src/ui/](https://github.com/oalexandrebelo/PROJETO-IPE/tree/main/experiments/mission-design-lab/src/ui/), CSS e [tests-ui/](https://github.com/oalexandrebelo/PROJETO-IPE/tree/main/experiments/mission-design-lab/tests-ui/); fora dele: [web/](https://github.com/oalexandrebelo/PROJETO-IPE/tree/main/web/), [context/](https://github.com/oalexandrebelo/PROJETO-IPE/tree/main/context/), documentação, apresentação e scripts de distribuição | Ensaiar jornada, corrigir barreiras observadas, consolidar biblioteca e verificar publicação estática |
| Compartilhado, um editor por vez | [src/App.tsx](https://github.com/oalexandrebelo/PROJETO-IPE/blob/main/experiments/mission-design-lab/src/App.tsx), contratos consumidos pelas duas frentes, `package.json`, lockfiles, versões, manifestos e recibo final | Negociar alteração antes de editar; Dev A define o contrato de domínio, Dev B adapta a interface; uma pessoa integra a release |

Esses papéis não exigem duas reimplementações. Dev B reutiliza os modelos do Dev A; Dev A não muda texto/fluxo incidentalmente ao corrigir o motor. Mudanças apenas visuais não devem modificar o contrato científico.

A divisão pode ser invertida conforme experiência da dupla. O importante é registrar dono do arquivo e critério de integração antes de trabalho paralelo.

## 6. Backlog inicial executável

| ID / prioridade | Responsável | Tarefa | Dependência | Aceite |
|---|---|---|---|---|
| H01 / P0 | A + B | Reproduzir a versão de partida e registrar ambiente/commit | Checkout e Node compatível | Build e testes pertinentes executados; falhas registradas com saída real; nenhum resultado histórico apresentado como execução nova |
| H02 / P0 | B, com A revisando causas | Ensaiar a jornada do guia R9: longo → curto → redesign → comparação | H01 | 6/6 → 2/6 → 6/6 nos casos documentados, dentro dos limites; hipótese própria preservada; registro de ajuda e bloqueios |
| H03 / P0 | B | Conferir teclado, foco, zoom 200%, tela estreita e fallback 2D | H01 | Objetivos essenciais completos sem arrastar, som ou manipulação do canvas; correção delimitada dos problemas encontrados |
| H04 / P0 | A | Conferir importação, versões e resultado imutável | H01 | Replay compatível recalculado; inválido recusado; mudar configuração não reutiliza resultado; falha de armazenamento comunicada |
| H05 / P0 | B + revisor A | Conferir o contexto consolidado na R12 e registrar decisões da próxima rodada | Biblioteca e handoff R12 | Índice, fontes e links conferidos; dono, objetivo e aceite da próxima tarefa registrados; cortes históricos preservados |
| H06 / P1 | B + responsável pelo produto | Observar uso com pessoas usando protocolo existente | H02–H03 | Sessões reais separadas de testes; registrar explicação, ajuda e limites; não exigir dado pessoal para a tarefa |
| H07 / P1 | A + B | Refinar um diagnóstico frequente e uma ficha de engenharia | H06 e fonte selecionada | Mensagem usa evento/unidade corretos; fato NASA separado de hipótese; verificar compreensão do trecho alterado |
| H08 / P1 | A mede; B comunica | Determinar contrato offline do beta | H01 | Testar perda de rede, sessão carregada, recarga e primeiro acesso; documentar resultado antes de propor cache/PWA |
| H09 / P2 | A, com B definindo narrativa | Especificar snapshots para futura campanha | Validação da campanha atual e contrato de dados aprovado | Proveniência, unidades, erros, ausência de dado e replay definidos; nenhuma chamada JPL concorrente |
| H10 / P2 | A + B | Prototipar campanha limitada de pequenos corpos | H09 e revisão científica | Objetivo novo explícito, poucos alvos compatíveis, critério próprio e regressão do CubeSat; não rebatizar demonstração como missão validada |

H06 depende de disponibilidade de participantes e decisões do responsável pelo produto. Enquanto isso, a dupla pode concluir H01–H05 e o ensaio técnico H08. Não inventar participantes ou resultados para destravar a próxima etapa.

## 7. Comandos existentes e o que cada um comprova

Requer Node 24 ou superior segundo os manifests; usar versões fixadas pelos lockfiles. Os comandos abaixo foram conferidos nos scripts existentes, mas **não foram reexecutados durante a redação deste handoff**. Instalação depende de rede ou cache disponível.

Na raiz do repositório, para instalar as duas árvores de dependências já existentes:

```bash
npm ci --ignore-scripts --no-audit --no-fund
npm --prefix experiments/mission-design-lab ci --ignore-scripts --no-audit --no-fund
```

Para desenvolver e verificar o beta:

```bash
npm --prefix experiments/mission-design-lab run dev
npm --prefix experiments/mission-design-lab test
npm --prefix experiments/mission-design-lab run test:ui
npm --prefix experiments/mission-design-lab run verify
```

`verify` do beta executa domínio, UI em jsdom e build com verificação de tipos. O build também regenera a pesquisa pública do beta. Após `verify` passar, não repetir testes idênticos sem mudança ou dúvida nova; seguir para o ensaio de navegador que eles não cobrem.

Para montar e inspecionar a distribuição completa:

```bash
npm run build:release
npm run test:context
npm run test:beta
npm run start:beta
```

O servidor da distribuição usa `http://127.0.0.1:4175/`. `build:release` compila o beta, monta `site/` e prepara os arquivos Vercel. `test:context` verifica a central em ambiente simulado; `test:beta` verifica a distribuição/HTTP. Esses comandos não publicam na Vercel nem comprovam produção.

Se a alteração atingir a aplicação clássica na raiz:

```bash
npm test
npm run build
```

Esse `build` recompila o clássico. Ele não substitui a compilação de [experiments/mission-design-lab/](https://github.com/oalexandrebelo/PROJETO-IPE/tree/main/experiments/mission-design-lab/). Preservar os dois alvos e rodar somente as verificações justificadas pela mudança e pelos contratos compartilhados.

## 8. Coordenação para evitar conflito

1. No início, registrar branch/commit, estado de trabalho e os arquivos atribuídos a cada pessoa. Não reverter mudanças desconhecidas ou limpar o diretório para obter uma árvore artificialmente limpa.
2. Dividir tarefas por responsabilidade e critério de aceite, não apenas por tela. Uma correção de resultado pertence ao modelo; uma mudança de rótulo pertence ao conteúdo, com revisão de unidade quando necessário.
3. Antes de mudar `MissionResult`, versões, catálogo ou persistência, Dev A escreve o contrato e impacto em Worker/replay. Dev B confirma os consumidores. Coordenar `App.tsx` com um editor de cada vez.
4. Usar commits pequenos por tarefa e branches separadas quando útil. Não sobrescrever histórico remoto; integrar a partir do estado corrente e resolver conflitos entendendo as duas mudanças.
5. Eleger um integrador por rodada. Somente ele regenera a distribuição final, biblioteca, hashes e recibos depois de integrar as fontes. Evitar que duas pessoas publiquem builds diferentes sobre a mesma URL ao mesmo tempo.
6. Encerrar cada tarefa com mudança, motivo, verificação executada, saída relevante e limite. Atualizar o documento de estado quando a proposta efetivamente virar implementação.

Novas dependências, migrações de major, banco ou serviços externos precisam de justificativa específica e autorização aplicável; não são decorrência automática dos estudos. As permissões de publicação pertencem à solicitação e ao destino autorizados pelo proprietário, não a um arquivo de handoff.

## 9. Limites NASA, ciência e desafio

As oportunidades detalhadas estão em [21 — Oportunidades NASA](21-OPORTUNIDADES-NASA.md). Para desenvolvimento:

- Mission Design atende pequenos corpos; não usar para alegar cálculo universal de missões à Lua, Marte ou suas luas. SBDB, Horizons e Mission Design são propostas de próxima campanha.
- Horizons exige época, centro, referencial, unidades e interpretação da saída. Cena ilustrativa não equivale a efeméride validada.
- JPL SSD exige consultas sequenciais, reuso/cache, identificação da aplicação e recuo após erros. Uma rota proxy não autoriza carga ilimitada.
- `DEMO_KEY` tem limite documentado de 30 requisições por IP/hora e 50 por IP/dia. Não criar dependência da rede durante uma partida se o cenário pode usar snapshot validado.
- DSN Now mostra estado atual, não agenda futura nem reserva. DONKI registra eventos/análises; o efeito na nave seria uma regra educativa distinta.
- Mars Rover Photos consta como arquivada no portal NASA; o serviço TLE de terceiro não tem vínculo oficial NASA comprovado nesta pesquisa.
- A página oficial do desafio não pôde ser carregada na pesquisa de 14/11/2026. Revalidar calendário, regras, trabalho prévio, IA, Resources e formato de submissão com fonte oficial antes de declarar elegibilidade.

Não aplicar as regras SENATRAN dos Estudos ao Space Apps. Não afirmar que publicação, logo NASA, uso de dados ou número de testes estabelecem endosso, premiação ou qualificação de voo.

## 10. Biblioteca ampliada na R12

O acervo reúne 84 documentos: inclui também os contratos de implementação das duas aplicações, especificações, kit de apresentação, documentação pública, guia das ferramentas e seis pesquisas R9–R10 do beta. Cópias geradas não entram duas vezes; licenças de terceiros permanecem nos diretórios próprios. O índice gerado registra as fontes e os hashes de cada edição.

O [gerador da biblioteca](https://github.com/oalexandrebelo/PROJETO-IPE/blob/main/scripts/build-research-library.mjs) foi ampliado para reunir o contexto de produto e de continuidade. A cobertura configurada inclui:

- Documentos de produto em `docs/`, pesquisas técnicas, pesquisas iniciais, histórico, apresentação e anexo textual, preservando os cortes de cada fonte.
- Estado e distribuição: [README.md](https://github.com/oalexandrebelo/PROJETO-IPE/blob/main/README.md), [PUBLICADO.md](https://github.com/oalexandrebelo/PROJETO-IPE/blob/main/PUBLICADO.md), [GIT-PROVENIENCIA.md](https://github.com/oalexandrebelo/PROJETO-IPE/blob/main/GIT-PROVENIENCIA.md) e [NOTICE.md](https://github.com/oalexandrebelo/PROJETO-IPE/blob/main/NOTICE.md).
- README do beta e seus cinco documentos: `GUIA-DIDATICO-R9.md`, `PESQUISA-E-DECISOES-R9.md`, `QA-R9.md`, `QA-NAVEGADOR-R9.md` e `REFINAMENTO-NASA-R10.md`. O caderno próprio em `/lab/research/` continua disponível como organização adicional.
- Seis materiais relacionados à análise dos Estudos: as três projeções históricas integrais, seu [índice de procedência](../references/estudos/README.md), a [síntese de oportunidades](24-OPORTUNIDADES-ESTUDOS.md) e este handoff. Cabeçalhos, hashes e redações distinguem o acervo de outro projeto das instruções do Ipê.

A distribuição R12 também seleciona páginas individuais de [identidade visual](23-IDENTIDADE-VISUAL.md), [oportunidades dos Estudos](24-OPORTUNIDADES-ESTUDOS.md), [handoff](25-HANDOFF-DOIS-DEVS.md) e [tipografia](26-TIPOGRAFIA.md). A síntese não substitui os documentos integrais nem converte referências em funcionalidades implementadas.

Depois de cada build, o [índice gerado da biblioteca](../context/research-library-index.json) é a evidência da cobertura efetivamente empacotada: traz data de geração, fontes, identidades e hashes. Conferir esse índice e a [biblioteca navegável](../context/research-library.html), em vez de inferir inclusão apenas porque um arquivo existe no repositório. O `PUBLICADO.md` incorporado a um build conserva o corte daquele empacotamento; o recibo corrente deve ser consultado no repositório, inclusive quando for produzido depois do build.

As projeções dos Estudos preservam os corpos históricos com contexto e redação de credencial de exemplo. Os originais pessoais não foram alterados. Nenhum ZIP, log, imagem ou aplicação apenas mencionado nos textos foi inventado ou anexado. Relatórios brutos, arquivos de ambiente, histórico privado e dados de participantes permanecem fora da seleção pública.

## 11. Fechamento de uma rodada

Uma rodada está pronta para revisão quando a dupla consegue apontar: problema resolvido; arquivos e contratos afetados; teste ou observação pertinente; fonte dos números; limitações restantes; commit que será publicado; e versão do pacote resultante.

Depois de uma publicação autorizada, verificar as rotas públicas, o carregamento do beta e a correspondência do manifesto, registrando o deployment e o commit de origem. Atualizar [PUBLICADO.md](https://github.com/oalexandrebelo/PROJETO-IPE/blob/main/PUBLICADO.md) com evidência nova; conservar o recibo anterior como histórico. Não declarar produção concluída apenas porque o build passou.

A primeira continuidade recomendada é **H01–H05: reproduzir, ensaiar, corrigir barreiras reais e conferir o contexto consolidado antes de registrar a próxima decisão**. O trabalho posterior deve seguir o que essa verificação revelar, preservando a missão atual.
