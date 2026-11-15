# MISSÃO IPÊ · kit da pré-banca local

A entrega apresenta um jogo de design de missões espaciais: o participante escolhe uma pergunta científica, projeta a nave, faz uma previsão, executa o modelo, investiga a evidência e redesenha a missão. A equipe está vinculada ao desafio **Space Mission Design Game**, em **Rio Verde, Brasil**, na [página oficial do Space Apps](https://www.spaceappschallenge.org/2026/find-a-team/missao-ipe/?tab=details), conferida em 15/11/2026.

## O que levar

| Entregável | Material | Conferência antes de entrar |
| --- | --- | --- |
| Pitch oral de 3 minutos | [Fala integral e tempos](53-PITCH-JURADOS-E-FALA-R21.md) | Alexandre ensaia em voz alta no equipamento, com as pausas e cliques. |
| Até 7 slides | [Pitch interativo, 6 cenas](../presentation/pitch/index.html) | Abertura 20s; problema 30s; solução 40s; demo 50s; validação 25s; fechamento 15s. |
| MVP/demo | [Jogo de três missões](../lab/index.html) | Percorra Nome → E-mail → Tipo → Play antes da banca; escolha Bennu e deixe o experimento guiado aberto. |
| Evidências: número + aprendizado | [Recibos no GitHub](https://github.com/oalexandrebelo/MISSAO-IPE/tree/main/evidence) e [painel privado](../dashboard/index.html) | Diferencie teste automatizado, inspeção do protótipo e teste com participantes. |
| Acessos e continuidade | [Central da equipe](../equipe/index.html) e [handoff de dois devs](54-METRICAS-E-HANDOFF-R21.md) | Compartilhe os links públicos. A chave do painel é entregue separadamente ao responsável. |

## Uma história científica, três perguntas

A história não depende de personagens ou descobertas inventadas. Ela acompanha a transformação de uma necessidade científica em dados utilizáveis. A marca IPÊ identifica a equipe; a árvore não é uma narrativa científica.

**Cerrado — Como comparar a vegetação em dois períodos?** A base são arquivos históricos Terra/MODIS. O jogador escolhe entre transmitir as bandas ou calcular o índice a bordo. No ensaio guiado, produzir um arquivo menor exige um pico de potência maior: em T+10 min, a bateria ainda guarda energia, mas não consegue entregar a potência exigida. A conclusão é sobre o sistema completo e sobre as lacunas do conjunto recebido, sem atribuir automaticamente a causa de uma mudança de vegetação.

**Bennu — Como tornar observações da superfície disponíveis aos cientistas?** A base são dimensões publicadas de seis rochas/clastos observados pela OSIRIS-REx. O jogador compara serviços de contato com a mesma antena e taxa de rádio. Arquivos produzidos a bordo não equivalem a arquivos disponíveis no solo. O tamanho recebido permite comparação geométrica; não certifica origem, composição ou segurança de pouso.

**Webb — Qual instrumento permite responder à pergunta sobre a luz?** A base é um recorte publicado do espectro de WASP-39 b com incertezas. Câmera genérica e espectrômetro podem entregar seis pacotes; somente o instrumento compatível atende à pergunta do exercício. Seis faixas não reproduzem a análise molecular completa nem demonstram vida.

[Fontes, seleção de dados e limites didáticos](45-DADOS-REAIS-BENNU-WEBB-R18.md).

## Demonstração principal, em 50 segundos

1. Mostre a pergunta de Bennu e o rádio de 1,2 Mbit/s.
2. Selecione A: em T+85 min, a nave aguarda contato; ao final, 2/6 registros válidos chegam.
3. Pergunte o que muda se o contato abrir antes e durar mais. Faça uma pausa curta.
4. Selecione B: no mesmo T+85 min, a nave transmite; ao final, 6/6 registros chegam. O serviço custa seis créditos a mais. A antena e a taxa são iguais.
5. No laboratório, mostre que o registro recebido leva ao evento e ao componente no 3D. Use esse percurso para as perguntas da banca; não tente percorrer três missões completas nos 50 segundos.

O pitch alterna capturas identificadas do replay para a apresentação ser previsível. O laboratório executa a simulação e permite navegar pela evidência. Não apresentar as capturas como uma execução ao vivo. Não foi produzido um vídeo novo nesta entrega; o MVP atende à alternativa “protótipo funcionando”.

## Evidência: número acompanhado de significado

| Verificação | Número observado | O que aprendemos sobre o protótipo |
| --- | --- | --- |
| Percurso local de jogador | 3 tentativas próprias; 8 eventos confirmados; 0 pendentes e 0 recusados | O cadastro, as decisões, os resultados e o envio ao painel completaram o percurso integrado em ambiente local. |
| Cerrado, ensaio A/B | 2 registros válidos com bandas; 0 com índice nessa configuração | Menos dados não garante melhor missão: a potência instantânea pode interromper a tarefa. |
| Bennu, ensaio A/B | 2/6 → 6/6 válidos, com o mesmo rádio | Agenda e duração dos contatos alteram a evidência recebida. |
| Webb, ensaio A/B | 6 pacotes recebidos em ambas; 0 → 6 válidos | Transporte bem-sucedido não torna o instrumento adequado à pergunta. |
| Tentativa Webb incompatível | 3,2 kg para limite de 3 kg; 87 créditos para orçamento de 80 | Entrega científica e viabilidade da arquitetura precisam ser avaliadas separadamente. |

As quantidades acima são verificações técnicas do modelo e de um participante sintético de teste. Não são tamanho de amostra de usuários nem comprovação de ganho de aprendizagem. Os recibos da publicação distinguem os testes locais da validação HTTP de produção.

## Pontuação e administração da missão

A rubrica do jogo soma até 100 pontos: **60** proporcionais aos registros científicos válidos recebidos, **30** por um projeto compatível com os requisitos iniciais e **10** pela folga média de massa e orçamento. Um projeto incompatível não recebe os pontos de compatibilidade ou folga. A pontuação não substitui os requisitos: o resultado ainda informa missão cumprida, não cumprida ou projeto incompatível. Cada parcela aparece explicada, e o servidor recalcula o resultado a partir das escolhas.

O painel acompanha participações, tentativas, pontuações, primeiras respostas e revisões, escolhas, inspeções de evidência/3D, diagnósticos e preenchimento dos quatro papéis. Não atribui automaticamente acerto/erro a toda escolha isolada: uma escolha pode ser adequada em um projeto e inadequada em outro. Cancelamentos e falhas técnicas ficam separados de erros de engenharia.

O modo equipe permite até quatro participantes no mesmo dispositivo. Os seis integrantes da MISSÃO IPÊ são a equipe de desenvolvimento/apresentação; não se trata de seis jogadores online simultâneos.

## Preparação e contingência

- Abra e teste o jogo, o pitch e os assets no computador da banca. Registre a participação e prepare o ensaio antes da fala.
- Salve `equipe/index.html`: ele contém a fala e o checklist sem dependências externas. Links de acesso ainda exigem internet.
- Para usar o pitch sem rede, leve a pasta `presentation/pitch` inteira, incluindo imagens, fontes, CSS e JavaScript. Teste o caminho escolhido antes da banca.
- O laboratório medido exige rede para iniciar uma participação. A fila de uma participação existente conserva eventos durante uma interrupção; isso não transforma o jogo em aplicação offline instalada.
- O jogo clássico portátil é uma contingência histórica, não representa as três missões atuais nem envia métricas ao painel.
- Antes de dizer “validado com usuários”, conduza uma rodada observada com iniciantes: peça que expliquem uma falha, citem a evidência e justifiquem a próxima decisão. Registre participantes, método e resultado.

A previsão de 180 segundos precisa do ensaio real de Alexandre. O conjunto de testes não é garantia de acessibilidade universal, elegibilidade ou premiação; os limites estão documentados para a equipe apresentar com precisão.
