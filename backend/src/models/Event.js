const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  sessionId: { type: String, required: true },
  userId: { type: String, required: false },
  page: { type: String, required: true },
  actionType: { type: String, required: true },
  data: { type: Object, required: true },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Event", EventSchema);
