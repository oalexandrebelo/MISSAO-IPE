# Arquitetura da nova LP

```mermaid
flowchart TD
  A["Next.js App Router"] --> B["HTML estático e fontes locais"]
  A --> C["Ilhas interativas React"]
  C --> D["GSAP e preferência de movimento"]
  C --> E["Laboratório sob demanda"]
  C --> F["Remotion sob demanda"]
  E --> G["Motor determinístico do beta"]
  G --> H["Registros históricos locais"]
  G --> I["Resultado e download JSON"]
  F --> J["Composição de 24 segundos"]
  B --> K["Links para beta e pesquisa existentes"]
```

O HTML de apresentação é produzido em `app/page.tsx`. Navigation, Roadmap e MotionSystem controlam interações. MiniLab é carregado perto do viewport e recalcula somente quando cenário/estratégia mudam. MissionPlayer importa ao abrir o dialog; a composição nunca é enviada na renderização inicial. Não existem rotas de escrita, banco, autenticação ou coleta analítica.

Dados imutáveis e caminhos de links ficam em `lib/content.ts`. O motor copiado fica em `lib/mission`. O manifesto de assets e as licenças fixam a procedência. `output: export` entrega arquivos estáticos. Node é necessário para desenvolvimento/build e para o servidor de conveniência; qualquer servidor HTTP estático pode publicar o diretório out.

O repositório raiz continua com seu runtime e processo de publicação próprios. A nova aplicação não altera o motor do jogo, migrations ou o schema Prisma existente. A imagem terrestre representa direção de arte; não é um mapa projetado nem uma fonte para cálculos.
