import { Challenge, ZoneConfig, ZoneId } from '../../../types/game';

const WORLD_ID = 'cash-flow-nigeria' as const;

export const zoneOrder: ZoneId[] = [
  'ng_gate_of_flow',
  'ng_operations_quarter',
  'ng_finance_harbor',
  'ng_investment_factory',
  'ng_council_hall',
];

const baseZones: Omit<ZoneConfig, 'challengeIds' | 'bossChallengeIds' | 'worldId'>[] = [
  {
    id: 'ng_gate_of_flow',
    order: 1,
    title: 'Врата Потока',
    subtitle: 'Abstract + Introduction',
    description:
      'В этой зоне ты знакомишься с базовыми идеями статьи: что такое cash flow и как его направления влияют на устойчивость фирмы.',
    unlockRule: { minAccuracy: 0, requiresZoneCompletion: false },
    palette: { accent: '#E1B866', shadow: '#9B7023' },
  },
  {
    id: 'ng_operations_quarter',
    order: 2,
    title: 'Операционный Квартал',
    subtitle: 'Cash from Operating Activities',
    description:
      'Операционный денежный поток и связь с прибылью. Здесь важно точно переводить термины о выручке, расходах и рабочем капитале.',
    unlockRule: { minAccuracy: 70, requiresZoneCompletion: true },
    palette: { accent: '#2F6B5F', shadow: '#1E4A41' },
  },
  {
    id: 'ng_finance_harbor',
    order: 3,
    title: 'Финансовая Гавань',
    subtitle: 'Cash from Financing Activities',
    description:
      'Раздел о внешнем финансировании, долге и дивидендах. Цель - понимать контекст операций с капиталом компании.',
    unlockRule: { minAccuracy: 70, requiresZoneCompletion: true },
    palette: { accent: '#12343B', shadow: '#082126' },
  },
  {
    id: 'ng_investment_factory',
    order: 4,
    title: 'Инвестиционная Мануфактура',
    subtitle: 'Cash from Investing Activities',
    description:
      'В этой зоне тренируется перевод фрагментов о долгосрочных активах, инвестициях и влиянии вложений на рост фирмы.',
    unlockRule: { minAccuracy: 70, requiresZoneCompletion: true },
    palette: { accent: '#C55A3D', shadow: '#8B3E2A' },
  },
  {
    id: 'ng_council_hall',
    order: 5,
    title: 'Зал Совета',
    subtitle: 'Results + Summary + Recommendations',
    description:
      'Финальная зона. Здесь проверяется точный перевод выводов исследования, статистической интерпретации и рекомендаций.',
    unlockRule: { minAccuracy: 70, requiresZoneCompletion: true },
    palette: { accent: '#7F6F5B', shadow: '#564A3D' },
  },
];

export function buildZones(challenges: Challenge[]): ZoneConfig[] {
  return baseZones.map((zone) => {
    const zoneChallenges = challenges
      .filter((challenge) => challenge.zoneId === zone.id)
      .map((challenge) => challenge.id);

    const bossChallengeIds = challenges
      .filter(
        (challenge) =>
          challenge.zoneId === zone.id && challenge.mechanic === 'boardroom_boss',
      )
      .map((challenge) => challenge.id);

    return {
      ...zone,
      worldId: WORLD_ID,
      challengeIds: zoneChallenges,
      bossChallengeIds,
    };
  });
}
