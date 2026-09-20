console.log("Завдання 3. Створіть масив об'єктів, що містить інформацію про працівників (ім'я, вік, посада). Виконайте наступні дії:");
//1.масив
let employees=[
    {name:"Сергій", age: 30,position:"менеджер"},
    {name:"Денис", age:25, position:"розробник"},
    {name:"Вова", age:40,position:"розробник"},
    {name:"Володимер", age:50,position:"директор"},
    {name:"Олена", age:28,position:"дизайнер"}
];
//2. Сортування масива за ім'ям
employees.sort((a,b)=>a.name.localeCompare(b.name));
console.log("Масив за ім'ям:",employees);

//3.всі працівники з посадою "розробник"
let developers=employees.filter(emp=>emp.position ==="розробник")
console.log("хто розробник:",developers);
//4. Убираэмо працівників старшіх за 28
employees=employees.filter(emp=>emp.age<28);
console.log("скіп всіх кому більше 28:",employees);
//5. Додаэмо нового працівника
employees.push({name:"Максим",age:21, position: "розробник"});
console.log("Масив оновився:",employees)
console.log("Перехід до 4:")