require('dotenv').config();
const mongoose = require('mongoose');

const connection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_URL);
        console.log("Connected to database");
    } catch (error) {
        console.log(">>> Error connect to DB: ", error);
    }
}

module.exports = connection;
