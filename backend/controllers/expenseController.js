import expenseModel from "../models/expenseModel.js";
import getDateRange from "../utils/dateFilter.js";

//Add Expense
export const addExpense = async (req, res) => {
  const userId = req.user._id; // Get user ID from authenticated user
  const { description, amount, category, date } = req.body;

  try {
    if (!description || !amount || !category || !date) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const newExpense = new expenseModel({
      userId,
      description,
      amount,
      category,
      date: new Date(date),
    });

    await newExpense.save();
    res
      .status(201)
      .json({ success: true, message: "Expense added successfully" });
  } catch (error) {
    console.error("Error adding expense:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

//Get All Expense
export const getAllExpense = async (req, res) => {
  const userId = req.user._id; // Get user ID from authenticated user
  try {
    const expenses = await expenseModel.find({ userId }).sort({ date: -1 });
    res.status(200).json({ success: true, data: expenses });
  } catch (error) {
    console.error("Error fetching expenses:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

//Update an Expense
export const updateExpense = async (req, res) => {
  const userId = req.user._id; // Get user ID from authenticated user
  const { id } = req.params;
  const { description, amount } = req.body;

  try {
    const updatedExpense = await expenseModel.findOneAndUpdate(
      { _id: id, userId },
      { description, amount },
      { new: true },
    );

    if (!updatedExpense) {
      return res
        .status(404)
        .json({ success: false, message: "Expense not found" });
    }

    res.status(200).json({
      success: true,
      message: "Expense updated successfully",
      data: updatedExpense,
    });
  } catch (error) {
    console.error("Error updating expense:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

//Delete an Expense
export const deleteExpense = async (req, res) => {
  try {
    const deletedExpense = await expenseModel.findByIdAndDelete({
      _id: req.params.id,
    });

    if (!deletedExpense) {
      return res
        .status(404)
        .json({ success: false, message: "Expense not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Expense deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting expense:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

//Download the expense data in excel format
export const downloadExpenseExcel = async (req, res) => {
  const userId = req.user._id; // Get user ID from authenticated user
  try {
    const expenses = await expenseModel.find({ userId }).sort({ date: -1 });
    const plainData = expenses.map((expense) => ({
      Description: expense.description,
      Amount: expense.amount,
      Category: expense.category,
      Date: expense.date.toLocaleDateString(), // Format date as YYYY-MM-DD
    }));

    const worksheet = XLSX.utils.json_to_sheet(plainData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "expenseModel");
    XLSX.writeFile(workbook, "expense_details.xlsx");
    res.download("expense_details.xlsx");
  } catch (error) {
    console.error("Error downloading expense data:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

//Get Expense Overview
export const getExpenseOverview = async (req, res) => {
  try {
    const userId = req.user._id; // Get user ID from authenticated user
    const { range = "monthly" } = req.query;
    const { start, end } = getDateRange(range);
    const expense = await expenseModel
      .find({
        userId,
        date: { $gte: start, $lte: end },
      })
      .sort({ date: -1 });

    const totalExpense = expense.reduce((acc, cur) => acc + cur.amount, 0);
    const averageExpense =
      expense.length > 0 ? totalExpense / expense.length : 0;
    const numberOfTransactions = expense.length;

    const recentTransactions = expense.slice(0, 5);

    res.status(200).json({
      success: true,
      data: {
        totalExpense,
        averageExpense,
        numberOfTransactions,
        recentTransactions,
        range,
      },
    });
  } catch (error) {
    console.error("Error fetching expense overview:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
