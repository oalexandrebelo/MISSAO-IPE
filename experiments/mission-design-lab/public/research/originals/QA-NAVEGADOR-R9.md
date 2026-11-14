# QA de navegador — Missão Ipê R9

Data: 14/11/2026. Verificação manual da coordenação no Chrome do ambiente de prévia, depois da integração das seis frentes. Esta verificação complementa [QA-R9](QA-R9.md).

## Resultado observado

- Abertura, hangar e sala de missão renderizados e operados no navegador.
- Configuração inicial: cenário longo terminou em **6/6**, 1.080 Mbit recebidos, 3,05 kg, 71 créditos.
- Mesma configuração no cenário curto: **2/6**, 460,8 Mbit recebidos e 619,2 Mbit na fila.
- Consulta pelo botão da interface: **64/64** combinações, 9 viáveis, 6 inválidas e 49 falhas; menor distância de **2** escolhas.
- Aplicação do projeto sugerido exigiu uma nova previsão antes de executar. Bateria 24 Wh + ÍNDICE chegou a **6/6**, 360 Mbit recebidos, fila zerada, 3,50 kg e 84 créditos no cenário curto.
- Comparação abriu com as duas execuções recentes, mostrou cenários e escolhas, e diferenciou massa, créditos, energia mínima e quantidades de dados. Quando as condições diferem, o diálogo informa a limitação da comparação.
- Escape fechou o diálogo. Após a correção de foco, `document.activeElement` voltou ao botão **Comparar missões**.
- O caderno manteve execuções após recargas durante desenvolvimento; abrir um resultado preservado reproduziu seus indicadores. Isso não constitui garantia de durabilidade em todos os navegadores.

## Laboratório

Os controles foram operados pelo teclado e seus resultados visíveis mudaram:

| Ação | Resposta observada |
| --- | --- |
| Altitude de 500 para 510 km | Período de 94,5 para 94,7 min |
| Distância solar de 1,0 para 5,2 AU, demais entradas constantes | Potência elétrica de 95,9 para 3,5 W |
| Propelente de 1,0 para 1,1 kg | Δv ideal de 481 para 524 m/s |
| Distância entre antenas de 800 para 900 km | Latência de ida de 2,67 para 3,00 ms e potência recebida de −97,4 para −98,4 dBm |
| Restaurar valores iniciais | Entradas e resultados voltaram aos valores padrão |

A análise numérica independente e os testes das equações estão em QA-R9. O laboratório não altera a configuração da campanha.

## Responsividade e correções encontradas

A composição foi inspecionada também em um iframe de **390 × 844 px**. Devido à barra de rolagem, a área útil medida foi de 375 px. Isso verifica regras CSS em viewport estreito; não substitui teste em aparelho físico.

Foram corrigidos durante a inspeção:

1. Duas legendas ocupavam o mesmo espaço no hangar: removida a legenda duplicada.
2. O título da abertura mantinha `white-space: nowrap` e uma regra antiga ocultava a primeira quebra: o título passou a caber e a separar suas frases.
3. O seletor de cenário herdava fundo claro e orientação horizontal no texto secundário: corrigidos fundo e empilhamento.
4. A tabela de comparação herdava cabeçalho claro com contraste insuficiente: aplicado o tema escuro e aumentado o texto.
5. Escape não devolvia o foco ao acionador do diálogo: restauração explícita implementada e observada.
6. As regras técnicas apareciam como expressões de código: o painel agora apresenta critérios em linguagem natural e unidades. Identificadores continuam disponíveis em uma seção expansível.

Depois das correções, abertura, hangar e formulário apresentaram **scrollWidth = clientWidth = 375 px** na área útil móvel. O formulário foi preenchido e habilitou a execução. As capturas estão em [evidence/ui](../evidence/ui).

## Limites desta verificação

O navegador selecionado exibiu o equivalente **2D** após a tentativa de inicializar WebGL2. A cena R3F foi compilada e o caminho de fallback permaneceu operacional. **A aparência e o desempenho da cena 3D não foram validados nesta sessão.**

Não foram realizados estudo com participantes, auditoria completa WCAG, teste com leitor de tela, ensaio em celular físico, medição de FPS ou teste de recarga offline. Movimento reduzido e suspensão da animação têm implementação revisada, mas não foram alternados pelas preferências do sistema neste navegador.

As mensagens de erro observadas no console pertenciam à extensão do ambiente; a consulta filtrada pela origem local da aplicação não retornou erros naquele momento. Não se declara ausência universal de erros.


## Refinamento R10 — ConOps, requisitos e retorno científico

Nova verificação em 14/11/2026, após integrar as referências adicionais fornecidas por AB.

- O briefing apresenta destinatário fictício, pergunta sobre a vegetação, entrega esperada, condições previstas e caminho dos arquivos até o solo.
- A revisão pré-voo inicia fechada. No projeto inicial com contato curto, a UI mostrou 1.080 Mbit previstos, teto de transmissão de 460,8 Mbit, memória de 1.536 Mbit, demanda de pico de 16,95 W e limite de descarga de 20 W. A energia acumulada permanece dependente da execução.
- A hipótese de transmissão foi registrada pela interface e executada: 2/6 registros, 460,8 Mbit recebidos, 619,2 Mbit em fila e mínimo de 9,92 Wh.
- A comparação científica dessa tentativa exibiu somente o par completo do ponto A: **1 de 3** comparações. B manteve uma recepção parcial; B/C não receberam valores NDVI ou diferenças preenchidos a partir do arquivo de origem.
- O resultado preservado da configuração bateria 24 Wh + ÍNDICE mostrou **3 de 3** comparações e 6/6 registros, 360 Mbit, 3,50 kg e 84 créditos. A tabela usa os valores NDVI do resultado executado, antes de arredondar as diferenças.
- A matriz separou limites de projeto, operação e entrega. No projeto curto inicial, os dois primeiros grupos foram atendidos e a entrega não foi atendida. O resultado global continuou sendo **Missão não cumprida**.
- O botão de evidência de entrega selecionou o evento real de insuficiência, posicionou a linha do tempo e moveu o foco para `evidence-title`.
- A revisão independente identificou uma redação ambígua em R06. Foi corrigida para **Qualidade dos dados de origem**, com explicação explícita de pré-validação do arquivo histórico. Esse requisito não atesta recepção ou cálculo do índice no solo.
- Abertura, relatório e revisão pré-voo foram novamente operados no iframe de 390 × 844 px. A página manteve **375 px de clientWidth e scrollWidth**. As tabelas mantêm rolagem própria: ciência 560 px dentro de 309 px; requisitos 790 px dentro de 301 px. O foco e a seta direita moveram a tabela científica sem alargar a página.
- O texto da tabela científica em tela estreita foi aumentado, com uma indicação de rolagem. O layout evita reduzir os valores numéricos para caberem em quatro colunas estreitas.

Capturas adicionais: `retorno-cientifico.jpg` e `retorno-mobile.jpg`, disponíveis na galeria de evidências.

### Verificação automatizada do conjunto integrado

- **101/101 testes de domínio e integridade passaram**, incluindo os 30 testes novos de pré-voo, requisitos e retorno científico. Nenhum teste foi pulado.
- **9/9 testes de interface passaram**, preservando o percurso de previsão, execução, consulta, novo projeto, importação e falhas de armazenamento.
- O veredito e as versões do motor e do catálogo permanecem os mesmos da base. O refinamento acrescenta interpretação e visualização, sem alterar as condições de sucesso.
- Permanecem os limites descritos acima: esta sessão não demonstra aprendizagem com participantes, desempenho 3D nem conformidade WCAG completa.
