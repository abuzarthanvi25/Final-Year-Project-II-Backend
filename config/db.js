//DATABASE CONNECTION
require('dotenv').config();
const mongoose = require("mongoose");

mongoose.connect(process.env.DB_URI?.toString(), {
    useNewUrlParser: true,
    dbName: 'final_year_project_II', // Specify the database name
}).then(async() => {
    console.log("Database Connected Successfully")
}).catch((error) => {
    console.log('Error while connecting to database', error)
})