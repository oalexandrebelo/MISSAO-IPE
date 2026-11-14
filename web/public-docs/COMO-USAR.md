# Como usar a BETA

## Beta atual — edição R14

Abra o [beta atual](../lab/index.html) e escolha **Cerrado**, **Bennu** ou **Telescópio** no briefing. Leia a pergunta científica e a origem dos dados: Cerrado usa arquivos históricos Terra/MODIS; Bennu e telescópio usam observações sintéticas do exercício.

- **Cerrado:** siga Briefing → Projetar → Sala de missão. Configure a nave, registre sua hipótese e revise antes de executar.
- **Bennu ou telescópio:** percorra Necessidade → Requisitos → Projeto → Verificação → Operação → Retorno científico. Escolha as seis opções, escreva uma hipótese e execute após a revisão.
- **Participação:** use o modo individual ou reúna duas, três ou quatro pessoas no mesmo dispositivo. Em equipe, conclua as quatro revisões de papéis. Alterar escolhas, hipótese ou participantes exige nova revisão; não há colaboração remota.
- **Operação:** selecione eventos e instantes; alterne entre Usuários, Lançamento, Espacial e Terrestre. A cena mostra o estado registrado. Reproduzir a linha do tempo não recalcula a missão.
- **Retorno:** interprete os registros recebidos integralmente e válidos. Nos dois novos casos, registre sua reflexão, exporte o relatório e crie uma nova tentativa para comparar os resultados.

Nas novas expedições, **salve o projeto e exporte os relatórios antes de sair**. As tentativas e comparações ficam na sessão: sair ou recarregar não preserva automaticamente esse histórico. O projeto salvo guarda escolhas e hipótese no navegador; importá-lo exige executar novamente. O relatório exportado não é um replay verificado do motor clássico.

Os modelos NASA são referências visuais, e a posição é ilustrativa. A alternativa 2D permite acompanhar a cena sem WebGL. O pacote portátil clássico descrito abaixo não contém as novas expedições. O [guia de implementação R14](31-TRES-MISSOES-CIENTIFICAS-R14.html) detalha os percursos, os limites e a continuidade.

## Materiais clássicos

As seções seguintes descrevem o jogo clássico, sua apresentação e o pacote portátil. Esses materiais preservam suas próprias versões; o ponto de entrada para os três casos atuais é o beta indicado acima.

## Jogo

Abra o [jogo](../game/index.html), escolha a condição e configure seis decisões. Registre uma previsão, execute e inspecione o resultado e seus eventos. Alterar escolhas exige uma nova execução. O objetivo inclui seis registros utilizáveis e todas as restrições do modelo.

O jogo servido utiliza um Worker. Registros locais pertencem ao navegador e à origem usada. Exporte recibos antes de trocar de domínio, navegador ou instalação. Falha de armazenamento não deve ser confundida com resultado físico da missão.

## Apresentação

A [apresentação interativa](../presentation/Missao_Ipe_Apresentacao.html) contém sete quadros de Pitch e oito apêndices em Exploração completa. Use setas ou os botões da página. O índice permite saltar entre quadros. As notas têm texto PT/EN e são visíveis na própria tela.

O demonstrador usa o mesmo motor do jogo. O quarto caso e a busca abrem depois da base curta e da troca isolada para ÍNDICE. Nenhum cronômetro escolhe configurações ou avança decisões.

## Arquitetura

O [mapa Archify](../architecture/index.html) mostra os componentes implementados e suas relações. Ele serve para inspecionar o projeto, sem receber ou alterar o estado das partidas.

## Uso local

O [HTML portátil do jogo](../portable/Missao_Ipe_Local.html) reúne código, estilos e dados. Salve-o para a alternativa de uso sem conexão. Essa variante calcula na thread principal. O ensaio de abertura por arquivo e armazenamento deve ser feito no equipamento escolhido.

A apresentação também é autocontida para exibição e cálculo, mas seus links para jogo, documentos e evidências precisam da estrutura completa do pacote ou do portal público. O arquivo isolado não inclui o PDF histórico.

## Histórico e evidências

O [PDF de base R4](../output/pdf/AB_Missao_Ipe_Dossie_Implementacao.pdf) e o [estudo integral de base R4](../output/html/AB_Missao_Ipe_Estudo_Integral.html) são documentos históricos. A revisão R5 e a documentação R6 acompanham a evolução. Não tratar uma meta antiga como medição concluída.
