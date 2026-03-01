# Scoring and Progression Spec

## File Targets
- `src/lib/engine.ts`: scoring formulas, unlocks, badges, initial state
- `src/state/GameContext.tsx`: reward application and progress mutations
- `src/lib/selectors.ts`: summary and ranking selectors
- `src/lib/storage.ts`: persistence, validation, migration

## LP Scoring Pipeline
- Base points by attempt:
  - attempt 1: `10`
  - attempt 2: `6`
  - attempt 3: `3`
  - fallback: `0`
- Apply hint penalty from selected difficulty.
- Apply difficulty multiplier and round.

## Bonus Rules
- Streak bonus:
  - `STREAK_BONUS_EVERY = 5`
  - `STREAK_BONUS_POINTS = 8`
- ARC retention bonus:
  - `RETENTION_BONUS_POINTS = 2`
  - apply only in ARC due confident success path.

## Zone Progression Rules
- Accuracy by zone = `round(correct / total * 100)`.
- Badge thresholds:
  - bronze: `>= 60`
  - silver: `>= 80`
  - gold: `>= 92`
- Unlock chain checks previous zone completion and `minAccuracy` (current baseline: `70%`).

## Persistence Rules
- Version key: `APP_PROGRESS_VERSION`.
- Keep `storageApi.loadProgress` tolerant to corrupted or partial localStorage payloads.
- Use migration to backfill new fields without breaking legacy saves.

