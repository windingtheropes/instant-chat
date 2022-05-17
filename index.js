const express = require('express');
const app = express();
const http = require('http');
const { SocketAddress } = require('net');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

var activeUsers = 0;

const port = 3000

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

var messages = []

function printUserCount() {console.log(`There are ${activeUsers} user(s) online.`)}

io.on('connection', (socket) => {
  console.log('A user connected');
  activeUsers++

  printUserCount()

  messages.forEach(m => socket.emit('message', m))

  socket.on('message', (msg) => {
    if(msg.content.toLowerCase() === '/clear')
    { 
      messages = []
      io.emit('reload')
    }

    messages.push(msg)
    io.emit('message', msg)
    })

  socket.on('disconnect', () => {
    console.log('A user disconnected');
    activeUsers--

    printUserCount()
  })
});



server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});