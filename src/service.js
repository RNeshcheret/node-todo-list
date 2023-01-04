const Todo = require("./models/todo");

async function createItem(data) {
  const { text } = data;

  const todo = new Todo({
    text,
  });

  await save(todo);

  return todo;
}

function findAll(opts) {
  const { offset, limit, done } = opts;

  const query = Todo.find({ deletedAt: null });
  if (done !== undefined) query.find({ done });
  if (limit) query.limit(limit);
  if (offset) query.skip(offset);

  return query;
}

function getById(id) {
  return Todo.findById(id);
}

async function markAsDoneItem(item) {
  item.done = true;
  await save(item);
}

async function deleteItem(item) {
  item.deletedAt = new Date();
  await save(item);
}

function save(item) {
  item.save();
}

module.exports = { createItem, findAll, getById, markAsDoneItem, deleteItem };
