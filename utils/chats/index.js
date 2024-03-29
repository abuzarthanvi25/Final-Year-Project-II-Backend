const { chatMessages } = require("../../models/chat-message");

const getLatestMessages = async (chat_room_id, limit = 10) => {
    try {
        const allMessages = await chatMessages
            .find({ chat_room_id })
            .populate('sender')
            .sort({ createdAt: -1 })
            .limit(limit)

        return allMessages.reverse(); // Reverse the order to get the latest messages first
    } catch (error) {
        console.error("Error retrieving messages:", error);
        return [];
    }
};

const onlineUsers = new Map();

const getOnlineUsers = () => {
    return Array.from(onlineUsers.keys());
};


const handleChats = (socketInstance) => {
    socketInstance.on("connection", socket => {
        socket.on("join room", async (chat_room_id) => {
            socket.join(chat_room_id);
        });

        socket.on("set online", (user_id) => {
            if(!onlineUsers.has(user_id)){
                onlineUsers.set(user_id, socket.id);
            }
        })

        socket.on("get online users", () => {
            socketInstance.emit("receive online users", getOnlineUsers())
        })

        socket.on("get room messages", async (chat_room_id) => {
            const allMessages = await getLatestMessages(chat_room_id);
            socketInstance.to(chat_room_id).emit("receive room messages", allMessages);
        });

        socket.on("send message", async ({ message, sender, chat_room_id }) => {
            try {
                const newMessage = new chatMessages({ message, sender, chat_room_id });
                await newMessage.save();

                const allMessages = await getLatestMessages(chat_room_id);
                socketInstance.to(chat_room_id).emit("receive new messages", allMessages);
            } catch (error) {
                console.error("Error sending message:", error);
            }
        });

        socket.on("disconnect room", (user_id) => {
            onlineUsers.delete(user_id);
        });
    });
};

module.exports = { handleChats };
