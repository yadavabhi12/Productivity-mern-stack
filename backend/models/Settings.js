const mongoose = require("mongoose");

const SettingsSchema = new mongoose.Schema({
  darkMode: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Settings", SettingsSchema);
