import {
  ArrowLeft,
  ArrowRight,
  Atom,
  BatteryCharging,
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  Cpu,
  Gauge,
  LockKeyhole,
  Orbit,
  Plus,
  Minus,
  Play,
  Radio,
  Rocket,
  RotateCcw,
  Satellite,
  ShieldCheck,
  Sparkles,
  ShoppingCart,
  Target,
  Telescope,
  Trophy,
  Weight,
  Zap,
  type LucideIcon,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type DragEvent,
  type SetStateAction,
} from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router";

type Mission = {
  id: string;
  code: string;
  level: number;
  name: string;
  destination: string;
  objective: string;
  payload: string;
  payloadKg: number;
  distance: string;
  duration: string;
  baseDays: number;
  theme: MissionTheme;
  themeLabel: string;
  color: string;
  story: {
    year: string;
    headline: string;
    opening: string;
    briefing: string;
    challenge: string;
    callSign: string;
  };
};

type MissionTheme =
  | "atmosphere"
  | "lunar-water"
  | "mars-weather"
  | "europa-ocean"
  | "asteroid-sample";

type ComponentOption = {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  fact: string;
  rule: string;
  mass: number;
  cost: number;
  energy: number;
  reliability: number;
  cargoCapacity?: number;
  scienceSlots?: number;
  daysFactor?: number;
  scienceModifier?: number;
  energyMode?: "geradas" | "armazenadas" | "geradas/armazenadas";
  statLabel: string;
  statValue: string;
};

type ComponentGroup = {
  id: string;
  name: string;
  shortName: string;
  description: string;
  icon: LucideIcon;
  options: ComponentOption[];
};

type ScienceItem = {
  id: string;
  name: string;
  shortName: string;
  description: string;
  rule: string;
  source: string;
  sourceUrl: string;
  mass: number;
  cost: number;
  slots: number;
  durability: number;
  scienceBonus: number;
  affinity: Partial<Record<MissionTheme, number>>;
};

type StoredScienceItem = {
  instanceId: string;
  itemId: string;
  usesRemaining: number;
  refundable: boolean;
};

type StoredScienceItemData = Omit<StoredScienceItem, "refundable"> &
  Partial<Pick<StoredScienceItem, "refundable">>;

type MissionMetrics = {
  mass: number;
  budget: number;
  equipmentCost: number;
  sciencePurchaseCost: number;
  operatingCost: number;
  projectedCost: number;
  remainingBudget: number;
  days: number;
  energy: number;
  reliability: number;
  scienceCapacity: number;
  efficiency: number;
  cargoCapacity: number;
  cargoUsed: number;
  remainingCargo: number;
  payloadReady: boolean;
  scienceSlotsUsed: number;
  scienceSlotsAvailable: number;
  canLaunch: boolean;
  ready: boolean;
};

type StoredMissionMetrics = Omit<MissionMetrics, "cargoCapacity" | "cargoUsed" | "remainingCargo"> &
  Partial<Pick<MissionMetrics, "cargoCapacity" | "cargoUsed" | "remainingCargo">>;

type LaunchRecord = {
  id: string;
  missionId: string;
  shipSelection: Record<string, string>;
  scienceSelection: string[];
  metrics: MissionMetrics;
  success: boolean;
  reward: number;
  completed: boolean;
};

type EngineerState = {
  budget: number;
  unlockedLevel: number;
  resumePath: string | null;
  cart: Record<string, number>;
  completedBuilds: string[];
  inventory: StoredScienceItem[];
  shipSelections: Record<string, Record<string, string>>;
  scienceSelections: Record<string, string[]>;
  launches: Record<string, LaunchRecord>;
};

const STARTING_ENGINEER_BUDGET = 25;

const INITIAL_ENGINEER_STATE: EngineerState = {
  budget: STARTING_ENGINEER_BUDGET,
  unlockedLevel: 1,
  resumePath: null,
  cart: {},
  completedBuilds: [],
  inventory: [],
  shipSelections: {},
  scienceSelections: {},
  launches: {},
};

const missions: Mission[] = [
  {
    id: "iss",
    code: "MISSÃO 01",
    level: 1,
    name: "Pulso Orbital",
    destination: "Estação Espacial Internacional",
    objective: "Entregar um monitor atmosférico de alta precisão à tripulação da ISS.",
    payload: "120 kg",
    payloadKg: 120,
    distance: "400 km",
    duration: "30 dias",
    baseDays: 30,
    theme: "atmosphere",
    themeLabel: "Atmosfera e qualidade do ar",
    color: "cyan",
    story: {
      year: "2031",
      headline: "O ar da estação conta uma história invisível.",
      opening:
        "A tripulação da ISS detectou variações mínimas na composição do ar. Nada ameaça os astronautas agora, mas os sensores atuais não conseguem explicar o padrão.",
      briefing:
        "Em 72 horas, uma janela de lançamento se abre. Sua equipe deve entregar o AERIS, um monitor atmosférico capaz de identificar partículas e gases em concentrações extremamente baixas.",
      challenge:
        "A carga é sensível a vibrações e precisa chegar à estação com energia suficiente para iniciar a calibração ainda durante o acoplamento.",
      callSign: "AERIS-01",
    },
  },
  {
    id: "luna",
    code: "MISSÃO 02",
    level: 2,
    name: "Eco Lunar",
    destination: "Polo Sul da Lua",
    objective: "Transportar um espectrômetro para mapear depósitos de gelo lunar.",
    payload: "240 kg",
    payloadKg: 240,
    distance: "384 mil km",
    duration: "48 dias",
    baseDays: 48,
    theme: "lunar-water",
    themeLabel: "Gelo e recursos lunares",
    color: "violet",
    story: {
      year: "2034",
      headline: "No polo sul lunar, sombras guardam água há bilhões de anos.",
      opening:
        "Regiões que nunca recebem luz solar podem preservar gelo antigo. Confirmar sua distribuição mudará a forma como futuras bases humanas serão planejadas.",
      briefing:
        "O espectrômetro SELENE deve alcançar uma órbita polar e mapear as crateras permanentemente sombreadas sem contaminar suas medições.",
      challenge:
        "A longa viagem exige navegação precisa, controle térmico rigoroso e energia estável durante passagens prolongadas pela sombra.",
      callSign: "SELENE-02",
    },
  },
  {
    id: "mars",
    code: "MISSÃO 03",
    level: 3,
    name: "Horizonte Rubro",
    destination: "Cratera Jezero, Marte",
    objective: "Levar uma estação meteorológica autônoma para a superfície marciana.",
    payload: "460 kg",
    payloadKg: 460,
    distance: "225 mi km",
    duration: "210 dias",
    baseDays: 210,
    theme: "mars-weather",
    themeLabel: "Clima e geologia de Marte",
    color: "orange",
    story: {
      year: "2037",
      headline: "Uma tempestade se forma além do horizonte de Marte.",
      opening:
        "Os orbitadores registraram uma frente de poeira incomum avançando sobre a Cratera Jezero. Na superfície, ainda faltam dados para prever sua intensidade.",
      briefing:
        "A estação meteorológica ARGO precisa pousar antes da tempestade para medir pressão, ventos, temperatura e partículas suspensas na atmosfera.",
      challenge:
        "Meses de viagem e a entrada atmosférica marciana exigem sistemas redundantes, proteção térmica e comunicação de grande alcance.",
      callSign: "ARGO-03",
    },
  },
  {
    id: "europa",
    code: "MISSÃO 04",
    level: 4,
    name: "Oceano Silencioso",
    destination: "Europa, Júpiter",
    objective: "Inserir uma sonda de análise na órbita da lua congelada.",
    payload: "780 kg",
    payloadKg: 780,
    distance: "628 mi km",
    duration: "5,5 anos",
    baseDays: 2008,
    theme: "europa-ocean",
    themeLabel: "Oceano e química de Europa",
    color: "blue",
    story: {
      year: "2042",
      headline: "Sob o gelo de Europa, um oceano pode abrigar as respostas.",
      opening:
        "Plumas de vapor foram observadas acima da superfície congelada. Elas podem carregar compostos vindos diretamente do oceano subterrâneo.",
      briefing:
        "A sonda NEREIDA deverá entrar em órbita de Europa e analisar essas plumas sem tocar a superfície, procurando sais e moléculas orgânicas.",
      challenge:
        "A radiação de Júpiter é intensa e a luz solar é fraca. Cada sistema precisa resistir por anos longe de qualquer reparo.",
      callSign: "NEREIDA-04",
    },
  },
  {
    id: "bennu",
    code: "MISSÃO 05",
    level: 5,
    name: "Retorno Bennu",
    destination: "Asteroide Bennu",
    objective: "Coletar uma amostra do asteroide e devolvê-la com integridade à Terra.",
    payload: "1.050 kg",
    payloadKg: 1050,
    distance: "2,1 bi km",
    duration: "7 anos",
    baseDays: 2555,
    theme: "asteroid-sample",
    themeLabel: "Amostras e origem do Sistema Solar",
    color: "pink",
    story: {
      year: "2048",
      headline: "Um fragmento do início do Sistema Solar espera por nós.",
      opening:
        "Bennu preserva matéria quase inalterada desde a formação dos planetas. Uma pequena amostra pode revelar como água e carbono chegaram à Terra.",
      briefing:
        "A nave ÍCARO deverá encontrar o asteroide, tocar sua superfície por poucos segundos e trazer a cápsula de amostras de volta.",
      challenge:
        "A gravidade quase inexistente torna cada manobra delicada. A missão precisa combinar autonomia, precisão e proteção para a reentrada.",
      callSign: "ÍCARO-05",
    },
  },
];

const componentGroups: ComponentGroup[] = [
  {
    id: "vehicle",
    name: "Veículo de lançamento",
    shortName: "Veículo",
    description: "Define a capacidade de carga e a energia disponível para alcançar a órbita.",
    icon: Rocket,
    options: [
      {
        id: "falcon",
        name: "Falcon 9",
        subtitle: "Classe média reutilizável",
        description:
          "Um lançador de dois estágios com primeiro estágio reutilizável. Sua capacidade excede a necessidade da carga e oferece boa margem operacional.",
        fact: "O Falcon 9 tem dois estágios e o primeiro pode ser reutilizado. A SpaceX realiza voos de reabastecimento da NASA à ISS com esse veículo.",
        rule: "A carga deve caber no limite do veículo; há 4 compartimentos científicos. Sua massa entra no total da nave e pode aumentar os dias de viagem.",
        mass: 549,
        cost: 6.2,
        energy: 8,
        reliability: 96,
        cargoCapacity: 22800,
        scienceSlots: 4,
        statLabel: "Carga para LEO",
        statValue: "22.800 kg",
      },
      {
        id: "atlas",
        name: "Atlas L-2",
        subtitle: "Lançador leve",
        description:
          "Solução compacta para cargas pequenas em órbita baixa. Reduz o custo, mas deixa pouca margem para sistemas redundantes.",
        fact: "O Atlas L-2 é um veículo didático fictício; lançadores leves reais, como o Electron, colocam pequenos satélites em órbita.",
        rule: "A carga deve caber no limite de 820 kg; há 2 compartimentos científicos. A menor massa reduz o efeito do peso no tempo de viagem.",
        mass: 360,
        cost: 4.8,
        energy: 6,
        reliability: 87,
        cargoCapacity: 820,
        scienceSlots: 2,
        statLabel: "Carga para LEO",
        statValue: "820 kg",
      },
      {
        id: "vulcan",
        name: "Vulcan Centaur",
        subtitle: "Classe pesada",
        description:
          "Grande capacidade e estágio superior de longa duração. É robusto, mas consome uma parcela maior do orçamento.",
        fact: "O estágio superior Centaur V usa hidrogênio e oxigênio líquidos, propelentes criogênicos de alto desempenho.",
        rule: "A carga deve caber no limite de 27.200 kg; há 5 compartimentos científicos. A massa maior entra no cálculo do tempo de viagem.",
        mass: 720,
        cost: 9.3,
        energy: 9,
        reliability: 98,
        cargoCapacity: 27200,
        scienceSlots: 5,
        statLabel: "Carga para LEO",
        statValue: "27.200 kg",
      },
      {
        id: "electron",
        name: "Electron",
        subtitle: "Microlançador",
        description:
          "O menor veículo disponível. É ágil e econômico, mas não comporta a cápsula e a carga desta missão.",
        fact: "O Electron, da Rocket Lab, é um lançador leve usado para colocar pequenos satélites em órbita dedicada.",
        rule: "A carga deve caber no limite de 300 kg; há 1 compartimento científico. Se exceder a capacidade do veículo, a missão não pode ser lançada.",
        mass: 300,
        cost: 3.7,
        energy: 5,
        reliability: 79,
        cargoCapacity: 300,
        scienceSlots: 1,
        statLabel: "Carga para LEO",
        statValue: "300 kg",
      },
      {
        id: "antares",
        name: "Antares 330",
        subtitle: "Carga orbital",
        description:
          "Projetado para missões de carga em órbita baixa. Oferece bom volume interno para instrumentos científicos.",
        fact: "A família Antares lançou naves de carga Cygnus em missões de reabastecimento da ISS.",
        rule: "A carga deve caber no limite de 10.500 kg; há 4 compartimentos científicos. A massa do lançador também afeta a duração estimada da viagem.",
        mass: 610,
        cost: 7.4,
        energy: 8,
        reliability: 93,
        cargoCapacity: 10500,
        scienceSlots: 4,
        statLabel: "Carga para LEO",
        statValue: "10.500 kg",
      },
      {
        id: "newglenn",
        name: "New Glenn",
        subtitle: "Grande volume",
        description:
          "Coifa ampla e primeiro estágio reutilizável. Capacidade muito acima do necessário para esta missão.",
        fact: "O New Glenn tem uma coifa de grande diâmetro e um primeiro estágio projetado para reutilização, permitindo levar cargas volumosas.",
        rule: "A carga deve caber no limite de 45.000 kg; há 6 compartimentos científicos. A capacidade excedente não reduz o custo de compra nem a massa do veículo.",
        mass: 790,
        cost: 10.1,
        energy: 10,
        reliability: 94,
        cargoCapacity: 45000,
        scienceSlots: 6,
        statLabel: "Carga para LEO",
        statValue: "45.000 kg",
      },
    ],
  },
  {
    id: "propulsion",
    name: "Sistema de propulsão",
    shortName: "Propulsão",
    description: "Controla as manobras orbitais e a aproximação final ao destino.",
    icon: Zap,
    options: [
      {
        id: "chemical",
        name: "Química bipropelente",
        subtitle: "Resposta imediata",
        description:
          "Combina combustível e oxidante líquidos para produzir alto empuxo. Ideal para correções rápidas e acoplamento orbital.",
        fact: "A equação de Tsiolkovsky relaciona a mudança de velocidade à massa de propelente.",
        rule: "Alto empuxo encurta a viagem: multiplique os dias por 0,90. O sistema consome 4 unidades de energia.",
        mass: 128,
        cost: 1.8,
        energy: 4,
        reliability: 94,
        daysFactor: 0.9,
        statLabel: "Impulso específico",
        statValue: "320 s",
      },
      {
        id: "ion",
        name: "Propulsão iônica",
        subtitle: "Alta eficiência",
        description:
          "Acelera íons com campos elétricos. Economiza propelente, mas seu baixo empuxo não é adequado para acoplamentos rápidos.",
        fact: "A missão Dawn da NASA usou propulsão iônica para visitar Vesta e Ceres.",
        rule: "O baixo empuxo aumenta os dias de viagem: multiplique por 1,15. Consome 22 unidades de energia.",
        mass: 74,
        cost: 2.9,
        energy: 22,
        reliability: 86,
        daysFactor: 1.15,
        statLabel: "Impulso específico",
        statValue: "3.100 s",
      },
      {
        id: "monoprop",
        name: "Monopropelente",
        subtitle: "Simples e confiável",
        description:
          "Usa um único propelente decomposto por catalisador. Tem menor desempenho, mas alta simplicidade operacional.",
        fact: "A sonda Cassini usava propulsores monopropelentes de hidrazina para controlar sua orientação e trajetória.",
        rule: "Propulsão simples mantém o tempo-base: multiplique os dias por 1,00. Consome 3 unidades de energia.",
        mass: 92,
        cost: 1.3,
        energy: 3,
        reliability: 97,
        daysFactor: 1,
        statLabel: "Impulso específico",
        statValue: "230 s",
      },
    ],
  },
  {
    id: "energy",
    name: "Geração de energia",
    shortName: "Energia",
    description: "Mantém navegação, comunicação e controle térmico durante toda a viagem.",
    icon: BatteryCharging,
    options: [
      {
        id: "solar",
        name: "Painéis solares",
        subtitle: "Energia renovável orbital",
        description:
          "Células fotovoltaicas convertem luz solar em eletricidade. Em órbita baixa, períodos de sombra exigem baterias de apoio.",
        fact: "A ISS usa grandes painéis solares que acompanham o Sol durante a órbita.",
        rule: "Gera 52 unidades de energia, que compensam o consumo dos outros sistemas. A energia restante deve ser de pelo menos 30 unidades.",
        mass: 112,
        cost: 2.1,
        energy: -52,
        reliability: 96,
        energyMode: "geradas",
        statLabel: "Potência nominal",
        statValue: "4,8 kW",
      },
      {
        id: "battery",
        name: "Baterias Li-ion",
        subtitle: "Sistema compacto",
        description:
          "Armazena energia suficiente para uma viagem curta. É simples, mas não oferece geração contínua.",
        fact: "Baterias de íons de lítio substituíram unidades antigas de níquel-hidrogênio na ISS.",
        rule: "Acrescenta 29 unidades armazenadas à reserva; não gera energia continuamente. A energia restante deve ser de pelo menos 30 unidades.",
        mass: 82,
        cost: 1.2,
        energy: -29,
        reliability: 89,
        energyMode: "armazenadas",
        statLabel: "Capacidade",
        statValue: "78 kWh",
      },
      {
        id: "hybrid",
        name: "Sistema híbrido",
        subtitle: "Solar e bateria",
        description:
          "Combina geração solar e armazenamento redundante. Aumenta massa e custo, mas garante energia durante eclipses orbitais.",
        fact: "Uma órbita da ISS dura cerca de 90 minutos; painéis solares e baterias mantêm os sistemas ativos durante os períodos de luz e sombra.",
        rule: "Gera 64 unidades de energia e oferece a maior reserva; a energia restante deve ser de pelo menos 30 unidades.",
        mass: 148,
        cost: 2.8,
        energy: -64,
        reliability: 99,
        energyMode: "geradas/armazenadas",
        statLabel: "Potência nominal",
        statValue: "6,2 kW",
      },
    ],
  },
  {
    id: "protection",
    name: "Proteção da carga",
    shortName: "Proteção",
    description: "Preserva o instrumento contra vibração, temperatura e partículas orbitais.",
    icon: ShieldCheck,
    options: [
      {
        id: "basic",
        name: "Estrutura básica",
        subtitle: "Baixa massa",
        description:
          "Suporte rígido com isolamento térmico mínimo. Adequado apenas para cargas resistentes.",
        fact: "A vibração no lançamento pode danificar óptica e conexões de instrumentos sensíveis.",
        rule: "A proteção básica reduz a capacidade científica em 12 pontos percentuais e aumenta os dias em 10% (×1,10).",
        mass: 42,
        cost: 0.6,
        energy: 0,
        reliability: 76,
        daysFactor: 1.1,
        scienceModifier: -12,
        statLabel: "Atenuação",
        statValue: "32%",
      },
      {
        id: "damped",
        name: "Isolamento ativo",
        subtitle: "Controle de vibração",
        description:
          "Amortecedores e sensores neutralizam oscilações durante o lançamento, protegendo instrumentos de alta precisão.",
        fact: "Testes de vibração em solo simulam as cargas mecânicas que o equipamento sofrerá.",
        rule: "O isolamento ativo aumenta a capacidade científica em 5 pontos percentuais e reduz os dias em 5% (×0,95). Consome 3 unidades de energia.",
        mass: 94,
        cost: 1.7,
        energy: 3,
        reliability: 98,
        daysFactor: 0.95,
        scienceModifier: 5,
        statLabel: "Atenuação",
        statValue: "94%",
      },
      {
        id: "thermal",
        name: "Manta multicamada",
        subtitle: "Proteção térmica",
        description:
          "Camadas refletivas reduzem a troca de calor no vácuo e estabilizam a temperatura do instrumento.",
        fact: "As mantas douradas vistas em sondas são isolantes multicamada, não painéis solares.",
        rule: "A manta multicamada reduz os dias em 5% (×0,95) e a capacidade científica em 2 pontos percentuais. Consome 1 unidade de energia.",
        mass: 67,
        cost: 1.1,
        energy: 1,
        reliability: 91,
        daysFactor: 0.95,
        scienceModifier: -2,
        statLabel: "Faixa térmica",
        statValue: "−80 a 120 °C",
      },
    ],
  },
  {
    id: "navigation",
    name: "Navegação e comunicação",
    shortName: "Navegação",
    description: "Determina a posição da nave e mantém contato com a equipe em solo.",
    icon: Radio,
    options: [
      {
        id: "startracker",
        name: "Star tracker + banda S",
        subtitle: "Precisão orbital",
        description:
          "Câmeras reconhecem padrões de estrelas para orientar a nave, enquanto a antena transmite telemetria.",
        fact: "Star trackers comparam imagens do céu com um catálogo estelar armazenado a bordo.",
        rule: "A navegação de precisão mantém os dias-base (×1,00). O sistema consome 8 unidades de energia.",
        mass: 38,
        cost: 1.4,
        energy: 8,
        reliability: 96,
        daysFactor: 1,
        statLabel: "Precisão angular",
        statValue: "0,01°",
      },
      {
        id: "gps",
        name: "GPS orbital",
        subtitle: "Leve e econômico",
        description:
          "Usa sinais de satélites de navegação para determinar posição e velocidade em órbita baixa.",
        fact: "Receptores em órbita baixa podem usar sinais GPS para estimar posição e velocidade, com correções para o movimento orbital.",
        rule: "O GPS orbital aumenta os dias em 5% (×1,05). O sistema consome 5 unidades de energia.",
        mass: 24,
        cost: 0.8,
        energy: 5,
        reliability: 89,
        daysFactor: 1.05,
        statLabel: "Precisão de posição",
        statValue: "10 m",
      },
      {
        id: "redundant",
        name: "Navegação redundante",
        subtitle: "Máxima confiabilidade",
        description:
          "Combina star tracker, sensores solares e GPS. Continua operando mesmo após a falha de um subsistema.",
        fact: "Sondas e naves da NASA usam componentes redundantes em sistemas críticos para lidar com falhas sem interromper toda a missão.",
        rule: "A navegação redundante reduz os dias em 10% (×0,90), ao custo de maior massa e consumo. Usa 12 unidades de energia.",
        mass: 61,
        cost: 2.2,
        energy: 12,
        reliability: 99,
        daysFactor: 0.9,
        statLabel: "Sistemas de apoio",
        statValue: "3× redundante",
      },
    ],
  },
];

const initialSelection: Record<string, string> = {
  vehicle: "falcon",
  propulsion: "chemical",
  energy: "solar",
  protection: "damped",
  navigation: "startracker",
};

const SCIENCE_ITEMS: ScienceItem[] = [
  {
    id: "iss-air-quality",
    name: "Monitor de qualidade do ar",
    shortName: "Air Quality Monitor",
    description:
      "Instrumentos de monitoramento da ISS acompanham contaminantes e parâmetros do ar em um ambiente fechado de microgravidade.",
    rule: "Mede a composição atmosférica da missão. Afinidade com o tema Atmosfera: 100%; aumenta em 38 p.p. a capacidade científica. Dura 3 missões.",
    source: "Pesquisa na Estação Espacial Internacional",
    sourceUrl:
      "https://www.nasa.gov/international-space-station/space-station-research-and-technology/",
    mass: 48,
    cost: 1.1,
    slots: 1,
    durability: 3,
    scienceBonus: 38,
    affinity: { atmosphere: 100, "mars-weather": 30, "europa-ocean": 15 },
  },
  {
    id: "lunar-neutron",
    name: "Detector de nêutrons lunares",
    shortName: "LEND",
    description:
      "O Lunar Exploration Neutron Detector do Lunar Reconnaissance Orbiter mapeia variações de nêutrons que ajudam a investigar hidrogênio próximo à superfície lunar.",
    rule: "Procura sinais associados a hidrogênio em regiões lunares. Afinidade com Gelo e recursos lunares: 100%; aumenta em 40 p.p. a capacidade científica. Dura 3 missões.",
    source: "Lunar Reconnaissance Orbiter",
    sourceUrl: "https://science.nasa.gov/mission/lro/",
    mass: 56,
    cost: 1.3,
    slots: 1,
    durability: 3,
    scienceBonus: 40,
    affinity: { "lunar-water": 100, "asteroid-sample": 25 },
  },
  {
    id: "lunar-diviner",
    name: "Radiômetro térmico lunar",
    shortName: "Diviner",
    description:
      "O Diviner Lunar Radiometer Experiment mede a temperatura e propriedades térmicas da superfície da Lua, incluindo crateras permanentemente sombreadas.",
    rule: "Relaciona temperatura e terreno lunar. Afinidade com Gelo e recursos lunares: 100%; aumenta em 34 p.p. a capacidade científica. Dura 4 missões.",
    source: "Lunar Reconnaissance Orbiter",
    sourceUrl: "https://science.nasa.gov/mission/lro/",
    mass: 62,
    cost: 1.2,
    slots: 1,
    durability: 4,
    scienceBonus: 34,
    affinity: { "lunar-water": 100, "mars-weather": 35 },
  },
  {
    id: "mars-meda",
    name: "Analisador ambiental marciano",
    shortName: "MEDA",
    description:
      "O Mars Environmental Dynamics Analyzer do rover Perseverance mede condições como temperatura, vento, pressão, umidade e poeira na superfície de Marte.",
    rule: "Registra o clima marciano. Afinidade com Clima e geologia de Marte: 100%; aumenta em 42 p.p. a capacidade científica. Dura 3 missões.",
    source: "Mars 2020 Perseverance",
    sourceUrl: "https://science.nasa.gov/mission/mars-2020-perseverance/",
    mass: 68,
    cost: 1.6,
    slots: 1,
    durability: 3,
    scienceBonus: 42,
    affinity: { "mars-weather": 100, atmosphere: 35, "lunar-water": 20 },
  },
  {
    id: "europa-mise",
    name: "Espectrômetro infravermelho",
    shortName: "MISE",
    description:
      "O Mapping Imaging Spectrometer for Europa observará a composição da superfície e identificará materiais como sais, gelo e compostos orgânicos.",
    rule: "Analisa a composição da superfície de Europa. Afinidade com Oceano e química de Europa: 100%; aumenta em 42 p.p. a capacidade científica. Dura 3 missões.",
    source: "Instrumentos da Europa Clipper",
    sourceUrl: "https://science.nasa.gov/mission/europa-clipper/spacecraft-instruments/",
    mass: 74,
    cost: 1.8,
    slots: 1,
    durability: 3,
    scienceBonus: 42,
    affinity: { "europa-ocean": 100, "lunar-water": 35, "asteroid-sample": 25 },
  },
  {
    id: "europa-reason",
    name: "Radar de penetração no gelo",
    shortName: "REASON",
    description:
      "O radar REASON da Europa Clipper investigará a camada de gelo e estruturas subsuperficiais; ele não é um detector direto de vida.",
    rule: "Sonda o gelo e a estrutura subsuperficial. Afinidade com Oceano e química de Europa: 100%; aumenta em 40 p.p. a capacidade científica. Dura 3 missões.",
    source: "Instrumentos da Europa Clipper",
    sourceUrl: "https://science.nasa.gov/mission/europa-clipper/spacecraft-instruments/",
    mass: 90,
    cost: 1.9,
    slots: 2,
    durability: 3,
    scienceBonus: 40,
    affinity: { "europa-ocean": 100, "lunar-water": 40 },
  },
  {
    id: "bennu-ovirs",
    name: "Espectrômetro de amostras",
    shortName: "OVIRS",
    description:
      "O espectrômetro OVIRS da OSIRIS-REx analisou a composição mineral e molecular da superfície do asteroide Bennu.",
    rule: "Analisa a composição de um asteroide rico em carbono. Afinidade com Amostras e origem do Sistema Solar: 100%; aumenta em 40 p.p. a capacidade científica. Dura 3 missões.",
    source: "OSIRIS-REx",
    sourceUrl: "https://science.nasa.gov/mission/osiris-rex/",
    mass: 58,
    cost: 1.5,
    slots: 1,
    durability: 3,
    scienceBonus: 40,
    affinity: { "asteroid-sample": 100, "europa-ocean": 35, "lunar-water": 20 },
  },
];

const ENGINEER_STORAGE_KEY = "missao-ipe-engineer-v1";
const DAILY_OPERATING_COST = 0.0005;

function isValidResumePath(value: unknown): value is string {
  if (value === "/how-to-play" || value === "/missions") return true;
  if (typeof value !== "string") return false;

  const match = value.match(
    /^\/mission\/([^/]+)\/(context|build\/(\d+)|science(?:\/shop)?|review|results)$/,
  );
  if (!match) return false;

  const missionExists = missions.some((mission) => mission.id === match[1]);
  if (!missionExists) return false;
  if (match[3] === undefined) return true;

  const step = Number(match[3]);
  return Number.isInteger(step) && step >= 0 && step < componentGroups.length;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function migrateEngineerState(value: unknown): EngineerState | undefined {
  if (!isRecord(value)) return undefined;

  const isStringMap = (map: unknown): map is Record<string, string> =>
    isRecord(map) && Object.values(map).every((item) => typeof item === "string");
  const isSelectionMap = (map: unknown): map is Record<string, Record<string, string>> =>
    isRecord(map) && Object.values(map).every(isStringMap);
  const isScienceSelectionMap = (map: unknown): map is Record<string, string[]> =>
    isRecord(map) &&
    Object.values(map).every(
      (selection) => Array.isArray(selection) && selection.every((id) => typeof id === "string"),
    );
  const isStoredItem = (item: unknown): item is StoredScienceItemData =>
    isRecord(item) &&
    typeof item.instanceId === "string" &&
    typeof item.itemId === "string" &&
    typeof item.usesRemaining === "number" &&
    Number.isFinite(item.usesRemaining) &&
    item.usesRemaining > 0 &&
    (item.refundable === undefined || typeof item.refundable === "boolean");
  const isMetrics = (metrics: unknown): metrics is StoredMissionMetrics =>
    isRecord(metrics) &&
    [
      "mass",
      "budget",
      "equipmentCost",
      "sciencePurchaseCost",
      "operatingCost",
      "projectedCost",
      "remainingBudget",
      "days",
      "energy",
      "reliability",
      "scienceCapacity",
      "efficiency",
      "scienceSlotsUsed",
      "scienceSlotsAvailable",
    ].every((key) => typeof metrics[key] === "number") &&
    ["cargoCapacity", "cargoUsed", "remainingCargo"].every(
      (key) => metrics[key] === undefined || typeof metrics[key] === "number",
    ) &&
    ["payloadReady", "canLaunch", "ready"].every((key) => typeof metrics[key] === "boolean");
  const budget =
    typeof value.budget === "number" && Number.isFinite(value.budget)
      ? value.budget
      : STARTING_ENGINEER_BUDGET;
  const unlockedLevel =
    typeof value.unlockedLevel === "number" && Number.isFinite(value.unlockedLevel)
      ? Math.min(missions.length, Math.max(1, Math.floor(value.unlockedLevel)))
      : 1;
  const shipSelections = isSelectionMap(value.shipSelections) ? value.shipSelections : {};
  const scienceSelections = isScienceSelectionMap(value.scienceSelections)
    ? value.scienceSelections
    : {};
  const cart: Record<string, number> = {};
  if (isRecord(value.cart)) {
    for (const [itemId, quantity] of Object.entries(value.cart)) {
      if (
        SCIENCE_ITEMS.some((item) => item.id === itemId) &&
        typeof quantity === "number" &&
        Number.isInteger(quantity) &&
        quantity > 0
      ) {
        cart[itemId] = quantity;
      }
    }
  }
  const inventory = Array.isArray(value.inventory)
    ? value.inventory
        .filter(
          (item): item is StoredScienceItemData =>
            isStoredItem(item) &&
            SCIENCE_ITEMS.some((scienceItem) => scienceItem.id === item.itemId),
        )
        .map((item): StoredScienceItem => ({
          ...item,
          refundable:
            item.refundable !== false &&
            item.usesRemaining ===
              (SCIENCE_ITEMS.find((scienceItem) => scienceItem.id === item.itemId)?.durability ??
                0),
        }))
    : [];
  const completedBuilds = Array.isArray(value.completedBuilds)
    ? value.completedBuilds.filter(
        (missionId): missionId is string =>
          typeof missionId === "string" && missions.some((mission) => mission.id === missionId),
      )
    : [];
  const launches: Record<string, LaunchRecord> = {};

  if (isRecord(value.launches)) {
    for (const [launchKey, savedLaunch] of Object.entries(value.launches)) {
      if (!isRecord(savedLaunch)) continue;
      const missionId =
        typeof savedLaunch.missionId === "string" ? savedLaunch.missionId : launchKey;
      const mission = missions.find((item) => item.id === missionId);
      if (!mission) continue;

      const shipSelection = isStringMap(savedLaunch.shipSelection)
        ? savedLaunch.shipSelection
        : { ...initialSelection, ...shipSelections[missionId] };
      const scienceSelection = Array.isArray(savedLaunch.scienceSelection)
        ? savedLaunch.scienceSelection.filter(
            (itemId): itemId is string =>
              typeof itemId === "string" &&
              SCIENCE_ITEMS.some((scienceItem) => scienceItem.id === itemId),
          )
        : [];
      const currentMetrics = calculateMissionMetrics(
        mission,
        shipSelection,
        scienceSelection,
        inventory,
        scienceSelections,
        budget,
      );
      const savedMetrics = isMetrics(savedLaunch.metrics) ? savedLaunch.metrics : undefined;
      const metrics: MissionMetrics = savedMetrics
        ? {
            ...savedMetrics,
            cargoCapacity: savedMetrics.cargoCapacity ?? currentMetrics.cargoCapacity,
            cargoUsed: savedMetrics.cargoUsed ?? currentMetrics.cargoUsed,
            remainingCargo: savedMetrics.remainingCargo ?? currentMetrics.remainingCargo,
          }
        : currentMetrics;
      const success =
        typeof savedLaunch.success === "boolean" ? savedLaunch.success : metrics.ready;

      launches[missionId] = {
        id: typeof savedLaunch.id === "string" ? savedLaunch.id : crypto.randomUUID(),
        missionId,
        shipSelection,
        scienceSelection,
        metrics,
        success,
        reward:
          typeof savedLaunch.reward === "number" && Number.isFinite(savedLaunch.reward)
            ? savedLaunch.reward
            : success
              ? 5 + mission.level + metrics.scienceCapacity * 0.1
              : 0,
        completed: savedLaunch.completed === true,
      };
    }
  }

  const savedLaunches = Object.values(launches);
  const lastLaunch = savedLaunches[savedLaunches.length - 1];
  const completedLevel = savedLaunches.reduce(
    (level, launch) =>
      launch.completed && launch.success
        ? Math.max(
            level,
            Math.min(
              missions.length,
              (missions.find((mission) => mission.id === launch.missionId)?.level ?? 0) + 1,
            ),
          )
        : level,
    unlockedLevel,
  );
  const hasSavedProgress =
    budget !== STARTING_ENGINEER_BUDGET ||
    completedLevel > 1 ||
    completedBuilds.length > 0 ||
    Object.keys(cart).length > 0 ||
    Object.keys(launches).length > 0;

  return {
    budget,
    unlockedLevel: completedLevel,
    cart,
    resumePath: isValidResumePath(value.resumePath)
      ? value.resumePath
      : lastLaunch
        ? `/mission/${lastLaunch.missionId}/results`
        : hasSavedProgress
          ? "/missions"
          : null,
    completedBuilds,
    inventory,
    shipSelections,
    scienceSelections,
    launches,
  };
}

function loadEngineerState(): EngineerState {
  let saved: string | null;
  try {
    saved = window.localStorage.getItem(ENGINEER_STORAGE_KEY);
  } catch (error) {
    console.error("Não foi possível acessar o perfil salvo do engenheiro.", error);
    return INITIAL_ENGINEER_STATE;
  }
  if (saved === null) return INITIAL_ENGINEER_STATE;

  let parsed: unknown;
  try {
    parsed = JSON.parse(saved);
  } catch (error) {
    preserveInvalidEngineerData(saved, error);
    return INITIAL_ENGINEER_STATE;
  }

  const migrated = migrateEngineerState(parsed);
  if (migrated) return migrated;

  preserveInvalidEngineerData(saved, new Error("Estrutura de perfil inválida."));
  return INITIAL_ENGINEER_STATE;
}

function preserveInvalidEngineerData(saved: string, error: unknown) {
  try {
    window.localStorage.setItem(`${ENGINEER_STORAGE_KEY}-backup`, saved);
  } catch (backupError) {
    console.error("Não foi possível criar uma cópia do perfil inválido.", backupError);
  }
  console.error(
    "Não foi possível migrar o perfil do engenheiro. Um perfil novo será iniciado; os dados anteriores foram preservados quando possível.",
    error,
  );
}

function MissionOrb({ mission }: { mission: Mission }) {
  return (
    <div className="mission-orb" data-color={mission.color} aria-hidden="true">
      <div className="orb-glow" />
      <div className="orb-planet">
        <i />
        <b />
      </div>
      <div className="orb-ring" />
      <Satellite className="orb-satellite" size={23} />
    </div>
  );
}

function MissionStageNavigation({
  mission,
  currentStep,
  inContext = false,
  inScience = false,
  scienceEnabled = false,
}: {
  mission: Mission;
  currentStep?: number;
  inContext?: boolean;
  inScience?: boolean;
  scienceEnabled?: boolean;
}) {
  const navigate = useNavigate();

  return (
    <nav
      className={`stage-navigation${inContext ? " context-stage-navigation" : ""}`}
      aria-label="Navegação da missão"
    >
      <button
        className="stage-nav-card"
        data-state={inContext ? "active" : "context"}
        aria-current={inContext ? "page" : undefined}
        onClick={() => navigate(`/mission/${mission.id}/context`)}
      >
        <i className="stage-nav-planet" data-color={mission.color} aria-hidden="true" />
        <span>Contexto</span>
      </button>
      <button
        className="stage-nav-card"
        data-state={currentStep !== undefined ? "active" : inScience ? "done" : "next"}
        aria-current={currentStep !== undefined ? "step" : undefined}
        onClick={() => navigate(`/mission/${mission.id}/build/0`)}
      >
        <Rocket size={16} />
        <span>1 · Montar nave</span>
      </button>
      <button
        className="stage-nav-card"
        data-state={inScience ? "active" : scienceEnabled ? "done" : "next"}
        aria-current={inScience ? "step" : undefined}
        disabled={!scienceEnabled}
        onClick={() => navigate(`/mission/${mission.id}/science`)}
      >
        <Atom size={16} />
        <span>2 · Itens científicos</span>
      </button>
    </nav>
  );
}

function MissionsScreen({
  unlockedLevel,
  budget,
}: {
  unlockedLevel: number;
  budget: number;
}) {
  const navigate = useNavigate();
  const railRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(max-width: 900px), (max-height: 700px)").matches) return;

    const rail = railRef.current;
    if (!rail) return;

    const targetIndex = Math.max(
      missions.findIndex((mission) => mission.level === unlockedLevel),
      0,
    );
    const targetCard = rail.children.item(targetIndex);
    if (!(targetCard instanceof HTMLElement)) return;

    rail.scrollTo({
      left:
        rail.scrollLeft +
        targetCard.getBoundingClientRect().left -
        rail.getBoundingClientRect().left,
      behavior: "instant",
    });
  }, [unlockedLevel]);

  return (
    <main className="missions-screen">
      <button
        className="player-avatar"
        aria-label="Perfil de Ana Costa"
        title="Perfil de Ana Costa"
      >
        <span>AC</span>
        <i aria-hidden="true" />
      </button>
      <section className="mission-carousel" aria-label="Missões disponíveis">
        <div className="carousel-header">
          <div className="carousel-intro">
            <span className="kicker">PROGRAMA DE EXPLORAÇÃO</span>
            <h1>Escolha sua próxima missão</h1>
            <p>
              Cada conquista abre uma nova fronteira. Tema: ciência inspirada em missões da NASA.
            </p>
          </div>
          <div className="engineer-stats" aria-label="Progresso atual do engenheiro">
            <div>
              <CircleDollarSign size={17} aria-hidden="true" />
              <span>
                <small>ORÇAMENTO ATUAL</small>
                <strong>${budget.toFixed(1)} mi</strong>
              </span>
            </div>
          </div>
        </div>
        <div className="carousel-rail" ref={railRef}>
          {missions.map((mission) => {
            const locked = mission.level > unlockedLevel;
            return (
              <button
                type="button"
                className="mission-card"
                data-locked={locked}
                disabled={locked}
                key={mission.id}
                onClick={() => navigate(`/mission/${mission.id}/context`)}
                aria-label={
                  locked
                    ? `${mission.name} bloqueada. Conclua o nível ${mission.level - 1}.`
                    : `Selecionar missão ${mission.name}`
                }
              >
                <MissionOrb mission={mission} />
                <div className="mission-card-copy">
                  <div className="mission-card-top">
                    <span>{mission.code}</span>
                    <span className="level-chip">
                      {locked && <LockKeyhole size={11} />}
                      NÍVEL {mission.level}
                    </span>
                  </div>
                  <h2>{mission.name}</h2>
                  <p>{mission.destination}</p>
                  <small className="mission-theme">TEMA · {mission.themeLabel}</small>
                  <div className="mission-facts">
                    <span>
                      <Target size={13} /> {mission.payload}
                    </span>
                    <span>
                      <Orbit size={13} /> {mission.distance}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </main>
  );
}

function StartScreen({
  onContinue,
  onRestart,
  restartError,
  hasSavedProgress,
}: {
  onContinue: () => void;
  onRestart: () => void;
  restartError: string | null;
  hasSavedProgress: boolean;
}) {
  return (
    <main className="start-screen">
      <section className="start-panel" aria-labelledby="start-title">
        <div className="start-emblem" aria-hidden="true">
          <Rocket size={34} strokeWidth={1.4} />
          <span />
        </div>
        <span className="kicker">PROGRAMA DE EXPLORAÇÃO</span>
        <h1 id="start-title">Missão Ipê</h1>
        <p>Prepare sua nave, explore novos mundos e avance a cada missão.</p>
        <div className="start-actions">
          <button type="button" className="start-continue" onClick={onContinue}>
            <Play size={18} fill="currentColor" />
            {hasSavedProgress ? "Continuar partida" : "Iniciar partida"}
            <ArrowRight size={17} />
          </button>
          <button type="button" className="start-restart" onClick={onRestart}>
            <RotateCcw size={17} />
            Reiniciar
          </button>
        </div>
        {restartError && (
          <p className="start-error" role="alert">
            {restartError}
          </p>
        )}
        <div className="start-caption">
          <span />
          EXPLORE NOVAS FRONTEIRAS
        </div>
      </section>
    </main>
  );
}

function HowToPlayScreen() {
  const navigate = useNavigate();
  const steps = [
    {
      icon: Target,
      number: "01",
      title: "Escolha uma missão",
      description:
        "Leia o briefing e entenda o destino, a carga e o desafio científico antes de começar.",
    },
    {
      icon: Rocket,
      number: "02",
      title: "Monte sua nave",
      description:
        "Escolha veículo, propulsão, energia, proteção e navegação. Cada peça muda massa, custo, energia ou duração.",
    },
    {
      icon: Atom,
      number: "03",
      title: "Leve ciência a bordo",
      description:
        "Selecione instrumentos do inventário ou compre novos. Confira os espaços disponíveis e o limite de massa.",
    },
    {
      icon: Check,
      number: "04",
      title: "Revise e lance",
      description:
        "Confira os indicadores e o saldo previsto. Lance a missão e descubra se o projeto alcançou seus objetivos.",
    },
  ];

  return (
    <main className="how-to-play-screen">
      <section className="how-to-play-content" aria-labelledby="how-to-play-title">
        <button
          type="button"
          className="how-to-play-back"
          onClick={() => navigate("/")}
        >
          <ArrowLeft size={16} /> Voltar ao início
        </button>
        <header className="how-to-play-heading">
          <span className="kicker">GUIA DE MISSÃO</span>
          <h1 id="how-to-play-title">Como jogar</h1>
          <p>
            Planeje sua nave, proteja a pesquisa e chegue ao destino. Cada escolha
            importa.
          </p>
        </header>

        <div className="how-to-play-steps">
          {steps.map(({ icon: Icon, number, title, description }) => (
            <article className="how-to-play-step" key={number}>
              <div className="how-to-play-step-top">
                <span className="how-to-play-step-icon">
                  <Icon size={20} />
                </span>
                <span className="how-to-play-step-number">{number}</span>
              </div>
              <h2>{title}</h2>
              <p>{description}</p>
            </article>
          ))}
        </div>

        <aside className="how-to-play-tips" aria-labelledby="tips-title">
          <div className="how-to-play-tips-heading">
            <Sparkles size={19} />
            <h2 id="tips-title">Dicas para sua primeira missão</h2>
          </div>
          <ul>
            <li>
              <BatteryCharging size={17} />
              <span>
                <strong>Energia:</strong> mantenha pelo menos 30 unidades de
                reserva para aprovar a missão.
              </span>
            </li>
            <li>
              <Atom size={17} />
              <span>
                <strong>Pesquisa:</strong> instrumentos alinhados ao tema da
                missão aumentam sua capacidade científica.
              </span>
            </li>
            <li>
              <Gauge size={17} />
              <span>
                <strong>Equilíbrio:</strong> acompanhe massa e orçamento. Mais
                massa pode aumentar os dias de viagem e o custo operacional.
              </span>
            </li>
            <li>
              <Trophy size={17} />
              <span>
                <strong>Sucesso completo:</strong> mire em 95% de capacidade
                científica e eficiência de pelo menos 5 pontos por milhão.
              </span>
            </li>
          </ul>
        </aside>

        <button
          type="button"
          className="how-to-play-start"
          onClick={() => navigate("/missions")}
        >
          Escolher missão <ArrowRight size={17} />
        </button>
      </section>
    </main>
  );
}

function MissionContextScreen() {
  const navigate = useNavigate();
  const { missionId = "iss" } = useParams();
  const mission = missions.find((item) => item.id === missionId) ?? missions[0];

  return (
    <main className="context-screen">
      <section className="context-content">
        <MissionStageNavigation mission={mission} inContext />
        <div className="context-story">
          <div className="context-heading">
            <span className="kicker">
              {mission.code} · BRIEFING {mission.story.year}
            </span>
            <h1>{mission.story.headline}</h1>
            <p>{mission.story.opening}</p>
          </div>

          <div className="story-transmission">
            <span className="transmission-icon">
              <Radio size={18} />
            </span>
            <div>
              <small>TRANSMISSÃO DO CONTROLE DA MISSÃO</small>
              <p>{mission.story.briefing}</p>
            </div>
          </div>

          <div className="context-challenge">
            <span>
              <BookOpen size={15} /> SEU DESAFIO
            </span>
            <p>{mission.story.challenge}</p>
          </div>
        </div>

        <aside className="context-visual" aria-label={`Destino: ${mission.destination}`}>
          <div className="context-orbit context-orbit-outer" />
          <div className="context-orbit context-orbit-inner" />
          <MissionOrb mission={mission} />
          <div className="context-target">
            <span>DESTINO CONFIRMADO</span>
            <strong>{mission.destination}</strong>
            <small>{mission.story.callSign}</small>
          </div>
          <dl className="context-metrics">
            <div>
              <dt>
                <Orbit size={13} /> DISTÂNCIA
              </dt>
              <dd>{mission.distance}</dd>
            </div>
            <div>
              <dt>
                <Clock3 size={13} /> DURAÇÃO
              </dt>
              <dd>{mission.duration}</dd>
            </div>
            <div>
              <dt>
                <Target size={13} /> CARGA
              </dt>
              <dd>{mission.payload}</dd>
            </div>
          </dl>
        </aside>
      </section>
      <BottomActions
        backLabel="Missões"
        nextLabel="Montar a nave"
        onBack={() => navigate("/missions")}
        onNext={() => navigate(`/mission/${mission.id}/build/0`)}
      />
    </main>
  );
}

function ComponentVisual({ group, option }: { group: ComponentGroup; option: ComponentOption }) {
  const Icon = group.icon;
  return (
    <div className="component-visual" data-group={group.id} aria-hidden="true">
      <div className="visual-aura" />
      <div className="blueprint-rings">
        <i />
        <i />
        <i />
      </div>
      <div className="technical-object">
        <Icon size={92} strokeWidth={1.15} />
        <span />
      </div>
      <div className="data-node node-a">A.01</div>
      <div className="data-node node-b">SYS.OK</div>
      <div className="data-node node-c">{option.reliability}%</div>
    </div>
  );
}

function BottomActions({
  backLabel = "Voltar",
  nextLabel = "Avançar",
  nextDisabled = false,
  onBack,
  onNext,
}: {
  backLabel?: string;
  nextLabel?: string;
  nextDisabled?: boolean;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <div className="bottom-actions">
      <button className="back-action" onClick={onBack}>
        <ArrowLeft size={17} /> {backLabel}
      </button>
      <button className="next-action" onClick={onNext} disabled={nextDisabled}>
        {nextLabel} <ArrowRight size={17} />
      </button>
    </div>
  );
}

function BuildScreen({
  selection,
  scienceSelection,
  inventory,
  scienceSelections,
  budget,
  scienceEnabled,
  onSelect,
  onCompleteBuild,
}: {
  selection: Record<string, string>;
  scienceSelection: string[];
  inventory: StoredScienceItem[];
  scienceSelections: Record<string, string[]>;
  budget: number;
  scienceEnabled: boolean;
  onSelect: (groupId: string, optionId: string) => void;
  onCompleteBuild: () => void;
}) {
  const navigate = useNavigate();
  const { missionId = "iss", step = "0" } = useParams();
  const stepIndex = Math.min(componentGroups.length - 1, Math.max(0, Number(step) || 0));
  const group = componentGroups[stepIndex];
  const selectedId = selection[group.id] ?? group.options[0].id;
  const selected = group.options.find((option) => option.id === selectedId) ?? group.options[0];
  const mission = missions.find((item) => item.id === missionId) ?? missions[0];
  const metrics = useMemo(
    () =>
      calculateMissionMetrics(
        mission,
        selection,
        scienceSelection,
        inventory,
        scienceSelections,
        budget,
      ),
    [mission, selection, scienceSelection, inventory, scienceSelections, budget],
  );

  const previous = () => {
    if (stepIndex === 0) navigate(`/mission/${missionId}/context`);
    else navigate(`/mission/${missionId}/build/${stepIndex - 1}`);
  };

  const next = () => {
    if (stepIndex === componentGroups.length - 1) {
      onCompleteBuild();
      navigate(`/mission/${missionId}/science`);
    } else navigate(`/mission/${missionId}/build/${stepIndex + 1}`);
  };

  return (
    <main className="build-screen">
      <section className="build-content">
        <BuildStatus metrics={metrics} />
        <div className="stage-copy">
          <div className="stage-heading">
            <span className="kicker">
              {mission.code} · FASE 1 DE 2 · MONTAR NAVE · SISTEMA {stepIndex + 1} DE{" "}
              {componentGroups.length}
            </span>
            <h1>{group.name}</h1>
            <p>{group.description}</p>
          </div>
          <MissionStageNavigation
            mission={mission}
            currentStep={stepIndex}
            scienceEnabled={scienceEnabled}
          />
        </div>

        <div className="component-layout">
          <section className="component-grid-wrap" aria-label={`Opções de ${group.name}`}>
            <div className="component-grid">
              {group.options.map((option) => {
                const active = selected.id === option.id;
                const Icon = group.icon;
                return (
                  <button
                    key={option.id}
                    className="component-card"
                    data-active={active}
                    aria-pressed={active}
                    onClick={() => onSelect(group.id, option.id)}
                  >
                    <span className="component-card-icon">
                      <Icon size={24} strokeWidth={1.45} />
                    </span>
                    <span className="component-card-title">
                      <strong>{option.name}</strong>
                      <small>{option.subtitle}</small>
                    </span>
                    <span className="component-card-stats">
                      <small>
                        <Weight size={11} /> {option.mass} kg
                      </small>
                      <small>
                        <CircleDollarSign size={11} /> {option.cost.toFixed(1)} mi
                      </small>
                    </span>
                    <span className="selection-mark">
                      <Check size={12} />
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="component-detail" aria-live="polite">
            <ComponentVisual group={group} option={selected} />
            <div className="detail-copy">
              <span className="detail-type">DADO CIENTÍFICO · {group.shortName.toUpperCase()}</span>
              <h2>{selected.name}</h2>
              <p>{selected.fact}</p>
              <small className="detail-explanation">{selected.description}</small>
              <dl className="detail-stats">
                <div>
                  <dt>MASSA</dt>
                  <dd>{selected.mass} kg</dd>
                </div>
                <div>
                  <dt>COMPRA FUTURA</dt>
                  <dd>${selected.cost.toFixed(1)} mi</dd>
                </div>
                <div>
                  <dt>ENERGIA</dt>
                  <dd>
                    {selected.energy < 0
                      ? `${Math.abs(selected.energy)} unid. ${selected.energyMode ?? "geradas"}`
                      : `${selected.energy} unid. consumidas`}
                  </dd>
                </div>
                <div>
                  <dt>CONFIABILIDADE</dt>
                  <dd>{selected.reliability}%</dd>
                </div>
                <div>
                  <dt>{selected.statLabel.toUpperCase()}</dt>
                  <dd>{selected.statValue}</dd>
                </div>
                {selected.scienceSlots !== undefined && (
                  <div>
                    <dt>COMPARTIMENTOS CIENTÍFICOS</dt>
                    <dd>{selected.scienceSlots} espaço(s)</dd>
                  </div>
                )}
                {selected.daysFactor !== undefined && (
                  <div>
                    <dt>FATOR DE VIAGEM</dt>
                    <dd>×{selected.daysFactor.toFixed(2)}</dd>
                  </div>
                )}
                {selected.scienceModifier !== undefined && (
                  <div>
                    <dt>EFEITO CIENTÍFICO</dt>
                    <dd>
                      {selected.scienceModifier > 0 ? "+" : ""}
                      {selected.scienceModifier} p.p.
                    </dd>
                  </div>
                )}
              </dl>
              <aside className="nasa-fact">
                <span>
                  <BookOpen size={15} /> REGRA DO JOGO
                </span>
                <p>{selected.rule}</p>
                <small>
                  Os valores numéricos são parâmetros do simulador; o texto principal apresenta o
                  dado científico.
                </small>
              </aside>
            </div>
          </section>
        </div>
      </section>
      <BottomActions
        backLabel={stepIndex === 0 ? "Contexto" : componentGroups[stepIndex - 1].shortName}
        nextLabel={
          stepIndex === componentGroups.length - 1
            ? "Selecionar itens científicos"
            : componentGroups[stepIndex + 1].shortName
        }
        onBack={previous}
        onNext={next}
      />
    </main>
  );
}

function calculateMissionMetrics(
  mission: Mission,
  selection: Record<string, string>,
  scienceSelection: string[],
  inventory: StoredScienceItem[],
  reservedScienceSelections: Record<string, string[]>,
  budget: number,
): MissionMetrics {
  const selectedOptions = componentGroups.map(
    (group) =>
      group.options.find((option) => option.id === selection[group.id]) ?? group.options[0],
  );
  const vehicle = selectedOptions.find((option) => option.cargoCapacity !== undefined);
  const protection = selectedOptions.find((option) => option.scienceModifier !== undefined);
  const propulsionGroup = componentGroups.find((group) => group.id === "propulsion")!;
  const navigationGroup = componentGroups.find((group) => group.id === "navigation")!;
  const propulsion =
    propulsionGroup.options.find((option) => option.id === selection.propulsion) ??
    propulsionGroup.options[0];
  const navigation =
    navigationGroup.options.find((option) => option.id === selection.navigation) ??
    navigationGroup.options[0];

  const selectedScienceItems = scienceSelection
    .map((id) => SCIENCE_ITEMS.find((item) => item.id === id))
    .filter((item): item is ScienceItem => item !== undefined);
  const scienceMass = selectedScienceItems.reduce((sum, item) => sum + item.mass, 0);
  const scienceSlotsUsed = selectedScienceItems.reduce((sum, item) => sum + item.slots, 0);
  const scienceSlotsAvailable = vehicle?.scienceSlots ?? 0;
  const mass =
    mission.payloadKg + scienceMass + selectedOptions.reduce((sum, option) => sum + option.mass, 0);
  const equipmentCost = selectedOptions.reduce((sum, option) => sum + option.cost, 0);
  const energyDraw = selectedOptions.reduce((sum, option) => sum + option.energy, 0);
  const energy = Math.max(0, Math.min(99, 64 - energyDraw));
  const reliability = Math.round(
    selectedOptions.reduce((sum, option) => sum + option.reliability, 0) / selectedOptions.length,
  );
  const inventoryCounts = inventory.reduce<Record<string, number>>((counts, item) => {
    counts[item.itemId] = (counts[item.itemId] ?? 0) + 1;
    return counts;
  }, {});
  const reservedCounts = Object.entries(reservedScienceSelections).reduce<Record<string, number>>(
    (counts, [reservedMissionId, ids]) => {
      if (reservedMissionId === mission.id) return counts;
      for (const id of ids) counts[id] = (counts[id] ?? 0) + 1;
      return counts;
    },
    {},
  );
  const scienceSelectionCounts = scienceSelection.reduce<Record<string, number>>((counts, id) => {
    counts[id] = (counts[id] ?? 0) + 1;
    return counts;
  }, {});
  const sciencePurchaseCost = Object.entries(scienceSelectionCounts).reduce((sum, [id, count]) => {
    const item = SCIENCE_ITEMS.find((entry) => entry.id === id);
    if (!item) return sum;
    const available = Math.max(0, (inventoryCounts[id] ?? 0) - (reservedCounts[id] ?? 0));
    return sum + Math.max(0, count - available) * item.cost;
  }, 0);
  const scienceBonus = selectedScienceItems.reduce(
    (sum, item) => sum + (item.scienceBonus * (item.affinity[mission.theme] ?? 0)) / 100,
    0,
  );
  const scienceCapacity = Math.max(
    0,
    Math.min(
      100,
      Math.round(reliability * 0.25 + (protection?.scienceModifier ?? 0) + scienceBonus),
    ),
  );
  const massFactor = 1 + Math.max(0, mass - 800) / 10000;
  const days = Math.ceil(
    mission.baseDays *
      massFactor *
      (propulsion.daysFactor ?? 1) *
      (navigation.daysFactor ?? 1) *
      (protection?.daysFactor ?? 1),
  );
  const operatingCost = days * DAILY_OPERATING_COST;
  const projectedCost = equipmentCost + sciencePurchaseCost + operatingCost;
  const remainingBudget = budget - projectedCost;
  const efficiency = scienceCapacity / projectedCost;
  const cargoCapacity = vehicle?.cargoCapacity ?? 0;
  const cargoUsed = mission.payloadKg + scienceMass;
  const remainingCargo = cargoCapacity - cargoUsed;
  const payloadReady = cargoCapacity >= cargoUsed && scienceSlotsUsed <= scienceSlotsAvailable;
  const ready =
    payloadReady &&
    mass < 1800 &&
    projectedCost <= budget &&
    energy >= 30 &&
    scienceCapacity >= 95 &&
    efficiency >= 5;

  return {
    mass,
    budget,
    equipmentCost,
    sciencePurchaseCost,
    operatingCost,
    projectedCost,
    remainingBudget,
    days,
    energy,
    reliability,
    scienceCapacity,
    efficiency,
    cargoCapacity,
    cargoUsed,
    remainingCargo,
    payloadReady,
    scienceSlotsUsed,
    scienceSlotsAvailable,
    canLaunch: payloadReady && projectedCost <= budget,
    ready,
  };
}

function formatBudget(value: number) {
  return value < 0 ? `−$${Math.abs(value).toFixed(1)} mi` : `$${value.toFixed(1)} mi`;
}

function BuildStatus({ metrics }: { metrics: MissionMetrics }) {
  return (
    <section className="build-status" aria-label="Indicadores previstos da missão">
      <div className="build-status-card">
        <span>
          <CircleDollarSign size={15} /> ORÇAMENTO PÓS-LANÇAMENTO
        </span>
        <strong>{formatBudget(metrics.remainingBudget)}</strong>
        <div
          className="build-status-track"
          role="progressbar"
          aria-label="Orçamento previsto"
          aria-valuemin={0}
          aria-valuemax={metrics.budget}
          aria-valuenow={Math.min(metrics.projectedCost, metrics.budget)}
        >
          <i
            data-over-budget={metrics.remainingBudget < 0}
            style={{
              width: `${Math.min((metrics.projectedCost / Math.max(metrics.budget, 0.1)) * 100, 100)}%`,
            }}
          />
        </div>
        <small>
          Engenheiro: ${metrics.budget.toFixed(1)} mi · Previsto:{" "}
          {formatBudget(metrics.projectedCost)}
          <br />
          Nave: ${metrics.equipmentCost.toFixed(1)} mi · Instrumentos novos: $
          {metrics.sciencePurchaseCost.toFixed(1)} mi
        </small>
      </div>
      <div className="build-status-card">
        <span>
          <Atom size={15} /> CAPACIDADE CIENTÍFICA
        </span>
        <strong>{metrics.scienceCapacity}%</strong>
        <div
          className="build-status-track science"
          role="progressbar"
          aria-label="Capacidade científica estimada"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={metrics.scienceCapacity}
        >
          <i style={{ width: `${metrics.scienceCapacity}%` }} />
        </div>
        <small>
          Afinidade dos instrumentos com o tema · Eficiência: {metrics.efficiency.toFixed(1)}{" "}
          p.p./US$ mi
        </small>
      </div>
      <div className="build-status-card">
        <span>
          <Clock3 size={15} /> DURAÇÃO DA MISSÃO
        </span>
        <strong>
          {metrics.days.toLocaleString("pt-BR")} <small>dias</small>
        </strong>
        <div className="build-status-track">
          <i style={{ width: `${Math.min((metrics.days / 2555) * 100, 100)}%` }} />
        </div>
        <small>Operação prevista: ${metrics.operatingCost.toFixed(3)} mi</small>
      </div>
      <div className="build-status-card">
        <span>
          <Weight size={15} /> CAPACIDADE DE CARGA
        </span>
        <strong>
          {Math.max(0, metrics.remainingCargo).toLocaleString("pt-BR")} <small>kg restantes</small>
        </strong>
        <div
          className="build-status-track"
          role="progressbar"
          aria-label="Capacidade de carga utilizada"
          aria-valuemin={0}
          aria-valuemax={metrics.cargoCapacity}
          aria-valuenow={Math.min(metrics.cargoUsed, metrics.cargoCapacity)}
        >
          <i
            data-over-budget={metrics.remainingCargo < 0}
            style={{
              width: `${Math.min((metrics.cargoUsed / Math.max(metrics.cargoCapacity, 1)) * 100, 100)}%`,
            }}
          />
        </div>
        <small>
          {metrics.cargoUsed.toLocaleString("pt-BR")} /{" "}
          {metrics.cargoCapacity.toLocaleString("pt-BR")} kg ocupados
          {metrics.remainingCargo < 0 &&
            ` · Excedido por ${Math.abs(metrics.remainingCargo).toLocaleString("pt-BR")} kg`}
        </small>
      </div>
    </section>
  );
}

function ScienceLoadoutScreen({
  selection,
  scienceSelection,
  inventory,
  scienceSelections,
  budget,
  cart,
  setCart,
  onChange,
  onPurchase,
  onReturn,
}: {
  selection: Record<string, string>;
  scienceSelection: string[];
  inventory: StoredScienceItem[];
  scienceSelections: Record<string, string[]>;
  budget: number;
  cart: Record<string, number>;
  setCart: Dispatch<SetStateAction<Record<string, number>>>;
  onChange: (itemId: string, operation: "add" | "remove") => void;
  onPurchase: (cart: Record<string, number>) => void;
  onReturn: (instanceId: string) => void;
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { missionId = "iss" } = useParams();
  const mission = missions.find((item) => item.id === missionId) ?? missions[0];
  const [detailId, setDetailId] = useState(SCIENCE_ITEMS[0].id);
  const [isDragOver, setIsDragOver] = useState(false);
  const [shopFeedback, setShopFeedback] = useState("");
  const [inventoryFeedback, setInventoryFeedback] = useState("");
  const isShopOpen = location.pathname.endsWith("/shop");
  const detail = SCIENCE_ITEMS.find((item) => item.id === detailId) ?? SCIENCE_ITEMS[0];
  const cartItems = Object.entries(cart)
    .map(([itemId, quantity]) => ({
      item: SCIENCE_ITEMS.find((entry) => entry.id === itemId),
      quantity,
    }))
    .filter((entry): entry is { item: ScienceItem; quantity: number } => Boolean(entry.item));
  const cartCount = cartItems.reduce((sum, entry) => sum + entry.quantity, 0);
  const cartTotal = cartItems.reduce((sum, entry) => sum + entry.item.cost * entry.quantity, 0);
  const metrics = calculateMissionMetrics(
    mission,
    selection,
    scienceSelection,
    inventory,
    scienceSelections,
    budget,
  );
  const vehicle = componentGroups
    .find((group) => group.id === "vehicle")
    ?.options.find((item) => item.id === selection.vehicle);
  const selectedCounts = scienceSelection.reduce<Record<string, number>>((counts, id) => {
    counts[id] = (counts[id] ?? 0) + 1;
    return counts;
  }, {});
  const reservedCounts = Object.entries(scienceSelections).reduce<Record<string, number>>(
    (counts, [reservedMissionId, ids]) => {
      if (reservedMissionId !== mission.id) {
        for (const id of ids) counts[id] = (counts[id] ?? 0) + 1;
      }
      return counts;
    },
    {},
  );
  const ownedCounts = inventory.reduce<Record<string, number>>((counts, item) => {
    counts[item.itemId] = (counts[item.itemId] ?? 0) + 1;
    return counts;
  }, {});
  const canAdd = (item: ScienceItem) => {
    const usedSlots = metrics.scienceSlotsUsed + item.slots;
    const selectedCount = selectedCounts[item.id] ?? 0;
    const availableOwned = Math.max(
      0,
      (ownedCounts[item.id] ?? 0) - (reservedCounts[item.id] ?? 0),
    );
    const addedMass = scienceSelection.reduce((sum, id) => {
      return sum + (SCIENCE_ITEMS.find((entry) => entry.id === id)?.mass ?? 0);
    }, 0);
    return (
      selectedCount < availableOwned &&
      usedSlots <= metrics.scienceSlotsAvailable &&
      mission.payloadKg + addedMass + item.mass <= (vehicle?.cargoCapacity ?? 0)
    );
  };
  const missionLoadout = scienceSelection
    .map((itemId, index) => ({
      item: SCIENCE_ITEMS.find((entry) => entry.id === itemId),
      selectionIndex: index,
    }))
    .filter((entry): entry is { item: ScienceItem; selectionIndex: number } => Boolean(entry.item));
  const slotLayout: Array<{
    item?: ScienceItem;
    selectionIndex?: number;
    slotNumber: number;
    continuation?: boolean;
  }> = [];
  let nextSlot = 1;
  for (const entry of missionLoadout) {
    slotLayout.push({ ...entry, slotNumber: nextSlot });
    for (let occupiedSlot = 1; occupiedSlot < entry.item.slots; occupiedSlot += 1) {
      slotLayout.push({
        item: entry.item,
        selectionIndex: entry.selectionIndex,
        slotNumber: nextSlot + occupiedSlot,
        continuation: true,
      });
    }
    nextSlot += entry.item.slots;
  }
  while (nextSlot <= metrics.scienceSlotsAvailable) {
    slotLayout.push({ slotNumber: nextSlot });
    nextSlot += 1;
  }

  const dropItem = (event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    setIsDragOver(false);
    const itemId = event.dataTransfer.getData("text/plain");
    const item = SCIENCE_ITEMS.find((entry) => entry.id === itemId);
    if (item && canAdd(item)) onChange(itemId, "add");
  };

  useEffect(() => {
    if (!isShopOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") navigate(`/mission/${mission.id}/science`);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isShopOpen, mission.id, navigate]);

  if (isShopOpen) {
    return (
      <main className="science-shop-screen">
        <header className="science-shop-header">
          <div className="science-shop-title">
            <span className="kicker">LOJA DE EQUIPAMENTOS · {mission.code}</span>
            <h1>Comprar instrumentos científicos</h1>
            <p>
              Saldo disponível: <strong>{formatBudget(budget)}</strong>
            </p>
          </div>
        </header>

        <div className="science-shop-layout">
          <section className="science-shop-catalog" aria-label="Instrumentos para comprar">
            <header className="science-shop-column-heading">
              <span>
                <Telescope size={16} /> CATÁLOGO
              </span>
              <small>{SCIENCE_ITEMS.length} instrumentos</small>
            </header>
            <div className="science-shop-grid">
              {SCIENCE_ITEMS.map((item) => (
                <button
                  className="science-shop-item"
                  key={item.id}
                  data-selected={detail.id === item.id}
                  onClick={() => {
                    setDetailId(item.id);
                    setShopFeedback("");
                  }}
                >
                  <span className="science-item-icon">
                    <Telescope size={20} />
                  </span>
                  <strong>{item.name}</strong>
                  <small>{item.shortName}</small>
                  <span className="science-shop-price">${item.cost.toFixed(1)} mi</span>
                </button>
              ))}
            </div>
          </section>

          <section className="science-shop-detail" aria-live="polite">
            <header className="science-shop-column-heading">
              <span>
                <BookOpen size={16} /> DETALHES DO ITEM
              </span>
            </header>
            <span className="detail-type">{detail.shortName}</span>
            <h2>{detail.name}</h2>
            <p>{detail.description}</p>
            <button
              className="science-shop-purchase"
              disabled={cartTotal + detail.cost > budget}
              onClick={() => {
                if (cartTotal + detail.cost > budget) {
                  setShopFeedback("Saldo insuficiente para adicionar outra unidade.");
                  return;
                }
                setCart((current) => ({
                  ...current,
                  [detail.id]: (current[detail.id] ?? 0) + 1,
                }));
                setShopFeedback(`${detail.shortName} adicionado ao carrinho.`);
              }}
            >
              <ShoppingCart size={17} />
              {cartTotal + detail.cost > budget
                ? "Saldo insuficiente"
                : `Adicionar ao carrinho · $${detail.cost.toFixed(1)} mi`}
            </button>
            {shopFeedback && (
              <p className="science-shop-feedback" role="status">
                <Check size={14} /> {shopFeedback}
              </p>
            )}
            <dl className="detail-stats">
              <div>
                <dt>PREÇO</dt>
                <dd>${detail.cost.toFixed(1)} mi</dd>
              </div>
              <div>
                <dt>MASSA</dt>
                <dd>{detail.mass} kg</dd>
              </div>
              <div>
                <dt>ESPAÇO NA NAVE</dt>
                <dd>{detail.slots} compartimento(s)</dd>
              </div>
              <div>
                <dt>DURABILIDADE</dt>
                <dd>{detail.durability} missões</dd>
              </div>
              <div>
                <dt>BÔNUS CIENTÍFICO BASE</dt>
                <dd>+{detail.scienceBonus} p.p.</dd>
              </div>
              <div>
                <dt>AFINIDADE COM {mission.themeLabel.toUpperCase()}</dt>
                <dd>{detail.affinity[mission.theme] ?? 0}%</dd>
              </div>
              <div>
                <dt>NO INVENTÁRIO</dt>
                <dd>{ownedCounts[detail.id] ?? 0} unidade(s)</dd>
              </div>
            </dl>
            <aside className="nasa-fact">
              <span>
                <BookOpen size={15} /> REGRA DO JOGO
              </span>
              <p>{detail.rule}</p>
            </aside>
          </section>

          <section className="science-cart science-cart-panel" aria-label="Carrinho de compras">
            <header>
              <span>
                <ShoppingCart size={17} /> CARRINHO
              </span>
              <strong>{cartCount} item(ns)</strong>
            </header>
            {cartItems.length === 0 ? (
              <p className="science-cart-empty">
                Seu carrinho está vazio. Escolha um instrumento no catálogo para começar.
              </p>
            ) : (
              <ul>
                {cartItems.map(({ item, quantity }) => (
                  <li key={item.id}>
                    <span>
                      <strong>{item.shortName}</strong>
                      <small>
                        {quantity} × ${item.cost.toFixed(1)} mi
                      </small>
                    </span>
                    <div className="science-cart-quantity">
                      <button
                        aria-label={`Remover uma unidade de ${item.name} do carrinho`}
                        onClick={() => {
                          setCart((current) => {
                            const nextQuantity = (current[item.id] ?? 0) - 1;
                            if (nextQuantity <= 0) {
                              const next = { ...current };
                              delete next[item.id];
                              return next;
                            }
                            return { ...current, [item.id]: nextQuantity };
                          });
                          setShopFeedback(`${item.shortName} removido do carrinho.`);
                        }}
                      >
                        <Minus size={13} />
                      </button>
                      <strong>{quantity}</strong>
                      <button
                        aria-label={`Adicionar uma unidade de ${item.name} ao carrinho`}
                        disabled={cartTotal + item.cost > budget}
                        onClick={() => {
                          setCart((current) => ({
                            ...current,
                            [item.id]: (current[item.id] ?? 0) + 1,
                          }));
                          setShopFeedback(`${item.shortName} adicionado ao carrinho.`);
                        }}
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <div className="science-cart-total">
              <span>Total da compra</span>
              <strong>${cartTotal.toFixed(1)} mi</strong>
            </div>
            <small className="science-cart-balance">
              Saldo após a compra: {formatBudget(budget - cartTotal)}
            </small>
          </section>
        </div>
        <div className="bottom-actions">
          <button
            className="next-action"
            disabled={cartCount === 0 || cartTotal > budget}
            onClick={() => {
              onPurchase(cart);
              setCart({});
              navigate(`/mission/${mission.id}/science`);
            }}
          >
            Finalizar compra <ArrowRight size={17} />
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="build-screen science-screen">
      <section className="build-content">
        <BuildStatus metrics={metrics} />
        <div className="stage-copy">
          <div className="stage-heading">
            <span className="kicker">{mission.code} · FASE 2 DE 2 · CARGA CIENTÍFICA</span>
            <h1>Escolha os instrumentos da missão</h1>
            <p>
              Tema: <strong>{mission.themeLabel}</strong>. Equipamentos relacionados ao tema
              contribuem mais para a capacidade científica.
            </p>
          </div>
          <MissionStageNavigation mission={mission} inScience scienceEnabled />
        </div>

        <div className="science-loadout">
          <section className="science-catalog" aria-label="Itens científicos disponíveis">
            <header className="science-list-heading">
              <span>
                <Telescope size={15} /> MEU INVENTÁRIO
              </span>
              <button
                className="science-buy-button"
                onClick={() => {
                  setShopFeedback("");
                  navigate(`/mission/${mission.id}/science/shop`);
                }}
              >
                <ShoppingCart size={15} /> Comprar itens
                {cartCount > 0 && <span>{cartCount}</span>}
              </button>
            </header>
            <div className="science-catalog-grid">
              {SCIENCE_ITEMS.filter((item) => (ownedCounts[item.id] ?? 0) > 0).map((item) => {
                const affinity = item.affinity[mission.theme] ?? 0;
                const selectedCount = selectedCounts[item.id] ?? 0;
                const availableOwned = Math.max(
                  0,
                  (ownedCounts[item.id] ?? 0) - (reservedCounts[item.id] ?? 0),
                );
                const addDisabled = !canAdd(item);
                const refundableCount = inventory.filter(
                  (entry) => entry.itemId === item.id && entry.refundable,
                ).length;
                const returnableCount = Math.min(
                  refundableCount,
                  Math.max(
                    0,
                    (ownedCounts[item.id] ?? 0) - (reservedCounts[item.id] ?? 0) - selectedCount,
                  ),
                );
                const returnableInstance = inventory.find(
                  (entry) => entry.itemId === item.id && entry.refundable,
                );
                return (
                  <article
                    className="science-item-card"
                    key={item.id}
                    data-selected={selectedCount > 0}
                    draggable={!addDisabled}
                    onDragStart={(event) => {
                      if (addDisabled) {
                        event.preventDefault();
                        return;
                      }
                      event.dataTransfer.setData("text/plain", item.id);
                      event.dataTransfer.effectAllowed = "copy";
                      setDetailId(item.id);
                    }}
                  >
                    <button
                      className="science-item-info"
                      onClick={() => setDetailId(item.id)}
                      aria-pressed={detailId === item.id}
                    >
                      <span className="science-item-icon">
                        <Telescope size={20} />
                      </span>
                      <span>
                        <strong>{item.name}</strong>
                        <small>
                          {item.shortName} · {item.mass} kg · {item.slots} slot(s) · afinidade{" "}
                          {affinity}%
                        </small>
                      </span>
                    </button>
                    <div className="science-item-actions">
                      <small>
                        {ownedCounts[item.id]} unidade(s) · {availableOwned} disponível(is)
                      </small>
                      <strong aria-label={`${selectedCount} selecionados`}>{selectedCount}</strong>
                    </div>
                    <button
                      className="science-move-button"
                      aria-label={`Adicionar ${item.name} à missão`}
                      disabled={addDisabled}
                      onClick={() => {
                        setDetailId(item.id);
                        onChange(item.id, "add");
                      }}
                    >
                      <ArrowRight size={17} />
                    </button>
                    <div className="science-inventory-return">
                      <button
                        disabled={returnableCount === 0 || !returnableInstance}
                        onClick={() => {
                          if (!returnableInstance) return;
                          onReturn(returnableInstance.instanceId);
                          setInventoryFeedback(
                            `${item.shortName} devolvido. $${item.cost.toFixed(1)} mi foram reembolsados.`,
                          );
                        }}
                      >
                        Devolver 1 · +${item.cost.toFixed(1)} mi
                      </button>
                      <small>
                        {refundableCount === 0
                          ? "Itens usados não podem ser devolvidos."
                          : returnableCount === 0
                            ? "Remova da missão para devolver."
                            : `${returnableCount} unidade(s) sem uso devolvível(is).`}
                      </small>
                    </div>
                  </article>
                );
              })}
              {inventory.length === 0 && (
                <p className="science-inventory-empty">
                  Seu inventário está vazio. Compre instrumentos para equipar a missão.
                </p>
              )}
            </div>
            {inventoryFeedback && (
              <p className="science-inventory-feedback" role="status">
                <Check size={14} /> {inventoryFeedback}
              </p>
            )}
          </section>

          <section
            className="science-mission-list"
            aria-label="Itens científicos selecionados para a missão"
            data-drag-over={isDragOver}
            onDragOver={(event) => {
              event.preventDefault();
              event.dataTransfer.dropEffect = "copy";
              setIsDragOver(true);
            }}
            onDragLeave={(event) => {
              if (
                !(event.relatedTarget instanceof Node) ||
                !event.currentTarget.contains(event.relatedTarget)
              ) {
                setIsDragOver(false);
              }
            }}
            onDrop={dropItem}
          >
            <header className="science-list-heading">
              <span>
                <Rocket size={15} /> ITENS DA MISSÃO
              </span>
              <strong>
                {metrics.scienceSlotsUsed} / {metrics.scienceSlotsAvailable} slots
              </strong>
            </header>
            <div className="science-slots">
              {slotLayout.map(({ item, selectionIndex, slotNumber, continuation }) =>
                item ? (
                  <article
                    className={`science-slot science-slot-filled${continuation ? " science-slot-continuation" : ""}`}
                    key={`mission-item-${selectionIndex}-slot-${slotNumber}`}
                  >
                    <span className="science-slot-number">SLOT {slotNumber}</span>
                    {continuation ? (
                      <small>Compartimento usado por {item.shortName}</small>
                    ) : (
                      <>
                        <strong>{item.name}</strong>
                        <small>
                          {item.mass} kg · {item.slots} slot(s) · afinidade{" "}
                          {item.affinity[mission.theme] ?? 0}%
                        </small>
                        <button
                          aria-label={`Remover ${item.name} da missão`}
                          onClick={() => onChange(item.id, "remove")}
                        >
                          <ArrowLeft size={15} /> Remover
                        </button>
                      </>
                    )}
                  </article>
                ) : (
                  <div className="science-slot science-slot-empty" key={`empty-slot-${slotNumber}`}>
                    <span>SLOT {slotNumber}</span>
                    <small>Arraste um item para cá</small>
                  </div>
                ),
              )}
            </div>
          </section>

          <section className="science-detail" aria-live="polite">
            <span className="detail-type">DADO CIENTÍFICO · {detail.shortName}</span>
            <h2>{detail.name}</h2>
            <p>{detail.description}</p>
            <dl className="detail-stats">
              <div>
                <dt>MASSA</dt>
                <dd>{detail.mass} kg</dd>
              </div>
              <div>
                <dt>CUSTO DE COMPRA</dt>
                <dd>${detail.cost.toFixed(1)} mi</dd>
              </div>
              <div>
                <dt>ESPAÇO NA NAVE</dt>
                <dd>{detail.slots} compartimento(s)</dd>
              </div>
              <div>
                <dt>DURABILIDADE</dt>
                <dd>{detail.durability} missões</dd>
              </div>
              <div>
                <dt>BÔNUS CIENTÍFICO BASE</dt>
                <dd>+{detail.scienceBonus} p.p.</dd>
              </div>
              <div>
                <dt>AFINIDADE COM {mission.themeLabel.toUpperCase()}</dt>
                <dd>{detail.affinity[mission.theme] ?? 0}%</dd>
              </div>
              <div>
                <dt>NO INVENTÁRIO</dt>
                <dd>
                  {inventory.filter((item) => item.itemId === detail.id).length} unidade(s)
                  {inventory
                    .filter((item) => item.itemId === detail.id)
                    .map((item) => ` · ${item.usesRemaining} uso(s)`)
                    .join("")}
                </dd>
              </div>
            </dl>
            <aside className="nasa-fact">
              <span>
                <BookOpen size={15} /> REGRA DO JOGO
              </span>
              <p>{detail.rule}</p>
              <small>
                Valores de massa, custo, bônus e durabilidade são parâmetros didáticos, não
                especificações oficiais.
              </small>
            </aside>
            <a className="science-source" href={detail.sourceUrl} target="_blank" rel="noreferrer">
              Fonte NASA · {detail.source} <ArrowRight size={14} />
            </a>
          </section>
        </div>
      </section>
      <BottomActions
        backLabel="Montagem da nave"
        nextLabel="Revisar missão"
        onBack={() => navigate(`/mission/${mission.id}/build/${componentGroups.length - 1}`)}
        onNext={() => navigate(`/mission/${mission.id}/review`)}
      />
    </main>
  );
}

function ReviewScreen({
  selection,
  scienceSelection,
  inventory,
  scienceSelections,
  budget,
  onLaunch,
}: {
  selection: Record<string, string>;
  scienceSelection: string[];
  inventory: StoredScienceItem[];
  scienceSelections: Record<string, string[]>;
  budget: number;
  onLaunch: () => void;
}) {
  const navigate = useNavigate();
  const { missionId = "iss" } = useParams();
  const mission = missions.find((item) => item.id === missionId) ?? missions[0];
  const metrics = calculateMissionMetrics(
    mission,
    selection,
    scienceSelection,
    inventory,
    scienceSelections,
    budget,
  );
  const selectedItems = scienceSelection
    .map((id) => SCIENCE_ITEMS.find((item) => item.id === id))
    .filter((item): item is ScienceItem => item !== undefined);
  const vehicleGroup = componentGroups.find((group) =>
    group.options.some((option) => option.cargoCapacity !== undefined),
  );
  const selectedVehicle = vehicleGroup?.options.find(
    (option) => option.id === selection[vehicleGroup.id],
  );
  const sciencePayloadMass =
    mission.payloadKg + selectedItems.reduce((sum, item) => sum + item.mass, 0);
  const exceedsCargoCapacity =
    sciencePayloadMass > (selectedVehicle?.cargoCapacity ?? Number.POSITIVE_INFINITY);
  const exceedsScienceSlots = metrics.scienceSlotsUsed > metrics.scienceSlotsAvailable;
  const reviewCaveats = [
    exceedsCargoCapacity
      ? `A carga científica soma ${sciencePayloadMass} kg, acima da capacidade de ${selectedVehicle?.cargoCapacity} kg do veículo. Escolha um veículo com maior capacidade ou reduza os instrumentos.`
      : undefined,
    exceedsScienceSlots
      ? `Os instrumentos ocupam ${metrics.scienceSlotsUsed} espaços, mas o veículo oferece ${metrics.scienceSlotsAvailable}. Remova instrumentos ou escolha um veículo com mais espaços.`
      : undefined,
    metrics.mass >= 1800
      ? `A massa total é ${metrics.mass.toLocaleString("pt-BR")} kg; o limite da missão é menor que 1.800 kg. Reduza a massa da nave ou da carga.`
      : undefined,
    metrics.projectedCost > budget
      ? `O custo projetado de ${formatBudget(metrics.projectedCost)} excede o orçamento disponível de ${formatBudget(budget)}. Reduza os custos de montagem, instrumentos ou operação.`
      : undefined,
    metrics.energy < 30
      ? `A reserva de energia é de ${metrics.energy} unidades, abaixo da meta de 30. Escolha sistemas que consumam menos energia ou forneçam mais.`
      : undefined,
    metrics.scienceCapacity < 95
      ? `A capacidade científica está em ${metrics.scienceCapacity}%, abaixo da meta de 95%. Melhore a confiabilidade ou selecione instrumentos com maior afinidade com a missão.`
      : undefined,
    metrics.efficiency < 5
      ? `A eficiência científica é ${metrics.efficiency.toLocaleString("pt-BR", { maximumFractionDigits: 2 })}, abaixo da meta de 5. Aumente a capacidade científica ou reduza o custo projetado.`
      : undefined,
  ].filter((caveat): caveat is string => caveat !== undefined);

  return (
    <main className="review-screen">
      <section className="review-content">
        <div className="review-intro">
          <span className="kicker">REVISÃO FINAL · {mission.code}</span>
          <h1>Arquitetura pronta para voo</h1>
          <p>Confira os sistemas e os indicadores antes de executar a missão.</p>
        </div>
        <div className="review-layout">
          <section className="assembly-overview">
            <div className="review-spacecraft" aria-hidden="true">
              <div className="review-orbit" />
              <Rocket size={130} strokeWidth={0.85} />
              <span className="review-pulse" />
            </div>
            <div className="selected-systems">
              {componentGroups.map((group) => {
                const option = group.options.find((item) => item.id === selection[group.id])!;
                const Icon = group.icon;
                return (
                  <div key={group.id}>
                    <span>
                      <Icon size={15} />
                    </span>
                    <small>{group.shortName}</small>
                    <strong>{option.name}</strong>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="mission-summary">
            <div className="summary-destination">
              <span>
                <Orbit size={17} /> DESTINO
              </span>
              <strong>{mission.destination}</strong>
              <small>Tema científico: {mission.themeLabel}</small>
              <small>{mission.objective}</small>
              <small>{metrics.days.toLocaleString("pt-BR")} dias estimados</small>
            </div>
            <div className="summary-metrics">
              <div>
                <span>
                  <Weight size={16} /> MASSA TOTAL
                </span>
                <strong>{metrics.mass.toLocaleString("pt-BR")} kg</strong>
                <small>
                  {metrics.payloadReady ? "Carga cabe no veículo" : "Carga excede a capacidade"}
                </small>
              </div>
              <div>
                <span>
                  <BatteryCharging size={16} /> RESERVA DE ENERGIA
                </span>
                <strong>{metrics.energy} unid.</strong>
                <small>Meta: 30 unidades</small>
              </div>
              <div>
                <span>
                  <CircleDollarSign size={16} /> CUSTO
                </span>
                <strong>${metrics.projectedCost.toFixed(1)} mi</strong>
                <small>Compra + operação · saldo: {formatBudget(metrics.remainingBudget)}</small>
              </div>
              <div>
                <span>
                  <ShieldCheck size={16} /> CAPACIDADE CIENTÍFICA
                </span>
                <strong>{metrics.scienceCapacity}%</strong>
                <small>Meta: 95%</small>
              </div>
            </div>
            <div className="review-science-selection">
              <strong>ITENS CIENTÍFICOS A BORDO</strong>
              {selectedItems.length === 0 ? (
                <p>Nenhum instrumento selecionado.</p>
              ) : (
                <ul>
                  {selectedItems.map((item, index) => (
                    <li key={`${item.id}-${index}`}>
                      {item.name} · {item.mass} kg · afinidade {item.affinity[mission.theme] ?? 0}%
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="board-status" data-ready={metrics.ready}>
              <span>{metrics.ready ? <Check size={19} /> : <Gauge size={19} />}</span>
              <div>
                <small>MISSION REVIEW BOARD</small>
                <strong>
                  {metrics.ready ? "Projeto aprovado" : "Projeto aprovado com ressalvas"}
                </strong>
                <p>
                  {metrics.ready
                    ? "Todos os sistemas críticos estão dentro dos limites."
                    : metrics.canLaunch
                      ? "A configuração pode voar, mas alguns critérios de sucesso não foram atingidos. Veja as ressalvas abaixo."
                      : "A configuração não pode voar ainda. Corrija as ressalvas abaixo para liberar o lançamento."}
                </p>
                {!metrics.ready && reviewCaveats.length > 0 && (
                  <ul className="review-caveats" aria-label="Ressalvas da missão">
                    {reviewCaveats.map((caveat) => (
                      <li key={caveat}>{caveat}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </section>
        </div>
      </section>
      <BottomActions
        backLabel="Itens científicos"
        nextLabel="Lançar missão"
        nextDisabled={!metrics.canLaunch}
        onBack={() => navigate(`/mission/${missionId}/science`)}
        onNext={() => {
          onLaunch();
          navigate(`/mission/${missionId}/results`);
        }}
      />
    </main>
  );
}

function ResultsScreen({
  launch,
  onComplete,
}: {
  launch?: LaunchRecord;
  onComplete: (missionId: string, launchId: string) => void;
}) {
  const navigate = useNavigate();
  const { missionId = "iss" } = useParams();
  const mission = missions.find((item) => item.id === missionId) ?? missions[0];
  const [showResults, setShowResults] = useState(missionId !== "luna" || !launch);

  useEffect(() => {
    if (!launch || missionId !== "luna") return;
    const timer = window.setTimeout(() => setShowResults(true), 3000);
    return () => window.clearTimeout(timer);
  }, [launch, missionId]);

  if (!launch) return <Navigate to={`/mission/${mission.id}/review`} replace />;
  const metrics = launch.metrics;
  const scienceItems = launch.scienceSelection
    .map((itemId) => SCIENCE_ITEMS.find((item) => item.id === itemId))
    .filter((item): item is ScienceItem => item !== undefined);

  const finish = () => {
    onComplete(mission.id, launch.id);
    navigate("/missions");
  };

  return (
    <main className="results-screen">
      {missionId === "luna" && !showResults && (
        <div className="lunar-intro" role="status" aria-label="A sonda está orbitando a Lua">
          <div className="lunar-orbit-scene" aria-hidden="true">
            <div className="lunar-planet">
              <span className="lunar-crater lunar-crater-one" />
              <span className="lunar-crater lunar-crater-two" />
              <span className="lunar-crater lunar-crater-three" />
            </div>
            <div className="lunar-orbit">
              <span className="lunar-orbiting-body" />
            </div>
          </div>
          <span className="kicker">APROXIMAÇÃO LUNAR</span>
          <p>A sonda está entrando em órbita...</p>
        </div>
      )}
      <div className="result-ambient" aria-hidden="true">
        <div className="result-planet" />
        <div className="result-path" />
        <Satellite size={36} />
      </div>
      <section className="results-card" aria-hidden={!showResults} inert={!showResults}>
        <div className="result-emblem" data-success={launch.success}>
          {launch.success ? <Trophy size={34} /> : <Target size={34} />}
        </div>
        <span className="kicker">RELATÓRIO · {mission.code}</span>
        <h1>{launch.success ? "Missão concluída" : "Sucesso parcial"}</h1>
        <p>
          {launch.success
            ? `A missão chegou a ${mission.destination} e cumpriu os parâmetros científicos.`
            : "A configuração não atingiu todos os critérios. Consulte os indicadores e reprojete a nave."}
        </p>
        <div className="result-score">
          <div>
            <small>CAPACIDADE CIENTÍFICA</small>
            <strong>{metrics.scienceCapacity}%</strong>
          </div>
          <div>
            <small>DIAS DE MISSÃO</small>
            <strong>{metrics.days.toLocaleString("pt-BR")}</strong>
          </div>
          <div>
            <small>PAGO NO LANÇAMENTO</small>
            <strong>${metrics.projectedCost.toFixed(1)} mi</strong>
            <small>Saldo: {formatBudget(metrics.remainingBudget)}</small>
          </div>
        </div>
        <div className="result-reward">
          <CircleDollarSign size={17} />
          {launch.success
            ? `Recompensa ao concluir: +$${launch.reward.toFixed(1)} mi`
            : "Sem recompensa financeira nesta missão"}
        </div>
        <div className="result-loadout">
          <strong>ITENS CIENTÍFICOS USADOS</strong>
          <span>
            {scienceItems.length > 0
              ? scienceItems.map((item) => item.name).join(" · ")
              : "Nenhum instrumento selecionado"}
          </span>
        </div>
        <aside className="result-learning">
          <Sparkles size={18} />
          <div>
            <strong>O que aprendemos</strong>
            <p>
              Em engenharia espacial, massa, energia e redundância estão conectadas. Uma escolha
              mais segura quase sempre exige aceitar maior custo ou peso.
            </p>
          </div>
        </aside>
        <div className="result-buttons">
          <button onClick={() => navigate(`/mission/${missionId}/build/0`)}>
            <RotateCcw size={16} /> Reprojetar
          </button>
          <button className="next-action" onClick={finish}>
            {launch.success ? "Receber recompensa e continuar" : "Voltar às missões"}{" "}
            <ArrowRight size={16} />
          </button>
        </div>
      </section>
    </main>
  );
}

function Game() {
  const [engineer, setEngineer] = useState<EngineerState>(loadEngineerState);
  const [restartError, setRestartError] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const setCart: Dispatch<SetStateAction<Record<string, number>>> = (nextCart) =>
    setEngineer((current) => ({
      ...current,
      cart: typeof nextCart === "function" ? nextCart(current.cart) : nextCart,
    }));

  useEffect(() => {
    try {
      window.localStorage.setItem(ENGINEER_STORAGE_KEY, JSON.stringify(engineer));
    } catch (error) {
      console.error("Não foi possível salvar o perfil do engenheiro.", error);
    }
  }, [engineer]);

  useEffect(() => {
    if (location.pathname === "/") return;
    setEngineer((current) =>
      current.resumePath === location.pathname
        ? current
        : { ...current, resumePath: location.pathname },
    );
  }, [location.pathname]);

  function restartGame() {
    if (!window.confirm("Isso apagará todo o progresso salvo. Deseja reiniciar o jogo?")) return;

    try {
      window.localStorage.removeItem(`${ENGINEER_STORAGE_KEY}-backup`);
      window.localStorage.removeItem(ENGINEER_STORAGE_KEY);
    } catch (error) {
      console.error("Não foi possível limpar os dados salvos do engenheiro.", error);
      setRestartError("Não foi possível apagar os dados salvos. Tente novamente.");
      return;
    }

    setRestartError(null);
    setEngineer(INITIAL_ENGINEER_STATE);
    navigate("/how-to-play");
  }

  return (
    <Routes key={location.pathname}>
      <Route
        path="/"
        element={
          <StartScreen
            onContinue={() => navigate(engineer.resumePath ?? "/how-to-play")}
            onRestart={restartGame}
            restartError={restartError}
            hasSavedProgress={engineer.resumePath !== null}
          />
        }
      />
      <Route path="/how-to-play" element={<HowToPlayScreen />} />
      <Route
        path="/missions"
        element={
          <MissionsScreen
            unlockedLevel={engineer.unlockedLevel}
            budget={engineer.budget}
          />
        }
      />
      <Route path="/mission/:missionId/context" element={<MissionContextScreen />} />
      <Route
        path="/mission/:missionId/build/:step"
        element={<BuildRoute engineer={engineer} setEngineer={setEngineer} />}
      />
      <Route
        path="/mission/:missionId/science"
        element={
          <ScienceRoute
            engineer={engineer}
            setEngineer={setEngineer}
            cart={engineer.cart}
            setCart={setCart}
          />
        }
      />
      <Route
        path="/mission/:missionId/science/shop"
        element={
          <ScienceRoute
            engineer={engineer}
            setEngineer={setEngineer}
            cart={engineer.cart}
            setCart={setCart}
          />
        }
      />
      <Route
        path="/mission/:missionId/review"
        element={
          <ReviewRoute
            engineer={engineer}
            onLaunch={(missionId) => launchMission(missionId, engineer, setEngineer)}
          />
        }
      />
      <Route
        path="/mission/:missionId/results"
        element={<ResultsRoute engineer={engineer} setEngineer={setEngineer} />}
      />
      <Route path="*" element={<Navigate to="/missions" replace />} />
    </Routes>
  );
}

function getMissionShipSelection(engineer: EngineerState, missionId: string) {
  return { ...initialSelection, ...engineer.shipSelections[missionId] };
}

function BuildRoute({
  engineer,
  setEngineer,
}: {
  engineer: EngineerState;
  setEngineer: Dispatch<SetStateAction<EngineerState>>;
}) {
  const { missionId = "iss" } = useParams();
  return (
    <BuildScreen
      selection={getMissionShipSelection(engineer, missionId)}
      scienceSelection={engineer.scienceSelections[missionId] ?? []}
      inventory={engineer.inventory}
      scienceSelections={engineer.scienceSelections}
      budget={engineer.budget}
      scienceEnabled={engineer.completedBuilds.includes(missionId)}
      onCompleteBuild={() =>
        setEngineer((current) => ({
          ...current,
          completedBuilds: current.completedBuilds.includes(missionId)
            ? current.completedBuilds
            : [...current.completedBuilds, missionId],
        }))
      }
      onSelect={(groupId, optionId) =>
        setEngineer((current) => ({
          ...current,
          shipSelections: {
            ...current.shipSelections,
            [missionId]: {
              ...getMissionShipSelection(current, missionId),
              [groupId]: optionId,
            },
          },
        }))
      }
    />
  );
}

function ScienceRoute({
  engineer,
  setEngineer,
  cart,
  setCart,
}: {
  engineer: EngineerState;
  setEngineer: Dispatch<SetStateAction<EngineerState>>;
  cart: Record<string, number>;
  setCart: Dispatch<SetStateAction<Record<string, number>>>;
}) {
  const { missionId = "iss" } = useParams();
  const mission = missions.find((item) => item.id === missionId) ?? missions[0];
  if (!engineer.completedBuilds.includes(missionId)) {
    return <Navigate to={`/mission/${mission.id}/build/0`} replace />;
  }
  return (
    <ScienceLoadoutScreen
      selection={getMissionShipSelection(engineer, missionId)}
      scienceSelection={engineer.scienceSelections[missionId] ?? []}
      inventory={engineer.inventory}
      scienceSelections={engineer.scienceSelections}
      budget={engineer.budget}
      cart={cart}
      setCart={setCart}
      onPurchase={(cart) =>
        setEngineer((current) => {
          const purchases = Object.entries(cart)
            .map(([itemId, quantity]) => ({
              item: SCIENCE_ITEMS.find((entry) => entry.id === itemId),
              quantity,
            }))
            .filter(
              (entry): entry is { item: ScienceItem; quantity: number } =>
                entry.item !== undefined && Number.isInteger(entry.quantity) && entry.quantity > 0,
            );
          const total = purchases.reduce((sum, entry) => sum + entry.item.cost * entry.quantity, 0);
          if (purchases.length === 0 || current.budget < total) return current;
          return {
            ...current,
            budget: current.budget - total,
            inventory: [
              ...current.inventory,
              ...purchases.flatMap(({ item, quantity }) =>
                Array.from({ length: quantity }, () => ({
                  instanceId: crypto.randomUUID(),
                  itemId: item.id,
                  usesRemaining: item.durability,
                  refundable: true,
                })),
              ),
            ],
          };
        })
      }
      onReturn={(instanceId) =>
        setEngineer((current) => {
          const instance = current.inventory.find((item) => item.instanceId === instanceId);
          const scienceItem = SCIENCE_ITEMS.find((item) => item.id === instance?.itemId);
          if (
            !instance?.refundable ||
            !scienceItem ||
            instance.usesRemaining !== scienceItem.durability
          ) {
            return current;
          }

          const currentSelection = current.scienceSelections[missionId] ?? [];
          const reservedByOtherMissions = Object.entries(current.scienceSelections).reduce(
            (count, [reservedMissionId, ids]) =>
              reservedMissionId !== missionId
                ? count + ids.filter((id) => id === instance.itemId).length
                : count,
            0,
          );
          const reservedByCurrentMission = currentSelection.filter(
            (id) => id === instance.itemId,
          ).length;
          const inventoryCount = current.inventory.filter(
            (item) => item.itemId === instance.itemId,
          ).length;
          if (inventoryCount <= reservedByOtherMissions + reservedByCurrentMission) return current;

          return {
            ...current,
            budget: current.budget + scienceItem.cost,
            inventory: current.inventory.filter((item) => item.instanceId !== instanceId),
          };
        })
      }
      onChange={(itemId, operation) =>
        setEngineer((current) => {
          const currentSelection = current.scienceSelections[missionId] ?? [];
          const selection = getMissionShipSelection(current, missionId);
          const item = SCIENCE_ITEMS.find((entry) => entry.id === itemId);
          if (!item) return current;
          const nextScienceSelection =
            operation === "add"
              ? [...currentSelection, itemId]
              : currentSelection.filter((id, index) => {
                  const lastIndex = currentSelection.lastIndexOf(itemId);
                  return id !== itemId || index !== lastIndex;
                });
          const reservedCount = Object.entries(current.scienceSelections).reduce(
            (count, [reservedMissionId, ids]) =>
              reservedMissionId !== missionId
                ? count + ids.filter((id) => id === itemId).length
                : count,
            0,
          );
          const availableOwned = Math.max(
            0,
            current.inventory.filter((entry) => entry.itemId === itemId).length - reservedCount,
          );
          const selectedCount = currentSelection.filter((id) => id === itemId).length;
          if (operation === "add" && selectedCount >= availableOwned) return current;
          const metrics = calculateMissionMetrics(
            mission,
            selection,
            nextScienceSelection,
            current.inventory,
            current.scienceSelections,
            current.budget,
          );
          if (
            operation === "add" &&
            (metrics.scienceSlotsUsed > metrics.scienceSlotsAvailable || !metrics.payloadReady)
          ) {
            return current;
          }
          return {
            ...current,
            scienceSelections: {
              ...current.scienceSelections,
              [missionId]: nextScienceSelection,
            },
          };
        })
      }
    />
  );
}

function ReviewRoute({
  engineer,
  onLaunch,
}: {
  engineer: EngineerState;
  onLaunch: (missionId: string) => void;
}) {
  const { missionId = "iss" } = useParams();
  const mission = missions.find((item) => item.id === missionId) ?? missions[0];
  if (!engineer.completedBuilds.includes(missionId)) {
    return <Navigate to={`/mission/${mission.id}/build/0`} replace />;
  }
  return (
    <ReviewScreen
      selection={getMissionShipSelection(engineer, missionId)}
      scienceSelection={engineer.scienceSelections[missionId] ?? []}
      inventory={engineer.inventory}
      scienceSelections={engineer.scienceSelections}
      budget={engineer.budget}
      onLaunch={() => onLaunch(missionId)}
    />
  );
}

function ResultsRoute({
  engineer,
  setEngineer,
}: {
  engineer: EngineerState;
  setEngineer: Dispatch<SetStateAction<EngineerState>>;
}) {
  const { missionId = "iss" } = useParams();
  return (
    <ResultsScreen
      launch={engineer.launches[missionId]}
      onComplete={(completedMissionId, launchId) =>
        setEngineer((current) => {
          const launch = current.launches[completedMissionId];
          if (!launch || launch.id !== launchId || launch.completed) return current;
          const missionLevel = missions.find((item) => item.id === completedMissionId)?.level ?? 1;
          return {
            ...current,
            budget: current.budget + (launch.success ? launch.reward : 0),
            unlockedLevel: launch.success
              ? Math.min(missions.length, Math.max(current.unlockedLevel, missionLevel + 1))
              : current.unlockedLevel,
            launches: {
              ...current.launches,
              [completedMissionId]: { ...launch, completed: true },
            },
          };
        })
      }
    />
  );
}

function launchMission(
  missionId: string,
  engineer: EngineerState,
  setEngineer: Dispatch<SetStateAction<EngineerState>>,
) {
  const mission = missions.find((item) => item.id === missionId);
  if (!mission) return;
  const selection = getMissionShipSelection(engineer, missionId);
  const scienceSelection = engineer.scienceSelections[missionId] ?? [];
  const metrics = calculateMissionMetrics(
    mission,
    selection,
    scienceSelection,
    engineer.inventory,
    engineer.scienceSelections,
    engineer.budget,
  );
  if (!metrics.canLaunch) return;

  const reservedCounts = Object.entries(engineer.scienceSelections).reduce<Record<string, number>>(
    (counts, [reservedMissionId, ids]) => {
      if (reservedMissionId !== missionId) {
        for (const id of ids) counts[id] = (counts[id] ?? 0) + 1;
      }
      return counts;
    },
    {},
  );
  const consumedInstances = new Set<string>();
  const damagedInstances: StoredScienceItem[] = [];
  const selectionCounts = scienceSelection.reduce<Record<string, number>>((counts, id) => {
    counts[id] = (counts[id] ?? 0) + 1;
    return counts;
  }, {});

  for (const [itemId, count] of Object.entries(selectionCounts)) {
    const item = SCIENCE_ITEMS.find((entry) => entry.id === itemId);
    if (!item) continue;
    const owned = engineer.inventory
      .filter((entry) => entry.itemId === itemId)
      .sort((left, right) => left.usesRemaining - right.usesRemaining);
    const availableOwned = owned.slice(
      0,
      Math.max(0, owned.length - (reservedCounts[itemId] ?? 0)),
    );
    for (let index = 0; index < count; index += 1) {
      const instance =
        index < availableOwned.length
          ? availableOwned[index]
          : {
              instanceId: crypto.randomUUID(),
              itemId,
              usesRemaining: item.durability,
              refundable: false,
            };
      if (index < availableOwned.length) consumedInstances.add(instance.instanceId);
      const remainingUses = instance.usesRemaining - 1;
      if (remainingUses > 0) {
        damagedInstances.push({ ...instance, usesRemaining: remainingUses, refundable: false });
      }
    }
  }

  const launch: LaunchRecord = {
    id: crypto.randomUUID(),
    missionId,
    shipSelection: selection,
    scienceSelection,
    metrics,
    success: metrics.ready,
    reward: metrics.ready ? 5 + mission.level + metrics.scienceCapacity * 0.1 : 0,
    completed: false,
  };
  setEngineer((current) => ({
    ...current,
    budget: current.budget - metrics.projectedCost,
    scienceSelections: { ...current.scienceSelections, [missionId]: [] },
    inventory: [
      ...current.inventory.filter((item) => !consumedInstances.has(item.instanceId)),
      ...damagedInstances,
    ],
    launches: { ...current.launches, [missionId]: launch },
  }));
}

export default function App() {
  return (
    <BrowserRouter>
      <Game />
    </BrowserRouter>
  );
}
