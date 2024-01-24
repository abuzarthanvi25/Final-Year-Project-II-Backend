const socketInstance = require("socket.io")(parseInt(process.env.SOCKET_PORT), {
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    },
});

module.exports = {socketInstance};