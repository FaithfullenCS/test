# Changelog

## [Unreleased] - 2026-03-01

### Added

- New trainer mechanics:
  - `Adaptive Recall Cycle` with Leitner-style memory progression.
  - `Case Ladder` with 3-step contextual scenarios and chain LP multiplier.
  - `Liquidity Sprint` with 4-minute sessions and local top results.
- New mechanic content packs:
  - 20 case scenarios in `src/data/cases.ts`.
  - ARC/Sprint thematic packs in `src/data/mechanicTasks.ts`.
- New game types and stats fields for memory boxes, sprint history, and scenario data.

### Changed

- Trainer routing and session setup updated for `adaptive-recall` and `sprint` aliases via common trainer route.
- `ChallengePage` now shows active session package title/brief in trainer modes.
- Sprint session handling uses dedicated queue initialization from game context.

### Fixed

- Fixed premature sprint finalization when `sprintTimeLeft` is `null`.
- Clamped hard mode timer countdown at `0` to avoid negative timer states.
- Stabilized unit and e2e tests for trainer flows:
  - timeout behavior in hard mode (`ChallengePage.test.tsx`);
  - next-task/session transition reliability (`test/e2e/trainer.spec.ts`).
