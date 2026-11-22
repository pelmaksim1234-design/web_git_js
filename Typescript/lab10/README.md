# Лабораторна робота №10 — Study Planner та REST API

React 19-застосунок із інтеграцією DummyJSON. HTTP-запити винесені в API layer,
а доступ до Task прихований за repository.

## Запуск

```sh
npm install
npm run dev
```

Щоб відкрити лабораторну подвійним клацанням з `Typescript/index.html`, зберіть її
один раз командою `npm run build`. Застосунок збирається в один HTML-файл
`dist/index.html` і працює без локального сервера.

## Перевірки

```sh
npm run lint
npm run build
```

## Реалізовано

- пагінований GET-список, пошук із debounce та скасування попереднього запиту;
- GET деталей Task за id із локальним loading/error state;
- POST створення, PATCH оновлення та DELETE видалення;
- optimistic update для статусу completed;
- loading, success, error і empty states;
- підтвердження видалення;
- окремі `.env` та `.env.example`;
- SCSS-класи за блоковою BEM-схемою.

Незавершене видалення діє лише в поточній сесії; після перезавантаження збережене завдання повертається до звичайного списку.
