var winston = require('winston')
var S3StreamLogger = require('s3-streamlogger').S3StreamLogger

let dt = Date.now()
const folderName = `${new Date(dt).getFullYear()}-${new Date(
  dt
).getMonth()}-${new Date(dt).getDate()}`

var s3_stream = new S3StreamLogger({
  bucket: process.env.LOGGER_BUCKET,
  folder: folderName,
  access_key_id: process.env.LOGGER_KEY_ID,
  secret_access_key: process.env.LOGGER_ACCESS_KEY,
})

var transport = new winston.transports.Stream({
  stream: s3_stream,
})

transport.on('error', function (err) {
  /* ... */
})

var logger = winston.createLogger({
  transports: [transport],
})

function getDateMsg() {
  const dt = Date.now()
  const msgDate = `${new Date(dt).getFullYear()}-${new Date(
    dt
  ).getMonth()}-${new Date(dt).getDate()}-${new Date(dt).getHours()}-${new Date(
    dt
  ).getMinutes()}-${new Date(dt).getMilliseconds()}`

  return msgDate
}

module.exports = {
  write: (text) => {
    const message = `${getDateMsg()} / ${text}`

    logger.info(message)
  },
}
