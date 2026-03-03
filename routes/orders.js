const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const User = require("../models/User");

/* ================= CREATE ORDER ================= */
router.post("/", async (req, res) => {
  try {
    const { items, totalAmount, paymentMethod } = req.body;
    const userEmail = req.headers["x-user-email"];

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart empty" });
    }

    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const order = new Order({
      orderId: "POPPINO-" + Date.now(),
      user: user._id,
      items,
      totalAmount,
      paymentMethod
    });

    await order.save();

    res.status(201).json(order);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Order failed" });
  }
});

/* ================= GET MY ORDERS ================= */
router.get("/", async (req, res) => {
  try {
    const userEmail = req.headers["x-user-email"];
    const user = await User.findOne({ email: userEmail });

    if (!user) return res.status(401).json([]);

    const orders = await Order.find({ user: user._id }).sort({ createdAt: -1 });
    res.json(orders);

  } catch (err) {
    res.status(500).json([]);
  }
});

/* ================= CANCEL ORDER ================= */
router.put("/:id/cancel", async (req, res) => {
  try {
    await Order.findByIdAndUpdate(req.params.id, { status: "cancelled" });
    res.json({ message: "Cancelled" });
  } catch {
    res.status(500).json({ message: "Cancel failed" });
  }
});

module.exports = router;