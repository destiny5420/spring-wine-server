require('dotenv').config()
const MongoRouter = require('./router/mongo.js')
const GameRouter = require('./router/game')
const SocketFlow = require('./assets/js/socketio_flow')
const Global = require('./store/global')
const auth = require('./middleware/auth')
const login = require('./middleware/login')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')
const cors = require('cors')
const corsOptions = {
  origin: process.env.CLIENT ? [process.env.CLIENT] : '*',
  methods: 'GET,POST,DELETE,PUT,PATCH,OPTIONS,HEAD,FETCH',
  allowedHeaders: ['Content-Type', 'Authorization'],
}
const bodyParser = require('body-parser')
const app = Global.getApp()
const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
})

app.set('secret', process.env.SECRET_JWT)
SocketFlow.setIO(io)
new SocketFlow.socketFlow(io)
GameRouter.setIO(io)

app.use(cors(corsOptions))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(morgan('dev'))
app.use(cookieParser(process.env.SECRET_COOKIE))

app.use('/game', GameRouter.router)
app.use('/mongo', MongoRouter)

app.get('/dashboard-login', login, async (req, res) => {
  res.setHeader('Content-Type', 'text/html')
  res.send(`<!DOCTYPE html>
  <html>
    <head>
      <title>登入畫面</title>
      <style>
        body {
          margin: 0;
          padding-bottom: 3rem;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
            Helvetica, Arial, sans-serif;
        }
      </style>
      <script
        src="https://code.jquery.com/jquery-3.6.0.min.js"
        integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4="
        crossorigin="anonymous"
      ></script>
    </head>
    <body>
      <form action="${
        process.env.SERVER_URL || 'http://localhost:9000'
      }/mongo/admin-login" method="post">
        <input type="email" name="email" id="email" placeholder="email" />
        <input
          type="password"
          name="password"
          id="password"
          placeholder="password"
        />
        <button type="submit">送出</button>
      </form>
    </body>
    <script></script>
  </html>
  `)
})
app.get('/dashboard-root', auth, async (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

var port = process.env.PORT || 9000
server.listen(port)

console.log('*** Startup server, port is ' + port + ' ***')
