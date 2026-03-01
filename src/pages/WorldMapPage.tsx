import { CSSProperties, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { WorldMapCard, WorldMapLayout } from '../components/WorldMapCard';
import { badgeLabel, zoneCompletionCount } from '../lib/selectors';
import { useGame } from '../state/GameContext';
import { ZoneConfig, ZoneId } from '../types/game';

const zoneMapLayout: Record<ZoneId, WorldMapLayout> = {
  gate_of_flow: {
    x: 10,
    y: 76,
    landmark: 'Бухта Истоков',
    icon: 'harbor',
    elevation: 2,
    districtTone: '#6fb1c0',
  },
  operations_quarter: {
    x: 30,
    y: 57,
    landmark: 'Квартал Операций',
    icon: 'factory',
    elevation: 5,
    districtTone: '#75b78f',
  },
  finance_harbor: {
    x: 50,
    y: 34,
    landmark: 'Финансовая Гавань',
    icon: 'bank',
    elevation: 7,
    districtTone: '#7ac2d9',
  },
  investment_factory: {
    x: 72,
    y: 50,
    landmark: 'Инвест-Верфь',
    icon: 'tower',
    elevation: 6,
    districtTone: '#95b4d6',
  },
  council_hall: {
    x: 89,
    y: 23,
    landmark: 'Мыс Совета',
    icon: 'hall',
    elevation: 8,
    districtTone: '#a9b6ce',
  },
};

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
  const { zones, unlockedZones, progress, setCurrentZone } = useGame();
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
  const selectedLayout = zoneMapLayout[selectedZone.id];
  const selectedUnlocked = unlockedZones.has(selectedZone.id);
  const completion = zoneCompletionCount(progress, selectedZone.id, selectedZone.challengeIds);
  const accuracy = progress.accuracyByZone[selectedZone.id] ?? 0;
  const badge = progress.badges[selectedZone.id];

  return (
    <section className="panel world-map-panel">
      <header className="panel-header">
        <h2>Карта мира статьи</h2>
        <p>
          Городская карта финансовых районов: выбирай узел, изучай параметры зоны и продолжай
          маршрут экспедиции.
        </p>
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
              <path
                className="env-landmass env-landmass-west"
                d="M38 388 C111 326 224 326 296 380 C336 410 350 468 315 522 C279 577 190 607 112 583 C38 560 6 474 38 388 Z"
              />
              <path
                className="env-landmass env-landmass-center"
                d="M312 238 C383 178 503 164 590 218 C652 257 681 334 647 399 C608 475 514 513 418 498 C328 483 264 408 270 323 C274 284 287 257 312 238 Z"
              />
              <path
                className="env-landmass env-landmass-east"
                d="M620 134 C704 88 818 104 893 170 C946 217 958 297 918 362 C874 432 781 464 686 443 C596 423 530 356 534 273 C536 210 571 157 620 134 Z"
              />
              <path
                className="env-river"
                d="M0 240 C120 215 220 247 320 232 C430 216 504 144 612 156 C730 170 811 255 1000 218"
              />

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

              <path
                className="env-coastline"
                d="M24 556 C126 534 193 565 268 544 C352 521 411 564 477 546 C560 524 628 562 707 546 C787 530 859 556 964 536"
              />
            </svg>

            <svg
              className="world-map-route-layer"
              viewBox="0 0 1000 620"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                className="route-shadow"
                d="M100 470 C172 439 240 404 298 356 C369 296 431 236 492 212 C580 185 651 230 720 309 C791 382 850 251 890 145"
              />
              <path
                className="route-main"
                d="M100 470 C172 439 240 404 298 356 C369 296 431 236 492 212 C580 185 651 230 720 309 C791 382 850 251 890 145"
              />
              <path
                className="route-highlight"
                d="M92 500 C178 475 246 425 306 374 C382 309 458 280 526 269 C610 256 668 299 726 343 C790 392 845 296 894 203"
              />
            </svg>

            {zones.map((zone) => (
              <WorldMapCard
                key={zone.id}
                zone={zone}
                unlocked={unlockedZones.has(zone.id)}
                layout={zoneMapLayout[zone.id]}
                badge={progress.badges[zone.id]}
                isActive={selectedZone.id === zone.id}
                onSelect={setSelectedZoneId}
              />
            ))}
          </div>
        </div>

        <article
          className={`world-map-details card-elevated ${selectedUnlocked ? '' : 'world-map-details-locked'}`}
          data-testid="world-map-details"
          style={{ '--zone-accent': selectedZone.palette.accent } as CSSProperties}
        >
          <header>
            <p className="zone-order">
              Зона {selectedZone.order} · {selectedLayout.landmark}
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
                to={`/zone/${selectedZone.id}`}
                className="primary-button"
                onClick={() => setCurrentZone(selectedZone.id)}
              >
                Войти в зону
              </Link>
            ) : (
              <p className="lock-note">
                Заблокировано: завершите предыдущую зону с точностью от 70%.
              </p>
            )}
          </div>
        </article>
      </div>
    </section>
  );
}
