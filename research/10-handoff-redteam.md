# 10 — Revisão final independente e limites da entrega

**Missão Ipê · 14 de novembro de 2026 · frente 10 de 10.** Leitura inicial às 09h01 UTC / 06h01 BRT, atualizada com os recibos finais das 09h05 UTC. A rodada começou às 08h23 UTC / 05h23 BRT. Código e especificações específicos foram produzidos antes da abertura oficial local, às 09h BRT / 12h UTC. Toda a entrega permanece **P&D pré-evento, com elegibilidade competitiva não estabelecida**.

## Parecer

Existe um protótipo implementado, com um núcleo pequeno que pode ser confrontado integralmente com um oráculo independente. A evidência disponível sustenta resultados no domínio fechado de 64 configurações e duas condições, integridade local dos arquivos científicos, reexecução de recibos e contratos de persistência. Ela não sustenta elegibilidade, execução em navegador real, desempenho no equipamento de AB, eficácia educativa, fidelidade orbital ou integração de modelos de IA.

Não há base para estimar a chance de premiação. O potencial competitivo é uma hipótese de produto: tornar visível a relação entre decisão, restrição, ciência recebida e explicação verificável. Montagem de CubeSat, Three.js, funcionamento local e alternativa 2D já aparecem em um comparável identificado. Não são exclusividades do Ipê. O conjunto específico deve ser demonstrado e avaliado; não pode ser anunciado como inédito no mundo.

## Escopo e método

Foi feito inventário com `rg --files`, excluindo `node_modules` e artefatos compilados da leitura de fonte. Foram confrontados os documentos 01–07, relatórios de pesquisa 01–08, contratos em `specs/`, módulos de núcleo, dados, Worker, persistência, trechos da interface, scripts e recibos existentes. A pesquisa 09 de DOM e benchmark estava em execução paralela; seus recibos foram incorporados depois de existirem. Esta frente não usou navegador, não modificou código, testes, dependências ou Prisma e não contatou organizadores.

Esta revisão não refez toda a pesquisa externa. As conclusões de regras, modelos e bibliotecas remetem às fontes primárias e aos limites preservados nos relatórios 01, 02 e 08. Falhas HTTP 502/503 nos Resources são registros de recuperação, não prova de que a página inexiste. O exame da implementação não substitui auditoria integral de segurança ou de licenças transitivas.

Foi reexecutado `node --experimental-strip-types scripts/verify-science-data.mjs`, com saída `ok:true`: seis registros, três originais, campos transcritos, datas e hashes conferiram. O hash do pack é `6f49100126a82e1783281083e2c268bcf7b4661b500280de4dc96123036b2a1e`. Não foram alterados os arquivos de origem. A leitura posterior de `evidence/final-validation.json`, concluído às 09h05min34s UTC, confirmou seis comandos com saída 0: **51 testes Node, nove testes DOM simulado, ciência, TypeScript/Vite, HTML portátil e validação estrutural Prisma 7.10.1**. Uma nova execução DOM às 09h05min40s também registra nove aprovados. São execuções das respectivas frentes/coordenação, não comandos reivindicados por esta frente.

O benchmark das 09h04 UTC usa Node 24.22.1, CPU AMD EPYC 9V45, 30 aquecimentos e 200 amostras por carga. Busca de 64 tuplas: mediana/p95 de 4,201/4,936 ms no caso longo e 3,994/4,237 ms no curto; o máximo curto foi 32,073 ms. Exclui carregamento, Worker, React, persistência e GPU. A nova inspeção AB-R3A/REA terminou com saída 0 em 7,634 s: 43 arquivos, 40 JS/TS analisados, zero falhas de parse, 40.369 nós AST e 596 achados estruturais. Cobertura de aplicação parcial e semântica parcial/truncada continuam explícitas. Achados estruturais não são 596 vulnerabilidades confirmadas; saída 0 não certifica segurança ou equivalência. O digest registra mudança posterior apenas em `tests-ui/flows.test.mjs`.

## Alegações examinadas

| Tema | O que a evidência sustenta | Limite para documentação e apresentação |
|---|---|---|
| Implementação | React/TypeScript, Three procedural, núcleo por eventos, Worker, IndexedDB e replay existem no fonte | Compilação não comprova funcionamento visual, acessibilidade ou experiência de uso |
| Domínio finito | 64 tuplas por condição; oráculo alternativo cobre 128 execuções | Não é otimização de qualquer missão espacial nem probabilidade de sucesso real |
| Mínimo no caso curto | Única solução a duas mudanças do padrão: bateria grande + ÍNDICE; 3,5 kg, 84 créditos | Relativo ao catálogo, cenário, versões e objetivo NDVI; não menor custo industrial |
| Ciência | Seis registros MOD13Q1.061 de três posições solicitadas em Goiás e dois compostos de 2024 | Amostra pequena; não caracteriza o Cerrado atual, produtividade agrícola ou mudança ambiental |
| QA | Os seis registros têm pixel reliability 0 e usefulness 1; passam a política declarada | Não chamar de usefulness 0, qualidade máxima ou ausência universal de incerteza |
| Cronologia científica | Datas de arquivo e datas de observação são preservadas | Composto MODIS de 16 dias não é aquisição pelo CubeSat fictício em 180 minutos |
| NDVI | Concordância inclusiva de até 0,0001, separada da quantização do campo | É tolerância desta política; não algoritmo NASA de truncamento nem tolerância de energia/bits |
| EVI3 | Seis recálculos de pesquisa conferem com o produto dentro do limiar registrado | P1, fora do motor; BANDAS P0 só transporta R/NIR e não fornece BLUE |
| Replay | Importação estrita valida, confere hashes e reexecuta a entrada | Consistência com o motor não autentica NASA, pessoa, equipamento ou veracidade física |
| Prova de mínimo exportada | Busca e revisão independente demonstram o mínimo finito | O replay exportado é recibo da missão; não contém um certificado completo da enumeração |
| Persistência | Código espera commit; testes de IndexedDB simulado exercitam rollback e revisão atômica | Não comprova quota, expulsão ou durabilidade de navegador real |
| Prisma | Schema validado estruturalmente pela CLI informada | Não há client gerado, migração, backend integrado ou SQLite operacional no produto |
| Offline | Dependências e dados são incorporados ao pacote; não há inferência externa necessária | Runtime sem WAN não é instalação offline do Node/npm, dos modelos ou do ambiente de autoria |
| Aprendizagem | Previsão, reflexão, ordem de tentativa e ajuda foram implementadas | Nenhuma sessão humana foi observada; oito minutos e ganho de compreensão são metas |
| Modelos locais | Fastino e alternativas foram pesquisados documentalmente | Nenhum peso baixado, nenhuma inferência, medição de VRAM ou validação pt-BR realizada |

As contagens verificadas são 17 sucessos, 41 falhas e 6 inválidas no contato longo; 9 sucessos, 49 falhas e 6 inválidas no curto. Ambas as buscas cobrem 64 tuplas sem indeterminadas. Os denominadores descrevem o catálogo artificial, sem distribuição de amostragem da engenharia real.

## Achados que precisam acompanhar a entrega

### RT-01 — Elegibilidade temporal e qualificação do recurso continuam abertas

As discussões oficiais #1827, #1872 e #2009 situam desenvolvimento específico às 09h locais e tornam inadequada a classificação automática de especificações antecipadas como preparação permitida. #1924 trata da reutilização de código anterior que não tenha sido criado especificamente para o challenge. A autorização de AB para trabalhar não é autorização dos organizadores. Separar, declarar, renomear, recompilar ou reescrever o material não garante regularização. Tampouco existe decisão observada que permita declarar desclassificação automática desta equipe.

MOD13Q1 tem procedência NASA, mas não foi comprovada sua inclusão nos Resources oficiais do desafio. Recursos de engenharia localizados no espelho são candidatos até confronto com a lista oficial. O enunciado também deve ser confrontado com o recorte: lançador e perfil orbital estão fixos, enquanto o desafio pede decisões de missão mais amplas. Isso é gate de adequação, não defeito oculto a resolver adicionando funcionalidades às pressas.

**Responsável:** AB e responsável humano pela candidatura. **Saída exigida:** resposta identificável da organização, brief/Resources vigente e agenda/formulário confirmados. A revisão não enviou nenhuma mensagem externa.

### RT-02 — Distribuíveis regenerados depois do último código

O recibo portátil inicialmente observado foi gerado às 08h52min05s UTC, antes das correções de Worker e congelamento dos registros verificadas às 08h57min13s UTC. O achado foi encaminhado e a coordenação reconstruiu `dist` e HTML; `evidence/portable-build.json` agora registra **09h05min25s UTC e 1.008.522 bytes**. `evidence/final-validation.json` preserva comandos e hashes. A montagem final de PDF/ZIP ainda deve usar esses bytes e os documentos concluídos. Alteração apenas editorial posterior não invalida o cálculo, mas deve entrar no manifesto final do pacote.

**Responsável:** integração/release. **Estado:** rebuild corrigido e verificado; fechamento do pacote documental sob coordenação. A inspeção desta frente não marcou o artefato antigo como aprovado.

### RT-03 — Dependência absoluta e sobrescrita EVI3 corrigidas

Na leitura inicial, `research/evidence/validate-evi3-research.py` usava `SOURCE` absoluto apontando para `ab-global-final-round/research/evidence` e regravava `evi3-validation.json`. Um pacote isolado não reproduziria o caminho, e o recibo histórico seria substituído. Depois do reporte, a coordenação mudou a entrada para `public/data` relativa ao projeto. Sem `--out`, o script só imprime o resultado; com `--out`, cria um arquivo novo em modo exclusivo e recusa sobrescrita. A alteração foi inspecionada nesta frente.

**Responsável:** coordenação científica/release. **Estado:** corrigido; `evidence/evi3-rerun.json`, às 09h02min40s UTC, registra seis comparações aprovadas e diferença máxima de 0,00009379329454142421. O achado não alterou os seis cálculos históricos nem o motor NDVI.

### RT-04 — Propostas anteriores não são contratos implementados

`research/03-oportunidades-spec.md` inclui orçamento ilustrativo de 256 candidatas em três segundos e campos propostos de certificado como `scenarioHash` e `catalogHash`. O domínio atual tem 64 tuplas e meta de busca de um segundo no equipamento de demonstração; o replay implementado carrega versões e `sciencePackHash`. O relatório se apresenta como proposta, mas essas diferenças precisam ficar explícitas na síntese para evitar copiar uma intenção como capacidade entregue.

O mesmo cuidado vale para a recomendação de pesquisa de não persistir texto livre por padrão: a interface atual salva previsões e reflexões no diário local quando o armazenamento funciona. A exportação é deliberada; o armazenamento local acontece no fluxo normal. Não há detector de PII instalado, anonimização garantida, identidade autenticada ou diário inviolável. Uma pessoa com controle do armazenamento local pode alterá-lo; o bloqueio de ajuda não é fiscalização de prova escolar.

**Responsável:** produto/documentação. **Saída exigida:** relato fiel do fluxo atual e decisão explícita antes de estudar pessoas. Não são necessários novos serviços para esclarecer esses limites.

**Atualização:** a coordenação inseriu nota de integração no início de `research/03`, distinguindo 64/1 s de 256/3 s e recibo implementado de certificado proposto. Três replays importáveis foram gerados em `examples/`; `evidence/catalog-enumeration.json` contém 128 resultados produzidos pelo motor. Essa tabela é artefato de pesquisa, não um novo formato de certificado de busca do browser e não substitui o oráculo independente.

### RT-05 — Correções anteriores têm contraprovas preservadas

A revisão independente registrou: regra de truncamento NDVI incompatível com a tolerância; resposta Worker malformada aceita; mensagem `null` sem encerramento correto; metadados científicos mutáveis em runtime. O fonte atual contém comparação científica racional inclusiva, validação de resultado/identidade no bridge e congelamento dos registros. O recibo adversarial conserva os estados anteriores e os testes afetados aprovados. Isso é uma boa cadeia de correção; não se deve apagar os defeitos históricos ou chamar a primeira versão de integralmente correta.

O congelamento previne mutação acidental no módulo. A importação não permite substituir o pack. A contraprova de mutação direta não era exploração remota do importador e não deve ser descrita assim. A reexecução detecta adulterações materiais do resultado mesmo com hash refeito, dentro dos casos aplicados.

## Limites científicos e educacionais que mudam a narrativa

O satélite é didático. Agenda de luz e contatos, massas, créditos, potências, reservas e volumes lógicos são hipóteses. Não foram calculados orçamento de enlace RF, antena, propagação orbital, apontamento, térmica, degradação, erro de instrumento ou perda de pacotes. A aritmética exata evita certos erros de implementação; ela não valida as hipóteses contra uma missão real. Os 60/180 Mbit por lote não são tamanhos medidos dos JSONs MODIS.

Previsão escrita e sucesso podem revelar pistas de compreensão, mas também podem resultar de tentativa e erro ou uso da sugestão. Uma sessão deve registrar ajuda, primeira decisão de transferência, explicação, erro e abandono. Dois pilotos e seis sessões formativas podem encontrar problemas e descrever casos; não estimam efeito causal, retenção ou eficácia populacional. A visualização orbital permanece ilustração sem escala, e a finalidade educativa precisa continuar compreensível sem ela.

GLiDE 27B tem aproximadamente 52,2 GB de pesos e pico publicado de 56,4 GB em uma configuração específica; não deve ser prometido para RTX 3070/2060 Super. Os modelos compactos também exigem experimento próprio. Não há prova local de economia superior a 95%, paridade entre runtimes, classificação correta em português ou privacidade integral. O modelo não participa de energia, QA, resultado ou prova de mínimo no P0.

## Gates de fechamento

1. **Entrega de P&D reproduzível:** preservar as correções verificadas, congelar versões e concluir PDF/ZIP com os distribuíveis regenerados, hashes e comandos executados. Um relatório antigo não aprova bytes novos.
2. **Demonstração no equipamento:** executar a tarefa completa em navegador real autorizado, com rede externa desligada, testar alternativa 2D, importação/exportação e origem de armazenamento. Registrar navegador, sistema, CPU/GPU/RAM, resolução e observações. Chromium sem socket neste ambiente e recusa explícita de `file:` no CUA não foram contornados.
3. **Pesquisa humana:** revisar instruções e tratamento do diário, realizar pilotos/sessões com finalidade clara, preservar resultados negativos e limitar as conclusões à amostra.
4. **Candidatura:** resolver elegibilidade, lista Resources, adequação ao brief, equipe, agenda e formulário. Prazo local indexado: 15/11 às 17h BRT, a confirmar; 23h59 global não substitui o corte local.
5. **Expansão:** só depois dos gates pertinentes, abrir novo contrato para EVI3, IA, agenda orbital ou persistência relacional. Cada um precisa de entrada, saída, oráculo e orçamento próprio.

O handoff operacional está em `docs/08-HANDOFF.md`. Os recibos finais conferidos cobrem DOM simulado, benchmark, build, Prisma e AB-R3A com os limites acima. O fechamento de PDF e pacote pertence à coordenação; esta revisão não antecipou essa aprovação.
