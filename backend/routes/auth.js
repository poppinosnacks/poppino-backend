const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Otp = require("../models/Otp");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");

/* ================= SEND OTP ================= */
router.post("/send-otp", async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    const otp = crypto.randomInt(100000, 999999).toString();

    await Otp.deleteMany({ email });

    await Otp.create({
      email,
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000
    });

    await sendMail(
      email,
      "Poppino OTP Verification",
      `Your OTP is ${otp}. Valid for 5 minutes.`
    );

    res.json({ message: "OTP sent successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
});

/* ================= VERIFY OTP ================= */
router.post("/verify-otp", async (req, res) => {
  try {
    const { name, email, phone, address, otp } = req.body;

    const record = await Otp.findOne({ email, otp });

    if (!record) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (record.expiresAt < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({ name, email, phone, address });
    }

    await Otp.deleteMany({ email });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "OTP verification failed" });
  }
});

module.exports = router;