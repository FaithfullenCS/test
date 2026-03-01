import { AdaptiveRecallDeck, SprintScenario, ZoneId } from '../types/game';

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

export const adaptiveRecallDecks: AdaptiveRecallDeck[] = [
  {
    id: 'arc-gate-core',
    zoneId: 'gate_of_flow',
    title: 'ARC: Вводная модель cash flow',
    brief:
      'Фокус на цели исследования, трех потоках (operating/financing/investing) и базовой терминологии статьи.',
    challengeIds: buildDeckChallengeIds('gate_of_flow', 1),
  },
  {
    id: 'arc-gate-method',
    zoneId: 'gate_of_flow',
    title: 'ARC: Ex-post и постановка задач',
    brief:
      'Закрепление формулировок про метод исследования, период 2010-2019 и академические конструкции введения.',
    challengeIds: buildDeckChallengeIds('gate_of_flow', 2),
  },
  {
    id: 'arc-ops-liquidity',
    zoneId: 'operations_quarter',
    title: 'ARC: Операционный контур ликвидности',
    brief:
      'Отработка inflow/outflow, рабочего капитала и рисков невыполнения обязательств при кассовых разрывах.',
    challengeIds: buildDeckChallengeIds('operations_quarter', 1),
  },
  {
    id: 'arc-ops-methods',
    zoneId: 'operations_quarter',
    title: 'ARC: Direct vs Indirect',
    brief:
      'Повтор терминов и контекстов по прямому/косвенному методу и структуре операционных денежных потоков.',
    challengeIds: buildDeckChallengeIds('operations_quarter', 2),
  },
  {
    id: 'arc-fin-capital',
    zoneId: 'finance_harbor',
    title: 'ARC: Внешнее финансирование',
    brief:
      'Фокус на equity/debt логике, стоимости внешних средств и связи финансирования с прибылью за год.',
    challengeIds: buildDeckChallengeIds('finance_harbor', 1),
  },
  {
    id: 'arc-fin-dividend',
    zoneId: 'finance_harbor',
    title: 'ARC: Дивиденды и net profit margin',
    brief:
      'Повтор рекомендаций статьи про своевременные дивидендные выплаты и влияние на чистую маржу.',
    challengeIds: buildDeckChallengeIds('finance_harbor', 2),
  },
  {
    id: 'arc-inv-assets',
    zoneId: 'investment_factory',
    title: 'ARC: Инвестиционные активы',
    brief:
      'Закрепление лексики и контекстов о покупке/выбытии долгосрочных активов и производственных мощностей.',
    challengeIds: buildDeckChallengeIds('investment_factory', 1),
  },
  {
    id: 'arc-inv-performance',
    zoneId: 'investment_factory',
    title: 'ARC: Инвестиции и результативность',
    brief:
      'Повтор связи investment cash flows с финансовой результативностью и устойчивостью фирмы.',
    challengeIds: buildDeckChallengeIds('investment_factory', 2),
  },
  {
    id: 'arc-council-results',
    zoneId: 'council_hall',
    title: 'ARC: Интерпретация результатов',
    brief:
      'Закрепление формулировок по значимости эффектов operating/financing/investing в регрессионной части.',
    challengeIds: buildDeckChallengeIds('council_hall', 1),
  },
  {
    id: 'arc-council-recommend',
    zoneId: 'council_hall',
    title: 'ARC: Выводы и рекомендации',
    brief:
      'Повтор итоговых формулировок заключения и рекомендаций для food & beverage firms in Nigeria.',
    challengeIds: buildDeckChallengeIds('council_hall', 2),
  },
];

export const sprintScenarios: SprintScenario[] = [
  {
    id: 'sprint-gate-intro',
    zoneId: 'gate_of_flow',
    title: 'Sprint: Objective Blast',
    brief:
      'Быстрый проход по core-терминам и цели исследования с финальным boss-предложением о влиянии operating flow.',
    challengeIds: [
      'gate_of_flow-term-1',
      'gate_of_flow-term-2',
      'gate_of_flow-term-3',
      'gate_of_flow-context-1',
      'gate_of_flow-context-2',
      'gate_of_flow-sentence-1',
      'gate_of_flow-sentence-2',
      'gate_of_flow-boss-1',
    ],
  },
  {
    id: 'sprint-gate-method',
    zoneId: 'gate_of_flow',
    title: 'Sprint: Method Window 2010-2019',
    brief:
      'Скоростной сет по ex-post facto, secondary data и формулировкам исследовательских гипотез.',
    challengeIds: [
      'gate_of_flow-term-6',
      'gate_of_flow-term-7',
      'gate_of_flow-term-8',
      'gate_of_flow-context-4',
      'gate_of_flow-context-5',
      'gate_of_flow-sentence-4',
      'gate_of_flow-sentence-6',
      'gate_of_flow-boss-2',
    ],
  },
  {
    id: 'sprint-ops-inflow',
    zoneId: 'operations_quarter',
    title: 'Sprint: Inflow vs Outflow',
    brief:
      'Ритм на операционных притоках/оттоках и терминологии ликвидности с финальным мини-боссом.',
    challengeIds: [
      'operations_quarter-term-1',
      'operations_quarter-term-2',
      'operations_quarter-term-8',
      'operations_quarter-context-1',
      'operations_quarter-context-2',
      'operations_quarter-sentence-1',
      'operations_quarter-sentence-2',
      'operations_quarter-boss-1',
    ],
  },
  {
    id: 'sprint-ops-working-cap',
    zoneId: 'operations_quarter',
    title: 'Sprint: Working Capital Drill',
    brief:
      'Ускоренная тренировка по receivables, expenses, direct/indirect method и итоговому переводу.',
    challengeIds: [
      'operations_quarter-term-3',
      'operations_quarter-term-4',
      'operations_quarter-term-5',
      'operations_quarter-context-4',
      'operations_quarter-context-5',
      'operations_quarter-sentence-4',
      'operations_quarter-sentence-5',
      'operations_quarter-boss-2',
    ],
  },
  {
    id: 'sprint-fin-capital',
    zoneId: 'finance_harbor',
    title: 'Sprint: Capital Structure Run',
    brief:
      'Спринт по внешнему финансированию, equity/debt логике и цене капитала в условиях асимметрии информации.',
    challengeIds: [
      'finance_harbor-term-1',
      'finance_harbor-term-2',
      'finance_harbor-term-3',
      'finance_harbor-context-1',
      'finance_harbor-context-2',
      'finance_harbor-sentence-1',
      'finance_harbor-sentence-2',
      'finance_harbor-boss-1',
    ],
  },
  {
    id: 'sprint-fin-dividend',
    zoneId: 'finance_harbor',
    title: 'Sprint: Dividend Pressure',
    brief:
      'Быстрый сценарий по дивидендам, долговой нагрузке и связи financing cash flows с profit for the year.',
    challengeIds: [
      'finance_harbor-term-5',
      'finance_harbor-term-6',
      'finance_harbor-term-8',
      'finance_harbor-context-4',
      'finance_harbor-context-5',
      'finance_harbor-sentence-4',
      'finance_harbor-sentence-5',
      'finance_harbor-boss-3',
    ],
  },
  {
    id: 'sprint-inv-assets',
    zoneId: 'investment_factory',
    title: 'Sprint: Asset Rotation',
    brief:
      'Спринт про purchase/disposal of productive facilities и инвестиционный денежный поток.',
    challengeIds: [
      'investment_factory-term-1',
      'investment_factory-term-2',
      'investment_factory-term-3',
      'investment_factory-context-1',
      'investment_factory-context-2',
      'investment_factory-sentence-1',
      'investment_factory-sentence-2',
      'investment_factory-boss-1',
    ],
  },
  {
    id: 'sprint-inv-growth',
    zoneId: 'investment_factory',
    title: 'Sprint: Growth and Survival',
    brief:
      'Ускоренный набор по влиянию инвестиционных решений на рост и выживаемость компании.',
    challengeIds: [
      'investment_factory-term-5',
      'investment_factory-term-6',
      'investment_factory-term-8',
      'investment_factory-context-4',
      'investment_factory-context-5',
      'investment_factory-sentence-4',
      'investment_factory-sentence-6',
      'investment_factory-boss-3',
    ],
  },
  {
    id: 'sprint-council-regression',
    zoneId: 'council_hall',
    title: 'Sprint: Regression Verdict',
    brief:
      'Фокус на формулировках о статистической значимости и интерпретации результатов исследования.',
    challengeIds: [
      'council_hall-term-1',
      'council_hall-term-2',
      'council_hall-term-3',
      'council_hall-context-1',
      'council_hall-context-2',
      'council_hall-sentence-1',
      'council_hall-sentence-2',
      'council_hall-boss-1',
    ],
  },
  {
    id: 'sprint-council-recommend',
    zoneId: 'council_hall',
    title: 'Sprint: Recommendation Briefing',
    brief:
      'Скоростной раунд по заключению, рекомендациям о дивидендах и налоговом давлении на net profit margin.',
    challengeIds: [
      'council_hall-term-5',
      'council_hall-term-6',
      'council_hall-term-7',
      'council_hall-context-4',
      'council_hall-context-5',
      'council_hall-sentence-4',
      'council_hall-sentence-5',
      'council_hall-boss-4',
    ],
  },
];

export const adaptiveRecallDeckById = adaptiveRecallDecks.reduce((accumulator, deck) => {
  accumulator[deck.id] = deck;
  return accumulator;
}, {} as Record<string, AdaptiveRecallDeck>);

export const sprintScenarioById = sprintScenarios.reduce((accumulator, scenario) => {
  accumulator[scenario.id] = scenario;
  return accumulator;
}, {} as Record<string, SprintScenario>);
