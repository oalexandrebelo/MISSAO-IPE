# Missão Ipê · guia do apresentador

Abra `Missao_Ipe_Apresentacao.html` em um navegador atual. O arquivo contém a apresentação, os registros científicos, o motor do jogo e a busca. Ele não precisa de instalação, CDN, fonte remota ou conexão para calcular. O resultado é um protótipo de pesquisa, identificado em todos os quadros.

O modo inicial **Pitch** contém sete quadros. **Exploração completa** oferece os mesmos sete quadros e oito apêndices. A escolha do modo controla o índice, os limites de navegação, o contador e os quadros incluídos na impressão. O formato de sete quadros é uma decisão editorial informada por orientações de Navigators. A aceitação de HTML, o formulário vigente e o guia oficial não foram confirmados. O HTML está em português, com notas de fala em português e inglês. A [copy inglesa dos sete quadros](PITCH_EN_7_SLIDES.md) acompanha o pacote para preparar a tradução/exportação. Nenhum desses arquivos é apresentado como submissão aprovada.

## Arquivos e caminhos

| Arquivo | Uso |
|---|---|
| `Missao_Ipe_Apresentacao.html` | Apresentação completa e demonstrador autocontido. |
| `ROTEIRO_PT_EN.md` | Falas preparatórias de aproximadamente 30 s e roteiro longo da conversa local. |
| `PITCH_EN_7_SLIDES.md` | Texto inglês completo dos sete quadros, separado da interface em português. |
| `src/template.html`, `src/styles.css`, `src/main.ts` | Fontes editáveis da apresentação. |
| `tsconfig.json` | Verificação de tipos da apresentação e imports do núcleo. |
| `../scripts/build-presentation.mjs` | Build IIFE do HTML, usando o motor real. |
| `../evidence/presentation-build.json` | Hash, tamanho, entradas, modos e limites do build. |
| `../evidence/presentation-qa.json` | QA automatizado independente do artefato compilado. |

Para **Abrir o jogo local**, preserve `presentation/` ao lado de `portable/`. Para o **Dossiê de base R4**, preserve `output/pdf/`. O dossiê PDF conserva o corte anterior. A revisão documental desta rodada está em [research/11-revisao-spaceapps-apresentacao.md](../research/11-revisao-spaceapps-apresentacao.md). Todos os links continuam relativos à raiz do projeto dentro do ZIP.

Se o HTML for copiado sozinho, a apresentação e o demonstrador continuam incorporados. Links para o jogo, PDF, guias e evidências exigem o ZIP completo. Os três JSONs originais A/B/C também estão incorporados para download no apêndice de fontes. Outros links externos só precisam de rede quando a pessoa decide abri-los.

## Navegação e apresentação

| Controle | Ação |
|---|---|
| `←` / `→`, Page Up / Page Down | Quadro anterior/próximo. |
| `Espaço` | Próximo quadro, quando o foco não está em um controle interativo. |
| `Home` / `End` | Primeiro/último quadro do modo ativo. |
| `O` ou **Índice** | Abre o índice do modo ativo. `Esc` fecha. |
| `N` ou **Notas** | Abre/fecha as notas PT/EN e o cronômetro de ensaio. |
| `F` ou **Tela cheia** | Solicita fullscreen por ação explícita. |
| **Imprimir** | Abre a impressão nativa dos sete quadros do Pitch ou dos 15 da Exploração. |

Inputs, selects, caixas de texto e conteúdo editável mantêm suas próprias teclas. O índice contém uma contenção de foco e devolve o foco ao botão que o abriu. O HTML respeita `prefers-reduced-motion`. Não há avanço automático de quadros nem animação física contínua.

As notas são um painel na própria página e **ficam visíveis na projeção**. Para notas privadas, use outra janela em outra tela. Não existe sincronização remota entre essas janelas. O painel avisa quando a nota do facilitador contém a solução.

O cronômetro só começa ao pressionar **Iniciar cronômetro**. Ele pausa ao fechar as notas, ocultar a aba, imprimir ou sair da página. Ele não muda a configuração, não executa o motor e não avança a apresentação. A preferência de idioma pode ser guardada em `localStorage`, mas falhar esse armazenamento não impede a apresentação. A indisponibilidade de fullscreen mostra uma mensagem e mantém a janela utilizável.

## Demonstração com o motor real

No quadro 5, use os casos numerados ou escolha manualmente os sete campos: condição de contato e seis decisões. **Alterar uma entrada invalida o resultado anterior.** Os estados de sucesso/falha/invalidade só aparecem após uma nova execução do núcleo. A energia exibida é a energia final, em Wh. A carga de trabalho mostra a demanda configurada para processar, em W. O trace mostra a carga efetivamente executada em cada estado, que pode ser zero após uma interrupção.

| Caso | Resultado esperado no contrato atual |
|---|---|
| 1. Base longa | Sucesso, 6/6, 1.080 Mbit recebidos. |
| 2. Base curta | Falha de entrega, 2/6, 460,8 Mbit recebidos e 619,2 Mbit na fila. |
| 3. Só ÍNDICE, contato curto | Falha de potência aos 600 s, 0/6. A bateria ainda guarda aproximadamente 13,96 Wh. |
| 4. Duas mudanças | Bateria 24 Wh + ÍNDICE, sucesso, 6/6, 360 Mbit recebidos, 3,5 kg e 84 créditos. |

O quarto botão e a busca ficam bloqueados até observar a execução da base curta e a alteração isolada para ÍNDICE. Esse gate vale tanto para presets quanto para seleção manual seguida de execução. Abrir o quadro ou trocar um seletor não libera a solução. O gate existe apenas na memória da sessão e reinicia ao recarregar o HTML. As notas e apêndices são material do facilitador e podem conter a explicação.

No quadro 6, **Enumerar 64 configurações** executa a mesma busca do jogo. O resultado do cenário curto é 9 sucessos, 49 falhas, 6 inválidas e 0 indeterminadas. O mínimo de duas alterações só aparece quando a enumeração é completa. A solução é única a essa distância dentro do catálogo. A grade permite inspecionar cada configuração. Clicar numa célula ou em **Experimentar a solução** carrega as escolhas no demonstrador como pendentes, sem executá-las automaticamente.

Cada célula contém `S`, `F` ou `I` além da cor. Receber seis registros não elimina uma restrição de massa ou créditos. A classificação apresentada vem do `outcome` do motor, e não de uma comparação isolada da contagem de entrega.

## Ciência, autoria e estado

Os seis registros são MOD13Q1.061 históricos de 2024. As composições têm 16 dias, os pontos são coordenadas solicitadas e o CubeSat didático não adquire MODIS em 180 minutos. Lotes lógicos de 60/180 Mbit, recursos e agenda são hipóteses do jogo. Não se trata de previsão agrícola ou software de voo qualificado.

O desenvolvimento específico começou antes do início local oficial do evento. A elegibilidade temporal não está estabelecida e a lista oficial de Resources do desafio permanece pendente. A apresentação preserva essas informações no cabeçalho, encerramento e metodologia. Não houve aprovação NASA/Black Star nem envio por esta entrega.

Pesquisa, redação, código, testes e SVGs originais tiveram assistência de IA. A ilustração conceitual da capa tem a indicação visível “Ilustração gerada com IA”. Gráficos científicos derivam dos registros reais e os de missão derivam do modelo didático. Não atribuir origem sintética aos dados NASA. A identidade do projeto não usa logotipos institucionais como endosso. Marte é expansão não implementada e não compõe a missão funcional.

## Reconstruir e verificar

Dentro da raiz do projeto, com as dependências do repositório já instaladas:

```bash
node node_modules/typescript/bin/tsc --project presentation/tsconfig.json
node scripts/build-presentation.mjs
node scripts/test-presentation.mjs
```

O build verifica a presença dos imports do motor e da busca e rejeita dependências de `node_modules` no runtime da apresentação. Não é necessário instalar dependências para abrir o HTML já compilado.

O recibo de QA informa os checks realmente executados. A validação DOM não renderiza a página como um navegador real. Ainda é necessário ensaiar a abertura por arquivo, fullscreen, paginação de impressão, contraste, foco, legibilidade e comportamento no equipamento de apresentação. Nenhuma inspeção visual bloqueada foi contornada, e não há alegação de benchmark no computador de AB.
