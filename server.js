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
const chatRouter = require('./router/chat-router');
const { handleCollaboration } = require("./utils/collaborations");
const { handleChats } = require("./utils/chats");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use([userRouter, courseRouter, noteRouter, chatRouter])


connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server running at port http://localhost:${port}`);
  });
})

handleCollaboration(socketInstance)
handleChats(socketInstance)