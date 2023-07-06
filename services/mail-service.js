const nodemailer = require("nodemailer");
const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASSWORD,
  CLIENT_URL,
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
    subject: `Activate your ${CLIENT_URL} account`,
    text: "",
    html: `
        <div>
            <h1>To activate your account follow the link</h1>
            <a href="${link}">${link}</a>  
        </div>
    `,
  });

exports.sendResetPasswordMail = async (to, link) =>
  transporter.sendMail({
    from: SMTP_USER,
    to,
    subject: `[${CLIENT_URL}]Request to Reset Password`,
    text: "",
    html: `
        <div>
            <h1>To confirm your request to Reset your Password, please follow the link</h1>
            <a href="${link}">${link}</a>  
        </div>
    `,
  });

exports.sendCongratsPassChangeMail = async (to) =>
  transporter.sendMail({
    from: SMTP_USER,
    to,
    subject: `[${CLIENT_URL}]Request to Change Password`,
    text: "",
    html: `
        <div>
            <h1>Congratulation!</h1>
            <p>Your password has been successfully changed!</p>  
        </div>
    `,
  });
