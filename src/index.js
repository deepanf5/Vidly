const movies = require('./routes/movies')
const customer = require('./routes/customer')
const genres = require('./routes/genres');

const mongoose = require('mongoose')
const express = require('express')
const app = express()
const port = 4500

app.use(express.json());
app.use('/api/genres', genres);
app.use('/api/customers',customer)
app.use('/api/movies',movies)






app.get('/',(req,res) => {
    if(req.url === '/') {
        res.send("Hello Express");
        res.end()
    }
})


app.listen(port,() => {
    console.log(`Application is running on ${port}`)
})
mongoose.connect('mongodb://127.0.0.1/Vidly')
.then(() => console.log('Connected to Vidly DB'))
.catch((err) => console.error('Error',err.message))