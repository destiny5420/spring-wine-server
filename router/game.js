const express = require('express')
const router = express.Router()
const topic = require('../store/topic')
const mongoDBFlow = require('../assets/js/mongoDB_flow')
const gameStatus = require('../store/gameStatus')

let curIO = null

function SC_MESSAGE(data) {
  curIO.emit('SC_MESSAGE', data)
}

router.post('/click', function (request, response) {
  const name = request.body.name
  const email = request.body.email
  const color = request.body.color

  console.log(
    `[Click] / name: ${name} / email: ${email} / correctColor: ${topic.getCurTopic()} / color: ${color}`
  )

  if (color === topic.getCurTopic()) {
    const score = gameStatus.getScore()
    gameStatus.reduceVictoryCount()

    const isGameOver = gameStatus.isGameOver()

    if (isGameOver) {
      gameStatus.setStatusToIdle()
      SC_MESSAGE({
        type: 'SC_GAME_OVER',
      })
    }

    mongoDBFlow
      .addScore({ email, score })
      .then((result) => {
        SC_MESSAGE({
          type: 'SC_GAME_VICTORY',
          data: {
            name: name,
            mail: email,
            gameStatus: gameStatus.getStatus(),
          },
        })
        response.status(200).send({
          ...result,
          answerCorrect: true,
        })
      })
      .catch((err) => {
        response.status(200).send(err)
      })
  } else {
    response.status(200).send({
      result: `不是這個東西喔！`,
      answerCorrect: false,
    })
  }
})

router.get('/get-game-status', function (req, res) {
  res.status(200).send({
    gameStatus: gameStatus.getStatus(),
  })
})

module.exports = {
  router,
  setIO: (io) => {
    curIO = io
  },
}
