> **Continuidade R19:** as três prioridades agora estão implementadas. Use o [handoff R19](48-HANDOFF-DOIS-DEVS-R19.md) para código, roteiro e validação. Este documento preserva a migração dos dados reais.

# R18 — handoff de ciência, experiência e publicação

**15/11/2026 · MISSÃO IPÊ.** Repositório oficial: [oalexandrebelo/MISSAO-IPE](https://github.com/oalexandrebelo/MISSAO-IPE). Esta entrega substitui as medidas sintéticas de Bennu/Webb por dados publicados e mantém a simulação de recursos explicitamente didática. O estado de publicação e a validação integrada devem ser consultados em [PUBLICADO.md](https://github.com/oalexandrebelo/MISSAO-IPE/blob/main/PUBLICADO.md); este documento não é recibo de deploy.

## A proposta que os dois devs devem conservar

O participante aprende que uma missão científica precisa entregar **evidência adequada à pergunta**. Energia, armazenamento e comunicação podem limitar essa entrega. Receber todos os bits não basta quando o instrumento é incompatível; um conjunto incompleto não pode ser preenchido com zeros nem apresentado como descoberta completa.

| Caso | Pergunta jogável | Evidência | Aprendizado principal |
| --- | --- | --- | --- |
| Cerrado | O que mudou na vegetação entre dois períodos? | Seis registros históricos Terra/MODIS | Potência versus energia, processamento e limites de uma diferença de NDVI |
| Bennu | Que variedade de tamanhos existe nos objetos publicados? | Eixos maiores de seis rochas/clastos, em metros | Tempo de contato controla disponibilidade; tamanho não prova composição/origem |
| Webb | Como a luz bloqueada varia entre seis faixas? | Seis bins de um trânsito de WASP-39 b, com incertezas | Tipo de medida e incerteza importam; transporte não equivale a descoberta |

[Dados, seleção, fontes e limites R18](45-DADOS-REAIS-BENNU-WEBB-R18.md). Os registros Bennu são objetos 1, 2, 3, 4a, 5 e 6 da tabela científica. Não são os locais candidatos de coleta Nightingale/Osprey. Webb usa seis dos 95 bins de uma redução de um trânsito, não duas exposições de três bandas.

## Divisão de responsabilidade

| Responsável | Possui e revisa | Entrega que permite ao colega trabalhar |
| --- | --- | --- |
| **Dev A — ciência e motor** | Dados/versionamento, procedência, unidades, incertezas, catálogo, simulação, relatório e importação de projeto | Conjunto congelado com IDs estáveis, origem verificável, transformação documentada e testes de conservação/entrega |
| **Dev B — interface e 3D** | Jornada, leitura das fontes, gráfico, cartões, inspeção da nave, paridade 2D/3D, teclado, toque e movimento reduzido | Cada evidência visual vinculada ao ID correto; texto acessível; lacunas e incertezas visíveis sem depender só de cor |
| **Ambos** | Texto científico, testes com iniciantes, integração e publicação | Revisão cruzada da cadeia fonte → registro → evento → resultado; demonstração reproduzível das três missões |

Não alterar valores NASA para equilibrar a dificuldade. Ajustar somente os parâmetros didáticos, com nova versão quando o resultado das simulações mudar. Mudança de fonte, unidade, seleção ou pergunta exige revisão de Dev A e Dev B juntos.

## Arquivos e fronteiras

Todos os caminhos `src/` a seguir pertencem a `experiments/mission-design-lab/`.

| Arquivo/área | Responsabilidade |
| --- | --- |
| `research/bennu-r18/` e `research/webb-r18/`, na raiz | Arquivos de auditoria, seleção, extração, fontes e hashes; distinguir material publicável dos originais ignorados |
| `src/lab/scientific-expeditions.ts` | Configuração, requisitos, cópia dos registros, cálculo determinístico e projeção do estado registrado |
| `src/lab/mission-curriculum.ts` | Objetivo, aprendizagem, ensaio A/B com um fator alterado e interpretação defensável |
| `src/lab/spacecraft-presentation.ts` | Correspondência entre escolhas e instrumentos/painéis/bateria/antena; sem executar outra física |
| `src/ui/ScientificExpedition.tsx` e painel `ArchivedEvidence` | Jornada, hipótese, tentativas, leitura científica, gráfico, consulta de fonte e retorno ao evento de entrega |
| `src/ui/OrbitalScene.tsx` | Nave configurada, modelos NASA e cartões de evidência por ID nos segmentos solo/usuários |
| `src/ui/MissionStories.tsx` | História baseada em publicação científica; datas e limites do que foi incorporado |
| `apps/immersive-lp/lib/content.ts`, na raiz | Resumo público das missões e perguntas frequentes; a LP é uma publicação separada |

Os JSON usados pelo motor ficam em `src/data/science/`; `scripts/sync-science-records.mjs` publica cópias idênticas antes do build. O teste de procedência impede divergência entre motor e download. As tabelas distribuídas ficam em `/lab/data/science/`: `bennu-records.json`, `bennu-table1.csv`, `bennu-provenance.json`, `webb-spectrum-subset.json`, `webb-firefly-nasa.tbl` e `webb-provenance.json`. Os links de download estão no documento 45.

## Contratos que não podem divergir

- **Modelo:** `ipe-expeditions-r18-v1`. **Relatório:** `ipe-scientific-report-v2`. **Projeto:** `ipe-scientific-design-v2`. Arquivos antigos devem explicar sua incompatibilidade; não migrar automaticamente hipóteses sobre medidas sintéticas.
- **Ciência imutável:** as escolhas não alteram `value`, `unit`, fonte, instante histórico ou incerteza. Alteram estado de processamento/entrega e validade instrumental no exercício.
- **Relógios separados:** `producedAtS` e `deliveredAtS` pertencem ao jogo. A data observada vem da evidência. Bennu não possui horário individual por dimensão; não preencher com o início de uma campanha.
- **Entrega por identidade:** usar `deliveredRecordIds` do instante selecionado, não uma contagem para acender os primeiros N itens. Com IDs não contíguos, o cartão correto deve ser liberado.
- **Incerteza por significado:** Webb usa erro publicado de 1σ em pontos percentuais. A escala de 5,25 cm/pixel de Bennu não deve virar barra ±1σ nem ser aplicada ao valor como correção.
- **Tentativa preservada:** uma cena de execução usa `result.config`. Editar rascunho não reescreve resultados já registrados.
- **GLB independente:** Bennu/Webb são referências visuais. As latitudes/longitudes da tabela não autorizam marcar pontos como geograficamente alinhados ao modelo.
- **Acesso a fontes:** dados públicos podem ser consultados diretamente. A disponibilidade no retorno da missão indica a entrega daquela tentativa, não sigilo ou indisponibilidade do arquivo público.

## Roteiro de validação para os dois devs

1. Entrar em **Bennu**, ler a pergunta e identificar a unidade em metros. Abrir a fonte e localizar a Tabela Suplementar 1. Conferir a omissão explícita de 4b no jogo e sua presença no CSV completo.
2. Usar câmera, energia ampliada e contatos curtos. Registrar uma hipótese, executar e comparar produção, fila e recepção. Dados incompletos devem permanecer indisponíveis no retorno.
3. Trocar apenas o seletor do serviço de solo, executar novamente e comparar no mesmo T+. O pacote altera duração, início da primeira janela e custo: não atribuir o resultado somente à duração. Os eixos maiores e a fonte precisam permanecer idênticos. O rádio e sua taxa não mudam com a duração do contato.
4. Selecionar um registro recebido e **rever a entrega no 3D**. Conferir ID, evento, relógio e subsistema. Rebobinar para antes da entrega: o registro não pode aparecer recebido na cena daquele instante.
5. Entrar em **Webb**. Confirmar que a tabela é de um único trânsito e a grandeza é porcentagem de luz bloqueada. Com câmera genérica, recepção completa não deve produzir evidência espectral válida.
6. Trocar apenas para espectrômetro. Verificar os pontos recebidos e suas barras de incerteza. Conferir uma linha com a tabela de 95 bins, sem confundir porcentagem com fração absoluta ou erro percentual relativo.
7. Exportar relatório. Conferir versão, hipótese, configuração executada, dados científicos, origem e estados de entrega. Importar projeto v2 e verificar escolhas; importar um projeto antigo e verificar recusa explicada.
8. Repetir os fluxos em modo 2D, sem WebGL, por teclado e com movimento reduzido. Controles, valores e interpretação devem continuar disponíveis fora do canvas. Testar celular físico antes de afirmar aceite móvel.
9. Abrir Cerrado e a campanha existente para verificar regressão. Não alterar seus dados reais nem presumir que melhorias nas expedições resolvem a persistência compartilhada já documentada.

## Execução local e publicação

Com Node 24 e as dependências existentes instaladas, na raiz:

```bash
npm --prefix experiments/mission-design-lab run verify
npm run build:release
npm run test:context
npm run test:beta
npm run test:portal
npm run start:beta
```

O site local usa `http://127.0.0.1:4175/`. O build principal publica `site/` por lista explícita. A LP em `apps/immersive-lp/` tem seu próprio build e projeto Vercel; consultar o README da aplicação. Não copiar toda a raiz, PDFs de leitura, arquivos privados ou `.env` para a hospedagem.

Validação integrada R18: 148 testes de domínio e 38 de interface do laboratório; 120 + 14 da campanha; 24 de contexto; 17 de distribuição; 12 do portal; 18 jornadas da LP em navegador. Os builds estáticos passaram. A conferência visual abriu os resultados reais de Bennu/Webb e o replay 3D por registro, sem erro de console observado. [Recibo local R18](https://github.com/oalexandrebelo/MISSAO-IPE/blob/main/evidence/revision-r18.json). A verificação da hospedagem tem recibo próprio: não reutilizar a R17 como prova de R18. Para reproduzir testes da LP, use o navegador já instalado por `PLAYWRIGHT_CHROMIUM_EXECUTABLE` se o executável padrão do Playwright não estiver disponível.

## O que ainda precisa de evidência humana

O projeto possui uma proposta educativa verificável, mas a implementação não prova aprendizagem nem classificação no Space Apps. Observar participantes iniciantes, registrar se conseguem explicar um gargalo sem ajuda, testar toque/leitura em aparelho físico e ensaiar o pitch continuam necessários. A colaboração disponível é local no mesmo dispositivo; multiplayer remoto não está implementado. Questões de elegibilidade e histórico pré-evento permanecem no [documento de prontidão](42-PRONTIDAO-E-CRITERIOS-SPACE-APPS-R17.md).

Próxima melhoria deve partir de um problema observado nessas sessões. O ganho desta revisão é permitir que a pessoa reconheça uma medida real, siga sua origem, veja por que ela chegou ou faltou e formule uma conclusão do tamanho da evidência.

## Próximo ciclo de investigação

Leia as [oportunidades NASA revisadas pelo Sol 6.1 max](47-OPORTUNIDADES-NASA-PARA-DOIS-DEVS-R18.md). Elas são propostas priorizadas, não funcionalidades já implementadas. O estudo distingue ferramentas de referência, dados para integrar e critérios para aceitar cada melhoria.
