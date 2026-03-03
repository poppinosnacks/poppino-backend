const API_BASE = "http://localhost:5000/api";
const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "login.html";
}

document.addEventListener("DOMContentLoaded", () => {
  loadUsers();
  loadOrders();
});

/* ================= USERS ================= */
async function loadUsers() {
  const usersList = document.getElementById("users-list");

  try {
    const res = await fetch(`${API_BASE}/admin/users`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) {
      usersList.innerHTML = "<p>Access denied</p>";
      return;
    }

    const users = await res.json();

    usersList.innerHTML = "";
    users.forEach(u => {
      usersList.innerHTML += `
        <div class="admin-card">
          <strong>${u.name}</strong><br/>
          ${u.email}<br/>
          Joined: ${new Date(u.createdAt).toLocaleString()}
        </div>
      `;
    });

  } catch (err) {
    usersList.innerHTML = "<p>Error loading users</p>";
  }
}

/* ================= ORDERS ================= */
async function loadOrders() {
  const ordersList = document.getElementById("orders-list");

  try {
    const res = await fetch(`${API_BASE}/admin/orders`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) {
      ordersList.innerHTML = "<p>Access denied</p>";
      return;
    }

    const orders = await res.json();

    ordersList.innerHTML = "";
    orders.reverse().forEach(o => {
      ordersList.innerHTML += `
        <div class="admin-card">
          <strong>${o.id}</strong><br/>
User: ${o.user ? `${o.user.name} (${o.user.email})` : "Unknown User"}<br/>

Amount: ₹${o.totalAmount}<br/>
Status:
<select onchange="updateStatus('${o.id}', this.value)">
  <option value="PLACED" ${o.status === "PLACED" ? "selected" : ""}>PLACED</option>
  <option value="SHIPPED" ${o.status === "SHIPPED" ? "selected" : ""}>SHIPPED</option>
  <option value="DELIVERED" ${o.status === "DELIVERED" ? "selected" : ""}>DELIVERED</option>
  <option value="CANCELLED" ${o.status === "CANCELLED" ? "selected" : ""}>CANCELLED</option>
        </div>
      `;
    });

  } catch (err) {
    ordersList.innerHTML = "<p>Error loading orders</p>";
  }
}

/* ================= UPDATE STATUS ================= */
async function updateStatus(orderId, status) {
  await fetch(`${API_BASE}/admin/orders/${orderId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ status })
  });
}
