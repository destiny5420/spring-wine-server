const STATUS = {
  IDLE: 'Idle',
  PLAYING: 'Playing',
  WAIT_TOPIC: 'WaitTopic',
}

const UNIT_SCORE = 500
const VICTORY_MAX_COUNT = 3
const LOCAL_STORAGE_INDEX = 1
let curAnimateEnd = false
let curGameStatus = STATUS.IDLE
let curVictoryCount = VICTORY_MAX_COUNT
let winnerList = []

module.exports = {
  init: () => {
    curGameStatus = STATUS.PLAYING
    curVictoryCount = VICTORY_MAX_COUNT
    winnerList = []
  },
  statusReset: () => {
    curAnimateEnd = false
    curGameStatus = STATUS.IDLE
    curVictoryCount = VICTORY_MAX_COUNT
    winnerList = []
  },
  reduceVictoryCount: () => {
    curVictoryCount -= 1
  },
  addWinner: (mail) => {
    winnerList.push(mail)
  },
  hasWinner: (mail) => {
    return winnerList.includes(mail)
  },
  isGameOver: () => {
    return curVictoryCount <= 0
  },
  isPlaying: () => {
    return curGameStatus === STATUS.PLAYING
  },
  setStatusToIdle: () => {
    curGameStatus = STATUS.IDLE
  },
  getScore: () => {
    return curVictoryCount * UNIT_SCORE
  },
  getStatus: () => {
    return curGameStatus
  },
  resetAnimateEnd: () => {
    curAnimateEnd = false
  },
  setAnimateEnd: (key) => {
    curAnimateEnd = key
  },
  isAnimateEnd: () => {
    return curAnimateEnd
  },
  getStatusList: STATUS,
  getLocalStorageIndex: LOCAL_STORAGE_INDEX,
}
