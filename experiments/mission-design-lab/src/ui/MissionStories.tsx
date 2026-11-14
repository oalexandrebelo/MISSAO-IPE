export type StoryId = 'cerrado' | 'bennu' | 'telescope';
const stories = {
  cerrado: {
    title: 'Duas datas. Três lugares. Uma resposta que precisa chegar inteira.',
    opening: 'Uma equipe científica do Cerrado recebe um pedido aparentemente simples: comparar a vegetação em três pontos próximos a Rio Verde, em dois períodos. Os arquivos existem no acervo Terra/MODIS. A missão educativa começa quando eles precisam ser processados e entregues por uma nave com recursos limitados.',
    tension: 'Na sala de operações, um mapa incompleto pode parecer uma resposta. Mas uma observação ausente não significa vegetação igual a zero. Cada local precisa das duas datas; um índice isolado também não revela se a diferença veio de chuva, manejo ou outra causa.',
    decision: 'O responsável pela ciência pede os seis registros. A engenharia precisa decidir entre enviar bandas ou processar o índice a bordo. O solo lembra que as janelas têm fim. O lançamento limita massa e custo. Ninguém consegue resolver a missão olhando apenas para sua própria área.',
    question: 'Quando o contato encolhe, vale enviar mais rápido, processar a bordo ou rever o conjunto?',
    ending: 'O resultado é uma comparação com procedência e lacunas visíveis. O objetivo é aprender a fazer a evidência chegar, sem transformar falta de dado em conclusão.',
  },
  bennu: {
    title: 'Antes de tocar um mundo, é preciso aprender a vê-lo.',
    opening: 'Uma equipe fictícia de geologia planetária recebe a tarefa de comparar três setores de um pequeno corpo inspirado em Bennu. O modelo tridimensional fornecido pela NASA dá forma ao destino. A missão precisa de duas observações de cada setor para organizar um levantamento de superfície.',
    tension: 'De longe, um terreno pode parecer simples. Ao planejar a observação, surgem perguntas sobre iluminação, detalhes e cobertura. A história da OSIRIS-REx inspira o caso: estudar a superfície é parte do trabalho antes de escolher onde investigar. Este jogo não faz seleção real de pouso nem reproduz a trajetória da sonda.',
    decision: 'Uma câmera atende ao levantamento visual; um espectrômetro responde a outras perguntas. Escolher o instrumento mais sofisticado não garante cumprir o pedido. O perfil de aproximação muda as oportunidades, o lançador precisa ser compatível e as seis observações só servem à equipe quando chegam por inteiro.',
    question: 'Você está escolhendo uma nave impressionante ou a evidência necessária para este objetivo?',
    ending: 'O retorno organiza seis medidas sintéticas do exercício. Compare os setores, indique o que permanece desconhecido e explique qual decisão de engenharia permitiu receber o conjunto. O modelo histórico de Bennu é referência visual, não um mapa para navegação.',
  },
  telescope: {
    title: 'Uma imagem bonita não responde a toda pergunta.',
    opening: 'Uma equipe fictícia de astronomia quer comparar o sinal recebido em três faixas do infravermelho, em duas observações. O alvo do exercício é sintético. A pergunta pede um espectro: como a intensidade relativa muda entre faixas e momentos?',
    tension: 'A imagem parece a escolha mais intuitiva, mas separar a luz por comprimento de onda requer outro instrumento. O modelo NASA do Webb apresenta uma referência real de observatório infravermelho. A arquitetura do jogo é didática: não calcula criogenia, óptica, apontamento ou o desempenho real do Webb.',
    decision: 'A ciência defende o espectrômetro. A engenharia verifica energia e massa. O planejamento compara um perfil terrestre com um perfil conceitual associado a L2, e o solo precisa receber os dados dentro da vida operacional escolhida. Alterar uma escolha muda o espaço disponível para as outras.',
    question: 'Como garantir que o instrumento certo também consiga operar, guardar e entregar sua observação?',
    ending: 'O conjunto entregue permite comparar apenas o espectro sintético deste exercício. Uma diferença não comprova água, atmosfera ou vida. A descoberta educativa é aprender a relacionar pergunta, instrumento, recursos e limites da interpretação.',
  },
};
export function MissionStory({ id, expanded = false }: { id: StoryId; expanded?: boolean }) {
  const story = stories[id];
  const content = <div className="mission-story-content"><div><h3>O pedido</h3><p>{story.opening}</p></div><div><h3>O que está em jogo</h3><p>{story.tension}</p></div><div><h3>A conversa de projeto</h3><p>{story.decision}</p></div><div><h3>O retorno à ciência</h3><p>{story.ending}</p></div><div className="story-question"><strong>{story.title}</strong><p>{story.question}</p></div></div>;
  return expanded ? <section className="mission-story" aria-label="História científica da missão">{content}</section> : <details className="mission-story"><summary>Conhecer a história: {story.title}</summary>{content}</details>;
}
