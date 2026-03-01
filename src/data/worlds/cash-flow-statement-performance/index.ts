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

const WORLD_ID = 'cash-flow-statement-performance' as const;

const world = worldCatalog.find((item) => item.id === WORLD_ID);

if (!world) {
  throw new Error(`World metadata not found for ${WORLD_ID}`);
}

export const cashFlowStatementDataset: WorldDataset = {
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

export const cashFlowStatementMigrationMap: ProgressMigrationMap = {
  zoneIdMap: {
    gate_of_flow: 'cfs_abstract_delta',
    operations_quarter: 'cfs_liquidity_corridor',
    finance_harbor: 'cfs_financing_spine',
    investment_factory: 'cfs_investment_atrium',
    council_hall: 'cfs_regulator_forum',
    cfs_abstract_delta: 'cfs_abstract_delta',
    cfs_liquidity_corridor: 'cfs_liquidity_corridor',
    cfs_financing_spine: 'cfs_financing_spine',
    cfs_investment_atrium: 'cfs_investment_atrium',
    cfs_regulator_forum: 'cfs_regulator_forum',
  },
};
