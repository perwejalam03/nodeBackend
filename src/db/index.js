import mongoose from "mongoose";

import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.LOCAL_SERVER}/${DB_NAME}`
    );
    console.log(
      `\nConnected to MongoDB: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("MongoDB connection failed:", error);
    process.exit(1);
  }
};
export default connectDB;
