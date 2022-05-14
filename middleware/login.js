module.exports = async (req, res, next) => {
  try {
    const token = req.cookies['_bkswToken']

    if (!token) {
      next()
    } else {
      res.status(200).send({ message: `You have successfully logged in` })
    }
  } catch (error) {
    res.status(401).send({ error: `Please authenticate.` })
  }
}
