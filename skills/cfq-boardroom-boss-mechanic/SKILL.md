---
name: cfq-boardroom-boss-mechanic
description: Build and maintain the Boardroom Boss mechanic for Cash Flow Quest. Use when adding or editing `boardroom_boss` free-text challenges, tuning required keyword logic, acceptable answers, or semantic pass thresholds across difficulty levels.
---

# CFQ Boardroom Boss Mechanic

## Overview
Implement the free-text translation mechanic (`boardroom_boss`) that accepts exact or semantic matches based on keyword coverage and difficulty thresholds.

Use this skill for boss prompt authoring and semantic scoring stability.

## Workflow
1. Read `references/boardroom-boss-spec.md`.
2. Edit `zoneSeeds[zoneId].boss` in `src/data/challenges.ts`.
3. Keep scoring logic centralized in `src/lib/engine.ts` (`scoreBossAnswer`, `matchBossKeywords`).
4. Validate live keyword coverage behavior in `src/pages/ChallengePage.tsx` and `src/pages/CasePage.tsx`.
5. Run focused tests.

## Data Contract
- Use `BossSeed` fields exactly: `promptEn`, `canonicalRu`, `acceptableAnswers`, `requiredKeywords`, `keywordSynonyms`, `hint`, `explanation`, `keywords`.
- Ensure every `requiredKeywords` entry has a corresponding `keywordSynonyms` key.
- Keep generated IDs in format `${zoneId}-boss-${index + 1}`.
- Keep `reward` value generated as `10` unless scoring system is globally changed.

## Scoring Invariants
- Correct if normalized input exactly matches canonical or acceptable answer.
- Otherwise evaluate semantic pass by keyword coverage threshold from `difficultyConfig`:
  - easy: `0.6`
  - medium: `0.75`
  - hard: `1.0`
- Threshold uses `ceil(requiredKeywords.length * threshold)` with minimum target `1`.

## Validation
Run:
- `npm run test -- src/lib/engine.test.ts`
- `npm run test -- src/pages/ChallengePage.test.tsx`
- `npm run test -- src/pages/CasePage.test.tsx`

