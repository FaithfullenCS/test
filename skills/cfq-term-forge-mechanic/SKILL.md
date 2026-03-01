---
name: cfq-term-forge-mechanic
description: Build and maintain the Term Forge mechanic for Cash Flow Quest. Use when adding or editing `term_forge` challenges, tuning term distractors, balancing option quality, or validating term challenge generation in `src/data/challenges.ts` and trainer/campaign flows.
---

# CFQ Term Forge Mechanic

## Overview
Implement and update the single-choice translation mechanic (`term_forge`) with consistent challenge quality and stable generation rules.

Use this skill when changing term content, answer options, or mechanic-level behavior tied to term tasks.

## Workflow
1. Read `references/term-forge-spec.md`.
2. Edit `zoneSeeds[zoneId].term` in `src/data/challenges.ts`.
3. Keep generator contract in `buildTermChallenges` unchanged unless the task explicitly requires an API change.
4. Verify campaign and trainer behavior in `src/pages/ChallengePage.tsx` and tests.
5. Run focused tests before finishing.

## Data Contract
- Use `TermSeed` fields exactly: `promptEn`, `correctRu`, `distractors`, `hint`, `explanation`, `keywords`.
- Keep `distractors` as exactly 3 items.
- Keep `correctRu` unique versus distractors after text normalization.
- Keep generated IDs in format `${zoneId}-term-${index + 1}`.
- Keep `reward` value generated as `10` unless the scoring system is intentionally changed globally.

## Quality Gates
- Ensure each option set has one clear best answer.
- Avoid distractors that are trivially wrong by domain mismatch.
- Keep hint actionable but not answer-revealing.
- Keep explanation aligned with academic finance translation context.
- Preserve keyword usefulness for profile summaries.

## Validation
Run:
- `npm run test -- src/lib/engine.test.ts`
- `npm run test -- src/pages/ChallengePage.test.tsx`
- `npm run test -- src/state/GameContext.test.tsx`

