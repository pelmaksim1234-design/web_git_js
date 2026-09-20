interface LibraryItem {
    title: string;
    author: string;
    isBorrowed: boolean;
    borrow(): void;
}

class Book implements LibraryItem {
    title: string;
    author: string;
    isBorrowed: boolean;
    pages: number;

    constructor(title: string, author: string, pages: number) {
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.isBorrowed = false;
    }

    borrow(): void {
        if (!this.isBorrowed) {
            this.isBorrowed = true;
            console.log(`${this.title} has been borrowed.`);
        } else {
            console.log(`${this.title} is already borrowed.`);
        }
    }
}

class Magazine implements LibraryItem {
    title: string;
    author: string;
    isBorrowed: boolean;
    issueNumber: number;

    constructor(title: string, author: string, issueNumber: number) {
        this.title = title;
        this.author = author;
        this.issueNumber = issueNumber;
        this.isBorrowed = false;
    }

    borrow(): void {
        if (!this.isBorrowed) {
            this.isBorrowed = true;
            console.log(`${this.title} (Issue ${this.issueNumber}) has been borrowed.`);
        } else {
            console.log(`${this.title} (Issue ${this.issueNumber}) is already borrowed.`);
        }
    }
}
class DVD implements LibraryItem {
    title: string; 
    author: string;
    isBorrowed: boolean;
    duration: number; 

    constructor(title: string, author: string, duration: number) {
        this.title = title;
        this.author = author;
        this.duration = duration;
        this.isBorrowed = false;
    }

    borrow(): void {
        if (!this.isBorrowed) {
            this.isBorrowed = true;
            console.log(`${this.title} (Duration: ${this.duration} mins) has been borrowed.`);
        } else {
            console.log(`${this.title} (Duration: ${this.duration} mins) is already borrowed.`);
        }
    }
}

class Library {
    private items: LibraryItem[] = [];

    addItem(item: LibraryItem): void {
        this.items.push(item);
        console.log(`Item added: ${item.title}`);
    }

    findItem(title: string): LibraryItem | undefined {
        return this.items.find(item => item.title === title);
    }

    printAvailableItems(): void {
        const availableItems = this.items.filter(item => !item.isBorrowed);

        if (availableItems.length === 0) {
            console.log("No available items in the library.");
            return;
        } else {
            console.log("Available items in the library:");
            availableItems.forEach(item => {
                console.log(`- ${item.title} by ${item.author}`);
            });
        }
    }
}

const library = new Library();

const book1 = new Book("Typescript Basics", "John Doe", 250);
const magazine1 = new Magazine("Tech Monthly", "Jane Smith", 42);
const dvd1 = new DVD("Learning TypeScript", "Tech Guru", 120);

console.log("Adding items to the library...")  ;
library.addItem(book1);
library.addItem(magazine1);
library.addItem(dvd1);

library.printAvailableItems();

const foundItem = library.findItem("Typescript Basics");
if (foundItem) {
    foundItem.borrow();
} else {
    console.log("Item not found in the library.");
}

const foundItem2 = library.findItem("Tech Monthly");
if (foundItem2) {
    foundItem2.borrow();
} else {
    console.log("Item not found in the library.");
}

library.printAvailableItems();
