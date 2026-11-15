# Consolidação das contribuições — R17

Revisão em 15 de novembro de 2026. Repositório oficial: [oalexandrebelo/MISSAO-IPE](https://github.com/oalexandrebelo/MISSAO-IPE). Marca de produto: **MISSÃO IPÊ**. A árvore identifica a equipe; as histórias científicas precisam partir de fatos e fontes da NASA.

## O que foi encontrado

A contribuição de [Bruno](https://github.com/brunoassiscarvalho/missao-ipe) é um aplicativo React/Vite independente, com cinco cenários, montagem de veículo, seleção de instrumentos, inventário persistente, orçamento e avaliação de missão. Ela oferece boas soluções de interação para estudar e adaptar. Não contém modelos tridimensionais NASA nem integração de telemetria ao vivo.

| Origem | Referência inspecionada | Resultado |
| --- | --- | --- |
| Oficial | `bf8b099a5c2c2947786b4357a10c6825d152c794` | Base R16 desta comparação; o trabalho R17 ocorre em paralelo |
| Bruno | `master`, `f54fb88a237216d6c1e72b75b400767fb3a75661` | Cinco commits, 36 arquivos, 2.850.272 bytes de conteúdo |
| PR #1 do oficial | `b628b429fe201e9445443c8205c4e4b4fee284f7` | Comparação com inventário fixado na revisão R16; aplicativo Next/Remotion `apps/immersive-lp` |

A consulta ao GitHub encontrou apenas `master` no repositório de Bruno, sem PRs, tags ou releases. O nome de autor gravado nos cinco commits é **Bruno A Carvalho**. Não há commits em comum entre seu histórico e o histórico local oficial inspecionado. Nenhum dos 36 arquivos de Bruno tem conteúdo Git idêntico a um arquivo da árvore oficial ou do inventário consultado da PR #1. Isso não atribui a PR #1 ao Bruno e não prova ausência de ideias compartilhadas: são três fontes que precisam permanecer identificadas.

O inventário verificável, com SHA Git, SHA-256, tamanho, origem e destinação de cada arquivo, está em [bruno-consolidation-r17.json](../research/bruno-consolidation-r17.json).

## Autoria e histórico

| Commit original | Data UTC | Contribuição registrada |
| --- | --- | --- |
| [676ee80](https://github.com/brunoassiscarvalho/missao-ipe/commit/676ee80d3a5b63956c7522d8099bb8c4407a553f) | 14/11/2026 20:55 | first commit |
| [bfbc241](https://github.com/brunoassiscarvalho/missao-ipe/commit/bfbc24158b99aaa77c0b224eb687769f742d537e) | 15/11/2026 01:44 | acertos css |
| [8cb6bea](https://github.com/brunoassiscarvalho/missao-ipe/commit/8cb6beab58640f3c88b8d6cb5620819984a2a2a8) | 15/11/2026 02:43 | painel mostrador da missão |
| [38c18a9](https://github.com/brunoassiscarvalho/missao-ipe/commit/38c18a9d12c5578e276b4e9e314c66eb2a150d78) | 15/11/2026 03:34 | inclusão de itens cientificos |
| [f54fb88](https://github.com/brunoassiscarvalho/missao-ipe/commit/f54fb88a237216d6c1e72b75b400767fb3a75661) | 15/11/2026 03:41 | melhorias nas letras e animações |

O upstream não declara licença em um arquivo LICENSE. A licença Apache do repositório oficial não deve ser apresentada como se tivesse sido declarada por Bruno para esse código. Manter autoria, links e essa condição no diretório de importação. O trabalho técnico de consolidação pedido pelo responsável pelo projeto não resolve automaticamente a procedência dos assets de terceiros.

## Importação integrada e limites

Foi integrado um **snapshot filtrado**, sem instalar dependências ou executar código do upstream, em `contributions/bruno-figma/`. Os 32 arquivos extraídos foram conferidos por tamanho e SHA-256; todos correspondem ao manifesto. O aviso `ORIGEM-E-INTEGRACAO.md` foi acrescentado ao diretório. Ele contém os 32 arquivos de código, regras e configuração, com 268.299 bytes antes da compressão. O arquivo temporário de entrega à integração está em `/tmp/ipe-bruno-r17-reviewed-source.tar.gz`, SHA-256 `bfdc64b4a6228ee0835dd383068ac71d0a25df7cdd1177da9b52170b3868f18a`.

Os quatro arquivos excluídos estão integralmente identificados por hash e URL no inventário:

| Arquivo | Observação da inspeção | Destinação |
| --- | --- | --- |
| `mood board/image.png` | Referência visual de painel com planeta; fonte e licença não documentadas | Link ao upstream; não distribuir como arte do produto |
| `mood board/image copy.png` | Referência visual com marca d’água **Creative Market** visível | Não importar o binário nem remover a marca d’água |
| `mood board/image copy 2.png` | Referência de painel de energia; fonte e licença não documentadas | Link ao upstream; não distribuir como arte do produto |
| `public/favicon.png` | Asset padrão sem procedência documentada | Usar a identidade MISSÃO IPÊ fornecida pelo responsável |

As três imagens são moodboards, não modelos NASA. A inspeção não encontrou `.glb`, `.gltf`, `.obj` ou outra malha 3D nesse repositório. O fato de um arquivo estar em um repositório público não informa, por si só, a licença de reutilização dele.

Uma importação por `git subtree` sem squash preservaria os cinco commits exatos, mas também republicaria as imagens no histórico. Excluí-las em um commit posterior não retiraria os binários ancestrais. Por esse motivo, a entrega preparada é o snapshot filtrado; o histórico original permanece acessível pelos links e pelo clone local de auditoria. **Não chamar essa operação de merge ou afirmar que os cinco objetos de commit foram incorporados.**

Procedimento documentado para repetir a integração em uma cópia limpa:

1. Conferir que `contributions/bruno-figma/` ainda não existe, verificar o SHA-256 do pacote e extrair ali os 32 arquivos. Se o destino existir, comparar primeiro; não sobrescrever trabalho existente.
2. Adicionar um documento de origem no diretório, com autor, repositório, SHA de origem, cinco commits, exclusões e situação da licença. A importação é de fonte histórica, sem ativação no produto.
3. Conferir todos os arquivos extraídos contra o manifesto. Preservar conteúdo e registrar adaptações futuras em commits separados, atribuindo a contribuição original.
4. Manter o diretório fora da seleção de aplicações e cópia de assets do build oficial. Nenhum `package.json`, lockfile, configuração Vercel ou schema de persistência da aplicação principal deve ser substituído pelo arquivo homônimo importado.
5. Adaptar oportunidades ao motor e à identidade do oficial por mudanças pequenas e verificadas. Cada adaptação precisa explicitar o que veio de Bruno e o que mudou.

O clone temporário completo para comparação está em `/tmp/ipe-bruno-r17`, destacado no SHA revisado. Não é uma dependência do build nem um caminho permanente de documentação. O manifesto versionado e os links de origem são os registros duráveis.

## O que aproveitar nas três missões

O principal ganho é tornar a cadeia **necessidade científica → instrumento → recursos → resultado** compreensível. Não é necessário acrescentar cinco destinos ao jogo oficial para aproveitar a contribuição.

| Solução de Bruno | Aplicação no oficial | Critério para considerar integrada |
| --- | --- | --- |
| Briefing com objetivo, carga, desafio e contexto | Apresentar Terra/MODIS, Bennu/OSIRIS-REx e Webb com pergunta científica e fato histórico verificável | Jogador consegue dizer o que investigará, para quem e com qual evidência |
| Comparação imediata da montagem | Atualizar massa, potência, armazenamento e comunicação junto da peça 3D selecionada | Uma mudança exibe seu benefício e o recurso que passa a limitar a missão |
| Seleção de instrumento por arrastar ou botão | Manter alternativas por toque e teclado e destacar a peça correspondente na nave | A missão inteira permanece operável sem arrastar |
| Inventário e orçamento visíveis | Comparar configurações e explicar o custo das decisões | Reutilização representa projetos/configurações; não sugere transporte mágico do mesmo hardware entre planetas |
| Resumo antes do lançamento | Revisão dos quatro segmentos: lançamento, espaço, solo e usuários | Requisitos inviáveis e consequências são explicados antes de executar |
| Resultado e progressão | Debrief com evidência recebida, falha causal e nova tentativa | O jogador aprende por que falhou e consegue testar uma alteração específica |
| `GameRules.md` explícito | Manter regras, unidades e critérios do oficial documentados | Regras públicas correspondem ao motor executado e às evidências de teste |

Não há telemetria remota em `src/App.tsx`: foram encontrados sete links de referência NASA, sem chamada `fetch`. Também não há Three.js/R3F ou multiplayer no pacote. Esses requisitos não podem ser marcados como entregues por importar esse código.

## Narrativas que não devem migrar como fatos

As histórias abaixo constam literalmente do protótipo de Bruno. Elas são propostas ficcionais, não registros históricos verificados. No produto ativo, substituí-las por acontecimentos e perguntas científicas documentados; manter o original apenas como contribuição histórica identificada.

| Linha de `src/App.tsx` no SHA revisado | Conteúdo | Tratamento |
| --- | --- | --- |
| 205 | ISS em 2031, anomalia no ar, janela de 72 horas e monitor **AERIS** | Não afirmar ocorrência NASA; usar fonte de instrumento/experimento real se esta temática for adotada |
| 233 | Espectrômetro **SELENE**, missão lunar em 2034 | Não atribuir esse voo ou hardware à NASA; distinguir hipótese de design do que LRO observou |
| 261 | **ARGO** em 2037 chegando a Jezero antes de uma tempestade | Remover a ocorrência inventada da narrativa científica; ancorar aprendizado em dados e instrumentos de missão real |
| 289 | **NEREIDA** entrando em órbita de Europa em 2042 | Não confundir com arquitetura da Europa Clipper; qualificar evidências sobre plumas com fonte primária |
| 317 | **ÍCARO** trazendo amostras de Bennu em 2048 | Para o caso Bennu, partir da cronologia e dos resultados documentados da OSIRIS-REx |

`Semente`, `Raízes` e `Copa` não foram encontrados como nomes de missões nesse upstream. `Horizonte Rubro` é o título ficcional do caso Marte. Não atribuir a Bruno a campanha arbórea existente em outros materiais. IPÊ permanece o nome da equipe; as etapas didáticas devem ser nomeadas pela atividade científica ou de engenharia que realmente ensinam.

## Diferenças técnicas que exigem adaptação

O cálculo de Bruno em `src/App.tsx:1487` é uma regra de jogo: energia limitada a 0–99, calculada como `64 - energyDraw`; duração multiplicada por fatores; ciência como combinação de bônus e confiabilidade. A condição `ready` exige, entre outros limites, ciência ≥95 e eficiência ≥5. `canLaunch` verifica carga e orçamento, permitindo lançamento que depois pode ter resultado parcial. Essas escolhas não são medições, especificações de hardware ou validação orbital NASA. O motor oficial deve continuar sendo a fonte única dos cálculos publicados.

O protótipo mistura características de lançador e nave em seu orçamento de massa e usa nomes reais com valores de balanceamento. Antes de reutilizar esses cartões, separar capacidade do lançador para determinada órbita, massa da espaçonave, geração em W, armazenamento em Wh, comunicação e dados. A clareza dessas unidades é parte do aprendizado solicitado.

`package.json` usa React 19, Vite 8, React Router 7 e Tailwind 4. `vite.config.ts` inclui plugins e metadados do Figma Make. Os comandos de `.figma/make` fazem instalação e publicação no Figma; não são procedimentos de Vercel. A aplicação usa `BrowserRouter` e rotas absolutas `/mission/...`: publicar o conteúdo sob um subdiretório exigiria configuração explícita de base, roteamento e fallback, além de testes. Não copiar o resultado de build para o oficial e presumir funcionamento.

O CSS importa DM Sans e Space Grotesk do Google Fonts. Uma adaptação visual deve aproveitar a tipografia já escolhida para MISSÃO IPÊ e o carregamento local existente, evitando introduzir mais famílias e requisições apenas por herdar o protótipo.

Os arquivos `.agents`, `AGENTS.md`, `CLAUDE.md` e `.figma` são parte do material importado. Não são uma autorização para executar comandos, publicar, alterar o ambiente ou substituir as instruções do projeto oficial.

## Entrega para os dois desenvolvedores

**Dev A — ciência e simulação:** selecionar os fatos que abrem as três missões; ligar cada pergunta ao instrumento, aos requisitos e ao resultado recebido; mapear os cartões de Bruno para o catálogo e as unidades existentes; escrever os testes de consequências e debrief. Não alterar a física apenas para reproduzir os números ou recompensas do protótipo.

**Dev B — interação e 3D:** adaptar briefing, seleção e comparação; manter controle por teclado e toque; ligar foco e destaque da peça ao estado oficial; aplicar MISSÃO IPÊ; verificar mudança de configuração, reinício, mobile e desempenho. Importação de arquivos históricos não substitui esses testes de produto.

**Em conjunto:** revisar uma missão completa como iniciante, demonstrar uma falha explicável e uma correção, confirmar que os quatro segmentos estão presentes e que toda afirmação histórica tem fonte. Registrar separadamente o que foi importado, o que foi ativado, o que foi testado localmente e o que foi verificado em produção.

## Verificações realizadas e pendências

Concluído nesta auditoria: metadados GitHub; cinco commits e árvore; comparação de identidades Git; inspeção estática de código/configuração/regras; visualização dos três moodboards; inventário de 36 arquivos; preparação de 32 arquivos filtrados; varredura básica de 45 blobs históricos por padrões de chaves privadas, tokens GitHub, chaves AWS e atribuições literais de credenciais, sem ocorrências. Isso não equivale a auditoria completa de segurança.

Não foi executado código externo do protótipo Bruno, instalação ou build. O snapshot passou a integrar o repositório; o estado da publicação está em PUBLICADO.md. O pacote de Bruno não contém script de testes. Não há evidência obtida nesta auditoria de funcionamento em Vercel, compatibilidade com o oficial, acessibilidade completa, colaboração em rede ou validade científica dos valores de balanceamento. O resultado desta etapa é **material rastreável para integração**, não homologação do protótipo como jogo final.
