const topic = require('../../store/topic')
let curIO = null

function CS_Dashboard_New_Topic(data) {
  topic.setCurTopic(data.data.index)
  console.log(`cur topic: `, topic.getCurTopic())
}

function SC_MESSAGE(data) {
  curIO.emit('SC_MESSAGE', data)
}

function SocketFlow(io) {
  io.on('connection', (socket) => {
    console.log('a user connected')

    socket.on('disconnect', () => {
      console.log('user disconnected')
    })

    socket.on('CS_MESSAGE', (data) => {
      console.log(`CS_MESSAGE: `, data)

      switch (data.type) {
        case 'CS_DashboardNewTopic':
          CS_Dashboard_New_Topic(data)
          SC_MESSAGE({
            type: 'SC_DashboardNewTopic',
            data: {
              index: data.data.index,
            },
          })
          break
        case 'CS_GAME_CLICK':
          console.log(`CS_GAME_CLICK / data: `, data)
          break
        default:
          break
      }
    })

    // socket.broadcast.emit('hi', { some: "data" });
  })
}

module.exports = {
  socketFlow: SocketFlow,
  setIO: (io) => {
    curIO = io
  },
}
