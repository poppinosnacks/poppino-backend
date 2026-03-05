require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express(); // ✅ FIRST

/* middleware */
//const cors = require("cors");

app.use(cors({
  origin: "*"
}));
app.use(express.json());

/* routes */
const authRoutes = require("./routes/auth");
const ordersRoutes = require("./routes/orders");

app.use("/api/auth", authRoutes); // ✅ THIS IS ENOUGH
app.use("/api/orders", ordersRoutes);

/* health check */
app.get("/", (req, res) => {
  res.send("🚀 Poppino backend running");
});

/* db */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

/* server */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
});
app.get("/test", (req, res) => {
  res.send("Test route working");
});
app.post("/manual-test", (req, res) => {
  res.json({ working: true });
});
