# 42 — Prontidão e critérios do NASA Space Apps

**R17 · avaliação documental em 15/11/2026 · base de produto: R16, 0.7.0-beta.1.** Esta avaliação usa fontes primárias e evidências locais. Não é parecer dos organizadores, inscrição, avaliação de jurados ou previsão de prêmio. A revisão factual das histórias da R17 está descrita no [documento 44](44-HISTORIAS-REAIS-E-LIMITES-DIDATICOS.md); sua publicação deve ser conferida no [registro atual](https://github.com/oalexandrebelo/MISSAO-IPE/blob/main/PUBLICADO.md).

## A resposta franca

**Há um protótipo demonstrável e uma proposta educacional coerente. Ainda não há evidência suficiente para declarar a candidatura pronta ou o jogo em nível de vencer a competição.** A melhor parte é a cadeia entre escolha, falha explicável, comparação e redesenho. As lacunas decisivas estão na elegibilidade, correspondência ao enunciado completo, demonstração de aprendizagem e qualidade de uso no equipamento do público.

O risco mais importante não se resolve com mais 3D: o próprio projeto registra desenvolvimento específico anterior ao início permitido. O GO Team informa que trabalhar antecipadamente pode causar desclassificação. O fato da antecipação está documentado; uma decisão dos organizadores sobre a equipe não foi observada. Não se deve apagar o histórico nem tratar uma nova versão como regularização. [Cronologia do projeto](https://github.com/oalexandrebelo/MISSAO-IPE/blob/main/evidence/chronology.json), [orientação do GO Team sobre início](https://github.com/nasa/spaceapps/discussions/1827), [orientação sobre UI e funcionalidades](https://github.com/nasa/spaceapps/discussions/1872).

Isso não impede a continuidade do produto educacional. Impede afirmar, com a evidência disponível, que ele já está habilitado a concorrer ou que sua maturidade técnica garante um prêmio.

## O que foi confirmado sobre a edição

| Item | Confirmação e limite |
| --- | --- |
| Ano e tema | A NASA e a página institucional identificam **2026**, tema **The Next Frontier**, em **14 e 15 de novembro**. A data foi pesquisada, não inferida do relógio da máquina. |
| Janela geral | A página 2026 informa abertura de edição/envio em **14/11 às 09h** e encerramento em **15/11 às 23h59**, no horário local. Equipes de até seis participantes. Isso não prova que a equipe Ipê esteja inscrita ou tenha enviado um projeto. |
| Rio Verde | A agenda local recuperada indica pré-apresentações às **15h30**, envio às **17h** e apresentações às **18h** em 15/11. É conteúdo do organizador local; confirmar o corte aplicável com a organização, sem substituir a agenda local pelo teto geral. |
| Desafio escolhido | “Space Mission Design Game” aparece no contexto de equipes 2026 no domínio oficial. O resumo trata de projetar, gerir e simular uma missão com decisões de engenharia e recursos limitados. O enunciado integral e a lista Resources não foram recuperados nesta rodada. |

Fontes: [anúncio NASA de 15/10/2026](https://science.nasa.gov/universe/nasa-welcomes-all-ages-experience-levels-for-space-apps-challenge/), [página institucional 2026](https://www.spaceappschallenge.org/2026/), [agenda Rio Verde](https://www.spaceappschallenge.org/2026/local-events/rio-verde/), [bloco contextual do desafio em página de equipe](https://www.spaceappschallenge.org/2026/find-a-team/missionforge/).

A página de uma equipe não substitui o texto normativo do desafio. A [URL do desafio](https://www.spaceappschallenge.org/2026/challenges/space-mission-design-game/) retornou 502 nesta recuperação; a [aba Resources](https://www.spaceappschallenge.org/2026/challenges/space-mission-design-game/?tab=resources) não foi acessível pela ferramenta. Isso não demonstra indisponibilidade para todos os usuários.

## Requisitos de candidatura: evidência e pendências

| Requisito | Estado comprovado | O que encerra a pendência |
| --- | --- | --- |
| Cronologia compatível | O registro local declara início antecipado; elegibilidade não estabelecida. | Decisão aplicável dos organizadores, com a cronologia apresentada integralmente. Sem resposta, manter a condição explícita. |
| Inscrição, evento, equipe e envio | Não foram observadas página da equipe Ipê, confirmação de participantes ou submissão concluída. | Recibo/página oficial com equipe, evento, desafio e estado do envio, preservando dados pessoais desnecessários. |
| Responder ao desafio | Há alinhamento ao resumo: objetivos, engenharia, limites e consequências. | Matriz do enunciado integral com cada exigência apontando para funcionalidade ou limitação declarada. |
| Fonte NASA da lista Resources | MODIS e modelos NASA estão incorporados, mas sua presença na lista específica não foi comprovada. | Identificar ao menos uma fonte da lista oficial, mostrar onde é usada e citá-la no envio. Mais APIs não substituem essa correspondência. |
| Autoria, créditos e licença | Há Apache-2.0, NOTICE, manifestos e registros de assistência por IA. | Conferir se o pacote final e o formulário refletem todos os recursos e ferramentas efetivamente usados. |
| Demonstração exigida | Existe jogo público e material de apresentação; não foi observado pacote final aceito pelo formulário. | Abrir os links sem login e conferir formato, idioma, duração/número de slides e envio efetivo. |

O GO Team exige, para Global Awards, ao menos uma fonte NASA incluída nos Resources do desafio e referência aos materiais utilizados. A origem NASA de um arquivo é uma condição diferente de sua presença nessa lista. [Orientação oficial sobre recursos](https://github.com/nasa/spaceapps/discussions/1849).

Os [termos 2026](https://www.spaceappschallenge.org/legal/) requerem direitos sobre o material submetido e disponibilização do conteúdo original de forma livre ou sob licença de código aberto compatível com OSI. Também incluem regras de participação e proteção de dados/imagens de pessoas. O código Apache do projeto ajuda, mas não relicencia materiais de terceiros nem substitui a conferência do pacote final.

## Uso de IA e apresentação

A orientação do GO Team permite IA, exige declarar onde e como foi usada e prevê tratamento específico para mídias geradas: marca visível em imagens/vídeos; reconhecimento em descrição e metadados para áudio, código e dados. Conteúdo gerado não deve usar, conter ou modificar elementos de marca NASA. A avaliação considera a contribuição original e a execução da equipe; não há garantia de pontuação por quantidade de código ou automação. [Resposta do GO Team](https://github.com/nasa/spaceapps/discussions/1849).

Nesta revisão não foi feita uma auditoria completa de cada arquivo audiovisual, metadado e campo do formulário. O [NOTICE](https://github.com/oalexandrebelo/MISSAO-IPE/blob/main/NOTICE.md) documenta assistência por IA, porém sua existência não prova que todas as condições do envio final foram satisfeitas.

Uma resposta de suporte no repositório NASA orienta vídeo de até **30 segundos** ou apresentação de até **sete slides**, com texto em inglês ou legendas inglesas. Essa é orientação de Navigator; o [Project Submission Guide](https://www.spaceappschallenge.org/resources/project-submission-guide/) e o formulário vigente continuam sendo a referência final. O guia não foi recuperado integralmente nesta sessão. Um HTML de apoio ou um pitch histórico de dez slides não deve ser apresentado como automaticamente aceito. [Resposta de suporte sobre envio](https://github.com/nasa/spaceapps/discussions/1973).

## Como avaliar a qualidade sem inventar uma nota

O evento Ajmer 2026 publica cinco eixos: impacto, criatividade, validade, relevância e apresentação. É uma página de organização local, identificada como conteúdo de participante/Local Lead. O [guia global de julgamento](https://www.spaceappschallenge.org/resources/judging-awards-guide/) retornou 502. Portanto, a matriz abaixo usa esses eixos como **estrutura de avaliação**, sem atribuir pesos, escala ou rubrica oficial específica de Rio Verde. [Critérios publicados por Ajmer](https://www.spaceappschallenge.org/2026/local-events/ajmer/).

| Eixo | Força real da R16 | Lacuna competitiva | Evidência que aumentaria a confiança |
| --- | --- | --- | --- |
| Impacto | Atividades para compreender potência, transmissão e adequação de instrumento. | Aprendizagem e necessidade do público ainda não medidas. | Sessões com estudantes/educadores, tarefa antes/depois e explicação causal registrada, sem transformar um piloto pequeno em eficácia universal. |
| Criatividade | Prever → comparar um fator → ver a nave no mesmo instante → redesenhar. | Não há demonstração de novidade mundial; um acervo 3D isolado não é inovação pedagógica. | Demonstração curta em que o visitante entende uma consequência que antes parecia contraditória. |
| Validade | Domínios determinísticos, resultados conferíveis e separação entre dados reais e sintéticos. | Sem propagação orbital, óptica real ou validação independente de engenharia. | Revisão por educador/especialista e rastreio de cada afirmação científica à fonte correta. |
| Relevância | Três casos e quatro segmentos; escolhas afetam o retorno da ciência. | Enunciado completo ainda não mapeado; lançamento/órbita são fixos ou conceituais. | Matriz de cobertura do texto oficial, com justificativa das simplificações. |
| Apresentação | Jogo público, cenários comparáveis, fontes e biblioteca. | Muitas rotas podem dispersar a demonstração; ausência de teste com visitante novo e pacote global final. | Uma entrada recomendada, um percurso completo sem ajuda e pitch compatível com o formulário. |

### Categorias de premiação: limite da confirmação

A [página oficial de prêmios de 2025](https://www.spaceappschallenge.org/2025/awards/) lista dez categorias: Best Use of Science, Best Use of Data, Best Use of Technology, Galactic Impact, Best Mission Concept, Most Inspirational, Best Use of Storytelling, Global Connection, Art & Technology e Local Impact. **Essa lista é histórica, não confirmação das categorias de 2026.** A URL 2026 não forneceu conteúdo verificável nesta consulta.

Como posicionamento editorial, o Ipê tem material mais defensável para explicar método científico, uso responsável de dados e aprendizagem por decisões. Isso não significa enquadramento garantido, indicação ou vitória em qualquer categoria. A lista de vencedores anteriores não fornece a taxa de sucesso desta equipe nem uma comparação válida com concorrentes atuais.

## O que o produto realmente entrega

O [recibo local R16](https://github.com/oalexandrebelo/MISSAO-IPE/blob/main/evidence/revision-r16.json) registra **145 testes de domínio e 38 de interface** no laboratório, além de verificações de contexto, distribuição e campanha preservada. O [recibo público R16](https://github.com/oalexandrebelo/MISSAO-IPE/blob/main/evidence/production-r16.json) registra **291 arquivos**, HTTP, hashes e políticas na implantação identificada. São evidências do build conferido, não promessa sobre qualquer deploy futuro.

| Capacidade | Evidência disponível | Alcance |
| --- | --- | --- |
| Cerrado | Arquivos Terra/MODIS históricos; comparação BANDAS/ÍNDICE e gargalo de potência. | Transporte e processamento didáticos; não operação real do Terra nem diagnóstico ambiental. |
| Bennu | Contatos curtos/ampliados produzem 2/6 e 6/6 registros no ensaio controlado. | Seis registros sintéticos; nenhuma seleção real de local de coleta. |
| Telescópio | Câmera recebe seis pacotes, mas não satisfaz o requisito; espectrômetro entrega seis válidos. | Catálogo genérico; não descreve todas as capacidades do NIRCam nem reproduz espectros Webb. |
| Cooperação | Quatro papéis de revisão no mesmo dispositivo. | Colaboração local; sem sessão online ou comprovação da contribuição de cada pessoa. |
| Histórias | R17 substitui equipes inventadas por fatos NASA datados e fontes. | Alteração editorial local; os valores sintéticos não viram telemetria por associação. |
| 3D e acesso | Modelos locais, montagem configurável, alternativa 2D e ações em navegador registradas. | Não há medição de FPS, teste físico de toque ou certificação integral de acessibilidade. |
| Dados e persistência | Projetos/relatórios e caderno têm contratos documentados. | Tentativas de expedições não persistem automaticamente; escrita simultânea em abas tem limitação conhecida. |

O volume de testes comprova comportamentos selecionados do software. Ele não mede compreensão, motivação, clareza, tempo de carregamento ou sucesso de alunos. A aparência de uma cena 3D também não comprova fidelidade física.

## Ordem recomendada de fechamento

| Prioridade | Pendência | Tipo | Aceite verificável |
| --- | --- | --- | --- |
| P0 | Elegibilidade temporal | Risco comprovado; decisão externa desconhecida. | Cronologia integral e resposta dos organizadores aplicável ao projeto; sem resposta, nenhuma alegação de habilitação. |
| P0 | Enunciado, Resources, inscrição e prazo | Evidência ausente nesta revisão. | Página oficial/recibo e matriz de cobertura; fonte NASA qualificada explicitamente citada. |
| P0 | Pacote de submissão | Aceitação/formato não demonstrados. | Formulário completo, links públicos, autoria/créditos, demonstração no formato atual e confirmação do envio. |
| P1 | Uma jornada principal | O produto tem múltiplas rotas; confusão de visitante não foi medida. | Pessoa nova encontra a missão, prevê, executa, explica uma falha e refaz sem instrução do desenvolvedor. Registrar obstáculos. |
| P1 | Narrativa e dados separados | R17 corrige fatos e fontes localmente. | Conferência de todas as telas e do guia; nenhuma frase atribui os registros sintéticos à NASA ou o exercício a uma missão real. |
| P1 | Aprendizagem inicial | Não medida. | Piloto pequeno com protocolo declarado, respostas antes/depois e exemplos de transferência para um caso novo. Registrar também erros e desistências. |
| P1 | Equipamento e conexão | Celular físico, FPS e carga não medidos. | Medir uma missão completa em computador e telefone representativos; registrar aparelho, navegador, rede, tempos e falhas. Verificar alternativa 2D e recuperação. |
| P2 | Novos dados e física | Oportunidades futuras, não pré-requisito automaticamente confirmado. | Só integrar um novo produto se melhorar a pergunta e houver unidade, qualidade, proveniência e validação. |

As metas de teste acima são propostas do projeto, não limites oficiais da competição. Um piloto de cinco pessoas pode revelar problemas concretos, mas não provar impacto educacional em escala. Mais modelos, bibliotecas ou APIs devem esperar uma lacuna pedagógica clara; não substituem a verificação do caminho principal.

## Decisão de prontidão

**Demonstração de P&D:** há base publicada e verificável na R16, sujeita a conferir a implantação atual e os equipamentos de apresentação. **Candidatura competitiva:** prontidão não estabelecida devido às pendências acima. **Nível vencedor:** não determinável com a evidência disponível; não há pontuação oficial, comparação válida com os concorrentes ou resultado de jurados.

O próximo avanço convincente é demonstrar que alguém aprende a justificar uma decisão usando evidência real e limites claros, enquanto o pacote cumpre as regras aplicáveis. A honestidade sobre o que é histórico, simulado e desconhecido faz parte da qualidade científica do produto.

O [registro estruturado desta avaliação](https://github.com/oalexandrebelo/MISSAO-IPE/blob/main/research/readiness-r17.json) conserva fontes, limites de recuperação, evidências e critérios de aceite. Nenhuma mensagem foi enviada aos organizadores nesta avaliação.
