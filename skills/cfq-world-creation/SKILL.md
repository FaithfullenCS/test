---
name: cfq-world-creation
description: Create and maintain learning worlds for Cash Flow Quest. Use when adding a new world card, preparing a full playable world dataset (zones/challenges/cases), defining world palette and metadata, or aligning world-level routing and availability behavior.
---

# CFQ World Creation

## Overview
Create worlds in a repeatable structure so future worlds follow the same modeling pattern for metadata, zones, mechanics, and progression visibility.

Use this skill for both upcoming-world cards and full content worlds.

## Workflow
1. Read `references/world-creation-spec.md`.
2. Decide world type:
   - metadata-only upcoming world card
   - full playable world content
3. Update world metadata in `src/data/worlds.ts`.
4. For full worlds, update zones/challenges/cases data in a synchronized way.
5. Verify home, map, trainer, and progression surfaces.

## World Invariants
- Keep world metadata complete and consistent (`title`, `focus`, counts, palette, route, availability).
- Keep zone/mechanic composition balanced.
- Keep IDs deterministic and machine-joinable across files.
- Keep unlock and scoring behavior compatible with global engine rules.

## Validation
Run:
- `npm run test -- src/pages/HomePage.test.tsx src/pages/TrainerPage.test.tsx`
- `npm run test -- src/lib/engine.test.ts src/state/GameContext.test.tsx`
- `npm run test:e2e -- test/e2e/campaign.spec.ts`

