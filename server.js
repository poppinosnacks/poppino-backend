/*************************************************
 * POPPINO D2C SERVER
 *************************************************/
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");   // 👈 AUTH ROUTES
const ordersRoutes = require("./routes/orders");

const app = express();

/* ========== MIDDLEWARE ========== */
app.use(cors());
app.use(express.json());

/* ========== MONGODB ========== */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

/* ========== ROUTES ========== */

// health check
app.get("/", (req, res) => {
  res.send("🚀 Poppino backend running");
});

// 🔐 AUTH ROUTES (OTP, signup, login)
app.use("/api", authRoutes);          // ✅ THIS WAS MISSING

// 🛒 ORDERS ROUTES
app.use("/api/orders", ordersRoutes);

/* ========== SERVER ========== */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
});