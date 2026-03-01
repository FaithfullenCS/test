import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from './components/AppShell';
import { ChallengePage } from './pages/ChallengePage';
import { CasePage } from './pages/CasePage';
import { HomePage } from './pages/HomePage';
import { ProfilePage } from './pages/ProfilePage';
import { ResultsPage } from './pages/ResultsPage';
import { TrainerPage } from './pages/TrainerPage';
import { WorldMapPage } from './pages/WorldMapPage';
import { ZoneIntroPage } from './pages/ZoneIntroPage';
import { GameProvider } from './state/GameContext';

export default function App() {
  return (
    <GameProvider>
      <BrowserRouter>
        <AppShell>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/world" element={<WorldMapPage />} />
            <Route path="/trainer" element={<TrainerPage />} />
            <Route path="/trainer/:mechanic/:difficulty" element={<ChallengePage />} />
            <Route path="/case/:zoneId/:scenarioId" element={<CasePage />} />
            <Route path="/zone/:zoneId" element={<ZoneIntroPage />} />
            <Route path="/zone/:zoneId/challenge/:challengeId" element={<ChallengePage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppShell>
      </BrowserRouter>
    </GameProvider>
  );
}
