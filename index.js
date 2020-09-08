const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const Todo = require("./model/Todo");
const validateTodoInput = require("./validation");
const mongoose = require("mongoose");
const { mongoURI } = require("./config/keys");
require("dotenv").config({ path: __dirname + "/config/.env" });

const port = process.env.PORT || 3000;
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/static", express.static("public"));

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("Successfully connected to the database.");
  })
  .catch((err) => console.log("Error connecting to the database."));

//Redirect to add page when reached at this route
app.get("/", (req, res) => {
  res.redirect("/add");
});

//Redirect when landed on homepage
app.get("/", (req, res) => {
  res.redirect("/add");
});

//List all the todos added from the mongodb
app.get("/list", (req, res) => {
  Todo.find({})
    .then((todos) => {
      res.render("todoList", {
        todos,
      });
    })
    .catch((err) => {
      res.json("No todo found.");
    });
});

//Add a todo to the database
app.post("/add", (req, res) => {
  const { errors, isValid } = validateTodoInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const newTodo = new Todo({
    name: req.body.name,
    description: req.body.description,
    creator: req.body.creator,
    duration: new Date(Date.now() + req.body.duration * 60 * 1000),
  });
  newTodo
    .save()
    .then((todo) => {
      req.body.name = "";
      req.body.description = "";
      req.body.creator = "";
      req.body.duration = "";
      res.redirect("/add");
    })
    .catch((err) => res.status(400).json({ error: err }));
});

//Load the form when a user wants to add a todo
app.get("/add", (req, res) => {
  res.render("addTodo");
});

//Listen on a particular port
app.listen(port, () => {
  console.log(`Server is up and running on port ${port}`);
});
