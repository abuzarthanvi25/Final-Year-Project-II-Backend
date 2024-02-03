const { server } = require('../server');

const socketInstance = require("socket.io")(server, {
    cors: {
      origin: [process.env.FRONTEND_URL1, process.env.FRONTEND_URL2,"http://127.0.0.1:5173"],
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    },
});

module.exports = {socketInstance};