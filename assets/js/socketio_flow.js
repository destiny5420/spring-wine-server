console.log(`sockio flow`);
function SocketFlow(io) {
  io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });

    socket.on('chat message', (msg) => {
      console.log(`chat message: `, msg);
      io.emit('chat message', msg);
    })
  });
}

module.exports = {
  socketFlow: SocketFlow
}
