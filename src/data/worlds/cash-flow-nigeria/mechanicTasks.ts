import { AdaptiveRecallDeck, SprintScenario, ZoneId } from '../../../types/game';

const WORLD_ID = 'cash-flow-nigeria' as const;

function buildDeckChallengeIds(zoneId: ZoneId, set: 1 | 2): string[] {
  if (set === 1) {
    return [
      `${zoneId}-term-1`,
      `${zoneId}-term-2`,
      `${zoneId}-term-3`,
      `${zoneId}-term-4`,
      `${zoneId}-sentence-1`,
      `${zoneId}-sentence-2`,
      `${zoneId}-sentence-3`,
      `${zoneId}-context-1`,
      `${zoneId}-context-2`,
      `${zoneId}-context-3`,
      `${zoneId}-boss-1`,
      `${zoneId}-boss-2`,
    ];
  }

  return [
    `${zoneId}-term-5`,
    `${zoneId}-term-6`,
    `${zoneId}-term-7`,
    `${zoneId}-term-8`,
    `${zoneId}-sentence-4`,
    `${zoneId}-sentence-5`,
    `${zoneId}-sentence-6`,
    `${zoneId}-context-4`,
    `${zoneId}-context-5`,
    `${zoneId}-context-6`,
    `${zoneId}-boss-3`,
    `${zoneId}-boss-4`,
  ];
}

const baseAdaptiveRecallDecks: Omit<AdaptiveRecallDeck, 'worldId'>[] = [
  {
    id: 'arc-gate-core',
    zoneId: 'ng_gate_of_flow',
    title: 'ARC: Вводная модель cash flow',
    brief:
      'Фокус на цели исследования, трех потоках (operating/financing/investing) и базовой терминологии статьи.',
    challengeIds: buildDeckChallengeIds('ng_gate_of_flow', 1),
  },
  {
    id: 'arc-gate-method',
    zoneId: 'ng_gate_of_flow',
    title: 'ARC: Ex-post и постановка задач',
    brief:
      'Закрепление формулировок про метод исследования, период 2010-2019 и академические конструкции введения.',
    challengeIds: buildDeckChallengeIds('ng_gate_of_flow', 2),
  },
  {
    id: 'arc-ops-liquidity',
    zoneId: 'ng_operations_quarter',
    title: 'ARC: Операционный контур ликвидности',
    brief:
      'Отработка inflow/outflow, рабочего капитала и рисков невыполнения обязательств при кассовых разрывах.',
    challengeIds: buildDeckChallengeIds('ng_operations_quarter', 1),
  },
  {
    id: 'arc-ops-methods',
    zoneId: 'ng_operations_quarter',
    title: 'ARC: Direct vs Indirect',
    brief:
      'Повтор терминов и контекстов по прямому/косвенному методу и структуре операционных денежных потоков.',
    challengeIds: buildDeckChallengeIds('ng_operations_quarter', 2),
  },
  {
    id: 'arc-fin-capital',
    zoneId: 'ng_finance_harbor',
    title: 'ARC: Внешнее финансирование',
    brief:
      'Фокус на equity/debt логике, стоимости внешних средств и связи финансирования с прибылью за год.',
    challengeIds: buildDeckChallengeIds('ng_finance_harbor', 1),
  },
  {
    id: 'arc-fin-dividend',
    zoneId: 'ng_finance_harbor',
    title: 'ARC: Дивиденды и net profit margin',
    brief:
      'Повтор рекомендаций статьи про своевременные дивидендные выплаты и влияние на чистую маржу.',
    challengeIds: buildDeckChallengeIds('ng_finance_harbor', 2),
  },
  {
    id: 'arc-inv-assets',
    zoneId: 'ng_investment_factory',
    title: 'ARC: Инвестиционные активы',
    brief:
      'Закрепление лексики и контекстов о покупке/выбытии долгосрочных активов и производственных мощностей.',
    challengeIds: buildDeckChallengeIds('ng_investment_factory', 1),
  },
  {
    id: 'arc-inv-performance',
    zoneId: 'ng_investment_factory',
    title: 'ARC: Инвестиции и результативность',
    brief:
      'Повтор связи investment cash flows с финансовой результативностью и устойчивостью фирмы.',
    challengeIds: buildDeckChallengeIds('ng_investment_factory', 2),
  },
  {
    id: 'arc-council-results',
    zoneId: 'ng_council_hall',
    title: 'ARC: Интерпретация результатов',
    brief:
      'Закрепление формулировок по значимости эффектов operating/financing/investing в регрессионной части.',
    challengeIds: buildDeckChallengeIds('ng_council_hall', 1),
  },
  {
    id: 'arc-council-recommend',
    zoneId: 'ng_council_hall',
    title: 'ARC: Выводы и рекомендации',
    brief:
      'Повтор итоговых формулировок заключения и рекомендаций для food & beverage firms in Nigeria.',
    challengeIds: buildDeckChallengeIds('ng_council_hall', 2),
  },
];

export const adaptiveRecallDecks: AdaptiveRecallDeck[] = baseAdaptiveRecallDecks.map((deck) => ({
  ...deck,
  worldId: WORLD_ID,
}));

const baseSprintScenarios: Omit<SprintScenario, 'worldId'>[] = [
  {
    id: 'sprint-gate-intro',
    zoneId: 'ng_gate_of_flow',
    title: 'Sprint: Objective Blast',
    brief:
      'Быстрый проход по core-терминам и цели исследования с финальным boss-предложением о влиянии operating flow.',
    challengeIds: [
      'ng_gate_of_flow-term-1',
      'ng_gate_of_flow-term-2',
      'ng_gate_of_flow-term-3',
      'ng_gate_of_flow-context-1',
      'ng_gate_of_flow-context-2',
      'ng_gate_of_flow-sentence-1',
      'ng_gate_of_flow-sentence-2',
      'ng_gate_of_flow-boss-1',
    ],
  },
  {
    id: 'sprint-gate-method',
    zoneId: 'ng_gate_of_flow',
    title: 'Sprint: Method Window 2010-2019',
    brief:
      'Скоростной сет по ex-post facto, secondary data и формулировкам исследовательских гипотез.',
    challengeIds: [
      'ng_gate_of_flow-term-6',
      'ng_gate_of_flow-term-7',
      'ng_gate_of_flow-term-8',
      'ng_gate_of_flow-context-4',
      'ng_gate_of_flow-context-5',
      'ng_gate_of_flow-sentence-4',
      'ng_gate_of_flow-sentence-6',
      'ng_gate_of_flow-boss-2',
    ],
  },
  {
    id: 'sprint-ops-inflow',
    zoneId: 'ng_operations_quarter',
    title: 'Sprint: Inflow vs Outflow',
    brief:
      'Ритм на операционных притоках/оттоках и терминологии ликвидности с финальным мини-боссом.',
    challengeIds: [
      'ng_operations_quarter-term-1',
      'ng_operations_quarter-term-2',
      'ng_operations_quarter-term-8',
      'ng_operations_quarter-context-1',
      'ng_operations_quarter-context-2',
      'ng_operations_quarter-sentence-1',
      'ng_operations_quarter-sentence-2',
      'ng_operations_quarter-boss-1',
    ],
  },
  {
    id: 'sprint-ops-working-cap',
    zoneId: 'ng_operations_quarter',
    title: 'Sprint: Working Capital Drill',
    brief:
      'Ускоренная тренировка по receivables, expenses, direct/indirect method и итоговому переводу.',
    challengeIds: [
      'ng_operations_quarter-term-3',
      'ng_operations_quarter-term-4',
      'ng_operations_quarter-term-5',
      'ng_operations_quarter-context-4',
      'ng_operations_quarter-context-5',
      'ng_operations_quarter-sentence-4',
      'ng_operations_quarter-sentence-5',
      'ng_operations_quarter-boss-2',
    ],
  },
  {
    id: 'sprint-fin-capital',
    zoneId: 'ng_finance_harbor',
    title: 'Sprint: Capital Structure Run',
    brief:
      'Спринт по внешнему финансированию, equity/debt логике и цене капитала в условиях асимметрии информации.',
    challengeIds: [
      'ng_finance_harbor-term-1',
      'ng_finance_harbor-term-2',
      'ng_finance_harbor-term-3',
      'ng_finance_harbor-context-1',
      'ng_finance_harbor-context-2',
      'ng_finance_harbor-sentence-1',
      'ng_finance_harbor-sentence-2',
      'ng_finance_harbor-boss-1',
    ],
  },
  {
    id: 'sprint-fin-dividend',
    zoneId: 'ng_finance_harbor',
    title: 'Sprint: Dividend Pressure',
    brief:
      'Быстрый сценарий по дивидендам, долговой нагрузке и связи financing cash flows с profit for the year.',
    challengeIds: [
      'ng_finance_harbor-term-5',
      'ng_finance_harbor-term-6',
      'ng_finance_harbor-term-8',
      'ng_finance_harbor-context-4',
      'ng_finance_harbor-context-5',
      'ng_finance_harbor-sentence-4',
      'ng_finance_harbor-sentence-5',
      'ng_finance_harbor-boss-3',
    ],
  },
  {
    id: 'sprint-inv-assets',
    zoneId: 'ng_investment_factory',
    title: 'Sprint: Asset Rotation',
    brief:
      'Спринт про purchase/disposal of productive facilities и инвестиционный денежный поток.',
    challengeIds: [
      'ng_investment_factory-term-1',
      'ng_investment_factory-term-2',
      'ng_investment_factory-term-3',
      'ng_investment_factory-context-1',
      'ng_investment_factory-context-2',
      'ng_investment_factory-sentence-1',
      'ng_investment_factory-sentence-2',
      'ng_investment_factory-boss-1',
    ],
  },
  {
    id: 'sprint-inv-growth',
    zoneId: 'ng_investment_factory',
    title: 'Sprint: Growth and Survival',
    brief:
      'Ускоренный набор по влиянию инвестиционных решений на рост и выживаемость компании.',
    challengeIds: [
      'ng_investment_factory-term-5',
      'ng_investment_factory-term-6',
      'ng_investment_factory-term-8',
      'ng_investment_factory-context-4',
      'ng_investment_factory-context-5',
      'ng_investment_factory-sentence-4',
      'ng_investment_factory-sentence-6',
      'ng_investment_factory-boss-3',
    ],
  },
  {
    id: 'sprint-council-regression',
    zoneId: 'ng_council_hall',
    title: 'Sprint: Regression Verdict',
    brief:
      'Фокус на формулировках о статистической значимости и интерпретации результатов исследования.',
    challengeIds: [
      'ng_council_hall-term-1',
      'ng_council_hall-term-2',
      'ng_council_hall-term-3',
      'ng_council_hall-context-1',
      'ng_council_hall-context-2',
      'ng_council_hall-sentence-1',
      'ng_council_hall-sentence-2',
      'ng_council_hall-boss-1',
    ],
  },
  {
    id: 'sprint-council-recommend',
    zoneId: 'ng_council_hall',
    title: 'Sprint: Recommendation Briefing',
    brief:
      'Скоростной раунд по заключению, рекомендациям о дивидендах и налоговом давлении на net profit margin.',
    challengeIds: [
      'ng_council_hall-term-5',
      'ng_council_hall-term-6',
      'ng_council_hall-term-7',
      'ng_council_hall-context-4',
      'ng_council_hall-context-5',
      'ng_council_hall-sentence-4',
      'ng_council_hall-sentence-5',
      'ng_council_hall-boss-4',
    ],
  },
];

export const sprintScenarios: SprintScenario[] = baseSprintScenarios.map((scenario) => ({
  ...scenario,
  worldId: WORLD_ID,
}));

export const adaptiveRecallDeckById = adaptiveRecallDecks.reduce((accumulator, deck) => {
  accumulator[deck.id] = deck;
  return accumulator;
}, {} as Record<string, AdaptiveRecallDeck>);

export const sprintScenarioById = sprintScenarios.reduce((accumulator, scenario) => {
  accumulator[scenario.id] = scenario;
  return accumulator;
}, {} as Record<string, SprintScenario>);
