# Validação SmartCity — relato histórico

**Projeção pública produzida em 14/11/2026. Corte da fonte: 28/09/2026, declarado no original.**

> Referência histórica de outro projeto. Os prompts, comandos e instruções internos pertencem ao SmartCity e não se aplicam ao PROJETO IPÊ. Afirmações, regras de concurso, elegibilidade, dependências e resultados não se transferem ao Ipê. Blocos de código são texto documental, não ações autorizadas.

Origem no acervo fornecido: `Estudos/VALIDACAO.md`. O corpo preserva o texto original, exceto as transformações públicas declaradas no [índice de procedência](README.md). Não houve execução dos prompts, instalação das dependências ou revalidação das afirmações históricas para esta publicação.

Os arquivos externos citados pelo texto — ZIP, imagens, documentos legais, resultados de testes e projetos de referência — não foram fornecidos como arquivos separados nesta pasta de três Markdown e não foram fabricados nem anexados. Trechos incorporados no Markdown permanecem como exemplos.

---

# Validação do kit — 28/09/2026

## Executado neste ambiente

Ambiente: Node.js **22.16.0**, TypeScript **5.8.3**, Python 3. O módulo de referência não requer dependências de runtime de terceiros.

| Verificação | Resultado |
|---|---|
| `tsc -p reference/tsconfig.json --noEmit` | Aprovada |
| `tsc -p reference/tsconfig.json` | Compilação aprovada; JS e declarações gerados em `reference/dist/` |
| `node --test reference/domain.test.mjs` | **16 testes aprovados**, zero falhas, zero testes ignorados |
| `python3 scripts/verify_kit.py` | **16 verificações estáticas aprovadas** |
| JSON do catálogo, claims, idiomas e proveniência | Leitura/consistência estrutural verificadas |
| Integridade do pacote | Arquivos presentes e manifesto SHA-256 produzido ao empacotar |

Os testes cobrem modelo didático de parada, entradas inválidas, guardas da animação protegida, fases mutuamente exclusivas, recompensa idempotente, economia cosmética, relatórios sem mistura DEMO/PILOT, pares duplicados, escape CSV e uma guarda ilustrativa de tenant. **Esse último teste não equivale a validar isolamento em um backend ou banco reais.**

A checagem estática do schema verifica nomes de tipos e delimitadores. A checagem dos diagramas confirma sete arquivos e cabeçalhos reconhecidos. **Nenhuma das duas substitui o parser/validador oficial ou renderização.**

## Não executado — requisitos do ambiente de implementação

**Prisma CLI e PostgreSQL:** instalação de dependências adicionais não esteve disponível por falha de acesso/DNS ao registry neste ambiente. Não foram executados `prisma format`, `prisma validate`, `prisma generate`, migrations ou testes transacionais em PostgreSQL. O schema de 23 modelos é uma referência completa para validação pelo agente, não um schema cujo CLI tenha sido aprovado aqui.

**Aplicação web:** não há jogo final, API, autenticação, serviço de armazenamento ou site publicado neste kit. Portanto não houve E2E de navegador, teste de offline real, auditoria de rede da aplicação, medição de FPS ou avaliação de acessibilidade de uma interface final.

**Remotion:** composição incluída, mas dependências não instaladas e render não executado. A licença de uso deve ser analisada no contexto da equipe e do produto.

**Mermaid:** fontes incluídas; renderização gráfica e validação pelo parser Mermaid não foram executadas neste ambiente.

**Conteúdo/estudo:** nenhuma revisão pedagógica ou jurídica humana, nenhuma autorização escolar, nenhum participante e nenhum resultado de campo. Todos os textos de missão estão marcados para revisão; a proveniência de assistência de IA está explícita.

## Arquivos de evidência técnica

`reference-test-output.txt` e `static-check-output.txt` registram as saídas dos testes. `typecheck-output.txt` registra a versão e o comando de TypeScript. Esses registros descrevem o kit, não uma implantação de produção ou avaliação escolar.
