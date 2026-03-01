---
name: cfq-context-choice-mechanic
description: Build and maintain the Context Choice mechanic for Cash Flow Quest. Use when adding or editing `context_choice` challenges, refining contextual multiple-choice options, or validating context highlighting and answer selection behavior.
---

# CFQ Context Choice Mechanic

## Overview
Implement and tune contextual multiple-choice translation tasks (`context_choice`) with strong disambiguation value.

Use this skill when updating contextual prompts, options, or challenge balance.

## Workflow
1. Read `references/context-choice-spec.md`.
2. Edit `zoneSeeds[zoneId].context` in `src/data/challenges.ts`.
3. Keep `buildContextChallenges` generation contract unless schema changes are explicitly requested.
4. Validate rendering, context block, and answer submission flow in `src/pages/ChallengePage.tsx`.
5. Run focused tests.

## Data Contract
- Use `ContextSeed` fields exactly: `contextEn`, `promptEn`, `correctRu`, `optionsRu`, `hint`, `explanation`, `keywords`.
- Keep `optionsRu` as exactly 4 options.
- Keep generated IDs in format `${zoneId}-context-${index + 1}`.
- Keep `reward` value generated as `10` unless global scoring changes.

## Quality Gates
- Make context necessary for picking the correct translation.
- Keep one unambiguous best option after normalization.
- Ensure distractors are plausible in domain but wrong in context.
- Keep hints directional, not answer-leaking.

## Validation
Run:
- `npm run test -- src/pages/ChallengePage.test.tsx`
- `npm run test -- src/lib/engine.test.ts`

