const express = require("express");
const Event = require("../models/Event");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const pageVisits = await Event.aggregate([
      { $match: { actionType: "visit" } },
      { $group: { _id: "$page", count: { $sum: 1 } } },
    ]);

    const pageClicks = await Event.aggregate([
      { $match: { actionType: "click" } },
      { $group: { _id: "$page", count: { $sum: 1 } } },
    ]);

    const activeUsers = await Event.aggregate([
      { $sort: { timestamp: -1 } },
      { $group: { _id: "$sessionId", page: { $first: "$page" } } },
    ]);

    res.json({ pageVisits, pageClicks, activeUsers });
  } catch (err) {
    console.error("Error fetching statistics:", err);
    res.status(500).json({ message: "Failed to fetch statistics", error: err });
  }
});

module.exports = router;
