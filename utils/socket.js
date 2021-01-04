let io;

// file to store io from socket.io
module.exports = {
  init: (server) => {
    io = require("socket.io")(server);
    return io;
  },

  io: () => {
    if (!io) {
      throw new Error("socket io not initialized");
    }

    return io;
  },
};
