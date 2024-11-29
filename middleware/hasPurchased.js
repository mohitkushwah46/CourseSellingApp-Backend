const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const { UserModule } = require('../db')
const JWT_SECRET = "ilovecoding"


async function hasPurchased(req,res,next){
    try {

    const token = req.headers.token
    if(!token){
        return res.json({
            message:"you are not signed in"
        })
    }

    const decodeduser = jwt.verify(token,JWT_SECRET)
    if(!decodeduser){
        return res.json({
            message:"user not authorized"
        })
    }
    const userId = decodeduser.id
    const courseId = req.params.id


        const user = await UserModule.findById(userId).select('purchased_course')
        if(!user){
            throw new Error('user not found');
        }

        const hasPurchased = user.purchased_course.includes(courseId)

        if(hasPurchased){
           return res.json({
                message:"You are allready enrolled in this course"
            })
        }
        next()
    } catch (err) {
     res.json({
        message:"etror accourd",
        err
     })   
    }
}


module.exports = hasPurchased