# Context Choice Spec

## File Targets
- `src/data/challenges.ts`: `ContextSeed`, `buildContextChallenges`, `zoneSeeds`
- `src/pages/ChallengePage.tsx`: context block rendering and option submit

## Authoring Template

```ts
{
  contextEn: 'Short academic context paragraph',
  promptEn: 'Choose the best translation of ...',
  correctRu: 'Correct contextual translation',
  optionsRu: ['Correct', 'Distractor A', 'Distractor B', 'Distractor C'],
  hint: 'Context-based hint',
  explanation: 'Why option is correct in this context',
  keywords: ['term 1', 'term 2'],
}
```

## Consistency Rules
- Start options with the canonical answer in seed data; rely on `rotateOptions` for final positioning.
- Keep context length compact enough for UI readability.
- Keep context vocabulary aligned with the world domain.

## Review Checklist
- Exactly one contextually correct option.
- Distractors are realistic but objectively inferior.
- Prompt tests the phrase from source context, not generic translation.

