const express = require("express");
const { v4: generateId } = require("uuid");
const database = require("./database");

const app = express();

function requestLogger(req, res, next) {
  res.once("finish", () => {
    const log = [req.method, req.path];
    if (req.body && Object.keys(req.body).length > 0) {
      log.push(JSON.stringify(req.body));
    }
    if (req.query && Object.keys(req.query).length > 0) {
      log.push(JSON.stringify(req.query));
    }
    log.push("->", res.statusCode);
    // eslint-disable-next-line no-console
    console.log(log.join(" "));
  });
  next();
}

app.use(requestLogger);
app.use(require("cors")());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/getData", async (req, res) => {
  const { count, limit } = req.query;
  const todos = database.client.db("todos").collection("todos");
  const response = await todos.find({}).skip(Number(count) * Number(limit)).limit(Number(limit)).toArray();
  res.status(200);
  res.json(response);
});

app.post("/", async (req, res) => {
  const { text } = req.body;

  console.error("in api", text);
  if (typeof text.todoText !== "string" || typeof text.dueDate !== "string") {
    res.status(400);
    res.json({ message: "invalid 'text or duedate' expected string" });
    return;
  }

  const todo = {
    id: generateId(),
    todoText: text.todoText,
    dueDate: text.dueDate,
    completed: false,
  };
  await database.client.db("todos").collection("todos").insertOne(todo);
  res.status(201);
  res.json(todo);
});

app.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;

  if (typeof completed !== "boolean") {
    res.status(400);
    res.json({ message: "invalid 'completed' expected boolean" });
    return;
  }

  await database.client
    .db("todos")
    .collection("todos")
    .updateOne({ id }, { $set: { completed } });
  res.status(200);
  res.end();
});

app.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await database.client.db("todos").collection("todos").deleteOne({ id });
  res.status(203);
  res.end();
});

module.exports = app;
