# Acessibilidade e Libras na MISSÃO IPÊ

## Como usar

1. Selecione um trecho público em português na página e escolha **Libras**.
2. Na janela, abra o botão azul do VLibras. Assim que o avatar estiver pronto, ative o botão com o trecho. Você pode usar Tab para navegar e Enter ou Espaço para acionar os botões.
3. Use **Fechar Libras** ou Esc para voltar. Se o serviço estiver indisponível, use o link para o tradutor oficial. O texto e os controles do site continuam disponíveis.

Sem seleção, a janela traz um breve guia de navegação. O laboratório com cadastro e o painel privado oferecem **Guia em Libras**, com instruções públicas preparadas para cada tela. Nomes, e-mails, chaves, sessões, respostas e resultados individuais ficam fora do guia.

## Onde está disponível

O acesso é gerado para o portal, apresentação e pitch, laboratório, campanha, jogo, central de equipe, painel, pesquisa, arquitetura, documentação e cópias públicas dos arquivos HTML históricos. A landing page imersiva oferece o mesmo recurso nas suas rotas, inclusive créditos e página 404. Os arquivos originais para uso local preservam seus bytes. A tradução automática precisa de internet.

## Integração e dados

O botão local abre uma janela com o widget oficial da Secretaria de Governo Digital e da UFPB. O navegador executa o widget em um iframe com origem isolada. O script remoto fica restrito ao guia e recebe apenas o trecho público selecionado antes da abertura, limitado a mil caracteres. Formulários e regiões marcadas como privadas ficam fora da seleção. No laboratório e no painel o iframe recebe apenas a indicação do guia público correspondente, sem ler a seleção ou consultar o serviço privado de métricas.

O serviço do VLibras recebe os trechos enviados para sinalização. Segundo o aviso oficial, o conteúdo de tradução em tempo real é descartado após a exibição. Use textos públicos e mantenha dados pessoais e credenciais fora do campo livre do tradutor. Os domínios externos são autorizados apenas no guia isolado. [Termos de Uso e Aviso de Privacidade](https://www.vlibras.gov.br/privacy.html)

A tradução se limita à leitura pontual de texto na interface. O conteúdo visual da cena 3D, imagens e vídeos requer alternativas próprias. Arquivos PDF e Markdown baixados dependem do leitor usado. Os termos do VLibras restringem o uso das traduções automáticas em aulas, palestras, filmes e outros contextos que exigem interpretação contextual. A integração não estabelece conformidade integral com WCAG nem comprova a qualidade da sinalização em Libras. [Apresentação do manual](https://vlibras.gov.br/doc/widget/introduction/presentation.html) · [Termos de Uso](https://www.vlibras.gov.br/privacy.html)

## Fontes e continuidade

Na revisão local R21, a inspeção estrutural verificou 81 páginas HTML: todas tinham título e idioma, sem IDs duplicados na marcação inicial. A análise automática de acessibilidade amostrou 18 endereços; também foram exercitados no Chrome o cadastro, a confirmação de encerramento, o painel privado e os controles do mapa por teclado, incluindo largura de 320 px. No guia isolado, o avatar oficial carregou e sinalizou um trecho público. Foram corrigidos contraste, foco, nome do cronômetro e a região de navegação do atalho Libras. Esse alcance não equivale a uma auditoria humana completa com leitores de tela e usuários de Libras.

- O repositório vlibras-web-browsers implementa o widget e as extensões. A suíte também mantém os repositórios da API de tradução, núcleo de texto, portal e player. A referência de código conferida foi o pacote público v7.12.3. [Organização VLibras](https://github.com/spbgovbr-vlibras) · [Código do widget](https://github.com/spbgovbr-vlibras/vlibras-web-browsers/tree/v7.12.3)
- A distribuição segue o endereço oficial e carrega o widget sob demanda. A documentação identifica o iframe do avatar e o redirecionamento de fontes para a CDN. A política de conteúdo do guia autoriza apenas as origens necessárias ao widget, ao avatar, à tradução e ao dicionário. [Instalação](https://vlibras.gov.br/doc/widget/installation/webpageintegration.html) · [Política de segurança de conteúdo](https://www.vlibras.gov.br/doc/widget/installation/content-security-policy.html)
- Após atualizar o widget ou mudar as rotas, confira abertura, sinalização de uma frase pública, falha de rede, retorno de foco, resolução no celular e proteção do painel. Faça a revisão linguística com pessoas fluentes em Libras antes de tratar a tradução automática como validada para o projeto.
