document.addEventListener('DOMContentLoaded', function() {
    const slider = document.querySelector('.hero-slider');
    const slides = document.querySelectorAll('.hero-slide');
    const prevBtn = document.querySelector('.slider-btn.prev');
    const nextBtn = document.querySelector('.slider-btn.next');
    const dotsContainer = document.querySelector('.slider-dots');
    
    let currentSlide = 0;
    const slideCount = slides.length;
    
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });
    
    const dots = document.querySelectorAll('.dot');
    
    function goToSlide(n) {
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');
        
        currentSlide = (n + slideCount) % slideCount;
        
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }
    
    prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
    nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));
    
    let slideInterval = setInterval(() => goToSlide(currentSlide + 1), 5000);
    
    slider.addEventListener('mouseenter', () => clearInterval(slideInterval));
    slider.addEventListener('mouseleave', () => {
        slideInterval = setInterval(() => goToSlide(currentSlide + 1), 5000);
    });

    slides.forEach(slide => {
        slide.addEventListener('click', (e) => {
            if (!e.target.classList.contains('hero-btn')) {
                const gameId = slide.dataset.gameId;
                if (gameId) {
                    window.location.href = `game.html?id=${gameId}`;
                }
            }
        });

        const addToCartBtn = slide.querySelector('.hero-btn');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const gameId = addToCartBtn.dataset.gameId;
                if (gameId) {
                    CartManager.addToCart(gameId);
                }
            });
        }
    });
}); 