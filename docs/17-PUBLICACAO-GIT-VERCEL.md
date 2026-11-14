# Publicação R6 — Git e Vercel

**AB-NASA-TEAM-IPE · 0.2.0-beta.1 · 14/11/2026.** Este registro separa o código versionado, os arquivos públicos e o deployment. Não altera o estado de elegibilidade Space Apps registrado na cronologia.

## Referências efetivas

| Recurso | Estado nesta revisão |
|---|---|
| Git local | Branch `main`; base R5 `3d6e8e9bd8dcb1618e00c6fc7ace181141cb4aaf`. O commit R6 é registrado no recibo final. |
| GitHub pretendido | `oalexandrebelo/AB-NASA-TEAM-IPE`, privado inicialmente. A criação depende de autenticação autorizada; não existe URL de repositório confirmada nesta revisão. |
| Projeto Vercel | Criado: `ab-nasa-team-ipe`, ID `prj_sGbtmlQ0fOsI06DKt2lZaBF6Eks7`. |
| Deployment | Preparação em andamento. A prova de publicação deve estar em `evidence/deployment-r6.json`. |
| Próximo corte | 15/11/2026, 08h BRT; critérios em `15-PLANO-RELEASE-20261115-0800.md`. |

O GitHub conectado identificou a conta autorizada, mas não expõe criação de repositórios. O CLI local não tem autenticação. O navegador de criação chegou à página de login. Não se extraíram credenciais de conectores, navegador ou outros projetos. O trabalho de publicação Vercel é independente dessa autenticação.

## Contrato do site

O upload recebe somente os arquivos de `site/`, mais a configuração estática de rotas/cabeçalhos. Não recebe `.git`, `node_modules`, variáveis de ambiente, source maps nem o relatório bruto do analisador. O repositório privado preserva o material completo de engenharia e sua procedência.

O projeto Vercel novo usa Node 24, framework `Other` e instalação de dependências vazia. Para futura integração Git, o comando é `node scripts/build-beta-site.mjs` e a saída é `site`. O `dist/` está versionado; esse build copia o motor já compilado, sem acesso ao npm. Alterar `src/` exige compilar e verificar `dist/` antes de commitar a atualização.

Para a publicação direta desta rodada, os arquivos estáticos são enviados por digest e o deployment usa raiz estática, sem etapa de compilação. As configurações para importação Git e upload estático são geradas do mesmo contrato de rotas. Uma não deve ser confundida com o diretório de saída da outra.

O projeto novo foi preparado para visita pública sem login Vercel. A alteração ficou restrita a `ab-nasa-team-ipe`; outros projetos não foram modificados. `publicSource=false` não transforma o código-fonte em um download público do provedor.

## Preparar a candidata

```bash
node scripts/build-beta-site.mjs
node scripts/prepare-vercel-static.mjs
node scripts/test-beta-site.mjs
node scripts/serve-beta.mjs
```

O teste `test-beta-site.mjs` exige as devDependencies `jsdom@31.0.1` e `typescript@7.0.2` do lockfile. Em um checkout novo, executar `npm ci` com acesso ao registro ou cache provisionado antes do teste. Build, preparação e servidor usam somente bibliotecas nativas do Node.

O primeiro comando monta uma árvore curada. O segundo calcula os hashes dos scripts inline, grava `vercel.json` para importação Git e `.vercel/deploy-config.json` para upload estático, além do manifesto de envio. O terceiro verifica a distribuição e grava seu recibo. O quarto serve a árvore em loopback para uso local; não é um servidor de produção.

Regenerar a política CSP antes de publicar quando qualquer script inline mudar. Não adicionar `unsafe-eval` para resolver erros de empacotamento. A política permite módulos e Worker da mesma origem, scripts inline identificados por hash, imagens/fontes locais ou incorporadas e downloads por blob. Não há rewrite universal que transforme um JS ou JSON ausente em HTML com status 200.

## Concluir GitHub com autenticação do titular

Quando o titular estiver autenticado por um mecanismo seguro no GitHub, criar o repositório privado com o nome exato. Se o repositório já existir, verificar proprietário, visibilidade e conteúdo antes de conectar a cópia local. Não sobrescrever histórico existente, não usar force-push e não colar tokens em mensagens ou documentos.

Para uma máquina do titular com GitHub CLI já autenticado e um repositório ainda inexistente:

```bash
gh auth status
gh repo create oalexandrebelo/AB-NASA-TEAM-IPE --private --source=. --remote=origin --push
```

O comando de criação só vale quando o alvo ainda não existe. Se um repositório vazio já tiver sido criado, conectar o remote e fazer o push normal da branch `main`. Conferir o commit remoto e só então registrar a URL como publicada. A criação de um projeto Vercel ou de um Git local não prova que esse push ocorreu.

Uma eventual cópia `.bundle` permite recuperar os commits sem depender da pasta de trabalho original:

```bash
git clone AB-NASA-TEAM-IPE.bundle AB-NASA-TEAM-IPE
```

Esse clone é local. Ele não cria repositório no GitHub nem executa publicação remota. Depois da recuperação, aplicar a mesma verificação de identidade/estado do alvo antes de enviar.

## Evidência de aceite e rollback

Registrar deployment ID, URL estável, estado `READY`, alvo de produção, manifesto enviado e respostas observadas. Conferir anonimamente entrada, jogo, Worker, apresentação, mapa, documentação, dados e uma rota inexistente. Uma consulta autenticada do provedor, sozinha, não prova acesso público.

Separar verificação de distribuição de ensaio real de navegador. O projeto tem testes de motor, DOM e HTTP com escopos próprios. A rodada R6 não reivindica qualificação visual, FPS ou estudo com participantes por ter concluído um deploy.

Se uma candidata falhar, conservar o deployment anterior identificado. Promover novamente uma versão conhecida só após verificar seu conteúdo e a ausência do defeito observado. Evitar exclusão de dados IndexedDB do visitante como resposta a falhas de distribuição. Mudança de domínio/origem cria outro espaço de persistência; exportar recibos antes dessa mudança.
