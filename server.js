require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose"); // Fixed typo here
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

const PORT = process.env.PORT || 2000;

// Use only one JSON parsing middleware
app.use(bodyParser.json());

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

// Connect to MongoDB Atlas
mongoose.connect(
  "mongodb+srv://lalitkumar:CalmlyAi@calmly-ai.73zof.mongodb.net/",
  { useNewUrlParser: true, useUnifiedTopology: true }
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected To MongoDB Atlas");
});

app.use("/auth", require("./auth"));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});
