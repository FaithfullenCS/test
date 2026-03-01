import {
  BoardroomBossChallenge,
  Challenge,
  ChallengeMemoryStat,
  CompletedChallenge,
  DifficultyConfig,
  DifficultyLevel,
  GameMechanic,
  PlayerProgress,
  PlayMode,
  ScoreResult,
  TrainerStats,
  ZoneBadge,
  ZoneConfig,
  ZoneId,
} from '../types/game';
import { normalizeText } from './text';

export const APP_PROGRESS_VERSION = 3;
export const HINT_PENALTY = 2;
export const STREAK_BONUS_EVERY = 5;
export const STREAK_BONUS_POINTS = 8;
export const TRAINER_SESSION_SIZE = 12;
export const ADAPTIVE_RECALL_SESSION_SIZE = 12;
export const RETENTION_BONUS_POINTS = 2;
export const SPRINT_SESSION_SIZE = 8;
export const SPRINT_DURATION_SECONDS = 240;

const ARC_DUE_TARGET = 8;
const ARC_WEAK_TARGET = 4;
const LEITNER_INTERVALS_DAYS = [0, 1, 3, 7, 14, 30] as const;

export interface MemoryUpdateOutcome {
  isCorrect: boolean;
  attempt: number;
  hintUsed: boolean;
}

export interface SprintScoreInput {
  awardedLp: number;
  timeLeftSec: number;
  streakBonus: number;
}

export const difficultyConfig: Record<DifficultyLevel, DifficultyConfig> = {
  easy: {
    maxAttempts: 4,
    hintPenalty: 1,
    lpMultiplier: 0.8,
    hardTimerSeconds: null,
    bossKeywordThreshold: 0.6,
  },
  medium: {
    maxAttempts: 3,
    hintPenalty: 2,
    lpMultiplier: 1,
    hardTimerSeconds: null,
    bossKeywordThreshold: 0.75,
  },
  hard: {
    maxAttempts: 2,
    hintPenalty: 3,
    lpMultiplier: 1.3,
    hardTimerSeconds: 60,
    bossKeywordThreshold: 1,
  },
};

const pointsByAttempt: Record<number, number> = {
  1: 10,
  2: 6,
  3: 3,
};

export function basePointsForAttempt(attempt: number): number {
  return pointsByAttempt[attempt] ?? 0;
}

export function applyHintPenalty(points: number, hintUsed: boolean, penalty = HINT_PENALTY): number {
  if (!hintUsed) {
    return points;
  }
  return Math.max(0, points - penalty);
}

export function applyDifficultyMultiplier(points: number, multiplier: number): number {
  return Math.max(0, Math.round(points * multiplier));
}

export function getDifficultyConfig(level: DifficultyLevel): DifficultyConfig {
  return difficultyConfig[level];
}

function calculateAwardedLp(
  attempt: number,
  hintUsed: boolean,
  level: DifficultyLevel,
): { awarded: number; penalty: number } {
  const config = getDifficultyConfig(level);
  const rawPoints = basePointsForAttempt(attempt);
  const pointsAfterHint = applyHintPenalty(rawPoints, hintUsed, config.hintPenalty);
  const awarded = applyDifficultyMultiplier(pointsAfterHint, config.lpMultiplier);

  return {
    awarded,
    penalty: hintUsed ? config.hintPenalty : 0,
  };
}

export function matchBossKeywords(
  input: string,
  challenge: BoardroomBossChallenge,
): string[] {
  const normalized = normalizeText(input);
  return challenge.requiredKeywords.filter((keyword) => {
    const normalizedKeyword = normalizeText(keyword);
    const variants = challenge.keywordSynonyms[keyword] ?? [];
    const normalizedVariants = variants.map((variant) => normalizeText(variant));

    return [normalizedKeyword, ...normalizedVariants].some((token) =>
      token.length > 0 ? normalized.includes(token) : false,
    );
  });
}

function scoreBossAnswer(
  input: string,
  challenge: BoardroomBossChallenge,
  attempt: number,
  hintUsed: boolean,
  level: DifficultyLevel,
): ScoreResult {
  const normalizedInput = normalizeText(input);
  const config = getDifficultyConfig(level);
  const keywordTarget = Math.max(
    1,
    Math.ceil(challenge.requiredKeywords.length * config.bossKeywordThreshold),
  );

  if (!normalizedInput) {
    return {
      isCorrect: false,
      awardedLp: 0,
      penalties: 0,
      normalizedInput,
      matchedKeywords: [],
      maxKeywordMatches: challenge.requiredKeywords.length,
      feedback: 'Пустой ответ. Добавь перевод перед проверкой.',
    };
  }

  const accepted = [challenge.correctAnswer, ...challenge.acceptableAnswers].map((answer) =>
    normalizeText(answer),
  );

  const exactMatch = accepted.includes(normalizedInput);
  const matchedKeywords = matchBossKeywords(input, challenge);

  const semanticMatch = matchedKeywords.length >= keywordTarget;
  const isCorrect = exactMatch || semanticMatch;

  const scoring = isCorrect ? calculateAwardedLp(attempt, hintUsed, level) : { awarded: 0, penalty: 0 };

  const feedback = isCorrect
    ? exactMatch
      ? 'Точный перевод принят.'
      : 'Ответ принят по ключевым смысловым токенам.'
    : 'Не хватает ключевых смысловых элементов. Проверь терминологию и связь частей предложения.';

  return {
    isCorrect,
    awardedLp: scoring.awarded,
    penalties: scoring.penalty,
    normalizedInput,
    matchedKeywords,
    maxKeywordMatches: challenge.requiredKeywords.length,
    feedback,
  };
}

function scoreObjectiveAnswer(
  answer: string,
  challenge: Challenge,
  attempt: number,
  hintUsed: boolean,
  level: DifficultyLevel,
): ScoreResult {
  const normalizedInput = normalizeText(answer);
  const normalizedCorrect = normalizeText(challenge.correctAnswer);
  const isCorrect = normalizedInput === normalizedCorrect;
  const scoring = isCorrect ? calculateAwardedLp(attempt, hintUsed, level) : { awarded: 0, penalty: 0 };

  return {
    isCorrect,
    awardedLp: scoring.awarded,
    penalties: scoring.penalty,
    normalizedInput,
    matchedKeywords: [],
    maxKeywordMatches: 0,
    feedback: isCorrect
      ? 'Верно. Перевод соответствует ожидаемому.'
      : 'Пока неверно. Проверь терминологию и порядок слов.',
  };
}

export function scoreAnswer(
  answer: string,
  challenge: Challenge,
  attempt: number,
  hintUsed: boolean,
  difficulty: DifficultyLevel,
  _mode: PlayMode,
): ScoreResult {
  if (challenge.mechanic === 'boardroom_boss') {
    return scoreBossAnswer(answer, challenge, attempt, hintUsed, difficulty);
  }
  return scoreObjectiveAnswer(answer, challenge, attempt, hintUsed, difficulty);
}

function parseIso(value: string | undefined): number {
  if (!value) {
    return 0;
  }
  const parsed = new Date(value).getTime();
  return Number.isFinite(parsed) ? parsed : 0;
}

function addDaysToIso(baseIso: string, days: number): string {
  const base = new Date(baseIso);
  const next = Number.isFinite(base.getTime()) ? base : new Date();
  next.setDate(next.getDate() + days);
  return next.toISOString();
}

function challengeAccuracy(progress: PlayerProgress, challengeId: string): number {
  const stat = progress.trainerStats.challengeStats[challengeId];
  if (!stat || stat.seen === 0) {
    return 0;
  }
  return stat.correct / stat.seen;
}

export function isChallengeDue(
  memory: ChallengeMemoryStat | undefined,
  nowIso = new Date().toISOString(),
): boolean {
  if (!memory) {
    return true;
  }

  return parseIso(memory.dueAt) <= parseIso(nowIso);
}

export function updateMemoryStat(
  previous: ChallengeMemoryStat | undefined,
  outcome: MemoryUpdateOutcome,
  nowIso = new Date().toISOString(),
): ChallengeMemoryStat {
  const previousBox = Math.max(0, Math.min(LEITNER_INTERVALS_DAYS.length - 1, previous?.box ?? 0));
  const previousLapses = Math.max(0, previous?.lapses ?? 0);
  const confidentSuccess = outcome.isCorrect && outcome.attempt === 1 && !outcome.hintUsed;

  let nextBox = previousBox;
  let nextLapses = previousLapses;

  if (confidentSuccess) {
    nextBox = Math.min(LEITNER_INTERVALS_DAYS.length - 1, previousBox + 1);
  } else if (!outcome.isCorrect) {
    nextBox = 0;
    nextLapses += 1;
  }

  return {
    box: nextBox,
    dueAt: addDaysToIso(nowIso, LEITNER_INTERVALS_DAYS[nextBox]),
    lapses: nextLapses,
    lastReviewedAt: nowIso,
  };
}

export function buildAdaptiveRecallQueue(
  progress: PlayerProgress,
  pool: Challenge[],
  size: number,
  nowIso = new Date().toISOString(),
): string[] {
  if (pool.length === 0 || size <= 0) {
    return [];
  }

  const dueCandidates = pool
    .filter((challenge) => isChallengeDue(progress.trainerStats.memoryByChallenge[challenge.id], nowIso))
    .sort((left, right) => {
      const leftMemory = progress.trainerStats.memoryByChallenge[left.id];
      const rightMemory = progress.trainerStats.memoryByChallenge[right.id];

      const dueDelta = parseIso(leftMemory?.dueAt) - parseIso(rightMemory?.dueAt);
      if (dueDelta !== 0) {
        return dueDelta;
      }

      const accuracyDelta = challengeAccuracy(progress, left.id) - challengeAccuracy(progress, right.id);
      if (accuracyDelta !== 0) {
        return accuracyDelta;
      }

      return parseIso(progress.trainerStats.challengeStats[left.id]?.lastPlayedAt)
        - parseIso(progress.trainerStats.challengeStats[right.id]?.lastPlayedAt);
    });

  const weakCandidates = pool
    .filter((challenge) => !isChallengeDue(progress.trainerStats.memoryByChallenge[challenge.id], nowIso))
    .sort((left, right) => {
      const accuracyDelta = challengeAccuracy(progress, left.id) - challengeAccuracy(progress, right.id);
      if (accuracyDelta !== 0) {
        return accuracyDelta;
      }
      const leftSeen = progress.trainerStats.challengeStats[left.id]?.seen ?? 0;
      const rightSeen = progress.trainerStats.challengeStats[right.id]?.seen ?? 0;
      return leftSeen - rightSeen;
    });

  const staleCandidates = pool
    .slice()
    .sort(
      (left, right) =>
        parseIso(progress.trainerStats.challengeStats[left.id]?.lastPlayedAt)
        - parseIso(progress.trainerStats.challengeStats[right.id]?.lastPlayedAt),
    );

  const queue: string[] = [];
  const used = new Set<string>();

  const pushUnique = (list: Challenge[], targetSize: number) => {
    for (const challenge of list) {
      if (queue.length >= targetSize) {
        return;
      }
      if (used.has(challenge.id)) {
        continue;
      }
      queue.push(challenge.id);
      used.add(challenge.id);
    }
  };

  const dueTarget = Math.min(size, ARC_DUE_TARGET);
  const weakTarget = Math.min(size, dueTarget + ARC_WEAK_TARGET);

  pushUnique(dueCandidates, dueTarget);
  pushUnique(weakCandidates, weakTarget);
  pushUnique(staleCandidates, size);

  if (queue.length < size) {
    const fallback = pool.slice().sort((left, right) => left.id.localeCompare(right.id));
    let cursor = 0;
    while (queue.length < size) {
      const candidate = fallback[cursor % fallback.length].id;
      if (!used.has(candidate)) {
        queue.push(candidate);
        used.add(candidate);
      } else if (used.size >= fallback.length) {
        queue.push(candidate);
      }
      cursor += 1;
    }
  }

  return queue.slice(0, size);
}

export function computeSprintScore(input: SprintScoreInput): number {
  const boundedTimeLeft = Math.max(0, Math.min(SPRINT_DURATION_SECONDS, Math.round(input.timeLeftSec)));
  const timeBonus = Math.round((boundedTimeLeft / SPRINT_DURATION_SECONDS) * 40);
  return Math.max(0, input.awardedLp + input.streakBonus + timeBonus);
}

export function calculateZoneAccuracy(
  zoneId: ZoneId,
  completedChallenges: Record<string, CompletedChallenge>,
  zoneChallengeIds: string[],
): number {
  if (zoneChallengeIds.length === 0) {
    return 0;
  }

  const correctCount = zoneChallengeIds.reduce((count, challengeId) => {
    const completed = completedChallenges[challengeId];
    if (completed?.zoneId !== zoneId) {
      return count;
    }
    return completed.isCorrect ? count + 1 : count;
  }, 0);

  return Math.round((correctCount / zoneChallengeIds.length) * 100);
}

export function badgeByAccuracy(accuracy: number): ZoneBadge {
  if (accuracy >= 92) {
    return 'gold';
  }
  if (accuracy >= 80) {
    return 'silver';
  }
  if (accuracy >= 60) {
    return 'bronze';
  }
  return 'none';
}

export function isZoneComplete(
  completedChallenges: Record<string, CompletedChallenge>,
  zoneChallengeIds: string[],
): boolean {
  return zoneChallengeIds.every((challengeId) => completedChallenges[challengeId] !== undefined);
}

export function computeAccuracyByZone(
  zones: ZoneConfig[],
  completedChallenges: Record<string, CompletedChallenge>,
): Record<ZoneId, number> {
  return zones.reduce((accumulator, zone) => {
    accumulator[zone.id] = calculateZoneAccuracy(
      zone.id,
      completedChallenges,
      zone.challengeIds,
    );
    return accumulator;
  }, {} as Record<ZoneId, number>);
}

export function computeBadges(
  zones: ZoneConfig[],
  accuracyByZone: Record<ZoneId, number>,
): Record<ZoneId, ZoneBadge> {
  return zones.reduce((accumulator, zone) => {
    accumulator[zone.id] = badgeByAccuracy(accuracyByZone[zone.id]);
    return accumulator;
  }, {} as Record<ZoneId, ZoneBadge>);
}

export function computeUnlockedZones(
  zones: ZoneConfig[],
  completedChallenges: Record<string, CompletedChallenge>,
  accuracyByZone: Record<ZoneId, number>,
): Set<ZoneId> {
  const unlocked = new Set<ZoneId>();

  for (let index = 0; index < zones.length; index += 1) {
    const zone = zones[index];

    if (index === 0) {
      unlocked.add(zone.id);
      continue;
    }

    const previousZone = zones[index - 1];
    const previousComplete = isZoneComplete(
      completedChallenges,
      previousZone.challengeIds,
    );
    const previousAccuracy = accuracyByZone[previousZone.id] ?? 0;

    const canUnlock = zone.unlockRule.requiresZoneCompletion
      ? previousComplete && previousAccuracy >= zone.unlockRule.minAccuracy
      : previousAccuracy >= zone.unlockRule.minAccuracy;

    if (canUnlock) {
      unlocked.add(zone.id);
    }
  }

  return unlocked;
}

export function buildInitialProgress(firstZone: ZoneId): PlayerProgress {
  const zeroAccuracy = {
    gate_of_flow: 0,
    operations_quarter: 0,
    finance_harbor: 0,
    investment_factory: 0,
    council_hall: 0,
  };

  return {
    version: APP_PROGRESS_VERSION,
    currentZone: firstZone,
    completedChallenges: {},
    lp: 0,
    accuracyByZone: zeroAccuracy,
    badges: {
      gate_of_flow: 'none',
      operations_quarter: 'none',
      finance_harbor: 'none',
      investment_factory: 'none',
      council_hall: 'none',
    },
    streak: 0,
    lastPlayedAt: new Date().toISOString(),
    trainerStats: createEmptyTrainerStats(),
    caseProgress: {},
  };
}

export function createEmptyTrainerStats(): TrainerStats {
  const baseMechanic = (): Record<GameMechanic, { answers: number; correct: number }> => ({
    term_forge: { answers: 0, correct: 0 },
    sentence_builder: { answers: 0, correct: 0 },
    context_choice: { answers: 0, correct: 0 },
    boardroom_boss: { answers: 0, correct: 0 },
    adaptive_recall: { answers: 0, correct: 0 },
    case_ladder: { answers: 0, correct: 0 },
    liquidity_sprint: { answers: 0, correct: 0 },
  });

  return {
    sessionsPlayed: 0,
    answersGiven: 0,
    correctAnswers: 0,
    byMechanic: baseMechanic(),
    byDifficulty: {
      easy: { answers: 0, correct: 0 },
      medium: { answers: 0, correct: 0 },
      hard: { answers: 0, correct: 0 },
    },
    challengeStats: {},
    memoryByChallenge: {},
    sprintHistory: [],
  };
}

export function computeStreakBonus(streak: number): number {
  if (streak > 0 && streak % STREAK_BONUS_EVERY === 0) {
    return STREAK_BONUS_POINTS;
  }
  return 0;
}
