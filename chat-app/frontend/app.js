// touch html elements:
const messagesContainer = document.getElementById("messages");
const messageInput = document.getElementById("message-input");
const sendButton = document.getElementById("send-button");

// Get message from server;
async function getMessages() {
  const response = await fetch("http://localhost:3002/messages");
  const messages = await response.json();

  messagesContainer.innerHTML = "";

  messages.forEach((message) => {
    const messageElement = document.createElement("p");
    messageElement.textContent = message.text;

    messagesContainer.appendChild(messageElement);
  });
}