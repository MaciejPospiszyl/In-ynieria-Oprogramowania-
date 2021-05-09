const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const cookieParser = require("cookie-parser")
const port = 3000
const { getPlayers } = require('./functions.js')
const { getRooms } = require('./functions.js');
const { createWebSocketStream } = require("ws");

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



//sockets
io.on('connection', (socket) => {
  // socket.join('lobby')
  // console.log('user joined lobby')
  socket.on('roomSetup', async data => {
    socket.join(data.room_id);
    console.log('socket joined ', data.room_id)
    socket.leave('lobby')
    console.log('socket left lobby')
  })
  socket.on('lobbySetup', async data => {
    socket.join('lobby');
    console.log('joined lobby')
  })

  socket.on('lobbyChange', async () => {
    try {
      const x = await getRooms({
      })
      io.to('lobby').emit('lobbyChange', x)
    }
    catch (error) { console.log('error when sending lobby info') }
  })

  socket.on('joinRoom', async msg => {
    try {
      const x = await getPlayers({
        cookies: {
          jwt: socket.request.headers.cookie.substr(4)
        },
        params: {
          room_id: msg.room_id
        }
      })
      // console.log('joinroomapp',x)
      io.to(msg.room_id).emit('joinRoom', x)

      const z = await getRooms({})
      io.to('lobby').emit('lobbyChange', z)
    }
    catch (error) { console.log('error when joining room or sending lobby info') }
  })

  socket.on('leaveRoom', async msg => {
    try {
      const x = await getPlayers({
        cookies: {
          jwt: socket.request.headers.cookie.substr(4)
        },
        params: {
          room_id: msg.room_id
        }
      })
      socket.leave(msg.room_id)
      console.log('left room', msg.room_id)
      io.to(msg.room_id).emit('joinRoom', x)

      const z = await getRooms({})
      io.to('lobby').emit('lobbyChange', z)
    }
    catch (error) { console.log('error when leaving room or sending lobby info') }
  })

  socket.on('disconnect', () => {
    socket.leave('lobby')
    console.log('left lobby');
  })
})

server.listen(3000, () => {
  console.log(`listening on *:${port}`);
});