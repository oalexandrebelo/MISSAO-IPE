# 07 — Schema Prisma e persistência implementada

O schema completo está em `prisma/schema.prisma`; a configuração CLI 7 está em `prisma/prisma.config.ts`. O comando `prisma validate` com versão 7.10.1 foi executado e aprovou a estrutura. Não houve geração de client, aplicação de migração, inicialização de serviço Node/SQLite nem conexão da UI ao Prisma. O produto implementado usa IndexedDB, conforme `src/persistence/store.ts`.

## 1. Modelo relacional proposto

| Modelo | Identidade e vínculo | Invariante pretendido |
|---|---|---|
| ScenarioPack | key+version; hash de conteúdo | Pacote imutável, versões de motor/catálogo/política numérica explícitas. |
| SourceReference | packId+key; DOI, URL, hash, horário | Fonte pertence ao pacote e não é consultada automaticamente pelo importador. |
| ScienceRecord | packId+key; FK composta da fonte | Coordenadas solicitadas, datas de arquivo, bandas/QA e escala não se confundem com relógio de missão. |
| ScientificParameter | packId+key; classe de proveniência | Hipótese, transcrição e derivação têm distinção explícita. |
| ParameterSource | parâmetro+fonte; mesmo pack | O papel VALUE, DERIVATION_INPUT ou CONCEPT identifica como a referência sustenta o número. |
| MissionConfig | inputHash único; pacote e versões | Entrada congelada para uma execução. |
| Run | inputHash + resultHash únicos | Resultado calculado e estado de verificação preservados. |
| Observation | run+registro; FK composta | Contagem por registro impede duplicação oculta em agregado. |
| RunEvent | run+eventID; ordinal único | Evento tem ordem, instante, regra e valores. |
| TraceChunk | run+ordinal; hash | Trace particionável sem reclassificar resultado. |
| ImportClaim | envelopeHash único; run recomputado | Alegação importada fica separada da reexecução. |
| Draft | id + revisão CAS na aplicação | Edição concorrente exige revisão esperada. |

As FKs compostas impedem associar uma observação ou parâmetro a uma fonte de outro pacote apenas porque os IDs individuais existem. `onDelete:Restrict` preserva dependências de execução; cascatas ficam nos filhos pertencentes ao mesmo agregado. Isso não substitui uma política operacional de retenção e backup quando houver backend real.

## 2. Tipos e limitações

BigInt no banco representa contadores de bits; na API JSON, a representação é string decimal. A versão atual também limita os contadores ao domínio de inteiros seguros usado no motor. Float no schema para energia/tempo é uma projeção, não a representação racional interna. Uma evolução que precise preservar cada fração deve armazenar numerador/denominador ou unidade inteira documentada e versionar o contrato.

O schema não impõe todos os checks de domínio: faixa de NDVI, energia não negativa, relação entre bits, validade das datas, replay compatível e ordem temporal continuam em validadores/transações de aplicação. SQLite e Prisma não transformam um JSON de resultado em prova científica. A integração futura precisa implementar transação única para Run, eventos, observações e trace e testar interrupção antes/depois do commit.

## 3. IndexedDB efetivo

Nesta entrega, o banco local `mission-ipe-research-v1` contém runs e drafts. A escrita resolve após transaction.complete. O índice composto inputHash + resultHash impede duplicação da mesma execução. Cada leitura confere formato e integridade. O rascunho usa compare-and-swap atômico; duas abas com a mesma revisão não confirmam duas escritas concorrentes como se ambas fossem atuais.

Os testes fake-indexeddb exercitam conflito, quota, rollback e request success seguido de abort. São testes de contrato com implementação de teste da API; não substituem comportamento real de quota/evicção em Chromium, Firefox ou Safari. Alterar porta/origem ou localização do HTML pode mudar o armazenamento do navegador; exportar recibos antes de mover a instalação. Um arquivo JSON exportado permanece portátil dentro das versões suportadas.

## 4. Comando de validação

```bash
npm exec --yes --package=prisma@7.10.1 -- prisma validate --config prisma/prisma.config.ts
```

Esse comando pode acessar o registro se a CLI não estiver no cache. O runtime do jogo não precisa dele. Para offline de desenvolvimento integral, provisionar também CLI e dependências na plataforma-alvo. Não executar migrate/reset em dados existentes sem revisar o destino e a operação.
