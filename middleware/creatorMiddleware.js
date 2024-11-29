const express = require('express')
const jwt = require('jsonwebtoken')
const { UserModule } = require('../db')
const JWT_SECRET = "ilovecoding"


async function creatorMiddleware(req,res,next){
    try {
        
        const token = req.headers.token
    
        if(!token){
            return res.json({
                message:"Please signin first"
            })
        }
        const decodedToken = jwt.verify(token,JWT_SECRET)
        if(!decodedToken){
            return res.json({
                message:"Invalid Token"
            })
        }

        // check if he is creator or not 
        const creator = await UserModule.findOne({
            _id:decodedToken.id
        })
        if(!creator.isCreator){
            return res.json({
                message:"you are not creator"
            })
        }
        req._id = decodedToken.id

        next()
    } catch (error) {
     res.json({
        error
     })   
    }

}

module.exports = creatorMiddleware