let games = [];
const gamesContainer = document.getElementById('games-container');

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('data/games.json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        games = await response.json();
        
        if (window.location.pathname.includes('catalog.html')) {
            initCatalogPage();
        } else if (window.location.pathname.includes('Main.html')) {
            initMainPage();
        }
        
        initCommonElements();
        
    } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
        showError(error);
    }
});

function initCatalogPage() {
    if (!gamesContainer) return;
    
    document.getElementById('sort-select').addEventListener('change', (e) => {
        const sortType = e.target.value;
        sortGames(sortType);
    });
    
    displayGames(games);
}

function initMainPage() {
    const discountedGames = [...games]
        .filter(game => game.discount > 0)
        .sort((a, b) => b.discount - a.discount)
        .slice(0, 5);
    
    const discountsContainer = document.getElementById('discounts-container');
    if (discountsContainer) {
        displayGames(discountedGames, discountsContainer);
    }
    
    const bestsellersContainer = document.getElementById('bestsellers-container');
    if (bestsellersContainer) {
        const sectionTitle = bestsellersContainer.closest('.section').querySelector('.section-title');
        if (sectionTitle) {
            sectionTitle.textContent = 'Наш выбор';
        }
        
        const ourChoiceGames = [
            'Forza Horizon 5',
            'Grand Theft Auto V',
            'Minecraft',
            'Elden Ring',
            'Assassin\'s Creed Mirage'
        ];
        
        const filteredGames = games.filter(game => ourChoiceGames.includes(game.title));
        displayGames(filteredGames, bestsellersContainer);
    }
}

function initCommonElements() {
    const burgerBtn = document.querySelector('.burger-btn');
    const navMenu = document.querySelector('.nav-menu');
    
    if (burgerBtn && navMenu) {
        burgerBtn.addEventListener('click', () => {
            burgerBtn.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        document.addEventListener('click', (e) => {
            if (!burgerBtn.contains(e.target) && !navMenu.contains(e.target)) {
                burgerBtn.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
        
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                burgerBtn.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
}

function sortGames(sortType) {
    let sortedGames = [...games];
    
    switch (sortType) {
        case 'price-asc':
            sortedGames.sort((a, b) => {
                const priceA = calculateDiscountedPrice(a.price, a.discount);
                const priceB = calculateDiscountedPrice(b.price, b.discount);
                return priceA - priceB;
            });
            break;
        case 'price-desc':
            sortedGames.sort((a, b) => {
                const priceA = calculateDiscountedPrice(a.price, a.discount);
                const priceB = calculateDiscountedPrice(b.price, b.discount);
                return priceB - priceA;
            });
            break;
        case 'discount-desc':
            sortedGames.sort((a, b) => b.discount - a.discount);
            break;
    }
    
    displayGames(sortedGames);
}

function calculateDiscountedPrice(price, discount) {
    return price * (1 - discount / 100);
}

function formatPrice(price) {
    return `$${price.toFixed(2)}`;
}

function displayGames(gamesToDisplay, container = gamesContainer) {
    if (!container) return;
    
    container.innerHTML = '';
    gamesToDisplay.forEach(game => {
        const gameCard = createGameCard(game);
        container.appendChild(gameCard);
    });
}

function createGameCard(game) {
    const card = document.createElement('div');
    card.className = 'game-card';
    
    const discountedPrice = calculateDiscountedPrice(game.price, game.discount);
    
    card.innerHTML = `
        <div class="game-image-container">
            <img src="${game.image}" alt="${game.title}" class="game-image">
            ${game.discount > 0 ? `<div class="discount-badge">-${game.discount}%</div>` : ''}
        </div>
        <div class="game-info">
            <h3 class="game-title">${game.title}</h3>
            <div class="game-price-container">
                ${game.discount > 0 
                    ? `<span class="game-price old">${formatPrice(game.price)}</span>
                       <span class="game-price new">${formatPrice(discountedPrice)}</span>`
                    : `<span class="game-price">${formatPrice(game.price)}</span>`
                }
            </div>
            <button class="add-to-cart" data-game-id="${game.id}">В КОРЗИНУ</button>
        </div>
    `;

    card.addEventListener('click', (e) => {
        if (!e.target.classList.contains('add-to-cart')) {
            window.location.href = `game.html?id=${game.id}`;
        }
    });

    card.addEventListener('mouseenter', () => {
        card.style.transform = 'scale(1.03)';
        card.style.boxShadow = '0 5px 15px rgba(251, 187, 67, 0.2)';
        card.style.zIndex = '10';
        card.querySelector('.game-image').style.transform = 'scale(1.05)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.boxShadow = '';
        card.style.zIndex = '';
        card.querySelector('.game-image').style.transform = '';
    });

    return card;
}