# cfq-sentence-builder-mechanic

Механика сборки перевода из фрагментов (`sentence_builder`).

## Где реализовано в приложении

- Данные: `src/data/challenges.ts` (`SentenceSeed`, `buildSentenceChallenges`).
- UI и поведение сборки: `src/pages/ChallengePage.tsx`, `src/pages/CasePage.tsx`.

## Как работает

1. Игрок собирает фрагменты в правильном порядке.
2. Ответом считается `fragments.join(' ')`.
3. В easy trainer есть дополнительная «умная проверка порядка».

## Связанные файлы skill

- `SKILL.md`
- `references/sentence-builder-spec.md`
