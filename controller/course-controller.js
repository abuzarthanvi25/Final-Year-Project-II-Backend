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
      members: type === 'Group' ? members : [user?._id], // Include members only for 'Group' type
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

//NOTE - Get Courses for current user
const getAllCourses = async (req, res) => {
  try {
    const { user } = req.user;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const type = req.query.type || null;

    let query = {};
    
    if (type) {
      if (type === 'Personal') {
        query = { type, members: user._id };
      } else {
        query = { type };
      }
    }

    const coursesData = await courses
      .find(query)
      .limit(limit)
      .skip((page - 1) * limit)
      .populate('members'); // Assuming you want to populate only some fields of the members

    const totalCourses = await courses.countDocuments(query);

    res.status(200).json({
      status: true,
      message: `Showing ${limit > totalCourses ? totalCourses : limit} courses of total ${totalCourses} courses`,
      data: { courses: coursesData },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: 'Error fetching courses',
      error: error.toString(),
    });
  }
};



const updateCourseById = async (req, res) => {
  try {
    const { id: course_id } = req.params;
    const { members, notes, ...updatedFields } = req.body;

    // Check if members or notes fields are provided in the request body
    if (members || notes) {
      return res.status(400).json({ error: 'Members and notes fields are non-editable' });
    }

    // Update the course excluding members and notes fields
    const updatedCourse = await courses.findByIdAndUpdate({_id: course_id}, updatedFields);

    if (!updatedCourse) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.status(200).json({
      status: true,
      message: 'Course updated successfully',
      data: null,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: 'Error updating course',
      error: error.toString(),
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

module.exports = { createCourse, getAllCourses, updateCourseById, deleteCourseById };
