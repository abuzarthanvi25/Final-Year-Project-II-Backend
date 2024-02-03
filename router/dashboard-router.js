const express = require('express');
const dashboardRouter = express.Router();

const { getDashboardStatistics } = require('../controller/dashboard-controller');
const verifyToken = require('../middleware/verifyToken');

dashboardRouter.get("/api/dashboard", [verifyToken], getDashboardStatistics);

module.exports = dashboardRouter