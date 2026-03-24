//1.масив 5
let numbers=[1,2,3,4,5];
let squared=numbers.map(num=>num*num);
console.log("Квадрати чисел:",squared);

//2.Лише парні числа
let evenNumbers=numbers.filter(num=>num%2===0);
console.log("парні числа:",evenNumbers);
//3. Cума всіх елементів
let sum = numbers.reduce((acc,num)=>acc+num,0);
console.log("сума елементів:",sum);

//4.+ 5 чисел
let newNumbers=[6,7,8,9,10];
numbers=numbers.concat(newNumbers);
console.log("додавання нових чисел:",numbers);

//5.- перші 3 елемента
numbers.splice(0,3);
console.log("видалення перших елементів:",numbers);
