const mongoose = require("mongoose")

const Schema = mongoose.Schema;

const user = new Schema({
    username:String,
    email:{
        type:String,
        unique:true
    },
    password:String,
    purchased_course:[{
        type: Schema.Types.ObjectId,
        ref:'course'
    }],
})

const admin = new Schema({
    username:String,
    email:String,
    password:String,
   
})

const course = new Schema({
    title:String,
    description:String,
    price:Number,
    mrp:Number,
    isPublished:Boolean,
    isFeatured:Boolean,
    validity:Number,
    image:{
        type:String,
        default:'https://appxcontent.kaxa.in/paid_course3/2024-07-07-0.8201249093606604.png'
    },
    author:{
        type:mongoose.Schema.Types.String,
        ref:'tutor'
    }
})
const tutor = new Schema ({
    username:String,
    subject:String,
    experience:Number,
    qualification:String,
    email:{
        type:String,
        unique:true
    },
    password:String,
    created_courses:[{
        type:Schema.Types.ObjectId,
        ref:'course'
    }],
    isTutor: {
        type: Boolean,
        default: true
    }
})


const UserModule = mongoose.model('user',user);
const AdminModule = mongoose.model('admin',admin);
const CourseModule = mongoose.model('course',course);
const TutorModule = mongoose.model('tutor',tutor);


module.exports =({
    UserModule,
    AdminModule,
    CourseModule,
    TutorModule,
})