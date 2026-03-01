# cfq-adaptive-recall-cycle

Режим адаптивного повтора по логике Leitner (`adaptive_recall`).

## Где реализовано в приложении

- Наборы ARC: `src/data/mechanicTasks.ts` (`adaptiveRecallDecks`).
- Очередь и память: `src/lib/engine.ts` (`buildAdaptiveRecallQueue`, `updateMemoryStat`, `isChallengeDue`).
- Запуск сессии: `src/state/GameContext.tsx`.
- UI: `src/pages/TrainerPage.tsx`, `src/pages/ChallengePage.tsx`.

## Как работает

1. Сессия на 12 заданий.
2. Приоритет очереди: `due -> weak -> stale`.
3. Для каждой задачи хранится box/dueAt/lapses.
4. За уверенный due-ответ в ARC выдаётся retention-бонус `+2 LP`.

## Статус skill

`SKILL.md` пока шаблонный (TODO), но код режима уже реализован в проекте.
