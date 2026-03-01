# Boardroom Boss Spec

## File Targets
- `src/data/challenges.ts`: `BossSeed`, `buildBossChallenges`, `zoneSeeds`
- `src/lib/engine.ts`: `matchBossKeywords`, `scoreBossAnswer`, `difficultyConfig`
- `src/pages/ChallengePage.tsx`: live keyword chip display

## Authoring Template

```ts
{
  promptEn: 'Long-form source sentence',
  canonicalRu: 'Canonical target translation',
  acceptableAnswers: ['Alt 1', 'Alt 2'],
  requiredKeywords: ['keyword1', 'keyword2', 'keyword3', 'keyword4'],
  keywordSynonyms: {
    keyword1: ['variant1', 'variant2'],
    keyword2: ['variant'],
    keyword3: ['variant'],
    keyword4: ['variant'],
  },
  hint: 'Guidance on preserving meaning structure',
  explanation: 'What semantic elements matter most',
  keywords: ['topic keyword'],
}
```

## Consistency Rules
- Keep required keywords semantic, not overly literal.
- Use stems only when intended (`dividen`, `operac`, etc.) to widen matching safely.
- Include enough keywords to make easy/medium/hard separation meaningful.

## Review Checklist
- Exact answer path works.
- Semantic fallback accepts meaningful paraphrase but rejects weak translations.
- Keyword synonyms avoid accidental false positives.

