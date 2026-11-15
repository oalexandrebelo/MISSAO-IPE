# R23 — domínio próprio e métricas Cloudflare

Infraestrutura verificada em **15/11/2026, 14:57 UTC**. [Recibo de domínio e Cloudflare no repositório](https://github.com/oalexandrebelo/MISSAO-IPE/blob/main/evidence/domain-cloudflare-r23.json).

## Estado real

O endereço `nasa-missaoipe.alexandrebelo.com` foi associado ao projeto principal `missao-ipe` na Vercel, para produção, sem redirecionamento. A Vercel confirmou a propriedade (`verified: true`). O endereço anterior `projeto-ipe.vercel.app` continua associado ao mesmo projeto. A LP separada não foi alterada.

**O DNS já foi configurado e propagado.** A criação do CNAME pelo painel Cloudflare foi confirmada por consulta independente ao servidor autoritativo e aos resolvedores públicos `1.1.1.1` e `8.8.8.8`. A Vercel informa `configuredBy: CNAME`, `misconfigured: false` e ausência de conflitos. Entre 14:54 e 14:57 UTC, todas as cinco páginas da tabela abaixo responderam `200` por HTTPS válido; a API administrativa respondeu `401` sem autenticação. A sequência completa passou no IP público `64.29.17.65`. No outro IP, houve respostas válidas e timeouts intermitentes. O resolvedor local do Mac ainda conservava a resposta negativa anterior, portanto as verificações HTTPS usaram os IPs do DNS público com `curl --resolve`, preservando a validação de certificado. Isso comprova certificado e rotas no endereço novo, mas ainda não a estabilidade por todos os resolvedores/rede local.

A configuração DNS foi feita no painel autenticado da Cloudflare, pois não havia conector de gerenciamento ou sessão de CLI disponível para esta tarefa. Nenhum segredo foi lido ou incluído no repositório. O site também foi cadastrado no Web Analytics por esse mesmo painel. A instalação do beacon e a confirmação de recepção dos dados dependem da publicação R23.

## Configuração DNS exata

Registro criado na zona **alexandrebelo.com**, sem alterar registros adjacentes:

| Campo | Valor |
| --- | --- |
| Tipo | `CNAME` |
| Nome | `nasa-missaoipe` |
| Destino | `0bff73f6b8f9144a.vercel-dns-017.com` |
| Proxy | **Somente DNS / DNS only** |
| TTL | Automático |

O destino acima veio da recomendação de maior prioridade da API da Vercel para **este projeto e este hostname** em 15/11/2026. Reconsultar a Vercel se a configuração ocorrer em outra data. Não alterar os servidores de nomes, registros de e-mail, raiz do domínio, outros subdomínios ou os domínios da LP. Não é necessário comprar domínio, hospedar o jogo novamente na Cloudflare ou ativar seu proxy para utilizar Web Analytics.

## Um endereço para o jogo e a equipe

Caminhos que responderam no novo hostname com TLS válido (a funcionalidade R23 ainda depende da nova publicação):

| Área | Caminho no novo endereço |
| --- | --- |
| Entrada principal | `/` |
| Laboratório / três missões científicas | `/lab/index.html` |
| Pitch | `/presentation/pitch/index.html` |
| Links da equipe | `/equipe/index.html` |
| Painel privado | `/dashboard/index.html` |
| Registro e resultados privados | `/api/metrics` |

Todos devem usar a mesma origem. A R23 já adicionou `https://nasa-missaoipe.alexandrebelo.com` à lista explícita `PRODUCTION_ORIGINS` em `server/metrics/handler.mjs`, preservando as origens anteriores, e acrescentou o caso correspondente em `tests/metrics-server.test.mjs`. Essa correção precisa estar na publicação servida pelo novo hostname. A aceitação final ainda requer uma gravação privada no ambiente publicado; teste local não comprova a persistência em produção.

Os cookies são restritos ao hostname em que foram emitidos e a `/api/metrics`, com `HttpOnly`, `Secure` e `SameSite=Strict`. Um cookie criado em `projeto-ipe.vercel.app` não aparece automaticamente no domínio novo. O armazenamento privado é o mesmo; mudar o hostname não copia a sessão do navegador e não deve motivar a exposição de tokens na URL. O painel exige nova autenticação no novo endereço.

## Separação das métricas

| Pergunta | Sistema responsável |
| --- | --- |
| Quantas visitas chegaram e como a página carregou no celular? | Cloudflare Web Analytics, após ativação e validação |
| Qual decisão o jogador tomou, qual tentativa terminou e qual foi a pontuação? | API própria e Vercel Blob privado já existentes |
| Quem é o participante e qual seu e-mail? | Somente o armazenamento e painel privados |
| Houve aprendizado comprovado em pessoas? | Avaliação e testes com participantes; não inferir de visitas nem de testes automatizados |

Não enviar nome, e-mail, respostas abertas, hipóteses, identificadores de sessão, cookies nem chave administrativa ao beacon. Não colocar esses valores em URL, título da página ou eventos públicos. Não instrumentar o painel administrativo com analytics externo. Cloudflare Web Analytics não substitui a persistência dos eventos do jogo nem garante que todos os visitantes serão contados: bloqueadores, ausência de rede e políticas do navegador podem impedir o beacon.

## Ativação de Web Analytics

O site `nasa-missaoipe.alexandrebelo.com` já foi criado em **Web Analytics** e o token público do beacon foi obtido pelo responsável da integração. O painel autenticado da equipe é [Cloudflare Web Analytics — MISSÃO IPÊ](https://dash.cloudflare.com/d64af6bb2dd0607566aed9f467eea464/web-analytics/overview?siteTag~in=c9b4c50132194ef29aa7e269794dee86&excludeBots=Yes). A chave desse snippet é pública e específica do site; ela não é um API token de gerenciamento. **O cadastro do site não confirma coleta: a recepção de dados ainda precisa ser verificada depois da publicação R23.** O procedimento oficial permite instalação manual em sites sem proxy Cloudflare. [Documentação de configuração](https://developers.cloudflare.com/web-analytics/get-started/).

A integração deve usar o snippet real emitido pelo painel, sem um token inventado, e carregar somente nas páginas públicas do hostname configurado. Evitar injeção automática e manual simultâneas, pois duplicariam a coleta. Para a política de conteúdo atual, autorizar de forma específica:

```text
script-src: adicionar https://static.cloudflareinsights.com
connect-src: adicionar https://cloudflareinsights.com
```

Preservar as demais diretivas; não liberar curingas, `unsafe-eval` ou scripts inline por causa do analytics. O beacon oficial usa `https://static.cloudflareinsights.com/beacon.min.js` e, sem proxy Cloudflare, envia a `https://cloudflareinsights.com/cdn-cgi/rum`. As métricas de experiência podem ser enviadas ao ocultar a página pela primeira vez. [Origem e coleta](https://developers.cloudflare.com/web-analytics/data-metrics/data-origin-and-collection/) · [Política de conteúdo](https://developers.cloudflare.com/fundamentals/reference/policies-compliances/content-security-policies/).

O rastreamento automático de navegação em SPA pode ser desativado com a opção pública `spa: false` no snippet manual se a navegação carregar parâmetros de projetos. Antes de habilitar, conferir as URLs reais emitidas pelo jogo. [Comportamento em SPA](https://developers.cloudflare.com/web-analytics/get-started/web-analytics-spa/).

## Verificação de aceitação e divisão dos dois devs

**Dev de aplicação:** adicionar a origem autorizada e o teste; integrar o snippet público nas páginas públicas quando disponível; manter os dados pessoais na API própria; validar cadastro, três missões, pontuação, reenvio após reconexão e painel privado no mesmo hostname. O carregamento do analytics não pode bloquear Play nem o salvamento.

**Dev de publicação e qualidade:** preservar o CNAME já criado; conferir o destino DNS público e a configuração da Vercel; confirmar HTTPS estável sem ignorar erros de certificado; testar as rotas acima no desktop e em viewport móvel; confirmar que `/api/metrics?action=admin` responde `401` sem autenticação; registrar requisição do beacon e depois presença dos dados no painel Cloudflare.

O domínio novo já tem DNS, certificado e rotas observados. Manter `https://projeto-ipe.vercel.app` como alternativa enquanto caches DNS e conexões se estabilizam. Não confundir disponibilidade das páginas com a publicação R23, a gravação privada no novo hostname ou a recepção do beacon: esses itens precisam de verificações após publicar. Atualizar este documento e o recibo com a evidência final, incluindo eventuais limitações de rede local.
