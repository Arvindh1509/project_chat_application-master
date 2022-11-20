const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const cors = require('cors');

const { addUser, removeUser, getUser, getUsersInRoom } = require('./users');//importing functions from the users.js file and using it here.

const router = require('./router');

const app = express();
const server = http.createServer(app);
const io = socketio(server); //declaring for the use of socketio

app.use(cors());
app.use(router);

io.on('connect', (socket) => {   //connecting the socket
  socket.on('join', ({ name, room }, callback) => { //user is joining 
    const { error, user } = addUser({ id: socket.id, name, room });//validation of the user using adduser function

    if(error) return callback(error);

    socket.join(user.room);//client is insdie the room

    socket.emit('message', { user: 'admin', text: `${user.name}, welcome to room ${user.room}.`});//welcome message for the new user
    socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined!` });//broadcating message abt the new user

    io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) }); //displaying the online members in the room visible to every user

    callback();
  });

  socket.on('sendMessage', (message, callback) => {
    const user = getUser(socket.id);//to tell who is sending the message

    io.to(user.room).emit('message', { user: user.name, text: message });//to show the message what the user sends to the whole room

    callback();
  });

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);//removing the user from the server

    if(user) {
      io.to(user.room).emit('message', { user: 'Admin', text: `${user.name} has left.` });//to show the room the user has left 
      io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)});//updating the online members in the textfield
    }
  })
});

server.listen(process.env.PORT || 5000, () => console.log(`Server has started.`));