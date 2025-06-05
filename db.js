require('dotenv').config();
const mongoose = require('mongoose');

const ConnectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI).then(() => {
            console.log("Connected to the database successfully")
        })
    } catch (error) {
        console.error("Database connection error:", error)
        process.exit(1)
    }
}

module.exports = ConnectDB;