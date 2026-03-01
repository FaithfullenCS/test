import { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { completedCount, overallAccuracy } from '../lib/selectors';
import { useGame } from '../state/GameContext';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { worldId, progress, totalChallengeCount } = useGame();
  const completion = completedCount(progress);
  const accuracy = overallAccuracy(progress, totalChallengeCount);
  const basePath = `/world/${worldId}`;

  return (
    <div className="app-root">
      <div className="background-glow" aria-hidden="true" />
      <header className="topbar">
        <div className="brand-block">
          <p className="brand-eyebrow">Cash Flow Quest RU</p>
          <h1>Перевод как экспедиция в мире финансовых потоков</h1>
        </div>

        <div className="status-pills" aria-label="Игровая статистика">
          <span className="pill">LP: {progress.lp}</span>
          <span className="pill">Серия: {progress.streak}</span>
          <span className="pill">
            Прогресс: {completion}/{totalChallengeCount}
          </span>
          <span className="pill">Точность: {accuracy}%</span>
        </div>
      </header>

      <nav className="main-nav" aria-label="Навигация">
        <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} end>
          Главная
        </NavLink>
        <NavLink
          to={basePath}
          className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          end
        >
          Карта
        </NavLink>
        <NavLink
          to={`${basePath}/trainer`}
          className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
        >
          Тренажёр
        </NavLink>
        <NavLink
          to={`${basePath}/profile`}
          className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
        >
          Профиль
        </NavLink>
        <NavLink
          to={`${basePath}/results`}
          className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
        >
          Итоги
        </NavLink>
      </nav>

      <main className="content">{children}</main>
    </div>
  );
}
