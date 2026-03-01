import { CaseScenario, ZoneId } from '../types/game';

const zoneIds: ZoneId[] = [
  'gate_of_flow',
  'operations_quarter',
  'finance_harbor',
  'investment_factory',
  'council_hall',
];

const zoneCaseTitles: Record<ZoneId, [string, string]> = {
  gate_of_flow: ['Кейс: Старт потока', 'Кейс: Проверка терминов'],
  operations_quarter: ['Кейс: Операционный цикл', 'Кейс: Кассовый разрыв'],
  finance_harbor: ['Кейс: Структура капитала', 'Кейс: Дивидендное решение'],
  investment_factory: ['Кейс: Инвест-проект', 'Кейс: Портфель активов'],
  council_hall: ['Кейс: Финальный отчёт', 'Кейс: Рекомендации совета'],
};

const zoneCaseBriefs: Record<ZoneId, [string, string]> = {
  gate_of_flow: [
    'Пройди путь от анализа контекста до полноценного перевода в вводной части исследования.',
    'Собери корректную аргументацию по ключевым базовым терминам cash flow.',
  ],
  operations_quarter: [
    'Уточни перевод по операционным метрикам и защити вывод на уровне менеджера.',
    'Отработай сценарий со сбоями ликвидности и терминологией обязательств.',
  ],
  finance_harbor: [
    'Свяжи финансирование, долговую нагрузку и влияние на результативность фирмы.',
    'Защити выбор формулировок по дивидендам и внешним источникам капитала.',
  ],
  investment_factory: [
    'Проведи кейс по инвестиционной активности, активам и долгосрочной эффективности.',
    'Сбалансируй перевод про покупку/выбытие активов и оценку их влияния.',
  ],
  council_hall: [
    'Заверши итоговый кейс с фокусом на результаты, выводы и академический стиль.',
    'Подготовь финальный перевод рекомендаций для управленческого решения.',
  ],
};

function buildCaseScenario(zoneId: ZoneId, caseIndex: 1 | 2): CaseScenario {
  const tupleIndex = caseIndex - 1;
  return {
    id: `${zoneId}-case-${caseIndex}`,
    zoneId,
    title: zoneCaseTitles[zoneId][tupleIndex],
    brief: zoneCaseBriefs[zoneId][tupleIndex],
    steps: [
      `${zoneId}-context-${caseIndex}`,
      `${zoneId}-sentence-${caseIndex}`,
      `${zoneId}-boss-${caseIndex}`,
    ],
  };
}

export const caseScenarios: CaseScenario[] = zoneIds.flatMap((zoneId) => [
  buildCaseScenario(zoneId, 1),
  buildCaseScenario(zoneId, 2),
]);

export const caseScenarioById = caseScenarios.reduce((accumulator, scenario) => {
  accumulator[scenario.id] = scenario;
  return accumulator;
}, {} as Record<string, CaseScenario>);
