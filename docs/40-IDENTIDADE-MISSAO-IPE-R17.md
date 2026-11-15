# MISSÃO IPÊ — identidade oficial e aplicação R17

Data da revisão: 15/11/2026. Nome público da equipe e do jogo: **MISSÃO IPÊ**. Repositório oficial: [oalexandrebelo/MISSAO-IPE](https://github.com/oalexandrebelo/MISSAO-IPE).

Referência compartilhada de design: [Figma — Frame 12, nó 8:318](https://www.figma.com/design/PNfT0QT7VVO0Dl6vgR9pts/NASA-HACKATON---MISSAO-IPE---HUB-RIO-VERDE---GO?node-id=8-318). O frame de 1064 × 499 corresponde à composição completa usada nesta edição. Os SVGs recebidos são a fonte preservada dos arquivos publicados.

A identidade utiliza a logo escolhida e enviada pelo responsável. A árvore integra a marca da equipe; a explicação das missões e seus objetivos de aprendizagem deve partir das perguntas científicas, dos instrumentos e das evidências da NASA. A logo não significa participação institucional, validação ou endosso da NASA.

## 1. O que foi preservado

Os arquivos originais estão guardados integralmente em `experiments/mission-design-lab/public/brand/originals/`. As versões de uso conservam todas as coordenadas dos caminhos vetoriais, incluindo o desenho das letras. Não há substituição de tipografia por fonte do sistema, redesenho do símbolo, achatamento de proporções, bitmap embutido ou retângulo de fundo.

| Arquivo enviado | Cópia preservada | Tamanho | SHA-256 |
| --- | --- | ---: | --- |
| `LOGO_MISASO_IPE.svg` | `missao-ipe-logo-original.svg` | 23.279 bytes | `b89bc728ccf8cb1324c9e0459d43cbcd9156b21d23091d5c39542ff7af814d8e` |
| `LOGO_MISSAO.svg` | `missao-ipe-symbol-original.svg` | 17.870 bytes | `d9a87607d9a1709818abfa01d488aed2aa6ba29d163471376932999a1982ceab` |

O nome `LOGO_MISASO_IPE.svg` contém a grafia do arquivo recebido; ela é mantida no registro de origem. A marca completa tem 35 caminhos e `viewBox="0 0 1064 499"`. O símbolo tem 25 caminhos e `viewBox="0 0 488 414"` no original.

O PNG de referência fornecido foi copiado para `missao-ipe-logo.png`. Ele serve como referência/compatibilidade; os cabeçalhos usam SVG.

## 2. Arquivos de uso

Origem canônica dos assets: `experiments/mission-design-lab/public/brand/`. Os quatro SVGs também são copiados para `experiments/four-level-campaign/public/brand/`, para que o experimento funcione isoladamente. A publicação principal disponibiliza a mesma família em `/brand/`.

| Asset | Aplicação |
| --- | --- |
| `missao-ipe-logo.svg` | Marca completa sobre cabeçalhos escuros. Cores originais. |
| `missao-ipe-logo-on-light.svg` | Marca completa sobre páginas claras. |
| `missao-ipe-symbol.svg` | Símbolo isolado para favicon e pequenos identificadores sobre fundo escuro. |
| `missao-ipe-symbol-on-light.svg` | Símbolo isolado sobre fundo claro. |
| `brand-provenance-r17.json` | Hashes, tamanhos, origem, transformação e limites da validação. |
| `preview-r17.html` | Comparação sobre fundos claro/escuro e aplicações a 16, 32 e 64 px. |

A variante clara troca somente os preenchimentos creme `#F5F0E5` por azul escuro `#173C51`. Os outros tons — azul `#508AA2`, cobre `#E29A6F` e cobre escuro `#BF6C47` — permanecem iguais. Não usar filtro CSS para inverter toda a logo.

O símbolo de uso adota `viewBox="0 -37 488 488"`: são 37 unidades transparentes acima e abaixo. Isso produz um ícone quadrado sem esticar, cortar ou transformar as curvas. A marca completa mantém a proporção 1064:499, aproximadamente 2,132:1.

As versões de uso acrescentam título acessível e agrupamento simples. São SVGs independentes: nenhuma referência externa, fonte, script, imagem ou recurso de rede é necessário para desenhá-los.

## 3. Aplicação nas superfícies

| Superfície | Fonte que controla a aplicação |
| --- | --- |
| Laboratório com três missões | `experiments/mission-design-lab/src/App.tsx`, `src/orbit.css` e `index.html` |
| Entrada das missões | `experiments/mission-design-lab/src/ui/MissionGateway.tsx` |
| Campanha de quatro níveis | `experiments/four-level-campaign/src/App.tsx`, `src/orbit.css` e `index.html` |
| Apresentação da campanha | `experiments/four-level-campaign/public/apresentacao/index.html` e `style.css` |
| Pesquisa de cada experimento | Os respectivos `scripts/build-research.mjs` |
| Portal e estudo de Game Design | `web/index.html`, `web/game-design.html` e `web/game-design.css` |
| Contexto e biblioteca | `context/index.template.html`, `scripts/build-context-hub.mjs` e `scripts/build-research-library.mjs` |
| Páginas documentais da publicação | `scripts/build-beta-site.mjs` |

Os cabeçalhos dos jogos reservam uma caixa de 145 × 68 px para a marca completa; em telas menores, 128 × 60 px. `object-fit: contain` preserva a proporção exata do original. O portal claro usa uma caixa maior, 170 × 80 px, e reduz para 136 × 64 px. O SVG permanece transparente em todos esses usos.

Nos elementos HTML, informar `width="1064" height="499"` e `alt="MISSÃO IPÊ"`. Quando a marca estiver em um link ou botão de retorno, descrever também o destino em `aria-label`, como “MISSÃO IPÊ, observatório”. A função é voltar à página de origem; não iniciar animação ou esconder a navegação.

Para novos cabeçalhos, reutilizar os arquivos e as dimensões acima. Não remontar a palavra IPÊ usando uma fonte, não substituir o símbolo por um emoji, não aplicar sombra/fundo à imagem e não usar uma ilustração de árvore diferente.

## 4. O que continua histórico

Os assets `projeto-ipe-*`, a proveniência R14 e seus originais permanecem preservados. São evidências da identidade anterior e não devem receber conteúdo diferente sob o mesmo nome. Os novos nomes `missao-ipe-*` também evitam que o cache exiba a marca antiga.

Relatórios anteriores, capturas, recibos de publicação, apresentações exportadas e documentos datados conservam o nome que tinham quando foram produzidos. O cabeçalho atual da biblioteca muda; o conteúdo histórico dentro dela não é reescrito. A demonstração visual `Planet Jumping` mantém os assets exigidos em sua especificação; a menção ao projeto foi atualizada para MISSÃO IPÊ.

URLs históricas e chaves de armazenamento não são nomes da marca visível. Não renomeá-las automaticamente: isso poderia quebrar links compartilhados e projetos salvos. Migrações de domínio/rotas são decisões de publicação separadas.

## 5. Handoff para os dois desenvolvedores

**Dev de interface:** usar a variante adequada ao fundo; manter espaço livre ao redor da logo; verificar o cabeçalho a 375, 768 e 1440 px; confirmar foco visível, nome acessível e ausência de deslocamento ao carregar. A 16 px, o símbolo funciona como identificador: os detalhes internos não se tornam texto legível.

**Dev de integração/publicação:** publicar os arquivos canônicos de `/brand/`, incluindo proveniência e originais; manter as cópias SVG da campanha iguais às do laboratório; gerar os wrappers documentais a partir dos scripts; verificar HTTP 200 e o tipo `image/svg+xml` nas rotas da marca. A publicação não deve depender dos caminhos absolutos da máquina onde os originais foram recebidos.

O arquivo `brand-provenance-r17.json` registra SHA-256 por asset. Após qualquer alteração intencional, atualizar seu hash e descrever a transformação. Não alterar somente uma das cópias.

## 6. Verificação e referências

A conferência estrutural compara a sequência completa de atributos `d` de todos os caminhos de cada versão com o original correspondente. A variante de fundo claro difere somente nos preenchimentos indicados. O documento de proveniência registra o resultado dessa inspeção. A conformidade estrutural não substitui a inspeção visual do site publicado.

A aplicação segue as orientações pertinentes da [logo-designer-skill](https://github.com/neonwatty/logo-designer-skill/blob/main/skills/logo-designer/SKILL.md): SVG autossuficiente, `viewBox`, letras em caminhos, ícone isolado quadrado e conferência em tamanhos pequenos. A arte foi fornecida pelo responsável; não foi necessário gerar uma nova marca ou executar scripts remotos.

As fontes de interface não alteram o desenho da logo. Manter as famílias já adotadas no projeto e seus fallbacks; a mudança de identidade não introduz dependências, novas fontes ou chamadas externas.
