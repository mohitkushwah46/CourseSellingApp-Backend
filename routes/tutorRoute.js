const express = require('express')
const mongoose = require('mongoose');
require('dotenv').config()
const { TutorModule, CourseModule } = require('../db');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const adminMiddleware = require('../middleware/adminMiddleware');



const JWT_SECRET = process.env.JWT_SECRET;

const router = express.Router()

router.post('/tutor',async function(req,res){
    const {
        username,
        email,
        password,
        subject,
        experience,
        qualification,

    }=req.body
    try {
            const checkTutor = await TutorModule.findOne({
                email
            })
            if(checkTutor){
                return res.json({
                    message:"Tutor allready exist"
                })
            }
            const hashedPassword = await bcrypt.hash(password,15)
        
            const tutor = await TutorModule.create({
                username,
                subject,
                experience,
                qualification,
                email,
                password:hashedPassword,
            })
        
            if(!tutor || tutor.length === 0){
                return res.json({
                    message:"Please enter the Tutor details"
                })
            }
            const token = jwt.sign({id:tutor._id},JWT_SECRET,{expiresIn:'1D'})
            res.json({
                message:"tutor created",
                token
            })
        
    } catch (error) {
        res.json({
            message:"somthing went wrong"
        })
        console.log(error)
    }

})
router.post('/tutor-signin',async function(req,res){
    const {
        email,
        password
    } = req.body;

    try {
        
        const isTutor = await TutorModule.findOne({
            email
        })
        if(!isTutor){
            return res.json({
                message:"Email I'D does not exist, Please singup"
            })
        }
        const response = isTutor;
    
        const tutor = await bcrypt.compare(password, isTutor.password)
        if(tutor){
        }
        if(tutor){
           const token = jwt.sign({id:response._id},JWT_SECRET,{expiresIn:'1D'})
             return res.json({
                message:"user veryfied",
                token,
                response
            })
        }else{

            res.json({
                message:"Wrong Password",
                
            })
        }
    } catch (error) {
        res.json({
            message:"somthing went wrong"
        })
    }


})

// get tutor details
router.get('/tutor-details/:id',adminMiddleware,async function(req,res){
    const id = req.params.id
    try {
        
        const response = await TutorModule.findOne({
            _id:id
        })
        res.json({
            response
        })
    } catch (error) {
        res.json({
            message:"something wen wrong"
        })
    }
})

router.get('/all-tutors', async function(req,res){
    const response = await TutorModule.find();

    if(!response){
        return res.json({
            message:"no data found"
        })
    }
    res.json({
        response
    })
})


module.exports = router