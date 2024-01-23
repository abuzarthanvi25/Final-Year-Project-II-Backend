const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const course_schema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: true,
    },
    description: {
        type: String,
        trim: true,
        required: true,
    },
    course_thumbnail: {
        type: String,
    },
    type: {
        type: String,
        enum: ["Personal", "Group"],
        default: "Personal", // Set default value to "Personal"
        required: true,
    },
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
            message: 'A group course can have a maximum of 5 members',
        },
    },
    notes: [{type: Schema.Types.ObjectId, ref: 'notes'}]
})

//creating collection
const courses = new mongoose.model('courses', course_schema)

//export collection
module.exports = { courses };