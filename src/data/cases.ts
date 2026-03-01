import { CaseScenario } from '../types/game';

export const caseScenarios: CaseScenario[] = [
  {
    id: 'gate_of_flow-case-1',
    zoneId: 'gate_of_flow',
    title: 'Кейс: Objective Alignment',
    brief:
      'Собери перевод ядра исследования: цель работы и влияние cash flow на financial performance.',
    steps: ['gate_of_flow-context-1', 'gate_of_flow-sentence-1', 'gate_of_flow-boss-1'],
  },
  {
    id: 'gate_of_flow-case-2',
    zoneId: 'gate_of_flow',
    title: 'Кейс: Flow Directions',
    brief:
      'Отработай блок про inflow/outflow и академическую постановку проблематики во введении.',
    steps: ['gate_of_flow-context-2', 'gate_of_flow-sentence-2', 'gate_of_flow-boss-2'],
  },
  {
    id: 'gate_of_flow-case-3',
    zoneId: 'gate_of_flow',
    title: 'Кейс: Hypothesis Brief',
    brief:
      'Сценарий по формулировке исследовательских гипотез и связи трех потоков с profit for the year.',
    steps: ['gate_of_flow-context-3', 'gate_of_flow-sentence-3', 'gate_of_flow-boss-3'],
  },
  {
    id: 'gate_of_flow-case-4',
    zoneId: 'gate_of_flow',
    title: 'Кейс: Method and Timeline',
    brief:
      'Уточни перевод методологии: ex-post facto, secondary data и период 2010-2019.',
    steps: ['gate_of_flow-context-4', 'gate_of_flow-sentence-4', 'gate_of_flow-boss-4'],
  },

  {
    id: 'operations_quarter-case-1',
    zoneId: 'operations_quarter',
    title: 'Кейс: Liquidity Pulse',
    brief:
      'Контекстный кейс по cash inflows/cash outflows и устойчивости платежей в операционном цикле.',
    steps: ['operations_quarter-context-1', 'operations_quarter-sentence-1', 'operations_quarter-boss-1'],
  },
  {
    id: 'operations_quarter-case-2',
    zoneId: 'operations_quarter',
    title: 'Кейс: Working Capital Desk',
    brief:
      'Фокус на trade receivables, operating expenses и управлении оборотным капиталом.',
    steps: ['operations_quarter-context-2', 'operations_quarter-sentence-2', 'operations_quarter-boss-2'],
  },
  {
    id: 'operations_quarter-case-3',
    zoneId: 'operations_quarter',
    title: 'Кейс: Method Choice',
    brief:
      'Сравни прямой и косвенный методы отражения operating cash flow в переводе отчетного текста.',
    steps: ['operations_quarter-context-3', 'operations_quarter-sentence-3', 'operations_quarter-boss-3'],
  },
  {
    id: 'operations_quarter-case-4',
    zoneId: 'operations_quarter',
    title: 'Кейс: Obligation Deadline',
    brief:
      'Сценарий по рискам неисполнения обязательств и влиянию кассовых разрывов на бизнес-устойчивость.',
    steps: ['operations_quarter-context-4', 'operations_quarter-sentence-4', 'operations_quarter-boss-4'],
  },

  {
    id: 'finance_harbor-case-1',
    zoneId: 'finance_harbor',
    title: 'Кейс: External Financing',
    brief:
      'Проработай лексику привлечения средств и связи financing cash flow с годовой прибылью.',
    steps: ['finance_harbor-context-1', 'finance_harbor-sentence-1', 'finance_harbor-boss-1'],
  },
  {
    id: 'finance_harbor-case-2',
    zoneId: 'finance_harbor',
    title: 'Кейс: Pecking Order',
    brief:
      'Кейс по логике retained earnings -> debt -> new equity в духе Pecking Order Theory.',
    steps: ['finance_harbor-context-2', 'finance_harbor-sentence-2', 'finance_harbor-boss-2'],
  },
  {
    id: 'finance_harbor-case-3',
    zoneId: 'finance_harbor',
    title: 'Кейс: Information Asymmetry',
    brief:
      'Отточить формулировки про premium на внешнее финансирование и ограничения доступа к кредиту.',
    steps: ['finance_harbor-context-3', 'finance_harbor-sentence-3', 'finance_harbor-boss-3'],
  },
  {
    id: 'finance_harbor-case-4',
    zoneId: 'finance_harbor',
    title: 'Кейс: Dividend Timing',
    brief:
      'Сценарий о своевременной выплате дивидендов и эффекте на net profit margin.',
    steps: ['finance_harbor-context-4', 'finance_harbor-sentence-4', 'finance_harbor-boss-4'],
  },

  {
    id: 'investment_factory-case-1',
    zoneId: 'investment_factory',
    title: 'Кейс: Productive Facilities',
    brief:
      'Кейс о purchase/disposal of productive facilities и корректном переносе терминов в перевод.',
    steps: ['investment_factory-context-1', 'investment_factory-sentence-1', 'investment_factory-boss-1'],
  },
  {
    id: 'investment_factory-case-2',
    zoneId: 'investment_factory',
    title: 'Кейс: Growth Capital',
    brief:
      'Собери аргументацию о том, как инвестиционные решения поддерживают рост и выживаемость фирмы.',
    steps: ['investment_factory-context-2', 'investment_factory-sentence-2', 'investment_factory-boss-2'],
  },
  {
    id: 'investment_factory-case-3',
    zoneId: 'investment_factory',
    title: 'Кейс: Investment vs Profit',
    brief:
      'Проработай связку investment cash flows и финансовой результативности в академическом стиле статьи.',
    steps: ['investment_factory-context-3', 'investment_factory-sentence-3', 'investment_factory-boss-3'],
  },
  {
    id: 'investment_factory-case-4',
    zoneId: 'investment_factory',
    title: 'Кейс: Asset Portfolio Control',
    brief:
      'Тренировка перевода по долгосрочным активам, выбытиям и инвестиционному управлению.',
    steps: ['investment_factory-context-4', 'investment_factory-sentence-4', 'investment_factory-boss-4'],
  },

  {
    id: 'council_hall-case-1',
    zoneId: 'council_hall',
    title: 'Кейс: Regression Findings',
    brief:
      'Сделай финальный перевод блока результатов: значимость cash flow факторов для profit for the year.',
    steps: ['council_hall-context-1', 'council_hall-sentence-1', 'council_hall-boss-1'],
  },
  {
    id: 'council_hall-case-2',
    zoneId: 'council_hall',
    title: 'Кейс: Summary of Findings',
    brief:
      'Сценарий по краткому резюме результатов по operating, financing и investing направлениям.',
    steps: ['council_hall-context-2', 'council_hall-sentence-2', 'council_hall-boss-2'],
  },
  {
    id: 'council_hall-case-3',
    zoneId: 'council_hall',
    title: 'Кейс: Integrated Conclusion',
    brief:
      'Перевод заключения с акцентом на интегральный эффект трех видов cash flow.',
    steps: ['council_hall-context-3', 'council_hall-sentence-3', 'council_hall-boss-3'],
  },
  {
    id: 'council_hall-case-4',
    zoneId: 'council_hall',
    title: 'Кейс: Recommendation Memo',
    brief:
      'Оформи финальный memo по рекомендациям: дивиденды, налоги и финансовая устойчивость компаний.',
    steps: ['council_hall-context-4', 'council_hall-sentence-4', 'council_hall-boss-4'],
  },
];

export const caseScenarioById = caseScenarios.reduce((accumulator, scenario) => {
  accumulator[scenario.id] = scenario;
  return accumulator;
}, {} as Record<string, CaseScenario>);
