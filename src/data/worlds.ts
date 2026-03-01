import { LearningWorldConfig } from '../types/game';

export const worldCatalog: LearningWorldConfig[] = [
  {
    id: 'cash-flow-nigeria',
    title: 'Cash Flow Quest: Nigeria',
    subtitle: 'EN -> RU Financial Translation Campaign',
    description:
      'Полный игровой мир по ранней кампании cash flow и финансовых результатов компаний food and beverage.',
    focus: 'Отчётность, cash flow, финансовый менеджмент',
    zoneCount: 5,
    challengeCount: 120,
    availability: 'available',
    route: '/world/cash-flow-nigeria',
    palette: {
      accent: '#2F6B5F',
      shadow: '#1B4239',
    },
  },
  {
    id: 'cash-flow-statement-performance',
    title: 'Cash Flow Statement Frontier',
    subtitle: 'EN -> RU Research Campaign (2007-2011)',
    description:
      'Полный игровой мир по тексту "Effect of Cash Flow Statement on Performance" с фокусом на ROTA, OPCF, INVCF и FINCF.',
    focus: 'Cash flow statement, ROTA, panel regression, financial performance',
    zoneCount: 5,
    challengeCount: 120,
    availability: 'available',
    route: '/world/cash-flow-statement-performance',
    palette: {
      accent: '#1F6A7A',
      shadow: '#13424D',
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
export const learningWorlds = worldCatalog;
