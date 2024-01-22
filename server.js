const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;

const { connectDB } = require('./config/db');
const { socketInstance } = require("./config/socket")
const userRouter = require('./router/user-router');
const courseRouter = require('./router/course-router');
const noteRouter = require('./router/notes-router');

// Enable CORS for all routes
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use([userRouter, courseRouter, noteRouter]);

app.get('/', (_, res) => res.json({message: 'Status Healthy kela'}));


connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server running at port http://localhost:${port}`);
  });
})

// socketInstance.on("connection", socket => {

//   socket.on('connect', () => {
//     console.log(`Connection to ${port+1} successful.`);
//     socket.destroy(); // Close the connection after successful test
//   });

//   socket.on('timeout', () => {
//       console.log(`Connection to ${port+1} timed out.`);
//       socket.destroy(); // Destroy the socket if a timeout occurs
//   });

//   socket.on('error', (err) => {
//       console.error(`Connection to ${port+1} failed. Error: ${err.message}`);
//       socket.destroy(); // Destroy the socket on error
//   });

// })