import { Link } from 'react-router-dom';
import { isChallengeDue } from '../lib/engine';
import { mechanicTitle } from '../lib/labels';
import {
  completedByMechanic,
  completedCount,
  latestCompletions,
  overallAccuracy,
  topSprintResults,
  trainerAccuracy,
  trainerAccuracyByDifficulty,
} from '../lib/selectors';
import { useGame } from '../state/GameContext';
import { ChallengeMechanic } from '../types/game';

export function ProfilePage() {
  const { worldId, progress, challenges, challengeById } = useGame();

  const mechanics = completedByMechanic(progress);
  const recent = latestCompletions(progress, 8);
  const accuracy = overallAccuracy(progress, challenges.length);
  const trainerOverall = trainerAccuracy(progress);
  const trainerByDifficulty = trainerAccuracyByDifficulty(progress);
  const sprintTop = topSprintResults(progress);

  const dueCount = Object.values(progress.trainerStats.memoryByChallenge).filter((memory) => isChallengeDue(memory)).length;

  const caseEntries = Object.values(progress.caseProgress);
  const caseCompletions = caseEntries.reduce((sum, item) => sum + item.completions, 0);

  return (
    <section className="panel">
      <header className="panel-header">
        <h2>Профиль игрока</h2>
        <p>Здесь собрана статистика по механикам, последние задания и динамика твоего перевода.</p>
      </header>

      <div className="profile-grid">
        <article className="subpanel card-elevated">
          <h3>Кампания</h3>
          <p>LP: {progress.lp}</p>
          <p>Серия без ошибок: {progress.streak}</p>
          <p>Завершено заданий: {completedCount(progress)}</p>
          <p>Общая точность: {accuracy}%</p>
        </article>

        <article className="subpanel card-elevated">
          <h3>По игровым механикам</h3>
          <ul className="plain-list">
            {Object.entries(mechanics).map(([mechanic, count]) => (
              <li key={mechanic}>
                {mechanicTitle(mechanic as ChallengeMechanic)}: {count}
              </li>
            ))}
          </ul>
        </article>
      </div>

      <article className="subpanel card-elevated">
        <h3>Тренажёр</h3>
        <p>Сессий сыграно: {progress.trainerStats.sessionsPlayed}</p>
        <p>
          Ответов: {progress.trainerStats.correctAnswers}/{progress.trainerStats.answersGiven}
        </p>
        <p>Точность тренажёра: {trainerOverall}%</p>
        <p>ARC due сейчас: {dueCount}</p>
        <div className="mechanics-inline">
          <span className="chip">Easy: {trainerByDifficulty.easy}%</span>
          <span className="chip">Medium: {trainerByDifficulty.medium}%</span>
          <span className="chip">Hard: {trainerByDifficulty.hard}%</span>
        </div>
      </article>

      <article className="subpanel card-elevated">
        <h3>Case Ladder</h3>
        <p>Сценариев сыграно: {caseEntries.length}</p>
        <p>Завершений кейсов: {caseCompletions}</p>
        {caseEntries.length > 0 && (
          <ul className="plain-list">
            {caseEntries.slice(0, 6).map((entry) => (
              <li key={entry.scenarioId}>
                {entry.scenarioId}: лучший LP {entry.bestLp}, лучший accuracy {entry.bestAccuracy}%
              </li>
            ))}
          </ul>
        )}
      </article>

      <article className="subpanel card-elevated">
        <h3>Топ Liquidity Sprint</h3>
        {sprintTop.length === 0 ? (
          <p className="muted">Спринты пока не запускались.</p>
        ) : (
          <ul className="plain-list">
            {sprintTop.map((result) => (
              <li key={`${result.playedAt}-${result.score}`}>
                #{result.rank}: {result.score} очков · точность {result.accuracy}% · {result.durationSec}с
              </li>
            ))}
          </ul>
        )}
      </article>

      <article className="subpanel card-elevated">
        <h3>Последние завершенные задания</h3>
        {recent.length === 0 ? (
          <p className="muted">Пока нет завершенных заданий.</p>
        ) : (
          <ul className="plain-list">
            {recent.map((record) => {
              const challenge = challengeById[record.challengeId];
              if (!challenge) {
                return null;
              }
              return (
                <li key={record.challengeId}>
                  <strong>{mechanicTitle(record.mechanic)}</strong>: {challenge.promptEn.slice(0, 100)}
                  {challenge.promptEn.length > 100 ? '...' : ''}
                </li>
              );
            })}
          </ul>
        )}
      </article>

      <div className="result-actions">
        <Link to={`/world/${worldId}`} className="primary-button">
          На карту
        </Link>
      </div>
    </section>
  );
}
