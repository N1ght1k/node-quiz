const Quiz = require("../models/quiz");
const Answer = require("../models/answer");
const router = require("express").Router();
const excelJS = require("exceljs");

router.get("/:id", async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ _id: req.params.id });
    const answers = await Answer.find({ quizId: req.params.id });
    let result = [];
    quiz.questions.forEach((question) => {
      let sample = {
        questionNumber: question.questionNumber,
        questionText: question.title,
        answers: [],
      };
      question.answers.forEach((answer) => {
        sample.answers.push({ answerText: answer, count: 0 });
      });
      if (question.other) {
        sample.answers.push({ answerText: question.otherText, count: 0 });
      }
      result.push(sample);
    });
    answers.forEach((el) => {
      el.answers.forEach((item) => {
        let index = result.findIndex(
          (question) => question.questionNumber === item.questionNumber
        );
        // let index = result.indexOf(searchItem);
        item.answer.forEach((answer) => {
          let searchIndex = result[index].answers.findIndex(
            (answerForCounter) => answerForCounter.answerText === answer
          );
          // let searchIndex = result[index].answers.indexOf(searchAnswer);
          result[index].answers[searchIndex].count++;
          // let searchAnswer = result[index].answers.find(
          //   (answerForCounter) => answerForCounter.answerText === answer
          // );
          // let searchIndex = result[index].answers.indexOf(searchAnswer);
          // result[index].answers[searchIndex].count++;
        });
      });
    });
    res.send({ sum: answers.length, result });
  } catch (error) {
    return console.log(error);
  }
});

router.get("/downloadExcel/:id", async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ _id: req.params.id });
    const answers = await Answer.find({ quizId: req.params.id });
    let headers = [];
    let results = [];
    quiz.questions.forEach((q) => {
      if (q.questionType === "single") {
        headers.push({
          header: q.title,
          key: `q${q.questionNumber}`,
          width: 10,
          type: "single",
          number: q.questionNumber,
        });
        if (q.other) {
          headers.push({
            header: `${q.title} X ${q.otherText}`,
            key: `q${q.questionNumber}_other`,
            width: 10,
            type: "single_other",
            number: q.questionNumber,
          });
        }
      }
      if (q.questionType === "multiple") {
        q.answers.forEach((answer, index) => {
          headers.push({
            header: `${q.title} X ${answer}`,
            key: `q${q.questionNumber}_a${index + 1}`,
            width: 10,
            type: "multiple",
            answer: answer,
            number: q.questionNumber,
          });
        });
        if (q.other) {
          headers.push({
            header: `${q.title} X ${q.otherText}`,
            key: `q${q.questionNumber}_other`,
            width: 10,
            type: "multiple",
            answer: q.otherText,
            number: q.questionNumber,
          });
          headers.push({
            header: `${q.title} X ${q.otherText}`,
            key: `q${q.questionNumber}_other_text`,
            width: 10,
            type: "multiple_other",
            number: q.questionNumber,
          });
        }
      }
    });
    answers.forEach((el) => {
      let rowModel = {};
      headers.forEach((header) => {
        if (header.type === "single") {
          let answer = el.answers.find(
            (item) => item.questionNumber === header.number
          ).answer[0];
          rowModel[header.key] = answer;
        }
        if (header.type === "single_other") {
          let answer = el.answers.find(
            (item) => item.questionNumber === header.number
          ).otherText;
          rowModel[header.key] = answer;
        }
        if (header.type === "multiple") {
          let answer = el.answers.find(
            (item) => item.questionNumber === header.number
          );
          if (answer.answer.includes(header.answer)) {
            rowModel[header.key] = "Да";
          } else {
            rowModel[header.key] = "Нет";
          }
        }
        if (header.type === "multiple_other") {
          let answer = el.answers.find(
            (item) => item.questionNumber === header.number
          ).otherText;
          rowModel[header.key] = answer;
        }
      });

      results.push(rowModel);
    });

    // let result = [];
    // quiz.questions.forEach((question) => {
    //   let sample = {
    //     questionNumber: question.questionNumber,
    //     questionText: question.title,
    //     answers: [],
    //   };
    //   question.answers.forEach((answer) => {
    //     sample.answers.push({ answerText: answer, count: 0 });
    //   });
    //   if (question.other) {
    //     sample.answers.push({ answerText: question.otherText, count: 0 });
    //   }
    //   result.push(sample);
    // });
    // answers.forEach((el) => {
    //   el.answers.forEach((item) => {
    //     let index = result.findIndex(
    //       (question) => question.questionNumber === item.questionNumber
    //     );
    //     // let index = result.indexOf(searchItem);
    //     item.answer.forEach((answer) => {
    //       let searchIndex = result[index].answers.findIndex(
    //         (answerForCounter) => answerForCounter.answerText === answer
    //       );
    //       // let searchIndex = result[index].answers.indexOf(searchAnswer);
    //       result[index].answers[searchIndex].count++;
    //       // let searchAnswer = result[index].answers.find(
    //       //   (answerForCounter) => answerForCounter.answerText === answer
    //       // );
    //       // let searchIndex = result[index].answers.indexOf(searchAnswer);
    //       // result[index].answers[searchIndex].count++;
    //     });
    //   });
    // });
    // res.send(headers);

    const workbook = new excelJS.Workbook(); // Create a new workbook
    const worksheet = workbook.addWorksheet("Результат"); // New Worksheet
    const path = "./files"; // Path to download excel
    let columns = [];
    columns.push({ header: "Номер", key: "s_no", width: 10 });
    headers.forEach((el) => {
      columns.push({
        header: el.header,
        key: el.key,
        width: el.width,
      });
    });
    worksheet.columns = columns;
    let counter = 1;
    results.forEach((row) => {
      row.s_no = counter;
      worksheet.addRow(row); // Add data in worksheet
      counter++;
    });
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
    });
    const data = await workbook.xlsx
      .writeFile(`${path}/results.xlsx`)
      .then(() => {
        // res.send({
        //   status: "success",
        //   message: "file successfully downloaded",
        //   path: `${path}/results.xlsx`,
        // });
        const file = `${path}/results.xlsx`;
        res.download(file); // Set disposition and send it.
      });

    // res.send(results);
  } catch (error) {
    return console.log(error);
  }
});

module.exports = router;
