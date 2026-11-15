# MISSÃO IPÊ — handoff do game R26

## O que esta entrega muda

ISS, Lua e Marte mantêm o motor didático `ipe-bruno-r25-v1`, a pontuação calculada no servidor e os modelos NASA. Agora o jogador guarda sua montagem por participação/missão, compara A/B na nave, acompanha a operação em eventos e discute o resultado pelos quatro segmentos. Cerrado, Bennu e Webb continuam disponíveis com seus arquivos científicos verificáveis.

O novo app de Bruno foi auditado no commit `fa18fd38439921f97286325b2bdf8c7545d7c776`. Seu código útil está em `contributions/bruno-figma`; a incorporação da fonte não equivale à migração de todas as regras para o motor oficial. A [matriz de origem](67-AUDITORIA-BRUNO-FASTMODE-R26.md) distingue as duas coisas. A antiga branch Fastmode foi incorporada pela PR #2 e não existe mais como branch remota ativa.

## Fluxo para apresentar

1. Iniciar jogo → nome → e-mail → tipo → Play; quem já participa pode retomar.
2. Escolher ISS, Lua ou Marte. Ler a pergunta científica e abrir **Como jogar esta missão**.
3. Abrir o hangar. Cada escolha destaca e altera a peça correspondente: capacidade do lançador, propulsor, banco de energia, proteção, antena e instrumento.
4. Abrir **Revisar voo e comparar A/B**. A começa como projeto padrão ou última tentativa; **Fixar montagem atual como A** define outra referência. B é a montagem em edição.
5. Usar **Ver A no 3D** e **Ver B no 3D**. A cena muda, mas a referência não altera o plano que será lançado. Fechar a comparação sempre retorna a B.
6. Comparar massa, custo, energia de coleta, enlace, chegada e registros válidos. A comparação executa o mesmo motor, sem criar uma tentativa nem somar pontos. Ao mudar várias peças, o texto avisa que a causa não foi isolada.
7. Simular. Os eventos reais do resultado calculado dirigem o Rive e o foco da nave: lançamento, transferência, coleta e recepção. Pausar/continuar, avançar evento e ir ao resultado estão disponíveis. Planos bloqueados vão diretamente ao diagnóstico. Movimento reduzido dispensa a sequência.
8. Ler produção → recepção → validade, pontuação e primeira causa. Rever lançamento, segmento espacial, segmento terrestre e equipe científica. Redesenhar conserva a tentativa anterior como A.

## O que se aprende

| Missão | Pergunta e referência NASA | Decisão que ensina | Limite da conclusão |
| --- | --- | --- | --- |
| ISS — Pulso Orbital | Monitoramento de compostos voláteis no ar da ISS | Reforçar proteção conserva a calibração, com mais massa e custo | Receber seis leituras não basta se forem incomparáveis |
| Lua — Eco Lunar | Temperatura (Diviner) e hidrogênio (LEND), LRO | Energia determina quantos registros podem ser produzidos; enlace determina quantos chegam | Temperatura e hidrogênio orientam investigação; não comprovam gelo sozinhos |
| Marte — Horizonte Rubro | Meteorologia e poeira, MEDA/Perseverance em Jezero | Lançador, prazo e proteção de entrada precedem a capacidade de medir e comunicar | Uma série local não representa todo o clima de Marte |

Os fatos e modelos têm fontes NASA no briefing. Cargas, créditos, prazos, janelas e seis registros dessas três missões são parâmetros didáticos. A geometria é ilustrativa, fora de escala e sem propagação orbital. As missões não são operações reais controladas pelo jogador.

## Contratos para dois desenvolvedores

### Dev 1 — regras, dados e métricas

- `src/lab/bruno-missions.ts`: fonte única de regras, validação e resultados. Nesta entrega não houve mudança nos números nem na versão do motor.
- `src/lab/bruno-flight-plan.ts`: comparação e leitura validada de rascunho. A e B são configurações completas; scores não são aceitos do armazenamento.
- `src/App.tsx`: registra decisão, tentativa concluída/cancelada, inspeção de comparação e leitura de papéis. Cancelamento ao sair da operação não recebe score.
- `server/metrics/model.mjs`: recalcula tentativas concluídas; o navegador não define a pontuação oficial. `server/metrics/runtime.mjs` é o bundle efetivamente utilizado pela API.
- Rascunho local em `ipe-bruno-draft-v1:<sessionId>:<missionId>`. Contém configurações e etapa, sem nome/e-mail. Retomar um relatório o recalcula sem registrar outra tentativa. Uma execução interrompida retoma no hangar; não é premiada automaticamente.
- Armazenamento local indisponível gera aviso e conserva o jogo na memória. A fila de métricas continua no fluxo existente, com reenvio e idempotência.
- Marcar um segmento como revisado mede interação declarada. Não é teste de aprendizagem nem multiplayer em rede.

### Dev 2 — experiência, Rive, 3D e áudio

- `BrunoCampaign.tsx`: briefing, hangar, operação, resultado e persistência por participação.
- `BrunoFlightReview.tsx`: tabela A/B e leitura dos quatro papéis. Todos os controles são botões/rádios HTML, utilizáveis sem arrastar.
- `BrunoHangarScene.tsx`: muda geometrias por configuração; apresenta propulsão, cone de aquisição e enlace na etapa correspondente. WebGL usa renderização sob demanda. A cena não determina a simulação.
- `MissionSequenceRive.tsx` + `public/rive/ipe-mission-sequence.riv`: contrato e autoria em [Rive R26](69-RIVE-MISSOES-R26.md). O Rive anterior permanece intacto.
- `R26MissionAudio.ts` / `R26MissionAudioControl.tsx`: sinais originais gerados localmente por Web Audio; som desligado no início, ativação voluntária, mute, limpeza e alternativa textual. Não coleta microfone nem envia áudio.
- O contexto público de Libras acompanha etapa/decisão/resultado; nome, e-mail e dados pessoais não entram no texto de tradução.

## Oportunidades avaliadas, sem promessas de integração inexistente

- [Earshot e ManimGX](68-AUDIO-ANIMACAO-E-SKILLS-R26.md): ferramentas de autoria/análise, não adicionadas ao runtime mobile. As técnicas de áudio e explicação causal foram aplicadas com APIs já disponíveis.
- Skills concretas do catálogo `awesome-gamedev-agent-skills` orientaram feedback proporcional, áudio opcional e UI acessível. Não instalamos todo o catálogo nem dependências especulativas.
- Loja, inventário de sete instrumentos, desgaste, reserva e Europa estão preservados na contribuição do Bruno. Sua migração ao jogo oficial requer um contrato versionado e recálculo no servidor, incluindo compatibilidade com tentativas existentes. Não são anunciados como regras ativas das seis missões.
- Não há comprovação de equivalência ao GMAT, certificação WCAG, validação de tradução por pessoa surda ou teste em telefone físico. O modo em equipe atual compartilha o dispositivo.

## Validação e publicação

Validação local: 171 testes de domínio, 111 de interface e 33 de métricas passaram. O build de release passou e a distribuição passou em 18/18 verificações. O primeiro teste de distribuição encontrou um link do documento Rive apontando para uma pasta de fonte não publicada; o link foi corrigido para o asset público e a suíte passou integralmente.

No navegador real, ISS entregou 6 registros/92 pontos, Lua 6/91 e Marte passou de bloqueado (529/450 kg) a 6/91 (580/680 kg). A/B alternou a nave sem modificar B; a operação pausou e avançou por coleta/recepção, e o Rive acompanhou os estados. A recarga retomou o relatório sem duplicar a tentativa. Uma saída durante a operação registrou cancelamento sem recompensa. O painel mostrou 5 tentativas, 18 eventos confirmados, zero pendentes e zero recusados. Viewports de 390 e 320 pixels ficaram sem overflow horizontal. Houve aviso de depreciação THREE.Clock; não foi observado erro de execução na sessão final. [Recibo funcional](https://github.com/oalexandrebelo/MISSAO-IPE/blob/main/evidence/r26-functional-qa.json).

A inspeção visual levou à redução do cabeçalho e ao posicionamento do Rive ao lado dele no desktop, mantendo nave e controles visíveis. O botão de áudio mantém descrição acessível sem ocupar a bancada inteira.

**Produção verificada:** código `789af317b737243afa8f928152f3e488e1e6ab5c`, com jogo e LP em READY. Treze páginas/assets corresponderam ao build local por SHA-256. A API persistiu seis tentativas sintéticas, recalculou as pontuações e aceitou reenvio sem duplicação. Comparação A/B, revisão de papéis e cancelamento ficaram registrados; visitante e jogador não acessaram a API administrativa. [Publicação e recibos](https://github.com/oalexandrebelo/MISSAO-IPE/blob/main/PUBLICADO.md).

Nunca substituir teste com jogadores por contagem de testes automatizados. Os resultados sintéticos validam o funcionamento técnico, sem provar aprendizagem humana.

Links: [jogo](https://nasa-missaoipe.alexandrebelo.com/lab/index.html), [painel privado](https://nasa-missaoipe.alexandrebelo.com/dashboard/index.html), [equipe](https://nasa-missaoipe.alexandrebelo.com/equipe/index.html), [pitch](https://nasa-missaoipe.alexandrebelo.com/presentation/pitch/index.html), [GitHub oficial](https://github.com/oalexandrebelo/MISSAO-IPE).
