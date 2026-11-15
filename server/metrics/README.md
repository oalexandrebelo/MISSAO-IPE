# Métricas privadas · contrato R21

`api/metrics.mjs` é a entrada Node da Vercel. O build deve incluir os motores TypeScript e os arquivos científicos importados por `model.mjs`; não publique o código servidor como um arquivo estático. Não há dependência nova.

## Acesso e dados

- `BLOB_STORE_ID` identifica o armazenamento privado. A autenticação do Blob usa exclusivamente a identidade temporária OIDC da Vercel, consultada a cada operação no contexto do runtime, arquivo de token rotativo ou `VERCEL_OIDC_TOKEN`. O código não aceita tokens enviados pelo navegador e não usa credencial estática de Blob. `METRICS_SIGNING_SECRET` e `METRICS_ADMIN_SECRET` existem somente no servidor e precisam de pelo menos 32 caracteres aleatórios. Nunca os inclua em assets, exemplos públicos ou recibos.
- O participante informa nome e e-mail e recebe um identificador aleatório. A identidade é **autodeclarada**, sem verificação de e-mail. Repetir o e-mail em outro navegador cria outra participação; não recupera dados.
- O cookie de participante dura 30 dias; o da equipe, oito horas. Ambos são `HttpOnly`, `Secure`, `SameSite=Strict`, restritos a `/api/metrics`. Sair apaga o cookie do navegador; não revoga uma cópia previamente roubada do token. Rotacionar o segredo de assinatura invalida todos os cookies.
- Nome e e-mail ficam no registro privado de perfil, nunca no nome do arquivo. Eventos não aceitam texto livre, justificativas ou identidade fornecida pelo cliente.
- O adaptador solicita exclusão automática de cada objeto após 90 dias pela opção TTL do Blob. O provedor avalia a expiração diariamente à meia-noite UTC, podendo excluir ao longo do 91º dia. Esse período começa na gravação de cada objeto; um evento posterior pode sobreviver ao perfil. O dashboard não deve inventar uma identidade para um perfil já expirado.
- Não há endpoint público para listar jogadores nem recuperação por e-mail. Não existe exportação automática para marketing.

## API

`POST /api/metrics` recebe JSON. A origem precisa ser uma das origens do jogo ou o host de implantação informado pela Vercel. No teste local explícito, `createMetricsHandler({development:true,...})` aceita localhost e omite `Secure`.

| Ação | Corpo / resposta |
| --- | --- |
| `register` | `{action,name,email}` → `{sessionId,name,startedAt}`, com cookie de participante. |
| `events` | `{action,sessionId,events}` → `{acceptedIds,rejected:[{id,reason}]}`; 1–20 eventos, até 32 KiB por pedido. |
| `logout` | `{action,sessionId}` → `{ok:true}`, removendo cookie do participante. |
| `admin-login` | `{action,secret}` → `{ok:true}`, com cookie separado da equipe. |
| `admin-logout` | `{action}` → `{ok:true}`, removendo cookie da equipe. |

`GET ?action=session` retorna `{session:{sessionId,name,startedAt}|null}`. `GET ?action=admin&cursor=...` exige cookie da equipe e retorna `{profiles,events,cursor,hasMore}`. Cada página contém até 100 objetos ao todo. O consumidor deve seguir o cursor, deduplicar registros pelo identificador e declarar quando os números representam apenas páginas carregadas. Não há total geral antecipado.

Cada evento contém `{id,kind,mission,at,payload}`. `at` é o relógio declarado pelo cliente; `receivedAt` é atribuído pelo servidor. `batchId` e `receivedOrder` preservam a ordem de respostas de um mesmo lote, inclusive quando o relógio do servidor retorna o mesmo milissegundo. As missões são `cerrado`, `bennu` e `telescope`.

O `sessionId` do corpo precisa coincidir com o cookie. Se outra aba iniciou uma nova participação, envios e saídas da aba anterior retornam `409`, sem atribuir eventos ou apagar o cookie da pessoa nova. A fila antiga permanece associada ao identificador antigo.

- `attempt`: `{attemptId,status,config,scenarioId?}`. `status`: `completed`, `cancelled` ou `error`. O Cerrado exige o cenário; expedições o omitem. Para `completed`, o servidor executa novamente o motor original, preservando versão, diagnóstico, unidades e contagens. Não aceita um resultado calculado pelo cliente.
- `decision`: `{key,from,to}`; todos os valores devem existir no catálogo da missão e a escolha deve mudar.
- `assessment`: `{question,answer,questionVersion:1}`. `prediction` usa `more/same/less`, com gabarito derivado do experimento guiado real; `interpretation` usa `evidence/overclaim/missing`. O servidor retorna `result:{correct,expected}`.
- `inspection`: `{target,eventId?}`, para instrumento, energia, comunicação, evidência ou comparação. Mede a interação declarada, não compreensão.
- `role_review`: `{roles,count}`; papéis `launch/space/ground/user`. Mede preenchimento, não qualidade científica de texto.

## Integridade e limites

Arquivos são imutáveis. Tentativas usam `attemptId` como chave; eventos restantes usam `id`. Reenviar a mesma ação não aumenta a contagem. Um novo `attemptId` conta outra execução mesmo com configuração igual. Alterar a carga sob a mesma chave é rejeitado. Se a conexão cai após parte de um lote, o cliente mantém o lote pendente e reenvia: não deve confirmar gravação sem `acceptedIds`.

Os resultados da missão são recalculados no servidor, mas a ocorrência de cliques e respostas continua declarada pelo navegador. Isso não é uma classificação imune a manipulação nem um estudo de aprendizagem. Primeira resposta, revisões, sucesso operacional, falha técnica de execução e restrição de engenharia são medidas diferentes.

O limite por endereço é apenas uma proteção por instância aquecida, sem coordenação entre funções. Uma implantação com tráfego aberto elevado precisa de controle de abuso distribuído. A API não registra segredos ou corpos nos logs e não implementa um coletor de navegação geral.

O armazenamento usa a API REST 13 verificada no código oficial em 15/11/2026: [API](https://github.com/vercel/storage/blob/main/packages/blob/src/api.ts), [helpers](https://github.com/vercel/storage/blob/main/packages/blob/src/helpers.ts), [put](https://github.com/vercel/storage/blob/main/packages/blob/src/put.ts), [list](https://github.com/vercel/storage/blob/main/packages/blob/src/list.ts) e [get](https://github.com/vercel/storage/blob/main/packages/blob/src/get.ts). A leitura da identidade segue o [contexto oficial](https://github.com/vercel/vercel/blob/main/packages/oidc/src/get-context.ts) e as [fontes OIDC](https://vercel.com/docs/oidc). Não há renovação local automática por credenciais da CLI; um token local expirado precisa ser atualizado pelo operador. Leituras são construídas no host privado exato do store; URLs recebidas da listagem nunca são seguidas. Redirecionamentos não são aceitos.

Verificação local: `node --experimental-strip-types --test tests/metrics-server.test.mjs`. Testes cobrem isolamento, cookies, origem, rejeição de resultados forjados, motores das três missões, idempotência, correção de respostas, paginação e falha de armazenamento. A publicação precisa ainda verificar o armazenamento real e a função implantada; mocks não constituem essa evidência.

## Verificação HTTP e limpeza de teste

`scripts/verify-metrics-r21.mjs --dry-run` verifica as três configurações sem rede. Para uma implantação autorizada, execute `node --experimental-strip-types scripts/verify-metrics-r21.mjs https://projeto-ipe.vercel.app /tmp/ipe-r21-metrics-smoke.json`. A chave administrativa deve existir apenas em `/tmp/ipe-r21-admin.txt`; o programa a lê em memória. Ele cria um perfil identificado como teste e três tentativas, verifica autenticação, isolamento, paginação, reenvios e resultados recalculados. Não mede aprendizagem humana. O recibo não contém nome, e-mail, cookies ou chave; `cleanupPaths` registra os quatro objetos exatos antes das gravações de eventos, permitindo limpar também uma execução incompleta.

A validade de 90 dias no JSON do perfil é somente uma declaração da aplicação. Antes da limpeza, `node --experimental-strip-types scripts/verify-metrics-r21.mjs --retention /tmp/ipe-r21-metrics-smoke.json` consulta, com OIDC gerenciado, os [metadados oficiais do Blob](https://github.com/vercel/storage/blob/main/packages/blob/src/head.ts). O teste exige `expiresAt − uploadedAt` entre 90 e 91 dias nos quatro objetos, devido à avaliação diária do provedor, e registra a evidência no recibo. Sem essa resposta, o recibo declara a retenção do provedor como não verificada.

A [CLI oficial](https://vercel.com/docs/cli/blob) usa OIDC por padrão em projeto vinculado com store conectado. Para a limpeza, o operador deve confirmar que o projeto/store são os desta implantação e que OIDC está disponível, sem credencial estática de fallback. Execute `vercel blob delete <pathname> --yes` apenas para cada um dos caminhos de `cleanupPaths`; não use `empty-store`, exclusão por prefixo, nem remova registros de participantes reais. Confira posteriormente a ausência desses quatro caminhos. A limpeza é uma operação separada e não é executada pelo script HTTP.

**Ambiente da identidade temporária:** em 15/11/2026, a CLI 65.8.0 executada com `env run --environment production` carregou as variáveis de produção, mas emitiu uma identidade OIDC com `environment=development`. O Blob conectado somente à produção recusou corretamente a leitura com HTTP 403 (`oidc_environment_not_allowed`), nas APIs 12 e 13. O argumento de seleção de variáveis não promove a identidade local. O smoke autentica a equipe e confirma leitura do Blob pela Function em produção antes de criar qualquer perfil. A consulta local de retenção e a limpeza requerem um ambiente OIDC permitido; não adicionar acesso a outro ambiente nem substituir a credencial como solução automática para uma recusa.
