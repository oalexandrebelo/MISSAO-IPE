# 10 — Dez frentes, fontes e rastreabilidade

Foram recrutadas dez frentes distintas com modelo `gpt-6-astra`, esforço `max`, conforme o pedido de AB. O limite de concorrência comporta três auxiliares junto à coordenação, portanto a execução ocorreu em ondas. Os agentes participaram remotamente desta pesquisa e implementação; eles não constituem dez modelos Astra executados nos equipamentos locais de AB.

| Frente | Objeto de trabalho | Entrega principal |
|---|---|---|
| 01 | Regras, Resources, origem científica e EVI3 | research/01-regras-ciencia.md |
| 02 | Dois anexos e alegações Fastino | research/02-fastino-anexos.md |
| 03 | Diferenciação, prova limitada, aprendizagem e Spec Kit | research/03-oportunidades-spec.md |
| 04 | Motor racional, catálogo e busca | research/04-motor.md; src/core |
| 05 | Interface, cena e integração | research/05-interface.md; src/ui; App |
| 06 | Parser, identidade, replay, IDB e Prisma | research/06-persistencia.md; src/persistence; prisma |
| 07 | Oráculo independente e contraprovas | research/07-revisao-independente.md |
| 08 | Auditoria das 33 famílias do anexo | research/08-auditoria-repositorios.md |
| 09 | Fluxos DOM, benchmark, dependências e servidor | research/09-release-e-desempenho.md |
| 10 | Revisão final de alegações e handoff | research/10-handoff-redteam.md; docs/08-HANDOFF.md |

A coordenação integrou contratos, corrigiu os defeitos reproduzidos, reconstruiu os distribuíveis, aplicou AB-R3A, verificou artefatos e consolidou esta documentação. A responsabilidade de verificar decisões científicas, adequação à competição e uso humano continua com a equipe; multiplicar revisores de IA não cria aprovação institucional.

## Fontes e anexo

Os dois arquivos colados recebidos são idênticos: 32.575 bytes cada, SHA-256 `62fa654201593bf9dd4f62667dcb91d3e89f98f00cf001ac1506847d0506dc51`. Uma cópia está preservada em `research/anexo-original.txt`. O catálogo contém 33 famílias editoriais auditadas; Fastino e Spec Kit vieram da mensagem, não desse catálogo. Trechos incompletos do briefing não foram reconstruídos por suposição.

O inventário de repositórios registra 67 consultas GitHub, URLs, correções, termos identificados, hashes e estados de recuperação. Número de consultas não é número de tecnologias integradas, número de países nem avaliação universal de qualidade. Repositórios indisponíveis permanecem “não recuperados”; isso não é prova de inexistência.

Os READMEs integrais obtidos para inspeção são material temporário e não entram na distribuição. A entrega preserva matrizes, URLs, hashes, metadados selecionados e paráfrases. Os relatórios indicam limites de licença e maturidade, sem atribuir termos de uma biblioteca a pesos, datasets ou assets independentes.

`evidence/source-index.json` indexa os links mencionados nos documentos atuais. O índice é ferramenta de navegação: inclusão nele não equivale a recuperação bem-sucedida, verificação de toda a página ou endosso. Cada parecer conserva a evidência e a limitação associadas ao link. Os estudos anteriores sobre o júri mundial e a seleção estão preservados em `research/history/`.

## Requisito → implementação → prova

`specs/traceability.json` relaciona requisitos científicos, físicos, de busca, persistência, UX e execução local a funções, testes, fontes e recibos. Os hashes permitem identificar a versão lida. O campo de estado distingue Node, DOM simulado, IndexedDB de teste e validação de navegador pendente. A matriz não conta como uma execução adicional de teste.

O processo documental segue constituição, especificação, plano, tarefas e conferência, inspirado no `github/spec-kit`. O CLI upstream não foi instalado. A release pesquisada e suas limitações estão no parecer 03. Nenhum script upstream foi executado apenas porque apareceu numa página pesquisada.

O manifesto do ZIP identifica os arquivos distribuídos. Artefatos visuais do dossiê foram renderizados para inspeção de paginação; isso não deve ser confundido com uma captura ou teste da interface do jogo. A cronologia real de criação permanece registrada, inclusive o início anterior ao evento.
