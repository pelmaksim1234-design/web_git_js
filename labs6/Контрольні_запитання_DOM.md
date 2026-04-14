# Контрольні запитання по DOM

## 1. Що таке DOM, і як він відрізняється від HTML?
DOM (`Document Object Model`) - це модель документа, яку браузер будує на основі HTML.

Просто:
- `HTML` - це код розмітки.
- `DOM` - це дерево об'єктів у браузері, з яким працює JavaScript.

Тобто HTML ми пишемо, а DOM браузер створює для роботи зі сторінкою.

## 2. Які методи доступу до елементів DOM в JavaScript ви знаєте?
Основні:

- `document.getElementById()`
- `document.getElementsByClassName()`
- `document.getElementsByTagName()`
- `document.querySelector()`
- `document.querySelectorAll()`

## 3. Що таке вузол (node) в DOM?
Вузол - це будь-який об'єкт у DOM-дереві.

Наприклад:
- елемент
- текст
- коментар
- документ

## 4. Які методи пошуку елементів в DOM ви знаєте, і що вони роблять?
- `getElementById("id")` - шукає один елемент по `id`
- `getElementsByClassName("name")` - шукає елементи по класу
- `getElementsByTagName("p")` - шукає елементи по тегу
- `querySelector(".box")` - повертає перший елемент по CSS-селектору
- `querySelectorAll(".box")` - повертає всі елементи по CSS-селектору

## 5. Як можна змінювати вміст елементів DOM за допомогою JavaScript?
- `textContent` - змінює текст
- `innerHTML` - змінює HTML всередині
- `innerText` - змінює видимий текст

Приклад:
```js
title.textContent = "Новий текст";
box.innerHTML = "<b>Текст</b>";
```

## 6. Як можна додавати атрибути до елементів DOM за допомогою JavaScript?
- через `setAttribute()`
- через властивості елемента

Приклад:
```js
img.setAttribute("src", "photo.jpg");
img.alt = "Фото";
```

## 7. Як ви можете змінити стилі елементів DOM за допомогою JavaScript?
Через `style`:

```js
box.style.color = "red";
box.style.display = "none";
```

Або через класи, що зручніше.

## 8. Які способи існують для додавання та видалення класів у елементів DOM?
Через `classList`:

- `add()`
- `remove()`
- `toggle()`
- `contains()`

Приклад:
```js
menu.classList.add("open");
menu.classList.remove("open");
menu.classList.toggle("open");
```

## 9. Що таке event throttling і як вона використовується для оптимізації роботи з подіями в DOM?
`Event throttling` - це обмеження частоти виклику функції для подій, які спрацьовують дуже часто.

Часто використовується для:
- `scroll`
- `resize`
- `mousemove`

Ідея така:
- без throttling функція викликається дуже часто
- з throttling вона викликається, наприклад, 1 раз на 200 мс

Приклад:
```js
function throttle(callback, delay) {
    let isWaiting = false;

    return function () {
        if (isWaiting) {
            return;
        }

        callback();
        isWaiting = true;

        setTimeout(() => {
            isWaiting = false;
        }, delay);
    };
}
```

## Коротко
DOM потрібен, щоб JavaScript міг:
- знаходити елементи
- змінювати текст і HTML
- змінювати атрибути і стилі
- додавати або видаляти елементи
- реагувати на дії користувача
