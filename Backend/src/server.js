const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Io = require("socket.io");
const routes = require("./routes");
const { log } = require("console");

const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

const connectedUsers = {};

io.on("connection", (socket) => {
  const {user} = socket.handshake.query;
  connectedUsers[user] = socket.id;
});

mongoose.connect(
  "mongodb+srv://andrei10:andrei10@bancodoandrei.x93gx.mongodb.net/<dbname>?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
);

app.use((req, res, next) => {
  req.io = Io;
  req.connectedUsers = connectedUsers;

  return next();
});  

app.use(cors());
app.use(express.json());
app.use(routes);
server.listen(3333);
