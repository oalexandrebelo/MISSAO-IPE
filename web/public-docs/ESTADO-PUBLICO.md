# Missão Ipê BETA · estado público

## Leitura atual — edição R14

**14/11/2026 · implementação R14.** O [beta atual](../lab/index.html) reúne três casos científicos: Cerrado, Bennu e telescópio. A campanha do Cerrado usa seis registros históricos Terra/MODIS; as duas novas expedições usam observações sintéticas, identificadas como didáticas. Seus domínios permanecem separados. Consulte [31 — Três missões científicas](31-TRES-MISSOES-CIENTIFICAS-R14.html) para comportamento, versões, verificações e limites.

A operação apresenta quatro segmentos: **Usuários, Lançamento, Espacial e Terrestre**. É possível revisar a missão individualmente ou com duas, três ou quatro pessoas no mesmo dispositivo. Em equipe, os quatro papéis precisam concluir a revisão antes da execução. Não há contas, salas online ou sincronização entre máquinas.

Cenas 3D e a alternativa 2D acompanham estados e eventos do exercício. Os modelos locais NASA de CubeSat, DSN, Bennu e Webb são referências visuais, com procedência em [30 — Ativos NASA implementados](30-ATIVOS-NASA-IMPLEMENTADOS.html). Não fornecem os parâmetros físicos do jogo. A posição é ilustrativa; não há cálculo de transferência para Bennu ou L2, propagação orbital ou observação real pelo Webb.

Este adendo descreve a edição de implementação. O [recibo atual no repositório](https://github.com/oalexandrebelo/PROJETO-IPE/blob/main/PUBLICADO.md) identifica a entrega efetivamente publicada e suas evidências. Aprendizagem, desempenho em dispositivo físico e elegibilidade competitiva exigem verificação própria.

## Registro histórico R6 — beta clássico

As seções abaixo preservam o estado e o planejamento da edição R6. Descrevem o [jogo clássico](../game/index.html) e seus materiais, não o conjunto de funcionalidades do beta R14. A meta de release registrada ao final continua sendo um registro histórico, não prova de entrega.

**Edição pública R6, 14/11/2026.** Este portal reúne o jogo de pesquisa existente, a apresentação interativa e a arquitetura. O núcleo científico não recebe novas funcionalidades nesta rodada.

## O que está implementado

Uma missão terrestre com seis decisões binárias e duas condições de contato. O objetivo é receber seis registros NDVI inteiros e cientificamente utilizáveis, respeitando os limites de massa, orçamento, energia e operação. Jogo, busca, replay e demonstrador da apresentação compartilham o mesmo núcleo.

O jogo servido executa o trabalho em Worker e guarda registros no navegador por IndexedDB. O arquivo portátil incorpora os recursos e calcula na thread principal. A apresentação tem sete quadros no modo Pitch e oito apêndices adicionais, com notas em português e inglês.

Não há servidor de pontuação, conta de aluno ou serviço de inferência de IA no cálculo. A hospedagem serve arquivos estáticos. A origem pública participa da identidade do armazenamento no navegador. Exporte recibos antes de mudar de domínio ou instalação.

## Origem temporal e elegibilidade

O desenvolvimento específico começou antes das 09h BRT de 14/11/2026, início local indicado pela orientação do GO Team. A elegibilidade temporal para o evento não está estabelecida. A cronologia é preservada e publicar uma BETA não regulariza esse trabalho anterior.

A lista oficial de Resources do desafio também permanece pendente de confirmação. Fontes NASA reais e referências de engenharia são documentadas, mas sua procedência não estabelece, por si só, conformidade de uso na competição. Nenhum envio de candidatura ou aprovação institucional é reivindicado pelo portal.

Consulte a [cronologia pública](../evidence/chronology.json) e a [revisão documental R5](../research/11-revisao-spaceapps-apresentacao.html).

## Limites científicos e técnicos

MOD13Q1.061 fornece dados de arquivo de 2024. O satélite didático não adquire MODIS em 180 minutos. Massas, créditos, potências, volumes de 60/180 Mbit e agenda são hipóteses versionadas do jogo. Lançador e perfil orbital permanecem fixos.

O protótipo não é software de voo, gêmeo digital validado, previsão agrícola ou qualificação de missão. Não há propagador orbital, orçamento RF completo ou ambiente térmico. Marte e EVI3 são possibilidades de pesquisa e não integram a missão implementada.

O aprendizado ainda é hipótese. Não foram realizadas sessões com participantes nesta rodada. Testes de motor, DOM e HTTP verificam suas respectivas camadas e não substituem ensaio visual, acessibilidade nativa, armazenamento ou funcionamento no equipamento de apresentação.

## Release planejada

O alvo de release é **15/11/2026 às 08h BRT**, equivalente a 11h UTC. Trata-se de uma meta condicionada aos critérios do [plano de release](15-PLANO-RELEASE.html), não de uma conclusão já alcançada.

## O que esta publicação contém

O site usa uma lista explícita de arquivos. Os documentos históricos de base R4 permanecem identificados como históricos. Alguns recibos públicos são projeções que preservam resultados e limites, sem o relatório interno completo. O [manifesto](../publication-manifest.json) lista caminho, tamanho, hash e forma de publicação de cada arquivo.

Código de repositórios privados, anexos pessoais, arquivos de ambiente, credenciais, source maps e o relatório bruto AB-R3A não fazem parte da saída estática.
