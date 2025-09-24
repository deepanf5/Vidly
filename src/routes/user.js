import dotenv from 'dotenv';
dotenv.config();
import config from 'config'
import { SignJWT } from 'jose'; 
import bcrypt from 'bcrypt';
import _ from 'lodash';
import Joi from 'joi';
import mongoose from 'mongoose';
import express from 'express';


const router = express.Router();

const userSchema = new mongoose.Schema({
    
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
})


userSchema.methods.generateAuthToken = async function() {
         const token = await new SignJWT({_id:this._id})
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('2h')  
        .sign(new TextEncoder().encode(config.get('jwtPrivateKey'))) 
       return token 
}
export const User = mongoose.model('Users',userSchema)



router.get('/', async (req,res) => {
    const Users = await User.find()
    res.send(Users)
})


router.post('/', async(req,res) => {
    
    const {error} = validateUser(req.body)

    if(error) return res.status(400).send(error.details[0].message)
        
        let user = await User.findOne({email:req.body.email})
        
        if(user) return res.status(400).send("User Already registered")
            
            user = new User(_.pick(req.body,['name','email','password']))
            const salt = await bcrypt.genSalt(10) 
            user.password = await bcrypt.hash(user.password,salt)
            await user.save()
            const token = await user.generateAuthToken()
            res.header('x-auth-token',token).send(_.pick(user,['name','email']))
        })
        
        
        
        function validateUser(user) {
            
            const schema = Joi.object({
                name:Joi.string().min(5).max(50).required(),
                email:Joi.string().min(5).max(50).required().email(),
                password:Joi.string().min(5).max(1024).required()
            })
            
            return schema.validate(user)
        }
        
export default router