# World Creation Spec

## File Targets
- `src/data/worlds.ts`: world catalog cards and availability
- `src/data/zones.ts`: zone descriptors and unlock rules
- `src/data/challenges.ts`: mechanic seeds and challenge generation
- `src/data/cases.ts`: case ladder scenarios
- `src/data/index.ts`: exports for app consumption

## World Types

## 1) Metadata-Only Upcoming World
Use when the world is announced but not playable yet.
- Add entry in `learningWorlds` with:
  - `availability: 'coming_soon'`
  - `route: null`
  - planned `zoneCount` and `challengeCount`
- Ensure card renders in Home page automatically.

## 2) Full Playable World
Use when world should be enterable and fully playable.
- Add/activate world metadata with route.
- Ensure only intended world is `available` for active-world flow.
- Provide synchronized data for:
  - zones
  - all challenge mechanics
  - case scenarios
- Verify counts and ids stay consistent.

## Current Architecture Notes
- `activeLearningWorldId` selects first `availability === 'available'` world.
- Campaign routing currently points to `/world` and uses single shared zone/challenge dataset.
- Multi-playable-world routing would require explicit world-scoped refactor before enabling more than one concurrent playable dataset.

## Naming and Volume Baseline
- Zone IDs follow stable slug format.
- Current world baseline: 5 zones, 24 tasks per zone, 120 total tasks.
- Case baseline: 2 scenarios per zone, each 3 steps.

