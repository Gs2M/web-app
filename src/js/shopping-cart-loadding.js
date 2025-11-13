import { products } from "./product-config.js";
import productService from "./product-service.js";
import currency from "./currency.js";

function onLoaded(callback, id) {
  // If already exists → trigger immediately
  const existing = document.getElementById(id);
  if (existing) {
    callback(existing);
    totalPurchased();
    totalItemPurchased();
    addEventListenerToChangeQuantity();
    return;
  }

  // Otherwise, watch for it to appear
  const observer = new MutationObserver(() => {
    const el = document.getElementById(id);
    if (el) {
    //   callback(el);
      observer.disconnect(); // stop watching after found
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

onLoaded(function () {
  const purchased = productService.purchasedProducts(productService.userDefault.userId);
  const purchasedMap = new Map(purchased.map(item => [item.productId, item.quantity]));
  // Filter products and attach quantity in a single pass
  const purchasedProducts = products
  .filter(product => purchasedMap.has(product.id))
  .map(product => ({
      ...product,
      quantity: purchasedMap.get(product.id),
      amount: purchasedMap.get(product.id) * product.price
  }));
  const productsContainer = document.getElementById("items-purchased");
  productsContainer.innerHTML += purchasedProducts.map(product => `
    <div class="row mb-4 d-flex justify-content-between align-items-center">
        <div class="col-md-2 col-lg-2 col-xl-2">
        <img
            src="${product.image}"
            class="img-fluid rounded-3" alt="${product.name}">
        </div>
        <div class="col-md-3 col-lg-3 col-xl-3">
        <h6 class="text-muted">${product.category}</h6>
        <h6 class="mb-0">${product.name}</h6>
        </div>
        <div class="col-md-3 col-lg-3 col-xl-2 d-flex">
        <button data-mdb-button-init data-mdb-ripple-init class="btn btn-link px-2"
            onclick="this.parentNode.querySelector('input[type=number]').stepDown()">
            <i class="fas fa-minus"></i>
        </button>

        <input id="${product.id}" min="0" name="quantity" value="${product.quantity}" type="number"
            class="form-control form-control-sm items-purchased-quantity" />

        <button data-mdb-button-init data-mdb-ripple-init class="btn btn-link px-2"
            onclick="this.parentNode.querySelector('input[type=number]').stepUp()">
            <i class="fas fa-plus"></i>
        </button>
        </div>
        <div class="col-md-3 col-lg-2 col-xl-2 offset-lg-1">
        <h6 class="mb-0">${currency.format(product.amount)}</h6>
        </div>
        <div class="col-md-1 col-lg-1 col-xl-1 text-end">
        <a href="#!" class="text-muted"><i class="fas fa-times"></i></a>
        </div>
    </div>
    <hr class="my-4">
  `).join('');
  }, "items-purchased");

function totalPurchased() {
    const totalPurchasedAmount = currency.format(
        productService.purchasedProducts(productService.userDefault.userId)
        .reduce((sum, item) => {
            const product = products.find(p => p.id === item.productId);
            return sum + (product ? product.price * item.quantity : 0);
        }, 0)
    );
    document.getElementById('total-pay').textContent = totalPurchasedAmount;
    document.getElementById('total-amount').textContent = totalPurchasedAmount;
}
function totalItemPurchased() {
    const totalItems = productService.purchasedProducts(productService.userDefault.userId)
        .reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('item-purchased').textContent = `${totalItems} items`;
}

function addEventListenerToChangeQuantity() {
    const inputs = document.querySelectorAll(".items-purchased-quantity");

    inputs.forEach(input => {
        input.addEventListener("change", (event) => {
            const productId = Number(event.currentTarget.id); // cleaner than parseInt
            productService.buyProductsBatch(productId, Number(event.target.value));             // use object reference
            productService.setCartCounttotal();
            totalPurchased();
            totalItemPurchased();
        });
    });
}
