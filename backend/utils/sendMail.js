const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

async function sendOtpMail(email, otp) {
  await transporter.sendMail({
    from: `"Poppino" <${process.env.MAIL_USER}>`,
    to: email,
    subject: "Your Poppino OTP",
    html: `
      <h2>Your OTP</h2>
      <p><b>${otp}</b></p>
      <p>This OTP is valid for 5 minutes.</p>
    `
  });
}

module.exports = sendOtpMail;