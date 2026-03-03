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
      from: "poppinosnacks@gmail.com",
      to,
      subject,
      text
    });

    console.log("Brevo email sent:", info.response);
  } catch (err) {
    console.error("Brevo mail error:", err);
    throw err;
  }
};