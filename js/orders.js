const token = getToken();
const currentUser = getCurrentUser();

if (!token || !currentUser) {
  window.location.href = "login.html";
  return;
}
document.addEventListener("DOMContentLoaded", async () => {

  const API_BASE = "https://poppino-backend-1.onrender.com";
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "login.html";
    return;
  }

  const ordersList = document.getElementById("orders-list");
  if (!ordersList) return;

  try {
    const res = await fetch(`${API_BASE}/orders`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) {
      window.location.href = "login.html";
      return;
    }

    const orders = await res.json();

    if (!Array.isArray(orders) || orders.length === 0) {
      ordersList.innerHTML = "<p>No orders yet 📦</p>";
      return;
    }

    ordersList.innerHTML = "";

    orders.reverse().forEach(order => {

      let statusIcon = "⏳";
      if (order.status === "DELIVERED") statusIcon = "✅";
      if (order.status === "CANCELLED") statusIcon = "❌";

      let cancelBtn = "";
      if (order.status === "PLACED") {
        cancelBtn = `<button class="cancel-btn" onclick="cancelOrder('${order.id}')">Cancel</button>`;
      }

      ordersList.innerHTML += `
        <div class="cart-item">
          <div>
            <h3>${order.id} ${statusIcon}</h3>
            <p>Status: <strong>${order.status}</strong></p>
            <p>Ordered on: ${new Date(order.createdAt).toLocaleString()}</p>
            <p>Payment: ${order.paymentMethod}</p>
            <p>Total: ₹${order.totalAmount}</p>
          </div>
          ${cancelBtn}
        </div>
      `;
    });

  } catch (err) {
    console.error("Failed to load orders", err);
    ordersList.innerHTML = "<p>Error loading orders</p>";
  }

});

/* ================= CANCEL ORDER ================= */
async function cancelOrder(orderId) {
  if (!confirm("Are you sure you want to cancel this order?")) return;

  const API_BASE = "https://poppino-backend-1.onrender.com";
  const token = localStorage.getItem("token");

  try {
    const res = await fetch(`${API_BASE}/orders/${orderId}/cancel`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Cannot cancel order");
      return;
    }

    alert("Order cancelled");
    location.reload();

  } catch (err) {
    alert("Server error");
  }
}
