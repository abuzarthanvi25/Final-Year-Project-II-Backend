const { courses } = require("../models/course");
require("dotenv").config();

const createCourse = async (req, res) => {
  try {
  } catch (e) {
    console.error(e);
    return res.status(400).send({
      success: false,
      message: "Something went wrong",
    });
  }
};

const getAllCourses = async (req, res) => {
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

const getCourseById = async (req, res) => {
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

const updateCourseById = async (req, res) => {
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

const deleteCourseById = async (req, res) => {
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

module.exports = { createCourse, getAllCourses, getCourseById, updateCourseById, deleteCourseById };
