# 03 — Oportunidades concretas e protocolo spec ↔ código ↔ prova

**Parecer de pesquisa, 14/11/2026.** Base: capítulos 01, 02 e 04 de `ab-global-final-round/docs/` e `upload/Texto colado(1).txt`. Este documento propõe decisões; não implementa o jogo, instala ferramentas, mede desempenho ou demonstra aprendizagem. As fontes abaixo foram consultadas nesta data. O escopo é o Ipê local, com seis registros MOD13Q1, duas representações científicas e catálogo finito.

**Nota de integração da coordenação:** o contrato implementado posteriormente nesta rodada fixa 64 configurações e meta de busca de 1 s no equipamento de demonstração. O orçamento anterior de 256 candidatas/3 s citado no parecer é histórico. O replay implementado contém versões, `sciencePackHash`, entrada e resultado, mas não exporta um certificado completo da busca nem campos `scenarioHash`/`catalogHash`. A demonstração do mínimo está na enumeração e nos testes independentes; exportar esse certificado é trabalho adicional. O diário atual persiste previsões/reflexões localmente por decisão de produto, explicitada no PRD. Metas e propostas deste parecer não são alegações automáticas sobre o código entregue.

## 1. A novidade que merece começar agora

**Escolher P0: um recibo verificável de missão, gerado pelo mesmo contrato que determina a vitória.** A contribuição demonstrável é conectar pedido científico, procedência, execução, explicação e decisão de transferência. O jogador deve conseguir abrir uma afirmação como “faltou entregar um registro”, localizar o evento e recalcular a consequência. Um avaliador recebe os mesmos arquivos e confere o resultado offline.

Isso aprofunda o projeto existente sem acrescentar outro simulador, backend ou agente em tempo de execução. Procedência deixa de ser uma aba de créditos: a ausência de uma banda, um QA inadmissível ou uma versão incompatível impede aquele registro de satisfazer o objetivo. A origem NASA influencia o que pode ser declarado recebido e cientificamente utilizável.

“Proof-carrying explanation” é aqui um nome de projeto para **explicação acompanhada de evidência verificável**. Proof-carrying code já possui fundamento anterior, baseado em produtor de prova e verificador [S01]. Um JSON, um hash ou um replay não constituem, por si, prova formal dessa tradição. Nosso compromisso menor é especificar exatamente o que um verificador aceita e quais erros ele detecta. Não reivindicar originalidade absoluta: jogos NASA já relacionam objetivos científicos, instrumentos e missões reais [S02]; procedência e recourse também têm precedentes consolidados [S03–S04].

O primeiro incremento revisável deve conter contrato, um caso de sucesso, um caso de falha, recibos esperados e verificação independente da aritmética. Somente depois integra-se a apresentação. Isso produz uma tese concreta de produto: **o estudante aprende a justificar por que a ciência chegou ou não chegou, dentro de hipóteses inspecionáveis**. Ainda é hipótese educativa, não resultado observado.

## 2. Do catálogo de fontes ao contrato executável

O contrato separa três classes: fatos do arquivo científico; parâmetros didáticos do cenário; resultados calculados. Nunca atribuir os dois últimos à NASA por estarem no mesmo pacote. MOD13Q1 é produto processado e composto temporalmente; carregar seus registros não significa simular sua aquisição instantânea por um CubeSat. A qualificação do recurso perante o desafio permanece um gate próprio: procedência NASA não substitui confirmar o vínculo exigido aos Resources oficiais.

Cada requisito ganha ID estável e vínculo explícito:

| Requisito | Regra executável | Evidência exigida |
|---|---|---|
| SCI-01: seis resultados utilizáveis | IDs esperados completos, únicos e aceitos pelo QA | Conjunto recebido, rejeições e referência de cada registro |
| SCI-02: representação equivalente | BANDAS e ÍNDICE satisfazem a mesma tolerância publicada | Resultado calculado, referência e diferença |
| ENG-01: conservação | Balanços de bits e energia, com perdas declaradas | Resíduos por intervalo e caso manual independente |
| EXP-01: explicação fiel | Toda frase causal aponta regra e evento existente | IDs resolvidos; número exibido igual ao calculado |
| LRN-01: primeira decisão preservada | Resposta de transferência antecede ajuda | Ordem de eventos, nível de ajuda e revisão posterior |

A estrutura mínima associa `contractVersion`, `packHash`, `scenarioHash`, `catalogHash`, `engineVersion`, entrada congelada e resultado. Para cada transformação: IDs de entrada e saída, função/versionamento, unidade, arredondamento e referência documental. PROV fornece um vocabulário útil de entidades, atividades e responsáveis e distingue história consistente de mera coleção de metadados [S03]. Não é necessário implementar RDF ou toda a especificação no P0.

O **diário de missão para investigação** registra eventos discretos com sequência, tempo simulado, precondição, mudança de estado, regra aplicada e registros afetados. Eventos do estudante ficam separados dos eventos simulados: a ordem local de uma resposta não é instante orbital. Preservar falhas e tentativas, inclusive abandono, ajuda e gravação abortada.

Um cartão de explicação deve responder: o que ocorreu; qual condição foi violada; que evidência sustenta isso; que entrega foi afetada; qual intervenção foi testada. “Rádio insuficiente” sem janela, volume, fila e consequência é interpretação solta. O primeiro evento observável pode ser um sintoma: buffer cheio pode decorrer de contato curto, representação volumosa ou política de captura. A interface deve chamar o dado de “primeira violação” até existir evidência para a alegação causal mais forte.

Hashes detectam alteração em relação a bytes conhecidos; não autenticam quem produziu o arquivo. Uma cadeia de hashes local pode ser inteiramente recalculada por quem controla o arquivo. No P0, preferir manifesto completo e comparação com pacotes confiáveis, evitando promessa de diário inviolável. O verificador rejeita referências ausentes, recalcula saídas e diferencia resultado declarado de resultado conferido. Seu uso do mesmo motor testa consistência; oráculos manuais independentes continuam necessários para detectar erro compartilhado.

## 3. Menor redesenho: uma afirmação matemática delimitada

Definir o conjunto finito de projetos admissíveis \(C\), a configuração inicial \(x\), condições externas fixas \(z\) e predicado de sucesso \(F(y,z)\). A métrica inicial deve ser transparente:

\[
d(x,y)=\sum_j \mathbf{1}[x_j\ne y_j],\qquad
k^*=\min_{y\in C:F(y,z)}d(x,y).
\]

Essa é a menor **quantidade de escolhas alteradas neste catálogo**, não o menor custo industrial, a melhor missão universal ou a intervenção fisicamente mais barata. Se massa, preço ou energia desempatarem alternativas, publicar a ordem e provar também esse critério; não ocultar pesos dentro de um score. Empates devem permanecer visíveis.

O certificado contém uma testemunha viável \(y\), sua distância \(k\), versões congeladas e o registro completo da verificação de todas as candidatas admissíveis com distância menor que \(k\). O conferidor reconstrói o catálogo e reexecuta essas candidatas. Contagem e digest desacompanhados dos dados necessários não demonstram cobertura. Se nenhuma candidata funciona, só a enumeração integral permite “sem solução neste catálogo”. Cancelamento antes de concluir as camadas menores deixa “testemunha viável; mínimo não certificado”. Enumerar todos os empates é obrigação adicional caso se prometa listá-los.

Karimi e colaboradores distinguem proximidade entre descrições e ação com efeitos causais [S04]. Para Ipê, a consequência prática é recalcular todos os efeitos de trocar uma peça: massa, consumo, fila e compatibilidade. Não basta editar o valor final da bateria. Preservar objetivo, dados e condição externa; mudar hardware significa novo projeto antes do lançamento. Trocar simultaneamente objetivo e peça deixa de responder à pergunta original.

Uma intervenção suficiente para reparar a missão não identifica necessariamente sua única causa. Pode haver falhas concomitantes ou redundância. O jogo deve mostrar quando uma mudança isolada elimina a violação local, mas a missão continua falhando. Essa distinção entre diagnóstico e reparo é uma oportunidade educativa melhor que uma seta determinista com aparência científica.

## 4. Aprender investigando, com transferência observável

A evidência externa justifica experimentar o ciclo, não declarar sua eficácia antecipadamente. Kapur encontrou benefícios de resolução anterior à instrução em estudos controlados de matemática [S05]. O desenho inclui consolidação; simplesmente deixar o participante falhar não equivale à intervenção estudada. Hassan e Zilles observaram que ferramentas precisam expor o erro relevante e que chegar à saída correta pode preservar um entendimento errado [S06]. Não transferir automaticamente esses resultados para engenharia espacial.

O ciclo proposto é: prever o gargalo; executar; inspecionar um evento; explicar com suas palavras; redesenhar; receber uma explicação consolidada; decidir numa condição nova. A ajuda cresce de recurso para evento e depois alternativa. A sugestão mínima aparece depois da tentativa própria. A pessoa pode completar a missão por tentativa e erro e ainda precisar aprender a relação técnica.

Na transferência, mudar a disponibilidade relativa de energia e comunicação sem ensinar uma regra nova escondida. O catálogo deve comprovar que as duas representações têm regiões de utilidade; inverter arbitrariamente o vencedor seria um truque de puzzle. Registrar a primeira escolha antes do resultado ou da sugestão. Usar uma rubrica simples: identificou o recurso limitante; conectou decisão e mecanismo; justificou a mudança sob a nova condição. Dois avaliadores podem codificar explicações anonimizadas e registrar divergências.

Seis sessões e até dois pilotos podem revelar defeitos e exemplos de transferência próxima imediata. Não estimam eficácia populacional, retenção ou causalidade do jogo frente a outro ensino. Acertos, erros, ajuda e desistências pertencem ao resultado. Uma avaliação posterior pode contrabalançar cenários e comparar o diário explicativo com uma condição equivalente sem ele.

O portfólio NASA entra após a decisão: relacionar a pergunta, a grandeza observada e o compromisso técnico a missões documentadas. O jogo oficial Build It Yourself já oferece esse tipo de conexão [S02]. No Ipê, a correspondência deve ser por atributo, sem sugerir que o satélite didático reproduz Terra/MODIS ou recebe validação NASA.

## 5. Robustez: ensinar margem sem inventar distribuição

P0 usa parâmetros didáticos nominais, identificados e versionados. P1 acrescenta um conjunto explícito de condições \(U\): contatos mais curtos, potência disponível menor ou demanda maior. Projeto robusto significa \(F(y,u)\) verdadeiro para todo \(u\in U\). Com conjunto finito, enumerar \(C\times U\) é verificável. Com intervalos contínuos, testar extremos só basta se houver argumento de monotonicidade ou propriedade matemática equivalente. Políticas, saturações e mudança da ordem de eventos podem invalidar essa simplificação.

Não chamar taxa de sucesso numa grade de “probabilidade real de missão”. Monte Carlo exige distribuições justificadas e produz estimativas com incerteza amostral. Intervalos escolhidos para ensino devem ser rotulados como tais. A mesma disciplina vale para “reserva de 20%”: sem fonte ou hipótese declarada, o percentual é uma regra de cenário, não engenharia validada.

NASA-STD-7009B e o handbook ativo de 2026 tratam credibilidade, uso pretendido, verificação, validação, sensibilidade e incerteza [S07]. Aproveitar essa estrutura sem alegar conformidade formal. Verificar conservação prova coerência de implementação; comparar com um referencial apropriado investiga adequação física. Nenhuma biblioteca elimina essa diferença.

## 6. Protocolo Spec Kit, sem instalador remoto

O upstream observado é `github/spec-kit`, MIT, release **v1.4.0 de 10/11/2026**, commit `0019fa14d12f45edabc2cc3176c9168a68bd0f97` [S08]. A documentação corrente oferece constituição, especificação, plano, tarefas, implementação e convergência [S09]. O CLI não foi executado. A abertura web de três arquivos no caminho da tag falhou; release, commit, README e documentação pública foram recuperados. Portanto, não se declara auditoria integral dos bytes da release.

Usar agora a disciplina documental do Spec Kit. Para uma futura instalação, preparar cópia revisada e fixada; conferir licença, scripts e dependências. O guia oficial descreve wheels transferíveis e inicialização sem rede, mas alerta que catálogos, adaptadores externos e bundles possuem limites próprios [S10]. Offline do scaffold não significa agente de IA offline. Nenhum desses componentes deve entrar no runtime do jogador.

| Etapa | Artefato e passagem obrigatória |
|---|---|
| Constituição | Princípios: resultado reproduzível; fonte distinta de hipótese; nenhuma vitória sem ciência recebida; alegação limitada à evidência |
| Specify / clarify | `specs/001-mission-receipt/spec.md`: tarefas humanas, IDs SCI/ENG/EXP/LRN, sucesso e falhas observáveis; resolver ambiguidades antes do motor |
| Plan | `plan.md`, `research.md` e `contracts/`: unidades, semântica de eventos, schema, estratégia de verificação e limites |
| Tasks / analyze | Cada tarefa aponta requisito, implementação prevista, oráculo e recibo; localizar requisito órfão e contradição |
| Implement | Futuramente implementar incrementos pequenos; preservar o caso que falhava e registrar resultado real do comando de verificação |
| Converge | Comparar código, especificação e evidências; devolver lacunas às tarefas; `Converged` do agente não substitui gates executados |

Na integração Codex atual, a sintaxe documentada é `$speckit-specify`; Copilot usa `/speckit-specify`, e referências também mostram notação pontuada [S11]. Não colar todos os comandos no terminal nem pressupor habilidades instaladas. Sem instalação, o procedimento é uma aplicação documental do método, explicitamente identificada.

A matriz `traceability.json` proposta liga `requirementId → source/model-assumption → function → test/oracle → evidencePath → outcome`. Alterar o contrato invalida evidências vinculadas à versão anterior até nova execução. Corrigir o motor exige conservar a entrada que reproduz o defeito. Mudar o texto para fazê-lo concordar com um bug exige ADR explícito e nova justificativa; não é convergência aceitável por conveniência.

## 7. Decisões, gates e opções posteriores

| ADR proposto | Decisão | Gate de aceitação |
|---|---|---|
| ADR-03.1 | Recibo verificável é a novidade P0 | Um arquivo exportado é conferido offline; adulteração material é rejeitada |
| ADR-03.2 | Contrato científico determina a vitória | Duplicata, fragmento, QA inválido e denominador zero jamais completam entrega |
| ADR-03.3 | Enumeração prova mínimo somente no domínio declarado | Testes cobrem empate, inviabilidade, duas mudanças necessárias e cancelamento |
| ADR-03.4 | Explicação tem testemunha, não narrativa livre | Toda regra/evento citado existe; reparo e causa não são confundidos |
| ADR-03.5 | Física simplificada permanece explícita | Oráculos e balanços passam; nenhum parâmetro didático ganha atribuição NASA |
| ADR-03.6 | Aprendizagem é uma hipótese testável | Primeira transferência fica registrada antes de ajuda; resultados negativos preservados |

**P1:** robustez em cenários enumerados; comparação de alternativas empatadas; tarefa de transferência contrabalançada; testes gerativos do diário. **P2:** cenários produzidos com Orekit/Basilisk, comparação com modelo de maior fidelidade, prova formal de um subsistema e estudo controlado de aprendizagem. Nenhuma opção deve atrasar o contrato P0. Model checking ou solver só entra quando existir uma propriedade e um contraexemplo que o verificador simples não consegue resolver adequadamente.

## 8. Ferramentas reais e auditoria do anexo

Registro de disponibilidade, não promessa de integração. Nenhum dos projetos abaixo foi instalado ou executado nesta frente. Licenças referem-se ao upstream consultado; dependências e dados exigem inventário próprio.

| Repositório / documentação upstream | Licença e estado observado | Papel concreto e limite |
|---|---|---|
| [github/spec-kit](https://github.com/github/spec-kit) | MIT; v1.4.0 observada | Processo de autoria; não prova correção |
| [ajv-validator/ajv](https://github.com/ajv-validator/ajv) · [standalone](https://ajv.js.org/standalone.html) | MIT; repo/docs acessíveis | Compilar validação no build; schema não verifica causalidade nem detecta chave JSON duplicada após parse |
| [dubzzz/fast-check](https://github.com/dubzzz/fast-check) · [modelos](https://fast-check.dev/docs/advanced/model-based-testing/) | MIT; repo/docs acessíveis | Gerar sequências e reproduzir falhas; amostragem não é enumeração exaustiva |
| [nasa/openmct](https://github.com/nasa/openmct) · [licença](https://github.com/nasa/openmct/blob/master/LICENSE.md) | Apache-2.0; repo acessível | Referência de inspeção de telemetria; framework a integrar, não sala de controle pronta |
| [AVSLab/basilisk](https://github.com/AVSLab/basilisk) · [docs](https://avslab.github.io/basilisk/) | ISC; repo acessível | P2: produzir casos de referência; não cabe automaticamente no navegador |
| [Orekit GitLab](https://gitlab.orekit.org/orekit/orekit) · [espelho oficial](https://github.com/CS-SI/Orekit) | Apache-2.0; GitLab bloqueou consulta, espelho/documentação indexados | P2: agendas orbitais com hipóteses verificadas; Java e dados auxiliares ampliam empacotamento |
| [AndrewAnnex/SpiceyPy](https://github.com/AndrewAnnex/SpiceyPy) · [docs](https://spiceypy.readthedocs.io/en/stable/) | MIT; docs 8.4.0 observadas | Geometria baseada em kernels; qualidade depende de dados, referenciais e tempos |

O anexo chama SpiceyPy de wrapper oficial NASA. Corrigir: NAIF o lista entre interfaces de terceiros, ainda que o projeto atual tenha apoio NASA e lições NAIF [S12]. “Precisão submétrica” não é garantia geral: a documentação SPICE exige atenção a modelos, arquivos, tempos e precisão esperada [S13]. A promessa de “rigor matemático e físico irrefutável” atribuída a Skyfield/Astropy/SunPy também excede a evidência; Astropy documenta resultados com precisão IERS degradada [S14]. Nomes institucionais, Kalman e linguagens não substituem hipóteses, condições de validade e validação.

A expressão literal “zero overhead” não foi encontrada no anexo fornecido. Se proposta para Ipê, deve ser rejeitada como não medida: validação, hashing, serialização, armazenamento e enumeração executam trabalho. Ajv permite antecipar compilação, não tornar validação gratuita [S15]. Medir comparação com/sem diário, em entradas idênticas, informando latência, memória e bytes. A meta existente de busca em três segundos admite menos de 11,72 ms médios por candidata para 256 candidatas, antes do overhead. É orçamento aritmético, não benchmark.

## Fontes primárias e limites de uso

- **S01:** [Necula, Proof-Carrying Code, POPL 1997](https://doi.org/10.1145/263699.263712). Precedente de verificação; não certifica nosso recibo.
- **S02:** [NASA, Build It Yourself](https://science.nasa.gov/mission/webb/game-build-it-yourself/). Objetivos científicos, escolhas e missões reais.
- **S03:** [W3C, PROV Constraints](https://www.w3.org/TR/prov-constraints/). Consistência de procedência; não veracidade automática.
- **S04:** [Karimi, Schölkopf e Valera, Algorithmic Recourse](https://arxiv.org/abs/2002.06278). Intervenções e dependências; adaptação ao jogo é nossa proposta.
- **S05:** [Kapur, 2014](https://doi.org/10.1111/cogs.12107). Estudos de matemática, não validação do Ipê.
- **S06:** [Hassan e Zilles, SIGCSE 2022](https://zilles.cs.illinois.edu/papers/hassan_tracing_sigcse_2022.pdf). Estudo qualitativo de erros e visibilidade.
- **S07:** [NASA-STD-7009B](https://standards.nasa.gov/standard/nasa/nasa-std-7009) e [NASA-HDBK-7009](https://standards.nasa.gov/standard/NASA/NASA-HDBK-7009). Credibilidade e uso pretendido; consulta não significa conformidade.
- **S08:** [Spec Kit releases](https://github.com/github/spec-kit/releases) e [commit observado](https://github.com/github/spec-kit/commit/0019fa14d12f45edabc2cc3176c9168a68bd0f97).
- **S09:** [Spec Kit README](https://github.com/github/spec-kit) e [quickstart](https://github.github.io/spec-kit/quickstart.html).
- **S10:** [Instalação](https://github.github.io/spec-kit/installation.html) e [air-gapped](https://github.github.io/spec-kit/install/air-gapped.html). Procedimento não executado.
- **S11:** [Spec Kit, invocação por integração](https://github.github.io/spec-kit/integrations/cli.html#command-invocation).
- **S12:** [NAIF, interfaces de terceiros](https://naif.jpl.nasa.gov/naif/links.html).
- **S13:** [NAIF, Common Problems](https://naif.jpl.nasa.gov/pub/naif/toolkit_docs/C/req/problems.html).
- **S14:** [Astropy, IERS](https://docs.astropy.org/en/latest/utils/iers.html). Página de desenvolvimento consultada; fixar versão antes de uso.
- **S15:** [Ajv, standalone validation](https://ajv.js.org/standalone.html). Otimização de implantação, não custo zero.
