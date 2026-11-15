# R23 — domínio próprio e métricas Cloudflare

Infraestrutura verificada em **15/11/2026, 14:57 UTC**. [Recibo de domínio e Cloudflare no repositório](https://github.com/oalexandrebelo/MISSAO-IPE/blob/main/evidence/domain-cloudflare-r23.json).

## Produção verificada

O endereço `nasa-missaoipe.alexandrebelo.com` foi associado ao projeto principal `missao-ipe` na Vercel para produção. O commit `80ce5ade8e566e3e3a6ff03ac998fff2814ac94f` foi publicado no principal `dpl_JzXF1uf9fG2y4erahFjXWe1rkriJ` e na LP `dpl_e9YKvrsRVoMCy5SYPo1PonHFWPx5`, ambos **READY**. O navegador abriu o portal e o laboratório por HTTPS no hostname oficial. [Recibo funcional R23](https://github.com/oalexandrebelo/MISSAO-IPE/blob/main/evidence/r23-functional-qa.json)

**O DNS já foi configurado e propagado.** A criação do CNAME pelo painel Cloudflare foi confirmada por consulta independente ao servidor autoritativo e aos resolvedores públicos `1.1.1.1` e `8.8.8.8`. A Vercel informa `configuredBy: CNAME`, `misconfigured: false` e ausência de conflitos. Entre 14:54 e 14:57 UTC, todas as cinco páginas da tabela abaixo responderam `200` por HTTPS válido; a API administrativa respondeu `401` sem autenticação. A sequência completa passou no IP público `64.29.17.65`. No outro IP, houve respostas válidas e timeouts intermitentes. O resolvedor local do Mac ainda conservava a resposta negativa anterior, portanto as verificações HTTPS usaram os IPs do DNS público com `curl --resolve`, preservando a validação de certificado. Isso comprova certificado e rotas no endereço novo, mas ainda não a estabilidade por todos os resolvedores/rede local.

A configuração DNS e o cadastro no Web Analytics foram feitos no painel autenticado da Cloudflare. Após publicar a R23, o navegador confirmou o carregamento do beacon e o painel registrou uma visita técnica ao portal.

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

Caminhos conferidos no endereço oficial com TLS válido:

| Área | Caminho no novo endereço |
| --- | --- |
| Entrada principal | `/` |
| Laboratório / três missões científicas | `/lab/index.html` |
| Pitch | `/presentation/pitch/index.html` |
| Links da equipe | `/equipe/index.html` |
| Painel privado | `/dashboard/index.html` |
| Registro e resultados privados | `/api/metrics` |

O hostname oficial está entre as origens permitidas em `server/metrics/handler.mjs`. Em produção, o teste sintético recebeu `201` no cadastro e `200` ao gravar três eventos. O reenvio idêntico recebeu `200` e a leitura privada mostrou três tentativas únicas. Os resultados calculados pelo servidor coincidiram com o motor local, com **92/100** no Cerrado, **51/100** em Bennu e **92/100** no Webb. A rota administrativa retornou `401` sem sessão. O teste verificou a API com resolução de DNS específica para o edge, preservando a validação de TLS. [Recibo da API em produção](https://github.com/oalexandrebelo/MISSAO-IPE/blob/main/evidence/r23-production-metrics.json)

Os cookies são restritos ao hostname em que foram emitidos e a `/api/metrics`, com `HttpOnly`, `Secure` e `SameSite=Strict`. Um cookie criado em `projeto-ipe.vercel.app` não aparece automaticamente no domínio novo. O armazenamento privado é o mesmo; mudar o hostname não copia a sessão do navegador e não deve motivar a exposição de tokens na URL. O painel exige nova autenticação no novo endereço.

## Separação das métricas

| Pergunta | Sistema responsável |
| --- | --- |
| Quantas visitas chegaram e como a página carregou? | Cloudflare Web Analytics, com uma visita técnica observada na validação |
| Qual decisão o jogador tomou, qual tentativa terminou e qual foi a pontuação? | API própria e Vercel Blob privado já existentes |
| Quem é o participante e qual seu e-mail? | Somente o armazenamento e painel privados |
| Houve aprendizado comprovado em pessoas? | Avaliação e testes com participantes; não inferir de visitas nem de testes automatizados |

Não enviar nome, e-mail, respostas abertas, hipóteses, identificadores de sessão, cookies nem chave administrativa ao beacon. Não colocar esses valores em URL, título da página ou eventos públicos. Não instrumentar o painel administrativo com analytics externo. Cloudflare Web Analytics não substitui a persistência dos eventos do jogo nem garante que todos os visitantes serão contados: bloqueadores, ausência de rede e políticas do navegador podem impedir o beacon.

## Web Analytics em produção

O script `beacon.min.js` carregou no navegador. O painel registrou **uma visita técnica** no hostname oficial, rota `/`, país Brasil e navegador Chrome desktop. O registro apareceu com **Excluir bots** desligado. O teste comprova recepção de uma amostra de QA; avaliação de aprendizagem requer observação com jogadores. [Painel autenticado de visitas](https://dash.cloudflare.com/d64af6bb2dd0607566aed9f467eea464/web-analytics/overview/visits?siteTag~in=c9b4c50132194ef29aa7e269794dee86)

A instalação manual usa o identificador público de site emitido pela Cloudflare. O carregador roda em páginas públicas de nível superior do hostname oficial. A CSP libera as origens necessárias para o script e a coleta. [Configuração oficial](https://developers.cloudflare.com/web-analytics/get-started/)

```text
script-src: adicionar https://static.cloudflareinsights.com
connect-src: adicionar https://cloudflareinsights.com
```

Preservar as demais diretivas; não liberar curingas, `unsafe-eval` ou scripts inline por causa do analytics. O beacon oficial usa `https://static.cloudflareinsights.com/beacon.min.js` e, sem proxy Cloudflare, envia a `https://cloudflareinsights.com/cdn-cgi/rum`. As métricas de experiência podem ser enviadas ao ocultar a página pela primeira vez. [Origem e coleta](https://developers.cloudflare.com/web-analytics/data-metrics/data-origin-and-collection/) · [Política de conteúdo](https://developers.cloudflare.com/fundamentals/reference/policies-compliances/content-security-policies/).

O rastreamento automático de navegação em SPA pode ser desativado com a opção pública `spa: false` no snippet manual se a navegação carregar parâmetros de projetos. Antes de habilitar, conferir as URLs reais emitidas pelo jogo. [Comportamento em SPA](https://developers.cloudflare.com/web-analytics/get-started/web-analytics-spa/).

## Verificação de aceitação e divisão dos dois devs

**Dev de aplicação.** Mantenha o cadastro, as tentativas e as respostas na API privada. Ao mudar origens ou contratos, refaça o teste de cadastro sintético, reenvio, recálculo e painel. Teste o jogo com o beacon bloqueado.

**Dev de publicação e qualidade.** Confira DNS, TLS e o commit da implantação. Verifique o beacon nas rotas públicas, as exclusões das rotas privadas e a entrada no painel de visitas. Registre as visitas de QA como tráfego técnico.

O endereço `https://projeto-ipe.vercel.app` segue disponível para acesso ao projeto. Os recibos registram o alcance da sessão de teste, incluindo oscilações de conexão durante a verificação inicial de infraestrutura. [Handoff R23](61-BANCADA-COMPARACAO-E-LIBRAS-R23.md)
