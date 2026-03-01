---
name: cfq-scoring-and-progression
description: Build and maintain scoring, rewards, and progression systems for Cash Flow Quest. Use when changing LP formulas, streak bonuses, zone accuracy/badges, unlock chain rules, trainer stats, storage migration, or campaign completion logic.
---

# CFQ Scoring and Progression

## Overview
Implement and evolve the central progression model: answer scoring, LP economy, streak bonuses, badges, unlocks, trainer stats, and persisted progress.

Use this skill for any cross-cutting game economy or progression change.

## Workflow
1. Read `references/scoring-progression-spec.md`.
2. Apply scoring changes in `src/lib/engine.ts`.
3. Apply state-transition changes in `src/state/GameContext.tsx`.
4. Keep selectors and UI summaries aligned.
5. Validate storage compatibility and test coverage.

## Core Invariants
- Keep deterministic scoring for objective and boss mechanics.
- Keep streak bonus cadence consistent unless explicitly redesigned.
- Keep badge thresholds and unlock chain logic coherent with zone progression.
- Keep stored progress migratable via `APP_PROGRESS_VERSION` and `storageApi.migrateProgress`.

## Validation
Run:
- `npm run test -- src/lib/engine.test.ts`
- `npm run test -- src/state/GameContext.test.tsx`
- `npm run test -- src/lib/storage.test.ts`

