# Handoff R16 — propósito, investigação e transições

Edição 0.7.0-beta.1 · 15/11/2026. Este documento descreve a implementação. O estado de publicação verificável fica em PUBLICADO.md e nos recibos de evidência da edição.

## O produto em uma frase

Uma equipe recebe uma pergunta científica, projeta uma missão para respondê-la, executa as escolhas e investiga se a evidência chegou completa e dentro de seus limites. O espaço desperta a curiosidade; a cadeia entre necessidade, escolha e resultado sustenta o aprendizado.

## Três casos com propósitos diferentes

| Caso | Quem precisa da informação | Conceito central | O que se pode concluir |
| --- | --- | --- | --- |
| Cerrado | Equipe de estudo da vegetação próxima de Rio Verde | Potência não é energia; processar menos bits pode exigir mais potência | Comparar pares de índices recebidos, com qualidade e lacunas explícitas. Não inferir a causa de uma alteração somente pelo NDVI. |
| Bennu | Equipe fictícia de levantamento da superfície | Produzir dados a bordo não equivale a recebê-los no solo | Comparar registros didáticos válidos, sem certificar um local real de pouso. |
| Telescópio | Equipe fictícia de astronomia | O objetivo determina a medição e o instrumento | Comparar intensidades sintéticas em faixas infravermelhas. Não detectar água ou vida. |

A origem científica, os roteiros e as tecnologias avaliadas estão no [documento 37](37-PROPOSTA-PEDAGOGICA-E-TECNOLOGIAS-R16.md). O [guia didático 32](32-GUIA-DIDATICO-MISSOES-3D.md) oferece o contexto completo. Dados históricos Terra/MODIS, registros sintéticos das expedições e modelos NASA são categorias diferentes.

## O que mudou nesta edição

A entrada do laboratório permite escolher o destino, ler sua pergunta e visualizar Terra, Bennu ou a referência Webb. Quatro segmentos interativos explicam usuários, lançamento, espaço e solo. A marca SVG do Projeto Ipê é mantida.

Cada missão ganhou uma introdução de propósito, um experimento guiado e uma reflexão sobre interpretação. O experimento exige previsão antes do cálculo. A e B usam o mesmo motor do jogo e mudam um único campo; a comparação final distingue registros recebidos e cientificamente válidos. A cena possui um relógio comum e usa a configuração de cada ensaio. Copiar um exemplo para o projeto exige uma ação explícita. O jogador ainda precisa justificar e executar a própria tentativa.

O enquadramento da nave usa uma transição finita de 280 ms para distância e zoom. A primeira montagem e a preferência de movimento reduzido usam enquadramento imediato. Nenhum recurso físico é interpolado pela câmera.

O portal Planet Jumping permanece independente, em um único HTML. As mídias e a marca daquela referência não foram atribuídas à NASA nem incorporadas como identidade do Ipê. Há recuperação quando o vídeo não carrega e caminhos de teclado e movimento reduzido. Leia o [documento 36](36-PORTAL-PLANET-JUMPING.md).

## Mapa para os dois desenvolvedores

| Responsabilidade sugerida | Arquivos principais | Contrato a preservar |
| --- | --- | --- |
| Dev A — ciência, simulação e conteúdo | `experiments/mission-design-lab/src/lab/mission-curriculum.ts`; `src/lab/scientific-expeditions.ts`; `src/core/engine.ts` | Experimentos chamam os motores originais; não existe física concorrente no componente visual. Preservar unidades, falhas e evidência ausente. |
| Dev B — interação, cena e apresentação | `src/ui/MissionGateway.tsx`; `MissionLearning.tsx`; `Scene.tsx`; `OrbitalScene.tsx`; `mission-gateway.css`; `mission-learning.css` dentro do laboratório | A cena apresenta configuração executada e último estado disponível no tempo selecionado. Movimento de câmera não altera bateria, fila ou recepção. |
| Ambos — integração | `Workbench.tsx`, `ScientificExpedition.tsx`, `MissionControl.tsx`; scripts de distribuição na raiz | Aplicar um ensaio altera o rascunho, não a tentativa preservada. Executar exige o fluxo normal de revisão. |

A [análise dos assets da PR](39-ATIVOS-DA-PR-E-APLICACOES.md) distingue o que a apresentação realmente carrega da biblioteca opcional. Consulte `research/pr-assets-r16.json` para o inventário e verifique o hash/head antes de importar qualquer item.

O catálogo de oportunidades está em `research/technology-opportunities-r16.json`. Reaproveitar R3F/drei já instalado. motionmaxxing foi avaliado como referência de movimento, não incluído como dependência. NASA 3D Tiles, geospatial, propagadores, Open MCT e Astro UXDS têm critérios e limites registrados; não estão integrados por apenas constarem no estudo.

## Reproduzir os três experimentos

1. Cerrado: entrar em **Projetar missão do Cerrado**, abrir **Investigar esta escolha**, prever e executar os dois ensaios. A usa BANDAS, B usa ÍNDICE; os demais parâmetros e contatos curtos são iguais. A entrega 2/6; B falha por potência aos 600 s e entrega 0/6. Selecione B e o evento chave; a leitura não deve inventar estados depois do encerramento.
2. Bennu: entrar em **Explorar missão Bennu**, abrir o experimento e comparar contato curto/ampliado. A entrega 2/6; B entrega 6/6. A taxa é 1,2 Mbit/s em ambos. Mover o relógio e alternar A/B mantém o mesmo segundo; a fila deve refletir os registros de cada ensaio.
3. Telescópio: abrir **Receber tudo é suficiente?**. A câmera recebe seis registros, mas nenhum é válido para a pergunta; o espectrômetro entrega seis válidos. O resultado físico da recepção deve continuar separado da compatibilidade científica.
4. Em qualquer caso, **Usar A/B como ponto de partida** copia somente a configuração; não gera uma missão concluída, não grava caderno nem atribui nota.
5. Execute uma tentativa própria e responda **O que você pode afirmar?**. A reflexão é um exercício formativo; não constitui avaliação validada de aprendizagem.

## Verificação reproduzível

Na raiz do repositório:

```sh
npm --prefix experiments/mission-design-lab run test
npm --prefix experiments/mission-design-lab run test:ui
npm run build:release
npm run test:context
npm run test:beta
npm run test:portal
npm run start:beta
```

Os novos contratos são cobertos por `tests/mission-curriculum.test.mts` e `tests-ui/mission-learning.test.mjs` do laboratório. Eles verificam os pares reais, mudança de apenas um fator, configuração e tempo da cena, recebimento versus validade e ação explícita de aplicação. DOM simulado não comprova GPU, layout, toque físico ou aprendizado humano. A inspeção de navegador e o manifesto remoto são evidências separadas.

## Distribuição e ambientes

- `/lab/index.html`: três missões e experimentos desta edição.
- `/campanha/index.html`: campanha de quatro níveis já publicada, preservada.
- `/planet-jumping.html`: demonstração visual sem bibliotecas externas; as mídias dependem do CloudFront indicado no briefing.
- `/docs/index.html` e `/context/research-library.html`: documentação navegável e acervo.
- O build é uma seleção explícita de arquivos públicos; não publica a raiz de trabalho, credenciais ou fontes privadas.
- A permissão de mídia externa do portal deve ser restrita à sua rota. O jogo continua com seus recursos locais e política de origem própria.

A limitação de armazenamento compartilhado entre laboratório/campanha registrada no [handoff R15](34-HANDOFF-IMERSAO-3D-R15.md) permanece. A R16 não altera schemas de caderno. Os ensaios guiados vivem apenas na tela e não acrescentam persistência.

## Revisão da contribuição e próximos passos

A busca no repositório encontrou a PR #1, de autoria GitHub `oalexandrebelo`. A associação com Bruno ainda precisa de confirmação; a revisão não atribui autoria presumida. O [documento 35](35-REVISAO-PRS-E-DIRECAO-R16.md) registra o hash analisado, testes e observações. A PR não foi integrada por esta revisão.

Prioridade seguinte: observar pessoas iniciantes jogando. Peça uma previsão antes de cada experimento e uma explicação depois; identifique se distinguiram energia/potência, produção/recepção e imagem/espectro. Registrar resultado dessa sessão antes de ampliar animações, pontuação ou serviços externos.

Depois disso: melhorar as interpretações onde houve confusão; testar desempenho em celular real; decidir quais modelos NASA precisam de otimização; elaborar contrato de sala/reconexão antes de colaboração remota. O modo atual é solo ou equipe local de até quatro participantes. Órbita e lançamento das expedições são regras didáticas; não há navegação de voo, reserva DSN ou telemetria operacional ao vivo.
