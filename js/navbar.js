// js/navbar.js
document.addEventListener("DOMContentLoaded", () => {
  const userBtn = document.getElementById("user-btn");
  const userName = document.getElementById("user-name");
  const dropdown = document.getElementById("user-dropdown");
  const logoutBtn = document.getElementById("logout-btn");

  let currentUser = null;
  try {
    const u = localStorage.getItem("currentUser");
    if (u) currentUser = JSON.parse(u);
  } catch {
    localStorage.removeItem("currentUser");
  }

  // ❌ Not logged in
  if (!currentUser) {
    if (userBtn) userBtn.style.display = "none";
    return;
  }

  // ✅ Logged in
  const firstName = currentUser.name?.split(" ")[0] || "User";
  userName.innerText = " " + firstName;

  if (firstName.length > 6) {
    userBtn.style.fontSize = "14px";
  }

  userBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    dropdown.classList.toggle("show");
  });

  document.addEventListener("click", () => {
    dropdown.classList.remove("show");
  });

  logoutBtn?.addEventListener("click", () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
    window.location.href = "login.html";
  });
});