const mongoose = require('mongoose')
const express = require('express')
const router = express.Router()


const Genres = mongoose.model('Genres', new mongoose.Schema({
    name:{
        type:String,
        required:true,
        minlength:5,
        maxlength:50
    }
}))


router.post('/',async (req,res) => {

    let genre = new Genres({
        name:req.body.name
    })
   genre = await genre.save()
   res.send(genre)
})


module.exports = router

