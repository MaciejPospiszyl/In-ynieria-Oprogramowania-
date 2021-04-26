const express = require("express")
const path = require("path")
// const mongoose = require('mongoose')
const cookieParser = require("cookie-parser")
const port = 3000
const WebSocket = require('ws');
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


let server = app.listen(port, () => console.log(`Listening on ${ port }`));

const wss = new WebSocket.Server({server: server});

wss.on('connection', function connection(ws) {
    console.log('A new client connected');
    ws.send('Welcome new client');

    ws.on('message', function incoming(message) {
      console.log('received: %s', message);
      ws.send('Got your message, its: ' + message)
    });
});