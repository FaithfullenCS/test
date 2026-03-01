import { PlayableWorldId, WorldDataset } from '../types/game';
import { worldCatalog } from './worlds';
import {
  cashFlowNigeriaDataset,
  cashFlowNigeriaMigrationMap,
} from './worlds/cash-flow-nigeria';
import {
  cashFlowStatementDataset,
  cashFlowStatementMigrationMap,
} from './worlds/cash-flow-statement-performance';
import { ProgressMigrationMap } from '../lib/storage';

const playableWorldIds = ['cash-flow-nigeria', 'cash-flow-statement-performance'] as const;

const worldDatasetsById: Record<PlayableWorldId, WorldDataset> = {
  'cash-flow-nigeria': cashFlowNigeriaDataset,
  'cash-flow-statement-performance': cashFlowStatementDataset,
};

const worldMigrationMapById: Record<PlayableWorldId, ProgressMigrationMap> = {
  'cash-flow-nigeria': cashFlowNigeriaMigrationMap,
  'cash-flow-statement-performance': cashFlowStatementMigrationMap,
};

export function isPlayableWorldId(value: unknown): value is PlayableWorldId {
  return (
    typeof value === 'string' &&
    playableWorldIds.includes(value as (typeof playableWorldIds)[number])
  );
}

export function getAllPlayableWorldIds(): PlayableWorldId[] {
  return [...playableWorldIds];
}

export function getWorldDataset(worldId: PlayableWorldId): WorldDataset {
  return worldDatasetsById[worldId];
}

export function getWorldMigrationMap(worldId: PlayableWorldId): ProgressMigrationMap {
  return worldMigrationMapById[worldId];
}

export { worldCatalog };
export const learningWorlds = worldCatalog;
