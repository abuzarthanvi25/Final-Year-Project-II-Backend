const { users } = require("../models/user");
require("dotenv").config();
const bcrypt = require("bcryptjs");
const { generateToken } = require('../utils/jwt-helpers');

const signUp = async (req, res) => {
  try {
    const requiredFields = ['full_name', 'email', 'password'];

    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).send({
          status: false,
          message: `${field.replace('_', ' ').capitalize()} is required`,
        });
      }
    }

    const emailAlreadyExists = await users.findOne({ email: req.body.email });
    
    if (emailAlreadyExists) {
      return res.status(400).send({
        status: false,
        message: "This email already exists",
      });
    }

    const user = new users({
      full_name: req.body?.full_name,
      email: req.body?.email,
      password: req.body.password,
      phone_number: null,
      bio: null,
      profile_picture: null
    });

    const saltPassword = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, saltPassword);

    await user.save();

    return res.status(200).send({
      status: true,
      message: "User Registered statusfully",
      data: {user},
    });
  } catch (e) {
    console.error(e);
    return res.status(400).send({
      status: false,
      message: "Something went wrong",
    });
  }
};

const signin = async (req, res) => {
  try {
    const requiredFields = ['email', 'password'];

    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).send({
          status: false,
          message: `${field.replace('_', ' ').capitalize()} is required`,
        });
      }
    }

    const checkUser = await users.findOne({ email: req.body.email });

    if (!checkUser || !(await bcrypt.compare(req.body.password, checkUser.password))) {
      return res.status(400).send({
        status: false,
        message: "Credentials Error",
        data: null
      });
    }

    const token = generateToken(checkUser);

    return res.status(200).send({
      status: true,
      message: "User Login statusfully",
      data: {user: checkUser, token},
    });
  } catch (e) {
    console.error(e);
    return res.status(400).send({
      status: false,
      message: "Something went wrong",
      data: null
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const user = await users.findOne({ _id: req.query.id });

    if(!user){
      return res.status(400).send({
        status: false,
        message: "User not found",
      });
    }

    const validFields = ['full_name', 'email', 'phone_number', 'bio', 'profile_picture'];

    const unexpectedKeys = Object.keys(req.body).filter(key => !validFields.includes(key));

    if (unexpectedKeys.length > 0) {
      return res.status(400).send({
        status: false,
        message: `Unexpected keys: ${unexpectedKeys.join(', ')}`,
      });
    }

    const { full_name, phone_number, bio, profile_picture } = req.body;

    await users.findOneAndUpdate(
      {
        _id: user?._id,
      },
      { full_name, phone_number, bio, profile_picture }
    );

    return res.status(200).send({
      status: true,
      message: "User Profile Updated statusfuly",
    });
  } catch (error) {
    console.error(error);
    return res.status(400).send({
      status: false,
      message: "Something went wrong",
      error: error.toString()
    });
  }
}

const addFriend = async (req, res) => {
  try {
    const { friend_id } = req.query;
    const { user } = req.body;

    const currentUser = await users.findOne({ _id: user?._id });

    const friendToAdd = await users.findById({ _id: friend_id });

    if (!friendToAdd) {
      return res.status(404).json({ error: 'Friend not found' });
    }

    if (currentUser.friends.includes(friendToAdd._id)) {
      return res.status(400).json({
        status: false,
        message: 'Friend is already in your friends list',
        data: null
      });
    }

    currentUser.friends.push(friendToAdd._id);
    await currentUser.save();

    friendToAdd.friends.push(currentUser._id);
    await friendToAdd.save();

    res.status(200).json({
      status: true,
      message: 'Friend added successfully',
      data: { friend: friendToAdd }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: 'Error adding friend',
      error: error.toString()
    });
  }
};

const getAllFriends = async (req, res) => {
  try {
    const { user: userFromBody } = req.body;

    const user = await users.findById({ _id: userFromBody?._id});

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
        // Populate the friends data
        const friends = await users.find({ _id: { $in: user.friends } });

        res.status(200).json({
            status: true,
            data: { 
              user,
              friends
             },
        });

    res.status(200).json({
      status: true,
      data: { user },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: 'Error fetching friends',
      error: error.toString(),
    });
  }
}

String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

module.exports = { signUp, signin, updateProfile, addFriend, getAllFriends };
