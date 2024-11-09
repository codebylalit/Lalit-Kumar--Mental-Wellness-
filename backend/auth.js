require("dotenv").config();
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./model");
const Chat = require("./chat"); // MongoDB model


const jwtSecret = process.env.JWT_SECRET;
const router = express.Router();

// Check if jwtSecret is defined
if (!jwtSecret) {
  console.error("JWT secret is missing from environment variables");
  process.exit(1); // Stop the server if secret is missing
}

// Middleware to authenticate the user
const authenticateJWT = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    req.user = user; // Attach user info to the request object
    next();
  });
};

// Sign Up Route
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error creating user" });
  }
});

// Sign In Route
router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Signin attempt for:", email);

    const user = await User.findOne({ email });
    if (!user) {
      console.error("User not found");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.error("Password is invalid");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      jwtSecret,
      {
        expiresIn: "1h",
      }
    );
    res.json({ token });
  } catch (error) {
    console.error("Error signing in:", error);
    res.status(500).json({ error: "Error signing in" });
  }
});

// Get Username Route
router.get("/username", authenticateJWT, (req, res) => {
  res.json({ username: req.user.username });
});


// Save chat history
router.post("/saveChat", async (req, res) => {
  const { userId, chatHistory } = req.body;
  try {
    const chat = new Chat({
      userId,
      messages: chatHistory,
    });
    await chat.save();
    res.status(200).json({ message: "Chat saved successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to save chat history" });
  }
});

// Get chat history
// backend/routes/chat.js
router.get("/getChat/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const chat = await Chat.findOne({ userId });
    if (chat) {
      res.status(200).json(chat.messages);
    } else {
      res.status(404).json({ message: "Chat not found." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving chat." });
  }
});



module.exports = router;
