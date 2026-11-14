# Missão Ipê — kit de apresentação R5

**14/11/2026 · AB / Hackatur–Zer0Slop · jogo 0.1.1 · motor 0.1.1-rd.**

Extraia o ZIP inteiro antes de abrir os arquivos. Preserve a pasta `ab-mission-ipe`: os links locais dependem dessa estrutura. `COMECE_AQUI.html` é a entrada do pacote.

## Apresentar

Abra `COMECE_AQUI.html` e escolha **Abrir apresentação**. O arquivo `ab-mission-ipe/presentation/Missao_Ipe_Apresentacao.html` incorpora seu CSS, JavaScript e o núcleo do demonstrador. Não requer CDN, conta, chave de API ou download de modelos. O pitch curto possui sete quadros principais e a exploração técnica possui seu próprio modo. O roteiro PT/EN acompanha a apresentação.

O HTML pode ser usado separadamente, mas os links para jogo, documentos e dados complementares precisam da estrutura do ZIP. Os comandos de tela cheia e impressão dependem do navegador. O ensaio visual e os testes em equipamento real continuam pendentes; o relatório da rodada identifica exatamente as camadas verificadas.

## Jogar e apresentar em uma origem local

Com Node 24 ou superior instalado, abra um terminal na pasta principal extraída e execute:

```bash
node ab-mission-ipe/scripts/serve-presentation-kit.mjs
```

Abra `http://127.0.0.1:4174`. O servidor utiliza somente bibliotecas nativas de Node. Não precisa executar `npm install` para servir os builds incluídos. O botão do jogo abre `dist/index.html`, com Worker; a apresentação permanece um documento separado.

Os arquivos `INICIAR_MAC_LINUX.command` e `INICIAR_WINDOWS.cmd` contêm esse mesmo comando para conveniência. As permissões e associações do sistema operacional podem exigir que você use o terminal. Não foram executados em macOS ou Windows nesta rodada. Encerre o servidor com Ctrl+C. Para outra porta:

```bash
node ab-mission-ipe/scripts/serve-presentation-kit.mjs --port 4175
```

Sem servidor, o botão do jogo usa `ab-mission-ipe/portable/Missao_Ipe_Local.html`. Essa versão executa o núcleo na thread principal. O armazenamento em origem `file:` varia entre navegadores. Exportar uma execução antes de mudar origem, porta ou local do arquivo evita depender da retenção do navegador.

## Conteúdo

| Local | Conteúdo |
| --- | --- |
| `presentation/` | HTML interativo, fontes, roteiro PT/EN e manual do apresentador |
| `portable/` e `dist/` | Jogo compilado em arquivo único e build servido |
| `src/`, `tests/`, `tests-ui/`, `scripts/` | Código, testes e ferramentas de reprodução |
| `docs/` e `specs/` | PRD, PRT, Mermaid, cronograma, contratos e handoffs |
| `prisma/` | Schema opcional e configuração, sem backend integrado |
| `research/` | Dez pareceres anteriores e revisão atual do Space Apps |
| `output/pdf/` e `output/html/` | Dossiê de base R4 com 112 páginas e estudo navegável |
| `public/data/` e `examples/` | Dados científicos e três execuções importáveis |
| `evidence/` | Recibos, hashes, benchmarks e limites das verificações |
| `references/user/` | Dois cartazes fornecidos como referência; não são assets de endosso |
| `licenses/`, `LICENSE`, `NOTICE.md` | Avisos e termos identificados |

Todos os caminhos da tabela são relativos a `ab-mission-ipe/`. O ZIP não duplica ZIPs anteriores nem inclui `node_modules` ou os READMEs integrais de terceiros recuperados apenas para pesquisa. Dependências de desenvolvimento exigem instalação ou cache preparado. O código privado do runtime AB-R3A não é redistribuído.

## Estado competitivo e científico

O desenvolvimento específico começou antes da abertura local. **Elegibilidade competitiva não estabelecida.** A cronologia real permanece em `evidence/chronology.json`. A revisão R5 conserva os limites de autoridade e recuperação das fontes oficiais. O vínculo com um recurso qualificado na lista Resources do desafio permanece uma pendência. A apresentação não é comprovante de submissão ou aprovação.

O tema principal é **Space Mission Design Game**. O cartaz de Marte é referência de expansão, sem missão marciana implementada. A versão atual usa dados MOD13Q1.061 históricos de 2024, com parâmetros de hardware e volume didáticos. Lançador e perfil orbital estão fixos. Não se trata de planejamento operacional de voo.

O roteiro de sete quadros e o texto de 30 segundos foram preparados como alternativas de apresentação. Orientações de Navigators foram diferenciadas de regras recuperadas diretamente da equipe organizadora. Conferir o formulário e o guia efetivos antes de enviar.

## Integridade e autoria

`MANIFESTO_SHA256.json` lista cada arquivo empacotado. Ele exclui a si próprio para evitar uma referência circular. Com Python 3.9 ou superior, execute `python3 VERIFICAR_PACOTE.py` na pasta extraída para conferir esses bytes. Hash verifica identidade do conteúdo, não autenticidade da autoria ou elegibilidade.

Código e documentação contam com assistência de IA. O jogo conserva cálculos determinísticos e revisão independente documentada. Não há execução Fastino ou modelo de linguagem no runtime. Nenhuma aprovação institucional é inferida.
