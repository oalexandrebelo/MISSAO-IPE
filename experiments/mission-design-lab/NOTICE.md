# Atribuição, licenças e autoria assistida

Missão Ipê — Ciência que chega. Protótipo de P&D para AB / Hackatur–Zer0Slop, 2026. Código original desta entrega sob Apache-2.0, com cópia em LICENSE. A licença é uma escolha de distribuição deste pacote de pesquisa; não determina elegibilidade NASA. Nenhum repositório privado AB foi publicado ou relicenciado.

Assistência por IA: pesquisa, arquitetura, documentação, implementação e testes assistidos por dez frentes Astra 6 / max e coordenação. Os papéis e pareceres estão registrados em research. O fato de um agente produzir código ou parecer não substitui execução, revisão humana ou qualificação institucional.

Bibliotecas de runtime distribuídas compiladas: React, ReactDOM, Scheduler e Three.js, MIT, com avisos em licenses. As versões exatas e integridades de instalação estão em package-lock.json. Dependências de build/teste têm licenças próprias no inventário da entrega; não estão empacotadas como node_modules.

Dados NASA: MOD13Q1 Collection 061 / DOI 10.5067/MODIS/MOD13Q1.061; subset ORNL DAAC, metadados de bandas e CMR preservados em public/data. Coordenadas são posições solicitadas ao serviço, não garantia de centro de pixel. Datas dos registros: 2024; recuperação:14/11/2026. Consultar os avisos do fornecedor para qualquer redistribuição ampliada. Na identidade visual autoral e no jogo não foram usados logotipos NASA, Kapsch ou assets proprietários.

Referências internas: cena Three/OrbitControls e práticas de descarte do AB-SMC1TY foram inspecionadas como referência; o diorama desta entrega foi escrito para o protótipo. AB-ET3TIV informou práticas de auditoria; AB-R3A/REA executou inspeção estática no escopo registrado. Não há um motor Astra offline embarcado no jogo ou no AB-R3A.

Referência de interação: Kapsch Experience, seleção espacial por hotspots; sem cópia de identidade ou arquivos. Referência de processo: github/spec-kit, MIT, protocolo documental aplicado sem instalar a CLI. Comparáveis de competição foram pesquisados, sem incorporação de seu código.

Desenvolvimento específico começou antes das 09h BRT de 14/11/2026. Datas reais devem ser preservadas. Não existe aprovação NASA observada para aproveitamento desse trabalho na competição. Fontes, inspiração, licença e autoria não equivalem a endosso ou certificação.

Rodada R5 de apresentação: três agentes GPT-6 Astra, esforço max, realizaram revisão de fontes, criação do HTML e verificação/handoff, com coordenação principal. A declaração específica está em kit/AI-USAGE.md e evidence/ai-usage-r5.json. O jogo e seus builds foram preservados; a apresentação incorpora o mesmo núcleo para sua demonstração.

Os cartazes em references/user foram fornecidos por AB e preservados como referências contextuais sem alteração dos bytes. Marcas, direitos e autoria dos cartazes pertencem aos titulares originais. A licença Apache-2.0 do código original não relicencia esses materiais. Sua presença não representa endosso NASA, Space Apps, Kapsch ou dos organizadores locais.

## Complemento R9 — aplicação standalone 0.4.0-beta.1

Esta rodada acrescenta a interface de laboratório de missões, uma cena React Three Fiber com alternativa 2D, comparação de execuções, modelos físicos independentes e documentação R9. Sua integração prevista é `experiments/mission-design-lab/` no repositório de origem, preservando o portal e os avisos históricos acima. Menções históricas a kits, apresentações, cartazes e relatórios descrevem a distribuição anterior; não afirmam que todos esses arquivos fazem parte desta aplicação standalone.

A rodada R9 foi assistida por seis frentes Astra 6 / max, além da coordenação: três de pesquisa, uma do laboratório de física, uma da cena 3D/2D e uma de QA/didática. Os resultados executados e as limitações estão em `docs/QA-R9.md`. Assistência de IA não equivale a revisão humana, certificação institucional ou evidência de aprendizagem.

Dependências adicionais da apresentação, conferidas em 14/11/2026:

| Pacote | Versão instalada | Licença declarada | Evidência consultada |
|---|---|---|---|
| `@react-three/fiber` | 9.8.2 | MIT | `node_modules/@react-three/fiber/package.json`; aviso de copyright e texto MIT no [LICENSE upstream](https://github.com/pmndrs/react-three-fiber/blob/master/LICENSE). O pacote instalado nesta revisão não continha um arquivo LICENSE próprio. |
| `@react-three/drei` | 10.7.9 | MIT | `node_modules/@react-three/drei/package.json` e `node_modules/@react-three/drei/LICENSE`. |

Os metadados do lockfile registram as versões e integridades. Esta tabela cobre as duas adições diretas da cena; dependências transitivas conservam seus próprios termos. O aviso abaixo preserva os textos MIT consultados e suas atribuições, sem transferi-los para a licença Apache-2.0 do código original.

A documentação HTML pública é gerada por `scripts/build-research.mjs` com **Marked 17.0.5**, distribuído localmente em `scripts/vendor/marked/`; não há uma nova dependência npm para esse gerador. O cabeçalho preserva Copyright (c) 2018-2026, MarkedJS, e Copyright (c) 2011-2018, Christopher Jeffrey, sob MIT. O arquivo [scripts/vendor/marked/LICENSE.md](scripts/vendor/marked/LICENSE.md) foi conferido e mantém também os avisos específicos de Markdown / John Gruber. Conservar esse arquivo completo junto à cópia local. Essa ferramenta converte os documentos do projeto em HTML; não participa do motor científico.

### React Three Fiber

MIT License

Copyright (c) 2019-2025 Poimandres

Fonte do aviso: repositório upstream consultado em 14/11/2026. A declaração MIT da versão instalada 9.8.2 foi conferida no seu `package.json`.

### Drei

MIT License

Copyright (c) 2020 react-spring

Fonte do aviso: arquivo LICENSE distribuído com `@react-three/drei` 10.7.9.

### Texto de permissão MIT, aplicável separadamente aos dois avisos acima

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.


## Complemento R10 — refinamento de método

A versão 0.4.0-beta.2 acrescenta ConOps didático, revisão pré-voo, requisitos ligados aos eventos reais e interpretação dos pares científicos entregues. As mesmas seis frentes Astra 6 / max participaram em duas ondas e foram reutilizadas na análise das referências adicionais. A NPR 8705.4B fundamenta a distinção entre classes de risco e probabilidades; nenhuma classificação NASA foi atribuída à missão fictícia. A revisão científica e as verificações executadas estão em docs/REFINAMENTO-NASA-R10.md e docs/QA-NAVEGADOR-R9.md. O motor e o catálogo não foram alterados por esse refinamento.
