const API_BASE = "https://poppino-backend-1.onrender.com";
const token = localStorage.getItem("token");

document.addEventListener("DOMContentLoaded", () => {
  let currentUser = null;
try {
  const u = localStorage.getItem("currentUser");
  if (u) currentUser = JSON.parse(u);
} catch {
  localStorage.removeItem("currentUser");
}

  // 🔐 Guard
  if (!currentUser) {
    window.location.href = "login.html";
    return;
  }

  // ===== FILL PROFILE DATA =====
  const nameSpan = document.getElementById("profile-name");
  const emailSpan = document.getElementById("profile-email");
  const phoneSpan = document.getElementById("profile-phone");
  const addressSpan = document.getElementById("profile-address");
  const ordersSpan = document.getElementById("profile-orders");

  nameSpan.innerText = currentUser.name;
  emailSpan.innerText = currentUser.email;
  phoneSpan.innerText = currentUser.phone;
  addressSpan.innerText = currentUser.address;

  // orders count
  const allOrders = JSON.parse(localStorage.getItem("orders")) || [];
  const myOrders = allOrders.filter(o => o.email === currentUser.email);
  ordersSpan.innerText = myOrders.length;

  // ===== EDIT / SAVE LOGIC =====
  const editBtn = document.getElementById("edit-profile-btn");
  const saveBtn = document.getElementById("save-profile-btn");

  const nameInput = document.getElementById("edit-name");
  const addressInput = document.getElementById("edit-address");

  // EDIT MODE
  editBtn.addEventListener("click", () => {
    nameInput.value = nameSpan.innerText;
    addressInput.value = addressSpan.innerText;

    nameSpan.style.display = "none";
    addressSpan.style.display = "none";

    nameInput.style.display = "block";
    addressInput.style.display = "block";

    editBtn.style.display = "none";
    saveBtn.style.display = "inline-block";
  });

  // SAVE MODE
  saveBtn.addEventListener("click", async () =>
 {
    const newName = nameInput.value.trim();
    const newAddress = addressInput.value.trim();

    if (newName.length < 2 || newAddress.length < 5) {
      alert("Please enter valid details");
      return;
    }

    // update current user
    try {
  const res = await fetch(`${API_BASE}/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "x-user-email": currentUser.email
    },
    body: JSON.stringify({
      name: newName,
      address: newAddress
    })
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.message || "Update failed");
    return;
  }

  // update localStorage with backend data
  localStorage.setItem("currentUser", JSON.stringify(data.user));

} catch (err) {
  alert("Server error");
  return;
}


    // update UI
    nameSpan.innerText = newName;
    addressSpan.innerText = newAddress;

    nameSpan.style.display = "inline";
    addressSpan.style.display = "inline";

    nameInput.style.display = "none";
    addressInput.style.display = "none";

    editBtn.style.display = "inline-block";
    saveBtn.style.display = "none";

    alert("Profile updated successfully");
  });
  // ===== RECENT ORDERS PREVIEW =====
const recentOrdersEl = document.getElementById("recent-orders");

if (recentOrdersEl) {
  if (myOrders.length === 0) {
    recentOrdersEl.innerHTML = "<p>No orders yet 📦</p>";
  } else {
    myOrders
      .slice(-3)           // last 3
      .reverse()           // latest first
      .forEach(order => {
        recentOrdersEl.innerHTML += `
          <div class="cart-item">
            <div>
              <h3>${order.orderId}</h3>
              <p>${order.date}</p>
              <p>Payment: ${order.paymentMethod}</p>
            </div>
            <span>₹${order.total}</span>
          </div>
        `;
      });
  }
}

});
