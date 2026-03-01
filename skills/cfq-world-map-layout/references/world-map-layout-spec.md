# World Map Layout Spec

## File Targets
- `src/pages/WorldMapPage.tsx`: map canvas, layout coordinates, route and terrain layers
- `src/components/WorldMapCard.tsx`: node card visuals and interaction semantics

## Layout Data Contract
`zoneMapLayout` must include every `ZoneId` with:
- `x`, `y`: percentage placement on map canvas
- `landmark`: short label for UI detail panel
- `icon`: district glyph variant
- `elevation`: visual depth token
- `districtTone`: local color hint

## Interaction Rules
- Clicking a node selects it; entering zone requires unlocked status.
- Active node uses `isActive` styling and pressed-state semantics.
- Locked nodes display lock icon and block zone-entry CTA.
- Badge token (`B`, `S`, `G`) mirrors progression badges.

## Visual Rules
- Keep world environment layers (`landmass`, `river`, `route`) purely decorative and aria-hidden.
- Keep route readability for desktop and mobile viewport widths.
- Use CSS custom properties for node positioning and zone accent propagation.

## Consistency Checklist
- Every zone in `zones` renders exactly one `WorldMapCard`.
- Detail panel uses currently selected zone metrics (completion, accuracy, badge).
- Lock message reflects actual unlock threshold behavior.

