import { CSSProperties } from 'react';
import { badgeLabel } from '../lib/selectors';
import { ZoneBadge, ZoneConfig, ZoneId } from '../types/game';

type DistrictIcon = 'harbor' | 'factory' | 'tower' | 'bank' | 'hall';

export interface WorldMapLayout {
  x: number;
  y: number;
  landmark: string;
  icon: DistrictIcon;
  elevation: number;
  districtTone: string;
}

interface WorldMapCardProps {
  zone: ZoneConfig;
  unlocked: boolean;
  layout: WorldMapLayout;
  badge: ZoneBadge;
  isActive: boolean;
  onSelect: (zoneId: ZoneId) => void;
}

function badgeTokenLabel(badge: ZoneBadge): string {
  switch (badge) {
    case 'gold':
      return 'G';
    case 'silver':
      return 'S';
    case 'bronze':
      return 'B';
    default:
      return '';
  }
}

function DistrictIconGlyph({ icon }: { icon: DistrictIcon }) {
  if (icon === 'harbor') {
    return (
      <svg viewBox="0 0 64 64" role="presentation">
        <path d="M8 38L20 26L32 38L44 24L56 38V50H8V38Z" />
        <path d="M8 52C12 56 18 56 22 52C26 56 32 56 36 52C40 56 46 56 50 52C53 54 56 54 56 54V58H8V52Z" />
      </svg>
    );
  }

  if (icon === 'factory') {
    return (
      <svg viewBox="0 0 64 64" role="presentation">
        <path d="M8 52V28L24 34V28L40 34V20H56V52H8Z" />
        <rect x="14" y="40" width="8" height="8" />
        <rect x="28" y="40" width="8" height="8" />
        <rect x="42" y="40" width="8" height="8" />
      </svg>
    );
  }

  if (icon === 'tower') {
    return (
      <svg viewBox="0 0 64 64" role="presentation">
        <path d="M20 56L26 24H38L44 56H20Z" />
        <path d="M18 24L32 8L46 24H18Z" />
        <rect x="29" y="34" width="6" height="14" />
      </svg>
    );
  }

  if (icon === 'bank') {
    return (
      <svg viewBox="0 0 64 64" role="presentation">
        <path d="M8 24L32 12L56 24V30H8V24Z" />
        <rect x="12" y="30" width="8" height="18" />
        <rect x="28" y="30" width="8" height="18" />
        <rect x="44" y="30" width="8" height="18" />
        <rect x="8" y="48" width="48" height="6" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 64 64" role="presentation">
      <path d="M12 56V24H52V56H12Z" />
      <path d="M10 24L32 10L54 24H10Z" />
      <rect x="28" y="34" width="8" height="22" />
      <circle cx="32" cy="22" r="4" />
    </svg>
  );
}

export function WorldMapCard({
  zone,
  unlocked,
  layout,
  badge,
  isActive,
  onSelect,
}: WorldMapCardProps) {
  const badgeToken = badgeTokenLabel(badge);
  const statusLabel = unlocked ? 'доступна' : 'заблокирована';
  const selectedLabel = isActive ? ', выбрана' : '';
  const badgeText = badge !== 'none' ? `, медаль ${badgeLabel(badge)}` : '';

  return (
    <article
      className={`world-map-city ${unlocked ? 'is-unlocked' : 'is-locked'} ${
        isActive ? 'is-active' : ''
      }`}
      style={
        {
          '--node-x': `${layout.x}%`,
          '--node-y': `${layout.y}%`,
          '--district-tone': layout.districtTone,
          '--district-elevation': `${layout.elevation}px`,
          '--zone-accent': zone.palette.accent,
        } as CSSProperties
      }
      role="listitem"
    >
      <button
        type="button"
        className="world-map-city-button"
        onClick={() => onSelect(zone.id)}
        aria-pressed={isActive}
        aria-disabled={!unlocked}
        aria-label={`Зона ${zone.order}: ${zone.title}, ${statusLabel}${badgeText}${selectedLabel}`}
      >
        <span className="world-map-city-icon district-icon" aria-hidden="true">
          <DistrictIconGlyph icon={layout.icon} />
        </span>
        <span className="world-map-city-order" aria-hidden="true">
          {zone.order}
        </span>
        <span className="world-map-city-label">{layout.landmark}</span>
        {!unlocked && (
          <span className="world-map-lock" aria-hidden="true">
            <svg viewBox="0 0 24 24" role="presentation">
              <path d="M7 11V8a5 5 0 0 1 10 0v3h1a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h1Zm2 0h6V8a3 3 0 0 0-6 0v3Z" />
            </svg>
          </span>
        )}
        {badgeToken && (
          <span className={`world-map-badge badge-${badge}`} aria-label={`Медаль: ${badgeLabel(badge)}`}>
            {badgeToken}
          </span>
        )}
      </button>
    </article>
  );
}
