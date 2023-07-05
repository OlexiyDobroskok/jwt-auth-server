const nodemailer = require("nodemailer");
const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASSWORD,
  API_URL,
} = require("../utils/config");

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: true,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASSWORD,
  },
});

exports.sendActivationMail = async (to, link) =>
  transporter.sendMail({
    from: SMTP_USER,
    to,
    subject: `Activate your ${API_URL} account`,
    text: "",
    html: `
        <div>
            <h1>To activate your account follow the link</h1>
            <a href="${link}">${link}</a>  
        </div>
    `,
  });

exports.sendConfirmPasswordChangesMail = async (to, link) =>
  transporter.sendMail({
    from: SMTP_USER,
    to,
    subject: `Request to Reset Password`,
    text: "",
    html: `
        <div>
            <h1>To confirm your request to Reset your Password, please follow the link</h1>
            <a href="${link}">${link}</a>  
        </div>
    `,
  });
