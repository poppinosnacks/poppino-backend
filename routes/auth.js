const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const Otp = require("../models/otp");
const sendOtpMail = require("../utils/mailer");

/* ================= SEND OTP ================= */
router.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    // delete old OTPs for this email
    await Otp.deleteMany({ email });

    // generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // save OTP in DB
    await Otp.create({
      email,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes
    });

    // send OTP via email
    await sendOtpMail(email, otp);

    res.json({ message: "OTP sent to your email" });

  } catch (err) {
    console.error("Send OTP error:", err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
});

/* ================= VERIFY OTP + SIGNUP ================= */
router.post("/verify-otp", async (req, res) => {
  try {
    const { name, email, otp } = req.body;

    if (!email || !otp || !name) {
      return res.status(400).json({ message: "All fields required" });
    }

    const record = await Otp.findOne({ email, otp });

    if (!record) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (record.expiresAt < Date.now()) {
      await Otp.deleteMany({ email });
      return res.status(400).json({ message: "OTP expired" });
    }

    // check / create user
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ name, email });
    }

    // delete OTP after success
    await Otp.deleteMany({ email });

    // create JWT
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (err) {
    console.error("Verify OTP error:", err);
    res.status(500).json({ message: "Verification failed" });
  }
});

module.exports = router;