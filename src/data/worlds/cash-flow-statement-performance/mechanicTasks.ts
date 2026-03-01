import { AdaptiveRecallDeck, SprintScenario, ZoneId } from '../../../types/game';

const WORLD_ID = 'cash-flow-statement-performance' as const;

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
    zoneId: 'cfs_abstract_delta',
    title: 'ARC: Вводная модель cash flow',
    brief:
      'Фокус на цели исследования, трех потоках (operating/financing/investing) и базовой терминологии статьи.',
    challengeIds: buildDeckChallengeIds('cfs_abstract_delta', 1),
  },
  {
    id: 'arc-gate-method',
    zoneId: 'cfs_abstract_delta',
    title: 'ARC: Ex-post и постановка задач',
    brief:
      'Закрепление формулировок про метод исследования, период 2007-2011 и академические конструкции введения.',
    challengeIds: buildDeckChallengeIds('cfs_abstract_delta', 2),
  },
  {
    id: 'arc-ops-liquidity',
    zoneId: 'cfs_liquidity_corridor',
    title: 'ARC: Операционный контур ликвидности',
    brief:
      'Отработка inflow/outflow, рабочего капитала и рисков невыполнения обязательств при кассовых разрывах.',
    challengeIds: buildDeckChallengeIds('cfs_liquidity_corridor', 1),
  },
  {
    id: 'arc-ops-methods',
    zoneId: 'cfs_liquidity_corridor',
    title: 'ARC: Direct vs Indirect',
    brief:
      'Повтор терминов и контекстов по прямому/косвенному методу и структуре операционных денежных потоков.',
    challengeIds: buildDeckChallengeIds('cfs_liquidity_corridor', 2),
  },
  {
    id: 'arc-fin-capital',
    zoneId: 'cfs_financing_spine',
    title: 'ARC: Внешнее финансирование',
    brief:
      'Фокус на FINCF, структуре источников средств и связи финансовых потоков с корпоративной результативностью (ROTA).',
    challengeIds: buildDeckChallengeIds('cfs_financing_spine', 1),
  },
  {
    id: 'arc-fin-dividend',
    zoneId: 'cfs_financing_spine',
    title: 'ARC: Аудит и коэффициенты потока',
    brief:
      'Повтор рекомендаций статьи о применении cash flow ratios внешними аудиторами при оценке отчетности.',
    challengeIds: buildDeckChallengeIds('cfs_financing_spine', 2),
  },
  {
    id: 'arc-inv-assets',
    zoneId: 'cfs_investment_atrium',
    title: 'ARC: Инвестиционные активы',
    brief:
      'Закрепление лексики и контекстов о покупке/выбытии долгосрочных активов и производственных мощностей.',
    challengeIds: buildDeckChallengeIds('cfs_investment_atrium', 1),
  },
  {
    id: 'arc-inv-performance',
    zoneId: 'cfs_investment_atrium',
    title: 'ARC: Инвестиции и результативность',
    brief:
      'Повтор связи investment cash flows с финансовой результативностью и устойчивостью фирмы.',
    challengeIds: buildDeckChallengeIds('cfs_investment_atrium', 2),
  },
  {
    id: 'arc-council-results',
    zoneId: 'cfs_regulator_forum',
    title: 'ARC: Интерпретация результатов',
    brief:
      'Закрепление формулировок по значимости эффектов operating/financing/investing в регрессионной части.',
    challengeIds: buildDeckChallengeIds('cfs_regulator_forum', 1),
  },
  {
    id: 'arc-council-recommend',
    zoneId: 'cfs_regulator_forum',
    title: 'ARC: Выводы и рекомендации',
    brief:
      'Повтор итоговых формулировок заключения и рекомендаций для food & beverage firms in Nigeria.',
    challengeIds: buildDeckChallengeIds('cfs_regulator_forum', 2),
  },
];

export const adaptiveRecallDecks: AdaptiveRecallDeck[] = baseAdaptiveRecallDecks.map((deck) => ({
  ...deck,
  worldId: WORLD_ID,
}));

const baseSprintScenarios: Omit<SprintScenario, 'worldId'>[] = [
  {
    id: 'sprint-gate-intro',
    zoneId: 'cfs_abstract_delta',
    title: 'Sprint: Objective Blast',
    brief:
      'Быстрый проход по core-терминам и цели исследования с финальным boss-предложением о влиянии operating flow.',
    challengeIds: [
      'cfs_abstract_delta-term-1',
      'cfs_abstract_delta-term-2',
      'cfs_abstract_delta-term-3',
      'cfs_abstract_delta-context-1',
      'cfs_abstract_delta-context-2',
      'cfs_abstract_delta-sentence-1',
      'cfs_abstract_delta-sentence-2',
      'cfs_abstract_delta-boss-1',
    ],
  },
  {
    id: 'sprint-gate-method',
    zoneId: 'cfs_abstract_delta',
    title: 'Sprint: Method Window 2007-2011',
    brief:
      'Скоростной сет по ex-post facto, secondary data и формулировкам исследовательских гипотез.',
    challengeIds: [
      'cfs_abstract_delta-term-6',
      'cfs_abstract_delta-term-7',
      'cfs_abstract_delta-term-8',
      'cfs_abstract_delta-context-4',
      'cfs_abstract_delta-context-5',
      'cfs_abstract_delta-sentence-4',
      'cfs_abstract_delta-sentence-6',
      'cfs_abstract_delta-boss-2',
    ],
  },
  {
    id: 'sprint-ops-inflow',
    zoneId: 'cfs_liquidity_corridor',
    title: 'Sprint: Inflow vs Outflow',
    brief:
      'Ритм на операционных притоках/оттоках и терминологии ликвидности с финальным мини-боссом.',
    challengeIds: [
      'cfs_liquidity_corridor-term-1',
      'cfs_liquidity_corridor-term-2',
      'cfs_liquidity_corridor-term-8',
      'cfs_liquidity_corridor-context-1',
      'cfs_liquidity_corridor-context-2',
      'cfs_liquidity_corridor-sentence-1',
      'cfs_liquidity_corridor-sentence-2',
      'cfs_liquidity_corridor-boss-1',
    ],
  },
  {
    id: 'sprint-ops-working-cap',
    zoneId: 'cfs_liquidity_corridor',
    title: 'Sprint: Working Capital Drill',
    brief:
      'Ускоренная тренировка по receivables, expenses, direct/indirect method и итоговому переводу.',
    challengeIds: [
      'cfs_liquidity_corridor-term-3',
      'cfs_liquidity_corridor-term-4',
      'cfs_liquidity_corridor-term-5',
      'cfs_liquidity_corridor-context-4',
      'cfs_liquidity_corridor-context-5',
      'cfs_liquidity_corridor-sentence-4',
      'cfs_liquidity_corridor-sentence-5',
      'cfs_liquidity_corridor-boss-2',
    ],
  },
  {
    id: 'sprint-fin-capital',
    zoneId: 'cfs_financing_spine',
    title: 'Sprint: Capital Structure Run',
    brief:
      'Спринт по внешнему финансированию, equity/debt логике и цене капитала в условиях асимметрии информации.',
    challengeIds: [
      'cfs_financing_spine-term-1',
      'cfs_financing_spine-term-2',
      'cfs_financing_spine-term-3',
      'cfs_financing_spine-context-1',
      'cfs_financing_spine-context-2',
      'cfs_financing_spine-sentence-1',
      'cfs_financing_spine-sentence-2',
      'cfs_financing_spine-boss-1',
    ],
  },
  {
    id: 'sprint-fin-dividend',
    zoneId: 'cfs_financing_spine',
    title: 'Sprint: Auditor Pressure',
    brief:
      'Быстрый сценарий по FINCF, роли аудита и интерпретации cash flow ratios в оценке корпоративной результативности.',
    challengeIds: [
      'cfs_financing_spine-term-5',
      'cfs_financing_spine-term-6',
      'cfs_financing_spine-term-8',
      'cfs_financing_spine-context-4',
      'cfs_financing_spine-context-5',
      'cfs_financing_spine-sentence-4',
      'cfs_financing_spine-sentence-5',
      'cfs_financing_spine-boss-3',
    ],
  },
  {
    id: 'sprint-inv-assets',
    zoneId: 'cfs_investment_atrium',
    title: 'Sprint: Asset Rotation',
    brief:
      'Спринт про purchase/disposal of productive facilities и инвестиционный денежный поток.',
    challengeIds: [
      'cfs_investment_atrium-term-1',
      'cfs_investment_atrium-term-2',
      'cfs_investment_atrium-term-3',
      'cfs_investment_atrium-context-1',
      'cfs_investment_atrium-context-2',
      'cfs_investment_atrium-sentence-1',
      'cfs_investment_atrium-sentence-2',
      'cfs_investment_atrium-boss-1',
    ],
  },
  {
    id: 'sprint-inv-growth',
    zoneId: 'cfs_investment_atrium',
    title: 'Sprint: Growth and Survival',
    brief:
      'Ускоренный набор по влиянию инвестиционных решений на рост и выживаемость компании.',
    challengeIds: [
      'cfs_investment_atrium-term-5',
      'cfs_investment_atrium-term-6',
      'cfs_investment_atrium-term-8',
      'cfs_investment_atrium-context-4',
      'cfs_investment_atrium-context-5',
      'cfs_investment_atrium-sentence-4',
      'cfs_investment_atrium-sentence-6',
      'cfs_investment_atrium-boss-3',
    ],
  },
  {
    id: 'sprint-council-regression',
    zoneId: 'cfs_regulator_forum',
    title: 'Sprint: Regression Verdict',
    brief:
      'Фокус на формулировках о статистической значимости и интерпретации результатов исследования.',
    challengeIds: [
      'cfs_regulator_forum-term-1',
      'cfs_regulator_forum-term-2',
      'cfs_regulator_forum-term-3',
      'cfs_regulator_forum-context-1',
      'cfs_regulator_forum-context-2',
      'cfs_regulator_forum-sentence-1',
      'cfs_regulator_forum-sentence-2',
      'cfs_regulator_forum-boss-1',
    ],
  },
  {
    id: 'sprint-council-recommend',
    zoneId: 'cfs_regulator_forum',
    title: 'Sprint: Recommendation Briefing',
    brief:
      'Скоростной раунд по заключению и рекомендациям для IFRS/FRCN/CBN/NSE/SEC/NDIC, аудиторов и государственной политики.',
    challengeIds: [
      'cfs_regulator_forum-term-5',
      'cfs_regulator_forum-term-6',
      'cfs_regulator_forum-term-7',
      'cfs_regulator_forum-context-4',
      'cfs_regulator_forum-context-5',
      'cfs_regulator_forum-sentence-4',
      'cfs_regulator_forum-sentence-5',
      'cfs_regulator_forum-boss-4',
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
