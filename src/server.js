require("dotenv").config();

const { connectDb } = require("./db/mongo");
const app = require("./app");

const PORT = process.env.PORT || 3000;

async function strat() {
  await connectDb();
  app.listen(PORT, () => console.log(`Server listening on port [${PORT}]`));
}

strat();
