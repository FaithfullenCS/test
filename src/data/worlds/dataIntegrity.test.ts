import { describe, expect, it } from 'vitest';
import { getAllPlayableWorldIds, getWorldDataset } from '..';

describe('world datasets integrity', () => {
  it('keeps expected counts and valid references in each world', () => {
    getAllPlayableWorldIds().forEach((worldId) => {
      const dataset = getWorldDataset(worldId);
      const zoneIds = new Set(dataset.zones.map((zone) => zone.id));

      expect(dataset.zones).toHaveLength(5);
      expect(dataset.challenges).toHaveLength(120);
      expect(dataset.caseScenarios).toHaveLength(20);
      expect(dataset.adaptiveRecallDecks).toHaveLength(10);
      expect(dataset.sprintScenarios).toHaveLength(10);

      dataset.zones.forEach((zone) => {
        expect(zone.worldId).toBe(worldId);
      });

      dataset.challenges.forEach((challenge) => {
        expect(challenge.worldId).toBe(worldId);
        expect(zoneIds.has(challenge.zoneId)).toBe(true);
        expect(dataset.challengeById[challenge.id]).toBeDefined();
      });

      dataset.caseScenarios.forEach((scenario) => {
        expect(scenario.worldId).toBe(worldId);
        expect(zoneIds.has(scenario.zoneId)).toBe(true);
        scenario.steps.forEach((challengeId) => {
          expect(dataset.challengeById[challengeId]).toBeDefined();
        });
      });

      dataset.adaptiveRecallDecks.forEach((deck) => {
        expect(deck.worldId).toBe(worldId);
        expect(zoneIds.has(deck.zoneId)).toBe(true);
        deck.challengeIds.forEach((challengeId) => {
          expect(dataset.challengeById[challengeId]).toBeDefined();
        });
      });

      dataset.sprintScenarios.forEach((scenario) => {
        expect(scenario.worldId).toBe(worldId);
        expect(zoneIds.has(scenario.zoneId)).toBe(true);
        scenario.challengeIds.forEach((challengeId) => {
          expect(dataset.challengeById[challengeId]).toBeDefined();
        });
      });
    });
  });

  it('keeps zone ids unique across all playable worlds', () => {
    const globalZoneIds = new Set<string>();

    getAllPlayableWorldIds().forEach((worldId) => {
      const dataset = getWorldDataset(worldId);
      dataset.zones.forEach((zone) => {
        expect(globalZoneIds.has(zone.id)).toBe(false);
        globalZoneIds.add(zone.id);
      });
    });

    expect(globalZoneIds.size).toBe(10);
  });
});
