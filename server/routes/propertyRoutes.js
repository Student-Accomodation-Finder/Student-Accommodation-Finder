const express = require("express");
const router = express.Router();
const Property = require("../models/Property");

// @route   POST /api/properties
router.post("/", async (req, res) => {
  try {
    const { basicInfo, amenities, safety, images, verificationDocuments } = req.body;

    const newProperty = new Property({
      propertyName: basicInfo.propertyName,
      propertyType: basicInfo.propertyType,
      price: basicInfo.price,
      location: basicInfo.location,        
      distance: basicInfo.distance,
      about: basicInfo.about,
      amenities,
      safety,
      images, 
      verificationDocuments
    });

    const savedProperty = await newProperty.save();
    res.status(201).json({ success: true, data: savedProperty });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// @route   GET /api/properties
// @desc    Allows frontend queries like: /api/properties?location=Juja
router.get("/", async (req, res) => {
  try {
    const { location, distance, status } = req.query;
    let queryFilter = {};

    // If an admin or student filters by a specific location or distance, apply it dynamically
    if (location) queryFilter.location = { $regex: location, $options: "i" }; // Case-insensitive text search
    if (distance) queryFilter.distance = distance;
    if (status) queryFilter.status = status;

    const properties = await Property.find(queryFilter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: properties.length, data: properties });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server Error Fetching Listings" });
  }
});

// @route   GET /api/properties/:id
router.get("/:id", async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ success: false, error: "Listing not found" });
    }
    res.status(200).json({ success: true, data: property });
  } catch (error) {
    res.status(400).json({ success: false, error: "Invalid ID format" });
  }
});

// @route   PUT /api/properties/:id
router.put("/:id", async (req, res) => {
  try {
    const { basicInfo, amenities, safety, images, verificationDocuments, status } = req.body;

    // Build an update object mapping the nested React layout to your flat schema
    const updatedData = {};

    // Safely map basic fields if the frontend included 'basicInfo' in the edit submission
    if (basicInfo) {
      if (basicInfo.propertyName) updatedData.propertyName = basicInfo.propertyName;
      if (basicInfo.propertyType) updatedData.propertyType = basicInfo.propertyType;
      if (basicInfo.price)        updatedData.price = basicInfo.price;
      if (basicInfo.location)     updatedData.location = basicInfo.location;         
      if (basicInfo.distance)     updatedData.distance = basicInfo.distance;  
      if (basicInfo.about)      updatedData.about = basicInfo.about;
    }

    // Map other structural parameters directly if present
    if (amenities) updatedData.amenities = amenities;
    if (safety)    updatedData.safety = safety;
    if (images)    updatedData.images = images;
    if (verificationDocuments) updatedData.verificationDocuments = verificationDocuments;
    if (status)    updatedData.status = status; // useful for admin approval mutations

    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      { $set: updatedData },
      { new: true, runValidators: true } // Ensures data matching the new text constraints is validated
    );

    if (!updatedProperty) {
      return res.status(404).json({ success: false, error: "Listing not found" });
    }

    res.status(200).json({ success: true, data: updatedProperty });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// @route   DELETE /api/properties/:id
router.delete("/:id", async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);
    if (!property) {
      return res.status(404).json({ success: false, error: "Listing not found" });
    }
    res.status(200).json({ success: true, message: "Listing deleted safely" });
  } catch (error) {
    res.status(400).json({ success: false, error: "Server Error Deleting Listing" });
  }
});

module.exports = router;
