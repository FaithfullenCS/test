export type ZoneId =
  | 'ng_gate_of_flow'
  | 'ng_operations_quarter'
  | 'ng_finance_harbor'
  | 'ng_investment_factory'
  | 'ng_council_hall'
  | 'cfs_abstract_delta'
  | 'cfs_liquidity_corridor'
  | 'cfs_financing_spine'
  | 'cfs_investment_atrium'
  | 'cfs_regulator_forum';

export type PlayableWorldId = 'cash-flow-nigeria' | 'cash-flow-statement-performance';

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

export type DistrictIcon = 'harbor' | 'factory' | 'tower' | 'bank' | 'hall';

export interface WorldMapLayoutConfig {
  x: number;
  y: number;
  landmark: string;
  icon: DistrictIcon;
  elevation: number;
  districtTone: string;
}

export interface WorldMapTheme {
  title: string;
  subtitle: string;
  layoutByZoneId: Partial<Record<ZoneId, WorldMapLayoutConfig>>;
  environment: {
    landmasses: [string, string, string];
    river: string;
    coastline: string;
    routeShadow: string;
    routeMain: string;
    routeHighlight: string;
  };
}

export interface UnlockRule {
  minAccuracy: number;
  requiresZoneCompletion: boolean;
}

export interface ZoneConfig {
  id: ZoneId;
  worldId: PlayableWorldId;
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
  worldId: PlayableWorldId;
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
  worldId: PlayableWorldId;
  zoneId: ZoneId;
  title: string;
  brief: string;
  steps: [string, string, string];
}

export interface AdaptiveRecallDeck {
  id: string;
  worldId: PlayableWorldId;
  zoneId: ZoneId;
  title: string;
  brief: string;
  challengeIds: string[];
}

export interface SprintScenario {
  id: string;
  worldId: PlayableWorldId;
  zoneId: ZoneId;
  title: string;
  brief: string;
  challengeIds: [string, string, string, string, string, string, string, string];
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
  worldId: PlayableWorldId;
  currentZone: ZoneId;
  completedChallenges: Record<string, CompletedChallenge>;
  lp: number;
  accuracyByZone: Partial<Record<ZoneId, number>>;
  badges: Partial<Record<ZoneId, ZoneBadge>>;
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

export interface WorldDataset {
  world: LearningWorldConfig & { id: PlayableWorldId };
  zones: ZoneConfig[];
  zoneOrder: ZoneId[];
  challenges: Challenge[];
  challengeById: Record<string, Challenge>;
  caseScenarios: CaseScenario[];
  caseScenarioById: Record<string, CaseScenario>;
  adaptiveRecallDecks: AdaptiveRecallDeck[];
  adaptiveRecallDeckById: Record<string, AdaptiveRecallDeck>;
  sprintScenarios: SprintScenario[];
  sprintScenarioById: Record<string, SprintScenario>;
  totalChallengeCount: number;
  mapTheme: WorldMapTheme;
}
