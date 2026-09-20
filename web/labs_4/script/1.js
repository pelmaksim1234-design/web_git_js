console.log("Завдання 1. Створіть масив рядків, що містить назви фруктів. Виконайте наступні дії:");
let fruits =["яблуко", "банан", "груша", "апельсин", "слива"];
// видалити останій елемент
fruits.pop();
console.log(fruits);
//додаэмо слово
fruits.unshift("мандарин");
console.log(fruits);
//зворотный порядок
fruits.sort().reverse();
console.log(fruits);
//яблуко
let index=fruits.indexOf("яблуко");
console.log(index);
console.log("Перехід до 2:")