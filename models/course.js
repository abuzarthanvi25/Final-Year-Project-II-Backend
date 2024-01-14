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
    },
    course_thumbnail: {
        type: String,
    },
    notes: [{type: Schema.Types.ObjectId, ref: 'notes'}]

})

//creating collection
const courses = new mongoose.model('courses', course_schema)

//export collection
module.exports = { courses };