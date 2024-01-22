const { notes } = require("../models/notes");
const { courses } = require("../models/course");
const { default: mongoose } = require("mongoose");
const { summarizeText, handleTransformSummary } = require('../utils/text-summarization');
require("dotenv").config();
const { readTextFromImage, handleTransformResponse } = require('../utils/image-ocr');

const createNote = async (req, res) => {
  try {
    const { data, course_id, title } = req.body;
    const { user } = req.user;

    if (!user) {
      return res.status(400).json({
        status: false,
        message: `User not found`,
      });
    }

    // Validate required fields
    const requiredFields = ['data', 'course_id', 'title'];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({
          status: false,
          message: `${field.replace('_', ' ').capitalize()} is required`,
        });
      }
    }

    // Check if the course exists
    const course = await courses.findById(course_id);
    if (!course) {
      return res.status(404).json({
        status: false,
        message: 'Course not found',
      });
    }

    // Create a new note
    const newNote = new notes({
      data,
      course: course_id,
      title
    });

    // Populate course_title from the associated course
    await newNote.populate('course', 'title');

    // Save the note to the database
    const savedNote = await newNote.save();

    // Update the course with the new note's id
    await courses.findByIdAndUpdate(course_id, {
      $push: { notes: savedNote._id }, // Fixed: use savedNote._id instead of newNote._id
    });

    res.status(201).json({
      status: true,
      message: 'Note created successfully',
      data: { note: savedNote },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: 'Error creating notes',
      error: error.toString(),
    });
  }
};

const getAllNotes = async (req, res) => {
  try {
    const { course_id } = req.params;
    const page = parseInt(req.query.page) || 1; // Get page from query parameters, default to 1
    const limit = parseInt(req.query.limit) || 10; // Get limit from query parameters, default to 10

    const course = await courses.findById(course_id);

    if (!course) {
      return res.status(404).json({
        status: false,
        message: 'Course not found',
      });
    }

    const skip = (page - 1) * limit;

    const courseNotes = await notes.find({ course: course_id })
      .skip(skip)
      .limit(limit)

    const totalNotes = await notes.countDocuments();

    res.status(200).json({
      status: true,
      message: `Showing ${limit > totalNotes ? totalNotes : limit} notes of total ${totalNotes} notes`,
      data: { notes: courseNotes },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: 'Error fetching notes',
      error: error.toString(),
    });
  }
};

const getNotesById = async (req, res) => {
  try {
    const { note_id } = req.params;

    if (!note_id) {
      return res.status(404).json({
        success: false,
        message: 'note_id is required',
      });
    }

    // Check if the note exists
    const note = await notes.findById(note_id);
    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Note fetched successfully',
      data: { note },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error fetching note',
      error: error.toString(),
    });
  }
}

const updateNotesById = async (req, res) => {
  const { title, data } = req.body;
  const { note_id } = req.params;

  try {
    // Validate if the note_id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(note_id)) {
      return res.status(400).json({ message: 'Invalid note_id' });
    }

    // Find the note by ID
    const existingNote = await notes.findById(note_id);

    // Check if the note exists
    if (!existingNote) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Update the title and data fields if provided
    if (title) {
      existingNote.title = title;
    }

    if (data) {
      existingNote.data = data;
    }

    // Save the updated note
    const updatedNote = await existingNote.save();

    res.json({ message: 'Note updated successfully', updatedNote, status: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error fetching note',
      error: error.toString(),
    });
  }
}

const deleteNoteById = async (req, res) => {
  try {
    const { note_id } = req.params;

    // Check if note_id is provided
    if (!note_id) {
      return res.status(400).json({
        status: false,
        message: 'Note ID is required',
      });
    }

    // Check if the note exists
    const note = await notes.findById(note_id);
    if (!note) {
      return res.status(404).json({
        status: false,
        message: 'Note not found',
      });
    }

    // Remove the note reference from the associated course
    await courses.findByIdAndUpdate(note.course, { $pull: { notes: note_id } });

    // Delete the note
    await notes.findByIdAndDelete(note_id);

    res.status(200).json({
      status: true,
      message: 'Note deleted successfully',
      data: { note },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: 'Error deleting note',
      error: error.toString(),
    });
  }
};

const summarizeNotes = async (req, res) => {
  try {
    const requiredFields = ['course_title', 'data'];
    const {course_title, data} = req.body;
    const {note_id} = req.params;

    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).send({
          status: false,
          message: `${field.replace('_', ' ').capitalize()} is required`,
        });
      }
    }

    if (!mongoose.Types.ObjectId.isValid(note_id)) {
      return res.status(400).json({ message: 'Invalid note_id' });
    }

    // Find the note by ID
    const existingNote = await notes.findById(note_id);

    // Check if the note exists
    if (!existingNote) {
      return res.status(404).json({ message: 'Note not found' });
    }

    const {summary, error} = await summarizeText(course_title, JSON.parse(data));

    await notes.findByIdAndUpdate({_id: note_id}, {data: JSON.stringify(handleTransformSummary(summary)), is_summarized: true});

    if(error){
      return res.status(400).json({
        status: false,
        message: 'Error summarizing notes',
        error: error
      });
    }

    return res.json({
      status: true,
      message: 'Note summarized successfully',
      data: summary
    })
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: 'Error deleting note',
      error: error.toString(),
    });
  }
}

const getTextFromImageWithOCR = async (req, res) => {
  try {
    const imageBuffer = req.file.buffer;
    const result = await readTextFromImage(imageBuffer);
    res.json({ 
      status: true,
      message: 'Text extracted from image successfully',
      data: JSON.stringify(handleTransformResponse(result))
     });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      status: false,
      message: 'Error extracting text from note',
      error: error.toString(),
    });
  }
}

String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

module.exports = { createNote, getAllNotes, getNotesById, updateNotesById, deleteNoteById, summarizeNotes, getTextFromImageWithOCR };
