# Campanha didática de quatro níveis — PROJETO-IPÊ

Esta integração acrescenta uma sequência jogável do caso Cerrado em `/campanha/index.html`, com código próprio em `experiments/four-level-campaign/`. A edição R14, com Cerrado, Bennu e Telescópio, continua em `/lab/index.html`. Os contratos das experiências são separados.

## Acessos

- [Jogar a campanha](https://projeto-ipe.vercel.app/campanha/index.html)
- [Mapa interativo e notas de apresentação](https://projeto-ipe.vercel.app/campanha/apresentacao/index.html)
- [Pitch editável de dez slides](https://projeto-ipe.vercel.app/campanha/apresentacao/PROJETO-IPE-Pitch.pptx)
- [Documentação e pesquisa completas](https://projeto-ipe.vercel.app/campanha/research/index.html)
- [Código, PRD, PRT e handoff](https://github.com/oalexandrebelo/PROJETO-IPE/tree/main/experiments/four-level-campaign)

## Progressão

| Nível | Pessoa fictícia | Objetivo adicional ao sucesso 6/6 |
|---|---|---|
| Primeiro sinal | Lina Duarte | Entregar os seis registros em contatos longos |
| Memória em disputa | Caio Mendes | Manter 512 Mbit de memória |
| Janela estreita | Joana Costa | Contatos curtos e preservação das bandas R/NIR |
| Ciência que chega | Ravi Almeida | Contatos curtos e custo de até 78 créditos |

O nível final começa com um projeto que já entrega 6/6 por 84 créditos. Seu objetivo é economizar mantendo a ciência. O motor precisa indicar sucesso; seis registros recebidos não dispensam as restrições de engenharia. Os níveis são liberados por tentativa própria, com previsão e recálculo. Replay e histórico não concedem progresso. Reflexão é opcional, sem nota automática.

A busca contextual avalia as 64 configurações e encontra 17 / 6 / 1 / 2 soluções elegíveis. Ela preserva os requisitos do briefing. A dificuldade cresce pela autonomia e pelo raciocínio, não por uma regra de aumento obrigatório do número de mudanças.

## Conteúdo e stack

A pasta contém PRD, Plano de Requisitos Técnicos, storytelling, 14 oportunidades, handoff, arquitetura, seis fontes Mermaid e schema Prisma com 12 modelos. A documentação HTML reúne 21 documentos, 160 URLs externas e 20 equações. O mapa tem sete capítulos e notas; o pitch oferece versões de 30 s, 90 s, 3 min e dez slides editáveis.

React 19.3.1, TypeScript 7.0.2, Vite 8.3.8, Node 24, Three.js 0.187.0, R3F 9.8.2 e Drei 10.7.9. Motor 0.1.1-rd, catálogo ipe-64-v1, campanha ipe-campaign-v1. Persistência local; Prisma/PostgreSQL permanecem proposta de evolução, sem banco conectado.

## Verificação desta integração

A suíte própria passou com **120 testes de domínio e integridade e 14 testes de interface**. Build e TypeScript passaram. Prisma 7.10.1 validou os 12 modelos; Mermaid 11.14.0 aceitou os seis diagramas. O pitch teve dez slides renderizados e inspecionados pelo runtime de autoria. Após a integração, a checagem estática verificou 430 referências internas, arquivos e âncoras sob `/campanha/`, sem erros.

Os testes DOM usam jsdom e fake-indexeddb. Não demonstram GPU, aprendizagem, acessibilidade completa ou durabilidade do armazenamento. A inspeção local de navegador desta rodada encontrou bloqueio de URL; os registros históricos permanecem identificados. O recibo de publicação deve registrar separadamente commit e estado remoto verificado.

## Reprodução

```bash
npm --prefix experiments/four-level-campaign ci
npm --prefix experiments/four-level-campaign run verify
npm --prefix experiments/four-level-campaign run dev
```

O build da distribuição compila as duas aplicações. O empacotador copia apenas extensões públicas permitidas da campanha para `site/campanha/`, registra hashes e inclui os scripts inline na política CSP. Source maps, dependências, configuração de hospedagem anterior e variáveis de ambiente não são publicados.

Personagens, nave e catálogo operacional são didáticos. Os seis registros MODIS e sua procedência são históricos e reais. Nenhum endosso institucional, estudo humano ou qualificação de voo é declarado.
