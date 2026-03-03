const API_BASE = "https://poppino-backend-1.onrender.com/api/auth";

const btn = document.getElementById("signup-btn");
const msg = document.getElementById("signup-msg");

btn.addEventListener("click", async () => {
  const name = document.getElementById("signup-name").value.trim();
  const phone = document.getElementById("signup-phone").value.trim();
  const address = document.getElementById("signup-address").value.trim();
  const email = document.getElementById("signup-email").value.trim();

  if (!email) {
    msg.innerText = "Email required";
    return;
  }

  msg.innerText = "Sending OTP...";

  try {
    const res = await fetch(`${API_BASE}/send-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone, address })
    });

    const data = await res.json();

    if (!res.ok) {
      msg.innerText = data.message || "OTP failed";
      return;
    }

    // save user temporarily
    localStorage.setItem(
      "otpUser",
      JSON.stringify({ name, email, phone, address })
    );

    window.location.href = "verify-otp.html";

  } catch (err) {
    console.error(err);
    msg.innerText = "Server error";
  }
});