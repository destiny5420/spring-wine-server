const STATUS = {
  IDLE: 'Idle',
  PLAYING: 'Playing',
  WAIT_TOPIC: 'WaitTopic',
}

const UNIT_SCORE = 500
const VICTORY_MAX_COUNT = 2
let curGameStatus = STATUS.IDLE
let curVictoryCount = VICTORY_MAX_COUNT

module.exports = {
  init: () => {
    curVictoryCount = VICTORY_MAX_COUNT
    curGameStatus = STATUS.PLAYING
  },
  reduceVictoryCount: () => {
    curVictoryCount -= 1
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
  getStatusList: STATUS,
}
