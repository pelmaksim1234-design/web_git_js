const products = new Map();
const productNames = new Set();
const orders = new Set();
const orderDetails = new Map();

const productHistory = new WeakMap();
const rowMeta = new WeakMap();
const highlightedRows = new WeakSet();

const productForm = document.getElementById('product-form');
const productIdInput = document.getElementById('product-id');
const productNameInput = document.getElementById('product-name');
const productPriceInput = document.getElementById('product-price');
const productStockInput = document.getElementById('product-stock');

const deleteProductIdInput = document.getElementById('delete-product-id');
const searchProductNameInput = document.getElementById('search-product-name');
const orderProductIdInput = document.getElementById('order-product-id');
const orderQuantityInput = document.getElementById('order-quantity');

const updateProductBtn = document.getElementById('update-product-btn');
const deleteProductBtn = document.getElementById('delete-product-btn');
const searchProductBtn = document.getElementById('search-product-btn');
const orderProductBtn = document.getElementById('order-product-btn');

const shopStatus = document.getElementById('shop-status');
const searchResult = document.getElementById('search-result');
const historyResult = document.getElementById('history-result');
const productList = document.getElementById('product-list');
const orderList = document.getElementById('order-list');

function normalizeName(name) {
    return name.trim().toLowerCase();
}

function getFormProduct() {
    return {
        id: productIdInput.value.trim(),
        name: productNameInput.value.trim(),
        price: Number(productPriceInput.value),
        stock: Number(productStockInput.value)
    };
}

function resetForm() {
    productForm.reset();
    productIdInput.focus();
}

function setStatus(message, isError = false) {
    shopStatus.textContent = message;
    shopStatus.classList.toggle('error', isError);
}

function formatMoney(value) {
    return `${value.toFixed(2)} грн`;
}

function refreshNameSet() {
    productNames.clear();
    products.forEach((product) => {
        productNames.add(normalizeName(product.name));
    });
}

function saveProductHistory(product, action, previousData = null) {
    const history = productHistory.get(product) ?? [];

    history.push({
        action,
        previousData,
        currentData: {
            name: product.name,
            price: product.price,
            stock: product.stock
        },
        changedAt: new Date()
    });

    productHistory.set(product, history);
}

function renderProducts() {
    productList.innerHTML = '';

    if (products.size === 0) {
        productList.innerHTML = '<p class="empty-list">Товарів ще немає</p>';
        return;
    }

    products.forEach((product, id) => {
        const row = document.createElement('div');
        row.className = 'product-row';
        row.dataset.id = id;
        row.innerHTML = `
            <strong>${product.name}</strong>
            <span>ID: ${id}</span>
            <span>Ціна: ${formatMoney(product.price)}</span>
            <span>На складі: ${product.stock}</span>
        `;

        rowMeta.set(row, {
            renderedAt: new Date(),
            productId: id
        });

        productList.appendChild(row);
    });
}

function renderOrders() {
    orderList.innerHTML = '';

    if (orders.size === 0) {
        orderList.innerHTML = '<p class="empty-list">Замовлень ще немає</p>';
        return;
    }

    Array.from(orders)
        .map((orderId) => orderDetails.get(orderId))
        .filter(Boolean)
        .sort((left, right) => right.createdAt - left.createdAt)
        .forEach((order) => {
            const row = document.createElement('div');
            row.className = 'product-row';
            row.innerHTML = `
                <strong>${order.orderId}</strong>
                <span>Товар: ${order.productName}</span>
                <span>Кількість: ${order.quantity}</span>
                <span>Сума: ${formatMoney(order.totalPrice)}</span>
            `;
            orderList.appendChild(row);
        });
}

function highlightProductRow(id) {
    const row = productList.querySelector(`[data-id="${id}"]`);
    if (!row) {
        return;
    }

    row.classList.add('highlight');
    highlightedRows.add(row);

    setTimeout(() => {
        if (highlightedRows.has(row)) {
            row.classList.remove('highlight');
        }
    }, 1500);
}

function showHistory(product) {
    const history = productHistory.get(product) ?? [];

    if (history.length === 0) {
        historyResult.textContent = 'Історія для цього товару відсутня';
        return;
    }

    const lastRecord = history[history.length - 1];
    const previousPrice = lastRecord.previousData ? formatMoney(lastRecord.previousData.price) : 'немає';
    const previousStock = lastRecord.previousData ? lastRecord.previousData.stock : 'немає';

    historyResult.textContent =
        `Остання дія: ${lastRecord.action}. Було: ціна ${previousPrice}, склад ${previousStock}. ` +
        `Зараз: ціна ${formatMoney(lastRecord.currentData.price)}, склад ${lastRecord.currentData.stock}.`;
}

function upsertProduct(product, action) {
    const previousProduct = products.get(product.id);
    const nextProduct = {
        id: product.id,
        name: product.name,
        price: product.price,
        stock: product.stock
    };

    if (previousProduct) {
        const history = productHistory.get(previousProduct) ?? [];
        productHistory.set(nextProduct, history);
    }

    saveProductHistory(
        nextProduct,
        action,
        previousProduct
            ? {
                name: previousProduct.name,
                price: previousProduct.price,
                stock: previousProduct.stock
            }
            : null
    );

    products.set(product.id, nextProduct);
    refreshNameSet();
    renderProducts();
    renderOrders();
    highlightProductRow(product.id);
    showHistory(nextProduct);

    return nextProduct;
}

productForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const product = getFormProduct();

    if (!product.id || !product.name || Number.isNaN(product.price) || Number.isNaN(product.stock)) {
        setStatus('Заповни всі поля коректно', true);
        return;
    }

    upsertProduct(product, 'Додавання');
    setStatus(`Товар ${product.name} збережено`);
    resetForm();
});

updateProductBtn.addEventListener('click', () => {
    const product = getFormProduct();

    if (!products.has(product.id)) {
        setStatus('Немає товару з таким ID для оновлення', true);
        return;
    }

    if (!product.name || Number.isNaN(product.price) || Number.isNaN(product.stock)) {
        setStatus('Для оновлення введи назву, ціну і кількість', true);
        return;
    }

    upsertProduct(product, 'Оновлення');
    setStatus(`Товар ${product.name} оновлено`);
    resetForm();
});

deleteProductBtn.addEventListener('click', () => {
    const id = deleteProductIdInput.value.trim();

    if (!products.has(id)) {
        setStatus('Товар для видалення не знайдено', true);
        return;
    }

    const deletedProduct = products.get(id);
    products.delete(id);
    refreshNameSet();
    renderProducts();
    historyResult.textContent = `Товар ${deletedProduct.name} видалено з каталогу`;
    setStatus(`Товар ${deletedProduct.name} видалено`);
    deleteProductIdInput.value = '';
});

searchProductBtn.addEventListener('click', () => {
    const query = normalizeName(searchProductNameInput.value);

    if (!query) {
        setStatus('Введи назву для пошуку', true);
        return;
    }

    if (!productNames.has(query)) {
        searchResult.textContent = 'Збігів не знайдено';
        historyResult.textContent = 'Історія для цього пошуку відсутня';
        setStatus('Товар із такою назвою відсутній', true);
        return;
    }

    const foundEntry = Array.from(products.entries()).find(([, product]) => normalizeName(product.name) === query);

    if (!foundEntry) {
        searchResult.textContent = 'Збігів не знайдено';
        setStatus('Не вдалося отримати дані про товар', true);
        return;
    }

    const [id, product] = foundEntry;
    searchResult.textContent =
        `ID: ${id}, назва: ${product.name}, ціна: ${formatMoney(product.price)}, на складі: ${product.stock}`;
    showHistory(product);
    highlightProductRow(id);
    setStatus(`Знайдено товар ${product.name}`);
});

orderProductBtn.addEventListener('click', () => {
    const id = orderProductIdInput.value.trim();
    const quantity = Number(orderQuantityInput.value);

    if (!products.has(id)) {
        setStatus('Товар для замовлення не знайдено', true);
        return;
    }

    if (!Number.isInteger(quantity) || quantity <= 0) {
        setStatus('Введи коректну кількість для замовлення', true);
        return;
    }

    const product = products.get(id);

    if (product.stock < quantity) {
        setStatus(`Недостатньо товару на складі. Доступно: ${product.stock}`, true);
        return;
    }

    const updatedProduct = upsertProduct(
        {
            ...product,
            stock: product.stock - quantity
        },
        'Замовлення'
    );

    const orderId = `ORD-${Date.now()}`;
    orders.add(orderId);
    orderDetails.set(orderId, {
        orderId,
        productId: id,
        productName: updatedProduct.name,
        quantity,
        totalPrice: updatedProduct.price * quantity,
        createdAt: new Date()
    });

    renderOrders();
    setStatus(`Замовлення ${orderId} оформлено`);
    orderProductIdInput.value = '';
    orderQuantityInput.value = '';
});

renderProducts();
renderOrders();
