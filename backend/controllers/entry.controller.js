const Entry = require("../models/entry.model");

const mongoose = require("mongoose");

exports.createEntry = async (req, res) => {
  try {
    const { category, type, paymentMethod, date, amount, description } =
      req.body;

    const newEntry = new Entry({
      userId: req.user.id,
      category,
      type,
      paymentMethod,
      date,
      amount,
      description,
    });

    const savedEntry = await newEntry.save();
    res.status(201).json({
      message: "Entry created successfully",
      success: true,
      entryData: savedEntry,
    });
  } catch (err) {
    res.status(401).json({ message: "Error saving entry", error: err.message });
  }
};

module.exports.getAllEntries = async (req, res) => {
  try {
    const userId = req.user.id;
    const entries = await Entry.find({ userId }).sort({ createdAt: -1 });
    res.status(201).json({ success: true, entries });
  } catch (error) {
    res.status(401).json({ message: "Error fetching entries", error });
  }
};

module.exports.getMonthlyIncome = async (req, res) => {
  try {
    const userId = req.user.id;

    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1); // May 1
    const end = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    ); // May 31

    const totalIncome = await Entry.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          type: "income",
          date: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    res.status(201).json({
      success: true,
      totalIncome: totalIncome[0]?.total || 0,
    });
  } catch (error) {
    res.status(401).json({
      message: "Error calculating income",
      error,
    });
  }
};

module.exports.getMonthlyExpense = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get start (1st day of current month) and end (last day of current month)
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    );

    const totalExpense = await Entry.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          type: "expense",
          date: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    res.status(201).json({
      success: true,
      totalExpense: totalExpense[0]?.total || 0,
    });
  } catch (error) {
    res.status(401).json({
      message: "Error calculating expense",
      error,
    });
  }
};
