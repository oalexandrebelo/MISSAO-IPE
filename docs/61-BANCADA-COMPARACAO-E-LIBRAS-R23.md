# MISSÃO IPÊ · bancada, comparação e Libras · R23

O laboratório propõe uma sequência para as três missões. Escolha um equipamento, examine o que ele muda na nave, preveja a consequência, execute e use os registros para justificar o próximo projeto. A revisão alterna A e B na mesma cena e no mesmo relógio simulado.

[Laboratório](https://nasa-missaoipe.alexandrebelo.com/lab/index.html) · [Roteiro do MVP](49-ROTEIRO-APRESENTACAO-MVP-R19.md) · [Verificação do domínio e Cloudflare](62-DOMINIO-E-CLOUDFLARE-R23.md)

A R23 está publicada no commit `80ce5ade8e566e3e3a6ff03ac998fff2814ac94f`. Vercel principal `dpl_JzXF1uf9fG2y4erahFjXWe1rkriJ` e LP `dpl_e9YKvrsRVoMCy5SYPo1PonHFWPx5`, ambos **READY**. [Recibo funcional](https://github.com/oalexandrebelo/MISSAO-IPE/blob/main/evidence/r23-functional-qa.json)

## Como experimentar e aprender

1. Entre por **Nome → E-mail → Tipo de missão → Play**. Na bancada, escolha o sistema antes de trocar a opção. Observe o destaque da peça e a variação de massa, créditos, capacidade de energia, geração ou memória. O cartão de impacto descreve a última troca efetiva do projeto em edição.
2. Faça uma previsão e execute A. Abra o resultado, investigue a primeira restrição ou mudança operacional e guarde o código do evento e seu T+. Volte à edição, mude uma opção, revise a hipótese e execute B. O ensaio guiado é uma alternativa reproduzível para estudar o contraste antes de criar tentativas próprias.
3. No Cerrado, use **Comparar missões** e selecione as duas execuções. Em Bennu e Webb, a comparação aparece na operação ou no retorno após a segunda execução. Selecione uma escolha alterada, alterne **A/B**, abra a primeira diferença no 3D e compare a leitura das duas tentativas no T+ comum. Volte ao início para verificar quais registros já estavam entregues naquele instante.
4. Com o relatório em mãos, registre uma conclusão, o evento ou registro que a sustenta e o próximo ajuste. A equipe pode distribuir a revisão entre lançamento, espaço, solo e usuários. Um aprendiz deve conseguir explicar de onde veio a diferença antes de ajustar outra escolha.

### Três ensaios reproduzíveis

Os valores abaixo foram recalculados localmente com `runLearningExperiment` do próprio jogo. Os pares fixam as demais seleções do ensaio. Os resultados esperados se aplicam a essas configurações.

| Missão | Mudança de A para B | O que observar no relógio e no resultado | Pergunta para o aprendiz |
| --- | --- | --- | --- |
| Cerrado | BANDAS → ÍNDICE, com bateria pequena e contatos curtos | O processador muda na nave. A alcança **2/6** válidos. A parada de B com **0/6** é o resultado esperado do ensaio: a demanda do processador excede o limite de descarga e gera `PEAK_POWER` em **T+600 s**. Examine o pico em W e a capacidade em Wh. | Por que reduzir volume pode piorar a entrega com este limite de descarga? |
| Bennu | Contatos curtos → contatos ampliados | B abre a primeira janela em **T+5100 s** e A em **T+5400 s**. O contato total planejado passa de **240 s** para **1.000 s** e a entrega de **2/6** para **6/6**. Ambas as opções usam a mesma antena didática e **1,2 Mbit/s**. O pacote de solo muda início, duração e custo. | Em que instante os conjuntos de registros começam a diferir e como a agenda contribui? |
| Webb | Câmera genérica → espectrômetro | O foco mostra a carga científica executada em cada lado. A e B recebem **6 pacotes**. O espectrômetro fornece **6 registros válidos** e a câmera genérica fornece **0** para esta pergunta. Inspecione a compatibilidade e os bins recebidos com suas incertezas. | Por que a contagem de pacotes sozinha é insuficiente para julgar o resultado científico? |

No Cerrado os pares de NDVI vêm de arquivos Terra/MODIS e a leitura comparativa depende dos dois períodos válidos. Em Bennu, o recorte são dimensões publicadas de seis rochas ou clastos. No Webb, são seis bins do trânsito de WASP‑39 b com incertezas de 1σ. A discussão deve se restringir às medidas desses recortes. Desmatamento e sua causa, composição das rochas e identificação molecular exigem evidência adicional. A nave, a agenda, os créditos, os envelopes de massa e o rádio são parâmetros do exercício. O 3D é ilustrativo e usa os estados do motor, com modelos NASA de referência quando cabíveis. [Limites didáticos](44-HISTORIAS-REAIS-E-LIMITES-DIDATICOS.md) · [Dados Bennu e Webb](45-DADOS-REAIS-BENNU-WEBB-R18.md)

## Contratos para os dois devs

| Área | Responsável | Implementação e critério de revisão |
| --- | --- | --- |
| Catálogo, ciência e tentativas | **Dev A** | `core/catalog.ts`, `lab/scientific-expeditions.ts` e `lab/mission-curriculum.ts` são as fontes de capacidades, agenda e ensaios. Confira valores, unidades, IDs, compatibilidade e limites com o motor. Use o catálogo para o rascunho e `result.config` para a tentativa executada, inclusive depois de editar ou reabrir um projeto. |
| Comparação e replay | **Dev A** | `lab/learning-comparison.ts`, `lab/mission-visual-state.ts`, `ui/CompareDialog.tsx` e `ui/ExpeditionComparison.tsx` ligam evento, escolha e cena. Compare no mesmo T+ em segundos. A leitura usa a última amostra disponível de cada tentativa, até seu encerramento. Um replay sem amostras mostra as capacidades e marca leituras temporais como indisponíveis. Investigue diferenças em T+0 e identifique o conjunto de opções quando mais de uma muda. |
| Bancada, cena, callouts e acessibilidade | **Dev B** | `ui/Workbench.tsx`, `ui/ExpeditionWorkbench.tsx`, `ui/Scene.tsx`, `ui/ConfiguredSpacecraft.tsx` e `ui/SpacecraftInspector.tsx`. A bancada projeta o antes/depois de uma escolha a partir do catálogo e do pré-voo. `getInspectionReadout` em `lab/spacecraft-presentation.ts` fornece título e unidade do callout para 3D e 2D. Os callouts exibem capacidades de projeto, enquanto ocupação, carga e transmissão vêm da amostra. O texto, a alternativa 2D e os controles por teclado devem permitir a mesma investigação. |
| Libras, dados e publicação | **Dev B**, com revisão de **Dev A** | `apps/immersive-lp/public/acessibilidade/` e `scripts/public-libras.mjs` montam o companheiro opt-in. `web/assets/analytics.js`, `scripts/public-analytics.mjs` e os builders ligam desempenho público ao domínio oficial. Dev A confere o alcance do contexto e da telemetria em `metrics/player-metrics.ts` e `server/metrics/`. Dev B verifica o comportamento publicado, o beacon e a sessão privada no novo domínio. |

Os caminhos `core/`, `lab/`, `ui/` e `metrics/` estão sob `experiments/mission-design-lab/src/`. A tabela final resume as execuções inteiras. Os cartões de instante e a nave usam `MissionVisualState`. No início, espere zero registros entregues em ambos os lados dos três ensaios. Uma janela disponível, um rádio transmitindo e um registro entregue são três estados com critérios próprios.

### Libras durante o jogo

Ative **Libras** e inspecione bancada, troca de lado A/B, evento no replay e retorno científico. O painel acompanha a interação com a página e permite **Pausar tradução**, **Repetir trecho** e **Fechar**. Mudanças rápidas são agrupadas. O avatar termina o trecho em andamento e recebe o contexto mais recente. Ao fechar, o foco retorna ao acionador. O texto continua disponível quando o serviço de tradução falha.

No laboratório a entrada do tradutor é `data-ipe-libras-context`, preenchida com explicações do catálogo e estados calculados pelo jogo, limitada a 900 caracteres. O painel privado usa uma orientação fixa. Mantenha nome, e-mail, hipótese, reflexões, credenciais e linhas do painel fora desses atributos e use dados sintéticos no QA. O iframe tem origem opaca por sandbox e o pai valida a janela de origem das mensagens. A tradução chama o serviço oficial após o opt-in. A qualidade linguística, inclusive termos de ciência e engenharia, exige avaliação por pessoas fluentes em Libras. [Acessibilidade e Libras R21](56-ACESSIBILIDADE-E-LIBRAS-R21.md)

No domínio publicado, o navegador mostrou o avatar sinalizando no portal. A ativação acompanhou a navegação até o jogo, e o trecho mudou automaticamente de **Nome** para **E-mail** com a orientação da etapa. O console registrou armazenamento indisponível no iframe isolado e bloqueio de importação opcional do PostHog pela CSP. [Verificação de Libras em produção](https://github.com/oalexandrebelo/MISSAO-IPE/blob/main/evidence/r23-functional-qa.json)

### Rive no MacBook Pro

**Aguardando arquivo ativo no Rive.app.** A consulta ao MCP do editor em 15/11/2026 retornou `activeFileId: null` e `openTabs: []`. O MVP usa a cena 3D/2D acima. A autoria, a exportação `.riv` e a integração web continuam pendentes.

1. Abra um arquivo da MISSÃO IPÊ no Rive.app do MacBook Pro e confirme o nome do arquivo ativo via `session_info`. Use um artboard próprio para o indicador de energia e enlace. Confirme a aplicação das mudanças com **End Prompt** no editor.
2. Use uma máquina de estados alimentada pela projeção do motor. O contrato proposto usa `available` e `energyFraction` para a leitura de energia e `illuminated`, `contactAvailable` e `transmitting` para o painel e o rádio. Mostre o estado neutro no rascunho ou quando faltar amostra. A transição de contato disponível para transmissão deve responder à amostra escolhida. Mova o relógio para trás e confirme que o indicador reflete a amostra anterior.
3. Verifique a máquina no editor e exporte o `.riv` real com nome de artboard, máquina e propriedades registrados no handoff. O runtime web oficial deve carregar o arquivo e o WASM sob a mesma origem e ser opcional. Valide a CSP vigente, toque, redimensionamento, movimento reduzido, liberação da instância ao sair e queda para os controles existentes se a animação falhar. A fonte dos números continua sendo o motor. [MCP do editor](https://rive.app/docs/editor/ai/mcp) · [Runtime web oficial](https://rive.app/docs/runtimes/web/web-js)

### Métricas no domínio oficial

As métricas de jogo são da API própria e do armazenamento privado. Cada execução própria recebe um identificador de tentativa e o servidor recalcula o resultado. Um reenvio usa esse mesmo identificador. O painel apresenta participação, escolhas, diagnósticos e respostas. A comprovação de aprendizagem exige observação de participantes.

A API privada publicada aceitou o cadastro sintético e três eventos de tentativa. O reenvio retornou `200` e a leitura autenticada mostrou três tentativas únicas. O recálculo do servidor produziu **92/100**, **51/100** e **92/100** para Cerrado, Bennu e Webb nas configurações do teste. A leitura administrativa sem sessão retornou `401`. [Recibo da API em produção](https://github.com/oalexandrebelo/MISSAO-IPE/blob/main/evidence/r23-production-metrics.json)

O carregador Cloudflare atua nas páginas públicas de nível superior no domínio oficial. O beacon carregou e o painel registrou **uma visita técnica** ao portal com a exclusão de bots desligada. A configuração exclui `/equipe`, `/dashboard`, `/acessibilidade` e `/api`. [Domínio e métricas Cloudflare](62-DOMINIO-E-CLOUDFLARE-R23.md) · [Dicionário das métricas do jogo](54-METRICAS-E-HANDOFF-R21.md)

## Como verificar a entrega

```sh
npm --prefix experiments/mission-design-lab run verify
npm run test:metrics
node --test tests/libras-continuous.test.mjs tests/cloudflare-analytics.test.mjs
npm run build:beta && npm run prepare:vercel && npm run test:beta
```

O executor de UI usa um diretório temporário compartilhado. Execute uma instância por vez. `equipment-workbench.test.mjs`, `mission-comparison-r23.test.mjs` e `libras-context-ui.test.mjs` cobrem deltas, foco, contexto e comparação sob JSDOM. Os testes da API verificam a origem permitida, o recálculo e o reenvio. Os testes do beacon e do companheiro simulam scripts externos. Use os recibos da revisão para registrar as suítes de fato executadas e a versão publicada.

### Verificação local do candidato

Os builds do release e da LP passaram. As suítes registraram **164/164** no domínio do laboratório, **83/83** na UI e **26/26** na API de métricas. A equipe percorreu as três missões no navegador do Codex com WebGL, em viewports desktop e móvel. O console mostrou aviso de depreciação de `THREE.Clock`.

- **Cerrado.** Contatos longos e bateria de 24 Wh entregaram **6/6** registros válidos com **91/100**.
- **Bennu.** Ampliar os contatos elevou a entrega de **2/6** para **6/6**.
- **Webb.** No lançador científico, com L2 conceitual, energia e contatos ampliados, a tentativa com câmera resultou em **0** registros válidos. O espectrômetro entregou **6/6** com **92/100**.

A inspeção móvel encontrou transbordamento no cabeçalho a **354 px**. A correção entrou em `orbit.css`. No reteste do build atualizado a **320 px**, Cerrado e Webb mantiveram documento e viewport com largura de 320 px. O teste em celular físico segue como etapa de aceite.

| Aceite | Evidência a guardar |
| --- | --- |
| Navegador desktop e celular | Registre versão, navegador e viewport. Refaça os três contrastes, teste controles e textos em retrato, gire, reduza o movimento e comute 2D/3D. Anote em qual condição viu os callouts e o foco de cada peça. Asserções de DOM cobrem o fallback; aparência WebGL e toque precisam de navegador e dispositivo. |
| Libras em serviço real | Ative por gesto, troque A/B, rebobine, pause, repita e feche. Observe trecho traduzido, ordem dos trechos e foco. Bloqueie a origem do tradutor para conferir a recuperação e preserve a legibilidade das explicações. Confirme com pessoa fluente se os sinais transmitem os conceitos. |
| Métricas privadas publicadas | Inicie uma participação sintética no hostname novo, execute, confirme recebimento e consulte o painel autenticado. Repita uma entrega de evento e confirme uma única tentativa. O acesso administrativo sem autenticação deve retornar `401`. |
| Cloudflare em produção | Confirme um único carregamento do script do beacon por documento nas páginas elegíveis, o envio de RUM e a visibilidade no painel. Repita com o beacon bloqueado e conclua o jogo. Confira a ausência do script nas rotas excluídas. |
| Aprendizagem | Peça a um iniciante que compare as duas execuções, aponte um evento ou registro e justifique sua segunda escolha sem orientação. Guarde a resposta com consentimento e registre as dificuldades observadas. |
