import { challengeById, challenges, totalChallengeCount } from './challenges';
import { caseScenarioById, caseScenarios } from './cases';
import {
  adaptiveRecallDeckById,
  adaptiveRecallDecks,
  sprintScenarioById,
  sprintScenarios,
} from './mechanicTasks';
import { buildZones, zoneOrder } from './zones';
import { activeLearningWorldId, learningWorlds } from './worlds';

export {
  challenges,
  challengeById,
  totalChallengeCount,
  zoneOrder,
  learningWorlds,
  activeLearningWorldId,
  caseScenarios,
  caseScenarioById,
  adaptiveRecallDecks,
  adaptiveRecallDeckById,
  sprintScenarios,
  sprintScenarioById,
};

export const zones = buildZones(challenges);

export const zoneById = zones.reduce((accumulator, zone) => {
  accumulator[zone.id] = zone;
  return accumulator;
}, {} as Record<string, (typeof zones)[number]>);
