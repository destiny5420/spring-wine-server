const topicMapTable = [
  '#00ff01',
  '#0000fe',
  '#ffff00',
  '#fe0000',
  '#ff6400',
  '#ffb901',
  '#a9a832',
  '#c7ff00',
  '#00ffff',
  '#01a1ff',
  '#7100fe',
  '#ff00fe',
  '#8e3d99', // 12 8e3d99
  '#9a3d74',
  '#c84a58',
  '#ff4e68',
  '#ff4dc5',
  '#e74eff',
  '#5f4eff',
  '#0000da',
  '#00349a', // 20 00349a
  '#659b00',
  '#009b01',
  '#9a6f00',
  '#9c1c01',
  '#410b00', // 410b00
]

let curTopic = 'global'

module.exports = {
  setCurTopic: (index) => {
    curTopic = topicMapTable[index]
  },
  getCurTopic: () => {
    return curTopic
  },
}
