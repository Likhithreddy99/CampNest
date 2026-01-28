const express = require("express");
const Camp = require("../models/Camp");

const router = express.Router();

// All Indian States & Union Territories
const INDIAN_LOCATIONS = [
  "andhra pradesh",
  "arunachal pradesh",
  "assam",
  "bihar",
  "chhattisgarh",
  "goa",
  "gujarat",
  "haryana",
  "himachal pradesh",
  "jharkhand",
  "karnataka",
  "kerala",
  "madhya pradesh",
  "maharashtra",
  "manipur",
  "meghalaya",
  "mizoram",
  "nagaland",
  "odisha",
  "punjab",
  "rajasthan",
  "sikkim",
  "tamil nadu",
  "telangana",
  "tripura",
  "uttar pradesh",
  "uttarakhand",
  "west bengal",

  // Union Territories
  "andaman and nicobar",
  "chandigarh",
  "dadra and nagar haveli",
  "daman and diu",
  "delhi",
  "jammu and kashmir",
  "ladakh",
  "lakshadweep",
  "puducherry"
];

router.post("/", async (req, res) => {
  try {
    const msg = req.body.message.toLowerCase();
    let reply = "🤔 I couldn't understand that. Try asking about best camps or safety.";

    // Detect mentioned location
    const foundLocation = INDIAN_LOCATIONS.find(loc =>
      msg.includes(loc)
    );

    // BEST CAMPS QUERY
    if (msg.includes("best")) {
      let query = {};

      if (foundLocation) {
        query.location = new RegExp(foundLocation, "i");
      }

      const camps = await Camp.find(query)
        .sort({ averageRating: -1 })
        .limit(3);

      if (camps.length === 0) {
        reply = foundLocation
          ? `😕 I couldn't find any camps in ${foundLocation.toUpperCase()}. Try a nearby state.`
          : "😕 I couldn't find camps matching your request.";
      } else {
        reply = `⭐ Top camps in ${
          foundLocation ? foundLocation.toUpperCase() : "India"
        }: ${camps.map(c => c.title).join(", ")}`;
      }
    }

    // SAFETY QUERY
    else if (msg.includes("safe") || msg.includes("safety")) {
      reply =
        "✅ Camps with higher ratings, recent reviews, and good accessibility are generally considered safer.";
    }

    // NEARBY / GENERAL QUERY
    else if (msg.includes("near") || msg.includes("nearby")) {
      reply =
        "📍 Popular camping regions include Karnataka, Himachal Pradesh, Uttarakhand, and Kerala.";
    }

    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.json({
      reply: "⚠️ Something went wrong. Please try again later."
    });
  }
});

module.exports = router;
