import { Link, Navigate, useParams } from 'react-router-dom';
import { mechanicTitle } from '../lib/labels';
import { nextPlayableChallengeId, zoneCompletionCount } from '../lib/selectors';
import { useGame } from '../state/GameContext';
import { ChallengeMechanic } from '../types/game';

export function ZoneIntroPage() {
  const { zoneId } = useParams<{ zoneId: string }>();
  const { worldId, zones, progress, unlockedZones, setCurrentZone, getZoneChallenges } = useGame();

  const zone = zones.find((item) => item.id === zoneId);
  const mapRoute = `/world/${worldId}`;

  if (!zone) {
    return <Navigate to={mapRoute} replace />;
  }

  if (!unlockedZones.has(zone.id)) {
    return (
      <section className="panel">
        <h2>Зона пока закрыта</h2>
        <p>Нужно закончить предыдущую зону с точностью не ниже 70%.</p>
        <Link className="primary-button" to={mapRoute}>
          Вернуться на карту
        </Link>
      </section>
    );
  }

  const zoneChallenges = getZoneChallenges(zone.id);
  const completion = zoneCompletionCount(progress, zone.id, zone.challengeIds);
  const accuracy = progress.accuracyByZone[zone.id] ?? 0;
  const nextChallengeId = nextPlayableChallengeId(progress, zones, zone.id);

  const mechanicStats = zoneChallenges.reduce<Record<ChallengeMechanic, number>>(
    (accumulator, challenge) => {
      accumulator[challenge.mechanic] = (accumulator[challenge.mechanic] ?? 0) + 1;
      return accumulator;
    },
    {
      term_forge: 0,
      sentence_builder: 0,
      context_choice: 0,
      boardroom_boss: 0,
    },
  );

  return (
    <section className="panel">
      <header className="panel-header zone-intro-header">
        <p className="zone-order">Зона {zone.order}</p>
        <h2>{zone.title}</h2>
        <p>{zone.subtitle}</p>
      </header>

      <p className="zone-description-full">{zone.description}</p>

      <div className="zone-meta-wrap">
        <p>
          Пройдено: {completion}/{zone.challengeIds.length}
        </p>
        <p>Точность зоны: {accuracy}%</p>
        <p>Медаль: {progress.badges[zone.id] ?? 'none'}</p>
      </div>

      <div className="mechanics-inline">
        {Object.entries(mechanicStats).map(([mechanic, count]) => (
          <span key={mechanic} className="chip">
            {mechanicTitle(mechanic as ChallengeMechanic)}: {count}
          </span>
        ))}
      </div>

      <div className="zone-actions-row">
        {nextChallengeId ? (
          <Link
            className="primary-button"
            to={`/world/${worldId}/zone/${zone.id}/challenge/${nextChallengeId}`}
            onClick={() => setCurrentZone(zone.id)}
          >
            {completion === 0 ? 'Начать зону' : 'Продолжить зону'}
          </Link>
        ) : (
          <Link className="primary-button" to={mapRoute}>
            Зона завершена, к карте
          </Link>
        )}

        <Link className="secondary-button" to={mapRoute}>
          Назад к карте
        </Link>
      </div>
    </section>
  );
}
