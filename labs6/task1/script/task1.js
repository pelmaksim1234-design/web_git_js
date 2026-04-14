const products = [
    {
        id: "1",
        name: "Навушники",
        price: 1200,
        category: "Електроніка",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
        createdAt: "2026-04-10T10:00:00",
        updatedAt: "2026-04-10T10:00:00"
    },
    {
        id: "2",
        name: "Книга JavaScript",
        price: 500,
        category: "Книги",
        image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80",
        createdAt: "2026-04-11T10:00:00",
        updatedAt: "2026-04-11T10:00:00"
    },
    {
        id: "3",
        name: "Футболка",
        price: 700,
        category: "Одяг",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80",
        createdAt: "2026-04-12T10:00:00",
        updatedAt: "2026-04-12T10:00:00"
    }
];

let currentFilter = "Всі";
let currentSort = "none";
let editId = null;

const productList = document.getElementById("productList");
const totalPrice = document.getElementById("totalPrice");
const emptyText = document.getElementById("emptyText");
const modal = document.getElementById("modal");
const productForm = document.getElementById("productForm");
const modalTitle = document.getElementById("modalTitle");
const toast = document.getElementById("toast");

const productIdInput = document.getElementById("productId");
const productNameInput = document.getElementById("productName");
const productPriceInput = document.getElementById("productPrice");
const productCategoryInput = document.getElementById("productCategory");
const productImageInput = document.getElementById("productImage");

// Показуємо повідомлення після додавання, редагування або видалення.
function showToast(text) {
    toast.textContent = text;
    toast.classList.add("show");
    setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}

// Рахуємо загальну суму всіх товарів.
function getTotalPrice() {
    let sum = 0;
    for (let i = 0; i < products.length; i += 1) {
        sum += products[i].price;
    }
    return sum;
}

// Залишаємо тільки потрібну категорію.
function getFilteredProducts() {
    if (currentFilter === "Всі") {
        return [...products];
    }

    return products.filter((product) => product.category === currentFilter);
}

// Сортуємо вже відфільтрований список.
function getSortedProducts(list) {
    const newList = [...list];

    if (currentSort === "price") {
        newList.sort((a, b) => a.price - b.price);
    }

    if (currentSort === "created") {
        newList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    if (currentSort === "updated") {
        newList.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    }

    return newList;
}

// Малюємо кнопки фільтра і сортування.
function drawButtons() {
    const categories = ["Всі", "Електроніка", "Книги", "Одяг"];
    const filterButtons = document.getElementById("filterButtons");
    const sortButtons = document.getElementById("sortButtons");

    filterButtons.innerHTML = "";
    sortButtons.innerHTML = "";

    for (let i = 0; i < categories.length; i += 1) {
        const btn = document.createElement("button");
        btn.textContent = categories[i];
        if (currentFilter === categories[i]) {
            btn.classList.add("active");
        }
        btn.addEventListener("click", () => {
            currentFilter = categories[i];
            renderProducts();
            drawButtons();
        });
        filterButtons.appendChild(btn);
    }

    const sorts = [
        { text: "Без сортування", value: "none" },
        { text: "За ціною", value: "price" },
        { text: "За датою створення", value: "created" },
        { text: "За датою оновлення", value: "updated" }
    ];

    for (let i = 0; i < sorts.length; i += 1) {
        const btn = document.createElement("button");
        btn.textContent = sorts[i].text;
        if (currentSort === sorts[i].value) {
            btn.classList.add("active");
        }
        btn.addEventListener("click", () => {
            currentSort = sorts[i].value;
            renderProducts();
            drawButtons();
        });
        sortButtons.appendChild(btn);
    }
}

function openModal() {
    modal.classList.add("show");
}

// Закриваємо модальне вікно і очищаємо форму.
function closeModal() {
    modal.classList.remove("show");
    productForm.reset();
    productIdInput.setCustomValidity("");
    editId = null;
}

// Підставляємо дані товару у форму, якщо редагуємо.
function fillForm(product) {
    productIdInput.value = product.id;
    productNameInput.value = product.name;
    productPriceInput.value = product.price;
    productCategoryInput.value = product.category;
    productImageInput.value = product.image;
}

// Повністю перемальовуємо картки товарів.
function renderProducts() {
    const list = getSortedProducts(getFilteredProducts());
    productList.innerHTML = "";

    if (list.length === 0) {
        emptyText.style.display = "block";
    } else {
        emptyText.style.display = "none";
    }

    for (let i = 0; i < list.length; i += 1) {
        const product = list[i];
        const card = document.createElement("div");
        card.className = "product-card";
        card.dataset.id = product.id;

        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <p><strong>ID:</strong> ${product.id}</p>
            <p><strong>Назва:</strong> ${product.name}</p>
            <p><strong>Ціна:</strong> ${product.price} грн</p>
            <p><strong>Категорія:</strong> ${product.category}</p>
            <p><strong>Створено:</strong> ${new Date(product.createdAt).toLocaleString("uk-UA")}</p>
            <p><strong>Оновлено:</strong> ${new Date(product.updatedAt).toLocaleString("uk-UA")}</p>
            <div class="buttons">
                <button class="edit-btn">Редагувати</button>
                <button class="delete-btn">Видалити</button>
            </div>
        `;

        const editBtn = card.querySelector(".edit-btn");
        const deleteBtn = card.querySelector(".delete-btn");

        editBtn.addEventListener("click", () => {
            // Запам'ятовуємо id, щоб знати який товар редагується.
            editId = product.id;
            modalTitle.textContent = "Редагувати товар";
            fillForm(product);
            openModal();
        });

        deleteBtn.addEventListener("click", () => {
            // Спочатку запускаємо анімацію, потім видаляємо елемент з масиву.
            card.classList.add("removing");
            setTimeout(() => {
                const index = products.findIndex((item) => item.id === product.id);
                if (index !== -1) {
                    products.splice(index, 1);
                }
                renderProducts();
                drawButtons();
                showToast("Товар успішно видалено");
            }, 300);
        });

        productList.appendChild(card);
    }

    totalPrice.textContent = `${getTotalPrice()} грн`;
}

document.getElementById("openModalBtn").addEventListener("click", () => {
    modalTitle.textContent = "Додати товар";
    openModal();
});

document.getElementById("closeModalBtn").addEventListener("click", closeModal);

window.addEventListener("click", (event) => {
    if (event.target === modal) {
        closeModal();
    }
});

productIdInput.addEventListener("input", () => {
    productIdInput.setCustomValidity("");
});

productForm.addEventListener("submit", (event) => {
    event.preventDefault();

    // Перевіряємо форму вбудованою HTML5-валідацією.
    if (!productForm.reportValidity()) {
        return;
    }

    const idValue = productIdInput.value.trim();
    const sameId = products.find((item) => item.id === idValue && item.id !== editId);

    if (sameId) {
        productIdInput.setCustomValidity("Такий ID вже існує");
        productIdInput.reportValidity();
        return;
    }

    if (editId === null) {
        // Додаємо новий товар.
        const newProduct = {
            id: idValue,
            name: productNameInput.value.trim(),
            price: Number(productPriceInput.value),
            category: productCategoryInput.value,
            image: productImageInput.value.trim(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        products.push(newProduct);
    } else {
        // Оновлюємо старий товар.
        const product = products.find((item) => item.id === editId);
        if (product) {
            product.id = idValue;
            product.name = productNameInput.value.trim();
            product.price = Number(productPriceInput.value);
            product.category = productCategoryInput.value;
            product.image = productImageInput.value.trim();
            product.updatedAt = new Date().toISOString();
            showToast(`Товар оновлено: ${product.id} ${product.name}`);
        }
    }

    closeModal();
    renderProducts();
    drawButtons();
});

drawButtons();
renderProducts();
