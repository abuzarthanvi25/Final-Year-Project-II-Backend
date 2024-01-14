const { courses } = require("../models/course");
const { users } = require('../models/user');
require("dotenv").config();

const createCourse = async (req, res) => {
  try {
    const { title, description, course_thumbnail, type, members } = req.body;
    const {user} = req.user;

    const requiredFields = ['title', 'description', 'type'];

    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).send({
          status: false,
          message: `${field.replace('_', ' ').capitalize()} is required`,
        });
      }
    }

    const newCourse = new courses({
      title,
      description,
      course_thumbnail,
      type,
      members: type === 'Group' ? members : [], // Include members only for 'Group' type
      notes: [], // by default 0 notes
    });

    await newCourse.save();

    await users.findByIdAndUpdate(user._id, {
      $push: { courses: newCourse._id },
    });

    res.status(201).json({
      status: true,
      message: 'Course created successfully',
      data: { course: newCourse },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: 'Error creating course',
      error: error.toString(),
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
