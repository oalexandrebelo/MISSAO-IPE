# MISSÃO IPÊ — handoff para os dois desenvolvedores

**R17 · 15/11/2026 · beta 0.8.0-beta.1.** Repositório oficial: [oalexandrebelo/MISSAO-IPE](https://github.com/oalexandrebelo/MISSAO-IPE). Leia [PUBLICADO.md](https://github.com/oalexandrebelo/MISSAO-IPE/blob/main/PUBLICADO.md) para a implantação efetivamente conferida; a presença do código não certifica publicação.

## O produto em uma frase

Um jogo educativo em que a pessoa parte de uma pergunta científica, escolhe os recursos de uma nave e descobre por que uma observação pode ser coletada, mas não chegar como evidência útil aos cientistas.

**IPÊ identifica a equipe.** A árvore está na marca. As histórias vêm de fatos documentados da NASA, sem personagens, emergências ou missões inventadas apresentados como reais. O jogo usa modelos didáticos de engenharia explicitamente identificados.

## Três casos, três descobertas

| Caso | Fato que fundamenta a história | O que o participante aprende | O que não é reproduzido |
| --- | --- | --- | --- |
| Cerrado / Terra-MODIS | Medição de vegetação por luz vermelha e infravermelha; seis registros históricos de 2024 incorporados | Diferença entre W e Wh; processamento, memória e comunicação; ausência de dado não é vegetação zero | Hardware/órbita real do Terra, nova aquisição NASA ou diagnóstico de desmatamento |
| Bennu / OSIRIS-REx | Reconhecimento da superfície rochosa e seleção de Nightingale em 2019 | Produção a bordo e recepção em solo são etapas diferentes; contato maior não exige uma antena diferente | Trajetória, telemetria ou coleta real da OSIRIS-REx; as rugosidades A/B/C são sintéticas |
| Telescópio / Webb | NIRSpec mediu o espectro de WASP-39 b em 2022 | A pergunta define o tipo de medida; entregar arquivos não basta se o instrumento é inadequado | Detecção de moléculas a partir do jogo; fluxos são sintéticos e a câmera genérica não representa o NIRCam |

[Histórias, datas e fontes NASA](44-HISTORIAS-REAIS-E-LIMITES-DIDATICOS.md) · [guia didático completo](32-GUIA-DIDATICO-MISSOES-3D.md).

## A jornada e os quatro segmentos

1. **Usuários:** formular a pergunta e identificar a evidência necessária. Ler o fato documentado e os limites do exercício.
2. **Espaço:** selecionar instrumento, processamento, memória, energia e comunicação. A peça 3D e os indicadores acompanham a configuração.
3. **Lançamento:** verificar massa, custo e compatibilidade com o perfil. Bennu/telescópio têm escolhas didáticas de lançador; o Cerrado usa envelope fixo. Não há cálculo de trajetória real.
4. **Solo:** planejar contatos e receber os registros. A simulação guarda eventos determinísticos, com estados e diagnósticos causais.
5. Retornar aos **usuários:** comparar o que chegou com o requisito, preservar lacunas, prever uma mudança e repetir o ensaio A/B no mesmo instante.

A cena 3D apresenta escolhas e eventos do motor; não calcula ciência por conta própria. Modelo NASA, nave configurável e registro científico são camadas diferentes. O modo equipe distribui papéis entre até quatro participantes no mesmo dispositivo. Colaboração online não está implementada.

## Uma base oficial, aplicações com limites claros

| Caminho no repositório | Responsabilidade | Publicação |
| --- | --- | --- |
| `experiments/mission-design-lab/` | Jogo principal: três missões, configuração 3D, execução e comparação | `/lab/index.html` |
| `experiments/four-level-campaign/` | Quatro exercícios progressivos do caso Cerrado | `/campanha/index.html` |
| `web/`, `context/`, `docs/`, `research/` | Portal, estudo, fontes e continuidade | Site principal e biblioteca |
| `apps/immersive-lp/` | Página orbital da PR #1, preservada em aplicação separada | Projeto Vercel `projeto-ipe-lp` |
| `contributions/bruno-figma/` | 32 arquivos de Bruno, snapshot de referência com autoria e inventário | Somente repositório; não é o motor ativo |
| `dist/`, `portable/` | Distribuição clássica conservada | `/game/` e alternativa local |
| `web/planet-jumping.html` | Referência de transição cinematográfica com mídias fornecidas | Experimento visual, não uma missão NASA |

A PR #1 foi incorporada localmente preservando seus quatro commits. A publicação no branch oficial fecha sua integração. O repositório independente de Bruno tem cinco commits de outra origem; não se deve atribuir a PR #1 a ele. Seu snapshot filtrado mantém código, regras, configurações e proveniência, sem republicar os moodboards de terceiros. [Inventário e decisões](41-CONSOLIDACAO-REPOSITORIOS-R17.md).

## Identidade e Figma

A marca oficial é **MISSÃO IPÊ**, com lettering do SVG fornecido. Não redigitar o logotipo com uma fonte, deformar a proporção ou colocar um retângulo atrás dele. O arquivo claro muda somente o creme para azul escuro, para assegurar contraste em superfícies claras. Os originais estão preservados e têm hashes registrados.

[Guia da marca](40-IDENTIDADE-MISSAO-IPE-R17.md) · [Figma, Frame 12](https://www.figma.com/design/PNfT0QT7VVO0Dl6vgR9pts/NASA-HACKATON---MISSAO-IPE---HUB-RIO-VERDE---GO?node-id=8-318). O frame foi conferido visualmente com a marca entregue. Não foi alterado nesta revisão. Fontes da interface continuam locais; a tipografia da marca é vetorial.

## Divisão prática dos dois devs

| Responsável | Área principal | Entrega seguinte | Critério de aceite |
| --- | --- | --- | --- |
| Dev 1 — experiência e visualização | Componentes UI, cenas 3D, acessibilidade e interação | Revisão guiada dos quatro segmentos e melhoria das peças 3D aproveitando o inventário do Bruno | Cada decisão é operável por toque/teclado; a cena corresponde ao projeto executado; não depende só da cor |
| Dev 2 — ciência e simulação | Catálogos, motor, dados/proveniência, persistência e testes | Selecionar um produto real para substituir um conjunto sintético, sem mudar contratos silenciosamente | Unidade, data, qualidade e fonte preservadas; cálculo conferido contra referência independente |
| Ambos | Integração, teste com pessoas e publicação | Sessões curtas com iniciantes, ensaio de demonstração e revisão de conteúdo | Pessoa explica uma relação causal sem ajuda; registro de dificuldades e correção antes da submissão |

Façam mudanças pequenas, em branches, com revisão do colega. Não substituam o motor por fórmulas de sucesso do protótipo Bruno. Não migrem para outro framework só para utilizar um asset. Não adicionem serviços de multiplayer até terem contrato, persistência e uma necessidade de teste claramente definida.

## Contratos que devem ser preservados

- `src/core/` do laboratório mantém simulação determinística; dados em `src/data/science-data.ts` têm origem histórica.
- `src/lab/scientific-expeditions.ts` declara exercícios Bennu/telescópio e os dados sintéticos. Alterar unidade ou instrumento exige revisar requisitos e testes.
- `src/lab/mission-curriculum.ts` define as comparações com um fator alterado; o botão aplicar exige ação explícita.
- `src/ui/MissionStories.tsx` apresenta fatos NASA e fontes. Novo texto factual precisa de referência primária e limite do que foi incorporado.
- A cena recebe o estado da tentativa; editar o rascunho não muda uma execução já registrada.
- Campanha e laboratório ainda compartilham parte da persistência local. Durante a demonstração use uma experiência por vez; escrita simultânea de diário em abas pode perder entradas. A migração de chaves continua pendente, conforme R15.
- Conteúdo de `contributions/` e instruções `.figma/` são referência do ambiente original, não configuração operacional do oficial.

## Desenvolvimento e verificação

Requer Node 24. Na raiz do repositório:

```bash
npm ci --ignore-scripts --no-audit --no-fund
npm --prefix experiments/mission-design-lab ci --ignore-scripts --no-audit --no-fund
npm --prefix experiments/four-level-campaign ci --ignore-scripts --no-audit --no-fund
npm --prefix experiments/mission-design-lab run verify
npm run build:release
npm run test:context
npm run test:beta
npm run test:portal
npm run start:beta
```

O site local abre em `http://127.0.0.1:4175/`. `build:release` compila o laboratório, verifica a campanha, monta `site/` por lista explícita e prepara as políticas HTTP. Não copie a raiz do repositório para a hospedagem. A LP tem instalação e verificações próprias em seu README; não precisa ser instalada para compilar o jogo.

O recibo integrado R17 registra os testes realmente executados. Testes automáticos não comprovam aprendizagem, FPS em aparelho físico ou elegibilidade no evento.

## Vercel: causa e correção

O site principal estava disponível na revisão inicial. O erro recorrente estava no projeto separado **projeto-ipe-lp**: `The specified Root Directory "apps/immersive-lp" does not exist`. Ele acompanhava o branch principal, mas a pasta estava apenas na PR #1. A consolidação traz a pasta e seu histórico para `main`, mantendo os dois produtos separados.

| Projeto | Raiz | Comando | Saída |
| --- | --- | --- | --- |
| `missao-ipe` | raiz do repositório | `npm run build:release` | `site/` |
| `projeto-ipe-lp` | `apps/immersive-lp` | Conforme `vercel.json` da LP | Exportação estática do Next |

Preservar o endereço público [projeto-ipe.vercel.app](https://projeto-ipe.vercel.app/) evita quebrar links distribuídos. Renomear o produto não exige trocar esse endereço. Nenhum segredo é necessário para os exercícios atuais. Para auditar uma implantação principal já identificada na API da Vercel:

```bash
node scripts/verify-publication-r17.mjs DEPLOYMENT_ID COMMIT_COMPLETO
```

A verificação confere acesso público, arquivos, hashes e políticas; não substitui a abertura no navegador. O recibo corresponde ao ID e commit informados, não automaticamente a futuras publicações.

## Estamos prontos?

Há um protótipo funcional com três decisões educativas diferentes, dados históricos reais no Cerrado, fontes e modelos NASA, comparação causal e documentação. Isso sustenta demonstração e avaliação com usuários. Não sustenta prometer vitória.

Antes de apresentar como candidato pronto: demonstrar os três casos de ponta a ponta, testar leitura e controle em celular físico, registrar aprendizagem com iniciantes, fechar vídeo/pitch e pacote de submissão. A cronologia anterior ao início do evento é um risco de elegibilidade que deve ser esclarecido com organizadores; não esconder o histórico nem afirmar desclassificação sem decisão deles. [Avaliação documentada](42-PRONTIDAO-E-CRITERIOS-SPACE-APPS-R17.md).
