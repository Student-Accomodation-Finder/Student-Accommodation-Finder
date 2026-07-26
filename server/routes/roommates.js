const express = require("express");
const router = express.Router();
const Roommate = require("../models/Roommate");

// @route   POST /api/roommates
router.post("/", async (req, res) => {
  try {
    const {
      name,
      school,
      subtitle,
      matchPercent,
      tags,
      gender,
      budget,
      nearCampus,
      highlights,
      quote,
      photoUrl,
      verified,
      featured,
    } = req.body;

    const newRoommate = new Roommate({
      name,
      school,
      subtitle,
      matchPercent,
      tags,
      gender,
      budget,
      nearCampus,
      highlights,
      quote,
      photoUrl,
      verified,
      featured,
    });

    const savedRoommate = await newRoommate.save();
    res.status(201).json({ success: true, data: savedRoommate });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// @route   GET /api/roommates
// @desc    Allows frontend queries like: /api/roommates?school=JKUAT&featured=true&status=approved
router.get("/", async (req, res) => {
  try {
    const { school, featured, verified, status } = req.query;
    let queryFilter = {};

    // If a student filters by school or featured status, apply it dynamically
    if (school) queryFilter.school = { $regex: school, $options: "i" }; // Case-insensitive text search
    if (featured) queryFilter.featured = featured === "true";
    if (verified) queryFilter.verified = verified === "true";
    if (status) queryFilter.status = status;

    const roommates = await Roommate.find(queryFilter).sort({ matchPercent: -1, createdAt: -1 });
    res.status(200).json({ success: true, count: roommates.length, data: roommates });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server Error Fetching Roommates" });
  }
});

// @route   GET /api/roommates/:id
router.get("/:id", async (req, res) => {
  try {
    const roommate = await Roommate.findById(req.params.id);
    if (!roommate) {
      return res.status(404).json({ success: false, error: "Roommate not found" });
    }
    res.status(200).json({ success: true, data: roommate });
  } catch (error) {
    res.status(400).json({ success: false, error: "Invalid ID format" });
  }
});

// @route   PUT /api/roommates/:id
router.put("/:id", async (req, res) => {
  try {
    const {
      name,
      school,
      subtitle,
      matchPercent,
      tags,
      gender,
      budget,
      nearCampus,
      highlights,
      quote,
      photoUrl,
      verified,
      featured,
      status,
    } = req.body;

    // Build an update object, only including fields the frontend actually sent
    const updatedData = {};
    if (name !== undefined) updatedData.name = name;
    if (school !== undefined) updatedData.school = school;
    if (subtitle !== undefined) updatedData.subtitle = subtitle;
    if (matchPercent !== undefined) updatedData.matchPercent = matchPercent;
    if (tags !== undefined) updatedData.tags = tags;
    if (gender !== undefined) updatedData.gender = gender;
    if (budget !== undefined) updatedData.budget = budget;
    if (nearCampus !== undefined) updatedData.nearCampus = nearCampus;
    if (highlights !== undefined) updatedData.highlights = highlights;
    if (quote !== undefined) updatedData.quote = quote;
    if (photoUrl !== undefined) updatedData.photoUrl = photoUrl;
    if (verified !== undefined) updatedData.verified = verified;
    if (featured !== undefined) updatedData.featured = featured;
    if (status !== undefined) updatedData.status = status; // useful for admin approval mutations

    const updatedRoommate = await Roommate.findByIdAndUpdate(
      req.params.id,
      { $set: updatedData },
      { new: true, runValidators: true } // Ensures data matching the new constraints is validated
    );

    if (!updatedRoommate) {
      return res.status(404).json({ success: false, error: "Roommate not found" });
    }

    res.status(200).json({ success: true, data: updatedRoommate });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// @route   DELETE /api/roommates/:id
router.delete("/:id", async (req, res) => {
  try {
    const roommate = await Roommate.findByIdAndDelete(req.params.id);
    if (!roommate) {
      return res.status(404).json({ success: false, error: "Roommate not found" });
    }
    res.status(200).json({ success: true, message: "Roommate deleted safely" });
  } catch (error) {
    res.status(400).json({ success: false, error: "Server Error Deleting Roommate" });
  }
});

module.exports = router;
