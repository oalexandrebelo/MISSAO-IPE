export const LINKS = {
  game: 'https://projeto-ipe.vercel.app/lab/index.html',
  research: 'https://projeto-ipe.vercel.app/context/research-library.html',
  roadmap: 'https://projeto-ipe.vercel.app/docs/22-PLANO-CONTINUIDADE.html',
  github: 'https://github.com/oalexandrebelo/PROJETO-IPE',
  pitch: 'https://projeto-ipe.vercel.app/presentation/Missao_Ipe_Apresentacao.html',
} as const;

export const CHAPTERS = [
  { id: 'inicio', label: 'Início', number: '01' },
  { id: 'missao', label: 'A missão', number: '02' },
  { id: 'laboratorio', label: 'Laboratório', number: '03' },
  { id: 'jornada', label: 'Sua jornada', number: '04' },
  { id: 'horizonte', label: 'Próximo horizonte', number: '05' },
] as const;

export const LEVELS = [
  { number: '01', name: 'Semente', subtitle: 'Toda descoberta começa com uma pergunta.', status: 'Cenário disponível', live: true, tag: 'PRIMEIRO CONTATO', text: 'Como observar a vegetação do Cerrado a partir do espaço? Projete sua primeira missão e faça seis registros científicos chegarem à Terra.', learning: 'Objetivo científico · energia · comunicação', detail: 'Explore o cenário de contatos longos no beta. A identidade Semente apresenta este cenário; a campanha com desbloqueios ainda está em desenvolvimento.', icon: 'seed' },
  { number: '02', name: 'Raízes', subtitle: 'Seu plano encontra o mundo real.', status: 'Cenário disponível', live: true, tag: 'O VALOR DE REDESENHAR', text: 'O tempo de comunicação diminuiu. Investigue o que ficou pelo caminho, compare tentativas e redesenhe a nave sem perder a ciência.', learning: 'Restrições · diagnóstico · escolhas de projeto', detail: 'O cenário de contatos curtos e a comparação já existem no beta. A mesma nave que entrega 6/6 no contato longo entrega 2/6 no curto.', icon: 'roots' },
  { number: '03', name: 'Copa', subtitle: 'Resiliência também se projeta.', status: 'Em planejamento', live: false, tag: 'APRENDER COM O IMPREVISTO', text: 'Uma mudança no ambiente espacial pede uma nova estratégia. Proteja a nave, preserve os dados e investigue como retomar a missão.', learning: 'Risco · recuperação · evidência', detail: 'Proposta de cenário com eventos históricos identificados e consequências didáticas explícitas. Depende de validação do modelo e ainda não é jogável.', icon: 'crown' },
  { number: '04', name: 'Horizonte', subtitle: 'O método viaja mais longe.', status: 'Em planejamento', live: false, tag: 'UMA NOVA FRONTEIRA', text: 'Leve o que você aprendeu a um pequeno corpo do Sistema Solar. Compare objetivos, trajetórias e janelas para uma nova expedição.', learning: 'Trajetórias · procedência · exploração', detail: 'Proposta de campanha apoiada em SBDB, Mission Design e Horizons. A integração de novos dados JPL e a campanha dependem de desenvolvimento e revisão.', icon: 'horizon' },
] as const;

export const MILESTONES = [
  { id: 'base', stage: '01', label: 'A semente', state: 'BASE EXISTENTE', title: 'Uma pergunta. Um laboratório.', text: 'O beta conecta seis escolhas de projeto a um motor determinístico. Dados históricos MOD13Q1 do Cerrado dão sentido à missão.', items: ['64 configurações possíveis', '2 cenários de comunicação', '6 registros científicos'], date: 'Base · novembro de 2026' },
  { id: 'experience', stage: '02', label: 'A experiência', state: 'NESTA ENTREGA', title: 'Ciência que dá vontade de explorar.', text: 'Uma nova entrada para o projeto: planeta imersivo, narrativa em capítulos, experimento interativo e uma jornada que aproxima ciência e curiosidade.', items: ['Narrativa orbital', 'Experimento com o motor do beta', 'Acesso ao jogo e à pesquisa'], date: 'LP · novembro de 2026' },
  { id: 'learning', stage: '03', label: 'A escuta', state: 'PRÓXIMA ETAPA', title: 'Aprender com quem aprende.', text: 'Observar jogadores, testar a linguagem e descobrir se as decisões ajudam a distinguir energia, potência, memória e transmissão.', items: ['Piloto com jogadores', 'Revisão de acessibilidade', 'Evidência de aprendizagem'], date: 'Planejado · após validação da base' },
  { id: 'future', stage: '04', label: 'A expansão', state: 'HORIZONTE', title: 'Mais perguntas. Novas missões.', text: 'Evoluir a progressão Semente e Raízes e investigar Copa e Horizonte com dados versionados, procedência e revisão científica.', items: ['Progressão educativa', 'Novos cenários reprodutíveis', 'Pesquisa NASA / JPL'], date: 'Planejado · sem data prometida' },
] as const;

export const FAQ = [
  ['Preciso entender de engenharia espacial?', 'Não. O beta convida você a formular uma hipótese, testar escolhas e aprender com o resultado. O importante é a curiosidade para investigar por que uma missão funcionou — ou o que pode mudar na próxima tentativa.'],
  ['O jogo usa dados reais?', 'Os registros de vegetação vêm de dados históricos MOD13Q1 Collection 061. O CubeSat, os componentes, a duração e os créditos são um modelo didático. Não há telemetria NASA ao vivo nem validação de voo.'],
  ['Os quatro níveis já estão disponíveis?', 'Os cenários de contatos longos e curtos estão no beta e inspiram Semente e Raízes. A campanha com desbloqueios, Copa e Horizonte estão em planejamento. A página identifica esses estados em cada capítulo.'],
  ['Preciso criar uma conta para explorar?', 'Não. A demonstração desta página roda no navegador, sem cadastro e sem enviar suas escolhas a um servidor. O jogo completo abre em outra página do projeto.'],
  ['Como posso acompanhar ou contribuir?', 'Explore a pesquisa, consulte o plano público e acompanhe o repositório no GitHub. Hipóteses, limitações e propostas estão documentadas para que a evolução possa ser discutida a partir de evidências.'],
] as const;
