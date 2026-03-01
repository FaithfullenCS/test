import { describe, expect, it } from 'vitest';
import { getWorldDataset } from '../data';
import { BoardroomBossChallenge } from '../types/game';
import {
  applyDifficultyMultiplier,
  applyHintPenalty,
  basePointsForAttempt,
  buildAdaptiveRecallQueue,
  buildInitialProgress,
  computeAccuracyByZone,
  computeSprintScore,
  computeUnlockedZones,
  scoreAnswer,
  updateMemoryStat,
} from './engine';

const dataset = getWorldDataset('cash-flow-nigeria');
const { challenges, zones, zoneOrder } = dataset;

describe('engine', () => {
  it('scores points by attempt', () => {
    expect(basePointsForAttempt(1)).toBe(10);
    expect(basePointsForAttempt(2)).toBe(6);
    expect(basePointsForAttempt(3)).toBe(3);
    expect(basePointsForAttempt(4)).toBe(0);
  });

  it('applies hint penalty without going below zero', () => {
    expect(applyHintPenalty(10, true)).toBe(8);
    expect(applyHintPenalty(1, true)).toBe(0);
    expect(applyHintPenalty(6, false)).toBe(6);
  });

  it('applies difficulty LP multiplier', () => {
    expect(applyDifficultyMultiplier(10, 0.8)).toBe(8);
    expect(applyDifficultyMultiplier(10, 1.3)).toBe(13);
    expect(applyDifficultyMultiplier(3, 0.8)).toBe(2);
  });

  it('scores boardroom by semantic keyword match', () => {
    const challenge = challenges.find((item) => item.mechanic === 'boardroom_boss');
    expect(challenge).toBeDefined();

    if (!challenge || challenge.mechanic !== 'boardroom_boss') {
      return;
    }

    const result = scoreAnswer(
      'Операционной деятельностью компания влияет на прибыль в Нигерии.',
      challenge,
      1,
      false,
      'medium',
      'campaign',
    );

    expect(result.isCorrect).toBe(true);
    expect(result.awardedLp).toBe(10);
  });

  it('changes LP by difficulty with same correct answer', () => {
    const challenge = challenges.find((item) => item.mechanic === 'term_forge');
    expect(challenge).toBeDefined();

    if (!challenge || challenge.mechanic !== 'term_forge') {
      return;
    }

    const easyResult = scoreAnswer(challenge.correctAnswer, challenge, 1, false, 'easy', 'trainer');
    const hardResult = scoreAnswer(challenge.correctAnswer, challenge, 1, false, 'hard', 'trainer');

    expect(easyResult.awardedLp).toBe(8);
    expect(hardResult.awardedLp).toBe(13);
  });

  it('uses different boardroom thresholds for easy/medium/hard', () => {
    const challenge: BoardroomBossChallenge = {
      id: 'test-boss',
      worldId: 'cash-flow-nigeria',
      zoneId: 'ng_gate_of_flow',
      mechanic: 'boardroom_boss',
      promptEn: 'Test boss prompt',
      correctAnswer: 'эталон',
      acceptableAnswers: [],
      requiredKeywords: ['alpha', 'beta', 'gamma', 'delta', 'epsilon'],
      keywordSynonyms: {
        alpha: ['alpha'],
        beta: ['beta'],
        gamma: ['gamma'],
        delta: ['delta'],
        epsilon: ['epsilon'],
      },
      hint: 'hint',
      explanation: 'explanation',
      reward: 10,
      keywords: ['alpha'],
    };

    const threeKeywords = scoreAnswer('alpha beta gamma', challenge, 1, false, 'easy', 'trainer');
    const threeKeywordsMedium = scoreAnswer('alpha beta gamma', challenge, 1, false, 'medium', 'trainer');
    const fourKeywordsMedium = scoreAnswer('alpha beta gamma delta', challenge, 1, false, 'medium', 'trainer');
    const fourKeywordsHard = scoreAnswer('alpha beta gamma delta', challenge, 1, false, 'hard', 'trainer');

    expect(threeKeywords.isCorrect).toBe(true);
    expect(threeKeywordsMedium.isCorrect).toBe(false);
    expect(fourKeywordsMedium.isCorrect).toBe(true);
    expect(fourKeywordsHard.isCorrect).toBe(false);
  });

  it('computes unlock chain based on previous zone completion and accuracy', () => {
    const progress = buildInitialProgress('cash-flow-nigeria', zoneOrder);

    zones[0].challengeIds.forEach((challengeId) => {
      progress.completedChallenges[challengeId] = {
        challengeId,
        zoneId: zones[0].id,
        mechanic: 'term_forge',
        attempts: 1,
        isCorrect: true,
        hintUsed: false,
        awardedLp: 10,
        answeredAt: new Date().toISOString(),
      };
    });

    const accuracyByZone = computeAccuracyByZone(zones, progress.completedChallenges);
    const unlocked = computeUnlockedZones(zones, progress.completedChallenges, accuracyByZone);

    expect(unlocked.has('ng_gate_of_flow')).toBe(true);
    expect(unlocked.has('ng_operations_quarter')).toBe(true);
    expect(unlocked.has('ng_finance_harbor')).toBe(false);
  });

  it('updates Leitner memory stat with promotion and reset rules', () => {
    const promoted = updateMemoryStat(undefined, {
      isCorrect: true,
      attempt: 1,
      hintUsed: false,
    });
    expect(promoted.box).toBe(1);
    expect(promoted.lapses).toBe(0);

    const stalled = updateMemoryStat(promoted, {
      isCorrect: true,
      attempt: 2,
      hintUsed: true,
    });
    expect(stalled.box).toBe(1);
    expect(stalled.lapses).toBe(0);

    const reset = updateMemoryStat(stalled, {
      isCorrect: false,
      attempt: 3,
      hintUsed: false,
    });
    expect(reset.box).toBe(0);
    expect(reset.lapses).toBe(1);
  });

  it('builds adaptive recall queue prioritizing due items', () => {
    const progress = buildInitialProgress('cash-flow-nigeria', zoneOrder);
    const sample = challenges.slice(0, 20);

    sample.forEach((challenge, index) => {
      progress.trainerStats.challengeStats[challenge.id] = {
        seen: 2,
        correct: index % 2,
        lastPlayedAt: new Date(Date.now() - index * 86400000).toISOString(),
      };
      progress.trainerStats.memoryByChallenge[challenge.id] = {
        box: 2,
        dueAt:
          index < 8
            ? new Date(Date.now() - 3600000).toISOString()
            : new Date(Date.now() + 86400000).toISOString(),
        lapses: 0,
        lastReviewedAt: new Date().toISOString(),
      };
    });

    const queue = buildAdaptiveRecallQueue(progress, sample, 12);
    const dueInQueue = queue.slice(0, 8).filter((challengeId) => {
      const memory = progress.trainerStats.memoryByChallenge[challengeId];
      return new Date(memory.dueAt).getTime() <= Date.now();
    });

    expect(queue).toHaveLength(12);
    expect(dueInQueue.length).toBe(8);
  });

  it('computes sprint score as LP + time bonus + streak bonus', () => {
    const score = computeSprintScore({
      awardedLp: 42,
      timeLeftSec: 120,
      streakBonus: 8,
    });

    expect(score).toBe(70);
  });
});
