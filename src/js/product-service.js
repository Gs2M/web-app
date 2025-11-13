import StorageService from "./storageService.js";
import { products } from "./product-config.js";

const productService = {
    userDefault: {
        userId: "default_user",
    },
    buyProduct(productId) {
        const product = products.find(p => p.id === productId);
        if (product) {
            const userData = StorageService.get(this.userDefault.userId) || {};
            const shoppingCart = userData.shoppingCart || [];
            const existingItem = shoppingCart.find(item => item.productId === product.id);
            if (existingItem) {
                existingItem.quantity += 1;
            } 
            else {
                shoppingCart.push({
                    productId: product.id,
                    quantity: 1
                });
            }
            userData.shoppingCart = shoppingCart;
            StorageService.set(this.userDefault.userId, userData);
            // Here you can add further logic to actually add the product to a shopping cart
        } else {
            alert("Product not found!");
        }
    },
    setCartCount(productId) {
        const cartCountSpan = document.getElementById(`cart-count-${productId}`);
        if (!cartCountSpan) return;
        const userData = StorageService.get(this.userDefault.userId) || {};
        const cart = userData.shoppingCart || [];
        const quantity = cart.find(item => item.productId === productId).quantity;
        cartCountSpan.textContent = quantity;
    },
    setCartCounttotal(id = 'cart-count') {
        const cartCountTotalSpan = document.getElementById(id);
        if (!cartCountTotalSpan) return;
        cartCountTotalSpan.textContent = this.totalQuantity();
    },
    totalQuantity() {
        const userData = StorageService.get(this.userDefault.userId) || {};
        const cart = userData.shoppingCart || [];
        return cart.reduce((sum, item) => sum + item.quantity, 0);
    },
    payProducts() {
        const userData = StorageService.get(this.userDefault.userId) || {};
        const shoppingCart = userData.shoppingCart || [];  
        if (shoppingCart.length === 0) {
            alert("Bạn chưa chọn sản phẩm nào để thanh toán.");
            return;
        }
        localStorage.removeItem(this.userDefault.userId);
        alert("Thanh toán thành công!");
    },
    addEventListenerToBuyButtons() {
        const buttons = document.querySelectorAll(".cart-btn-action");
        buttons.forEach(button => {
            button.addEventListener("click", (event) => {
                const productId = parseInt(event.currentTarget.id, 10);
                this.buyProduct(productId);
                this.setCartCount(productId);
                this.setCartCounttotal();
            });
        });
    },
    buyProductsBatch(productId, quantity) {
        const product = products.find(p => p.id === productId);
        if (product) {
            const userData = StorageService.get(this.userDefault.userId) || {};
            const shoppingCart = userData.shoppingCart || [];
            const existingItem = shoppingCart.find(item => item.productId === product.id);  
            if (existingItem) {
                existingItem.quantity = quantity;
                userData.shoppingCart = shoppingCart;
                StorageService.set(this.userDefault.userId, userData);
            }
        } else {
            alert("Product not found!");
        }
    },
    loadPurchasedProducts() {
        const userData = StorageService.get(this.userDefault.userId) || {};
        const shoppingCart = userData.shoppingCart || [];   
        shoppingCart.forEach(item => {
            const cartCountSpan = document.getElementById(`cart-count-${item.productId}`);
            if (cartCountSpan) {
                cartCountSpan.textContent = item.quantity;
            }
        });
        this.setCartCounttotal();
    },
    purchasedProducts(userId) {
        const userData = StorageService.get(userId) || {};
        return userData.shoppingCart || [];
    }
}
export default productService;
