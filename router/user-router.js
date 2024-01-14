const express = require('express');
const userRouter = express.Router();

const { signUp, signin, updateProfile, addFriend, getAllFriends, searchUsers } = require('../controller/user-controller');
const verifyToken = require('../middleware/verifyToken');

userRouter.post("/api/signup", signUp);
userRouter.post("/api/signin", signin);
userRouter.patch("/api/update-profile", [verifyToken] ,updateProfile);
userRouter.post("/api/add-friend", [verifyToken] , addFriend);
//NOTE - get friends of current logged in user
userRouter.get("/api/get-all-friends", [verifyToken] , getAllFriends);
userRouter.get("/api/search-users", [verifyToken] , searchUsers);

module.exports = userRouter