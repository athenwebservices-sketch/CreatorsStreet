const nodemailer = require('nodemailer');
console.log(process.env.SMTP_PASS)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: true, // true for port 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendMail = async ({ to, subject, text, html }) => {
  try {
    if(process.env.EMAIL_SWITCH=="YES"){
        //console.log("hi")
    //console.log(process.env.SMTP_PASS)
    const info = await transporter.sendMail({
      from: `"No Reply" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
      html,
    });
    console.log('Email sent successfully:', info.messageId);
}
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = sendMail;
