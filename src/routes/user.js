const _ = require('lodash')
const joi = require('joi')
const mongoose = require('mongoose')
const express = require('express')
const router = express.Router()


const User = mongoose.model('Users',new mongoose.Schema({

    name:{
        type:String,
        minlength:5,
        maxlength:50,
        required:true
    },
    email:{
        type:String,
        minlength:5,
        maxlength:50,
        required:true,
        unique:true
    },
    password:{
        type:String,
        minlength:5,
        maxlength:1024,
        required:true
    }
}))



router.get('/', async (req,res) => {
    const Users = await User.find()
    res.send(Users)
})


router.post('/', async(req,res) => {

    const {error} = validateUser(req.body)

    if(error) return res.status(400).send(error.details[0].message)

    let user = await User.findOne({email:req.body.email})

    if(user) res.status(400).send("User Already registered")


       user = new User(_.pick(req.body,['name','email','password'])) 
      await user.save()
      res.send(_.pick(user,['name','email']))
})



function validateUser(user) {

    const schema = joi.object({
        name:joi.string().min(5).max(50).required(),
        email:joi.string().min(5).max(50).required().email(),
        password:joi.string().min(5).max(1024).required()
    })

    return schema.validate(user)
}


module.exports = router 