# PROJETO IPÊ — Ciência que chega

Jogo educativo de engenharia de missões espaciais. Projete um CubeSat fictício, formule uma hipótese, execute a missão e investigue como entregar seis registros históricos de vegetação do Cerrado dentro dos limites de massa, orçamento, energia, potência, memória e comunicação.

**Beta atual: 0.4.0-beta.2. Portal e pesquisa: edição R11, 14/11/2026.**

## Explorar

- [Portal interativo: contexto, etapas e fontes NASA](https://projeto-ipe.vercel.app/)
- [Jogar o beta atual](https://projeto-ipe.vercel.app/lab/index.html)
- [Contexto e cronograma detalhados](https://projeto-ipe.vercel.app/context/index.html)
- [Biblioteca integral](https://projeto-ipe.vercel.app/context/research-library.html)
- [Apresentação e pitch](https://projeto-ipe.vercel.app/presentation/Missao_Ipe_Apresentacao.html)
- [Documentação pública](https://projeto-ipe.vercel.app/docs/index.html)
- [Jogo clássico preservado](https://projeto-ipe.vercel.app/game/index.html)

O recibo de publicação está em [PUBLICADO.md](PUBLICADO.md). Metas ou evidências históricas não comprovam uma nova publicação por si só.

## O que existe

O beta oferece seis escolhas binárias, 64 configurações, dois cenários de contato, revisão pré-voo, diário de eventos, sete requisitos com evidência, comparação de tentativas, replay recalculado e laboratório de física. Dados históricos MOD13Q1.061 permanecem separados dos parâmetros didáticos da nave. A cena 3D não decide o resultado do motor.

O portal tem seis etapas navegáveis, catálogo pesquisável de 13 fontes e quatro níveis narrativos propostos. Semente/Raízes reaproveitam os dois cenários existentes; Copa/Horizonte ainda são propostas. Novas integrações NASA/JPL não foram implementadas nesta edição.

## Código e documentação

| Material | Local |
| --- | --- |
| Beta 0.4.0-beta.2 / R10 | `experiments/mission-design-lab/` |
| Portal HTML interativo | `web/index.html` |
| PRD / PRT | [PRD](docs/02-PRD.md) / [PRT](docs/03-PRT.md) |
| Fluxogramas Mermaid | [Fluxogramas](docs/04-FLOWCHARTS.md) |
| Prisma proposto, sem banco implantado | [schema.prisma](prisma/schema.prisma) |
| Pesquisa atual de APIs e materiais | [Oportunidades NASA](docs/21-OPORTUNIDADES-NASA.md) |
| Estado e sequência de trabalho | [Plano de continuidade](docs/22-PLANO-CONTINUIDADE.md) |
| Origem e curadoria pública | [Procedência](GIT-PROVENIENCIA.md) |

Stack existente: React, TypeScript, Vite, Three.js, React Three Fiber e Drei; motor em Worker, persistência no navegador e publicação estática. Sem serviço de pontuação remoto ou nova dependência adicionada nesta edição.

## Executar e compilar

Requer Node 24. Instalação e compilação da distribuição completa:

```bash
npm --prefix experiments/mission-design-lab ci --ignore-scripts --no-audit --no-fund
npm run build:release
npm run start:beta
```

Abra `http://127.0.0.1:4175/`. Para desenvolver o beta: `npm --prefix experiments/mission-design-lab run dev`. O arquivo `portable/Missao_Ipe_Local.html` é a alternativa autocontida do jogo clássico.

O build compila o beta para `/lab/`, preserva a versão clássica em `/game/`, monta apenas os materiais públicos em `site/` e calcula os hashes de scripts para a política CSP. O `dist/` da raiz é o runtime clássico preservado; alterações em `src/` da raiz exigem recompilação própria.

## Verificar

```bash
npm ci --ignore-scripts --no-audit --no-fund
npm test
npm --prefix experiments/mission-design-lab run verify
npm run build:release
npm run test:context
npm run test:beta
```

Verificados nesta entrega: 101 testes de domínio do beta, 9 testes de interface, 51 testes do motor clássico, 24 verificações da central e 15 verificações da distribuição/HTTP. Também foi executado no navegador o cenário longo com 6/6 registros válidos e foram conferidas as interações do portal e o layout de celular. Isso não substitui pesquisa de aprendizagem, auditoria completa de acessibilidade ou validação de voo.

## Próximos passos

1. Validar uso e aprendizado com jogadores.
2. Refinar narrativa e fichas usando os materiais NASA.
3. Preparar coleta sequencial e snapshots com procedência.
4. Validar uma campanha de pequenos corpos com SBDB, Mission Design e Horizons.
5. Ensaiar a apresentação e confirmar regulamento/elegibilidade do desafio.

A documentação histórica mantém seus cortes originais. O plano de continuidade é a referência da evolução atual. Nenhuma tarefa futura foi agendada automaticamente.

## Licenças e atribuições

Código original sob Apache-2.0; dependências e materiais de terceiros conservam suas licenças em `licenses/`, nos diretórios vendor e em [NOTICE.md](NOTICE.md). Assistência de IA em pesquisa, programação e redação está declarada. Referências NASA não significam endosso institucional. Condições oficiais de participação e elegibilidade ainda requerem confirmação.
