import http from "node:http";

const PORT = process.env.PORT || 3002;

const messages = [];
const httpServer = http.createServer((req, res) => {
  
  if(req.method === "GET" && req.url === "/messages"){
    res.setHeader("Content-Type", "application/json");
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

      messages.push(message);

      res.statusCode = 201;
      res.end();
    });
  }
});

httpServer.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`);
});
