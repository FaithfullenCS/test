---
name: cfq-adaptive-recall-cycle
description: Build and maintain the Adaptive Recall Cycle mechanic for Cash Flow Quest. Use when changing Leitner memory logic, due/weak queue composition, retention bonus rules, or ARC trainer session behavior in `src/lib/engine.ts`, `src/state/GameContext.tsx`, and `src/pages/ChallengePage.tsx`.
---

# CFQ Adaptive Recall Cycle

## Overview
Implement and maintain the ARC trainer mode (`adaptive_recall`) with stable Leitner progression, due prioritization, and reward rules.

Use this skill for memory scheduling changes and ARC session flow updates.

## Workflow
1. Read `references/adaptive-recall-spec.md`.
2. Apply logic changes in `src/lib/engine.ts` first.
3. Wire state updates in `src/state/GameContext.tsx`.
4. Confirm route/session behavior in `src/pages/TrainerPage.tsx` and `src/pages/ChallengePage.tsx`.
5. Run focused tests and adjust invariants only intentionally.

## Mode Invariants
- Keep ARC session size at `12` unless requirements explicitly change.
- Keep queue target split: due-first then weak items.
- Update memory only via `updateMemoryStat`.
- Keep retention bonus gated to confident due answers.

## Validation
Run:
- `npm run test -- src/lib/engine.test.ts`
- `npm run test -- src/state/GameContext.test.tsx`
- `npm run test -- src/pages/ChallengePage.test.tsx`

