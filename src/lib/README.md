# src/lib

Ядро игровой логики, независимое от React-компонентов.

## Файлы

- `engine.ts` — scoring, difficulty, streak, badges, unlock, ARC memory, sprint scoring.
- `selectors.ts` — агрегаты для UI (точность, прогресс, топы, последние ответы).
- `storage.ts` — загрузка/валидация/миграция `PlayerProgress` в `localStorage`.
- `labels.ts` — отображаемые названия механик, сложности и режимов.
- `text.ts` — нормализация текста и детерминированное перемешивание.

## Важные правила из engine

- Базовые очки за попытку: `10 / 6 / 3`.
- Штраф подсказки зависит от сложности.
- Бонус серии: `+8 LP` каждые 5 верных подряд.
- `boardroom_boss`: принятие по exact match или покрытию ключевых токенов по порогам сложности.
- ARC: Leitner-box и очередь `due -> weak -> stale`.
- Sprint: итоговый score = `awardedLp + streakBonus + timeBonus`.

## Тесты

- `engine.test.ts`
- `storage.test.ts`
