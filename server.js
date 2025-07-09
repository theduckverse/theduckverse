
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

app.use(cors());
app.use(express.json());

let players = {};
let leaderboard = [];

app.get("/", (req, res) => {
  res.send("Duckverse backend running");
});

io.on("connection", (socket) => {
  console.log("New connection");

  socket.on("newPlayer", ({ id, metadata }) => {
    players[id] = { x: 400, y: 300, metadata };
    io.emit("state", players);
  });

  socket.on("movement", ({ id, x, y }) => {
    if (players[id]) {
      players[id].x = x;
      players[id].y = y;
      io.emit("state", players);
    }
  });

  socket.on("disconnect", () => {
    for (const id in players) {
      if (players[id].socket === socket) {
        delete players[id];
      }
    }
    io.emit("state", players);
  });
});

app.post("/leaderboard", (req, res) => {
  const { address, score } = req.body;
  leaderboard.push({ address, score });
  leaderboard.sort((a, b) => b.score - a.score);
  if (leaderboard.length > 10) leaderboard = leaderboard.slice(0, 10);
  res.send({ success: true });
});

app.get("/leaderboard", (req, res) => {
  res.json(leaderboard);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log("Duckverse backend listening on port", PORT));
