const express = require("express");
const cors = require("cors");
const multer = require("multer");
const upload = multer();
const app = express();
const PORT = 3000;

const teamRoutes = require("./src/routes/teamRoutes");
const employeeRoutes = require("./src/routes/employeeRoutes");

// Middleware
app.use(cors());

// Handle JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Handle multipart/form-data
app.use(upload.none());

// Parse raw body if needed
app.use((req, res, next) => {
  if (req.body && typeof req.body === "object") {
    req.body = Object.assign({}, req.body);
  }
  next();
});

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, {
    body: req.body,
    contentType: req.headers["content-type"],
  });
  next();
});

// Routes
app.use("/api/teams", teamRoutes);
app.use("/api/employees", employeeRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
