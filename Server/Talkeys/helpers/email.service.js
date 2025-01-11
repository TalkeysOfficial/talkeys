const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

exports.sendMail = async function (email, subject, html) {
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: 587,
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    },
    debug: true, // show debug output
  });

  // async..await is not allowed in global scope, must use a wrapper
  async function main() {
    try {
      const info = await transporter.sendMail({
        from: "no-reply@ccstiet.com", // sender address
        to: email, // list of receivers
        subject: subject, // Subject line
        html: html, // html body
      });
      console.log("Message sent: %s", info.messageId);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  }

  main().catch(console.error);
};
