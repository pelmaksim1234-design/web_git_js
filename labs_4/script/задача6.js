// Головна функція управління бібліотекою
function libraryManagement() {

    // 1. Початковий масив книг
    let books = [
        { title: "Кобзар", author: "Тарас Шевченко", genre: "Поезія", pages: 300, isAvailable: true },
        { title: "1984", author: "Джордж Орвелл", genre: "Антиутопія", pages: 328, isAvailable: true },
        { title: "Майстер і Маргарита", author: "Михайло Булгаков", genre: "Роман", pages: 400, isAvailable: false }
    ];

    // 2. Додати книгу
    function addBook(title, author, genre, pages) {
        books.push({
            title,
            author,
            genre,
            pages,
            isAvailable: true
        });
    }

    // 3. Видалити книгу за назвою
    function removeBook(title) {
        books = books.filter(book => book.title !== title);
    }

    // 4. Пошук за автором
    function findBooksByAuthor(author) {
        return books.filter(book => book.author === author);
    }

    // 5. Взяти / повернути книгу
    function toggleBookAvailability(title, isBorrowed) {
        let book = books.find(book => book.title === title);
        if (book) {
            book.isAvailable = !isBorrowed;
        }
    }

    // 6. Сортування за сторінками
    function sortBooksByPages() {
        books.sort((a, b) => a.pages - b.pages);
    }

    // 7. Статистика
    function getBooksStatistics() {
        let total = books.length;
        let available = books.filter(book => book.isAvailable).length;
        let borrowed = total - available;

        let avgPages = books.reduce((sum, book) => sum + book.pages, 0) / total;

        return {
            totalBooks: total,
            availableBooks: available,
            borrowedBooks: borrowed,
            averagePages: avgPages
        };
    }

    // Повертаємо доступ до функцій
    return {
        addBook,
        removeBook,
        findBooksByAuthor,
        toggleBookAvailability,
        sortBooksByPages,
        getBooksStatistics,
        getAllBooks: () => books
    };
}


// 🔥 Приклад використання
const library = libraryManagement();

// Додаємо книгу
library.addBook("Гаррі Поттер", "Джоан Роулінг", "Фентезі", 500);

// Видаляємо книгу
library.removeBook("1984");

// Пошук
console.log("Книги Булгакова:", library.findBooksByAuthor("Михайло Булгаков"));

// Беремо книгу
library.toggleBookAvailability("Кобзар", true);

// Сортуємо
library.sortBooksByPages();

// Вивід всіх книг
console.log("Всі книги:", library.getAllBooks());

// Статистика
console.log("Статистика:", library.getBooksStatistics());