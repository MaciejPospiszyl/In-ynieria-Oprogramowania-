const express = require("express")
const path = require("path")
// const mongoose = require('mongoose')
const cookieParser = require("cookie-parser")
const port = 3000
const app = express()
 


//public
app.use(express.static(__dirname + '/public')); 

//views
//app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

//parsers
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

//routes
app.use('/', require('./routes/pages'))
app.use('/auth', require('./routes/auth'))



app.listen(port, function(error){
    if(error){
        console.log("There was an error", error)
    }
    else{
        console.log("Server is running on port " + port)
    }
})
