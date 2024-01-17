const express = require('express');
const noteRouter = express.Router();

const { createNote, getAllNotes, getNotesById, deleteNoteById, updateNotesById } = require('../controller/notes-controller');
const verifyToken = require('../middleware/verifyToken');

noteRouter.post("/api/create-note", [verifyToken], createNote);
noteRouter.get("/api/get-notes/:course_id", [verifyToken], getAllNotes);
noteRouter.get("/api/get-note/:note_id", [verifyToken], getNotesById);
noteRouter.delete("/api/delete-note/:note_id", [verifyToken], deleteNoteById);
noteRouter.patch("/api/update-note/:note_id", [verifyToken], updateNotesById);

module.exports = noteRouter