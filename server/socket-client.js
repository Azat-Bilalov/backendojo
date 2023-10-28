module.exports = (url) => {
  const { io } = require("socket.io-client");
  const socket = io(url);
  socket.on("connect", () => {
    console.log(`connected to station ${url}`);
  });
  socket.on("message", (msg) => {
    console.log(`station ${url} says: ${msg}`);
  });
  socket.on("disconnect", () => {
    console.log(`disconnected from station ${url}`);
  });
  return socket;
};
