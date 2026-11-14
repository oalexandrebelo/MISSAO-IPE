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

## R14 — vetores originais recebidos e identidade atual

**Atualização de 14/11/2026. Esta seção substitui, para os arquivos canônicos atuais, as descrições de composição e paleta das seções anteriores, mantidas como histórico da R12.** O responsável forneceu dois novos SVGs autênticos: `Vector.svg`, com o lettering completo, e `ARTE .svg`, com o símbolo. A composição atual usa diretamente suas curvas; o lettering reconstruído de PNG deixa de ser a fonte da marca do aplicativo e do portal.

### Origem preservada

| Arquivo recebido | Papel | Geometria original | Bytes | SHA-256 |
| --- | --- | --- | ---: | --- |
| `GAME-HACKATON/PROJETO_IPE/Vector.svg` | Lettering PROJETO IPÊ | 14 paths; 454 × 217 | 6907 | `85d0f8695854d4ae3285b74559e5d62367ea3c253f9cca12c42a9c87e183ddf2` |
| `GAME-HACKATON/PROJETO_IPE/ARTE .svg` | Símbolo | 99 paths; 361 × 299 | 40510 | `b6dac71b893afa8a4dede7b103106366b5e2ca617faa63999049fc9e88251d1d` |

As cópias integrais estão em [originals/vector-original.svg](https://github.com/oalexandrebelo/PROJETO-IPE/blob/main/experiments/mission-design-lab/public/brand/originals/vector-original.svg) e [originals/arte-original.svg](https://github.com/oalexandrebelo/PROJETO-IPE/blob/main/experiments/mission-design-lab/public/brand/originals/arte-original.svg). Elas são idênticas em bytes aos arquivos recebidos. O espaço no nome original de `ARTE .svg` foi normalizado somente no nome da cópia pública; o conteúdo permaneceu intacto.

Ambos os SVGs já eram transparentes. Não contêm bitmap, texto dependente de fonte, scripts, handlers, `foreignObject`, links externos, filtros, máscaras ou retângulo de fundo. Os brancos visíveis em algumas prévias são o suporte de exibição ou espaços vazios do desenho. Nenhuma camada branca precisou ser apagada.

### Arquivos canônicos atuais

| Arquivo em `experiments/mission-design-lab/public/brand/` | Uso | ViewBox | Proporção | Bytes |
| --- | --- | --- | --- | ---: |
| `projeto-ipe-logo.svg` | Composição em fundo escuro | `0 0 900 320` | 2,8125:1 | 47676 |
| `projeto-ipe-logo-on-light.svg` | Composição em fundo claro | `0 0 900 320` | 2,8125:1 | 47675 |
| `projeto-ipe-symbol.svg` | Ícone/favicons | `0 0 361 361` | 1:1 | 40836 |

A composição coloca o símbolo original em `translate(16 10.5)` e o lettering em `translate(420 51.5)`. São apenas posicionamentos, sem escala diferente por eixo. Os **113 paths** preservam exatamente seus atributos `d` e `fill`. No ícone, os 99 paths do símbolo recebem `translate(0 31)` para centralizar a arte 361 × 299 numa área quadrada; não há deformação para preencher o quadrado.

A paleta principal agora é a dos arquivos fornecidos: **roxo `#905DC3`, amarelo `#ECA53C` e azul `#085D9D`**. Quatro cores secundárias do símbolo também foram preservadas. As variantes clara e escura usam as mesmas curvas e cores; apenas a descrição acessível distingue a aplicação. Não foi criada uma nova versão cromática da marca.

Os canônicos não fixam `width`/`height`; usam `viewBox`, título, descrição e grupos semânticos `icon`/`wordmark`. O layout deve respeitar a proporção 900:320, com altura automática ou `object-fit: contain`. Não comprimir a composição no quadrado do favicon. Não há fonte externa ou necessidade de carregar o PNG para exibir a marca.

### Conferência e continuidade

A [prévia R14](https://github.com/oalexandrebelo/PROJETO-IPE/blob/main/experiments/mission-design-lab/public/brand/preview-r14.html) compara fundos claros e escuros e ícones em 128, 64, 32 e 16 px. Uma prancha SVG foi renderizada localmente e inspecionada. Nas menores dimensões, detalhes de ramos e circuitos perdem definição; a geometria foi preservada, sem inventar uma marca simplificada. A inspeção do arquivo não substitui conferir o header responsivo na interface integrada.

A [proveniência R14](https://github.com/oalexandrebelo/PROJETO-IPE/blob/main/experiments/mission-design-lab/public/brand/brand-provenance-r14.json) registra os hashes dos originais e dos três canônicos, contagens e transformações. As três versões canônicas anteriores estão em `brand/history/pre-r14-*.svg`; o PNG antigo permanece apenas como referência histórica.

Foi lida diretamente a [logo-designer-skill solicitada](https://github.com/neonwatty/logo-designer-skill/blob/main/skills/logo-designer/SKILL.md), ausente nas pastas locais consultadas. Aplicaram-se suas convenções de vetores autossuficientes, grupos semânticos, proporção responsiva e revisão em tamanhos pequenos. A identidade e os arquivos já estavam escolhidos pelo responsável, portanto não foram gerados conceitos alternativos nem instaladas dependências. A licença da skill não atribui uma nova licença ou autoria aos desenhos fornecidos.
