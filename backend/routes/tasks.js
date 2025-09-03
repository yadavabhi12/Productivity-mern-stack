
const express = require("express");
const router = express.Router();
const Task = require("../models/Task");

// GET /api/tasks?date=YYYY-MM-DD
router.get("/", async (req, res) => {
  try {
    const date = req.query.date;
    const filter = {};
    if (date) filter.date = date;
    const tasks = await Task.find(filter).sort({ date: 1, startTime: 1, createdAt: 1 });
    res.json(tasks);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});


// GET /api/tasks/:id
router.get("/:id", async (req, res) => {
  try {
    const t = await Task.findById(req.params.id);
    if (!t) return res.status(404).json({ error: "Not found" });
    res.json(t);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/tasks
router.post("/", async (req, res) => {
  try {
    const data = req.body;
    const t = new Task(data);
    await t.save();
    res.status(201).json(t);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// PUT /api/tasks/:id
router.put("/:id", async (req, res) => {
  try {
    const data = req.body;
    const t = await Task.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!t) return res.status(404).json({ error: "Not found" });
    res.json(t);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// DELETE /api/tasks/:id
router.delete("/:id", async (req, res) => {
  try {
    const t = await Task.findByIdAndDelete(req.params.id);
    if (!t) return res.status(404).json({ error: "Not found" });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
