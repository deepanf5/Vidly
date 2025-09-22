const bcrypt = require('bcrypt')
const _ = require('lodash')
const joi = require('joi')
const {User} = require('./user')
const express = require('express')
const router = express.Router()



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
    if (!validPassword) res.status(400).send("Invalid email or Password")
    res.send(true)
})



function validate(req) {
    const schema = joi.object({
        email: joi.string().min(5).max(50).required().email(),
        password: joi.string().min(5).max(1024).required()
    })
    return schema.validate(req)
}


module.exports = router 