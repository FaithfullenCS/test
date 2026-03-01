---
name: cfq-difficulty-balancing
description: Balance difficulty for Cash Flow Quest mechanics. Use when tuning `easy/medium/hard` parameters, attempt limits, hint penalties, LP multipliers, boss keyword thresholds, and hard-mode timers across campaign and trainer behavior.
---

# CFQ Difficulty Balancing

## Overview
Tune global difficulty behavior via `difficultyConfig` and dependent UI/gameplay rules while preserving expected mode identity.

Use this skill when changing the relationship between challenge strictness and LP rewards.

## Workflow
1. Read `references/difficulty-balancing-spec.md`.
2. Adjust `difficultyConfig` in `src/lib/engine.ts`.
3. Verify affected behavior in `src/pages/ChallengePage.tsx`, `src/pages/TrainerPage.tsx`, and labels.
4. Re-check scoring tests and threshold tests.
5. Keep player-facing text aligned with actual rules.

## Balancing Invariants
- Keep monotonic strictness: `easy` less strict than `medium`, `hard` most strict.
- Keep reward-risk pairing coherent (higher strictness may yield higher LP).
- Keep boss semantic threshold increasing with difficulty.
- Keep hard mode timer explicit and visible when enabled.

## Validation
Run:
- `npm run test -- src/lib/engine.test.ts`
- `npm run test -- src/pages/ChallengePage.test.tsx`
- `npm run test -- src/pages/TrainerPage.test.tsx`

