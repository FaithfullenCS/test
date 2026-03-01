import { LearningWorldConfig } from '../types/game';
import { totalChallengeCount } from './challenges';
import { zoneOrder } from './zones';

export const learningWorlds: LearningWorldConfig[] = [
  {
    id: 'cash-flow-nigeria',
    title: 'Cash Flow Quest: Nigeria',
    subtitle: 'EN -> RU Financial Translation Campaign',
    description:
      'Полный игровой мир по статье о влиянии cash flow на финансовые результаты компаний food and beverage.',
    focus: 'Отчётность, cash flow, финансовый менеджмент',
    zoneCount: zoneOrder.length,
    challengeCount: totalChallengeCount,
    availability: 'available',
    route: '/world',
    palette: {
      accent: '#2F6B5F',
      shadow: '#1B4239',
    },
  },
  {
    id: 'startup-unit-economics',
    title: 'Startup Unit Economics',
    subtitle: 'Upcoming World',
    description:
      'Будущий мир по переводу материалов о CAC, LTV, burn rate и сценариях роста стартапа.',
    focus: 'Метрики стартапа, юнит-экономика, рост',
    zoneCount: 6,
    challengeCount: 144,
    availability: 'coming_soon',
    route: null,
    palette: {
      accent: '#C55A3D',
      shadow: '#8B3E2A',
    },
  },
  {
    id: 'audit-risk-lab',
    title: 'Audit & Risk Lab',
    subtitle: 'Upcoming World',
    description:
      'Будущий мир с акцентом на внутренний контроль, риск-оценку и комплаенс-терминологию.',
    focus: 'Audit, risk management, compliance',
    zoneCount: 7,
    challengeCount: 168,
    availability: 'coming_soon',
    route: null,
    palette: {
      accent: '#12343B',
      shadow: '#0A2227',
    },
  },
];

export const activeLearningWorldId = learningWorlds.find(
  (world) => world.availability === 'available',
)?.id;
