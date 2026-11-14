# Frente 7 — Revisão independente adversarial

Revisão feita em 14/11/2026 sobre o motor, prova finita, recibo e bridge de Worker do Missão Ipê. O trabalho é P&D específico anterior ao evento. A elegibilidade competitiva continua pendente; estes testes não certificam participação, hardware, dados futuros nem aprendizagem.

**Estado final: PASS nos oito testes distintos desta frente, após reexecuções dos casos afetados.** Houve defeitos reais antes das correções: tolerância NDVI e respostas malformadas do Worker. Houve também endurecimento de imutabilidade dos metadados compilados. A evidência vermelha permanece em `evidence/adversarial-review.json`, junto das versões, comandos e hashes SHA-256 das fontes. Esta frente só alterou seus testes e seus dois arquivos de relatório/evidência. A coordenação corrigiu a implementação.

## Método independente

Foram lidos os contratos, `specs/IMPLEMENTATION-CONTRACT.md`, `docs/03-PRT.md`, os módulos de núcleo, persistência e Worker, além dos testes já existentes. O objetivo não foi copiar assertions de regressão. `tests/adversarial.test.mts` constrói as 64 tuplas por uma máscara binária independente e usa valores literais do contrato para massa, créditos, taxa, lote, memória, geração e consumo.

O oráculo alternativo percorre segundos inteiros; quando a fila esvazia durante um segundo, divide apenas esse segundo entre transmissão e espera. Ele não importa a aritmética racional, `powerFlow`, catálogo, enumeração ou distância da implementação. Nesta versão fechada, trabalhos, contatos e luz têm fronteiras inteiras; saturação resulta de limitar o armazenamento em cada intervalo constante. Portanto esse oráculo é adequado às 128 combinações atuais. Ele não reivindica suportar cenários futuros com fronteiras fracionárias arbitrárias.

Para cada uma das 64×2 execuções foram comparados classificação, massa, créditos, bits gerados, recebidos, perdidos e em fila, registros entregues, energia final e mínima e instante de conclusão. Conferiram-se também os somatórios globais e por observação. A diferença admitida de menos de 1e-8 Wh/segundo existe apenas na comparação dos números de saída com o oráculo numérico independente; ela não altera qualquer limite ou resultado do motor.

A busca foi confrontada com as soluções do oráculo e executada em quatro ordens: natural, reversa, permutação modular por 17 e Gray code. O mínimo, as testemunhas e os contadores permaneceram iguais. Todas as alternativas de distância inferior ao mínimo foram decididas pelo oráculo; a resposta fornecida pela busca não foi usada como premissa.

## Resultado do domínio e prova mínima

| Cenário | Avaliadas | Sucessos | Falhas | Inválidas | Indeterminadas | Mínimo ao padrão |
|---|---:|---:|---:|---:|---:|---:|
| long-contact | 64 | 17 | 41 | 6 | 0 | 0 |
| short-contact | 64 | 9 | 49 | 6 | 0 | 2 |

A testemunha curta a distância 2 é única: bateria `large` e processamento `index`, mantendo painel `standard`, rádio `economy`, buffer `large` e política `every-contact`. Sua massa é 3,5 kg e seu custo é 84 créditos. Os sete projetos a distância 0 ou 1 não satisfazem a missão curta. A alternativa bateria grande + rádio rápido transmite o volume de BANDAS, mas pesa 3,7 kg e viola o envelope de 3,6 kg. Nenhuma dessas conclusões extrapola o catálogo de 64 tuplas.

Como verificação aritmética legível do padrão longo, a bateria já está cheia em 5400 s. Até 7200 s, há 600 s de rádio e 1200 s de espera: `E7200 = 16 − (16×600 + 8×1200)/(0,95×3600)`. Seguem 1800 s de carga solar, acrescentando `(18×0,85 − 8)×0,95×0,5 = 3,4675 Wh`. Os 504 Mbit restantes exigem 525 s de rádio no segundo contato; o restante até 10800 s ocupa 1275 s de espera. O resultado é 8,414868421052631 Wh, consistente com a implementação e o oráculo. O serviço curto econômico é 480×960000 = 460800000 bits, insuficiente para os 1080000000 bits de BANDAS, mas suficiente para os 360000000 de ÍNDICE quando as demais restrições são satisfeitas.

## Achado NDVI-TOLERANCE-001 — corrigido

No estado `ENGINE_VERSION=0.1.0-rd`, o validador exigia igualdade com o truncamento da razão de bandas escalada. Isso contradizia a tolerância científica inclusiva de 0,0001 declarada no PRT.

| RED | NIR | NDVI do produto | Erro absoluto | Esperado pelo contrato | Observado antes |
|---:|---:|---:|---:|---|---|
| 9999 | 10000 | 0,0001 | 0,000049997499875 | válido | inválido |
| 10000 | 9999 | −0,0001 | 0,000049997499875 | válido | inválido |
| 5000 | 5000 | 0,0001 | 0,0001 | válido | inválido |
| 5000 | 5000 | −0,0001 | 0,0001 | válido | inválido |

O [guia primário MOD13 C6.1](https://modis-land.gsfc.nasa.gov/pdf/MOD13_User_Guide_V61.pdf), seção 5.2/tabela 1, documenta armazenamento int16, escala 0,0001 e domínio do produto. A consulta não encontrou regra explícita que autorize truncar o NDVI reconstruído dessas bandas; as buscas por `trunc` e `round` também não retornaram texto. Isto limita a alegação sustentada por essa fonte: seis exemplos concordantes não demonstram um algoritmo NASA de quantização. A tolerância é política declarada deste protótipo, não garantia universal de acurácia MODIS.

A coordenação passou o motor para `0.1.1-rd` e separou o campo escalado da concordância científica. Para `s=NIR+RED`, `d=NIR−RED` e `p` inteiro do produto, a comparação inclusiva é `abs(d×10000 − p×s) <= s`. Os inteiros nesse domínio são seguros. Não se introduziu epsilon em energia, massa, pico ou bits. As duas representações IEEE do campo MOD13 escalado continuam tratadas separadamente.

Os testes agora passam nos dois sinais, exatamente no limite e logo além dele: razão ±1/9999 contra produto zero deve ser rejeitada porque seu erro supera 1e-4. Os seis registros originais e os resultados das 128 combinações permaneceram iguais após a correção.

## Worker — defeitos corrigidos e alcance do teste

Antes da correção, uma mensagem com ID atual, `ok:true` e `result:{}` resolvia a Promise com um objeto que não satisfazia o contrato. Uma mensagem `null` lançava `TypeError` no listener; a Promise só era rejeitada depois de cancelamento explícito ou timeout. São falhas de tratamento e validação do transporte, não demonstração de Worker hostil executado no produto.

O bridge corrigido rejeita mensagem malformada pelo caminho de encerramento e valida resultado, configuração e cenário. Os testes também provocam retorno de outro cenário, outra configuração, busca incompleta que ainda tenta certificar mínimo, soma inconsistente de contagens, distância incompatível e testemunha duplicada. Todos são rejeitados.

O FakeWorker confirmou que duas chamadas concorrentes têm identidades independentes, a configuração enviada é um snapshot, ID estrangeiro válido é ignorado, cancelamento termina o Worker, mensagem posterior não reabre uma Promise cancelada e um sinal já cancelado não cria um Worker. O retorno válido da busca continua aceito. Isso testa o protocolo no Node; não mede inicialização real de Worker, rendering, GPU ou responsividade em navegador. Nenhum navegador real foi usado nem houve tentativa de contornar as restrições informadas.

## Metadados e recibo

Antes do endurecimento, a anotação TypeScript `readonly` não impedia mutação em runtime. Alterar temporariamente `sourceId`, latitude e longitude do primeiro registro para outros valores admissíveis preservou sua aprovação, o sucesso da missão e o hash do resultado, porque esses campos não integram a saída numérica. O hash fixo do pack também permaneceu igual. Os valores originais foram restaurados imediatamente.

Esse experimento exigia mutação direta do módulo em memória. O importador não oferece uma entrada para substituir o pack, portanto não foi classificado como bypass remoto ou falsificação de procedência via replay. A coordenação congelou o array e cada registro. O teste agora exige essa imutabilidade e verifica que a tentativa de alteração lança TypeError. O congelamento evita alteração acidental; não constitui prova criptográfica de autoria NASA.

No recibo, seis adulterações distintas foram feitas após exportação, recalculando corretamente o hash da alegação: ID científico, NDVI esperado, timestamp de evento, redistribuição de bits entre observações sem mudar total global, modo do trace e quantidade requerida. Todas produziram `matchesClaim:false`, e o resultado reexecutado permaneceu idêntico ao original. Aceitar uma alegação estrutural para compará-la não significou confiar nela. Não foi encontrado bypass dessa reexecução nas contraprovas aplicadas.

## Execuções registradas

Runtime: Node v24.22.1, TypeScript executado por strip types. Não há revisão git disponível nesta raiz; o recibo usa hashes dos arquivos para identificar os estados inspecionados.

| Execução | Resultado real |
|---|---|
| `node --experimental-strip-types --test tests/adversarial.test.mts` antes da correção científica | 4 PASS / 1 FAIL, falha NDVI |
| Mesmo comando após NDVI 0.1.1-rd e inclusão dos dois testes Worker | 5 PASS / 2 FAIL, falhas Worker |
| `node --experimental-strip-types --test --test-name-pattern='Worker bridge rejects\|null Worker\|compiled scientific' tests/adversarial.test.mts` antes do endurecimento | 0 PASS / 3 FAIL |
| `node --experimental-strip-types --test --test-name-pattern='Worker\|compiled scientific' tests/adversarial.test.mts` após correções | 4 PASS / 0 FAIL |
| `./node_modules/.bin/tsc --noEmit --pretty false` após guardas de tipagem | PASS, exit 0 |

Na primeira repetição após o bridge corrigido, um teste rejeitou a redação correta de `ReplayValidationError` por usar regex excessivamente estreita. O teste passou a verificar o tipo Error e o comportamento de rejeição/encerramento; esse ajuste não alterou a implementação. Houve nova execução dos quatro casos afetados, todos aprovados. Foram aprovados oito testes distintos ao longo das reexecuções; não se declara uma execução final única de oito testes que esta frente não realizou.

Não foi ampliado o backend nem a revisão de Prisma: o esquema opcional não participa do caminho ativo de persistência no browser e não surgiu um risco concreto que justificasse ampliar o escopo. A validação visual e a integração real de interface continuam fora da evidência desta frente.
