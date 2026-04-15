const express = require("express");
const chatbotService = require("../services/chatbot.service");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const userMessage = req.body.message;
    if (!userMessage) {
      return res.json({ reply: "Please provide a message." });
    }

    const reply = await chatbotService.getReply(userMessage);
    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.json({
      reply: "Something went wrong. Please try again later."
    });
  }
});

module.exports = router;
