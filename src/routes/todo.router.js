const express = require("express");

const {
  findAllHttp,
  getByIdHttp,
  deleteByIdHttp,
  markAsDoneHttp,
  createItemHttp,
} = require("./todo.controller");

const router = express.Router();

router.get("/todo", findAllHttp);
router.post("/todo", createItemHttp);
router.get("/todo/:id", getByIdHttp);
router.delete("/todo/:id", deleteByIdHttp);
router.patch("/todo/:id", markAsDoneHttp);

module.exports = router;
