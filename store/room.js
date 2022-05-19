let curRoomPlayerCount = 0
let registerPlayerCount = 0

module.exports = {
  playerCount: curRoomPlayerCount,
  registerCount: registerPlayerCount,
  increasePlayer() {
    curRoomPlayerCount += 1
    console.log(
      `[Count of the player in the room] RoomPlayerCount: `,
      curRoomPlayerCount
    )
  },
  decreasePlayer() {
    curRoomPlayerCount -= 1
    console.log(
      `[Count of the player in the room] RoomPlayerCount: `,
      curRoomPlayerCount
    )
  },
  registerPlayer() {
    registerPlayerCount += 1
    console.log(
      `[Count of player who has registered] Count: `,
      registerPlayerCount
    )
  },
}
