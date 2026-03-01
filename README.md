# Cash Flow Quest RU

Локальная веб-игра для обучения переводу с английского на русский на материале статьи **"Effect of Cash Flow on Financial Performance of Food and Beverage Firms in Nigeria"**.

## Что реализовано

- 5 сюжетных зон (по разделам статьи):
  - `gate_of_flow`
  - `operations_quarter`
  - `finance_harbor`
  - `investment_factory`
  - `council_hall`
- 120 базовых заданий (`24` на зону).
- 4 core-механики:
  - `Term Forge`
  - `Sentence Builder`
  - `Context Choice`
  - `Boardroom Boss`
- 3 тренажёрных режима:
  - `Adaptive Recall Cycle` (Leitner, 12 задач)
  - `Case Ladder` (3-шаговые кейсы)
  - `Liquidity Sprint` (8 задач за 4 минуты)
- Профиль, карта мира, итоговый экран с сертификатом.
- Полное локальное хранение прогресса через `localStorage`.

## Скоринг и прогрессия

- LP за верный ответ по попыткам: `+10 / +6 / +3`.
- Штраф за подсказку зависит от сложности.
- Бонус серии: `+8 LP` каждые 5 верных подряд.
- Медали зоны:
  - Bronze: `>= 60%`
  - Silver: `>= 80%`
  - Gold: `>= 92%`
- Разблокировка следующей зоны: завершить предыдущую с точностью `>= 70%`.

## Технологии

- React 18
- TypeScript
- Vite
- React Router
- Vitest + Testing Library
- Playwright (e2e)

## Локальный запуск

```bash
npm install
npm run dev
```

## Сборка

```bash
npm run build
npm run preview
```

## Тесты

```bash
npm run test
npm run test:e2e
```

## Последние изменения

- Добавлены рыночно-обоснованные режимы:
  - `Adaptive Recall Cycle` с Leitner-логикой (`8 due + 4 weak/stale`).
  - `Case Ladder` с 3-шаговыми сценариями и chain-множителем.
  - `Liquidity Sprint` на 4 минуты с локальным рейтингом.
- Расширен контент:
  - `Case Ladder`: 20 сценариев (по 4 на зону).
  - ARC/Sprint: выделенные тематические наборы в `src/data/mechanicTasks.ts`.
- Обновлены роуты и state/actions для новых режимов в `GameContext` и `ChallengePage`.
- Стабилизированы тесты:
  - Исправлено преждевременное завершение `Liquidity Sprint` при `sprintTimeLeft === null`.
  - Усилена устойчивость `ChallengePage` unit-теста для hard-таймера.
  - Усилена устойчивость `trainer` e2e-сценария к re-render во время перехода между заданиями.

## Архитектура

### Поток выполнения

1. `src/main.tsx` монтирует приложение.
2. `src/App.tsx` подключает роутинг и `GameProvider`.
3. `src/state/GameContext.tsx` управляет прогрессом, очередями тренажёра и сохранением.
4. `src/pages/*` и `src/components/*` рендерят UI и вызывают actions контекста.
5. `src/lib/engine.ts` считает очки, проверяет ответы и рассчитывает прогрессию.
6. `src/lib/storage.ts` валидирует/мигрирует данные в `localStorage`.

### Карта папок (с документацией)

- [`src/README.md`](src/README.md)
- [`src/components/README.md`](src/components/README.md)
- [`src/data/README.md`](src/data/README.md)
- [`src/lib/README.md`](src/lib/README.md)
- [`src/pages/README.md`](src/pages/README.md)
- [`src/state/README.md`](src/state/README.md)
- [`src/types/README.md`](src/types/README.md)
- [`src/test/README.md`](src/test/README.md)
- [`test/README.md`](test/README.md)
- [`test/e2e/README.md`](test/e2e/README.md)
- [`skills/README.md`](skills/README.md)

### Документация по игровым механикам

- [`skills/cfq-term-forge-mechanic/README.md`](skills/cfq-term-forge-mechanic/README.md)
- [`skills/cfq-sentence-builder-mechanic/README.md`](skills/cfq-sentence-builder-mechanic/README.md)
- [`skills/cfq-context-choice-mechanic/README.md`](skills/cfq-context-choice-mechanic/README.md)
- [`skills/cfq-boardroom-boss-mechanic/README.md`](skills/cfq-boardroom-boss-mechanic/README.md)
- [`skills/cfq-adaptive-recall-cycle/README.md`](skills/cfq-adaptive-recall-cycle/README.md)
- [`skills/cfq-case-ladder-mode/README.md`](skills/cfq-case-ladder-mode/README.md)
- [`skills/cfq-liquidity-sprint-mode/README.md`](skills/cfq-liquidity-sprint-mode/README.md)
- [`skills/cfq-difficulty-balancing/README.md`](skills/cfq-difficulty-balancing/README.md)
- [`skills/cfq-scoring-and-progression/README.md`](skills/cfq-scoring-and-progression/README.md)
- [`skills/cfq-world-map-layout/README.md`](skills/cfq-world-map-layout/README.md)
- [`skills/cfq-world-creation/README.md`](skills/cfq-world-creation/README.md)

## Где расширять проект

- Новый учебный мир: `src/data/worlds.ts`.
- Новая зона/контент: `src/data/zones.ts`, `src/data/challenges.ts`.
- Новые кейсы: `src/data/cases.ts`.
- Новые ARC/Sprint наборы: `src/data/mechanicTasks.ts`.
- Правила скоринга/сложности: `src/lib/engine.ts`.
