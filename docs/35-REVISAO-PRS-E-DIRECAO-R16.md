# 35 — Revisão da contribuição e direção de integração R16

**Revisão em 15/11/2026, 08:07 UTC.** Referência do projeto vigente: `110e1bd50c4bea1b4f566d445ac2c0dd7d33daec`. Contribuição examinada: [PR #1 — LP imersiva orbital](https://github.com/oalexandrebelo/PROJETO-IPE/pull/1), head `b628b429fe201e9445443c8205c4e4b4fee284f7`, branch `feat/immersive-lp-orbital`.

## Parecer

A contribuição pode fornecer a direção narrativa e visual da entrada do projeto. Não foi encontrado bloqueio P1 nem defeito P2 de cálculo no recorte examinado. Há uma pendência P2 de conteúdo para integrá-la como apresentação do estado atual: a campanha com progressão já foi publicada, enquanto a LP ainda a descreve genericamente como planejada. A proposta Semente/Raízes/Copa/Horizonte precisa ser distinguida da campanha implementada, sem trocar os nomes ou capacidades de uma pela outra.

O PR é aditivo: 70 arquivos, 7.616 adições e nenhuma exclusão, concentrados em `apps/immersive-lp/` e um workflow próprio. Na consulta, estava aberto, não era draft, não estava mesclado e o GitHub o considerava mesclável. Isso não significa que a LP já esteja integrada à distribuição principal. A autoria exibida é a conta `oalexandrebelo`; esta revisão não confirma a atribuição pessoal a Bruno. O escopo examinado contém esse PR, sem pressupor que representa outras contribuições mencionadas fora do GitHub.

## Achado acionável

### P2 — Reconciliar o estado da campanha antes de promover a LP como entrada atual

**Local principal:** [`apps/immersive-lp/lib/content.ts`, linha 34](https://github.com/oalexandrebelo/PROJETO-IPE/blob/b628b429fe201e9445443c8205c4e4b4fee284f7/apps/immersive-lp/lib/content.ts#L34). A resposta à pergunta sobre os quatro níveis afirma que a campanha com desbloqueios está em planejamento. A mesma ideia aparece na [descrição de Semente, linha 18](https://github.com/oalexandrebelo/PROJETO-IPE/blob/b628b429fe201e9445443c8205c4e4b4fee284f7/apps/immersive-lp/lib/content.ts#L18) e na [nota da jornada, `app/page.tsx`, linha 74](https://github.com/oalexandrebelo/PROJETO-IPE/blob/b628b429fe201e9445443c8205c4e4b4fee284f7/apps/immersive-lp/app/page.tsx#L74).

**Condição e consequência:** ao apresentar essa versão como página atual do Projeto Ipê, o visitante recebe um estado incompleto: `/campanha/index.html` já contém quatro níveis com liberação por tentativa própria. A LP não oferece esse destino em seu objeto de links. A implementação existente é documentada em [Campanha de quatro níveis, na referência revisada](https://github.com/oalexandrebelo/PROJETO-IPE/blob/110e1bd50c4bea1b4f566d445ac2c0dd7d33daec/docs/32-CAMPANHA-QUATRO-NIVEIS.md). A defasagem decorre da evolução concorrente do projeto; não demonstra que o texto estava incorreto quando foi escrito.

**Correção recomendada:** distinguir três ofertas: campanha atual do Cerrado, laboratório com Cerrado/Bennu/Telescópio e proposta editorial Semente/Raízes/Copa/Horizonte. Acrescentar acesso à campanha e atualizar FAQ, nota da jornada e roadmap. Manter como propostas as novas mecânicas de recuperação, dados JPL e trajetórias: a existência do caso didático Bennu não implementa essas integrações. Não renomear os quatro níveis existentes automaticamente.

**Verificação necessária:** testar os destinos e a correspondência entre texto e funcionalidades disponíveis. Atualizar a expectativa que hoje exige a frase de planejamento em [`tests/experience.spec.ts`, linha 42](https://github.com/oalexandrebelo/PROJETO-IPE/blob/b628b429fe201e9445443c8205c4e4b4fee284f7/apps/immersive-lp/tests/experience.spec.ts#L42). Não resolver a divergência apenas removendo o teste.

## O que foi verificado

| Evidência | Resultado e limite |
| --- | --- |
| Metadados do PR e arquivos alterados | Consultados diretamente no GitHub, no head acima. A contribuição não altera os motores, rotas ou scripts da aplicação principal. |
| GitHub Actions | [Execução 43633898942](https://github.com/oalexandrebelo/PROJETO-IPE/actions/runs/43633898942), job `validate`, concluída com `success`. O log confirma 4 testes do motor, 15 entradas do manifesto de assets, build e 18 testes Playwright aprovados. |
| Status de implantação do head | `Vercel – projeto-ipe` e `Vercel – projeto-ipe-lp` retornaram `success`. São status de checks; esta revisão não realizou uma nova inspeção visual das implantações. |
| Núcleo científico | Os sete arquivos de `lib/mission/core/` e `lib/mission/data/` listados no manifesto de procedência conferem com seus SHA-256 e são idênticos aos correspondentes do beta vigente. |
| Reprodução independente | Os quatro testes do motor do PR passaram com Node, sem instalar dependências. Confirmam base/longo 6/6, base/curto 2/6, redesenho/curto 6/6 e determinismo/balanço de energia. |
| Interface | Fonte e testes revisados. Os 18 resultados Playwright são evidência do CI; não foram repetidos no navegador nesta revisão. |
| Assets opcionais | Manifestos e uso no código examinados. O CI verificou o hash do ZIP KayKit. A contagem de 57 modelos e a procedência CC0 constam no manifesto da contribuição; não houve nova abertura/renderização de cada modelo nesta revisão. |

Os sete arquivos científicos são `catalog.ts`, `contracts.ts`, `engine.ts`, `exact.ts`, `power.ts`, `science.ts` e `science-data.ts`. A referência está em [`docs/engine-provenance.json`](https://github.com/oalexandrebelo/PROJETO-IPE/blob/b628b429fe201e9445443c8205c4e4b4fee284f7/apps/immersive-lp/docs/engine-provenance.json). A cópia atual não diverge do motor do Cerrado; futuras alterações precisam de conferência explícita de versão e identidade.

### Limites da evidência de CI

- O workflow usa `pnpm build:offline-fonts`; a configuração Vercel usa `pnpm build`. O primeiro substitui temporariamente `next/font/google` por `next/font/local`. Ambos são caminhos previstos, mas não produzem necessariamente os mesmos arquivos de fonte. Antes de unificar a publicação, escolher um caminho canônico e validar o artefato que será servido. Ver [workflow, linha 34](https://github.com/oalexandrebelo/PROJETO-IPE/blob/b628b429fe201e9445443c8205c4e4b4fee284f7/.github/workflows/immersive-lp-qa.yml#L34), [fonte padrão](https://github.com/oalexandrebelo/PROJETO-IPE/blob/b628b429fe201e9445443c8205c4e4b4fee284f7/apps/immersive-lp/lib/fonts.ts#L1) e [substituição de build](https://github.com/oalexandrebelo/PROJETO-IPE/blob/b628b429fe201e9445443c8205c4e4b4fee284f7/apps/immersive-lp/scripts/build-offline.mjs#L3).
- As duas configurações Playwright iniciam com movimento reduzido. O teste de pausa alterna o estado, mas não substitui um percurso completo com animação normal, carga lenta e uso prolongado. A descrição do PR delimita a auditoria axe; não há certificação WCAG ou prova de desempenho em dispositivo físico.
- O teste do filme confirma abertura, carregamento dos controles, Escape e devolução do foco. Ele não aperta Play nem verifica frames avançando. O PR relata reprodução observada manualmente; essa afirmação não foi reproduzida nesta revisão. Não há MP4 pré-renderizado.
- `docs/QA-CI.md` preserva uma execução anterior, explicitamente associada a `4ae6c285...`. Para o head revisado, usar a execução `43633898942` acima. Não apresentar aquele recibo histórico como se tivesse sido gerado pelo head atual.

## Arquitetura e comportamento observados

A LP é uma aplicação independente Next.js com exportação estática. Usa React, GSAP e Remotion; não carrega Three.js/R3F. A Terra é uma imagem local com composição CSS, órbitas SVG e movimento ilustrativo. O motor do Cerrado é importado somente pelo laboratório carregado sob demanda. O player é importado ao abrir o diálogo. Não há banco, autenticação ou API de escrita na LP.

O [`MiniLab`, linhas 11–16](https://github.com/oalexandrebelo/PROJETO-IPE/blob/b628b429fe201e9445443c8205c4e4b4fee284f7/apps/immersive-lp/components/MiniLab.tsx#L11) permite escolher dois cenários e duas estratégias fixas. “Redesenhar” muda simultaneamente bateria e processamento. É uma demonstração calculada, não uma exploração das 64 configurações nem um experimento que isola a causa de uma única mudança. A descrição informa as duas alterações. O download é um JSON de resultado; não implementa o envelope de replay importável do jogo completo e não deve ser anunciado como tal.

O [`MotionSystem`](https://github.com/oalexandrebelo/PROJETO-IPE/blob/b628b429fe201e9445443c8205c4e4b4fee284f7/apps/immersive-lp/components/MotionSystem.tsx#L18) conserva texto visível antes da melhoria, respeita a preferência de movimento, oferece pausa, remove listeners e reverte o contexto GSAP. A órbita é pausada fora da tela ou com a aba oculta. Som é opt-in, sintetizado localmente, suspenso quando a página fica oculta. Essas decisões são reutilizáveis; não representam telemetria nem estado do motor.

[`Navigation`](https://github.com/oalexandrebelo/PROJETO-IPE/blob/b628b429fe201e9445443c8205c4e4b4fee284f7/apps/immersive-lp/components/Navigation.tsx#L25) e [`Roadmap`](https://github.com/oalexandrebelo/PROJETO-IPE/blob/b628b429fe201e9445443c8205c4e4b4fee284f7/apps/immersive-lp/components/Roadmap.tsx#L8) usam diálogo nativo e navegação de tabs por setas/Home/End. O menu e o filme devolvem foco ao controle que os abriu. Essas implementações podem informar a entrada narrativa sem substituir os controles de inspeção e operação existentes no beta.

## O que emprestar e o que preservar

| Parte da contribuição | Direção recomendada |
| --- | --- |
| Hero planetário, narrativa em capítulos e caminho observar/projetar/entregar | Reaproveitar composição e sequência editorial na entrada, com ligações claras para a campanha e os três casos. Preservar os créditos da imagem NASA. |
| Pausa, movimento reduzido, som opt-in e carregamento sob demanda | Reaproveitar o comportamento. Na integração, conferir teclado, foco, estado após falha de carregamento e ausência de movimento involuntário. |
| MiniLab | Manter como degustação de quatro combinações. Conservar a explicação de que o redesenho muda duas variáveis e encaminhar à investigação completa. |
| SVG estático de satélite da LP | Adequado à narrativa. Não substituir `ConfiguredSpacecraft`/`SpacecraftInspector`: no R15, as peças acompanham a configuração e a operação usa o estado registrado. |
| Filme Remotion | Recurso opcional. O player não exige MP4; publicação e exploração do jogo não devem depender de uma renderização que ainda não existe. |
| Pacote KayKit | Biblioteca opcional para protótipos, com origem e licença preservadas. Não é asset NASA nem demonstra integração ao game. Medir custo e vincular qualquer uso futuro ao estado do motor. |
| Marca e tipografia | A LP usa logo horizontal PNG e EB Garamond/Figtree. O projeto vigente adotou SVG com contornos e Bricolage Grotesque/Plus Jakarta Sans. Conciliar a direção antes de promover a LP; reutilizar a marca SVG existente e evitar manter dois contratos visuais acidentais. |

A marca PNG aparece em [`Navigation.tsx`, linha 20](https://github.com/oalexandrebelo/PROJETO-IPE/blob/b628b429fe201e9445443c8205c4e4b4fee284f7/apps/immersive-lp/components/Navigation.tsx#L20) e no [filme, linha 22](https://github.com/oalexandrebelo/PROJETO-IPE/blob/b628b429fe201e9445443c8205c4e4b4fee284f7/apps/immersive-lp/remotion/MissionFilm.tsx#L22). A diferença tipográfica é uma decisão de produto a reconciliar, não uma falha de legibilidade demonstrada nesta revisão. Ver [tipografia vigente](26-TIPOGRAFIA.md), [identidade](23-IDENTIDADE-VISUAL.md) e [contrato visual R15](34-HANDOFF-IMERSAO-3D-R15.md).

## Caminho de integração executável

1. Corrigir a informação P2 e estabelecer a função de cada entrada: LP para apresentar, campanha para progressão no Cerrado e `/lab/` para os três casos e a montagem configurável. Preservar as URLs públicas já existentes.
2. Escolher explicitamente entre manter a LP no projeto Vercel próprio ou portar sua apresentação para o portal atual. O PR, sozinho, não acrescenta a LP ao `site/` da raiz; não há razão para migrar o motor ou os jogos para Next.js somente para reutilizar a composição.
3. Se hospedar sob um subcaminho da distribuição atual, adaptar primeiro os caminhos absolutos `/assets/`, `/brand/`, `/creditos/` e os chunks Next. `next.config.ts` exporta para a raiz, com `trailingSlash: true` e sem `basePath`. Copiar `out/` para uma pasta não torna esses caminhos relativos automaticamente. Manter a allowlist e recalcular CSP para o artefato final, sem importar uma configuração Vercel por cima das rotas `/lab/` e `/campanha/`.
4. Usar as fontes e a marca escolhidas na mesma construção que será testada/publicada. Conservar atribuição/licença dos assets; os 57 modelos opcionais não precisam entrar no carregamento inicial.
5. Conferir paridade do motor copiado por hash e os resultados conhecidos. Testar links, laboratório, download, menu, filme e animação no artefato integrado, incluindo movimento normal/reduzido e rede lenta. Somar a validação específica à preservação de `/lab/`, `/campanha/`, documentação e apresentações.

**Divisão sugerida:** Dev A mantém motor, versão, procedência e verificações de paridade; Dev B integra narrativa, contratos visuais, acessibilidade e publicação. As escolhas de configuração, os resultados e o relógio continuam sob responsabilidade do domínio existente. Os dois precisam revisar juntos qualquer texto que transforme uma demonstração, um recurso opcional ou uma proposta em capacidade anunciada.

Esta rodada produziu uma revisão local e este documento. Não fez checkout na branch da contribuição, instalação de dependências, comentário, review, merge ou publicação no GitHub/Vercel. O parecer vale para os commits identificados; um novo head exige verificar o delta.
