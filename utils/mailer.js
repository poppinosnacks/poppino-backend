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
    from: "Poppino <no-reply@poppino.com>",
    to: email,
    subject: "Your Poppino OTP",
    html: `
      <h2>Poppino Verification</h2>
      <p>Your OTP is:</p>
      <h1>${otp}</h1>
      <p>Valid for 5 minutes</p>
    `
  });
}

module.exports = sendOtpMail;