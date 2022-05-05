const express = require('express')
const router = express.Router()
const topic = require('../store/topic')
const mongoDBFlow = require('../assets/js/mongoDB_flow')

let curIO = null

function SC_MESSAGE(data) {
  curIO.emit('SC_MESSAGE', data)
}

router.post('/click', function (request, response) {
  const name = request.body.name
  const email = request.body.email
  const color = request.body.color

  console.log(`name: ${name} / email: ${email} / color: ${color}`)
  console.log(`getCurTopic: ${topic.getCurTopic()}`)

  if (color === topic.getCurTopic()) {
    console.log('你找到了')

    mongoDBFlow
      .update({ email, score: 500 })
      .then((result) => {
        SC_MESSAGE({
          type: 'SC_GAME_VICTORY',
          data: {
            name: 'paper',
            mail: 'paper.hsiao@gmail.com',
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
    console.log('找錯了')
    response.status(200).send({
      result: `不是這個東西喔！`,
      answerCorrect: false,
    })
  }
})

module.exports = {
  router,
  setIO: (io) => {
    curIO = io
  },
}
