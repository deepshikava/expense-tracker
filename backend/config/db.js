import mongoose from "mongoose";

export const connectDB = async () => {
  await mongoose
    .connect(
      "mongodb+srv://deepshika2407_db_user:K72kGPpH8o8bModT@cluster0.dxct71x.mongodb.net/Expense",
    )
    .then(() => {
      console.log("Connected to MongoDB - DB Connected");
    });
};
