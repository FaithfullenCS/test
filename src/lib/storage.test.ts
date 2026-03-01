import { describe, expect, it, beforeEach } from 'vitest';
import { storageApi, storageKey } from './storage';

describe('storageApi', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('returns default progress when storage is corrupted', () => {
    window.localStorage.setItem(storageKey(), '{broken-json');

    const progress = storageApi.loadProgress();

    expect(progress.lp).toBe(0);
    expect(progress.currentZone).toBe('gate_of_flow');
    expect(progress.version).toBe(3);
    expect(progress.trainerStats.sessionsPlayed).toBe(0);
    expect(progress.trainerStats.memoryByChallenge).toEqual({});
    expect(progress.caseProgress).toEqual({});
  });

  it('migrates old versions to current version', () => {
    const legacy = {
      version: 0,
      lp: 44,
      currentZone: 'finance_harbor',
      completedChallenges: {},
      accuracyByZone: {
        gate_of_flow: 0,
        operations_quarter: 0,
        finance_harbor: 0,
        investment_factory: 0,
        council_hall: 0,
      },
      badges: {
        gate_of_flow: 'none',
        operations_quarter: 'none',
        finance_harbor: 'none',
        investment_factory: 'none',
        council_hall: 'none',
      },
      streak: 0,
      lastPlayedAt: new Date().toISOString(),
    };

    const migrated = storageApi.migrateProgress(legacy);

    expect(migrated.version).toBe(3);
    expect(migrated.lp).toBe(44);
    expect(migrated.currentZone).toBe('finance_harbor');
    expect(migrated.trainerStats.answersGiven).toBe(0);
    expect(migrated.caseProgress).toEqual({});
  });
});
