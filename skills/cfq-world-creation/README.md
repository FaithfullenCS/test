# cfq-world-creation

Создание и подключение новых учебных миров.

## Где реализовано в приложении

- Каталог миров: `src/data/worlds.ts`.
- Витрина миров: `src/pages/HomePage.tsx`.
- Активный маршрут мира: поле `route` + роуты в `src/App.tsx`.

## Как добавить новый мир

1. Добавить объект в `learningWorlds` (`id`, `title`, `description`, `availability`, `route`, `palette`).
2. Для `available` мира указать рабочий маршрут.
3. При необходимости добавить страницы/данные под этот маршрут.

## Статус skill

`SKILL.md` пока содержит TODO-шаблон.
