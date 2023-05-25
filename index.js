const express = require('express');
const app = express();
const PORT = 4396;
const bodyParser = require('body-parser');
const data = require('./data');
const Joi = require('joi');
const { v4: uuidv4 } = require('uuid');

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.json({
        status: true,
        message: 'you are welcome'
    })
});

app.get('/users', (req, res) => {
    const {firstname, lastname} = req.body;

    res.status(200).json({
        status : true,
        message : 'Welcome!',

    })
})

app.get('/users/:id', (req, res) => {
    const {id} = req.params;
    res.status(200).json({
        status: true,
        message: 'here you are',
        
    })
})

app.post('/register', (req, res) =>{

    const {firstname, secondname, email, address, phone} = req.body;

    const validation = Joi.object({
        firstname: Joi.string().min(3).required(),
        secondname: Joi.string().min(3).required(),
        email: Joi.string().email().required(),
        address: Joi.string(),
        phone: Joi.string().min(5).max(30).required()

    })

    const {value, error} = validation.validate(req.body);
    if (error !== undefined) {
        return res.status(400).json({
            status: 'error',
            message: error.details[0].message
        });
    }

    const isAlreadyRegistered = data.filter(d => d.firstname === firstname && d.secondname === secondname);
    if(isAlreadyRegistered){
        res.status(400).json({
            status: 'error',
            message: 'This account already exists'
        })
    }
    data.push({
        id: uuidv4(),
        ...req.body
    })

    res.status(200).json({
        status : true,
        message : 'Welcome!, it\'s\ our delight to have you onboard',
        data:  data
    })

    

});

app.post('/login', (req, res) => {
    const {firstname, secondname, email} = req.body;

    const validation = Joi.object({
        firstname: Joi.string().min(3).required(),
        secondname: Joi.string().min(3).required(),
        email: Joi.string().email().required()
    })

    const {value, error} = validation.validate(req.body);
    if(error !== undefined){
       return res.status(400).json({
                status: 'error',
                message: error.details[0].message
        })
    }
    data.push({
        id: uuidv4(),
        ...req.body
    })

    res.status(200).json({
        status : true,
        message : 'Welcome',
        data
    })
})





app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
});