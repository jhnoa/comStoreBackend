function socket(server) {
  let io = require('socket.io')(server);
  console.log('socket.io is ready');
  io.on('connection', (socket) => {
    socket.emit('news', {hello: 'world'});
    socket.on('my other event', (data) => {
      console.log(data);
    });
  });
}

module.exports = socket;
