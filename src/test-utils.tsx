import { PropsWithChildren } from 'react';
import { getWorldDataset, getWorldMigrationMap } from './data';
import { GameProvider } from './state/GameContext';
import { PlayableWorldId } from './types/game';

export const TEST_WORLD_ID: PlayableWorldId = 'cash-flow-nigeria';

interface TestWorldProviderProps extends PropsWithChildren {
  worldId?: PlayableWorldId;
}

export function TestWorldProvider({ children, worldId = TEST_WORLD_ID }: TestWorldProviderProps) {
  const dataset = getWorldDataset(worldId);
  const migrationMap = getWorldMigrationMap(worldId);

  return (
    <GameProvider dataset={dataset} worldId={worldId} migrationMap={migrationMap}>
      {children}
    </GameProvider>
  );
}
