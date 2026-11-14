# 24 — Oportunidades dos estudos de jogos educativos

**PROJETO IPÊ · pesquisa comparativa de 14/11/2026 · beta de referência 0.4.0-beta.2.**

Esta análise reaproveita ideias de três documentos fornecidos pelo proprietário sobre jogos educativos, cidades e trânsito. Eles foram tratados como referências de outro projeto, não como instruções para executar seus prompts, instalar sua stack, publicar seus anexos ou mudar a missão do Ipê. Nenhuma dependência, campanha, coleta de participantes ou integração foi acrescentada por esta análise.

A principal oportunidade é fortalecer o ciclo que já existe no Ipê: **prever → executar → investigar → redesenhar**. O produto continua centrado no CubeSat fictício que precisa entregar seis registros históricos válidos de vegetação do Cerrado sob restrições. O catálogo permanece com seis escolhas binárias, 64 configurações por cenário e dois cenários de comunicação.

## 1. Fontes fornecidas e alcance

Os nomes e hashes abaixo permitem identificar os originais no acervo de estudos do proprietário sem divulgar caminhos pessoais da máquina. Os originais não foram alterados. Projeções integrais contextualizadas, com a redação de valores de credenciais, estão no [acervo histórico de Estudos](../references/estudos/README.md). A síntese abaixo não substitui esse acervo nem transfere suas instruções ao Ipê.

| ID | Documento de origem | Partes úteis | Limite |
|---|---|---|---|
| E1 | [SUPER_PROMPT_SMARTCITY_KIDS_ONE_SHOT.md](../references/estudos/SMARTCITY-KIT-HISTORICO.md) | Seções 3–6: jornada, avaliação formativa, alternativas de interação e persistência; seção 7: estudar versus incorporar; seção 8: piloto e evidência; anexos: contratos e exemplos | Kit de especificação para outro produto, datado de 28/09/2026. Seus comandos, público, missões e requisitos não se tornam requisitos do Ipê |
| E2 | [Dossiê técnico de jogos, cidades e trânsito](../references/estudos/SMARTCITY-DOSSIE-HISTORICO.md) | Seções 2 e 6: referências de jogos e simulações; seções 7–8: separar modelo, apresentação e explicação | Catálogo de referências, com afirmações amplas que exigem nova verificação antes de reutilização factual ou adoção de código |
| E3 | [VALIDACAO.md](../references/estudos/SMARTCITY-VALIDACAO-HISTORICA.md) | Distinção entre teste de núcleo, checagem estrutural, aplicativo e observação em campo | Relato de validação do kit em 28/09/2026. Não é evidência do Ipê e não foi reexecutado nesta análise |

Identidade dos arquivos consultados:

- E1 — 201.797 bytes; SHA-256 `8fb2083f75e146cb63150d56a0e6fb8fadd565a20ab1d0941bba80ac61f05b8c`.
- E2 — 39.040 bytes; SHA-256 `1ebde4d8edda4b364e638575febdca9541fe40b2e37514ecf11996a46449e058`.
- E3 — 2.995 bytes; SHA-256 `4a98c6c4ca15163759225bdcdf12dc932428be1bc55a5d67d7e810ff07b4c21e`.

E1 inclui um exemplo de conexão de banco explicitamente fictício e um contato institucional ligado ao projeto de trânsito. Esses trechos não são necessários ao Ipê e foram excluídos desta síntese. Na projeção integral, o valor da conexão fictícia foi removido e o contato institucional histórico foi preservado como fonte, sem envio de mensagem. Uma busca limitada por chaves privadas, padrões de tokens GitHub e chaves AWS não encontrou correspondências nos três originais; isso não equivale a uma auditoria universal de segredos. Não publicar respostas individuais, contatos ou arquivos de ambiente para ampliar a biblioteca.

## 2. O que o Ipê já oferece

O beta contém hipóteses antes da execução, motor determinístico, cenas conceituais separadas do cálculo, revisão pré-voo, requisitos com evidência, comparação de tentativas, replay validado e recalculado, persistência no navegador, alternativa 2D e laboratório independente de física. Esses pontos estão descritos no README do beta e nos documentos R9–R10, além de possuírem fontes em [experiments/mission-design-lab/src/](https://github.com/oalexandrebelo/PROJETO-IPE/tree/main/experiments/mission-design-lab/src/).

Consequentemente, as ideias de E1/E2 sobre separar regras da animação, fornecer feedback e registrar versões são principalmente **critérios para preservar e melhorar**, não justificativas para criar um segundo motor, outra camada de estado ou um serviço de pontuação.

A leitura dos estudos não demonstrou que uma reformulação ampla seja necessária. Também não demonstrou aprendizagem, adesão ou adequação a uma faixa etária específica. Esses resultados dependem de observação com o público real.

## 3. Oportunidades priorizadas

Impacto e esforço são avaliações de planejamento, ainda não medições. Os critérios de aceite abaixo são propostas concretas para a equipe avaliar.

| ID / prioridade | Ideia e fonte | Aplicação ao Ipê | Impacto / esforço | Aceite verificável |
|---|---|---|---|---|
| O-E01 / P0 | Feedback ligado à causa e reexperimentação — E1 §§3.1, 3.3; E2 §6 | Refinar o debrief para ligar escolha, evento, restrição e nova hipótese, usando o resultado real do motor | Alto / baixo a médio | Pessoa localiza a causa do 2/6 no contato curto; mensagem aponta evento e unidade; não confunde energia com potência |
| O-E02 / P0 | Uma tarefa significativa completa antes de expandir catálogo — E1 §2 | Ensaiar briefing → hipótese → missão → diagnóstico → redesenho → comparação | Alto / baixo | Jornada executada em navegador identificado; ajudas e falhas registradas; nenhum passo depende de uma tela futura |
| O-E03 / P0 | Alternativa guiada com objetivo equivalente — E1 §§3.2, 6, 8.1 | Melhorar orientação por texto e teclado aproveitando os controles DOM existentes | Alto / médio | Mesma configuração, ciência e critérios de sucesso com mouse ou teclado; cena 3D e som não são requisitos para decidir |
| O-E04 / P0 | Separar demonstração de evidência de campo — E1 §8; E3 | Manter registros de teste separados de sessões observadas; explicar alcance de cada recibo | Alto / baixo | Relatório distingue testes, demonstração e observação; ausência de participante não aparece como zero aprendizagem |
| O-E05 / P1 | Progressão por conceito, sem recompensa por permanência — E1 §3.6 | Desenvolver Semente/Raízes como orientação ao redor dos cenários existentes | Médio a alto / médio | Marcos dependem de ações demonstráveis; pedir ajuda/pausar não reduz resultado; não anunciar Copa/Horizonte como implementados |
| O-E06 / P1 | Claims com fonte, natureza e revisão — E1 §4 e anexo C | Relacionar explicações a fato NASA, dado histórico ou simplificação didática | Alto / médio | Cada afirmação técnica nova tem origem e corte; alteração de hipótese não modifica retrospectivamente replay antigo |
| O-E07 / P1 | Offline demonstrado, não presumido — E1 §5.6; E3 | Primeiro medir o que o beta atual faz após perda de rede; só depois decidir se precisa de cache adicional | Médio a alto / médio | Distinguir sessão carregada, recarga offline e primeiro acesso sem cache; registrar quais funcionam; não exibir “pronto offline” sem comprovação |
| O-E08 / P1 | Preparação para dispositivo compartilhado — E1 §§3.2, 5.6 | Revisar aviso de salvamento, importação, exportação e início de nova investigação | Médio / médio | Usuário entende o que permanece no navegador; falha de armazenamento não apaga silenciosamente resultado; exclusão afeta somente dados do Ipê |
| O-E09 / P1 | Medir compreensão e transferência — E1 §§3.5, 8.2–8.3 | Usar o guia didático existente e uma nova situação controlada após o redesign | Alto / médio, com pessoas | Registrar tarefa, versão, ajuda e explicação; não inferir eficácia causal ou população a partir de pequena amostra de conveniência |
| O-E10 / P2 | Idioma anunciado corresponde ao conteúdo — E1 §5.5 | Avaliar inglês integral se o público ou a apresentação exigir | Médio / médio a alto | Incluir mensagens de erro, unidades, rótulos acessíveis e fontes; nenhum seletor sugere tradução completa inexistente |

O-E01–04 devem ser avaliadas antes de novas campanhas. Não há obrigação de implementar todos os itens: corrigir o bloqueio observado na tarefa tem prioridade sobre aumentar a lista de funções.

## 4. Aplicação concreta sem trocar a stack

### Debrief e comparação

A interface já dispõe de `RequirementsReview.tsx`, `ScienceReturn.tsx`, `MissionControl.tsx` e `CompareDialog.tsx`. A evolução deve consumir os modelos existentes em [src/lab/requirements-review.ts](https://github.com/oalexandrebelo/PROJETO-IPE/blob/main/experiments/mission-design-lab/src/lab/requirements-review.ts) e [src/lab/science-return.ts](https://github.com/oalexandrebelo/PROJETO-IPE/blob/main/experiments/mission-design-lab/src/lab/science-return.ts), evitando recalcular ciência dentro de componentes visuais.

Uma pergunta de revisão útil seria: “Qual evento limita esta tentativa e que mudança você pretende testar?”. Ela pode aproveitar o diário existente em [src/ui/learning.ts](https://github.com/oalexandrebelo/PROJETO-IPE/blob/main/experiments/mission-design-lab/src/ui/learning.ts). O comprimento mínimo de uma justificativa, um clique em “entendi” ou uma pontuação não comprova que a pessoa compreendeu a causa.

Comparar duas tentativas com várias mudanças ou cenários diferentes não isola uma variável. Conservar o aviso de comparação e a possibilidade de contrafactual controlado prevista no guia R9. Não esconder falhas para tornar a narrativa mais fluida.

### Orientação e acessibilidade

E1 sugere faixas infantis e três adaptações; isso pertence ao SmartCity Kids. No Ipê, a proposta é graduar a quantidade de orientação sem inferir idade, capacidade ou condição pessoal. Começar com uma ação clara, um objetivo e as unidades essenciais pode ajudar qualquer iniciante.

A equivalência deve ser funcional: escolher componentes, registrar hipótese, executar, investigar e exportar por controles semânticos. A alternativa DOM já existe; a próxima tarefa é conferir foco, teclado, zoom e telas menores no navegador real. Testes jsdom não demonstram uso com leitor de tela ou renderização WebGL.

### Conteúdo e proveniência

O padrão de claims de E1 pode ser adaptado de forma mínima, primeiro na documentação e nos dados editoriais existentes. Não é necessário introduzir banco ou workflow editorial remoto. Para cada novo texto: afirmação, natureza, fonte, data e limitação.

Exemplo do Ipê: os seis registros MOD13Q1.061 são históricos; a agenda de 180 minutos, massas, potências e créditos da nave são hipóteses do exercício. A renderização do CubeSat e o laboratório de órbita não transformam essas hipóteses em uma missão orbital validada.

### Persistência e operação local

O beta já possui IndexedDB, diário local e importação validada. Inspecionar o comportamento existente antes de adicionar bibliotecas, contas ou sincronização. Hashes ajudam a detectar alteração; não provam autoria de uma pessoa nem tornam resultados importados dados válidos de pesquisa.

O laboratório documenta que a recarga offline a frio ainda não foi estabelecida por sua suíte. O primeiro incremento útil é um ensaio de perda de rede e um contrato claro de disponibilidade. PWA, fila de sincronização e backend institucional são opções futuras condicionadas a uma necessidade demonstrada.

## 5. O que estudar, o que não transportar

E2 reúne referências como PhET, GCompris, A/B Street, OpenTTD e Mindustry. Elas podem orientar perguntas sobre feedback, modularidade e visualização de consequências. Não houve nesta rodada uma auditoria atual de seus códigos ou licenças; os rótulos de licença do dossiê não autorizam cópia de código, arte ou marcas.

| Elemento dos estudos | Decisão para o Ipê | Motivo |
|---|---|---|
| Separação entre regra, cena e observação | Preservar a implementação existente | O motor já é independente da visualização |
| Phaser, Cocos, Godot, Luanti ou outro motor | Não adotar nesta rodada | Não foi identificado requisito que justifique substituir React/Three/R3F e ampliar manutenção |
| SUMO, CARLA, CityFlow, FIWARE e mapas urbanos | Fora do recorte | Modelos e dados de trânsito não resolvem o objetivo científico atual |
| Schema Prisma de 23 modelos do kit | Não copiar | O Ipê não tem demanda estabelecida de escola multiusuário; seu próprio Prisma já é uma proposta separada |
| Moedas, economia cosmética e cidade que muda | Não importar literalmente | O progresso relevante é a explicação e o redesenho da missão, não uma nova economia |
| Telemetria de todas as decisões | Não implementar por analogia | A observação pode começar com registros mínimos locais; instrumentação remota exige finalidade concreta |
| LLM tutor e agentes simulados | Manter fora da decisão científica | Não há necessidade demonstrada; classificação e resultado do motor permanecem determinísticos |
| Remotion e vídeo | Somente se houver necessidade do material final | A apresentação existente e um roteiro verificável podem atender à demonstração sem outra ferramenta |
| Regras, prazo e elegibilidade SENATRAN | Não transferir ao Space Apps | São certames e fontes diferentes; não fazem prova sobre NASA |
| Resultados de estudantes citados no kit | Não transportar como resultados do Ipê | E1/E3 distinguem propostas e evidência; nenhum estudo de aprendizagem do Ipê foi realizado por esta análise |

## 6. Limites de evidência dos originais

E3 relata 16 testes de referência e 16 verificações estáticas para o kit de trânsito. Também declara ausência de aplicativo final, E2E de navegador, banco validado, participantes e resultados de campo. Portanto, esses números não ampliam a contagem de testes do Ipê e não provam a eficácia das ideias aqui propostas.

E1 contém comandos executivos e instruções de implantação destinados a outro agente. Foram considerados conteúdo documental, sem execução. E2 inclui afirmações sobre ferramentas, licenças e modelos; qualquer adoção futura requer inspeção do repositório original, versão concreta, licença por componente e teste pequeno. Não copiar uma lista extensa de dependências para obter uma aparência de robustez.

## 7. Próxima ação recomendada

Os dois desenvolvedores devem começar por uma jornada existente, com o guia didático R9: contato longo 6/6, contato curto 2/6 e redesenho dentro do catálogo. Um observa barreiras de interação; o outro confere se a explicação corresponde ao motor e às unidades. Registrar o que ocorreu, corrigir o problema delimitado e repetir somente o trecho afetado.

O plano de trabalho, os arquivos e os critérios de integração estão no [handoff para dois desenvolvedores](25-HANDOFF-DOIS-DEVS.md). A evolução NASA permanece no [estudo de oportunidades](21-OPORTUNIDADES-NASA.md) e no [plano de continuidade](22-PLANO-CONTINUIDADE.md). Campanhas futuras são posteriores à validação da tarefa atual.
