require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Job = require("./models/job");

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/jobPortalDB";

app.use(cors({ origin: process.env.CLIENT_URL ? [process.env.CLIENT_URL, "http://localhost:5173"] : true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Job Portal API is running", endpoints: ["GET /api/jobs", "POST /api/jobs", "PUT /api/jobs/:id", "DELETE /api/jobs/:id"] });
});

app.get("/api/jobs", async (req, res) => {
  try {
    const jobs = await Job.find().sort({ _id: 1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/jobs", async (req, res) => {
  try {
    const { name, category, location, type } = req.body;
    if (![name, category, location, type].every((value) => typeof value === "string" && value.trim())) {
      return res.status(400).json({ message: "Name, category, location, and type are required." });
    }
    // The existing project uses numeric job IDs, so assign the next numeric ID.
    const latestJob = await Job.findOne().sort({ _id: -1 }).select("_id");
    const nextId = latestJob ? latestJob._id + 1 : 1;
    const savedJob = await Job.create({ _id: nextId, name: name.trim(), category: category.trim(), location: location.trim(), type: type.trim() });
    res.status(201).json(savedJob);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.put("/api/jobs/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ message: "Invalid job ID." });
    const updatedJob = await Job.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!updatedJob) return res.status(404).json({ message: "Job not found." });
    res.json(updatedJob);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete("/api/jobs/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ message: "Invalid job ID." });
    const deletedJob = await Job.findByIdAndDelete(id);
    if (!deletedJob) return res.status(404).json({ message: "Job not found." });
    res.json({ message: "Job deleted successfully", job: deletedJob });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log("MongoDB Connected Successfully");
    app.listen(PORT, "0.0.0.0", () => console.log(`Server running on port ${PORT}`));
  })
  .catch((error) => {
    console.error("MongoDB Connection Error:", error.message);
    process.exit(1);
  });
