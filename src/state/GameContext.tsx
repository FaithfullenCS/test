import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import {
  adaptiveRecallDecks,
  caseScenarioById,
  challengeById,
  challenges,
  sprintScenarios,
  zones,
} from '../data';
import {
  ADAPTIVE_RECALL_SESSION_SIZE,
  RETENTION_BONUS_POINTS,
  SPRINT_SESSION_SIZE,
  buildAdaptiveRecallQueue,
  buildInitialProgress,
  computeAccuracyByZone,
  computeBadges,
  computeStreakBonus,
  computeUnlockedZones,
  isChallengeDue,
  scoreAnswer,
  updateMemoryStat,
} from '../lib/engine';
import { storageApi } from '../lib/storage';
import { seededShuffle } from '../lib/text';
import {
  AdaptiveRecallDeck,
  CaseScenario,
  Challenge,
  CompletedChallenge,
  DifficultyLevel,
  GameMechanic,
  PlayerProgress,
  ScoreResult,
  SprintResult,
  TrainerChallengeStat,
  TrainerModeMechanic,
  ZoneConfig,
  ZoneId,
} from '../types/game';

interface SubmitAnswerPayload {
  challenge: Challenge;
  answer: string;
  attempt: number;
  hintUsed: boolean;
  markAsFailed?: boolean;
}

interface SubmitAnswerResult {
  score: ScoreResult;
  streakBonus: number;
  retentionBonus: number;
  totalAwarded: number;
  isChallengeLocked: boolean;
}

type TrainerSubmitMode = 'classic' | TrainerModeMechanic;

interface SubmitTrainerAnswerPayload {
  challenge: Challenge;
  answer: string;
  attempt: number;
  hintUsed: boolean;
  difficulty: DifficultyLevel;
  markAsFailed?: boolean;
  mode?: TrainerSubmitMode;
  retentionDue?: boolean;
  lpMultiplier?: number;
}

interface AdaptiveRecallSession {
  queue: string[];
  dueChallengeIds: string[];
  deckId: string | null;
  title: string;
  brief: string;
}

interface LiquiditySprintSession {
  queue: string[];
  scenarioId: string | null;
  title: string;
  brief: string;
}

interface RecordSprintResultPayload {
  score: number;
  accuracy: number;
  durationSec: number;
  playedAt?: string;
}

interface RecordCaseScenarioPayload {
  scenarioId: string;
  awardedLp: number;
  accuracy: number;
  completed: boolean;
}

interface GameContextValue {
  zones: ZoneConfig[];
  challenges: Challenge[];
  progress: PlayerProgress;
  unlockedZones: Set<ZoneId>;
  submitAnswer: (payload: SubmitAnswerPayload) => SubmitAnswerResult;
  submitTrainerAnswer: (payload: SubmitTrainerAnswerPayload) => SubmitAnswerResult;
  buildTrainerQueue: (mechanic: GameMechanic, difficulty: DifficultyLevel, size: number) => string[];
  startAdaptiveRecallSession: (size?: number) => AdaptiveRecallSession;
  startLiquiditySprintSession: (size?: number) => LiquiditySprintSession;
  startCaseScenario: (scenarioId: string) => CaseScenario | null;
  recordSprintResult: (payload: RecordSprintResultPayload) => SprintResult;
  recordCaseScenarioResult: (payload: RecordCaseScenarioPayload) => void;
  recordTrainerSessionResult: () => void;
  setCurrentZone: (zoneId: ZoneId) => void;
  resetProgress: () => void;
  getZoneChallenges: (zoneId: ZoneId) => Challenge[];
  isChallengeCompleted: (challengeId: string) => boolean;
}

const GameContext = createContext<GameContextValue | null>(null);

function recalculate(progress: PlayerProgress): PlayerProgress {
  const accuracyByZone = computeAccuracyByZone(zones, progress.completedChallenges);
  const badges = computeBadges(zones, accuracyByZone);

  return {
    ...progress,
    accuracyByZone,
    badges,
  };
}

function loadInitialProgress(): PlayerProgress {
  const fromStorage = storageApi.loadProgress();
  return recalculate(fromStorage);
}

function persist(progress: PlayerProgress): void {
  storageApi.saveProgress(progress);
}

function hashSeed(input: string): number {
  let hash = 0;
  for (let index = 0; index < input.length; index += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash);
}

function dayIndex(now = new Date()): number {
  return Math.floor(now.getTime() / (24 * 60 * 60 * 1000));
}

function rotateByDay<T>(items: T[]): T | null {
  if (items.length === 0) {
    return null;
  }
  return items[dayIndex() % items.length];
}

function resolveChallengePool(ids: string[]): Challenge[] {
  return ids
    .map((challengeId) => challengeById[challengeId])
    .filter((challenge): challenge is Challenge => Boolean(challenge));
}

function challengeAccuracy(record: TrainerChallengeStat | undefined): number {
  if (!record || record.seen === 0) {
    return 0;
  }
  return record.correct / record.seen;
}

function parseIsoTime(value: string | undefined): number {
  if (!value) {
    return 0;
  }
  const parsed = new Date(value).getTime();
  return Number.isFinite(parsed) ? parsed : 0;
}

function buildCompletionRecord(
  challenge: Challenge,
  attempt: number,
  hintUsed: boolean,
  score: ScoreResult,
): CompletedChallenge {
  return {
    challengeId: challenge.id,
    zoneId: challenge.zoneId,
    mechanic: challenge.mechanic,
    attempts: attempt,
    isCorrect: score.isCorrect,
    hintUsed,
    awardedLp: score.awardedLp,
    answeredAt: new Date().toISOString(),
  };
}

function cloneProgress(progress: PlayerProgress): PlayerProgress {
  const challengeStats = Object.entries(progress.trainerStats.challengeStats).reduce(
    (accumulator, [challengeId, stat]) => {
      accumulator[challengeId] = { ...stat };
      return accumulator;
    },
    {} as Record<string, TrainerChallengeStat>,
  );

  const memoryByChallenge = Object.entries(progress.trainerStats.memoryByChallenge).reduce(
    (accumulator, [challengeId, stat]) => {
      accumulator[challengeId] = { ...stat };
      return accumulator;
    },
    {} as PlayerProgress['trainerStats']['memoryByChallenge'],
  );

  const caseProgress = Object.entries(progress.caseProgress).reduce((accumulator, [scenarioId, item]) => {
    accumulator[scenarioId] = { ...item };
    return accumulator;
  }, {} as PlayerProgress['caseProgress']);

  return {
    ...progress,
    completedChallenges: { ...progress.completedChallenges },
    accuracyByZone: { ...progress.accuracyByZone },
    badges: { ...progress.badges },
    trainerStats: {
      ...progress.trainerStats,
      byMechanic: {
        term_forge: { ...progress.trainerStats.byMechanic.term_forge },
        sentence_builder: { ...progress.trainerStats.byMechanic.sentence_builder },
        context_choice: { ...progress.trainerStats.byMechanic.context_choice },
        boardroom_boss: { ...progress.trainerStats.byMechanic.boardroom_boss },
        adaptive_recall: { ...progress.trainerStats.byMechanic.adaptive_recall },
        case_ladder: { ...progress.trainerStats.byMechanic.case_ladder },
        liquidity_sprint: { ...progress.trainerStats.byMechanic.liquidity_sprint },
      },
      byDifficulty: {
        easy: { ...progress.trainerStats.byDifficulty.easy },
        medium: { ...progress.trainerStats.byDifficulty.medium },
        hard: { ...progress.trainerStats.byDifficulty.hard },
      },
      challengeStats,
      memoryByChallenge,
      sprintHistory: progress.trainerStats.sprintHistory.map((item) => ({ ...item })),
    },
    caseProgress,
  };
}

function buildClassicTrainerQueue(
  progress: PlayerProgress,
  mechanic: Challenge['mechanic'],
  difficulty: DifficultyLevel,
  size: number,
): string[] {
  const pool = challenges.filter((challenge) => challenge.mechanic === mechanic);
  if (pool.length === 0 || size <= 0) {
    return [];
  }

  const stats = progress.trainerStats.challengeStats;
  const unseen = pool.filter((challenge) => !stats[challenge.id]);
  const seen = pool.filter((challenge) => stats[challenge.id]);

  const weak = [...seen].sort((left, right) => {
    const leftAccuracy = challengeAccuracy(stats[left.id]);
    const rightAccuracy = challengeAccuracy(stats[right.id]);
    if (leftAccuracy !== rightAccuracy) {
      return leftAccuracy - rightAccuracy;
    }
    return (stats[left.id]?.seen ?? 0) - (stats[right.id]?.seen ?? 0);
  });

  const stale = [...seen].sort(
    (left, right) =>
      parseIsoTime(stats[left.id]?.lastPlayedAt) - parseIsoTime(stats[right.id]?.lastPlayedAt),
  );

  const queue: string[] = [];
  const used = new Set<string>();
  const shortCount = () =>
    queue.reduce((count, challengeId) => {
      const challenge = challengeById[challengeId];
      if (challenge && challenge.mechanic !== 'boardroom_boss') {
        return count + 1;
      }
      return count;
    }, 0);

  const pushUnique = (list: Challenge[]) => {
    for (const challenge of list) {
      if (queue.length >= size) {
        return;
      }
      if (used.has(challenge.id)) {
        continue;
      }
      queue.push(challenge.id);
      used.add(challenge.id);
    }
  };

  pushUnique(unseen);
  pushUnique(weak);
  pushUnique(stale);

  if (queue.length < size) {
    const seed = hashSeed(`${mechanic}-${difficulty}-${progress.lastPlayedAt}`);
    const shuffled = seededShuffle(pool, seed);
    let cursor = 0;
    while (queue.length < size) {
      queue.push(shuffled[cursor % shuffled.length].id);
      cursor += 1;
    }
  }

  return queue.slice(0, size);
}

function buildSprintQueue(
  progress: PlayerProgress,
  size: number,
  scenario?: (typeof sprintScenarios)[number] | null,
): string[] {
  if (size <= 0) {
    return [];
  }

  const shortPool = challenges.filter((challenge) => challenge.mechanic !== 'boardroom_boss');
  const bossPool = challenges.filter((challenge) => challenge.mechanic === 'boardroom_boss');
  if (shortPool.length === 0 || bossPool.length === 0) {
    return [];
  }

  const stats = progress.trainerStats.challengeStats;

  const weakShort = shortPool.slice().sort((left, right) => {
    const leftAccuracy = challengeAccuracy(stats[left.id]);
    const rightAccuracy = challengeAccuracy(stats[right.id]);
    if (leftAccuracy !== rightAccuracy) {
      return leftAccuracy - rightAccuracy;
    }
    return parseIsoTime(stats[left.id]?.lastPlayedAt) - parseIsoTime(stats[right.id]?.lastPlayedAt);
  });

  const queue: string[] = [];
  const used = new Set<string>();
  const shortCount = () =>
    queue.reduce((count, challengeId) => {
      const challenge = challengeById[challengeId];
      if (challenge && challenge.mechanic !== 'boardroom_boss') {
        return count + 1;
      }
      return count;
    }, 0);

  if (scenario) {
    const scenarioPool = resolveChallengePool([...scenario.challengeIds]);
    const scenarioShort = scenarioPool.filter((challenge) => challenge.mechanic !== 'boardroom_boss');
    const scenarioBoss = scenarioPool.find((challenge) => challenge.mechanic === 'boardroom_boss');

    const shortFromScenario = Math.min(4, Math.max(0, size - 1));
    for (const challenge of scenarioShort) {
      if (shortCount() >= shortFromScenario) {
        break;
      }
      queue.push(challenge.id);
      used.add(challenge.id);
    }

    if (shortCount() < shortFromScenario) {
      const seed = hashSeed(`sprint-scenario-${scenario.id}-${progress.lastPlayedAt}`);
      const shuffled = seededShuffle(shortPool, seed);
      let cursor = 0;
      while (shortCount() < shortFromScenario) {
        const candidate = shuffled[cursor % shuffled.length];
        if (!used.has(candidate.id)) {
          queue.push(candidate.id);
          used.add(candidate.id);
        }
        cursor += 1;
      }
    }

    if (scenarioBoss) {
      queue.push(scenarioBoss.id);
      used.add(scenarioBoss.id);
    }
  }

  const shortTarget = Math.max(0, size - 1);
  for (const challenge of weakShort) {
    if (shortCount() >= shortTarget) {
      break;
    }
    if (used.has(challenge.id)) {
      continue;
    }
    queue.push(challenge.id);
    used.add(challenge.id);
  }

  if (shortCount() < shortTarget) {
    const seed = hashSeed(`sprint-${progress.lastPlayedAt}`);
    const shuffled = seededShuffle(shortPool, seed);
    let cursor = 0;
    while (shortCount() < shortTarget) {
      const candidate = shuffled[cursor % shuffled.length].id;
      if (!used.has(candidate)) {
        queue.push(candidate);
        used.add(candidate);
      }
      cursor += 1;
    }
  }

  const boss = bossPool
    .slice()
    .sort((left, right) => {
      const leftAccuracy = challengeAccuracy(stats[left.id]);
      const rightAccuracy = challengeAccuracy(stats[right.id]);
      if (leftAccuracy !== rightAccuracy) {
        return leftAccuracy - rightAccuracy;
      }
      return parseIsoTime(stats[left.id]?.lastPlayedAt) - parseIsoTime(stats[right.id]?.lastPlayedAt);
    })[0];

  const hasBoss = queue.some((challengeId) => challengeById[challengeId]?.mechanic === 'boardroom_boss');
  if (!hasBoss) {
    queue.push(boss.id);
  }

  return queue.slice(0, size);
}

export function GameProvider({ children }: PropsWithChildren) {
  const [progress, setProgress] = useState<PlayerProgress>(() => loadInitialProgress());

  const unlockedZones = useMemo(
    () => computeUnlockedZones(zones, progress.completedChallenges, progress.accuracyByZone),
    [progress.completedChallenges, progress.accuracyByZone],
  );

  const getZoneChallenges = useCallback(
    (zoneId: ZoneId) => challenges.filter((challenge) => challenge.zoneId === zoneId),
    [],
  );

  const isChallengeCompleted = useCallback(
    (challengeId: string) => progress.completedChallenges[challengeId] !== undefined,
    [progress.completedChallenges],
  );

  const setCurrentZone = useCallback(
    (zoneId: ZoneId) => {
      if (!unlockedZones.has(zoneId)) {
        return;
      }

      setProgress((previous) => {
        const next = recalculate({
          ...previous,
          currentZone: zoneId,
          lastPlayedAt: new Date().toISOString(),
        });
        persist(next);
        return next;
      });
    },
    [unlockedZones],
  );

  const submitAnswer = useCallback(
    ({ challenge, answer, attempt, hintUsed, markAsFailed }: SubmitAnswerPayload): SubmitAnswerResult => {
      const score = scoreAnswer(answer, challenge, attempt, hintUsed, 'medium', 'campaign');

      let outcome: SubmitAnswerResult = {
        score,
        streakBonus: 0,
        retentionBonus: 0,
        totalAwarded: 0,
        isChallengeLocked: false,
      };

      setProgress((previous) => {
        const draft = cloneProgress(previous);
        const existing = draft.completedChallenges[challenge.id];

        let shouldSaveRecord = score.isCorrect || markAsFailed === true;
        let streak = draft.streak;
        let lpDelta = 0;
        let streakBonus = 0;

        if (existing?.isCorrect) {
          shouldSaveRecord = false;
        }

        if (score.isCorrect) {
          const canAward = !existing || (existing && !existing.isCorrect);
          if (canAward) {
            streak = draft.streak + 1;
            streakBonus = computeStreakBonus(streak);
            lpDelta = score.awardedLp + streakBonus;
          }
        } else if (markAsFailed) {
          streak = 0;
        }

        if (lpDelta > 0) {
          draft.lp += lpDelta;
        }

        draft.streak = score.isCorrect ? streak : markAsFailed ? 0 : draft.streak;

        if (shouldSaveRecord) {
          const newRecord = buildCompletionRecord(challenge, attempt, hintUsed, score);
          if (existing && !existing.isCorrect && score.isCorrect) {
            draft.completedChallenges[challenge.id] = {
              ...newRecord,
              attempts: existing.attempts + attempt,
            };
          } else if (!existing) {
            draft.completedChallenges[challenge.id] = newRecord;
          } else if (existing && !existing.isCorrect && markAsFailed) {
            draft.completedChallenges[challenge.id] = newRecord;
          }
        }

        const recalculated = recalculate({
          ...draft,
          lastPlayedAt: new Date().toISOString(),
        });

        const newlyUnlocked = computeUnlockedZones(
          zones,
          recalculated.completedChallenges,
          recalculated.accuracyByZone,
        );

        if (!newlyUnlocked.has(recalculated.currentZone)) {
          recalculated.currentZone = zones[0].id;
        }

        persist(recalculated);

        outcome = {
          score,
          streakBonus,
          retentionBonus: 0,
          totalAwarded: lpDelta,
          isChallengeLocked:
            recalculated.completedChallenges[challenge.id]?.isCorrect === true ||
            recalculated.completedChallenges[challenge.id]?.isCorrect === false,
        };

        return recalculated;
      });

      return outcome;
    },
    [],
  );

  const buildTrainerQueue = useCallback(
    (mechanic: GameMechanic, difficulty: DifficultyLevel, size: number): string[] => {
      if (mechanic === 'adaptive_recall') {
        const deck = rotateByDay(adaptiveRecallDecks);
        const deckPool = deck ? resolveChallengePool(deck.challengeIds) : [];
        const pool = deckPool.length > 0 ? deckPool : challenges;
        return buildAdaptiveRecallQueue(progress, pool, size);
      }

      if (mechanic === 'liquidity_sprint') {
        const scenario = rotateByDay(sprintScenarios);
        return buildSprintQueue(progress, size, scenario);
      }

      if (mechanic === 'case_ladder') {
        return [];
      }

      return buildClassicTrainerQueue(progress, mechanic, difficulty, size);
    },
    [progress],
  );

  const startAdaptiveRecallSession = useCallback(
    (size = ADAPTIVE_RECALL_SESSION_SIZE): AdaptiveRecallSession => {
      const deck = rotateByDay(adaptiveRecallDecks);
      const deckPool = deck ? resolveChallengePool(deck.challengeIds) : [];
      const pool = deckPool.length > 0 ? deckPool : challenges;
      const queue = buildAdaptiveRecallQueue(progress, pool, size);
      const dueChallengeIds = queue.filter((challengeId) =>
        isChallengeDue(progress.trainerStats.memoryByChallenge[challengeId]),
      );
      return {
        queue,
        dueChallengeIds,
        deckId: deck?.id ?? null,
        title: deck?.title ?? 'ARC: Mixed Review',
        brief:
          deck?.brief ??
          'Смешанный адаптивный повтор по всему миру с акцентом на due и слабые места.',
      };
    },
    [progress],
  );

  const startLiquiditySprintSession = useCallback(
    (size = SPRINT_SESSION_SIZE): LiquiditySprintSession => {
      const scenario = rotateByDay(sprintScenarios);
      const queue = buildSprintQueue(progress, size, scenario);

      return {
        queue,
        scenarioId: scenario?.id ?? null,
        title: scenario?.title ?? 'Sprint: Mixed Pressure Test',
        brief:
          scenario?.brief ??
          'Смешанный скоростной сценарий: 7 коротких задач и 1 финальный mini-boss.',
      };
    },
    [progress],
  );

  const submitTrainerAnswer = useCallback(
    ({
      challenge,
      answer,
      attempt,
      hintUsed,
      difficulty,
      markAsFailed,
      mode = 'classic',
      retentionDue = false,
      lpMultiplier = 1,
    }: SubmitTrainerAnswerPayload): SubmitAnswerResult => {
      const score = scoreAnswer(answer, challenge, attempt, hintUsed, difficulty, 'trainer');

      let outcome: SubmitAnswerResult = {
        score,
        streakBonus: 0,
        retentionBonus: 0,
        totalAwarded: 0,
        isChallengeLocked: false,
      };

      setProgress((previous) => {
        const draft = cloneProgress(previous);
        const now = new Date().toISOString();

        let lpDelta = 0;
        let streakBonus = 0;
        let retentionBonus = 0;
        let nextStreak = draft.streak;

        if (score.isCorrect) {
          nextStreak += 1;
          streakBonus = computeStreakBonus(nextStreak);

          const scaledBaseAward = Math.max(0, Math.round(score.awardedLp * lpMultiplier));
          retentionBonus =
            mode === 'adaptive_recall' && retentionDue && attempt === 1 && !hintUsed
              ? RETENTION_BONUS_POINTS
              : 0;

          lpDelta = scaledBaseAward + streakBonus + retentionBonus;
        } else if (markAsFailed) {
          nextStreak = 0;
        }

        if (lpDelta > 0) {
          draft.lp += lpDelta;
        }

        draft.streak = score.isCorrect ? nextStreak : markAsFailed ? 0 : draft.streak;
        draft.lastPlayedAt = now;

        const trainerStats = draft.trainerStats;
        const trackedMechanic: GameMechanic = mode === 'classic' ? challenge.mechanic : mode;

        trainerStats.answersGiven += 1;
        trainerStats.byMechanic[trackedMechanic].answers += 1;
        trainerStats.byDifficulty[difficulty].answers += 1;

        if (score.isCorrect) {
          trainerStats.correctAnswers += 1;
          trainerStats.byMechanic[trackedMechanic].correct += 1;
          trainerStats.byDifficulty[difficulty].correct += 1;
        }

        const challengeStat = trainerStats.challengeStats[challenge.id] ?? {
          seen: 0,
          correct: 0,
          lastPlayedAt: now,
        };
        challengeStat.seen += 1;
        if (score.isCorrect) {
          challengeStat.correct += 1;
        }
        challengeStat.lastPlayedAt = now;
        trainerStats.challengeStats[challenge.id] = challengeStat;

        trainerStats.memoryByChallenge[challenge.id] = updateMemoryStat(
          trainerStats.memoryByChallenge[challenge.id],
          {
            isCorrect: score.isCorrect,
            attempt,
            hintUsed,
          },
          now,
        );

        const recalculated = recalculate(draft);
        persist(recalculated);

        outcome = {
          score,
          streakBonus,
          retentionBonus,
          totalAwarded: lpDelta,
          isChallengeLocked: score.isCorrect || markAsFailed === true,
        };

        return recalculated;
      });

      return outcome;
    },
    [],
  );

  const startCaseScenario = useCallback((scenarioId: string): CaseScenario | null => {
    return caseScenarioById[scenarioId] ?? null;
  }, []);

  const recordCaseScenarioResult = useCallback((payload: RecordCaseScenarioPayload) => {
    setProgress((previous) => {
      const draft = cloneProgress(previous);
      const now = new Date().toISOString();

      const existing = draft.caseProgress[payload.scenarioId] ?? {
        scenarioId: payload.scenarioId,
        plays: 0,
        completions: 0,
        bestLp: 0,
        bestAccuracy: 0,
        lastPlayedAt: now,
        lastCompletedAt: null,
      };

      existing.plays += 1;
      existing.bestLp = Math.max(existing.bestLp, payload.awardedLp);
      existing.bestAccuracy = Math.max(existing.bestAccuracy, payload.accuracy);
      existing.lastPlayedAt = now;

      if (payload.completed) {
        existing.completions += 1;
        existing.lastCompletedAt = now;
      }

      draft.caseProgress[payload.scenarioId] = existing;
      draft.lastPlayedAt = now;

      const recalculated = recalculate(draft);
      persist(recalculated);
      return recalculated;
    });
  }, []);

  const recordSprintResult = useCallback((payload: RecordSprintResultPayload): SprintResult => {
    let recorded: SprintResult = {
      playedAt: payload.playedAt ?? new Date().toISOString(),
      score: payload.score,
      accuracy: payload.accuracy,
      durationSec: payload.durationSec,
      rank: 1,
    };

    setProgress((previous) => {
      const draft = cloneProgress(previous);
      const playedAt = payload.playedAt ?? new Date().toISOString();
      const cutoff = Date.now() - 14 * 24 * 60 * 60 * 1000;

      const filtered = draft.trainerStats.sprintHistory.filter((entry) => {
        const time = new Date(entry.playedAt).getTime();
        return Number.isFinite(time) && time >= cutoff;
      });

      const newEntry: SprintResult = {
        playedAt,
        score: Math.max(0, Math.round(payload.score)),
        accuracy: Math.max(0, Math.min(100, Math.round(payload.accuracy))),
        durationSec: Math.max(0, Math.round(payload.durationSec)),
        rank: 0,
      };

      filtered.push(newEntry);

      const ranked = filtered.sort((left, right) => {
        if (left.score !== right.score) {
          return right.score - left.score;
        }
        return right.playedAt.localeCompare(left.playedAt);
      });

      const rank = ranked.findIndex((entry) => entry === newEntry) + 1;
      recorded = {
        ...newEntry,
        rank: Math.max(1, rank),
      };

      draft.trainerStats.sprintHistory = ranked
        .slice(0, 7)
        .map((entry, index) => ({ ...entry, rank: index + 1 }));

      draft.lastPlayedAt = playedAt;

      const recalculated = recalculate(draft);
      persist(recalculated);
      return recalculated;
    });

    return recorded;
  }, []);

  const recordTrainerSessionResult = useCallback(() => {
    setProgress((previous) => {
      const draft = cloneProgress(previous);
      draft.trainerStats.sessionsPlayed += 1;
      draft.lastPlayedAt = new Date().toISOString();
      const recalculated = recalculate(draft);
      persist(recalculated);
      return recalculated;
    });
  }, []);

  const resetProgress = useCallback(() => {
    storageApi.resetProgress();
    const initial = buildInitialProgress(zones[0].id);
    const next = recalculate(initial);
    persist(next);
    setProgress(next);
  }, []);

  const value: GameContextValue = {
    zones,
    challenges,
    progress,
    unlockedZones,
    submitAnswer,
    submitTrainerAnswer,
    buildTrainerQueue,
    startAdaptiveRecallSession,
    startLiquiditySprintSession,
    startCaseScenario,
    recordSprintResult,
    recordCaseScenarioResult,
    recordTrainerSessionResult,
    setCurrentZone,
    resetProgress,
    getZoneChallenges,
    isChallengeCompleted,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame(): GameContextValue {
  const value = useContext(GameContext);
  if (!value) {
    throw new Error('useGame must be used inside GameProvider');
  }
  return value;
}

export function useChallenge(challengeId: string): Challenge {
  const challenge = challengeById[challengeId];
  if (!challenge) {
    throw new Error(`Challenge ${challengeId} not found`);
  }
  return challenge;
}
