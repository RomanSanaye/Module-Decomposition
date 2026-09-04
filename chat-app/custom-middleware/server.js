import express from "express";
const app = express();

const PORT = process.env.PORT || 4000;

// first middleware;
function logger(req, res, next) {
  console.log(`${req.method} ${req.url}`);
  next();
}

// second middleware: add message to the request;
function addMessage(req, res, next) {
  req.message("hello from middleware!");
  next(); 
}

// register the middlewares;
app.use(logger);
app.use(addMessage);

// Route: if any get request then: send message to frontend;
app.get("/", (req, res) => {
  res.send(req.message);
});

// run the server;
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
