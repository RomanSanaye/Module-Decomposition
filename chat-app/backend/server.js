// import necessary modules
import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3002;

const messages = [];
const callbacksForNewMessages = [];

// GET all messages
app.get("/messages", (req, res) => {
  const since = Number(req.query.since);

  console.log("Client asked for messages since:", since);
  const newMessages = messages.filter((message) => message.id > since);
  console.log("Sending messages:", newMessages);

  if (newMessages.length === 0) {
    callbacksForNewMessages.push((value) => res.json(value));
  } else {
    res.json(newMessages);
  }
});

// POST a new message
app.post("/messages", (req, res) => {
  const message = {
    id: messages.length,
    text: req.body.text,
  };

  console.log("Received message:", message);

  messages.push(message);
  while (callbacksForNewMessages.length > 0) {
    const callback = callbacksForNewMessages.pop();
    callback([message]);
  }

  res.status(201).json(message);
});

app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`);
});
