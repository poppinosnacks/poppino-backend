const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

router.post("/", async (req, res) => {
  try {

    const { name, phone, address, items, totalAmount } = req.body;

    const newOrder = new Order({
      name,
      phone,
      address,
      items,
      totalAmount
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