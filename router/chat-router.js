const express = require('express');
const chatRouter = express.Router();
const verifyToken = require('../middleware/verifyToken');
const { createChatRoom } = require('../controller/chats-controller');

chatRouter.post("/api/create-chat-room", [verifyToken], createChatRoom);

module.exports = chatRouter