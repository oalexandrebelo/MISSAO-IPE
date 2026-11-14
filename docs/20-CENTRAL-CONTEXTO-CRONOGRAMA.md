# Central de contexto e cronograma — R8

**AB-NASA-TEAM-IPE · Missão Ipê · distribuição 0.3.0-beta.1 · 14/11/2026.** O motor educacional continua 0.1.1-rd; o catálogo continua ipe-64-v1. Esta rodada amplia documentação, navegação e planejamento. Não modifica a física ou a ciência do jogo.

## Entregas desta rodada

A [central interativa](../context/index.html) reúne visão geral, cronograma, contexto, pesquisas, matriz de temas, decisões, insights, histórico e fontes. A [biblioteca integral](../context/research-library.html) permite consultar os documentos de produto, relatórios técnicos, pesquisas iniciais, cortes históricos e roteiros de apresentação. O [Markdown integral](../context/research-library.md) serve à leitura offline e ao handoff para outra ferramenta.

O contexto é uma reconstrução documental do registro disponível. Preserva os pedidos, as decisões, os resultados observados e as limitações relevantes. Não apresenta texto inventado como transcrição de uma conversa ausente. O texto original do anexo é identificado como material fornecido, sujeito às correções da auditoria; as alegações do anexo não se tornam fatos verificados por serem republicadas.

## Por que Jogo de Missão

AB selecionou explicitamente o tema após a shortlist de oito desafios. O fundamento de produto é a afinidade entre UX Research, design de produto, dados e engenharia: criar uma experiência que deixa a pessoa formular uma hipótese, observar um resultado e redesenhar uma solução. Não houve um cálculo confiável de probabilidade de vitória por tema, país ou ferramenta.

O recorte Terra/CubeSat conecta a decisão espacial a registros de vegetação próximos a Rio Verde. Os dados MOD13Q1 têm procedência científica; massa, recursos, volumes e agenda operacional pertencem ao cenário didático. A pergunta central é entregar ciência utilizável sob restrições, com rastreabilidade suficiente para explicar uma falha. A primeira versão evita depender de terreno marciano, geometria orbital validada ou inferência de modelos para chegar ao resultado.

O histórico mundial inspira critérios de clareza, uso de dados e relevância. Ele não demonstra que uma combinação específica de stack e tema ganha o concurso. A existência de outros jogos de CubeSat também exige que o diferencial seja sustentado por causalidade, evidência, replay e experiência de aprendizagem, sem reivindicar exclusividade da categoria.

## Como usar o cronograma

O plano tem seis trilhas: base verificada; contexto e publicação; experiência e demonstração; corte de release; candidatura; evolução posterior. Cada tarefa possui responsável por função, prioridade, janela, dependências, critérios de aceite e referências de evidência. Datas são apresentadas em America/Sao_Paulo.

O alvo interno é **15/11/2026 às 08h BRT**, equivalente a 11h UTC. Ele organiza o release de software da equipe. Não representa o prazo oficial de submissão nem uma ação automaticamente agendada. A agenda local e as regras do evento devem ser conferidas pela pessoa responsável pela candidatura.

Use os filtros para separar tarefas realizadas, em andamento, bloqueadas e planejadas. A janela inicial privilegia o corte de amanhã; a opção de todas as fases inclui a pesquisa posterior. A vista em lista mantém o acesso em telas pequenas. O detalhe da tarefa expõe o motivo e o aceite exigido, evitando que uma barra temporal seja confundida com prova de execução.

**Uma data transcorrida não conclui uma tarefa.** O relógio informa o prazo, inclusive quando vencido. As contagens oficiais vêm do estado documental publicado, com corte explícito; não são telemetria de uma equipe nem sincronização com GitHub Issues.

## Marcações pessoais e persistência

As marcações pessoais são armazenadas no localStorage da origem do navegador. Elas existem para organizar a leitura e o acompanhamento individual. Não mudam o status oficial, não aprovam release e não registram uma conclusão por outra pessoa. O número de tarefas oficialmente concluídas é calculado separadamente.

A exportação produz um JSON pequeno e identificado. A importação valida formato, versão, IDs e tipos antes de substituir o estado pessoal. Entradas inválidas não devem produzir atualização parcial. O botão de limpeza afeta somente a chave dessa central; não apaga o jogo ou dados de outras páginas.

Mudar de domínio, navegador ou origem local produz outro espaço de armazenamento. Exporte suas marcações antes de mudar de ambiente. Não existe conta de usuário, API de sincronização ou backend de tarefas na central.

## Contrato dos artefatos

| Arquivo | Papel |
|---|---|
| context/project-context.json | Conteúdo editorial: capítulos, pesquisas, temas, decisões, insights, histórico e fontes |
| context/schedule.json | Tarefas, trilhas e critérios de aceite do planejamento |
| context/index.template.html | Interface e interações da central, sem biblioteca remota |
| scripts/build-context-hub.mjs | Valida e combina conteúdo e planejamento |
| context/compiled-context.json | Snapshot combinado; servido no site como context/project-context.json |
| context/index.html | Central autocontida, com o snapshot incorporado |
| scripts/build-research-library.mjs | Compõe a biblioteca pública a partir dos documentos disponíveis |
| context/research-library-index.json | Índice de fontes, hashes originais e ajustes da projeção pública |
| scripts/test-context-hub.mjs | Verifica contratos e interações em DOM simulado |
| evidence/context-qa-r8.json | Recibo da execução de QA, criado quando o teste roda |

O builder valida o grafo de dependências do plano. O payload de conteúdo não executa código. A interface não utiliza eval, handlers inline ou recursos externos obrigatórios. O cronograma não depende de chave de API, modelo de linguagem ou serviço de terceiros para calcular suas contagens.

## Biblioteca integral e procedência

Cada documento tem caminho relativo, hash SHA-256 da fonte e seu corte editorial preservado. A projeção pública remove caminhos específicos de máquinas e endpoints privados; esses ajustes são contados por documento. Relatórios anteriores que ainda descrevem Git como pendente permanecem como registros históricos, não como diagnóstico atual do acesso.

O arquivo bruto de análise AB-R3A continua no repositório privado e no pacote completo. A árvore pública contém apenas as projeções destinadas à leitura. Documentação integral não significa publicar credenciais, estado de autenticação ou material de outros projetos AB.

## Publicação e Git

O repositório privado **oalexandrebelo/AB-NASA-TEAM-IPE** foi fornecido por AB, confirmado com acesso de escrita e inicializado pelo conector autorizado. O bootstrap remoto foi registrado em 94d2b6053c37751f5bee9fd3071ff732ecd0b80e. O recibo final registra a importação completa e a árvore remota conferida.

A importação pela API do GitHub produz commits remotos com metadados próprios. O histórico local anterior é preservado em Git bundle; não se afirma identidade entre o SHA de um commit local e o SHA criado pelo conector. Não há force-push ou sobrescrita de um histórico remoto preexistente.

O portal Vercel mantém a URL https://ab-nasa-team-ipe.vercel.app/ . A publicação dessa rodada recebe recibo próprio com commit de origem, manifesto, deployment e verificações HTTP. A referência R6 é uma versão anterior já publicada, útil para recuperação.

## Sequência de reprodução e handoff

Em um checkout com as dependências de desenvolvimento disponíveis:

```bash
node scripts/build-context-hub.mjs
node scripts/build-research-library.mjs
node scripts/test-context-hub.mjs
node architecture/build-model.mjs
node --import ./architecture/offline-guard.mjs architecture/vendor/archify/renderers/architecture/render-architecture.mjs architecture/runtime.architecture.json architecture/runtime.html
node --import ./architecture/offline-guard.mjs architecture/vendor/archify/renderers/architecture/render-architecture.mjs architecture/runtime.architecture.json architecture/runtime.html --layout-json > architecture/runtime.layout.json
node architecture/build-page.mjs
node scripts/build-beta-site.mjs
node scripts/prepare-vercel-static.mjs
node architecture/check-map.mjs
node scripts/test-beta-site.mjs
node scripts/serve-beta.mjs
```

Build documental, preparação de distribuição e servidor usam Node nativo. QA DOM e inspeção AST exigem as dependências fixadas no lockfile. O build estático não recompila o motor: uma alteração em src exige o build e os testes próprios do jogo antes de distribuir dist.

Os arquivos gerados de contexto, biblioteca, configuração CSP e recibos posteriores ficam fora do inventário de hashes de fontes da arquitetura para evitar ciclos. O mapa continua identificando seus geradores e relações de leitura. A fonte editorial e o template entram no inventário.

## Limites que precisam acompanhar a entrega

Os testes DOM verificam comportamento funcional delimitado. Não provam legibilidade em um projetor, qualidade da navegação por leitor de tela, desempenho em celular, impressão física ou aprendizagem. A distribuição HTTP verifica rotas e bytes, não a execução completa em um navegador real.

A candidatura ao Space Apps continua separada da publicação de P&D. A orientação sobre trabalho anterior ao início oficial e a qualificação dos Resources precisam ser resolvidas por quem cuida da candidatura. A central não envia projeto, não contata organizadores e não registra aprovação institucional.

O cronograma é um instrumento de execução. A aceitação final exige uma pessoa responsável, uma versão identificada e evidência compatível com a alegação feita.
