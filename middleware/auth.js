const expess = require('express')
const jwt = require('jsonwebtoken')
const JWT_SECRET = "ilovecoding"

async function auth(req,res,next){
    try {
        const token = req.headers.token
        if(!token){
            return res.json({
                message:"Please signed in first"
            })
        }
        const decodedToken = jwt.verify(token, JWT_SECRET)

        if(!decodedToken){
            return res.json({
                message:"You are not verified"
            })
        }
        next()
    } catch (error) {
        res.json({
            message:"somthing went wrong"
        })
    }
    
}

module.exports = auth