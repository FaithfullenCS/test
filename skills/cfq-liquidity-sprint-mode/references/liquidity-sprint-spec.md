# Liquidity Sprint Spec

## File Targets
- `src/lib/engine.ts`: sprint constants, queue, score formula
- `src/pages/ChallengePage.tsx`: sprint timer and completion UX
- `src/state/GameContext.tsx`: sprint history ranking and storage
- `src/lib/selectors.ts`: top/recent sprint helpers

## Constants
- `SPRINT_SESSION_SIZE = 8`
- `SPRINT_DURATION_SECONDS = 240`

## Queue Rules
In `buildSprintQueue`:
- Use non-boss challenges for first `size - 1` slots.
- Use weakest boss challenge for final slot.
- Prefer weakest/stale items from stats before fallback shuffle.

## Score Formula
In `computeSprintScore`:
- Clamp `timeLeftSec` to `0..SPRINT_DURATION_SECONDS`.
- Compute `timeBonus = round((timeLeft / SPRINT_DURATION_SECONDS) * 40)`.
- Final score: `max(0, awardedLp + streakBonus + timeBonus)`.

## Leaderboard Rules
In `recordSprintResult`:
- Keep only entries within the last 14 days.
- Sort by score desc, then `playedAt` desc.
- Keep top 7 and rewrite rank as `1..7`.

