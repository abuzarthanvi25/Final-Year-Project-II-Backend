const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chat_room_schema = new mongoose.Schema({
    members: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'users',
        }],
        validate: {
            validator: function (members) {
                // Ensure that the number of members does not exceed 5
                return members.length <= 5;
            },
            message: 'A chatroom can have a maximum of 5 members',
        },
    },
    type: {
        type: String,
        enum: ["Personal", "Group"],
        default: "Personal", // Set default value to "Personal"
        required: true,
    },
    name: {
        type: String,
    },
    image: {
        public_id: {
            type: String,
        },
        url: {
            type: String,
        },
    }
},
{
    timestamps: true
})

//creating collection
const chatRooms = new mongoose.model('chatRooms', chat_room_schema)

//export collection
module.exports = { chatRooms };