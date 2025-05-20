async function loadGames() {
    try {
        const response = await fetch('../data/games.json');
        const games = await response.json();
        return games;
    } catch (error) {
        console.error('Ошибка при загрузке данных игр:', error);
        return [];
    }
}

function formatPrice(price) {
    return `$${price.toFixed(2)}`;
}

function calculateDiscountedPrice(price, discount) {
    return price * (1 - discount / 100);
}

function updateCartSummary(cart, games) {
    const itemsCount = document.getElementById('itemsCount');
    const totalPrice = document.getElementById('totalPrice');
    const checkoutBtn = document.getElementById('checkoutBtn');

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const total = cart.reduce((sum, item) => {
        const game = games.find(g => g.id === item.id);
        if (game) {
            const price = calculateDiscountedPrice(game.price, game.discount);
            return sum + price * item.quantity;
        }
        return sum;
    }, 0);

    itemsCount.textContent = totalItems;
    totalPrice.textContent = formatPrice(total);
    checkoutBtn.disabled = totalItems === 0;
}

function showEmptyCart() {
    const cartItems = document.getElementById('cartItems');
    cartItems.innerHTML = `
        <div class="empty-cart">
            <p>Ваша корзина пуста</p>
            <a href="catalog.html" class="return-to-catalog">Перейти в каталог</a>
        </div>
    `;
}

function updateItemQuantity(itemId, quantity) {
    const cart = CartManager.getCart();
    const cartIndex = cart.findIndex(item => item.id === itemId);
    
    if (cartIndex !== -1) {
        if (quantity <= 0) {
            cart.splice(cartIndex, 1);
        } else {
            cart[cartIndex].quantity = quantity;
        }
        CartManager.saveCart(cart);
        renderCart();
    }
}

function removeFromCart(itemId) {
    const cart = CartManager.getCart();
    const cartIndex = cart.findIndex(item => item.id === itemId);
    
    if (cartIndex !== -1) {
        cart.splice(cartIndex, 1);
        CartManager.saveCart(cart);
        renderCart();
    }
}

async function renderCart() {
    const cart = CartManager.getCart();
    const games = await loadGames();
    const cartItems = document.getElementById('cartItems');
    
    if (cart.length === 0) {
        showEmptyCart();
        updateCartSummary(cart, games);
        return;
    }

    cartItems.innerHTML = cart.map(item => {
        const game = games.find(g => g.id === item.id);
        if (!game) return '';

        const discountedPrice = calculateDiscountedPrice(game.price, game.discount);
        
        return `
            <div class="cart-item">
                <img src="${game.image}" alt="${game.title}" class="item-image">
                <div class="item-info">
                    <h3 class="item-title">${game.title}</h3>
                    <div class="item-price-container">
                        ${game.discount > 0 
                            ? `<span class="item-price discounted">${formatPrice(game.price)}</span>`
                            : ''
                        }
                        <span class="item-price">${formatPrice(discountedPrice)}</span>
                    </div>
                </div>
                <div class="item-controls">
                    <div class="quantity-controls">
                        <button onclick="updateItemQuantity('${item.id}', ${item.quantity - 1})">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateItemQuantity('${item.id}', ${item.quantity + 1})">+</button>
                    </div>
                    <button class="remove-btn" onclick="removeFromCart('${item.id}')">Удалить</button>
                </div>
            </div>
        `;
    }).join('');

    updateCartSummary(cart, games);
}

document.addEventListener('DOMContentLoaded', () => {
    renderCart();
});

const checkoutBtn = document.getElementById('checkoutBtn');
const checkoutModal = document.getElementById('checkoutModal');
const closeModal = document.querySelector('.close-modal');
const authTabs = document.querySelectorAll('.auth-tab');
const authForms = document.querySelectorAll('.auth-form');

checkoutBtn.addEventListener('click', () => {
    checkoutModal.classList.add('active');
    document.body.style.overflow = 'hidden';
});

closeModal.addEventListener('click', () => {
    checkoutModal.classList.remove('active');
    document.body.style.overflow = '';
});

checkoutModal.addEventListener('click', (e) => {
    if (e.target === checkoutModal) {
        checkoutModal.classList.remove('active');
        document.body.style.overflow = '';
    }
});

authTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        authTabs.forEach(t => t.classList.remove('active'));
        authForms.forEach(f => f.classList.remove('active'));
        
        tab.classList.add('active');
        const formId = tab.dataset.tab + 'Form';
        document.getElementById(formId).classList.add('active');
    });
});

document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
});

document.getElementById('registerForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
});

document.querySelector('.payment-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const cardNumber = document.getElementById('cardNumber').value;
    const expiryDate = document.getElementById('expiryDate').value;
    const cvv = document.getElementById('cvv').value;
    const cardName = document.getElementById('cardName').value;
});

const cardNumberInput = document.getElementById('cardNumber');
cardNumberInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    value = value.replace(/(\d{4})/g, '$1 ').trim();
    e.target.value = value;
});

const expiryDateInput = document.getElementById('expiryDate');
expiryDateInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    e.target.value = value;
});

const cvvInput = document.getElementById('cvv');
cvvInput.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 3);
}); 