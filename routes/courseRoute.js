const express = require('express')
const {CourseModule, TutorModule} = require('../db/index')
const auth = require('../middleware/auth')
const tutorAuth = require('../middleware/tutorMiddleware')
const app = express()

const router = express.Router()


// Create Course
router.post('/create-course',tutorAuth, async function(req,res){
    const tutorId = req.id;
    const {
        title,
        description,
        price,
        isPublished,
        isFeatured,

    } = req.body;

    const tutor = await TutorModule.findOne({
        _id:tutorId
    })

    try {
        
        const response = await CourseModule.create({
            title,
            description,
            price,
            isPublished,
            isFeatured
        })

        const courseId = response._id

        await CourseModule.updateOne({
            _id:courseId
        },{
            '$push':{
                author:tutor.username
            }
        }
    )

        await TutorModule.updateOne({
            _id:tutorId
        },{
            '$push':{
                created_courses:courseId
            }
        }
    )

    res.json({
        response
    })
    } catch (error) {
        console.log(error)
        res.json({
            message:"something went wrong"
        })
    }

    
})
//get course details
router.get('/course-details/:id',async function(req,res){

const id = req.params.id
try {
    
    const response = await CourseModule.findOne({
        _id:id
    })
    res.json({
        response
    })
} catch (error) {
    console.log(error)
    res.json({
        message:"something went wrong"
    })
}
})
//get all courses
router.get('/all-course',async function(req,res){
const response = await CourseModule.find()
res.json({
    response
})
})

module.exports = router