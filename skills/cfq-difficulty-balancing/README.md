# cfq-difficulty-balancing

Настройка уровней сложности (`easy`, `medium`, `hard`).

## Где реализовано в приложении

- Конфигурация: `src/lib/engine.ts` (`difficultyConfig`).
- Использование в UI: `src/pages/ChallengePage.tsx`, `src/pages/TrainerPage.tsx`.

## Текущие параметры

- `easy`: 4 попытки, мягкий hint penalty, multiplier `0.8`.
- `medium`: 3 попытки, базовый баланс, multiplier `1.0`.
- `hard`: 2 попытки, строгий penalty, multiplier `1.3`, таймер 60с.
- Для `boardroom_boss` уровень сложности меняет required keyword threshold.

## Статус skill

`SKILL.md` пока содержит TODO-шаблон.
