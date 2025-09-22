import Joi from 'joi';
import mongoose from 'mongoose';
import express from 'express';

const router = express.Router();



export const Customer = mongoose.model('Customers', new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        maxlength: 50,
        required: true
    },
    isGold: {
        type: Boolean,
        default: false,
        required: true
    },
    phone: {
        type: String,
        minlength: 3,
        maxlength: 50,
        required: true
    }
}))




router.get('/',async(req,res) => {
    const customers = await Customer.find().sort('name')
    res.send(customers)
})

router.get('/:id',async(req,res) => {

    const {error} = validateCustomer(req.body)
    if(error) return res.send(404).send(error.details[0].message)
    const customers = await Customer.findById(req.params.id)
    res.send(customers)
})


router.post('/', async (req, res) => {

    const { error } = validateCustomer(req.body)
    if (error) return res.status(400).send(error.details[0].message)
    const customer = new Customer({
        name: req.body.name,
        isGold: req.body.isGold,
        phone: req.body.phone
    })

    const result = await customer.save()
    res.send(result)

})

router.put('/:id',async(req,res) => {
    const customer = await Customer.findByIdAndUpdate(req.params.id,{
        name:req.body.name,
        isGold:req.body.isGold,
        phone:req.body.phone
    },{new:true})

    res.send(customer)

    if(!customer) return res.status(404).send('requested Id is not present in the DB')
        

})


function validateCustomer(customer) {
    const schema = Joi.object({
        name: Joi.string().min(3).max(50).required(),
        isGold: Joi.boolean().required(),
        phone: Joi.string().min(3).max(50).required(),
    })
    return schema.validate(customer)
}

export  default  router

