# 05 — Interface funcional e limites da verificação

Frente 5 de implementação. Protótipo de pesquisa **Missão Ipê — Ciência que chega**, iniciado em 14/11/2026 antes do evento. A elegibilidade permanece pendente. Este relatório descreve código implementado; não apresenta observação de participantes nem validação educacional.

## Entrega

Foram criados `src/App.tsx`, `src/main.tsx`, `src/styles.css`, `index.html` e os componentes de `src/ui/`. Os módulos do motor, do catálogo, do Worker e da persistência são consumidos diretamente pelas APIs acordadas em `specs/IMPLEMENTATION-CONTRACT.md`. Nenhum parâmetro físico ou resultado de missão é calculado pelo diorama.

| Etapa | Comportamento implementado | Origem dos valores |
|---|---|---|
| Observatório | Apresentação do objetivo, duas condições, três hotspots tecláveis, visualização 3D e alternativa 2D | `SCENARIOS`; texto explica arquivo histórico e modelo didático |
| Bancada | Seis grupos de rádio com escolhas binárias, envelope de massa/créditos, previsão e justificativa antes da execução | `CATALOG`, `getConfigTotals`, `getScenario` |
| Sala de missão | Resultado, seis registros, gráfico de energia, seleção de estados e eventos, balanços, reflexão, busca de alternativas, replay | `MissionResult`, `SearchResult`; mensagens e regras reais do motor |
| Caderno | Abertura de execuções salvas, importação de replay e exportação do diário de decisões | IndexedDB e diário local separado |
| Fontes e hipóteses | Seis registros e datas, NDVI de referência, identificadores e hash do pacote, hipóteses e condição pré-evento | `SCIENCE_RECORDS`, `SCIENCE_PACK_HASH`, versões do contrato |

## Decisões de interação

- A entrada em edição e o resultado executado são estados distintos. Editar componente ou condição limpa o resultado e a busca, cancela trabalho ativo e invalida a identidade da chamada.
- A navegação para outra etapa cancela uma operação ativa. Uma Promise tardia não muda a etapa nem publica resultado de uma entrada abandonada.
- A execução recebe cópia da configuração. O debrief apresenta a entrada do próprio `MissionResult`, e não valores posteriores de controles.
- Antes de executar, a pessoa escolhe uma hipótese de gargalo e escreve uma justificativa com pelo menos oito caracteres. Trata-se de requisito de presença de resposta, **não de avaliação da sua qualidade**.
- O diário registra a previsão antes da chamada ao motor e preserva conclusão, cancelamento, erro, solicitação de ajuda, redesenho sugerido e reflexão. Tempos de interação são datas locais; não são instantes do relógio simulado.
- A busca só é disponibilizada depois de uma previsão e execução próprias concluídas naquela condição. Abrir uma execução salva ou importar um replay não cria essa evidência. A primeira transferência para contatos curtos, portanto, exige sua própria decisão.
- A interface não atribui eficácia educativa a cliques ou sucesso. A reflexão é texto do usuário, vinculado ao identificador do evento selecionado.
- Uma alternativa da busca é aplicada como **novo projeto**, limpando o resultado anterior. Ela não altera hardware de uma execução em andamento.
- A afirmação de mínimo exige busca completa, zero indeterminados, distância mínima não nula e testemunha disponível. Todas as alternativas retornadas em `best` são apresentadas; a ordem não recebe interpretação de preferência técnica.

## Explicação e ciência

O painel de evidência exibe `event.message`, `event.rule`, `event.id`, tempo e, quando presentes, registro afetado, valor e limite. Ao selecionar um evento, o controle salta para o estado temporal registrado mais próximo. A interface avisa que uma violação observada não determina sozinha a única causa da falha.

O controle temporal percorre os pontos reais do trace. A reprodução avança entre esses estados; não integra equações nem interpola valores para criar telemetria. A curva conecta os pontos registrados como representação visual. Contatos, iluminação e horizonte vêm do cenário; a reserva vem do resultado. A reprodução pausa quando a aba fica invisível.

Datas dos compostos e das observações históricas aparecem separadas do relógio de 180 minutos. NDVI é exibido com quatro casas decimais; os balanços e o replay preservam os números originais. A interface explica que o CubeSat fictício não adquire MODIS em tempo real. O painel de fontes distingue dado científico, hipótese de engenharia, resultado calculado e pesquisa educacional.

## Estado, armazenamento e erro

- `simulateAsync` e `searchAsync` recebem `AbortSignal`; toda publicação é condicionada a um token vigente.
- Uma importação inválida preserva configuração, resultado e busca publicados. A substituição ocorre somente após validação/reexecução bem-sucedida e conferência do token. Divergência válida entre alegação e recálculo é informada e apenas o resultado recalculado é apresentado.
- Erro de gravação de execução não apaga o resultado em memória. Avisos de armazenamento de uma ação antiga não substituem avisos da ação atual.
- A leitura de histórico usa identidade própria para impedir que uma consulta antiga substitua uma lista mais recente.
- O rascunho usa revisão esperada da API de persistência. Um conflito de duas abas é informado, sem sobrescrita automática.
- O diário pedagógico usa `localStorage` com formato versionado, validação de leitura e exportação própria. É um relato local editável, separado dos recibos do motor. **Não é um log inviolável nem um certificado de aprendizagem.**
- A importação de replay usa seletor local de arquivo e limite de tamanho da API. A UI não executa nem busca URLs contidas em conteúdo importado.

## Apresentação, acessibilidade e recursos

O sistema visual usa papel creme, carvão esverdeado, âmbar-ipê, títulos em fonte serifada do sistema e informação técnica em fontes locais. Não há CDN, fontes remotas, texturas baixadas, logotipos institucionais ou selos de validação NASA. O rodapé identifica o produto como protótipo de pesquisa; a área de fontes declara o desenvolvimento pré-evento e a elegibilidade pendente.

O diorama Three.js é carregado por `React.lazy` em módulo separado. Terra em disco, relevo gráfico, CubeSat, painéis, estação e pontos luminosos são geometrias procedurais. O movimento discreto de apresentação não calcula uma órbita; a vista está marcada como ilustração sem escala. Há no máximo um `requestAnimationFrame` ativo por instância, e somente uma instância é montada. O renderer limita pixel ratio a 1,5, acompanha tamanho por `ResizeObserver`, pausa em aba invisível e descarta geometrias, materiais, contexto, observadores e listeners ao desmontar.

Com `prefers-reduced-motion`, o diorama permanece estático e só redesenha quando necessário. Indisponibilidade ou perda de WebGL ativa a alternativa 2D. Os hotspots são controles DOM nativos com `aria-pressed`, os campos são grupos de rádio com `fieldset`/`legend`, o trace possui slider nativo rotulado e o diálogo usa `<dialog>`. Há link de salto, foco visível, leitura textual equivalente aos gráficos e layout responsivo. Estes mecanismos foram implementados; a experiência com leitor de tela, zoom e dispositivos reais ainda precisa ser avaliada.

## Verificação realizada e pendente

`npm run build` passou após os ajustes finais desta frente: TypeScript estrito e Vite concluídos. Os artefatos principais foram CSS de 55,25 kB / 11,95 kB gzip, JavaScript inicial de 311,60 kB / 98,26 kB gzip, Worker de 20,16 kB e módulo lazy do diorama de 567,25 kB / 142,28 kB gzip. Esses números medem o tamanho dos arquivos gerados, não inicialização ou FPS. Vite avisou sobre o chunk Three superior a 500 kB e sobre importação dinâmica do motor também alcançado pela importação estática de replay.

O build acima inclui a conferência TypeScript dos arquivos de interface e dos testes presentes no repositório. A coordenação ainda fará a verificação consolidada do pacote distribuível.

Foi lida e aplicada a skill `c24/react-best-practices`: importação lazy do módulo pesado, componentes em escopo de módulo, IDs de requisição, efeitos com cleanup, estado derivado simples em render e refs para valores transitórios do diorama. A interface não instala uma biblioteca de componentes nem um framework de estilos para cumprir recomendações genéricas dessa skill.

**Não foi possível realizar QA visual em navegador nesta frente.** A coordenação informou bloqueio do Chromium por permissão de socket e rejeição de acesso `file://` no ambiente CUA. Não houve contorno dessas restrições. Permanecem pendentes inspeção de screenshots, medição de FPS, inspeção visual de clipping, teste manual de teclado/leitor de tela e comportamento em dispositivos reais. Testes DOM independentes, motor/persistência e empacotamento final pertencem às frentes de QA/coordenação.

O protocolo de primeira decisão está implementado para preservar relato e ordem local. Aplicação com participantes, rubrica de explicações, avaliação de transferência, retenção e qualquer inferência de eficácia educativa continuam pendentes.
