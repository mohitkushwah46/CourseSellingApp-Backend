const express = require('express');
const { UserModule, CourseModule } = require('../db');
const userMiddleware = require('../middleware/userMiddleware');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth')
const hasPurchased = require('../middleware/hasPurchased');
const bycript = require('bcrypt')
require('dotenv').config()
const JWT_SECRET = 'ilovecoding'

const app = express()
app.use(express.json());

const router = express.Router()


router.post('/signup',async function(req,res){
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    try {
        const checkuser = await UserModule.findOne({
            email:email
        })

        if(checkuser){
            return res.json({
                message:"User Allready exist"
            })
        }
        const hashedPassword = await bycript.hash(password,15)

        const response = await UserModule.create({
            username,
            email,
            password:hashedPassword,
        })

        if(!response || response.length === 0){
            return res.status(404).json({
                message:"please enter the credentials"
            })
        }
        const token = jwt.sign({id:response._id},JWT_SECRET,{expiresIn:'1D'})
        res.json({
            message:"User created Successfully",
            token
        })
        
    } catch (error) {
        res.json({
            error
        })
        console.log(error)
    }
})
router.post('/signin',async function(req,res){
    const email = req.body.email;
    const password = req.body.password

    try {
        const response = await UserModule.findOne({
            email:email
        })
        if(!response ){
            return res.status(404).json({
                message:"user not found with provided credentials"
            })
        }

        // console.log("user found " + response.password)
        const veryfiedPassword = await bycript.compare(password, response.password)
        // console.log(veryfiedPassword)
        if(!veryfiedPassword){
            return res.status(401).json({
                message:"Wrong email or password"
            })
        }

        // console.log("password matched")

        const token = jwt.sign({id:response._id},JWT_SECRET,{expiresIn:'1D'})

        res.json({
            message:"User Signed in",
            token
        })
    } catch (err) {
        console.log("error occured")
        res.json({
            err
        })
    }
})

// we dont need to verify the user to see the course 
// only verify when he purchase the course

router.get('/all-courses',async function(req,res){

    try {  
        const response = await CourseModule.find({
            isPublished : true,
        })
        // console.log(response)
        if(!response || response.length === 0){
            return res.json({
                message:"no course yet"
            })
        }
        res.json({
            response
        })
    } catch (error) {
        res.json({
            error
        })
    }
})

router.get('/featured-courses',async function(req,res){
    try {
        const response = await CourseModule.find({
            isFeatured:true,
        })

        // console.log(response)
        if(!response || response.length === 0){
            return res.json({
                message:"no featured courses"
            })
        }

        res.json({
            response
        })

    } catch (err) {
        res.json({
            err
        })
    }
})
// router.post('/purchase/:courseid',userMiddleware,async function(req,res){
router.post('/purchase/:id',auth,hasPurchased, async function(req,res){
    const courseId = req.params.id
    const token = req.headers.token

    const decodeduser = jwt.verify(token,JWT_SECRET);
    const userId = decodeduser.id

    try {

        await UserModule.updateOne({
            _id:userId,
            
        },{
            "$push":{
                purchased_course:courseId
            }
        }
    )
        res.json({
            message:"purchae complete"
        })

    } catch (error) {
        
    }
})
router.get('/my-courses',userMiddleware,async function(req,res){
    
    try {

        const token = req.headers.token;
        const verifiedData = jwt.verify(token,JWT_SECRET)
        const userId = verifiedData.id
        
        const response = await UserModule.findOne({
            _id:userId
        })
        if(!response){
            console.log("user not found with the id")
        }
        const courseid = response.purchased_course

        const arr = await CourseModule.find({
            _id:courseid
        })
        if(arr.length === 0){
            return res.json({
                message:"No Purchase yet"
            })

        }
        
        res.json({
            arr
        })
    } catch (error) {
        res.json({
            error
        })
    }
})
router.post('/search',async function(req,res){
    const {title} = req.body;
    try {
        const regex = new RegExp(title, 'i');

        const response = await CourseModule.find({
            title: { $regex: regex } 
        });
    
        if(!response){
            return res.json({
                message:"no Search result found"
            })
        }
        res.json({
            response
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message:"error found",

            error:error.message
        })   
    }

})

module.exports = router