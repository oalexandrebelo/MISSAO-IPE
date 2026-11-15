# 36 — Planet Jumping: experimento de portal cinematográfico

**R16 · implementação de 15/11/2026.** [Abrir o experimento](../planet-jumping.html) · [Jogar as três missões científicas](../lab/index.html) · [Guia didático das missões](32-GUIA-DIDATICO-MISSOES-3D.html) · [Biblioteca de estudo](../context/research-library.html).

Planet Jumping é um experimento visual independente, construído a partir da referência integral fornecida pelo usuário. Um único HTML contém marcação, estilos e JavaScript. Não usa bibliotecas externas, instalação de pacotes ou compilação para funcionar. **As mídias continuam remotas:** código autocontido não significa funcionamento audiovisual sem internet.

O experimento conserva a interface em inglês, a marca Ubernatural da referência, os identificadores de elementos, as seis URLs e a sequência **Marte → Terra → Vênus**. A imagem de Mercúrio encerra a experiência como prévia. O botão fica desabilitado em Vênus e o texto informa que a jornada terminou; não existe uma quarta viagem escondida.

Essa marca não substitui a identidade do Projeto Ipê no laboratório ou na campanha. A página não afirma autoria NASA das mídias fornecidas e **não representa endosso da NASA**. Tampouco simula trajetória, tempo de voo, distância percorrida, combustível ou operações reais. Os fatos planetários são os textos aproximados da referência, não resultados do motor.

## 1. O que foi implementado

1. Abertura com vídeo de aproximação de Marte, marca central e progresso da própria reprodução. Quando os metadados permitem, a taxa é ajustada para uma introdução de aproximadamente três segundos.
2. Marca deslocada para o cabeçalho, navegação revelada, lista dos oito planetas e fatos do destino atual.
3. Janela arredondada desenhada em canvas, inclinada em resposta ao ponteiro e ampliada durante a viagem. O vídeo é amostrado em cobertura de toda a tela: a máscara se move sobre uma imagem fixa em relação à tela, em vez de transformar um cartão texturizado.
4. Viagens para Terra e Vênus com vídeo a 1,3×, expansão da máscara, retenção do último quadro somente quando a reprodução realmente termina e atualização atômica do estado.
5. Cursor com ponto, anel e indicação “Enter” em dispositivos com ponteiro preciso. Toque e teclado usam o mesmo botão de viagem.
6. Menu e navegação funcionais: apresentação do experimento, foco no portal, descrição dos destinos e detalhes de falhas de mídia. Os links de saída levam às rotas públicas do laboratório e da documentação.

O efeito de perspectiva é **fake 3D em canvas 2D**, calculado sobre os pontos de um retângulo arredondado. Não há WebGL, malha planetária, física orbital, terreno ou biblioteca Three.js nesta página. A área de amostragem permanece a tela inteira; a região de recorte acompanha o tamanho real do botão em cada viewport.

## 2. Relação com as três missões

O portal demonstra ritmo, transição de contexto e exploração visual. As missões do Ipê continuam responsáveis por conectar necessidade científica, decisão de engenharia, estado registrado e interpretação do resultado. O portal não acrescenta uma nova campanha ou altera as regras de Cerrado, Bennu e Telescópio.

Uma adaptação ao jogo precisa preservar a distinção entre animação e evidência: abrir uma vista de instrumento não comprova observação; uma viagem visual não calcula lançamento; mostrar um enlace não comprova transmissão. O [contrato das naves configuráveis](34-HANDOFF-IMERSAO-3D-R15.html) descreve como a configuração e os estados calculados alimentam as representações existentes. O [guia didático](32-GUIA-DIDATICO-MISSOES-3D.html) continua a referência para os objetivos de aprendizagem.

## 3. Fontes remotas preservadas

Base exata: `https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P`.

| Uso | Arquivo na base | Tipo recebido | Bytes informados pelo servidor |
| --- | --- | --- | ---: |
| Fundo de Marte | `3c83091e-4046-4fd6-adbb-2edb728be79a.mp4` | `video/mp4` | 5.558.213 |
| Viagem / prévia da Terra | `fc3ded42-e845-41f3-a830-5cab512d79cd.mp4` | `video/mp4` | 11.560.881 |
| Viagem / prévia de Vênus | `b30f64d9-1637-477a-83df-d0fc6461a422.mp4` | `video/mp4` | 14.475.698 |
| Introdução de Marte | `5fc5651c-3b5d-4171-b507-87f7e635d1b4.mp4` | `video/mp4` | 15.860.826 |
| Prévia de Mercúrio | `d6fb8b6b-c15e-4aaa-9cf7-45bbb5e33372.jpg` | `image/jpeg` | 1.039.184 |
| Marca Ubernatural | `eb7e0f53-50cd-4af5-abc4-8b9a52cdc01b.svg` | `image/svg+xml` | 855 |

Em 15/11/2026, as seis requisições **HEAD** responderam HTTP 200, `Access-Control-Allow-Origin: *` e `Accept-Ranges: bytes`. O total dos arquivos únicos é **48.495.657 bytes**, aproximadamente 48,50 MB. Isso não mede transferência efetiva: a página reutiliza URLs, o navegador pode fazer leituras parciais e o cache depende da resposta servida. A verificação de cabeçalhos não comprova decodificação audiovisual nem disponibilidade futura.

Os elementos de vídeo usam `muted`, `playsinline` e `preload="auto"`, sem os atributos `controls` ou `autoplay`. A reprodução é comandada por JavaScript. Os vídeos e a imagem usados como fontes de pixels têm `crossorigin="anonymous"`. Não houve substituição de URLs nem cópia das mídias para o repositório. As respostas dependem do provedor externo e da rede do visitante.

As quatro regras `@font-face` procuram somente fontes instaladas com `local()`: SF Pro regular/negrito, SF Pro Thin e Aalto. Sem essas fontes, a página usa Arial e Arial Narrow/sans-serif. Não requisita arquivos de fonte inexistentes nem CDN de tipografia. Aalto é reservado ao título do planeta.

## 4. Recuperação e movimento reduzido

O percentual da abertura deriva de `currentTime / duration`, não de um relógio fictício ou da porcentagem de bytes baixados. Somente uma introdução concluída apresenta 100%. Se a pessoa pula, pede movimento reduzido ou o vídeo falha, o contador apresenta um traço e a introdução é identificada como pulada.

- A espera por metadados da introdução é limitada a cinco segundos; há limites adicionais para iniciar e concluir sua reprodução. Uma salvaguarda total de doze segundos libera a experiência se a abertura não concluir.
- As esperas pelas prévias e pelo vídeo da viagem são limitadas a 1.600 ms. Ausência de quadro decodificável mantém a jornada textual disponível.
- Rejeição ou demora de `play()`, erro de mídia e falta de evento `ended` têm saídas finitas. A viagem tem prazo de reprodução calculado e limitado a trinta segundos; nenhum desses casos deixa permanentemente o botão ocupado.
- O último quadro é retido como cena final apenas após `ended`. Se a reprodução for interrompida ou pulada, a página não apresenta um quadro parcial como chegada comprovada.
- Falhas aparecem em “Some visuals are unavailable”, com detalhes por recurso. O portal oferece instrução textual quando não consegue desenhar sua mídia. A falta de canvas também preserva a navegação entre destinos.
- “Skip intro” permite sair da abertura. A preferência `prefers-reduced-motion` elimina inclinação, reduz transições e pula a reprodução em movimento, mantendo a sequência dos destinos. Se ativada durante uma viagem, cancela a reprodução de forma controlada.
- O cursor personalizado depende de ponteiro preciso e de movimento detectado; a navegação por teclado preserva foco visível. Dispositivos de toque não dependem de hover.

O código não pode impedir mensagens de erro de rede emitidas pelo próprio navegador quando um servidor externo falha. O critério de recuperação é ausência de exceções JavaScript não tratadas e continuidade utilizável, com informação verdadeira sobre a mídia indisponível.

## 5. Ajustes pontuais de legibilidade

A referência define altura mínima fixa e títulos grandes com fonte condensada. Quando a fonte não existe ou a tela é curta, essas regras podem cortar texto. O experimento preserva os valores de referência em viewports compatíveis e aplica duas salvaguardas: reduz horizontalmente o título apenas quando necessário e ajusta a janela ao espaço livre entre cabeçalho e conteúdo. Em telas baixas, elimina a altura mínima que ultrapassaria o viewport e reduz espaçamentos.

O número **[06]** da prévia de Mercúrio foi preservado por fidelidade à referência. É um rótulo visual, não a ordem dos planetas em relação ao Sol. A lista dos oito planetas não promete oito destinos navegáveis. O aviso terminal e o menu explicam o alcance de três estados.

## 6. Publicação e política de conteúdo

O arquivo-fonte é [web/planet-jumping.html no GitHub](https://github.com/oalexandrebelo/PROJETO-IPE/blob/main/web/planet-jumping.html); a rota pública prevista é [planet-jumping.html](../planet-jumping.html). Ele pode ser servido diretamente por HTTP, sem compilação própria. A distribuição do projeto pode copiá-lo para o pacote estático.

Uma política CSP aplicada pelo servidor precisa permitir **somente nesta rota**, além das regras locais já necessárias:

- `media-src`: `https://d2ol7oe51mr4n9.cloudfront.net` para os MP4.
- `img-src`: a mesma origem para JPG e SVG.
- `script-src`: hash SHA-256 do script inline efetivamente publicado; o script não exige `eval`, bibliotecas externas ou permissão geral para scripts inline.
- `style-src`: suporte aos estilos inline e às propriedades de estilo ajustadas pelo script, conforme a política do site.

Não há `fetch` externo nesta implementação; portanto, não é necessário abrir `connect-src` para esse CDN. As fontes são locais. O canvas depende dos cabeçalhos CORS das mídias, além da CSP; uma política do servidor que bloqueie a origem produzirá a alternativa textual, não a experiência audiovisual completa. Recalcular o hash do script depois de qualquer edição e conferir os cabeçalhos realmente servidos.

## 7. Evidência e limites da revisão

O JavaScript inline foi extraído e passou em `node --check`. Uma inspeção estrutural confirmou um script inline, quatro regras de fonte, seis elementos de vídeo, nenhum script/estilo externo e ausência de atributos `autoplay`/`controls`.

O ensaio em DOM simulado exercita o estado inicial, as duas viagens, clique duplicado, terminal, menu, fontes de pixels da máscara, recuperação sem mídia, rejeição de reprodução, ausência de `ended`, movimento reduzido e ausência de canvas. Esse ensaio usa mídia e relógio controlados: **não é prova de GPU, codec, aparência, tempo de rede ou desempenho no dispositivo**. A validação visual da distribuição deve cobrir 375, 768 e 1.440 pixels de largura, teclado, toque e as mídias reais. O [recibo de publicação](https://github.com/oalexandrebelo/PROJETO-IPE/blob/main/PUBLICADO.md) identifica a implantação efetivamente conferida.

Não se acrescentaram dependências, autenticação, telemetria, pontuação, dados NASA ao vivo ou novas regras de missão. A integração pedagógica permanece no jogo e deve ser avaliada pela clareza da relação entre escolha, consequência e ciência recebida.
