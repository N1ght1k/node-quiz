const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
  quizId: String,
  answers: [
    {
      questionNumber: Number,
      answer: [String],
      otherText: String,
    },
  ],
});

module.exports = mongoose.model("answer", answerSchema);
