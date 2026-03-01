---
name: cfq-sentence-builder-mechanic
description: Build and maintain the Sentence Builder mechanic for Cash Flow Quest. Use when adding or editing `sentence_builder` challenges, tuning fragment ordering logic, or validating sentence assembly behavior in campaign and trainer flows.
---

# CFQ Sentence Builder Mechanic

## Overview
Implement and refine the fragment-based translation assembly mechanic (`sentence_builder`) while preserving deterministic generation and UI behavior.

Use this skill when creating new sentence seeds or adjusting assembly logic.

## Workflow
1. Read `references/sentence-builder-spec.md`.
2. Edit `zoneSeeds[zoneId].sentence` in `src/data/challenges.ts`.
3. Keep `buildSentenceChallenges` contract stable unless a schema migration is planned.
4. Verify fragment shuffle, assembly, and submit behavior in `src/pages/ChallengePage.tsx` and `src/pages/CasePage.tsx`.
5. Run focused tests.

## Data Contract
- Use `SentenceSeed` fields exactly: `promptEn`, `fragmentsRu`, `hint`, `explanation`, `keywords`.
- Keep generated `correctAnswer` as `fragmentsRu.join(' ')`.
- Keep generated IDs in format `${zoneId}-sentence-${index + 1}`.
- Keep `reward` value generated as `10` unless scoring is intentionally redesigned globally.

## Quality Gates
- Make fragments composable into one natural sentence in exactly one intended order.
- Keep punctuation and casing coherent after join.
- Keep hint focused on ordering or key semantic anchors.
- Keep explanation short and instructional.

## Validation
Run:
- `npm run test -- src/pages/ChallengePage.test.tsx`
- `npm run test -- src/pages/CasePage.test.tsx`
- `npm run test -- src/lib/engine.test.ts`

