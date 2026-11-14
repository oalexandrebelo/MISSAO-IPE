# Publicação PROJETO IPÊ — R14

Publicado e conferido em **14/11/2026**: três missões científicas, cenas 3D ligadas aos eventos, quatro modelos NASA, revisão local em equipe e a marca SVG original enviada pelo autor.

- [Jogar — Cerrado, Bennu e Telescópio](https://projeto-ipe.vercel.app/lab/index.html)
- [Portal público](https://projeto-ipe.vercel.app/)
- [Implementação e continuidade para dois desenvolvedores](https://projeto-ipe.vercel.app/docs/31-TRES-MISSOES-CIENTIFICAS-R14.html)
- [Modelos NASA, créditos e limites](https://projeto-ipe.vercel.app/docs/30-ATIVOS-NASA-IMPLEMENTADOS.html)
- [Biblioteca — 89 documentos](https://projeto-ipe.vercel.app/context/research-library.html)
- [Logo vetorial](https://projeto-ipe.vercel.app/brand/projeto-ipe-logo.svg)
- [Código e documentação no GitHub](https://github.com/oalexandrebelo/PROJETO-IPE)

## Versão e implantação

Beta `0.5.0-beta.1`, distribuição `R14-scientific-missions`. Commit da implementação: `1a2990fbc304cb2c5add26f063d948bdd8f0238b`. Primeira implantação conferida: `dpl_9z4jXZ89cGM4iprckASM9GmNQnna`, em estado `READY`, com o domínio principal atribuído. O [recibo remoto R14](evidence/production-r14.json) identifica o instante e os arquivos verificados.

O site está público, sem login. Este registro é posterior à primeira compilação; seu push pode acionar outra implantação da documentação pela conexão Git. O recibo certifica apenas a implantação identificada. A biblioteca conserva o corte de seu build e aponta para este documento no GitHub.

## O que foi entregue

- **Marca original:** símbolo de `ARTE .svg` e lettering de `Vector.svg` em composição horizontal 900×320, sem fundo, bitmap ou fonte externa. As 99 curvas do símbolo e 14 do lettering preservam a paleta fornecida. Originais, histórico e hashes ficam em `experiments/mission-design-lab/public/brand/`. [Procedência](docs/23-IDENTIDADE-VISUAL.md).
- **Três casos científicos:** Cerrado com registros históricos Terra/MODIS; levantamento didático de Bennu; comparação de faixas infravermelhas por telescópio fictício. Cada caso traz história, propósito e limites de interpretação.
- **Engenharia de sistemas:** usuários, lançamento, segmento espacial e solo aparecem conectados. Bennu e Telescópio têm necessidade, requisitos, projeto, verificação, operação e retorno. Lançador, perfil orbital, instrumento, energia, contatos e vida operacional alteram o resultado.
- **3D ligado ao tempo:** voltar a um evento mostra o último estado disponível, sem antecipar observações. Energia, fila, iluminação, contato e recepção seguem o cálculo. Comparação A/B das expedições usa o mesmo segundo; as tentativas permanecem preservadas.
- **Quatro modelos oficiais locais:** CubeSat genérico, DSN 70 m, Bennu e JWST, com 7.462.304 bytes de GLB, créditos, hashes e decoder Draco local. A geometria do Webb é agrupada em memória para reduzir objetos sem substituir o arquivo original.
- **Equipe e documentação:** revisão dos quatro papéis por até quatro pessoas no mesmo dispositivo. Edição invalida revisões anteriores. Projetos das expedições podem ser salvos, restaurados, exportados e importados; relatórios finais são exportáveis. Guia dos dois devs descreve contratos, arquivos, aceites e lacunas.

Os novos registros de Bennu e Telescópio são **sintéticos**, identificados na interface. Os modelos NASA são referências geométricas; não fornecem os parâmetros de engenharia. As 2 ou 3 horas representam operação depois da chegada. Não há integração GMAT/JPL em tempo real, trajetória de transferência, controle real da DSN nem multijogador remoto. O motor e a persistência próprios do Cerrado foram preservados.

## Verificação

- **129 testes de domínio, 17 de interface, 24 de contexto e 17 de distribuição/HTTP passaram.** TypeScript e compilação aprovados.
- Verificação remota sem cookies ou autorização: **212 arquivos com HTTP 200 e SHA-256 correspondente**, MIME correto dos GLBs e WebAssembly, política de scripts conferida e biblioteca com 89 documentos.
- No navegador: os três casos locais concluíram o roteiro viável 6/6; eventos, retorno científico, geometria e textura foram inspecionados. Logo conferida em fundo claro e escuro; viewport de390px sem rolagem horizontal global na tela observada.
- Na produção: beta e portal abriram sem login; logo nova, antena e carregamento Draco do Webb conferidos. Nenhum novo erro de console da origem pública nas interações observadas.

Recibos: [revisão local R14](evidence/revision-r14.json), [publicação R14](evidence/production-r14.json), [histórico R13](evidence/production-r13.json).

Os testes DOM não comprovam GPU, aprendizagem ou acessibilidade completa. Não foram medidos FPS nem desempenho em dispositivo físico; primeiro acesso offline continua sem ensaio. Recursos NASA não representam endosso institucional, qualificação de voo ou elegibilidade no desafio.
