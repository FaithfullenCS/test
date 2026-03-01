# Cash Flow Quest RU

Локальная веб-игра для обучения переводу с английского на русский на материале статьи **"Effect of Cash Flow on Financial Performance of Food and Beverage Firms in Nigeria"**.

## Что реализовано

- 5 сюжетных зон, соответствующих разделам статьи.
- 120 заранее подготовленных заданий (24 на зону).
- 4 механики:
  - `Term Forge`
  - `Sentence Builder`
  - `Context Choice`
  - `Boardroom Boss`
- Дополнительные режимы:
  - `Adaptive Recall Cycle` (Leitner-повтор, 12 задач, due/weak очередь)
  - `Case Ladder` (10 сценариев, шаги `context -> sentence -> boss`)
  - `Liquidity Sprint` (4 минуты, 8 задач, локальный топ-7)
- Система наград `Liquidity Points (LP)`:
  - +10 / +6 / +3 за 1/2/3 попытку
  - штраф подсказки `-2 LP`
  - бонус серии: `+8 LP` каждые 5 правильных подряд
- Медали зоны: Bronze / Silver / Gold по порогам `60 / 80 / 92%`.
- Разблокировка следующей зоны при завершении предыдущей с точностью от `70%`.
- Профиль игрока, карта мира, финальный сертификат.
- Профиль дополнен ARC due-метрикой, статистикой кейсов и локальным рейтингом спринтов.
- Полное локальное хранение прогресса через `localStorage`.

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

Приложение откроется на локальном адресе Vite.

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

## Структура

- `src/data` - зоны и статический контент заданий
- `src/lib` - игровой движок, селекторы, storage
- `src/state` - глобальное состояние игры
- `src/pages` - экраны приложения
- `src/components` - UI-компоненты
- `test/e2e` - end-to-end сценарии
