# PROJETO IPÊ — contexto e próximas etapas

Edição de 14/11/2026. Este plano atualiza a continuidade do projeto. Os documentos anteriores preservam suas datas, propostas e limites; sua republicação não transforma uma proposta em implementação.

## O propósito

Missão Ipê é um jogo educativo de engenharia de sistemas espaciais: prever, projetar, executar, investigar evidências e redesenhar. A pergunta atual é como entregar seis registros científicos válidos de vegetação do Cerrado respeitando massa, orçamento, energia, potência, memória e comunicação.

O beta 0.4.0-beta.2 está em `/lab/index.html`; a edição anterior 0.3.0-beta.1 continua em `/game/index.html`. Os dados históricos são MOD13Q1 Collection 061. O CubeSat, as peças, a agenda de 180 minutos e os créditos são um modelo didático; não são especificações de uma missão real.

## O que já existe

- Seis escolhas binárias, 64 configurações e dois cenários de contato.
- Objetivo, conceito de operações, hipótese antes da execução e revisão pré-voo.
- Motor determinístico separado da cena 3D; fila, balanços, eventos e requisitos com evidência.
- Retorno científico condicionado à entrega integral dos registros, comparação de tentativas e replay recalculado.
- Laboratório de física, biblioteca de pesquisa, PRD, PRT, fluxogramas Mermaid, contrato Prisma proposto e pitch.
- Persistência no navegador. Não há conta, banco remoto, sincronização entre dispositivos ou telemetria NASA ao vivo.

## Quatro níveis narrativos

| Nível | História e aprendizado | Estado | Como demonstrar |
| --- | --- | --- | --- |
| 1 — Semente | A equipe recebe uma pergunta sobre o Cerrado e prepara a primeira missão. Distinguir objetivo científico de escolha de peças. | Cenário de contatos longos já disponível; identidade narrativa proposta. | Configuração inicial entrega 6/6; jogador explica a finalidade e os limites. |
| 2 — Raízes | As janelas de comunicação ficam menores. A equipe precisa redesenhar sem perder a ciência. | Cenário curto e comparação já disponíveis; progressão narrativa proposta. | A base entrega 2/6; bateria maior e processamento ÍNDICE entregam 6/6 dentro dos limites. |
| 3 — Copa | A nave precisa decidir quando proteger-se, guardar dados e retomar a operação. | Planejado. | Evento histórico identificado, resposta determinística, evidência da recuperação e impacto didático declarado. |
| 4 — Horizonte | A equipe leva seu método a um pequeno corpo e compara janelas de lançamento e objetivos. | Planejado. | SBDB + Mission Design + Horizons com unidades e procedência; cenários reprodutíveis e física revisada. |

Os quatro níveis não estão implementados como uma campanha desbloqueável. Os dois primeiros reaproveitam cenários existentes; os demais dependem das etapas seguintes.

## Etapas com critérios de saída

### 1. Consolidar e publicar a base

Entrega: código completo da aplicação, documentos, portal interativo e beta reunidos no PROJETO-IPE e na Vercel. Critério: build reproduzível, testes existentes aprovados, navegação conferida e URLs verificadas. A publicação externa só deve ser considerada concluída após confirmação remota.

O histórico Git privado, anexos pessoais, relatório bruto de análise e vínculo da hospedagem anterior permanecem no repositório de origem. Não são dependências do produto público. O novo repositório tem histórico próprio, preservando seu commit inicial e registrando a origem.

### 2. Validar o aprendizado e o uso

Entrega: roteiro de observação com jogadores, revisão da linguagem, teclado e celular. Dependência: base publicada. Critério proposto: testar com pelo menos cinco pessoas, observar se distinguem energia de potência, memória de transmissão e qualidade de origem de entrega científica; registrar erros de compreensão e corrigir os mais frequentes. Testes automatizados não comprovam aprendizagem.

### 3. Refinar conteúdo e progressão

Entrega: narrativa Semente/Raízes, fichas de componentes e feedback ancorado em NASA Systems Engineering Handbook, Basics of Space Flight e State-of-the-Art Small Spacecraft Technology. Dependência: observação da etapa 2. Critério: cada afirmação técnica tem fonte e cada simplificação do jogo está identificada; a progressão não depende apenas de clicar em “próximo”.

### 4. Preparar dados externos reprodutíveis

Entrega: coletor de dados fora do navegador, manifestos e snapshots versionados. Dependência: contrato de dados e seleção dos alvos. Critério: registrar URL, parâmetros, data de coleta, versão, unidades, referencial, incertezas e hash; tratar ausência de dado e indisponibilidade; consultas JPL sequenciais, com cache e recuo. Não há coletor novo implementado nesta publicação.

### 5. Prototipar Copa e Horizonte

Entrega: evento DONKI histórico opcional e uma campanha limitada de pequenos corpos. Dependência: etapa 4 e revisão do modelo físico. Critério: separar observação real de consequência educativa; comparar cenários independentemente da animação; funcionar sem consulta externa durante a partida após carregamento dos arquivos. Pouso planetário, telescópios e dez destinos heterogêneos ficam para depois.

### 6. Preparar a demonstração e a entrega do desafio

Entrega: percurso curto de demonstração, pitch, fontes e declaração do uso de IA. Critério: confirmar página oficial, regras, calendário e elegibilidade do trabalho prévio com a organização; demonstrar uma falha explicável e um redesenho bem-sucedido. Não há afirmação de inscrição, elegibilidade ou avaliação oficial concluída.

Não há execução automática agendada por este cronograma. A meta histórica de 15/11/2026 às 08h BRT é uma meta interna, não um prazo confirmado do evento.

## Arquitetura de continuidade

Hoje: arquivos científicos locais → motor determinístico em TypeScript/Worker → interface React → relatório e replay no navegador. Three.js/R3F apresenta a cena, mas não decide o resultado da simulação.

Depois: APIs oficiais → coleta sequencial no servidor ou processo editorial → validação e arquivo versionado → mesma aplicação estática. Um cache compartilhado só será necessário se houver atualização dinâmica; memória de função serverless não garante persistência entre instâncias. Prisma continua sendo um contrato de evolução, sem banco implantado nesta entrega.

## Materiais para seguir

- [Pesquisa de APIs e oportunidades NASA](21-OPORTUNIDADES-NASA.md).
- [Contexto histórico e cronograma detalhado](../context/index.html).
- [Biblioteca integral, incluindo PRD, PRT e fluxogramas](../context/research-library.html).
- [Apresentação e pitch](../presentation/Missao_Ipe_Apresentacao.html).
- [Código, schema Prisma e instruções de execução](https://github.com/oalexandrebelo/PROJETO-IPE).
- [Página oficial indicada para o desafio](https://www.spaceappschallenge.org/2026/challenges/space-mission-design-game/).
