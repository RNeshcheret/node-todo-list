const request = require("supertest");
const app = require("../src/app");

const Todo = require("../src/models/todo");

const URL = "/api/todo";

const deleteAllItems = async () => {
  await Todo.deleteMany({});
};

const createItem = async (data) => {
  const { body } = await request(app).post(URL).send(data).expect(201);
  return body;
};

const markAsDone = async (id) => {
  const response = await request(app).patch(`${URL}/${id}`).send().expect(200);
  return response.body;
};
const deleteItem = async (id) => {
  const response = await request(app).delete(`${URL}/${id}`).send().expect(200);
  return response.body;
};

const getItemById = async (id) => {
  const response = await request(app).get(`${URL}/${id}`).send().expect(200);
  return response.body;
};

module.exports = {
  deleteItem,
  createItem,
  markAsDone,
  getItemById,
  deleteAllItems,
};
