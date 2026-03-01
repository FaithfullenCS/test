---
name: cfq-case-ladder-mode
description: Build and maintain the Case Ladder mechanic for Cash Flow Quest. Use when editing case scenario composition, 3-step chain flow (context, sentence, boss), multiplier logic, or case progress tracking in trainer mode.
---

# CFQ Case Ladder Mode

## Overview
Implement and evolve the scenario-based trainer mode (`case_ladder`) where each case is resolved in three linked steps with chain multipliers.

Use this skill when changing scenario templates, step composition, or chain reward behavior.

## Workflow
1. Read `references/case-ladder-spec.md`.
2. Update scenario sources in `src/data/cases.ts`.
3. Update interactive flow in `src/pages/CasePage.tsx`.
4. Keep stats persistence and aggregation aligned in `src/state/GameContext.tsx`.
5. Run focused tests.

## Mode Invariants
- Keep exactly 3 steps per case in order: `context`, `sentence`, `boss`.
- Keep chain multipliers deterministic per step index.
- Keep case mode scoring routed via `submitTrainerAnswer(... mode: 'case_ladder')`.
- Keep progress tracking in `caseProgress` with best LP and best accuracy.

## Validation
Run:
- `npm run test -- src/pages/CasePage.test.tsx`
- `npm run test -- src/pages/TrainerPage.test.tsx`
- `npm run test -- src/lib/engine.test.ts`
