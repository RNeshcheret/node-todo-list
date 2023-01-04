const express = require("express");

const todoRouter = require("./todo.router");

const router = express.Router();

router.use(todoRouter);

module.exports = router;
