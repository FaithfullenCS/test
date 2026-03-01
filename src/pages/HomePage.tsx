import { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { activeLearningWorldId, learningWorlds, totalChallengeCount } from '../data';
import { completedCount, overallAccuracy } from '../lib/selectors';
import { useGame } from '../state/GameContext';
import { LearningWorldConfig } from '../types/game';

function worldAvailabilityLabel(world: LearningWorldConfig): string {
  return world.availability === 'available' ? 'Доступен сейчас' : 'Скоро';
}

export function HomePage() {
  const { progress } = useGame();
  const completion = completedCount(progress);
  const accuracy = overallAccuracy(progress, totalChallengeCount);
  const activeWorld = learningWorlds.find((world) => world.id === activeLearningWorldId);
  const activeWorldRoute = activeWorld?.route ?? '/world';

  return (
    <section className="panel worlds-home-panel">
      <header className="hero-copy">
        <p className="hero-tag">Локальная одиночная кампания EN → RU</p>
        <h2>Каталог учебных миров для перевода и терминологии</h2>
        <p>
          Главный экран построен как витрина миров: активный мир можно проходить уже сейчас, а
          новые подключаются добавлением одной записи в `src/data/worlds.ts`.
        </p>
        <div className="hero-actions">
          <Link to={activeWorldRoute} className="primary-button">
            Начать кампанию
          </Link>
          <Link to="/trainer" className="secondary-button">
            Открыть тренажёр
          </Link>
          <Link to="/results" className="secondary-button">
            Смотреть сертификат
          </Link>
        </div>
      </header>

      <div className="worlds-grid" role="list" aria-label="Список учебных миров">
        {learningWorlds.map((world) => {
          const isAvailable = world.availability === 'available';
          const isActive = world.id === activeLearningWorldId;

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

              {isActive && (
                <div className="world-progress">
                  <span>
                    Прогресс: {completion}/{world.challengeCount}
                  </span>
                  <span>Точность: {accuracy}%</span>
                </div>
              )}

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

      <div className="worlds-note card-elevated">
        <p>
          Для добавления нового мира укажи название, описание, цвета, маршрут и статус в
          `src/data/worlds.ts`. Карточка появится на главной автоматически.
        </p>
      </div>
    </section>
  );
}
