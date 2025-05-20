const CartManager = {
    getCart() {
        const cart = localStorage.getItem('cart');
        return cart ? JSON.parse(cart) : [];
    },

    saveCart(cart) {
        localStorage.setItem('cart', JSON.stringify(cart));
    },

    addToCart(gameId) {
        const cart = this.getCart();
        const existingItem = cart.find(item => item.id === gameId);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ id: gameId, quantity: 1 });
        }

        this.saveCart(cart);
        this.updateCartIcon();
        this.showAddedToCartNotification();
    },

    updateCartIcon() {
        const cart = this.getCart();
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        
        const cartIcons = document.querySelectorAll('.cart-icon-container');
        
        cartIcons.forEach(container => {
            let badge = container.querySelector('.cart-badge');
            
            if (totalItems > 0) {
                if (!badge) {
                    badge = document.createElement('div');
                    badge.className = 'cart-badge';
                    container.appendChild(badge);
                }
                badge.textContent = totalItems;
                badge.style.display = 'flex';
            } else if (badge) {
                badge.style.display = 'none';
            }
        });
    },

    showAddedToCartNotification() {
        let notification = document.querySelector('.cart-notification');
        
        if (!notification) {
            notification = document.createElement('div');
            notification.className = 'cart-notification';
            document.body.appendChild(notification);
        }

        notification.textContent = 'Товар добавлен в корзину';
        notification.classList.add('show');

        setTimeout(() => {
            notification.classList.remove('show');
        }, 2000);
    },

    init() {
        this.updateCartIcon();

        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-to-cart')) {
                const gameId = e.target.dataset.gameId;
                if (gameId) {
                    this.addToCart(gameId);
                }
            }
        });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    CartManager.init();
}); 