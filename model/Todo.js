const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const TodoSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
    min: 5,
    max: 250,
  },
  creator: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
});

TodoSchema.index({ duration: 1 }, { expireAfterSeconds: 0 });

module.exports = Todo = mongoose.model("todo", TodoSchema);
