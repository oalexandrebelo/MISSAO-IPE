# R33 — da página principal às sete missões

## Acessos e publicação

- Principal: https://nasa-missaoipe.alexandrebelo.com/ — LP no próprio domínio, sem redirecionamento externo.
- Jogo: https://nasa-missaoipe.alexandrebelo.com/lab/index.html
- Contexto: https://nasa-missaoipe.alexandrebelo.com/documentacao
- Documentos técnicos: https://nasa-missaoipe.alexandrebelo.com/docs/index.html
- Painel privado: https://nasa-missaoipe.alexandrebelo.com/dashboard/index.html
- Apresentação: https://missao-ipe-central-ab.alexandrebelo.chatgpt.site/
- Repositório: https://github.com/oalexandrebelo/MISSAO-IPE

O recibo de produção desta rodada fica em `evidence/r33-production-publication.json`, quando confirmado. Esta seção descreve a configuração; o recibo identifica commit e verificação pública.

## O percurso que o jogador encontra

A LP explica sete destinos e separa três conjuntos históricos de dados NASA dos quatro cenários de engenharia adaptados da contribuição de Bruno. O iniciante escolhe **Jogar → Iniciar jogo → Nome → E-mail → Tipo → Play**. Na retomada, abre Iniciar jogo e Retomar jogo sem refazer o cadastro. As missões permanecem livres; não há bloqueio de níveis artificial.

Nas quatro missões de Bruno, o percurso é **briefing → hangar e loja → conferência → lançamento → transferência → coleta → recepção → relatório**. A indicação de etapa distingue atual, concluída e pendente. A loja compra unidades; Equipar as reserva para a missão. Um instrumento comprado ainda precisa ser montado. Lançar usa dois créditos e um ciclo de cada unidade; o prêmio depende da conclusão confirmada no servidor. Os créditos da carteira são diferentes do orçamento de montagem.

| Destino | Pergunta e aprendizado | Decisão que faz diferença |
| --- | --- | --- |
| ISS / Pulso Orbital | Preservar a calibração das leituras do ar | Monitor e proteção reforçada; chegar não basta se a medição perder validade |
| Lua / Eco Lunar | Relacionar hidrogênio e temperatura, sem afirmar que isso confirma gelo | LEND + Diviner, reserva para sombra e janela para os mapas |
| Marte / Horizonte Rubro | Medir o tempo local com chegada e carga compatíveis | MEDA, lançador de maior capacidade, proteção e comunicação |
| Europa / Oceano Silencioso | Combinar estrutura do gelo e materiais da superfície | MISE + REASON usam três encaixes; habitabilidade exige evidências adicionais |
| Cerrado | Interpretar vegetação e preservar lacunas | Tempo de contato muda quantos arquivos históricos MODIS chegam; NDVI não explica sozinho uma causa |
| Bennu | Produzir dados é diferente de entregá-los | Câmera, energia e contatos para seis dimensões publicadas de rochas; tamanho não prova composição |
| Webb | Escolher instrumento capaz de responder à pergunta | Espectrômetro, energia, perfil e transmissão de seis bins de WASP-39 b com incertezas |

Nas missões científicas, a hipótese vem antes da execução, e o resultado permite seguir o registro até o 3D e interpretar sua fonte. A animação representa estados do modelo didático; não é navegação ou telemetria real. As pontuações avaliam a simulação, não certificam aprendizagem.

## Correções desta rodada

1. A LP é empacotada junto ao jogo: `/` retorna HTML, recursos Next, marca e fontes na mesma origem. O hub anterior passa a `documentation.html`, acessível em `/documentacao`. O alias Vercel permanece disponível, mas não é destino da entrada principal. Canonical aponta para o domínio oficial.
2. Copy apresenta as fases reais de Bruno, os sete destinos, a função do relatório e o modo de equipe de até quatro pessoas no mesmo aparelho. Não promete multiplayer pela internet.
3. Loja: atalho **Ir à compra**, quantidade e preço antes da prévia, e seleção automática do instrumento ainda ausente ao reabrir a loja.
4. Marte e Europa orientam **Ajustar lançador**, explicando massa ou encaixes insuficientes, antes de oferecer a equipagem que ficaria desabilitada.
5. Cerrado, Bennu e Webb: **Inspecionar esta escolha na nave** reaplica o foco correto mesmo depois de explorar outra peça; **Seguir para checagem** fica junto às opções. A agenda pode ser reaberta por novo pedido explícito.
6. A/B do Cerrado só atribui diferenças a massa/custo quando os resultados realmente diferem. Na mesma nave com contatos diferentes, informa igualdade de massa e custo.
7. Compra com resposta perdida: o pedido e seu identificador são preservados em `sessionStorage` antes da rede. Na mesma aba, recarregar oferece confirmar o mesmo recibo; não reenvia sozinho nem cria novo débito. Sem armazenamento de sessão disponível, o aviso pede manter a aba aberta.
8. A 404 do domínio oficial usa a imagem local Blue Marble. O vídeo externo só é ativado na publicação alternativa da LP, evitando bloqueio pela CSP do domínio principal.

## Evidência móvel desta rodada

Percurso por CUA em viewport **390 × 844**, perfil sintético local, armazenamento de QA separado da produção. Foram concluídas as sete missões e uma oitava tentativa de contraste. `evidence/r33-mobile-journey.json` conserva resultados visíveis.

| Missão | Pontos / 100 | Registros válidos |
| --- | --- | --- |
| ISS | 92 | 6/6 |
| Lua | 92 | 6/6 |
| Marte | 91 | 6/6 |
| Europa | 92 | 6/6 |
| Cerrado, bateria 24 Wh e contato longo | 91 | 6/6 |
| Cerrado, mesma nave e contato curto | 51 | 2/6 |
| Bennu | 90 | 6/6 |
| Webb | 92 | 6/6 |

Após recarregar, retomar e abrir Meu progresso, o texto do resumo permaneceu idêntico: **8 tentativas, 7 destinos cumpridos, 29 eventos confirmados, 0 pendentes e 0 recusados**. A loja mostrou **9 créditos** e seis unidades: monitor 2/3 ciclos, LEND 2/3, Diviner 3/4, MEDA 2/3, MISE 2/3 e REASON 2/3. Inventário também foi inspecionado a 320 px, sem transbordamento horizontal. Não foram observados erros de console nesse percurso.

O contraste Cerrado foi aberto em A/B e os estados finais foram conferidos. Houve uma resposta de interpretação compatível com o critério; isso é teste técnico sintético, não resultado de aprendizagem de um participante humano.

## O que fica salvo e os limites

O resumo de tentativas e eventos é persistido para a participação identificada pelo cookie do navegador. Pontuação é recalculada pelo servidor. Carteira, reservas, ciclos, recibos e revisões são autoritativos no backend. A produção usa Blob privado; não depende da memória de uma função Vercel.

O teste HTTP R28, ampliado na R33, usa handler e motores reais em armazenamento isolado em disco, encerra o servidor e inicia outro. Recupera os resultados das sete missões, carteira e **73 eventos** do próprio cenário de teste. Repetir a última conclusão devolve o mesmo recibo e não repete prêmio, desgaste ou evento. Esses 73 eventos são uma fixture diferente dos 29 observados no navegador.

Esta rodada não cria partidas sintéticas no painel de produção: não há marcador QA que as exclua das estatísticas. A verificação pública é de acesso, artefatos e interface. O teste local reiniciado não é uma nova prova de reinício do Blob de produção.

Sem login, usar o mesmo e-mail em outro aparelho cria outra participação. Limpar cookies pode impedir retomar a antiga. O pedido incerto recuperável usa armazenamento da aba, não migra entre abas/dispositivos. Em Bennu/Webb, o pareamento e replay A/B pertencem à expedição aberta; Meu progresso guarda o resumo, não todo o estado visual de replay. Use exportação para conservar o relatório completo.

## Continuidade para os dois devs

**Dev 1 — game e interface:** componentes em `experiments/mission-design-lab/src/ui`. Contrato `inspectionRequest` reaplica foco na mesma Scene sem recriar canvas. Preservar atalhos de foco, controles HTML equivalentes ao 3D e preferência de movimento reduzido. LP em `apps/immersive-lp`; fontes, marca, textos e chamadas de ação devem manter coerência com os sete destinos.

**Dev 2 — métricas e publicação:** `BrunoInventoryController.ts`, `server/metrics`, `tests/metrics-r28-http.test.mjs`, `scripts/build-beta-site.mjs` e `scripts/prepare-vercel-static.mjs`. Não trocar IDs de recibos no retry, não confiar em saldo ou nota do cliente. Preservar assets compartilhados por comparação de bytes; conflito no build deve falhar. Não editar manualmente `vercel.json`: ele é gerado. `npm run build:release` agora compila também a LP com seu lockfile PNPM existente; sem nova dependência.

Validação R33: 180 testes de domínio, 163 de interface, 53 de métricas, 20 da distribuição e dois de política HTTP aprovados. LP: quatro testes do motor, 21 assets por hash, TypeScript e export aprovados. O navegador verificou menu móvel (Escape retorna foco) e ensaio da LP passando de 2/6 para 6/6 com Redesenhar, sem erros de console no servidor final.

Antes de publicar: domínio, UI, métricas, export/build, distribuição e regras HTTP. Depois: conferir commit READY, raiz HTTP 200 sem Location, `/documentacao`, cadastro/jogo, proteção do painel e hashes dos arquivos. Produção e QA local devem continuar separados.

Pendente: ensaio em telefone físico, testes com pessoas iniciantes, avaliação de aprendizagem das quatro missões do Bruno, e recuperação autenticada de participação entre aparelhos. O MVP jogável e os testes automatizados não substituem essas validações.
