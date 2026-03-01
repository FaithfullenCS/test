export type ZoneId =
  | 'gate_of_flow'
  | 'operations_quarter'
  | 'finance_harbor'
  | 'investment_factory'
  | 'council_hall';

export type ChallengeMechanic =
  | 'term_forge'
  | 'sentence_builder'
  | 'context_choice'
  | 'boardroom_boss';

export type TrainerModeMechanic = 'adaptive_recall' | 'case_ladder' | 'liquidity_sprint';

export type GameMechanic = ChallengeMechanic | TrainerModeMechanic;

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export type PlayMode = 'campaign' | 'trainer';

export type ZoneBadge = 'none' | 'bronze' | 'silver' | 'gold';

export type WorldAvailability = 'available' | 'coming_soon';

export interface LearningWorldConfig {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  focus: string;
  zoneCount: number;
  challengeCount: number;
  availability: WorldAvailability;
  route: string | null;
  palette: {
    accent: string;
    shadow: string;
  };
}

export interface UnlockRule {
  minAccuracy: number;
  requiresZoneCompletion: boolean;
}

export interface ZoneConfig {
  id: ZoneId;
  order: number;
  title: string;
  subtitle: string;
  description: string;
  unlockRule: UnlockRule;
  challengeIds: string[];
  bossChallengeIds: string[];
  palette: {
    accent: string;
    shadow: string;
  };
}

interface BaseChallenge {
  id: string;
  zoneId: ZoneId;
  mechanic: ChallengeMechanic;
  promptEn: string;
  hint: string;
  explanation: string;
  reward: number;
  keywords: string[];
}

export interface TermForgeChallenge extends BaseChallenge {
  mechanic: 'term_forge';
  optionsRu: string[];
  correctAnswer: string;
}

export interface SentenceBuilderChallenge extends BaseChallenge {
  mechanic: 'sentence_builder';
  fragmentsRu: string[];
  correctAnswer: string;
}

export interface ContextChoiceChallenge extends BaseChallenge {
  mechanic: 'context_choice';
  contextEn: string;
  optionsRu: string[];
  correctAnswer: string;
}

export interface BoardroomBossChallenge extends BaseChallenge {
  mechanic: 'boardroom_boss';
  correctAnswer: string;
  acceptableAnswers: string[];
  requiredKeywords: string[];
  keywordSynonyms: Record<string, string[]>;
}

export type Challenge =
  | TermForgeChallenge
  | SentenceBuilderChallenge
  | ContextChoiceChallenge
  | BoardroomBossChallenge;

export interface CaseScenario {
  id: string;
  zoneId: ZoneId;
  title: string;
  brief: string;
  steps: [string, string, string];
}

export interface CaseScenarioProgress {
  scenarioId: string;
  plays: number;
  completions: number;
  bestLp: number;
  bestAccuracy: number;
  lastPlayedAt: string;
  lastCompletedAt: string | null;
}

export interface CompletedChallenge {
  challengeId: string;
  zoneId: ZoneId;
  mechanic: ChallengeMechanic;
  attempts: number;
  isCorrect: boolean;
  hintUsed: boolean;
  awardedLp: number;
  answeredAt: string;
}

export interface DifficultyConfig {
  maxAttempts: number;
  hintPenalty: number;
  lpMultiplier: number;
  hardTimerSeconds: number | null;
  bossKeywordThreshold: number;
}

export interface TrainerChallengeStat {
  seen: number;
  correct: number;
  lastPlayedAt: string;
}

export interface ChallengeMemoryStat {
  box: number;
  dueAt: string;
  lapses: number;
  lastReviewedAt: string;
}

export interface SprintResult {
  playedAt: string;
  score: number;
  accuracy: number;
  durationSec: number;
  rank: number;
}

export interface TrainerStats {
  sessionsPlayed: number;
  answersGiven: number;
  correctAnswers: number;
  byMechanic: Record<GameMechanic, { answers: number; correct: number }>;
  byDifficulty: Record<DifficultyLevel, { answers: number; correct: number }>;
  challengeStats: Record<string, TrainerChallengeStat>;
  memoryByChallenge: Record<string, ChallengeMemoryStat>;
  sprintHistory: SprintResult[];
}

export interface PlayerProgress {
  version: number;
  currentZone: ZoneId;
  completedChallenges: Record<string, CompletedChallenge>;
  lp: number;
  accuracyByZone: Record<ZoneId, number>;
  badges: Record<ZoneId, ZoneBadge>;
  streak: number;
  lastPlayedAt: string;
  trainerStats: TrainerStats;
  caseProgress: Record<string, CaseScenarioProgress>;
}

export interface ScoreResult {
  isCorrect: boolean;
  awardedLp: number;
  penalties: number;
  normalizedInput: string;
  matchedKeywords: string[];
  maxKeywordMatches: number;
  feedback: string;
}

export interface StorageApi {
  loadProgress: () => PlayerProgress;
  saveProgress: (progress: PlayerProgress) => void;
  resetProgress: () => void;
  migrateProgress: (oldVersion: unknown) => PlayerProgress;
}
