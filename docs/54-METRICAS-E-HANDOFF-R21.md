# R21 · métricas, pitch e continuidade dos dois devs

O objetivo desta versão é tornar a proposta demonstrável: **o jogador escolhe, observa uma consequência na nave, recebe evidências e justifica uma conclusão**. A equipe acompanha tentativas e respostas com critérios explícitos. O jogo medido é o laboratório de três missões em `/lab/index.html`; os protótipos históricos `/game`, `/campanha` e FASTMODE não entram nesses indicadores.

[Jogar](../lab/index.html) · [Painel privado](../dashboard/index.html) · [Pitch](../presentation/pitch/index.html) · [Fala de três minutos](53-PITCH-JURADOS-E-FALA-R21.md)

## O que as missões ensinam

| Missão | Decisão observável no 3D | O que o jogador pratica | O que a evidência não permite afirmar |
| --- | --- | --- | --- |
| Cerrado | Instrumento/processamento, painéis, bateria e rádio acompanham a configuração e o instante do motor. | Diferenciar potência (W) de energia (Wh); avaliar volume, memória e contato; comparar dois períodos de NDVI apenas após receber os registros. | Uma lacuna não equivale a vegetação ausente. Um índice isolado não estabelece desmatamento nem sua causa. |
| Bennu | A câmera mede no exercício; rádio e agenda mostram quando os arquivos chegam ao solo. | Distinguir produzir, armazenar e entregar; selecionar o instrumento pela pergunta. O pacote de solo muda início, duração e custo conjuntamente. | Dimensões de seis rochas/clastos não demonstram composição ou origem. |
| Webb | Instrumento, energia e comunicação condicionam a produção e a entrega dos bins. | Distinguir imagem e espectro; ler profundidade de trânsito e incerteza; compatibilizar massa, energia, lançamento e ciência. | Seis bins não refazem a descoberta molecular completa nem demonstram vida. |

Os registros históricos NASA não são alterados para recompensar uma configuração. A nave montável, capacidades, agenda, massa e créditos são um modelo didático. O pitch precisa manter essa distinção próxima das demonstrações.

## Entrada e privacidade

O participante percorre **Nome → E-mail → Tipo de missão → Play**, com uma etapa por tela. “Tipo” escolhe entre Cerrado, Bennu e Webb, mostrando a pergunta científica e o aprendizado de cada caso. Voltar preserva os campos; a participação só é criada ao confirmar Play. O formulário informa a finalidade: registrar sua participação, decisões, resultados e respostas para análise privada da equipe. Não há disparo de e-mail nem inscrição de marketing. O e-mail é autodeclarado: não representa autenticação ou identidade verificada.

A entrada ocupa a área disponível da tela. Play solicita o modo de tela cheia no próprio gesto do jogador, antes de aguardar a rede. Caso o navegador não ofereça ou permita esse modo, a partida continua na área disponível, sem bloquear o cadastro. O cabeçalho do jogo oferece o controle de tela cheia; Esc continua disponível. Uma participação restaurada apresenta **Retomar jogo** antes de entrar. Em dispositivos pequenos, conteúdo que excede a altura permanece alcançável por rolagem: não cortar controles para simular uma tela cheia.

O servidor cria uma participação aleatória, com cookie de acesso exclusivo dessa participação. Digitar o mesmo e-mail em outro navegador não revela nem recupera um histórico anterior. Os rascunhos, o diário e o resumo local do jogo são separados por participação. Eventos antigos sem dono não são atribuídos ao próximo visitante.

Nome e e-mail ficam no armazenamento privado; os eventos contêm somente o identificador da participação. O cliente não grava o e-mail no armazenamento do navegador. Hipóteses e reflexões livres não são transmitidas na telemetria. O painel da equipe exige uma chave administrativa distinta, com sessão de oito horas. A chave não pertence ao Git, ao HTML ou à configuração pública.

Encerrar a participação limpa o acesso no aparelho; não apaga os dados já enviados à equipe. O responsável pode atender um pedido de remoção no armazenamento privado, selecionando o prefixo exato da participação. Não foi implementado um botão de exclusão automática: é necessário tratar revogação e gravações concorrentes antes de prometer apagamento completo. O adaptador solicita retenção de 90 dias ao serviço; sua confirmação em produção deve constar no recibo da implantação.

## Dicionário de métricas

| Indicador | Numerador / critério | Denominador / cuidado |
| --- | --- | --- |
| Participações | Sessões criadas pelo servidor. | Não são pessoas únicas; o mesmo visitante pode iniciar outra participação. |
| Tentativas calculadas | Execuções próprias concluídas, identificadas por UUID novo a cada execução. | Exemplos A/B, buscas automáticas, replays e abertura de histórico não contam. |
| Missões cumpridas | Resultado `success` recalculado no servidor com o motor original. | Todas as tentativas calculadas, incluindo projetos incompatíveis. Não significa aprendizagem comprovada. |
| Projetos incompatíveis | Resultado `invalid` após checar as escolhas e restrições. | Separado da missão operacional que começou e falhou. |
| Causas de engenharia | Cada código de erro aparece uma vez por tentativa. | `MISSION_END` é resumo e não conta como causa adicional. Diagnósticos podem incluir consequências: leia o primeiro evento e a configuração. |
| Registros completos / válidos | Quantidade entregue e quantidade compatível com a pergunta científica. | Webb pode entregar seis pacotes com câmera e obter zero registros cientificamente válidos. |
| Primeira resposta correta | Primeira resposta recebida por participação, missão, pergunta e versão; comparada ao critério do exercício. | Apenas perguntas respondidas. Não substitui avaliação humana ou desenho experimental de aprendizagem. |
| Última resposta e revisões | Resposta mais recente e quantidade posterior à primeira. | Rever após feedback não reescreve o acerto inicial. |
| Mudanças de configuração | Escolhas válidas diferentes da seleção anterior. | Uma escolha não é universalmente certa/errada; o resultado depende do projeto completo. |
| Inspeções de evidência / 3D | Ações explícitas de inspeção de componente, evento, comparação ou registro. | Não conta quadros de animação, tempo de replay ou renderizações React. |
| Revisão dos papéis | Registro dos papéis preenchidos. | Preenchimento não avalia automaticamente a qualidade de texto livre. |
| Cancelamento / falha técnica | Execução interrompida ou erro do processamento. | Separados das falhas de engenharia; não entram na taxa de missões cumpridas. |

A previsão guiada compara “mais/igual/menos” com a diferença real entre os dois ensaios. A interpretação científica compara a alternativa escolhida com a conclusão que respeita a evidência. A correção ocorre no servidor, sem aceitar um booleano de acerto enviado pelo cliente.

## Como o painel calcula

`dashboard/metrics.mjs` agrega apenas os registros carregados e filtrados. A lista é paginada em blocos de até 100 objetos; o botão “Carregar mais registros” permanece visível quando há outras páginas. Os números parciais ficam explicitamente identificados. “Atualizar registros” reinicia a consulta, sem somar novamente o mesmo evento.

Cada tentativa usa um identificador próprio; duas execuções idênticas são duas tentativas. Um reenvio da mesma tentativa, inclusive após perda da confirmação de gravação, não duplica a contagem. O servidor recalcula o resultado usando os arquivos científicos e os motores já existentes. Isso reduz falsificação de métricas, mas não comprova que a atividade foi realizada por um humano e não constitui proteção completa contra fraude.

O horário `receivedAt` é do servidor. `at` é informado pelo navegador. `completedAtS` é tempo simulado T+, não duração de uso. O painel não apresenta uma métrica de tempo ativo humano que não foi medida.

O CSV exporta somente tentativas carregadas e filtradas. E-mail fica de fora por padrão; a equipe pode incluí-lo com o controle explícito. Células são protegidas contra fórmulas de planilha. Nenhuma exportação pública é gerada automaticamente.

## Arquitetura e implantação

| Camada | Local | Responsabilidade |
| --- | --- | --- |
| Entrada, fila e progresso | `experiments/mission-design-lab/src/ui/PlayerMetrics.tsx` e `src/metrics/player-metrics.ts` | Sessão, métricas locais por participação, envio, confirmação, reenvio e erros visíveis. |
| Pontos de registro | `App.tsx`, `ScientificExpedition.tsx`, `MissionLearning.tsx`, `ExpeditionLearning.tsx`, `Scene.tsx` | Registrar ações aceitas; nunca registrar uma tentativa ao apenas ler ou renderizar. |
| API privada | `api/metrics.mjs`, `server/metrics/handler.mjs` | Validação, cookies, autenticação da equipe, limite de pedido e respostas sem cache. |
| Ciência e validação | `server/metrics/model.mjs` | Validar configurações e recalcular com os motores originais. |
| Armazenamento | `server/metrics/blob.mjs` | Objetos privados e imutáveis por identificador, leitura paginada e retenção solicitada. |
| Painel | `dashboard/` | Interface sem bibliotecas novas; autenticação antes de receber dados; filtros, causas, respostas, detalhes e CSV. |
| Pitch | `presentation/pitch/` | Evidência visual, aprendizagem explícita e fala coerente com o que existe. |

Variáveis exclusivas do servidor: `BLOB_STORE_ID`, `VERCEL_OIDC_TOKEN` temporário gerenciado pela Vercel, `METRICS_SIGNING_SECRET`, `METRICS_ADMIN_SECRET`. Nunca usar prefixo `VITE_` para elas. O armazenamento deve ser **privado**. A conexão usa OIDC; não foi criada chave permanente de leitura/gravação. A API mantém `Cache-Control: private, no-store`, valida a origem das mutações e usa cookies `HttpOnly; Secure; SameSite=Strict`. O limite por IP é uma proteção simples por instância; não é um sistema distribuído de prevenção de abuso.

A distribuição agora contém uma função de servidor. **Publicar somente os arquivos do manifesto estático não ativa as métricas.** Use a implantação do repositório completo na Vercel, mantendo `api/metrics.mjs` como função. A pasta `site/` continua contendo somente os assets e documentos públicos; nenhum perfil, token ou evento de produção é copiado para ela.

O serviço privado tem limites de uso e pode cobrar conforme o plano da Vercel. Esta versão não habilita upgrade nem altera limites de gasto. Consulte [uso e preços do Blob](https://vercel.com/docs/vercel-blob/usage-and-pricing) e monitore a quantidade de objetos/operações antes de ampliar o piloto. Não há promessa de operação ilimitada.

## Pesquisa aplicada

Foram lidos três arquivos do repositório [awesome-gamedev-agent-skills](https://github.com/gamedev-skills/awesome-gamedev-agent-skills/tree/c6ca6c41c839b68319ffc08430b99ab768debc32), consultado em 15/11/2026:

- [game-ui-ux](https://github.com/gamedev-skills/awesome-gamedev-agent-skills/blob/c6ca6c41c839b68319ffc08430b99ab768debc32/skills/disciplines/game-ui-ux/SKILL.md): atualização por ação, feedback próximo da decisão e números legíveis.
- [save-systems](https://github.com/gamedev-skills/awesome-gamedev-agent-skills/blob/c6ca6c41c839b68319ffc08430b99ab768debc32/skills/disciplines/save-systems/SKILL.md): registros simples versionados, validação, recuperação e erro de persistência visível.
- [prototype-fast](https://github.com/gamedev-skills/awesome-gamedev-agent-skills/blob/c6ca6c41c839b68319ffc08430b99ab768debc32/skills/workflows/prototype-fast/SKILL.md): avaliar um ciclo observável de previsão, execução, inspeção e revisão.

Nenhum pacote desse repositório foi instalado. As práticas foram aplicadas ao código existente; o repositório não fornece uma escala validada de aprendizagem nem uma solução pronta de analytics.

## Divisão dos dois devs e aceite

**Dev A — ciência, motor e métricas.** Mantém as regras de resultado, as unidades e o mapeamento de `normalizeEvent`. Para uma mudança no motor, verificar novamente o resumo das três missões e os ensaios usados pelo pitch. Não substituir dado histórico por pontuação sintética nem aceitar nota calculada pelo navegador.

**Dev B — experiência, painel e operação.** Mantém a entrada Nome → E-mail → Tipo → Play, a escolha efetiva da missão, a retomada, a tela cheia, a fila por participação, os estados de envio, a privacidade do painel e o roteiro. Conferir foco/teclado, celular, alteração de jogador no mesmo aparelho e erro de conexão. Uma consulta parcial nunca pode parecer total.

**Revisão conjunta.** Conferir cadastro → jogo → duas tentativas diferentes → resposta incorreta → revisão correta → painel privado. Reenviar a mesma tentativa e confirmar contagem estável. Abrir outro navegador com o mesmo e-mail e confirmar isolamento. Verificar que um visitante e um jogador comum não conseguem ler o painel. Conferir 6 pacotes / 0 válidos no Webb com câmera. Jogadores humanos ainda precisam testar se conseguem explicar uma falha e justificar a próxima decisão sem orientação.

Comandos: `npm run test:metrics`; `npm --prefix experiments/mission-design-lab run verify`; `node scripts/test-pitch.mjs`; `npm run build:release`; `npm run test:beta`. Para QA local integrado, após a distribuição: `IPE_METRICS_TEST=1 node scripts/serve-beta.mjs --port 4180`. Esse modo usa dados sintéticos em memória e uma chave de teste documentada no código, disponível somente em localhost; não valida armazenamento de produção.

Os recibos em `evidence/` e a conferência posterior à publicação devem registrar as verificações realmente executadas. Um teste local não comprova o funcionamento do Blob em produção, e screenshots não comprovam aprendizagem.

## Verificação antes da publicação

No percurso local integrado, um participante sintético executou as três missões: Cerrado 6/6 válido e sucesso; Bennu 2/6 válido e requisito de entrega não cumprido; Webb 6/6 válido, mas projeto incompatível com o lançador compacto (3,2 kg para 3 kg e 87 créditos para 80). O resumo e o painel receberam três tentativas, duas respostas e oito eventos no total, sem pendências ou recusas. A tentativa incompatível mostra por que ciência recebida não basta para aprovar toda a arquitetura.

Foram corrigidos o seletor de missões do painel, o texto de diagnósticos que repetia o requisito positivo como erro e a limpeza de todos os dados visíveis/ocultos após sair do painel. Esses testes usaram armazenamento local em memória; a comprovação do serviço real depende de `evidence/metrics-production-r21.json` e do recibo da publicação.

Um relato anterior de canvas intermitente na troca de missões não se reproduziu nesta passagem. O motor e os estados A/B concordaram, e não foi introduzida uma correção especulativa. Ainda é necessário um teste orientado com iniciantes e celulares físicos antes de afirmar aprendizagem ou desempenho amplo.

## Pontuação do MVP e pré-banca

A rubrica `r21-v1` soma até 60 pontos por ciência válida recebida, 30 pela compatibilidade inicial do projeto e 10 pela folga média de massa/orçamento. O motor compartilhado calcula a pontuação tanto no resumo local como na reavaliação do servidor. Cada tentativa guarda as parcelas e a versão da regra; uma nova execução é uma tentativa diferente, enquanto reenvios mantêm o mesmo identificador. Pontos não substituem o resultado da missão nem são uma nota validada de aprendizagem.

[Kit da pré-banca: seis cenas, roteiro, demonstração e números com significado](57-KIT-PRE-BANCA-R21.md). A página oficial confirmou em 15/11/2026 a vinculação da MISSÃO IPÊ ao evento de Rio Verde e ao desafio Space Mission Design Game. O roteiro atualizado tem 331 palavras e blocos 20/30/40/50/25/15 segundos; Alexandre ainda deve ensaiar com o equipamento.
