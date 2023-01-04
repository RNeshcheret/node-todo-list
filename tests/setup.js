const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");

mongoose.set("strictQuery", true);

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  mongoServer.stop();
  await mongoose.disconnect();
});
