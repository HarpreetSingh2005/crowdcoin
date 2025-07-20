const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema({
  address: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  creationDate: { type: String, required: true },
  description: String,
  detailedDescription: String,
  imageUrl: String,
  font: { type: String, default: "'Poppins', sans-serif" },
});

module.exports = mongoose.model("Campaign", campaignSchema);
