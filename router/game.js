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

  /**
   * @description - 遊戲還沒開始，卻收到 Click API
   * 1. 有可能時間差，同時送出兩個 Click API，但第一個 API 剛好結束，第二個 API 需要送 Valid = false 回去
   */
  if (!gameStatus.isPlaying()) {
    response.status(200).send({
      result: '遊戲尚未開始',
      valid: false,
    })
    return
  }

  /**
   * @description - 當送來的顏色編碼不對的時候
   * 1. 回送訊息
   */
  if (!color === topic.getCurTopic()) {
    response.status(200).send({
      result: `不是這個東西喔！`,
      valid: true,
      answerCorrect: false,
    })
    return
  }

  /**
   * @description - 已經得過獎的 mail 卻再次送 Click API，且編碼正確的時候
   * 1. 可能多開視窗
   * 2. 可能多送 API 兩次
   */
  if (gameStatus.hasWinner(email)) {
    response.status(200).send({
      result: '此 Round 你已經是贏家了！',
      valid: false,
    })
    return
  }

  /**
   * @description - 答案正確時的流程
   */
  // 1.增加 mail 至白名單
  gameStatus.addWinner(email)

  // 2. 獲取分數，不能在 reduceVictoryCount() 之後
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
        valid: true,
        answerCorrect: true,
      })
    })
    .catch((err) => {
      response.status(200).send(err)
    })
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
