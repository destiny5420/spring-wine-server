const topic = require('../../store/topic')
const gameStatus = require('../../store/gameStatus')
const mongoDBFlow = require('../../assets/js/mongoDB_flow')
const loggerFlow = require('../../assets/js/logger_flow')
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

          loggerFlow.write(
            `[CS_DashboardNewTopic] / index: ${
              data.data.index
            } / color: ${topic.getCurTopic()}`
          )

          SC_MESSAGE({
            type: 'SC_DashboardNewTopic',
            data: {
              index: data.data.index,
            },
          })
          break
        case 'CS_GetLeaderBoard':
          mongoDBFlow
            .find()
            .then((result) => {
              SC_MESSAGE({
                type: 'SC_ShowLeaderBoard',
                data: {
                  leaderBoard: result,
                },
              })
            })
            .catch((err) => {
              response.status(200).send(err)
            })
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
