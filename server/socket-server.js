const { Server } = require("socket.io");

/*
station = {
    "url": {
        "socket": socket,
        "clients": [socket]
    }
*/
const stations = {};

module.exports = (server) => {
  const io = new Server(server);

  io.on("connection", (socket) => {
    console.log("a user connected");

    socket.on("connect to station", (url) => {
      console.log("a user connected to station");
      if (!stations[url]) {
        const stationSocket = require("./socket-client")(url);
        stationSocket.on("connect_error", () => {
          delete stations[url];
          socket.emit("message", `failed to connect to station ${url}`);
        });
        stationSocket.on("connect", () => {
          socket.emit("message", `successfully connected to station ${url}`);
        });
        stations[url] = {
          socket: stationSocket,
          clients: [socket],
        };
      } else {
        socket.emit("message", `successfully connected to station ${url}`);
        stations[url].clients.push(socket);
      }
    });

    socket.on("disconnect", () => {
      console.log("user disconnected");
      Object.values(stations).forEach((station) => {
        station.clients = station.clients.filter((client) => client !== socket);
        if (station.clients.length === 0) {
          station.socket.disconnect();
          delete stations[station.socket.io.uri];
        }
      });
    });
  });

  return io;
};
