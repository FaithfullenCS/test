# cfq-context-choice-mechanic

Контекстная multiple-choice механика (`context_choice`).

## Где реализовано в приложении

- Данные: `src/data/challenges.ts` (`ContextSeed`, `buildContextChallenges`).
- UI: `src/pages/ChallengePage.tsx`.

## Как работает

1. Задача включает контекстный абзац и вопрос по конкретной фразе.
2. Игрок выбирает 1 из 4 переводов.
3. В easy trainer усиливается подсветка контекстных ключевых токенов.

## Связанные файлы skill

- `SKILL.md`
- `references/context-choice-spec.md`
