const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const user_schema = new mongoose.Schema({
    full_name: {
        type: String,
        trim: true,
        required: true,
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique:true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    phone_number: {
        type: String,
        trim: true,
    },
    bio: {
        type: String,
        trim: true,
    },
    profile_picture: {
        type: String,
    },
    friends: [{type: Schema.Types.ObjectId, ref: 'users'}],
    courses: [{type: Schema.Types.ObjectId, ref: 'courses'}],

})

//creating collection
const users = new mongoose.model('users', user_schema)

//export collection
module.exports = { users };