const mongoose = require('mongoose')
const roomStatue = require('../../store/room')
const gameStatus = require('../../store/gameStatus')
const LeaderBoard = require('./models/leaderboard')
const url = `mongodb+srv://player:${process.env.MONGODB_PASSWORD}@leaderboard.zpdh3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const db = mongoose.connection
db.on('error', (err) => {
  console.error(`connection error`, err)
})
db.once('open', (db) => console.log(`Connected to MonoDB`))

async function adminLogin(data) {
  const findObj = await LeaderBoard.find({
    email: data.email,
  })

  if (findObj.length <= 0) {
    return {
      success: false,
      message: `User does't exist.`,
    }
  }

  if (!findObj[0].admin) {
    return {
      success: false,
      message: `Authenticate failed.`,
    }
  }

  if (findObj[0].password !== data.password) {
    return {
      success: false,
      message: `Incorrect password.`,
    }
  }

  return {
    email: findObj[0].email,
    success: true,
    message: `Sign in suceesfully.`,
  }
}

async function findOne(data) {
  const user = await LeaderBoard.findOne({
    email: data.email,
  })

  if (!user) {
    throw new Error()
  }

  return {
    success: true,
    result: 'User found successfully.',
    data: user,
  }
}

async function register(data) {
  const findObj = await LeaderBoard.find({
    email: data.email,
  })
  // console.log(`register / findObj: `, findObj)

  if (findObj.name !== data.name) {
    await LeaderBoard.findOneAndUpdate(
      {
        email: data.email,
      },
      {
        name: data.name,
      }
    )
  }

  // The user already exits
  if (findObj.length !== 0) {
    return {
      success: true,
      result: 'The user already exits',
      name: data.name,
      email: data.email,
      localStorageIndex: gameStatus.getLocalStorageIndex,
    }
  }

  const createObj = await LeaderBoard.create({
    email: data.email,
    name: data.name,
  })

  roomStatue.registerPlayer()

  return {
    success: true,
    result: 'register successfully!',
    name: data.name,
    email: data.email,
    localStorageIndex: gameStatus.getLocalStorageIndex,
  }
}

async function update(data) {
  try {
    const filter = {
      email: data.email,
    }

    const update = {
      score: data.score,
    }

    const findObj = await LeaderBoard.find(filter)

    if (data.score <= findObj[0].score && findObj.length === 1) {
      return { email: findObj[0].email, score: findObj[0].score }
    } else {
      await LeaderBoard.findOneAndUpdate(filter, update)
      return {
        email: data.email,
        score: data.score,
      }
    }
  } catch (err) {
    return {
      result: err.stack,
      success: false,
    }
  }
}

async function addScore(data) {
  try {
    const filter = {
      email: data.email,
    }

    const findObj = await LeaderBoard.find(filter)
    const resultScore = findObj[0].score + data.score

    console.log(
      `[addScore] / email: `,
      data.email,
      ` / originScore: ${findObj[0].score} / addScore: ${data.score} / resultScore: ${resultScore}`
    )

    const update = {
      score: resultScore,
    }

    await LeaderBoard.findOneAndUpdate(filter, update)

    return {
      email: data.email,
      score: resultScore,
      success: true,
    }
  } catch (err) {
    return {
      result: err.stack,
      success: false,
    }
  }
}

async function leaderBoard() {
  try {
    const sortQuery = {
      score: -1,
    }
    const cursor = await LeaderBoard.find().sort(sortQuery).limit(50)

    const resultObj = []
    for (let i = 0; i < cursor.length; i++) {
      const data = await LeaderBoard.findById(cursor[i]._id)

      resultObj.push({
        name: data.name,
        email: data.email,
        score: data.score,
      })
    }

    return {
      success: true,
      result: resultObj,
    }
  } catch (err) {
    return {
      message: err.stack,
      success: false,
    }
  }
}

module.exports = {
  register: async (data) => {
    return await register(data)
  },
  adminLogin: async (data) => {
    return await adminLogin(data)
  },
  findOne: async (data) => {
    return await findOne(data)
  },
  update: async (data) => {
    return await update(data)
  },
  addScore: async (data) => {
    return await addScore(data)
  },
  leaderBoard: async () => {
    return await leaderBoard()
  },
  gameOver: async (data) => {
    const playerData = await update(data)

    const findData = await find()

    return {
      success: true,
      result: {
        topUsers: findData,
        player: playerData.data,
      },
    }
  },
}
