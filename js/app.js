// ===== STATE =====
let currentCategory = "all";
let cart = [];

// ===== TELEGRAM WEB APP =====
let tg = null;
try {
    if (window.Telegram && window.Telegram.WebApp) {
        tg = window.Telegram.WebApp;
        tg.ready();
        tg.expand();
        tg.setHeaderColor("#1a1a2e");
        tg.setBackgroundColor("#1a1a2e");
    }
} catch (e) {
    console.log("Not running in Telegram WebView:", e);
}

// ===== BOT CONFIG =====
const BOT_TOKEN = "8679348399:AAFguQ3hBAO0ySBWSdBUa5L6yK9slASCJOo";

// ===== DOM ELEMENTS =====
const productsGrid = document.getElementById("productsGrid");
const categoriesNav = document.getElementById("categories");
const cartBtn = document.getElementById("cartBtn");
const cartOverlay = document.getElementById("cartOverlay");
const cartClose = document.getElementById("cartClose");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const productModal = document.getElementById("productModal");
const modalClose = document.getElementById("modalClose");
const modalContent = document.getElementById("modalContent");
const checkoutBtn = document.getElementById("checkoutBtn");

// ===== LOAD CART FROM LOCALSTORAGE =====
function loadCart() {
    try {
        const saved = localStorage.getItem("minishop_cart");
        if (saved) cart = JSON.parse(saved);
    } catch(e) { cart = []; }
    updateCartUI();
}

function saveCart() {
    localStorage.setItem("minishop_cart", JSON.stringify(cart));
}

// ===== RENDER CATEGORIES =====
function renderCategories() {
    categoriesNav.innerHTML = CATEGORIES.map(cat =>
        `<button class="chip ${cat.id === currentCategory ? 'active' : ''}" data-cat="${cat.id}">${cat.title}</button>`
    ).join("");
    categoriesNav.querySelectorAll(".chip").forEach(chip => {
        chip.addEventListener("click", () => {
            currentCategory = chip.dataset.cat;
            renderCategories();
            renderProducts();
        });
    });
}

// ===== RENDER PRODUCTS =====
function renderProducts() {
    const filtered = currentCategory === "all"
        ? PRODUCTS
        : PRODUCTS.filter(p => {
            const cats = p.categories || (p.category ? [p.category] : []);
            return cats.includes(currentCategory);
        });

    if (filtered.length === 0) {
        productsGrid.innerHTML = `<div class="empty-state"><div class="icon">🏍️</div><p>Нет товаров в этой категории</p></div>`;
        return;
    }

    productsGrid.innerHTML = filtered.map(p => {
        const img = p.images ? p.images[0] : p.image;
        return `
        <div class="product-card" data-id="${p.id}">
            <img class="product-thumb" src="${img}" alt="${p.title}" loading="lazy"
                onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 400 400%22><rect fill=%22%23e8e8f0%22 width=%22400%22 height=%22400%22/><text x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-size=%2260%22>🏍️</text></svg>'">
            <div class="product-info">
                <div class="product-title">${p.title}</div>
                <div class="product-price">${p.price.toLocaleString()} ₽ ${p.oldPrice ? `<span class="old-price">${p.oldPrice.toLocaleString()} ₽</span>` : ""}</div>
            </div>
        </div>
        `;
    }).join("");

    productsGrid.querySelectorAll(".product-card").forEach(card => {
        card.addEventListener("click", () => openProduct(+card.dataset.id));
    });
}

// ===== PRODUCT MODAL =====
function openProduct(id) {
    const p = PRODUCTS.find(x => x.id === id);
    if (!p) return;
    const images = p.images || (p.image ? [p.image] : []);
    let currentImgIdx = 0;

    function renderModalImg() {
        const imgHtml = images.length > 0
            ? `<div class="gallery">
                <img class="modal-img" src="${images[currentImgIdx]}" alt="${p.title}"
                    onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 600 450%22><rect fill=%22%23e8e8f0%22 width=%22600%22 height=%22450%22/><text x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-size=%2280%22>🏍️</text></svg>'">
                ${images.length > 1 ? `
                    <button class="gallery-prev" id="galleryPrev">◀</button>
                    <button class="gallery-next" id="galleryNext">▶</button>
                    <div class="gallery-counter">${currentImgIdx + 1} / ${images.length}</div>
                ` : ''}
               </div>`
            : `<div class="modal-img" style="display:flex;align-items:center;justify-content:center;background:#e8e8f0;font-size:80px;">🏍️</div>`;

        modalContent.innerHTML = `
            ${imgHtml}
            <div class="modal-body">
                <h2 class="modal-title">${p.title}</h2>
                <p class="modal-desc">${p.description}</p>
                <div class="modal-price-row">
                    <span class="modal-price">${p.price.toLocaleString()} ₽</span>
                    ${p.oldPrice ? `<span class="old-price" style="font-size:16px;color:var(--tg-hint);text-decoration:line-through">${p.oldPrice.toLocaleString()} ₽</span>` : ""}
                </div>
                <button class="add-to-cart-btn" id="addToCartBtn${p.id}">Добавить в корзину — ${p.price.toLocaleString()} ₽</button>
            </div>
        `;

        document.getElementById(`addToCartBtn${p.id}`).addEventListener("click", () => {
            addToCart(p.id);
            productModal.classList.remove("show");
        });

        if (images.length > 1) {
            document.getElementById("galleryPrev").addEventListener("click", (e) => {
                e.stopPropagation();
                currentImgIdx = (currentImgIdx - 1 + images.length) % images.length;
                renderModalImg();
            });
            document.getElementById("galleryNext").addEventListener("click", (e) => {
                e.stopPropagation();
                currentImgIdx = (currentImgIdx + 1) % images.length;
                renderModalImg();
            });
        }
    }

    renderModalImg();
    productModal.classList.add("show");
}

modalClose.addEventListener("click", () => productModal.classList.remove("show"));
productModal.addEventListener("click", (e) => {
    if (e.target === productModal) productModal.classList.remove("show");
});

// ===== CART =====
function addToCart(id) {
    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.qty++;
    } else {
        const p = PRODUCTS.find(x => x.id === id);
        const img = p.images ? p.images[0] : p.image;
        cart.push({ id: p.id, title: p.title, price: p.price, image: img, qty: 1 });
    }
    saveCart();
    updateCartUI();
    if (tg) tg.HapticFeedback.impactOccurred("light");
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    updateCartUI();
}

function changeQty(id, delta) {
    const item = cart.find(x => x.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) { removeFromCart(id); return; }
    saveCart();
    updateCartUI();
}

function updateCartUI() {
    const totalItems = cart.reduce((s, i) => s + i.qty, 0);
    const totalPrice = cart.reduce((s, i) => s + i.price * i.qty, 0);
    cartCount.textContent = totalItems;
    cartTotal.textContent = totalPrice.toLocaleString();

    if (cart.length === 0) {
        cartItems.innerHTML = `<div class="empty-state"><div class="icon">🏍️</div><p>Корзина пуста</p></div>`;
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img class="cart-item-thumb" src="${item.image}" alt=""
                onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 64 64%22><rect fill=%22%23e8e8f0%22 width=%2264%22 height=%2264%22/></svg>'">
            <div class="cart-item-info">
                <div class="cart-item-title">${item.title}</div>
                <div class="cart-item-price">${item.price.toLocaleString()} ₽</div>
                <div class="cart-item-qty">
                    <button class="qty-btn" data-action="dec" data-id="${item.id}">−</button>
                    <span>${item.qty}</span>
                    <button class="qty-btn" data-action="inc" data-id="${item.id}">+</button>
                </div>
            </div>
        </div>
    `).join("");

    cartItems.querySelectorAll(".qty-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = +btn.dataset.id;
            const delta = btn.dataset.action === "inc" ? 1 : -1;
            changeQty(id, delta);
        });
    });
}

cartBtn.addEventListener("click", () => {
    cartOverlay.classList.add("show");
    updateCartUI();
});
cartClose.addEventListener("click", () => cartOverlay.classList.remove("show"));
cartOverlay.addEventListener("click", (e) => {
    if (e.target === cartOverlay) cartOverlay.classList.remove("show");
});

// ===== SEND ORDER VIA BOT API =====
function sendOrder(name, phone, comment, totalPrice) {
    const tgUser = tg && tg.initDataUnsafe && tg.initDataUnsafe.user;
    const chatId = tgUser ? tgUser.id : null;

    const itemsText = cart.map(i => `• ${i.title} × ${i.qty} = ${i.price * i.qty} ₽`).join("\n");
    const orderText = [
        "🆕 <b>НОВЫЙ ЗАКАЗ!</b>",
        "",
        `👤 Имя: <b>${name}</b>`,
        `📞 Телефон: <code>${phone}</code>`,
        `💬 Комментарий: ${comment || "—"}`,
        "",
        "<b>Товары:</b>",
        itemsText,
        "",
        `💰 <b>Итого: ${totalPrice.toLocaleString()} ₽</b>`,
        tgUser ? `\n🆔 User: ${tgUser.id} | @${tgUser.username || "нет"}` : ""
    ].join("\n");

    if (chatId) {
        // Confirmation to buyer
        fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                chat_id: chatId,
                text: `✅ <b>Заказ отправлен!</b>\n\n${orderText}`,
                parse_mode: "HTML"
            })
        });
        // Order details
        fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                chat_id: chatId,
                text: orderText,
                parse_mode: "HTML"
            })
        });
    }

    // Clear cart
    cart = [];
    saveCart();
    updateCartUI();
}

// ===== CHECKOUT =====
checkoutBtn.addEventListener("click", () => {
    if (cart.length === 0) return;
    const totalPrice = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const orderLines = cart.map(i => `• ${i.title} × ${i.qty} = ${(i.price * i.qty).toLocaleString()} ₽`).join("\n");

    cartItems.innerHTML = `
        <div class="checkout-form">
            <h3 style="margin-bottom:16px">Оформление заказа</h3>
            <div class="form-group">
                <label>Ваше имя</label>
                <input type="text" id="orderName" placeholder="Иван Иванов">
            </div>
            <div class="form-group">
                <label>Телефон</label>
                <input type="tel" id="orderPhone" placeholder="+7 (999) 123-45-67">
            </div>
            <div class="form-group">
                <label>Комментарий</label>
                <textarea id="orderComment" rows="3" placeholder="Адрес, пожелания..."></textarea>
            </div>
            <div style="background:var(--tg-secondary-bg);padding:14px;border-radius:12px;margin-bottom:16px;font-size:13px;white-space:pre-line">${orderLines}\n\n<b>Итого: ${totalPrice.toLocaleString()} ₽</b></div>
            <button class="checkout-btn" id="submitOrder">Отправить заказ</button>
        </div>
    `;

    document.getElementById("submitOrder").addEventListener("click", () => {
        const name = document.getElementById("orderName").value.trim();
        const phone = document.getElementById("orderPhone").value.trim();
        const comment = document.getElementById("orderComment").value.trim();

        if (!name || !phone) {
            if (tg) tg.HapticFeedback.notificationOccurred("error");
            alert("Заполните имя и телефон");
            return;
        }

        sendOrder(name, phone, comment, totalPrice);

        if (tg) {
            tg.HapticFeedback.notificationOccurred("success");
            tg.close();
        } else {
            alert("Заказ оформлен! (режим разработки)");
            cartOverlay.classList.remove("show");
        }
    });
});

// ===== INIT =====
loadCart();
renderCategories();
renderProducts();
