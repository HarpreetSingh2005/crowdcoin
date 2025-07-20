const express = require("express");
const router = express.Router();
const multer = require("multer"); // ✅ You forgot to import this
const path = require("path"); // ✅ And this too

const Campaign = require("../models/Campaign");

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Folder where images will be saved
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

const upload = multer({ storage });

// ✅ POST /api/campaigns → Save image + data to MongoDB
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const {
      address,
      name,
      description,
      detailedDescription,
      creationDate,
      font,
    } = req.body;

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : "";

    const campaign = new Campaign({
      address,
      name,
      creationDate,
      description,
      detailedDescription,
      imageUrl,
      font,
    });

    await campaign.save();
    res.status(201).json(campaign);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while creating campaign" });
  }
});


// ✅ GET /api/campaigns?address=0x123... → Get details by Ethereum address
router.get("/", async (req, res) => {
  const { address } = req.query;

  console.log("🔍 GET campaign for address:", address);

  if (!address) {
    return res.status(400).json({ message: "Address is required" });
  }

  try {
    const campaign = await Campaign.findOne({ address });

    if (!campaign) {
      console.log("⚠️ No campaign found in MongoDB for address:", address);
      return res.status(404).json({ message: "Campaign not found" });
    }

    res.json({
      description: campaign.description,
      imageUrl: campaign.imageUrl,
      font: campaign.font,
      detailedDescription: campaign.detailedDescription,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ GET /api/campaigns/all → Fetch all campaigns from MongoDB
router.get("/all", async (req, res) => {
  try {
    const campaigns = await Campaign.find({});
    res.json(campaigns);
  } catch (error) {
    console.error("❌ Error fetching all campaigns:", error);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
