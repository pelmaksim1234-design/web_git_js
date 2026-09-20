abstract class Car {
    protected brand: string;
    public year: number;

    private code: string;

    constructor(brand: string, year: number, code: string) {
        this.brand = brand;
        this.year = year;
        this.code = code;
    }

    abstract displayInfo(): void;

    protected getCode(): string {
        return this.code;
    }
}

class Toyota extends Car {
    public model: string;
    private isHybrid: boolean;

    constructor(year: number, code: string, model: string, isHybrid: boolean) {
        super("Toyota", year, code);
        this.model = model;
        this.isHybrid = isHybrid;
    }

    displayInfo(): void {
        console.log(`Brand: ${this.brand}, Year: ${this.year}, Model: ${this.model}, Hybrid: ${this.isHybrid}, Code: ${this.getCode()}`);
    }
}

class BMW extends Car {
    public model: string;
    public isElectric: boolean;

    constructor(year: number, code: string, model: string, isElectric: boolean) {
        super("BMW", year, code);
        this.model = model;
        this.isElectric = isElectric;
    }
    
    displayInfo(): void {
        console.log(`Brand: ${this.brand}, Year: ${this.year}, Model: ${this.model}, Electric: ${this.isElectric}, Code: ${this.getCode()}`);
    }
}

class Lanos extends Car {
    public model: string;
    public isDiesel: boolean;

    constructor(year: number, code: string, model: string, isDiesel: boolean) {
        super("Lanos", year, code);
        this.model = model;
        this.isDiesel = isDiesel;
    }
    displayInfo(): void {
        console.log(`Brand: ${this.brand}, Year: ${this.year}, Model: ${this.model}, Diesel: ${this.isDiesel}, Code: ${this.getCode()}`);
    }
}

const cars: Car[] = [
    new Toyota(2020, "T123", "Camry", true),
    new Toyota(2022, "T456", "Corolla", false),
    new BMW(2021, "B456", "i3", true),
    new BMW(2023, "B789", "X5", false),
    new Lanos(2019, "L789", "Zaz", false),
    new Lanos(2020, "L012", "Daewoo", true)
];

cars.forEach(car => 
    car.displayInfo()
);