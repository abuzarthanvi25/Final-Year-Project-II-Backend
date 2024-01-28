const express = require('express');
const chatRouter = express.Router();
const verifyToken = require('../middleware/verifyToken');
const { createChatRoom, getAllChatRooms, deleteChatRoomById, deleteMessageById } = require('../controller/chats-controller');

chatRouter.post("/api/create-chat-room", [verifyToken], createChatRoom);
chatRouter.get("/api/get-chat-rooms", [verifyToken], getAllChatRooms);
chatRouter.delete("/api/delete-chat-room/:chat_room_id", [verifyToken], deleteChatRoomById);
chatRouter.delete("/api/delete-message/:message_id", [verifyToken], deleteMessageById);

module.exports = chatRouter