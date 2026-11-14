# Identidade visual — PROJETO IPÊ

Atualização de 14/11/2026: a composição horizontal passa a ter um **SVG vetorial autossuficiente**, sem imagem raster incorporada e sem dependência de fonte instalada.

## Origem e arquivos

- Os arquivos recebidos `arte.svg` e `arteFULL.svg` são idênticos e contêm somente o símbolo, com `viewBox="0 0 104 104"`. SHA-256: `af507645399111bf01fdae9d88ba9963dcf4aaeccef0dc59511688c96135bd4c`.
- `experiments/mission-design-lab/public/brand/projeto-ipe-symbol.svg` conserva os 104 paths, as cores e as proporções originais. Título, descrição e grupo semântico identificam o símbolo; as dimensões fixas da raiz foram removidas.
- `projeto-ipe-logo.svg` é a composição horizontal vetorial, com `viewBox="0 0 300 100"`, título, descrição e grupos `icon` e `wordmark`. O símbolo conserva seus 104 paths originais; a translação apenas o posiciona na composição.
- `projeto-ipe-logo.png` permanece como referência original recebida, 300 × 100 e com transparência, não como dependência do SVG. SHA-256: `470c8038334270ecad0cb42f87b6a7d730c38753f6caaa84c5e4a8e4113c399f`.
- Os arquivos originais fornecidos pelo responsável não foram sobrescritos.

## Como o lettering virou vetor

O SVG recebido não contém o nome horizontal. Para preservar o desenho escolhido, os contornos de **PROJETO IPÊ** foram extraídos da transparência do PNG fornecido, mantendo posição, espaçamento, recortes internos e circunflexo. O contorno usa o limiar alfa 128/255 e simplificação geométrica de até 0,55 unidade no plano original de 300 × 100.

Isso é uma reconstrução vetorial a partir de uma referência raster pequena, não a recuperação de curvas tipográficas originais desconhecidas. O resultado usa paths preenchidos, sem `<image>`, `<text>`, base64, fonte do sistema ou arquivo externo. A faixa azul usa um recorte vetorial local. Não foi substituído o lettering por uma terceira família de fontes.

A paleta permanece cobre `#B88965`, azul `#085D9D` e branco `#FDFDFD`; tons secundários do símbolo original foram preservados. Os contornos reconstruídos não reproduzem cada pixel de antialiasing do PNG, e não há alegação de identidade binária entre os dois formatos.

## Aplicação e legibilidade

`projeto-ipe-logo-on-light.svg` é a variante transparente para fundos claros. Ela muda somente o preenchimento da palavra “PROJETO” (`project-label`) de branco para azul profundo `#173c51`; os 104 paths do símbolo, a geometria, o circunflexo e as faixas cobre/azul permanecem iguais. A versão original continua apropriada para o beta escuro. Nenhuma das duas contém caixa ou camada de fundo; superfícies ao redor da imagem pertencem ao layout. A comparação XML confirmou essa única diferença de preenchimento, além do título e da descrição da variante.

A marca horizontal foi preparada para fundos escuros, que preservam o branco de “PROJETO” e da órbita. Manter proporção 3:1 e usar dimensões explícitas no layout para evitar deslocamento durante o carregamento. A imagem pode ter `alt=""` quando o link ou botão já tiver o nome acessível apropriado; fora desse contexto, usar “Projeto Ipê”.

O favicon usa o símbolo quadrado, nunca a composição horizontal comprimida. O símbolo fornecido é detalhado; em 16 px, ramos e circuitos deixam de ser distinguíveis. A miniatura conserva a silhueta e a paleta, sem prometer a leitura desses detalhes nessa escala.

## Verificações desta edição

- XML válido; ausência de scripts, handlers, referências externas, fontes e raster no SVG horizontal.
- Comparação dos 104 atributos `d` e `fill` do símbolo com o SVG recebido: preservados.
- Renderização local do SVG para inspeção do nome, acento, recortes, proporção e divisão cobre/azul. Essa conferência do arquivo não substitui a revisão da interface integrada em navegador.
- A fonte científica e o motor do jogo não são alterados pela identidade visual.

A aplicação seguiu as convenções de SVG autossuficiente, grupos semânticos, proporção e acessibilidade da [logo-designer-skill solicitada](https://github.com/neonwatty/logo-designer-skill/blob/main/skills/logo-designer/SKILL.md). A identidade já estava escolhida; esta rodada converte a composição e preserva a direção existente. Não foram instaladas dependências para a conversão.

As fontes da interface têm licenças próprias e estão documentadas em [Tipografia](26-TIPOGRAFIA.md). A licença das fontes não determina a titularidade do símbolo ou do lettering fornecido pelo responsável.
