// backend/server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const morgan = require("morgan");

const tasksRouter = require("./routes/tasks");
const settingsRouter = require("./routes/settings");
const exportRouter = require("./routes/export");

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/tasks", tasksRouter);
app.use("/api/settings", settingsRouter);
app.use("/api/export", exportRouter);

const PORT = process.env.PORT || 4000;
const MONGO = process.env.MONGO_URI ;

// Helpful: print env at startup for debugging
console.log("Server starting. MONGO_URI:", MONGO ? (MONGO.length > 60 ? MONGO.slice(0,60) + "..." : MONGO) : "<empty>");

mongoose.set("strictQuery", false);

// connect with retry/backoff
const connectWithRetry = async (retries = 5, delay = 2000) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`Mongo connect attempt ${attempt}/${retries}...`);
      await mongoose.connect(MONGO, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000, // short timeout for quicker failures
        socketTimeoutMS: 45000,
        family: 4 // prefer IPv4
      });
      console.log("✅ MongoDB connected");
      // start express only after DB connected
      app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
      });
      return;
    } catch (err) {
      console.error(`Mongo connect failed (attempt ${attempt}):`, err.message);
      if (attempt < retries) {
        console.log(`Retrying in ${delay}ms...`);
        await new Promise((r) => setTimeout(r, delay));
        delay *= 2; // exponential backoff
      } else {
        console.error("All retries failed. Exiting process.");
        console.error(err);
        process.exit(1);
      }
    }
  }
};

connectWithRetry();











