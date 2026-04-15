const { Camp } = require("../models");
const { Op } = require("sequelize");

const INDIAN_LOCATIONS = [
  "andhra pradesh", "arunachal pradesh", "assam", "bihar", "chhattisgarh", "goa", "gujarat", "haryana", "himachal pradesh", "jharkhand", "karnataka", "kerala", "madhya pradesh", "maharashtra", "manipur", "meghalaya", "mizoram", "nagaland", "odisha", "punjab", "rajasthan", "sikkim", "tamil nadu", "telangana", "tripura", "uttar pradesh", "uttarakhand", "west bengal",
  "andaman and nicobar", "chandigarh", "dadra and nagar haveli", "daman and diu", "delhi", "jammu and kashmir", "ladakh", "lakshadweep", "puducherry"
];

class ChatbotService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
    this.apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";
  }

  async getReply(userMessage) {
    if (this.apiKey && this.apiKey !== "your_gemini_api_key_here") {
      try {
        const response = await fetch(`${this.apiUrl}?key=${this.apiKey}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `You are a helpful and enthusiastic camping assistant for "CampNest", a community platform for campers. 
                Be friendly, concise, and knowledgeable about camping in India.
                If the user asks for camp recommendations, suggest they look for high-rated ones in states like Karnataka, Himachal Pradesh, or Kerala.
                User query: ${userMessage}`
              }]
            }]
          })
        });

        const data = await response.json();
        if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
          return data.candidates[0].content.parts[0].text;
        }
      } catch (err) {
        console.error("Gemini API error:", err);
      }
    }

    return await this.getFallbackReply(userMessage);
  }

  async getFallbackReply(userMessage) {
    const msg = userMessage.toLowerCase();
    const foundLocation = INDIAN_LOCATIONS.find(loc => msg.includes(loc));

    if (msg.includes("best")) {
      let where = {};
      if (foundLocation) {
        where.location = { [Op.iLike]: `%${foundLocation}%` };
      }
      const camps = await Camp.findAll({ 
        where, 
        order: [['averageRating', 'DESC']], 
        limit: 3 
      });

      if (camps.length === 0) {
        return foundLocation
          ? `I couldn't find any camps in ${foundLocation.toUpperCase()}. Try a nearby state.`
          : "I couldn't find camps matching your request.";
      }
      return `Top camps in ${foundLocation ? foundLocation.toUpperCase() : "India"}: ${camps.map(c => c.title).join(", ")}`;
    }

    if (msg.includes("safe") || msg.includes("safety")) {
      return "Camps with higher ratings, recent reviews, and good accessibility are generally considered safer.";
    }

    if (msg.includes("near") || msg.includes("nearby")) {
      return "Popular camping regions include Karnataka, Himachal Pradesh, Uttarakhand, and Kerala.";
    }

    return "I couldn't understand that. Try asking about best camps or safety.";
  }
}

module.exports = new ChatbotService();
