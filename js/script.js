document.addEventListener("DOMContentLoaded", () => {
  /* ================= CART STORAGE ================= */
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  /* ================= CART COUNT ================= */
  function updateCartCount() {
    let totalQty = 0;
    cart.forEach(item => totalQty += item.qty);

    const topCount = document.getElementById("cart-count");
    const bottomCount = document.getElementById("cart-count-bottom");

    if (topCount) topCount.innerText = totalQty;
    if (bottomCount) bottomCount.innerText = totalQty;
  }

  updateCartCount();

  /* ================= PRODUCT PAGE (+ / -) ================= */
  document.querySelectorAll(".flavour-card").forEach(card => {
    const name = card.querySelector("h3")?.innerText;
    const price = parseInt(
      card.querySelector(".price")?.innerText.replace("₹", "")
    );

    if (!name || !price) return;

    const plusBtn = card.querySelector(".plus");
    const minusBtn = card.querySelector(".minus");
    const qtyEl = card.querySelector(".qty");

    const existingItem = cart.find(i => i.name === name);
    qtyEl.innerText = existingItem ? existingItem.qty : 0;

    plusBtn?.addEventListener("click", () => {
      let item = cart.find(i => i.name === name);

      if (item) {
        item.qty++;
      } else {
        cart.push({ name, price, qty: 1 });
      }

      qtyEl.innerText = cart.find(i => i.name === name).qty;
      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartCount();
    });

    minusBtn?.addEventListener("click", () => {
      let item = cart.find(i => i.name === name);
      if (!item) return;

      item.qty--;
      if (item.qty <= 0) {
        cart = cart.filter(i => i.name !== name);
        qtyEl.innerText = 0;
      } else {
        qtyEl.innerText = item.qty;
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartCount();
    });
  });

  /* ================= CART PAGE ================= */
  const cartItemsEl = document.getElementById("cart-items");
  const cartTotalEl = document.getElementById("cart-total");

  if (cartItemsEl && cartTotalEl) renderCart();

  function renderCart() {
    cartItemsEl.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
      cartItemsEl.innerHTML = "<p>Your cart is empty 🛒</p>";
      cartTotalEl.innerText = "0";
      return;
    }

    cart.forEach((item, index) => {
      total += item.price * item.qty;

      cartItemsEl.innerHTML += `
        <div class="cart-item">
          <div>
            <h3>${item.name}</h3>
            <p>₹${item.price}</p>
          </div>
          <div class="cart-qty">
            <button class="cart-minus" data-index="${index}">−</button>
            <span>${item.qty}</span>
            <button class="cart-plus" data-index="${index}">+</button>
          </div>
        </div>
      `;
    });

    cartTotalEl.innerText = total;

    document.querySelectorAll(".cart-plus").forEach(btn => {
      btn.addEventListener("click", () => {
        cart[btn.dataset.index].qty++;
        saveAndRefresh();
      });
    });

    document.querySelectorAll(".cart-minus").forEach(btn => {
      btn.addEventListener("click", () => {
        cart[btn.dataset.index].qty--;
        if (cart[btn.dataset.index].qty <= 0) {
          cart.splice(btn.dataset.index, 1);
        }
        saveAndRefresh();
      });
    });
  }

  function saveAndRefresh() {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    renderCart();
  }

  /* ================= CHECKOUT PAGE ================= */
  const checkoutItemsEl = document.getElementById("checkout-items");
  const checkoutTotalEl = document.getElementById("checkout-total");
  const checkoutForm = document.getElementById("checkout-form");

  if (checkoutItemsEl && checkoutTotalEl) {
    let total = 0;
    checkoutItemsEl.innerHTML = "";

    cart.forEach(item => {
      total += item.price * item.qty;
      checkoutItemsEl.innerHTML += `
        <div class="checkout-item">
          <span>${item.name} × ${item.qty}</span>
          <span>₹${item.price * item.qty}</span>
        </div>
      `;
    });

    checkoutTotalEl.innerText = total;
  }

  if (checkoutForm) {
    checkoutForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const currentUser = getCurrentUser();
      const token = getToken();

      if (!currentUser || !token) {
        alert("Please login to place your order");
        window.location.href = "login.html";
        return;
      }

      if (cart.length === 0) {
        alert("Your cart is empty");
        return;
      }

      let total = 0;
      cart.forEach(item => total += item.price * item.qty);

      try {
        const res = await fetch("http://localhost:5000/api/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-user-email": currentUser.email
          },
          body: JSON.stringify({
            items: cart,
            totalAmount: total,
            paymentMethod: "COD"
          })
        });

        if (!res.ok) {
          const data = await res.json();
          alert(data.message || "Order failed");
          return;
        }

        localStorage.removeItem("cart");
        window.location.href = "success.html";

      } catch (err) {
        alert("Server error");
      }
    });
  }
});