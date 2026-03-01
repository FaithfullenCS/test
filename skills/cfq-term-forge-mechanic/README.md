# cfq-term-forge-mechanic

Механика выбора точного перевода термина (`term_forge`).

## Где реализовано в приложении

- Данные: `src/data/challenges.ts` (`TermSeed`, `buildTermChallenges`).
- Проверка ответа: `src/lib/engine.ts` (`scoreAnswer` для objective-задач).
- UI: `src/pages/ChallengePage.tsx`, `src/pages/CasePage.tsx`.

## Как работает

1. Для каждого термина есть 1 правильный вариант и 3 дистрактора.
2. Порядок опций стабильно ротируется (`rotateOptions`).
3. В easy trainer после первой ошибки доступен helper `50/50`.

## Связанные файлы skill

- `SKILL.md`
- `references/term-forge-spec.md`
