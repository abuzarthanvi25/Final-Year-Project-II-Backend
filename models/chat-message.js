const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chat_message_schema = new mongoose.Schema({
    chat_room_id: {
        type: Schema.Types.ObjectId,
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'users' // Reference the 'User' model
    },
    message: {
        type: String
    }
},
    {
        timestamps: true
    })

//creating collection
const chatMessages = new mongoose.model('chatMessages', chat_message_schema)

//export collection
module.exports = { chatMessages };