const express = require('express')
const Global = require('../store/global')
const router = express.Router()
const mongoDBFlow = require('../assets/js/mongoDB_flow')
const loggerFlow = require('../assets/js/logger_flow')
const jwt = require('jsonwebtoken')

router.get('/find', function (request, response) {
  mongoDBFlow
    .leaderBoard()
    .then((result) => {
      response.status(200).send(result)
    })
    .catch((err) => {
      response.status(200).send(err)
    })
})

router.post('/admin-login', function (request, response) {
  const email = request.body.email
  const password = request.body.password

  mongoDBFlow
    .adminLogin({
      email,
      password,
    })
    .then((result) => {
      const { success, message } = result

      if (!success) {
        response.json({ success, message })
      } else {
        const { email } = result
        const token = jwt.sign(email, Global.getApp().get('secret'), {
          // expiresIn: 60 * 60 * 24,
        })

        response.cookie('_bkswToken', token, { httpOnly: true })
        response.status(200).redirect('../dashboard-root')
      }
    })
})

router.post('/register', function (request, response) {
  const name = request.body.name
  const email = request.body.email

  mongoDBFlow
    .register({ name, email })
    .then((result) => {
      loggerFlow.write(`[API-Register] / email: ${email} / name: ${name}`)
      response.status(200).send(result)
    })
    .catch((err) => {
      loggerFlow.write(`[API-Register-err] / error: `, err)
      response.status(200).send(err)
    })
})

router.post('/update', function (request, response) {
  const email = request.body.email
  const score = request.body.score

  mongoDBFlow
    .update({ email, score })
    .then((result) => {
      response.status(200).send(result)
    })
    .catch((err) => {
      response.status(200).send(err)
    })
})

router.post('/gameover', function (request, response) {
  const name = request.body.name
  const score = request.body.score

  mongoDBFlow
    .gameOver({ name, score })
    .then((result) => {
      response.status(200).send(result)
    })
    .catch((err) => {
      response.status(200).send(err)
    })
})

module.exports = router
