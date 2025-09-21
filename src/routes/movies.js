const { GenreSchema, Genres }  = require('./genres')

const joi = require('joi');
const mongoose = require('mongoose')
const express = require('express')
const router = express.Router()



// Define Movie schema
const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    minlength: 3,
    maxlength: 100,
    required: true
  },
  genre: {
    type: GenreSchema,
    required: true
  },
  numberInStock: {
    type: Number,
    min: 1,
    max: 100,
    required: true
  },
  dailyRentalRate: {
    type: Number,
    min: 1,
    max: 100
  }
});

// Create Movie model
const Movie = mongoose.model('Movie', movieSchema);

// GET all movies
router.get('/', async (req, res) => {
  const movies = await Movie.find().populate('genre', 'name'); 
  res.send(movies);
});


// Get movie 
router.get('/:id',async (req,res) => {
  const movie = await Movie.findById(req.params.id)
  if(!movie) return res.status(404).send("Request Id with movie is not found")

  res.send(movie)
})

// POST a new movie
router.post('/', async (req, res) => {
  const { error } = validateMovie(req.body)
  if(error) return res.status(400).send(error.details[0].message)
  const genre = await Genres.findById(req.body.genreId) 
   if(!genre) res.status(404).send("The requested Genre is not found")
  const movie = new Movie({
    title: req.body.title,
    genre: {
      _id:genre._id,
      name:genre.name
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate
  });

  const result = await movie.save();
  res.send(result);
});


// Update the movie

router.put('/:id', async (req,res) => {
  const { error } = validateMovie(req.body)
  if(error) return res.status(400).send(error.details[0].message)

  const genre = await Genres.findById(req.body.genreId) 
  if(!genre) res.status(404).send("The requested Genre is not found")
  
  const movie = await Movie.findByIdAndUpdate(req.params.id,{
    title:req.body.title,
    genre:{
      _id:genre._id,
      name:genre.name
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate
  },{new:true})
  if(!movie) return res.status(404).send('the Movie with requested Id is not found')
  res.send(movie)
})



router.delete('/:id',async (req,res) => {

  const movie = await Movie.findByIdAndDelete(req.params.id)
  if(!movie) res.status(404).send("The requested Id with Movie is not found")
  res.send(movie)

})

function validateMovie(movie) {

  const schema = joi.object({
    title:joi.string().min(3).required(),
    genreId: joi.string().required(), 
    numberInStock: joi.number().min(0).required(), 
    dailyRentalRate: joi.number().min(0).required() 
  })

  return schema.validate(movie)
}



module.exports = {router,Movie}
