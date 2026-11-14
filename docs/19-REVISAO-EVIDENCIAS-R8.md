# 19 — Revisão das evidências da central de contexto

**Rodada R8 · 14/11/2026 · revisão de fontes e contratos de publicação.** Este documento registra uma conferência delimitada. Não transforma uma afirmação do fornecedor em benchmark próprio, não certifica a elegibilidade do projeto e não relata uma nova execução do motor do jogo.

## 1. Conclusão editorial

A escolha de **Jogo de Design de Missões Espaciais** está sustentada por três fatos do projeto: foi uma preferência explicitada por AB; combina sua atuação em design de produto, UX, dados e engenharia; e permitiu construir um problema de decisão com entradas, restrições e resultados verificáveis. A pesquisa histórica contribuiu com precedentes e critérios de qualidade. Ela não produziu uma probabilidade estatística de vitória entre os oito temas.

O diferencial que pode ser demonstrado é a sequência **prever → executar → investigar → redesenhar**, ancorada em dados identificados e restrições explícitas. A expressão “maior chance de vencer” deve permanecer um objetivo estratégico. Não há amostragem controlada, julgamento comparativo dos oito protótipos ou modelo de seleção mundial que permita convertê-la em um resultado quantitativo.

O recorte Terra/CubeSat mantém conectados o dado ambiental, a engenharia de coleta/transmissão e a narrativa de Rio Verde. Marte permanece uma oportunidade posterior que exige cenário científico, dados e validação próprios. Não é correto apresentar a cena conceitual 3D como navegação espacial certificada ou um gêmeo digital operacional.

## 2. Calendário e elegibilidade

| Verificação | Evidência primária recuperada nesta rodada | Consequência para o contexto público |
|---|---|---|
| Edição 2026 | A página oficial informa evento em 14–15/11/2026; a submissão abre em 14/11 às 09h e fecha em 15/11 às 23h59 no horário local. [E01] | O alvo interno de 15/11 às 08h BRT não é o prazo global de submissão. |
| Trabalho anterior ao início | Respostas da GO Team distinguem pesquisa geral/seleção de desafio de trabalho específico no projeto; a discussão #2009 reafirma início às 09h locais. [E02, E03] | A cronologia registrada anteriormente continua relevante. Publicar depois das 09h não apaga desenvolvimento anterior. |
| Fonte NASA obrigatória | A resposta GO #1827 exige ao menos uma fonte NASA incluída nos Resources do desafio para Global Awards e referências dos materiais utilizados. [E04] | Procedência NASA do MOD13Q1 não comprova, por si, presença na lista oficial do desafio selecionado. |
| Guias atuais | A GO Team publicou em 13/11 links para Project Submission Guide e Judging & Awards. Os dois links retornaram 502 na leitura desta rodada. [E05] | Não declarar recuperação integral do formulário/guias atuais nem promover regra de 2025 à regra validada de 2026. |
| Rio Verde | A página local informa café às 08h, pré-apresentações às 15h30 e apresentações às 18h no domingo. Há um item de entrega às 17h com interrogação no próprio texto. [E06] | Conferir a liderança local para o horário de entrega; não converter a interrogação em certeza. A página identifica conteúdo da organização local. |

Não foi observada decisão da organização que conceda exceção, desclassifique ou aprove especificamente o Ipê. O estado correto continua **P&D; elegibilidade competitiva não estabelecida**. A revisão R8 não fez submissão ao concurso, não alterou inscrição e não contatou organizadores.

## 3. Brasil: finalista e vencedor são estados distintos

O anúncio NASA de 2025 confirma **PureFlow, Brasil, Global Winner — Best Mission Concept** e descreve uma plataforma interativa de projeto e validação de habitats com ameaças de clima espacial. [E07] Esse precedente demonstra que design de sistemas, interatividade e dados científicos podem compor uma proposta premiada. Não demonstra que qualquer simulador, jogo CubeSat ou experiência 3D receberá a mesma avaliação.

A AEB confirma seis equipes brasileiras entre os 45 finalistas de 2025: **A.T.L.A.S., naiπ, PureFlow, Stellar Narrators, The new Saraquatys e Titan**. [E08] Os exemplos naiπ e A.T.L.A.S. satisfazem a necessidade de estudar finalistas brasileiros; não devem receber o rótulo de vencedores globais por associação ao resultado de PureFlow. Localidade do evento ou da ficha institucional não prova a nacionalidade individual de cada participante.

As referências históricas adicionais de 2022–2024 permanecem nos estudos anteriores. Esta revisão não reexecutou a coleta de todas as fichas individuais; sua presença no contexto consolidado precisa conservar o ano, o status e a fonte original correspondentes.

## 4. Países: métrica identificada, sem ranking inventado de tecnologia

A WIPO confirma **Suíça, Suécia e Estados Unidos** nas três primeiras posições do Global Innovation Index 2026. O índice considera múltiplas dimensões de inovação. [E09] É uma resposta com métrica explícita para o pedido inicial de referências internacionais; não é ranking exclusivo de programação, IA, qualidade de interface ou desempenho no Space Apps.

O resultado de um país em um índice agregado não é uma estimativa da chance de uma equipe brasileira ser finalista. Exemplos de Ásia, Europa, EUA e Rússia precisam ser lidos como casos documentados e fontes de práticas transferíveis, mantendo a diferença entre participação, indicação global, finalista e vencedor. Ausência em uma busca limitada não prova ausência de participantes de determinada nacionalidade.

## 5. Fastino: capacidade real, promessas que não foram provadas

### GLiNER2.5-Decide

O card do fornecedor identifica o checkpoint como classificador em inglês, com múltiplas decisões na mesma chamada, sem geração de tokens. Seu benchmark apresentado é em inglês; o próprio card indica a versão multilíngue para entradas multilíngues. [E10] A biblioteca oficial distingue arquiteturas e oferece `AutoExtractor`. [E11]

Consequência para o Ipê: avaliar um classificador local em pt-BR exige exemplos do domínio, comparação com regras, política de abstenção e teste dos artefatos fixados. Nem “não gerar tokens” nem retornar JSON torna a classificação infalível. Não há implantação desses checkpoints no runtime publicado do jogo.

### Filtro PII multilíngue

O card publica F1 de spans de 0,477 e recall médio de 0,718 no benchmark apresentado. São resultados do autor, em um protocolo específico; não foram reproduzidos nesta sessão. [E12] A existência de falsos negativos é incompatível com uma garantia automática de remoção integral de dados sensíveis.

Consequência para o Ipê: uso local pode reduzir exposição a terceiros, mas não substitui minimização de dados, validação, retenção, controle de acesso ou revisão de privacidade. A afirmação “conformidade total” do briefing não foi adotada como fato.

### GLiDE

O card GLiDE 0.4B descreve decisões tipadas sobre texto/JSON, uma passagem por pergunta e agrupamento em microbatches. A mediana divulgada de 6,9 ms refere-se à RTX PRO 6000 especificada pelo autor. A licença identificada é Fastino Community. [E13] Não transportar esse número para Mac, CPU, navegador ou os equipamentos de AB sem ensaio equivalente; não confundir o checkpoint com uma API hospedada de mesmo nome ou com versões históricas que geravam raciocínio.

O controle de DOM, política de retry, cancelamento, timeout e autorização pertence ao código. O material conferido não demonstra um agente de navegação instantâneo e universal. A economia superior a 95% frente a um modelo de 70B também continua sem benchmark específico reproduzido para o aplicativo.

## 6. Originalidade e uso de ferramentas

O repositório público `NASA-SPACEAPP-2026/Space-Mission-Design-Game` descreve um jogo estático de CubeSat com Vite, sem backend e com estado no navegador. [E14] Ele foi lido como comparável. Seu nome não estabelece vínculo institucional com a NASA, e a revisão não executou nem incorporou seu código.

A existência desse comparável impede uma alegação séria de exclusividade para “jogo CubeSat offline”. A diferenciação do Ipê deve ser demonstrada no contrato de aprendizagem, procedência científica, investigação da falha e redesenho verificável. Tampouco é possível afirmar unicidade mundial dessa integração a partir de um único comparável.

O Archify é apresentado pelo upstream como ferramenta/skill para produzir diagramas interativos. [E15] O mapa do Ipê usa o renderizador fixado e um inventário/analisador de fontes elaborado para o projeto. Não atribuir ao Archify uma certificação automática da arquitetura, nem confundir relações propostas com importações realmente observadas no código.

## 7. Contrato do cronograma interativo

O painel R8 deve separar dois estados:

1. **Estado documentado do projeto**, incluído no JSON versionado com data de corte e evidências.
2. **Marcações pessoais do visitante**, salvas apenas em seu navegador, exportáveis/importáveis e identificadas como locais.

Uma marcação pessoal não publica commit, altera deployment, executa tarefa, confirma elegibilidade ou prova aceite da equipe. O tempo decorrido pode mudar a indicação de atraso, mas não o estado de conclusão. O prazo deve usar `America/Sao_Paulo`, com equivalência explícita de 15/11/2026 08h BRT para 11h UTC.

O relatório de QA do painel precisa testar filtros, navegação, dependências, importação rejeitada sem mutação parcial e persistência local. DOM simulado não demonstra layout, leitor de tela, impressão ou desempenho real. Esse limite deve acompanhar os resultados.

## 8. Integração técnica recomendada

O build público usa uma lista explícita de arquivos. Adicionar somente os artefatos públicos da central e os documentos selecionados. Não copiar a raiz do repositório, logs de autenticação, credenciais ou o relatório bruto de ambiente para `site/`.

A ordem coerente é: gerar o HTML autocontido → atualizar inventário/mapa → montar `site/` → calcular a CSP a partir dos scripts finais → executar verificações da distribuição e painel → publicar → conferir bytes e cabeçalhos do deployment efetivo.

`scripts/prepare-vercel-static.mjs` já varre scripts inline executáveis de todos os HTMLs e ignora blocos `application/json`. O painel deve usar listeners registrados em JavaScript, sem atributos `onclick`, `eval` ou dependência de scripts remotos. Um novo hash precisa constar da política enviada à Vercel.

Artefatos gerados e recibos com timestamps devem ficar fora de ciclos de hashes do mapa. `context/index.template.html`, dados e gerador podem ser inventariados como fontes; o HTML derivado e os recibos de execução precisam ser identificados como saídas. O teste de preservação do motor continua separado das novas funcionalidades do painel.

## 9. Estado de execução no corte desta revisão

- BETA R6 já publicada na Vercel, com recibos próprios.
- Git local íntegro conforme auditoria R7. O acesso remoto retornava 404 no início desta rodada; o usuário posteriormente criou e forneceu o repositório privado, e o conector confirmou permissões de push/admin. A branch `main` recebeu o arquivo de proveniência no commit de inicialização `94d2b6053c37751f5bee9fd3071ff732ecd0b80e`. A criação foi resolvida; o envio integral e sua conferência permaneciam em andamento neste corte. Um 404 de conector significa que o recurso não foi resolvido por aquele acesso, não prova universal de inexistência. A publicação pela API pode produzir um SHA diferente do histórico Git local; o bundle preserva esse histórico, sem alegar equivalência de commits entre os dois fluxos.
- Nova central R8 em implementação; só o recibo posterior à publicação pode afirmar seu deployment.
- Nenhum modelo Fastino baixado, executado ou incluído no runtime nesta revisão.
- Nenhum novo teste de aprendizagem com pessoas realizado.
- Nenhuma qualificação de navegador/equipamento real realizada por esta frente.

## Fontes primárias conferidas

- **E01 — NASA Space Apps 2026:** https://www.spaceappschallenge.org/2026/
- **E02 — GO Team, UI e features antes do início:** https://github.com/nasa/spaceapps/discussions/1872
- **E03 — GO Team, especificações/prompts antes do início:** https://github.com/nasa/spaceapps/discussions/2009
- **E04 — GO Team, Resources e trabalho antecipado:** https://github.com/nasa/spaceapps/discussions/1827
- **E05 — GO Team, guias atuais:** https://github.com/nasa/spaceapps/discussions/2028
- **E06 — Evento Rio Verde, conteúdo da liderança local:** https://www.spaceappschallenge.org/2026/local-events/rio-verde/
- **E07 — NASA, vencedores de 2025:** https://www.nasa.gov/learning-resources/stem-engagement-at-nasa/nasa-announces-2025-international-space-apps-challenge-global-winners/
- **E08 — AEB, finalistas brasileiros de 2025:** https://www.gov.br/aeb/pt-br/assuntos/noticias/seis-equipes-brasileiras-estao-entre-os-finalistas-do-nasa-space-apps-2025
- **E09 — WIPO, GII 2026:** https://www.wipo.int/pressroom/en/articles/2026/article_0014.html
- **E10 — Fastino, GLiNER2.5-Decide:** https://huggingface.co/fastino/GLiNER2.5-Decide
- **E11 — Fastino, implementação GLiNER2:** https://github.com/fastino-ai/GLiNER2
- **E12 — Fastino, PII multilíngue:** https://huggingface.co/fastino/gliner2-privacy-filter-PII-multi
- **E13 — Fastino, GLiDE 0.4B:** https://huggingface.co/fastino/GLiDE-0.4B
- **E14 — Comparável, autoria do repositório:** https://github.com/NASA-SPACEAPP-2026/Space-Mission-Design-Game
- **E15 — Archify, upstream:** https://github.com/tt-a1i/archify

Links de guias recuperados da publicação GO #2028, mas sem corpo acessível nesta coleta: https://www.spaceappschallenge.org/resources/project-submission-guide e https://www.spaceappschallenge.org/resources/judging-awards-guide. Resultados e limites foram comunicados à coordenação; nenhuma falha de busca foi contornada por navegação autenticada.
