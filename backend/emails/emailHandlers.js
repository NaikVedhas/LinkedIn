
const {transporter,sender} = require('../lib/nodemailer')

const {createWelcomeEmailTemplate,
    createConnectionAcceptedEmailTemplate,
    createCommentNotificationEmailTemplate} = require('./emailTemplates');


const sendWelcomeEmail = async (email,name,profileUrl) =>{
    
    const  mailOptions = {
        from: sender,  
        to: email,  
        subject: 'Welcome to LinkedIn',  
        html: createWelcomeEmailTemplate(name,profileUrl)  //todo
    };
    
    
    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
        console.log('Error occurred:', error);
        } else {
        console.log('Email sent:', info.response);
        }
    });
    
}

//order of argumnets matter argument names dont matter (for all these functions)
const sendCommentNotificationEmail = async (email,recipientName, commenterName, postUrl, commentContent) =>{

    const  mailOptions = {
        from: sender,  
        to: email,  
        subject: `${commenterName}  commented on your post `,   
        html: createCommentNotificationEmailTemplate(recipientName, commenterName, postUrl, commentContent) 
    };
    
    
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
        console.log('Error occurred:', error);
        } else {
        console.log('Email sent:', info.response);
        }
    });
    

}

const sendConnectionAcceptedEmail = async () =>{
    const  mailOptions = {
        from: sender,  
        to: email,  
        subject: ' user accepted ur connection request ',   //todo
        html: createConnectionAcceptedEmailTemplate() //todo
    };
    
    
    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
        console.log('Error occurred:', error);
        } else {
        console.log('Email sent:', info.response);
        }
    });
    
}


module.exports = {
    sendWelcomeEmail,
    sendCommentNotificationEmail,
    sendConnectionAcceptedEmail
}