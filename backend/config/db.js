import mongoose from "mongoose";

export const connectDB = async () => {
  const DB = process.env.MONGODB_URI;

  if (!DB) {
    console.error("ERROR: MONGODB_URI environment variable is not set");
    return;
  }

  await mongoose
    .connect(DB)
    .then(() => {
      console.log("Connected to MongoDB - DB Connected");
    })
    .catch((err) => {
      console.error("MongoDB Connection Error:", err.message);
    });
};
