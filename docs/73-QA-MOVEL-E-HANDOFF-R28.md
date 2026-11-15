# R28 · primeira jornada, QA móvel e handoff

## Endereços atuais

| Área | Acesso |
| --- | --- |
| Landing page principal | [LP Missão Ipê](https://projeto-ipe-lp.vercel.app/) |
| Apresentação | [Central de apresentação da equipe](https://missao-ipe-central-ab.alexandrebelo.chatgpt.site/) |
| Jogo | [Laboratório e sete missões](https://nasa-missaoipe.alexandrebelo.com/lab/index.html) |
| Equipe | [Página da equipe](https://nasa-missaoipe.alexandrebelo.com/equipe/index.html) |
| Documentação | [Índice público](https://nasa-missaoipe.alexandrebelo.com/docs/index.html) |
| Métricas e pontuação da equipe | [Painel privado](https://nasa-missaoipe.alexandrebelo.com/dashboard/index.html) |

O jogo e o painel ficam no mesmo host. A apresentação central e a LP abrem em seus próprios endereços. O pitch interativo segue disponível como material de ensaio. A R27 registra o provisionamento anterior dos atalhos. [Pitch interativo](https://nasa-missaoipe.alexandrebelo.com/presentation/pitch/index.html) · [Domínios e acessos R27](72-DOMINIOS-E-ACESSOS-R27.md)

## Primeira tentativa

O hangar da ISS, Lua, Marte e Europa indica os instrumentos faltantes antes da nave 3D. Quando falta comprar, o atalho abre a loja com um instrumento da missão selecionado. Com as unidades no inventário, **Abrir instrumentos** leva ao controle **Instrumento**. Use **Equipar** em cada unidade. A nave e os indicadores refletem a carga reservada.

Os demais sistemas começam com opções iniciais. Troque apenas o necessário para atender massa, encaixes, energia e comunicação. **Revisar voo e comparar A/B** permite investigar uma alteração antes de lançar. Uma partida aprovada desconta 2 créditos da carteira e um ciclo por unidade equipada. Partir sem instrumentos produz zero registros. Se a verificação inicial barrar o projeto, a carteira e a condição das unidades são preservadas. O orçamento do projeto mede quanto o plano consome do limite de engenharia. A carteira paga compras e partidas. [Regras e contrato R27](71-INVENTARIO-EUROPA-E-HANDOFF-R27.md)

| Missão | Comprar e equipar | Ajustes a partir das opções iniciais | Resultado do motor local com peças novas |
| --- | --- | --- | --- |
| ISS | Monitor de compostos voláteis | Proteção reforçada | 6 válidos · 92 pontos |
| Lua | LEND e Diviner | Lançador de maior capacidade, reserva ampliada e enlace direcional | 6 válidos · 92 pontos |
| Marte | MEDA | Lançador de maior capacidade, reserva ampliada, proteção reforçada e enlace direcional | 6 válidos · 91 pontos |
| Europa | MISE e REASON | Lançador de maior capacidade, reserva ampliada e enlace direcional | 6 válidos · 93 pontos |

Os quatro planos foram calculados com a propulsão química inicial. Com 25 créditos iniciais e as recompensas de 8 créditos por sucesso confirmado, a sequência prevista deixa 26 após a ISS, 20 após a Lua, 19 após Marte e 9 após Europa. A condição de cada unidade altera a energia necessária para medir em tentativas futuras.

Cerrado, Bennu e Webb oferecem as peças na bancada. O Cerrado mostra sua pergunta no topo do projeto. Em Bennu e Webb, **Salvar projeto** guarda configuração e hipótese neste navegador. **Restaurar projeto salvo** reabre o rascunho da missão. Após simular, leia o resumo final e use o relógio do replay para investigar o que já estava disponível na nave ou no solo a cada instante. Compare o total recebido com os registros que respondem à pergunta. O acervo e seu gráfico contam **válidos disponíveis**, evitando confundir seis arquivos recebidos com seis medidas adequadas.

## Onde conferir a tentativa

O relatório de engenharia confirmado indica **Meu progresso**. Abra esse painel no jogo e procure a missão na lista de tentativas. Compare resultado, pontuação e estado do envio. Para retomar a mesma participação, abra o jogo no mesmo navegador e use **Retomar jogo**. Nome e e-mail identificam a participação no painel da equipe. Digitar o mesmo e-mail em outro aparelho cria outra participação e um novo histórico local.

Configuração, hipótese e progresso local ficam vinculados à participação neste navegador. A equipe consulta os registros recebidos no painel privado, com autenticação administrativa. A carteira, as reservas e as tentativas da campanha de engenharia são consultadas no servidor. Durante indisponibilidade, o jogo sinaliza a falta de confirmação do saldo e bloqueia compras e partidas da campanha. Procure **Recebido pela equipe** na lista de tentativas e os totais de pendências em **Seu registro na equipe**.

## Verificações e alcance

- Os 53 testes de métricas passaram localmente, incluindo o percurso HTTP sintético de sete missões, recálculo da pontuação, reenvio com o mesmo ID, desgaste e leitura paginada.
- Os 113 testes de interface em DOM simulado passaram, incluindo os 30 da área afetada pelo ajuste do hangar. O fluxo de Europa cobre a instrução antes do 3D, compra, foco em Instrumento, reserva, desgaste, resultado e o mesmo ID da tentativa no progresso. Esse teste usa o DOM simulado e o handler real com armazenamento em memória.
- No navegador a 390 px, as sete missões foram concluídas em uma participação sintética: Cerrado 92, Bennu 90, Webb 92, ISS 92, Lua 92, Marte 91 e Europa 93 pontos. Foram nove tentativas: Bennu passou de 2/6 e 52 pontos para 6/6 e 90; Webb passou de 6 recebidos e 0 válidos para 6 válidos e 92 pontos. Após recarregar e retomar, as nove tentativas, 32 eventos confirmados, seis unidades com desgaste e carteira de 9 créditos permaneceram disponíveis. Não havia eventos pendentes nem recusados. O servidor desse ensaio local usa memória; a comprovação durável de produção está no recibo da API.

O ensaio móvel usa viewport efetivo de 390 px em navegador no computador, sem overflow horizontal observado. A tentativa de ajustar para 320 px não alterou a largura efetiva neste navegador; essa medida não é reivindicada como verificada na R28. A validação em telefone físico e uma rodada com jogadores iniciantes seguem pendentes. Pontuação e relatórios sintéticos medem comportamento do jogo. O ensaio com pessoas precisa observar escolhas, dificuldades e justificativas para avaliar aprendizagem.

## Publicação e prova durável

Implementação `9f86436c73455682c049bb604dfda1e3762298b1` publicada em 15/11/2026. Principal `dpl_Cj6efJP8hTRpFoSYGTCTCxZ4mQhb` e LP `dpl_8EsSXZJpa21XVhsKXY1suS9fcMKp` ficaram READY. No domínio oficial, **344 verificações em 117 requisições** passaram no Blob privado, cobrindo as sete missões na mesma participação sintética, pontuação recalculada, reenvios sem duplicação, autorização, desgaste até exaustão e leitura pelo painel privado. A prova HTTP é independente das nove partidas realizadas no navegador local.

A central de apresentação foi publicada como versão 4 do Site, commit `ef1d88d3fc129888387c4e9d076a9235d59c9679`. Todos os CTAs de jogar apontam ao jogo integrado; o vídeo de 180 segundos em português é a seleção inicial e reproduziu no navegador sem erro. Vídeos, slides, guia e ZIP são materiais da produção anterior, identificados como históricos: não foram reeditados nesta revisão. A central mantém sua própria fonte Git gerenciada pelo Sites; o repositório oficial reúne o handoff e o recibo dos acessos.

[Recibo móvel](https://github.com/oalexandrebelo/MISSAO-IPE/blob/main/evidence/r28-mobile-journey.json) · [Métricas em produção](https://github.com/oalexandrebelo/MISSAO-IPE/blob/main/evidence/r28-production-metrics.json) · [Publicação e links](https://github.com/oalexandrebelo/MISSAO-IPE/blob/main/evidence/r28-publication-links.json)

## Continuidade para dois desenvolvedores

- **Dev A · Motor e dados.** Reproduza os limites de massa, encaixes, energia, comunicação e validade com o motor atual. Ao verificar a API, compare o mesmo ID e o resultado recalculado no painel privado. Registre versão, pontuação e contagem de registros. Preserve a identidade da tentativa ao repetir um pedido.
- **Dev B · Interface e publicação.** Percorra início, projeto, execução e Meu progresso em 320 e 390 px com uma participação sintética. Passe pelas sete missões, retome a participação no mesmo navegador e confira as tentativas, o inventário e o saldo. Registre navegador, viewport, comportamento de foco e a revisão servida. Confirme LP, apresentação, jogo e painel pelos endereços acima.

O recibo de publicação reúne os commits, os deploys e as evidências correspondentes. [Histórico e recibos no GitHub](https://github.com/oalexandrebelo/MISSAO-IPE/blob/main/PUBLICADO.md)
