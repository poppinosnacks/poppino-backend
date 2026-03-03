const express = require("express");
const router = express.Router();

router.post("/send-otp", (req, res) => {
  res.json({ message: "OTP route working" });
});

module.exports = router;