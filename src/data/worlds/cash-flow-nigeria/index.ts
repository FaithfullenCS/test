import { WorldDataset } from '../../../types/game';
import { ProgressMigrationMap } from '../../../lib/storage';
import { worldCatalog } from '../../worlds';
import { caseScenarioById, caseScenarios } from './cases';
import { challengeById, challenges, totalChallengeCount } from './challenges';
import {
  adaptiveRecallDeckById,
  adaptiveRecallDecks,
  sprintScenarioById,
  sprintScenarios,
} from './mechanicTasks';
import { mapTheme } from './mapTheme';
import { buildZones, zoneOrder } from './zones';

const WORLD_ID = 'cash-flow-nigeria' as const;

const world = worldCatalog.find((item) => item.id === WORLD_ID);

if (!world) {
  throw new Error(`World metadata not found for ${WORLD_ID}`);
}

export const cashFlowNigeriaDataset: WorldDataset = {
  world: { ...world, id: WORLD_ID },
  zones: buildZones(challenges),
  zoneOrder,
  challenges,
  challengeById,
  caseScenarios,
  caseScenarioById,
  adaptiveRecallDecks,
  adaptiveRecallDeckById,
  sprintScenarios,
  sprintScenarioById,
  totalChallengeCount,
  mapTheme,
};

export const cashFlowNigeriaMigrationMap: ProgressMigrationMap = {
  zoneIdMap: {
    gate_of_flow: 'ng_gate_of_flow',
    operations_quarter: 'ng_operations_quarter',
    finance_harbor: 'ng_finance_harbor',
    investment_factory: 'ng_investment_factory',
    council_hall: 'ng_council_hall',
    ng_gate_of_flow: 'ng_gate_of_flow',
    ng_operations_quarter: 'ng_operations_quarter',
    ng_finance_harbor: 'ng_finance_harbor',
    ng_investment_factory: 'ng_investment_factory',
    ng_council_hall: 'ng_council_hall',
  },
};
