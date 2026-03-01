# Sentence Builder Spec

## File Targets
- `src/data/challenges.ts`: `SentenceSeed`, `buildSentenceChallenges`, `zoneSeeds`
- `src/pages/ChallengePage.tsx`: assembly UI and submission
- `src/pages/CasePage.tsx`: case step behavior for sentence tasks

## Authoring Template

```ts
{
  promptEn: 'Original English sentence',
  fragmentsRu: ['Fragment 1', 'Fragment 2', 'Fragment 3'],
  hint: 'Ordering clue',
  explanation: 'Why this sequence matches source meaning',
  keywords: ['anchor term 1', 'anchor term 2'],
}
```

## Consistency Rules
- Keep fragments granular enough to require ordering decisions.
- Avoid fragments that can be permuted into equally valid alternatives unless that is desired and tested.
- Preserve deterministic shuffle behavior via `seededShuffle(hashSeed(challenge.id))` in UI.

## Review Checklist
- Assembled output reads naturally.
- No trailing or duplicated punctuation after join.
- Difficulty matches zone stage and mechanic mix.

