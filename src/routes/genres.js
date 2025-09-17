const Joi = require('joi')
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



router.get('/', async (req, res) => {
    const genres = await Genres.find().sort('name')
    res.send(genres);
});

router.post('/', async (req, res) => {

    const { error } = ValidateGenre(req.body)
    if (error) return res.status(400).send(error.details[0].message)


    let genre = new Genres({
        name: req.body.name
    })
    genre = await genre.save()
    res.send(genre)
})


router.get('/:id',async(req,res) => {

    const genre = await Genres.findById(req.params.id)
    res.send(genre)
})


router.put('/:id',async(req,res) => {
    const {error} = ValidateGenre(req.body) 
    if(error) return res.status(400).send(error.details[0].message)
      const genre =  await Genres.findById(req.params.id,{name:req.body.name},{
            new:true
        })

    if (!genre) return res.status(404).send('The genre with the given ID was not found.');
    genre.name = req.body.name
    res.send(genre)

})


router.delete('/:id',async(req,res) => {

    const genres  = await Genres.findByIdAndDelete(req.params.id)
    res.send(genres)

})


function ValidateGenre(genre) {
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    })
     return schema.validate(genre);
}

module.exports = router

