import { SignJWT } from 'jose'; // Correct way to import SignJWT in ESM
import bcrypt from 'bcrypt';
import _ from 'lodash';
import Joi from 'joi';

import { User } from './user.js'; // Ensure user.js uses ESM exports

import express from 'express';


const  router = express.Router();



router.get('/', async (req, res) => {
    const Users = await User.find()
    res.send(Users)
})


router.post('/', async (req, res) => {
    
    const { error } = validate(req.body)
    
    if (error) return res.status(400).send(error.details[0].message)
        let user = await User.findOne({ email: req.body.email })
    if (!user) res.status(400).send("Invalid email or Password")
        
        const validPassword = await bcrypt.compare(req.body.password, user.password)
        if (!validPassword) return res.status(400).send("Invalid email or Password")

     const token = await new SignJWT({_id:user._id})
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('2h')  
    .sign(new TextEncoder().encode('VidltSecertKey')) 
    res.send(token)
})



function validate(req) {
    const schema = Joi.object({
        email: Joi.string().min(5).max(50).required().email(),
        password: Joi.string().min(5).max(1024).required()
    })
    return schema.validate(req)
}


export  default  router