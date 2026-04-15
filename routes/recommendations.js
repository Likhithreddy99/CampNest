const express = require("express");
const campService = require("../services/camp.service");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const userProfile = {
      location: "Karnataka",
      interests: ["forest", "trekking", "river"]
    };

    const recommendations = await campService.getRecommendations(userProfile);
    res.json(recommendations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
