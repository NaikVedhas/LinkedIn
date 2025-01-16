const nodemailer = require('nodemailer');
require('dotenv').config();

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',  // Use gmail or 'smtp' for custom SMTP server
  auth: {
    user: process.env.SENDER_MAIL,  
    pass: process.env.SENDER_APP_PASSWORD  //  email password or app-specific password. app specific use karo its more secure
  }
});

const sender = process.env.SENDER_MAIL;

module.exports = {
  transporter,
  sender
}