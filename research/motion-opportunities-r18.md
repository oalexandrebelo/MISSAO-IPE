# R18 — evidência científica e movimento

Inspeção: 15/11/2026. Escopo: contratos existentes e referência pública solicitada. Este documento descreve observações e propostas; não afirma que elas já foram implementadas.

## Implementação delimitada desta revisão

`src/ui/OrbitalScene.tsx` agora usa a identidade de cada registro de Bennu/Webb para os cartões dos segmentos de solo e usuários. Cada cartão compara seu ID com `deliveredRecordIds`; recebimento parcial não acende os primeiros N cartões por contagem. Somente o cartão recebido mostra o rótulo, valor e unidade do próprio registro. Antes disso mostra que a recepção não foi estabelecida. A aparência estável, voltada à câmera, usa `CanvasTexture` e `sprite` nativos do Three.js, com descarte das texturas e sem animação contínua ou dependência adicional. A cena da Terra foi preservada.

A tipagem passou com `npx tsc --noEmit`. Os testes de motor e de apresentação existentes são executados separadamente; eles não constituem validação visual de GPU. O painel acessível e a interpretação do resultado continuam fora do canvas, como no contrato existente. A prévia científica, o gráfico e a proveniência são integração dos demais módulos R18.

## Cosmic Mapping: o que foi realmente observado

URL consultada no Chrome: https://motionsites.ai/?prompt=cosmic-mapping

A página abre o detalhe **Cosmic Mapping**, categoria AI. A prévia pública é um vídeo de aproximadamente 6,47 segundos: camadas curvas concêntricas, aproximação/rotação em direção a uma abertura central escura, contraste azul profundo/âmbar e marcações finas que lembram mapas. Duas capturas sucessivas mostraram posições diferentes das camadas. A duração e o estado de reprodução foram lidos do elemento de vídeo visível. Isso comprova a prévia audiovisual, não um motor 3D interativo ou uma simulação científica.

O texto do prompt está protegido por **Unlock prompt / Go Unlimited**. Não houve desbloqueio, compra, criação de conta, acesso ao Studio, geração, download nem reutilização de mídia. A prévia não fornece licença de redistribuição. A leitura web convencional falhou; a inspeção visual pública funcionou.

## Aplicação original ao MISSÃO IPÊ

1. Usar profundidade e camadas para comunicar a sequência **fonte → instrumento → observação → downlink → resultado**, conservando o mesmo identificador de registro em todos os passos.
2. Mover o foco para o instrumento durante processamento e para a antena durante transmissão. O projeto já tem `inspection`, `focusSubsystem`, controles de câmera e geometria R3F; não é necessária uma nova biblioteca.
3. Revelar imagem ou ponto espectral somente quando o registro correspondente estiver completo e compatível. O relógio do jogo controla disponibilidade, nunca o valor publicado pela NASA.
4. Manter dados estáveis e exibir barras de incerteza sem animação que sugira melhoria de precisão. Um ponto selecionado pode destacar o registro e sua origem. Um cartão Bennu pode mostrar imagem, instrumento, produto e data de observação.
5. Usar as cores da marca para seleção e estado de recepção; cor de um ponto não deve sugerir abundância molecular ou risco de pouso sem cálculo documentado.
6. Oferecer a mesma seleção por botões/teclado e preservar o equivalente 2D. Respeitar movimento reduzido e não inserir preloader obrigatório para dados locais.

O efeito de vórtice da referência não é uma representação física de Bennu, trânsito exoplanetário, propagação de rádio ou órbita do Webb. Deve permanecer inspiração compositiva, sem copiar o vídeo ou atribuir-lhe caráter científico.

## Contratos encontrados antes da implementação R18

Todos os caminhos abaixo são relativos a `experiments/mission-design-lab/`.

| Local | Contrato observado | Mudança mínima recomendada |
| --- | --- | --- |
| `src/lab/scientific-expeditions.ts` | `ExpeditionDatum`: `id`, `label`, `goal`, `syntheticLabel`, `value:number`, `unit`; seis entradas em `dataFixture` | Representar observação de imagem e ponto espectral com metadados apropriados. Não preencher um número científico arbitrário para imagem. Incluir origem, produto, instrumento, instante histórico, versão e transformação/unidade. |
| Mesmo arquivo | `ExpeditionObservation` acrescenta `producedAtS`, `deliveredAtS`, `valid` e contagem de bits; o motor copia os dados sem alterar seus valores | Preservar valores e incertezas publicados. Separar instante histórico de observação do T+ didático de processamento/recepção. Renomear mensagens que dizem produzir uma observação sintética. |
| Mesmo arquivo | Seis horários de processamento e meta de seis registros; 60 s por trabalho; 120/180 Mbit por pacote conforme instrumento | Manter seis produtos/bins autênticos evita mudar o agendamento. Declarar seleção/subconjunto. Tamanhos de pacote, potência, massa e contatos continuam didáticos, não tamanhos dos arquivos NASA. |
| `src/ui/ScientificExpedition.tsx` | Retorno mostra `number(observation.value)` e `unit`; só revela valor após recepção completa e compatível | Para Webb: eixo de comprimento de onda, grandeza correta e incerteza com unidade/definição. Para Bennu: prévia e metadados em vez da antiga rugosidade. Conservar bloqueio por registro, inclusive em tentativa parcial. |
| Mesmo arquivo | Relatório JSON inclui `result`, fontes gerais e aviso; formato `ipe-scientific-report-v1` | Exportar identificadores de produto, proveniência, versão do conjunto, incerteza e transformações junto de cada registro; revisar versão do relatório/modelo. Arquivo de projeto é configuração, não evidência científica. |
| `src/lab/scientific-expeditions.ts` / `src/lab/mission-visual-state.ts` | `getExpeditionVisualState` fornece IDs recebidos até o instante, energia, fila, contato e subsistema de foco | Reutilizar esse estado para bloquear/revelar evidência. Não interpolar medida científica com o relógio. |
| `src/ui/Scene.tsx` / `src/ui/OrbitalScene.tsx` | Cena configurada representa câmera/espectrômetro, painéis/bateria e antena; cartões 3D de resultado usam os primeiros N elementos conforme contagem recebida | Passar IDs dos registros e selecionar por identidade, evitando que uma lacuna no meio acenda o cartão errado. Seleção deve ligar cartão, informação acessível e produto científico. |
| `src/lab/spacecraft-presentation.ts` | Nota geral afirma que observações e parâmetros são sintéticos | Separar observações NASA arquivadas de orçamento/engenharia simulados. O hardware modular próprio não vira réplica do instrumento NASA. |
| `src/lab/mission-curriculum.ts` | Bennu pede regiões A/B/C; Webb pede três intensidades em dois instantes | Reescrever a pergunta e reflexão para o produto efetivamente disponível. Se forem seis bins de um espectro, não apresentar como duas exposições. |
| `src/ui/NASAReferenceScene.tsx` | Modelos NASA locais são referências geométricas, independentes da simulação | Manter essa distinção: o GLB não é a origem dos números nem valida registro espacial de imagens sobre a superfície. |

### Verificação que protege o aprendizado

- Os dados NASA selecionados mantêm valor, unidade, incerteza e ID após mudanças de energia, instrumento ou contato.
- Contato curto revela apenas IDs realmente recebidos, com lacunas explícitas; nenhum valor é substituído por zero.
- Uma configuração incompatível não libera resultados científicos apenas por transportar bits.
- Um dado já público pode ser consultado como fonte, mas o painel de retorno distingue essa consulta do resultado da tentativa.
- O relatório conserva a proveniência e separa data histórica de T+ didático.
- Testes existentes a atualizar: `tests/scientific-expeditions.test.mts` exige `syntheticLabel` e aviso sintético; `tests-ui/scientific-missions.test.mjs` assume uma lista uniforme de números; `tests/mission-curriculum.test.mts` fixa seis registros e resultados A/B. Manter os testes de balanço de energia, bits e transporte.

## REA / AB-R3A

Não foi necessário para esta inspeção. A página pública foi visualizada e o projeto já possui os modelos NASA locais e a infraestrutura React/R3F/SVG. O caminho AB-R3A indicado na referência local não está disponível nesta máquina; não se presumiu que o laboratório TOTP seja uma ferramenta de produção de assets. Nenhum pacote, captura executável ou dependência foi instalado.
