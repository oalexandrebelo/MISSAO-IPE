# Missão Ipê — roteiro de investigação em 10–15 minutos

Revisão R9, 14 de novembro de 2026. Roteiro para a campanha `ipe-64-v1`, motor `0.1.1-rd`. Os resultados abaixo foram recalculados com Node v24.22.1; são resultados do modelo educacional, não previsões de um satélite real.

O objetivo é entregar **6 de 6 registros científicos válidos**, respeitando as condições do motor, até o fim de 180 minutos simulados. O envelope é de **3,6 kg e 86 créditos**. Entregar seis registros com um projeto fora do envelope não significa missão cumprida. A proposta exploratória de 4/6 presente na pesquisa A1 não foi adotada.

## Preparação do facilitador

Use uma sessão sem rascunho anterior, ou confira as seis escolhas da configuração inicial na tabela. Uma sessão existente pode recuperar um projeto salvo. A atividade pode ser individual ou feita por uma pequena equipe que discute o mesmo projeto; o roteiro não pressupõe multiplayer online.

| Sistema | Configuração inicial | Identificador do motor |
|---|---|---|
| Bateria | 16 Wh, descarga máxima de 20 W | `small` |
| Painel | 18 W nominais | `standard` |
| Processamento | BANDAS R/NIR, 180 Mbit por lote | `bands` |
| Rádio | Econômico, 960.000 bit/s úteis | `economy` |
| Memória | 1.536 Mbit | `large` |
| Política | Todos os contatos | `every-contact` |

Explique três limites em linguagem simples antes de começar. Os seis registros são dados históricos de Terra/MODIS; o CubeSat fictício processa e transporta arquivos do exercício. O relógio de 180 minutos é uma agenda didática e não comprime duas datas de observação real em três horas. A campanha possui seis decisões de catálogo: **não permite configurar lançamento, órbita ou Δv**. A cena 3D ilustra a missão; o laboratório de física explora modelos separados e não muda o resultado da campanha.

Não antecipe a configuração vencedora. A sequência é previsão → execução → investigação → redesign. Use a busca de alternativas depois de uma tentativa própria, quando a pessoa já formulou uma explicação.

## Roteiro de 12 minutos, com extensão opcional até 15

| Tempo | Ação da pessoa | Intervenção curta do facilitador | Evidência a observar |
|---|---|---|---|
| 0–2 min | Lê objetivo e limites; entra no hangar; confere configuração inicial no contato longo. | “O que precisa chegar à Terra para a missão contar como cumprida?” | Identifica 6/6, massa, créditos e diferença entre arquivo histórico e simulação. |
| 2–3 min | Seleciona **Minha previsão** e escreve o motivo em **Por quê?**; executa. | “Faça uma previsão antes de olhar o resultado.” | Hipótese vinculada a uma escolha ou recurso, não apenas “vai dar certo”. |
| 3–5 min | Confere 6/6; explora estados e eventos; pausa ou avança na reprodução. | “Produzir um lote, guardá-lo e recebê-lo na Terra são a mesma coisa?” | Distingue dados gerados, transmitidos, em fila e registros completos. |
| 5–7 min | Usa **Tentar com contato curto** mantendo as seis escolhas; registra nova previsão e executa. | “Só a duração do contato mudou. Que resultado você espera?” | Obtém 2/6 e procura a restrição de entrega, sem concluir que faltou energia. |
| 7–9 min | Relaciona volume, taxa e tempo; escolhe um redesign; prevê e executa novamente. | “Mais bateria cria mais segundos de comunicação? Menos dados pode exigir mais potência?” | Formula uma cadeia causal verificável; reconhece a diferença entre W e Wh. |
| 9–11 min | Se necessário, consulta alternativas; aplica uma opção como novo projeto; registra nova previsão e executa. | “O que significa ‘menos mudanças’ nesta busca?” | Obtém 6/6 com a configuração testemunha e entende o critério de distância no catálogo. |
| 11–12 min | Escreve uma reflexão citando um evento ou comparação; exporta o replay ou diário se desejar. | “Qual evidência mudou sua explicação? Que outra configuração valeria testar?” | Conecta escolha → mecanismo → resultado e reconhece limites do modelo. |
| 12–15 min, opcional | Faz um contrafactual controlado ou abre **Explorar a física**. | Escolha apenas um dos exercícios abaixo. | Transfere a explicação para outro caso sem atribuir ao laboratório alterações na campanha. |

O formulário exige uma hipótese e pelo menos oito caracteres de justificativa. Esse limite é uma condição de interação, não uma medida de qualidade da explicação. Não trate o cumprimento do formulário, a vitória ou a consulta à solução como demonstração de aprendizagem.

## Resultados que o facilitador pode conferir

| Caso executado | Registros válidos entregues | Dados gerados | Dados transmitidos | Dados em fila | Massa | Créditos | Menor energia |
|---|---:|---:|---:|---:|---:|---:|---:|
| Inicial, contato longo | 6/6 | 1.080 Mbit | 1.080 Mbit | 0 Mbit | 3,05 kg | 71 | 8,4149 Wh |
| Inicial, contato curto | 2/6 | 1.080 Mbit | 460,8 Mbit | 619,2 Mbit | 3,05 kg | 71 | 9,9236 Wh |
| Bateria maior apenas, contato curto | 2/6 | 1.080 Mbit | 460,8 Mbit | 619,2 Mbit | 3,45 kg | 78 | 17,9236 Wh |
| Bateria maior + ÍNDICE, contato curto | 6/6 | 360 Mbit | 360 Mbit | 0 Mbit | 3,50 kg | 84 | 18,1693 Wh |

Mbit significa milhão de bits, usando unidades decimais. A taxa do rádio já é serviço útil; não desconte uma segunda vez um overhead inventado. A reserva da bateria inicial é 2,4 Wh; a reserva da bateria maior é 3,6 Wh.

No cenário curto inicial, duas janelas de 240 segundos a 960.000 bit/s oferecem 460,8 Mbit de serviço. Cada registro em BANDAS exige 180 Mbit. Assim, dois registros são recebidos por completo; 100,8 Mbit de um terceiro registro não bastam para conceder mais um resultado científico. O restante permanece em fila. A menor energia de 9,9236 Wh fica acima da reserva de 2,4 Wh: a falha observada é de entrega, não de esgotamento da bateria.

## A configuração testemunha e sua explicação

Uma busca completa das 64 configurações no contato curto encontrou **9 projetos bem-sucedidos, 49 falhas operacionais e 6 projetos inválidos**, com zero casos indeterminados. A distância mínima em relação à configuração inicial é **duas escolhas**, com uma única testemunha nessa distância:

```json
{
  "battery": "large",
  "panel": "standard",
  "processing": "index",
  "radio": "economy",
  "buffer": "large",
  "policy": "every-contact"
}
```

ÍNDICE reduz os seis lotes de 1.080 para 360 Mbit, de modo que cabem no serviço de contato disponível. A troca aumenta a carga durante processamento de 26 para 38 W. Sob o fator de geração do cenário, o painel de 18 W fornece 9,9 W nessa operação. A bateria precisa fornecer `(38 − 9,9) / 0,95 ≈ 29,58 W`: a opção de 16 Wh permite apenas 20 W, enquanto a opção de 24 Wh permite 35 W. A opção de bateria muda capacidade **e** limite de potência; neste contrafactual, é o limite de potência que elimina a falha de pico.

Somente trocar para ÍNDICE termina a execução por pico no instante de 600 s, antes da produção do primeiro lote. Somente trocar a bateria mantém a insuficiência de serviço de comunicação e entrega 2/6. É a combinação que atende às condições desse caso. Os valores históricos de NDVI e a política científica são os mesmos nas duas rotas de processamento.

“Menos mudanças” significa menor número de escolhas diferentes, sob o mesmo cenário e objetivo. Não significa menor preço, menor massa ou projeto ótimo fora deste catálogo. Por exemplo, bateria maior + painel compacto + ÍNDICE + memória compacta, mantendo rádio econômico e todos os contatos, também entrega 6/6 no cenário curto por 75 créditos e 3,10 kg, mas exige quatro escolhas diferentes da inicial.

## Contrafactuais opcionais

Escolha um exercício e mantenha o restante fixo. Peça uma previsão antes de executar e uma explicação apoiada nos eventos depois.

| Alteração em relação à inicial | Cenário | Resultado do motor | Pergunta para investigação |
|---|---|---|---|
| Rádio rápido apenas | Longo ou curto | 0/6; falha de pico no primeiro contato, a 5.400 s | “Por que uma bateria com energia ainda disponível pode não alimentar o rádio?” A demanda é `26 / 0,95 ≈ 27,37 W`, superior ao limite de 20 W. |
| Memória compacta apenas | Longo | 2/6; 720 Mbit perdidos por falta de espaço | “Por que um contato longo não recupera lotes que já foram descartados?” Os seis trabalhos precedem o primeiro contato. |
| Último contato apenas | Longo | 3/6; 576 Mbit transmitidos, 504 Mbit em fila | “Quanto serviço foi abandonado ao ignorar a primeira janela?” |
| Painel compacto apenas | Longo ou curto | 0/6; falha de pico a 600 s | “Como a geração solar afeta a potência exigida da bateria?” A demanda é `(26 − 6,6) / 0,95 ≈ 20,42 W`, pouco acima do limite. |
| Bateria maior apenas | Longo | 6/6; passa de 71 para 78 créditos e de 3,05 para 3,45 kg | “Que recurso mudou sem aumentar o número de resultados?” |

Falha de pico encerra a operação neste motor. Não a apresente como um modo seguro que depois retoma a coleta, pois essa recuperação não é modelada.

## Uma extensão de física de três minutos

O laboratório é independente da campanha. Selecione uma relação, altere uma variável e observe a mudança. Voltar ao hangar deve preservar o projeto; os valores do laboratório não passam a ser novos componentes do catálogo.

| Experiência | Previsão que pode ser testada | Hipótese necessária |
|---|---|---|
| Dobrar a área do painel | Dobra a potência elétrica | Mesma eficiência, incidência e distância ao Sol; painel iluminado. |
| Dobrar a distância ao Sol | Reduz a geração a um quarto | Mesmo painel e ângulo; modelo ideal sem atmosfera ou degradação. |
| Aumentar a altitude LEO | Aumenta o período e reduz a velocidade circular | Órbita circular de dois corpos; não são passagens reais por Rio Verde. |
| Dobrar a distância de rádio | Soma cerca de 6,02 dB à perda e dobra a latência de propagação | Campo distante, ganhos fixos e linha de visada; não certifica bitrate. |
| Aumentar massa seca com mesmo propelente e Isp | Reduz o Δv ideal | Mesmo estágio; sem perdas de gravidade, arrasto ou queima finita. |

O laboratório usa raio terrestre médio arredondado de 6.371 km. Um cálculo de referência que usa raio equatorial de 6.378,1366 km fornece números ligeiramente diferentes; compare hipóteses antes de atribuir a diferença a erro de fórmula.

## O que o dado permite dizer

Os seis registros são três pixels selecionados e duas datas de composição MOD13Q1.061. Os compostos começam em 28/08/2024 e 13/09/2024; os dias de observação preservados no pacote são 01/09/2024 e 23/09/2024. O NDVI é calculado com vermelho e infravermelho próximo e passa por uma política de qualidade declarada. Não descreva esse conjunto como amostra representativa de todo o Cerrado.

O jogo altera a disponibilidade e a entrega dos registros. Ele não altera os valores históricos e não demonstra que uma mudança de NDVI foi causada por fogo, desmatamento, seca, produtividade ou saúde da vegetação. Um hash confere identidade dos bytes; sozinho, não autentica a origem nem valida uma interpretação científica.

## Observação de aprendizagem e acesso

Registre separadamente comportamento e interpretação. “Encontrou o evento de pico e citou o limite de 20 W” é observação. “Aprendeu engenharia espacial” é uma conclusão que este roteiro não comprova. Para uma avaliação posterior, recolha previsão, explicação após execução e resposta a um caso novo; analise erros e autocorreções, além do sucesso da missão.

O fluxo principal deve ser possível por controles HTML: botões, seleção de subsistema, opções, campos, eventos e linha do tempo. A alternativa 2D deve preservar escolhas e resultados. O facilitador pode usar essa vista desde o início. A presença desses controles e os testes DOM não equivalem a uma auditoria de teclado, leitor de tela, contraste ou WCAG em navegador real.

## Fontes e rastreabilidade

- Implementação auditada: `src/core/catalog.ts`, `src/core/engine.ts`, `src/core/science.ts`, `src/core/search.ts`, `src/data/science-data.ts`, `src/lab/physics.ts` e dados preservados em `public/data/`.
- MODIS, [MOD13 Collection 6.1 User Guide](https://modis-land.gsfc.nasa.gov/pdf/MOD13_User_Guide_V61.pdf), versão 3.10, setembro de 2019: produto, NDVI, escalas e campos de qualidade. Consultado nesta revisão em 14/11/2026.
- ORNL DAAC, [documentação do serviço de subconjuntos](https://modis.ornl.gov/data/modis_webservice.html): origem do serviço declarada nos recibos. Os hashes e os valores dos arquivos já preservados foram conferidos localmente; esta revisão não repetiu a aquisição remota.
- JPL, [Astrodynamic Parameters](https://ssd.jpl.nasa.gov/astro_par.html): parâmetro gravitacional terrestre e velocidade da luz, consultado em 14/11/2026.
- NASA Glenn, [Ideal Rocket Equation](https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/ideal-rocket-equation/): relação ideal entre massas, Isp e Δv, consultada em 14/11/2026.
- W3C, [WCAG 2.2](https://www.w3.org/TR/WCAG22/): referência para a futura auditoria de acesso, consultada em 14/11/2026. Não constitui certificação deste protótipo.
- Sínteses de pesquisa fornecidas à revisão: `a1-desafio.md`, `a2-fisica.md` e `a3-ux-tecnologia.md`, de 14/11/2026. Recomendações pedagógicas foram confrontadas com o comportamento efetivamente calculado; o limiar proposto de 4/6 não substitui o contrato 6/6.
