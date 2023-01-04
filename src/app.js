require("express-async-errors");
const express = require("express");

const NotFoundError = require("./errors/not-found");
const errorHandler = require("./middlewares/error-handler.middleware.js");
const protobuf = require("./middlewares/protobuf.middleware.js");
const apiRouter = require("./routes/api.router");

const app = express();

app.use(express.json());
app.use(protobuf);

app.use("/api", apiRouter);
app.use("*", () => {
  throw new NotFoundError();
});

app.use(errorHandler);

module.exports = app;
