const mongoose = require('mongoose');

const CampSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      default: '',
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    nearbyStays: [
      {
        name: { type: String, trim: true, required: true },
        type: { type: String, trim: true, default: 'Hotel' }, // Hotel / Homestay / Resort
        distanceKm: { type: Number, default: 0, min: 0 },
        priceRange: { type: String, trim: true, default: '' }, // e.g. "₹1,500–₹3,000"
        link: { type: String, trim: true, default: '' },
      },
    ],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Camp', CampSchema);

