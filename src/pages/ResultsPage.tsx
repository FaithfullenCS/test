import { Link } from 'react-router-dom';
import { totalChallengeCount } from '../data';
import {
  badgeLabel,
  collectTopTermKeywords,
  completedCount,
  isCampaignComplete,
  overallAccuracy,
} from '../lib/selectors';
import { useGame } from '../state/GameContext';

export function ResultsPage() {
  const { progress, zones, resetProgress } = useGame();

  const completion = completedCount(progress);
  const accuracy = overallAccuracy(progress, totalChallengeCount);
  const completedCampaign = isCampaignComplete(progress);
  const topTerms = collectTopTermKeywords(progress);

  return (
    <section className="panel">
      <header className="panel-header">
        <h2>Зал итогов и сертификат</h2>
        <p>
          Финальный экран кампании: итоговые LP, точность, медали зон и ключевые термины,
          которые ты закрепил.
        </p>
      </header>

      <article className="certificate-card">
        <p className="certificate-title">Сертификат переводчика Cash Flow Quest RU</p>
        <h3>{completedCampaign ? 'Кампания завершена' : 'Кампания в процессе'}</h3>
        <p>
          Liquidity Points: <strong>{progress.lp}</strong>
        </p>
        <p>
          Прогресс: <strong>{completion}</strong> / {totalChallengeCount}
        </p>
        <p>
          Общая точность: <strong>{accuracy}%</strong>
        </p>
        <p>
          Последняя активность: <strong>{new Date(progress.lastPlayedAt).toLocaleString()}</strong>
        </p>
      </article>

      <div className="zone-grid">
        {zones.map((zone) => (
          <article key={zone.id} className="result-zone-card card-elevated">
            <h4>{zone.title}</h4>
            <p>Точность: {progress.accuracyByZone[zone.id]}%</p>
            <p>Медаль: {badgeLabel(progress.badges[zone.id])}</p>
          </article>
        ))}
      </div>

      <article className="panel subpanel card-elevated">
        <h3>Лучшие освоенные термины</h3>
        {topTerms.length > 0 ? (
          <div className="keywords-row">
            {topTerms.map((term) => (
              <span key={term} className="chip">
                {term}
              </span>
            ))}
          </div>
        ) : (
          <p className="muted">Пока нет корректно завершенных терминологических заданий.</p>
        )}
      </article>

      <div className="result-actions">
        <Link to="/world" className="primary-button">
          Продолжить кампанию
        </Link>
        <button
          type="button"
          className="danger-button"
          onClick={() => {
            if (window.confirm('Сбросить весь прогресс и начать заново?')) {
              resetProgress();
            }
          }}
        >
          Сбросить прогресс
        </button>
      </div>
    </section>
  );
}
