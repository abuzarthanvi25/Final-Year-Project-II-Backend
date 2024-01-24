const { courses } = require("../models/course");
const { notes } = require('../models/notes');
const { users } = require('../models/user');
const { default: mongoose } = require("mongoose");
require("dotenv").config();

const createCourse = async (req, res) => {
  try {
    const { title, description, course_thumbnail, type, members = [] } = req.body;
    const { user } = req.user;

    const currentUser = await users.findById(user._id);

    if (!currentUser) {
      return res.status(400).send({
        status: false,
        message: 'User not found',
      });
    }

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
      members: type === 'Group' ? [...members, user?._id] : [user?._id], // Include members only for 'Group' type
      notes: [], // by default 0 notes
    });

    await newCourse.save();

    // Add the course_id to the courses array for all members
    const memberIds = type === 'Group' ? [user?._id ,members] : [user?._id];
    await users.updateMany(
      { _id: { $in: memberIds } },
      { $push: { courses: newCourse._id } }
    );

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

    let query = { type, members: user._id };
    
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
    const { course_id } = req.params;
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
    const { course_id } = req.params;

    // Check if course_id is provided
    if (!course_id) {
      return res.status(400).json({
        status: false,
        message: 'Course ID is required',
      });
    }

    // Check if the course exists
    const course = await courses.findById(course_id);
    if (!course) {
      return res.status(404).json({
        status: false,
        message: 'Course not found',
      });
    }

    // Get the list of users having the specified course
    const usersWithCourse = await users.find({ courses: course_id });

    // Remove the course ID from each user's courses array
    await Promise.all(usersWithCourse.map(user => user.updateOne({ $pull: { courses: course_id } })));

    // Delete the course
    await courses.findByIdAndDelete(course_id);

    // Remove the course reference from associated notes
    await notes.deleteMany({ course: course_id });

    res.status(200).json({
      status: true,
      message: 'Course deleted successfully',
      data: { course },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: 'Error deleting course',
      error: error.toString(),
    });
  }
};

const addMembers = async (req, res) => {
  try {
    const course_id = req.params.course_id;
    const { members } = req.body;
    const { user } = req.user;

    if (!course_id) {
      return res.status(400).json({ error: 'course_id is required', status: false, message: 'Error adding members' });
    }

    if (!mongoose.Types.ObjectId.isValid(course_id)) {
      return res.status(400).json({ error: 'Invalid course_id', status: false, message: 'Error adding members' });
    }

    const groupCourse = await courses.findOne({ _id: course_id, type: 'Group' });
    if (!groupCourse) {
      return res.status(404).json({ error: 'Group course not found', status: false, message: 'Error adding members' });
    }

    // Ensure that members are friends of the current user
    const currentUser = await users.findById(user._id).populate('friends');
    const friendIds = currentUser.friends.map(friend => friend._id.toString());
    const nonFriendMembers = members.filter(member => !friendIds.includes(member));

    if (nonFriendMembers.length > 0) {
      return res.status(400).json({
        error: 'Not all members are friends of the current user',
        status: false,
        message: 'Error adding members',
      });
    }

    const existingMembers = groupCourse.members.map(member => member.toString());
    const newMembers = members.filter(member => !existingMembers.includes(member));

    if (groupCourse.members.length + newMembers.length > 5) {
      return res.status(400).json({
        error: 'Course member limit exceeded (max 5 members)',
        status: false,
        message: 'Error adding members',
      });
    }

    groupCourse.members.push(...newMembers);
    await groupCourse.save();

    await users.updateMany(
      { _id: { $in: newMembers } },
      { $addToSet: { courses: course_id } }
    );

    return res.status(200).json({ message: 'Members added successfully', status: true, data: null });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: 'Error adding members',
      error: error.toString(),
    });
  }
};



String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

module.exports = { createCourse, getAllCourses, updateCourseById, deleteCourseById, addMembers };
