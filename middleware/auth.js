const jwt = require('jsonwebtoken')
const Global = require('../store/global')
const mongoFlow = require('../assets/js/mongoDB_flow')

module.exports = async (req, res, next) => {
  try {
    const token = req.cookies['_bkswToken']

    if (!token) {
      // return res.status(403).send({ error: `No token provided.` })
      return res.status(403).redirect('../dashboard-login')
    }

    jwt.verify(
      token,
      Global.getApp().get('secret'),
      async function (err, decoded) {
        if (err) {
          return res.status(403).send({
            success: false,
            message: `No token provided.`,
          })
        } else {
          const userData = await mongoFlow.findOne({ email: decoded })
          const { admin } = userData.data

          if (!admin) {
            return res.status(403).send({ error: `Insufficient permissions.` })
          }

          next()
        }
      }
    )
  } catch (error) {
    res.status(401).send({ error: `Please authenticate.` })
  }
}
