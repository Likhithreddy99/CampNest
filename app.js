const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");
const methodOverride = require("method-override");
const passport = require("passport");
const dotenv = require("dotenv");
const fs = require("fs");

// Load environment variables
dotenv.config();

// Passport configuration
require("./config/passport")(passport);

const app = express();

/* ===========================
   DATABASE
=========================== */
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/campnest";

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

/* ===========================
   EXPRESS CONFIG
=========================== */
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

// Ensure uploads directory exists
fs.mkdirSync(path.join(__dirname, "public", "uploads"), { recursive: true });

// Static files
app.use(express.static(path.join(__dirname, "public")));

/* ===========================
   SESSION
=========================== */
const SESSION_SECRET = process.env.SESSION_SECRET || "devsecret-change-me";

app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

/* ===========================
   PASSPORT
=========================== */
app.use(passport.initialize());
app.use(passport.session());

/* ===========================
   FLASH
=========================== */
app.use(flash());

/* ===========================
   GLOBAL TEMPLATE VARIABLES
=========================== */
app.use((req, res, next) => {
  res.locals.currentUser = req.user || null;
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

/* ===========================
   ROUTES
=========================== */
const indexRoutes = require("./routes/index");
const authRoutes = require("./routes/auth");
const campRoutes = require("./routes/camps");
const storyRoutes = require("./routes/stories");
const profileRoutes = require("./routes/profile");
const searchRoutes = require("./routes/search");
const chatbotRoutes = require("./routes/chatbot");

// Main routes
app.use("/", indexRoutes);
app.use("/auth", authRoutes);
app.use("/camps", campRoutes);
app.use("/stories", storyRoutes);
app.use("/profile", profileRoutes);
app.use("/search", searchRoutes);

// AI routes
app.use("/chatbot", chatbotRoutes);
app.use(
  "/recommendations",
  require(path.join(__dirname, "routes", "recommendations.js"))
);

/* ===========================
   404 HANDLER
=========================== */
app.use((req, res) => {
  res.status(404).render("404", {
    title: "Page Not Found - CampNest",
  });
});

/* ===========================
   SERVER
=========================== */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`CampNest server running on http://localhost:${PORT}`);
});
