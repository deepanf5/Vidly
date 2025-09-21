const { Customer } = require('./customer')
const { Movie } = require('./movies')

const joi = require('joi')
joi.objectId = require('joi-objectid')(joi)
const mongoose = require('mongoose')
const express = require('express')
const router = express.Router()



const Rental = mongoose.model('rentals', new mongoose.Schema({

    customer: new mongoose.Schema({

        name: {
            type: String,
            minlength: 3,
            maxlength: 255,
            required: true
        },
        isGold: {
            type: Boolean,
            required: true
        },
        phone: {
            type: String,
            minlength: 3,
            maxlength: 255,
            required: true

        }
    }),
    movie: new mongoose.Schema({
        title: {
            type: String,
            minlength: 3,
            maxlength: 255,
            required: true
        },
        dailyRentalRate: {
            type: Number,
            min: 0,
            max: 255
        },
        numberInStock: {
            type: Number,
            min: 0,
            max: 255,
            required: true
        },

    }),

    dateOut: {
        type: Date,
        required: true,
        default: Date.now()

    },
    rentalFee: {
        type: Number,
        min: 0
    }
}))



router.get('/', async (req, res) => {
    const rentals = await Rental.find().sort('-dateOut')
    res.send(rentals)
})


    router.post('/', async (req, res) => {

        const { error } = validateRental(req.body)
        if (error) return res.status(400).send(error.details[0].message)

        const session = await mongoose.startSession();
        session.startTransaction()

        try {
            const customer = await Customer.findById(req.body.customerId)
            if (!customer) return res.status(400).send("Rquest Id with Customer is found")

            const movie = await Movie.findById(req.body.movieID)
            if (!movie) return res.status(400).send("Rquest Id with Movie is found")

            if (movie.numberInStock === 0) return res.status(404).send('Movie not in the stock')
        
            let rental = new Rental({
                customer: {
                    _id: customer._id,
                    name: customer.name,
                    phone: customer.phone,
                    isGold:customer.isGold
                },
                movie: {
                    _id: movie._id,
                    title: movie.title,
                    dailyRentalRate: movie.dailyRentalRate,
                    numberInStock:movie.numberInStock

                }
            })
            await rental.save({session})
            movie.numberInStock--;
            await movie.save({session})

            await session.commitTransaction()
            session.endSession()
            res.send(rental)


        }
        catch (err) {
            await session.abortTransaction();
            session.endSession();
            console.error("Transaction error:", err);
            res.status(500).send("Transaction failed.");

        }
    })




function validateRental(rental) {
    const schema = joi.object({
        customerId: joi.objectId().required(),
        movieID: joi.objectId().required(),
    })

    return schema.validate(rental)
}

module.exports = router



