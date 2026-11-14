# PRT — Plano de Requisitos Técnicos do PROJETO IPÊ

Este PRT transforma o escopo de produto em contratos verificáveis para o beta educacional. **A meta científica permanece 6/6 registros completos e válidos, respeitando todas as restrições do motor.** Os quatro níveis acrescentam objetivos de engenharia; nenhum deles reduz a qualidade científica exigida.

Referência: 14/11/2026, base de implementação R9–R10. Fontes de autoridade: [PRD](PRD.md), [contratos TypeScript](../src/core/contracts.ts), [catálogo](../src/core/catalog.ts), [contrato de implementação](../specs/IMPLEMENTATION-CONTRACT.md) e [refinamento NASA](REFINAMENTO-NASA-R10.md). A arquitetura e os fluxos estão em [ARQUITETURA](ARQUITETURA.md) e [FLOWCHARTS](FLOWCHARTS.md).

## 1. Escopo de entrega

| Área | Beta local | Evolução proposta |
|---|---|---|
| Campanha | Quatro níveis sobre `long-contact` e `short-contact`; seis escolhas binárias | Novas campanhas somente com novos contratos e evidência científica. |
| Cálculo | Motor `0.1.1-rd`, catálogo `ipe-64-v1`, enumeração de 64 configurações | Incerteza, contingências e propagação orbital exigem modelos separados. |
| Dados | Seis registros históricos Terra/MODIS MOD13Q1 Collection 061 empacotados | Outros instrumentos/datasets precisam de validação e proveniência próprias. |
| Persistência | IndexedDB para rascunho e snapshots; diário no navegador | Prisma/PostgreSQL para sync opcional, descrito mas não conectado. |
| Identidade | Execução sem conta, sem cadastro pessoal | Identidade pseudônima e autorização de servidor a implementar antes de sync. |
| Distribuição | Aplicação estática com build para GitHub/Vercel | Publicação comprovada por recibo, URL e commit; arquivo de configuração não prova deploy. |
| Evidência educacional | Prever, executar, explicar e redesenhar; registro local | Estudo com participantes e educadores para avaliar transferência e compreensão. |

O nível didático é um contrato de conteúdo, não um novo `ScenarioId`. Lançador, órbita e agenda base continuam fixos. O laboratório físico é uma experiência independente.

## 2. Contrato dos quatro níveis

Todos os níveis usam até 3,6 kg, até 86 créditos, 10.800 segundos simulados e o mesmo pacote de seis registros. A conclusão exige uma execução própria concluída no nível, com a configuração registrada no resultado e o gate correspondente. Importação, mudança de componente depois da execução ou aplicação de uma sugestão não contam como nova execução.

| ID | Nível e condição inicial | Critério técnico de conclusão | Erro que o feedback deve revelar |
|---|---|---|---|
| N1 | **Primeiro sinal**; contato longo e configuração inicial do catálogo | `result.outcome === "success"` no cenário longo | Entrega, massa/créditos e demais restrições são verificados em conjunto. |
| N2 | **Memória em disputa**; contato longo, começando com memória compacta | Sucesso do motor **e** `result.config.buffer === "compact"` | Trocar para memória grande pode resolver a ciência, mas não atende o desafio de 512 Mbit. |
| N3 | **Janela estreita**; contato curto e preservação das bandas | Sucesso do motor **e** `result.config.processing === "bands"` | Processar o índice a bordo não atende a necessidade de manter bandas para o solo neste nível. |
| N4 | **Ciência que chega**; contato curto, projeto inicial com bateria grande e ÍNDICE, que entrega 6/6 a 84 créditos | Sucesso do motor **e** `result.credits <= 78` | Estar dentro do envelope global de 86 não garante atender à meta adicional de 78. |

O gate usa exclusivamente o resultado executado e sua configuração. Um motor com sucesso e gate pendente precisa de feedback específico, preservando o significado do sucesso científico. A regra do nível não pode mudar `result.outcome`, `requiredRecords` ou o catálogo.

As testemunhas abaixo foram recalculadas com o motor real em Node 24.22.1 em 14/11/2026. Todas produziram `outcome = "success"`, 6/6 e aprovação no gate do nível. A base é `DEFAULT_CONFIG`: bateria pequena, painel padrão, BANDAS, rádio econômico, memória grande e todos os contatos; a tabela declara cada alteração.

| Nível | Alterações em relação a `DEFAULT_CONFIG` | Massa | Créditos |
|---|---|---|---|
| N1 | Nenhuma | 3,05 kg | 71 |
| N2 | `battery=large`, `processing=index`, `buffer=compact` | 3,40 kg | 81 |
| N3 | `battery=large`, `panel=compact`, `radio=fast` | 3,40 kg | 79 |
| N4 | `battery=large`, `panel=compact`, `processing=index` | 3,20 kg | 78 |
| N4, alternativa | As três mudanças acima e `buffer=compact` | 3,10 kg | 75 |

A busca contextual foi também executada: 64/64 configurações em cada nível, nenhuma indeterminação e, respectivamente, **17, 6, 1 e 2 soluções elegíveis**. As distâncias mínimas a partir do projeto inicial de cada nível foram 0, 2, 3 e 1. Essa contagem descreve o catálogo fechado; não é probabilidade de sucesso nem prova de aprendizagem.

## 3. Requisitos funcionais e critérios de aceite

| ID | Requisito | Aceite observável | Local de responsabilidade |
|---|---|---|---|
| RF-01 | Mostrar objetivo científico, destinatário narrativo e limites antes das escolhas | Briefing distingue arquivo histórico de relógio simulado e explicita 6/6. | UI de briefing/plano da missão |
| RF-02 | Apresentar seis subsistemas com duas opções cada | As escolhas formam exatamente 64 tuplas; massa/créditos derivam do catálogo. | `core/catalog.ts`, hangar |
| RF-03 | Exigir previsão e justificativa antes de executar | Sem previsão ou justificativa válida, execução não começa; edição pede revisão da previsão. | `App`, diário pedagógico |
| RF-04 | Executar a configuração congelada | Resultado contém as escolhas/cenário de início da tentativa, mesmo após eventos assíncronos. | `App`, `workers/`, `core/` |
| RF-05 | Distinguir sucesso, falha e projeto inválido | Uma configuração inválida com 6/6 continua inválida. | Motor e relatório |
| RF-06 | Entregar quatro níveis verificáveis | Os quatro gates da seção 2 passam com testemunhas próprias e rejeitam contraexemplos. | Camada didática e testes |
| RF-07 | Explicar previsão versus resultado | Relatório permite citar evento/regra e visualizar energia, fila e dados transmitidos. | Relatório, caderno |
| RF-08 | Mostrar revisão prévia sem prometer sucesso | Teto de comunicação, memória e potência têm hipóteses declaradas; energia temporal é calculada na execução. | `lab/preflight.ts`, UI |
| RF-09 | Mostrar matriz de requisitos | Estados atendido/não atendido/não concluído refletem execução completa ou encerramento precoce. | Análise de resultado |
| RF-10 | Liberar ajuda depois de tentativa própria no contexto permitido | Replay importado não libera ajuda que depende de previsão própria; ajuda informa se atende ao nível. | Coordenação e trilha |
| RF-11 | Aplicar sugestão como novo projeto | Aplicar não altera o resultado anterior nem lança automaticamente; exige previsão e execução. | Hangar e comparação |
| RF-12 | Comparar missões com limites causais | Avisar quando cenários ou várias escolhas diferem; não atribuir causalidade isolada sem suporte. | Comparação |
| RF-13 | Usar somente ciência entregue | Comparação temporal requer par completo e válido; ausência de dado não é preenchida com o valor do pacote. | `lab/science-return.ts` |
| RF-14 | Salvar e restaurar localmente | Snapshot íntegro e rascunho revisionado; falha de armazenamento mantém resultado na sessão. | `persistence/store.ts` |
| RF-15 | Exportar e importar replay verificável | Formato/versões/hashes validados; importação recalculada; arquivo inválido preserva resultado anterior. | `persistence/replay.ts` |
| RF-16 | Oferecer laboratório independente | Alterar órbita, foguete ou rádio do laboratório não altera o projeto da campanha. | `lab/`, UI do laboratório |
| RF-17 | Preservar acesso ao conteúdo essencial sem 3D | Todos os controles e resultados essenciais permanecem no DOM e no fallback 2D. | UI e cena |

## 4. Requisitos numéricos e científicos

| ID | Invariante | Evidência de verificação |
|---|---|---|
| RC-01 | Seis registros são necessários; uma recepção parcial não conta como entrega. | Testes de ciência, transmissão e cenários de fronteira. |
| RC-02 | Energia e potência têm unidades e condições próprias. | Testes de pico, reserva, eficiência, saturação e residual de energia. |
| RC-03 | Bits gerados são contabilizados entre recebidos, perdidos e fila. | Asserções de conservação em todo o catálogo e casos adversariais. |
| RC-04 | Integração depende de eventos/tempo simulado, não de frames. | Comparação com oracle independente e teste de fronteiras de operação. |
| RC-05 | Dados históricos preservam escala, bandas, QA e datas de observação. | Testes de procedência e identidade dos arquivos de `public/data`. |
| RC-06 | Sucesso exige todas as restrições do motor. | Testemunhas inválidas que entregam 6/6 devem permanecer inválidas. |
| RC-07 | Busca só certifica mínimo com domínio completo e nenhuma indeterminação relevante. | 64/64 avaliados, contagens consistentes, cancelamento sem selo de mínimo. |
| RC-08 | Hashes e replay são ligados a versões e pacote científico. | Rejeição de schema/motor/catálogo/pack incompatíveis; recálculo com o motor da versão. |
| RC-09 | Números usados em um gate vêm do resultado, não da UI editável. | Contraexemplos de edição após execução e de replay importado. |
| RC-10 | O retorno NDVI é descritivo e condicionado a dados recebidos. | Nenhum par incompleto aparece como comparação válida; nenhuma atribuição causal ambiental automática. |

## 5. Requisitos não funcionais

| ID | Requisito | Critério de aceite ou limite |
|---|---|---|
| RNF-01 | Build reproduzível | `npm ci`; `npm run verify` passa em Node 24 com lockfile preservado. |
| RNF-02 | Isolamento do domínio | `src/core` não importa UI, Three, Prisma, rede ou SDK de IA. |
| RNF-03 | Responsividade da execução | Worker quando disponível; cancelamento e respostas obsoletas protegidos. Medidas de tempo em dispositivos-alvo ainda precisam de benchmark. |
| RNF-04 | Alternativa de renderização | Falta de WebGL não impede projetar, executar, investigar e exportar. QA de GPU tem recibo próprio. |
| RNF-05 | Acessibilidade | Navegação e resultados em DOM, foco revisável, controles nomeados, movimento reduzido. Conformidade WCAG completa depende de auditoria específica. |
| RNF-06 | Concorrência de rascunho | Compare-and-swap atômico; segunda aba com revisão antiga recebe conflito. |
| RNF-07 | Integridade de importação | Até 1 MiB, profundidade 20, parser estrito e recálculo; sem execução/fetch de conteúdo importado. |
| RNF-08 | Minimização de dados | Sem cadastro obrigatório, analytics adicional ou coleta de nome, idade, escola/localização do jogador. |
| RNF-09 | Falha explícita | Erro local/rede/Worker não produz sucesso silencioso, mínimo falso ou descarte injustificado do último resultado. |
| RNF-10 | Rastreabilidade de publicação | URL, commit e status real do deploy registrados; build e publicação têm evidências distintas. |
| RNF-11 | Portabilidade | Assets científicos e documentação acompanham `dist/`; comportamento offline a frio é declarado apenas quando testado. |
| RNF-12 | Compatibilidade cloud futura | CLI Prisma 7.10.1 valida schema; client/adapter/serviço precisam de teste separado antes de integração. |

Não se fixa uma meta de FPS ou latência sem perfil de dispositivo e medição. O gate do beta exige fluxo utilizável e sem bloqueio indevido; metas quantitativas de desempenho devem vir de benchmark registrado, com navegador, hardware e condições.

## 6. Contratos de dados e segurança

A entrada científica aceita somente as seis chaves de `MissionConfig`, valores do catálogo e um dos dois cenários conhecidos. O resultado v1 preserva observações, eventos, trace, violações, balanço energético e contadores de bits como strings decimais. Datas reais do pacote nunca são derivadas do relógio simulado.

O armazenamento local preserva snapshots; o rascunho permanece editável e revisionado. Importação é uma fronteira de confiança: deve rejeitar estrutura inválida antes de aplicar estado, conferir identidade e recalcular. Hashes não servem como assinatura de autoria ou credencial.

O [schema Prisma](../prisma/schema.prisma) propõe versões de campanha/nível/projeto, identidade pseudônima, sessões, execuções, previsões, decisões, reflexões, proveniência e progresso. **A existência do schema não significa que esses dados sejam enviados para um servidor.** Os tipos, índices, exclusão, retenção e protocolo de sync estão descritos no [README Prisma](../prisma/README.md).

Para ativar a proposta cloud serão obrigatórios: autenticação do contexto, owner resolvido no servidor, autorização por sessão, chaves de idempotência, comparação de conteúdo em retries, validação de cada DTO, reexecução, proteção contra alteração de evidências e testes de exclusão. RLS requer migração SQL e testes específicos. Credenciais ficam no servidor; nenhum dado de conexão entra no bundle ou em `VITE_*`.

Textos de previsão e reflexão continuam locais por padrão. O piloto cloud proposto usa campos opcionais para texto, expiração explícita e expurgo; essas medidas ainda precisam de implementação. Não se infere anonimização a partir de um pseudônimo nem se acrescenta coleta de dados infantis para habilitar a campanha.

## 7. Estratégia de verificação e gates de entrega

| Gate | Verificação necessária | O que permite afirmar |
|---|---|---|
| G0 — Contrato | Revisão das seis escolhas, ciência 6/6, dois cenários, quatro níveis e fontes | Escopo coerente e requisitos rastreáveis. |
| G1 — Domínio | `npm test`, oracle e testes adversariais, inclusive testemunhas e contraexemplos dos níveis | Regras verificadas nos casos cobertos. |
| G2 — Jornada | `npm run test:ui` com motor real e armazenamento simulado | Fluxos DOM automatizados; sem inferir GPU ou foco real. |
| G3 — Build | `npm run build`, artefato `dist/` e documentação/dados presentes | Frontend compilado com tipos e assets. |
| G4 — Navegador | Fluxo N1→N4, teclado/foco, fallback/3D, importação/exportação e comportamento de armazenamento | Funcionamento observado nos ambientes registrados. |
| G5 — Distribuição | Verificação da URL implantada e associação ao commit; smoke test no destino | Beta publicado no endereço informado. |
| G6 — Avaliação educacional | Sessões com público, tarefas e protocolo de evidência | Somente os resultados de aprendizagem efetivamente observados. |
| GC — Cloud opcional | Schema + client compilado + migração revisada + ownership + retries + expurgo | Persistência cloud apta ao piloto, se todos passarem. Não é requisito para jogar o beta local. |

O registro R10 documenta 101 testes de domínio/física/proveniência e 9 testes UI da base. A integração dos quatro níveis deve acrescentar seu próprio recibo, sem reutilizar essa contagem como se cobrisse mudanças posteriores. A coordenação deve atualizar a evidência final após executar a suíte da entrega.

## 8. Riscos técnicos e respostas

| Risco | Resposta de projeto | Sinal de que precisa de trabalho adicional |
|---|---|---|
| Jogador confunde sucesso científico e objetivo do nível | Feedback separado, gate baseado em `result.config` e testes com contraexemplos | N2 aceita memória grande; N3 aceita ÍNDICE; N4 aceita 79–86 créditos. |
| Cena visual sugere física não modelada | Cena conceitual e laboratório separados do motor | Texto ou UI afirma órbita/cobertura operacional do CubeSat. |
| Busca oferece alternativa incompatível com o nível | Filtrar pelo gate e declarar o objetivo da busca contextual | Alternativa científica válida é apresentada como conclusão do nível sem passar seu critério. |
| Falha local apaga evidência | Preservar resultado em memória e permitir exportação | Erro de quota remove a tela ou sobrescreve execução existente. |
| Progresso importado é tratado como aprendizagem | Origem explícita, previsão própria e critérios observáveis | Replay completa automaticamente uma tarefa que exige decisão anterior. |
| Backend prematuro aumenta exposição e custo | Camada cloud opcional, sem conexão no beta | Credencial no cliente, sync automático ou conta obrigatória sem necessidade. |
| Mudança de versão quebra replay | Pin de versões e rejeição clara; migração explícita em novo formato | Importação aceita versão desconhecida e exibe resultado antigo como recalculado. |

## 9. Handoff técnico

O próximo responsável deve partir de `package-lock.json`, contratos e testes existentes. Mudança que altera a física, dataset ou formato de replay exige nova identidade de versão e revisão dos resultados de referência. Mudança puramente didática pode criar revisão da trilha sem tocar no motor, desde que preserve o significado de `outcome` e as evidências de cada tentativa.

O pacote inclui [arquitetura](ARQUITETURA.md), [fontes Mermaid](../diagrams/), [schema Prisma](../prisma/schema.prisma) e [instruções de validação do schema](../prisma/README.md). O recibo final deve distinguir implementado, executado em teste, observado no navegador, publicado e proposto. Autoria de código assistida por IA, arquivos NASA e sucesso na simulação não estabelecem certificação, endosso institucional, validação de voo ou elegibilidade competitiva.
