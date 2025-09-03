const express = require("express");
const router = express.Router();
const Settings = require("../models/Settings");

// GET /api/settings
router.get("/", async (req, res) => {
  try {
    let s = await Settings.findOne({});
    if (!s) {
      s = new Settings({});
      await s.save();
    }
    res.json(s);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// PUT /api/settings
router.put("/", async (req, res) => {
  try {
    const payload = req.body;
    let s = await Settings.findOne({});
    if (!s) {
      s = new Settings(payload);
    } else {
      Object.assign(s, payload);
    }
    await s.save();
    res.json(s);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

module.exports = router;
