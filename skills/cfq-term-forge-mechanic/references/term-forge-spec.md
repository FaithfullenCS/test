# Term Forge Spec

## File Targets
- `src/data/challenges.ts`: `TermSeed`, `buildTermChallenges`, `zoneSeeds`
- `src/types/game.ts`: `TermForgeChallenge`
- `src/pages/ChallengePage.tsx`: option rendering and answer submission

## Authoring Template
Use this seed shape:

```ts
{
  promptEn: 'working capital',
  correctRu: 'oborotnyi kapital',
  distractors: ['distractor 1', 'distractor 2', 'distractor 3'],
  hint: 'Short directional hint',
  explanation: 'Why the translation is correct in context',
  keywords: ['working capital', 'oborotnyi kapital'],
}
```

## Consistency Rules
- Keep 4 options after generation: 1 correct + 3 distractors.
- Rely on `rotateOptions` for position variance; do not hardcode per-option ordering logic elsewhere.
- Keep zone volume balanced with other mechanics to preserve progression pacing.
- Preserve compatibility with easy-mode 50/50 helper in trainer mode.

## Review Checklist
- Option quality: no duplicate or near-duplicate distractors.
- Translation quality: one canonical answer.
- Hint quality: points to meaning, not literal answer string.
- Explanation quality: provides learning value, not repetition.

