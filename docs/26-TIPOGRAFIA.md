# Tipografia — PROJETO IPÊ

Decisão de 14/11/2026: **Bricolage Grotesque para títulos** e **Plus Jakarta Sans para textos e controles**. Duas famílias variáveis, servidas pelo próprio projeto, com `font-display: swap`. A escolha é uma decisão de composição e hierarquia visual; não representa resultado de pesquisa com jogadores.

## Comparação das cinco famílias solicitadas

| Família | Características documentadas e avaliação para o projeto | Decisão |
| --- | --- | --- |
| [Plus Jakarta Sans](https://github.com/google/fonts/blob/main/ofl/plusjakartasans/DESCRIPTION.en_us.html) | Geométrica, com altura-x elevada e contraformas abertas. Adequada para instruções, formulários e leitura contínua; a descrição oficial destaca legibilidade em diferentes tamanhos. | Corpo e controles. |
| [Outfit](https://github.com/google/fonts/blob/main/ofl/outfit/DESCRIPTION.en_us.html) | Geométrica, criada como extensão de uma identidade de marca. Forma coesa para interfaces; neste projeto competiria pelo mesmo papel de Jakarta sem acrescentar uma função necessária. | Avaliada, não carregada. |
| [Space Grotesk](https://github.com/google/fonts/blob/main/ofl/spacegrotesk/DESCRIPTION.en_us.html) | Sans proporcional derivada da Space Mono, com detalhes técnicos e recursos de números. A referência espacial é pertinente, mas o título não precisa repetir o aspecto técnico dos indicadores. | Avaliada, não carregada. |
| [Syne](https://github.com/google/fonts/blob/main/ofl/syne/DESCRIPTION.en_us.html) | A família explora combinações atípicas; pesos mais fortes também ficam mais largos. Expressiva para títulos, mas demanda mais cuidado em títulos longos e telas estreitas. | Avaliada, não carregada. |
| [Bricolage Grotesque](https://github.com/google/fonts/blob/main/ofl/bricolagegrotesque/DESCRIPTION.en_us.html) | Combina referências grotescas e oferece tamanhos ópticos. Tem personalidade suficiente para a abertura e os títulos, com ajuste óptico apropriado à escala usada. | Títulos e chamadas. |

As descrições acima foram conferidas no repositório oficial Google Fonts. A comparação de adequação à interface é uma interpretação de design; não é um ranking universal das famílias.

## Papéis e uso

- **Texto, instruções e tabelas:** Plus Jakarta Sans 400; 500 para ênfase leve e 600–700 para rótulos e ações.
- **Títulos e chamadas:** Bricolage Grotesque 500–700, com `font-optical-sizing: auto`. Evitar comprimir letras para caber; permitir quebra adequada em telas pequenas.
- **Números e códigos:** conservar os recursos monoespaçados locais já usados onde alinhamento técnico é necessário. Não baixar uma terceira família.
- **Marca:** o lettering “PROJETO IPÊ” está convertido em paths no SVG; não usa essas fontes nem depende delas para aparecer.

O CSS declara somente estilo normal e pesos 400–700. Não solicitar pesos fora desse intervalo como se fossem parte deste contrato. Itálico não foi baixado; evite depender de itálico sintético para transmitir informação.

## Arquivos locais e reprodução

A única origem versionada está em `experiments/mission-design-lab/public/fonts/`:

| Arquivo | Função | Tamanho |
| --- | --- | --- |
| `fonts.css` | Dois blocos `@font-face`, URLs relativas locais e `font-display: swap`. | Texto CSS |
| `BricolageGrotesque-latin-variable.woff2` | Família dos títulos; pesos variáveis e eixo óptico. | 76.868 bytes |
| `PlusJakartaSans-latin-variable.woff2` | Família de texto e controles; pesos variáveis. | 27.272 bytes |
| `BricolageGrotesque-OFL.txt` | Licença original da Bricolage Grotesque. | Texto integral |
| `PlusJakartaSans-OFL.txt` | Licença original da Plus Jakarta Sans. | Texto integral |
| `manifest.json` | URLs de origem, data de coleta, tamanhos e SHA-256. | JSON |

O Vite copia essa pasta para a distribuição do beta. A publicação do portal reutiliza a mesma pasta de origem; não há necessidade de manter duas cópias versionadas dos binários. Os caminhos de integração no site dependem de sua montagem: `/lab/fonts/fonts.css` no beta e `/fonts/fonts.css` no portal quando copiado pelo distribuidor.

Os arquivos WOFF2 foram baixados de `fonts.gstatic.com`, a partir da resposta oficial do [Google Fonts CSS API](https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400..700&family=Plus+Jakarta+Sans:wght@400..700&display=swap). O navegador do visitante não precisa consultar Google Fonts: o CSS local referencia somente os arquivos locais.

O subconjunto latino contempla o português, incluindo **á, à, â, ã, é, ê, í, ó, ô, õ, ú, ç** e as respectivas maiúsculas. A cobertura dos arquivos foi inspecionada com a ferramenta local de fontes; os textos da interface usam os acentos pré-compostos cobertos por esse subconjunto. Caracteres fora da cobertura recorrem à família de fallback. A verificação visual final deve observar “Missão”, “Ciência”, “órbita”, “PROJETO IPÊ” e números nas telas reais.

## Licenças

As duas famílias usam **SIL Open Font License 1.1**, com os avisos integrais preservados junto aos binários. Os arquivos foram distribuídos sem modificar os binários baixados. O uso e a redistribuição junto à aplicação devem manter esses avisos e as demais condições da licença. Fontes não podem ser vendidas isoladamente.

Fontes oficiais das licenças: [Bricolage Grotesque](https://github.com/google/fonts/blob/main/ofl/bricolagegrotesque/OFL.txt) e [Plus Jakarta Sans](https://github.com/google/fonts/blob/main/ofl/plusjakartasans/OFL.txt). Nenhum pacote npm ou Python foi acrescentado para fornecer essas fontes.
