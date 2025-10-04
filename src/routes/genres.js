import asyncmiddleWare from '../middleware/async.js';
import admin from '../middleware/admin.js'
import auth from '../middleware/auth.js';
import Joi from 'joi';
import mongoose from 'mongoose';
import express from 'express';


const router = express.Router();



export const GenreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    }
})


export const Genres = mongoose.model('Genres', GenreSchema)


router.get('/', asyncmiddleWare(async (req, res, next) => {
    const genres = await Genres.find().sort('name')
    res.send(genres);
}));

router.post('/', auth, asyncmiddleWare(async (req, res) => {

    const { error } = ValidateGenre(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    let genre = new Genres({
        name: req.body.name
    })
    genre = await genre.save()
    res.send(genre)
}))


router.get('/:id', async (req, res) => {

    const genre = await Genres.findById(req.params.id)
    res.send(genre)
})


router.put('/:id', async (req, res) => {
    const { error } = ValidateGenre(req.body)
    if (error) return res.status(400).send(error.details[0].message)
    const genre = await Genres.findById(req.params.id, { name: req.body.name }, {
        new: true
    })

    if (!genre) return res.status(404).send('The genre with the given ID was not found.');
    genre.name = req.body.name
    res.send(genre)

})


router.delete('/:id', [auth, admin], async (req, res) => {

    const genres = await Genres.findByIdAndDelete(req.params.id)
    res.send(genres)

})


function ValidateGenre(genre) {
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    })
    return schema.validate(genre);
}

export default router
