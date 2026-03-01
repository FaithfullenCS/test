import { CaseScenario } from '../../../types/game';

const WORLD_ID = 'cash-flow-statement-performance' as const;

const baseCaseScenarios: Omit<CaseScenario, 'worldId'>[] = [
  {
    id: 'cfs_abstract_delta-case-1',
    zoneId: 'cfs_abstract_delta',
    title: 'Кейс: Objective Alignment',
    brief:
      'Собери перевод ядра исследования: цель работы и влияние cash flow на financial performance.',
    steps: ['cfs_abstract_delta-context-1', 'cfs_abstract_delta-sentence-1', 'cfs_abstract_delta-boss-1'],
  },
  {
    id: 'cfs_abstract_delta-case-2',
    zoneId: 'cfs_abstract_delta',
    title: 'Кейс: Flow Directions',
    brief:
      'Отработай блок про inflow/outflow и академическую постановку проблематики во введении.',
    steps: ['cfs_abstract_delta-context-2', 'cfs_abstract_delta-sentence-2', 'cfs_abstract_delta-boss-2'],
  },
  {
    id: 'cfs_abstract_delta-case-3',
    zoneId: 'cfs_abstract_delta',
    title: 'Кейс: Hypothesis Brief',
    brief:
      'Сценарий по формулировке исследовательских гипотез и связи трех потоков с corporate performance (ROTA).',
    steps: ['cfs_abstract_delta-context-3', 'cfs_abstract_delta-sentence-3', 'cfs_abstract_delta-boss-3'],
  },
  {
    id: 'cfs_abstract_delta-case-4',
    zoneId: 'cfs_abstract_delta',
    title: 'Кейс: Method and Timeline',
    brief:
      'Уточни перевод методологии: ex-post facto, secondary data и период 2007-2011.',
    steps: ['cfs_abstract_delta-context-4', 'cfs_abstract_delta-sentence-4', 'cfs_abstract_delta-boss-4'],
  },

  {
    id: 'cfs_liquidity_corridor-case-1',
    zoneId: 'cfs_liquidity_corridor',
    title: 'Кейс: Liquidity Pulse',
    brief:
      'Контекстный кейс по cash inflows/cash outflows и устойчивости платежей в операционном цикле.',
    steps: ['cfs_liquidity_corridor-context-1', 'cfs_liquidity_corridor-sentence-1', 'cfs_liquidity_corridor-boss-1'],
  },
  {
    id: 'cfs_liquidity_corridor-case-2',
    zoneId: 'cfs_liquidity_corridor',
    title: 'Кейс: Working Capital Desk',
    brief:
      'Фокус на trade receivables, operating expenses и управлении оборотным капиталом.',
    steps: ['cfs_liquidity_corridor-context-2', 'cfs_liquidity_corridor-sentence-2', 'cfs_liquidity_corridor-boss-2'],
  },
  {
    id: 'cfs_liquidity_corridor-case-3',
    zoneId: 'cfs_liquidity_corridor',
    title: 'Кейс: Method Choice',
    brief:
      'Сравни прямой и косвенный методы отражения operating cash flow в переводе отчетного текста.',
    steps: ['cfs_liquidity_corridor-context-3', 'cfs_liquidity_corridor-sentence-3', 'cfs_liquidity_corridor-boss-3'],
  },
  {
    id: 'cfs_liquidity_corridor-case-4',
    zoneId: 'cfs_liquidity_corridor',
    title: 'Кейс: Obligation Deadline',
    brief:
      'Сценарий по рискам неисполнения обязательств и влиянию кассовых разрывов на бизнес-устойчивость.',
    steps: ['cfs_liquidity_corridor-context-4', 'cfs_liquidity_corridor-sentence-4', 'cfs_liquidity_corridor-boss-4'],
  },

  {
    id: 'cfs_financing_spine-case-1',
    zoneId: 'cfs_financing_spine',
    title: 'Кейс: External Financing',
    brief:
      'Проработай лексику привлечения средств и связи FINCF с корпоративной результативностью (ROTA).',
    steps: ['cfs_financing_spine-context-1', 'cfs_financing_spine-sentence-1', 'cfs_financing_spine-boss-1'],
  },
  {
    id: 'cfs_financing_spine-case-2',
    zoneId: 'cfs_financing_spine',
    title: 'Кейс: Sample Composition',
    brief:
      'Кейс по структуре выборки и данным годовых отчетов шести компаний Food & Beverage из NSE.',
    steps: ['cfs_financing_spine-context-2', 'cfs_financing_spine-sentence-2', 'cfs_financing_spine-boss-2'],
  },
  {
    id: 'cfs_financing_spine-case-3',
    zoneId: 'cfs_financing_spine',
    title: 'Кейс: Information Asymmetry',
    brief:
      'Отточить формулировки про premium на внешнее финансирование и ограничения доступа к кредиту.',
    steps: ['cfs_financing_spine-context-3', 'cfs_financing_spine-sentence-3', 'cfs_financing_spine-boss-3'],
  },
  {
    id: 'cfs_financing_spine-case-4',
    zoneId: 'cfs_financing_spine',
    title: 'Кейс: Auditor Signal',
    brief:
      'Сценарий о том, как внешние аудиторы используют cash flow ratios при оценке финансовой отчетности.',
    steps: ['cfs_financing_spine-context-4', 'cfs_financing_spine-sentence-4', 'cfs_financing_spine-boss-4'],
  },

  {
    id: 'cfs_investment_atrium-case-1',
    zoneId: 'cfs_investment_atrium',
    title: 'Кейс: Productive Facilities',
    brief:
      'Кейс о purchase/disposal of productive facilities и корректном переносе терминов в перевод.',
    steps: ['cfs_investment_atrium-context-1', 'cfs_investment_atrium-sentence-1', 'cfs_investment_atrium-boss-1'],
  },
  {
    id: 'cfs_investment_atrium-case-2',
    zoneId: 'cfs_investment_atrium',
    title: 'Кейс: Growth Capital',
    brief:
      'Собери аргументацию о том, как инвестиционные решения поддерживают рост и выживаемость фирмы.',
    steps: ['cfs_investment_atrium-context-2', 'cfs_investment_atrium-sentence-2', 'cfs_investment_atrium-boss-2'],
  },
  {
    id: 'cfs_investment_atrium-case-3',
    zoneId: 'cfs_investment_atrium',
    title: 'Кейс: Investment vs Profit',
    brief:
      'Проработай связку investment cash flows и финансовой результативности в академическом стиле статьи.',
    steps: ['cfs_investment_atrium-context-3', 'cfs_investment_atrium-sentence-3', 'cfs_investment_atrium-boss-3'],
  },
  {
    id: 'cfs_investment_atrium-case-4',
    zoneId: 'cfs_investment_atrium',
    title: 'Кейс: Asset Portfolio Control',
    brief:
      'Тренировка перевода по долгосрочным активам, выбытиям и инвестиционному управлению.',
    steps: ['cfs_investment_atrium-context-4', 'cfs_investment_atrium-sentence-4', 'cfs_investment_atrium-boss-4'],
  },

  {
    id: 'cfs_regulator_forum-case-1',
    zoneId: 'cfs_regulator_forum',
    title: 'Кейс: Regression Findings',
    brief:
      'Сделай финальный перевод блока результатов: значимость cash flow факторов для corporate performance (ROTA).',
    steps: ['cfs_regulator_forum-context-1', 'cfs_regulator_forum-sentence-1', 'cfs_regulator_forum-boss-1'],
  },
  {
    id: 'cfs_regulator_forum-case-2',
    zoneId: 'cfs_regulator_forum',
    title: 'Кейс: Summary of Findings',
    brief:
      'Сценарий по краткому резюме результатов по operating, financing и investing направлениям.',
    steps: ['cfs_regulator_forum-context-2', 'cfs_regulator_forum-sentence-2', 'cfs_regulator_forum-boss-2'],
  },
  {
    id: 'cfs_regulator_forum-case-3',
    zoneId: 'cfs_regulator_forum',
    title: 'Кейс: Integrated Conclusion',
    brief:
      'Перевод заключения с акцентом на интегральный эффект трех видов cash flow.',
    steps: ['cfs_regulator_forum-context-3', 'cfs_regulator_forum-sentence-3', 'cfs_regulator_forum-boss-3'],
  },
  {
    id: 'cfs_regulator_forum-case-4',
    zoneId: 'cfs_regulator_forum',
    title: 'Кейс: Recommendation Memo',
    brief:
      'Оформи финальный memo по рекомендациям для IFRS/FRCN/CBN/NSE/SEC/NDIC, аудиторов и госрегулятора.',
    steps: ['cfs_regulator_forum-context-4', 'cfs_regulator_forum-sentence-4', 'cfs_regulator_forum-boss-4'],
  },
];

export const caseScenarios: CaseScenario[] = baseCaseScenarios.map((scenario) => ({
  ...scenario,
  worldId: WORLD_ID,
}));

export const caseScenarioById = caseScenarios.reduce((accumulator, scenario) => {
  accumulator[scenario.id] = scenario;
  return accumulator;
}, {} as Record<string, CaseScenario>);
