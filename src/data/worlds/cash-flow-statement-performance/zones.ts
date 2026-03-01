import { Challenge, ZoneConfig, ZoneId } from '../../../types/game';

const WORLD_ID = 'cash-flow-statement-performance' as const;

export const zoneOrder: ZoneId[] = [
  'cfs_abstract_delta',
  'cfs_liquidity_corridor',
  'cfs_financing_spine',
  'cfs_investment_atrium',
  'cfs_regulator_forum',
];

const baseZones: Omit<ZoneConfig, 'challengeIds' | 'bossChallengeIds' | 'worldId'>[] = [
  {
    id: 'cfs_abstract_delta',
    order: 1,
    title: 'Врата Потока',
    subtitle: 'Abstract + Introduction (2007-2011)',
    description:
      'В этой зоне ты разбираешь основу исследования: cash flow statement, выборку из 6 компаний NSE и связь потоков с корпоративной результативностью.',
    unlockRule: { minAccuracy: 0, requiresZoneCompletion: false },
    palette: { accent: '#E1B866', shadow: '#9B7023' },
  },
  {
    id: 'cfs_liquidity_corridor',
    order: 2,
    title: 'Операционный Квартал',
    subtitle: 'OPCF + Liquidity Signals',
    description:
      'Операционный денежный поток (OPCF), ликвидность и платежеспособность. Здесь тренируется перевод формулировок про притоки/оттоки и рабочий капитал.',
    unlockRule: { minAccuracy: 70, requiresZoneCompletion: true },
    palette: { accent: '#2F6B5F', shadow: '#1E4A41' },
  },
  {
    id: 'cfs_financing_spine',
    order: 3,
    title: 'Финансовая Гавань',
    subtitle: 'FINCF + Capital Sources',
    description:
      'Раздел о финансовых потоках (FINCF), долговых и долевых источниках, а также о роли регуляторов и внешнего аудита в оценке компании.',
    unlockRule: { minAccuracy: 70, requiresZoneCompletion: true },
    palette: { accent: '#12343B', shadow: '#082126' },
  },
  {
    id: 'cfs_investment_atrium',
    order: 4,
    title: 'Инвестиционная Мануфактура',
    subtitle: 'INVCF + Asset Decisions',
    description:
      'В этой зоне отрабатывается лексика по инвестиционным потокам (INVCF), долгосрочным активам и эффекту вложений на корпоративную результативность.',
    unlockRule: { minAccuracy: 70, requiresZoneCompletion: true },
    palette: { accent: '#C55A3D', shadow: '#8B3E2A' },
  },
  {
    id: 'cfs_regulator_forum',
    order: 5,
    title: 'Зал Совета',
    subtitle: 'ROTA Results + Recommendations',
    description:
      'Финальная зона по результатам регрессии (ROTA, OPCF, INVCF, FINCF) и рекомендациям для IFRS/FRCN/CBN/NSE/SEC/NDIC, аудиторов и государства.',
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
