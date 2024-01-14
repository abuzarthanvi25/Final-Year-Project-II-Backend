const jwt = require("jsonwebtoken");

const generateToken = (user) => {
    return jwt.sign(
      { _id: user._id, email: user.email },
      process.env.TOKEN_KEY,
      {
        expiresIn: "30d",
      }
    );
  };

module.exports = {generateToken}