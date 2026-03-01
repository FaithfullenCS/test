# src/state

Глобальное состояние игры (`GameContext`).

## Что хранится

- `progress` игрока (LP, streak, пройденные задания, статистика тренажёра, кейсы, спринты).
- Текущая зона и вычислимые данные (точность по зонам, медали, unlocked zones).

## Основные операции

- `submitAnswer` — проверка и запись результатов в кампании.
- `submitTrainerAnswer` — проверка и запись результатов в тренажёре.
- `buildTrainerQueue` — формирование классических очередей.
- `startAdaptiveRecallSession` — формирование ARC-сессии.
- `startLiquiditySprintSession` — формирование Sprint-сессии.
- `recordCaseScenarioResult` / `recordSprintResult` / `recordTrainerSessionResult` — статистика режимов.
- `resetProgress` — полный сброс прогресса.

## Взаимодействие

Контекст использует:
- `src/lib/engine.ts` для расчётов,
- `src/lib/storage.ts` для персистентности,
- `src/data/*` для справочников и контента.
