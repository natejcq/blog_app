const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json()); 

app.post('/register', (req,res) => {
    const {username, password} = req.body;
    console.log("WORKS");
    res.json({requestData:{username, password}});

});



app.listen(4000);

//mongodb+srv://nathancardoso:<password>@cluster0.oihvcna.mongodb.net/?retryWrites=true&w=majority
//mongodb password Stnm112m6FDO9nzr
//mongodb+srv://nathancardoso:Stnm112m6FDO9nzr@cluster0.oihvcna.mongodb.net/?retryWrites=true&w=majority