const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const salt = bcrypt.genSaltSync(10);

app.use(cors());
app.use(express.json()); 

mongoose.connect('mongodb+srv://nathancardoso:Stnm112m6FDO9nzr@cluster0.oihvcna.mongodb.net/?retryWrites=true&w=majority')

app.post('/register', async (req,res) => {
    const {username, password} = req.body;
    try{
        const UserDoc = await User.create({
            username:username, 
            password:bcrypt.hashSync(password, salt)});
        res.json({requestData:{username:username, password:password}});
    }
    catch(err){
        res.status(400).json(err);
    }
});

app.post('/login', async(req, res) => {
    const {username, password} = req.body;
    const userDoc = await User.findOne({username});
    const passOk = bcrypt.compareSync(password, userDoc.password);
    res.json(passOk);
});    
app.listen(4000);

//mongodb+srv://nathancardoso:<password>@cluster0.oihvcna.mongodb.net/?retryWrites=true&w=majority
//mongodb password Stnm112m6FDO9nzr
//mongodb+srv://nathancardoso:Stnm112m6FDO9nzr@cluster0.oihvcna.mongodb.net/?retryWrites=true&w=majority