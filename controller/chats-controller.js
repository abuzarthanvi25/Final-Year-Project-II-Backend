const { chatRooms } = require("../models/chat-room")
const { chatMessages } = require("../models/chat-message");
const { users } = require("../models/user");

const createChatRoom = async (req, res) => {
    try {
        const { members, name } = req.body;
        const { user } = req.user;

        const currentUser = await users.findById(user._id)

        if (!currentUser) {
            return res.status(400).send({
                status: false,
                message: `User not found`,
            });
        }

        const type = members?.length > 2 ? "Group" : "Personal";

        if(type == 'Group' && !name){
            return res.status(400).send({
                status: false,
                message: `Name is Required`,
            });
        }

        if (!members || !Array.isArray(members) || members.length == 0) {
            return res.status(400).send({
                status: false,
                message: `Members are required`,
            });
        }

        const getReceiverName = async () => {
            if(members[0]){
                const receiver = await users.findById(members[0]);
                if(receiver){
                    return receiver?.full_name
                }
            }

            return ''
    
        } 

        const receiverName = await getReceiverName();

        const newChatRoom = new chatRooms({
            members: [...members, user._id],
            type: type,
            name: type == 'Group' ? name : receiverName
        });

        await newChatRoom.save();

        res.status(201).json({
            status: true,
            message: "Chat room created successfully",
            data: newChatRoom
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            message: 'Error creating chat room',
            error: error.toString(),
        });
    }
};

const getAllChatRooms = async (req, res) => {
    try {

        const { user } = req.user

        const currentUser = await users.findById(user._id)

        if (!currentUser) {
            return res.status(400).send({
                status: false,
                message: `User not found`,
            });
        }

        const chatRoom = await chatRooms.find({
            members: { $in: [user._id] },
        }).populate("members");

        res.status(200).json({
            status: true,
            message: "Chat room get successfully",
            data: chatRoom
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            message: 'Error finding chat room',
            error: error.toString(),
        });
    }
};

const createMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const { user } = req.user;

        const newMessage = new chatMessages({ message, sender_id: user._id });
        await newMessage.save();
        res.status(201).json({
            status: true,
            message: "New Message Created",
            data: newMessage
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            message: 'Error creating message',
            error: error.toString(),
        });
    }
};

const getMessages = async (req, res) => {
    try {
        const { chat_room_id } = req.params;

        if (!chat_room_id) {
            return res.status(400).send({
                status: false,
                message: `chat room not found`,
            });
        }

        const messages = await chatMessages.find({ chat_room_id });

        res.status(200).json({
            status: true,
            message: "Messages get successfully",
            data: messages
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            message: 'Error getting messages',
            error: error.toString(),
        });
    }
};

module.exports = {
    createChatRoom,
    getAllChatRooms,
    createMessage,
    getMessages
}