// const { MailtrapClient } = require("mailtrap");
// require('dotenv').config();    

// const TOKEN = process.env.MAILTRAP_TOKEN;

// const mailtrapClient = new MailtrapClient({
//   token: TOKEN,
// });

// const sender = {
//   email: process.env.EMAIL_FROM,
//   name: process.env.EMAIL_FROM_NAME,
// };


// module.exports = {
//   mailtrapClient,
//   sender
// }



const nodemailer = require('nodemailer');
require('dotenv').config();

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',  // Use gmail or 'smtp' for custom SMTP server
  auth: {
    user: process.env.SENDER_MAIL,  
    pass: process.env.SENDER_APP_PASSWORD  //  email password or app-specific password. app speficif use karo its more secure
  }
});

const sender = process.env.SENDER_MAIL;

module.exports = {
  transporter,
  sender
}