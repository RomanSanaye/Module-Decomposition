import http from "node:http";

const PORT = process.env.PORT || 3002;

const messages = [];
const httpServer = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method === "GET" && req.url === "/messages") {
    res.setHeader("Content-Type", "application/json");
    console.log("Sending messages:", messages);
    res.end(JSON.stringify(messages));
  }
  // getting the message from user
  if (req.method === "POST" && req.url === "/messages") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      const message = JSON.parse(body);
      console.log("Received message:", message);

      messages.push(message);

      res.statusCode = 201;
      res.end();
    });
  }
});

httpServer.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`);
});
