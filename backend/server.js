const express = require('express');
const authRoute = require('./routes/authRoute')
const userRoute = require('./routes/userRoute')
const postRoute = require('./routes/postRoute')
const notificationRoute = require('./routes/notificationRoutes');
const connectionRoute = require('./routes/connectionRoute');
require('dotenv').config();    
const app = express();
const mongoose  = require('mongoose');
const cookieParser = require('cookie-parser');


app.use(express.json());     //parse json
app.use(cookieParser());    //parse cookies

//Routes

app.use('/api/v1/auth',authRoute);
app.use('/api/v1/users',userRoute);
app.use('/api/v1/posts',postRoute);
app.use('/api/v1/notifictions',notificationRoute)
app.use('/api/v1/connections',connectionRoute);


mongoose.connect(process.env.MONGODBURI)
.then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log("Database connected and Server running on ",process.env.PORT);
    })
})
.catch((err)=>console.log(err))


