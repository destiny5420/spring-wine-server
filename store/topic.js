const topicMapTable = ['#00ff01', '#0000fe', '#ffff00']

let curTopic = 'global'

module.exports = {
  setCurTopic: (index) => {
    curTopic = topicMapTable[index]
  },
  getCurTopic: () => {
    return curTopic
  },
}
