# 03 — PRT: requisitos técnicos, modelo e verificação

**PRT = Plano de Requisitos Técnicos nesta entrega.** A sigla foi usada pelo usuário sem expansão; esta definição organiza o contrato técnico sem atribuí-la a uma norma externa. Estado: implementação de P&D educacional com fontes NASA históricas; elegibilidade competitiva pendente.

## 1. Topologia e domínio de falha

A arquitetura de execução é um monólito modular no navegador. React apresenta a tarefa; Three.js apresenta uma cena procedural; um Worker executa o motor e a busca; IndexedDB guarda rascunho e execuções; JSON versionado permite exportar e reexecutar. O servidor opcional serve arquivos estáticos em 127.0.0.1. Não há servidor de pontuação, serviço de inferência, autenticação remota, conta de aluno ou telemetria externa necessária.

A versão HTML portátil incorpora JavaScript, CSS e dados num único arquivo. Nela, o mesmo motor roda na thread principal para evitar dependência de Worker em origem file. Isso muda isolamento de latência, não equações. A variante estática com servidor mantém o Worker. Compilação a partir do código-fonte requer dependências previamente instaladas ou acesso ao registro npm; execução do pacote compilado não deve requerer esse registro. Não confundir runtime sem internet com bootstrap de desenvolvimento integralmente provisionado.

O custo científico é limitado: seis observações, número finito de fronteiras de evento e 64 configurações. Introduzir cluster, Kubernetes, fila externa, banco compartilhado ou GPU numérica acrescentaria coordenação, indisponibilidade e custo operacional antes de resolver um gargalo medido. Essa é uma decisão técnica decorrente do domínio, não uma proibição de distribuição em qualquer produto futuro.

## 2. Módulos, contratos e dependências

| Módulo | Responsabilidade | Não pode determinar |
|---|---|---|
| core/catalog.ts | Opções, massas, créditos, duas condições e validação de configuração | Resultado específico sem simular |
| core/engine.ts + exact/power | Integração por eventos, filas e ledger | Texto livre do participante |
| core/science.ts | QA, domínio e NDVI | Potência de hardware real |
| core/search.ts | Enumeração e menor distância | Probabilidade de sucesso real |
| data/science-data.ts | Registros derivados de fontes preservadas e hash do pack | Efemérides ou aquisição instantânea fictícia |
| workers/client.ts | Lifecycle, timeout, cancelamento e transporte | Alterar a missão ao perder um Worker |
| persistence/* | Identidade, validação, IDB e replay | Autenticidade de uma pessoa ou verdade física |
| ui/* | Escolha, previsão, inspeção e feedback | Segundo motor numérico |
| prisma/* | Contrato opcional de persistência relacional futura | Persistência já ativa no browser |

Entradas do motor são valores fechados, não código. Configurações têm exatamente seis chaves; valores fora do catálogo são rejeitados. O cenário público é um dos dois IDs conhecidos. O seam interno de testes permite cenários de fronteira, mas não é exposto pela UI, pelo importador ou pela busca do produto. Alterar o catálogo exige nova versão e nova evidência.

As versões npm foram fixadas no package-lock. A versão final instalada e as licenças observadas estão no inventário da entrega. Não atribuir manutenção oficial NASA a uma biblioteca de terceiros. AB-R3A/REA é usado como bancada de inspeção do código; não é runtime do jogo nem hospeda os agentes Astra.

## 3. Modelo temporal e simultaneidade

O horizonte é 10.800 s. Iluminação ocupa [0,5400) e [7200,9000). Seis trabalhos de 60 s começam em 600,1200,1800,2400,3000 e 3600 s. O cenário longo tem contatos [5400,6000), [9000,9600); o curto, [5400,5640), [9000,9240). Esses intervalos são hipóteses didáticas; não foram derivados de propagação orbital nesta versão.

O integrador avança até a próxima fronteira necessária: início/fim de trabalho, mudança de iluminação, abertura/fechamento de contato, término de um lote transmitido, saturação ou esgotamento da bateria e horizonte. A contribuição do intervalo anterior é concluída antes das ações da fronteira. Um último bit entregue exatamente no fim de um contato conta; produção só ocorre ao completar o trabalho inteiro. Não existe “meio lote científico” válido.

Os cenários fechados não sobrepõem processamento e contato. O validador rejeita essa combinação no seam de teste; não soma silenciosamente cargas que a especificação não definiu. Acrescentar concorrência de subsistemas requer revisar política de operação, carga total, precedência e oráculos. O tempo da câmera, o requestAnimationFrame e a posição do cursor não são fontes do relógio físico.

Relógio e energia usam frações racionais internas reduzidas com BigInt. A apresentação converte valores finais para number. Bits são inteiros seguros internamente e strings decimais no contrato externo. Os limites eliminam arredondamento por frame e epsilon de sucesso. A conversão para visualização ainda pode arredondar; por isso um valor mostrado como 20,00 W não pode ser usado para refazer a decisão de um valor exato ligeiramente maior que 20 W.

## 4. Energia e potência

Seja P_s a potência solar útil antes da carga, P_l a carga total no barramento, eta_c=eta_d=0,95, E a energia armazenada e C a capacidade. Durante luz, P_s é o painel nominal vezes 0,55 no processamento ou 0,85 na espera/transmissão; em eclipse, P_s=0.

Quando P_s >= P_l e E<C:

\[
P_{in}=\min(P_s-P_l,10\ \mathrm{W}),\qquad \dot E=\eta_c P_{in}/3600.
\]

O excedente não aproveitado é contabilizado como spill. A perda de conversão é (1−eta_c)P_in. Quando a bateria está cheia, a entrada de carga é zero e o excesso inteiro vai a spill. A integração divide no instante exato de saturação.

Quando P_l>P_s:

\[
P_{bat}=\frac{P_l-P_s}{\eta_d},\qquad \dot E=-P_{bat}/3600.
\]

A perda de descarga é P_bat−(P_l−P_s). P_bat acima do limite da bateria é falha instantânea terminal, mesmo com energia armazenada suficiente. E=0 com demanda não suprida é esgotamento terminal. A reserva é 15% da capacidade, e a carga inicial, 80%. Cruzar a reserva é violação de missão sem apagar o histórico. São políticas do cenário, não padrões universais de dimensionamento.

O balanço acumulado deve satisfazer:

\[
E_{fim}=E_{inicio}+E_{solar}-E_{carga}-E_{perdas}-E_{spill}.
\]

O motor reporta o residual; a revisão independente deve comparar um caso manual e casos de fronteira. Apenas testar a mesma função contra seus próprios valores não constitui oráculo independente.

Exemplo didático: BANDAS com painel de 18 W exige (26−18×0,55)/0,95 = 16,947368… W da bateria. ÍNDICE exige (38−18×0,55)/0,95 = 29,578947… W. A bateria de 16 Wh suporta 20 W; portanto pode satisfazer o primeiro pico e falhar no segundo apesar de o segundo transmitir menos dados. Rádio rápido em eclipse exige 26/0,95 = 27,368421… W. A capacidade em Wh não substitui esse limite em W.

## 5. Armazenamento, transmissão e significado da entrega

Cada trabalho completo gera um lote lógico inteiro. BANDAS produz 180.000.000 bits; ÍNDICE, 60.000.000. Um buffer não comporta parte de um lote novo: se faltar capacidade, o lote inteiro novo é perdido e registrado. A transmissão usa FIFO e conserva progresso parcial entre contatos. A fila vazia encerra imediatamente a carga de transmissão, em vez de cobrar rádio ligado até o fim da janela.

Em todo estado:

\[
B_{gerados}=B_{recebidos}+B_{fila}+B_{perdidos}.
\]

Há também contabilidade por observação, de forma que uma soma global correta não possa ocultar um registro entregue duas vezes. Frações de serviço inferiores a um bit não são re-arredondadas a cada frame. O motor contabiliza bits inteiros recebidos e o crédito fracionário de serviço conforme a semântica documentada no código e nos testes.

Na condição curta, rádio econômico oferece 480×960.000 = 460.800.000 bits de serviço. BANDAS exige 1.080.000.000 bits para seis registros; ÍNDICE exige 360.000.000. A taxa é serviço útil do modelo; não é promessa de link real com codificação, protocolo, ruído, atenuação, antena ou orçamento RF fisicamente calculados.

Receber bytes não basta. A observação só satisfaz a tarefa quando o lote é completo, o ID é esperado e único, a qualidade foi aceita e a transformação é válida. Perda de QA ou ausência de banda precisa produzir estado inválido, não NDVI zero. A apresentação distingue ainda-not-produced, queued, partial, delivered, lost e invalid.

## 6. Contrato científico

O pack provém de MOD13Q1 Collection 061, com três posições solicitadas e duas composições temporais. Os JSONs ORNL, metadados de bandas, CMR e horários de recuperação ficam preservados. O hash do pack vincula versões de replay. Ele prova correspondência dos bytes conhecidos, não autoria NASA sem a cadeia de recuperação/documentação.

NDVI=(NIR−RED)/(NIR+RED). Reflectâncias usam a escala publicada 0,0001 e offset 0; nesses termos a escala cancela no quociente. O validador confere domínio, máscara, sentinelas, denominador e concordância com o produto NDVI. A tolerância científica de 0,0001 é requisito explícito desta amostra; não é epsilon para energia, bits ou massa. Os seis registros atuais passam o QA, portanto testes negativos usam fixtures sintéticas rotuladas como tal.

As duas representações satisfazem o mesmo objetivo NDVI. No modelo atual, a disponibilidade das bandas e o QA são auditados antes de qualquer afirmação de ciência útil. O armazenamento e a comunicação usam volumes lógicos didáticos. Um futuro simulador de instrumento precisa acrescentar calibração, ruído, resolução e condições de observação; esses fenômenos não são presumidos por usar MOD13Q1.

EVI3 fica fora do P0. A validação de pesquisa usa 2,5(NIR−RED)/(NIR+6RED−7,5BLUE+1), com reflectâncias escaladas. BLUE é informação adicional; um pacote que transmitiu apenas RED/NIR não contém o insumo. O termo 1 impede cancelar a escala de modo geral. A mudança de pergunta deve criar outra versão de contrato, com dados e critérios próprios.

## 7. Busca exaustiva e limite da prova

O espaço C tem 64 tuplas. A distância é Hamming: número de escolhas diferentes da configuração-base. Para condição z fixa, o alvo é minimizar essa distância entre configurações com sucesso. A admissibilidade de massa/créditos participa da decisão; opções inválidas são contabilizadas e não entram como testemunha.

O solver enumera C, executa o mesmo motor e mantém contagem de resultados. Um mínimo só é exposto com cobertura completa, zero indeterminados e testemunha viável. Erro, duplicação, ausência ou interrupção invalida a certificação. Nenhuma solução no catálogo também requer enumeração completa. A ordenação estável só apresenta empates; não cria um peso de mérito oculto.

Essa prova é relativa ao catálogo, às hipóteses, à condição, ao motor e ao pacote de dados. Não demonstra menor custo industrial, missão fisicamente ótima, causalidade exclusiva da primeira falha ou confiabilidade de voo. Um replay no mesmo motor verifica consistência da execução; os oráculos manuais e testes independentes combatem erros compartilhados.

## 8. Concorrência e consistência

Cada execução assíncrona possui identidade e AbortSignal. Cancelar encerra o Worker e descarta a resposta. A UI mantém uma geração de requisição e confere se a entrada continua atual antes de publicar o retorno. Trocar configuração, importar outro caso ou mudar condição invalida resultados derivados. O limite de 15 s é um erro operacional do cálculo, não uma classificação da missão.

IndexedDB usa transações locais. Request success não é commit; a confirmação espera transaction.complete. O rascunho usa revisão esperada com compare-and-swap dentro da transação. Duas abas com a mesma revisão não podem ambas sobrescrever silenciosamente a vencedora. Run identity inclui entrada, resultado, versões e hash do pack. Uma nova execução idêntica não cria múltiplos registros só por repetir o botão.

O diário de aprendizagem é distinto dos resultados físicos. Seus timestamps são relógio do cliente e podem ser alterados; não há promessa de diário inviolável. Exportação voluntária, coleta mínima e ausência de envio externo são controles efetivos desta arquitetura. Um hash sem chave não autentica a pessoa ou a máquina.

Prisma fica como contrato futuro de armazenamento relacional local. O schema define relações e proveniência; o produto atual não inicia um backend Prisma. Validação do schema não equivale a geração de client, migração aplicada, durabilidade de SQLite ou teste de concorrência numa API.

## 9. Importação, dependências e falhas adversariais

O importador recebe texto limitado antes do parse. Rejeita chaves duplicadas, campos desconhecidos, profundidade/tamanho excessivos, protótipos perigosos, versões incompatíveis, números não finitos e strings de bits fora do formato. Compara hashes e sempre reexecuta a entrada admitida. Alterar o resultado e refazer o hash pode produzir um envelope íntegro, mas a reexecução deve acusar divergência. Não executar scripts, buscar URLs ou carregar plugins de um recibo importado.

| Falha | Contenção | Evidência exigida |
|---|---|---|
| Resposta antiga após mudança | Cancelamento e identidade de geração | Teste de Promise fora de ordem |
| Bateria cheia | Spill e fronteira exata | Balanço de energia com saturação |
| Pico não atendido | Término e evento com limite | Contraprova INDEX/bateria pequena |
| Contato encerra no último bit | Ordem de fronteira definida | Caso exato e um bit faltante |
| Quota/abort no IDB | Erro explícito, estado em tela preservado | Falha depois de request success |
| Duas abas | Revisão atômica | Uma vencedora, uma em conflito |
| Replay com fraude e hash novo | Reexecução independente da alegação | matchesClaim=false |
| Dados corrompidos no disco | Hash contra pack esperado | Verificador de origem rejeita |
| Falha WebGL | Fluxo HTML continua | DOM cobre contrato; navegador real ainda necessário |
| Memória/CPU de IA | Modelo fora do caminho crítico | P0 não carrega pesos nem servidor |

O servidor local limita-se a GET/HEAD, confere caminhos, associa MIME, aplica CSP e escuta loopback. Ele não é um serviço multiusuário endurecido nem uma autorização para exposição pública. Publicar posteriormente exige revisar autenticação, tratamento de dados, observabilidade, política de origem, atualização e ameaças do novo contexto.

## 10. Desempenho e micro-otimização justificada

A primeira otimização é reduzir trabalho: avanço por eventos em vez de amostrar 180 min a cada frame; nenhuma física por pixel; dados compilados e localizados; cena carregada à parte na variante Vite; renderização limitada e suspensa quando não necessária. A enumeração calcula 64 casos; não precisa de chamadas a modelo ou 64 Workers.

Frações BigInt alocam objetos e executam gcd. Esse custo é escolhido para evitar erro de fronteira no domínio pequeno e deve aparecer no benchmark. Não declarar overhead zero. Se o perfil mostrar custo material, comparar representação inteira em escala comum com a versão racional como oráculo, preservando resultados. Não trocar por Float32 para obter FPS quando o gargalo está na renderização.

Metas iniciais no equipamento da demonstração: interação visível em até 3 s com arquivos locais; tempo de quadro no percentil 95 <= 33,3 ms no modo 3D; tarefa interativa sem long task recorrente; busca no Worker concluída em até 1 s; resultado exportável mesmo com falha de persistência. São metas, não resultados publicados. Medir resolução, DPR, navegador, CPU, GPU, RAM, temperatura/modo de energia e versão. Não transferir o tempo Node do executor para RTX 3070, RTX 2060 Super, Mac ou celular.

As máquinas citadas anteriormente por AB não foram benchmarkadas nesta rodada. A consulta antiga à Oficina encontrou outra GPU e carga transitória; não se presume que esse inventário continua disponível. Não parar serviços ou descarregar modelos para fabricar margem de VRAM. O jogo não requer CUDA, pesos LLM ou agregação de GPUs.
