# cfq-boardroom-boss-mechanic

Свободный ввод полного перевода (`boardroom_boss`).

## Где реализовано в приложении

- Данные: `src/data/challenges.ts` (`BossSeed`, `buildBossChallenges`).
- Скоринг: `src/lib/engine.ts` (`matchBossKeywords`, `scoreBossAnswer`).
- UI live-подсветки токенов: `src/pages/ChallengePage.tsx`, `src/pages/CasePage.tsx`.

## Как работает

1. Проверяется exact match по canonical/acceptable answer.
2. Если exact не совпал, включается semantic fallback по покрытию required keywords.
3. Порог покрытия зависит от сложности (`easy 0.6`, `medium 0.75`, `hard 1.0`).

## Связанные файлы skill

- `SKILL.md`
- `references/boardroom-boss-spec.md`
