# Missão Ipê — laboratório de missões R9–R10

**Atualização R16 · 0.7.0-beta.1:** [propósito e experimentos das três missões](../../docs/37-PROPOSTA-PEDAGOGICA-E-TECNOLOGIAS-R16.md), [handoff atual](../../docs/38-HANDOFF-R16.md), [montagem 3D e handoff](../../docs/34-HANDOFF-IMERSAO-3D-R15.md), [guia didático completo](../../docs/32-GUIA-DIDATICO-MISSOES-3D.md) e [oportunidades NASA Science](../../docs/33-OPORTUNIDADES-NASA-SCIENCE.md). O restante preserva os cortes anteriores.

**Atualização R14 · 0.5.0-beta.1:** [guia atual das três missões](../../docs/31-TRES-MISSOES-CIENTIFICAS-R14.md), [modelos NASA e créditos](../../docs/30-ATIVOS-NASA-IMPLEMENTADOS.md), [recibo público](../../PUBLICADO.md). Novo domínio isolado em `src/lab/scientific-expeditions.ts`, cenas temporais e duas jornadas científicas; Cerrado mantém suas regras e persistência. Execute `npm run verify` neste diretório. O texto abaixo conserva os cortes anteriores.


**Ciência que chega.** Aplicação educacional para projetar um CubeSat fictício, executar uma missão determinística, investigar seus eventos e testar um novo projeto. A rodada R9 combina a campanha de entrega de dados históricos do Cerrado com um laboratório independente de física.

Entrega standalone experimental **0.4.0-beta.2** · motor da campanha **0.1.1-rd** · catálogo **ipe-64-v1** · revisão **R10, 14/11/2026**.

## Começar

Requer **Node.js 24 ou superior** e npm. As versões de dependências são fixadas em `package-lock.json`; `npm ci` precisa de acesso ao registro npm ou de um cache que contenha os pacotes.

```bash
npm ci
npm run dev
```

Abra o endereço local informado pelo Vite no terminal. A aplicação inicia no briefing, permite entrar no hangar e oferece **Explorar a física** como experiência separada.

| Comando | Finalidade |
|---|---|
| `npm ci` | Instalar as dependências a partir do lockfile. |
| `npm run dev` | Iniciar o servidor de desenvolvimento Vite. |
| `npm run build` | Verificar os tipos e gerar a aplicação estática em `dist/`. |
| `npm test` | Executar testes do motor, ciência, replay, armazenamento, proveniência e laboratório de física. |
| `npm run test:ui` | Executar o fluxo React em jsdom, com o motor real e a alternativa sem WebGL. |
| `npm run verify` | Executar, nesta ordem, `test`, `test:ui` e `build`. |
| `npm run preview` | Servir localmente o build de `dist/` para inspeção. Execute `npm run build` antes. |

Para conferir a entrega completa e inspecionar o build:

```bash
npm run verify
npm run preview
```

O resultado de um build local não registra uma publicação. Para distribuir a aplicação, sirva o conteúdo de `dist/` por HTTP(S), preservando seus caminhos relativos e os arquivos científicos copiados de `public/`.

A documentação pública em `public/research/` é regenerada automaticamente por `npm run build`; também pode ser atualizada por `npm run build:research`. O gerador usa a cópia local de Marked em `scripts/vendor/marked/`, sem acrescentar uma dependência npm à aplicação.

## A campanha

O objetivo é entregar **6 de 6 registros científicos válidos**, respeitando todas as condições do motor, até o fim de **180 minutos simulados**. O envelope do projeto é de **3,6 kg e 86 créditos**. Um contador 6/6 não representa sucesso quando o projeto viola massa, orçamento ou outra condição.

O jogador escolhe duas opções em cada um de seis sistemas: bateria, painel solar, processamento, rádio, memória e política de transmissão. Isso forma **64 configurações**. Os cenários têm os mesmos registros e as mesmas escolhas, com duas janelas de contato de dez minutos ou duas de quatro minutos. A configuração inicial entrega 6/6 no cenário longo e 2/6 no curto, permitindo investigar o efeito do tempo de comunicação.

A sequência de uso é **prever → executar → investigar → redesenhar**. A previsão e a justificativa são registradas antes da execução. O relatório apresenta estados de energia, fila, dados transmitidos e eventos de restrição; reproduzir ou pausar essa vista percorre resultados já calculados. A consulta às alternativas é liberada após uma tentativa própria no cenário e avalia o catálogo inteiro. Aplicar uma alternativa cria um novo projeto que exige previsão e execução.

## O que esta entrega oferece

- **Briefing e hangar:** seis subsistemas, comparação das opções, massa, orçamento e explicações de compromissos entre recursos.
- **Cena conceitual em React Three Fiber:** Terra e CubeSat, vistas por botões, pausa e alternativa 2D quando WebGL está indisponível; a montagem acompanha escolhas do projeto.
- **Relatório causal:** registros completos, dados em fila ou perdidos, energia e eventos emitidos pelo motor. Estados de sucesso, falha e projeto inválido permanecem distintos.
- **Comparação de execuções:** métricas e escolhas lado a lado, com aviso quando os cenários diferem ou várias escolhas impedem isolar uma única causa.
- **Caderno local:** rascunho e execuções em IndexedDB, diário de decisões em `localStorage`, importação e exportação de replay com validação e recálculo.
- **Proveniência acessível:** pacote histórico, recibos, datas, bandas e referências científicas; hashes conferem a identidade dos arquivos preservados.
- **Laboratório independente:** órbita circular terrestre e eclipse ideal, geração solar, capacidade de bateria para eclipse, equação ideal de foguete e enlace de rádio por Friis com latência de propagação.

As escolhas, controles e resultados científicos estão no DOM, fora do canvas. A cena e sua velocidade visual não alimentam os cálculos da campanha. Movimento reduzido e visibilidade da página são considerados pela apresentação; a verificação com tecnologias assistivas permanece parte da QA de navegador.

## Dados, hipóteses e limites

Os seis registros vêm de **Terra/MODIS, MOD13Q1 Collection 061**, obtidos como subconjuntos de três locais próximos a Rio Verde. Os compostos históricos começam em 28/08/2024 e 13/09/2024. A campanha simula processamento e transporte de arquivos já existentes; não afirma que o CubeSat adquiriu observações MODIS durante os 180 minutos.

Massas, potências, capacidades, agendas e créditos do catálogo são parâmetros didáticos. A regra de sucesso permanece 6/6. O motor distingue potência instantânea de energia armazenada, conserva bits e energia e só concede um registro científico após recepção completa e validação de qualidade.

A campanha **não oferece lançamento, órbita ou Δv configuráveis**. A cena é ilustrativa, sem representar posição, altitude ou cobertura operacional reais. O laboratório usa modelos idealizados próprios; seus controles não alteram os componentes, os contatos ou o resultado da campanha. Friis sozinho não determina bitrate ou disponibilidade de estação; a equação ideal de foguete não constitui uma trajetória de lançamento.

O funcionamento científico é local e usa o pacote de dados incluído. Persistência depende das permissões e da disponibilidade do armazenamento deste navegador. Falhas de armazenamento são comunicadas e o resultado permanece disponível na sessão. **Recarga offline a frio não foi estabelecida pela suíte automatizada.**

Este é um protótipo de P&D. Testes aprovados, dados NASA e uma partida bem-sucedida não demonstram aprendizagem, conformidade WCAG completa, validação de voo ou endosso institucional. A elegibilidade competitiva e a leitura integral dos recursos oficiais do desafio mantêm os limites documentados na pesquisa.

## Arquitetura

Aplicação cliente em **React + TypeScript + Vite**, com Three.js, React Three Fiber e Drei na apresentação. Não há serviço de backend necessário para executar a campanha.

| Caminho | Responsabilidade |
|---|---|
| [`src/core/`](src/core/) | Contratos, catálogo, aritmética racional, fluxo de potência, validação científica, motor determinístico e busca exaustiva. |
| [`src/data/`](src/data/) | Seis registros científicos compilados e identidade do pacote histórico. |
| [`src/workers/`](src/workers/) | Execução assíncrona, cancelamento, identificação e validação das respostas; caminho local alternativo usa o mesmo motor. |
| [`src/persistence/`](src/persistence/) | IndexedDB, snapshots, controle de revisão, JSON estrito, hashes e replay recalculado. |
| [`src/ui/`](src/ui/) | Briefing, hangar, relatório, comparação, fontes, cenas 3D/2D e interface do laboratório. |
| [`src/lab/physics.ts`](src/lab/physics.ts) | Modelos escalares independentes de órbita, solar, bateria, foguete e rádio; unidades fazem parte dos contratos. |
| [`src/App.tsx`](src/App.tsx) | Navegação, edição, previsão, ciclo das tentativas e coordenação de estado assíncrono. |
| [`public/data/`](public/data/) | Respostas históricas de ORNL DAAC, recibos, metadados CMR e pacote científico preservados. |
| [`tests/`](tests/) | Verificações de domínio, oracle independente, adversariais, persistência, replay, física e proveniência. |
| [`tests-ui/`](tests-ui/) | Jornadas React em DOM simulado. |
| [`docs/`](docs/) | Pesquisa, decisões, protocolo didático e evidência de QA desta rodada. |
| `scripts/build-research.mjs` e `scripts/vendor/marked/` | Geração da documentação HTML pública a partir dos textos da rodada, usando uma cópia local do conversor Markdown. |

O motor da campanha não importa React, Three.js ou o laboratório. A busca, o Worker e o replay usam a mesma entrada fechada da simulação. Um resultado executado preserva suas entradas; editar o projeto exige nova execução para produzir outro resultado.

## Verificação e documentação

Na verificação integrada R10 de **14/11/2026**, com Node v24.22.1, passaram **101 testes de domínio, física, proveniência e interpretação dos resultados, além de 9 testes UI**. A rodada inclui 30 novos testes dos refinamentos de pré-voo, requisitos e retorno científico. O build executa a verificação estrita de TypeScript. O teste UI percorreu o caso longo 6/6, o curto 2/6, a busca 64/64 e o redesign que volta a 6/6, além de importação e falha de armazenamento. As asserções anteriores foram preservadas.

O ambiente UI é **jsdom com `fake-indexeddb`**, sem GPU ou Worker real. A rota de fallback 2D foi exercitada; esses resultados não validam renderização 3D, foco modal real, teclado em navegador, leitor de tela, desempenho ou durabilidade de armazenamento. O relatório de QA separa o executado do não rodado.

| Documento | Conteúdo |
|---|---|
| [QA R9](docs/QA-R9.md) | Resultados de testes, varredura 64 × 2, integridade científica, revisão física, achados e limites da verificação. |
| [Guia didático R9](docs/GUIA-DIDATICO-R9.md) | Atividade de 10–15 minutos, previsões, contrafactuais, resultados esperados e observação da aprendizagem. |
| [Pesquisa e decisões R9](docs/PESQUISA-E-DECISOES-R9.md) | Fontes, escopo do desafio, decisões de produto, princípios científicos e recomendações de evolução. |

## Origem e integração

Esta aplicação foi construída a partir da base de `main` do repositório **[oalexandrebelo/AB-NASA-TEAM-IPE](https://github.com/oalexandrebelo/AB-NASA-TEAM-IPE)**, commit **`73162276b46227e8965eed2b91a7dc8edae70b96`**. A origem identifica o ponto de recuperação; as mudanças desta rodada são posteriores a esse commit.

O destino previsto para integração é **`experiments/mission-design-lab/`**, como experimento standalone no repositório de origem. O portal, a apresentação, o contexto e os demais materiais anteriores devem ser preservados. Este README descreve a aplicação R9–R10 e seus comandos próprios. A integração e a publicação precisam de registros próprios; sua conclusão não é presumida por este documento.

## Licenças e autoria

O código original conserva [Apache-2.0](LICENSE). React, ReactDOM, Three.js, React Three Fiber e Drei mantêm suas licenças e atribuições próprias. Consulte [NOTICE.md](NOTICE.md), [`licenses/`](licenses/) e os metadados dos pacotes instalados. `package-lock.json` registra versões e integridades da instalação.

A assistência de IA em pesquisa, implementação, documentação e testes está declarada nos avisos. Dados e referências NASA mantêm sua procedência e não implicam endosso ao protótipo.

## Verificação visual da rodada

A inspeção manual, as correções de responsividade e seus limites estão em [QA-NAVEGADOR-R9](docs/QA-NAVEGADOR-R9.md). As capturas registram o fallback 2D observado no navegador de QA.

## Refinamento com referências NASA — rodada 10

A rodada 10 acrescenta plano da missão (ConOps), revisão prévia das condições operacionais, matriz de requisitos com evidências, distinção entre operação prevista e violações, comparação de folgas e retorno científico dos pares de NDVI recebidos. O motor e o catálogo permanecem na mesma versão.

A auditoria de NPR 7123.1D, NPR 7120.5F / NID 7120.148, NPR 7120.8A e NPR 8705.4B, os limites de aplicação e as oportunidades priorizadas estão em [REFINAMENTO-NASA-R10](docs/REFINAMENTO-NASA-R10.md). O comando `npm run build` regenera o caderno de pesquisa antes da compilação.

Versão online: https://missao-ipe-orbit.alexandrebelo.chatgpt.site
