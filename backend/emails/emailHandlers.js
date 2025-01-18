const {transporter,sender} = require('../lib/nodemailer')

const {createWelcomeEmailTemplate,
    createConnectionAcceptedEmailTemplate,
    createCommentNotificationEmailTemplate,
    createSendOTP} = require('./emailTemplates');


    const sendOTP = async (email,name,otp,verificationUrl) =>{
        const  mailOptions = {
            from: sender,  
            to: email,  
            subject: 'Verify your OTP',  
            html: createSendOTP(name,otp,verificationUrl)  
        };
        
        
        // Send the email
        transporter.sendMail(mailOptions, (error) => {
            if (error) {
            console.log('Error occurred:', error);
            } else {
            console.log('Email sent');
            }
        });
    }

    const sendWelcomeEmail = async (email,name,profileUrl) =>{
    
    const  mailOptions = {
        from: sender,  
        to: email,  
        subject: 'Welcome to LinkedIn',  
        html: createWelcomeEmailTemplate(name,profileUrl)  //todo
    };
    
    
    // Send the email
    transporter.sendMail(mailOptions, (error) => {
        if (error) {
        console.log('Error occurred:', error);
        } else {
        console.log('Email sent');
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
        
        
        transporter.sendMail(mailOptions, (error) => {
            if (error) {
            console.log('Error occurred:', error);
            } else {
            console.log('Email sent');
            }
        });
        

    }

    const sendConnectionAcceptedEmail = async (senderName,recipientName, profileUrl,email) =>{
        
        //this recipientName is the one who has accepted the request and so we need to send email to senderName that receipnet accepted ur request

        const  mailOptions = {
            from: sender,  
            to: email,  
            subject: `Congratulations ${recipientName} accepted your connection request !`,   
            html: createConnectionAcceptedEmailTemplate(senderName,recipientName,profileUrl)
            };
        
        
        transporter.sendMail(mailOptions, (error) => {
            if (error) {
            console.log('Error occurred:', error);
            } else {
            console.log('Email sent');
            }
        });
        
    }


module.exports = {
    sendWelcomeEmail,
    sendCommentNotificationEmail,
    sendConnectionAcceptedEmail,
    sendOTP
}