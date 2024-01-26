const express = require('express');
const chatRouter = express.Router();
const verifyToken = require('../middleware/verifyToken');
const { createChatRoom, getAllChatRooms } = require('../controller/chats-controller');

chatRouter.post("/api/create-chat-room", [verifyToken], createChatRoom);
chatRouter.get("/api/get-chat-rooms", [verifyToken], getAllChatRooms);

module.exports = chatRouter