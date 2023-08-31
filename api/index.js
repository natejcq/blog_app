const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.get('/test', (req,res) => {
    console.log("WORKS");
})

app.listen(4000); 