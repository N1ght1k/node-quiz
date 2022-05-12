const Quiz = require("../models/quiz");
const Answer = require("../models/answer");
const router = require("express").Router();

router.get("/", async (req, res) => {
  try {
    const quizes = await Quiz.find();
    let data = [];
    quizes.forEach((el) => {
      data.push({ id: el._id, name: el.header.name });
    });
    res.send(data);
  } catch (error) {
    return console.log(error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ _id: req.params.id });
    res.send(quiz);
  } catch (error) {
    return console.log(error);
  }
});

router.post("/", async (req, res) => {
  if (!req.body) return res.sendStatus(400);
  try {
    const quiz = new Quiz({
      header: req.body.header,
      questions: req.body.questions,
    });
    await quiz.save();
    res.send("success");
  } catch (error) {
    return console.log(error);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Quiz.deleteOne({ _id: req.params.id });
    await Answer.deleteMany({ quizId: req.params.id });
    res.status(204).send();
  } catch (error) {
    res.status(404);
    res.send({ error: "Quiz doesn't exist!" });
    return console.log(error);
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ _id: req.params.id });
    if (req.body.header) {
      quiz.header = req.body.header;
    }

    if (req.body.questions) {
      quiz.questions = req.body.questions;
    }

    await quiz.save();
    res.send("success");
  } catch (error) {
    res.status(404);
    res.send({ error: "Quiz doesn't exist!" });
    return console.log(error);
  }
});

module.exports = router;
