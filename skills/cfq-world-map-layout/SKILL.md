---
name: cfq-world-map-layout
description: Build and maintain the world map layout for Cash Flow Quest. Use when editing zone node coordinates, landmarks, route/terrain SVG layers, zone detail panel behavior, or map card interactions linked to lock/unlock and badge states.
---

# CFQ World Map Layout

## Overview
Maintain the campaign map as a deterministic layout system that binds zone metadata, visual coordinates, interaction states, and progression feedback.

Use this skill when adjusting map visuals or zone-node interaction behavior.

## Workflow
1. Read `references/world-map-layout-spec.md`.
2. Update layout constants in `src/pages/WorldMapPage.tsx`.
3. Update card visuals/interactions in `src/components/WorldMapCard.tsx`.
4. Keep lock, unlock, and badge behaviors aligned with progress state.
5. Validate map navigation end-to-end.

## Layout Invariants
- Keep one layout node per `ZoneId`.
- Keep coordinate ranges valid for percent-based placement.
- Keep selected zone state and detail panel synchronized.
- Keep lock status driven only by `unlockedZones` and progression rules.

## Validation
Run:
- `npm run test:e2e -- test/e2e/campaign.spec.ts`
- `npm run test -- src/pages/TrainerPage.test.tsx src/pages/ChallengePage.test.tsx`

