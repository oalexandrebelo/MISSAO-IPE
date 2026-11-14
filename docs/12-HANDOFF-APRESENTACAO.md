# 12 — Handoff da apresentação e do pacote local

**Missão Ipê — Ciência que chega · motor `0.1.1-rd` · catálogo `ipe-64-v1` · 14/11/2026.** Este documento distingue a apresentação, o demonstrador incluído nela e o jogo completo. A entrega continua sendo P&D iniciado antes da abertura local do evento. A elegibilidade competitiva não está estabelecida.

## Abrir a entrega

Extraia o ZIP inteiro antes de abrir os arquivos. Preserve `COMECE_AQUI.html` ao lado da pasta `ab-mission-ipe/`, mantendo as subpastas internas. O ponto de entrada reúne os caminhos da apresentação, do jogo e da documentação; mover apenas um HTML pode romper os links de consulta, mesmo quando seu runtime está incorporado.

Para abrir por arquivo, use `COMECE_AQUI.html`. A apresentação está em `ab-mission-ipe/presentation/Missao_Ipe_Apresentacao.html`; o jogo portátil está em `ab-mission-ipe/portable/Missao_Ipe_Local.html`. Ambos incluem seus recursos de runtime. Links para páginas oficiais são consultas opcionais e precisam de rede; não são necessários para calcular os resultados. A abertura por `file:` e as limitações de armazenamento do navegador devem ser conferidas no equipamento usado na apresentação.

Para servir o pacote completo, com Node **24 ou superior** já instalado, entre na pasta `ab-mission-ipe` extraída e execute:

```bash
node scripts/serve-presentation-kit.mjs
```

Abra `http://127.0.0.1:4174`. Esse servidor usa as bibliotecas nativas do Node e os artefatos já compilados; não exige `npm install` ou `npm ci`. O ponto de entrada servido encaminha o jogo para `dist/`, onde o cálculo usa Worker. A apresentação pode ser aberta diretamente em `http://127.0.0.1:4174/ab-mission-ipe/presentation/Missao_Ipe_Apresentacao.html`. `Ctrl+C` encerra o servidor. A variante por arquivo do ponto de entrada encaminha o jogo para o HTML portátil, que calcula na thread principal.

O comando anterior complementa o servidor original do jogo:

```bash
node scripts/serve.mjs
```

Esse segundo comando serve somente `dist/` em `http://127.0.0.1:4173`; ele não é o ponto de entrada da apresentação. Origem e porta participam do armazenamento do navegador. Se houver execuções importantes no jogo, exporte os recibos antes de trocar a origem usada.

## O papel de cada modo

| Entrada | Finalidade | O que ela permite concluir |
|---|---|---|
| Apresentação, modo **Pitch** | Sete quadros principais, incluindo abertura e fechamento, para narrativa curta | Estrutura de apresentação. O número de quadros não prova aceitação do formulário ou da candidatura. |
| Apresentação, modo **Exploração completa** | Os sete quadros e oito apêndices, com contexto, fontes e limites | Consulta e conversa mais longa; os apêndices são separados do pitch de sete quadros. |
| Demonstrador da apresentação | Alterar seis escolhas e dois cenários, executar o núcleo real e consultar o catálogo após o gate | Resultados calculados dentro das hipóteses do modelo. O roteiro guiado não é uma sessão independente de aprendizagem. |
| Jogo completo em `dist/` ou `portable/` | Previsão, justificativa, missão, eventos, redesenho, reflexão e recibos | Jornada do protótipo, com persistência local quando o navegador a oferece. |
| Documentação e evidências | Conferir decisões, fontes, comandos, hashes e limites | Rastreabilidade das alegações efetivamente verificadas. |

O **roteiro de 30 segundos em português e inglês** está em `presentation/ROTEIRO_PT_EN.md`, junto do roteiro longo/local. O guia de operação da interface está em `presentation/README_APRESENTADOR.md`. O roteiro curto deve ser ensaiado separadamente da demonstração local: escolher componentes, observar quatro execuções e abrir o catálogo toma outro tempo. Não anunciar que todo esse percurso interativo cabe em 30 segundos.

A interface e os textos visíveis dos quadros do HTML são em **português**. As notas podem ser alternadas entre português e inglês; `presentation/PITCH_EN_7_SLIDES.md` contém a versão inglesa completa dos sete quadros para preparar uma apresentação nesse idioma. Isso não torna automaticamente o HTML um deck visual em inglês. A orientação de Navigators sobre inglês deve ser confrontada com o formulário e o guia aplicáveis; os sete quadros visíveis em português não são apresentados como suficientes para a submissão global.

A orientação consultada de Navigators admite pitch de até 30 segundos ou até sete slides, contando capa e fim. O guia GO Team referido na pesquisa não pôde ser recuperado. O padrão de sete quadros reduz o conflito com a orientação disponível; a coordenação ainda precisa confirmar o formato aceito no formulário efetivo e as regras aplicáveis. O material não declara conformidade global definitiva.

Na interface, **Pitch** e **Exploração completa** alteram quais quadros participam da navegação, do contador e da impressão. As setas avançam e voltam; Home e End levam aos limites do modo. A visão geral permite escolher um quadro. Notas, impressão e tela cheia são ações explícitas. Os atalhos de navegação devem respeitar campos de formulário e diálogos, sem mudar uma escolha enquanto a pessoa interage com ela.

## Sequência da demonstração

O demonstrador começa sem resultado. Navegar pelos quadros não executa a missão nem libera automaticamente o redesenho. O botão do reparo e a enumeração do catálogo permanecem bloqueados até terem sido observadas a base curta e a tentativa com ÍNDICE isolado. Isso preserva a ordem da explicação: insuficiência de transmissão, custo de processamento e só então a combinação que resolve as duas restrições.

| Passo explícito | Resultado esperado do modelo | Interpretação |
|---|---|---|
| Base, contatos longos | **6/6**, sucesso; 1.080.000.000 bits recebidos | O volume cabe no serviço de comunicação disponível. |
| Base, contatos curtos | **2/6**, falha de entrega; 460.800.000 bits recebidos | Restam dados na fila. Esse caso não é falha terminal de potência. |
| Curto, somente ÍNDICE | Falha de **potência** aos **600 s** | O processamento aumenta a demanda instantânea além do limite da bateria pequena. Não equivale a dizer que toda a energia armazenada acabou. |
| Curto, bateria grande + ÍNDICE | **6/6**, sucesso; 360.000.000 bits; **3,5 kg**, **84 créditos** | As duas mudanças atendem juntas ao objetivo e às restrições do catálogo. |
| Consultar as 64 configurações curtas | 9 sucessos, 49 falhas e 6 inválidas; zero indeterminadas; mínimo de **duas** mudanças | A prova de mínimo vale para esse domínio fechado, tomando a configuração-base como referência. |

Os resultados são produzidos pelo mesmo código de núcleo usado no jogo, incorporado ao HTML durante o build. As constantes de hardware, janelas de contato e volumes por lote são hipóteses didáticas. Os seis registros NDVI vêm de produto MOD13Q1 histórico de 2024; a missão de 180 minutos não representa uma aquisição MODIS real por um CubeSat.

Em uma futura pesquisa com participantes, use a jornada do jogo, preserve a primeira previsão e registre a ajuda recebida. Mostrar o reparo pelo apresentador antes da tentativa da pessoa impede tratar essa tentativa posterior como transferência sem ajuda. A entrega não contém estudo com participantes nem comprovação de efeito educativo.

## O que foi verificado e o que precisa de ensaio

O recibo específico desta camada é `evidence/presentation-qa.json`, gerado por `node scripts/test-presentation.mjs`. Ele identifica o HTML por SHA-256, horário, comandos, verificações aprovadas ou falhas e adaptadores do ambiente. Esse recibo deve acompanhar exatamente os bytes usados na demonstração; um novo build pede nova execução dessa checagem.

A rodada final concluiu em **14/11/2026, 10h52min13s UTC**, com **25 verificações aprovadas e zero falhas**, usando Node `v24.22.1` e jsdom. O HTML testado tem **139.710 bytes** e SHA-256 `4f9fe6084bdac407acf466720b567e66ba7787e84c2d5d812531d35ba7a97774`. A mesma suíte foi reexecutada uma vez após o ajuste do rótulo SVG e do CSS para baixa altura, sem ampliação dos testes. Foram conferidos 17 links para arquivos locais e duas âncoras internas; os três JSONs incorporados conservaram os bytes originais. Nenhuma tentativa de rede ou erro JavaScript foi observado nas interações exercitadas.

O cronômetro foi iniciado explicitamente e avançado 61 segundos por relógio controlado no teste. Ele pausou ao fechar as notas, ocultar o documento e imprimir, sem mudar quadro, configuração ou resultado. A seleção de uma célula e a aplicação da testemunha carregaram um projeto pendente, exigindo nova execução. A integridade dos oito módulos de núcleo/dados conferidos manteve os hashes do gate anterior. Esses resultados qualificam contratos de DOM e integração; continuam sem qualificação a experiência nativa de navegador e a aprendizagem.

| Camada | Evidência e alcance |
|---|---|
| Apresentação compilada | **25/25 verificações novas aprovadas**: estrutura dos sete quadros, troca de modo, navegação, controles, gate, casos numéricos, trace, catálogo, cronômetro e referências em **DOM simulado**. |
| Runtime local da apresentação | Inspeção de recursos incorporados e ausência de chamadas de rede; guardas observam tentativas de rede durante o DOM simulado. Isso não substitui a abertura fria offline no navegador-alvo. |
| Núcleo e app anteriores | Os recibos históricos registram **51 testes Node**, **9 contagens TAP de DOM simulado** e **8 casos HTTP**. Eles não foram somados ao QA novo nem apresentados como nova execução. |
| Servidor do pacote | Smoke HTTP específico sob coordenação do release. Requisições HTTP conferem arquivos, caminhos e cabeçalhos; não executam a experiência visual. |
| Tela cheia e impressão | O QA confere a conexão dos botões com adaptadores. A experiência nativa e a paginação impressa precisam de navegador real. |
| Visual e acessibilidade | Layout, resolução, zoom, foco nativo, leitor de tela, contraste e interação no projetor ainda exigem ensaio. |
| Mídia de submissão e IA | Apresentação e ponto de entrada identificam a ilustração assistida por IA. Capturas e vídeos do jogo precisam de conferência e identificação próprias conforme a orientação GO Team #1849. A declaração textual do pacote não certifica a conformidade de cada mídia. |
| Navegador, equipamento e persistência | Abertura por arquivo, Worker real, durabilidade/evicção do armazenamento, downloads, desempenho e equipamentos de AB permanecem sem qualificação nesta rodada. |

O ambiente de pesquisa apresentou falha fatal de socket ao iniciar Chromium; a superfície de browser também recusou explicitamente o protocolo de arquivo. Essas restrições não foram contornadas. A revisão da apresentação usa jsdom, sem browser real, GPU, proxy ou nova rota para acessar a interface. Nenhuma imagem do DOM simulado é apresentada como screenshot de navegador.

## Preflight no equipamento da apresentação

1. Extraia o ZIP completo e abra o ponto de entrada na resolução e no navegador que serão usados. Se optar pelo servidor, confira a versão do Node e use o endereço anunciado pelo comando do kit.
2. Confirme que o modo inicial é **Pitch**, com contador **01 / 07**. Percorra os sete quadros, volte ao início e abra a visão geral. Observe recortes, texto pequeno, foco visível e contraste na projeção.
3. Alterne para **Exploração completa**, confirme os 15 quadros e volte ao pitch. Abra e feche as notas. Faça uma impressão de teste do modo desejado e verifique se a saída contém somente os quadros desse modo.
4. No demonstrador, use as setas dentro dos seletores de componentes e cenário. Confirme que o campo recebe a interação e que o quadro não muda por engano. Verifique também a abertura/saída de tela cheia no navegador escolhido.
5. Execute a sequência da tabela acima. Antes da base curta e de ÍNDICE isolado, confira que reparo e catálogo estão bloqueados. Depois das duas tentativas, confira a liberação, o resultado 6/6 do reparo e as 64 configurações.
6. Feche o navegador, desative a conexão de rede e reabra a apresentação para uma verificação fria local. Use o demonstrador. Os links oficiais de consulta podem ficar indisponíveis; os resultados da simulação devem continuar calculáveis.
7. Abra o jogo completo pelo ponto de entrada e realize uma jornada: previsão, justificativa, execução, reflexão, exportação e importação do recibo. Reabra-o na mesma origem e confirme o estado que o navegador reteve. Registre qualquer falha ou limitação observada.
8. Ensaie o roteiro de 30 segundos com cronômetro separado. Reserve outro bloco para a demonstração interativa; a agenda do evento e o formulário determinam se esse bloco poderá ser mostrado.
9. Antes de usar capturas ou vídeo do jogo em uma submissão, confira a orientação aplicável de identificação de IA e aplique a marcação necessária à mídia. A cena do jogo congelado traz uma legenda conceitual sobre escala/física, sem marca visível de IA; o código e os hashes dessa versão foram preservados.

Esse preflight é uma instrução para o próximo ensaio, não uma lista marcada como concluída. Registre navegador/versão, sistema, resolução, origem, data e resultado para transformar o ensaio em evidência.

## Reproduzir somente o QA da apresentação

Com Node 24+ e as dependências de desenvolvimento já disponíveis:

```bash
node scripts/build-presentation.mjs
node scripts/test-presentation.mjs
```

O primeiro comando recompila a apresentação. O segundo lê o HTML final e escreve o recibo específico em `evidence/presentation-qa.json`. Ele não altera `src/core`, não substitui os testes da aplicação e não inicia servidor ou navegador. Se as dependências ainda não estiverem instaladas, `npm ci` exige registro npm acessível ou cache provisionado; isso é instalação de desenvolvimento, separada do uso dos artefatos já compilados do ZIP.
