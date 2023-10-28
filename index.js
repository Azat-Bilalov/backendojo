const express = require("express");
const { URL } = require("url");
const path = require("path");
const http = require("http");

const app = express();
serverSocket = require("./server/socket-server");
const server = http.createServer(app);

serverSocket(server);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/station", (req, res) => {
  return res.json({ message: "Hello Station" });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
