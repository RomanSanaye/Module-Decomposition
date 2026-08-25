// touch html elements:
const messagesContainer = document.getElementById("messages");
const messageInput = document.getElementById("message-input");
const sendButton = document.getElementById("send-button");

// Get message from server;
async function getMessages() {
  const response = await fetch(
    "https://x2fkdg4qtvw2zk6tfpgmud7g.trainees.hosting.cyf.academy/messages",
  );
  const messages = await response.json();

  messagesContainer.innerHTML = "";

  messages.forEach((message) => {
    const messageElement = document.createElement("p");
    messageElement.textContent = message.text;

    messagesContainer.appendChild(messageElement);
  });
}

// Send message event:
sendButton.addEventListener("click", async () => {
  const text = messageInput.value;

  if (text.trim() === "") {
    return;
  }

  await fetch(
    "https://x2fkdg4qtvw2zk6tfpgmud7g.trainees.hosting.cyf.academy/messages",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: text }),
    },
  );

  messageInput.value = "";

  await getMessages();
});

// Load messages when the page opens
getMessages();

// Ask the server for messages every 2 seconds
setInterval(getMessages, 2000);
