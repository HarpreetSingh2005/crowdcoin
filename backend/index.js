require("dotenv").config();
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const campaignRoutes = require("./routes/campaignRoutes");

const app = express();
app.use(cors()); 
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use("/api/campaigns", campaignRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error(err));

const PORT = process.env.PORT || 5000;
app.get("/", (req, res) => {
  res.send("🚀 Backend is up and running!");
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));