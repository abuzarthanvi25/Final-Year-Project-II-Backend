const { chatMessages } = require("../../models/chat-message");
const { chatRooms } = require("../../models/chat-room");
const { getKey } = require("../common-helper");

global.onlineUsers = new Map();

const handleChats = (socketInstance) => {
    socketInstance.on("connection", socket => {
        
    });
};

module.exports = { handleChats };
