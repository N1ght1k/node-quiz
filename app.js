// require("dotenv").config();
// const express = require("express");
// const MongoClient = require("mongodb").MongoClient;
// const objectId = require("mongodb").ObjectId;
// const cors = require("cors");

// const app = express();
// const jsonParser = express.json();

// const mongoClient = new MongoClient("mongodb://localhost:27017/");

// app.use(express.static(__dirname + "/public"));
// app.use(cors());

// (async () => {
//   try {
//     await mongoClient.connect();
//     app.locals.quizes = mongoClient.db("quizesdb").collection("quizes");
//     app.locals.answers = mongoClient.db("quizesdb").collection("answers");
//     await app.listen(5000);
//     console.log("Сервер ожидает подключения...");
//   } catch (err) {
//     return console.log(err);
//   }
// })();

// app.get("/api/quizes", async (req, res) => {
//   const collection = req.app.locals.quizes;
//   try {
//     const quizes = await collection.find({}).toArray();
//     res.send(quizes);
//   } catch (err) {
//     return console.log(err);
//   }
// });
// app.get("/api/quizes/:id", async (req, res) => {
//   const id = new objectId(req.params.id);
//   const collection = req.app.locals.quizes;
//   try {
//     const quiz = await collection.findOne({ _id: id });
//     res.send(quiz);
//   } catch (err) {
//     return console.log(err);
//   }
// });

// app.post("/api/quizes", jsonParser, async (req, res) => {
//   if (!req.body) return res.sendStatus(400);

//   // const userName = req.body.name;
//   // const userAge = req.body.age;
//   // let user = { name: userName, age: userAge };

//   const collection = req.app.locals.quizes;

//   try {
//     await collection.insertOne(req.body);
//     res.send("success");
//   } catch (err) {
//     return console.log(err);
//   }
// });

// app.post("/api/answer", jsonParser, async (req, res) => {
//   if (!req.body) return res.sendStatus(400);

//   // const userName = req.body.name;
//   // const userAge = req.body.age;
//   // let user = { name: userName, age: userAge };

//   const collection = req.app.locals.answers;

//   try {
//     await collection.insertOne(req.body);
//     res.send("success");
//   } catch (err) {
//     return console.log(err);
//   }
// });

// app.delete("/api/users/:id", async (req, res) => {
//   const id = new objectId(req.params.id);
//   const collection = req.app.locals.collection;
//   try {
//     const result = await collection.findOneAndDelete({ _id: id });
//     const user = result.value;
//     res.send(user);
//   } catch (err) {
//     return console.log(err);
//   }
// });

// app.put("/api/users", jsonParser, async (req, res) => {
//   if (!req.body) return res.sendStatus(400);
//   const id = new objectId(req.body.id);
//   const userName = req.body.name;
//   const userAge = req.body.age;

//   const collection = req.app.locals.collection;
//   try {
//     const result = await collection.findOneAndUpdate(
//       { _id: id },
//       { $set: { age: userAge, name: userName } },
//       { returnDocument: "after" }
//     );
//     const user = result.value;
//     res.send(user);
//   } catch (err) {
//     return console.log(err);
//   }
// });

// // прослушиваем прерывание работы программы (ctrl-c)
// process.on("SIGINT", async () => {
//   await mongoClient.close();
//   console.log("Приложение завершило работу");
//   process.exit();
// });

require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connection = require("./db");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const quizRoutes = require("./routes/quizes");
const answerRoutes = require("./routes/answers");
const resultRoutes = require("./routes/results");

// database connection
connection();

// middlewares
app.use(express.json());
app.use(cors());

// routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/quizes", quizRoutes);
app.use("/api/answers", answerRoutes);
app.use("/api/results", resultRoutes);

const port = process.env.PORT || 8080;
app.listen(port, console.log(`Listening on port ${port}...`));
