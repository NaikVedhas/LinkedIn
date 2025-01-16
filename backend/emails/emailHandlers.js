// const {mailtrapClient,sender} = require('../lib/mailTrap')
// const {
//     createWelcomeEmailTemplate,
//     createCommentNotificationEmailTemplate,
//     createConnectionAcceptedEmailTemplate 
//     } = require('./emailTemplates')

// const sendWelcomeEmail = async (email,name,profileUrl) =>{

//     const recipients  = [{email}];      //this 

//     try {
//         const response = await mailtrapClient.send({
//             from:sender,
//             to:recipients,
//             subject:"Welcome to LinkedIn 2.0",
//             html:createWelcomeEmailTemplate(name,profileUrl),
//             category: "welcome",
//         })
//         console.log("Welcome email sent");
        
//     } catch (error) {
//         console.log(error.message);
        
//         // throw error;
//     }
// }


// const sendCommentNotificationEmail = async (recipientEmail,recipientName,commenterName,postUrl,commentContent) =>{

//     const recipients  = [{recipientEmail}];  

//     try {
//         const response= await mailtrapClient.send({
//             from:sender,
//             to: recipients,
//             subject:"New Comment on your Post",
//             html:createCommentNotificationEmailTemplate(recipientName,commenterName,postUrl,commentContent),
//             category:"comment_notification"
//         });
//         console.log("Notification sent successfully");
        
//     } catch (error) {
//         console.log("Error:",error.message);
        
//     }

// }

// const sendConnectionAcceptedEmail = async (senderName,recipientName, profileUrl,senderEmail) =>{
    
//     const recipients  = [{senderEmail}];  
    
//     try {
//         const response = await mailtrapClient.send({
//             from:sender,
//             to:recipients,
//             subject:`${recipientName} accepted your connection request`,
//             html:createConnectionAcceptedEmailTemplate(senderName,recipientName, profileUrl),
//             category:"connection_accepted"
//         })
//         console.log("Acceptance email sent successfully");

//     } catch (error) {
//         console.log("Error:",error.message);
        
//     }
// } 

// module.exports = {
//     sendWelcomeEmail,
//     sendCommentNotificationEmail,
//     sendConnectionAcceptedEmail
// }









//yeh mailtrap ka setup code is coming from https://mailtrap.io/sending/domains/7e213cdb-de60-42fe-b278-4232e957af7e?current_tab=smtp_settings&stream=transactional   in here select api and then nodejs mein SDK















