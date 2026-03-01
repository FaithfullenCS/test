# Difficulty Balancing Spec

## File Targets
- `src/lib/engine.ts`: `difficultyConfig`, scoring pipeline
- `src/pages/ChallengePage.tsx`: attempts, hard timer, easy assist features
- `src/lib/labels.ts`: difficulty descriptions

## Current Baseline
- easy:
  - `maxAttempts: 4`
  - `hintPenalty: 1`
  - `lpMultiplier: 0.8`
  - `hardTimerSeconds: null`
  - `bossKeywordThreshold: 0.6`
- medium:
  - `maxAttempts: 3`
  - `hintPenalty: 2`
  - `lpMultiplier: 1`
  - `hardTimerSeconds: null`
  - `bossKeywordThreshold: 0.75`
- hard:
  - `maxAttempts: 2`
  - `hintPenalty: 3`
  - `lpMultiplier: 1.3`
  - `hardTimerSeconds: 60`
  - `bossKeywordThreshold: 1`

## Coupled Behavior
- Easy trainer mode unlocks 50/50 aid for `term_forge` after first error.
- Hard trainer mode activates a per-challenge countdown timer.
- Boss semantic acceptance threshold derives from difficulty config.

## Change Checklist
- Update difficulty text in UI if semantics changed.
- Re-run tests for LP scaling and boss thresholds.
- Verify no accidental campaign difficulty drift (campaign uses medium by default).

