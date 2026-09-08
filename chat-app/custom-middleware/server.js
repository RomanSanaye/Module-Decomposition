import express from "express";
const app = express();

const PORT = process.env.PORT || 4000;

// first middleware;
function checkAuth(req, res, next) {
  const isLoggedIn = true;

  if (!isLoggedIn) {
    res.status(401).send("You must be logged in.");
    return;
  }

  next();
}

// second middleware: add message to the request;
function addUser(req, res, next) {
  req.user = {
    name: "Roman",
    role: "trainee",
  };
  next();
}

// register the middlewares;
app.use(checkAuth);
app.use(addUser);

// Route ==> if any get request: give user information to frontend;
app.get("/", (req, res) => {
  res.send(`Hello and welcome ${req.user.name}`);
});

// run the server;
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
