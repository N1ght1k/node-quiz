const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
  header: { name: String, description: String },
  questions: [
    {
      questionNumber: Number,
      questionType: String,
      required: Boolean,
      other: Boolean,
      title: String,
      text: String,
      answers: [String],
      otherText: String,
    },
  ],
});

module.exports = mongoose.model("quiz", quizSchema, "quizes");
