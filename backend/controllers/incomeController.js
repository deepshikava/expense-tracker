import incomeModel from "../models/incomeModel.js";
import XLSX from "xlsx";
import getDateRange from "../utils/dateFilter.js";

//Add Income
export const addIncome = async (req, res) => {
  const userId = req.user._id; // Get user ID from authenticated user
  const { description, amount, category, date } = req.body;

  try {
    if (!description || !amount || !category || !date) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const newIncome = new incomeModel({
      userId,
      description,
      amount,
      category,
      date: new Date(date),
    });

    await newIncome.save();
    res
      .status(201)
      .json({ success: true, message: "Income added successfully" });
  } catch (error) {
    console.error("Error adding income:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

//Get All Income
export const getAllIncome = async (req, res) => {
  const userId = req.user._id; // Get user ID from authenticated user
  try {
    const incomes = await incomeModel.find({ userId }).sort({ date: -1 });
    res.status(200).json({ success: true, data: incomes });
  } catch (error) {
    console.error("Error fetching incomes:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

//Update an Income
export const updateIncome = async (req, res) => {
  const userId = req.user._id; // Get user ID from authenticated user
  const { id } = req.params;
  const { description, amount } = req.body;

  try {
    const updatedIncome = await incomeModel.findOneAndUpdate(
      { _id: id, userId },
      { description, amount },
      { new: true },
    );

    if (!updatedIncome) {
      return res
        .status(404)
        .json({ success: false, message: "Income not found" });
    }

    res.status(200).json({
      success: true,
      message: "Income updated successfully",
      data: updatedIncome,
    });
  } catch (error) {
    console.error("Error updating income:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

//Delete an Income
export const deleteIncome = async (req, res) => {
  try {
    const deletedIncome = await incomeModel.findByIdAndDelete({
      _id: req.params.id,
    });

    if (!deletedIncome) {
      return res
        .status(404)
        .json({ success: false, message: "Income not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Income deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting income:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

//To Download the income data in excel format
export const downloadIncomeExcel = async (req, res) => {
  const userId = req.user._id; // Get user ID from authenticated user
  try {
    const incomes = await incomeModel.find({ userId }).sort({ date: -1 });
    const plainData = incomes.map((income) => ({
      Description: income.description,
      Amount: income.amount,
      Category: income.category,
      Date: income.date.toLocaleDateString(), // Format date as YYYY-MM-DD
    }));

    const worksheet = XLSX.utils.json_to_sheet(plainData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "incomeModel");
    XLSX.writeFile(workbook, "income_details.xlsx");
    res.download("income_details.xlsx");
  } catch (error) {
    console.error("Error downloading income data:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

//Get Income Overview
export const getIncomeOverview = async (req, res) => {
  try {
    const userId = req.user._id; // Get user ID from authenticated user
    const { range = "monthly" } = req.query;
    const { start, end } = getDateRange(range);
    const incomes = await incomeModel
      .find({
        userId,
        date: { $gte: start, $lte: end },
      })
      .sort({ date: -1 });

    const totalIncome = incomes.reduce((acc, cur) => acc + cur.amount, 0);
    const averageIncome = incomes.length > 0 ? totalIncome / incomes.length : 0;
    const numberOfTransactions = incomes.length;

    const recentTransactions = incomes.slice(0, 9);

    res.status(200).json({
      success: true,
      data: {
        totalIncome,
        averageIncome,
        numberOfTransactions,
        recentTransactions,
        range,
      },
    });
  } catch (error) {
    console.error("Error fetching income overview:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
