const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes = require("./routers/authroutes");
const fetchRoutes = require("./routers/routehandlers");
dotenv.config();

const app = express();
app.use(
    cors({
      origin: "*",
    })
  );
// Middleware
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {})
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error(err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/auth", fetchRoutes);

// Error Handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal server error" });
});
app.get("/", (req, res) => {
  res.status(200).send("Hello World");
});
// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
