const { notes } = require("../models/notes");
require("dotenv").config();

const createNotes = async (req, res) => {
  try {
  } catch (e) {
    console.error(e);
    return res.status(400).send({
      success: false,
      message: "Something went wrong",
    });
  }
};

const getAllNotes = async (req, res) => {
  try {
    
  } catch (e) {
    console.error(e);
    return res.status(400).send({
      success: false,
      message: "Something went wrong",
      data: null
    });
  }
};

const getNotesById = async (req, res) => {
    try {
    
    } catch (e) {
      console.error(e);
      return res.status(400).send({
        success: false,
        message: "Something went wrong",
        data: null
      });
    }
}

const updateNotesById = async (req, res) => {
    try {
    
    } catch (e) {
      console.error(e);
      return res.status(400).send({
        success: false,
        message: "Something went wrong",
        data: null
      });
    }
}

const deleteNotesById = async (req, res) => {
    try {
    
    } catch (e) {
      console.error(e);
      return res.status(400).send({
        success: false,
        message: "Something went wrong",
        data: null
      });
    }
}

String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

module.exports = { createNotes, getAllNotes, getNotesById, updateNotesById, deleteNotesById };
