# MVP do jogo e integração das missões de Bruno

A R25 reúne seis missões na entrada do beta. Cerrado, Bennu e Webb seguem as investigações existentes com registros históricos. Pulso Orbital, Eco Lunar e Horizonte Rubro são três adaptações jogáveis da contribuição de **Bruno A Carvalho**. Os cenários foram conferidos no código público e na cópia preservada pelo projeto. [Contribuição de Bruno](https://github.com/brunoassiscarvalho/missao-ipe) · [Origem do snapshot](https://github.com/oalexandrebelo/MISSAO-IPE/blob/5ecb1a44fcabf32c63741711a78bf3c17efff671/contributions/bruno-figma/ORIGEM-E-INTEGRACAO.md)

## O que se joga

| Missão | Pergunta e limite didático | Referência |
| --- | --- | --- |
| **Pulso Orbital · ISS** | Quais leituras permitem comparar a composição do ar? A viagem exige proteção para conservar a calibração. Registros recebidos podem perder validade. | [NASA · Monitoramento do ar na ISS](https://www.nasa.gov/directorates/esdmd/hhp/toxicology-and-environmental-chemistry/) |
| **Eco Lunar · polo sul** | Onde combinar temperaturas baixas e indícios de hidrogênio para priorizar uma investigação de gelo? Reserva na sombra limita a coleta e a janela de enlace limita a recepção. | [NASA · Diviner e LEND no LRO](https://science.nasa.gov/mission/lro/spacecraft-and-instruments/) |
| **Horizonte Rubro · Jezero** | Como medir vento, temperatura e poeira durante uma frente marciana? A massa precisa caber no lançador, o prazo exige uma transferência adequada e o módulo precisa suportar a entrada. | [NASA · Perseverance e MEDA](https://science.nasa.gov/mission/mars-2020-perseverance/science-instruments/) |

O briefing leva ao hangar, com seis escolhas entre lançador, propulsão, reserva de energia, proteção, navegação com enlace e instrumento. O painel recalcula massa transportada, orçamento, energia para coleta, prazo e capacidade da janela. A geometria da nave responde à escolha. A bancada usa um modelo 3D próprio, sem escala, e oferece um esquema com os mesmos controles e números quando WebGL está indisponível.

A opção **Inspecionar referência NASA** carrega o modelo do caso sob demanda. A autoria e a fonte aparecem junto à referência. Os modelos são o contexto visual da ISS, do LRO e do Perseverance. A montagem do jogador conserva sua geometria didática.

A execução passa por lançamento, transferência, coleta e recepção conforme o que o projeto permite. Se massa ou crédito extrapolam o limite do lançador ou do caso, o relatório começa pelo bloqueio em T+0. A contagem é pulável e fica desativada quando o navegador indica movimento reduzido. O relatório distingue arquivos produzidos, recebidos e válidos, identifica a primeira causa e permite redesenhar com as mesmas escolhas.

## Motor e integração

`experiments/mission-design-lab/src/lab/bruno-missions.ts` contém o catálogo `BRUNO_MISSIONS`, as opções `BRUNO_CHOICES`, a validação de configuração e a simulação determinística `ipe-bruno-r25-v1`. As janelas, massas, custos, números de registros e restrições são parâmetros didáticos. Cada caso usa seu próprio orçamento. Para teste dos limites, a reserva começa na janela crítica. O tempo da transferência é uma estimativa do exercício. A pontuação reutiliza a régua comum de 60 pontos de ciência, 30 de engenharia e 10 de eficiência.

`BrunoCampaign.tsx` recebe o identificador, a função de voltar e os callbacks de decisão e conclusão. Uma conclusão calcula o resumo a partir da configuração efetivamente executada. O servidor pode recalcular a mesma configuração pelo motor puro. O contexto de Libras descreve o briefing, a peça e o efeito em edição ou o resultado calculado, com texto público limitado ao estado da tela.

## Reteste local

1. **ISS.** Execute o projeto inicial. Confira 6 recebidos e 0 válidos por perda da calibração. Redesenhe com proteção reforçada e confirme 6 válidos.
2. **Lua.** Use proteção reforçada e enlace direcional com a reserva padrão. Investigue a coleta incompleta. Amplie só a reserva e execute novamente. Mude só o enlace para local e confira que a coleta pode permanecer completa enquanto a recepção cai.
3. **Marte.** Execute com o lançador compacto e confira bloqueio em T+0. Selecione maior capacidade, propulsão química, reserva ampliada, proteção reforçada, enlace direcional e o instrumento da missão. Execute e confira 6 válidos. Troque a propulsão para elétrica e confira o limite de chegada.
4. **Interface.** Repita com teclado, tela estreita, preferência de movimento reduzido e WebGL bloqueado. Abra a referência NASA para conferir carregamento sob demanda, créditos e retorno à montagem. Confira no painel privado se a tentativa está vinculada à missão correta.

O teste de domínio conferiu as 64 combinações de cada caso, 192 no total, e as trajetórias causais acima. Os testes de DOM conferiram foco na mudança de tela, execução única, redesenho da ISS, bloqueio de lançamento e movimento reduzido.

Nas três missões novas, a tentativa é registrada quando o relatório é concluído. Sair da missão durante a contagem interrompe essa execução e não registra uma tentativa cancelada. Por isso, o painel contabiliza conclusões dessas missões, sem medir todos os lançamentos iniciados ou abandonos; o Cerrado mantém seu registro próprio de cancelamentos.

## Aceite observado no navegador

| Verificação | Resultado local |
| --- | --- |
| Hangar em 1440 × 900 px | Os seis sistemas, os indicadores e **Simular lançamento** ficaram visíveis juntos. A borda inferior do botão estava em y = 744 px, dentro do conteúdo principal que terminava em y = 870 px. |
| Pulso Orbital · ISS | A montagem inicial obteve 0 registros válidos. Após reforçar a proteção, entregou 6 e marcou 92 pontos. |
| Eco Lunar · Lua | A montagem verificada entregou 6 registros válidos e marcou 90 pontos. |
| Horizonte Rubro · Marte | O lançamento inicial foi bloqueado com 529 kg para uma capacidade de 450 kg. A montagem revista entregou 6 registros válidos e marcou 91 pontos. |
| Referências NASA | ISS, LRO e Perseverance renderizaram no navegador. O Perseverance também foi conferido em viewport de 390 px. |

O aceite cobre as execuções observadas no navegador local. A validação em celular físico, a avaliação linguística de Libras e o efeito sobre a aprendizagem permanecem pendentes.

## Continuidade para dois desenvolvedores

- **Motor e dados.** Manter o catálogo, os limites didáticos e o recálculo no servidor. Repetir os casos de bloqueio e recuperação e conferir se o observatório reproduz os resultados da execução.
- **Interface e acessibilidade.** Manter a jornada da entrada ao relatório, verificar foco e movimento reduzido e testar o 3D, o esquema alternativo e Libras em celular físico.

Na revisão conjunta, comparar o relatório do jogador com o evento salvo nas seis missões e conservar o crédito de Bruno e as referências NASA.
