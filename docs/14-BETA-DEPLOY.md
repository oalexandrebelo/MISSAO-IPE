# BETA pública · montagem e contrato de publicação

**Rodada R6, 14/11/2026.** O objetivo desta rodada é unificar a entrada pública do jogo, apresentação, arquitetura e documentação. O motor e os dados científicos permanecem os da versão de pesquisa existente. A release tem alvo em **15/11/2026 às 08h BRT**, condicionada ao plano e aos critérios de aceite.

## Rotas estáticas

| Rota | Entrada | Comportamento |
|---|---|---|
| `/` | `web/index.html` emitido em `site/index.html` | Portal BETA, links principais, estado de pesquisa e alternativa local. |
| `/game/index.html` | Cópia selecionada de `dist/` | Jogo existente com Worker, assets e JSONs locais. |
| `/presentation/Missao_Ipe_Apresentacao.html` | HTML R5 preservado | Sete quadros de Pitch, oito apêndices e demonstrador com o mesmo núcleo. |
| `/architecture/index.html` | Mapa Archify R6 | Inspeção dos componentes e relações do projeto. |
| `/docs/index.html` | Índice gerado | Documentos públicos em HTML estático e Markdown. |
| `/portable/Missao_Ipe_Local.html` | HTML portátil preservado | Alternativa para download e uso local na thread principal. |
| `/output/pdf/AB_Missao_Ipe_Dossie_Implementacao.pdf` | PDF histórico R4 | Dossiê de base, identificado por seu corte. |
| `/output/html/AB_Missao_Ipe_Estudo_Integral.html` | Estudo histórico R4 | Texto integral de base, sem reivindicar validações novas. |
| `/publication-manifest.json` | Manifesto do build | Arquivos emitidos, tamanho, hashes, fontes e transformações. |

O portal navega entre módulos por links. Ele não compartilha nem sincroniza estado de partidas com a apresentação ou o mapa de arquitetura. O armazenamento do jogo pertence à origem e ao navegador. Exportar recibos antes de mudar de domínio ou instalação.

## Build reproduzível

O script usa bibliotecas nativas do Node e os artefatos já compilados. Não modifica o núcleo, não recompila o jogo e não instala dependências.

```bash
node scripts/build-beta-site.mjs
```

A saída fica em `site/`. Um diretório de preparação só substitui a saída anterior depois que as entradas obrigatórias forem encontradas e os arquivos forem escritos. A conclusão do build não equivale a publicação remota ou aprovação de segurança.

Uma preparação incompleta pode usar `--allow-incomplete`. Ela registra `publicationReady=false` quando faltam entradas obrigatórias e não deve ser promovida como release. O build final exige a arquitetura e os documentos R6. O manifesto e o recibo local registram o que existia no momento da montagem.

## Curadoria explícita

O build não copia a raiz do repositório. Sua lista permite:

- Runtime do jogo: HTML, JavaScript, CSS e dez JSONs conhecidos. Source maps ficam fora do site.
- HTML da apresentação e seus três guias, com bytes originais preservados. Os guias também recebem versões HTML estáticas para leitura.
- Arquitetura: `index.html`, `model.json` e `map.mmd`.
- Documentação pública selecionada, incluindo resumos de estado, ciência, verificação, uso, IA e documentos R6.
- Dois pareceres documentais selecionados, três replays de exemplo, fontes científicas preservadas e o script de pesquisa EVI3, separado do motor.
- PDF e estudo HTML históricos R4, liberados para cópia pública pela revisão da coordenação.
- Licença e avisos de bibliotecas.
- Projeções de sete recibos: cronologia, benchmark, digest AB-R3A, QA e build da apresentação, pesquisa EVI3 e tentativas de recuperação dos Resources.

Ficam fora: relatório bruto AB-R3A, `repository-sources`, anexos pessoais, cartazes de referência, ambiente, credenciais, source maps, código de repositórios privados, dependências instaladas e estado local de Git/Vercel. Links simbólicos não são aceitos como entradas.

Cada projeção pública de JSON informa a origem, o hash do original e que seus campos são selecionados. O original não é sobrescrito. A cronologia mantém o estado de P&D anterior ao evento e omite metadados de anexos pessoais.

O benchmark público conserva protocolo e resultados com a identificação do executor necessária à interpretação. Não transforma os tempos em promessa de navegador ou hardware de apresentação. O digest AB-R3A conserva cobertura parcial e a distinção entre observações estruturais e vulnerabilidades confirmadas.

## Navegação e disponibilidade local

Os caminhos relativos usados pela apresentação continuam atendidos: `portable`, `output`, `research`, `evidence`, `public/data` e atribuições. O HTML da apresentação e o jogo compilado não recebem nova lógica de ciência nesta rodada.

O portal e o índice de documentação não dependem de JavaScript para navegação. Fontes, estilos e ilustração do portal estão no próprio HTML. O desenho conceitual possui legenda de geração com IA. O conteúdo distingue os registros observacionais das saídas do modelo didático.

Links externos de fontes só são acessados por decisão do visitante. A ausência de um serviço remoto de pontuação não significa que a hospedagem deixe de receber requisições HTTP normais para servir a página.

## Verificação e release

O QA da BETA deve conferir a árvore pública e seus links, a preservação dos hashes dos runtimes, os assets do Worker, os dados, as projeções e as exclusões. HTTP e DOM verificam suas camadas. Inspeção visual e acessibilidade nativa permanecem evidências separadas.

O QA em `scripts/test-beta-site.mjs` requer Node 24 ou superior, jsdom 31.0.1 e TypeScript 7.0.2, já fixados no lockfile. Em um checkout novo, é necessário instalar as dependências de desenvolvimento ou dispor do cache correspondente. Essa necessidade pertence ao teste; montagem estática, serviço dos arquivos e uso do site compilado não exigem essa instalação. O teste faz parse DOM e HTTP, sem executar um navegador real.

O build escreve os recibos locais `evidence/beta-site-build.json` e `evidence/beta-runtime-preservation.json`. O segundo relê originais e cópias emitidas para conferir igualdade dos bytes do jogo, portátil e apresentação. A coordenação controla repositório, projeto Vercel, configuração e publicação. O deploy deve servir `site/` como saída estática e conservar as rotas acima, sem redirecionar todo caminho desconhecido para o jogo.

O [plano de release](15-PLANO-RELEASE.html) distingue a BETA funcional do alvo de release. Elegibilidade temporal, confirmação da lista oficial de Resources e pesquisa com participantes não são resolvidas pela publicação do site.
