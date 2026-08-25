// import necessary modules
import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3002;

const messages = [];

// GET all messages
app.get("/messages", (req, res) => {
  console.log("Sending messages:", messages);

  res.json(messages);
});

// POST a new message
app.post("/messages", (req, res) => {
  const message = req.body;

  console.log("Received message:", message);

  messages.push(message);

  res.status(201).json(message);
});

app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`);
});
