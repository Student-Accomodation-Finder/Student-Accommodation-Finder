const mongoose = require("mongoose");

const PropertySchema = new mongoose.Schema(
  {
    propertyName: {
      type: String,
      required: [true, "Property name is required"],
      trim: true,
    },
    propertyType: {
      type: String,
      enum: ["Bedsitter", "Single Room", "1 Bedroom"],
      required: true,
    },
    price: {
      type: Number,
      required: [true, "Monthly rent price is required"],
    },
    location: {
      type: String,
      required: true,
    },
    distance: {
      type: String,
      enum: ["0.5km", "1.0km", "1.5km", "2.0km"],
      required: [true, "Distance designation is required"],
    },
    about: {
      type: String,
      required: [true, "Detailed physical address is required"],
    },

    amenities: {
      wifi: { type: Boolean, default: false },
      water: { type: Boolean, default: false },
      generator: { type: Boolean, default: false },
      shower: { type: Boolean, default: false },
      laundry: { type: Boolean, default: false },
      kitchenette: { type: Boolean, default: false },
      desk: { type: Boolean, default: false },
      balcony: { type: Boolean, default: false },
    },

    safety: {
      cctv: { type: Boolean, default: false },
      gated: { type: Boolean, default: false },
      guard: { type: Boolean, default: false },
      lighting: { type: Boolean, default: false },
    },

    images: {
      type: [String],
      validate: [v => Array.isArray(v) && v.length >= 3, "Minimum 3 photos required"],
    },

    verificationDocuments: {
      proofOfOwnership: { type: String, required: false }, // URL to cloud storage
      identityDoc: { type: String, required: false },      // URL to cloud storage
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // Set to true once you implement Auth middleware
    },
  },
  { timestamps: true } // Automatically manages createdAt and updatedAt fields
);

module.exports = mongoose.model("Property", PropertySchema);
