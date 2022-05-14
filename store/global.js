const express = require('express')
let app = null

module.exports = {
  getApp: () => {
    if (!app) {
      app = express()
    }

    return app
  },
}
