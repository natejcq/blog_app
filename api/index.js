const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/User');
const Post = require('./models/Post');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const fs = require('fs');

const multer = require('multer');
const uploadMiddleware  = multer({dest: './uploads'});

const secret = 'asdfe45we45w345wegw345werjktjwertkj';
const salt = bcrypt.genSaltSync(10);

app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(express.json()); 
app.use(cookieParser()); 

mongoose.connect('mongodb+srv://nathancardoso:Stnm112m6FDO9nzr@cluster0.oihvcna.mongodb.net/?retryWrites=true&w=majority')

app.post('/register', async (req,res) => {
    const {username, password} = req.body;
    try{
        const userDoc = await User.create({
            username:username, 
            password:bcrypt.hashSync(password, salt)});
        res.json({requestData:{username:username, password:password}});
    }
    catch(err){
        res.status(400).json(err);
    }
});

app.get('/profile'  , (req, res) => {
    const {token} = req.cookies;  
    jwt.verify(token, secret, {}, (err, info) => {
        if (err) throw err;
        res.json(info);
    }); 
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log('Received login request for username:', username); // Add this for debugging

    try {
        const userDoc = await User.findOne({ username });
        if (!userDoc) {
            // User not found, return an error response
            return res.status(404).json({ error: 'User not found' });
        }
        const passOk = bcrypt.compareSync(password, userDoc.password);
        if (passOk) {
            // Successfully logged in 
            ///res.status(200).json({ message: 'Login successful' });
            jwt.sign({username, id:userDoc._id}, secret, {}, (err, token) => {
                if (err) throw err;
                res.cookie("token", token).json({
                    id: userDoc._id,
                    username: userDoc.username,
                });
            });
        } else {
            // Wrong password
            res.status(400).json({ error: 'Wrong credentials' });
        } 
    } catch (error) {
        // Handle other errors
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/logout',  (req, res) => {
    res.cookie('token', '').json('ok');
});

app.post('/post', uploadMiddleware.single('file'), (req, res) => {
    const {originalname, path} = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    const newpath=path+"."+ext
    fs.renameSync(path, newpath);
    res.json({ext});
})

app.listen(4000);

//mongodb+srv://nathancardoso:<password>@cluster0.oihvcna.mongodb.net/?retryWrites=true&w=majority
//mongodb password Stnm112m6FDO9nzr
//mongodb+srv://nathancardoso:Stnm112m6FDO9nzr@cluster0.oihvcna.mongodb.net/?retryWrites=true&w=majority