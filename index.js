const express = require('express')
const cors = require('cors');
const mongoose = require('mongoose')
const UserRouter = require('./routes/userRoute')
const AdminRouter= require('./routes/adminRoute')
const CourseRouter  = require('./routes/courseRoute')
const TutorRouter = require('./routes/tutorRoute')
const path = require('path');
require('dotenv').config()

const MONGO_URL = process.env.MONGO_URL
const PORT = process.env.PORT

const app = express()
// Connect to the database 

mongoose.connect(MONGO_URL)
.then(()=>{
    console.log("database connected")
}).catch(err=>{
    console.log("an error occured" + err)
})


//middleware for parse the json
app.use(express.json())
//allowing the origin to access data
app.use(cors({origin:['http://localhost:5173','https://100xdevs-rosy.vercel.app','https://course-selling-app-frontend-ten.vercel.app']}));

app.get('/',function(req,res){
    res.send("Backend is working")
})
app.use('/api/v1',UserRouter)
app.use('/api/v1',AdminRouter)
app.use('/api/v1',CourseRouter)
app.use('/api/v1',TutorRouter)



app.listen(PORT,
    console.log(`App is listening on PORT: ${PORT}`)
)
