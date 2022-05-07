const topic = require('../../store/topic')
const gameStatus = require('../../store/gameStatus')
let curIO = null

function SetNewTopic(data) {
  topic.setCurTopic(data.data.index)
  gameStatus.init()
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
          SetNewTopic(data)

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

    socket.emit('connected', { gameStatus: gameStatus.getStatus() })
  })
}

module.exports = {
  socketFlow: SocketFlow,
  setIO: (io) => {
    curIO = io
  },
}
