# cfq-liquidity-sprint-mode

Скоростной режим под таймер (`liquidity_sprint`).

## Где реализовано в приложении

- Sprint-сценарии: `src/data/mechanicTasks.ts`.
- Формирование очереди: `src/state/GameContext.tsx` (`buildSprintQueue`, `startLiquiditySprintSession`).
- Подсчёт score: `src/lib/engine.ts` (`computeSprintScore`).
- UI таймера/завершения: `src/pages/ChallengePage.tsx`.

## Как работает

1. Сессия: 8 задач за 240 секунд.
2. Очередь сочетает weak short tasks + финальный boss.
3. Итоговый score учитывает LP, бонус серии и остаток времени.
4. Хранится локальный топ-7 результатов за последние 14 дней.

## Статус skill

`SKILL.md` пока содержит TODO-шаблон.
