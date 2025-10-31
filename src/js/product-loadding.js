import { products } from "./product-config.js";

function onLoaded(callback, id) {
  // If already exists → trigger immediately
  const existing = document.getElementById(id);
  if (existing) {
    callback(existing);
    return;
  }

  // Otherwise, watch for it to appear
  const observer = new MutationObserver(() => {
    const el = document.getElementById(id);
    if (el) {
      callback(el);
      observer.disconnect(); // stop watching after found
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

onLoaded(function () {
  const productsContainer = document.getElementById("products-container");
  productsContainer.innerHTML += products.map(product => `
    <div class="col-lg-4 col-md-12 mb-4" style="width: 32%;">
      <div class="card" style="max-height: 500px;">
      <div class="bg-image hover-zoom ripple ripple-surface ripple-surface-light"
          data-mdb-ripple-color="light">
          <img src="${product.image}" class="w-100" style="height: 250px;"/>
          <a href="#!">
          <div class="mask">
              <div class="d-flex justify-content-start align-items-end h-100">
                <h5>
                  ${product.tags.map(t => `
                    <span class="${t.class}">${t.tag}</span>
                  `).join('')}
                </h5>
              </div>
          </div>
          <div class="hover-overlay">
              <div class="mask" style="background-color: rgba(251, 251, 251, 0.15);"></div>
          </div>
          </a>
      </div>
      <div class="card-body">
          <a href="" class="text-reset">
          <h5 class="card-title mb-3">${product.name}</h5>
          </a>
          <a href="" class="text-reset">
          <p>${product.category}</p>
          </a>
          <h6 class="mb-3">${product.price} ${product.currency}</h6>
      </div>
      </div>
    </div>
  `).join('');
  }, "products-container");
