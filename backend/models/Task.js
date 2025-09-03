const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  category: { type: String, default: "Other" },
  startTime: String,
  endTime: String,
  completed: { type: Boolean, default: false },
  date: { type: String, required: true }, // YYYY-MM-DD
  color: String,
  priority: { type: String, default: "medium" },
  tags: [String],
  alarmTime: String, // HH:MM
  alarmEnabled: { type: Boolean, default: false },
  ringing: { type: Boolean, default: false },
  recurring: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Task", TaskSchema);
