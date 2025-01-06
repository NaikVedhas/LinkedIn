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
const cors = require('cors')


app.use(cors({      //we are usong this to handle cors error
    origin:"http://localhost:5173",
    credentials:true    // this means that allow origin to sned cookies along with response
}))
app.use(express.json({limit:"5mb"}));     //parse json. We addded limit bec if or imag is in mbs then we can get error from frontendt that payload is too large but now we wont get that error and will be able to handle images upto 5mb
app.use(cookieParser());    //parse cookies

//Routes

app.use('/api/v1/auth',authRoute);
app.use('/api/v1/users',userRoute);
app.use('/api/v1/posts',postRoute);
app.use('/api/v1/notifications',notificationRoute)
app.use('/api/v1/connections',connectionRoute);



mongoose.connect(process.env.MONGODBURI)
.then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log("Database connected and Server running on ",process.env.PORT);
    })
})
.catch((err)=>console.log(err))


