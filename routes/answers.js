const Answer = require("../models/answer");
const router = require("express").Router();

router.post("/", async (req, res) => {
  if (!req.body) return res.sendStatus(400);
  try {
    const answer = new Answer({
      quizId: req.body.quizId,
      answers: req.body.answers,
    });
    await answer.save();
    res.send("success");
  } catch (error) {
    return console.log(error);
  }
});

module.exports = router;
