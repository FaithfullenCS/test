# src/data

Статический контент и таблицы конфигурации игрового мира.

## Файлы

- `challenges.ts` — основной контент заданий и генераторы 4 механик:
  - `term_forge`
  - `sentence_builder`
  - `context_choice`
  - `boardroom_boss`
- `zones.ts` — описание 5 зон и правила разблокировки.
- `cases.ts` — сценарии `Case Ladder` (по 4 кейса на зону, 3 шага в кейсе).
- `mechanicTasks.ts` — наборы для `Adaptive Recall Cycle` и `Liquidity Sprint`.
- `worlds.ts` — каталог учебных миров на главной.
- `index.ts` — единая точка экспорта данных + `zoneById`.

## Как это работает

1. В `zoneSeeds` хранится учебный материал по зонам.
2. Генераторы превращают seed-объекты в типизированные задания с ID.
3. `buildZones(challenges)` связывает зоны с их `challengeIds`.
4. Эти структуры потребляются `GameContext` и страницами.

## Где расширять

- Новые задания: `challenges.ts`.
- Новые кейсы: `cases.ts`.
- Новые ARC/Sprint сценарии: `mechanicTasks.ts`.
- Новый мир: `worlds.ts`.
