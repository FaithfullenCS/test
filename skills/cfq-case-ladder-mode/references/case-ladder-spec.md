# Case Ladder Spec

## File Targets
- `src/data/cases.ts`: scenario definitions
- `src/pages/CasePage.tsx`: case runtime and chain logic
- `src/state/GameContext.tsx`: case result persistence

## Scenario Data Rules
- Build IDs as `${zoneId}-case-${1|2}`.
- Keep `steps` exactly 3 items:
  - `${zoneId}-context-${caseIndex}`
  - `${zoneId}-sentence-${caseIndex}`
  - `${zoneId}-boss-${caseIndex}`
- Ensure every step challenge ID exists in `challengeById`.

## Runtime Rules
- Use fixed chain multipliers: `[1, 1.1, 1.25]` while chain is active.
- Use medium difficulty config for attempts and penalties.
- Break chain on failed step after max attempts.
- Mark case finished after step 3 and persist result.

## Persistence Rules
In `recordCaseScenarioResult`:
- Increment `plays` on each completed run.
- Increment `completions` only when all steps resolved correctly.
- Update `bestLp` and `bestAccuracy` with max values.
- Update `lastPlayedAt` and `lastCompletedAt` timestamps.

