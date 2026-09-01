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
  // Validate the request body
  if (
    typeof req.body.text !== "string" ||
    req.body.text.trim() === "" ||
    typeof req.body.user !== "string" ||
    req.body.user.trim() === ""
  ) {
    res.status(400).send("Expected a username and a non-empty text string.");
    return;
  }

  const message = {
    id: messages.length,
    text: req.body.text.trim(),
    likes: 0,
    dislikes: 0,
  };

  console.log("Received message:", message);

  messages.push(message);
  while (callbacksForNewMessages.length > 0) {
    const callback = callbacksForNewMessages.pop();
    callback([message]);
  }

  res.status(201).json(message);
});

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
    text: req.body.text,
    user: req.body.user,
    likes: message.likes,
    dislikes: message.dislikes,
  };

  while (callbacksForNewMessages.length > 0) {
    const callback = callbacksForNewMessages.pop();
    callback([update]);
  }

  res.json(message);
});

app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`);
});
