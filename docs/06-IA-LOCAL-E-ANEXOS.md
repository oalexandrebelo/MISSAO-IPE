# 06 — Fastino, execução local e análise do texto enviado

## 1. O que foi recebido

Os arquivos `Texto colado(1).txt` e `Texto colado(2).txt` são byte a byte iguais: 32.575 bytes, SHA-256 `62fa654201593bf9dd4f62667dcb91d3e89f98f00cf001ac1506847d0506dc51`. O original está preservado em `research/anexo-original.txt`. O conteúdo é um catálogo de ferramentas espaciais/geoespaciais por região. As afirmações sobre Fastino, GLiNER, GLiDE, Unsloth e Spec Kit estão na mensagem do usuário, e não nesses arquivos.

A mensagem termina com frases incompletas sobre “limites” de domínio e “modelagem de efei…”. Não há texto suficiente para reconstruir a intenção específica desses trechos. A arquitetura desta entrega foi desenvolvida a partir das partes legíveis; não se apresenta uma continuação inventada como parte do anexo.

O relatório `research/02-fastino-anexos.md` contém 37 fontes primárias, diferenças de versões, métricas, licença e protocolo de avaliação. `research/08-auditoria-repositorios.md` trata o catálogo completo. Esta seção registra as decisões que afetam o projeto.

## 2. O que muda ao substituir um modelo grande por um classificador

Um classificador pode receber rótulos candidatos e retornar scores em uma passada. Isso elimina geração autoregressiva para aquela tarefa, mas não torna a decisão correta por construção. O conjunto de classes, a representatividade dos exemplos, a distribuição de entrada e o custo assimétrico do erro continuam fazendo parte do sistema. JSON válido apenas mostra conformidade estrutural; uma classe incorreta continua incorreta quando está num enum permitido.

A alegação de economia superior a 95% frente a um modelo de 70B não foi sustentada por comparação primária aplicável com mesmo workload, qualidade, hardware e política de custos. O correto é medir custo por decisão aceita, incluindo abstenções, revisão humana, carga do modelo, tokenização, serialização, inferência e manutenção. Parâmetros e tokens de saída são variáveis úteis, não uma conta completa de custo operacional.

Ausência de sampling também não estabelece reprodutibilidade entre CPU/GPU, kernels, quantização ou versões. O objetivo físico do Ipê pode ser determinístico dentro de seu contrato; um modelo que interpreta a frase do aluno permanece uma aproximação estatística.

## 3. Auditoria das três aplicações propostas

| Alegação da mensagem | Evidência observada | Decisão de engenharia |
|---|---|---|
| GLiNER2.5-Decide classifica intenção/urgência/especialidade | Card principal descreve modelo inglês de 340M, classificação e múltiplos heads; distingue isso de raciocínio ou explicação | Usar apenas como candidato a classificação; não inferir adequação clínica ou portuguesa da existência de exemplo. |
| Tags são determinísticas | Inference sem geração pode produzir saída estruturada; documentação não prova igualdade universal de backend nem acerto | Fixar artefatos/runtime e medir divergência; validar enum e permitir abstenção. |
| PII local garante conformidade total | Card e artigo reportam desempenho incompleto; treinamento sintético e cobertura de avaliação limitada | Minimizar coleta, restringir exportação e medir redaction real; não usar detector como garantia regulatória. |
| GLiDE Adaptive Thinking decide instantaneamente | Publicação atual distingue primeira versão com pensamento e v1.2 destilada sem tokens de pensamento | Registrar ID, revisão e modo; não misturar benchmarks e mecanismos de versões. |
| Sidecar deve sempre usar vLLM/llama.cpp | Arquiteturas/checkpoints não são intercambiáveis; suporte varia | Escolher runtime pelo checkpoint efetivamente suportado e validado. |
| Pydantic/JSON Schema blindam o fluxo | Validam forma/tipos; não a semântica da decisão | Associar schema a regras do domínio, limites, identificadores e estado autorizado. |
| Fallback Regex resolve degradação | Funciona para padrões explícitos, mas pode não reconhecer ambiguidade semântica | Fallback editorial, pergunta fechada ou abstenção; nunca inventar uma classificação “segura” sem evidência. |

A fonte PII possui uma divergência material: card informa F1 médio de 0,477, enquanto o artigo arXiv v1 informa 0,471. Recalls legal/médico também diferem. A avaliação do artigo utiliza 200 documentos e sete categorias mapeadas. Não extrapolar para todos os 42 tipos e sete idiomas declarados. Não converter 1−recall de spans exatos em probabilidade de um documento vazar; a exposição parcial de uma entidade e a persistência/transmissão do dado precisam de medições próprias.

## 4. Modelo candidato para o Ipê

O candidato específico é `fastino/GLiNER2.5-multi-Decide`, de 287M conforme seu card, para selecionar uma pergunta de acompanhamento a partir da explicação do participante. O benchmark divulgado do card continua sendo inglês: 56,7% exact-match médio nessa suíte. Esse número não é acurácia prevista para português brasileiro ou conceitos de engenharia espacial. O card indica Apache 2.0; GLiDE usa outra licença, Fastino Community. Não atribuir a licença de um modelo a toda a família.

A inferência opcional poderia classificar sinais como “confunde potência com energia”, “assume que o rádio resolve sozinho” ou “não identificou o limite”, mas a taxonomia deve nascer de entrevistas/observações reais e revisão humana. O texto mostrado em resposta é um item editorial conferido, condicionado à interpretação proposta. A correção científica do item não garante que ele se aplica à intenção daquela pessoa.

No P0, a pessoa escolhe uma previsão e recebe diagnóstico ligado a eventos. Nenhuma chamada Fastino, LLM remoto ou modelo local foi integrada. Não foram baixados pesos, medidos tokens/s ou executada inferência em GPU. A decisão mantém a tarefa utilizável antes de provar o ganho de IA.

## 5. Runtime e dimensionamento

A rota inicial verificável para GLiNER é a biblioteca oficial `gliner2` e `AutoExtractor`. Há port comunitário `sandrohanea/gliner.cpp`. O PR llama.cpp #30504 observado nesta pesquisa está aberto e é limitado a classificação Decide, excluindo spans, records e outros checkpoints. Isso impede declarar PII suportado só porque existe um conversor GGUF. Unsloth possui ferramentas próprias, mas não foi encontrada integração documentada que autorize presumir suporte aos IDs pesquisados.

GLiDE 27B documenta 52,2 GB de pesos e 56,4 GB de pico de GPU na amostra publicada, em GPU de 96 GB, com recomendação de 80 GB ou mais. Esse perfil não deve ser transferido à RTX 3070 ou RTX 2060 Super relatadas anteriormente. Versões menores podem ser avaliadas separadamente, mas a simples existência de uma versão menor não demonstra o mesmo comportamento/qualidade da maior.

Para um serviço local futuro: processo dedicado de inferência, um único modelo carregado, fila limitada, concorrência inicial 1 e limite de entrada explícito. Validar ganho antes de aumentar batch. Transportar somente texto consentido e IDs de contexto; não enviar a simulação inteira por conveniência. Depois da medição, definir timeout e circuit breaker. HTTP em loopback com controle de origem ou socket local autenticado pode bastar; gRPC/contêineres não são obrigatórios sem requisito concreto.

O servidor não pode executar comandos fornecidos pelo modelo. Decisões sobre retry, timeout ou descarte decorrem da política da aplicação. Alternar uma chave de API não resolve erro de contrato e não deve ser interpretado como autorização para contornar limitação do serviço. Toda ação proposta fica subordinada ao estado permitido e à validade do request ID.

## 6. Experimento de ablação proposto

O protocolo detalhado prevê 1.200 explicações pedagógicas e 600 textos de privacidade, com revisão humana e separação por família de cenário. Não é dataset já produzido. Para o jogo, começar com corpus menor de observações reais para formar a taxonomia e só então congelar um teste de aceitação. Textos sintéticos podem ampliar casos de fronteira, mas não substituem pessoas reais no teste do produto.

Comparar: regras/editorial; modelo sem regras; híbrido com validação; híbrido com abstenção. Medir macro F1 por classe, confusão de conceitos críticos, cobertura×erro, taxa de abstenção, adequação da pergunta, latência fria/quente, RAM/VRAM e comportamento sob concorrência. Segregar português coloquial, negações, ironia, mistura de idiomas, Unicode, erros de digitação e instruções adversariais embutidas.

Um modelo só entra no produto se acrescentar benefício na tarefa sem comprometer os limites de tempo/memória definidos e se não houver degradação material em classes críticas. O limiar deve ser calibrado no conjunto de desenvolvimento; não ajustado repetidamente no teste fechado. Quando a confiança não sustenta uma interpretação, pedir ao usuário que escolha uma alternativa explícita.

## 7. Spec Kit aplicado ao projeto

Foi observada a release `github/spec-kit` v1.4.0, de 10/11/2026, commit `0019fa14d12f45edabc2cc3176c9168a68bd0f97`. A documentação atual inclui convergência entre especificação e implementação. Nenhum instalador ou CLI foi executado. O projeto incorpora a disciplina por arquivos: constituição, spec, plano, tarefas e rastreabilidade.

O gate de convergência é concreto: requisito → função → teste/oráculo → recibo → limitação. Corrigir a especificação para concordar silenciosamente com um bug não é convergência. Um achado de revisão deve conservar o contraexemplo, registrar a decisão e repetir o teste afetado. `Converged` emitido por um agente não substitui execução e inspeção.

## Fontes centrais

- https://huggingface.co/fastino/GLiNER2.5-Decide
- https://huggingface.co/fastino/GLiNER2.5-multi-Decide
- https://huggingface.co/fastino/gliner2-privacy-filter-PII-multi
- https://arxiv.org/html/2605.09973v1
- https://fastino.ai/blog/training-glide-sota-decision-model
- https://huggingface.co/fastino/GLiDE-27B/blob/main/README.md
- https://huggingface.co/fastino/GLiDE-0.4B/blob/main/LICENSE
- https://github.com/ggml-org/llama.cpp/pull/30504
- https://github.com/sandrohanea/gliner.cpp
- https://github.com/github/spec-kit/releases/tag/v1.4.0

Os números de terceiros são reportados pelos autores e não reproduzidos nesta bancada. As fontes completas, limitações e diferenças de versões ficam no parecer integral da frente 2.
