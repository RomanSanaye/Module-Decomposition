// Touch HTML elements:
const messagesContainer = document.getElementById("messages");
const messageInput = document.getElementById("message-input");
const sendButton = document.getElementById("send-button");

let lastMessageId = -1;
let clientId = localStorage.getItem("clientId");
const API_URL = "https://x2fkdg4qtvw2zk6tfpgmud7g.trainees.hosting.cyf.academy";

if (!clientId) {
  clientId = crypto.randomUUID();
  localStorage.setItem("clientId", clientId);
}

// Create reactions area
function createReactionsElement(message) {
  const reactionsElement = document.createElement("div");
  reactionsElement.classList.add("reactions");

  // Like button
  const likeButton = document.createElement("button");
  likeButton.textContent = "👍";

  likeButton.addEventListener("click", () => {
    reactToMessage(message.id, "like");
  });

  // Like count
  const likeElement = document.createElement("span");
  likeElement.classList.add("like-count");
  likeElement.textContent = message.likes > 0 ? ` ${message.likes}` : "";

  // Dislike button
  const dislikeButton = document.createElement("button");
  dislikeButton.textContent = "👎";

  dislikeButton.addEventListener("click", () => {
    reactToMessage(message.id, "dislike");
  });

  // Dislike count
  const dislikeElement = document.createElement("span");
  dislikeElement.classList.add("dislike-count");
  dislikeElement.textContent =
    message.dislikes > 0 ? ` ${message.dislikes}` : "";

  // Put reactions together
  reactionsElement.appendChild(likeButton);
  reactionsElement.appendChild(likeElement);
  reactionsElement.appendChild(dislikeButton);
  reactionsElement.appendChild(dislikeElement);

  return reactionsElement;
}

// Create message element
function createMessageElement(message) {
  const messageElement = document.createElement("div");
  messageElement.id = "message-" + message.id;
  messageElement.classList.add("message");

  // Decide whether message was sent or received
  if (message.clientId === clientId) {
    messageElement.classList.add("sent");
  } else {
    messageElement.classList.add("received");
  }

  // Message text
  const textElement = document.createElement("div");
  textElement.classList.add("message-text");
  textElement.textContent = message.text;

  // Reactions
  const reactionsElement = createReactionsElement(message);

  // Put text and reactions inside message box
  messageElement.appendChild(textElement);
  messageElement.appendChild(reactionsElement);

  return messageElement;
}

// Get messages from server
async function getMessages() {
  const response = await fetch(`${API_URL}/messages?since=${lastMessageId}`);

  const messages = await response.json();

  messages.forEach((message) => {
    if (message.type === "reaction") {
      updateReaction(message);
      return;
    }

    const messageElement = createMessageElement(message);

    messagesContainer.appendChild(messageElement);

    lastMessageId = message.id;
  });

  getMessages();
}

// React to message
async function reactToMessage(messageId, reaction) {
  await fetch(`${API_URL}/messages/${messageId}/reaction`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      reaction: reaction,
    }),
  });
}

// Update reaction: like / dislike
function updateReaction(update) {
  const messageElement = document.getElementById("message-" + update.messageId);

  if (!messageElement) {
    return;
  }

  const likeElement = messageElement.querySelector(".like-count");
  const dislikeElement = messageElement.querySelector(".dislike-count");

  likeElement.textContent = update.likes > 0 ? ` ${update.likes}` : "";
  dislikeElement.textContent = update.dislikes > 0 ? ` ${update.dislikes}` : "";
}

// Send message event
sendButton.addEventListener("click", async () => {
  const text = messageInput.value;

  if (text.trim() === "") {
    return;
  }

  await fetch(`${API_URL}/messages`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: text,
        clientId: clientId,
      }),
    },
  );

  messageInput.value = "";
});

// Load messages when the page opens
getMessages();
