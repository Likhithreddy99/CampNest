const express = require("express");
const path = require("path");
const session = require("express-session");
const methodOverride = require("method-override");
const passport = require("passport");
const dotenv = require("dotenv");
const fs = require("fs");
const cors = require("cors");
const sequelize = require("./config/database");

dotenv.config();

require("./config/passport")(passport);

const app = express();

sequelize
  .authenticate()
  .then(() => {
    console.log("PostgreSQL connected");
    return sequelize.sync({ alter: true });
  })
  .then(() => console.log("Database synchronized"))
  .catch((err) => console.error("Database connection error:", err));

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

fs.mkdirSync(path.join(__dirname, "public", "uploads"), { recursive: true });

app.use(express.static(path.join(__dirname, "public")));

const SESSION_SECRET = process.env.SESSION_SECRET || "devsecret-change-me";

app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 60 * 24 * 7
    }
  })
);

app.use(passport.initialize());
app.use(passport.session());

const indexRoutes = require("./routes/index");
const authRoutes = require("./routes/auth");
const campRoutes = require("./routes/camps");
const storyRoutes = require("./routes/stories");
const profileRoutes = require("./routes/profile");
const searchRoutes = require("./routes/search");
const chatbotRoutes = require("./routes/chatbot");
const recommendationRoutes = require("./routes/recommendations");

app.use("/api", indexRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/camps", campRoutes);
app.use("/api/stories", storyRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/recommendations", recommendationRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`CampNest server running on http://localhost:${PORT}`);
});
