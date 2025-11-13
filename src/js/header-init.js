import productService from './product-service.js';

export function initHeader() {
    try {
        // Update total cart count badge
        const cartCountEl = document.getElementById('cart-count');
        if (cartCountEl) {
            cartCountEl.textContent = productService.totalQuantity() || '';
        }

        // Load per-product counts if present on page
        if (typeof productService.loadPurchasedProducts === 'function') {
            productService.loadPurchasedProducts();
        }

        // Sidebar interactions (if sidebar exists inside header)
        const sidebar = document.getElementById('sidebar');
        if (sidebar) {
            const headerEl = sidebar.querySelector('.offcanvas-header');
            sidebar.addEventListener('mouseenter', () => sidebar.classList.add('expanded'));
            sidebar.addEventListener('mouseleave', () => sidebar.classList.remove('expanded'));
            if (headerEl) {
                headerEl.addEventListener('click', () => sidebar.classList.toggle('expanded'));
            }
        }

        // Attach buy button listeners (if product list exists on the page)
        if (typeof productService.addEventListenerToBuyButtons === 'function') {
            productService.addEventListenerToBuyButtons();
        }

        console.log('header-init: initialized');
    } catch (err) {
        console.error('header-init error', err);
    }
}
