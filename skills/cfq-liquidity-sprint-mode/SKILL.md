---
name: cfq-liquidity-sprint-mode
description: Build and maintain the Liquidity Sprint mechanic for Cash Flow Quest. Use when editing sprint queue assembly, countdown logic, sprint score formula, or local leaderboard behavior for the 4-minute timed mode.
---

# CFQ Liquidity Sprint Mode

## Overview
Implement and tune the timed trainer mode (`liquidity_sprint`) with fixed-size mixed queue, hard session timer, sprint score calculation, and 14-day leaderboard retention.

Use this skill when changing sprint pacing or ranking behavior.

## Workflow
1. Read `references/liquidity-sprint-spec.md`.
2. Update queue/scoring constants in `src/lib/engine.ts`.
3. Update runtime flow in `src/pages/ChallengePage.tsx`.
4. Keep leaderboard persistence logic aligned in `src/state/GameContext.tsx` and selectors.
5. Run focused tests.

## Mode Invariants
- Keep sprint session size and timer bounded by constants.
- Keep queue composition with short tasks plus one boss task.
- Keep sprint score based on LP, streak bonus, and time bonus.
- Keep leaderboard limited to top 7 entries in last 14 days.

## Validation
Run:
- `npm run test -- src/lib/engine.test.ts`
- `npm run test -- src/pages/ChallengePage.test.tsx`
- `npm run test:e2e -- test/e2e/trainer.spec.ts`

