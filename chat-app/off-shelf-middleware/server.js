import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 4001;

// Custom middleware
function logger(req, res, next) {
  console.log(`${req.method} ${req.url}`);
  next();
}

// Off-the-shelf middleware
app.use(cors());

// Register custom middleware
app.use(logger);

// Route
app.get("/", (req, res) => {
  res.send("Hello from Express!");
});

// Run the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
