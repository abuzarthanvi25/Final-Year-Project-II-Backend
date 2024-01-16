const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notes_schema = new mongoose.Schema({
    data: {
        type: Object,
    },
    course: {
        type: Schema.Types.ObjectId,
        ref: 'courses',
        required: true,
    },
    course_title: {
        type: String,
        // No need to explicitly set required, as it will be populated from the course model
    },
})

//creating collection
const notes = new mongoose.model('notes', notes_schema)

//export collection
module.exports = { notes };