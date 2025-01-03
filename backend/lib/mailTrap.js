const { MailtrapClient } = require("mailtrap");
require('dotenv').config();    

const TOKEN = process.env.MAILTRAP_TOKEN;

const mailtrapClient = new MailtrapClient({
  token: TOKEN,
});

const sender = {
  email: process.env.EMAIL_FROM,
  name: process.env.EMAIL_FROM_NAME,
};


module.exports = {
  mailtrapClient,
  sender
}