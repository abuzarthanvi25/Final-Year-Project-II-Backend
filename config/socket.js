const socketInstance = require("socket.io")(parseInt(process.env.PORT)+1, {
    cors: {
      origin: `http://localhost:${process.env.PORT}`,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    },
});

module.exports = {socketInstance};