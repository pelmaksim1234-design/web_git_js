
console.log("Завдання 2. Створіть масив рядків, що містить назви кольорів.:");
//1.створення масива
let colors=["червоний", "синій", "зелений", "жовтий", "темно-синій", "Темно-фіолетовий"];
//2.довгий та короткий
let longest=colors[0];
let shortest=colors[0];

for(let color of colors){
    if(color.length>longest.length) longest=color;
    if(color.length<shortest.length)shortest=color;
}
//найдовший
console.log(longest);
//найкоротший
console.log(shortest);
//3. що містять слово
colors = colors.filter(color=>color.includes("синій"));
console.log(colors);
//4.Об'єднуємо
let resultString=colors.join( ",");
//5. вивод
console.log(resultString);
console.log("Перехід до 3:")