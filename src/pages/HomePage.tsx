import { CSSProperties, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  getAllPlayableWorldIds,
  getWorldDataset,
  getWorldMigrationMap,
  learningWorlds,
} from '../data';
import { createStorageApi } from '../lib/storage';
import { completedCount, isCampaignComplete } from '../lib/selectors';
import { LearningWorldConfig } from '../types/game';

function worldAvailabilityLabel(world: LearningWorldConfig): string {
  return world.availability === 'available' ? 'Доступен сейчас' : 'Скоро';
}

export function HomePage() {
  const platformStats = useMemo(() => {
    const playableWorldIds = getAllPlayableWorldIds();

    return playableWorldIds.reduce(
      (accumulator, worldId) => {
        const dataset = getWorldDataset(worldId);
        const migrationMap = getWorldMigrationMap(worldId);
        const storageApi = createStorageApi(worldId, dataset.zoneOrder, migrationMap);
        const progress = storageApi.loadProgress();

        accumulator.totalLp += progress.lp;
        accumulator.completedChallenges += completedCount(progress);
        accumulator.completedWorlds += isCampaignComplete(progress, dataset.zones) ? 1 : 0;

        return accumulator;
      },
      {
        worldCount: playableWorldIds.length,
        totalLp: 0,
        completedChallenges: 0,
        completedWorlds: 0,
      },
    );
  }, []);

  return (
    <section className="panel worlds-home-panel">
      <header className="hero-copy">
        <p className="hero-tag">Локальная одиночная кампания EN → RU</p>
        <h2>Каталог учебных миров для перевода и терминологии</h2>
        <p>
          Главная страница показывает только платформенную сводку, а каждая кампания живет отдельно
          внутри своего мира.
        </p>
      </header>

      <div className="trainer-summary-row" aria-label="Платформенная сводка">
        <span className="chip">Полноценных миров: {platformStats.worldCount}</span>
        <span className="chip">Суммарный LP: {platformStats.totalLp}</span>
        <span className="chip">Завершено заданий: {platformStats.completedChallenges}</span>
        <span className="chip">Завершено миров: {platformStats.completedWorlds}</span>
      </div>

      <div className="worlds-grid" role="list" aria-label="Список учебных миров">
        {learningWorlds.map((world) => {
          const isAvailable = world.availability === 'available';

          return (
            <article
              key={world.id}
              role="listitem"
              className={`world-card card-elevated ${isAvailable ? 'is-available' : 'is-coming-soon'}`}
              style={
                {
                  '--world-accent': world.palette.accent,
                  '--world-shadow': world.palette.shadow,
                } as CSSProperties
              }
            >
              <p className="world-state">{worldAvailabilityLabel(world)}</p>
              <h3>{world.title}</h3>
              <p className="world-subtitle">{world.subtitle}</p>
              <p className="world-description">{world.description}</p>

              <div className="world-meta">
                <span>Зон: {world.zoneCount}</span>
                <span>Заданий: {world.challengeCount}</span>
              </div>

              <p className="world-focus">
                Фокус обучения: <strong>{world.focus}</strong>
              </p>

              <div className="world-actions">
                {isAvailable && world.route ? (
                  <Link to={world.route} className="primary-button">
                    Войти в мир
                  </Link>
                ) : (
                  <button type="button" className="ghost-button" disabled>
                    Скоро
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
