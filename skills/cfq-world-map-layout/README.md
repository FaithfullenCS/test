# cfq-world-map-layout

Композиция интерактивной карты мира и узлов зон.

## Где реализовано в приложении

- Страница карты: `src/pages/WorldMapPage.tsx`.
- Карточка узла: `src/components/WorldMapCard.tsx`.
- Стили карты: `src/styles.css` (`world-map-*`, `env-*`, `route-*`).

## Как работает

1. В `zoneMapLayout` для каждой зоны задана позиция, landmark, иконка и визуальный тон.
2. Карта рисуется SVG-слоями: landmass, river, route + кликабельные city nodes.
3. Детальная панель справа показывает доступность, прогресс и CTA в зону.

## Статус skill

`SKILL.md` пока содержит TODO-шаблон.
