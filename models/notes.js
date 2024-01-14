const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notes_schema = new mongoose.Schema({
    data: {
        type: Object,
    },
})

//creating collection
const notes = new mongoose.model('notes', notes_schema)

//export collection
module.exports = { notes };