const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const noteRoutes = require("./routes/noteRoutes");

const app = express();
const PORT = 5000;

// Connect to MongoDB
connectDB();

// Middleware Integration
app.use(cors()); // Permit cross-origin requests from client port (5173)
app.use(express.json()); // Parse incoming JSON request payloads

// API Routes
app.use("/api/notes", noteRoutes);

// Fallback Route Handler
app.use((req, res) => {
  res.status(404).json({ message: "API Route Route Not Found" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
