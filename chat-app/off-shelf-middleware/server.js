import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 4001;

// Custom middleware
function checkAuth(req, res, next) {
  const isLoggedIn = true;

  if (!isLoggedIn) {
    res.status(401).send("You must be logged in.");
    return;
  }

  next();
}

// Off-the-shelf middleware
app.use(cors());

// Register custom middleware
app.use(checkAuth);

// Route
app.get("/", (req, res) => {
  res.send("Welcome !");
});

// Run the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
