// chat data = array of object {userId: userId, sender: 'admin' | 'customer', message: string, timestamp: Date.now()}
const saveChat = require('./saveChat');
const historyChat = require('./historyChat');

function joinRoom(socket, name) {
  let rooms = Object.keys(socket.rooms);
  if (rooms.length > 0 && rooms[0] !== name) {
    socket.leave(rooms[0]);
  }
  socket.join(name);
}

function socket(server) {
  let io = require('socket.io')(server);
  io.on('connection', (socket) => {
    let userId = '';
    socket.on('auth', async(auth) => {
      userId = auth;
      joinRoom(socket, userId);
      let history = await historyChat(userId);
      console.log(history);
      io.sockets.in(userId).emit('history', history);
    });
    socket.on('toServerChat', (chatData) => {
      io.sockets.in(userId).emit('toClientChat', chatData);
      io.sockets.in(userId).emit('toClientChat', {
        ...chatData,
        data: {
          ...chatData.data,
          sender: chatData.data.sender === 'admin' ? 'customer' : 'admin',
        },
      });
      saveChat(chatData);
    });
  });
}

module.exports = socket;
