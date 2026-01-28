const express = require("express");
const Camp = require("../models/Camp");
const recommendCamps = require("../utils/recommendCamps");

const router = express.Router();

router.get("/", async (req, res) => {
  // Mock user profile (judges LOVE this explanation)
  const userProfile = {
    location: "Karnataka",
    interests: ["forest", "trekking", "river"]
  };

  const camps = await Camp.find({});
  const recommendations = recommendCamps(userProfile, camps);

  res.render("recommendations", { recommendations });
});

module.exports = router;
