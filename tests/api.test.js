const request = require("supertest");
const app = require("../src/app");

const {
  deleteItem,
  getItemById,
  createItem,
  markAsDone,
  deleteAllItems,
} = require("./helpers");

const URL = "/api/todo";

describe(`/POST ${URL}`, () => {
  it(`should create a new item`, async () => {
    const textInput = "test 123321";
    const { body } = await request(app)
      .post(URL)
      .send({ text: textInput })
      .expect(201);

    expect(body.text).toBe(textInput);
  });

  it(`should return 400 if text was not provided`, async () => {
    await request(app).post(URL).send().expect(400);
  });
});

describe(`/GET ${URL}`, () => {
  beforeAll(async () => {
    await deleteAllItems();
    const [item1, item2, item3, item4] = await Promise.all([
      createItem({ text: "item_1" }),
      createItem({ text: "item_2" }),
      createItem({ text: "item_3" }),
      createItem({ text: "item_4" }),
    ]);

    await markAsDone(item2._id);
    await deleteItem(item3._id);
  });

  it(`should get todo list of non-deleted items`, async () => {
    const { body } = await request(app).get(URL).send().expect(200);
    expect(body.length).toBe(3);
  });
  it(`should limit items`, async () => {
    const { body } = await request(app)
      .get(`${URL}?limit=2`)
      .send()
      .expect(200);
    expect(body.length).toBe(2);
  });
  it(`should filter out Done items`, async () => {
    const { body } = await request(app)
      .get(`${URL}?done=false`)
      .send()
      .expect(200);
    expect(body.length).toBe(2);
  });
});

describe(`/GET ${URL}/:id`, () => {
  it(`should get item by id`, async () => {
    const createdItem = await createItem({ text: "test getById" });
    const { body } = await request(app)
      .get(`${URL}/${createdItem._id}`)
      .send()
      .expect(200);

    expect(body).toMatchObject(createdItem);
  });
});

describe(`/PATCH ${URL}/:id`, () => {
  it(`should mark item as done`, async () => {
    const createdItem = await createItem({ text: "markAsDone" });

    const { body } = await request(app)
      .patch(`${URL}/${createdItem._id}`)
      .send({ done: true })
      .expect(200);

    expect(body).toMatchObject({ ok: true });

    const updatedItem = await getItemById(createdItem._id);
    expect(updatedItem.done).toBe(true);
  });
});

describe(`/DELETE ${URL}/:id`, () => {
  it(`should successfully delete the item`, async () => {
    const createdItem = await createItem({ text: "test delete" });

    const { body } = await request(app)
      .delete(`${URL}/${createdItem._id}`)
      .send()
      .expect(200);

    expect(body).toMatchObject({ ok: true });

    const deletedItem = await getItemById(createdItem._id);
    expect(deletedItem.deletedAt).not.toBeUndefined();
  });
});
