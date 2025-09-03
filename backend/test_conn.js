// test_conn.js
const mongoose = require("mongoose");
require("dotenv").config();

const MONGO = process.env.MONGO_URI ;
console.log("Trying to connect to:", MONGO);
 
(async () => {
  try {
    await mongoose.connect(MONGO, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000
    });
    console.log("✅ Connected to MongoDB");
    const admin = await mongoose.connection.db.admin().serverStatus();
    console.log("Server status ok. version:", admin.version);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("❌ Connection failed:", err.message);
    console.error(err);
    process.exit(1);
  }
})();
