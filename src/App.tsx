import { BrowserRouter, Navigate, Outlet, Route, Routes, useParams } from 'react-router-dom';
import { AppShell } from './components/AppShell';
import { getWorldDataset, getWorldMigrationMap, isPlayableWorldId } from './data';
import { CasePage } from './pages/CasePage';
import { ChallengePage } from './pages/ChallengePage';
import { HomePage } from './pages/HomePage';
import { ProfilePage } from './pages/ProfilePage';
import { ResultsPage } from './pages/ResultsPage';
import { TrainerPage } from './pages/TrainerPage';
import { WorldMapPage } from './pages/WorldMapPage';
import { ZoneIntroPage } from './pages/ZoneIntroPage';
import { GameProvider } from './state/GameContext';

function WorldScopeLayout() {
  const { worldId } = useParams<{ worldId: string }>();

  if (!isPlayableWorldId(worldId)) {
    return <Navigate to="/" replace />;
  }

  const dataset = getWorldDataset(worldId);
  const migrationMap = getWorldMigrationMap(worldId);

  return (
    <GameProvider dataset={dataset} worldId={worldId} migrationMap={migrationMap}>
      <AppShell>
        <Outlet />
      </AppShell>
    </GameProvider>
  );
}

function WorldScopeFallback() {
  const { worldId } = useParams<{ worldId: string }>();
  if (!isPlayableWorldId(worldId)) {
    return <Navigate to="/" replace />;
  }
  return <Navigate to={`/world/${worldId}`} replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route path="/world/:worldId" element={<WorldScopeLayout />}>
          <Route index element={<WorldMapPage />} />
          <Route path="zone/:zoneId" element={<ZoneIntroPage />} />
          <Route path="zone/:zoneId/challenge/:challengeId" element={<ChallengePage />} />
          <Route path="case/:zoneId/:scenarioId" element={<CasePage />} />
          <Route path="trainer" element={<TrainerPage />} />
          <Route path="trainer/:mechanic/:difficulty" element={<ChallengePage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="results" element={<ResultsPage />} />
          <Route path="*" element={<WorldScopeFallback />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
