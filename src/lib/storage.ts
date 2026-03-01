import {
  CaseScenarioProgress,
  ChallengeMemoryStat,
  PlayerProgress,
  SprintResult,
  StorageApi,
  ZoneId,
} from '../types/game';
import { zoneOrder } from '../data/zones';
import { buildInitialProgress, APP_PROGRESS_VERSION, createEmptyTrainerStats } from './engine';

const STORAGE_KEY = 'cash-flow-quest-ru.progress.v1';

const defaultProgress = (): PlayerProgress => buildInitialProgress(zoneOrder[0]);

function coerceZoneId(input: unknown): ZoneId {
  if (typeof input === 'string' && zoneOrder.includes(input as ZoneId)) {
    return input as ZoneId;
  }
  return zoneOrder[0];
}

function asNumber(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0;
}

function asIso(value: unknown, fallback = new Date().toISOString()): string {
  if (typeof value === 'string' && value.length > 0) {
    return value;
  }
  return fallback;
}

function normalizeMemoryByChallenge(candidate: unknown): Record<string, ChallengeMemoryStat> {
  if (!candidate || typeof candidate !== 'object') {
    return {};
  }

  return Object.entries(candidate as Record<string, unknown>).reduce((accumulator, [challengeId, value]) => {
    if (!value || typeof value !== 'object') {
      return accumulator;
    }

    const stat = value as Partial<ChallengeMemoryStat>;
    accumulator[challengeId] = {
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

function normalizeCaseProgress(candidate: unknown): Record<string, CaseScenarioProgress> {
  if (!candidate || typeof candidate !== 'object') {
    return {};
  }

  return Object.entries(candidate as Record<string, unknown>).reduce((accumulator, [scenarioId, value]) => {
    if (!value || typeof value !== 'object') {
      return accumulator;
    }

    const progress = value as Partial<CaseScenarioProgress>;
    accumulator[scenarioId] = {
      scenarioId,
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

function normalizeTrainerStats(candidate: unknown): PlayerProgress['trainerStats'] {
  const fallback = createEmptyTrainerStats();

  if (!candidate || typeof candidate !== 'object') {
    return fallback;
  }

  const raw = candidate as Partial<PlayerProgress['trainerStats']>;

  const byMechanic = {
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
  };

  const byDifficulty = {
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
  };

  const challengeStats =
    raw.challengeStats && typeof raw.challengeStats === 'object'
      ? raw.challengeStats
      : fallback.challengeStats;

  return {
    sessionsPlayed: asNumber(raw.sessionsPlayed),
    answersGiven: asNumber(raw.answersGiven),
    correctAnswers: asNumber(raw.correctAnswers),
    byMechanic,
    byDifficulty,
    challengeStats,
    memoryByChallenge: normalizeMemoryByChallenge(raw.memoryByChallenge),
    sprintHistory: normalizeSprintHistory(raw.sprintHistory),
  };
}

function validateProgress(candidate: unknown): PlayerProgress {
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
    currentZone: coerceZoneId(raw.currentZone),
    completedChallenges:
      raw.completedChallenges && typeof raw.completedChallenges === 'object'
        ? raw.completedChallenges
        : {},
    lp: typeof raw.lp === 'number' && Number.isFinite(raw.lp) ? raw.lp : 0,
    accuracyByZone:
      raw.accuracyByZone && typeof raw.accuracyByZone === 'object'
        ? (raw.accuracyByZone as PlayerProgress['accuracyByZone'])
        : fallback.accuracyByZone,
    badges:
      raw.badges && typeof raw.badges === 'object'
        ? (raw.badges as PlayerProgress['badges'])
        : fallback.badges,
    streak: typeof raw.streak === 'number' && Number.isFinite(raw.streak) ? raw.streak : 0,
    lastPlayedAt:
      typeof raw.lastPlayedAt === 'string' && raw.lastPlayedAt.length > 0
        ? raw.lastPlayedAt
        : new Date().toISOString(),
    trainerStats: normalizeTrainerStats(raw.trainerStats),
    caseProgress: normalizeCaseProgress(raw.caseProgress),
  };
}

export const storageApi: StorageApi = {
  loadProgress: () => {
    try {
      const value = window.localStorage.getItem(STORAGE_KEY);
      if (!value) {
        return defaultProgress();
      }
      const parsed = JSON.parse(value) as unknown;
      const progress = validateProgress(parsed);
      if (progress.version !== APP_PROGRESS_VERSION) {
        return storageApi.migrateProgress(progress);
      }
      return progress;
    } catch {
      return defaultProgress();
    }
  },

  saveProgress: (progress) => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  },

  resetProgress: () => {
    window.localStorage.removeItem(STORAGE_KEY);
  },

  migrateProgress: (oldVersion) => {
    const validated = validateProgress(oldVersion);
    const migrated: PlayerProgress = {
      ...defaultProgress(),
      ...validated,
      version: APP_PROGRESS_VERSION,
      currentZone: coerceZoneId(validated.currentZone),
      lastPlayedAt: validated.lastPlayedAt || new Date().toISOString(),
      trainerStats: {
        ...createEmptyTrainerStats(),
        ...validated.trainerStats,
        byMechanic: {
          ...createEmptyTrainerStats().byMechanic,
          ...validated.trainerStats.byMechanic,
        },
      },
      caseProgress: validated.caseProgress ?? {},
    };

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
    return migrated;
  },
};

export function storageKey(): string {
  return STORAGE_KEY;
}
