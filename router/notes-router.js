const express = require('express');
const courseRouter = express.Router();

const { createNote, getAllNotes, getNotesById } = require('../controller/notes-controller');
const verifyToken = require('../middleware/verifyToken');

courseRouter.post("/api/create-note", [verifyToken], createNote);
courseRouter.get("/api/get-notes/:course_id", [verifyToken], getAllNotes);
courseRouter.get("/api/get-note-by-id/:note_id", [verifyToken], getNotesById);

module.exports = courseRouter