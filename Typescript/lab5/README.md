# Лабораторна робота №5 — маршрутизація та користувачі

Vue 3 SPA з Vue Router, Pinia, TypeScript, валідацією VeeValidate/Yup та DummyJSON API.

## Запуск

```sh
npm install
npm run dev
```

Перед запуском скопіюйте `.env.example` у `.env`. API URL задається у `VITE_API_URL`.

Тестовий обліковий запис DummyJSON: `emilys` / `emilyspass`.

## Перевірки

```sh
npm run type-check
npm run lint
npm run build
```

## Реалізовано

- Маршрутизація Home, About, Users, Login, сторінка 404 і lazy-loaded сторінки.
- Захист розділу Users, збереження сесії та автоматичне оновлення access token.
- Пошук і пагінація з параметрами `page` та `q` у URL.
- Перегляд, створення, редагування та видалення користувачів через Repository-сервіси.
- Дані, створені/змінені/видалені у DummyJSON (який імітує ці операції), відображаються у локальному стані до перезавантаження.

На сторінці About лишені помітні заглушки для ПІБ і GitHub профілю автора.

Для GitHub Pages задеплойте гілку `feature/routing` згідно з налаштуваннями репозиторію.
