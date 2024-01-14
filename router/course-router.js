const express = require('express');
const courseRouter = express.Router();

const { createCourse, updateCourseById, getCourseById, getAllCourses, deleteCourseById } = require('../controller/course-controller');

courseRouter.post("/api/signup", signUp);
courseRouter.post("/api/signin", signin);

// router.get("/api/getUserProfile", [verifyToken], getUserProfile);

module.exports = courseRouter