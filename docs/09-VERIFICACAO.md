# 09 — Verificação executada e limites da versão 0.1.1

**Motor `0.1.1-rd` · catálogo `ipe-64-v1` · 14/11/2026.** Este capítulo registra a implementação entregue. Os relatórios individuais preservam o estado observado em cada frente; propostas anteriores e falhas históricas não são apagadas. Desenvolvimento específico anterior à abertura local: elegibilidade competitiva pendente.

## 1. Gate de integração

`evidence/final-validation.json` conserva comando, horário, duração, código de saída, stdout/stderr e hashes das fontes. A execução consolidada passou em todas as seis etapas:

| Etapa executada | Resultado | O que foi efetivamente conferido |
|---|---|---|
| `npm test` | 51/51, zero falhas, zero skips | Motor, ciência, catálogo, busca, parser, replay, persistência simulada e revisão adversarial. |
| `npm run test:ui` | 9/9 contagens TAP aprovadas | Componentes React reais em jsdom, motor e busca reais, armazenamento fake-indexeddb. |
| `node scripts/verify-science-data.mjs` | Aprovado | Pack, três originais, seis registros, bandas, datas e metadados de recuperação. |
| `npm run build` | Aprovado | TypeScript estrito e compilação Vite. |
| `npm run build:portable` | Aprovado | HTML autocontido reconstruído após correções; dez JSONs incorporados. |
| Prisma CLI 7.10.1 `validate` | Aprovado | Estrutura do schema e configuração; não client, migration ou backend. |

O TAP DOM conta um teste pai da jornada, seis checkpoints encadeados e dois casos independentes. Não são nove jornadas humanas nem nove navegadores. Após o gate, a frente 9 reforçou duas assertivas da importação para conferir a configuração ativa na bancada e reexecutou o teste; `evidence/ui-dom-test.json` e `.tap` registram esse complemento. Não houve alteração do código da aplicação nessa etapa.

## 2. Matriz de resultados do catálogo

| Condição | Tuplas | Sucessos | Falhas | Inválidas | Indeterminadas | Mínimo a partir da base |
|---|---:|---:|---:|---:|---:|---:|
| Contatos longos | 64 | 17 | 41 | 6 | 0 | 0 |
| Contatos curtos | 64 | 9 | 49 | 6 | 0 | 2 |

A revisão independente usa constantes literais do contrato e integração alternativa por segundos, com tratamento analítico do término de transmissão. Ela comparou classificação, massa, créditos, bits, energia final/mínima e conclusão em 128 casos. Quatro ordens de enumeração conservaram o resultado. Todas as sete configurações a distância zero ou um da base curta falharam; a única testemunha a distância dois é bateria grande + ÍNDICE.

`evidence/catalog-enumeration.json` acrescenta uma tabela de pesquisa com as 128 saídas do motor atual. Esse arquivo é uma reprodução do motor, não outro oráculo independente. Os exemplos `01-long-base`, `02-short-base` e `03-short-repaired` são replays completos importáveis. O JSON exportado pela interface é recibo de uma execução; não inclui um certificado exportado completo da busca.

## 3. Defeitos encontrados e correções preservadas

| Achado identificado | Correção aplicada | Contraprova posterior |
|---|---|---|
| Inferir truncamento NDVI rejeitava valores dentro da tolerância declarada | Quantização do produto separada de comparação inteira inclusiva de erro até 1e-4 | Casos positivos, negativos, igualdade e imediatamente fora do limite. |
| Resposta Worker `{result:{}}` era aceita | Validação de schema, entrada, cenário, contagens e testemunhas | Respostas malformadas, identidade errada, busca incompleta e duplicatas rejeitadas. |
| Mensagem Worker `null` escapava do listener | Validação de envelope e encerramento explícito por erro | Promise rejeita sem exceção solta no listener. |
| `readonly` não impedia mutação em memória do pack | `Object.freeze` no array e em cada registro | Mutação acidental bloqueada. Não era um bypass remoto do importador. |
| Importação inválida removia contexto antes de validar | Substituição do estado somente após sucesso e geração atual | Resultado, configuração e busca anteriores preservados no DOM. |
| Erro tardio de gravação podia substituir aviso atual | Conferência da geração antes de publicar a mensagem | Contrato do App revisado e fluxo de armazenamento indisponível exercitado. |
| Script EVI3 dependia de caminho absoluto anterior | Fonte relativa a `public/data`, saída opcional nova e exclusiva | Reexecução de seis registros; recibo histórico não sobrescrito. |

Os registros vermelhos da frente 7 permanecem em `evidence/adversarial-review.json`. A versão do motor foi incrementada. O máximo erro EVI3 observado foi 0,00009379329454142421; isso valida a comparação desses seis registros, não o algoritmo MODIS inteiro nem uma missão EVI implementada.

## 4. Persistência e fluxo de interface

Os testes de persistência verificam concorrência de gravações idênticas, um vencedor no CAS de revisão entre conexões, quota injetada, erro assíncrono, request bem-sucedido seguido de abort, corrupção persistida e snapshot da entrada antes dos awaits. Os 128 roundtrips exportam e reexecutam as configurações dos dois cenários. Uma alegação alterada com hash novo correto retorna divergência; um hash sem chave não autentica autor.

O fluxo DOM exige previsão e justificativa, executa a base longa com 6/6, a curta com 2/6, abre a busca de 64 alternativas, aplica a solução e chega a 6/6. Também verifica que importar uma execução válida não concede a ajuda reservada à primeira tentativa própria e que indisponibilidade de IndexedDB/localStorage mantém resultado e exportação.

O ambiente de teste fornece substitutos apenas para APIs ausentes: contexto WebGL retorna null; scroll é neutro; diálogo usa atributos de abertura. Não simula a pontuação. O teste não mede layout, foco real, contraste, leitor de tela, renderização, GPU ou execução real de Web Worker. Testes de contrato do bridge usam Worker controlado para reproduzir ordem/cancelamento/erros; não equivalem ao escalonamento de um browser.

## 5. Servidor e dependências locais

O smoke HTTP executou uma única instância de servidor em `127.0.0.1`, depois encerrada. Oito casos passaram: GET e HEAD 200; POST 405; ausente 404; tentativa de atravessar diretório 403; byte nulo, barra invertida e codificação inválida 400. O recibo conserva cabeçalhos e hashes dos corpos. Não foi teste de navegador nem tentativa de contornar o bloqueio de acesso visual.

A auditoria estática da aplicação leu 28 arquivos e não localizou chamada de rede nem asset remoto obrigatório. A URL NASA observada era comentário de fonte. O HTML portátil final tem **1.008.522 bytes**, incorpora os dez JSONs e tem zero dependências externas de runtime no metadado do build. Isso sustenta o empacotamento local; o teste de abertura fria sem rede no navegador-alvo permanece pendente.

O inventário registrou 157 entradas no lock e 83 pacotes instalados nesta plataforma, sem divergência de versão nem ausência de metadado de licença entre os pacotes instalados. As quatro dependências de runtime — React, ReactDOM, Scheduler e Three.js — possuem avisos MIT preservados. Metadado não é auditoria jurídica de toda dependência ou dataset. Pacotes opcionais de outras plataformas não foram executados. Nenhum `node_modules` é necessário para servir o `dist` com o script Node incluído.

## 6. Benchmark do núcleo

Recibo: `evidence/engine-benchmark.json`, medido às 09h04min05s UTC. Node 24.22.1, V8 13.6, Linux x64, executor identificado como AMD EPYC 9V45, nove CPUs lógicas disponíveis e aproximadamente 10,45 GB de memória total informada. Foram 30 aquecimentos e 200 amostras por carga, em sequência. Percentis por nearest rank; amostras completas preservadas.

| Busca completa | p50 | p95 |
|---|---:|---:|
| 64 configurações, contato longo | 4,201 ms | 4,936 ms |
| 64 configurações, contato curto | 3,994 ms | 4,237 ms |

Os tempos excluem inicialização de Node, carregamento de módulo, Worker, renderização React/Three, GPU, hash, IndexedDB e abertura fria offline. O executor é compartilhado, sem fixação de CPU ou controle térmico. Não se convertem esses valores em latência de ponta a ponta, FPS ou desempenho de RTX 3070/2060 Super/Mac. Eles mostram que o núcleo finito não exige cluster ou modelo de linguagem para a carga medida.

## 7. AB-R3A / REA

Foi executado o runtime local REA 6.7.0 disponibilizado no AB-R3A. O wrapper fixa versão, limita fontes/bytes/tempo/output, cria snapshot e não executa a aplicação inspecionada. O recibo completo está em `evidence/ab-r3a-analysis.json`; a leitura compacta está em `evidence/ab-r3a-digest.json`.

Resultado: exit 0, 7,634 s; 43 arquivos, 244.722 bytes de fonte; 40 arquivos JavaScript/TypeScript processados; zero falhas de parsing; 40.369 nós AST visitados. Os 596 findings são observações estruturais, **não 596 vulnerabilidades confirmadas**. O grafo de aplicação tem cobertura parcial; o semântico também é parcial e contém truncamento por orçamento de resultado. Há 5.460 unknowns semânticos no retorno. Não anunciar análise completa, ausência de falhas ou certificação de segurança.

O snapshot antecede o reforço de duas assertivas em `tests-ui/flows.test.mjs`. A conferência de hashes identifica somente esse arquivo alterado; o runtime auditado permanece o da entrega. Dependências externas, assets e builds não pertencem ao escopo de fontes da análise. Os limites de heap são por processo, não um teto agregado da família de processos; execução local tampouco é uma sandbox de rede do sistema operacional.

## 8. Gates ainda abertos

Navegador real, experiência visual, foco/teclado/leitor de tela, FPS, abertura fria offline, armazenamento em Safari/Firefox/Chromium, tolerância a contexto WebGL perdido, equipamentos de AB e pesquisa humana não foram qualificados. O Chromium local falhou por restrição de socket; a superfície de browser recusou protocolo de arquivo explicitamente. Não foi usado contorno desse bloqueio. DOM e HTTP verificam outras camadas.

Elegibilidade temporal, Resources específicos e adequação ao enunciado integral são gates da candidatura. Lançador/perfil orbital estão fixos no P0; não há propagador, link budget RF, ambiente térmico ou hardware em loop. A entrega de P&D é concreta e reproduzível nas camadas verificadas; esses limites fazem parte da especificação, dos recibos e do cronograma.
