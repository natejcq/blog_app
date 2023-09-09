const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/User');
const Post = require('./models/Post');
const bcrypt = require('bcryptjs');
const app = express();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const fs = require('fs');

const multer = require('multer');
const uploadMiddleware  = multer({dest: './uploads'});

const salt = bcrypt.genSaltSync(10);
const secret = 'asdfe45we45w345wegw345werjktjwertkj';

app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(express.json()); 
app.use(cookieParser()); 
app.use('/uploads', express.static(__dirname + '/uploads'));

mongoose.connect('mongodb+srv://nathancardoso:Stnm112m6FDO9nzr@cluster0.oihvcna.mongodb.net/?retryWrites=true&w=majority')

app.post('/register', async (req,res) => {
    const {username, password} = req.body;
    try{
        const userDoc = await User.create({
            username:username, 
            password:bcrypt.hashSync(password, salt),
        });
        res.json(userDoc);
    }
    catch(err){
        res.status(400).json(err);
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log('Received login request for username:', username); 

    try {
        const userDoc = await User.findOne({ username });
        if (!userDoc) {
            // User not found, return an error
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

app.get('/profile'  , (req, res) => {
    const {token} = req.cookies;  
    jwt.verify(token, secret, {}, (err, info) => {
        if (err) throw err;
        res.json(info);
    }); 
});

app.post('/logout',  (req, res) => {
    res.cookie('token', '').json('ok');
});

app.post('/post', uploadMiddleware.single('file'), async(req, res) => {
    const {originalname, path} = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    const newpath=path+"."+ext
    fs.renameSync(path, newpath);
    
    const {token} = req.cookies;
    jwt.verify(token, secret, {}, async(err, info) => {
        if (err) throw err;
        const {title, summary, content} = req.body;
        const postDoc = await Post.create({
            title,
            summary,
            content,
            cover: newpath,
            author: info.id,
    });
    res.json(info);
    });
});

app.put('/post', uploadMiddleware.single('file') ,async(req, res) => {
    let newpath = null;
    if(req.file) {
        const {originalname, path} = req.file;
        const parts = originalname.split('.');
        const ext = parts[parts.length -1];
        const newpath=path+"."+ext
        fs.renameSync(path, newpath);
    }

    const {token} = req.cookies;
    jwt.verify(token, secret, {}, async(err, info) => {
        if(err) throw err;
        const {id, title, summary, content} = req.body;
        const postDoc = await Post.findById(id);
        const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
        if(!isAuthor) {
            res.status(400).json('You are not the author');
        }     
        await postDoc.updateOne({
            title,
            summary,
            content,
            cover: newpath ? newpath : postDoc.cover,
             
        })
        res.json(postDoc);
    });
});

app.get('/post', async(req, res) => {
    res.json(
        await Post.find()
        .populate('author', ['username'])
        .sort({createdAt: -1})
        .limit(20)    
    );
});

app.get('/post/:id', async(req, res) => {
   const {id} = req.params;
   const postDoc = await Post.findById(id).populate('author', ['username']);
    res.json(postDoc); 
    
});



app.listen(4000);app.delete('/post/:id', async (req, res) => {
    const { id } = req.params;
    const { token } = req.cookies;
    
    // Verify the JWT token to get the user's information
    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        
        try {
            // Find the post by ID
            const postDoc = await Post.findById(id);
            
            if (!postDoc) {
                return res.status(404).json({ error: 'Post not found' });
            }
            
            // Check if the user is the author of the post
            if (postDoc.author.toString() !== info.id) {
                return res.status(403).json({ error: 'Forbidden' });
            }
            
            // Delete the post
            await postDoc.remove();
            
            return res.json({ message: 'Post deleted successfully' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    });
});


//mongodb+srv://nathancardoso:<password>@cluster0.oihvcna.mongodb.net/?retryWrites=true&w=majority
//mongodb password Stnm112m6FDO9nzr
//mongodb+srv://nathancardoso:Stnm112m6FDO9nzr@cluster0.oihvcna.mongodb.net/?retryWrites=true&w=majority
