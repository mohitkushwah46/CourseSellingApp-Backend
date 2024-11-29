const express = require('express')
const jwt = require('jsonwebtoken')
const JWT_SECRET = "ilovecoding"

function adminMiddleware(req,res,next){
    try {
        const token = req.headers.token;
       
        if(!token){
            return res.json({
                message:"Please signin first"
            })
        }
        const decodedToken  = jwt.verify(token,JWT_SECRET)
        req._id = decodedToken.id
        next()
    } catch (error) {
        res.json({
            message:"invalid token",
            error
        })
    }
}

module.exports = adminMiddleware