const express = require('express');
const app = express();
const path = require('path');


app.use(express.static(path.join(__dirname,'/assets')));
app.use(express.static(path.join(__dirname,'gitAPI.js')));


app.use('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'index.html'));
});

app.set(8080, process.env.PORT || 3000);

app.listen(process.env.PORT || 8080,()=>{
    console.log('Server is running on port 8080');
});

