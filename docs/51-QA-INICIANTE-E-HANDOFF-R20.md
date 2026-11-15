# Primeira experiência nas três missões · handoff R20

Esta revisão percorre o jogo com a pergunta de um iniciante: **o que devo fazer agora, o que minha escolha muda e o que posso aprender com o resultado?** As correções mantêm os arquivos científicos e o motor existentes. A inspeção foi conduzida por agentes no navegador e por testes de regressão; ainda não é um estudo de usabilidade ou aprendizagem com participantes humanos.

[Jogar](https://projeto-ipe.vercel.app/lab/) · [Pitch de Alexandre Belo](../presentation/pitch/index.html) · [Guia do pitch de três minutos](52-PITCH-ALEXANDRE-BELO-R20.md) · [Handoff da trilha e dos quatro papéis](48-HANDOFF-DOIS-DEVS-R19.md) · [Dados reais e limites](45-DADOS-REAIS-BENNU-WEBB-R18.md).

## O propósito de cada missão

| Caso | O que o jogador decide | O que deve observar | O que aprende a explicar |
| --- | --- | --- | --- |
| Cerrado · Terra/MODIS | Processar bandas ou índice; escolher bateria, painel, rádio, memória e plano de transmissão | Instrumento/processador, energia e rádio da nave; instante em que um registro chega ou uma restrição interrompe a operação | Potência em W e energia em Wh são limites diferentes. Um par de períodos só permite comparar o índice quando os dois registros chegam válidos. Ausência de dados não equivale a ausência de vegetação. |
| Bennu · OSIRIS-REx | Carga científica, energia, agenda de contatos, acesso, perfil e duração | Câmera ou espectrômetro; painéis e bateria; rádio e horário do contato | Produzir ou armazenar dados não garante recebê-los no solo. Ampliar o serviço de solo muda início, duração e custo dos contatos, mantendo antena e taxa. As dimensões de rochas recebidas não provam sua composição. |
| Webb · WASP-39 b | Compatibilidade do instrumento com a pergunta e recursos que sustentam sua operação | Carga científica e registros recebidos no relógio da cena | Uma imagem e um espectro respondem a perguntas diferentes. Seis pacotes podem chegar sem constituir seis medidas compatíveis. Os bins publicados mantêm unidade e incerteza; o recorte não reproduz a detecção molecular do estudo completo. |

A nave configurável, as capacidades, o orçamento e a agenda continuam didáticos. Os registros históricos mantêm suas fontes NASA. Alterar uma escolha muda o transporte ou a validade operacional do registro no exercício; não reescreve o valor científico publicado.

## Confusões encontradas e correções

### Termos científicos apareciam antes da explicação

A abertura de Bennu agora explica “clasto” como fragmento de rocha e identifica o eixo maior como a maior dimensão medida. A abertura do Webb explica que cada bin é uma pequena faixa de comprimento de onda e que o espectro mostra a luz da estrela bloqueada em cada faixa. Os termos dos arquivos científicos permanecem preservados, com uma tradução próxima para quem está começando.

### A escolha não apontava para a peça correspondente

No projeto de Bennu e Webb, os seletores já mudavam a configuração, mas a cena permanecia no segmento de lançamento. Trocar energia ainda mostrava o envelope de integração. A edição agora aponta para o instrumento, para energia ou para comunicação, conforme a escolha, e mostra uma explicação breve junto aos seletores.

O foco é um convite à inspeção, não uma trava: o jogador pode tocar em outra peça ou escolher “Nave completa”. Lançamento, perfil e duração recebem explicações sobre limites, agenda e prazo; a interface não inventa uma mudança geométrica para toda escolha. Comunicação mantém explicitamente a mesma antena e taxa nas duas opções de solo.

### O resultado final parecia contradizer o relógio

A simulação calcula a tentativa antes da inspeção. Nas expedições, a cena começa em T+0; por isso pode mostrar zero registros enquanto o resumo já informa seis no final. A interface agora anuncia essa diferença antes da cena e aponta para os controles de reprodução e estado final.

No Cerrado, o resumo ganhou o rótulo “Resultado final da tentativa”. Rebobinar o 3D preserva o resumo final e reduz os registros disponíveis na cena ao instante correto. Isso permite investigar a história da missão sem antecipar evidências no replay.

### Um diário existente aparecia como ausente

Ao mover o relógio do Cerrado, a seleção de evento era limpa. A mensagem dizia que o motor não havia retornado eventos, mesmo com o diário preenchido. Agora convida a selecionar um evento. A mensagem de ausência só aparece quando a lista realmente está vazia.

### Copiar um ensaio não indicava onde continuar

Aplicar A ou B do experimento guiado do Cerrado deixava o visitante ao fim da página. A ação agora retorna o foco e a rolagem ao título do hangar, confirma a cópia e explica a próxima ação: revisar, prever e executar sua própria tentativa. Não há execução, salvamento ou nota automática ao copiar o exemplo.

### Instrumento incompatível citava o caso errado

A câmera selecionada no Webb citava dimensões de Bennu, e o espectrômetro escolhido em Bennu citava o espectro do Webb. O texto agora respeita a missão: explica por que imagem não substitui o espectro exigido no Webb e por que o espectrômetro não atende ao levantamento visual deste caso de Bennu. Uma regressão cobre as quatro combinações, sem mudar valores ou regras do motor.

### Ler o 3D sem adivinhar

O foco de comunicação agora traz o primeiro intervalo e o total planejado de contato junto à nave. A legenda distingue contorno de inspeção de transmissão registrada; selecionar uma peça não indica falha. O instrumento informa se está processando no instante escolhido. O desenho da bateria usa a mesma quantidade de segmentos proporcionais em 2D e 3D, sem apresentá-los como células reais. Apenas a legenda curta anuncia mudanças ao leitor de tela, evitando repetir o inspetor inteiro.

Nas expedições, o cabeçalho deixou de mostrar as etapas desabilitadas do Cerrado: a navegação válida é a sequência própria de seis etapas. Os arquivos adicionais desta revisão são `src/App.tsx`, `src/ui/Scene.tsx`, `SpacecraftInspector.tsx`, `spacecraft-immersion.css` e `tests-ui/spacecraft-immersion.test.mjs`.

### Percurso observado no navegador

- Cerrado: configuração inicial em contatos longos entregou 6/6. Rever a primeira entrega em T+93:07 mostrou somente um registro recebido na cena e a comparação aguardou o segundo período.
- Bennu: a configuração inicial entregou 2/6. Alterar somente o serviço de solo para contatos ampliados entregou 6/6; a opção muda agenda e custo conjuntamente, mantendo rádio e instrumento.
- Webb: a configuração inicial com espectrômetro e energia compacta parou em T+10:00 por descarga insuficiente. Ampliar energia e contatos excedeu o envelope de massa/orçamento; selecionar o lançador científico permitiu uma tentativa com 6/6 válidos. A sequência mostra que resolver um recurso pode exigir rever outro segmento.

Este percurso inicial foi observado na R19 pública para localizar problemas. Na candidata R20 local, a conferência visual confirmou os focos de comunicação e energia em Bennu, uma execução com 6/6 e a distinção explícita entre resultado final e T+0; a explicação dos bins e a incompatibilidade da câmera no Webb; e o ensaio Cerrado 2/0 com retorno de foco ao hangar ao copiar A. O pitch foi percorrido nas sete cenas, com tabela de incertezas, comparação 2→6, papéis, relógio, notas, teclado e modo de movimento reduzido. As cenas de leitura e A/B foram conferidas a 390 px, sem transbordamento horizontal. Não foram observados erros de console nessas ações.

## Divisão para os dois desenvolvedores

Os caminhos seguintes são relativos a `experiments/mission-design-lab/`.

| Responsável | Código | Contrato de continuidade |
| --- | --- | --- |
| Dev A · ciência e simulação | `src/lab/scientific-expeditions.ts`, `src/lab/mission-curriculum.ts`, `src/lab/spacecraft-presentation.ts`, arquivos científicos | Manter unidades, IDs e fontes. Os textos de consequência devem acompanhar as capacidades do catálogo. Não alterar dados científicos para recompensar uma decisão de engenharia. |
| Dev B · percurso e apresentação | `src/ui/ScientificExpedition.tsx`, `Workbench.tsx`, `MissionControl.tsx`, `scientific-missions.css` | Escolha → foco correto, explicação próxima e retorno de foco. Separar resumo final de leitura do instante. Não executar o projeto ao aplicar um exemplo. |
| Revisão conjunta | `tests-ui/scientific-missions.test.mjs` e percurso no navegador | Conferir as três missões, alteração de instrumento/energia/solo, inspeção manual, reprodução temporal, origem dos registros e próxima decisão. |

As cenas 3D usam a propriedade existente `inspectSubsystem`. Nenhum contrato de projeto, replay ou arquivo científico precisou mudar por estas correções. A primeira tentativa continua livre: uma hipótese pode estar errada, e o relatório deve ajudar a explicá-la.

## Aceite e regressões

- Em Bennu e Webb, trocar instrumento, energia e solo destaca o sistema correspondente; a inspeção manual continua funcionando.
- No solo, ampliar contatos não passa a prometer uma antena ou taxa maior.
- O resumo final permanece rotulado quando o relógio volta ao início. A cena continua sem registros recebidos no T+0.
- Mover o relógio não declara o diário inexistente.
- Copiar A/B no Cerrado retorna ao hangar, conserva a seleção e exige previsão e execução próprias.
- Os testes DOM usam a alternativa 2D real e o motor real. Eles não comprovam renderização GPU, desempenho físico, leitor de tela ou aprendizagem humana.

A regressão concentrada em `scientific-missions.test.mjs` deve ser executada junto à suíte de UI antes de publicar. Apenas um executor deve usar a pasta temporária global da suíte por vez. O recibo da publicação registra o commit e os testes efetivamente conferidos; não atribua resultados de uma implantação anterior a uma nova versão sem verificá-la.

## Validação da candidata R20

Em 15/11/2026: **152 testes de domínio, 60 de interface do laboratório, 17 de distribuição e 24 do contexto passaram**, junto com TypeScript e compilação do laboratório. A LP passou na compilação/exportação, em **22 testes de navegador**, 4 de motor e na integridade dos 17 assets. A distribuição contém 114 documentos na biblioteca e inclui licenças e atribuição do pitch. [Recibo de revisão](https://github.com/oalexandrebelo/MISSAO-IPE/blob/main/evidence/revision-r20.json).

Para repetir: `npm --prefix experiments/mission-design-lab run verify`; depois `npm run build:beta && npm run prepare:vercel && npm run test:beta`. A preparação gera as rotas usadas no teste de distribuição. A conferência pública é posterior à implantação e usa `node scripts/verify-publication-r20.mjs <deployment-id> <commit-completo> <recibo.json>`, após conferir esses identificadores na Vercel.

Dev A mantém a correspondência entre os exemplos do pitch e `runLearningExperiment`; Dev B mantém a apresentação em `presentation/pitch/`, os controles, créditos e responsividade. O pitch adapta duas curvas da MotionMaxxing para Web Animations, sem dependência nova. Após a primeira publicação, Alexandre forneceu seu site e o brandbook do Figma. O pitch acrescenta a assinatura pessoal AB em SVG e o link alexandrebelo.com.br, preservando a marca MISSÃO IPÊ como identidade do jogo. A origem e a variante constam no guia do pitch. O próximo aceite de produto é um piloto com iniciantes humanos, registrando se conseguem explicar uma falha e justificar a segunda tentativa sem orientação.
