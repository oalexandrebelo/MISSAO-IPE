export const LINKS = {
  game: 'https://projeto-ipe.vercel.app/lab/index.html',
  campaign: 'https://projeto-ipe.vercel.app/campanha/index.html',
  research: 'https://projeto-ipe.vercel.app/context/research-library.html',
  roadmap: 'https://projeto-ipe.vercel.app/docs/32-GUIA-DIDATICO-MISSOES-3D.html',
  github: 'https://github.com/oalexandrebelo/MISSAO-IPE',
  pitch: 'https://projeto-ipe.vercel.app/presentation/Missao_Ipe_Apresentacao.html',
} as const;

export const CHAPTERS = [
  { id: 'inicio', label: 'Início', number: '01' },
  { id: 'missao', label: 'A missão', number: '02' },
  { id: 'laboratorio', label: 'Laboratório', number: '03' },
  { id: 'jornada', label: 'Três casos NASA', number: '04' },
  { id: 'segmentos', label: 'A missão completa', number: '05' },
] as const;

export const LEVELS = [
  {
    number: '01', name: 'Terra / MODIS', subtitle: 'O que mudou na vegetação?',
    status: 'Caso disponível', live: true, tag: 'ECOLOGIA · CERRADO', icon: 'earth',
    text: 'O instrumento MODIS, a bordo do Terra, observa a vegetação. No jogo, compare arquivos históricos de três pontos próximos a Rio Verde e investigue o que uma diferença de índice realmente permite concluir.',
    learning: 'Potência × energia · processamento · qualidade dos dados',
    detail: 'O Terra foi lançado em dezembro de 1999. O exercício utiliza registros históricos MOD13Q1.061; a nave e a operação são didáticas. Uma redução de NDVI não identifica sozinha sua causa. Aprenda a preservar lacunas e a justificar sua interpretação.',
    source: 'https://science.nasa.gov/earth/earth-observatory/measuring-vegetation-ndvi-evi/',
    sourceLabel: 'NASA · medir a vegetação',
  },
  {
    number: '02', name: 'Bennu / OSIRIS-REx', subtitle: 'Antes de tocar, conhecer.',
    status: 'Caso disponível', live: true, tag: 'GEOLOGIA PLANETÁRIA · BENNU', icon: 'asteroid',
    text: 'Rochas brilhantes de Bennu motivaram uma investigação da OSIRIS-REx sobre material de outro asteroide. Compare dimensões reais publicadas e descubra por que produzir um registro não garante que ele chegue aos cientistas.',
    learning: 'Instrumento · memória a bordo · tempo de contato',
    detail: 'Seis eixos maiores de rochas e clastos vêm da Tabela Suplementar 1 do estudo arquivado no NASA NTRS. Troque o serviço de solo e compare quais registros chegam: o pacote muda duração, início da primeira janela e custo, com a mesma taxa. Dimensões são reais; energia, pacotes e operação são didáticos. Tamanho sozinho não prova composição ou origem, e o modelo 3D não é um mapa de pouso.',
    source: 'https://ntrs.nasa.gov/citations/20205007912',
    sourceLabel: 'NASA NTRS · rochas de Bennu',
  },
  {
    number: '03', name: 'Webb / NIRSpec', subtitle: 'A luz guarda pistas.',
    status: 'Caso disponível', live: true, tag: 'ASTRONOMIA · ESPECTROSCOPIA', icon: 'telescope',
    text: 'Em 2022, observações do NIRSpec no Webb revelaram dióxido de carbono na atmosfera de WASP-39 b. O instrumento precisa responder à pergunta: receber uma imagem não basta para medir um espectro.',
    learning: 'Imagem × espectro · compatibilidade · evidência científica',
    detail: 'Compare seis bins reais de um único trânsito de WASP-39 b, com a profundidade em porcentagem e incertezas publicadas de 1σ. O recorte vem do NASA Exoplanet Archive e não refaz a análise completa de CO₂. A operação é didática; a câmera genérica do catálogo não representa o NIRCam real.',
    source: 'https://science.nasa.gov/missions/webb/nasas-webb-detects-carbon-dioxide-in-exoplanet-atmosphere/',
    sourceLabel: 'NASA · CO₂ em WASP-39 b',
  },
] as const;

export const MILESTONES = [
  { id: 'launch', stage: '01', label: 'Lançamento', state: 'COLOCAR EM ÓRBITA', title: 'A missão começa antes de decolar.', text: 'Escolha um veículo compatível com a massa e o perfil da missão. No jogo, os limites são didáticos e explícitos: um lançamento aprovado não garante que os instrumentos consigam operar.', items: ['Capacidade de carga', 'Órbita e perfil da missão', 'Orçamento e requisitos'], date: 'Segmento de lançamento' },
  { id: 'space', stage: '02', label: 'Espaço', state: 'OBTER E PRESERVAR DADOS', title: 'Cada instrumento precisa de uma nave.', text: 'Combine carga útil, energia, memória e comunicação. Observe a peça na nave, compare o que muda nos recursos e teste o projeto antes de operar.', items: ['Três casos científicos disponíveis', 'Configuração e inspeção em 3D', 'Simulação e diagnóstico causal'], date: 'Segmento espacial' },
  { id: 'ground', stage: '03', label: 'Solo', state: 'RECEBER E OPERAR', title: 'Observar não é o mesmo que entregar.', text: 'A antena precisa de energia e tempo de contato para esvaziar a fila. O laboratório permite comparar a mesma nave em condições de comunicação diferentes.', items: ['Janelas de contato', 'Dados a bordo e recebidos', 'Operação e análise de falhas'], date: 'Segmento terrestre' },
  { id: 'users', stage: '04', label: 'Usuários', state: 'TRANSFORMAR DADOS EM EVIDÊNCIA', title: 'A descoberta depende de quem interpreta.', text: 'Os cientistas precisam de registros válidos para responder à pergunta inicial. Termine a missão explicando o que os dados sustentam, o que falta e qual decisão poderia melhorar a próxima tentativa.', items: ['Pergunta científica e beneficiários', 'Qualidade e origem dos dados', 'Conclusão com limites explícitos'], date: 'Segmento de usuários' },
] as const;

export const FAQ = [
  ['Preciso entender de engenharia espacial?', 'Não. Comece pela pergunta científica, faça uma previsão e teste uma escolha. O laboratório mostra como energia, massa, dados e comunicação afetam o resultado. Você pode voltar, redesenhar e comparar.'],
  ['O jogo usa dados reais?', 'Sim. O Cerrado usa arquivos históricos MOD13Q1.061; Bennu incorpora dimensões publicadas de rochas e clastos; Webb incorpora seis bins reais de WASP-39 b com incertezas. Fontes e seleção são verificáveis. Componentes, pacotes, recursos e operação são didáticos; não há telemetria ao vivo nem validação de voo.'],
  ['As três missões e a campanha já estão disponíveis?', 'Sim. O laboratório reúne Cerrado, Bennu e Telescópio. A campanha do Cerrado também está disponível em quatro etapas: Primeiro sinal, Memória em disputa, Janela estreita e Ciência que chega. São experiências distintas, com links nesta página.'],
  ['Posso jogar em equipe?', 'É possível discutir decisões e dividir responsabilidades no mesmo dispositivo. A colaboração remota sincronizada para quatro jogadores ainda não está disponível. O aprendizado envolve os quatro segmentos: lançamento, espaço, solo e usuários.'],
  ['O nome IPÊ faz parte da história científica?', 'IPÊ identifica nossa equipe e sua marca. As histórias partem de missões e descobertas documentadas da NASA. A árvore não é um modelo de engenharia, uma etapa de missão ou um acontecimento científico.'],
  ['Preciso criar uma conta para explorar?', 'Não. O laboratório desta página roda no navegador. O jogo e a campanha abrem nas respectivas páginas do projeto. Você pode explorar sem cadastro e consultar fontes, limites e documentação no repositório oficial.'],
] as const;
