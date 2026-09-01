// Import necessary modules
import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3002;

const messages = [];
const callbacksForNewMessages = [];

// Send update to clients waiting for new messages
function notifyClients(update) {
  while (callbacksForNewMessages.length > 0) {
    const callback = callbacksForNewMessages.pop();
    callback([update]);
  }
}

// Validate message
function isValidMessage(body) {
  return (
    typeof body.text === "string" &&
    body.text.trim() !== "" &&
    typeof body.clientId === "string" &&
    body.clientId.trim() !== ""
  );
}

// GET messages
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
  if (!isValidMessage(req.body)) {
    res.status(400).send("Expected a client ID and a non-empty text string.");
    return;
  }

  const message = {
    id: messages.length,
    text: req.body.text.trim(),
    clientId: req.body.clientId,
    likes: 0,
    dislikes: 0,
  };

  console.log("Received message:", message);

  messages.push(message);

  notifyClients(message);

  res.status(201).json(message);
});

// POST a reaction
app.post("/messages/:id/reaction", (req, res) => {
  const messageId = Number(req.params.id);
  const reaction = req.body.reaction;

  const message = messages.find((message) => message.id === messageId);

  if (!message) {
    res.status(404).send("Message not found.");
    return;
  }

  if (reaction !== "like" && reaction !== "dislike") {
    res.status(400).send("Reaction must be like or dislike.");
    return;
  }

  if (reaction === "like") {
    message.likes++;
  } else {
    message.dislikes++;
  }

  const update = {
    type: "reaction",
    messageId: message.id,
    likes: message.likes,
    dislikes: message.dislikes,
  };

  notifyClients(update);

  res.json(message);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
