let fruits =["яблуко", "банан", "груша", "апельсин", "слива"];
// видалити останій елемент
fruits.pop();
console.log(fruits);
//додаэмо слово
fruits.unshift("cars");
console.log(fruits);
//зворотный порядок
fruits.sort().reverse();
console.log(fruits);
//яблуко
let index=fruits.indexOf("яблуко");
console.log(index);