const topicMapTable = [
  '#0a4a00',
  '#30fefc',
  '#3f5992',
  '#007a3f',
  '#7b9fd1',
  '#8e8e8e',
  '#10b500',
  '#38a1da',
  '#42ceff',
  '#53aa25',
  '#67ffff',
  '#83d883',
  '#89b792',
  '#99ff77',
  '#308c7d',
  '#0600ff',
  '#895a91',
  '#4201ff',
  '#4601b6',
  '#006917',
  '#059303',
  '#343434',
  '#708367',
  '#8e8e8e',
  '#960063',
  '#a6bddf',
  '#a7dce0',
  '#a13bfe',
  '#a374ff',
  '#aaa264',
  '#ad3900',
  '#af005d',
  '#b0895e',
  '#bc86b8',
  '#bdfed4',
  '#9fefbc',
  '#df6037',
  '#e1829d',
  '#e2ad9d',
  '#e5ff08',
  '#e8cd74',
  '#e2829e',
  '#e28365',
  '#e60182',
  '#eccdb9',
  '#ec2601',
  '#eeffb8',
  '#f8b183',
  '#f756fc',
  '#ff8b3b',
  '#ff9a96',
  '#fe12fa',
  '#ff060c',
  '#feb8ec',
  '#ffd336',
  '#ffffff',
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
