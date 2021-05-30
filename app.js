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
let number = {}
let board = {}


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
  socket.on('roomSetup', async data => {
    socket.leave('lobby')
    console.log('socket left lobby')
    console.log('roomsetup', data.room_id)
    socket.join(data.room_id);
    console.log('socket joined ', data.room_id)
    socket.emit('roomSetup', 'costam')
  })
  socket.on('lobbySetup', async () => {
    socket.join('lobby');
    console.log('joined lobby')
  })


  socket.on('newChatMessage', (msg) => {
    msg = JSON.parse(msg)
    io.to(msg.room_id).emit('newChatMessage', msg)
  });

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

      io.to(msg.room_id).emit('joinRoom', x)
      const z = await getRooms({})
      io.to('lobby').emit('lobbyChange', z)
    }
    catch (error) { console.log('error when joining room or sending lobby info') }
  })

  socket.on('joinGame', async data => {
    data = JSON.parse(data);     
    console.log('dataapp',data)          
    let x = data.room_id;                           
    number[x] = -1;
    const z = await getRooms({})
    io.to('lobby').emit('lobbyChange', z)
    io.to(data.room_id).emit('joinGame', data)
  })

  socket.on('joinGameRoom',  data => {
    socket.join(data.room_id)
    let x = data.room_id;
    if (number[x] === -1) {
      setTimeout(() => io.to(data.room_id).emit('setBoard', board[x]), 1000);
    }
    if (data.number > number[x]) {
      number[x] = data.number
      board[x] = data.board;
    }
  })

  socket.on('Flip', data => {
    data = JSON.parse(JSON.stringify(data))
    io.to(data.currRoom).emit('Flip', data.flip)
  })

  socket.on('removeFlip', data => {
    data = JSON.parse(JSON.stringify(data))
    console.log('removeFlip',data)
    // socket.broadcast.to(data.currRoom).emit('removeFlip', data);
    io.to(data.currRoom).emit('removeFlip', data)
  })

  socket.on('confirmFlip', data => {
    data = JSON.parse(JSON.stringify(data))
    console.log('confirmFlip',data)
    // socket.broadcast.to(data.currRoom).emit('confirmFlip', data);
    io.to(data.currRoom).emit('confirmFlip', data)
  })

  socket.on('playerChange', data => {
    data = JSON.parse(JSON.stringify(data))
    console.log('playerChange',data)
    io.to(data.currRoom).emit('playerChange', data.card1);
  })

  socket.on('gameFinished', data => {
    data = JSON.parse(JSON.stringify(data))
    io.to(data).emit('gameFinished')
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