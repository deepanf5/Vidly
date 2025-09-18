const mongoose = require('mongoose')
const express = require('express')
const router = express.Router()


// Import Genre model
const { Genre } = require('./genres');

// Define Movie schema
const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    minlength: 1,
    maxlength: 100,
    required: true
  },
  genre: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Genre',
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

// POST a new movie
router.post('/', async (req, res) => {
    
  const movie = new Movie({
    title: req.body.title,
    genre: req.body.genre,
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate
  });

  const result = await movie.save();
  res.send(result);
});



module.exports = router
