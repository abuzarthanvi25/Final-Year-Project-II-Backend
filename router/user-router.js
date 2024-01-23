const express = require('express');
const userRouter = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const { signUp, signin, updateProfile, addFriend, getAllFriends, searchUsers, getProfileDetails } = require('../controller/user-controller');
const verifyToken = require('../middleware/verifyToken');

userRouter.post("/api/signup", signUp);
userRouter.post("/api/signin", signin);
userRouter.get("/api/get-profile", [verifyToken] ,getProfileDetails);
userRouter.patch("/api/update-profile", [verifyToken, upload.fields([{ name: "profile_picture", maxCount: 1 }])] , updateProfile);
userRouter.post("/api/add-friend", [verifyToken] , addFriend);
//NOTE - get friends of current logged in user
userRouter.get("/api/get-all-friends", [verifyToken] , getAllFriends);
userRouter.get("/api/search-users", [verifyToken] , searchUsers);

module.exports = userRouter