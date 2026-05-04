import mongoose from "mongoose";

export const connectDB = async () => {
  const DB = process.env.MONGODB_URL;

  await mongoose.connect(DB).then(() => {
    console.log("Connected to MongoDB - DB Connected");
  });
};
