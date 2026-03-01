import { render, screen, waitFor } from '@testing-library/react';
import { useEffect, useState } from 'react';
import { beforeEach, describe, expect, it } from 'vitest';
import { getWorldDataset } from '../data';
import { TEST_WORLD_ID, TestWorldProvider } from '../test-utils';
import { useGame } from './GameContext';

const dataset = getWorldDataset(TEST_WORLD_ID);
const challenges = dataset.challenges;

function QueueProbe() {
  const { buildTrainerQueue, submitTrainerAnswer, progress } = useGame();
  const [firstQueueId, setFirstQueueId] = useState('');
  const target = challenges.find((item) => item.mechanic === 'term_forge');

  useEffect(() => {
    if (!target) {
      return;
    }

    submitTrainerAnswer({
      challenge: target,
      answer: 'неверный ответ',
      attempt: 1,
      hintUsed: false,
      difficulty: 'medium',
      markAsFailed: true,
    });
  }, [submitTrainerAnswer, target]);

  useEffect(() => {
    if (!target || progress.trainerStats.answersGiven === 0) {
      return;
    }

    const queue = buildTrainerQueue('term_forge', 'medium', 12);
    setFirstQueueId(queue[0] ?? '');
  }, [buildTrainerQueue, progress.trainerStats.answersGiven, target]);

  return <p data-testid="first-queue-id">{firstQueueId}</p>;
}

function MemoryProbe() {
  const { submitTrainerAnswer, progress } = useGame();
  const target = challenges.find((item) => item.mechanic === 'context_choice');

  useEffect(() => {
    if (!target) {
      return;
    }

    submitTrainerAnswer({
      challenge: target,
      answer: target.correctAnswer,
      attempt: 1,
      hintUsed: false,
      difficulty: 'medium',
      mode: 'adaptive_recall',
      retentionDue: true,
    });
  }, [submitTrainerAnswer, target]);

  const box = target ? progress.trainerStats.memoryByChallenge[target.id]?.box ?? -1 : -1;
  return <p data-testid="memory-box">{box}</p>;
}

describe('GameContext trainer queue', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('prioritizes unseen challenges before previously seen ones', async () => {
    render(
      <TestWorldProvider>
        <QueueProbe />
      </TestWorldProvider>,
    );

    const seenChallenge = challenges.find((item) => item.mechanic === 'term_forge');
    expect(seenChallenge).toBeDefined();

    await waitFor(() => {
      expect(screen.getByTestId('first-queue-id').textContent).not.toBe('');
    });

    expect(screen.getByTestId('first-queue-id').textContent).not.toBe(seenChallenge?.id);
  });

  it('updates memory boxes after adaptive recall submission', async () => {
    render(
      <TestWorldProvider>
        <MemoryProbe />
      </TestWorldProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('memory-box').textContent).toBe('1');
    });
  });
});
