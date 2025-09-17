const Jio = require('joi')
const mongoose = require('mongoose')
const express = require('express')
const router = express.Router()



const Genres = mongoose.model('Genres', new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    }
}))


router.post('/', async (req, res) => {

    const { error } = ValidateGenre(req.body)
    if (error) return res.statusCode(400).send(error.details[0].message)


    let genre = new Genres({
        name: req.body.name
    })
    genre = await genre.save()
    res.send(genre)
})

function ValidateGenre(genre) {
    const schema = {
        name: Joi.string().min(3).required
    }
    return Jio.validate(genre, schema)
}

module.exports = router

