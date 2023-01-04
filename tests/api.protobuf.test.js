const request = require("supertest");
const protobuf = require("protobufjs");
const path = require("path");

const app = require("../src/app");
const Todo = require("../src/models/todo");
const { createItem, deleteAllItems } = require("./helpers");

const URL = "/api/todo";
const CONTENT_TYPE = "application/protobuf";

const protoPath = path.resolve("proto", "todo.proto");

let protobufTypes;

beforeAll(async () => {
  protobufTypes = await protobuf.load(protoPath);
});

describe(`/POST ${URL}; protobuf`, () => {
  afterAll(async () => {
    const items = await Todo.find({});
  });

  it(`should create a new item`, async () => {
    const CreateTodoType = protobufTypes.lookup("CreateTodoRequest");
    const TodoType = protobufTypes.lookup("TodoItem");
    const input = { text: "make protobuf" };

    const encodedInput = CreateTodoType.encode(input).finish();

    const { text } = await request(app)
      .post(URL)
      .send(encodedInput)
      .set("Content-type", `${CONTENT_TYPE}; messageType=CreateTodoRequest`)
      .expect("Content-type", /protobuf/)
      .expect(201);

    const decoded = TodoType.decode(Buffer.from(text));

    expect(decoded.text).toBe(input.text);
  });
});

describe(`/GET ${URL}`, () => {
  beforeAll(async () => {
    await deleteAllItems();
  });

  it(`should return todo list of encoded items`, async () => {
    const [item1, item2, item3] = await Promise.all([
      createItem({ text: "item1" }),
      createItem({ text: "item2" }),
      createItem({ text: "item3" }),
    ]);

    const TodoItemsType = protobufTypes.lookup("TodoItems");

    const { text } = await request(app)
      .get(`${URL}?proto`)
      .send()
      .expect("Content-type", /protobuf/)
      .expect(200);

    const decoded = TodoItemsType.decode(Buffer.from(text));

    expect(decoded.items.length).toBe(3);
  });
});
