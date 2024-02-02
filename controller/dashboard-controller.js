require("dotenv").config();
const { default: mongoose } = require("mongoose");
const { courses } = require("../models/course");
const { users } = require("../models/user");

const getDashboardStatistics = async (req, res) => {
    try {
        const { user } = req.user;

        const currentUser = await users.findById(user._id);

        if (!currentUser) {
            return res.status(400).json({
                status: false,
                message: "User not found",
            });
        }

        const query = { members: user._id };

        const totalPersonalCourses = await courses.countDocuments({ ...query, type: "Personal" });
        const totalGroupCourses = await courses.countDocuments({ ...query, type: "Group" });

        const allNotesOfCurrentUserResult = await courses.aggregate([
            {
                $match: {
                    members: new mongoose.Types.ObjectId(user._id),
                },
            },
            {
                $lookup: {
                    from: 'notes',
                    localField: '_id',
                    foreignField: 'course',
                    as: 'notes',
                },
            },
            {
                $unwind: '$notes',
            },
            {
                $count: 'totalNotes',
            },
        ]);

        const allNotesOfCurrentUser = allNotesOfCurrentUserResult.length > 0 ? allNotesOfCurrentUserResult[0].totalNotes : 0;

        const allNotesOfCurrentUserSummarizedResult = await courses.aggregate([
            {
                $match: {
                    members: new mongoose.Types.ObjectId(user._id),
                },
            },
            {
                $lookup: {
                    from: 'notes',
                    localField: '_id',
                    foreignField: 'course',
                    as: 'notes',
                },
            },
            {
                $unwind: '$notes',
            },
            {
                $match: {
                    'notes.is_summarized': true,
                },
            },
            {
                $count: 'totalSummarizedNotes',
            },
        ]);

        const allNotesOfCurrentUserSummarized = allNotesOfCurrentUserSummarizedResult.length > 0 ? allNotesOfCurrentUserSummarizedResult[0].totalSummarizedNotes : 0;

        res.json({
            status: true,
            message: "Dashboard statistics retrieved successfully",
            data: {
                totalPersonalCourses,
                totalGroupCourses,
                allNotesOfCurrentUser,
                allNotesOfCurrentUserSummarized,
            },
        });

    } catch (e) {
        console.error(e);
        return res.status(500).json({
            status: false,
            message: "Internal server error",
        });
    }
};

module.exports = { getDashboardStatistics };

