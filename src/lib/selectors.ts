import {
  Challenge,
  ChallengeMechanic,
  CompletedChallenge,
  PlayerProgress,
  SprintResult,
  ZoneBadge,
  ZoneConfig,
  ZoneId,
} from '../types/game';

export function completedCount(progress: PlayerProgress): number {
  return Object.keys(progress.completedChallenges).length;
}

export function correctCount(progress: PlayerProgress): number {
  return Object.values(progress.completedChallenges).filter((entry) => entry.isCorrect).length;
}

export function overallAccuracy(progress: PlayerProgress, totalChallenges: number): number {
  if (totalChallenges === 0) {
    return 0;
  }
  return Math.round((correctCount(progress) / totalChallenges) * 100);
}

export function zoneCompletionCount(
  progress: PlayerProgress,
  zoneId: ZoneId,
  challengeIds: string[],
): number {
  return challengeIds.filter((challengeId) => {
    const completed = progress.completedChallenges[challengeId];
    return completed?.zoneId === zoneId;
  }).length;
}

export function isCampaignComplete(progress: PlayerProgress, zones: ZoneConfig[]): boolean {
  return zones.every((zone) => zone.challengeIds.every((challengeId) => progress.completedChallenges[challengeId]));
}

export function nextUncompletedChallengeId(
  progress: PlayerProgress,
  zones: ZoneConfig[],
  zoneId: ZoneId,
): string | null {
  const zone = zones.find((item) => item.id === zoneId);
  if (!zone) {
    return null;
  }

  for (const challengeId of zone.challengeIds) {
    if (!progress.completedChallenges[challengeId]) {
      return challengeId;
    }
  }

  return null;
}

export function nextPlayableChallengeId(
  progress: PlayerProgress,
  zones: ZoneConfig[],
  zoneId: ZoneId,
): string | null {
  const zone = zones.find((item) => item.id === zoneId);
  if (!zone) {
    return null;
  }

  for (const challengeId of zone.challengeIds) {
    const completed = progress.completedChallenges[challengeId];
    if (!completed || !completed.isCorrect) {
      return challengeId;
    }
  }

  return null;
}

export function nextChallengeInZone(
  progress: PlayerProgress,
  zones: ZoneConfig[],
  zoneId: ZoneId,
  currentChallengeId: string,
): string | null {
  const zone = zones.find((item) => item.id === zoneId);
  if (!zone) {
    return null;
  }

  const index = zone.challengeIds.indexOf(currentChallengeId);
  if (index < 0) {
    return null;
  }

  for (let cursor = index + 1; cursor < zone.challengeIds.length; cursor += 1) {
    const candidate = zone.challengeIds[cursor];
    if (!progress.completedChallenges[candidate] || !progress.completedChallenges[candidate].isCorrect) {
      return candidate;
    }
  }

  const firstPlayable = zone.challengeIds.find((candidate) => {
    const completed = progress.completedChallenges[candidate];
    return !completed || !completed.isCorrect;
  });
  return firstPlayable ?? null;
}

export function completedByMechanic(progress: PlayerProgress): Record<ChallengeMechanic, number> {
  const baseline: Record<ChallengeMechanic, number> = {
    term_forge: 0,
    sentence_builder: 0,
    context_choice: 0,
    boardroom_boss: 0,
  };

  Object.values(progress.completedChallenges).forEach((completed) => {
    baseline[completed.mechanic] += 1;
  });

  return baseline;
}

export function collectTopTermKeywords(
  progress: PlayerProgress,
  challengeById: Record<string, Challenge>,
  limit = 8,
): string[] {
  const termRecords = Object.values(progress.completedChallenges)
    .filter((record) => record.mechanic === 'term_forge' && record.isCorrect)
    .slice(0, limit * 2);

  const keywords: string[] = [];

  termRecords.forEach((record) => {
    const challenge: Challenge | undefined = challengeById[record.challengeId];
    if (!challenge) {
      return;
    }

    challenge.keywords.forEach((keyword) => {
      if (keywords.length < limit && !keywords.includes(keyword)) {
        keywords.push(keyword);
      }
    });
  });

  return keywords.slice(0, limit);
}

export function badgeLabel(badge: ZoneBadge): string {
  switch (badge) {
    case 'gold':
      return 'Gold';
    case 'silver':
      return 'Silver';
    case 'bronze':
      return 'Bronze';
    default:
      return 'No badge';
  }
}

export function latestCompletions(progress: PlayerProgress, limit = 10): CompletedChallenge[] {
  return Object.values(progress.completedChallenges)
    .sort((left, right) => right.answeredAt.localeCompare(left.answeredAt))
    .slice(0, limit);
}

export function trainerAccuracy(progress: PlayerProgress): number {
  if (progress.trainerStats.answersGiven === 0) {
    return 0;
  }
  return Math.round((progress.trainerStats.correctAnswers / progress.trainerStats.answersGiven) * 100);
}

export function trainerAccuracyByDifficulty(progress: PlayerProgress): Record<'easy' | 'medium' | 'hard', number> {
  const byDifficulty = progress.trainerStats.byDifficulty;
  return {
    easy: byDifficulty.easy.answers > 0 ? Math.round((byDifficulty.easy.correct / byDifficulty.easy.answers) * 100) : 0,
    medium:
      byDifficulty.medium.answers > 0
        ? Math.round((byDifficulty.medium.correct / byDifficulty.medium.answers) * 100)
        : 0,
    hard: byDifficulty.hard.answers > 0 ? Math.round((byDifficulty.hard.correct / byDifficulty.hard.answers) * 100) : 0,
  };
}

export function topSprintResults(progress: PlayerProgress, limit = 7): SprintResult[] {
  return progress.trainerStats.sprintHistory
    .slice()
    .sort((left, right) => {
      if (left.score !== right.score) {
        return right.score - left.score;
      }
      return right.playedAt.localeCompare(left.playedAt);
    })
    .slice(0, limit)
    .map((result, index) => ({
      ...result,
      rank: index + 1,
    }));
}

export function recentSprintResults(progress: PlayerProgress, withinDays = 14): SprintResult[] {
  const cutoff = Date.now() - withinDays * 24 * 60 * 60 * 1000;
  return progress.trainerStats.sprintHistory.filter((result) => {
    const playedAt = new Date(result.playedAt).getTime();
    return Number.isFinite(playedAt) && playedAt >= cutoff;
  });
}
