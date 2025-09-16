const mongoose = require('mongoose')
const express = require('express')
const router = express.Router()


const Genres = mongoose.Schema('Genres', new mongoose.model({
    name:{
        type:String,
        required:true,
        minlength:5,
        maxlength:50
    }
}))


router.post('/',async (req,res) => {

    const genre = new Genres({
        name:req.body.name
    })
   genre = await genre.save()
   res.send(genre)
})


