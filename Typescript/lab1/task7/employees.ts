interface Payable {
    calculatePay(): void;
}

abstract class Employee{
    public name: string;
    public age: number
    public salary: number;

    constructor(name: string, age: number, salary: number){
        this.name = name;
        this.age = age;
        this.salary = salary;
    }

    abstract getAnualSalary(): number;
}

class Developer extends Employee implements Payable{
    constructor(name: string, age: number, salary: number){
        super(name, age, salary);
    }

    getAnualSalary(): number { 
        return this.salary * 0.10;
    }

    calculatePay(): void {
        console.log(`Developer ${this.name} has an annual salary of ${this.getAnualSalary()}`);
    }
}

class Manager extends Employee implements Payable{
    constructor(name: string, age: number, salary: number){
        super(name, age, salary);
    }

    getAnualSalary(): number {
        return this.salary * 0.15;
    }

    calculatePay(): void {
        console.log(`Manager ${this.name} has an annual salary of ${this.getAnualSalary()}`);
    }   
}

const employees: Employee[] = [
    new Developer("Alice", 30, 80000),
    new Manager("Bob", 40, 120000),
    new Developer("Charlie", 25, 60000),
    new Manager("David", 35, 100000)
];

let totalBonus: number = 0;
employees.forEach(employee => {
    const bonus = employee.getAnualSalary();
    console.log(`${employee.name} has an annual bonus of ${bonus}`);
    totalBonus += bonus;

    if ('calculatePay' in employee) {
        (employee as Payable).calculatePay();
    }
});

console.log(`Total annual bonus for all employees: ${totalBonus}`);