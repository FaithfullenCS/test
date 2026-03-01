import { CaseScenario } from '../../../types/game';

const WORLD_ID = 'cash-flow-nigeria' as const;

const baseCaseScenarios: Omit<CaseScenario, 'worldId'>[] = [
  {
    id: 'ng_gate_of_flow-case-1',
    zoneId: 'ng_gate_of_flow',
    title: 'Кейс: Objective Alignment',
    brief:
      'Собери перевод ядра исследования: цель работы и влияние cash flow на financial performance.',
    steps: ['ng_gate_of_flow-context-1', 'ng_gate_of_flow-sentence-1', 'ng_gate_of_flow-boss-1'],
  },
  {
    id: 'ng_gate_of_flow-case-2',
    zoneId: 'ng_gate_of_flow',
    title: 'Кейс: Flow Directions',
    brief:
      'Отработай блок про inflow/outflow и академическую постановку проблематики во введении.',
    steps: ['ng_gate_of_flow-context-2', 'ng_gate_of_flow-sentence-2', 'ng_gate_of_flow-boss-2'],
  },
  {
    id: 'ng_gate_of_flow-case-3',
    zoneId: 'ng_gate_of_flow',
    title: 'Кейс: Hypothesis Brief',
    brief:
      'Сценарий по формулировке исследовательских гипотез и связи трех потоков с profit for the year.',
    steps: ['ng_gate_of_flow-context-3', 'ng_gate_of_flow-sentence-3', 'ng_gate_of_flow-boss-3'],
  },
  {
    id: 'ng_gate_of_flow-case-4',
    zoneId: 'ng_gate_of_flow',
    title: 'Кейс: Method and Timeline',
    brief:
      'Уточни перевод методологии: ex-post facto, secondary data и период 2010-2019.',
    steps: ['ng_gate_of_flow-context-4', 'ng_gate_of_flow-sentence-4', 'ng_gate_of_flow-boss-4'],
  },

  {
    id: 'ng_operations_quarter-case-1',
    zoneId: 'ng_operations_quarter',
    title: 'Кейс: Liquidity Pulse',
    brief:
      'Контекстный кейс по cash inflows/cash outflows и устойчивости платежей в операционном цикле.',
    steps: ['ng_operations_quarter-context-1', 'ng_operations_quarter-sentence-1', 'ng_operations_quarter-boss-1'],
  },
  {
    id: 'ng_operations_quarter-case-2',
    zoneId: 'ng_operations_quarter',
    title: 'Кейс: Working Capital Desk',
    brief:
      'Фокус на trade receivables, operating expenses и управлении оборотным капиталом.',
    steps: ['ng_operations_quarter-context-2', 'ng_operations_quarter-sentence-2', 'ng_operations_quarter-boss-2'],
  },
  {
    id: 'ng_operations_quarter-case-3',
    zoneId: 'ng_operations_quarter',
    title: 'Кейс: Method Choice',
    brief:
      'Сравни прямой и косвенный методы отражения operating cash flow в переводе отчетного текста.',
    steps: ['ng_operations_quarter-context-3', 'ng_operations_quarter-sentence-3', 'ng_operations_quarter-boss-3'],
  },
  {
    id: 'ng_operations_quarter-case-4',
    zoneId: 'ng_operations_quarter',
    title: 'Кейс: Obligation Deadline',
    brief:
      'Сценарий по рискам неисполнения обязательств и влиянию кассовых разрывов на бизнес-устойчивость.',
    steps: ['ng_operations_quarter-context-4', 'ng_operations_quarter-sentence-4', 'ng_operations_quarter-boss-4'],
  },

  {
    id: 'ng_finance_harbor-case-1',
    zoneId: 'ng_finance_harbor',
    title: 'Кейс: External Financing',
    brief:
      'Проработай лексику привлечения средств и связи financing cash flow с годовой прибылью.',
    steps: ['ng_finance_harbor-context-1', 'ng_finance_harbor-sentence-1', 'ng_finance_harbor-boss-1'],
  },
  {
    id: 'ng_finance_harbor-case-2',
    zoneId: 'ng_finance_harbor',
    title: 'Кейс: Pecking Order',
    brief:
      'Кейс по логике retained earnings -> debt -> new equity в духе Pecking Order Theory.',
    steps: ['ng_finance_harbor-context-2', 'ng_finance_harbor-sentence-2', 'ng_finance_harbor-boss-2'],
  },
  {
    id: 'ng_finance_harbor-case-3',
    zoneId: 'ng_finance_harbor',
    title: 'Кейс: Information Asymmetry',
    brief:
      'Отточить формулировки про premium на внешнее финансирование и ограничения доступа к кредиту.',
    steps: ['ng_finance_harbor-context-3', 'ng_finance_harbor-sentence-3', 'ng_finance_harbor-boss-3'],
  },
  {
    id: 'ng_finance_harbor-case-4',
    zoneId: 'ng_finance_harbor',
    title: 'Кейс: Dividend Timing',
    brief:
      'Сценарий о своевременной выплате дивидендов и эффекте на net profit margin.',
    steps: ['ng_finance_harbor-context-4', 'ng_finance_harbor-sentence-4', 'ng_finance_harbor-boss-4'],
  },

  {
    id: 'ng_investment_factory-case-1',
    zoneId: 'ng_investment_factory',
    title: 'Кейс: Productive Facilities',
    brief:
      'Кейс о purchase/disposal of productive facilities и корректном переносе терминов в перевод.',
    steps: ['ng_investment_factory-context-1', 'ng_investment_factory-sentence-1', 'ng_investment_factory-boss-1'],
  },
  {
    id: 'ng_investment_factory-case-2',
    zoneId: 'ng_investment_factory',
    title: 'Кейс: Growth Capital',
    brief:
      'Собери аргументацию о том, как инвестиционные решения поддерживают рост и выживаемость фирмы.',
    steps: ['ng_investment_factory-context-2', 'ng_investment_factory-sentence-2', 'ng_investment_factory-boss-2'],
  },
  {
    id: 'ng_investment_factory-case-3',
    zoneId: 'ng_investment_factory',
    title: 'Кейс: Investment vs Profit',
    brief:
      'Проработай связку investment cash flows и финансовой результативности в академическом стиле статьи.',
    steps: ['ng_investment_factory-context-3', 'ng_investment_factory-sentence-3', 'ng_investment_factory-boss-3'],
  },
  {
    id: 'ng_investment_factory-case-4',
    zoneId: 'ng_investment_factory',
    title: 'Кейс: Asset Portfolio Control',
    brief:
      'Тренировка перевода по долгосрочным активам, выбытиям и инвестиционному управлению.',
    steps: ['ng_investment_factory-context-4', 'ng_investment_factory-sentence-4', 'ng_investment_factory-boss-4'],
  },

  {
    id: 'ng_council_hall-case-1',
    zoneId: 'ng_council_hall',
    title: 'Кейс: Regression Findings',
    brief:
      'Сделай финальный перевод блока результатов: значимость cash flow факторов для profit for the year.',
    steps: ['ng_council_hall-context-1', 'ng_council_hall-sentence-1', 'ng_council_hall-boss-1'],
  },
  {
    id: 'ng_council_hall-case-2',
    zoneId: 'ng_council_hall',
    title: 'Кейс: Summary of Findings',
    brief:
      'Сценарий по краткому резюме результатов по operating, financing и investing направлениям.',
    steps: ['ng_council_hall-context-2', 'ng_council_hall-sentence-2', 'ng_council_hall-boss-2'],
  },
  {
    id: 'ng_council_hall-case-3',
    zoneId: 'ng_council_hall',
    title: 'Кейс: Integrated Conclusion',
    brief:
      'Перевод заключения с акцентом на интегральный эффект трех видов cash flow.',
    steps: ['ng_council_hall-context-3', 'ng_council_hall-sentence-3', 'ng_council_hall-boss-3'],
  },
  {
    id: 'ng_council_hall-case-4',
    zoneId: 'ng_council_hall',
    title: 'Кейс: Recommendation Memo',
    brief:
      'Оформи финальный memo по рекомендациям: дивиденды, налоги и финансовая устойчивость компаний.',
    steps: ['ng_council_hall-context-4', 'ng_council_hall-sentence-4', 'ng_council_hall-boss-4'],
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
