'use strict';

const categories = ['Техніка', 'Книги', 'Одяг'];

const productsStart = [
    {
        id: '1',
        name: 'Навушники',
        price: 1200,
        category: 'Техніка',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600',
        createdAt: '2026-04-01T10:00:00',
        updatedAt: '2026-04-01T10:00:00'
    },
    {
        id: '2',
        name: 'Книга JavaScript',
        price: 450,
        category: 'Книги',
        image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600',
        createdAt: '2026-04-03T12:00:00',
        updatedAt: '2026-04-03T12:00:00'
    },
    {
        id: '3',
        name: 'Футболка',
        price: 700,
        category: 'Одяг',
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600',
        createdAt: '2026-04-05T14:30:00',
        updatedAt: '2026-04-05T14:30:00'
    }
];

let products = [...productsStart];
let activeCategory = 'all';
let activeSort = 'none';
let toastTimer = null;

const productList = document.getElementById('productList');
const emptyText = document.getElementById('emptyText');
const totalPrice = document.getElementById('totalPrice');
const filterButtons = document.getElementById('filterButtons');
const sortButtons = document.getElementById('sortButtons');
const addProductBtn = document.getElementById('addProductBtn');
const productModal = document.getElementById('productModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const cancelModalBtn = document.getElementById('cancelModalBtn');
const modalTitle = document.getElementById('modalTitle');
const productForm = document.getElementById('productForm');
const oldProductId = document.getElementById('oldProductId');
const productId = document.getElementById('productId');
const productName = document.getElementById('productName');
const productPrice = document.getElementById('productPrice');
const productCategory = document.getElementById('productCategory');
const productImage = document.getElementById('productImage');
const toast = document.getElementById('toast');

const formatPrice = (price) => `${price.toLocaleString('uk-UA')} грн`;

const getTotal = (items) => items.reduce((sum, item) => sum + Number(item.price), 0);

const addProduct = (items, product) => [...items, product];

const deleteProduct = (items, id) => items.filter((item) => item.id !== id);

const editProduct = (items, oldId, newProduct) => items.map((item) => (
    item.id === oldId ? { ...newProduct, createdAt: item.createdAt } : item
));

const filterProducts = (items, category) => (
    category === 'all' ? [...items] : items.filter((item) => item.category === category)
);

const sortProducts = (items, sortType) => {
    const sortedItems = [...items];

    if (sortType === 'price') {
        return sortedItems.sort((a, b) => a.price - b.price);
    }

    if (sortType === 'created') {
        return sortedItems.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    if (sortType === 'updated') {
        return sortedItems.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    }

    return sortedItems;
};

const getVisibleProducts = (items, category, sortType) => {
    const filtered = filterProducts(items, category);
    return sortProducts(filtered, sortType);
};

const createText = (text, className = '') => {
    const element = document.createElement('p');
    element.textContent = text;
    element.className = className;
    return element;
};

const showToast = (message) => {
    toast.textContent = message;
    toast.classList.add('show');

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        toast.classList.remove('show');
    }, 2500);
};

const openModal = (product = null) => {
    productForm.reset();
    productId.setCustomValidity('');

    if (product) {
        modalTitle.textContent = 'Редагувати товар';
        oldProductId.value = product.id;
        productId.value = product.id;
        productName.value = product.name;
        productPrice.value = product.price;
        productCategory.value = product.category;
        productImage.value = product.image;
    } else {
        modalTitle.textContent = 'Додати товар';
        oldProductId.value = '';
    }

    productModal.hidden = false;
};

const closeModal = () => {
    productModal.hidden = true;
    productForm.reset();
    productId.setCustomValidity('');
};

const createButton = (text, className, isActive, onClick) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = text;
    button.className = className;

    if (isActive) {
        button.classList.add('active');
    }

    button.addEventListener('click', onClick);
    return button;
};

const renderFilters = () => {
    const allButton = createButton('Скинути фільтр', 'light-btn', activeCategory === 'all', () => {
        activeCategory = 'all';
        render();
    });

    const buttons = categories.map((category) => (
        createButton(category, 'light-btn', activeCategory === category, () => {
            activeCategory = category;
            render();
        })
    ));

    filterButtons.replaceChildren(allButton, ...buttons);
};

const renderSortButtons = () => {
    const buttons = [
        createButton('Скинути сортування', 'light-btn', activeSort === 'none', () => {
            activeSort = 'none';
            render();
        }),
        createButton('Сортувати за ціною', 'light-btn', activeSort === 'price', () => {
            activeSort = 'price';
            render();
        }),
        createButton('Сортувати за датою створення', 'light-btn', activeSort === 'created', () => {
            activeSort = 'created';
            render();
        }),
        createButton('Сортувати за датою оновлення', 'light-btn', activeSort === 'updated', () => {
            activeSort = 'updated';
            render();
        })
    ];

    sortButtons.replaceChildren(...buttons);
};

const createProductCard = (product) => {
    const card = document.createElement('article');
    card.className = 'product-card add-animation';

    const img = document.createElement('img');
    img.src = product.image;
    img.alt = product.name;

    const cardInfo = document.createElement('div');
    cardInfo.className = 'card-info';

    const title = document.createElement('h3');
    title.textContent = product.name;

    const category = document.createElement('span');
    category.className = 'category';
    category.textContent = product.category;

    const actions = document.createElement('div');
    actions.className = 'card-actions';

    const editButton = createButton('Редагувати', 'edit-btn', false, () => {
        openModal(product);
    });

    const deleteButton = createButton('Видалити', 'delete-btn', false, () => {
        card.classList.add('delete-animation');

        setTimeout(() => {
            products = deleteProduct(products, product.id);
            render();
            showToast(`Товар "${product.name}" успішно видалено зі списку.`);
        }, 300);
    });

    cardInfo.append(
        createText(`ID: ${product.id}`, 'small-text'),
        title,
        createText(`Ціна: ${formatPrice(product.price)}`, 'price'),
        category,
        createText(`Створено: ${new Date(product.createdAt).toLocaleDateString('uk-UA')}`, 'small-text'),
        createText(`Оновлено: ${new Date(product.updatedAt).toLocaleDateString('uk-UA')}`, 'small-text')
    );
    actions.append(editButton, deleteButton);
    card.append(img, cardInfo, actions);

    return card;
};

const renderProducts = () => {
    const visibleProducts = getVisibleProducts(products, activeCategory, activeSort);
    const cards = visibleProducts.map(createProductCard);

    productList.replaceChildren(...cards);
    emptyText.hidden = products.length !== 0;
};

const renderTotal = () => {
    totalPrice.textContent = formatPrice(getTotal(products));
};

const render = () => {
    renderFilters();
    renderSortButtons();
    renderProducts();
    renderTotal();
};

const getFormProduct = () => ({
    id: productId.value.trim(),
    name: productName.value.trim(),
    price: Number(productPrice.value),
    category: productCategory.value,
    image: productImage.value.trim(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
});

const checkId = (id, oldId) => {
    const idExists = products.some((product) => product.id === id && product.id !== oldId);
    productId.setCustomValidity(idExists ? 'Товар з таким ID вже існує' : '');
    return !idExists;
};

productForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const oldId = oldProductId.value;
    const newProduct = getFormProduct();

    const isIdValid = checkId(newProduct.id, oldId);

    if (!isIdValid || !productForm.reportValidity()) {
        productForm.reportValidity();
        return;
    }

    if (oldId) {
        products = editProduct(products, oldId, newProduct);
        showToast(`Інформацію про товар ID ${newProduct.id} "${newProduct.name}" успішно оновлено.`);
    } else {
        products = addProduct(products, newProduct);
        showToast(`Товар "${newProduct.name}" додано.`);
    }

    closeModal();
    render();
});

addProductBtn.addEventListener('click', () => openModal());
closeModalBtn.addEventListener('click', closeModal);
cancelModalBtn.addEventListener('click', closeModal);
productModal.addEventListener('click', (event) => {
    if (event.target === productModal) {
        closeModal();
    }
});

productId.addEventListener('input', () => {
    productId.setCustomValidity('');
});

render();
