const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

router.post("/", async (req, res) => {
  try {

    const { name, phone, address, items, totalAmount } = req.body;

   const orderId = "POP" + Date.now();  // 🔥 add this

const newOrder = new Order({
  orderId,   // 🔥 add this
  name,
  phone,
  address,
  items,
  totalAmount,
  paymentMethod
});

    const savedOrder = await newOrder.save();

    res.json({
      success: true,
      orderId: savedOrder._id
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false });
  }
});

module.exports = router;