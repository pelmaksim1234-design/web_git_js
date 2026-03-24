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
console.log("Масив%;",employees);

//3.всі працівники з посадою "розробник"
let developers=employees.filter(emp=>emp.position ==="розробник")
console.log("хто розробник:",developers);
//4. Убираэмо працівників старшіх за 28
employees=employees.filter(emp=>emp.age<=28);
console.log("скіп всіх кому більше 28:",employees);
//5. Додаэмо нового працівника
employees.push({name:"Максим",age:21, position: "директор"});
console.log("Масив оновився:",employees)