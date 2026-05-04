import mongoose from "mongoose";

export const connectDB = async () => {
  const DB = process.env.MONGODB_URI;

  await mongoose.connect(DB).then(() => {
    console.log("Connected to MongoDB - DB Connected");
  });
};
