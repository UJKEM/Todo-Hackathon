const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const Todo = require("./model/Todo");
const validateTodoInput = require("./validation");
const mongoose = require("mongoose");
const { mongoURI } = require("./config/keys");
require("dotenv").config();

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

app.get("/list", (req, res) => {
  Todo.find({})
    .then((todos) => {
      res.render("landing", {
        todos,
      });
    })
    .catch((err) => {
      res.json("No todo found.");
    });
});

app.post("/add", (req, res) => {
  const { errors, isValid } = validateTodoInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const newTodo = new Todo({
    name: req.body.name,
    description: req.body.description,
    creator: req.body.creator,
    duration: req.body.duration,
  });
  newTodo
    .save()
    .then((todo) => {
      res.redirect("/add");
    })
    .catch((err) => res.status(400).json({ error: err }));
});

app.get("/add", (req, res) => {
  res.render("addTodo");
});

app.listen(port, () => {
  console.log(`Server is up and running on port ${port}`);
});
