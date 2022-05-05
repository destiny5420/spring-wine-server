require("dotenv").config();
const MongoRouter = require("./router/mongo.js");
const { socketFlow } = require("./assets/js/socketio_flow");
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

new socketFlow(io)

const cors = require("cors");
const corsOptions = {
  origin: "*",
  methods: "GET,POST,DELETE,PUT,PATCH,OPTIONS,HEAD,FETCH",
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/mongo", MongoRouter);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});



var port = process.env.PORT || 9000;
server.listen(port);

console.log("*** Startup server, port is " + port + " ***");
