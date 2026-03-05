const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_USER,
    pass: process.env.BREVO_PASS
  }
});

module.exports = async (to, subject, text) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.BREVO_USER,
      to,
      subject,
      text
    });

    console.log("Email sent:", info.response);

  } catch (err) {
    console.error("Mail error:", err);
    throw err;
  }
};