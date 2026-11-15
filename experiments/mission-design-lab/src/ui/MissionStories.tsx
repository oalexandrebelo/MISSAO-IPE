export type StoryId = 'cerrado' | 'bennu' | 'telescope';
const stories = {
  cerrado: {
    title: 'Terra/MODIS: observar a vegetação ao longo do tempo.',
    opening: 'O instrumento MODIS, a bordo do satélite Terra, produz observações usadas para estudar a vegetação. O NASA Earth Observatory explica como a diferença entre a luz vermelha e a infravermelha próxima refletida pela superfície permite calcular o NDVI. Essa é a base científica real do caso Cerrado.',
    tension: 'O produto MOD13Q1 reúne observações em compostos de 16 dias. No recorte deste projeto, seis registros de arquivo representam três pontos próximos a Rio Verde em dois períodos de 2024. As datas selecionadas das observações são 1 e 23 de setembro; elas não são as datas iniciais dos compostos.',
    decision: 'O exercício usa esses arquivos reais para estudar processamento, energia, armazenamento e transmissão. A nave configurável e seus recursos são um modelo didático: não reproduzem o satélite Terra nem uma operação histórica do MODIS. A pergunta é quais pares de registros chegam completos para permitir a comparação.',
    question: 'Que evidência falta quando só uma das duas observações de um local chega ao solo?',
    ending: 'A comparação preserva procedência, qualidade e lacunas. Uma diferença de NDVI não identifica sozinha sua causa; um registro ausente não equivale a vegetação zero. O resultado do jogo avalia a entrega dos arquivos, sem diagnosticar desmatamento ou reconstituir uma missão NASA.',
    sources: [
      { title: 'NASA Earth Observatory · NDVI e EVI · 30/08/2000', url: 'https://science.nasa.gov/earth/earth-observatory/measuring-vegetation-ndvi-evi/' },
      { title: 'NASA Earthdata · catálogo MOD13Q1', url: 'https://search.earthdata.nasa.gov/search?q=mod13' },
    ],
  },
  bennu: {
    title: 'OSIRIS-REx: rochas de Bennu guardam pistas de outro asteroide.',
    opening: 'Imagens da OSIRIS-REx revelaram material brilhante entre as rochas escuras de Bennu. Em estudo publicado em 2020 e arquivado no NASA NTRS, DellaGiustina e colegas combinaram imagens e espectroscopia para investigar esse material. Os espectros de piroxênio se mostraram semelhantes aos de meteoritos associados a Vesta.',
    tension: 'O estudo apresenta dimensões de rochas e clastos em seis sítios. As imagens PolyCam foram registradas sobre modelos de terreno produzidos pelo altímetro OLA. O jogo incorpora os eixos maiores dos objetos 1, 2, 3, 4a, 5 e 6, entre 1,453 e 3,93 metros. A tabela completa tem sete objetos: o clasto 4b continua no arquivo de referência, mas não integra os seis registros jogáveis.',
    decision: 'Você trabalha com medidas publicadas e precisa disponibilizá-las aos cientistas. Câmera, energia, fila e duração dos contatos determinam quais registros arquivados ficam disponíveis no resultado da tentativa. O relógio T+ acompanha o processamento e o transporte didáticos; não recria o instante em que a OSIRIS-REx observou cada rocha.',
    question: 'Se a observação existe a bordo, mas não foi recebida, ela já pode sustentar uma decisão em solo?',
    ending: 'Compare escalas, preserve os registros ausentes e indique o limite da medida: a escala de 5,25 cm/pixel restringe a precisão dos eixos, sem fornecer um intervalo estatístico de 1σ. Tamanho sozinho não identifica minerais ou origem. A relação com Vesta vem da análise científica mais ampla. O modelo 3D não posiciona essas rochas geograficamente nem certifica um local de pouso.',
    sources: [
      { title: 'NASA NTRS · Exogenic basalt on asteroid (101955) Bennu · artigo e suplemento', url: 'https://ntrs.nasa.gov/citations/20205007912' },
      { title: 'NASA · pistas de Vesta em Bennu · 21/09/2020', url: 'https://www.nasa.gov/solar-system/nasas-osiris-rex-to-asteroid-bennu-youve-got-a-little-vesta-on-you/' },
    ],
  },
  telescope: {
    title: 'Webb: um espectro revelou dióxido de carbono em WASP-39 b.',
    opening: 'Em 25 de agosto de 2022, a NASA anunciou evidência de dióxido de carbono na atmosfera do exoplaneta WASP-39 b. A observação de 10 de julho de 2022 usou o NIRSpec do Webb para medir como a absorção da luz varia com o comprimento de onda durante o trânsito do planeta.',
    tension: 'O resultado veio de um espectro, com uma característica entre 4,1 e 4,6 micrômetros, e não apenas de uma imagem. O Webb dispõe de quatro instrumentos científicos com diferentes modos de observação. Todos têm recursos de espectroscopia, inclusive o NIRCam: seus nomes não resumem todas as capacidades.',
    decision: 'O exercício incorpora seis dos 95 bins da redução FIREFLy disponíveis no NASA Exoplanet Archive. Um bin reúne uma pequena faixa de comprimento de onda; aqui todos pertencem ao mesmo trânsito de 10 de julho de 2022. Você escolhe o tipo de instrumento, opera recursos didáticos e entrega esses registros históricos. A câmera genérica do catálogo não representa o NIRCam real.',
    question: 'Os pacotes chegaram completos. Eles contêm o tipo de medida necessário para responder à pergunta?',
    ending: 'Os pontos mostram a profundidade do trânsito: a porcentagem de luz da estrela bloqueada pelo planeta. As barras preservam as incertezas publicadas de 1σ, em pontos percentuais. Compare apenas os bins recebidos; uma lacuna não vale zero. Este recorte não refaz a detecção de CO₂, não estima abundâncias e não indica vida. O modelo 3D é referência do observatório; óptica, criogenia, ruído e trajetória não são simulados.',
    sources: [
      { title: 'NASA · CO₂ em WASP-39 b · 25/08/2022', url: 'https://science.nasa.gov/missions/webb/nasas-webb-detects-carbon-dioxide-in-exoplanet-atmosphere/' },
      { title: 'NASA Exoplanet Archive · espectros de WASP-39 b', url: 'https://exoplanetarchive.ipac.caltech.edu/cgi-bin/atmospheres/nph-firefly?atmospheres=&planet=WASP-39%20b' },
      { title: 'Dados dos autores · JWST ERS · DOI 10.5281/zenodo.6959427', url: 'https://doi.org/10.5281/zenodo.6959427' },
      { title: 'NASA · instrumentos científicos do Webb', url: 'https://science.nasa.gov/mission/webb/science-overview/science-explainers/webbs-scientific-instruments/' },
    ],
  },
};
export function MissionStory({ id, expanded = false }: { id: StoryId; expanded?: boolean }) {
  const story = stories[id];
  const content = <div className="mission-story-content"><div><h3>O fato documentado</h3><p>{story.opening}</p></div><div><h3>O contexto científico</h3><p>{story.tension}</p></div><div><h3>O que o exercício permite investigar</h3><p>{story.decision}</p></div><div><h3>O alcance do resultado</h3><p>{story.ending}</p></div><div className="story-question"><strong>{story.title}</strong><p>{story.question}</p></div><div><h3>Fontes NASA</h3><ul>{story.sources.map(source => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.title}</a></li>)}</ul><p>Fontes conferidas em 15/11/2026. Ipê é o nome da equipe; a árvore não é o tema científico das missões.</p></div></div>;
  return expanded ? <section className="mission-story" aria-label="História científica da missão">{content}</section> : <details className="mission-story"><summary>Conhecer a história real: {story.title}</summary>{content}</details>;
}
