# PROJETO-IPÊ — verificação do beta 0.5

Data: **14/11/2026**, referência de apresentação America/Sao_Paulo. Este registro separa teste automático, validação de contratos, observação visual e publicação.

## Domínio e integridade

`npm test` passou com **120 testes, zero falhas, zero ignorados** em Node 24.22.1. O relatório está em [`evidence/domain-test.tap`](../evidence/domain-test.tap). Os 19 testes novos de campanha complementam os 101 testes anteriores sem alterar o motor `0.1.1-rd`, o catálogo `ipe-64-v1` ou os arquivos científicos.

A cobertura inclui conservação de bits e energia, limites de massa/orçamento/potência, qualidade científica, identidade byte a byte das fontes, recálculo de replay, persistência, modelos físicos independentes e requisitos dos quatro capítulos. A busca contextual avalia 64 configurações por capítulo, com 17 / 6 / 1 / 2 soluções elegíveis e nenhum caso indeterminado.

## Jornada React

`npm run test:ui` passou com **14 testes, zero falhas**. Recibos: [`ui-dom-test.tap`](../evidence/ui-dom-test.tap) e [`ui-dom-test.json`](../evidence/ui-dom-test.json).

O fluxo integrado confirma:

1. Previsão e justificativa antes da execução.
2. Nível 1 concluído por tentativa própria; níveis posteriores bloqueados antes disso.
3. Nível 2 com perda de lotes na configuração inicial, ajuda que preserva 512 Mbit e redesign 6/6.
4. Nível 3 com contato curto, busca que preserva BANDAS e solução 6/6.
5. Nível 4 com missão operacional 6/6 a 84 créditos sem concluir o capítulo; conclusão após redesign elegível até 78.
6. Restauração da campanha concluída; replay importado não concede progresso.
7. Resultados existentes preservados diante de importação inválida e falha de armazenamento.

O ambiente é jsdom com fake-indexeddb. Esses testes usam o motor real, mas não medem GPU, renderização, foco modal nativo, leitor de tela, Worker real ou durabilidade do armazenamento do navegador.

## Contratos técnicos

O schema com **12 modelos** passou por `prisma format` e `prisma validate`, usando **Prisma 7.10.1**. SHA-256 do schema:

```text
94febcdc03d58830da102d1af5a3f270e2b5120b9c64338b815094509302c521
```

Os **seis diagramas** passaram por `mermaid.parse` em **Mermaid 11.14.0**. Os seis blocos de [`FLOWCHARTS.md`](FLOWCHARTS.md) foram comparados com os `.mmd` e são idênticos. A validação não conecta banco nem aplica migração. A arquitetura cloud permanece proposta.

## Build e documentação pública

`npm run build` executa o gerador de pesquisa, o recibo público de versão, TypeScript estrito e Vite. O documento `/release.json` identifica versão, ambiente e, quando fornecido pela Vercel, o commit do build. Builds locais não afirmam um SHA de publicação.

O bundle de cena 3D permanece separado e gera aviso de tamanho superior a 500 kB. O motor também é usado por replay e progressão, portanto os avisos de importação dinâmica sem separação efetiva são conhecidos. Isso não foi convertido em alegação de desempenho; medição em dispositivos continua pendente.

## Observação visual

A inspeção local desta rodada foi interrompida pela política de URL do navegador de QA após a prévia deixar de estar acessível. O erro bloqueou o acesso ao frame; não houve tentativa de contornar a restrição. As capturas históricas R9–R10 permanecem identificadas como anteriores, em [`evidence/ui/`](../evidence/ui/).

A revisão de contraste dos novos painéis usou os valores CSS efetivos navy/lime: texto secundário sobre navy 7,52:1 e sobre o fundo de sucesso 6,47:1. Esse cálculo cobre essas combinações, sem estabelecer conformidade WCAG para toda a aplicação.

## Publicação e inspeção pública

A campanha foi publicada em `/campanha/index.html`, preservando o R14 em `/lab/index.html`. A implantação `dpl_DHsVtWQurf2w9do6bhcnXdD84aJT` ficou READY no commit `f30ca994098262b75a86b25784b78657c34c0db5`; o recibo público de versão confirmou esse SHA.

Na URL pública, o primeiro nível executou com 6/6 registros válidos e liberou o nível 2. O mapa carregou estilos e scripts, navegou até o capítulo de níveis e selecionou o nível 4. A documentação exibiu 21 documentos e 160 referências. O PowerPoint baixado pelo mapa é idêntico ao arquivo local validado, SHA-256 `01580db767d9bc8d4002cc75d179ea71886930c8211e3a1fa6978e9d3954af11`.

O ambiente apresentou a alternativa 2D. Esta inspeção pública não comprova 3D, todos os dispositivos ou a jornada completa fora do teste DOM. O problema observado de normalização de barra nas URLs de diretório foi corrigido com redirecionamentos explícitos para `index.html`. A checagem estática das rotas verificou 430 referências, sem erros. [Recibo completo e capturas](../evidence/production-smoke-2026-11-14.json).

## Limites de evidência

Não houve estudo com participantes, teste de transferência de aprendizagem, validação de voo, auditoria WCAG completa, medição de 60 FPS ou teste de recarga offline a frio. A conclusão de um capítulo é uma evidência de atendimento das regras do modelo, não uma medida automática de compreensão do jogador.
