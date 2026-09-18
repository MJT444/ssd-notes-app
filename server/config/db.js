const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  const mongoURI =
    process.env.MONGODB_URI || "mongodb://localhost:27017/notes_db";

  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("Database Connection Error:", error.message);
    console.error(
      "Set MONGODB_URI in a .env file or export it before starting the server."
    );
    process.exit(1);
  }
};

module.exports = connectDB;
