




// Set mail options
let mailOptions = {
  from: process.env.SENDER_MAIL,  // Sender's email
  to: 'vedhasnaik121@gmail.com',  // Recipient's email
  subject: 'Test Email from Node.js',  // Email subject
  text: 'Hello, this is a test email sent from my Node.js app using Nodemailer!'  // Email body (plain text)
};

// Send the email
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.log('Error occurred:', error);
  } else {
    console.log('Email sent:', info.response);
  }
});
