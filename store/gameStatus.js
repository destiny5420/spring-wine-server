const STATUS = {
  IDLE: 'Idle',
  PLAYING: 'Playing',
  WAIT_TOPIC: 'WaitTopic',
}

let curGameStatus = STATUS.IDLE

module.exports = {
  setStatus: (type) => {
    curGameStatus = type
  },
  getStatus: () => {
    return curGameStatus
  },
  getStatusList: STATUS,
}
