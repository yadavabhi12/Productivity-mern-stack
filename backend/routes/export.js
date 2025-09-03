const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const Settings = require("../models/Settings");

// GET /api/export
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find({}).lean();
    const settings = await (Settings.findOne({}) || {});
    const payload = { tasks, settings, exportedAt: new Date().toISOString() };
    res.setHeader("Content-Disposition", `attachment; filename="productivity-export-${new Date().toISOString().split("T")[0]}.json"`);
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify(payload, null, 2));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
