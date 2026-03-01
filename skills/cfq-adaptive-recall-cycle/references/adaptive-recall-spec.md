# Adaptive Recall Cycle Spec

## File Targets
- `src/lib/engine.ts`: memory model and queue builder
- `src/state/GameContext.tsx`: ARC session bootstrap and reward application
- `src/pages/ChallengePage.tsx`: ARC route handling and session UI

## Constants
- `ADAPTIVE_RECALL_SESSION_SIZE = 12`
- `ARC_DUE_TARGET = 8`
- `ARC_WEAK_TARGET = 4`
- `LEITNER_INTERVALS_DAYS = [0, 1, 3, 7, 14, 30]`
- `RETENTION_BONUS_POINTS = 2`

## Memory Update Rules
- Promote one box only on confident success: `isCorrect && attempt === 1 && !hintUsed`.
- Keep box unchanged on non-confident success.
- Reset box to `0` and increment `lapses` on incorrect answer.
- Recompute `dueAt` from interval table for resulting box.

## Queue Rules
- Build due candidates where `dueAt <= now`.
- Sort due candidates by earliest `dueAt`, then lowest accuracy, then oldest play time.
- Fill up to due target, then weak target, then stale candidates.
- Keep deterministic fallback when queue underfills.

## Reward Rules in ARC Mode
In `submitTrainerAnswer`:
- Use mode `adaptive_recall` for mechanic stats.
- Add retention bonus only if `retentionDue && attempt === 1 && !hintUsed && isCorrect`.
- Keep LP calculation compatible with global scoring and streak bonuses.

