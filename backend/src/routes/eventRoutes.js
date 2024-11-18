const express = require("express");
const Event = require("../models/Event");
const sendMessage = require("../kafka/producer");

const router = express.Router();

router.post("/add", async (req, res) => {
  try {
    const event = new Event(req.body);
    await event.save();

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

    const io = req.app.get("io");
    io.emit("updateStatistics", { pageVisits, pageClicks, activeUsers });

    res.status(201).json({ message: "Event added successfully" });
  } catch (err) {
    console.error("Error adding event:", err);
    res.status(500).json({ message: "Failed to add event", error: err });
  }
});

router.get("/statistics", async (req, res) => {
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
