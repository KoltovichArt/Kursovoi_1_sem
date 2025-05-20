document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const gameId = urlParams.get('id');

    if (!gameId) {
        console.error('ID игры не указан');
        return;
    }

    try {
        const response = await fetch('../data/games.json');
        const games = await response.json();
        const game = games.find(g => g.id === gameId);

        if (!game) {
            console.error('Игра не найдена');
            return;
        }

        document.title = `${game.title} - SafeGames`;
        document.getElementById('game-image').src = game.image;
        document.getElementById('game-title').textContent = game.title;
        
        const priceContainer = document.getElementById('game-price');
        if (game.discount > 0) {
            const oldPrice = game.price;
            const newPrice = (game.price * (100 - game.discount) / 100).toFixed(2);
            priceContainer.innerHTML = `
                <span class="game-price old">$${oldPrice}</span>
                <span class="game-price new">$${newPrice}</span>
                <div class="discount-badge">-${game.discount}%</div>
            `;
        } else {
            priceContainer.innerHTML = `<span class="game-price">$${game.price}</span>`;
        }

        document.getElementById('game-year').textContent = game.year;
        document.getElementById('game-developer').textContent = game.developer;
        document.getElementById('game-publisher').textContent = game.publisher;
        document.getElementById('game-description').textContent = game.description;

        const addToCartButton = document.querySelector('.add-to-cart');
        if (addToCartButton) {
            addToCartButton.dataset.gameId = game.id;
        }

        if (game.minRequirements) {
            const minRequirementsList = document.getElementById('min-requirements');
            Object.entries(game.minRequirements).forEach(([key, value]) => {
                const li = document.createElement('li');
                li.innerHTML = `<strong>${formatRequirementKey(key)}:</strong> ${value}`;
                minRequirementsList.appendChild(li);
            });
        }

        if (game.recommendedRequirements) {
            const recommendedRequirementsList = document.getElementById('recommended-requirements');
            Object.entries(game.recommendedRequirements).forEach(([key, value]) => {
                const li = document.createElement('li');
                li.innerHTML = `<strong>${formatRequirementKey(key)}:</strong> ${value}`;
                recommendedRequirementsList.appendChild(li);
            });
        }

    } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
    }
});

function formatRequirementKey(key) {
    const keyMap = {
        'os': 'Операционная система',
        'processor': 'Процессор',
        'memory': 'Оперативная память',
        'graphics': 'Видеокарта',
        'storage': 'Место на диске'
    };
    return keyMap[key] || key;
}; 