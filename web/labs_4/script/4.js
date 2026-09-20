
console.log("Завдання 4. Створіть масив об’єктів, який містить дані про студентів (ім’я, вік, курс).:");
//1. масив студентів
let students=[
    {name:"Олексій",age:20, course: 2},
    {name:"Марія",age:22, course: 3},
    {name:"Іван",age:19, course: 1},
    {name:"Олександер",age:21, course: 3},
    {name:"Анна",age:19, course: 1}
];
//2. убираєм ім'я "Олексій"
students=students.filter(student => student.name !== "Олексій");
console.log("після видалення ім'я:",students);

//3. Новий студент
students.push({name:"Дмитро",age:23,course:3});
console.log("Додавання студента:",students);

//4.Сортування за віком
students.sort((a,b)=>b.age-a.age);
console.log("Сортування за віком:",students);

//5. студенти 3 курсу
let thirdCourseStudent=students.find(student=>student.course === 3);
console.log("студенти 3 курсу:",thirdCourseStudent);
console.log("Перехід до 5:")