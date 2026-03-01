import {
  CaseScenarioProgress,
  ChallengeMemoryStat,
  ChallengeMechanic,
  PlayableWorldId,
  PlayerProgress,
  SprintResult,
  StorageApi,
  ZoneBadge,
  ZoneId,
} from '../types/game';
import { APP_PROGRESS_VERSION, buildInitialProgress, createEmptyTrainerStats } from './engine';

export interface ProgressMigrationMap {
  zoneIdMap: Record<string, ZoneId>;
}

const STORAGE_KEY_PREFIX_V1 = 'cash-flow-quest-ru.progress.v1';
const STORAGE_KEY_PREFIX_V2 = 'cash-flow-quest-ru.progress.v2';

const VALID_MECHANICS: ChallengeMechanic[] = [
  'term_forge',
  'sentence_builder',
  'context_choice',
  'boardroom_boss',
];

function asNumber(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0;
}

function asIso(value: unknown, fallback = new Date().toISOString()): string {
  if (typeof value === 'string' && value.length > 0) {
    return value;
  }
  return fallback;
}

function remapZoneId(
  rawZoneId: unknown,
  zoneOrder: ZoneId[],
  zoneIdMap: Record<string, ZoneId>,
): ZoneId | null {
  if (typeof rawZoneId !== 'string') {
    return null;
  }

  if (zoneOrder.includes(rawZoneId as ZoneId)) {
    return rawZoneId as ZoneId;
  }

  const mapped = zoneIdMap[rawZoneId];
  if (mapped && zoneOrder.includes(mapped)) {
    return mapped;
  }

  return null;
}

function remapChallengeId(rawChallengeId: unknown, zoneIdMap: Record<string, ZoneId>): string | null {
  if (typeof rawChallengeId !== 'string' || rawChallengeId.length === 0) {
    return null;
  }

  const parsed = rawChallengeId.match(/^([a-z_]+)-(term|sentence|context|boss)-(\d+)$/i);
  if (!parsed) {
    return rawChallengeId;
  }

  const [, zonePart, mechanicPart, indexPart] = parsed;
  const mappedZone = zoneIdMap[zonePart] ?? zonePart;
  return `${mappedZone}-${mechanicPart}-${indexPart}`;
}

function remapCaseScenarioId(rawScenarioId: unknown, zoneIdMap: Record<string, ZoneId>): string | null {
  if (typeof rawScenarioId !== 'string' || rawScenarioId.length === 0) {
    return null;
  }

  const parsed = rawScenarioId.match(/^([a-z_]+)-case-(\d+)$/i);
  if (!parsed) {
    return rawScenarioId;
  }

  const [, zonePart, indexPart] = parsed;
  const mappedZone = zoneIdMap[zonePart] ?? zonePart;
  return `${mappedZone}-case-${indexPart}`;
}

function normalizeAccuracyByZone(
  candidate: unknown,
  zoneOrder: ZoneId[],
  zoneIdMap: Record<string, ZoneId>,
): Partial<Record<ZoneId, number>> {
  if (!candidate || typeof candidate !== 'object') {
    return {};
  }

  return Object.entries(candidate as Record<string, unknown>).reduce((accumulator, [zoneId, value]) => {
    const mappedZone = remapZoneId(zoneId, zoneOrder, zoneIdMap);
    if (!mappedZone) {
      return accumulator;
    }

    accumulator[mappedZone] = Math.max(0, Math.min(100, Math.round(asNumber(value))));
    return accumulator;
  }, {} as Partial<Record<ZoneId, number>>);
}

function normalizeBadges(
  candidate: unknown,
  zoneOrder: ZoneId[],
  zoneIdMap: Record<string, ZoneId>,
): Partial<Record<ZoneId, ZoneBadge>> {
  if (!candidate || typeof candidate !== 'object') {
    return {};
  }

  return Object.entries(candidate as Record<string, unknown>).reduce((accumulator, [zoneId, value]) => {
    const mappedZone = remapZoneId(zoneId, zoneOrder, zoneIdMap);
    if (!mappedZone) {
      return accumulator;
    }

    const badge = value === 'bronze' || value === 'silver' || value === 'gold' ? value : 'none';
    accumulator[mappedZone] = badge;
    return accumulator;
  }, {} as Partial<Record<ZoneId, ZoneBadge>>);
}

function normalizeCompletedChallenges(
  candidate: unknown,
  zoneOrder: ZoneId[],
  zoneIdMap: Record<string, ZoneId>,
): PlayerProgress['completedChallenges'] {
  if (!candidate || typeof candidate !== 'object') {
    return {};
  }

  return Object.entries(candidate as Record<string, unknown>).reduce((accumulator, [challengeKey, value]) => {
    if (!value || typeof value !== 'object') {
      return accumulator;
    }

    const raw = value as Partial<PlayerProgress['completedChallenges'][string]>;
    const challengeId = remapChallengeId(raw.challengeId ?? challengeKey, zoneIdMap);
    const zoneId = remapZoneId(raw.zoneId, zoneOrder, zoneIdMap);

    if (!challengeId || !zoneId) {
      return accumulator;
    }

    const mechanic = VALID_MECHANICS.includes(raw.mechanic as ChallengeMechanic)
      ? (raw.mechanic as ChallengeMechanic)
      : 'term_forge';

    accumulator[challengeId] = {
      challengeId,
      zoneId,
      mechanic,
      attempts: Math.max(0, Math.round(asNumber(raw.attempts))),
      isCorrect: Boolean(raw.isCorrect),
      hintUsed: Boolean(raw.hintUsed),
      awardedLp: Math.max(0, Math.round(asNumber(raw.awardedLp))),
      answeredAt: asIso(raw.answeredAt),
    };

    return accumulator;
  }, {} as PlayerProgress['completedChallenges']);
}

function normalizeChallengeStats(
  candidate: unknown,
  zoneIdMap: Record<string, ZoneId>,
): PlayerProgress['trainerStats']['challengeStats'] {
  if (!candidate || typeof candidate !== 'object') {
    return {};
  }

  return Object.entries(candidate as Record<string, unknown>).reduce((accumulator, [challengeId, value]) => {
    if (!value || typeof value !== 'object') {
      return accumulator;
    }

    const mappedChallengeId = remapChallengeId(challengeId, zoneIdMap);
    if (!mappedChallengeId) {
      return accumulator;
    }

    const stat = value as Partial<PlayerProgress['trainerStats']['challengeStats'][string]>;
    accumulator[mappedChallengeId] = {
      seen: Math.max(0, Math.round(asNumber(stat.seen))),
      correct: Math.max(0, Math.round(asNumber(stat.correct))),
      lastPlayedAt: asIso(stat.lastPlayedAt),
    };

    return accumulator;
  }, {} as PlayerProgress['trainerStats']['challengeStats']);
}

function normalizeMemoryByChallenge(
  candidate: unknown,
  zoneIdMap: Record<string, ZoneId>,
): Record<string, ChallengeMemoryStat> {
  if (!candidate || typeof candidate !== 'object') {
    return {};
  }

  return Object.entries(candidate as Record<string, unknown>).reduce((accumulator, [challengeId, value]) => {
    if (!value || typeof value !== 'object') {
      return accumulator;
    }

    const mappedChallengeId = remapChallengeId(challengeId, zoneIdMap);
    if (!mappedChallengeId) {
      return accumulator;
    }

    const stat = value as Partial<ChallengeMemoryStat>;
    accumulator[mappedChallengeId] = {
      box: Math.max(0, Math.min(5, Math.round(asNumber(stat.box)))),
      dueAt: asIso(stat.dueAt),
      lapses: Math.max(0, Math.round(asNumber(stat.lapses))),
      lastReviewedAt: asIso(stat.lastReviewedAt),
    };

    return accumulator;
  }, {} as Record<string, ChallengeMemoryStat>);
}

function normalizeSprintHistory(candidate: unknown): SprintResult[] {
  if (!Array.isArray(candidate)) {
    return [];
  }

  return candidate
    .filter((entry) => entry && typeof entry === 'object')
    .map((entry, index) => {
      const item = entry as Partial<SprintResult>;
      return {
        playedAt: asIso(item.playedAt),
        score: Math.max(0, Math.round(asNumber(item.score))),
        accuracy: Math.max(0, Math.min(100, Math.round(asNumber(item.accuracy)))),
        durationSec: Math.max(0, Math.round(asNumber(item.durationSec))),
        rank: Math.max(1, Math.round(asNumber(item.rank)) || index + 1),
      };
    });
}

function normalizeCaseProgress(
  candidate: unknown,
  zoneIdMap: Record<string, ZoneId>,
): Record<string, CaseScenarioProgress> {
  if (!candidate || typeof candidate !== 'object') {
    return {};
  }

  return Object.entries(candidate as Record<string, unknown>).reduce((accumulator, [scenarioId, value]) => {
    if (!value || typeof value !== 'object') {
      return accumulator;
    }

    const mappedScenarioId = remapCaseScenarioId(scenarioId, zoneIdMap);
    if (!mappedScenarioId) {
      return accumulator;
    }

    const progress = value as Partial<CaseScenarioProgress>;
    accumulator[mappedScenarioId] = {
      scenarioId: mappedScenarioId,
      plays: Math.max(0, Math.round(asNumber(progress.plays))),
      completions: Math.max(0, Math.round(asNumber(progress.completions))),
      bestLp: Math.max(0, Math.round(asNumber(progress.bestLp))),
      bestAccuracy: Math.max(0, Math.min(100, Math.round(asNumber(progress.bestAccuracy)))),
      lastPlayedAt: asIso(progress.lastPlayedAt),
      lastCompletedAt:
        typeof progress.lastCompletedAt === 'string' && progress.lastCompletedAt.length > 0
          ? progress.lastCompletedAt
          : null,
    };

    return accumulator;
  }, {} as Record<string, CaseScenarioProgress>);
}

export function createStorageApi(
  worldId: PlayableWorldId,
  zoneOrder: ZoneId[],
  migrationMap: ProgressMigrationMap,
): StorageApi {
  const v2StorageKey = `${STORAGE_KEY_PREFIX_V2}.${worldId}`;
  const v1WorldStorageKey = `${STORAGE_KEY_PREFIX_V1}.${worldId}`;
  const v1StorageKey = STORAGE_KEY_PREFIX_V1;

  const defaultProgress = (): PlayerProgress => buildInitialProgress(worldId, zoneOrder);

  const coerceZoneId = (input: unknown): ZoneId => {
    const mapped = remapZoneId(input, zoneOrder, migrationMap.zoneIdMap);
    return mapped ?? zoneOrder[0];
  };

  const normalizeTrainerStats = (candidate: unknown): PlayerProgress['trainerStats'] => {
    const fallback = createEmptyTrainerStats();

    if (!candidate || typeof candidate !== 'object') {
      return fallback;
    }

    const raw = candidate as Partial<PlayerProgress['trainerStats']>;

    return {
      sessionsPlayed: Math.max(0, Math.round(asNumber(raw.sessionsPlayed))),
      answersGiven: Math.max(0, Math.round(asNumber(raw.answersGiven))),
      correctAnswers: Math.max(0, Math.round(asNumber(raw.correctAnswers))),
      byMechanic: {
        term_forge: {
          answers: asNumber(raw.byMechanic?.term_forge?.answers),
          correct: asNumber(raw.byMechanic?.term_forge?.correct),
        },
        sentence_builder: {
          answers: asNumber(raw.byMechanic?.sentence_builder?.answers),
          correct: asNumber(raw.byMechanic?.sentence_builder?.correct),
        },
        context_choice: {
          answers: asNumber(raw.byMechanic?.context_choice?.answers),
          correct: asNumber(raw.byMechanic?.context_choice?.correct),
        },
        boardroom_boss: {
          answers: asNumber(raw.byMechanic?.boardroom_boss?.answers),
          correct: asNumber(raw.byMechanic?.boardroom_boss?.correct),
        },
        adaptive_recall: {
          answers: asNumber(raw.byMechanic?.adaptive_recall?.answers),
          correct: asNumber(raw.byMechanic?.adaptive_recall?.correct),
        },
        case_ladder: {
          answers: asNumber(raw.byMechanic?.case_ladder?.answers),
          correct: asNumber(raw.byMechanic?.case_ladder?.correct),
        },
        liquidity_sprint: {
          answers: asNumber(raw.byMechanic?.liquidity_sprint?.answers),
          correct: asNumber(raw.byMechanic?.liquidity_sprint?.correct),
        },
      },
      byDifficulty: {
        easy: {
          answers: asNumber(raw.byDifficulty?.easy?.answers),
          correct: asNumber(raw.byDifficulty?.easy?.correct),
        },
        medium: {
          answers: asNumber(raw.byDifficulty?.medium?.answers),
          correct: asNumber(raw.byDifficulty?.medium?.correct),
        },
        hard: {
          answers: asNumber(raw.byDifficulty?.hard?.answers),
          correct: asNumber(raw.byDifficulty?.hard?.correct),
        },
      },
      challengeStats: normalizeChallengeStats(raw.challengeStats, migrationMap.zoneIdMap),
      memoryByChallenge: normalizeMemoryByChallenge(raw.memoryByChallenge, migrationMap.zoneIdMap),
      sprintHistory: normalizeSprintHistory(raw.sprintHistory),
    };
  };

  const validateProgress = (candidate: unknown): PlayerProgress => {
    const fallback = defaultProgress();

    if (!candidate || typeof candidate !== 'object') {
      return fallback;
    }

    const raw = candidate as Partial<PlayerProgress>;

    return {
      version:
        typeof raw.version === 'number' && Number.isFinite(raw.version)
          ? raw.version
          : APP_PROGRESS_VERSION,
      worldId,
      currentZone: coerceZoneId(raw.currentZone),
      completedChallenges: normalizeCompletedChallenges(
        raw.completedChallenges,
        zoneOrder,
        migrationMap.zoneIdMap,
      ),
      lp: Math.max(0, Math.round(asNumber(raw.lp))),
      accuracyByZone: normalizeAccuracyByZone(raw.accuracyByZone, zoneOrder, migrationMap.zoneIdMap),
      badges: normalizeBadges(raw.badges, zoneOrder, migrationMap.zoneIdMap),
      streak: Math.max(0, Math.round(asNumber(raw.streak))),
      lastPlayedAt: asIso(raw.lastPlayedAt),
      trainerStats: normalizeTrainerStats(raw.trainerStats),
      caseProgress: normalizeCaseProgress(raw.caseProgress, migrationMap.zoneIdMap),
    };
  };

  const api: StorageApi = {
    loadProgress: () => {
      try {
        const v2Value = window.localStorage.getItem(v2StorageKey);
        if (v2Value) {
          const parsed = JSON.parse(v2Value) as unknown;
          const normalized = validateProgress(parsed);
          if (normalized.version !== APP_PROGRESS_VERSION) {
            return api.migrateProgress(normalized);
          }
          return normalized;
        }

        const v1WorldValue = window.localStorage.getItem(v1WorldStorageKey);
        if (v1WorldValue) {
          return api.migrateProgress(JSON.parse(v1WorldValue));
        }

        const v1Value = window.localStorage.getItem(v1StorageKey);
        if (v1Value) {
          return api.migrateProgress(JSON.parse(v1Value));
        }

        return defaultProgress();
      } catch {
        return defaultProgress();
      }
    },

    saveProgress: (progress) => {
      window.localStorage.setItem(v2StorageKey, JSON.stringify(progress));
    },

    resetProgress: () => {
      window.localStorage.removeItem(v2StorageKey);
    },

    migrateProgress: (oldVersion) => {
      const validated = validateProgress(oldVersion);
      const migrated: PlayerProgress = {
        ...defaultProgress(),
        ...validated,
        version: APP_PROGRESS_VERSION,
        worldId,
        currentZone: coerceZoneId(validated.currentZone),
        lastPlayedAt: validated.lastPlayedAt || new Date().toISOString(),
        trainerStats: {
          ...createEmptyTrainerStats(),
          ...validated.trainerStats,
          byMechanic: {
            ...createEmptyTrainerStats().byMechanic,
            ...validated.trainerStats.byMechanic,
          },
          byDifficulty: {
            ...createEmptyTrainerStats().byDifficulty,
            ...validated.trainerStats.byDifficulty,
          },
        },
        caseProgress: validated.caseProgress ?? {},
      };

      window.localStorage.setItem(v2StorageKey, JSON.stringify(migrated));
      return migrated;
    },
  };

  return api;
}

export function storageKey(worldId: PlayableWorldId): string {
  return `${STORAGE_KEY_PREFIX_V2}.${worldId}`;
}
