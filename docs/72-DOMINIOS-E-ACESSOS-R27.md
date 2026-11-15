# R27 — acessos oficiais da MISSÃO IPÊ

## Compartilhe com a equipe

| Área | Endereço |
| --- | --- |
| Portal oficial | https://nasa-missaoipe.alexandrebelo.com/ |
| Jogo, cadastro e sete missões | https://jogo.nasa-missaoipe.alexandrebelo.com/ |
| Pitch interativo de Alexandre Belo | https://pitch.nasa-missaoipe.alexandrebelo.com/ |
| Painel privado das participações | https://painel.nasa-missaoipe.alexandrebelo.com/ |
| Documentação e handoff | https://docs.nasa-missaoipe.alexandrebelo.com/ |
| Landing page imersiva | https://lp.nasa-missaoipe.alexandrebelo.com/ |
| Central da equipe | https://nasa-missaoipe.alexandrebelo.com/equipe/index.html |
| Repositório oficial | https://github.com/oalexandrebelo/MISSAO-IPE |

O painel exige autenticação administrativa já configurada. Nome e e-mail dos jogadores não aparecem no portal nem nas páginas públicas. A chave não deve ser colocada no Git, em slides, no handoff ou na URL.

## Como os atalhos funcionam

Os subdomínios **jogo**, **pitch**, **painel** e **docs** redirecionam para o endereço canônico da sua área no domínio principal. Assim, cadastro, jogo e painel mantêm cookies no mesmo host. Isso evita pedir novo cadastro porque alguém trocou de link. A LP tem projeto Vercel próprio e é servida diretamente em **lp**.

Destinos canônicos: `/lab/index.html`, `/presentation/pitch/index.html`, `/dashboard/index.html` e `/docs/index.html`. Também há atalhos `/doc` e `/painel` para recuperar links usados anteriormente. Um caminho desconhecido continua levando à página 404; não se mascara um erro como página inicial.

## Operação para os devs

O DNS é administrado na Cloudflare, zona `alexandrebelo.com`. Os cinco CNAMEs novos usam modo **DNS only**, com TLS e hospedagem na Vercel. Os nameservers e os outros registros da zona foram preservados. Os nomes foram associados aos respectivos projetos antes da criação dos CNAMEs.

- Projeto principal: `missao-ipe`; repositório oficial, branch `main`; build estático curado e API privada de métricas.
- Projeto da landing page: `projeto-ipe-lp`; mesmo repositório, pasta `apps/immersive-lp`.
- As regras de host estão em `scripts/prepare-vercel-static.mjs`, que gera `vercel.json`. Altere a fonte, gere de novo e execute os testes dos redirecionamentos.
- O servidor local em `scripts/serve-beta.mjs` reproduz essas regras para a suíte de publicação.

Depois de publicar, verifique **HTTPS, status, destino do redirecionamento, conteúdo e SHA dos dois deployments**. O DNS correto não comprova que o jogo novo está em produção. O recibo corrente é `PUBLICADO.md`.

## O que cada métrica significa

O **Cloudflare Web Analytics** mede visitas às páginas públicas conforme a integração existente. O painel privado da MISSÃO IPÊ recebe as decisões, respostas, tentativas, pontuações e operações de inventário validadas pela API. São instrumentos distintos: uma visita não significa missão concluída; uma pontuação não demonstra aprendizagem humana por si só.

No painel, selecione uma missão para ver seus resultados. Compras e devoluções pertencem à carteira geral, portanto aparecem na visão de todas as missões. Os ciclos consumidos e as taxas ficam ligados às partidas. O histórico diferencia tentativas legadas, que não movimentam a carteira R27.

## Quando a internet falhar

As compras, reservas e partidas precisam de confirmação do servidor. Não recadastre a mesma pessoa apenas para tentar resolver uma requisição pendente. Reabra o jogo na mesma participação e use a recuperação do pedido, preservando seu recibo. Rascunhos e explicações podem ser consultados conforme o cache local, mas isso não equivale a ter o inventário online confirmado.
