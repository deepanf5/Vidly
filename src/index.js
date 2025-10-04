import dotenv from 'dotenv';
dotenv.config();
import config from 'config'
import express from 'express';
import mongoose from 'mongoose';
import Joi from 'joi';
import joiObjectId from 'joi-objectid';

import error from './middleware/error.js'
import auth from './routes/auth.js';
import user from './routes/user.js';
import rentals from './routes/rental.js';
import movies from './routes/movies.js';
import customer from './routes/customer.js';
import genres from './routes/genres.js';
import logger from './middleware/logger.js';





process.on('uncaughtException',(ex) => {
    logger.error(ex.message,ex)
    process.exit(1)
})

process.on('unhandledRejection',(ex) => {
    logger.error(ex.message,ex)
    
})


// Extend Joi with objectId
Joi.objectId = joiObjectId(Joi);

const app = express()   
const port = 4500


if(!config.get('jwtPrivateKey')) {
    console.error('FATAL ERROR: jwtPrivatekey is not defined');
    process.exit(1)
}

app.use(express.json());
app.use('/api/genres', genres);
app.use('/api/customers',customer);
app.use('/api/movies',movies);
app.use('/api/rentals',rentals)
app.use('/api/users',user)
app.use('/api/auth',auth)

app.use(error)



app.get('/',(req,res) => {
    if(req.url === '/') {
        res.send("Hello Express");
        res.end()
    }
})



app.listen(port,() => {
    console.log(`Application is running on ${port}`)
})
mongoose.connect('mongodb://localhost:27017/Vidly',{  family: 4})
.then(() => console.log('Connected to Vidly DB'))
.catch((err) => console.error('Error',err.message))