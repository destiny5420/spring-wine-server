const topic = require('../../store/topic')
const gameStatus = require('../../store/gameStatus')
const roomStatus = require('../../store/room')
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
    roomStatus.increasePlayer()

    socket.on('disconnect', () => {
      console.log('user disconnected')
      roomStatus.decreasePlayer()
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
        case 'CS_Animate':
          const animateIndex = data.data.index

          SC_MESSAGE({
            type: 'SC_Animate',
            data: {
              index: animateIndex,
            },
          })
          break
        case 'CS_AnimateClose':
          gameStatus.setAnimateEnd(true)

          SC_MESSAGE({
            type: 'SC_AnimateClose',
          })
          break
        case 'CS_AnimateReset':
          gameStatus.resetAnimateEnd()
          break
        case 'CS_GetLeaderBoard':
          mongoDBFlow
            .leaderBoard()
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
        case 'CS_ServerReset':
          gameStatus.statusReset()
          break
        default:
          break
      }
    })

    socket.emit('connected', {
      isAnimateEnd: gameStatus.isAnimateEnd(),
      localStorageIndex: gameStatus.getLocalStorageIndex,
    })
  })
}

module.exports = {
  socketFlow: SocketFlow,
  setIO: (io) => {
    curIO = io
  },
}
