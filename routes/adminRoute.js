const express = require('express');
const {  AdminModule, CourseModule, UserModule, TutorModule } = require('../db');
const adminMiddleware = require('../middleware/adminMiddleware');
const userMiddleware = require('../middleware/userMiddleware');
const tutorAuth = require('../middleware/tutorMiddleware');

const app = express()
app.use(express.json());

const router = express.Router()


router.post('/admin',async function(req,res){
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    try {
        const response = await AdminModule.create({
            username,
            email,
            password
        })

        if(!response || response.length === 0){
            return res.status(404).json({
                message:"please enter the credentials"
            })
        }
        res.json({
            message:"Admin created Successfully",
            response
        })
        
    } catch (error) {
        res.json({
            err
        })
        console.log(error)
    }




})
router.get('/published-courses',tutorAuth,async function(req,res){
    
    try {
        const response = await CourseModule.find({
            isPublished:true
        })
        res.json({
            response
        })

    } catch (error) {
        res.json({
            error
        })
    }
})
router.get('/unpublished-courses',tutorAuth,async function(req,res){
    
    try {
        const response = await CourseModule.find({
            isPublished:false
        })
        res.json({
            response
        })

    } catch (error) {
        res.json({
            error
        })
    }
})
router.post('/publish-course/:courseId',tutorAuth,async function(req,res){
        try {
            const courseId = req.params.courseId;
            const course = await CourseModule.findOne({
                _id : courseId
            })
            if(!course){
                return res.json({
                    message:"course not found with the give courseId"
                })
            }
            await CourseModule.updateOne({
                    _id:courseId
            },{isPublished:true}
        )
        const response = await CourseModule.findOne({
            _id : courseId
        })
            res.json({
                message:"Course published",
                response
            })
        } catch (error) {
            res.json({
                error
            })
        }
})
router.get('/users',adminMiddleware,async function(req,res){
    const response =await UserModule.find()
    res.json({
        response
    })

})
router.get('/user',async function(req,res){
    const userId = req.headers.tutorid
    const response = await UserModule.findOne({
        _id:userId
    })
    if(!response){
        return res.json({
            message:"user not found"
        })
    }
    res.json({
        response
    })
})
// router.get('/tutors',async function(req,res){
//     const response = await TutorModule.find({
//         isCreator:true
//     })
//     if(response.length <= 0){
//         return res.json({
//             message :"no tutor yet"
//         })
//     }
//     res.json({
//         response
//     })
// })
// router.get('/tutor-courses/:id', async function(req,res){
//     const tutorId = req.params.id

//     try {
//         if(!tutorId){
//             return res.json({
//                 message:"please give tutor id"
//             })
//         }

//         const response = await TutorModule.findOne({
//             _id:tutorId
//         })
//         if(!response){
//             return res.json({
//                 message:"tutor not found"
//             })
//         }
//         const result = response.created_courses
//         const data = await CourseModule.find({
//             _id:result
//         })

//         res.json({
//             data
//         })

//     } catch (error) {
        
//     }
// })


module.exports = router