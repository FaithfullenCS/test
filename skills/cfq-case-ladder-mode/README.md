# cfq-case-ladder-mode

Сценарный режим из трёх шагов (`context -> sentence -> boss`).

## Где реализовано в приложении

- Сценарии кейсов: `src/data/cases.ts`.
- Экран режима: `src/pages/CasePage.tsx`.
- Учёт статистики: `src/state/GameContext.tsx` (`recordCaseScenarioResult`).

## Как работает

1. Кейс состоит из 3 шагов.
2. LP за шаг масштабируется цепочкой `x1.0 / x1.1 / x1.25`, пока нет провала.
3. После завершения сохраняются plays/completions/best LP/best accuracy.

## Статус skill

`SKILL.md` пока содержит TODO-шаблон.
