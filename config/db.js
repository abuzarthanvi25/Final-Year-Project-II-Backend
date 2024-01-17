//DATABASE CONNECTION
require('dotenv').config();
const mongoose = require("mongoose");

const connectDB = async () => {
    try {
      const conn = await mongoose.connect(process.env.DB_URI.toString(), {
        useNewUrlParser: true,
        dbName: 'final_year_project_II',
    });
      console.log(`Database Connected Successfully: ${conn.modelNames()}`);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  }

module.exports = {connectDB}