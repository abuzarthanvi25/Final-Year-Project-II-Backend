const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notes_schema = new mongoose.Schema({
    title: {
        type: String
    },
    data: {
        type: String,
    },
    course: {
        type: Schema.Types.ObjectId,
        ref: 'courses',
        required: true,
    },
    is_summarized: {
        type: Schema.Types.Boolean,
        default: false,
    }
},
    {
        timestamps: {
            updatedAt: 'updated_at'
        }
    })

//creating collection
const notes = new mongoose.model('notes', notes_schema)

//export collection
module.exports = { notes };