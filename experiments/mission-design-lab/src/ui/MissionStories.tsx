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
    title: 'OSIRIS-REx: reconhecer Bennu antes de coletar uma amostra.',
    opening: 'A OSIRIS-REx encontrou em Bennu uma superfície mais rochosa do que o esperado. Segundo o relato NASA publicado em 29 de março de 2023, a equipe precisou ampliar a análise dos possíveis locais de coleta. Imagens enviadas à Terra ajudaram a comparar terrenos e procurar material que a sonda pudesse recolher.',
    tension: 'A seleção passou por mais de 50 locais, chegou a quatro candidatos e, em dezembro de 2019, escolheu Nightingale. Rochas próximas e uma área menor do que a inicialmente planejada exigiram cuidados adicionais de navegação. A coleta ocorreu em 20 de outubro de 2020; a cápsula com a amostra retornou à Terra em 24 de setembro de 2023.',
    decision: 'Esse episódio real fundamenta o exercício: observar a superfície e disponibilizar a evidência são etapas diferentes. No jogo, câmera, energia, fila de dados e duração dos contatos determinam a entrega de seis registros sintéticos. Os setores A, B e C não representam os locais reais avaliados pela OSIRIS-REx.',
    question: 'Se a observação existe a bordo, mas não foi recebida, ela já pode sustentar uma decisão em solo?',
    ending: 'Você compara resultados do modelo didático, sem executar a coleta histórica ou certificar um local seguro. As medidas de rugosidade, tempos e recursos do exercício não são telemetria NASA. O modelo 3D de Bennu é uma referência visual; não é usado como mapa de navegação.',
    sources: [
      { title: 'NASA · escolha do local entre os obstáculos · 29/03/2023', url: 'https://science.nasa.gov/blogs/osiris-rex/2023/03/29/2019-2020-choosing-a-touchdown-site-from-a-sea-of-hazards/' },
      { title: 'NASA · cronologia da OSIRIS-REx', url: 'https://science.nasa.gov/mission/osiris-rex/' },
    ],
  },
  telescope: {
    title: 'Webb: um espectro revelou dióxido de carbono em WASP-39 b.',
    opening: 'Em 25 de agosto de 2022, a NASA anunciou evidência de dióxido de carbono na atmosfera do exoplaneta WASP-39 b. A observação de 10 de julho de 2022 usou o NIRSpec do Webb para medir como a absorção da luz varia com o comprimento de onda durante o trânsito do planeta.',
    tension: 'O resultado veio de um espectro, com uma característica entre 4,1 e 4,6 micrômetros, e não apenas de uma imagem. O Webb dispõe de quatro instrumentos científicos com diferentes modos de observação. Todos têm recursos de espectroscopia, inclusive o NIRCam: seus nomes não resumem todas as capacidades.',
    decision: 'O exercício isola uma decisão: escolher o instrumento que atende à pergunta e conseguir operar e entregar seus dados. A opção genérica câmera do catálogo não mede o espectro exigido; ela não representa o NIRCam real. Energia, massa e contatos permanecem restrições didáticas.',
    question: 'Os pacotes chegaram completos. Eles contêm o tipo de medida necessário para responder à pergunta?',
    ending: 'As seis intensidades do jogo são sintéticas, em faixas diferentes do exemplo histórico de CO₂. Não são observações de WASP-39 b nem permitem detectar moléculas, água ou vida. O Webb é referência científica e visual; sua óptica, criogenia, ruído e trajetória não são simulados.',
    sources: [
      { title: 'NASA · CO₂ em WASP-39 b · 25/08/2022', url: 'https://science.nasa.gov/missions/webb/nasas-webb-detects-carbon-dioxide-in-exoplanet-atmosphere/' },
      { title: 'NASA · instrumentos científicos do Webb', url: 'https://science.nasa.gov/mission/webb/science-overview/science-explainers/webbs-scientific-instruments/' },
    ],
  },
};
export function MissionStory({ id, expanded = false }: { id: StoryId; expanded?: boolean }) {
  const story = stories[id];
  const content = <div className="mission-story-content"><div><h3>O fato documentado</h3><p>{story.opening}</p></div><div><h3>O contexto científico</h3><p>{story.tension}</p></div><div><h3>O que o exercício permite investigar</h3><p>{story.decision}</p></div><div><h3>O alcance do resultado</h3><p>{story.ending}</p></div><div className="story-question"><strong>{story.title}</strong><p>{story.question}</p></div><div><h3>Fontes NASA</h3><ul>{story.sources.map(source => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.title}</a></li>)}</ul><p>Fontes conferidas em 15/11/2026. Ipê é o nome da equipe; a árvore não é o tema científico das missões.</p></div></div>;
  return expanded ? <section className="mission-story" aria-label="História científica da missão">{content}</section> : <details className="mission-story"><summary>Conhecer a história real: {story.title}</summary>{content}</details>;
}
