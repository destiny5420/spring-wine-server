const STATUS = {
  IDLE: 'Idle',
  PLAYING: 'Playing',
  WAIT_TOPIC: 'WaitTopic',
}

const UNIT_SCORE = 100
const VICTORY_MAX_COUNT = 3
const LOCAL_STORAGE_INDEX = 1
let curAnimateEnd = false
let curGameStatus = STATUS.IDLE
let isExample = false
let curVictoryCount = VICTORY_MAX_COUNT
let winnerList = []
let topicTimer = 0

module.exports = {
  init: (dataIndex) => {
    curGameStatus = STATUS.PLAYING
    curVictoryCount = VICTORY_MAX_COUNT
    winnerList = []
    isExample = dataIndex === 0
    topicTimer = Date.now()
  },
  statusReset: () => {
    curAnimateEnd = false
    curGameStatus = STATUS.IDLE
    curVictoryCount = VICTORY_MAX_COUNT
    winnerList = []
    isExample = false
    topicTimer = 0
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
  isExample: () => {
    return isExample
  },
  getTopicTimer: () => {
    return topicTimer
  },
  getStatusList: STATUS,
  getLocalStorageIndex: LOCAL_STORAGE_INDEX,
}
