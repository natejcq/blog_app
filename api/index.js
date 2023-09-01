const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json()); 
const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect('mongodb+srv://nathancardoso:Stnm112m6FDO9nzr@cluster0.oihvcna.mongodb.net/?retryWrites=true&w=majority')

app.post('/register', async (req,res) => {
    const {username, password} = req.body;
    try {
        const userDoc = await User.create({username: username, password: password});
        res.json(userDoc);
    } catch (error) {
        console.error('Registration failed:', error);
        res.status(400).json({ error: 'Registration failed' });

    }

});



app.listen(4000);

//mongodb+srv://nathancardoso:<password>@cluster0.oihvcna.mongodb.net/?retryWrites=true&w=majority
//mongodb password Stnm112m6FDO9nzr
//mongodb+srv://nathancardoso:Stnm112m6FDO9nzr@cluster0.oihvcna.mongodb.net/?retryWrites=true&w=majority