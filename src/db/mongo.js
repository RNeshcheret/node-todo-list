const mongoose = require("mongoose");

mongoose.set("strictQuery", true);

mongoose.connection.once("open", () => console.log(`MongoDb connected`));
mongoose.connection.once("close", () => console.log(`MongoDb disconnected`));

mongoose.connection.on("error", (err) => console.error(`MongoDb Error:`, err));

async function connectDb() {
  const { MONGO_URI } = process.env;
  if (!MONGO_URI) throw new Error(`MONGO_URI is not defined`);
  await mongoose.connect(MONGO_URI, { dbName: "Todo" });
}

async function disconnectDb() {
  await mongoose.disconnect();
}

module.exports = { connectDb, disconnectDb };
