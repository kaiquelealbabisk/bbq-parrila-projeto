const CATEGORIES = [
  { key: "Todos", label: "Todos" },
  { key: "Classicos", label: "Cl&aacute;ssicos" },
  { key: "Especiais", label: "Especiais" },
  { key: "Combos", label: "Combos" },
  { key: "Acompanhamentos", label: "Acompanhamentos" },
  { key: "Bebidas", label: "Bebidas" },
];

const PRODUCTS = [
  // Troque o valor de image pelo caminho da sua foto, ex: "../img/produtos/classic-smash.jpg".
  {
    id: 1,
    cat: "Classicos",
    name: "Classic Smash",
    desc: "Pao brioche, burger smash, cheddar, picles e molho da casa.",
    price: 32.9,
    image: "https://picsum.photos/seed/classic-smash-burger/640/420",
  },
  {
    id: 2,
    cat: "Classicos",
    name: "Cheese Burger",
    desc: "Burger suculento, queijo prato, alface, tomate e maionese especial.",
    price: 34.9,
    image: "https://picsum.photos/seed/cheese-burger/640/420",
  },
  {
    id: 3,
    cat: "Classicos",
    name: "Chicken Crispy",
    desc: "Frango empanado crocante, cheddar, alface e molho ranch.",
    price: 31.9,
    image: "https://picsum.photos/seed/chicken-crispy-burger/640/420",
  },
  {
    id: 4,
    cat: "Especiais",
    name: "Double Bacon",
    desc: "Dois burgers smash, cheddar duplo, bacon crocante e molho especial.",
    price: 45.9,
    image: "https://picsum.photos/seed/double-bacon-burger/640/420",
  },
  {
    id: 5,
    cat: "Especiais",
    name: "House Burger",
    desc: "Burger artesanal, cheddar, cebola caramelizada, bacon e molho da casa.",
    price: 42.9,
    image: "https://picsum.photos/seed/house-burger/640/420",
  },
  {
    id: 6,
    cat: "Especiais",
    name: "Blue Cheese",
    desc: "Burger alto, queijo blue cheese, cebola roxa e geleia de pimenta.",
    price: 46.9,
    image: "https://picsum.photos/seed/blue-cheese-burger/640/420",
  },
  {
    id: 7,
    cat: "Combos",
    name: "Combo Familia Burger",
    desc: "Quatro burgers, duas batatas grandes e refrigerante 2L.",
    price: 139.9,
    image: "https://picsum.photos/seed/combo-familia-burger/640/420",
  },
  {
    id: 8,
    cat: "Combos",
    name: "Combo Casal Smash",
    desc: "Dois burgers, uma batata grande e duas bebidas.",
    price: 79.9,
    image: "https://picsum.photos/seed/combo-casal-smash/640/420",
  },
  {
    id: 9,
    cat: "Acompanhamentos",
    name: "Batata Cheddar Bacon",
    desc: "Batata frita crocante com cheddar cremoso e bacon.",
    price: 27.9,
    image: "https://picsum.photos/seed/batata-cheddar-bacon/640/420",
  },
  {
    id: 10,
    cat: "Acompanhamentos",
    name: "Onion Rings",
    desc: "Aneis de cebola crocantes com molho house da casa.",
    price: 24.9,
    image: "https://picsum.photos/seed/onion-rings/640/420",
  },
  {
    id: 11,
    cat: "Bebidas",
    name: "Refrigerante 2L",
    desc: "Coca-Cola, Guarana ou Sprite.",
    price: 14.9,
    image: "https://picsum.photos/seed/refrigerante-burger/640/420",
  },
  {
    id: 12,
    cat: "Bebidas",
    name: "Suco Natural",
    desc: "Laranja, limao ou abacaxi com hortela.",
    price: 11.9,
    image: "https://picsum.photos/seed/suco-natural/640/420",
  },
];

const PAYMENT_OPTIONS = [
  { key: "Pix", label: "Pix" },
  { key: "Cartão de crédito", label: "Cart&atilde;o de cr&eacute;dito" },
  { key: "Cartão de débito", label: "Cart&atilde;o de d&eacute;bito" },
  { key: "Vale refeição", label: "Vale refei&ccedil;&atilde;o" },
  { key: "Dinheiro", label: "Dinheiro" },
];
const DELIVERY_FEE = 8;
const FALLBACK_IMAGE = "https://picsum.photos/seed/burger-house/640/420";

let currentCategory = "Todos";
let cart = JSON.parse(localStorage.getItem("burger_cart") || "[]");
let checkoutData = { address: {}, payment: "" };

function money(value) {
  return (
    "R$ " +
    Number(value || 0)
      .toFixed(2)
      .replace(".", ",")
  );
}

function productImage(item) {
  return item.image || FALLBACK_IMAGE;
}

function saveCart() {
  localStorage.setItem("burger_cart", JSON.stringify(cart));
}

function getOrders() {
  return JSON.parse(localStorage.getItem("burger_orders") || "[]");
}

function saveOrders(orders) {
  localStorage.setItem("burger_orders", JSON.stringify(orders));
}

function getOrderStatus(order) {
  const elapsed = Date.now() - order.createdAt;
  if (elapsed >= 30000) return { label: "Entregue", step: "entregue" };
  if (elapsed >= 20000)
    return { label: "Saiu para entrega", step: "em_entrega" };
  if (elapsed >= 10000) return { label: "Na cozinha", step: "cozinha" };
  return { label: "Enviado ao restaurante", step: "enviado" };
}

function renderCategories() {
  document.getElementById("categoryRow").innerHTML = CATEGORIES.map(
    (cat) => `
    <button class="cat-btn ${cat.key === currentCategory ? "active" : ""}" data-category="${cat.key}">${cat.label}</button>
  `,
  ).join("");

  document.querySelectorAll(".cat-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      currentCategory = btn.dataset.category;
      renderCategories();
      renderProducts();
    });
  });
}

function renderProducts() {
  const products =
    currentCategory === "Todos"
      ? PRODUCTS
      : PRODUCTS.filter((product) => product.cat === currentCategory);
  document.getElementById("productGrid").innerHTML = products
    .map(
      (product) => `
    <article class="product-card">
      <div class="product-photo">
        <img src="${productImage(product)}" alt="${product.name}" loading="lazy">
      </div>
      <div class="product-body">
        <div class="product-name">${product.name}</div>
        <p class="product-desc">${product.desc}</p>
        <div class="product-foot">
          <span class="price">${money(product.price)}</span>
          <button class="add-btn" data-add="${product.id}">Adicionar</button>
        </div>
      </div>
    </article>
  `,
    )
    .join("");

  document.querySelectorAll("[data-add]").forEach((btn) => {
    btn.addEventListener("click", () => addToCart(Number(btn.dataset.add)));
  });
}

function addToCart(id) {
  const product = PRODUCTS.find((item) => item.id === id);
  const item = cart.find((entry) => entry.id === id);
  if (item) item.qty += 1;
  else cart.push({ ...product, qty: 1 });
  saveCart();
  renderCart();
}

function changeQty(id, delta) {
  const item = cart.find((entry) => entry.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter((entry) => entry.id !== id);
  saveCart();
  renderCart();
}

function totals() {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  return { subtotal, total: subtotal + DELIVERY_FEE };
}

function renderCart() {
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  document.getElementById("cartCount").textContent = count;
  const list = document.getElementById("cartItems");
  const footer = document.getElementById("cartFooter");

  if (!cart.length) {
    list.innerHTML = `<div class="empty">Seu carrinho esta vazio.</div>`;
    footer.innerHTML = "";
    return;
  }

  list.innerHTML = cart
    .map(
      (item) => `
    <div class="cart-item">
      <div class="cart-thumb">
        <img src="${productImage(item)}" alt="${item.name}">
      </div>
      <div>
        <div class="cart-title">${item.name}</div>
        <div class="cart-sub">${money(item.price * item.qty)}</div>
        <div class="qty-row">
          <button data-qty="${item.id}" data-delta="-1">-</button>
          <strong>${item.qty}</strong>
          <button data-qty="${item.id}" data-delta="1">+</button>
        </div>
      </div>
      <button class="remove-btn" data-remove="${item.id}">x</button>
    </div>
  `,
    )
    .join("");

  const value = totals();
  footer.innerHTML = `
    <div class="total-row"><span>Subtotal</span><strong>${money(value.subtotal)}</strong></div>
    <div class="total-row"><span>Entrega</span><strong>${money(DELIVERY_FEE)}</strong></div>
    <div class="total-row final"><span>Total</span><span>${money(value.total)}</span></div>
    <button class="primary-btn" id="checkoutBtn">Finalizar pedido</button>
  `;

  document.querySelectorAll("[data-qty]").forEach((btn) => {
    btn.addEventListener("click", () =>
      changeQty(Number(btn.dataset.qty), Number(btn.dataset.delta)),
    );
  });
  document.querySelectorAll("[data-remove]").forEach((btn) => {
    btn.addEventListener("click", () => {
      cart = cart.filter((item) => item.id !== Number(btn.dataset.remove));
      saveCart();
      renderCart();
    });
  });
  document
    .getElementById("checkoutBtn")
    .addEventListener("click", openCheckout);
}

function toggleCart(open) {
  document.getElementById("drawerBackdrop").classList.toggle("show", open);
  document.getElementById("cartDrawer").classList.toggle("show", open);
}

function openCheckout() {
  if (!cart.length) return;
  toggleCart(false);
  renderAddressStep();
  document.getElementById("checkoutModal").classList.add("show");
}

function closeCheckout() {
  document.getElementById("checkoutModal").classList.remove("show");
}

function renderAddressStep() {
  document.getElementById("checkoutTitle").textContent = "Endereço de entrega";
  document.getElementById("checkoutBody").innerHTML = `
    <div class="form-grid">
      <div>
        <label class="field-label">Rua</label>
        <input class="input" id="street" placeholder="Rua das Flores">
      </div>
      <div>
        <label class="field-label">Numero</label>
        <input class="input" id="number" placeholder="123">
      </div>
    </div>
    <label class="field-label">Bairro</label>
    <input class="input" id="district" placeholder="Centro">
    <label class="field-label">Complemento</label>
    <input class="input" id="complement" placeholder="Apto, bloco ou referencia">
    <button class="primary-btn" id="goPaymentBtn">Continuar</button>
  `;

  document.getElementById("goPaymentBtn").addEventListener("click", () => {
    const street = document.getElementById("street").value.trim();
    const number = document.getElementById("number").value.trim();
    const district = document.getElementById("district").value.trim();
    if (!street || !number || !district) {
      alert("Preencha rua, número e bairro.");
      return;
    }
    checkoutData.address = {
      street,
      number,
      district,
      complement: document.getElementById("complement").value.trim(),
    };
    renderPaymentStep();
  });
}

function renderPaymentStep() {
  const value = totals();
  document.getElementById("checkoutTitle").textContent = "Pagamento";
  document.getElementById("checkoutBody").innerHTML = `
    <p style="color:var(--muted)">Escolha a forma de pagamento.</p>
    <div class="pay-list">
      ${PAYMENT_OPTIONS.map(
        (option) => `
        <button class="pay-option" data-pay="${option.key}">
          <span>${option.label}</span><strong>${money(value.total)}</strong>
        </button>
      `,
      ).join("")}
    </div>
    <button class="primary-btn" id="confirmPaymentBtn">Confirmar pagamento</button>
  `;

  document.querySelectorAll("[data-pay]").forEach((btn) => {
    btn.addEventListener("click", () => {
      checkoutData.payment = btn.dataset.pay;
      document
        .querySelectorAll(".pay-option")
        .forEach((item) => item.classList.remove("selected"));
      btn.classList.add("selected");
    });
  });

  document.getElementById("confirmPaymentBtn").addEventListener("click", () => {
    if (!checkoutData.payment) {
      alert("Selecione uma forma de pagamento.");
      return;
    }
    if (checkoutData.payment === "Pix") renderPixCountdown();
    else finishOrder();
  });
}

function renderPixCountdown() {
  let seconds = 15;
  document.getElementById("checkoutTitle").textContent = "PIX";
  document.getElementById("checkoutBody").innerHTML = `
    <div class="qr-box">
      <div class="qr-code"></div>
      <strong>QR Code PIX</strong>
      <p>Pagamento sera confirmado automaticamente em <span class="countdown" id="pixSeconds">15</span>s.</p>
    </div>
  `;

  const interval = setInterval(() => {
    seconds -= 1;
    document.getElementById("pixSeconds").textContent = seconds;
    if (seconds <= 0) {
      clearInterval(interval);
      finishOrder();
    }
  }, 1000);
}

function finishOrder() {
  const value = totals();
  const id = "BG" + Math.floor(1000 + Math.random() * 9000);
  const user = JSON.parse(localStorage.getItem("burger_current_user") || "{}");
  const order = {
    id,
    cliente: user.nome || "Cliente Burger",
    address: checkoutData.address,
    payment: checkoutData.payment,
    items: cart,
    total: value.total,
    createdAt: Date.now(),
  };
  const orders = getOrders();
  orders.unshift(order);
  saveOrders(orders);
  localStorage.setItem("burger_track_id", id);
  cart = [];
  saveCart();
  renderCart();
  closeCheckout();
  window.location.href = "pedido.html";
}

function renderTrackingStrip() {
  const orders = getOrders();
  const area = document.getElementById("trackingActions");
  if (!orders.length) {
    area.innerHTML = `<span style="color:var(--muted)">Nenhum pedido em andamento.</span>`;
    return;
  }
  const latest = orders[0];
  const status = getOrderStatus(latest);
  area.innerHTML = `
    <span class="small-btn">#${latest.id} - ${status.label}</span>
    <a class="small-btn red" href="pedido.html" data-track="${latest.id}">Acompanhar</a>
  `;
  area.querySelector("[data-track]").addEventListener("click", () => {
    localStorage.setItem("burger_track_id", latest.id);
  });
}

document
  .getElementById("openCartBtn")
  .addEventListener("click", () => toggleCart(true));
document
  .getElementById("closeCartBtn")
  .addEventListener("click", () => toggleCart(false));
document
  .getElementById("drawerBackdrop")
  .addEventListener("click", () => toggleCart(false));
document
  .getElementById("closeCheckoutBtn")
  .addEventListener("click", closeCheckout);
document.getElementById("openOrdersBtn").addEventListener("click", () => {
  const orders = getOrders();
  if (orders[0]) {
    localStorage.setItem("burger_track_id", orders[0].id);
    window.location.href = "pedido.html";
  } else {
    alert("Você ainda não tem pedidos.");
  }
});

renderCategories();
renderProducts();
renderCart();
renderTrackingStrip();
setInterval(renderTrackingStrip, 1000);
