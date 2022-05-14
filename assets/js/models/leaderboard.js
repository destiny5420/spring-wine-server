const mongoose = require('mongoose')

let LeaderBoardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: false,
  },
  score: {
    type: Number,
    required: false,
    default: 0,
  },
  admin: {
    type: Boolean,
    required: false,
    default: false,
  },
  password: {
    type: String,
    required: false,
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model('LeaderBoard', LeaderBoardSchema)
