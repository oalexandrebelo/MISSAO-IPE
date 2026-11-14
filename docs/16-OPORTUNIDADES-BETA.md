# 16 — Oportunidades concretas para a beta

**AB-NASA-TEAM-IPE · rodada R6 · 14/11/2026.** Priorização para o alvo interno de **15/11/2026 às 08h BRT**. As recomendações abaixo partem do produto implementado, das evidências de R4/R5 e do custo de abrir novas frentes de validação. Não são resultados de pesquisa com usuários nem uma estimativa medida de retorno financeiro.

O maior ganho esperado até esse corte está em tornar a demonstração **acessível, compreensível e rastreável**. O projeto já tem um motor finito, dois cenários, dados científicos preservados e um contraste causal verificável. Um novo subsistema físico ou modelo de IA acrescentaria contrato, interface, dados e testes antes de melhorar o acesso à tarefa existente.

## Prioridades para esta entrega

| Oportunidade | Efeito esperado e motivo | Menor incremento útil | Aceite e evidência | Responsável / dependência |
|---|---|---|---|---|
| O1 — Uma entrada pública clara | Reduz a chance de o visitante receber um arquivo isolado, rota quebrada ou dúvida sobre onde começar | Portal BETA com **Jogar** como ação principal; apresentação, arquitetura e fontes como acessos secundários | Link principal abre o jogo; estado de pesquisa aparece antes da ação; nenhum link local obrigatório está quebrado | Portal + QA; build estático íntegro |
| O2 — Distribuição que preserva o jogo real | Evita que uma mudança de hospedagem pareça falha da ciência ou da missão | Servir os mesmos módulos, Worker, CSS e JSONs; manter os caminhos relativos e excluir source maps | HTTP de todos os recursos, MIME correto, hashes compatíveis e erros reais para ausências | Release + QA; configuração do host |
| O3 — Documentação pública com escopo explícito | Dá confiança verificável sem despejar logs internos ou anunciar validação que não ocorreu | Página curta de fontes/estado; documentos históricos identificados; projeções públicas dos recibos necessários | Leitor distingue dados de 2024, hipóteses didáticas, testes DOM/HTTP e gates abertos; auditoria sem exposição privada | Produto + portal + QA |
| O4 — Arquitetura derivada das fontes | Ajuda revisão técnica e discussão da evolução com evidência concreta | Mapa local inspirado no uso de Archify, com modelo de relações reais, busca/inspeção e caminhos relativos | Nós e relações apontam arquivos/linhas/hashes; ausência de dependência remota; proposto e implementado distinguíveis | Arquitetura; fontes atuais do projeto |
| O5 — Primeiro minuto de demonstração compreensível | Explica a pergunta antes de apresentar seis seletores e uma cena espacial | Texto de entrada: seis resultados completos e válidos; contatos longos/curtos; a missão simulada não é aquisição MODIS real | A primeira ação e o objetivo podem ser descritos sem abrir o dossiê; ensaio com pessoa registra dúvidas, se houver disponibilidade | Produto + pessoa que apresenta |
| O6 — Evidenciar potência versus energia | Ataca a confusão que o contraste do modelo já consegue mostrar | Usar o caso ÍNDICE e o evento aos 600 s, com unidades e energia restante; manter a solução após a tentativa | Execução real mostra falha de potência; roteiro não chama isso de bateria esgotada; previsão própria preservada | Apresentação/jogo existentes; facilitador |
| O7 — Preparação de idioma e formato | Reduz retrabalho caso o formulário exija inglês ou mídia com formato restrito | Conservar copy inglesa dos sete quadros e roteiro curto; conferir formulário antes de exportar/gravar | Arquivo final tem idioma, duração/quantidade e fontes conferidos; o HTML português não é anunciado como deck inglês | Candidatura + narrativa; guia/formulário efetivos |
| O8 — Um ensaio real documentado | Pode revelar problemas de foco, altura de tela, fontes, Worker e persistência que DOM/HTTP não capturam | Jornada curta no equipamento de apresentação, com versão, origem e resolução registradas | Registro de observação real com falhas e ajuda, separado das contagens automatizadas | Pessoa/equipamento disponíveis; build congelado |

O1–O4 pertencem à rodada de publicação. O5–O8 precisam de revisão de conteúdo ou ação humana conforme disponibilidade. A lista não declara essas ações concluídas e não cria uma rotina autônoma para executá-las depois.

## Ordem de decisão

1. **Corrigir acesso e exposição antes de ampliar conteúdo.** Um Worker que não carrega ou um arquivo privado publicado é bloqueador; uma nova animação não compensa o problema.
2. **Fechar a causa da falha antes de mostrar a solução.** No caso curto, 2/6 decorre da entrega incompleta. ÍNDICE isolado reduz bits, mas falha por potência. A bateria maior com ÍNDICE atende conjuntamente às restrições do catálogo.
3. **Conservar a origem dos números.** O portal, o mapa e o roteiro apontam o motor/dados/recibos. Não criar um segundo score ou uma visualização com resultados manualmente escolhidos para parecer executada.
4. **Usar cada evidência para a pergunta que ela responde.** HTTP verifica entrega de arquivos; DOM verifica interações simuladas; ensaio de navegador verifica o ambiente observado; pesquisa com pessoas investiga compreensão. Uma camada não substitui a outra.
5. **Tratar a candidatura como um gate próprio.** O objetivo de publicação é uma beta de P&D. Uma decisão de elegibilidade, Resources ou formato pode mudar o que será submetido sem apagar a história do projeto.

## Cortes recomendados se o tempo apertar

| Preservar | Simplificar primeiro | Razão |
|---|---|---|
| Jogo, Worker e dados locais | Efeitos ou transições decorativas | A tarefa depende da execução, não do efeito |
| Diagnóstico, unidades e fontes | Texto repetido entre portal e apêndices | Explicar o erro sustenta a proposta educativa |
| BETA, cronologia e limites | Variações editoriais da capa | O estado real precisa sobreviver ao corte de conteúdo |
| Mapa com relações reais | Controles opcionais de layout e exportações extras | A arquitetura útil é a que pode ser conferida |
| Copy inglesa e roteiro verificável | Vídeo com montagem complexa | A conferência científica e do formato pesa mais que acabamento não ensaiado |
| Manifesto e recuperação de versão | Novos formatos de pacote | Uma versão identificada permite corrigir e reverter |

Se um módulo novo não satisfizer seu próprio aceite, ele pode permanecer como proposta documentada. Não desenhar uma seta de integração executada só porque dois módulos aparecem no mesmo site.

## Oportunidades após a beta, condicionadas a evidência

| Tema | Por que pode valer uma próxima rodada | Pré-requisito antes de implementar ou anunciar |
|---|---|---|
| Aprendizagem e transferência | Verificar se o participante explica o recurso limitante e generaliza para contato curto | Pilotos e sessões observadas; protocolo, registro de ajuda/erros e análise limitada à amostra |
| Inglês integral do produto | Ampliar uso por outro público e reduzir alternância de idioma | Revisão terminológica, interface completa e ensaio de compreensão; não somente tradução dos títulos |
| Margens e robustez finita | Explorar consequências de pequenas perturbações sem alegar probabilidade orbital real | Grade versionada, resultados conferidos e distinção entre cobertura de casos e risco físico |
| EVI3 | Abrir uma pergunta científica com informação adicional | BLUE explícito, contrato de transporte e QA, novo oráculo e casos negativos; pesquisa atual não é função implementada |
| Agenda orbital de referência | Comparar o modelo didático com um cenário derivado de dados orbitais | Referencial, unidades, versões, hipóteses e tolerâncias documentados antes de mudar o motor |
| Feedback pedagógico com modelo compacto | Investigar perguntas de acompanhamento em linguagem natural | Corpus revisado, avaliação pt-BR, abstenção, calibração e comparação sem modelo; classificação física/científica permanece determinística |
| Persistência compartilhada | Atender eventual necessidade real de turma/equipe | Demanda observada, consentimento adequado, minimização de dados, autenticação e contrato transacional; IndexedDB local não equivale a backend multiusuário |
| Marte e outros destinos | Variar contexto e narrativa depois de validar a tarefa central | Novo objetivo científico, dados, regras e evidência; uma ilustração de Marte não estabelece uma missão marciana funcional |

Esses temas ficam fora do caminho crítico até 15/11 às 08h. Não há instalação de modelo, backend Prisma integrado, propagador orbital ou missão em Marte implícita nesta publicação.

## Como decidir a próxima prioridade com observação real

Em um ensaio ou sessão futura, registrar somente o necessário: versão, tarefa, primeira hipótese, alteração realizada, evento usado na explicação, ajuda recebida, bloqueio e comentário pertinente. Não exigir nome, email ou identificador externo. Texto livre pode conter informação pessoal; sua publicação ou exportação precisa de revisão deliberada.

| Pergunta de produto | Observação útil | O que ela não permite concluir sozinha |
|---|---|---|
| A pessoa sabe por onde começar? | Primeira ação e dúvidas no portal | Taxa populacional de sucesso |
| Ela distingue bits recebidos de resultado útil? | Explicação do 2/6 no caso curto | Conhecimento geral de sensoriamento remoto |
| Ela distingue potência de energia? | Explicação do evento ÍNDICE aos 600 s | Retenção de longo prazo |
| O redesenho usa evidência? | Relação entre hipótese, evento e escolhas antes da ajuda | Aprendizagem causal demonstrada por um estudo controlado |
| A distribuição funciona no ambiente escolhido? | Navegador, origem, resolução e jornada observada | Compatibilidade de todos os navegadores ou benchmark de outros equipamentos |

A prioridade seguinte deve seguir o bloqueio observado, a importância para a tarefa e a capacidade de verificar a correção. A quantidade de funções ou de testes, isoladamente, não mede o valor educacional da beta.

## Fontes internas desta priorização

Base de decisão: `docs/02-PRD.md`, `docs/03-PRT.md`, `docs/08-HANDOFF.md`, `docs/09-VERIFICACAO.md`, `docs/12-HANDOFF-APRESENTACAO.md`, `research/11-revisao-spaceapps-apresentacao.md`, os recibos identificados de R4/R5 e os contratos de publicação R6. O plano de release, responsabilidades e rollback estão em `docs/15-PLANO-RELEASE-20261115-0800.md`. Referências às fontes internas são rastreabilidade do projeto; não são links públicos garantidos para todo o repositório.
