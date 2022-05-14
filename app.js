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
  res.sendFile(__dirname + '/login.html')
})
app.get('/dashboard-root', auth, async (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

var port = process.env.PORT || 9000
server.listen(port)

console.log('*** Startup server, port is ' + port + ' ***')
