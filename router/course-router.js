const express = require('express');
const courseRouter = express.Router();

const { createCourse, updateCourseById, getAllCourses, deleteCourseById, addMembers} = require('../controller/course-controller');
const verifyToken = require('../middleware/verifyToken');

courseRouter.post("/api/create-course", [verifyToken], createCourse);
courseRouter.get("/api/get-all-courses", [verifyToken], getAllCourses);
courseRouter.patch("/api/update-course/:course_id", [verifyToken], updateCourseById);
courseRouter.delete("/api/delete-course/:course_id", [verifyToken], deleteCourseById);
courseRouter.post("/api/add-members/:course_id", [verifyToken], addMembers);

module.exports = courseRouter