const mongoose = require("mongoose");

const RoommateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    school: {
      type: String,
      required: [true, "School is required"],
      trim: true,
    },
    subtitle: {
      type: String,
      trim: true, // e.g. "IT Student · Non-smoker"
    },
    matchPercent: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    tags: {
      type: [String],
      default: [], // e.g. ["Studying Engineering", "Non-smoker"]
    },

    gender: {
      type: String,
      enum: ["male", "female", "other", "prefer not to say"],
      required: false,
    },

    budget: {
      type: Number,
      required: false,
    },

    nearCampus: {
      type: Boolean,
      default: false,
    },

    highlights: {
      type: [String],
      default: [], 
    },

    quote: {
      type: String,
      trim: true,
    },

    photoUrl: {
      type: String,
      required: false,
    },

    verified: {
      type: Boolean,
      default: false,
    },

    featured: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, 
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Roommate", RoommateSchema);
