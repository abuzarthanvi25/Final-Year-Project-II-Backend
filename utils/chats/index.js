const { chatMessages } = require("../../models/chat-message");
const { chatRooms } = require("../../models/chat-room");
const { getKey } = require("../common-helper");

const handleChats = (socketInstance) => {
    socketInstance.on("connection", socket => {
        socket.on("join room", async (chat_room_id) => {
            socket.join(chat_room_id);
        })

        socket.on("get room messages", async (chat_room_id) => {
            try {
                const allMessages = await chatMessages.find({ chat_room_id }).populate('sender')

                if (allMessages) {
                    socketInstance.to(chat_room_id).emit("receive room messages", allMessages)
                }
            } catch (error) {
                console.error("Error retrieving messages:", error);
            }
        })

        socket.on("send message", async ({ message, sender, chat_room_id }) => {
            try {
                const newMessage = new chatMessages({ message, sender, chat_room_id });

                await newMessage.save();

                const allMessages = await chatMessages.find({ chat_room_id }).populate('sender');

                if (allMessages) {
                    socketInstance.to(chat_room_id).emit("receive new messages", allMessages)
                }
            } catch (error) {
                console.error("Error sending message:", error);
            }
        })
    });
};

module.exports = { handleChats };
