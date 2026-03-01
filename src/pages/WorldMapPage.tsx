import { CSSProperties, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { WorldMapCard, WorldMapLayout } from '../components/WorldMapCard';
import { badgeLabel, zoneCompletionCount } from '../lib/selectors';
import { useGame } from '../state/GameContext';
import { ZoneConfig, ZoneId } from '../types/game';

function resolveDefaultSelectedZoneId(
  zones: ZoneConfig[],
  unlockedZones: Set<ZoneId>,
  currentZone: ZoneId,
): ZoneId {
  if (unlockedZones.has(currentZone)) {
    return currentZone;
  }

  const firstUnlocked = zones.find((zone) => unlockedZones.has(zone.id));
  return firstUnlocked?.id ?? zones[0].id;
}

export function WorldMapPage() {
  const { worldId, mapTheme, zones, unlockedZones, progress, setCurrentZone } = useGame();
  const defaultSelectedZoneId = useMemo(
    () => resolveDefaultSelectedZoneId(zones, unlockedZones, progress.currentZone),
    [zones, unlockedZones, progress.currentZone],
  );
  const [selectedZoneId, setSelectedZoneId] = useState<ZoneId>(() => defaultSelectedZoneId);

  useEffect(() => {
    if (!zones.some((zone) => zone.id === selectedZoneId)) {
      setSelectedZoneId(defaultSelectedZoneId);
    }
  }, [zones, selectedZoneId, defaultSelectedZoneId]);

  const selectedZone = zones.find((zone) => zone.id === selectedZoneId) ?? zones[0];
  const selectedLayout = mapTheme.layoutByZoneId[selectedZone.id] as WorldMapLayout | undefined;
  const selectedUnlocked = unlockedZones.has(selectedZone.id);
  const completion = zoneCompletionCount(progress, selectedZone.id, selectedZone.challengeIds);
  const accuracy = progress.accuracyByZone[selectedZone.id] ?? 0;
  const badge = progress.badges[selectedZone.id] ?? 'none';

  return (
    <section className="panel world-map-panel">
      <header className="panel-header">
        <h2>{mapTheme.title}</h2>
        <p>{mapTheme.subtitle}</p>
      </header>

      <div className="world-map-layout">
        <div className="world-map-scroll">
          <div className="world-map-canvas" role="list" aria-label="Маршрут финансовой экспедиции">
            <div className="world-water-layer" aria-hidden="true" />

            <svg
              className="world-map-environment-layer"
              viewBox="0 0 1000 620"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path className="env-landmass env-landmass-west" d={mapTheme.environment.landmasses[0]} />
              <path className="env-landmass env-landmass-center" d={mapTheme.environment.landmasses[1]} />
              <path className="env-landmass env-landmass-east" d={mapTheme.environment.landmasses[2]} />
              <path className="env-river" d={mapTheme.environment.river} />

              <g className="env-forest-cluster">
                <circle cx="208" cy="418" r="16" />
                <circle cx="229" cy="407" r="13" />
                <circle cx="246" cy="422" r="14" />
                <circle cx="221" cy="435" r="12" />
                <circle cx="656" cy="352" r="16" />
                <circle cx="677" cy="339" r="13" />
                <circle cx="698" cy="354" r="14" />
                <circle cx="680" cy="368" r="12" />
              </g>

              <g className="env-mountain-cluster">
                <path d="M735 208 L758 164 L781 208 Z" />
                <path d="M764 214 L788 168 L812 214 Z" />
                <path d="M794 221 L818 179 L842 221 Z" />
              </g>

              <g className="env-harbor-piers">
                <rect x="66" y="478" width="44" height="6" rx="2" />
                <rect x="74" y="486" width="34" height="6" rx="2" />
                <rect x="82" y="494" width="26" height="6" rx="2" />
              </g>

              <path className="env-coastline" d={mapTheme.environment.coastline} />
            </svg>

            <svg
              className="world-map-route-layer"
              viewBox="0 0 1000 620"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path className="route-shadow" d={mapTheme.environment.routeShadow} />
              <path className="route-main" d={mapTheme.environment.routeMain} />
              <path className="route-highlight" d={mapTheme.environment.routeHighlight} />
            </svg>

            {zones.map((zone) => {
              const layout = mapTheme.layoutByZoneId[zone.id] as WorldMapLayout | undefined;
              if (!layout) {
                return null;
              }

              return (
                <WorldMapCard
                  key={zone.id}
                  zone={zone}
                  unlocked={unlockedZones.has(zone.id)}
                  layout={layout}
                  badge={progress.badges[zone.id] ?? 'none'}
                  isActive={selectedZone.id === zone.id}
                  onSelect={setSelectedZoneId}
                />
              );
            })}
          </div>
        </div>

        <article
          className={`world-map-details card-elevated ${selectedUnlocked ? '' : 'world-map-details-locked'}`}
          data-testid="world-map-details"
          style={{ '--zone-accent': selectedZone.palette.accent } as CSSProperties}
        >
          <header>
            <p className="zone-order">
              Зона {selectedZone.order}
              {selectedLayout ? ` · ${selectedLayout.landmark}` : ''}
            </p>
            <h3>{selectedZone.title}</h3>
            <p className="zone-subtitle">{selectedZone.subtitle}</p>
          </header>

          <p className="zone-description">{selectedZone.description}</p>

          <div className="world-map-meta">
            <span>
              Пройдено: {completion}/{selectedZone.challengeIds.length}
            </span>
            <span>Точность: {accuracy}%</span>
            <span>Медаль: {badgeLabel(badge)}</span>
          </div>

          <div className="world-map-details-actions">
            {selectedUnlocked ? (
              <Link
                to={`/world/${worldId}/zone/${selectedZone.id}`}
                className="primary-button"
                onClick={() => setCurrentZone(selectedZone.id)}
              >
                Войти в зону
              </Link>
            ) : (
              <p className="lock-note">Заблокировано: завершите предыдущую зону с точностью от 70%.</p>
            )}
          </div>
        </article>
      </div>
    </section>
  );
}
