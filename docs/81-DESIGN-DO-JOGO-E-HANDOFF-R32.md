# R32 · revisão do design publicado e handoff

## A arquitetura já é interativa

O endereço `/lab/index.html` serve a aplicação React 19, TypeScript, Vite e React Three Fiber/Three.js. O HTML é a entrada compilada. A API de métricas usa Node na Vercel. A LP principal usa Next.js, e os documentos públicos são estáticos. A revisão corrige a apresentação da experiência; não há migração de framework nem nova dependência.

## O que mudou

A tela deve priorizar a nave, a escolha atual e a próxima ação. Na versão anterior, ferramentas de câmera, referências e diagramas competiam visualmente com a montagem; no celular, era necessário rolar mais para encontrar as opções.

- **Sete hangares:** a plataforma Kenney continua local e íntegra, com acabamento azul-aço fosco sobre sua textura original. A profundidade menor e a grade discreta deixam a nave em primeiro plano. Os lançadores continuam apoiados. A nave de ISS/Lua/Marte/Europa fica 12% maior na montagem normal, preservando tamanho e folgas na vista separada e no voo.
- **Campanha Bruno:** a indicação da escolha fica junto à nave. “Ir às opções” recebe prioridade, e a referência NASA vira ação de apoio. Os nomes A/B aparecem quando há comparação. No celular, o evento e os controles da operação vêm antes da cena.
- **Cerrado, Bennu e Webb:** o resumo HTML do sistema fica logo depois da imagem. Ferramentas de câmera, diagrama Rive e agenda têm seções expansíveis na bancada compacta; comunicação mantém a agenda visível. O diagrama só carrega quando aberto. Cerrado ganhou o retorno “Ir às opções” com foco no sistema em edição.
- **Leitura em tela pequena:** plaquetas 3D são omitidas em canvas com menos de 480 px; o resumo HTML preserva os números, sem cobrir as peças. Botões de inspeção e alternativa 2D continuam disponíveis.
- **Continuidade:** sair do lobby para loja, acervo ou progresso e voltar preserva o destino escolhido durante a participação. O fluxo Nome → E-mail → Tipo → Play é mantido. O rodapé móvel deixa de repetir a marca e corrige o singular de tentativa.

## Contratos dos dois devs

**Dev A · motor e registros.** Nenhum resultado científico, orçamento, inventário, pontuação ou regra de desgaste foi alterado. A memória do destino pertence apenas à navegação da participação ativa; não substitui persistência do progresso nem cria outra identidade. A confirmação de recebimento das métricas continua distinta do render da tela de resultado.

**Dev B · cena e interface.** Mantenha controles equivalentes em HTML, foco visível, movimento reduzido e alternativa 2D. Se uma placa sair do canvas estreito, preserve seu conteúdo em texto legível. Uma seção recolhida não deve manter animação secundária consumindo recursos. Não adicione uma transição que esconda falha, cause espera obrigatória ou apresente previsão como sucesso executado.

As escolhas científicas continuam explicadas no [handoff R30](76-COCKPIT-SETE-MISSOES-E-HANDOFF-R30.md). Proveniência da plataforma e integração do Bruno: [R31](80-HANGAR-KENNEY-E-HANDOFF-R31.md) e [auditoria](78-AUDITORIA-BRUNO-E-INTEGRACAO-R31.md). A revisão aplica hierarquia e divulgação progressiva do Impeccable e das [skills de game design consultadas](79-GAME-DESIGN-E-SKILLS-R31.md).

## Validação e limites

A aplicação passou nos **180 testes de domínio, 161 de interface e 53 de métricas**. O build completo e as **20 verificações da distribuição e das rotas** também passaram. No navegador, o candidato foi exercitado a **390 × 844 px** e em desktop. O ensaio local confirmou:

- ISS: escolha de bateria de 360/640 Wh refletida no resumo junto da nave, plataforma Kenney carregada e comparação A/B com rótulos próprios.
- Operação: evento e controles antes da cena na ordem móvel; conclusão com 92/100, seis registros válidos, prêmio confirmado e desgaste de 2 para 1 ciclo.
- Nova aba na mesma participação: duas tentativas, carteira com 32 créditos e instrumento com 1/3 ciclos, preservados após a execução.
- Progresso: 14 eventos confirmados, nenhum pendente ou recusado; duas execuções de ISS continuam contando como apenas um destino cumprido.
- Cerrado: bateria de 24 Wh refletida na cena e no resumo; retorno às opções leva o foco ao título “Bateria”; controles expansíveis e alternativa 2D operantes.
- Lobby: Webb continua selecionado ao voltar de Meu progresso. Nenhum erro de console nem transbordamento horizontal foi observado nesses percursos.

A geometria também tem testes automatizados de enquadramento em canvas estreitos; isso não equivale a testar telefone físico. O servidor de QA usa armazenamento de teste em memória: a nova aba prova a retomada nessa sessão, não durabilidade após reiniciar o servidor. A publicação terá verificação separada de arquivos e limites de acesso. Os percursos completos anteriores das sete missões estão no handoff R30; nesta revisão não foram repetidos sete voos completos nem pesquisa educativa com participantes.

## LP principal

A abertura explica o percurso de montar, operar e investigar os dados. “Jogar agora” é a ação principal, acompanhada de “Documentação”; os dois caminhos aparecem também no menu móvel. Filme e fontes são apoios, com a identidade e os assets locais preservados.

O export Next.js, TypeScript, quatro testes do motor e a integridade de 21 assets passaram. No navegador, a LP foi conferida em 1280 px, 390 px e 320 px: ações visíveis, sem transbordamento, menu com retorno de foco via Escape. O laboratório interativo respondeu à troca do projeto de 2/6 para 6/6 registros. O spec Playwright foi atualizado, mas não executado nesta rodada; a interação foi verificada com a automação nativa do navegador.

## Entrada principal e documentação

A LP principal permanece em `https://projeto-ipe-lp.vercel.app/`. A raiz `https://nasa-missaoipe.alexandrebelo.com/` abre essa LP por redirecionamento, preservando uma única entrada promocional. O antigo hub da raiz passa a ser acessado por `/documentacao`, e o índice de documentos técnicos continua em `/docs/index.html`. Jogo, API e painel permanecem nos caminhos existentes.

## Acessos oficiais

[Jogar](https://nasa-missaoipe.alexandrebelo.com/lab/index.html) · [LP](https://projeto-ipe-lp.vercel.app/) · [Apresentação](https://missao-ipe-central-ab.alexandrebelo.chatgpt.site/) · [Painel privado](https://nasa-missaoipe.alexandrebelo.com/dashboard/index.html) · [Documentação geral](https://nasa-missaoipe.alexandrebelo.com/documentacao) · [Índice técnico](https://nasa-missaoipe.alexandrebelo.com/docs/index.html).
