const express = require('express');
const courseRouter = express.Router();

const { createCourse, updateCourseById, getCourseById, getAllCourses, deleteCourseById } = require('../controller/course-controller');
const verifyToken = require('../middleware/verifyToken');

courseRouter.post("/api/create-course", [verifyToken], createCourse);

module.exports = courseRouter