import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { adaptiveRecallDecks, caseScenarios, sprintScenarios, zones } from '../data';
import {
  difficultyDescription,
  difficultyTitle,
  mechanicDescription,
  mechanicTitle,
} from '../lib/labels';
import { isChallengeDue } from '../lib/engine';
import { topSprintResults } from '../lib/selectors';
import { useGame } from '../state/GameContext';
import { Challenge, DifficultyLevel, TrainerModeMechanic, ZoneId } from '../types/game';

const classicMechanics: Challenge['mechanic'][] = [
  'term_forge',
  'sentence_builder',
  'context_choice',
  'boardroom_boss',
];

const difficulties: DifficultyLevel[] = ['easy', 'medium', 'hard'];

const mechanicFeatures: Record<Challenge['mechanic'], string> = {
  term_forge: 'Умный режим easy включает 50/50 после первой ошибки.',
  sentence_builder: 'Прогресс сборки и проверка порядка фрагментов помогают учиться быстрее.',
  context_choice: 'Контекстные подсказки и акцент на ключевых словах улучшают точность.',
  boardroom_boss: 'Живой индикатор покрытия ключевых смыслов перед отправкой ответа.',
};

const advancedModes: Array<{
  id: TrainerModeMechanic;
  routeKey: string;
  feature: string;
}> = [
  {
    id: 'adaptive_recall',
    routeKey: 'adaptive-recall',
    feature: '12 задач из due и слабых мест; +2 LP за уверенно закрытый due-вопрос.',
  },
  {
    id: 'liquidity_sprint',
    routeKey: 'sprint',
    feature: '4 минуты, 8 задач, локальный рейтинг лучших результатов за 14 дней.',
  },
];

function zoneTitle(zoneId: ZoneId): string {
  return zones.find((zone) => zone.id === zoneId)?.title ?? zoneId;
}

export function TrainerPage() {
  const [openedCard, setOpenedCard] = useState<string | null>(null);
  const { progress, unlockedZones } = useGame();

  const dueCount = useMemo(
    () =>
      Object.values(progress.trainerStats.memoryByChallenge).filter((memory) =>
        isChallengeDue(memory),
      ).length,
    [progress.trainerStats.memoryByChallenge],
  );

  const sprintTop = topSprintResults(progress, 3);

  const availableCaseScenarios = useMemo(
    () => caseScenarios.filter((scenario) => unlockedZones.has(scenario.zoneId)),
    [unlockedZones],
  );

  const availableArcDecks = useMemo(
    () => adaptiveRecallDecks.filter((deck) => unlockedZones.has(deck.zoneId)),
    [unlockedZones],
  );

  const availableSprintScenarios = useMemo(
    () => sprintScenarios.filter((scenario) => unlockedZones.has(scenario.zoneId)),
    [unlockedZones],
  );

  return (
    <section className="panel trainer-panel">
      <header className="panel-header">
        <h2>Тренажёр механик</h2>
        <p>
          Выбирай точечный режим: классические механики, адаптивный повтор, кейсовую лестницу или
          скоростной спринт.
        </p>
      </header>

      <p className="trainer-save-note">
        Статистика сохраняется локально: ответы, точность, memory-box, кейсы и топ спринтов.
      </p>

      <div className="trainer-summary-row">
        <span className="chip">Сессий: {progress.trainerStats.sessionsPlayed}</span>
        <span className="chip">
          Ответов: {progress.trainerStats.correctAnswers}/{progress.trainerStats.answersGiven}
        </span>
        <span className="chip">ARC due: {dueCount}</span>
        <span className="chip">ARC пакетов: {availableArcDecks.length}</span>
        <span className="chip">Sprint сценариев: {availableSprintScenarios.length}</span>
        <span className="chip">Case сценариев: {availableCaseScenarios.length}</span>
      </div>

      {sprintTop.length > 0 && (
        <article className="subpanel card-elevated">
          <h3>Топ спринтов (14 дней)</h3>
          <ul className="plain-list">
            {sprintTop.map((result) => (
              <li key={`${result.playedAt}-${result.score}`}>
                #{result.rank} · {result.score} очков · точность {result.accuracy}% · {result.durationSec}с
              </li>
            ))}
          </ul>
        </article>
      )}

      <div className="trainer-grid">
        {classicMechanics.map((mechanic) => {
          const cardId = `classic-${mechanic}`;
          const isOpen = openedCard === cardId;

          return (
            <article
              key={mechanic}
              className={`trainer-card ${isOpen ? 'flipped' : ''}`}
              aria-label={`Выбор режима ${mechanicTitle(mechanic)}`}
            >
              <div className="trainer-card-inner">
                <div className="trainer-card-face trainer-card-front">
                  <p className="trainer-card-kicker">Механика</p>
                  <h3>{mechanicTitle(mechanic)}</h3>
                  <p>{mechanicDescription(mechanic)}</p>
                  <p className="trainer-feature">{mechanicFeatures[mechanic]}</p>
                  <button
                    type="button"
                    className="primary-button"
                    onClick={() => setOpenedCard(cardId)}
                  >
                    Выбрать сложность
                  </button>
                </div>

                <div className="trainer-card-face trainer-card-back">
                  <h3>{mechanicTitle(mechanic)}</h3>
                  <div className="trainer-difficulty-grid">
                    {difficulties.map((difficulty) => (
                      <article key={difficulty} className="trainer-difficulty-card">
                        <p className="trainer-difficulty-title">{difficultyTitle(difficulty)}</p>
                        <p>{difficultyDescription(difficulty)}</p>
                        <Link className="secondary-button" to={`/trainer/${mechanic}/${difficulty}`}>
                          Старт 12 задач
                        </Link>
                      </article>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="ghost-button"
                    onClick={() => setOpenedCard(null)}
                  >
                    Назад к обзору
                  </button>
                </div>
              </div>
            </article>
          );
        })}

        {advancedModes.map((mode) => {
          const isOpen = openedCard === mode.id;

          return (
            <article
              key={mode.id}
              className={`trainer-card ${isOpen ? 'flipped' : ''}`}
              aria-label={`Выбор режима ${mechanicTitle(mode.id)}`}
            >
              <div className="trainer-card-inner">
                <div className="trainer-card-face trainer-card-front">
                  <p className="trainer-card-kicker">Новый режим</p>
                  <h3>{mechanicTitle(mode.id)}</h3>
                  <p>{mechanicDescription(mode.id)}</p>
                  <p className="trainer-feature">{mode.feature}</p>
                  <p className="muted">
                    {mode.id === 'adaptive_recall'
                      ? `Тематических ARC-пакетов: ${availableArcDecks.length}`
                      : `Тематических Sprint-сценариев: ${availableSprintScenarios.length}`}
                  </p>
                  <button
                    type="button"
                    className="primary-button"
                    onClick={() => setOpenedCard(mode.id)}
                  >
                    Выбрать сложность
                  </button>
                </div>

                <div className="trainer-card-face trainer-card-back">
                  <h3>{mechanicTitle(mode.id)}</h3>
                  <div className="trainer-difficulty-grid">
                    {difficulties.map((difficulty) => (
                      <article key={difficulty} className="trainer-difficulty-card">
                        <p className="trainer-difficulty-title">{difficultyTitle(difficulty)}</p>
                        <p>{difficultyDescription(difficulty)}</p>
                        <Link className="secondary-button" to={`/trainer/${mode.routeKey}/${difficulty}`}>
                          {mode.id === 'liquidity_sprint' ? 'Старт спринта' : 'Старт ARC'}
                        </Link>
                      </article>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="ghost-button"
                    onClick={() => setOpenedCard(null)}
                  >
                    Назад к обзору
                  </button>
                </div>
              </div>
            </article>
          );
        })}

        <article className="trainer-card" aria-label={`Выбор режима ${mechanicTitle('case_ladder')}`}>
          <div className="trainer-card-inner">
            <div className="trainer-card-face trainer-card-front">
              <p className="trainer-card-kicker">Новый режим</p>
              <h3>{mechanicTitle('case_ladder')}</h3>
              <p>{mechanicDescription('case_ladder')}</p>
              <p className="trainer-feature">
                Бонус цепочки LP по шагам: x1.0 / x1.1 / x1.25, пока без провалов.
              </p>

              {availableCaseScenarios.length === 0 ? (
                <p className="muted">Открой хотя бы одну зону на карте, чтобы запустить кейс.</p>
              ) : (
                <div className="trainer-difficulty-grid">
                  {availableCaseScenarios.map((scenario) => (
                    <article key={scenario.id} className="trainer-difficulty-card">
                      <p className="trainer-difficulty-title">{scenario.title}</p>
                      <p>{zoneTitle(scenario.zoneId)}</p>
                      <Link className="secondary-button" to={`/case/${scenario.zoneId}/${scenario.id}`}>
                        Запустить кейс
                      </Link>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
